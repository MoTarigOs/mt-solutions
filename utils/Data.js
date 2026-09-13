'use client';

import { 
    Globe, Smartphone, Cpu, Palette, 
    Gamepad2, Layers
} from 'lucide-react';
import project1Image from '@assets/images/project_rentnest.png';
import project2Image from '@assets/images/project_rentnestapp.png';
import project3Image from '@assets/images/project_unilogo2.png';
import project4Image from '@assets/images/project_mohab.png';
import project5Image from '@assets/images/project_sudasystem.png';
import project6Image from '@assets/images/project_machineshooter.png';
import project7Image from '@assets/images/project_dentistalgia.png';
import project8Image from '@assets/images/project_branding2.png';

export const homeData = {
    en: {
      brand: "Mohamed Tarig",
      badge: "MT SOLUTIONS",
      role: "Full-Stack Developer & Graphic Designer",
      heroTitle: "Building digital experiences with passion and precision.",
      heroSubtitle: "Specialized in building high-performance modern web applications, mobile solutions, and interactive digital interfaces.",
      workBtn: "Work",
      servicesBtn: "Services",
      aboutBtn: "About",
      contactBtn: "Contact",
      skillsetTitle: "Core Expertise Matrix",
      skillBadge: "Advanced Level",
      filterBy: "Filter:",
      allCat: "All",
      webCat: "Web",
      appsCat: "Apps",
      gamesCat: "Games",
      graphicsCat: "Graphics",
      sysCat: "Systems",
      worksTitle: "Featured Portfolio Work",
      servicesListTitle: "Professional Services",
      aboutMeTitle: "About Me",
      aboutMeText: "I am a dedicated software engineer and designer focused on delivering robust applications that combine clean technical execution with exceptional visual aesthetics. My workflow spans full-stack implementation, UI/UX architecture, and interactive product design.",
      detailedSkillsTitle: "Detailed Technical Stack",
      contactBadge: "Let's Connect",
      contactMain: "Have a project in mind? Let's build something extraordinary together.",
      contactSub: "Fill out the form and I'll get back to you within 24 hours.",
      nameLabel: "Your Name",
      namePlaceholder: "John Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "john@example.com",
      msgLabel: "Project Details",
      messagePlaceholder: "Tell me about your vision, goals, and timeline...",
      sendBtn: "Send Message Now",
      successMsg: "Message transmitted successfully! Mohamed Tarig will get back to you shortly.",
      directEmail: "contact@mohamedtarig.dev",
      directLocation: "Available Worldwide / Remote",
      directWhatsapp: "+249 113-710-781",
      viewServiceBtn: "Explore Service",
      serviceUniquePill: "Professional Solution",
      chatWelcome: "Hello! I am Mohamed's Virtual Assistant. What would you like to know?",
      chatOptionsPrompt: "Choose a question below to get instant answers:",
      skills: [
        { icon: <Globe size={18} />, title: "Full-Stack Web Engineering", desc: "Next.js, React, Node.js architecture", level: "98%" },
        { icon: <Smartphone size={18} />, title: "Cross-Platform Mobile Apps", desc: "React Native & responsive ecosystems", level: "95%" },
        { icon: <Cpu size={18} />, title: "Cloud Systems & APIs", desc: "Microservices, secure DB integrations", level: "90%" },
        { icon: <Palette size={18} />, title: "UI/UX & Brand Design", desc: "Design systems, Figma & motion", level: "92%" }
      ],
      detailedSkills: [
        "React.js", "Next.js App Router", "Node.js / Express.js", 
        "React Native", "Sass / SCSS", "APIs", 
        "MySQL / MongoDB", "Git & GitHub", "Figma Design Systems", "Unity 3D",
        "Blender 3D", "HTML / CSS / JS"
      ],
      projects: [
        { id: 1, title: "Property Rentals Site", category: "Web", tech: "Full Stack Website, Next.js, Node.js, Mongodb", image: project1Image, url: "https://rent-nest-site.vercel.app/" },
        { id: 2, title: "Cross Platform App", category: "Apps", tech: "React Native, Android / IOS APIs", image: project2Image },
        { id: 3, title: "AL-SAHEL College Branding", category: "Graphics", tech: "Brand Design", image: project3Image, url: '/alsahel.html?lang=en' },
        { id: 4, title: "Mohab Printing Website", category: "Web", tech: "React.js, HTML, CSS", image: project4Image, url: 'https://mohab-flax.vercel.app/' },
        { id: 5, title: "SUDA ERP System", category: "Systems", tech: "Express.js, Data Analysis (Dashboard), Scanning & Printing", image: project5Image, url: '/sudasystem.html?lang=en' },
        { id: 6, title: "Machine Shooter Game", category: "Games", tech: "Unity3D, C#, Blender 3D, Substance Painter", image: project6Image, url: '/videos/machineshooter_video.mp4' },
        { id: 7, title: "Dentistalgia Clinic", category: "Web", tech: "React.js, HTML, CSS", image: project7Image, url: 'https://dentistalgia.vercel.app/' },
        { id: 8, title: "Logo Designs", category: "Graphics", tech: "Logo Design", image: project8Image },
      ],
      services: [
        { 
          id: "web-dev", 
          title: "Web Development", 
          desc: "Fast, modern, and easy-to-use websites built to attract customers, present your services, and boost sales. From corporate portals to e-commerce stores, we deliver web experiences that look stunning on all devices.", 
          icon: <Globe size={22} />,
          url: "/services/web-dev?lang=en"
        },
        { 
          id: "apps-dev", 
          title: "Mobile App Development (iOS & Android)", 
          desc: "Custom mobile apps built for iPhone and Android users. Whether you need a booking app, online store, or internal operational tool, we handle design, coding, and publishing to App Store & Google Play.", 
          icon: <Smartphone size={22} />,
          url: "/services/apps-dev?lang=en"
        },
        { 
          id: "systems-dev", 
          title: "Custom Systems & Software", 
          desc: "Tailor-made management software designed to automate your daily workflows. We build custom ERPs, POS billing platforms, inventory tracking, and client management tools fitted to your exact rules.", 
          icon: <Cpu size={22} />,
          url: "/services/systems-dev?lang=en"
        },
        { 
          id: "logo-design", 
          title: "Logo Design", 
          desc: "Distinctive, memorable logos that capture your business identity at a single glance. You receive high-resolution vector files, dark/light variations, and print-ready formats ready for immediate use.", 
          icon: <Palette size={22} />,
          url: "/services/logo-design?lang=en"
        },
        { 
          id: "games-dev", 
          title: "Small Games Development", 
          desc: "Fun, lightweight 2D or web-based mini-games designed for interactive marketing campaigns, customer engagement, product launches, or standalone entertainment.", 
          icon: <Gamepad2 size={22} />,
          url: "/services/games-dev?lang=en"
        },
        { 
          id: "brand-design", 
          title: "Brand Identity Design", 
          desc: "A complete visual personality for your business. Beyond logos, we deliver full brand guidelines, color palettes, typography, business cards, social media templates, and invoice designs.", 
          icon: <Layers size={22} />,
          url: "/services/brand-design?lang=en"
        }
      ],
      chatbotFlows: [
        {
          question: "What services do you offer?",
          answer: "I provide comprehensive digital solutions including web development, mobile app creation, systems engineering, indie game development, UI/UX design, and professional graphic design."
        },
        {
          question: "What technologies do you use for web and mobile?",
          answer: "For web and mobile apps, I primarily use Next.js, React, TypeScript, Node.js, and React Native, ensuring high performance, scalability, and clean architecture."
        },
        {
          question: "Can you design a UI/UX or brand identity from scratch?",
          answer: "Yes! I design intuitive user interfaces and user experiences (UI/UX) along with complete graphic design packages, logos, and visual brand identities before writing any code."
        },
        {
          question: "Do you build custom software systems and games?",
          answer: "Yes, I build robust backend or desktop systems architecture as well as lightweight, engaging simple games using modern engines and web-based game technologies."
        },
        {
          question: "What is your typical project timeline?",
          answer: "Timelines depend entirely on the scope. A standard web app or UI/UX redesign typically takes 2–4 weeks, while larger full-stack systems or mobile apps require a custom timeline estimation."
        },
        {
          question: "How can we start working together?",
          answer: "You can send me a message through the contact form on this website or reach out directly to discuss your project requirements, goals, and timeline."
        }
      ]
    },
    ar: {
      brand: "محمد طارق",
      badge: "MT SOLUTIONS",
      role: "مطور برمجيات شامل ومصمم قرافيك",
      heroTitle: "نبني تجارب رقمية بشغف ودقة عالية.",
      heroSubtitle: "متخصص في بناء تطبيقات الويب الحديثة عالية الأداء، الحلول المحمولة، والواجهات الرقمية التفاعلية.",
      workBtn: "الأعمال",
      servicesBtn: "الخدمات",
      aboutBtn: "عني",
      contactBtn: "اتصل بي",
      skillsetTitle: "مصفوفة الخبرات الأساسية",
      skillBadge: "مستوى متقدم",
      filterBy: "التصفية:",
      allCat: "الكل",
      webCat: "الويب",
      appsCat: "التطبيقات",
      gamesCat: "الألعاب",      
      graphicsCat: "Graphics",
      sysCat: "Systems",
      worksTitle: "أبرز أعمالي",
      servicesListTitle: "الخدمات التي أقدمها",
      aboutMeTitle: "نبذة عني",
      aboutMeText: "أنا مهندس برمجيات ومصمم أكرس جهدي لتقديم تطبيقات قوية تدمج بين التنفيذ التقني النظيف والجماليات البصرية الاستثنائية. يغطي عملي تطوير الويب المتكامل، هندسة واجهات المستخدم، وتصميم المنتجات التفاعلية.",
      detailedSkillsTitle: "التقنيات والمهارات التفصيلية",
      contactBadge: "لنبدأ التواصل",
      contactMain: "هل لديك مشروع في ذهنك؟ دعنا نبني شيئاً استثنائياً معاً.",
      contactSub: "املأ النموذج وسأقوم بالرد عليك خلال 24 ساعة.",
      nameLabel: "اسمك الكريم",
      namePlaceholder: "محمد أحمد",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "name@example.com",
      msgLabel: "تفاصيل المشروع",
      messagePlaceholder: "أخبرني عن رؤيتك، أهدافك والجدول الزمني...",
      sendBtn: "إرسال الرسالة الآن",
      successMsg: "تم إرسال الرسالة بنجاح! سيتواصل معك محمد طارق قريباً.",
      directEmail: "contact@mohamedtarig.dev",
      directLocation: "متاح عالمياً / عن بُعد",
      directWhatsapp: "+249 113-710-781",
      viewServiceBtn: "استكشاف الخدمة",
      serviceUniquePill: "حلول احترافية",
      chatWelcome: "مرحباً! أنا المساعد الذكي لمحمد. كيف يمكنني مساعدتك اليوم؟",
      chatOptionsPrompt: "اختر سؤالاً أدناه للحصول على إجابة فورية:",
      skills: [
        { icon: <Globe size={18} />, title: "هندسة الويب الشاملة", desc: "هيكلة Next.js, React, Node.js", level: "98%" },
        { icon: <Smartphone size={18} />, title: "تطبيقات الهاتف المتعددة", desc: "React Native وأنظمة الهواتف", level: "95%" },
        { icon: <Cpu size={18} />, title: "أنظمة السحاب و APIs", desc: "خدمات مصغرة وربط قواعد البيانات", level: "92%" },
        { icon: <Palette size={18} />, title: "تصميم UI/UX والهوية", desc: "أنظمة التصميم، فجما والحركة", level: "96%" }
      ],
      detailedSkills: [
        "React.js", "Next.js App Router", "Node.js / Express.js", 
        "React Native", "Sass / SCSS", "APIs", 
        "MySQL / MongoDB", "Git & GitHub", "Figma Design Systems", "Unity 3D",
        "Blender 3D", "HTML / CSS / JS"
      ],
      projects: [
        { 
          id: 1, 
          title: "منصة تأجير العقارات", 
          category: "مواقع إلكترونية", 
          tech: "موقع متكامل (Full Stack)، Next.js، Node.js، MongoDB", 
          image: project1Image, 
          url: "https://rent-nest-site.vercel.app/" 
        },
        { 
          id: 2, 
          title: "تطبيق متعدد المنصات", 
          category: "تطبيقات", 
          tech: "React Native، واجهات برمجة Android / iOS", 
          image: project2Image 
        },
        { 
          id: 3, 
          title: "الهوية البصرية لكلية الساحل", 
          category: "تصميم وجرافيك", 
          tech: "تصميم علامات تجارية وهويات بصرية", 
          image: project3Image, 
          url: '/alsahel.html?lang=ar' 
        },
        { 
          id: 4, 
          title: "موقع مطبعة مهاب", 
          category: "مواقع إلكترونية", 
          tech: "React.js، HTML، CSS", 
          image: project4Image, 
          url: 'https://mohab-flax.vercel.app/' 
        },
        { 
          id: 5, 
          title: "نظام سودا لإدارة المؤسسات (SUDA ERP)", 
          category: "أنظمة وإدارة", 
          tech: "Express.js، لوحة تحليل بيانات، ربط أجهزة المسح والطباعة", 
          image: project5Image, 
          url: '/sudasystem.html?lang=ar' 
        },
        { 
          id: 6, 
          title: "لعبة Machine Shooter", 
          category: "ألعاب", 
          tech: "Unity3D، C#، Blender 3D، Substance Painter", 
          image: project6Image, 
          url: '/videos/machineshooter_video.mp4' 
        },
        { 
          id: 7, 
          title: "موقع عيادة Dentistalgia", 
          category: "مواقع إلكترونية", 
          tech: "React.js، HTML، CSS", 
          image: project7Image, 
          url: 'https://dentistalgia.vercel.app/' 
        },
        { 
          id: 8, 
          title: "معرض تصاميم الشعارات", 
          category: "تصميم وجرافيك", 
          tech: "تصميم شعارات (Logos)", 
          image: project8Image 
        },
      ],
      services: [
        { 
          id: "web-dev", 
          title: "تطوير المواقع الإلكترونية", 
          desc: "مواقع إلكترونية حديثة وسريعة مصممة لجذب العملاء وعرض خدماتك بشكل احترافي. نبني مواقع الشركات والمتاجر الإلكترونية لتظهر بمرونة وسرعة فائقة على جميع الهواتف والحواسب.", 
          icon: <Globe size={22} />,
          url: "/services/web-dev?lang=ar"
        },
        { 
          id: "apps-dev", 
          title: "تطوير تطبيقات الجوال (آيفون وأندرويد)", 
          desc: "تطبيقات جوال مخصصة لنظامي iOS و Android. سواء كنت تحتاج تطبيق حجز، متجر إلكتروني للمبيعات، أو أداة لإدارة العمليات، نبني لك تطبيقاً آمناً ونساعدك في نشره على App Store و Google Play.", 
          icon: <Smartphone size={22} />,
          url: "/services/apps-dev?lang=ar"
        },
        { 
          id: "systems-dev", 
          title: "تطوير الأنظمة والبرامج المخصصة", 
          desc: "أنظمة برمجية مخصصة لأتمتة أعمالك اليومية وتطوير أداء شركتك. نبني أنظمة إدارة المخازن، نقاط البيع الكاشير (POS)، وبرامج إدارة العملاء المصممة تماماً حسب طريقة عملك الخاصة.", 
          icon: <Cpu size={22} />,
          url: "/services/systems-dev?lang=ar"
        },
        { 
          id: "logo-design", 
          title: "تصميم الشعارات (Logo)", 
          desc: "شعارات مميزة ومبتكرة تعكس هوية مشروعك وتترك إنطباعاً دائماً لدى عملائك. تسلّم جميع الملفات المصدرية عالية الدقة وبنماذج متعددة تناسب الطباعة والمواقع اللإلكترونية.", 
          icon: <Palette size={22} />,
          url: "/services/logo-design?lang=ar"
        },
        { 
          id: "games-dev", 
          title: "تطوير الألعاب الخفيفة والتفاعلية", 
          desc: "ألعاب خفيفة وتفاعلية (2D أو ألعاب متصفح) مصممة خصيصاً للحملات التسويقية، إطلاق المنتجات الجديدة، أو زيادة تفاعل الجمهور مع علامتك التجارية بطريقة ممتعة.", 
          icon: <Gamepad2 size={22} />,
          url: "/services/games-dev?lang=ar"
        },
        { 
          id: "brand-design", 
          title: "تصميم الهوية البصرية الكاملة", 
          desc: "بناء هوية بصرية متكاملة تمنح مشروعك مظهرًا محترفًا ومتناسقًا. تشمل دليل الألوان، الخطوط، نماذج كروت العمل، المطبوعات، وقوالب التواصل الاجتماعي لتظهر شركتك بثقة.", 
          icon: <Layers size={22} />,
          url: "/services/brand-design?lang=ar"
        }
      ],
      chatbotFlows: [
        {
          question: "ما هي الخدمات التي تقدمها؟",
          answer: "أقدم حلولاً رقمية متكاملة تشمل تطوير الويب، وتطبيقات الجوال، وهندسة الأنظمة، وتطوير الألعاب البسيطة، وتصميم واجهات وتجربة المستخدم (UI/UX)، والتصميم الجرافيكي الاحترافي."
        },
        {
          question: "ما هي التقنيات التي تستخدمها في الويب والجوال؟",
          answer: "لتطبيقات الويب والجوال، أستخدم بشكل أساسي Next.js و React و TypeScript و Node.js و React Native، مما يضمن أداءً عالياً وقابلية للتوسع وبنية برمجية نظيفة."
        },
        {
          question: "هل يمكنك تصميم واجهات UI/UX أو الهوية البصرية من الصفر؟",
          answer: "نعم! أقوم بتصميم واجهات وتجربة مستخدم بديهية (UI/UX) إلى جانب حزم التصميم الجرافيكي المتكاملة، والشعارات، والهويات البصرية قبل كتابة أي سطر برمجي."
        },
        {
          question: "هل تقوم بناء أنظمة برمجية مخصصة وألعاب؟",
          answer: "نعم، أوم بناء هندسة أنظمة خلفية (Backend) أو سطح مكتب قوية، بالإضافة إلى ألعاب بسيطة وممتعة باستخدام محركات حديثة وتقنيات ألعاب الويب."
        },
        {
          question: "ما هو الوقت المستغرق عادةً لتنفيذ المشاريع؟",
          answer: "تختلف المواعيد النهائية تماماً حسب حجم ونطاق المشروع. عادةً ما يستغرق تطبيق الويب القياسي أو إعادة تصميم واجهات المستخدم من 2 إلى 4 أسابيع، بينما تتطلب الأنظمة الأكبر أو تطبيقات الجوال تقديراً مخصصاً للوقت."
        },
        {
          question: "كيف يمكننا بدء العمل معاً؟",
          answer: "يمكنك إرسال رسالة لي عبر نموذج الاتصال في هذا الموقع أو التواصل مباشرة لمناقشة متطلبات مشروعك، أهدافك، والجدول الزمني."
        }
      ]
    }
};