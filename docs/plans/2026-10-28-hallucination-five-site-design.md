---
id: DESIGN-H5-001
title: 幻五娛樂 HALLUCINATION FIVE 官網 — 設計文件
version: v0.1
status: draft
created: 2026-10-28
updated: 2026-10-28
網址: https://studio.hallucination28.com/
地基來源: ../ai-film-maker-collection（台灣AI影視創作者圖鑑，Astro 6）— 只繼承地基，不繼承視覺
changelog:
  - v0.1 (2026-10-28): 初版 — 定位、資訊架構、頁面、內容盤點、資料模型、視覺方向、SEO、部署、待決事項
  - v0.2 (2026-10-28): P1 繁中版實作完成（25 頁）。§11 待決事項全部照建議執行；作品收 12 件，另排除《椰香乖乖虎》（片名用了「乖乖」商標）、《帶著夜色成為光》（作者自述未完成的一分鐘版）、食育兒歌《海鮮漁樂船》（不確定是否為客戶案），待確認後再加
---

# 幻五娛樂 HALLUCINATION FIVE 官網 — 設計文件

## 0. 專案定位

幻五娛樂科技股份有限公司的官方網站，由幻詠工作室與 5Y工作室（5Y Studio）合夥成立。網站的任務是**讓來找 AI 影像製作的人，在三分鐘內看到作品、知道能委託什麼，然後送出洽詢**。

### 0-1 已定案（2026-10-28 與站主確認）

| 面向 | 決策 |
|---|---|
| 網址 | `https://studio.hallucination28.com/`（子網域，與圖鑑分站） |
| 品牌名稱 | 中文「幻五娛樂」、英文「HALLUCINATION FIVE」；法定全名放頁尾與關於頁 |
| 兩個工作室 | **統一成幻五**：作品標導演名，「幻詠」「5Y」寫進沿革與 schema 的 `alternateName` |
| 服務範圍 | 四項全做：商業影片製作、短劇與影集製作、課程與企業內訓、AI 導入顧問 |
| 語言 | 繁中＋日文（繁中為預設、無前綴；日文在 `/ja/`） |
| 技術 | Astro 6 static ＋ GitHub Pages，新 repo，沿用圖鑑的地基程式 |

### 0-2 受眾與轉換目標

| 受眾 | 他們來找什麼 | 網站要給的 | 轉換 |
|---|---|---|---|
| 品牌主、廣告代理商 | AI 廣告、產品 PV、展覽宣傳片 | 商業案例、交付規格、流程與交期 | 專案洽詢 |
| 短劇平台、製片 | 委製短劇、影集、主題曲 MV | 60 集平台短劇實績、自有 IP | 專案洽詢 |
| 企業人資、學校、協會 | AI 影片內訓、講座 | 課程主題、講師經歷 | 內訓洽詢 |
| 想導入 AI 的企業 | 內容流程 AI 化 | 顧問方法、自動化產線案例 | 顧問洽詢 |
| 日本客戶 | 台灣的 AI 映像製作 | 日文版首頁、服務、聯絡 | 日文洽詢表單 |

**明確不是什麼：**
- ❌ 部落格或媒體：內容行銷交給圖鑑，官網只放作品、服務與公司資訊
- ❌ 課程販售平台：課程報名一律導向外部平台
- ❌ 工具 SaaS：自研的內部工具不對外販售（見 §11 #5）

---

## 1. 品牌與命名

### 1-1 名稱層級

| 層級 | 用在哪裡 | 內容 |
|---|---|---|
| 品牌（站名） | 頁首 wordmark、`<title>`、WebSite schema `name` | 幻五娛樂 HALLUCINATION FIVE |
| 法定名稱 | 頁尾、關於頁公司資訊、Organization `legalName` | 依登記現況，見 1-2 |
| 舊名與別名 | 關於頁沿革、Organization `alternateName` | 幻詠資訊有限公司、幻詠工作室、幻詠 Gen Ai Studio、Hallucination Gen Ai Studio、5Y工作室、5Y Studio |

日文頁以英文品牌開頭（「HALLUCINATION FIVE（幻五）」），法定名稱照原文顯示、不改寫成日文漢字。

### 1-2 更名期間的顯示規則

有限公司改制為股份有限公司並更名，**核准之前，法定名稱仍是「幻詠資訊有限公司」**。發票、合約與頁尾的公司名稱都要跟登記一致，所以在 `site.ts` 放一個開關：

```ts
export const COMPANY = {
  brand: '幻五娛樂',
  brandEn: 'HALLUCINATION FIVE',
  legalName: '幻詠資訊有限公司',            // 核准後改成 幻五娛樂科技股份有限公司
  newLegalName: '幻五娛樂科技股份有限公司',
  renamePending: true,                     // 核准後改成 false
  taxId: '',                               // 統一編號（待提供）
};
```

`renamePending: true` 時，頁尾顯示「幻五娛樂科技股份有限公司（更名登記中，原幻詠資訊有限公司）・統一編號 ○○○○○○○○」；核准後只要改這一個檔。改制通常不換統一編號，實際以主管機關核准為準。

### 1-3 名字的由來（關於頁素材）

「幻」取自幻詠，「五」取自 5Y。英文的 HALLUCINATION 是生成式 AI 的「幻覺」：在 AI 圈它是缺陷，在影像創作裡它是想像力的來源。**5Y 的由來待林仲彥補充**。

### 1-4 標語草案（待定稿）

| 草案 | 日文 | 說明 |
|---|---|---|
| **畫面交給 AI，故事留給人。** | 映像はAIに、物語は人に。 | 推薦。呼應兩位創辦人對 AI 的共同主張，見下方說明 |
| AI 生成，人來導演。 | 生成はAI、演出は人。 | 更短，但比較像口號 |
| 把幻覺拍成故事。 | 幻覚を、物語に。 | 扣品牌名，但「幻覺」對客戶可能有負面聯想 |

兩人的共同主張：林仲彥說「故事的核心來自人生經驗，不是叫 AI 生成一個感人的故事」，黃宏瑞自稱「內容工廠導演：定義目標、讓 AI 執行、把關成品」。

---

## 2. 資訊架構與路由

### 2-1 路由表

| 繁中（預設） | 日文 | 內容 | 階段 |
|---|---|---|---|
| `/` | `/ja/` | 首頁 | P1／P2 |
| `/works/` | `/ja/works/` | 作品總覽（依類別篩選） | P1／P2 |
| `/works/<slug>/` | —（連回繁中頁） | 作品頁 | P1 |
| `/services/` | `/ja/services/` | 服務總覽 | P1／P2 |
| `/services/commercial/` | `/ja/services/commercial/` | 商業影片製作 | P1／P2 |
| `/services/series/` | `/ja/services/series/` | 短劇與影集 | P1／P2 |
| `/services/training/` | `/ja/services/training/` | 課程與企業內訓 | P1／P2 |
| `/services/consulting/` | `/ja/services/consulting/` | AI 導入顧問 | P1／P2 |
| `/about/` | `/ja/about/` | 關於幻五 | P1／P2 |
| `/team/<slug>/` | `/ja/team/<slug>/` | 創辦人頁（黃宏瑞、林仲彥） | P1／P2 |
| `/contact/` | `/ja/contact/` | 洽詢 | P1／P2 |
| `/privacy/` | `/ja/privacy/` | 隱私權政策 | P1／P2 |
| `/originals/` | — | 原創 IP（粽乩宇宙、平手條款…） | P3 |
| `/news/` | — | 消息（得獎、上映、開課） | P3 |

作品頁只做繁中：日文作品列表的卡片直接連到繁中作品頁並標「中国語ページ」。作品頁的主體是影片，翻譯投報率最低；日後某部作品要對日推廣，再補 `titleJa` / `synopsisJa` 單獨生成日文頁。

### 2-2 導覽

- 主選單：作品 Works／服務 Services／關於 About／聯絡 Contact，右側是語言切換「中｜日」與主要按鈕「專案洽詢」
- 課程不放主選單：放在「服務」下拉與首頁服務區，避免主選單超過五項
- 頁尾：四項服務、兩位創辦人、公司資訊、相關計畫（圖鑑）、隱私權、語言

---

## 3. 頁面設計

### 3-1 首頁

依序：

1. **Hero**：標語＋一句公司介紹＋兩個按鈕（觀看作品／專案洽詢）。背景放 showreel 循環短片，沒有 showreel 之前用作品劇照拼貼代替
2. **精選作品**：6 件，一大五小，卡片標年份・類別・片長（時間碼格式）與導演，有獲獎就加名次徽章
3. **數字列**：60 集平台短劇・4 座獎項＋3 項入圍・13 年 3D 數位影像・中日雙語（數字定稿前逐項核對，見 §4-2）
4. **四項服務**：大字清單，每項附「適合誰」與主要交付物
5. **製作流程**：六格底片式步驟，強調 3D 動態預演與角色設定先行（兩人各自的方法）
6. **獲獎紀錄**：年份｜賽事｜名次｜作品
7. **創辦人**：兩人肖像、職稱、一句定位，連到創辦人頁
8. **合作夥伴**：客戶與平台名稱（**授權確認前不上線**，見 §11 #6）
9. **CTA**：「有一個想拍的故事？」＋專案洽詢／內訓洽詢

### 3-2 作品

- `/works/`：一頁列完（目前約 15 件，不需要分批載入），類別篩選：廣告・MV・短劇・短片・動畫
- `/works/<slug>/`：影片（lite facade，點了才載入 YouTube iframe）、劇情簡介、製作名單、使用工具、客戶或平台、獲獎、相關作品
- 製作名單要如實標出外部協作者：《間合》是四人團隊，Evelyn Lin 與 cutcat 不是公司成員

### 3-3 服務頁（四頁共用版型）

1. 一句話定義＋適合誰
2. 交付內容與規格（例如廣告 15／30／60 秒、短劇 9:16 每集 1–3 分鐘）
3. 流程與一般交期
4. 相關作品（依類別自動帶出）
5. 常見問題：報價方式、修改次數、交期、**著作權與使用授權**、真人肖像與聲音、發票
6. CTA：連到洽詢表單，並用 Google 表單的預填參數帶入服務類型

各頁內容重點：

| 服務 | 重點 | 已知案例 |
|---|---|---|
| 商業影片製作 | 廣告、品牌片、產品 PV、展覽與活動宣傳、MV | 島嶼藝視界、Comfilife、超美型寵物工作坊、古寶無患子、林金田「離形心象」、Bouquet wiz MV 第一名 |
| 短劇與影集 | 平台短劇委製、自有 IP 共同開發、主題曲 MV | 墨儀問靈（30 集）、如果我們沒有分開（30 集＋MV）、粽乩、百日生存率47%的星球 |
| 課程與企業內訓 | 公開課（導向外部平台）、企業內訓主題、講座邀約 | 林仲彥：AI 商業廣告公開課、實作班；黃宏瑞：線上課（連結待補）、企業講師 |
| AI 導入顧問 | 生成式 AI 導入行銷與內容流程、自動化內容產線（Prompt Engineering × n8n）、知識內容轉譯（K-Media） | 黃宏瑞 2022–2024 日系企管顧問的 AI 導入經驗 |

著作權那題要寫得具體，這是企業客戶最在意、同業最少交代的地方：交付物的授權範圍寫進合約；只用有商用授權的工具與方案；不用未經同意的真人肖像與聲音。另外要先講清楚一個限制：Seedance 等模型不接受擬真人臉的參考素材，需要代言人入鏡的案子，製作方式會不同。**FAQ 的正式措辭要你們確認，必要時請律師看過。**

### 3-4 關於

公司簡介 → 名字的由來 → 沿革時間軸 → 我們相信的事 → 公司資訊表 → 相關計畫

- 沿革需要的日期：幻詠資訊成立日、5Y Studio 成立日、合夥成立日、更名核准日（見 §12）
- 我們相信的事（草案）：故事先於工具／每一格畫面都經過人工挑選／公開標示使用的 AI 工具／尊重肖像與著作權
- 公司資訊表：法定名稱（依 1-2 規則）、統一編號、創辦人、聯絡信箱；地址是否公開待定
- 相關計畫：寫明公司創辦人營運「台灣AI影視創作者圖鑑」並連過去（揭露方式見 §8）

### 3-5 創辦人頁（參考 heart2thriving 的「關於宏瑞」）

參考頁的區塊順序很適合拿來當人物頁：雙語區塊標題（About／On Stage／Track Record…）、數字、經歷卡、時間軸、理念、擅長。改成：

1. Hero：姓名（中・英・日）＋一句定位＋肖像
2. About・關於：300 字左右的故事
3. Numbers・數字：可驗證的數字（例如黃宏瑞「3 座 AI 競賽獎項」「台大日文 × 東大教育學」）
4. Works・代表作：依 `directors` 反查作品
5. Awards・獲獎
6. Timeline・經歷：黃宏瑞 2013 台大日文 → 2018 東大教育學研究科碩士 → 2019–2021 三貝德數位文創 → 2022–2024 日系企管顧問 → 2025 創立幻詠資訊 → 幻五；林仲彥的時間軸待本人提供
7. What I do・擅長：對應到四項服務
8. Elsewhere・其他連結：YouTube、Threads、Instagram、方格子／Portaly、**圖鑑條目**

### 3-6 聯絡

- 主體是 Google 表單（嵌入頁面，並附「在新分頁開啟」連結）；日文另做一份日文表單
- 欄位：姓名*、公司／單位、Email*、電話、服務類型*（四項＋其他）、預算範圍、期望交件日、專案說明*、參考影片連結、從哪裡得知我們
- 預算範圍（草案）：未定／10 萬以下／10–30 萬／30–100 萬／100 萬以上（新台幣）；日文表單改用萬円級距
- 頁面寫明回覆時間（例如兩個工作天內）與公司信箱

---

## 4. 內容盤點（2026-10-28 已查到的素材）

### 4-1 作品候選

| 作品 | 年 | 類別 | 導演 | YouTube ID | 備註 |
|---|---|---|---|---|---|
| 間合 Maai | 2026 | 短片 | 黃宏瑞（隊長・主編劇）、林仲彥（動態設計）等四人團隊 | `N9wCsl673pM` | GMI × Wan × DV ASIA 第二名，08:29 |
| 墨儀問靈：八方借命 EP01 | 2026 | 短劇 | 林仲彥 | `tV_8OacJVI4` | 金魚短劇 KIMHIT 委製，全 30 集 |
| 如果我們沒有分開・主題曲 MV | 2026 | MV | 林仲彥 | `BaVlJUfaQC4` | 金魚短劇 30 集都市劇的主題曲 |
| 粽乩 EP1：豬母夜哭 | 2026 | 短劇 | 林仲彥 | `3NawYqnUEuM` | AI London Film Festival 入圍 |
| 粽乩：天迴 | 2026 | 短劇 | 林仲彥 | `Qp8r3JxeB30` | 粽乩宇宙 |
| 歡迎來到百日生存率47%的星球 EP01 | 2026 | 短劇 | 黃宏瑞 | `Jp69un7FrRI` | 科幻短劇，2026-10 發表 |
| 絡繰月詠 | 2026 | MV | 黃宏瑞 | `uqAJNS-f3mc` | 賽博藝妓動漫 MV，02:31 |
| メモリー・ショップの黄昏 | 2025 | MV | 黃宏瑞 | `uY5PunTzxqg` | Bouquet wiz AI MV 專業賽第一名 |
| 與AI共學 EP01：期末考試 | 2025 | 動畫 | 黃宏瑞 | `RDgZTObYW78` | 愛奇藝 AI 短片大賽三等獎 |
| 島嶼藝視界－台灣當代美術凡爾賽特展 | 2025 | 廣告 | 林仲彥 | `GX5d8Y7--Qc` | 展覽宣傳片 |
| Comfilife 吊扇 | 2025 | 廣告 | 林仲彥 | `L5-RwoCy6jk` | 產品廣告 |
| 超美型寵物工作坊 | 2025 | 廣告 | 林仲彥 | `bVre_gRG-m0` | 店家廣告 |
| 椰香乖乖虎 | 2026 | 短片 | 林仲彥 | `xqZpLKIHZrs` | AI 原創生態紀錄片（偽紀錄片） |
| 帶著夜色成為光 | 2025 | MV | 林仲彥 | `V_nV8iTFbUE` | Bouquet wiz 參賽作 |
| 五元有緣 | 2025 | 短片 | 林仲彥 | 待補 | Artiver AI Art Awards 決賽入圍 |
| 古寶無患子、過年 IH 爐、林金田「離形心象」 | 2025 | 廣告 | 林仲彥 | 待補 | 頻道影片列表沒有，可能在 Shorts 或 Facebook |
| 跑著玩臺北 | 2025 | 貼圖 | 黃宏瑞 | — | 臺北生成藝術節貼圖組第三名；不是影片，放創辦人頁 |

**不列入作品集**：林仲彥的《中華一番》二創系列「AI 拍片現場」（單支最高約 28 萬觀看）。理由見 §11 #3。

### 4-2 獎項

| 年 | 賽事 | 結果 | 作品 | 得主 |
|---|---|---|---|---|
| 2026 | GMI Cloud × Wan × DV ASIA AI 影視職人創作大賽 | 第二名 | 間合 | 兩人（團隊） |
| 2026 | AI London Film Festival | 入圍 | 粽乩：豬母夜哭 | 林仲彥 |
| 2025 | Bouquet wiz AI MV 專業賽 | 第一名 | メモリー・ショップの黄昏 | 黃宏瑞 |
| 2025 | 愛奇藝「與AI共生」AI 短片創作大賽 | 三等獎 | 與AI共學 EP01 | 黃宏瑞 |
| 2025 | 臺北生成藝術節 貼圖組 | 第三名 | 跑著玩臺北 | 黃宏瑞 |
| 2025 | Artiver AI Art Awards | 決賽入圍 | 五元有緣 | 林仲彥 |
| 2025 | Artiver AI Art Awards | 入選 | — | 黃宏瑞 |

合計 4 座獎項（第一、第二、第三、三等）＋ 3 項入圍或入選。

### 4-3 課程

| 課程 | 講師 | 形式 | 連結 |
|---|---|---|---|
| AI 商業廣告公開課（限時免費） | 林仲彥 | 實體 | straightamedia.com/courses/ai-commercial-ad-free |
| AI 商業廣告實作班（實戰工作坊） | 林仲彥 | 實體 | straightamedia.com/courses/ai-commercial-ad-workshop |
| AI 影片製作線上課 | 黃宏瑞 | 線上 | 待補 |

---

## 5. 資料模型

```
src/content/
├── works/<slug>.md          作品（扁平單檔，同圖鑑）
│   └── thumbs/<slug>.jpg
├── team/<slug>/             創辦人（未來可加成員）
│   ├── index.md
│   └── portrait.jpg
└── news/<slug>.md           消息（P3）
src/data/
├── site.ts                  品牌、COMPANY（§1-2）、href()、routes、表單網址
├── services.ts              四項服務的固定資料（名稱、交付、流程、FAQ，含 ja）
├── courses.ts               課程清單
├── awards.ts                由 works 與 team 彙整
└── clients.ts               客戶名單＋授權旗標（false 的不輸出）
src/i18n/
├── zh-Hant.ts               介面字串
└── ja.ts
```

`works` 的 schema 跟圖鑑的差別：

| 欄位 | 圖鑑 | 官網 | 理由 |
|---|---|---|---|
| `videoUrl` | 必填（YouTube／Vimeo） | **選填**，沒有就必須給 `stills` | 客戶案可能只能放劇照或片段，不能卡在「沒公開影片就不能收」 |
| `creators` | 圖鑑創作者陣列 | `directors`（reference team）＋ `credits`（外部協作者，名字＋角色＋連結） | 分清公司成員與外部協作者 |
| `client` / `platform` | 無 | 選填 | 商業案與委製案的必要資訊 |
| `category` | 受控 genre | `commercial` / `mv` / `series` / `short` / `animation` | 對應服務頁自動帶出 |
| `featured` / `order` | 無 | 首頁精選與排序 | — |
| `titleJa` / `synopsisJa` | 無 | 選填 | 有填才生成日文作品頁（§2-1） |

---

## 6. 視覺設計

### 6-1 與圖鑑刻意區隔

兩站共用網域，**視覺必須一眼分得出來**，否則子網域就失去品牌獨立的意義。

| 面向 | 圖鑑 | 官網 |
|---|---|---|
| 隱喻 | 年鑑、報紙 | 暗房、放映 |
| 底色 | 片基褐 `#1b1714`（暖） | 顯影液黑 `#0e0e10`（中性偏冷） |
| accent | 藍晒靛 `#94a9e6` | 安全燈紅 `#ff4d3d` |
| 標題字 | 明朝體 | 黑體＋寬體拉丁字 |
| 版面 | 罫線、格網、硬陰影 | 滿版影像、大字、留白 |
| 圖像 | 依分區套濾鏡 | 「顯影」：見 6-4 |

### 6-2 色彩 token

| token | 值 | 用途 | 對 `--bg` 對比 |
|---|---|---|---|
| `--bg` | `#0e0e10` | 顯影液黑，全站底色 | — |
| `--bg-raised` | `#17171a` | 卡片、區塊底 | — |
| `--line` | `#2a2a2f` | 分隔線 | — |
| `--text` | `#f1ede6` | 相紙白，內文 | 約 16.5:1 |
| `--muted` | `#a19c94` | 次要文字、metadata | 約 7.1:1 |
| `--accent` | `#ff4d3d` | 安全燈紅：REC 點、主要按鈕、獲獎名次、作用中狀態 | 約 5.9:1 |
| `--accent-ink` | `#0e0e10` | 紅色底上的文字（白字在紅底只有 3.3:1，不用） | — |

accent 的紀律：每個畫面最多三處。只做深色版，影像作品在深色底最好看，同業官網也多半如此。

### 6-3 字體

- 拉丁字：Archivo 可變字體（寬度軸 62–125）。wordmark 用最寬＋粗體＋字距 0.2em，像片頭字卡
- 中文：系統黑體（PingFang TC／Noto Sans TC／微軟正黑體），不載中文網路字型（太大）
- 日文頁：Hiragino Sans／Noto Sans JP／Yu Gothic
- metadata：等寬字，片長一律寫成時間碼（`08:29`），年份、類別、片長用「・」分隔

### 6-4 「顯影」：作品縮圖的招牌互動

作品格網的縮圖預設是低亮度黑白，滑鼠移上去或鍵盤聚焦時，在 0.6 秒內「顯影」成全彩，像相紙在顯影液裡浮出影像，也像 AI 從雜訊裡生成畫面。

- 只在 `(hover: hover)` 的裝置啟用；手機一律全彩
- `prefers-reduced-motion: reduce` 時取消過渡，直接全彩
- 首頁精選與作品頁的主圖不套用，第一眼一律全彩

### 6-5 動態與無障礙

- Hero 影片：靜音循環、`playsinline`、附 poster，**一定要有暫停鈕**（WCAG 2.2.2：自動播放超過 5 秒要能暫停）；reduced-motion 時只顯示 poster
- YouTube 一律用 lite facade（圖鑑已有 `VideoFacade.astro`）
- 對比 AA 以上、`:focus-visible` 明顯、所有互動可用鍵盤操作

---

## 7. SEO 與結構化資料

### 7-1 Schema

| 類型 | 位置 | 重點欄位 |
|---|---|---|
| Organization | 每頁（`#organization`） | `name`、`legalName`（§1-2）、`alternateName`（§1-1 全部舊名）、`founder`（兩個 Person @id）、`taxID`、`email`、`knowsLanguage`、`areaServed`（TW、JP）、`sameAs` |
| WebSite | 每頁（`#website`） | `name: 幻五娛樂`、`alternateName: HALLUCINATION FIVE`、`inLanguage`。Google 的站名支援子網域層級，搜尋結果才會顯示幻五而不是圖鑑 |
| Person | 創辦人頁（`/team/<slug>/#person`） | `jobTitle`、`worksFor`、`alumniOf`、`award`、`sameAs`（YouTube、Threads、IG、方格子／Portaly、**圖鑑條目網址**） |
| VideoObject | 作品頁 | `thumbnailUrl`、`uploadDate`、`duration`、`embedUrl`、`director`（Person @id）、`productionCompany`（Organization @id） |
| Service | 四個服務頁 | `serviceType`、`provider`、`areaServed`、`availableLanguage` |
| FAQPage | 服務頁 FAQ | Google 已限縮 FAQ 複合式結果，但 AI 搜尋會引用，照做 |
| BreadcrumbList | 自動 | 沿用圖鑑 BaseLayout 引擎 |

課程頁不做 Course schema：Google 已在 2025 年停用課程資訊的複合式結果。

### 7-2 多語與索引

- 每頁輸出 `hreflang`：`zh-Hant-TW` ↔ `ja-JP`，`x-default` 指向繁中
- sitemap 用 `@astrojs/sitemap` 的 i18n 設定輸出 alternates
- llms.txt 三件套沿用圖鑑的 integration：有人問 AI「台灣有哪些 AI 廣告製作公司」時，這是被引用的捷徑
- robots 沿用圖鑑的 AI 爬蟲白名單
- Search Console：為 `https://studio.hallucination28.com/` 另建資源（或改用 DNS TXT 驗證整個網域資源）

### 7-3 目標關鍵字

| 語言 | 服務詞 | 品牌與人名 |
|---|---|---|
| 繁中 | AI 廣告製作、AI 影片製作公司、AI 短劇製作、AI MV 製作、AI 影片 企業內訓、生成式 AI 導入顧問 | 幻五娛樂、幻詠、5Y Studio、黃宏瑞、林仲彥、粽子 漫步深淵 |
| 日文 | AI動画制作 台湾、AI広告制作、AI MV制作、生成AI 映像制作会社 | HALLUCINATION FIVE、幻五 |

頁面 `<title>` 範本：`<頁名>｜幻五娛樂 HALLUCINATION FIVE`；首頁：`幻五娛樂 HALLUCINATION FIVE｜AI 廣告、MV 與短劇製作`。

---

## 8. 與圖鑑的關係

1. **互相揭露**：圖鑑 `/about/` 補上營運者，並寫明 No.001 林仲彥、No.002 黃宏瑞是幻五娛樂的共同創辦人、條目照同一套收錄準則；官網關於頁與頁尾寫「相關計畫：台灣AI影視創作者圖鑑」
2. **人物串連**：創辦人頁的 `sameAs` 放圖鑑條目網址；圖鑑兩人條目的 `sameAs.website` 目前各放方格子與 Portaly，要不要改成官網或擴充欄位，官網上線後再決定
3. **連結節制**：只在關於頁、頁尾、創辦人頁各放一處，不在全站放關鍵字錨點
4. **平手條款**：目前放在圖鑑的 `/tie-clause/`，建議搬到官網 `/originals/tie-clause/`（§11 #4）
5. **視覺不共用**：見 §6-1

---

## 9. 技術架構與部署

### 9-1 從圖鑑繼承

| 資產 | 來源 | 調整 |
|---|---|---|
| `site.config.mjs` 模式 | 圖鑑 | `SITE_ORIGIN` 預設改為 `https://studio.hallucination28.com`，base `/` |
| `href()` / `routes` / `absUrl()` | `src/data/site.ts` | 加上語系參數 |
| BaseLayout schema 引擎 | `src/layouts/BaseLayout.astro` | 換 Organization 內容、加 hreflang 與語言切換 |
| `VideoFacade.astro` | 圖鑑 | 原樣 |
| llms.txt integration、robots | `astro.config.mjs`、`robots.txt.ts` | 換內容來源 |
| `faq.ts` 抽取器 | 圖鑑 | 服務頁 FAQ 用 |
| GitHub Actions 部署流程 | 圖鑑 | 原樣 |

**不繼承**：`global.css` 的 token 與報紙元件、MoreList、工具與類型受控詞彙頁、活動時效性引擎、按讚分享。

### 9-2 新寫

1. i18n：Astro 內建 i18n routing（`defaultLocale: 'zh-Hant'`、`prefixDefaultLocale: false`）＋ `t()` 字典
2. `HeroReel.astro`：循環影片＋poster＋暫停鈕＋reduced-motion 處理
3. 表單預填連結產生器（服務頁 CTA 帶入服務類型）
4. 精簡版 `check-integrity`：作品必有影片或劇照、`directors` 存在、日文頁字串無缺漏

### 9-3 部署步驟

1. GitHub 新 repo（public，GitHub Pages 免費；私有 repo 開 Pages 要付費方案）。**repo 公開，所以報價表、客戶往來等敏感資料不要進 repo**
2. `public/CNAME` 寫 `studio.hallucination28.com`
3. Squarespace DNS **只新增**一筆：主機 `studio`、類型 CNAME、值 `kouzui-huang.github.io.`。MX、SPF、DKIM 與 apex 的 A 記錄一筆都不動
4. GitHub 帳號設定 → Pages → Verified domains 驗證 `hallucination28.com`（會多一筆 TXT），防止子網域被他人接管
5. repo 的 Pages 設定填自訂網域、勾 Enforce HTTPS
6. Search Console 新增資源、提交 sitemap

### 9-4 效能預算

- 行動版 LCP < 2.5 秒；Hero 影片 ≤ 6 MB（720p、H.264、15–30 秒循環），poster 用 AVIF／WebP
- 字型只載 Archivo 一支可變字體
- 首頁不載任何 YouTube iframe（facade 點擊才載）

---

## 10. 建置順序

| 階段 | 內容 | 完成條件 |
|---|---|---|
| P0 | 定案 §11、收集 §12 素材 | 統編、信箱、logo 或 wordmark 決定、作品清單確認 |
| P1 繁中 MVP | 搬地基 → 視覺 token 與 BaseLayout → 首頁 → 作品（約 15 件）→ 服務總覽＋四頁 → 關於＋創辦人頁 → 聯絡 → 隱私權 → schema／sitemap／llms → 部署與 DNS → Search Console | `npm run build` 通過、check 零警告、正式網址上線 |
| P2 日文 | 日文首頁、服務、關於、創辦人、聯絡、作品列表＋hreflang；圖鑑 `/about/` 揭露；平手條款搬家 | 黃宏瑞校對日文 |
| P3 擴充 | `/originals/`、`/news/`、案例幕後（製作過程拆解）、showreel 正式版、流量分析 | 依接案狀況排程 |

---

## 11. 待決事項（附建議）

| # | 問題 | 建議 |
|---|---|---|
| 1 | 更名期間的法定名稱 | 照 §1-2：顯示現行登記名＋「更名登記中」，核准後改一個設定 |
| 2 | 價格公開到什麼程度 | 不公開金額；公開規格與一般交期，表單收預算級距。報價差異大，公開數字容易被當成定價 |
| 3 | 《中華一番》二創系列放不放作品集 | **不放**。商業網站拿他人著作的二創招攬生意，風險比個人頻道高，也可能讓企業客戶擔心版權意識。林仲彥的創辦人頁可以用文字提到頻道經營成績並連到頻道 |
| 4 | 平手條款企劃頁搬不搬 | 搬到官網 `/originals/tie-clause/`，圖鑑原址放立即跳轉。原創 IP 企劃屬於公司，放在圖鑑會模糊兩站的界線 |
| 5 | 內部工具「幻五 Studio」要不要對外提 | 在 AI 導入顧問頁用一句「自研 AI 製作工作台」帶過，不放名稱與截圖；工具名稱跟網址的 studio 同字，日後若要產品化再另外命名 |
| 6 | 合作夥伴名單 | 逐一取得客戶同意才列名，只列名稱不放 logo，除非對方提供 |
| 7 | 圖鑑掛公司名下還是個人名下 | 建議個人名義（黃宏瑞主編），加上利益揭露。掛公司名下會讓圖鑑像公司的行銷門面 |
| 8 | 創辦人肖像 | 官網用真人照片（企業客戶的信任感）；圖鑑繼續用現在的頭像 |
| 9 | 流量分析 | P1 先不裝 GA4（省掉 cookie 同意視窗），靠 Search Console 與表單回覆數；P3 再評估 |
| 10 | 公司信箱 | 在 Google Workspace 開別名，例如 `studio@hallucination28.com`，與編輯部的 `ai_video@` 分開 |

---

## 12. 需要你們提供的素材

1. 統一編號、更名與改制的核准進度、登記地址是否公開
2. Logo（沒有就先用 wordmark，§6-3）
3. 公司信箱、公司社群帳號（有的話）
4. Showreel：30–60 秒，沒有之前首頁用劇照拼貼
5. 兩位創辦人的真人照片
6. 商業案清單與客戶授權：可具名的客戶、古寶無患子／IH 爐／離形心象的影片連結、《五元有緣》的連結
7. 課程資料：黃宏瑞線上課的連結、講過的企業與單位（可具名的）
8. 沿革日期：幻詠資訊與 5Y Studio 的成立日、合夥成立日
9. 一般交期與報價級距的實際數字（只用在 FAQ 與表單，不公開金額）
10. 林仲彥確認：自己的介紹文字、5Y 的由來、時間軸

---

## 13. Out of Scope（現階段明確不做）

- 線上付款、課程報名與金流（導向外部平台）
- 會員、後台 CMS（維持 Markdown ＋ git）
- 英文版（架構可加，但不排程）
- 大量內容行銷文章（交給圖鑑）
- 自研工具的對外試用（見 §11 #5）

---

## 附錄：參考來源

- 黃宏瑞：heart2thriving.com/about-hongrui/（經歷、學歷、獎項；版面結構參考）、YouTube @Hallucination-prompt、圖鑑條目 hallucination28.com/creator/huang-hung-jui/
- 林仲彥：portaly.cc/fantasyyen55（服務、課程、聯絡）、YouTube @AI_深淵漫步者、圖鑑條目 hallucination28.com/creator/lin-chung-yen/
- 作品資料：圖鑑 `src/content/works/` 的八筆條目，以及兩人 YouTube 頻道的影片列表（2026-10-28 擷取）
- 同業官網的常見架構：服務細分頁、作品頁、獎項與媒體頁、免費試拍入口
