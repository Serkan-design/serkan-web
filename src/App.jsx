import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import Header from './Header';
import Preloader from './Preloader';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import ContactPage from './ContactPage';
import {
  Instagram, Mail, Terminal, User, Plane,
  Award, Sparkles, Loader2, Code, Github,
  Cpu, Database, Globe, Send, ArrowRight
} from 'lucide-react';

// ── API Key Obfuscation ──
const rawKey = "k0dOGWckhdny3Tctaj8ckebgYF3ybdGWt1bcLQaX5c0PkI1SoSOO_ksg";
const apiKey = rawKey.split("").reverse().join("");

// ── Image Arrays ──────────────────────────────────────────
const aviationImages = [
  "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=1400",
];
const techImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1400",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1400",
];
const kenBurnsClasses = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3', 'ken-burns-4'];

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

const App = () => {
  const [lang, setLang] = useState('tr');
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  // Slider state
  const [aviationIdx, setAviationIdx] = useState(0);
  const [techIdx, setTechIdx] = useState(0);
  const [aviationGlitch, setAviationGlitch] = useState(false);
  const [techGlitch, setTechGlitch] = useState(false);

  // Parallax
  const [scrollY, setScrollY] = useState(0);

  // Preloader + Typewriter
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [displayedName, setDisplayedName] = useState('');
  const [nameComplete, setNameComplete] = useState(false);

  // Particles
  const particles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 9,
      gold: i % 3 === 0,
    })), []);

  // ── Slider advance functions ──
  const advanceAviation = useCallback(() => {
    setAviationGlitch(true);
    setTimeout(() => setAviationIdx(i => (i + 1) % aviationImages.length), 260);
    setTimeout(() => setAviationGlitch(false), 560);
  }, []);

  const advanceTech = useCallback(() => {
    setTechGlitch(true);
    setTimeout(() => setTechIdx(i => (i + 1) % techImages.length), 260);
    setTimeout(() => setTechGlitch(false), 560);
  }, []);

  // ── Auto-slider (staggered: tech starts 3s after aviation) ──
  useEffect(() => {
    const avTimer = setInterval(advanceAviation, 6000);
    let techTimer;
    const offsetTimer = setTimeout(() => {
      advanceTech();
      techTimer = setInterval(advanceTech, 6000);
    }, 3000);
    return () => {
      clearInterval(avTimer);
      clearTimeout(offsetTimer);
      clearInterval(techTimer);
    };
  }, [advanceAviation, advanceTech]);

  // ── Dark Mode persistence + body class ──
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ── Parallax on scroll ──
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Content ──
  const content = {
    tr: {
      title: "Resmî Portfolyo",
      name: "SERKAN IŞIK",
      subtitle: "Bilgisayar Programcılığı Öğrencisi",
      focus: "Gömülü Sistemler ve Veritabanı Geliştirme Odaklı",
      aboutTitle: "Hakkında & Özgeçmiş",
      aboutText: "21 yaşında, Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında aktif şekilde yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşarak disiplinli bir şekilde çalışmalarımı sürdürüyorum.\n\n.NET ekosistemi ve SQL tabanlı veri yapıları ile ölçeklenebilir backend sistemler geliştirirken, aynı zamanda Docker, Linux ve Cloudflare Tunnel gibi teknolojiler kullanarak kendi self-hosted sunucu altyapımı kuruyor ve yönetiyorum.\n\nModern yazılım prensiplerini mühendislik yaklaşımıyla birleştirerek kararlı, sürdürülebilir ve gerçek dünya problemlerine çözüm üreten sistemler geliştirmeye odaklanıyorum.\n\nKali Linux'u günlük işletim sistemi olarak tam kurulum şeklinde aktif olarak kullanıyorum. Ayrıca havacılık teknolojilerine olan ilgim doğrultusunda İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
      skillsTitle: "Teknik Yetkinlikler",
      fpvTitle: "Havacılık ve FPV Teknolojileri",
      fpvDesc: "FPV drone üretimi ve optimizasyonu gerçekleştirilmiştir. İHA-1 ehliyeti ile profesyonel uçuş yetkinliğine sahibim.",
      footer: "© 2024 Serkan Işık Yazılım",
      contactBtn: "İletişim",
      openAbout: "Hakkımda",
      aiPlaceholder: "Serkan'a bir şey sorun...",
      aiButton: "Sor ✨",
      skills: [
        { name: ".NET & C#", desc: "Uygulama geliştirme ve ADO.NET entegrasyonu." },
        { name: "Python", desc: "Veri işleme ve otomasyon çözümleri." },
        { name: "Veritabanı", desc: "İlişkisel tasarım ve SQL yönetimi." },
        { name: "Gömülü Sistemler", desc: "Mikrokontrolcü programlama." }
      ]
    },
    en: {
      title: "Official Portfolio",
      name: "SERKAN ISIK",
      subtitle: "Computer Programming Student",
      focus: "Embedded Systems & Database Development",
      aboutTitle: "About & Resume",
      aboutText: "As a 21-year-old Computer Programming student, I am actively involved in the technology world. I continue my studies in a disciplined manner, focusing on embedded systems and database architectures.\n\nWhile developing scalable backend systems with the .NET ecosystem and SQL-based data structures, I also build and manage my own self-hosted server infrastructure using technologies such as Docker, Linux, and Cloudflare Tunnel.\n\nI focus on developing stable, sustainable systems that provide solutions to real-world problems by combining modern software principles with an engineering approach.\n\nI actively use Kali Linux as my daily operating system in a full installation. Additionally, in line with my interest in aviation technologies, I am a drone pilot with a commercial UAV-1 license.",
      skillsTitle: "Skills",
      fpvTitle: "Aviation & FPV",
      fpvDesc: "FPV drone optimization. Commercial UAV-1 licensed pilot.",
      footer: "© 2024 Serkan Isik Yazılım",
      contactBtn: "Contact",
      openAbout: "About Me",
      aiPlaceholder: "Ask something...",
      aiButton: "Ask ✨",
      skills: [
        { name: ".NET & C#", desc: "App dev and ADO.NET integration." },
        { name: "Python", desc: "Data processing and automation." },
        { name: "Database", desc: "Relational design and SQL." },
        { name: "Embedded", desc: "Microcontroller programming." }
      ]
    }
  };

  const t = content[lang];

  // ── Typewriter Effect (must be after const t) ──
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, preloaderDone]);

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
    const systemPrompt = `User: Serkan Işık. Bio: 21, Anadolu University student. Skills: Embedded, SQL, FPV, UAV-1 Pilot, Exam Study Planner Developer. Response must be concise and professional in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
    try {
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: chatInput }
          ],
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
      setChatResponse(lang === 'tr' ? "Yapay zeka şu an meşgul veya API anahtarı hatalı." : "AI is busy or API key is invalid.");
    } finally {
      setIsTyping(false);
    }
  };

  // ── Slider dot click ──
  const goToAviation = (i) => {
    if (i === aviationIdx) return;
    setAviationGlitch(true);
    setTimeout(() => { setAviationIdx(i); }, 260);
    setTimeout(() => setAviationGlitch(false), 560);
  };
  const goToTech = (i) => {
    if (i === techIdx) return;
    setTechGlitch(true);
    setTimeout(() => { setTechIdx(i); }, 260);
    setTimeout(() => setTechGlitch(false), 560);
  };

  // ── Page routing ── 
  if (showAbout)    return <AboutPage    lang={lang} onBack={() => setShowAbout(false)} />;
  if (showProjects) return <ProjectsPage lang={lang} onBack={() => setShowProjects(false)} />;
  if (showContact)  return <ContactPage  lang={lang} onBack={() => setShowContact(false)} />;

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', transition: 'background 0.4s ease, color 0.4s ease' }}>

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
          {/* Diagonal accent lines */}
          <line x1="0" y1="30%" x2="40%" y2="0" stroke="rgba(239,68,68,0.04)" strokeWidth="1" />
          <line x1="60%" y1="100%" x2="100%" y2="60%" stroke="rgba(239,68,68,0.04)" strokeWidth="1" />
          <line x1="0" y1="70%" x2="30%" y2="100%" stroke="rgba(239,68,68,0.03)" strokeWidth="0.8" />
        </svg>
      </div>
      {/* Preloader */}
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}

      {/* Navigation */}
      <Header
        lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode}
        onAboutOpen={() => setShowAbout(true)}
        onProjectsOpen={() => setShowProjects(true)}
        onContactOpen={() => setShowContact(true)}
      />

      {/* ── New Unified Hero Section ── */}
      <section className="section-hero-premium">
        {/* Dedicated Background Overlay for better control */}
        <div 
          className="hero-bg-visual-overlay" 
          style={{ 
            backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.png)`
          }} 
        />
        
        <div className="hero-geometric-bg">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-p" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--accent-glow)" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-p)" />
          </svg>
        </div>

        <div className="hero-main-container">
          <div className="hero-content-left">
            <div className="hero-badge-top">
              <Sparkles size={14} />
              <span>{lang === 'tr' ? 'Dijital Çözümler · 2024' : 'Digital Solutions · 2024'}</span>
            </div>

            <h1 className="hero-headline-premium">
              {lang === 'tr' 
                ? <>Full-stack development,<br/>AI-powered tools<br/>&amp; IoT systems.</>
                : <>Full-stack development,<br/>AI-powered tools<br/>&amp; IoT systems.</>
              }
            </h1>

            <p className="hero-sub-desc">
              {lang === 'tr'
                ? 'Ölçeklenebilir backend sistemleri, AI destekli uygulamalar ve self-hosted altyapılar geliştiriyorum.'
                : 'I build scalable backend systems, AI-powered applications, and self-hosted infrastructures.'}
            </p>

            <ul className="hero-skill-list">
              <li><span className="skill-icon">⚡</span> Backend Development (.NET)</li>
              <li><span className="skill-icon">🔮</span> Database Design (SQL Server)</li>
              <li><span className="skill-icon">🔄</span> AI &amp; Computer Vision</li>
              <li><span className="skill-icon">🔮</span> IoT Systems</li>
              <li><span className="skill-icon">🔄</span> Server &amp; DevOps (Docker, Cloudflare)</li>
            </ul>

            <div className="hero-tech-pills">
              <span className="tech-pill">C#</span>
              <span className="tech-pill">.NET</span>
              <span className="tech-pill">SQL</span>
              <span className="tech-pill"><span className="pill-icon">🐳</span> Docker</span>
              <span className="tech-pill"><span className="pill-icon">🐍</span> Python  OpenCV</span>
              <span className="tech-pill"><span className="pill-icon">📡</span> ESP32</span>
            </div>

            <div className="hero-cta-row">
              <a href="#projects" onClick={() => setShowProjects(true)} className="hero-cta-primary">
                <span>{lang === 'tr' ? 'Projelerimi İncele' : 'View Projects'}</span>
                <ArrowRight size={16} />
              </a>
              <a href={`${import.meta.env.BASE_URL}cv.pdf`} target="_blank" rel="noopener noreferrer" className="hero-cta-secondary">
                <span>{lang === 'tr' ? 'CV İndir' : 'Download CV'}</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

          <div className="hero-portrait-right">
            <div className="hero-portrait-wrapper-mini">
              <div className="hero-special-glow" />
              <img 
                src={`${import.meta.env.BASE_URL}serkan-pro.png`} 
                className="hero-portrait-img-mini" 
                alt="Serkan Isik Portrait"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x1200?text=Profile+Photo';
                }}
              />
            </div>
            
            {/* About Me moved here, under the portrait */}
            {/* About Me enlarged and moved here */}
            <div className="hero-about-mini">
               <div className="whatido-heading">{lang === 'tr' ? 'NE YAPIYORUM' : 'WHAT I DO'}</div>
               
               <ul className="whatido-list">
                 <li><span className="skill-icon">⚡</span> Backend Development (.NET)</li>
                 <li><span className="skill-icon">🔮</span> Database Design (SQL Server)</li>
                 <li><span className="skill-icon">🔄</span> AI &amp; Computer Vision</li>
                 <li><span className="skill-icon">🔮</span> IoT Systems</li>
                 <li><span className="skill-icon">🔄</span> Server &amp; DevOps (Docker, Cloudflare)</li>
               </ul>

               <div className="whatido-pills">
                 <span className="tech-pill-sm">C#</span>
                 <span className="tech-pill-sm">.NET</span>
                 <span className="tech-pill-sm">SQL</span>
                 <span className="tech-pill-sm"><span className="pill-icon">🐳</span> Docker</span>
                 <span className="tech-pill-sm"><span className="pill-icon">🐍</span> Python</span>
                 <span className="tech-pill-sm"><span className="pill-icon">📡</span> ESP32</span>
               </div>
            </div>
          </div>
        </div>

        {/* ── Ticker Bar ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden"
          style={{ height: '44px', background: 'rgba(10,10,15,0.95)', borderTop: '1px solid var(--accent-dim)', backdropFilter: 'blur(12px)' }}
        >
          <div className="ticker-track h-full flex items-center">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center flex-shrink-0 px-6" style={{ gap: '10px' }}>
                <span className="text-[9px] font-mono uppercase tracking-[0.35em]" style={{ color: 'var(--accent)', opacity: 0.9 }}>
                  {item.label}
                </span>
                <span style={{ color: 'var(--accent-glow)', fontSize: '8px' }}>|</span>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {item.value}
                </span>
                <span style={{ color: 'var(--accent-glow)', marginLeft: '16px', fontSize: '8px' }}>◆</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 bg-[#0a0a0f] border-t border-white/5 py-16">
        <div className="w-full px-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[1px] bg-[var(--accent)]/30 mb-8" />
          <div className="flex flex-col items-center gap-4 mb-4">
            <a href={import.meta.env.BASE_URL} className="footer-logo transition-transform hover:scale-110">
              <div className="custom-logo scale-75">
                <div className="badge-wrapper">
                  <svg viewBox="0 0 100 100" className="badge-svg w-12 h-12">
                    <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinejoin="round" />
                    <path d="M30 45 L45 45 L48 35 L52 35 L55 45 L70 45 L70 50 L55 50 L52 60 L48 60 L45 50 L30 50 Z" fill="var(--accent)" />
                  </svg>
                </div>
              </div>
            </a>
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[var(--accent)]">.</span>TECH</span>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.8em] font-black mb-8 opacity-40">{t.footer}</p>
          <div className="flex space-x-12">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-500 hover:text-[var(--accent)] transition-all transform hover:scale-110 duration-300"><Instagram size={24} /></a>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=serkanisik67@gmail.com&su=${encodeURIComponent(lang === 'tr' ? 'Portfolyo Üzerinden İletişim' : 'Contact from Portfolio')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--accent)] transition-all transform hover:scale-110 duration-300"><Mail size={24} /></a>
            <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--accent)] transition-all transform hover:scale-110 duration-300"><Github size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
