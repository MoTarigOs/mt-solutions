'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Moon, Sun, Languages, Send, ArrowRight, CheckCircle2, 
  ExternalLink, Sparkles, Mail, MapPin, MessageSquare, X, MessageCircle, 
} from 'lucide-react';

import '@styles/sections/Hero.scss';
import { homeData } from '@utils/Data';
import { sendContactEmail } from '@utils/Api.js';
import myPic from '@assets/images/my_pic.png';
import Image from 'next/image';
import { ParticleBackground } from './ParticleBackground';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // Read URL parameters
  const urlLang = searchParams.get('lang');
  const urlMode = searchParams.get('mode') || searchParams.get('theme');
  const urlTab = searchParams.get('tab') || searchParams.get('section');

  // Initialize state from URL params or default values
  const [lang, setLang] = useState(urlLang === 'ar' ? 'ar' : 'en');
  const [theme, setTheme] = useState(urlMode === 'dark' ? 'dark' : 'light');
  const [activeTab, setActiveTab] = useState(
    urlTab === 'services' || urlTab === '0' ? 'services' : 'work'
  );
  const [activeFilter, setActiveFilter] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: homeData[lang]?.chatWelcome || homeData['en'].chatWelcome }
  ]);

  function useWindowDimensions() {
    const [dimensions, setDimensions] = useState({ width: undefined, height: undefined });
  
    useEffect(() => {
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return dimensions;
  };
  const { width, height } = useWindowDimensions();

  function useIsIOS() {
    const [isIOS, setIsIOS] = useState(false);
  
    useEffect(() => {
      const ua = window.navigator.userAgent;
      const iOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      // iPadOS 13+ reports as Mac, so also catch touch-enabled "Mac"
      const iPadOS13Up = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      setIsIOS(iOSDevice || iPadOS13Up);
    }, []);
  
    return isIOS;
  };
  const isIOS = useIsIOS();

  // Sync state when URL params change directly
  useEffect(() => {
    if (urlLang && (urlLang === 'en' || urlLang === 'ar')) {
      setLang(urlLang);
    }
    if (urlMode && (urlMode === 'dark' || urlMode === 'light')) {
      setTheme(urlMode);
    }
    if (urlTab) {
      if (urlTab === 'services' || urlTab === '0') {
        setActiveTab('services');
      } else if (urlTab === 'work' || urlTab === '1') {
        setActiveTab('work');
      }
    }
  }, [urlLang, urlMode, urlTab]);

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

  const handleToggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    setChatHistory([{ sender: 'bot', text: homeData[newLang].chatWelcome }]);
    updateUrlParams({ lang: newLang });
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateUrlParams({ mode: newTheme });
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    updateUrlParams({ tab: tabName });
    scrollToSection('dynamic-section');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChatSelect = (item) => {
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: item.question },
      { sender: 'bot', text: item.answer }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      const result = await sendContactEmail(formData);

      if (result && result.success) {
        setSubmitted(true);
        setStatusMessage(result.message);
        formElement.reset();
      } else {
        setStatusMessage(result?.message || (lang === 'en' ? 'Something went wrong.' : 'حدث خطأ ما.'));
      }
    } catch (error) {
      setStatusMessage(lang === 'en' ? 'Server connection error. Please try again.' : 'خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const currentItems = t.projects || [];
  const filteredItems = activeFilter === 'All' 
    ? currentItems 
    : currentItems.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div dir={dir} className={`portfolio-container ${theme}`} style={{ position: 'relative' }}>
      {/* Interactive Constellation Background */}
      <ParticleBackground theme={theme} />

      <header style={{ position: 'relative', zIndex: 1 }}>
        <div className="logo-box">
          <span>{t.badge}</span>
          {t.brand}
        </div>
        <div className="controls">
          <button onClick={handleToggleLang} style={{ color: theme === 'dark' ? 'white' : undefined }}>
            <Languages size={15} /> {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <button onClick={handleToggleTheme}>
            {theme === 'dark' ? <Sun size={16} color="#facc15" /> : <Moon size={16} color="#334155" />}
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <section className="hero-section">
          <div className="hero-main">
            <div className="hero-top-row">
              <div className="hero-text-content">
                <p className="role-title">{t.role}</p>
                <h1>{t.heroTitle}</h1>
                <p className="hero-subtitle">{t.heroSubtitle}</p>
              </div>
              <div className="hero-avatar-box">
                <Image src={myPic} alt="Profile" width={90} height={140} priority />
              </div>
            </div>
            <nav>
              <button onClick={() => handleTabChange('work')}>[{t.workBtn}]</button>
              <button onClick={() => handleTabChange('services')}>[{t.servicesBtn}]</button>
              <button onClick={() => scrollToSection('about')}>[{t.aboutBtn}]</button>
              <button onClick={() => scrollToSection('contact')}>[{t.contactBtn}]</button>
            </nav>
          </div>

          <div className="expertise-matrix">
            <div className="matrix-header">
              <h3>{t.skillsetTitle}</h3>
              <span className="matrix-badge">{t.skillBadge}</span>
            </div>
            <div className="matrix-list">
              {t.skills.map((skill, index) => (
                <div key={index} className="matrix-item">
                  <div className="matrix-left">
                    <div className="matrix-icon-box">{skill.icon}</div>
                    <div className="matrix-info">
                      <span className="matrix-title">{skill.title}</span>
                      <span className="matrix-desc">{skill.desc}</span>
                    </div>
                  </div>
                  <span className="matrix-level">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="dynamic-section" className="dynamic-section">
          {activeTab === 'work' ? (
            <>
              <div className="section-header">
                <h2>{t.worksTitle}</h2>
                <div className="filter-group">
                  <span>{t.filterBy}</span>
                  {[
                    { label: t.allCat, val: 'All' },
                    { label: t.webCat, val: 'Web' },
                    { label: t.appsCat, val: 'Apps' },
                    { label: t.graphicsCat, val: 'Graphics' },
                    { label: t.sysCat, val: 'Systems' },
                    { label: t.gamesCat, val: 'Games' },
                  ].map((fOpt) => (
                    <button
                      key={fOpt.val}
                      onClick={() => setActiveFilter(fOpt.val)}
                      className={activeFilter === fOpt.val ? 'active' : ''}
                      style={(isIOS) ? 
                          { 
                            borderColor: activeFilter === fOpt.val ? 'transparent' : theme === 'dark' ? '#fff' : '#000a',
                            color: activeFilter === fOpt.val ? 'white' : theme === 'dark' ? '#fff' : '#000a',
                            opacity: 1,
                          }
                        : { color: activeFilter === fOpt.val ? 'white' : theme === 'dark' ? '#fff' : 'black', opacity: 1 }}
                    >
                      {fOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cards-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="grid-card">
                    <div className="card-top-content">
                      <div className="card-image-box">
                        <Image src={item.image} alt={item.title} />
                        <span className="card-tag">{item.category}</span>
                      </div>
                      <div className="card-content">
                        <h3>{item.title}</h3>
                        <p>{item.tech}</p>
                      </div>
                    </div>
                    {item.url && (
                      <div className="card-footer">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                          <span>{lang === 'en' ? 'View Project' : 'عرض المشروع'}</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="section-header">
                <h2>{t.servicesListTitle}</h2>
              </div>

              <div className="services-grid">
                {t.services.map((service) => (
                  <div key={service.id} className="service-unique-card">
                    <div className="service-card-top">
                      <div className="service-icon-wrapper">
                        {service.icon}
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.desc}</p>
                    </div>
                    <div className="service-card-action">
                      <span className="service-pill">{t.serviceUniquePill}</span>
                      <a href={service.url + '&mode=' + (theme === 'dark' ? 'dark' : 'light')} className="service-detail-btn">
                        <span>{t.viewServiceBtn}</span>
                        <ArrowRight size={14} style={{ transform: lang === 'ar' ? 'rotate(180deg)' : '' }} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section id="about" className="info-section">
          <div className="card-box">
            <h3>{t.aboutMeTitle}</h3>
            <p className="about-text">{t.aboutMeText}</p>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem', opacity: 0.9 }}>{t.detailedSkillsTitle}</h4>
            <div className="detailed-skills-tags">
              {t.detailedSkills.map((tag, idx) => (
                <span key={idx} className="skill-tag">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section-innovated">
          <div className="contact-grid-layout">
            <div className="contact-info-side">
              <div className="contact-badge">
                <Sparkles size={14} /> {t.contactBadge}
              </div>
              <h2>{t.contactMain}</h2>
              <p>{t.contactSub}</p>
              
              <div className="contact-direct-links">
                <div className="direct-item">
                  <div className="icon-wrap"><Mail size={16} /></div>
                  <span>{t.directEmail}</span>
                </div>
                <div className="direct-item">
                  <div className="icon-wrap"><MessageCircle size={16} /></div>
                  <span>{t.directWhatsapp}</span>
                </div>
                <div className="direct-item">
                  <div className="icon-wrap"><MapPin size={16} /></div>
                  <span>{t.directLocation}</span>
                </div>
              </div>
            </div>

            <div className="contact-form-side">
              {submitted ? (
                <div className="success-box">
                  <CheckCircle2 size={20} /> {statusMessage || t.successMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="input-group">
                      <label>{t.nameLabel || (lang === 'en' ? 'Name' : 'الاسم')}</label>
                      <input type="text" name="name" placeholder={t.namePlaceholder || 'Name...'} required />
                    </div>
                    <div className="input-group">
                      <label>{t.emailLabel || (lang === 'en' ? 'Email' : 'البريد الإلكتروني')}</label>
                      <input type="email" name="email" placeholder={t.emailPlaceholder || 'name@example.com'} required />
                    </div>
                  </div>
                  
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label>{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                    <input type="tel" name="phone" placeholder={lang === 'ar' ? '+249...' : '+1 (555) 000-0000'} />
                  </div>

                  <div className="input-group">
                    <label>{t.msgLabel || (lang === 'en' ? 'Message' : 'الرسالة')}</label>
                    <textarea name="message" placeholder={t.messagePlaceholder || 'Your message...'} required></textarea>
                  </div>

                  <button type="submit" disabled={loading}>
                    <Send size={16} /> {loading ? (lang === 'en' ? 'Sending...' : 'جاري الإرسال...') : t.sendBtn}
                  </button>

                  {statusMessage && !submitted && (
                    <p className="text-sm mt-2 text-red-500" style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>
                      {statusMessage}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <div className="ai-chatbot-widget">
        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-title-info">
                <span></span>
                {lang === 'en' ? 'AI Assistant' : 'المساعد الذكي'}
              </div>
              <button className="close-chat-btn" onClick={() => setIsChatOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="chat-messages-area">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-options-area">
              <p style={{ fontSize: '10px', opacity: 0.6, paddingLeft: '4px' }}>{t.chatOptionsPrompt}</p>
              {t.chatbotFlows.map((flow, index) => (
                <button key={index} onClick={() => handleChatSelect(flow)}>
                  {flow.question}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className="chat-toggle-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}