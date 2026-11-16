/**
 * 日本語の介面與頁面字串（設計文件 §2-1、P2）。鍵與 zh-Hant.mjs 一一對應，check-integrity 會比對。
 *
 * 用字原則：
 * - 法定名稱、作品名、賽事與平台的專有名詞照原文（作品名用『』）；品牌以 HALLUCINATION FIVE（幻五映像）開頭（設計文件 §1-1）
 * - 客觀描述；公司口吻的 CTA（〜します）照全站慣例保留
 * - 作品頁只有繁中，日文頁連過去時標「中国語ページ」
 * 上線前由黃宏瑞校對（設計文件 §10 P2 的完成條件）。
 */

/** @type {typeof import('./zh-Hant.mjs').ZH} */
export const JA = {
  meta: {
    brand: 'HALLUCINATION FIVE（幻五映像）',
    homeSuffix: '台湾のAI映像制作会社',
    description:
      'HALLUCINATION FIVE（幻五映像）は、幻詠工作室と5Y工作室が共同で設立した台湾の映像制作会社です。AIによる商業広告、MV、配信ショートドラマとシリーズの制作に加え、AI映像の講座、企業研修、AI導入コンサルティングを提供しています。',
    ogImageAlt: (title) => `${title} のシェア画像`,
  },

  layout: {
    tagline: '映像はAIに、物語は人に。',
    skip: 'メインコンテンツへ移動',
    homeAria: (brand) => `${brand} ホーム`,
    navAria: 'メインメニュー',
    nav: { works: '作品', services: 'サービス', about: '会社概要', contact: 'お問い合わせ' },
    cta: '制作のご相談',
    menu: 'メニュー',
    menuOpen: 'メニューを開く',
    menuAria: 'モバイルメニュー',
    langAria: '言語',
    footerBlurb: 'AI広告、MV、ショートドラマの制作と、AI映像の講座、導入コンサルティング。',
    city: '台湾・台北',
    footServices: 'サービス',
    footCompany: '会社',
    footRelated: '関連プロジェクト',
    aboutLink: '幻五映像について',
    contactLink: 'お問い合わせ',
    privacyLink: 'プライバシーポリシー',
    directoryNote: '（中国語）',
    taxId: (id) => `・統一編号 ${id}`,
    renamePending: (legal, next) => `${legal}（${next}へ商号変更の登記手続き中）`,
  },

  langSwitch: { label: '日', name: '日本語' },

  crumbs: {
    aria: 'パンくずリスト',
    home: 'ホーム',
    works: '作品',
    services: 'サービス',
    about: '幻五映像について',
    team: '創業者',
    contact: 'お問い合わせ',
    privacy: 'プライバシーポリシー',
  },

  categories: { commercial: '広告', mv: 'MV', series: 'ショートドラマ', short: '短編映画', animation: 'アニメーション' },

  cards: {
    director: '監督',
    collab: '協力',
    commissioned: (platform) => `${platform} 委託制作`,
    episodes: (n) => `全${n}話`,
    zhPage: '中国語ページ',
    listSep: '、',
    nameSep: '・',
  },

  cta: {
    title: '映像にしたい物語はありますか？',
    lead: '用途、尺、スケジュールをお知らせください。2営業日以内にご返信します。',
    button: '制作のご相談',
  },

  serviceList: { for: '対象：' },

  process: {
    aria: '制作フローの6つのステップ（横にスクロールできます）',
    key: '幻五のメソッド',
    link: '実例を見る（中国語）',
    note: 'AIは生成を、監督は判断を担います。ツールは世代交代しても、判断力は古びません。',
  },

  awards: { photoLabel: '賞状' },

  person: { link: (name) => `${name}のプロフィール` },

  home: {
    heroTitle: { line1: '映像はAIに、', pre: '物語は', em: '人', post: 'に。' },
    heroLead: {
      before:
        '幻五映像は、幻詠工作室と5Y工作室が共同で設立した台湾の映像制作会社です。ブランド広告や音楽MVから',
      nobr: '全30話',
      after: 'の配信ドラマまで、まず物語を書き上げ、それからAIで映像に仕上げます。',
    },
    ctaWorks: '作品を見る',
    reelPause: '背景の動きを停止',
    reelPlay: '背景の動きを再生',
    worksTitle: 'ピックアップ作品',
    worksAll: 'すべての作品',
    moreTitle: 'その他の作品',
    moreHint: 'カーソルを重ねて現像',
    statsAria: '数字で見る幻五映像',
    stats: (winners, shortlisted) => [
      { value: '60', unit: '話', label: '配信ショートドラマの受託制作', note: '金魚短劇で2作品、各30話' },
      { value: String(winners), unit: '件', label: 'AI映像コンテストでの受賞', note: `ほかにノミネート・入選 ${shortlisted} 件` },
      { value: '13', unit: '年', label: '3Dとデジタル映像のキャリア', note: '3Dプリビズを起点にAIで生成' },
      { value: '中・日', unit: '', label: '中国語と日本語で制作・提案', note: '日本語詞のオリジナル曲によるMVで第1位' },
    ],
    servicesTitle: '事業内容',
    servicesAll: 'サービス一覧',
    processTitle: '制作フロー',
    awardsTitle: '受賞歴',
    teamTitle: '創業者',
    teamAll: '幻五映像について',
    partnersTitle: 'これまでの取引先',
    ctaSecondary: '企業研修のご相談',
  },

  works: {
    title: '作品',
    seoTitle: '作品｜AI広告、MV、ショートドラマ、アニメーション',
    description:
      'HALLUCINATION FIVE（幻五映像）の作品。AI広告、MV、配信ショートドラマ、短編映画、アニメーション。GMI Cloud × Wan × DV ASIA コンテスト第2位の『間合』、Bouquet wiz AI MV プロ部門第1位の『メモリー・ショップの黄昏』など。',
    lead: '広告、MV、ショートドラマ、短編映画、アニメーション。各作品のページには監督、クライアントまたは配信先、確認できる主なAIツールを記載しています。作品ページは中国語（繁体字）です。',
    listAria: '作品一覧',
    filterAria: 'カテゴリーで絞り込む',
    all: 'すべて',
    hint: 'カーソルを重ねて現像',
  },

  services: {
    title: 'サービス',
    seoTitle: 'サービス｜AI広告、ショートドラマ制作、研修、導入コンサルティング',
    description:
      'HALLUCINATION FIVE（幻五映像）の4つのサービス：AI商業映像制作、ショートドラマ・シリーズ、AI映像講座と企業研修、生成AI導入コンサルティング。ヒアリング、脚本、3Dプリビズから編集・納品まで。',
    heading: '事業内容',
    lead: '15秒の広告や全30話の配信ドラマから、チームの日常業務へのAI導入まで。4つのサービスの根っこにあるのは同じ方法です。物語を先に書き、設定を作り込み、すべてのカットを人が判断します。',
    schemaName: 'HALLUCINATION FIVE（幻五映像）のサービス',
    listAria: 'サービス一覧',
    processTitle: '映像制作のフロー',
    processLink: '作品を見る',
    ctaSecondary: '企業研修のご相談',
  },

  service: {
    forWho: '対象',
    deliverTitle: '納品内容',
    coursesTitle: '公開講座',
    teacher: '講師',
    courseLink: '講座の詳細と申し込み（中国語）',
    coursesNote:
      '申し込みとお支払いは提携プラットフォームで行います。公開講座は中国語・対面形式です。企業向けの貸切講座や研修は、直接お問い合わせください。',
    relatedTitle: '関連作品',
    relatedAll: 'すべての作品',
    processTitle: '制作フロー',
    faqTitle: 'よくある質問',
    faqNote: { before: 'そのほかのご質問は ', after: ' までお気軽にどうぞ。' },
    othersTitle: 'ほかのサービス',
  },

  about: {
    title: '幻五映像について',
    seoTitle: '会社概要｜幻詠工作室 × 5Y工作室',
    description:
      'HALLUCINATION FIVE（幻五映像）は、黃宏瑞の幻詠工作室と林仲彥の5Y工作室が共同で設立した台湾の映像制作会社です。沿革、社名の由来、大切にしていること、会社情報。',
    lead: '幻五映像は、幻詠工作室と5Y工作室が共同で設立しました。一人は言葉とキャラクター設定から映像へ、もう一人は3DモーションからAIへ。2つの方法を1本の制作ラインに並べています。',
    nameTitle: '社名の由来',
    nameBody: [
      '「幻」は幻詠から、「五」は5Yから。2つのスタジオの名前から1文字ずつ取り、「幻五」としました。',
      '英語名のHALLUCINATIONは、生成AIの「ハルシネーション（幻覚）」のこと。AIの世界では直すべき欠陥ですが、映像づくりでは想像力の源になります。私たちの仕事は、その幻覚を物語へと演出することです。',
    ],
    historyTitle: '沿革',
    history: (c) => [
      { year: '2025', text: '黃宏瑞が幻詠資訊有限公司を設立し、AI生成コンテンツの制作に専念。' },
      { year: '2025', text: '林仲彥が5Y Studioの名でAI映像の制作を始め、ブランドや展覧会のAI広告を手がける。' },
      {
        year: '2025',
        text: '2人の作品が、Bouquet wiz AI MV プロ部門、iQIYI AIショートフィルムコンテスト、Artiver AI Art Awardsでそれぞれ受賞・ノミネート。',
      },
      {
        year: '2026',
        text: '2人が同じチームでGMI Cloud × Wan × DV ASIA AI映像クリエイターコンテストに出場し、『間合』で第2位を獲得。',
      },
      { year: '2026', text: 'ショートドラマ配信プラットフォーム金魚短劇 KIMHITのため、各30話のAIショートドラマを2作品制作。' },
      { year: '2026', text: '幻五映像を共同で設立。幻詠資訊有限公司が幻詠資訊股份有限公司（株式会社）へ組織変更。' },
      {
        year: '2026',
        text: c.renamePending
          ? `商号を${c.newLegalName}へ変更（登記手続き中）。`
          : `商号を${c.newLegalName}へ変更。`,
      },
    ],
    beliefsTitle: '大切にしていること',
    beliefs: [
      {
        title: '物語が先、ツールはあと',
        body: 'まず物語を書き、それからどの画面をAIに任せるかを決めます。ツールは数か月で世代交代しますが、よい物語は古びません。',
      },
      {
        title: 'すべてのカットに人の判断を',
        body: 'AIが生成し、監督が選び、作り直し、修正します。納品するすべてのカットは、人が見て選んだものです。',
      },
      {
        title: '使ったツールを明らかに',
        body: '作品ページには確認できる主なAIツールを記載し、納品時には制作に使ったツールと音楽の出どころもご説明します。',
      },
      {
        title: '肖像と権利を最初に明確に',
        body: '本人の同意のない実在の人物の肖像や声は使いません。受託作品の権利の帰属と利用範囲は契約書に明記します。',
      },
    ],
    teamTitle: '創業者',
    companyTitle: '会社情報',
    table: {
      name: '会社名（登記名）',
      taxId: '統一編号（台湾の事業者番号）',
      brand: 'ブランド',
      founders: '共同創業者',
      services: '事業内容',
      servicesValue: '商業映像制作、ショートドラマ・シリーズ、講座と企業研修、AI導入コンサルティング',
      area: '対応地域と言語',
      areaValue: '台湾、日本／中国語、日本語',
      email: 'メールアドレス',
    },
    relatedTitle: '関連プロジェクト',
    related: {
      before: '創業者の黃宏瑞は個人として',
      after: '（中国語サイト）の編集長を務め、AIツールで映像作品をつくる台湾のクリエイターを紹介しています。',
      second:
        '図鑑に掲載されているNo.001 林仲彥とNo.002 黃宏瑞は、当社の共同創業者です。2人の項目にも、ほかのクリエイターと同じ掲載基準を適用しています。',
    },
  },

  team: {
    sameAs: {
      youtube: 'YouTube',
      instagram: 'Instagram',
      threads: 'Threads',
      facebook: 'Facebook',
      directory: '台灣AI影視創作者圖鑑（中国語）',
    },
    vocus: 'vocus（方格子）',
    numbersAria: (name) => `数字で見る${name}`,
    aboutTitle: (name) => `${name}について`,
    worksTitle: '代表作',
    worksAll: 'すべての作品',
    awardsTitle: '受賞歴',
    timelineTitle: '経歴',
    linksTitle: 'リンク',
    ctaTitle: (name) => `${name}へのご相談`,
  },

  contact: {
    title: 'お問い合わせ',
    seoTitle: 'お問い合わせ｜AI広告、ショートドラマ、研修、コンサルティング',
    description:
      'AI商業映像、ショートドラマ・シリーズ、講座と企業研修、AI導入コンサルティングのお問い合わせ。日本語でご相談いただけます。用途、尺、スケジュールをお知らせいただければ、2営業日以内にご返信します。',
    heading: '映像にしたい物語はありますか？',
    lead: '制作のご依頼、研修、コンサルティングのご相談はこちらから。日本語でお問い合わせいただけます。用途、尺、スケジュールをお知らせください。2営業日以内にご返信します。',
    fields: ['お名前', '会社名・部署', '電話番号（任意）', '用途と視聴者', '尺または話数', '公開希望日', 'ご予算', '参考動画のURL'],
    subject: (name) => `【${name}のご相談】`,
    serviceLine: (name) => `サービス：${name}`,
    bodyLabel: 'プロジェクトの概要：',
    other: { name: 'その他', summary: '取材のご依頼、協業のご提案、そのほかのお問い合わせ' },
    formTitle: 'HALLUCINATION FIVE（幻五映像）お問い合わせフォーム',
    formNote: 'フォームが正しく表示されない場合は',
    formOpen: '新しいタブで開く',
    mailTitle: 'メールでのお問い合わせ',
    mailLead: 'ご相談の種類を選ぶと、件名と項目が入力済みのメールが開きます。ご記入のうえ、そのまま送信してください。',
    tipsTitle: 'お知らせいただきたいこと',
    tips: [
      { label: '用途と視聴者', text: 'どこで公開し、誰に見てもらう映像か。' },
      { label: '尺または話数', text: '広告の秒数、MVの長さ、ドラマの話数と1話あたりの長さ。' },
      { label: '公開希望日', text: '公開日が決まっている案件は、先に日程をお知らせください。' },
      { label: 'ご予算', text: 'おおよその範囲で構いません（日本円でも可）。ご予算に合った進め方をご提案します。' },
      { label: '参考動画', text: '好きなテイストや作品のURLは、形容詞よりも正確に伝わります。' },
    ],
  },

  privacy: {
    title: 'プライバシーポリシー',
    description:
      'HALLUCINATION FIVE（幻五映像）公式サイトでの、お問い合わせ内容、動画の埋め込み、フォント読み込みに関する情報の取り扱い。本サイトはアクセス解析ツールとトラッキングCookieを使用していません。',
    intro: (legalName, date) =>
      `本ポリシーは、${legalName}（以下「幻五映像」）の公式サイトにおける情報の取り扱いについて説明するものです。最終更新：${date}。`,
    sections: [
      {
        h: '収集する情報',
        p: 'お客様ご自身から送信いただいたお問い合わせの内容（お名前、会社名、連絡先、プロジェクトの説明）のみです。これらの情報は、お問い合わせへの返信、お見積もり、プロジェクトの遂行にのみ使用し、第三者への提供やマーケティングへの利用は行いません。',
      },
      { h: 'アクセス解析とCookie', p: '本サイトでは現在、アクセス解析ツールを使用しておらず、トラッキング用のCookieも設定していません。' },
      {
        h: '動画の埋め込み',
        p: '作品ページの動画はyoutube-nocookie.comで埋め込まれており、再生ボタンを押すまで読み込まれません。読み込み後は、YouTubeが同社のプライバシーポリシーに基づいてデータを取り扱います。',
      },
      {
        h: 'フォント',
        p: '本サイトのフォントの一部はGoogle Fontsから提供されています。読み込みの際、GoogleはIPアドレスなどの接続情報を取得します。',
      },
      {
        h: '外部リンク',
        p: '本サイトからリンクしている外部サイト（YouTube、SNS、講座プラットフォームなど）には、それぞれのプライバシーポリシーが適用され、本ポリシーの対象外です。',
      },
    ],
    contactTitle: 'お問い合わせ',
    contact: { before: 'ご送信いただいた情報の照会、訂正、削除をご希望の場合は、', after: ' までご連絡ください。' },
  },
  processScript: {
    title: '脚本と絵コンテ',
    seoTitle: '脚本と絵コンテ：自社開発の4つのAIエージェントで、一行のアイデアから映像プロンプトまで',
    description: (agents, checks) =>
      `幻五は脚本と絵コンテの工程を、自社開発の${agents}つのAIエージェント（脚本、タイトル企画、コンテ、プロンプト）に任せ、一行のアイデアから映像モデルが読めるプロンプトまで仕上げます。途中で人が確認するポイントは${checks}か所です。`,
    meta: '制作フローの第2ステップ',
    lead: 'AI映像の出来は、生成ボタンを押す前にかなりの部分が決まっています。物語がきちんと書けているか、カットが考え抜かれているかです。',
    spec: {
      scope: '範囲',
      scopeValue: '一行のアイデアから映像プロンプトまで',
      agents: 'AIエージェント',
      agentsUnit: 'つ、すべて自社開発',
      checks: '人の確認',
      checksUnit: 'か所',
      output: '成果物',
      outputValue: 'テキストのみ（映像は直接生成しない）',
    },
    flowTitle: '一行のアイデアから映像プロンプトへ',
    intro:
      '幻五はこの工程を、自社開発の4つのAIエージェントスキル（Agent Skill）に任せています。前半でアイデアを脚本にしてタイトルを決め、後半で脚本をカットに割り、映像モデルが読めるプロンプトに変換します。各段階の成果は人が確認してから、次の段階に渡します。',
    agentLabel: 'AIエージェント',
    outputTag: '成果物',
    checkTag: '人が確認',
    lanes: [
      {
        id: 'story',
        name: '物語',
        sub: 'アイデアを脚本にする',
        nodes: [
          { kind: 'io', label: '入力', text: '一行のアイデア、キャラクター、あらすじ' },
          {
            kind: 'agent',
            no: '01',
            name: '脚本',
            body: '書き始める前に、設定、展開、尺を確認します。提出される初稿は、内部ですでに何度も推敲を重ねたものです。',
            output: '脚本の初稿',
            checks: ['質問への回答', '脚本の確認'],
          },
          {
            kind: 'agent',
            no: '02',
            name: 'タイトル企画',
            body: '脚本を結末まで読んでから名前をつけます。タイトルは脚本が描けることだけを約束し、隠すべき展開は明かしません。',
            output: 'タイトル案3～5案',
            checks: ['タイトルの決定'],
          },
          { kind: 'io', label: '成果物', text: '決定稿の脚本とタイトル' },
        ],
      },
      {
        id: 'picture',
        name: '映像',
        sub: '脚本をカットに落とし込む',
        nodes: [
          { kind: 'io', label: '入力', text: '決定稿の脚本' },
          {
            kind: 'agent',
            no: '03',
            name: 'コンテ',
            body: '心の動きを目に見える動作やモノに置き換えてから、カットに割ります。見せるのは最小限にして、観る人の推測に委ねます。',
            output: '文字コンテ',
            checks: ['文字コンテのチェック'],
          },
          {
            kind: 'agent',
            no: '04',
            name: 'プロンプト',
            body: 'キャラクターの外見、場所、画風を先に固定してから、動き、カメラワーク、音を書きます。カットが変わっても見た目がそろいます。',
            output: '映像プロンプト',
            checks: [],
          },
          { kind: 'io', label: '渡す先', text: '映像モデルでの生成' },
        ],
      },
    ],
    caption: 'の印は、人が判断する箇所です。4つのエージェントはテキストだけを出力し、映像を直接生成することはありません。',
    whyTitle: 'なぜ4つのエージェントに分けるのか',
    why: [
      '万能なプロンプトひとつで、物語を書き、カットを考え、映像モデルの読み方まで押さえるのは困難です。4つのエージェントに分ければ、それぞれが一つの仕事だけを担い、書き方のルールもチェックもその仕事に絞り込めます。',
      '途中の脚本と文字コンテは、人が読める文章です。おかしいところだけを直せばよく、カットを一つ変えるためにプロンプト全体を書き直す必要はありません。物語が成立しているか、カットで何を隠すかは、人が判断します。',
    ],
    processTitle: '制作フローの中での位置づけ',
    servicesLink: 'サービス一覧',
    ctaTitle: 'アイデアが一行だけでも、始められます',
    ctaLead: '用途、尺、スケジュールをお知らせください。脚本がまだなくても、物語づくりから一緒に整理します。',
    ctaSecondary: '商業映像のご相談',
  },
};

/**
 * 獎項名稱、名次與照片標籤的日文（作品與創辦人頁的獲獎紀錄）。
 * 查不到的照原文顯示，check-integrity 會提醒。英文賽事名不必列。
 */
export const AWARDS_JA = {
  titles: {
    'GMI Cloud × Wan × DV ASIA AI 影視職人創作大賽': 'GMI Cloud × Wan × DV ASIA AI映像クリエイターコンテスト',
    '愛奇藝 AI 短片創作大賽': 'iQIYI AIショートフィルムコンテスト',
    'Bouquet wiz AI MV 專業賽': 'Bouquet wiz AI MV プロ部門',
    '臺北生成藝術節 貼圖組': '台北生成アートフェスティバル スタンプ部門',
  },
  results: {
    第一名: '第1位',
    第二名: '第2位',
    第三名: '第3位',
    三等獎: '三等賞',
    決賽入圍: 'ファイナリスト',
    入圍: 'ノミネート',
    入選: '入選',
  },
  photoLabels: {
    獎狀: '賞状',
    獎盃與獎狀: 'トロフィーと賞状',
  },
};
