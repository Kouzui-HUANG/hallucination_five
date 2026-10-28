/**
 * 作品類別（受控詞彙）。content.config.ts 的 z.enum 與服務頁的「相關作品」都讀這裡。
 */
export const CATEGORY_SLUGS = ['commercial', 'mv', 'series', 'short', 'animation'] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: { slug: CategorySlug; label: string; labelEn: string }[] = [
  { slug: 'commercial', label: '廣告', labelEn: 'Commercial' },
  { slug: 'mv', label: 'MV', labelEn: 'Music Video' },
  { slug: 'series', label: '短劇', labelEn: 'Series' },
  { slug: 'short', label: '短片', labelEn: 'Short Film' },
  { slug: 'animation', label: '動畫', labelEn: 'Animation' },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
