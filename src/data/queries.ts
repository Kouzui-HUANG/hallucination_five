/**
 * 唯一的資料入口：頁面一律從 getSiteData() 拿資料，不要自己 getCollection。
 * 這裡做了 draft 過濾、排序、作品 → 成員反查與獲獎彙整。
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;
export type Member = CollectionEntry<'team'>;

export type AwardRow = {
  year: number;
  title: string;
  result: string;
  /** 作品名（作品頁沒收的獎項只有名稱、沒有 slug） */
  workTitle?: string;
  workSlug?: string;
  /** 得獎的公司成員 slug */
  people: string[];
  /** 名次與等第獎算「獲獎」，入圍與入選不算 */
  winner: boolean;
};

export type SiteData = {
  works: Work[];
  team: Member[];
  teamById: Map<string, Member>;
  featured: Work[];
  awards: AwardRow[];
};

/** 獎項排序：同年份依名次高低 */
const RESULT_RANK: Record<string, number> = {
  第一名: 1,
  第二名: 2,
  第三名: 3,
  三等獎: 4,
  決賽入圍: 5,
  入圍: 6,
  入選: 7,
};

const isWinner = (result: string) => !/入圍|入選/.test(result);

let cache: Promise<SiteData> | null = null;

export function getSiteData(): Promise<SiteData> {
  return (cache ??= load());
}

async function load(): Promise<SiteData> {
  const works = (await getCollection('works', (w) => !w.data.draft)).sort((a, b) =>
    b.data.releasedAt.localeCompare(a.data.releasedAt),
  );
  const team = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
  const teamById = new Map(team.map((t) => [t.id, t]));

  const featured = works
    .filter((w) => w.data.featured)
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    .slice(0, 6);

  const awards: AwardRow[] = [
    ...works.flatMap((w) =>
      w.data.awards.map((a) => ({
        ...a,
        workTitle: w.data.title,
        workSlug: w.data.slug,
        people: w.data.directors.map((d) => d.id),
        winner: isWinner(a.result),
      })),
    ),
    ...team.flatMap((m) =>
      m.data.extraAwards.map((a) => ({
        year: a.year,
        title: a.title,
        result: a.result,
        workTitle: a.work,
        people: [m.id],
        winner: isWinner(a.result),
      })),
    ),
  ].sort((a, b) => b.year - a.year || (RESULT_RANK[a.result] ?? 9) - (RESULT_RANK[b.result] ?? 9));

  return { works, team, teamById, featured, awards };
}

/** 某位成員參與導演的作品 */
export function worksByMember(works: Work[], slug: string): Work[] {
  return works.filter((w) => w.data.directors.some((d) => d.id === slug));
}

/** 作品的導演（公司成員） */
export function directorsOf(work: Work, teamById: Map<string, Member>): Member[] {
  return work.data.directors.map((d) => teamById.get(d.id)).filter((m): m is Member => !!m);
}

/** 某位成員的獲獎（作品獎＋個人額外獎項） */
export function awardsOf(awards: AwardRow[], slug: string): AwardRow[] {
  return awards.filter((a) => a.people.includes(slug));
}

/* ── 影片 URL 解析（沿用圖鑑） ─────────────────────────── */
export type VideoInfo = {
  provider: 'youtube' | 'vimeo' | 'unknown';
  id: string | null;
  embedUrl: string | null;
  watchUrl: string;
};

export function parseVideoUrl(url: string): VideoInfo {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return { provider: 'unknown', id: null, embedUrl: null, watchUrl: url };
  }
  const host = u.hostname.replace(/^www\./, '');

  if (['youtube.com', 'm.youtube.com', 'youtu.be', 'youtube-nocookie.com'].includes(host)) {
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0] || null;
    else if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v');
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/);
      if (m) id = m[1];
    }
    if (id) {
      return {
        provider: 'youtube',
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
      };
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([0-9a-f]+))?\/?$/i);
    if (m) {
      const hash = m[2] ?? u.searchParams.get('h') ?? '';
      return {
        provider: 'vimeo',
        id: m[1],
        embedUrl: `https://player.vimeo.com/video/${m[1]}?${hash ? `h=${hash}&` : ''}autoplay=1`,
        watchUrl: `https://vimeo.com/${m[1]}${hash ? `/${hash}` : ''}`,
      };
    }
  }

  return { provider: 'unknown', id: null, embedUrl: null, watchUrl: url };
}

/* ── 格式化 ─────────────────────────── */

/** 片長寫成時間碼：509 → 08:29、3725 → 1:02:05 */
export function fmtDuration(sec?: number): string | null {
  if (!sec) return null;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** ISO 8601 duration（VideoObject.duration） */
export function isoDuration(sec?: number): string | null {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `PT${m ? `${m}M` : ''}${s}S`;
}

/** 2026-08-31 → 2026.08.31 */
export function fmtDate(iso: string): string {
  return iso.replace(/-/g, '.');
}

/** 卡片 metadata 行：2026・短片・08:29（連續劇顯示「全 30 集」） */
export function workMetaParts(work: Work, label: (slug: string) => string): string[] {
  const { year, category, durationSec, episodes } = work.data;
  const parts = [String(year), label(category)];
  if (episodes) parts.push(`全 ${episodes} 集`);
  else {
    const d = fmtDuration(durationSec);
    if (d) parts.push(d);
  }
  return parts;
}
