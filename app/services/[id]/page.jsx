'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Moon, Sun, Languages, Send, CheckCircle2, 
  Sparkles, Mail, MapPin, MessageCircle, ArrowLeft, 
  Check, ShieldCheck, Clock, Zap, Flame,
  Layers, Plus, X
} from 'lucide-react';

import '@styles/sections/Hero.scss';
import '@styles/sections/ServiceDetail.scss';

import { homeData } from '@utils/Data';
import { sendContactEmail } from '@utils/Api.js';

// Exchange rates against USD — adjust these whenever rates change
const EXCHANGE_RATES = {
  USD: 1,
  SAR: 3.75,
  EGP: 51.5,
  SDG: 6500,
};

const CURRENCY_BY_COUNTRY = {
  SA: 'SAR',
  EG: 'EGP',
  SD: 'SDG',
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  SAR: 'SAR',
  EGP: 'EGP',
  SDG: 'SDG',
};

// Just set the USD price for each item — other currencies are calculated automatically
const servicePresets = {
  'web-dev': {
    basePriceUSD: 149.99,
    baseDelivery: '2-4 Weeks',
    features: [
      { id: 'responsive', labelEn: 'Works Great on Every Device', labelAr: 'يعمل بشكل ممتاز على جميع الأجهزة', priceUSD: 0, checked: true, force: true },
      { id: 'pages', labelEn: 'Up to 5 Pages', labelAr: 'حتى 5 صفحات', priceUSD: 0, checked: true, force: true },
      { id: 'cms', labelEn: 'Edit Your Content Yourself', labelAr: 'إمكانية تعديل المحتوى بنفسك', priceUSD: 49.99 },
      { id: 'ecommerce', labelEn: 'Online Store & Payments', labelAr: 'متجر إلكتروني ودفع أونلاين', priceUSD: 129.99 },
      { id: 'multilang', labelEn: 'Second Language Version', labelAr: 'نسخة بلغة ثانية', priceUSD: 29.99 },
    ]
  },
  'apps-dev': {
    basePriceUSD: 299.99,
    baseDelivery: '3-5 Weeks',
    features: [
      { id: 'cross', labelEn: 'One App for iPhone & Android', labelAr: 'تطبيق واحد للآيفون والأندرويد', priceUSD: 0, checked: true, force: true },
      { id: 'screens', labelEn: 'Up to 4 Screens', labelAr: 'حتى 4 شاشات', priceUSD: 0, checked: true, force: true },
      { id: 'push', labelEn: 'Push Notifications', labelAr: 'إشعارات فورية', priceUSD: 29.99 },
      { id: 'backend', labelEn: 'Save & Manage Data Online', labelAr: 'حفظ وإدارة البيانات أونلاين', priceUSD: 199.99 },
      { id: 'store', labelEn: 'Publish on App Store & Google Play', labelAr: 'نشر التطبيق على المتاجر', priceUSD: 44.99 },
    ]
  },
  'systems-dev': {
    basePriceUSD: 399.99,
    baseDelivery: '3-6 Weeks',
    features: [
      { id: 'dashboard', labelEn: 'Easy-to-Use Control Panel', labelAr: 'لوحة تحكم سهلة الاستخدام', priceUSD: 0, checked: true, force: true },
      { id: 'auth', labelEn: 'Staff Accounts & Permissions', labelAr: 'حسابات للموظفين وصلاحيات', priceUSD: 0, checked: true, force: true },
      // { id: 'reports', labelEn: 'Reports You Can Export', labelAr: 'تقارير قابلة للتصدير', priceUSD: 100 },
      // { id: 'hardware', labelEn: 'Connect Printers & Scanners', labelAr: 'ربط الطابعات وأجهزة المسح', priceUSD: 150 },
    ]
  },
  'logo-design': {
    basePriceUSD: 59.99,
    baseDelivery: '4-7 Days',
    features: [
      { id: 'concepts', labelEn: '3 Logo Ideas to Choose From', labelAr: '3 أفكار شعار للاختيار بينها', priceUSD: 0, checked: true, force: true },
      { id: 'vectors', labelEn: 'All Files You Need (Print & Web)', labelAr: 'جميع الملفات التي تحتاجها', priceUSD: 0, checked: true, force: true },
      { id: 'revisions', labelEn: 'Extra Rounds of Changes', labelAr: 'جولات تعديل إضافية', priceUSD: 19.99 },
      { id: 'fast', labelEn: 'Rush Delivery (48 Hours)', labelAr: 'تسليم سريع خلال 48 ساعة', priceUSD: 29.99 },
    ]
  },
  'branding': {
    basePriceUSD: 119.99,
    baseDelivery: '6-9 Days',
    features: [
      { id: 'logo', labelEn: 'Logo Design Included', labelAr: 'تصميم الشعار مشمول', priceUSD: 0, checked: true, force: true },
      { id: 'stationery', labelEn: 'Business Card & Letterhead', labelAr: 'كرت شخصي وترويسة رسمية', priceUSD: 0, checked: true, force: true },
      { id: 'guide', labelEn: 'Colors & Fonts Guide', labelAr: 'دليل الألوان والخطوط', priceUSD: 0, checked: true, force: true },
      { id: 'social', labelEn: 'Social Media Design Kit', labelAr: 'تصاميم لمواقع التواصل', priceUSD: 34.99 },
      { id: 'revisions', labelEn: 'Extra Rounds of Changes', labelAr: 'جولات تعديل إضافية', priceUSD: 19.99 },
    ]
  }
};

function ServiceDetailContent({ params }) {
  const unwrappedParams = React.use ? React.use(params) : params;
  const serviceId = unwrappedParams?.id;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL parameters
  const urlLang = searchParams.get('lang');
  const urlMode = searchParams.get('mode') || searchParams.get('theme');

  // Initialize state from URL params or default values
  const [lang, setLang] = useState(urlLang === 'ar' ? 'ar' : 'en');
  const [theme, setTheme] = useState(urlMode === 'dark' ? 'dark' : 'light');

  // Currency state, auto-detected from user location
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    let isMounted = true;

    const detectCurrency = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const detected = CURRENCY_BY_COUNTRY[data?.country_code];
        if (isMounted && detected) {
          setCurrency(detected);
        }
      } catch (err) {
        // silently fall back to USD if location lookup fails
      }
    };

    detectCurrency();

    return () => {
      isMounted = false;
    };
  }, []);

  const convertPrice = (usdAmount) => {
    const rate = EXCHANGE_RATES[currency] ?? 1;
    const converted = usdAmount * rate;
    if (currency === 'USD') return converted;
    const rounded = Math.round(converted);
    return rounded > 0 ? rounded - 0.01 : 0;
  };

  const formatPrice = (amount) => {
    const fixed = amount.toFixed(2);
    if (currency === 'USD') return `$${fixed}`;
    return `${fixed} ${CURRENCY_SYMBOLS[currency]}`;
  };

  // Dynamic Custom Scope State
  const preset = servicePresets[serviceId] || servicePresets['web-dev'];
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const initial = {};
    preset.features.forEach(f => {
      initial[f.id] = !!f.checked;
    });
    return initial;
  });

  const [customScopes, setCustomScopes] = useState([]);
  const [customInputText, setCustomInputText] = useState('');

  // Form Submission State
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Sync state when URL params change directly (e.g. user manually edits address bar)
  useEffect(() => {
    if (urlLang && (urlLang === 'en' || urlLang === 'ar')) {
      setLang(urlLang);
    }
    if (urlMode && (urlMode === 'dark' || urlMode === 'light')) {
      setTheme(urlMode);
    }
  }, [urlLang, urlMode]);

  // Helper to update URL search parameters dynamically
  const updateUrlParams = (newParams) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  const t = homeData[lang] || homeData['en'];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const currentService = t.services.find(s => s.id === serviceId) || t.services[0];

  const handleToggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    updateUrlParams({ lang: newLang });
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateUrlParams({ mode: newTheme });
  };

  const handleFeatureToggle = (featureId, isForce) => {
    if (isForce) return;
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  // Add Custom Scope Item
  const handleAddCustomScope = () => {
    const trimmed = customInputText.trim();
    if (!trimmed) return;
    
    setCustomScopes(prev => [...prev, trimmed]);
    setCustomInputText('');
  };

  const handleRemoveCustomScope = (indexToRemove) => {
    setCustomScopes(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Cost Logic: Swapped to "Custom" if any custom scope exists
  const hasCustomItems = customScopes.length > 0;
  
  const calculatedNumericPrice = convertPrice(preset.basePriceUSD) + preset.features.reduce((acc, feat) => {
    return selectedFeatures[feat.id] ? acc + convertPrice(feat.priceUSD) : acc;
  }, 0);

  const displayPriceLabel = hasCustomItems 
    ? (lang === 'en' ? 'Custom' : 'مخصص')
    : formatPrice(calculatedNumericPrice);

  // Build String of Selected + Custom Scopes
  const selectedFeatureNames = preset.features
    .filter(f => selectedFeatures[f.id])
    .map(f => (lang === 'ar' ? f.labelAr : f.labelEn));

  const allScopesCombined = [...selectedFeatureNames, ...customScopes.map(c => `[Custom: ${c}]`)].join(', ');

  // Redirect to WhatsApp with dynamic pre-filled text
  const handleWhatsAppRedirect = () => {
    const cleanPhone = (t.directWhatsapp || '').replace(/[^0-9]/g, '');
    const priceText = hasCustomItems 
      ? (lang === 'en' ? 'Custom Quote Needed' : 'يتطلب تسعير مخصص') 
      : `~${formatPrice(calculatedNumericPrice)}`;

    const messageText = lang === 'en'
      ? `Hello Mohamed! I want to order "${currentService.title}".\n\nEstimated Cost: ${priceText}\nSelected & Custom Scope: ${allScopesCombined}\n\nLet's discuss!`
      : `مرحباً محمد! أود طلب خدمة "${currentService.title}".\n\nالتكلفة التقديرية: ${priceText}\nالنطاق والميزات المطلوبة: ${allScopesCombined}\n\nأود بدء المناقشة معكم!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      const userNotes = formData.get('message') || '';
      const priceText = hasCustomItems ? 'Custom Quote' : `~${formatPrice(calculatedNumericPrice)}`;

      const formattedMessage = lang === 'en'
        ? `[SERVICE REQUEST: ${currentService.title}]\nEst. Price: ${priceText}\nScope Included: ${allScopesCombined}\n\nClient Notes: ${userNotes}`
        : `[طلب خدمة: ${currentService.title}]\nالتكلفة التقديرية: ${priceText}\nالنطاق والميزات: ${allScopesCombined}\n\nملاحظات العميل: ${userNotes}`;

      formData.set('message', formattedMessage);

      const result = await sendContactEmail(formData);

      if (result && result.success) {
        setSubmitted(true);
        setStatusMessage(result.message);
        formElement.reset();
      } else {
        setStatusMessage(result?.message || (lang === 'en' ? 'Something went wrong.' : 'حدث خطأ ما.'));
      }
    } catch (error) {
      setStatusMessage(lang === 'en' ? 'Server connection error.' : 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className={`portfolio-container ${theme} service-page-container`}>
      {/* HOMEPAGE UNIFIED NAVBAR */}
      <header>
        <div 
          className="logo-box" 
          onClick={() => {
            const query = searchParams.toString();
            router.push(`/${query ? `?${query}` : ''}`);
          }} 
          style={{ cursor: 'pointer' }}
        >
          <span>{t.badge}</span>
          {t.brand}
        </div>
        <div className="controls">
          <button onClick={handleToggleLang} style={{ color: theme === 'dark' ? 'white' : '#000' }}>
            <Languages size={15} /> {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <button onClick={handleToggleTheme} style={{ color: theme === 'dark' ? 'white' : '#000' }}>
            {theme === 'dark' ? <Sun size={16} color="#facc15" /> : <Moon size={16} color="#334155" />}
          </button>
        </div>
      </header>

      <main className="service-detail-main">
        {/* SUB NAVIGATION */}
        <div className="service-subnav">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={15} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : '' }}/> {lang === 'en' ? 'Back to Portfolio' : 'الرجوع للرئيسية'}
          </button>
          <span className="subnav-category">
            <Layers size={13} style={{ marginEnd: '5px', verticalAlign: lang === 'en' ? 'top' : 'middle', ...(lang === 'en' ? { marginRight: 8 } : { marginLeft: 8 }) }} />
            {currentService.category || (lang === 'en' ? 'Studio Package' : 'باقات الخدمات')}
          </span>
        </div>

        {/* STUDIO SPLIT CONVERSION GRID */}
        <div className="studio-split-grid">
          
          {/* LEFT SIDE: HERO & CALCULATOR */}
          <div>
            <div className="service-studio-hero">
              <span className="studio-pill">
                <Flame size={14} /> {lang === 'en' ? 'Guaranteed Deliverable' : 'تنفيذ مضمون ومحتل'}
              </span>
              <h1>{currentService.title}</h1>
              <p className="hero-description">{currentService.desc}</p>

              <div className="trust-metrics-strip">
                <div className="metric-badge">
                  <Clock size={16} className="icon" />
                  <span>{lang === 'en' ? 'Timeline:' : 'مدة التسليم:'} <strong>{preset.baseDelivery}</strong></span>
                </div>
                <div className="metric-badge">
                  <ShieldCheck size={16} className="icon" />
                  <span>{lang === 'en' ? '100% Quality Assurance' : 'ضمان شامل للخدمة'}</span>
                </div>
                <div className="metric-badge">
                  <Zap size={16} className="icon" />
                  <span>{lang === 'en' ? 'Direct Engineer Contact' : 'تواصل مباشر مع المنفذ'}</span>
                </div>
              </div>
            </div>

            {/* CALCULATOR & CUSTOM SCOPE CARD */}
            <div className="studio-calculator-card">
              <div className="calc-header">
                <h3>{lang === 'en' ? 'Custom Scope & Estimator' : 'حاسبة التكلفة ونطاق العمل'}</h3>
                <span>{lang === 'en' ? 'Interactive Selection' : 'تخصيص تفاعلي'}</span>
              </div>

              <div className="features-interactive-grid">
                {/* Standard Preset Items */}
                {preset.features.map((feat) => {
                  const isSelected = !!selectedFeatures[feat.id];
                  const featPrice = convertPrice(feat.priceUSD);
                  return (
                    <div
                      key={feat.id}
                      className={`feature-select-tile ${isSelected ? 'selected' : ''} ${feat.force ? 'locked' : ''}`}
                      onClick={() => handleFeatureToggle(feat.id, feat.force)}
                    >
                      <div className="tile-left">
                        <div className={`check-circle ${isSelected ? 'active' : ''}`}>
                          {isSelected && <Check size={12} />}
                        </div>
                        <span className="tile-text">{lang === 'ar' ? feat.labelAr : feat.labelEn}</span>
                      </div>
                      <span className="tile-price">
                        {featPrice === 0 ? (lang === 'en' ? 'Included' : 'مضمن') : `+${formatPrice(featPrice)}`}
                      </span>
                    </div>
                  );
                })}

                {/* Render Added Custom Scopes */}
                {customScopes.map((scopeText, idx) => (
                  <div key={idx} className="feature-select-tile custom-added-tile">
                    <div className="tile-left">
                      <div className="check-circle active">
                        <Check size={12} />
                      </div>
                      <span className="tile-text">{scopeText}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="tile-price custom-tag">
                        {lang === 'en' ? 'Custom' : 'مخصص'}
                      </span>
                      <button 
                        className="remove-custom-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCustomScope(idx);
                        }}
                        title={lang === 'en' ? 'Remove Custom Feature' : 'حذف الميزة المخصصة'}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Scope Input Form */}
              <div className="add-custom-scope-box">
                <input 
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomScope()}
                  placeholder={lang === 'en' ? 'Type custom scope or feature requirement...' : 'اكتب متطلب مخصص أو إضافي...'}
                />
                <button 
                  type="button"
                  className="add-scope-btn"
                  onClick={handleAddCustomScope}
                  disabled={!customInputText.trim()}
                  title={lang === 'en' ? 'Add Scope Requirement' : 'إضافة المتطلب'}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Estimation Summary Footer */}
              <div className="estimation-summary-box">
                <div className="price-display">
                  <span className="label">{lang === 'en' ? 'Estimated Investment' : 'التكلفة التقديرية'}</span>
                  <div className={`cost ${hasCustomItems ? 'custom-price-text' : ''}`}>
                    {displayPriceLabel}
                  </div>
                </div>
                <button className="cta-whatsapp-btn" onClick={handleWhatsAppRedirect}>
                  <MessageCircle size={18} />
                  {lang === 'en' ? 'Instant WhatsApp Order' : 'اطلب فوراً عبر واتساب'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CUSTOM FORM STACK */}
          <div>
            <div className="studio-form-card">
              <div className="form-header">
                <span className="form-badge">
                  <Sparkles size={13} /> {lang === 'en' ? 'Direct Booking' : 'حجز مباشر'}
                </span>
                <h3>{lang === 'en' ? 'Request Proposal' : 'طلب عرض سعر رسمي'}</h3>
                <p>{lang === 'en' ? 'Fill your details to send your dynamic scope estimate.' : 'أدخل بياناتك لإرسال نطاق المشروع والأسعار مباشرة.'}</p>
              </div>

              {submitted ? (
                <div className="success-box" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} />
                  <span>{statusMessage || t.successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form-fields-stack">
                  <div className="field-box">
                    <label>{t.nameLabel || (lang === 'en' ? 'Full Name' : 'الاسم الكامل')}</label>
                    <input type="text" name="name" placeholder={lang === 'en' ? 'John Doe' : 'اسمك الكريم...'} required />
                  </div>

                  <div className="field-box">
                    <label>{t.emailLabel || (lang === 'en' ? 'Email Address' : 'البريد الإلكتروني')}</label>
                    <input type="email" name="email" placeholder="name@example.com" required />
                  </div>

                  <div className="field-box">
                    <label>{lang === 'en' ? 'Phone / WhatsApp' : 'رقم الهاتف / واتساب'}</label>
                    <input type="tel" name="phone" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="field-box">
                    <label>{t.msgLabel || (lang === 'en' ? 'Project Details' : 'تفاصيل إضافية')}</label>
                    <textarea name="message" placeholder={lang === 'en' ? 'Describe your goals or vision...' : 'اكتب تفاصيل إضافية عن مشروعك...'}></textarea>
                  </div>

                  <button type="submit" className="submit-form-btn" disabled={loading}>
                    <Send size={16} />
                    {loading ? (lang === 'en' ? 'Sending Proposal...' : 'جاري الإرسال...') : (lang === 'en' ? 'Submit Official Request' : 'إرسال طلب الخدمة')}
                  </button>

                  {statusMessage && !submitted && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '6px', textAlign: 'center' }}>
                      {statusMessage}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>

        {/* DIRECT CONTACT FOOTER STRIP */}
        <div className="studio-contact-bar">
          <div className="contact-bar-item">
            <div className="icon-box"><Mail size={18} /></div>
            <span>{t.directEmail}</span>
          </div>
          <div className="contact-bar-item">
            <div className="icon-box"><MessageCircle size={18} /></div>
            <span>{t.directWhatsapp}</span>
          </div>
          <div className="contact-bar-item">
            <div className="icon-box"><MapPin size={18} /></div>
            <span>{t.directLocation}</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function ServiceDetailPage(props) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <ServiceDetailContent {...props} />
    </Suspense>
  );
}