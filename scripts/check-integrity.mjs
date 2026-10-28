/**
 * 上稿防呆（npm run check；CI 在 build 前跑，有錯就不部署）
 *
 * 錯誤（exit 1）：frontmatter 缺欄位、日期沒加引號、縮圖或肖像檔不存在、導演或製作名單指到不存在的成員、
 *               作品沒有影片也沒有劇照、精選作品超過 6 件或排序重複、服務 slug 重複
 * 提醒（不擋部署）：上線前要補的資料（統一編號、洽詢表單、客戶授權…）
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { SERVICES } from '../src/data/services.mjs';
import { CLIENTS } from '../src/data/clients.mjs';
import { COURSES } from '../src/data/courses.mjs';

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
}

/* ── works ─────────────────────────── */
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
}

/* ── 上線前提醒 ─────────────────────────── */
const siteTs = readFileSync(join(ROOT, 'src/data/site.ts'), 'utf-8');
if (/taxId:\s*''/.test(siteTs)) warn('統一編號（COMPANY.taxId）還沒填，頁尾與 schema 不會顯示');
if (/renamePending:\s*true/.test(siteTs)) warn('更名登記中：核准後把 COMPANY.legalName 改成新名、renamePending 改成 false');
if (/contactFormUrl:\s*''/.test(siteTs)) warn('洽詢表單（SITE.contactFormUrl）還沒設定，聯絡頁使用 Email 範本');
if (!CLIENTS.some((c) => c.approved)) warn('合作夥伴名單還沒有取得授權的項目，首頁不顯示該區');

for (const w of warnings) console.log(`\x1b[33m!\x1b[0m ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`\x1b[31m✗\x1b[0m ${e}`);
  console.error(`\n${errors.length} 個錯誤`);
  process.exit(1);
}
console.log(`\x1b[32m✓\x1b[0m 內容檢查通過（作品 ${readdirSync(WORKS).filter((n) => n.endsWith('.md')).length} 件、成員 ${teamIds.size} 位、服務 ${SERVICES.length} 項）`);
