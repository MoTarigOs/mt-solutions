// Global Configuration Object for Mohamed Tarig's Portfolio
export const portfolioConfig = {
    // Global States
    state: {
      lang: 'en', // 'en' or 'ar'
      theme: 'light', // 'dark' or 'light'
    },
  
    // Translations Dictionary
    translations: {
      en: {
        role: "Multi-disciplinary Designer & Developer",
        heroTitle: "CRAFTING DIGITAL EXPERIENCES",
        heroSubtitle: "Designer, Developer, Innovator",
        work: "WORK",
        services: "SERVICES",
        about: "ABOUT",
        contact: "CONTACT",
        skillsetTitle: "MY UNIFIED SKILLSET",
        filterBy: "FILTER BY:",
        all: "All",
        web: "Web",
        apps: "Apps",
        games: "Games",
        systems: "Systems",
        logos: "Logos",
        contactMe: "CONTACT ME",
        namePlaceholder: "Name",
        emailPlaceholder: "Email",
        messagePlaceholder: "Message",
        sendBtn: "Send",
        servicesListTitle: "SERVICES SHORT LIST",
        aboutMeTitle: "ABOUT ME",
        aboutMeText: "Hello! I am Mohamed Tarig, an all-around creator fusing backend/system engineering, web & app development, with creative visual touchpoints like UI/UX, logos, and posters.",
        service1: "Full-Stack Web & Mobile Development",
        service2: "Systems Architecture & Software Tools",
        service3: "UI/UX Wireframing & App Redesigns",
        service4: "Brand Identity, Logos & Poster Design"
      },
      ar: {
        role: "مصمم ومطور متعدد التخصصات",
        heroTitle: "صناعة التجارب الرقمية",
        heroSubtitle: "مصمم، مطور، ومبتكر",
        work: "الأعمال",
        services: "الخدمات",
        about: "عني",
        contact: "اتصل بي",
        skillsetTitle: "مهاراتي المتكاملة",
        filterBy: "تصفية حسب:",
        all: "الكل",
        web: "مواقع",
        apps: "تطبيقات",
        games: "ألعاب",
        systems: "أنظمة",
        logos: "شعارات",
        contactMe: "تواصل معي",
        namePlaceholder: "الاسم",
        emailPlaceholder: "البريد الإلكتروني",
        messagePlaceholder: "الرسالة",
        sendBtn: "إرسال",
        servicesListTitle: "قائمة الخدمات السريعة",
        aboutMeTitle: "نبذة عني",
        aboutMeText: "مرحباً! أنا محمد طارق، صانع رقمي أدمج هندسة الأنظمة والبرمجة مع التصميم الإبداعي والهويات البصرية وتصميم واجهات المستخدم.",
        service1: "تطوير الويب وتطبيقات الهواتف بالكامل",
        service2: "هندسة الأنظمة والأدوات البرمجية",
        service3: "تصميم واجهات وتجربة المستخدم UI/UX",
        service4: "هويات العلامات التجارية، الشعارات والملصقات"
      }
    },
  
    // Skills Data matching your right panel
    skills: [
      { title: "UI/UX Design", icon: "🎨", desc: "Figma & Wireframing" },
      { title: "JS & Web Dev", icon: "⚡", desc: "React, Next.js, Node" },
      { title: "App Development", icon: "📱", desc: "Flutter & Mobile" },
      { title: "Systems Engineering", icon: "⚙️", desc: "Python, C++, Tools" },
      { title: "Game Development", icon: "🎮", desc: "Unity & Godot" },
      { title: "Branding & Logos", icon: "✒️", desc: "Posters & Identity" }
    ],
  
    // Projects Matrix matching your design grid
    projects: [
      { id: 1, title: "E-Commerce Platform", category: "Web", tech: "React / Node.js", image: "https://images.unsplash.com/photo-1557821552-17105176678c?w=600&auto=format&fit=crop&q=80" },
      { id: 2, title: "Fitness Tracking App", category: "Apps", tech: "Flutter / Mistor", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80" },
      { id: 3, title: "Pixel Adventure Game", category: "Games", tech: "Unity / 8bit", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80" },
      { id: 4, title: "IoT Smart Home Control", category: "Systems", tech: "Python / C++", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80" },
      { id: 5, title: "Brand Identity for Tech Startup", category: "Logos", tech: "Illustrator / Branding", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80" },
      { id: 6, title: "SaaS Dashboard UI/UX", category: "Web", tech: "Figma / React", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80" }
    ]
  };