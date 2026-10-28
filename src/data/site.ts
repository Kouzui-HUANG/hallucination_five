/**
 * Site metadata and navigation.
 * Single source of truth for site-wide strings and structure.
 *
 * 部署位置（origin / base）來自根目錄 site.config.mjs，讓 astro.config.mjs 與這裡讀同一份值。
 */
import { SITE_ORIGIN, BASE_PATH, SITE_URL } from '../../site.config.mjs';
import { SERVICES } from './services.mjs';

export const SITE = {
  name: '幻五娛樂',
  nameEn: 'HALLUCINATION FIVE',
  tagline: '畫面交給 AI，故事留給人。',
  /** 長版站台描述：llms.txt 開頭引言、首頁 meta、Organization schema */
  description:
    '幻五娛樂（HALLUCINATION FIVE）由幻詠工作室與 5Y工作室合夥成立，承接 AI 商業廣告、MV、平台短劇與影集製作，並提供 AI 影片課程、企業內訓與 AI 導入顧問。',
  origin: SITE_ORIGIN,
  base: BASE_PATH,
  url: SITE_URL,
  locale: 'zh-Hant-TW',
  /** 公司洽詢信箱（Google Workspace 別名，上線前要先開好；設計文件 §11 #10） */
  email: 'studio@hallucination28.com',
  /** Google 表單的 viewform 網址。留空則聯絡頁改用 Email 洽詢範本 */
  contactFormUrl: '',
  /** 公司社群帳號（創辦人個人帳號寫在 team）。Organization.sameAs 只收非空值 */
  social: {
    youtube: '',
    instagram: '',
    threads: '',
    facebook: '',
  },
  /** 相關計畫（設計文件 §8） */
  directory: {
    name: '台灣AI影視創作者圖鑑',
    url: 'https://hallucination28.com/',
  },
  themeColor: '#0e0e10',
} as const;

/** 公司登記資料（設計文件 §1-2：更名核准前，法定名稱仍是幻詠資訊有限公司） */
export const COMPANY = {
  /** 現行登記名稱。核准後改成「幻五娛樂科技股份有限公司」 */
  legalName: '幻詠資訊有限公司',
  newLegalName: '幻五娛樂科技股份有限公司',
  /** 核准後改成 false */
  renamePending: true,
  /** 統一編號；留空就不顯示 */
  taxId: '',
  /** Organization.alternateName：新舊名稱與兩個工作室的名字，讓舊名搜尋也找得到 */
  alternateNames: [
    '幻五娛樂科技股份有限公司',
    'HALLUCINATION FIVE',
    '幻詠資訊有限公司',
    '幻詠工作室',
    '幻詠 Gen Ai Studio',
    'Hallucination Gen Ai Studio',
    '5Y工作室',
    '5Y Studio',
  ],
} as const;

/** 頁尾與關於頁的公司名稱：更名期間附註原名 */
export function legalNameLine(): string {
  return COMPANY.renamePending
    ? `${COMPANY.newLegalName}（更名登記中，原${COMPANY.legalName}）`
    : COMPANY.legalName;
}

/**
 * 站內連結 helper：所有相對連結一律經過這裡加 base。
 * 已經是絕對 URL（http/https/mailto）或 hash 的原樣回傳。
 */
export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return BASE_PATH === '/' ? clean : `${BASE_PATH}${clean}`;
}

/** 絕對 URL（給 canonical / og / JSON-LD） */
export function absUrl(path: string): string {
  if (/^https?:/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

/**
 * Astro 圖片 src → 絕對 URL（JSON-LD image / thumbnailUrl、og:image 用）。
 * astro:assets 產生的 src 已含 base，只需補 origin。
 */
export function absAsset(src: string): string {
  if (/^https?:/.test(src)) return src;
  if (BASE_PATH !== '/' && src.startsWith(`${BASE_PATH}/`)) return `${SITE_ORIGIN}${src}`;
  return absUrl(src);
}

/* ── 路由 helper：所有頁面組 URL 一律用這些，避免手拼字串漂移 ── */
export const routes = {
  home: () => href('/'),
  works: () => href('/works/'),
  work: (slug: string) => href(`/works/${slug}/`),
  services: () => href('/services/'),
  service: (slug: string) => href(`/services/${slug}/`),
  about: () => href('/about/'),
  team: (slug: string) => href(`/team/${slug}/`),
  contact: (service?: string) => href(service ? `/contact/?service=${service}` : '/contact/'),
  privacy: () => href('/privacy/'),
} as const;

/** 絕對版（JSON-LD @id / url 用） */
export const absRoutes = {
  home: () => absUrl('/'),
  works: () => absUrl('/works/'),
  work: (slug: string) => absUrl(`/works/${slug}/`),
  services: () => absUrl('/services/'),
  service: (slug: string) => absUrl(`/services/${slug}/`),
  about: () => absUrl('/about/'),
  team: (slug: string) => absUrl(`/team/${slug}/`),
  personId: (slug: string) => absUrl(`/team/${slug}/#person`),
  organizationId: () => `${SITE_URL}/#organization`,
  websiteId: () => `${SITE_URL}/#website`,
} as const;

export type NavItem = { label: string; labelEn: string; href: string };

/** 主選單（課程放在服務底下，主選單維持四項；設計文件 §2-2） */
export const PRIMARY_NAV: NavItem[] = [
  { label: '作品', labelEn: 'WORKS', href: '/works/' },
  { label: '服務', labelEn: 'SERVICES', href: '/services/' },
  { label: '關於', labelEn: 'ABOUT', href: '/about/' },
  { label: '聯絡', labelEn: 'CONTACT', href: '/contact/' },
];

/** Footer：服務欄 */
export const FOOTER_SERVICES = SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}/` }));
