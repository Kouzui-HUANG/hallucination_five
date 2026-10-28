// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { SITE_ORIGIN, BASE_PATH, SITE_URL } from './site.config.mjs';
import { SITE_META, SECTIONS, readContentIndex } from './src/data/llms-pages.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── llms.txt / llms-full.txt / llms-ctx.txt 自動生成（沿用圖鑑的 integration）────

/** 從建置後的 HTML 提取純文字（保留換行語意） */
function stripHtml(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = mainMatch ? mainMatch[1] : bodyMatch ? bodyMatch[1] : html;

  return content
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/(\n[ \t]*){3,}/g, '\n\n')
    .trim();
}

/** 將 path 轉成 dist 內的 HTML 檔路徑（dist 內不含 base） */
function pathToHtml(distDir, pagePath) {
  if (pagePath === '/') return join(distDir, 'index.html');
  return join(distDir, pagePath.replace(/^\//, ''), 'index.html');
}

function llmsTxtIntegration() {
  return {
    name: 'llms-txt',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const allPages = SECTIONS.flatMap((s) => s.pages);

        // 1. llms.txt（目錄）
        let llmsTxt = `# ${SITE_META.name}\n\n> ${SITE_META.description}\n\n`;
        for (const section of SECTIONS) {
          llmsTxt += `## ${section.heading}\n\n`;
          for (const page of section.pages) {
            llmsTxt += `- [${page.title}](${SITE_META.url}${page.path}): ${page.note}\n`;
          }
          llmsTxt += '\n';
        }
        writeFileSync(join(distDir, 'llms.txt'), llmsTxt.trimEnd() + '\n', 'utf-8');

        // 2. llms-full.txt（全文，optional 頁不進）
        let llmsFullTxt = `# ${SITE_META.name}\n\n> ${SITE_META.description}\n\n---\n\n`;
        let count = 0;
        for (const page of allPages) {
          if (page.optional) continue;
          const htmlPath = pathToHtml(distDir, page.path);
          if (!existsSync(htmlPath)) continue;
          const text = stripHtml(readFileSync(htmlPath, 'utf-8'));
          llmsFullTxt += `## ${page.title}\n\nURL: ${SITE_META.url}${page.path}\n\n${text}\n\n---\n\n`;
          count++;
        }
        writeFileSync(join(distDir, 'llms-full.txt'), llmsFullTxt.trimEnd() + '\n', 'utf-8');

        // 3. llms-ctx.txt（XML，CDATA 包覆）
        let llmsCtxTxt = '<documents>\n';
        let i = 1;
        for (const page of allPages) {
          if (page.optional) continue;
          const htmlPath = pathToHtml(distDir, page.path);
          if (!existsSync(htmlPath)) continue;
          const text = stripHtml(readFileSync(htmlPath, 'utf-8'));
          const safeText = text.replace(/]]>/g, ']]]]><![CDATA[>');
          llmsCtxTxt +=
            `<document index="${i}">\n` +
            `<source>${SITE_META.url}${page.path}</source>\n` +
            `<document_content>\n<![CDATA[\n${safeText}\n]]>\n</document_content>\n` +
            `</document>\n`;
          i++;
        }
        llmsCtxTxt += '</documents>\n';
        writeFileSync(join(distDir, 'llms-ctx.txt'), llmsCtxTxt, 'utf-8');

        console.log(`\x1b[32m✓\x1b[0m llms.txt / llms-full.txt / llms-ctx.txt 已生成（全文 ${count} 頁）`);
      },
    },
  };
}

// ── Sitemap <lastmod> 對照表 ─────────────────────────────────────────────
// 規則：作品頁用 releasedAt；創辦人頁用 updatedAt；作品總覽與首頁用最新日；
// 其他頁面用對應 .astro 檔的 git last-commit 日（沒有 git 歷史時退回 mtime）

const STATIC_PAGES = [
  ['/services/', 'src/pages/services/index.astro'],
  ['/about/', 'src/pages/about.astro'],
  ['/contact/', 'src/pages/contact.astro'],
  ['/privacy/', 'src/pages/privacy.astro'],
];

function fileDate(absPath) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${absPath}"`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    /* 不是 git repo：退回 mtime */
  }
  return new Date(statSync(absPath).mtimeMs).toISOString().slice(0, 10);
}

function buildLastmodMap() {
  const idx = readContentIndex();
  const map = new Map();
  const latestOf = (arr) => arr.filter(Boolean).sort().reverse()[0] ?? null;

  const workDates = [];
  for (const w of idx.works) {
    const d = w.fm.releasedAt ? String(w.fm.releasedAt).slice(0, 10) : null;
    if (!d) continue;
    map.set(`${SITE_URL}/works/${w.id}/`, d);
    workDates.push(d);
  }
  const teamDates = [];
  for (const t of idx.team) {
    const d = t.fm.updatedAt ? String(t.fm.updatedAt).slice(0, 10) : null;
    if (!d) continue;
    map.set(`${SITE_URL}/team/${t.id}/`, d);
    teamDates.push(d);
  }

  const lw = latestOf(workDates);
  if (lw) map.set(`${SITE_URL}/works/`, lw);
  const latestAll = latestOf([lw, latestOf(teamDates)]);
  if (latestAll) map.set(`${SITE_URL}/`, latestAll);

  for (const [path, file] of STATIC_PAGES) {
    const abs = join(__dirname, file);
    if (existsSync(abs)) map.set(`${SITE_URL}${path}`, fileDate(abs));
  }
  const serviceFile = join(__dirname, 'src/data/services.mjs');
  if (existsSync(serviceFile)) {
    const d = fileDate(serviceFile);
    for (const s of idx.services) map.set(`${SITE_URL}/services/${s.slug}/`, d);
  }

  return map;
}

const lastmodMap = buildLastmodMap();

// ── noindex 頁不進 sitemap：直接讀已產出的 HTML 判斷 ──────────────────────
let outDir = join(__dirname, 'dist');

function captureOutDir() {
  return {
    name: 'capture-out-dir',
    hooks: {
      'astro:config:done': ({ config }) => {
        outDir = fileURLToPath(config.outDir);
      },
    },
  };
}

function pageIsNoindex(url) {
  if (!url.startsWith(SITE_URL)) return false;
  const file = pathToHtml(outDir, url.slice(SITE_URL.length) || '/');
  if (!existsSync(file)) return false;
  return /<meta name="robots" content="noindex/i.test(readFileSync(file, 'utf-8'));
}

// https://astro.build/config
export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    captureOutDir(),
    llmsTxtIntegration(),
    sitemap({
      filter: (page) =>
        page !== SITE_URL &&
        !page.endsWith('/404/') &&
        !page.endsWith('/404.html'),
      serialize(item) {
        if (pageIsNoindex(item.url)) return undefined;
        const lastmod = lastmodMap.get(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
