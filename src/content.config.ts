import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './data/categories';

/**
 * 兩個 collection：works（作品）、team（創辦人與成員）
 *
 * 關聯只做單向：work → team（directors）。創辦人頁的作品列表在 build 時反查 works。
 * entry id 規則：works/<slug>.md → <slug>；team/<slug>/index.md → <slug>
 * 日期一律寫成加引號的 "YYYY-MM-DD" 字串（不加引號 YAML 會轉成 Date）。
 */

const stripId = ({ entry }: { entry: string }) =>
  entry.replace(/\/index\.md$/, '').replace(/\.md$/, '');

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式須為 "YYYY-MM-DD"');

const award = z.object({
  year: z.number().int(),
  title: z.string(),
  result: z.string(),
});

const works = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*.md'], base: './src/content/works', generateId: stripId }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        slug: z.string(),
        category: z.enum(CATEGORY_SLUGS),
        year: z.number().int(),
        releasedAt: isoDate,
        durationSec: z.number().int().positive().optional(),
        /** 連續劇的總集數（作品頁與卡片顯示「全 N 集」） */
        episodes: z.number().int().positive().optional(),
        /** YouTube／Vimeo。客戶案不能公開影片時留空，改給 stills（設計文件 §5） */
        videoUrl: z.string().url().optional(),
        thumb: image(),
        thumbAlt: z.string(),
        stills: z.array(z.object({ src: image(), alt: z.string() })).optional(),
        /** 公司成員（reference team）；第一位是主要導演 */
        directors: z.array(reference('team')).min(1),
        /** 完整製作名單：公司成員填 team，外部協作者填 name（可附 url） */
        credits: z
          .array(
            z.object({
              role: z.string(),
              team: z.string().optional(),
              name: z.string().optional(),
              url: z.string().url().optional(),
            }),
          )
          .default([]),
        client: z.string().optional(),
        platform: z.string().optional(),
        tools: z.array(z.string()).default([]),
        synopsis: z.string(),
        awards: z.array(award).default([]),
        featured: z.boolean().default(false),
        /** 首頁精選與作品總覽的排序（小的在前）；沒填的依發表日新到舊 */
        order: z.number().int().optional(),
        draft: z.boolean().default(false),
      })
      .refine((w) => w.videoUrl || (w.stills && w.stills.length > 0), {
        message: '沒有 videoUrl 時必須提供 stills',
      }),
});

const team = defineCollection({
  loader: glob({ pattern: ['*/index.md'], base: './src/content/team', generateId: stripId }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      nameEn: z.string(),
      slug: z.string(),
      order: z.number().int(),
      /** 網路上的別名（Person.alternateName） */
      alias: z.array(z.string()).default([]),
      /** 頁面顯示用（共同創辦人・導演／3D 動態） */
      role: z.string(),
      /** schema 的 jobTitle */
      jobTitle: z.string(),
      tagline: z.string(),
      /** 首頁與關於頁的人物卡短介 */
      summary: z.string(),
      seoTitle: z.string(),
      description: z.string().max(160),
      portrait: image(),
      portraitAlt: z.string(),
      specialties: z.array(z.string()).default([]),
      numbers: z
        .array(
          z.object({
            value: z.string(),
            unit: z.string().optional(),
            label: z.string(),
            note: z.string().optional(),
          }),
        )
        .default([]),
      timeline: z
        .array(z.object({ year: z.string(), title: z.string(), note: z.string().optional() }))
        .default([]),
      /** 沒有對應作品頁的獎項（例如貼圖、未收錄的作品） */
      extraAwards: z.array(award.extend({ work: z.string().optional() })).default([]),
      alumniOf: z.array(z.string()).default([]),
      knowsLanguage: z.array(z.string()).default([]),
      sameAs: z
        .object({
          youtube: z.string().url().optional(),
          instagram: z.string().url().optional(),
          threads: z.string().url().optional(),
          facebook: z.string().url().optional(),
          website: z.string().url().optional(),
          /** 台灣AI影視創作者圖鑑的條目網址（設計文件 §8） */
          directory: z.string().url().optional(),
        })
        .default({}),
      updatedAt: isoDate,
    }),
});

export const collections = { works, team };
