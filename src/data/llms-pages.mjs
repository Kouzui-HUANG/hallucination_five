/**
 * llms-pages.mjs — llms.txt 頁面策展設定（astro.config.mjs 的 llmsTxtIntegration 讀這裡）
 *
 * 純 Node（不依賴 astro:content），直接掃 src/content/ 的 frontmatter：
 *   team/<slug>/index.md → /team/<slug>/
 *   works/<slug>.md      → /works/<slug>/（optional：只進 llms.txt 目錄，不進全文檔）
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { SITE_URL } from '../../site.config.mjs';
import { SERVICES } from './services.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CONTENT = join(__dirname, '..', 'content');

export const SITE_META = {
  name: '幻五娛樂 HALLUCINATION FIVE',
  url: SITE_URL,
  description:
    '幻五娛樂（HALLUCINATION FIVE）由幻詠工作室與 5Y工作室合夥成立，承接 AI 商業廣告、MV、平台短劇與影集製作，' +
    '並提供 AI 影片課程、企業內訓與 AI 導入顧問。共同創辦人為黃宏瑞與林仲彥。',
};

export function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  try {
    return yaml.load(m[1]) ?? {};
  } catch {
    return {};
  }
}

function readDirEntries(dir, { folders }) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => !name.startsWith('_') && !name.startsWith('.'))
    .flatMap((name) => {
      const full = join(dir, name);
      if (folders) {
        if (!statSync(full).isDirectory()) return [];
        const idx = join(full, 'index.md');
        return existsSync(idx) ? [{ id: name, fm: parseFrontmatter(readFileSync(idx, 'utf-8')) }] : [];
      }
      if (!name.endsWith('.md')) return [];
      return [{ id: name.replace(/\.md$/, ''), fm: parseFrontmatter(readFileSync(full, 'utf-8')) }];
    })
    .filter((e) => e.fm && e.fm.draft !== true);
}

/** 公開條目（給 astro.config 的 sitemap lastmod 與 llms 共用） */
export function readContentIndex() {
  const works = readDirEntries(join(CONTENT, 'works'), { folders: false }).sort((a, b) =>
    String(b.fm.releasedAt ?? '').localeCompare(String(a.fm.releasedAt ?? '')),
  );
  const team = readDirEntries(join(CONTENT, 'team'), { folders: true }).sort(
    (a, b) => (a.fm.order ?? 0) - (b.fm.order ?? 0),
  );
  return { works, team, services: SERVICES };
}

const idx = readContentIndex();

export const SECTIONS = [
  {
    heading: '核心頁面',
    pages: [
      { path: '/', title: '首頁', note: '公司簡介、精選作品、四項服務、製作流程、獲獎紀錄與創辦人' },
      { path: '/works/', title: '作品', note: '廣告、MV、短劇、短片與動畫作品，依發表時間排列' },
      { path: '/services/', title: '服務', note: '商業影片製作、短劇與影集、課程與企業內訓、AI 導入顧問' },
      { path: '/about/', title: '關於幻五', note: '公司沿革、名字的由來、公司資訊與相關計畫' },
      { path: '/contact/', title: '洽詢', note: '專案、內訓與顧問洽詢方式' },
    ],
  },
  {
    heading: '服務',
    pages: idx.services.map((s) => ({
      path: `/services/${s.slug}/`,
      title: s.name,
      note: s.summary,
    })),
  },
  ...(idx.team.length
    ? [
        {
          heading: '創辦人',
          pages: idx.team.map((t) => ({
            path: `/team/${t.id}/`,
            title: t.fm.name ?? t.id,
            note: t.fm.tagline ?? '',
          })),
        },
      ]
    : []),
  ...(idx.works.length
    ? [
        {
          heading: '作品',
          pages: idx.works.map((w) => ({
            path: `/works/${w.id}/`,
            title: w.fm.title ?? w.id,
            note: w.fm.synopsis ?? '',
            optional: true,
          })),
        },
      ]
    : []),
];
