/**
 * 多語（設計文件 §2-1、§9-2）：繁中是預設、沒有前綴；日文在 /ja/。
 *
 * 語言一律由網址決定（/ja/ 開頭就是日文），所以元件不必一層層傳 lang：
 * 在元件裡寫 `const lang = langOf(Astro.url)`，再用 `t(lang)` 拿字串、`routesFor(lang)` 組連結。
 *
 * 介面與頁面字串在 zh-Hant.mjs／ja.mjs（寫成 .mjs，scripts/check-integrity.mjs 才能比對兩邊的鍵）；
 * 服務資料在 data/services.mjs／services.ja.mjs，創辦人的日文介紹在 content/team/<slug>/ja.md。
 */
import { SITE, href, absUrl } from '../data/site';
import { ZH } from './zh-Hant.mjs';
import { JA, AWARDS_JA } from './ja.mjs';
import { CATEGORIES } from '../data/categories';

export type Lang = 'zh-Hant' | 'ja';
export type Dict = typeof ZH;

export const LANG_META: Record<Lang, { htmlLang: string; hreflang: string; ogLocale: string; prefix: string }> = {
  'zh-Hant': { htmlLang: 'zh-Hant-TW', hreflang: 'zh-Hant-TW', ogLocale: 'zh_TW', prefix: '' },
  ja: { htmlLang: 'ja', hreflang: 'ja-JP', ogLocale: 'ja_JP', prefix: '/ja' },
};

const DICTS: Record<Lang, Dict> = { 'zh-Hant': ZH, ja: JA };

export function t(lang: Lang): Dict {
  return DICTS[lang];
}

/** 去掉 base 的 path（/ja/about/ 或 /about/） */
function stripBase(pathname: string): string {
  const basePrefix = SITE.base === '/' ? '' : SITE.base;
  return basePrefix && pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || '/' : pathname;
}

/** /ja/about/ → { lang: 'ja', path: '/about/' }；/about/ → { lang: 'zh-Hant', path: '/about/' } */
export function splitLang(pathNoBase: string): { lang: Lang; path: string } {
  const m = pathNoBase.match(/^\/ja(\/.*)?$/);
  if (m) return { lang: 'ja', path: m[1] || '/' };
  return { lang: 'zh-Hant', path: pathNoBase };
}

export function langOf(url: URL): Lang {
  return splitLang(stripBase(url.pathname)).lang;
}

/** 有日文版的頁面（設計文件 §2-1）：作品頁、3D 動態預演頁（/process/previs/）、404 只有繁中。2026-11-16 起新增的頁面一律做日文版 */
const JA_PAGES = [
  /^\/$/,
  /^\/works\/$/,
  /^\/services\/$/,
  /^\/services\/[^/]+\/$/,
  /^\/about\/$/,
  /^\/team\/[^/]+\/$/,
  /^\/contact\/$/,
  /^\/privacy\/$/,
  /^\/process\/script\/$/,
];

export function hasJa(path: string): boolean {
  return JA_PAGES.some((re) => re.test(path));
}

/** 繁中 path → 指定語言的 path（不含 base）：localize('/about/', 'ja') → '/ja/about/' */
export function localize(path: string, lang: Lang): string {
  if (lang === 'zh-Hant') return path;
  return path === '/' ? '/ja/' : `/ja${path}`;
}

/** 某語言的站內連結（含 base）。只有繁中的頁面（作品頁、/process/previs/），日文頁也連到繁中版 */
export function routesFor(lang: Lang) {
  const L = (p: string) => href(localize(p, lang));
  return {
    home: () => L('/'),
    works: () => L('/works/'),
    work: (slug: string) => href(`/works/${slug}/`),
    services: () => L('/services/'),
    service: (slug: string) => L(`/services/${slug}/`),
    about: () => L('/about/'),
    team: (slug: string) => L(`/team/${slug}/`),
    process: (slug: string) => (hasJa(`/process/${slug}/`) ? L(`/process/${slug}/`) : href(`/process/${slug}/`)),
    contact: (service?: string) => (service ? `${L('/contact/')}?service=${service}` : L('/contact/')),
    privacy: () => L('/privacy/'),
  };
}

/** 絕對版（JSON-LD、麵包屑用） */
export function absRoutesFor(lang: Lang) {
  const A = (p: string) => absUrl(localize(p, lang));
  return {
    home: () => A('/'),
    works: () => A('/works/'),
    work: (slug: string) => absUrl(`/works/${slug}/`),
    services: () => A('/services/'),
    service: (slug: string) => A(`/services/${slug}/`),
    about: () => A('/about/'),
    team: (slug: string) => A(`/team/${slug}/`),
    process: (slug: string) => (hasJa(`/process/${slug}/`) ? A(`/process/${slug}/`) : absUrl(`/process/${slug}/`)),
    contact: () => A('/contact/'),
    privacy: () => A('/privacy/'),
  };
}

/**
 * 這一頁的另一個語言版本：有對應頁就給對應頁（輸出 hreflang），沒有就連到該語言的首頁（只給語言切換用）。
 */
export function counterpartOf(pathNoBase: string): { lang: Lang; path: string; equivalent: boolean } {
  const { lang, path } = splitLang(pathNoBase);
  if (lang === 'ja') return { lang: 'zh-Hant', path, equivalent: true };
  return hasJa(path) ? { lang: 'ja', path: localize(path, 'ja'), equivalent: true } : { lang: 'ja', path: '/ja/', equivalent: false };
}

/* ── 作品資料的日文顯示：片名是專有名詞，維持原文；類別、集數、獎項名次翻譯 ── */

const CATEGORY_JA: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, (JA.categories as Record<string, string>)[c.slug] ?? c.label]),
);

export function categoryLabelFor(lang: Lang) {
  return (slug: string) => (lang === 'ja' ? (CATEGORY_JA[slug] ?? slug) : (CATEGORIES.find((c) => c.slug === slug)?.label ?? slug));
}

/** 獎項名稱與名次：日文頁查 AWARDS_JA，查不到就顯示原文 */
export function awardText(lang: Lang) {
  return {
    title: (s: string) => (lang === 'ja' ? ((AWARDS_JA.titles as Record<string, string>)[s] ?? s) : s),
    result: (s: string) => (lang === 'ja' ? ((AWARDS_JA.results as Record<string, string>)[s] ?? s) : s),
    photoLabel: (s: string) => (lang === 'ja' ? ((AWARDS_JA.photoLabels as Record<string, string>)[s] ?? s) : s),
  };
}

/** 作品名的書名號：中文用《》、日文用『』 */
export function quoteTitle(lang: Lang, title: string): string {
  return lang === 'ja' ? `『${title}』` : `《${title}》`;
}
