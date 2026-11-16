/**
 * 繁體中文介面與頁面字串（預設語言）。
 *
 * ja.mjs 要有一模一樣的鍵、同樣型別、陣列長度相同；scripts/check-integrity.mjs 會比對，缺漏就擋部署。
 * 需要帶入資料的字串寫成函式。這個檔不 import 任何東西（check 腳本是純 Node，讀不了 TS）。
 */

export const ZH = {
  meta: {
    brand: '幻五映像 HALLUCINATION FIVE',
    /** 首頁 <title>：`${brand}｜${homeSuffix}` */
    homeSuffix: 'AI 廣告、MV 與短劇製作',
    /** 長版站台描述：首頁 meta、Organization schema */
    description:
      '幻五映像（HALLUCINATION FIVE）由幻詠工作室與 5Y工作室合夥成立，承接 AI 商業廣告、MV、平台短劇與影集製作，並提供 AI 影片課程、企業內訓與 AI 導入顧問。',
    ogImageAlt: (/** @type {string} */ title) => `${title} 分享縮圖`,
  },

  layout: {
    tagline: '畫面交給 AI，故事留給人。',
    skip: '跳至主要內容',
    homeAria: (/** @type {string} */ brand) => `${brand} 首頁`,
    navAria: '主選單',
    nav: { works: '作品', services: '服務', about: '關於', contact: '聯絡' },
    cta: '專案洽詢',
    menu: '選單',
    menuOpen: '開啟選單',
    menuAria: '行動版選單',
    langAria: '語言',
    footerBlurb: 'AI 廣告、MV 與短劇製作，以及 AI 影片課程與導入顧問。',
    city: '台北',
    footServices: '服務',
    footCompany: '公司',
    footRelated: '相關計畫',
    aboutLink: '關於幻五',
    contactLink: '洽詢',
    privacyLink: '隱私權政策',
    /** 連到中文站時補一句語言提示（繁中頁不需要） */
    directoryNote: '',
    taxId: (/** @type {string} */ id) => `・統一編號 ${id}`,
    renamePending: (/** @type {string} */ legal, /** @type {string} */ next) => `${legal}（更名為${next}登記中）`,
  },

  /** 語言切換：label 是頁首的單字，name 是給螢幕報讀器的全名 */
  langSwitch: { label: '中', name: '繁體中文' },

  crumbs: {
    aria: '麵包屑',
    home: '首頁',
    works: '作品',
    services: '服務',
    about: '關於幻五',
    team: '創辦人',
    contact: '洽詢',
    privacy: '隱私權政策',
  },

  categories: { commercial: '廣告', mv: 'MV', series: '短劇', short: '短片', animation: '動畫' },

  cards: {
    director: '導演',
    collab: '協作',
    commissioned: (/** @type {string} */ platform) => `${platform} 委製`,
    episodes: (/** @type {number} */ n) => `全 ${n} 集`,
    /** 日文頁的作品卡連到繁中作品頁時加的標示；繁中頁留空 */
    zhPage: '',
    listSep: '、',
    nameSep: '・',
  },

  cta: {
    title: '有一個想拍的故事？',
    lead: '告訴我們用途、片長與時程，我們會在兩個工作天內回覆。',
    button: '專案洽詢',
  },

  serviceList: { for: '適合：' },

  process: {
    aria: '製作流程六個步驟（可左右捲動）',
    key: '幻五的方法',
    link: '看實際範例',
    note: 'AI 負責生成，導演負責判斷。工具會換代，判斷力不會。',
  },

  awards: { photoLabel: '獎狀' },

  person: { link: (/** @type {string} */ name) => `認識${name.slice(1)}` },

  home: {
    heroTitle: { line1: '畫面交給 AI，', pre: '故事留給', em: '人', post: '。' },
    heroLead: {
      before: '幻五映像由幻詠工作室與 5Y工作室合夥成立。從品牌廣告、音樂 MV 到',
      nobr: '三十集',
      after: '的平台短劇，我們先把故事寫好，再讓 AI 把畫面做出來。',
    },
    ctaWorks: '觀看作品',
    reelPause: '暫停背景動態',
    reelPlay: '播放背景動態',
    worksTitle: '精選作品',
    worksAll: '全部作品',
    moreTitle: '更多作品',
    moreHint: '滑過顯影',
    statsAria: '幻五的數字',
    stats: (/** @type {number} */ winners, /** @type {number} */ shortlisted) => [
      { value: '60', unit: '集', label: '平台短劇委製', note: '金魚短劇兩部，各 30 集' },
      { value: String(winners), unit: '座', label: 'AI 影像競賽獎項', note: `另有 ${shortlisted} 項入圍與入選` },
      { value: '13', unit: '年', label: '3D 與數位影像資歷', note: '3D 動態預演驅動 AI 生成' },
      { value: '中・日', unit: '', label: '雙語製作與提案', note: '日文原創歌詞 MV 獲第一名' },
    ],
    servicesTitle: '我們做的事',
    servicesAll: '服務總覽',
    processTitle: '製作流程',
    awardsTitle: '獲獎紀錄',
    teamTitle: '創辦人',
    teamAll: '關於幻五',
    partnersTitle: '合作過的品牌與平台',
    ctaSecondary: '企業內訓洽詢',
  },

  works: {
    title: '作品',
    seoTitle: '作品｜AI 廣告、MV、短劇與動畫',
    description:
      '幻五映像的作品：AI 廣告、MV、平台短劇、短片與動畫，包括 GMI Cloud × Wan × DV ASIA 大賽第二名的《間合》、Bouquet wiz AI MV 專業賽第一名的《メモリー・ショップの黄昏》。',
    lead: '廣告、MV、短劇、短片與動畫。作品頁標出導演、客戶或平台，以及能確認的主要 AI 工具。',
    listAria: '作品列表',
    filterAria: '依類別篩選',
    all: '全部',
    hint: '滑過顯影',
  },

  services: {
    title: '服務',
    seoTitle: '服務｜AI 廣告、短劇製作、課程內訓與導入顧問',
    description:
      '幻五映像的四項服務：AI 商業影片製作、短劇與影集、AI 影片課程與企業內訓、生成式 AI 導入顧問。從需求訪談、腳本、3D 動態預演到剪輯交付。',
    heading: '我們做的事',
    lead: '從一支 15 秒的廣告、三十集的平台短劇，到幫你的團隊把 AI 用進日常工作。四項服務背後是同一套方法：故事先寫好，設定先做足，每一格畫面都由人判斷。',
    schemaName: '幻五映像的服務',
    listAria: '服務項目',
    processTitle: '影像製作流程',
    processLink: '看作品',
    ctaSecondary: '企業內訓洽詢',
  },

  service: {
    forWho: '適合',
    deliverTitle: '交付內容',
    coursesTitle: '公開課程',
    teacher: '講師',
    courseLink: '課程介紹與報名',
    coursesNote: '報名與付款在合作平台完成。企業包班與內訓請直接洽詢。',
    relatedTitle: '相關作品',
    relatedAll: '全部作品',
    processTitle: '製作流程',
    faqTitle: '常見問題',
    faqNote: { before: '其他問題，歡迎來信 ', after: '。' },
    othersTitle: '其他服務',
  },

  about: {
    title: '關於幻五',
    seoTitle: '關於幻五映像｜幻詠工作室 × 5Y工作室',
    description:
      '幻五映像由黃宏瑞的幻詠工作室與林仲彥的 5Y工作室合夥成立，前身為幻詠資訊。公司沿革、名字的由來、我們相信的事與公司資訊。',
    lead: '幻五映像由幻詠工作室與 5Y工作室合夥成立。一個從文字與角色設定走進影像，一個從 3D 動態走進 AI；我們把兩套方法放在同一條製作線上。',
    nameTitle: '名字的由來',
    nameBody: [
      '「幻」取自幻詠，「五」取自 5Y。兩個工作室的名字各留一個字，合成幻五。',
      '英文名 HALLUCINATION 是生成式 AI 的「幻覺」：在 AI 圈它是要修掉的缺陷，在影像創作裡，它是想像力的來源。我們做的事，就是把幻覺導演成故事。',
    ],
    historyTitle: '沿革',
    history: (/** @type {{ renamePending: boolean, newLegalName: string }} */ c) => [
      { year: '2025', text: '黃宏瑞成立幻詠資訊有限公司，全職投入 AI 生成內容。' },
      { year: '2025', text: '林仲彥以 5Y Studio 為名投入 AI 影片，為品牌與展覽製作 AI 廣告。' },
      { year: '2025', text: '兩人的作品分別在 Bouquet wiz AI MV 專業賽、愛奇藝 AI 短片創作大賽、Artiver AI Art Awards 獲獎與入圍。' },
      { year: '2026', text: '兩人同隊參加 GMI Cloud × Wan × DV ASIA AI 影視職人創作大賽，以《間合》拿下第二名。' },
      { year: '2026', text: '為短劇平台金魚短劇 KIMHIT 製作兩部各 30 集的 AI 短劇。' },
      { year: '2026', text: '合夥成立幻五映像，幻詠資訊有限公司改制為幻詠資訊股份有限公司。' },
      {
        year: '2026',
        text: c.renamePending ? `公司更名為${c.newLegalName}，登記中。` : `公司更名為${c.newLegalName}。`,
      },
    ],
    beliefsTitle: '我們相信的事',
    beliefs: [
      { title: '故事先於工具', body: '先把故事寫好，再決定哪些畫面交給 AI。工具幾個月就換代，好故事不會過期。' },
      { title: '每一格都經過人的判斷', body: 'AI 負責生成，導演負責挑選、重做與修正。交出去的每一格畫面，都有人看過、選過。' },
      { title: '說清楚用了什麼工具', body: '作品頁標出能確認的主要 AI 工具；交付時也會說明製作過程用到的工具與音樂來源。' },
      { title: '肖像與權利先講清楚', body: '不使用未經同意的真人肖像與聲音；委製作品的權利歸屬與使用範圍寫進合約。' },
    ],
    teamTitle: '創辦人',
    companyTitle: '公司資訊',
    table: {
      name: '公司名稱',
      taxId: '統一編號',
      brand: '品牌',
      founders: '共同創辦人',
      services: '服務項目',
      servicesValue: '商業影片製作、短劇與影集、課程與企業內訓、AI 導入顧問',
      area: '服務地區與語言',
      areaValue: '台灣、日本／中文、日文',
      email: '聯絡信箱',
    },
    relatedTitle: '相關計畫',
    related: {
      before: '創辦人黃宏瑞以個人名義主編',
      after: '，收錄以 AI 工具進行影視創作的台灣創作者。',
      second:
        '圖鑑收錄的 No.001 林仲彥與 No.002 黃宏瑞，就是本公司的兩位共同創辦人；兩人的條目與其他創作者適用同一套收錄準則。',
    },
  },

  team: {
    sameAs: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      threads: 'Threads',
      facebook: 'Facebook',
      directory: '台灣AI影視創作者圖鑑條目',
    },
    vocus: '方格子沙龍',
    numbersAria: (/** @type {string} */ name) => `${name}的數字`,
    aboutTitle: (/** @type {string} */ name) => `關於${name}`,
    worksTitle: '代表作',
    worksAll: '全部作品',
    awardsTitle: '獲獎',
    timelineTitle: '經歷',
    linksTitle: '其他連結',
    ctaTitle: (/** @type {string} */ name) => `想找${name.slice(1)}合作？`,
  },

  contact: {
    title: '洽詢',
    seoTitle: '專案洽詢｜AI 廣告、短劇、內訓與顧問',
    description: 'AI 商業影片、短劇與影集、課程與企業內訓、AI 導入顧問的洽詢方式。告訴我們用途、片長與時程，我們會在兩個工作天內回覆。',
    heading: '有一個想拍的故事？',
    lead: '專案、內訓或顧問，都可以從這裡開始。告訴我們用途、片長與時程，我們會在兩個工作天內回覆。',
    fields: ['姓名', '公司／單位', '電話（選填）', '用途與受眾', '片長或集數', '期望上線日', '預算範圍', '參考影片連結'],
    subject: (/** @type {string} */ name) => `【${name}洽詢】`,
    serviceLine: (/** @type {string} */ name) => `服務類型：${name}`,
    bodyLabel: '專案說明：',
    other: { name: '其他', summary: '媒體採訪、合作提案或其他問題' },
    formTitle: '幻五映像洽詢表單',
    formNote: '表單顯示不完整？',
    formOpen: '在新分頁開啟',
    mailTitle: '寄信給我們',
    mailLead: '選擇洽詢類型，會開啟已經帶好主旨與欄位的郵件，填好就能寄出。',
    tipsTitle: '洽詢時請附上',
    tips: [
      { label: '用途與受眾', text: '這支影片要放在哪裡、給誰看。' },
      { label: '片長或集數', text: '廣告秒數、MV 長度，或短劇的集數與單集長度。' },
      { label: '期望上線日', text: '有固定檔期的案子，請先告訴我們日期。' },
      { label: '預算範圍', text: '大概的區間就好，方便我們提出合適的做法。' },
      { label: '參考影片', text: '喜歡的風格或作品連結，比形容詞更準確。' },
    ],
  },

  privacy: {
    title: '隱私權政策',
    description: '幻五映像官網如何處理你寄來的洽詢資料、影片嵌入與字型載入。本站不使用分析工具與追蹤 cookie。',
    intro: (/** @type {string} */ legalName, /** @type {string} */ date) =>
      `本政策說明${legalName}（以下稱「幻五映像」）的官網如何處理你的資料。最後更新：${date}。`,
    sections: [
      {
        h: '我們蒐集的資料',
        p: '只有你主動寄給我們的洽詢內容：姓名、公司、聯絡方式與專案說明。這些資料只用來回覆洽詢、報價與執行專案，不會提供給第三方，也不會用於行銷。',
      },
      { h: '分析工具與 cookie', p: '本站目前不使用網站分析工具，也不設定追蹤用的 cookie。' },
      {
        h: '影片嵌入',
        p: '作品頁的影片以 youtube-nocookie.com 嵌入，而且要你按下播放鍵才會載入。載入之後，YouTube 會依它自己的隱私權政策處理資料。',
      },
      { h: '字型', p: '本站的英文字型由 Google Fonts 提供；載入時，Google 會取得你的 IP 位址等連線資訊。' },
      { h: '外部連結', p: '本站連到的外部網站（YouTube、社群平台、課程平台等）各有自己的隱私權政策，不在本政策範圍內。' },
    ],
    contactTitle: '聯絡我們',
    contact: { before: '想查詢、更正或刪除你寄給我們的資料，請來信 ', after: '。' },
  },
  /**
   * /process/script/：製作流程第 2 步「腳本與分鏡」的方法頁（版面在 src/views/ProcessScriptPage.astro）
   * 流程圖是內部工作流程的簡化版：每個代理只寫角色、一句原則、產出與人工確認點。
   * 刻意不寫 skill 名稱、知識庫檔名、內部審稿的關卡清單與數量、失敗檢查的項目、提示詞的欄位格式與字數上限。
   */
  processScript: {
    title: '腳本與分鏡',
    seoTitle: '腳本與分鏡：四個自研 AI 代理，從一句點子寫到影片提示詞',
    description: (/** @type {number} */ agents, /** @type {number} */ checks) =>
      `幻五把腳本與分鏡交給 ${agents} 個自研的 AI 代理：編劇、片名企劃、分鏡、提示詞，從一句點子寫到影片模型讀得懂的提示詞，中間有 ${checks} 個人工確認點。`,
    meta: '製作流程第 2 步',
    lead: 'AI 影片好不好看，很多在按下生成之前就決定了：故事有沒有寫好，鏡頭有沒有想清楚。',
    spec: {
      scope: '範圍',
      scopeValue: '一句點子到影片提示詞',
      agents: 'AI 代理',
      agentsUnit: ' 個，皆為自研',
      checks: '人工確認',
      checksUnit: ' 處',
      output: '產出',
      outputValue: '文字，不直接生成畫面',
    },
    flowTitle: '從一句點子到影片提示詞',
    intro:
      '幻五把這一步交給四個自研的 AI 代理技能（Agent Skill），分成兩段：前段把點子寫成劇本、取好片名，後段把劇本拆成鏡頭，再轉成影片模型讀得懂的提示詞。每一段的成果都由人確認，才交給下一段。',
    agentLabel: 'AI 代理',
    outputTag: '產出',
    checkTag: '人工確認',
    /** 兩段流程；kind 是 io（輸入、產出）或 agent（AI 代理），checks 是人工確認點 */
    lanes: [
      {
        id: 'story',
        name: '故事',
        sub: '把點子寫成劇本',
        nodes: [
          { kind: 'io', label: '輸入', text: '一句點子、角色或故事大綱' },
          {
            kind: 'agent',
            no: '01',
            name: '編劇',
            body: '開寫前先問清楚設定、劇情與長度。交出來的初稿，已經在內部經過多輪審稿。',
            output: '劇本初稿',
            checks: ['回答提問', '讀劇本'],
          },
          {
            kind: 'agent',
            no: '02',
            name: '片名企劃',
            body: '讀完劇本、確認結局才取名。片名只承諾劇本給得出的內容，也不洩漏該藏的轉折。',
            output: '3～5 個片名提案',
            checks: ['選定片名'],
          },
          { kind: 'io', label: '產出', text: '定稿的劇本與片名' },
        ],
      },
      {
        id: 'picture',
        name: '畫面',
        sub: '把劇本變成鏡頭',
        nodes: [
          { kind: 'io', label: '輸入', text: '定稿的劇本' },
          {
            kind: 'agent',
            no: '03',
            name: '分鏡',
            body: '把內心戲轉成看得見的動作與物件，再拆成鏡頭。露出最少，留給觀眾自己推論。',
            output: '中文分鏡腳本',
            checks: ['審分鏡腳本'],
          },
          {
            kind: 'agent',
            no: '04',
            name: '提示詞',
            body: '先鎖住角色外觀、場景與畫風，再寫動作、運鏡與聲音，讓每個鏡頭前後一致。',
            output: '影片提示詞',
            checks: [],
          },
          { kind: 'io', label: '交給', text: '影片模型生成' },
        ],
      },
    ],
    caption: '標出由人把關的地方。四個代理都只產出文字，不直接生成畫面。',
    whyTitle: '為什麼拆成四個代理',
    why: [
      '一份萬用的提示詞，很難同時把故事寫好、把鏡頭想清楚，又顧到影片模型的讀法。拆成四個代理，每個只做一件事，寫作規則與檢查也只針對那一件事。',
      '中間的劇本與分鏡腳本都是人讀得懂的中文：哪一段不對就改哪一段，改一個鏡頭不必重寫整份提示詞。故事成不成立、鏡頭該藏什麼，留給人判斷。',
    ],
    processTitle: '在製作流程裡的位置',
    servicesLink: '服務總覽',
    ctaTitle: '只有一句點子，也可以開始',
    ctaLead: '告訴我們用途、片長與時程。還沒有腳本也沒關係，我們會從故事開始一起整理。',
    ctaSecondary: '商業影片洽詢',
  },
};
