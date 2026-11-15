/**
 * 課程清單（課程與企業內訓頁）。報名一律導向外部平台；沒有 url 的不顯示。
 * 黃宏瑞的線上課連結待補（設計文件 §12 #7）。
 * titleJa／kindJa／formatJa 是日文頁的顯示文字；課程本身是中文授課。
 */
export const COURSES = [
  {
    title: 'AI 商業廣告公開課',
    kind: '限時免費・公開課',
    instructor: 'lin-chung-yen',
    format: '實體',
    titleJa: 'AI商業広告 公開講座',
    kindJa: '期間限定無料・公開講座',
    formatJa: '対面・中国語',
    url: 'https://straightamedia.com/courses/ai-commercial-ad-free',
  },
  {
    title: 'AI 商業廣告實作班',
    kind: '實戰工作坊',
    instructor: 'lin-chung-yen',
    format: '實體',
    titleJa: 'AI商業広告 実践クラス',
    kindJa: '実践ワークショップ',
    formatJa: '対面・中国語',
    url: 'https://straightamedia.com/courses/ai-commercial-ad-workshop',
  },
];
