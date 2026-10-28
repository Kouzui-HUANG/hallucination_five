# 幻五娛樂 HALLUCINATION FIVE 官網

幻五娛樂科技股份有限公司的官方網站，正式網址 `https://studio.hallucination28.com/`。
Astro 6 靜態站，部署在 GitHub Pages。設計文件：[docs/plans/2026-10-28-hallucination-five-site-design.md](docs/plans/2026-10-28-hallucination-five-site-design.md)

## 指令

```bash
npm install
npm run dev        # 本機開發（http://localhost:4321）
npm run check      # 內容防呆：缺欄位、日期沒加引號、縮圖不存在…有錯就不部署
npm run build      # 輸出到 dist/，同時產生 sitemap 與 llms.txt
npm run preview    # 預覽 dist/
npm run brand-assets  # 重新產生 favicon、logo.png、og-default.png
```

## 改內容要動哪裡

| 要改的東西 | 檔案 |
|---|---|
| 作品 | `src/content/works/<slug>.md`，縮圖放 `src/content/works/thumbs/<slug>.jpg`（1280×720） |
| 創辦人 | `src/content/team/<slug>/index.md` 與同資料夾的 `portrait.jpg`（4:5） |
| 四項服務、製作流程、常見問題 | `src/data/services.mjs` |
| 課程 | `src/data/courses.mjs` |
| 合作夥伴（客戶同意後才把 `approved` 改成 `true`） | `src/data/clients.mjs` |
| 公司名稱、統一編號、信箱、洽詢表單、社群帳號 | `src/data/site.ts` 的 `SITE` 與 `COMPANY` |

作品日期一律寫成加引號的 `"YYYY-MM-DD"`。首頁精選最多 6 件（`featured: true`，用 `order` 排序，1 是大卡）。

## 上線前要補的

- [ ] 統一編號（`COMPANY.taxId`）
- [ ] 兩位創辦人的真人照片（目前是圖鑑用的頭像）
- [ ] 服務頁常見問題的措辭確認（著作權、肖像授權那幾題建議請律師看過）
- [ ] 林仲彥確認自己的介紹與時間軸
- [ ] 更名核准後：`COMPANY.legalName` 改成新名、`renamePending` 改成 `false`

## 部署

1. GitHub 建 public repo，推上 main
2. Settings → Pages → Source 選「GitHub Actions」
3. Settings → Secrets and variables → Actions → Variables 新增 `SITE_ORIGIN = https://studio.hallucination28.com`
4. Squarespace DNS 只新增一筆 CNAME：`studio` → `kouzui-huang.github.io.`（MX、SPF、DKIM、apex 的 A 記錄都不要動）
5. GitHub 帳號設定 → Pages → Verified domains 驗證 `hallucination28.com`
6. repo 的 Pages 設定填 `studio.hallucination28.com`，勾 Enforce HTTPS
7. Search Console 新增資源並提交 `sitemap-index.xml`
