/**
 * site.config.mjs — 部署位置的單一真相來源（沿用圖鑑的做法）
 *
 * astro.config.mjs 與 src/data/site.ts 都從這裡讀，避免兩邊漂移。
 * 官網走自訂子網域 studio.hallucination28.com（public/CNAME + Actions Variable SITE_ORIGIN），
 * base 一律 '/'。本機 build 沒設環境變數時，用下面的預設值（與正式站一致）。
 */

function normalizeBase(raw) {
  if (!raw || raw === '/') return '/';
  return '/' + raw.replace(/^\/+|\/+$/g, '');
}

export const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://studio.hallucination28.com').replace(/\/+$/, '');
try {
  const u = new URL(SITE_ORIGIN);
  if (!/^https?:$/.test(u.protocol)) throw new Error('protocol');
} catch {
  throw new Error(`SITE_ORIGIN 須為含 https:// 的完整網址（目前：「${SITE_ORIGIN}」）`);
}
export const BASE_PATH = normalizeBase(process.env.BASE_PATH ?? '/');

/** 完整站台 URL（含 base，無結尾斜線）：絕對連結、canonical、JSON-LD @id 一律用這個 */
export const SITE_URL = BASE_PATH === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${BASE_PATH}`;
