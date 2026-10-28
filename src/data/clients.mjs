/**
 * 合作過的品牌與平台（首頁「合作夥伴」區）。
 *
 * 只有 approved: true 的才會顯示；一筆都沒有時整區不渲染（設計文件 §11 #6）。
 * 取得對方同意後把 approved 改成 true。只列名稱，不放 logo，除非對方提供。
 */
export const CLIENTS = [
  { name: '金魚短劇 KIMHIT', approved: false },
  { name: 'Comfilife', approved: false },
  { name: '超美型寵物工作坊', approved: false },
  { name: '台灣藝術家法國沙龍學會', approved: false },
  { name: '古寶無患子', approved: false },
];
