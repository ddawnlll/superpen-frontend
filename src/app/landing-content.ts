import type { Locale } from "@/lib/i18n";

export type Feature = {
  title: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export type Audience = {
  title: string;
  description: string;
  points: string[];
};

export type Capability = {
  title: string;
  description: string;
};

export type ComparisonRow = {
  label: string;
  superpen: string;
  epicPen: string;
  winner: "superpen" | "both";
};

export type FaqItem = {
  question: string;
  answer: string;
};

type DemoMode = {
  id: "annotate" | "screenshot" | "board";
  label: string;
  badge: string;
  note: string;
  badgeClass: string;
  noteAccentClass: string;
  activeTool: string;
  status: string;
};

type LandingContent = {
  navbar: {
    ariaLabel: string;
    nav: {
      features: string;
      workflow: string;
      faq: string;
      download: string;
    };
    languageLabel: string;
    languageNames: Record<Locale, string>;
    theme: {
      auto: string;
      light: string;
      dark: string;
      cycleAriaLabel: string;
      titlePrefix: string;
    };
  };
  hero: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    kicker: string;
    description: string;
    currentReleaseLabel: string;
    currentReleaseConnector: string;
    primaryCtaReady: string;
    primaryCtaPending: string;
    secondaryCta: string;
    benefits: string[];
    benefitsAriaLabel: string;
    demoAriaLabel: string;
    modes: DemoMode[];
    sharedScreen: string;
    lessonNotes: string;
    algebra: string;
    screenshots: string;
    customShapes: string;
    visibleUnderneath: string;
    quadraticReview: string;
    quadraticReviewDescription: string;
    activeToolLabel: string;
    overlayStateLabel: string;
    explainThisStep: string;
    copy: string;
    save: string;
    cancel: string;
    boardModeOn: string;
    boardBackground: string;
    clickThrough: string;
    savedSettings: string;
    floatingToolbar: string;
    toolbarButtons: string[];
    colorValue: string;
    penSize: string;
  };
  featuresSection: {
    badge: string;
    title: string;
    description: string;
    items: Feature[];
  };
  comparisonSection: {
    badge: string;
    title: string;
    description: string;
    highlightBadge: string;
    highlightTitle: string;
    highlightDescription: string;
    badges: Array<{ label: string; icon: string }>;
    superpenLeads: string;
    tableAriaLabel: string;
    headers: {
      category: string;
      superpen: string;
      epicPen: string;
    };
    footer: string;
    rows: ComparisonRow[];
  };
  workflowSection: {
    badge: string;
    title: string;
    description: string;
    steps: Step[];
  };
  audienceSection: {
    badge: string;
    title: string;
    description: string;
    audiences: Audience[];
  };
  capabilitiesSection: {
    badge: string;
    title: string;
    description: string;
    capabilities: Capability[];
  };
  faqSection: {
    badge: string;
    title: string;
    description: string;
    items: FaqItem[];
  };
  ctaSection: {
    badge: string;
    title: string;
    description: string;
    noReleaseTitle: string;
    noReleaseDescription: string;
    currentReleaseFormat: string;
    primaryCtaReady: string;
    primaryCtaPending: string;
    secondaryCta: string;
    releaseDownload: string;
    releasesEmpty: string;
  };
  softwareStructuredData: {
    "@context": string;
    "@type": string;
    name: string;
    applicationCategory: string;
    operatingSystem: string;
    description: string;
    softwareVersion: string;
    offers: {
      "@type": string;
      price: string;
      priceCurrency: string;
    };
    audience: {
      "@type": string;
      audienceType: string;
    };
  };
};

const landingContentByLocale: Record<Locale, LandingContent> = {
  en: {
    navbar: {
      ariaLabel: "Primary",
      nav: {
        features: "Features",
        workflow: "Workflow",
        faq: "FAQ",
        download: "Download",
      },
      languageLabel: "Language",
      languageNames: {
        en: "EN",
        tr: "TR",
      },
      theme: {
        auto: "Auto",
        light: "Light",
        dark: "Dark",
        cycleAriaLabel: "Click to cycle between automatic, light, and dark modes.",
        titlePrefix: "Theme",
      },
    },
    hero: {
      badge: "Screen annotation overlay",
      titleLead: "Superpen lets you",
      titleAccent: "draw over anything on screen.",
      kicker: "Qt-based. Alpha early access.",
      description:
        "A desktop overlay for pen input, highlighting, text, shapes, screenshots, and fast live explanation, with the product heading toward a broader cross-platform release.",
      currentReleaseLabel: "Current release:",
      currentReleaseConnector: "for",
      primaryCtaReady: "Try Superpen free",
      primaryCtaPending: "Download coming soon",
      secondaryCta: "See the demo",
      benefits: [
        "Live markup over slides, browsers, PDFs, and apps",
        "Pen, phosphor highlighter, text, shapes, and screenshots",
        "Floating toolbar with saved settings and shortcuts",
      ],
      benefitsAriaLabel: "Key product benefits",
      demoAriaLabel: "Interactive Superpen demo",
      modes: [
        {
          id: "annotate",
          label: "Annotate",
          badge: "Pen overlay",
          note: "The toolbar floats above your desktop while the canvas stays transparent over the content underneath.",
          badgeClass: "bg-[rgba(255,207,191,0.6)] text-[#ba5747]",
          noteAccentClass: "text-[#ba5747]",
          activeTool: "Pen",
          status: "Click-through outside toolbar",
        },
        {
          id: "screenshot",
          label: "Screenshot",
          badge: "Capture flow",
          note: "Drag a region, then copy it to the clipboard or save it to your computer from the inline action bar.",
          badgeClass: "bg-[rgba(114,213,183,0.28)] text-[#1d7f62]",
          noteAccentClass: "text-[#1d7f62]",
          activeTool: "Shot",
          status: "Selection ready",
        },
        {
          id: "board",
          label: "Board",
          badge: "Board mode",
          note: "Board mode gives you a focused background for live explanation while keeping the same tools close by.",
          badgeClass: "bg-[rgba(246,196,83,0.26)] text-[#9f6c09]",
          noteAccentClass: "text-[#9f6c09]",
          activeTool: "Board",
          status: "Black board active",
        },
      ],
      sharedScreen: "Shared screen",
      lessonNotes: "Lesson notes",
      algebra: "Algebra",
      screenshots: "Screenshots",
      customShapes: "Custom shapes",
      visibleUnderneath: "Visible underneath Superpen",
      quadraticReview: "Quadratic review",
      quadraticReviewDescription: "Factor the expression and show each step clearly.",
      activeToolLabel: "Active tool",
      overlayStateLabel: "Overlay state",
      explainThisStep: "explain this step",
      copy: "Copy",
      save: "Save",
      cancel: "Cancel",
      boardModeOn: "board mode on",
      boardBackground: "Background: black board",
      clickThrough: "Click-through",
      savedSettings: "Saved settings",
      floatingToolbar: "Floating toolbar",
      toolbarButtons: ["Cursor", "Pen", "Erase", "Select", "Shot", "Shape", "Board"],
      colorValue: "#FF4444",
      penSize: "3 px",
    },
    featuresSection: {
      badge: "What Superpen actually is",
      title: "A lightweight overlay for live annotation on top of your desktop.",
      description:
        "Superpen is built with Qt and currently ships as an alpha early-access desktop app. The product is closer to a fast on-screen markup layer than a full whiteboard suite, which is exactly what makes it useful during live work.",
      items: [
        {
          title: "Annotate on top of your screen",
          description:
            "Superpen runs as a transparent overlay so you can draw over slides, PDFs, websites, videos, and apps without breaking your flow.",
        },
        {
          title: "Switch tools fast",
          description:
            "Jump between cursor, pen, phosphor highlighter, shapes, text, selection, screenshot, and eraser from one floating toolbar.",
        },
        {
          title: "Built-in teaching utilities",
          description:
            "Use board mode, fading ink, math shapes, saved custom shapes, editable shortcuts, and persistent settings without opening a heavy design app.",
        },
      ],
    },
    comparisonSection: {
      badge: "Superpen vs Epic Pen",
      title: "The comparison gets interesting when you look past basic screen ink.",
      description:
        "Epic Pen is established and polished, but Superpen already pulls ahead in the areas that matter most for math-heavy explanation and deeper customization.",
      highlightBadge: "Why Superpen stands out",
      highlightTitle: "More built in, less paywall, and far more math-first tooling.",
      highlightDescription:
        "The strongest current advantages are straightforward: no subscription, 48 built-in math shapes, reusable custom-shape creation, and a more ambitious annotation workflow than the usual pen-plus-highlighter setup.",
      badges: [
        { label: "No subscription", icon: "*" },
        { label: "48 math shapes", icon: "48" },
        { label: "Saved custom shapes", icon: "<>" },
        { label: "Custom colors", icon: "o" },
        { label: "Board mode", icon: "#" },
        { label: "Editable shortcuts", icon: "K" },
      ],
      superpenLeads: "Superpen leads",
      tableAriaLabel: "Superpen compared with Epic Pen",
      headers: {
        category: "Category",
        superpen: "Superpen",
        epicPen: "Epic Pen",
      },
      footer:
        "Comparison reflects the current Superpen repository and Epic Pen’s public features, user-guide, and pricing pages.",
      rows: [
        {
          label: "Pricing model",
          superpen: "No subscription in the current alpha early-access build",
          epicPen: "Epic Pen Pro starts with a 14-day trial, then paid billing",
          winner: "superpen",
        },
        {
          label: "Math-ready shape library",
          superpen: "48 built-in math shapes from the current app library",
          epicPen: "No built-in math shape library listed publicly",
          winner: "superpen",
        },
        {
          label: "Custom shape creation",
          superpen: "Create and save your own reusable custom shapes",
          epicPen: "No comparable custom shape creation flow listed publicly",
          winner: "superpen",
        },
        {
          label: "Color workflow",
          superpen: "Custom color picker in the app, plus persistent settings",
          epicPen: "Expanded colors and custom quick colors are described as Pro features",
          winner: "superpen",
        },
        {
          label: "Core annotation tools",
          superpen: "Pen, highlight, text, screenshots, board mode, shapes, math shapes, fading ink",
          epicPen: "Pen, highlighter, screenshots, text, shapes, whiteboard and blackboard, fading ink",
          winner: "both",
        },
        {
          label: "Power-user customization",
          superpen: "Editable shortcuts, theme options, smoothing, saved preferences, custom shapes",
          epicPen: "Hotkey support and Pro customization options are documented publicly",
          winner: "superpen",
        },
      ],
    },
    workflowSection: {
      badge: "How it works",
      title: "Built around fast desktop markup, not heavyweight canvas setup.",
      description:
        "Superpen stays out of the way until you need it, then gives you the right tool quickly for explanation, annotation, or capture.",
      steps: [
        {
          title: "Launch the overlay",
          description:
            "Open Superpen and keep the toolbar available while the rest of your desktop stays visible underneath.",
        },
        {
          title: "Draw, type, or capture",
          description:
            "Write freehand, drop in text, place geometry and math shapes, select regions, or capture screenshots to the clipboard or to a file.",
        },
        {
          title: "Keep your setup the way you like it",
          description:
            "Your color, pen size, theme, language, shortcuts, custom shapes, and other preferences are saved between sessions.",
        },
      ],
    },
    audienceSection: {
      badge: "Where it fits",
      title: "Useful anywhere you need to mark up a live screen.",
      description:
        "The current app clearly leans toward teaching workflows, but the core interaction model works for any on-screen explanation task and is being shaped toward a broader cross-platform release over time.",
      audiences: [
        {
          title: "For teaching and tutoring",
          description:
            "Explain directly on top of slides, browser tabs, worksheets, and shared screens without switching into a separate whiteboard app.",
          points: ["Live classes", "Online tutoring", "Recorded walkthroughs"],
        },
        {
          title: "For demos and presentations",
          description:
            "Use Superpen as a fast desktop annotation layer when you need to highlight, label, or sketch over any application in real time.",
          points: ["Product demos", "Screen annotation", "Explainers"],
        },
      ],
    },
    capabilitiesSection: {
      badge: "Core capabilities",
      title: "The app already includes more than basic pen input.",
      description: "These are implemented parts of the product, not placeholder ideas for later.",
      capabilities: [
        {
          title: "Math and shape tools",
          description:
            "Rectangle, ellipse, line, arrow, triangle, math presets, and reusable custom shapes are all part of the app.",
        },
        {
          title: "Screenshot workflow",
          description:
            "Select a region and send it to the clipboard or save it to your computer from inside the overlay.",
        },
        {
          title: "Personalized workspace",
          description:
            "Dark and light themes, icon toggle, smoothing control, board colors, and editable shortcuts make the toolbar fit your setup.",
        },
      ],
    },
    faqSection: {
      badge: "FAQ",
      title: "Plain-language answers based on the repository as it exists today.",
      description: "The goal here is clarity, not inflated product positioning.",
      items: [
        {
          question: "Who is Superpen for?",
          answer:
            "Superpen is for anyone who needs a fast desktop annotation overlay, especially teachers, tutors, presenters, and people explaining ideas live on screen.",
        },
        {
          question: "What can it do today?",
          answer:
            "The current alpha build includes pen and highlighter tools, text, shapes, math shapes, custom shapes, selection, screenshots, board mode, fading ink, themes, shortcuts, saved settings, and English or Turkish language support.",
        },
        {
          question: "Which platform does this frontend describe?",
          answer:
            "This page reflects the current Windows desktop build in the repository. Superpen is built with Qt, and the product direction is cross-platform even though the active build shown here is still focused on Windows today.",
        },
      ],
    },
    ctaSection: {
      badge: "Current build",
      title: "Superpen is a Qt-based alpha early-access overlay for drawing and explaining on screen.",
      description:
        "The page now reflects the current Windows build while leaving room for the broader cross-platform direction of the product.",
      noReleaseTitle: "No public download yet",
      noReleaseDescription:
        "The download section stays hidden until a real release is published from the release server.",
      currentReleaseFormat: "Current release",
      primaryCtaReady: "Download for Windows",
      primaryCtaPending: "Download coming soon",
      secondaryCta: "View the preview",
      releaseDownload: "Download",
      releasesEmpty: "Releases will appear here after they are published from the release server.",
    },
    softwareStructuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Superpen",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Windows",
      description:
        "A Qt-based desktop overlay in alpha early access for drawing, highlighting, adding text, placing shapes, and capturing screenshots on top of any screen.",
      softwareVersion: "0.1.2-alpha",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Teachers, tutors, presenters, and desktop users who annotate on screen",
      },
    },
  },
  tr: {
    navbar: {
      ariaLabel: "Birincil gezinme",
      nav: {
        features: "Özellikler",
        workflow: "Akış",
        faq: "SSS",
        download: "İndir",
      },
      languageLabel: "Dil",
      languageNames: {
        en: "EN",
        tr: "TR",
      },
      theme: {
        auto: "Otomatik",
        light: "Açık",
        dark: "Koyu",
        cycleAriaLabel: "Otomatik, açık ve koyu modlar arasında geçiş yapmak için tıklayın.",
        titlePrefix: "Tema",
      },
    },
    hero: {
      badge: "Ekran üstü açıklama katmanı",
      titleLead: "Superpen ile",
      titleAccent: "ekrandaki her şeyin üstüne çizebilirsiniz.",
      kicker: "Qt tabanlı. Alfa erken erişim.",
      description:
        "Kalem girişi, vurgulama, metin, şekiller, ekran görüntüleri ve canlı anlatım için masaüstü üst katmanı; ürün zamanla daha geniş bir çoklu platform sürümüne ilerliyor.",
      currentReleaseLabel: "Güncel sürüm:",
      currentReleaseConnector: "için",
      primaryCtaReady: "Superpen’i ücretsiz dene",
      primaryCtaPending: "İndirme yakında",
      secondaryCta: "Demoyu gör",
      benefits: [
        "Sunular, tarayıcılar, PDF’ler ve uygulamalar üzerinde canlı işaretleme",
        "Kalem, fosforlu vurgulayıcı, metin, şekiller ve ekran görüntüleri",
        "Kaydedilmiş ayarlar ve kısayollarla yüzen araç çubuğu",
      ],
      benefitsAriaLabel: "Ürünün temel faydaları",
      demoAriaLabel: "Etkileşimli Superpen demosu",
      modes: [
        {
          id: "annotate",
          label: "Açıklama",
          badge: "Kalem katmanı",
          note: "Araç çubuğu masaüstünüzün üstünde yüzerken tuval alttaki içeriğin üzerinde şeffaf kalır.",
          badgeClass: "bg-[rgba(255,207,191,0.6)] text-[#ba5747]",
          noteAccentClass: "text-[#ba5747]",
          activeTool: "Kalem",
          status: "Araç çubuğu dışında tıklama geçişi",
        },
        {
          id: "screenshot",
          label: "Ekran görüntüsü",
          badge: "Yakalama akışı",
          note: "Bir bölgeyi sürükleyin, ardından satır içi işlem çubuğundan panoya kopyalayın veya bilgisayarınıza kaydedin.",
          badgeClass: "bg-[rgba(114,213,183,0.28)] text-[#1d7f62]",
          noteAccentClass: "text-[#1d7f62]",
          activeTool: "Çekim",
          status: "Seçim hazır",
        },
        {
          id: "board",
          label: "Tahta",
          badge: "Tahta modu",
          note: "Tahta modu, aynı araçları elinizin altında tutarken canlı anlatım için odaklı bir arka plan sağlar.",
          badgeClass: "bg-[rgba(246,196,83,0.26)] text-[#9f6c09]",
          noteAccentClass: "text-[#9f6c09]",
          activeTool: "Tahta",
          status: "Kara tahta etkin",
        },
      ],
      sharedScreen: "Paylaşılan ekran",
      lessonNotes: "Ders notları",
      algebra: "Cebir",
      screenshots: "Ekran görüntüleri",
      customShapes: "Özel şekiller",
      visibleUnderneath: "Superpen altında görünen içerik",
      quadraticReview: "İkinci derece tekrar",
      quadraticReviewDescription: "İfadeyi çarpanlara ayırın ve her adımı net şekilde gösterin.",
      activeToolLabel: "Etkin araç",
      overlayStateLabel: "Katman durumu",
      explainThisStep: "bu adımı açıkla",
      copy: "Kopyala",
      save: "Kaydet",
      cancel: "Vazgeç",
      boardModeOn: "tahta modu açık",
      boardBackground: "Arka plan: kara tahta",
      clickThrough: "Tıklama geçişi",
      savedSettings: "Kaydedilmiş ayarlar",
      floatingToolbar: "Yüzen araç çubuğu",
      toolbarButtons: ["İmleç", "Kalem", "Sil", "Seç", "Çekim", "Şekil", "Tahta"],
      colorValue: "#FF4444",
      penSize: "3 px",
    },
    featuresSection: {
      badge: "Superpen aslında nedir",
      title: "Masaüstünüzün üstünde canlı açıklama için hafif bir katman.",
      description:
        "Superpen Qt ile geliştirildi ve şu anda alfa erken erişim masaüstü uygulaması olarak sunuluyor. Ürün, tam kapsamlı bir beyaz tahta paketinden çok hızlı bir ekran üstü işaretleme katmanına yakın; canlı kullanımda onu faydalı yapan da tam olarak bu.",
      items: [
        {
          title: "Ekranınızın üstüne açıklama ekleyin",
          description:
            "Superpen şeffaf bir katman olarak çalışır; böylece akışınızı bozmadan sunular, PDF’ler, web siteleri, videolar ve uygulamalar üzerine çizebilirsiniz.",
        },
        {
          title: "Araçlar arasında hızlı geçin",
          description:
            "Tek bir yüzen araç çubuğundan imleç, kalem, fosforlu vurgulayıcı, şekiller, metin, seçim, ekran görüntüsü ve silgi arasında geçiş yapın.",
        },
        {
          title: "Yerleşik öğretim araçları",
          description:
            "Ağır bir tasarım uygulaması açmadan tahta modu, solan mürekkep, matematik şekilleri, kaydedilmiş özel şekiller, düzenlenebilir kısayollar ve kalıcı ayarlar kullanın.",
        },
      ],
    },
    comparisonSection: {
      badge: "Superpen ve Epic Pen",
      title: "Karşılaştırma, temel ekran mürekkebinin ötesine bakınca ilginçleşiyor.",
      description:
        "Epic Pen oturmuş ve cilalı bir ürün, ancak Superpen özellikle matematik ağırlıklı anlatım ve daha derin özelleştirme alanlarında şimdiden öne çıkıyor.",
      highlightBadge: "Superpen’i öne çıkaranlar",
      highlightTitle: "Daha fazlası yerleşik, daha az ödeme duvarı ve çok daha fazla matematik odaklı araç.",
      highlightDescription:
        "Bugünkü en güçlü avantajlar net: abonelik yok, 48 yerleşik matematik şekli, yeniden kullanılabilir özel şekil oluşturma ve alışılmış kalem-artı-vurgulayıcı düzeninden daha iddialı bir açıklama akışı.",
      badges: [
        { label: "Abonelik yok", icon: "*" },
        { label: "48 matematik şekli", icon: "48" },
        { label: "Kaydedilmiş özel şekiller", icon: "<>" },
        { label: "Özel renkler", icon: "o" },
        { label: "Tahta modu", icon: "#" },
        { label: "Düzenlenebilir kısayollar", icon: "K" },
      ],
      superpenLeads: "Superpen önde",
      tableAriaLabel: "Superpen ve Epic Pen karşılaştırması",
      headers: {
        category: "Kategori",
        superpen: "Superpen",
        epicPen: "Epic Pen",
      },
      footer:
        "Karşılaştırma, mevcut Superpen deposunu ve Epic Pen’in herkese açık özellik, kullanım kılavuzu ve fiyatlandırma sayfalarını temel alır.",
      rows: [
        {
          label: "Fiyatlandırma modeli",
          superpen: "Mevcut alfa erken erişim yapısında abonelik yok",
          epicPen: "Epic Pen Pro 14 günlük denemeyle başlıyor, ardından ücretli kullanıma geçiyor",
          winner: "superpen",
        },
        {
          label: "Matematiğe hazır şekil kütüphanesi",
          superpen: "Mevcut uygulama kütüphanesinde 48 yerleşik matematik şekli",
          epicPen: "Herkese açık olarak listelenmiş yerleşik matematik şekli kütüphanesi yok",
          winner: "superpen",
        },
        {
          label: "Özel şekil oluşturma",
          superpen: "Kendi yeniden kullanılabilir özel şekillerinizi oluşturup kaydedin",
          epicPen: "Herkese açık olarak listelenmiş benzer bir özel şekil oluşturma akışı yok",
          winner: "superpen",
        },
        {
          label: "Renk akışı",
          superpen: "Uygulama içinde özel renk seçici ve kalıcı ayarlar",
          epicPen: "Genişletilmiş renkler ve özel hızlı renkler Pro özellikleri olarak anlatılıyor",
          winner: "superpen",
        },
        {
          label: "Temel açıklama araçları",
          superpen: "Kalem, vurgulama, metin, ekran görüntüleri, tahta modu, şekiller, matematik şekilleri, solan mürekkep",
          epicPen: "Kalem, vurgulayıcı, ekran görüntüleri, metin, şekiller, beyaz tahta ve kara tahta, solan mürekkep",
          winner: "both",
        },
        {
          label: "İleri düzey özelleştirme",
          superpen: "Düzenlenebilir kısayollar, tema seçenekleri, yumuşatma, kaydedilmiş tercihler, özel şekiller",
          epicPen: "Kısayol desteği ve Pro özelleştirme seçenekleri herkese açık olarak belgelenmiş",
          winner: "superpen",
        },
      ],
    },
    workflowSection: {
      badge: "Nasıl çalışır",
      title: "Ağır tuval kurulumları yerine hızlı masaüstü işaretleme için tasarlandı.",
      description:
        "Superpen ihtiyaç duyana kadar aradan çekilir, sonra anlatım, açıklama veya yakalama için doğru aracı hızlıca sunar.",
      steps: [
        {
          title: "Katmanı başlatın",
          description:
            "Superpen’i açın; araç çubuğu elinizin altında kalsın, masaüstünüzün geri kalanı ise altında görünür olsun.",
        },
        {
          title: "Çizin, yazın veya yakalayın",
          description:
            "Serbest elle yazın, metin ekleyin, geometri ve matematik şekilleri yerleştirin, bölgeler seçin veya ekran görüntülerini panoya ya da dosyaya alın.",
        },
        {
          title: "Kurulumunuzu istediğiniz gibi koruyun",
          description:
            "Renk, kalem boyutu, tema, dil, kısayollar, özel şekiller ve diğer tercihleriniz oturumlar arasında kaydedilir.",
        },
      ],
    },
    audienceSection: {
      badge: "Kullanım alanları",
      title: "Canlı bir ekranı işaretlemeniz gereken her yerde kullanışlı.",
      description:
        "Mevcut uygulama açıkça öğretim akışlarına yakın duruyor; ancak temel etkileşim modeli ekrandaki her türlü anlatım işi için uygun ve zamanla daha geniş bir çoklu platform sürümüne doğru şekilleniyor.",
      audiences: [
        {
          title: "Öğretim ve özel ders için",
          description:
            "Ayrı bir beyaz tahta uygulamasına geçmeden sunular, tarayıcı sekmeleri, çalışma kağıtları ve paylaşılan ekranlar üzerinde doğrudan anlatın.",
          points: ["Canlı dersler", "Online özel ders", "Kayıtlı anlatımlar"],
        },
        {
          title: "Demolar ve sunumlar için",
          description:
            "Herhangi bir uygulamanın üstünde gerçek zamanlı olarak vurgulama, etiketleme veya çizim yapmanız gerektiğinde Superpen’i hızlı bir masaüstü açıklama katmanı olarak kullanın.",
          points: ["Ürün demoları", "Ekran açıklaması", "Anlatımlar"],
        },
      ],
    },
    capabilitiesSection: {
      badge: "Temel yetenekler",
      title: "Uygulama artık yalnızca temel kalem girişinden fazlasını içeriyor.",
      description: "Bunlar geleceğe ait fikirler değil, ürünün hâlihazırda uygulanmış parçalarıdır.",
      capabilities: [
        {
          title: "Matematik ve şekil araçları",
          description:
            "Dikdörtgen, elips, çizgi, ok, üçgen, matematik hazır ayarları ve yeniden kullanılabilir özel şekiller uygulamanın parçasıdır.",
        },
        {
          title: "Ekran görüntüsü akışı",
          description:
            "Bir bölge seçin ve katmanın içinden panoya gönderin veya bilgisayarınıza kaydedin.",
        },
        {
          title: "Kişiselleştirilmiş çalışma alanı",
          description:
            "Koyu ve açık temalar, simge geçişi, yumuşatma kontrolü, tahta renkleri ve düzenlenebilir kısayollar araç çubuğunu düzeninize uydurur.",
        },
      ],
    },
    faqSection: {
      badge: "SSS",
      title: "Bugünkü depo durumuna dayalı, sade dilli yanıtlar.",
      description: "Amaç abartılı konumlandırma değil, netlik.",
      items: [
        {
          question: "Superpen kimler için?",
          answer:
            "Superpen; özellikle öğretmenler, özel ders verenler, sunum yapanlar ve ekranda canlı anlatım yapan kişiler başta olmak üzere hızlı bir masaüstü açıklama katmanına ihtiyaç duyan herkes içindir.",
        },
        {
          question: "Bugün neler yapabiliyor?",
          answer:
            "Mevcut alfa sürümü; kalem ve vurgulayıcı araçları, metin, şekiller, matematik şekilleri, özel şekiller, seçim, ekran görüntüleri, tahta modu, solan mürekkep, temalar, kısayollar, kaydedilmiş ayarlar ve İngilizce ile Türkçe dil desteğini içerir.",
        },
        {
          question: "Bu arayüz hangi platformu anlatıyor?",
          answer:
            "Bu sayfa depodaki mevcut Windows masaüstü yapısını yansıtır. Superpen Qt ile geliştiriliyor ve ürün yönü çoklu platform olsa da burada gösterilen etkin yapı bugün hâlâ ağırlıklı olarak Windows odaklıdır.",
        },
      ],
    },
    ctaSection: {
      badge: "Güncel yapı",
      title: "Superpen, ekranda çizim ve anlatım için Qt tabanlı alfa erken erişim katmanıdır.",
      description:
        "Bu sayfa artık mevcut Windows yapısını yansıtırken ürünün daha geniş çoklu platform yönüne de alan bırakıyor.",
      noReleaseTitle: "Henüz herkese açık indirme yok",
      noReleaseDescription:
        "Gerçek bir sürüm yayın sunucusundan yayımlanana kadar indirme bölümü beklemede kalır.",
      currentReleaseFormat: "Güncel sürüm",
      primaryCtaReady: "Windows için indir",
      primaryCtaPending: "İndirme yakında",
      secondaryCta: "Önizlemeyi görüntüle",
      releaseDownload: "İndir",
      releasesEmpty: "Sürümler, yayın sunucusundan yayımlandıktan sonra burada görünecek.",
    },
    softwareStructuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Superpen",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Windows",
      description:
        "Herhangi bir ekranın üstünde çizim yapmak, vurgulamak, metin eklemek, şekiller yerleştirmek ve ekran görüntüsü almak için alfa erken erişimde Qt tabanlı masaüstü katmanı.",
      softwareVersion: "0.1.2-alpha",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Öğretmenler, özel ders verenler, sunum yapanlar ve ekranda açıklama yapan masaüstü kullanıcıları",
      },
    },
  },
};

export function getLandingContent(locale: Locale) {
  return landingContentByLocale[locale];
}

export const softwareStructuredData = landingContentByLocale.en.softwareStructuredData;
