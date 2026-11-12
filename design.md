# Design: 幻五映像 HALLUCINATION FIVE

鎖定的設計系統。Hallmark 每次執行都先讀這份，全站頁面共用它；要改就有意識地改這份檔案。

## System
- Genre: atmospheric（影像、暗色、生成式）
- Shape of the first page: kept（2026-11 的 restyle 保留原版面與段落順序）
- Theme: brand（vibe: "暗房與放映，相紙在顯影液裡浮出影像"）
- Axes: dark/high-contrast-serif/warm · posture: kept

## Tokens
`src/styles/tokens.css` 是唯一來源。角色對應：
```css
:root {
  --color-paper: #0e0e10 /* 顯影液黑 */;  --color-paper-2: #17171a;  --color-paper-3: #1f1f23;
  --color-ink: #f1ede6 /* 相紙白 */;  --color-ink-2: #cfcac2;  --color-muted: #a19c94;  --color-rule: #2a2a2f;
  --color-accent: #ff4d3d /* 安全燈紅 */;  --color-accent-ink: #0e0e10;  --color-focus: #ff4d3d;
  --font-display: "Noto Serif TC" 900, 系統黑體;  --font-body: 系統黑體（PingFang TC、Noto Sans TC、微軟正黑體）;  --font-outlier: "Archivo"（數字、時間碼、拉丁字）;
  --radius-card: 0;  --radius-pill: 50%（只用在圓形播放鈕）;  --rule-hair: 1px;  --shadow-card: none;
}
```
間距用 Hallmark 共用尺度（`--space-*`），其餘間距一律落在 4px 格線上；字級、動態時間也在 `tokens.css`。

## Rules
- 品牌三色不改。紅色每個畫面最多三處，紅底上的字用 `--accent-ink`。
- 標題（h1、h2、`.f-display`）用 Noto Serif TC 900；build 時只下載用到的字（`astro.config.mjs` 的 `display-font-subset`）。內文用系統黑體，不載中文網路字型。
- 標籤只有一種：`.label`（內文字體、13px、不加字距、不轉大寫）。不用英文大寫眉標、不用區塊編號、不在連結文字後面接箭頭。
- 數字與時間碼用 `.num`（Archivo 等寬數字），不用等寬字型當裝飾。大數字用 `--font-figure`：數字 Archivo，中文落到標題字。
- 中文只在詞組邊界換行：build 時插入 `<wbr>`（`astro.config.mjs` 的 `phrase-breaks`，BudouX 與 ICU 詞典都同意的位置），配合 `word-break: keep-all`。個別詞組仍可用 `.nobr`。
- 不用畫出來的實物道具（底片齒孔、瀏覽器外框）；流程條只用髮絲線與底色分格。
- 列舉用頓號「、」。間隔號「・」只放在兩個並列的名稱之間（人名、鏡頭運動與景別），不串三項以上；資訊列的年份、類別、時間碼各自一格。
- 圖示只用 `src/components/Icon.astro` 的 inline SVG，不用 ▶ ✉ ↗ 這類字元。
- 元件裡不寫色碼與字體名，一律用 token。

## Controls
- Primary: 安全燈紅實心 · 2px 圓角 · 48px 高（大 52、小 44）
- Secondary: 相紙白 35% 外框 · 同圓角與高度
- 選單裡的「專案洽詢」：首頁（hero 已有紅色主按鈕）與聯絡頁用 secondary，其他內頁用 primary；手機的「選單」不加外框

## Motion
- Character: calm；只用 opacity、transform、filter（顯影 0.6 秒）。減少動態時全部一次結束。
- Hero 背景劇照牆可暫停；每個 hover 只有一種回饋，圖片本身不放大。

## Exports
`src/styles/tokens.css`（本專案）。需要 Tailwind、DTCG 或 shadcn 格式時再另外加。
