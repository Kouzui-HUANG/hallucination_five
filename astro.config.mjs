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

// ── 標題字型子集（繁中頁 Noto Serif TC、日文頁 Noto Serif JP）──────────────────
// BaseLayout 在 build 時輸出 text=__H5_DISPLAY_TEXT__（日文頁是 __H5_DISPLAY_TEXT_JA__）；這裡依語言分開收集
// h1、h2 與 .f-display 用到的字，換成 URL 編碼後的字串，Google Fonts 就只回傳這些字（幾十 KB），
// 新增作品或頁面時自動跟著更新。
const DISPLAY_TEXT_PLACEHOLDERS = { zh: '__H5_DISPLAY_TEXT__', ja: '__H5_DISPLAY_TEXT_JA__' };
const isJaHtml = (html) => /<html\b[^>]*\blang="ja"/i.test(html);

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
        const glyphs = { zh: new Set(), ja: new Set() };
        const langOfFile = new Map();
        for (const file of files) {
          const raw = readFileSync(file, 'utf-8');
          const lang = isJaHtml(raw) ? 'ja' : 'zh';
          langOfFile.set(file, lang);
          const html = raw.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
          for (const m of html.matchAll(heads)) {
            const text = decodeEntities((m[2] ?? m[4] ?? '').replace(/<[^>]+>/g, ''));
            for (const ch of text) if (!/\s/.test(ch)) glyphs[lang].add(ch);
          }
        }
        for (const lang of ['zh', 'ja']) {
          const placeholder = DISPLAY_TEXT_PLACEHOLDERS[lang];
          const text = encodeURIComponent([...glyphs[lang]].sort().join(''));
          let rewritten = 0;
          for (const file of files) {
            if (langOfFile.get(file) !== lang) continue;
            const html = readFileSync(file, 'utf-8');
            if (!html.includes(placeholder)) continue;
            writeFileSync(file, html.replaceAll(placeholder, text), 'utf-8');
            rewritten += 1;
          }
          logger.info(`[${lang}] ${glyphs[lang].size} glyphs; ${rewritten} pages now load the subset`);
          if (text.length > 7000) logger.warn(`[${lang}] display font text= is ${text.length} characters; consider trimming display headings`);
        }
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

// 日文頁（html lang="ja"）整頁都用日文的 BudouX 與 ICU 詞典；繁中頁遇到含假名的片段（日文片名）才換成日文
function makePhraser() {
  const zh = { budoux: loadDefaultTraditionalChineseParser(), icu: new Intl.Segmenter('zh-Hant', { granularity: 'word' }) };
  const ja = { budoux: loadDefaultJapaneseParser(), icu: new Intl.Segmenter('ja', { granularity: 'word' }) };
  return (text, pageIsJa = false) => {
    if (!PHRASE_LETTER.test(text)) return text;
    const { budoux, icu } = pageIsJa || PHRASE_KANA.test(text) ? ja : zh;
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
  const pageIsJa = isJaHtml(html);
  let inBody = false;
  let out = '';
  let last = 0;
  const text = (t) =>
    inBody && !skip.length ? t.split(/(&[#\w]+;)/).map((c) => (/^&[#\w]+;$/.test(c) ? c : phrase(c, pageIsJa))).join('') : t;
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
// 規則：作品頁用 releasedAt；創辦人頁用 updatedAt（日文頁用 ja.md 的 updatedAt）；作品總覽與首頁用最新日；
// 其他頁面用內容來源檔（view 與該語言的字串檔）的 git last-commit 日，取最新（沒有 git 歷史時退回 mtime）

const LANG_FILES = { zh: 'src/i18n/zh-Hant.mjs', ja: 'src/i18n/ja.mjs' };
const STATIC_PAGES = [
  ['/services/', ['src/views/ServicesPage.astro']],
  ['/about/', ['src/views/AboutPage.astro']],
  ['/contact/', ['src/views/ContactPage.astro']],
  ['/privacy/', ['src/views/PrivacyPage.astro']],
  ['/process/script/', ['src/views/ProcessScriptPage.astro']],
];
const ZH_ONLY_PAGES = [['/process/previs/', ['src/pages/process/previs.astro']]];

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

/** 多個來源檔取最新的日期；git 還沒記錄的新檔退回 mtime */
function latestFileDate(files) {
  return (
    files
      .map((f) => join(__dirname, f))
      .filter((abs) => existsSync(abs))
      .map(fileDate)
      .sort()
      .reverse()[0] ?? null
  );
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
  const teamJaDates = [];
  for (const t of idx.team) {
    const d = t.fm.updatedAt ? String(t.fm.updatedAt).slice(0, 10) : null;
    if (d) {
      map.set(`${SITE_URL}/team/${t.id}/`, d);
      teamDates.push(d);
    }
    const ja = t.ja?.updatedAt ? String(t.ja.updatedAt).slice(0, 10) : null;
    if (ja) {
      map.set(`${SITE_URL}/ja/team/${t.id}/`, ja);
      teamJaDates.push(ja);
    }
  }

  const lw = latestOf(workDates);
  if (lw) {
    map.set(`${SITE_URL}/works/`, lw);
    map.set(`${SITE_URL}/ja/works/`, lw);
  }
  const latestAll = latestOf([lw, latestOf(teamDates)]);
  if (latestAll) map.set(`${SITE_URL}/`, latestAll);
  const latestJa = latestOf([lw, latestOf(teamJaDates), latestFileDate([LANG_FILES.ja])]);
  if (latestJa) map.set(`${SITE_URL}/ja/`, latestJa);

  for (const [path, files] of STATIC_PAGES) {
    const zh = latestFileDate([...files, LANG_FILES.zh]);
    const ja = latestFileDate([...files, LANG_FILES.ja]);
    if (zh) map.set(`${SITE_URL}${path}`, zh);
    if (ja) map.set(`${SITE_URL}/ja${path}`, ja);
  }
  for (const [path, files] of ZH_ONLY_PAGES) {
    const d = latestFileDate(files);
    if (d) map.set(`${SITE_URL}${path}`, d);
  }
  const serviceZh = latestFileDate(['src/data/services.mjs']);
  const serviceJa = latestFileDate(['src/data/services.ja.mjs']);
  for (const s of idx.services) {
    if (serviceZh) map.set(`${SITE_URL}/services/${s.slug}/`, serviceZh);
    if (serviceJa) map.set(`${SITE_URL}/ja/services/${s.slug}/`, serviceJa);
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
      // 依網址前綴判斷語言（/ja/ 是日文、其餘是繁中），同一頁的兩個語言版本互相輸出 xhtml:link alternate（設計文件 §7-2）
      i18n: { defaultLocale: 'zh-Hant', locales: { 'zh-Hant': 'zh-Hant-TW', ja: 'ja-JP' } },
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
