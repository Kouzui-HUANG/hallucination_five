# 幻五娛樂 HALLUCINATION FIVE 官網

> 畫面交給 AI，故事留給人。

幻五娛樂科技股份有限公司的官方網站，正式網址 <https://studio.hallucination28.com/>。
Astro 6 靜態站，內容寫在 Markdown 與資料檔裡，push 到 `main` 就由 GitHub Actions 自動檢查、建置並部署到 GitHub Pages。

- 設計文件：[docs/plans/2026-10-28-hallucination-five-site-design.md](docs/plans/2026-10-28-hallucination-five-site-design.md)
- 首頁 mockup：[docs/mockups/home.html](docs/mockups/home.html)
- 目前階段：**P1（繁體中文版）**。日文版 `/ja/` 是 P2，原創 IP 與消息頁是 P3

---

## 這個網站在做什麼

幻五娛樂由黃宏瑞的**幻詠工作室**與林仲彥的 **5Y工作室**合夥成立，承接 AI 商業廣告、MV、平台短劇與影集製作，也提供 AI 影片課程、企業內訓與 AI 導入顧問。

網站只有一個任務：**讓來找 AI 影像製作的人，在三分鐘內看到作品、知道能委託什麼，然後送出洽詢。**

| 受眾 | 他們來找什麼 | 網站給的 |
|---|---|---|
| 品牌主、廣告代理商 | AI 廣告、產品 PV、展覽宣傳片 | 商業案例、交付規格、流程 |
| 短劇平台、製片 | 委製短劇、影集、主題曲 MV | 60 集平台短劇實績、自有 IP |
| 企業人資、學校、協會 | AI 影片內訓、講座 | 課程主題、講師經歷 |
| 想導入 AI 的企業 | 內容流程 AI 化 | 顧問方法、自動化產線 |

官網刻意**不是**部落格（內容行銷交給姊妹站[台灣AI影視創作者圖鑑](https://hallucination28.com/)）、不是課程販售平台（報名導向外部平台），也不賣自研工具。

**名字的由來**：「幻」取自幻詠，「五」取自 5Y。英文 HALLUCINATION 是生成式 AI 的「幻覺」：在 AI 圈它是要修掉的缺陷，在影像創作裡它是想像力的來源。

**公司名稱**：更名登記期間，法定名稱仍是「幻詠資訊有限公司」，頁尾顯示為「幻五娛樂科技股份有限公司（更名登記中，原幻詠資訊有限公司）」。核准後改 `src/data/site.ts` 的 `COMPANY` 即可全站切換。

---

## 網站內容

### 頁面

建置後共 24 個頁面加上 404：

| 路由 | 內容 |
|---|---|
| `/` | Hero（作品劇照牆、可暫停）→ 精選作品 → 數字 → 四項服務 → 製作流程 → 獲獎紀錄 → 創辦人 →（合作夥伴）→ 洽詢 |
| `/works/` | 全部作品，依發表日新到舊，可依類別篩選（沒有 JS 時全部顯示） |
| `/works/<slug>/` | 作品頁：影片、片長、導演、製作名單、使用工具、獲獎（12 頁） |
| `/services/` | 服務總覽與製作流程 |
| `/services/<slug>/` | 單項服務：適合誰、交付內容、相關作品（商業、短劇）或課程（內訓）、常見問題（4 頁） |
| `/about/` | 名字的由來、沿革、我們相信的事、創辦人、公司資訊、相關計畫 |
| `/team/<slug>/` | 創辦人頁：數字、專長、時間軸、作品與獲獎（2 頁） |
| `/contact/` | 洽詢：依服務分類的 Email 範本（預填主旨與欄位）；`?service=<slug>` 會把該服務排在第一個 |
| `/privacy/` | 隱私權政策（本站不用分析工具、不設追蹤 cookie） |

主選單只有四項：作品／服務／關於／聯絡。課程不放主選單，放在服務底下。

### 四項服務

資料在 `src/data/services.mjs`，每項都有交付內容與常見問題（同時輸出 FAQPage 結構化資料）。

| # | 服務 | 範圍 | 對象 |
|---|---|---|---|
| 01 | 商業影片製作 `commercial` | 廣告・品牌形象片・產品 PV・展覽與活動宣傳・MV | 品牌主、廣告代理商、展覽與活動主辦 |
| 02 | 短劇與影集 `series` | 平台短劇委製・影集與短片・原創 IP 共同開發・主題曲 MV | 短劇平台、製片公司、IP 方 |
| 03 | 課程與企業內訓 `training` | AI 商業廣告實作・AI 影片製作入門・企業內訓與講座 | 企業人資與培訓單位、學校、公協會 |
| 04 | AI 導入顧問 `consulting` | 生成式 AI 導入行銷流程・自動化內容產線（n8n）・知識內容轉譯 | 想把 AI 用進日常工作的企業與團隊 |

### 製作流程

首頁與服務總覽共用。標 ★ 的兩步是幻五方法的重點：

1. **需求訪談** BRIEF：確認用途、受眾、片長、預算與交付規格
2. **腳本與分鏡** SCRIPT：先把故事寫好，再決定哪些畫面交給 AI
3. **3D 動態預演** PREVIS ★：用輕量 3D 搭出鏡頭運動與角色走位，當成生成的動態參考
4. **角色與場景設定** DESIGN ★：先做角色設定表與場景美術，鎖住整部片的一致性
5. **生成與篩選** GENERATE：每一格畫面都由人挑選、重生成與調整
6. **剪輯・配樂・交付** FINISH：剪輯、配樂、字幕與調色，依平台規格交付

### 作品（12 件）

依發表日新到舊排列（截至 2026-10-28）。★ 是首頁精選，數字是精選順序，1 號是大卡。

| 發表日 | 作品 | 類別 | 片長 | 導演 | 委託／平台 | 獲獎 |
|---|---|---|---|---|---|---|
| 2026-10-22 | 如果我們沒有分開・主題曲 MV | MV | 04:12 | 林仲彥 | 金魚短劇 KIMHIT | |
| 2026-10-16 | 歡迎來到百日生存率47%的星球 EP01 | 短劇 | 03:53 | 黃宏瑞 | | |
| 2026-09-04 | ★2 墨儀問靈：八方借命 EP01 | 短劇 | 全 30 集 | 林仲彥 | 金魚短劇 KIMHIT | |
| 2026-08-31 | ★1 間合 Maai | 短片 | 08:29 | 黃宏瑞、林仲彥 | | GMI Cloud × Wan × DV ASIA AI 影視職人創作大賽 第二名 |
| 2026-05-17 | 粽乩：天迴（預告） | 短劇 | 01:30 | 林仲彥 | | |
| 2026-05-08 | ★4 粽乩 EP1：豬母夜哭 | 短劇 | 03:55 | 林仲彥 | | AI London Film Festival 入圍 |
| 2026-02-13 | 絡繰月詠 | MV | 02:31 | 黃宏瑞 | | |
| 2025-11-17 | ★5 與AI共學 EP01：期末考試 | 動畫 | 03:40 | 黃宏瑞 | | 愛奇藝 AI 短片創作大賽 三等獎 |
| 2025-10-20 | ★3 メモリー・ショップの黄昏 ～売られた夏とAIの歌～ | MV | 02:44 | 黃宏瑞 | | Bouquet wiz AI MV 專業賽 第一名 |
| 2025-09-11 | ★6 島嶼藝視界－台灣當代美術凡爾賽特展 | 廣告 | 00:48 | 林仲彥 | 台灣藝術家法國沙龍學會 | |
| 2025-09-11 | Comfilife 吊扇廣告 | 廣告 | 00:44 | 林仲彥 | Comfilife | |
| 2025-09-11 | 超美型寵物工作坊 | 廣告 | 00:50 | 林仲彥 | 超美型寵物工作坊 | |

類別分布：短劇 4、廣告 3、MV 3、短片 1、動畫 1。作品頁標出的 AI 工具有 Seedance、Suno、Stable Diffusion、GPT Image、Wan、Vidu、Codex。

### 獲獎紀錄

首頁與創辦人頁的獲獎區由 `src/data/queries.ts` 自動彙整：作品的 `awards` 加上創辦人的 `extraAwards`（沒有作品頁的獎項）。名次與等第獎算「獲獎」，入圍與入選另計。目前是 **4 座獲獎、3 項入圍與入選**：

- 2026　GMI Cloud × Wan × DV ASIA AI 影視職人創作大賽　第二名　《間合》
- 2026　AI London Film Festival　入圍　《粽乩 EP1：豬母夜哭》
- 2025　Bouquet wiz AI MV 專業賽　第一名　《メモリー・ショップの黄昏》
- 2025　臺北生成藝術節 貼圖組　第三名　《跑著玩臺北》
- 2025　愛奇藝 AI 短片創作大賽　三等獎　《與AI共學 EP01》
- 2025　Artiver AI Art Awards　決賽入圍　《五元有緣》
- 2025　Artiver AI Art Awards　入選

### 創辦人

| | 黃宏瑞 Huang Hung-jui | 林仲彥 Lin Chung-yen |
|---|---|---|
| 職稱 | 共同創辦人・編劇／導演 | 共同創辦人・導演／3D 動態 |
| 一句話 | 從提示詞研究走進影像，角色設定先行的編劇與導演 | 以 3D 動態預演驅動 AI 生成的導演 |
| 背景 | 台大日文系、東京大學教育學研究科碩士；曾任數位學習公司影音後製主管、日系企管顧問公司 AI 導入顧問 | 13 年 3D 與數位影像資歷，網路上以「粽子」「漫步深淵」為名 |
| 代表作 | 《メモリー・ショップの黄昏》《與AI共學》《絡繰月詠》 | 《粽乩》宇宙、金魚短劇兩部各 30 集、商業廣告 |
| 專長 | 編劇、日文 MV、角色一致性、AI 導入顧問、中日雙語 | 導演、3D 動態預演、平台短劇、商業廣告、AI 廣告課程 |

### 課程

課程報名一律導向外部平台，沒有網址的課程不顯示。目前有林仲彥的「AI 商業廣告公開課」與「AI 商業廣告實作班」（`src/data/courses.mjs`）。

---

## 設計

視覺隱喻是**暗房與放映**，刻意和圖鑑（年鑑、報紙）區隔：

- **色彩**：只做深色版。底色「顯影液黑」`#0e0e10`、文字「相紙白」`#f1ede6`、accent「安全燈紅」`#ff4d3d`。紅色每個畫面最多三處，紅底上的字一律用黑色（白字對比不足）
- **字體**：拉丁字用 Archivo 可變字體（Google Fonts），中文用系統黑體，不載中文網路字型。片長一律寫成時間碼（`08:29`）
- **顯影互動**：作品格網的縮圖預設是低亮度黑白，滑鼠移上或鍵盤聚焦時 0.6 秒內顯影成全彩，像相紙在顯影液裡浮出影像，也像 AI 從雜訊裡生成畫面。只在可 hover 的裝置啟用
- **無障礙**：Hero 動態有暫停鈕、`prefers-reduced-motion` 時取消動態、跳至主要內容連結、明顯的 `:focus-visible`、對比 AA 以上
- **影片**：YouTube 一律用 lite facade，按下播放才載入 `youtube-nocookie.com` 的 iframe

色彩與字體 token 在 `src/styles/global.css` 的 `:root`。

---

## SEO 與 AI 搜尋

- **結構化資料**：全站 Organization、WebSite、BreadcrumbList；作品頁 VideoObject；服務頁 Service ＋ FAQPage；創辦人頁 ProfilePage ＋ Person；作品與服務總覽 ItemList。Organization 的 `alternateName` 收了新舊公司名與兩個工作室名，搜尋舊名也找得到
- **sitemap**：`@astrojs/sitemap` 產生，`<lastmod>` 依內容計算：作品頁用發表日、創辦人頁用 `updatedAt`、其他頁用對應檔案的 git 最後提交日。`noindex` 的頁面自動排除
- **llms.txt**：建置時產生 `llms.txt`（目錄）、`llms-full.txt`（全文）、`llms-ctx.txt`（XML），頁面清單在 `src/data/llms-pages.mjs`
- **robots.txt**：明確允許 GPTBot、ClaudeBot、PerplexityBot、Google-Extended 等 AI 爬蟲，讓有人問 AI「台灣有哪些 AI 廣告製作公司」時被引用

---

## 技術架構

| 項目 | 內容 |
|---|---|
| 框架 | Astro 6（`output: 'static'`） |
| Node | 22.12.0 以上（`.node-version`） |
| 依賴 | `@astrojs/sitemap`、`sharp`（圖片與品牌資產）、`js-yaml`（Node 端讀 frontmatter） |
| 內容 | Astro Content Collections：`works`、`team`，schema 用 zod 驗證 |
| 部署 | GitHub Actions → GitHub Pages，自訂網域 `studio.hallucination28.com` |
| 分析工具 | 沒有，所以不需要 cookie 同意視窗 |

### 目錄

```
.
├── .github/workflows/deploy.yml   # push main → 內容檢查 → 建置 → 部署
├── astro.config.mjs               # sitemap lastmod、llms.txt integration
├── site.config.mjs                # SITE_ORIGIN / BASE_PATH 的單一真相來源
├── docs/                          # 設計文件與首頁 mockup
├── public/                        # CNAME、favicon、logo、OG 預設圖
├── scripts/
│   ├── check-integrity.mjs        # npm run check
│   └── gen-brand-assets.mjs       # npm run brand-assets
└── src/
    ├── content.config.ts          # works / team 的 schema
    ├── content/
    │   ├── works/<slug>.md        # 作品；縮圖在 works/thumbs/<slug>.jpg
    │   └── team/<slug>/index.md   # 創辦人；同資料夾放 portrait.jpg
    ├── data/
    │   ├── site.ts                # 站名、信箱、社群、公司登記資料、路由 helper、主選單
    │   ├── services.mjs           # 四項服務、交付內容、FAQ、製作流程
    │   ├── courses.mjs            # 課程
    │   ├── clients.mjs            # 合作夥伴
    │   ├── categories.ts          # 作品類別（受控詞彙）
    │   ├── queries.ts             # 頁面唯一的資料入口
    │   └── llms-pages.mjs         # llms.txt 頁面清單
    ├── components/                # WorkCard、DevCard、VideoFacade、AwardsList…
    ├── layouts/BaseLayout.astro   # <head>、全站 JSON-LD、header、footer
    ├── pages/                     # 路由
    └── styles/global.css          # 色彩與字體 token
```

### 資料流

- 頁面一律從 `getSiteData()`（`src/data/queries.ts`）拿資料，不直接呼叫 `getCollection`。這裡統一做草稿過濾、排序、精選挑選、作品 → 創辦人反查與獲獎彙整
- 關聯只做單向：作品的 `directors` 指向 `team`；創辦人頁的作品列表在建置時反查
- 站內連結一律經過 `routes.*` / `href()` 加上 base，絕對網址用 `absRoutes.*`，不要手拼字串
- `services.mjs`、`courses.mjs`、`clients.mjs` 寫成 `.mjs`，因為 `astro.config.mjs` 與檢查腳本是純 Node，不能 import TS

---

## 指令

```bash
npm install
npm run dev        # 本機開發（http://localhost:4321）
npm run check      # 內容防呆：缺欄位、日期沒加引號、縮圖不存在…有錯就不部署
npm run build      # 輸出到 dist/，同時產生 sitemap 與 llms.txt
npm run preview    # 預覽 dist/
npm run brand-assets  # 重新產生 favicon、logo.png、og-default.png
```

---

## 改內容要動哪裡

| 要改的東西 | 檔案 |
|---|---|
| 作品 | `src/content/works/<slug>.md`，縮圖放 `src/content/works/thumbs/<slug>.jpg`（1280×720） |
| 創辦人 | `src/content/team/<slug>/index.md` 與同資料夾的 `portrait.jpg`（4:5） |
| 四項服務、製作流程、常見問題 | `src/data/services.mjs` |
| 課程 | `src/data/courses.mjs` |
| 合作夥伴（客戶同意後才把 `approved` 改成 `true`） | `src/data/clients.mjs` |
| 公司名稱、統一編號、信箱、洽詢表單、社群帳號 | `src/data/site.ts` 的 `SITE` 與 `COMPANY` |
| 首頁的數字區 | `src/pages/index.astro` 的 `stats` |
| 關於頁的沿革與「我們相信的事」 | `src/pages/about.astro` 的 `history` 與 `beliefs` |

### 新增一件作品

```yaml
---
title: "作品名稱"
slug: "my-work"                # 與檔名相同
category: "commercial"         # commercial | mv | series | short | animation
year: 2026
releasedAt: "2026-10-28"       # 一定要加引號
durationSec: 90                # 連續劇改填 episodes: 30
videoUrl: "https://www.youtube.com/watch?v=..."  # 不能公開影片時留空，改給 stills
thumb: "./thumbs/my-work.jpg"
thumbAlt: "縮圖的文字描述"
directors: ["lin-chung-yen"]   # 第一位是主要導演
client: "委託方"                # 選填
platform: "上架平台"            # 選填
tools: ["Seedance", "Suno"]
synopsis: "一段話的作品介紹。"
awards:
  - year: 2026
    title: "比賽名稱"
    result: "第一名"            # 第一名／第二名／第三名／三等獎／決賽入圍／入圍／入選
featured: false                # 首頁精選最多 6 件
order: 7                       # 精選排序，1 是大卡
---
```

完整欄位與驗證規則見 `src/content.config.ts`。檔名以 `_` 開頭或 `draft: true` 的作品不會上線。

### 內容防呆

`npm run check` 在 CI 建置前執行：

- **錯誤（擋部署）**：frontmatter 缺欄位、日期沒加引號、縮圖或肖像檔不存在、導演或製作名單指到不存在的成員、作品沒有影片也沒有劇照、精選超過 6 件或排序重複、服務 slug 重複
- **提醒（不擋部署）**：上線前要補的資料，見下方清單

---

## 上線前要補的

- [ ] 統一編號（`COMPANY.taxId`）
- [ ] 兩位創辦人的真人照片（目前是圖鑑用的頭像）
- [ ] 服務頁常見問題的措辭確認（著作權、肖像授權那幾題建議請律師看過）
- [ ] 林仲彥確認自己的介紹與時間軸
- [ ] 更名核准後：`COMPANY.legalName` 改成新名、`renamePending` 改成 `false`
- [ ] 洽詢用的 Google 表單（`SITE.contactFormUrl`；留空時聯絡頁使用 Email 範本）
- [ ] 合作夥伴取得授權後把 `approved` 改成 `true`（一筆都沒有時首頁不顯示該區）
- [ ] 公司社群帳號（`SITE.social`）
- [ ] 黃宏瑞的線上課程連結（`src/data/courses.mjs`）

---

## 部署

push 到 `main`（或手動觸發 workflow）就會跑：`npm ci` → `npm run check` → `npm run build` → 上傳 `dist/` 到 GitHub Pages。有設 Actions Variable `SITE_ORIGIN` 時用自訂網域，沒設時退回 `https://<owner>.github.io/<repo>/`。

第一次設定：

1. GitHub 建 public repo，推上 main
2. Settings → Pages → Source 選「GitHub Actions」
3. Settings → Secrets and variables → Actions → Variables 新增 `SITE_ORIGIN = https://studio.hallucination28.com`
4. Squarespace DNS 只新增一筆 CNAME：`studio` → `kouzui-huang.github.io.`（MX、SPF、DKIM、apex 的 A 記錄都不要動）
5. GitHub 帳號設定 → Pages → Verified domains 驗證 `hallucination28.com`
6. repo 的 Pages 設定填 `studio.hallucination28.com`，勾 Enforce HTTPS
7. Search Console 新增資源並提交 `sitemap-index.xml`

---

## 接下來

- **P2**：日文版（`/ja/` 首頁、服務、關於、創辦人、聯絡；作品頁維持繁中）
- **P3**：原創 IP 頁 `/originals/`（粽乩宇宙等）、消息頁 `/news/`

現階段不做：線上付款與金流、會員與後台 CMS（維持 Markdown ＋ git）、英文版、大量內容行銷文章。
