// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { SITE_ORIGIN, BASE_PATH, SITE_URL } from './site.config.mjs';
import { SITE_META, SECTIONS, readContentIndex } from './src/data/llms-pages.mjs';
import { loadDefaultTraditionalChineseParser, loadDefaultJapaneseParser } from 'budoux';

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

// ── 標題字型子集（Noto Serif TC）────────────────────────────────────────
// BaseLayout 在 build 時輸出 text=__H5_DISPLAY_TEXT__；這裡收集全站 h1、h2 與 .f-display 用到的字，
// 換成 URL 編碼後的字串，Google Fonts 就只回傳這些字（幾十 KB），新增作品或頁面時自動跟著更新。
const DISPLAY_TEXT_PLACEHOLDER = '__H5_DISPLAY_TEXT__';

function listHtmlFiles(dirPath) {
  return readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dirPath, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function displayFontSubset() {
  return {
    name: 'display-font-subset',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const files = listHtmlFiles(fileURLToPath(dir));
        // h1、h2、.f-display（整段用標題字）與 .f-subset（數字用 Archivo、中文落到標題字，例：中・日）
        const heads = /<(h1|h2)\b[^>]*>([\s\S]*?)<\/\1>|<([a-z][a-z0-9]*)\b[^>]*\bclass="[^"]*\bf-(?:display|subset)\b[^"]*"[^>]*>([\s\S]*?)<\/\3>/gi;
        const glyphs = new Set();
        for (const file of files) {
          const html = readFileSync(file, 'utf-8')
            .replace(/<script\b[\s\S]*?<\/script>/gi, '')
            .replace(/<style\b[\s\S]*?<\/style>/gi, '');
          for (const m of html.matchAll(heads)) {
            const text = decodeEntities((m[2] ?? m[4] ?? '').replace(/<[^>]+>/g, ''));
            for (const ch of text) if (!/\s/.test(ch)) glyphs.add(ch);
          }
        }
        const text = encodeURIComponent([...glyphs].sort().join(''));
        let rewritten = 0;
        for (const file of files) {
          const html = readFileSync(file, 'utf-8');
          if (!html.includes(DISPLAY_TEXT_PLACEHOLDER)) continue;
          writeFileSync(file, html.replaceAll(DISPLAY_TEXT_PLACEHOLDER, text), 'utf-8');
          rewritten += 1;
        }
        logger.info(`${glyphs.size} glyphs from ${files.length} pages; ${rewritten} pages now load the subset`);
        if (text.length > 7000) logger.warn(`display font text= is ${text.length} characters; consider trimming display headings`);
      },
    },
  };
}

// ── 中文斷行：只在詞組邊界換行 ──────────────────────────────────────────
// build 後在 <body> 的中日文文字裡插入 <wbr>，位置取 BudouX（詞組）與 Intl.Segmenter（ICU 詞典）
// 都認為是邊界的地方；global.css 的 html[data-phrase-breaks] 再設定 word-break: keep-all，
// 中文就只在這些位置與標點後換行，不會斷成「片／長」「主題／曲」。必須排在 integrations 的最後
// （llms.txt 讀的是沒有 <wbr> 的 HTML）。
// 只在兩個「字」（漢字、平假名、片假名）之間插 <wbr>；標點（含 ・ ー 與括號）前後一律不插，
// 標點後的換行交給瀏覽器（keep-all 仍允許），也不會讓一行以 ・ 開頭或拆開 ）・ 的標點擠壓
const PHRASE_LETTER = /[㐀-䶿一-鿿豈-﫿ぁ-ゖァ-ヺ]/;
const PHRASE_KANA = /[ぁ-ゖァ-ヺ]/;
const PHRASE_SKIP = new Set(['script', 'style', 'noscript', 'title', 'textarea', 'pre', 'code', 'svg']);

function makePhraser() {
  const zh = { budoux: loadDefaultTraditionalChineseParser(), icu: new Intl.Segmenter('zh-Hant', { granularity: 'word' }) };
  const ja = { budoux: loadDefaultJapaneseParser(), icu: new Intl.Segmenter('ja', { granularity: 'word' }) };
  return (text) => {
    if (!PHRASE_LETTER.test(text)) return text;
    const { budoux, icu } = PHRASE_KANA.test(text) ? ja : zh;
    const phraseEnds = new Set();
    let at = 0;
    for (const part of budoux.parse(text)) {
      at += part.length;
      phraseEnds.add(at);
    }
    const wordStarts = new Set([...icu.segment(text)].map((s) => s.index));
    let out = '';
    let last = 0;
    for (let pos = 1; pos < text.length; pos += 1) {
      const prev = text[pos - 1];
      const next = text[pos];
      const between = PHRASE_LETTER.test(prev) && PHRASE_LETTER.test(next);
      if (between && phraseEnds.has(pos) && wordStarts.has(pos)) {
        out += `${text.slice(last, pos)}<wbr>`;
        last = pos;
      }
    }
    return out + text.slice(last);
  };
}

function addPhraseBreaks(html, phrase) {
  const tagRe = /<!--[\s\S]*?-->|<(?:"[^"]*"|'[^']*'|[^'">])*>/g;
  const skip = [];
  let inBody = false;
  let out = '';
  let last = 0;
  const text = (t) =>
    inBody && !skip.length ? t.split(/(&[#\w]+;)/).map((c) => (/^&[#\w]+;$/.test(c) ? c : phrase(c))).join('') : t;
  for (const m of html.matchAll(tagRe)) {
    out += text(html.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
    const tag = /^<(\/?)([a-zA-Z][\w-]*)/.exec(m[0]);
    if (!tag) continue;
    const closing = tag[1] === '/';
    const name = tag[2].toLowerCase();
    if (name === 'body') inBody = !closing;
    else if (PHRASE_SKIP.has(name)) {
      if (closing) {
        const k = skip.lastIndexOf(name);
        if (k >= 0) skip.splice(k, 1);
      } else if (!m[0].endsWith('/>')) skip.push(name);
    }
  }
  out += text(html.slice(last));
  return out.replace(/<html\b/i, '<html data-phrase-breaks');
}

function phraseBreaks() {
  return {
    name: 'phrase-breaks',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const phrase = makePhraser();
        let pages = 0;
        for (const file of listHtmlFiles(fileURLToPath(dir))) {
          const html = readFileSync(file, 'utf-8');
          if (!/<body\b/i.test(html)) continue;
          writeFileSync(file, addPhraseBreaks(html, phrase), 'utf-8');
          pages += 1;
        }
        logger.info(`phrase breaks (<wbr>) added to ${pages} pages`);
      },
    },
  };
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
  ['/process/previs/', 'src/pages/process/previs.astro'],
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
    displayFontSubset(),
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
    // 一定要最後：前面的 integration 讀的是還沒插入 <wbr> 的 HTML
    phraseBreaks(),
  ],
});
