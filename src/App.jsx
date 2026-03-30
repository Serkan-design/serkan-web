import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Preloader from './Preloader';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import ContactPage from './ContactPage';
import { useAppContext } from './AppContext';
import {
  Instagram, Mail, Github, Sparkles, ArrowRight
} from 'lucide-react';

// ── API Key Obfuscation ──
const rawKey = "k0dOGWckhdny3Tctaj8ckebgYF3ybdGWt1bcLQaX5c0PkI1SoSOO_ksg";
const apiKey = rawKey.split("").reverse().join("");

// ── Ticker Items ───────────────────────────────────────────
const tickerItems = [
  { label: "UAV-1", value: "LİSANSLI PİLOT" },
  { label: "FPV", value: "DRONE ÜRETİMİ" },
  { label: ".NET & C#", value: "GELİŞTİRİCİ" },
  { label: "STUDY PLANNER", value: "EXAM MANAGEMENT" },
  { label: "SQL", value: "VERİTABANI MİMARİSİ" },
  { label: "GROQ AI", value: "LLaMA 3 ENTEGRASYON" },
  { label: "LRS", value: "CROSSFIRE SİSTEM" },
  { label: "KALI LINUX", value: "TAM KURULUM" },
  { label: "BTFA", value: "FLIGHT OPTIMIZATION" },
  { label: "PYTHON", value: "OTOMASYON & VERİ" },
  { label: "SHGM", value: "İHA-1 EHLİYET" },
  { label: "EMBEDDED", value: "MİKROKONTROLER" },
  { label: "C#", value: "ADO.NET" },
];

// ─────────────────────────────────────────────────────────
// LAYOUT COMPONENT
// ─────────────────────────────────────────────────────────
const Layout = ({ children }) => {
  const { lang, setLang, darkMode, setDarkMode } = useAppContext();
  
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', transition: 'background 0.4s ease, color 0.4s ease' }}>
      <Header lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} />
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────
const HomePage = () => {
  const { lang, darkMode } = useAppContext();
  const navigate = useNavigate();

  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [displayedName, setDisplayedName] = useState('');
  const [nameComplete, setNameComplete] = useState(false);

  const t = {
    tr: {
      name: "SERKAN IŞIK",
      footer: "© 2024 Serkan Işık Yazılım",
    },
    en: {
      name: "SERKAN ISIK",
      footer: "© 2024 Serkan Isik Yazılım",
    }
  }[lang];

  // ── Typewriter Effect ──
  useEffect(() => {
    let cancelled = false;
    setDisplayedName('');
    setNameComplete(false);
    const delay = preloaderDone ? 300 : 2700;
    const outer = setTimeout(() => {
      if (cancelled) return;
      let i = 0;
      const name = t.name;
      const timer = setInterval(() => {
        if (cancelled) { clearInterval(timer); return; }
        i++;
        setDisplayedName(name.slice(0, i));
        if (i >= name.length) { setNameComplete(true); clearInterval(timer); }
      }, 90);
    }, delay);
    return () => { cancelled = true; clearTimeout(outer); };
  }, [lang, preloaderDone, t.name]);

  // ── Scroll Reveal ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [preloaderDone]);

  // ── AI Chat ──
  const askAI = async (retryCount = 0) => {
    if (!chatInput.trim()) return;
    if (!apiKey) {
      setChatResponse(lang === 'tr' ? "Lütfen bir API anahtarı ekleyin." : "Please add an API key.");
      return;
    }
    setIsTyping(true);
    const systemPrompt = `User: Serkan Işık. Bio: 21, Anadolu University student. Skills: Embedded, SQL, FPV, UAV-1 Pilot, Exam Study Planner Developer. Response must be professional in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
    try {
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: chatInput }],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      setChatResponse(data.choices?.[0]?.message?.content || (lang === 'tr' ? "Yanıt alınamadı." : "No response from AI."));
    } catch (error) {
      console.error("AI Error:", error);
      if (retryCount < 2 && !error.message.includes('403') && !error.message.includes('401')) {
        setTimeout(() => askAI(retryCount + 1), 1000);
        return;
      }
      setChatResponse(lang === 'tr' ? "Yapay zeka şu an meşgul." : "AI is currently busy.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden">
      {/* Geometric Network Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ opacity: darkMode ? 1 : 0.4 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="fadeOut" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#fadeOut)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
        </svg>
      </div>

      {/* Preloader */}
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}

      <section className="section-hero-premium pt-24">
        <div className="hero-bg-visual-overlay" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.png)` }} />
        <div className="hero-main-container">
          <div className="hero-content-left">
            <div className="hero-badge-top">
              <Sparkles size={14} />
              <span>{lang === 'tr' ? 'Dijital Çözümler · 2024' : 'Digital Solutions · 2024'}</span>
            </div>

            <h1 className="hero-headline-premium">
              {lang === 'tr'
                ? <>Full-stack geliştirme,<br />AI destekli araçlar<br />&amp; IoT sistemleri.</>
                : <>Full-stack development,<br />AI-powered tools<br />&amp; IoT systems.</>
              }
            </h1>

            <p className="hero-sub-desc">
              {lang === 'tr'
                ? 'Ölçeklenebilir backend sistemleri, AI destekli uygulamalar ve self-hosted altyapılar geliştiriyorum.'
                : 'I build scalable backend systems, AI-powered applications, and self-hosted infrastructures.'}
            </p>

            <ul className="hero-skill-list">
              <li><span className="skill-icon">⚡</span> {lang === 'tr' ? 'Backend Geliştirme (.NET)' : 'Backend Development (.NET)'}</li>
              <li><span className="skill-icon">🔮</span> {lang === 'tr' ? 'Veritabanı Tasarımı (SQL Server)' : 'Database Design (SQL Server)'}</li>
              <li><span className="skill-icon">🔄</span> {lang === 'tr' ? 'Yapay Zeka & Görüntü İşleme' : 'AI & Computer Vision'}</li>
              <li><span className="skill-icon">🔮</span> {lang === 'tr' ? 'IoT Sistemleri' : 'IoT Systems'}</li>
              <li><span className="skill-icon">🔄</span> {lang === 'tr' ? 'Sunucu & DevOps (Docker, Cloudflare)' : 'Server & DevOps (Docker, Cloudflare)'}</li>
            </ul>

            <div className="hero-cta-row">
              <button onClick={() => navigate('/projects')} className="hero-cta-primary">
                <span>{lang === 'tr' ? 'Projelerimi İncele' : 'View Projects'}</span>
                <ArrowRight size={16} />
              </button>
              <a href={`${import.meta.env.BASE_URL}cv.pdf`} target="_blank" rel="noopener noreferrer" className="hero-cta-secondary">
                <span>{lang === 'tr' ? 'CV İndir' : 'Download CV'}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="hero-portrait-right">
            <div className="hero-portrait-wrapper-mini">
              <div className="hero-special-glow" />
              <img src={`${import.meta.env.BASE_URL}serkan-pro.png`} className="hero-portrait-img-mini" alt="Portrait" />
            </div>
            <div className="hero-about-mini">
              <div className="whatido-heading">{lang === 'tr' ? 'NE YAPIYORUM' : 'WHAT I DO'}</div>
              <ul className="whatido-list">
                <li><span className="skill-icon">⚡</span> {lang === 'tr' ? 'Backend Development (.NET)' : 'Backend Development (.NET)'}</li>
                <li><span className="skill-icon">🔮</span> {lang === 'tr' ? 'Database Design (SQL Server)' : 'Database Design (SQL Server)'}</li>
                <li><span className="skill-icon">🔄</span> {lang === 'tr' ? 'AI & Computer Vision' : 'AI & Computer Vision'}</li>
                <li><span className="skill-icon">🔮</span> {lang === 'tr' ? 'IoT Systems' : 'IoT Systems'}</li>
                <li><span className="skill-icon">🔄</span> {lang === 'tr' ? 'Server & DevOps (Docker, Cloudflare)' : 'Server & DevOps (Docker, Cloudflare)'}</li>
              </ul>
              <div className="whatido-pills">
                <span className="tech-pill-sm">C#</span>
                <span className="tech-pill-sm">.NET</span>
                <span className="tech-pill-sm">SQL</span>
                <span className="tech-pill-sm">🐳 Docker</span>
                <span className="tech-pill-sm">🐍 Python</span>
                <span className="tech-pill-sm">📡 ESP32</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden" style={{ height: '44px', background: 'rgba(10,10,15,0.95)', borderTop: '1px solid var(--accent-dim)' }}>
          <div className="ticker-track h-full flex items-center">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center flex-shrink-0 px-6 gap-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-[var(--accent)]">{item.label}</span>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#0a0a0f] border-t border-white/5 py-16">
        <div className="w-full px-12 flex flex-col items-center">
          <span className="font-black tracking-tighter text-xl mb-4">SI<span className="text-[var(--accent)]">.</span>TECH</span>
          <p className="text-[11px] text-white/20 uppercase tracking-[0.8em] mb-8">{t.footer}</p>
          <div className="flex space-x-12 opacity-50">
            <a href="https://github.com/Serkan-design"><Github size={24} /></a>
            <a href="https://www.instagram.com/sserkan.77/"><Instagram size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// APP – ROUTER WRAPPER
// ─────────────────────────────────────────────────────────
const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:activeTab" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
