/**
 * 上稿防呆（npm run check；CI 在 build 前跑，有錯就不部署）
 *
 * 錯誤（exit 1）：frontmatter 缺欄位、日期沒加引號、縮圖、肖像或獎項照片不存在、導演或製作名單指到不存在的成員、
 *               作品沒有影片也沒有劇照、精選作品超過 6 件或排序重複、服務 slug 重複、
 *               日文版缺漏（字串檔的鍵與繁中不一致、日文服務資料缺項、創辦人缺 ja.md）
 * 提醒（不擋部署）：上線前要補的資料（統一編號、洽詢表單、客戶授權…）、日文頁會顯示原文的地方（獎項名、替代文字）
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { SERVICES, PROCESS } from '../src/data/services.mjs';
import { SERVICES_JA, PROCESS_JA } from '../src/data/services.ja.mjs';
import { CLIENTS } from '../src/data/clients.mjs';
import { COURSES } from '../src/data/courses.mjs';
import { ZH } from '../src/i18n/zh-Hant.mjs';
import { JA, AWARDS_JA } from '../src/i18n/ja.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKS = join(ROOT, 'src/content/works');
const TEAM = join(ROOT, 'src/content/team');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (msg) => warnings.push(msg);

const CATEGORIES = ['commercial', 'mv', 'series', 'short', 'animation'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function frontmatter(path) {
  const m = readFileSync(path, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? (yaml.load(m[1]) ?? {}) : null;
}

function checkDate(file, fm, key) {
  const v = fm[key];
  if (v instanceof Date) err(file, `${key} 要加引號（寫成 "YYYY-MM-DD"），不然 YAML 會轉成日期物件`);
  else if (typeof v !== 'string' || !DATE_RE.test(v)) err(file, `${key} 格式須為 "YYYY-MM-DD"`);
}

/* ── team ─────────────────────────── */
const teamIds = new Set();
for (const slug of readdirSync(TEAM).filter((n) => statSync(join(TEAM, n)).isDirectory())) {
  const file = `team/${slug}/index.md`;
  const fm = frontmatter(join(TEAM, slug, 'index.md'));
  if (!fm) {
    err(file, '找不到 frontmatter');
    continue;
  }
  teamIds.add(slug);
  for (const key of ['name', 'nameEn', 'slug', 'role', 'jobTitle', 'tagline', 'summary', 'seoTitle', 'description', 'portrait', 'portraitAlt']) {
    if (!fm[key]) err(file, `缺少 ${key}`);
  }
  if (fm.slug && fm.slug !== slug) err(file, `slug「${fm.slug}」要與資料夾名稱「${slug}」相同`);
  if (fm.description && fm.description.length > 160) err(file, `description 超過 160 字（${fm.description.length}）`);
  if (fm.portrait && !existsSync(join(TEAM, slug, fm.portrait))) err(file, `肖像檔不存在：${fm.portrait}`);
  checkDate(file, fm, 'updatedAt');

  /* 日文介紹（/ja/team/<slug>/） */
  const jaFile = `team/${slug}/ja.md`;
  if (!existsSync(join(TEAM, slug, 'ja.md'))) {
    err(jaFile, '找不到日文介紹（每位成員都要有，/ja/team/ 會用到）');
    continue;
  }
  const ja = frontmatter(join(TEAM, slug, 'ja.md'));
  if (!ja) {
    err(jaFile, '找不到 frontmatter');
    continue;
  }
  for (const key of ['role', 'jobTitle', 'tagline', 'summary', 'seoTitle', 'description', 'portraitAlt']) {
    if (!ja[key]) err(jaFile, `缺少 ${key}`);
  }
  if (ja.description && ja.description.length > 160) err(jaFile, `description 超過 160 字（${ja.description.length}）`);
  checkDate(jaFile, ja, 'updatedAt');
  for (const key of ['numbers', 'timeline']) {
    if ((fm[key]?.length ?? 0) !== (ja[key]?.length ?? 0)) {
      warn(`${jaFile}：${key} 有 ${ja[key]?.length ?? 0} 項，繁中有 ${fm[key]?.length ?? 0} 項`);
    }
  }
}

/* ── works ─────────────────────────── */
/** [來源檔, 賽事名, 名次, 照片標籤]：日文頁要顯示的獎項字串，最後統一檢查有沒有日文 */
const jaAwardStrings = [];
let featured = 0;
const orders = new Map();
for (const name of readdirSync(WORKS).filter((n) => n.endsWith('.md') && !n.startsWith('_'))) {
  const file = `works/${name}`;
  const fm = frontmatter(join(WORKS, name));
  if (!fm) {
    err(file, '找不到 frontmatter');
    continue;
  }
  if (fm.draft) continue;
  const slug = name.replace(/\.md$/, '');
  for (const key of ['title', 'slug', 'category', 'year', 'thumb', 'thumbAlt', 'synopsis']) {
    if (!fm[key]) err(file, `缺少 ${key}`);
  }
  if (fm.slug && fm.slug !== slug) err(file, `slug「${fm.slug}」要與檔名「${slug}」相同`);
  if (fm.category && !CATEGORIES.includes(fm.category)) err(file, `category「${fm.category}」不在 ${CATEGORIES.join(' / ')} 裡`);
  checkDate(file, fm, 'releasedAt');
  if (fm.thumb && !existsSync(join(WORKS, fm.thumb))) err(file, `縮圖不存在：${fm.thumb}`);
  for (const a of fm.awards ?? []) {
    for (const p of a.photos ?? []) {
      if (!p.alt) err(file, `「${a.title}」的 photos 缺少 alt`);
      if (!p.src || !existsSync(join(WORKS, p.src))) err(file, `獎項照片不存在：${p.src}`);
      if (p.person && !teamIds.has(p.person)) err(file, `photos 的 person「${p.person}」不是 team 成員`);
    }
  }
  if (!fm.videoUrl && !(fm.stills?.length > 0)) err(file, '沒有 videoUrl 時必須提供 stills');
  if (fm.videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(fm.videoUrl)) {
    err(file, `videoUrl 只收 YouTube／Vimeo：${fm.videoUrl}`);
  }
  if (!Array.isArray(fm.directors) || fm.directors.length === 0) err(file, 'directors 至少要一位');
  for (const d of fm.directors ?? []) if (!teamIds.has(d)) err(file, `directors 裡的「${d}」不是 team 成員`);
  for (const c of fm.credits ?? []) {
    if (!c.role) err(file, 'credits 每一筆都要有 role');
    if (c.team && !teamIds.has(c.team)) err(file, `credits 的 team「${c.team}」不是 team 成員`);
    if (!c.team && !c.name) err(file, `credits「${c.role}」要填 team 或 name`);
  }
  if (fm.synopsis && fm.synopsis.length > 400) err(file, `synopsis 超過 400 字（${fm.synopsis.length}）`);
  if (!fm.thumbAltJa) warn(`${file}：沒有 thumbAltJa，日文頁的作品卡縮圖沒有替代文字`);
  for (const a of fm.awards ?? []) {
    jaAwardStrings.push([file, a.title, a.result, a.photoLabel]);
    for (const p of a.photos ?? []) if (!p.altJa) warn(`${file}：「${a.title}」的照片沒有 altJa，日文頁的替代文字會留空`);
  }
  if (fm.featured) {
    featured++;
    if (fm.order != null) {
      if (orders.has(fm.order)) err(file, `精選排序 order: ${fm.order} 與 ${orders.get(fm.order)} 重複`);
      orders.set(fm.order, file);
    }
  }
}
if (featured > 6) errors.push(`精選作品有 ${featured} 件，首頁最多放 6 件`);
if (featured === 0) errors.push('至少要有一件 featured 作品（首頁大卡）');

/* ── services ─────────────────────────── */
const serviceSlugs = new Set();
for (const s of SERVICES) {
  if (serviceSlugs.has(s.slug)) errors.push(`services.mjs：slug「${s.slug}」重複`);
  serviceSlugs.add(s.slug);
  if (!s.faq?.length) errors.push(`services.mjs：「${s.name}」沒有常見問題`);
  if (s.description.length > 160) errors.push(`services.mjs：「${s.name}」的 description 超過 160 字`);
}
for (const c of COURSES) {
  if (!teamIds.has(c.instructor)) errors.push(`courses.mjs：「${c.title}」的講師「${c.instructor}」不是 team 成員`);
  for (const key of ['titleJa', 'kindJa', 'formatJa']) if (!c[key]) errors.push(`courses.mjs：「${c.title}」缺少 ${key}（日文頁顯示用）`);
}

/* ── 日文版（設計文件 §9-2：日文頁字串無缺漏） ─────────────────────────── */

/** 字串檔：兩邊的鍵、型別、陣列長度要一致（函式比對參數個數與回傳值的結構） */
function compareDict(zh, ja, path) {
  const where = path || '(root)';
  if (typeof zh !== typeof ja) return errors.push(`i18n/ja.mjs：${where} 型別不同（繁中 ${typeof zh}、日文 ${typeof ja}）`);
  if (typeof zh === 'function') {
    if (zh.length !== ja.length) return errors.push(`i18n/ja.mjs：${where} 參數個數不同`);
    const args = Array.from({ length: zh.length }, (_, i) => (i === 0 ? { renamePending: true, newLegalName: 'X' } : 1));
    const sample = (fn) => {
      try {
        return fn(...args);
      } catch {
        return fn(...Array.from({ length: zh.length }, () => 'X'));
      }
    };
    return compareDict(sample(zh), sample(ja), `${where}()`);
  }
  if (Array.isArray(zh)) {
    if (!Array.isArray(ja)) return errors.push(`i18n/ja.mjs：${where} 應該是陣列`);
    if (zh.length !== ja.length) return errors.push(`i18n/ja.mjs：${where} 有 ${ja.length} 項，繁中有 ${zh.length} 項`);
    return zh.forEach((v, i) => compareDict(v, ja[i], `${where}[${i}]`));
  }
  if (zh && typeof zh === 'object') {
    const keys = new Set([...Object.keys(zh), ...Object.keys(ja)]);
    for (const k of keys) {
      const p = path ? `${path}.${k}` : k;
      if (!(k in ja)) errors.push(`i18n/ja.mjs：缺少 ${p}`);
      else if (!(k in zh)) errors.push(`i18n/ja.mjs：多了 ${p}（zh-Hant.mjs 沒有）`);
      else compareDict(zh[k], ja[k], p);
    }
    return;
  }
  if (typeof zh === 'string' && typeof ja === 'string' && zh.trim() && !ja.trim() && !path.endsWith('directoryNote')) {
    errors.push(`i18n/ja.mjs：${where} 是空字串`);
  }
}
compareDict(ZH, JA, '');

/* 服務：slug、順序、類別與繁中相同；每個欄位都要有字 */
if (SERVICES_JA.map((s) => s.slug).join() !== SERVICES.map((s) => s.slug).join()) {
  errors.push('services.ja.mjs：服務的 slug 或順序與 services.mjs 不同');
}
for (const s of SERVICES_JA) {
  const zh = SERVICES.find((z) => z.slug === s.slug);
  for (const key of ['name', 'nameEn', 'summary', 'forWho', 'lead', 'seoTitle', 'description']) {
    if (!s[key]) errors.push(`services.ja.mjs：「${s.slug}」缺少 ${key}`);
  }
  if (s.description && s.description.length > 160) errors.push(`services.ja.mjs：「${s.slug}」的 description 超過 160 字`);
  if (!s.faq?.length) errors.push(`services.ja.mjs：「${s.slug}」沒有常見問題`);
  for (const f of s.faq ?? []) if (!f.q || !f.a) errors.push(`services.ja.mjs：「${s.slug}」有一題常見問題缺問題或答案`);
  if (zh && zh.categories.join() !== s.categories.join()) errors.push(`services.ja.mjs：「${s.slug}」的 categories 與繁中不同`);
  if (zh && zh.deliverables.length !== s.deliverables.length) {
    errors.push(`services.ja.mjs：「${s.slug}」的交付內容有 ${s.deliverables.length} 項，繁中有 ${zh.deliverables.length} 項`);
  }
}
if (PROCESS_JA.map((p) => p.no).join() !== PROCESS.map((p) => p.no).join()) {
  errors.push('services.ja.mjs：PROCESS_JA 的步驟與 PROCESS 不同');
}

/* 獎項：中文的賽事名、名次與照片標籤要有日文（沒有的話日文頁顯示原文） */
const hasCjk = (s) => /[㐀-鿿]/.test(s);
for (const t of readdirSync(TEAM).filter((n) => statSync(join(TEAM, n)).isDirectory())) {
  const fm = frontmatter(join(TEAM, t, 'index.md'));
  for (const a of fm?.extraAwards ?? []) jaAwardStrings.push([`team/${t}/index.md`, a.title, a.result]);
}
for (const [file, title, result, photoLabel] of jaAwardStrings) {
  if (title && hasCjk(title) && !AWARDS_JA.titles[title]) warn(`${file}：賽事「${title}」沒有日文名稱（i18n/ja.mjs 的 AWARDS_JA.titles）`);
  if (result && !AWARDS_JA.results[result]) warn(`${file}：名次「${result}」沒有日文（AWARDS_JA.results）`);
  if (photoLabel && !AWARDS_JA.photoLabels[photoLabel]) warn(`${file}：照片標籤「${photoLabel}」沒有日文（AWARDS_JA.photoLabels）`);
}

/* ── 上線前提醒 ─────────────────────────── */
const siteTs = readFileSync(join(ROOT, 'src/data/site.ts'), 'utf-8');
if (/taxId:\s*''/.test(siteTs)) warn('統一編號（COMPANY.taxId）還沒填，頁尾與 schema 不會顯示');
if (/renamePending:\s*true/.test(siteTs)) warn('更名登記中：核准後把 COMPANY.legalName 改成新名、renamePending 改成 false');
if (/contactFormUrl:\s*''/.test(siteTs)) warn('洽詢表單（SITE.contactFormUrl）還沒設定，聯絡頁使用 Email 範本');
if (/contactFormUrlJa:\s*''/.test(siteTs)) warn('日文洽詢表單（SITE.contactFormUrlJa）還沒設定，/ja/contact/ 使用日文 Email 範本');
if (!CLIENTS.some((c) => c.approved)) warn('合作夥伴名單還沒有取得授權的項目，首頁不顯示該區');

for (const w of warnings) console.log(`\x1b[33m!\x1b[0m ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`\x1b[31m✗\x1b[0m ${e}`);
  console.error(`\n${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(
  `\x1b[32m✓\x1b[0m 內容檢查通過（作品 ${readdirSync(WORKS).filter((n) => n.endsWith('.md')).length} 件、成員 ${teamIds.size} 位、服務 ${SERVICES.length} 項；日文版字串、服務與創辦人介紹齊全）`,
);
