import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css';
import Header from './Header';
import Preloader from './Preloader';
import {
  Instagram, Mail, Cpu, Database, Wind, Terminal, User, Plane,
  Award, Sparkles, Loader2, Box, Code, Github, ExternalLink,
  Send, CheckCircle, XCircle
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

// ── Tech Badge Components ─────────────────────────────────
const TechBadge = ({ name, color, icon: Icon, bgColor }) => (
  <span className="tech-badge" style={{ '--badge-color': color, '--badge-bg': bgColor }}>
    {Icon && <Icon size={11} />}
    {name}
  </span>
);

// SVG badge icons for technologies without lucide equivalents
const CSharpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C2.56 15.77 2 14.16 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.96-.44c-.4-.01-.83.06-1.28.19-.31.09-.6.25-.87.49-.27.23-.49.54-.66.91-.17.38-.26.86-.26 1.45.01.58.1 1.09.28 1.51.18.42.41.77.69 1.04s.59.46.94.58c.35.12.72.18 1.1.17.42-.01.81-.05 1.17-.12.35-.08.64-.17.87-.29zm.92-10.45c.63 0 1.18.13 1.68.38.49.25.95.57 1.36.97l.93-.93c-.48-.54-1.04-.95-1.66-1.24-.62-.29-1.3-.43-2.04-.43-.62 0-1.2.11-1.72.32-.53.21-.99.5-1.38.88l.93.93c.63-.59 1.32-.88 1.9-.88zm0 3.29c.44 0 .84.1 1.2.29.37.19.68.44.94.75l.93-.93c-.41-.44-.89-.79-1.43-1.03-.54-.25-1.12-.37-1.73-.37-.33 0-.65.04-.95.12l.42 1.41c.21-.16.4-.24.62-.24zm5.47 3.19l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1zm3 0l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1z" />
  </svg>
);

const DotNetIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L5.234 9.936c-.145-.222-.243-.413-.296-.573h-.041c.031.188.047.499.047.932v6.042H3.619V7.53h1.7l3.524 6.302c.19.335.313.572.369.71h.028c-.038-.24-.056-.584-.056-1.03V7.53h1.256v8.805z" />
  </svg>
);

const PythonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.727S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.402 3.35-3.402h5.766s3.24.052 3.24-3.13V3.19S18.28 0 11.914 0zM8.708 1.84a1.047 1.047 0 0 1 1.047 1.049 1.047 1.047 0 0 1-1.047 1.047A1.047 1.047 0 0 1 7.66 2.889 1.047 1.047 0 0 1 8.708 1.84zm3.596 10.326c-.187 0-.37.007-.55.019l-2.39.165c-.18.013-.35.019-.52.019-1.81 0-3.12-.88-3.12-2.5 0-1.62 1.31-2.5 3.12-2.5h5.77c.17 0 .34-.006.52-.019l2.39-.165c.18-.013.36-.019.55-.019 1.81 0 3.12.88 3.12 2.5 0 1.62-1.31 2.5-3.12 2.5h-5.77z" />
  </svg>
);

const AdoIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm-1 3v5l4 2.5-.75 1.23L9 13V8z" />
  </svg>
);

// ── Projects Data ──────────────────────────────────────────
const projects = [
  {
    id: 'proj1',
    titleTr: 'Telefon Rehberi (.NET & C#)',
    titleEn: 'Phone Book (.NET & C#)',
    descTr: 'ADO.NET ve C# ile geliştirilmiş, SQL Server tabanlı tam kapsamlı CRUD telefon rehberi uygulaması.',
    descEn: 'Full-featured CRUD phone book application built with ADO.NET and C# on SQL Server backend.',
    github: 'https://github.com/Serkan-design/TelefonRehberi',
    techs: [
      { name: 'C#', color: '#9B4F96', bgColor: 'rgba(155,79,150,0.12)' },
      { name: '.NET', color: '#512BD4', bgColor: 'rgba(81,43,212,0.12)' },
      { name: 'ADO.NET', color: '#512BD4', bgColor: 'rgba(81,43,212,0.10)' },
      { name: 'SQL', color: '#CC2927', bgColor: 'rgba(204,41,39,0.10)' },
    ],
    icon: Database,
  },
  {
    id: 'proj2',
    titleTr: 'ESP32 Blynk LED Kontrol',
    titleEn: 'ESP32 Blynk LED Control',
    descTr: 'ESP32 mikrodenetleyici ve Blynk IoT platformu kullanılarak Wi-Fi üzerinden uzaktan LED kontrolü.',
    descEn: 'Remote LED control over Wi-Fi using ESP32 microcontroller and the Blynk IoT platform.',
    github: 'https://github.com/Serkan-design/ESP32-Blynk-LED-Control',
    techs: [
      { name: 'C++', color: '#00599C', bgColor: 'rgba(0,89,156,0.12)' },
      { name: 'ESP32', color: '#E7352B', bgColor: 'rgba(231,53,43,0.10)' },
      { name: 'IoT', color: '#4EAA25', bgColor: 'rgba(78,170,37,0.10)' },
    ],
    icon: Cpu,
  },
  {
    id: 'proj3',
    titleTr: 'Finger Control — OpenCV',
    titleEn: 'Finger Control — OpenCV',
    descTr: 'Python ve OpenCV kullanarak el parmak hareketleriyle bilgisayarı kontrol eden gerçek zamanlı görüntü işleme uygulaması.',
    descEn: 'Real-time computer vision app using Python & OpenCV to control the computer with finger gestures.',
    github: 'https://github.com/Serkan-design/Finger-Control-OpenCV',
    techs: [
      { name: 'Python', color: '#3776AB', bgColor: 'rgba(55,118,171,0.12)' },
      { name: 'OpenCV', color: '#5C3EE8', bgColor: 'rgba(92,62,232,0.10)' },
      { name: 'MediaPipe', color: '#00BCD4', bgColor: 'rgba(0,188,212,0.10)' },
    ],
    icon: Terminal,
  },
];

const App = () => {
  const [lang, setLang] = useState('tr');
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });
  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formStatus, setFormStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const formRef = useRef(null);

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

  // ── Contact form submit via mailto ──
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMsg.trim()) return;
    setFormStatus('sending');
    const subject = encodeURIComponent(`Portfolio İletişim - ${formName}`);
    const body = encodeURIComponent(`Ad: ${formName}\nEmail: ${formEmail}\n\nMesaj:\n${formMsg}`);
    setTimeout(() => {
      window.open(`mailto:serkanisik67@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setFormStatus('sent');
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      setTimeout(() => setFormStatus(null), 4000);
    }, 600);
  };

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
      aboutText: "21 yaşında, Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşmış bir disiplinle çalışmalarımı sürdürüyorum. Modern yazılım prensiplerini mühendislik etiğiyle harmanlayarak kararlı ve ölçeklenebilir çözümler üretmeye odaklanıyorum. Kali Linux'u günlük işletim sistemi olarak tam kurulum şekliyle yapılandırdım; sistem mimarisi ve araçlarına hâkim, güvenli ve verimli bir kullanıcı olarak aktif biçimde kullanıyorum. Aynı zamanda havacılık teknolojilerine duyduğum ilgiyle İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
      skillsTitle: "Teknik Yetkinlikler",
      fpvTitle: "Havacılık ve FPV Teknolojileri",
      fpvDesc: "FPV drone üretimi ve optimizasyonu gerçekleştirilmiştir. İHA-1 ehliyeti ile profesyonel uçuş yetkinliğine sahibim.",
      footer: "© 2024 Serkan Işık",
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
      aboutText: "21-year-old Computer Programming student with a focus on embedded systems and database architectures. I blend modern software principles with engineering ethics to build robust, scalable solutions. I run Kali Linux as my daily OS with a full custom installation — deeply familiar with its system architecture and toolset for productive everyday use. Licensed Commercial UAV-1 pilot.",
      skillsTitle: "Skills",
      fpvTitle: "Aviation & FPV",
      fpvDesc: "FPV drone optimization. Commercial UAV-1 licensed pilot.",
      footer: "© 2024 Serkan Isik",
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
    const systemPrompt = `User: Serkan Işık. Bio: 21, Anadolu University student. Skills: Embedded, SQL, FPV, UAV-1 Pilot. Response must be concise and professional in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
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

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden ${darkMode ? 'bg-[#0a0a0f] text-[#f1f5f9]' : 'bg-[#f0f4f8] text-[#0f172a]'}`} style={{ transition: 'background 0.4s ease, color 0.4s ease' }}>

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
      <Header lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode} onAboutOpen={() => setShowAbout(true)} />

      {/* ── Hero Section ── */}
      <section className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden">

        {/* Floating particles (full hero overlay) */}
        <div className="absolute inset-0 z-[6] pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.gold ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.5)',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        {/* ── Left Panel: Aviation/FPV ── */}
        <div className="relative w-full md:w-1/2 h-full overflow-hidden border-r border-white/5">
          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent pointer-events-none" />

          {/* Parallax image wrapper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              top: '-10%',
              bottom: '-10%',
              transform: `translateY(${scrollY * 0.07}px)`,
              willChange: 'transform',
            }}
          >
            <img
              key={`av-${aviationIdx}`}
              src={aviationImages[aviationIdx]}
              className={`w-full h-full object-cover ${kenBurnsClasses[aviationIdx % 4]}`}
              alt="Aviation Background"
            />
          </div>

          {/* Glitch overlay */}
          {aviationGlitch && <div className="glitch-overlay" key={`av-glitch-${aviationIdx}`} />}

          {/* Slider dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
            {aviationImages.map((_, i) => (
              <div
                key={i}
                className={`slider-dot ${i === aviationIdx ? 'active' : ''}`}
                onClick={() => goToAviation(i)}
              />
            ))}
          </div>

          {/* Text content */}
          <div
            className="relative z-20 h-full flex flex-col items-start"
            style={{ justifyContent: 'center', paddingLeft: '18%', paddingRight: '5%', marginTop: '8%' }}
          >
            <div className="hero-label">
              <Plane size={13} className="text-white" />
              <span>Aviation &amp; FPV Expert</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              {displayedName}
              {!nameComplete && <span className="typewriter-cursor" />}
            </h2>
            <div className="h-4 md:h-6" />
            <p
              className="font-mono text-sm tracking-[0.4em] uppercase"
              style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}
            >
              {lang === 'tr' ? 'Lisanslı İHA-1 Pilotu' : 'Licensed UAV-1 Pilot'}
            </p>
          </div>
        </div>

        {/* ── Right Panel: Tech/Software ── */}
        <div className="relative w-full md:w-1/2 h-full overflow-hidden">
          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0f]/70 via-transparent to-transparent pointer-events-none" />

          {/* Parallax image wrapper */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              top: '-10%',
              bottom: '-10%',
              transform: `translateY(${scrollY * 0.05}px)`,
              willChange: 'transform',
            }}
          >
            <img
              key={`tech-${techIdx}`}
              src={techImages[techIdx]}
              className={`w-full h-full object-cover ${kenBurnsClasses[(techIdx + 2) % 4]}`}
              alt="Software Background"
            />
          </div>

          {/* Glitch overlay */}
          {techGlitch && <div className="glitch-overlay" key={`tech-glitch-${techIdx}`} />}

          {/* Slider dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
            {techImages.map((_, i) => (
              <div
                key={i}
                className={`slider-dot ${i === techIdx ? 'active' : ''}`}
                onClick={() => goToTech(i)}
              />
            ))}
          </div>

          {/* AI Panel content */}
          <div className="relative z-20 h-full flex flex-col justify-center items-center px-8 md:px-14">
            <div className="w-full max-w-lg">

              {/* Top status bar */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.5), transparent)' }} />
                <span className="text-[9px] font-mono tracking-[0.4em] uppercase" style={{ color: 'rgba(239,68,68,0.5)' }}>AI · LIVE</span>
              </div>

              {/* Main AI Panel */}
              <div className="ai-panel relative overflow-hidden">
                <div className="ai-scanline" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#ef4444]" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(239,68,68,0.35)' }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(239,68,68,0.35)' }} />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#ef4444]" />
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 70%)' }} />

                <div className="px-6 pt-5 pb-5 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', border: '1px solid rgba(239,68,68,0.35)' }}>
                          <Sparkles size={12} className="text-white" />
                        </div>
                        <div className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-[1.5px]"
                          style={{ background: '#34d399', borderColor: '#0a0a0f' }} />
                      </div>
                      <div className="leading-none">
                        <h3 className="text-[11px] font-black text-white tracking-[0.18em] uppercase leading-none mb-1">Serkan AI</h3>
                        <p className="text-[9px] font-mono leading-none" style={{ color: '#34d399', letterSpacing: '0.05em' }}>● Aktif</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.14)', borderRadius: '6px' }}>
                      <Terminal size={8} className="text-[#ef4444]" />
                      <span className="text-[8px] font-mono tracking-[0.25em] uppercase" style={{ color: 'rgba(239,68,68,0.6)' }}>LLaMA 3</span>
                    </div>
                  </div>

                  {/* Chat bubble area */}
                  <div className="mb-4 flex flex-col gap-2.5">
                    {!chatResponse && !isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <div className="flex-1 px-3.5 py-2.5"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.85)', fontFamily: 'monospace' }}>
                            {lang === 'tr' ? 'Merhaba! Serkan hakkında merak ettiklerini sorabilirsin.' : 'Hi! Feel free to ask anything about Serkan.'}
                          </p>
                        </div>
                      </div>
                    )}
                    {isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <div className="px-3.5 py-2.5 flex items-center gap-1.5"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <div className="ai-dot" style={{ animationDelay: '0ms' }} />
                          <div className="ai-dot" style={{ animationDelay: '160ms' }} />
                          <div className="ai-dot" style={{ animationDelay: '320ms' }} />
                        </div>
                      </div>
                    )}
                    {chatResponse && !isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <div className="flex-1 px-3.5 py-2.5"
                          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(226,232,240,0.9)', fontFamily: 'monospace' }}>{chatResponse}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-3.5"
                    style={{ background: 'linear-gradient(90deg,rgba(239,68,68,0.25),rgba(255,255,255,0.04),transparent)' }} />

                  {/* Input row */}
                  <div className="flex gap-2" style={{ height: '42px' }}>
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && askAI()}
                      placeholder={t.aiPlaceholder}
                      className="ai-input flex-1 px-3.5 text-[11px] font-mono"
                      style={{ height: '42px' }}
                    />
                    <button
                      onClick={() => askAI()}
                      disabled={isTyping}
                      className="ai-send-btn flex items-center justify-center gap-1.5 px-4 font-black text-[10px] uppercase tracking-[0.18em] text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                      style={{ height: '42px', minWidth: '64px' }}
                    >
                      {isTyping ? <Loader2 size={13} className="animate-spin" /> : <><span>SOR</span><span style={{ opacity: 0.55, marginLeft: '3px', fontSize: '12px' }}>↑</span></>}
                    </button>
                  </div>
                </div>

                {/* Bottom status bar */}
                <div className="flex items-center justify-between" style={{ padding: '7px 16px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[8px] font-mono uppercase" style={{ color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}>Powered by Groq</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#34d399' }} />
                    <span className="text-[8px] font-mono" style={{ color: 'rgba(52,211,153,0.6)', letterSpacing: '0.12em' }}>ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer"
                  className="social-link-white flex items-center justify-center gap-2.5 h-11 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300">
                  <Instagram size={13} />
                  <span>Instagram</span>
                </a>
                <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer"
                  className="social-link-red flex items-center justify-center gap-2.5 h-11 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300">
                  <Code size={13} />
                  <span>GitHub</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* ── Ticker Bar (bottom of hero) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden"
          style={{ height: '44px', background: 'rgba(10,10,15,0.95)', borderTop: '1px solid rgba(239,68,68,0.18)', backdropFilter: 'blur(12px)' }}
        >
          <div className="ticker-track h-full flex items-center">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center flex-shrink-0 px-6" style={{ gap: '10px' }}>
                <span className="text-[9px] font-mono uppercase tracking-[0.35em]" style={{ color: '#ef4444', opacity: 0.9 }}>
                  {item.label}
                </span>
                <span style={{ color: 'rgba(239,68,68,0.25)', fontSize: '8px' }}>|</span>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {item.value}
                </span>
                <span style={{ color: 'rgba(239,68,68,0.25)', marginLeft: '16px', fontSize: '8px' }}>◆</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── Main Content Sections ── */}
      <main className="w-full flex flex-col items-center gap-24 relative z-10 -mt-32">

        {/* FPV Details */}
        <div className="reveal w-full max-w-[1500px] px-6 md:px-12">
          <div className="section-card p-12 md:p-24 relative overflow-visible flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ef4444]/5 to-transparent pointer-events-none rounded-[20px]" />
            <div className="flex flex-col items-center justify-center gap-6 mb-16 relative z-10 w-full">
              <div className="accent-pill mb-2"><Wind size={13} />{t.fpvTitle}</div>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{t.fpvTitle}</h3>
            </div>
            <p className="text-gray-400 text-xl md:text-2xl leading-relaxed italic max-w-4xl relative z-10 px-6" style={{ marginBottom: '60px' }}>
              {t.fpvDesc}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10 px-4">
              {[
                { icon: Award, label: "SHGM İHA-1", desc: "Commercial License" },
                { icon: Cpu, label: "BTFA-FLIGHT", desc: "System Optimization" },
                { icon: Box, label: "LRS/CROSSFIRE", desc: "Long Range Control" }
              ].map((item, i) => (
                <div key={i} className="reveal group/item p-10 border border-white/8 rounded-2xl hover:border-[#ef4444]/40 hover:bg-white/[0.04] transition-all hover:translate-y-[-6px] flex flex-col items-center text-center" style={{ transitionDelay: `${i * 0.15}s`, background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <item.icon size={26} className="text-[#ef4444] group-hover/item:scale-110 transition-transform" />
                  </div>
                  <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-3">{item.label}</p>
                  <p className="text-[11px] text-gray-500 font-mono italic">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="reveal from-right w-full max-w-[1500px] px-6 md:px-12">
          <div className="section-card p-12 md:p-20 relative overflow-visible flex flex-col items-center">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ef4444]/4 rounded-full blur-[200px] pointer-events-none opacity-40" />
            <div className="flex flex-col items-center justify-center mb-16 relative z-10 w-full text-center">
              <div className="accent-pill mb-6"><Database size={13} />{t.skillsTitle}</div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">{t.skillsTitle}</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full relative z-10">
              {t.skills.map((skill, index) => (
                <div key={index} className="reveal group/skill cursor-default flex items-center gap-6 p-8 rounded-2xl border border-white/5 hover:border-[#ef4444]/30 hover:bg-white/[0.04] transition-all duration-300" style={{ transitionDelay: `${index * 0.13}s`, background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)' }}>
                    {skill.name.includes(".NET") && <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#ef4444]" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
                    {skill.name.includes("Python") && <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#ef4444]" fill="currentColor"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm1 14h-2v2h2v-2zm-1-10c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.206-1.794-4-4-4z" /></svg>}
                    {skill.name.includes("Veritabanı") && <Database size={24} className="text-[#ef4444]" />}
                    {skill.name.includes("Gömülü") && <Cpu size={24} className="text-[#ef4444]" />}
                    {skill.name.includes("Database") && <Database size={24} className="text-[#ef4444]" />}
                    {skill.name.includes("Embedded") && <Cpu size={24} className="text-[#ef4444]" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-black text-[15px] tracking-tight uppercase group-hover/skill:text-[#ef4444] transition-colors leading-none">{skill.name}</span>
                    <p className="text-[12px] text-gray-500 leading-relaxed group-hover/skill:text-gray-300 transition-all">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech Stack Grid ── */}
        <div className="reveal w-full max-w-[1500px] px-6 md:px-12">
          <div className="section-card p-12 md:p-16 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'rgba(239,68,68,0.04)' }} />
            <div className="flex flex-col items-center mb-12 relative z-10 w-full text-center">
              <div className="accent-pill mb-6"><Cpu size={13} />{lang === 'tr' ? 'Teknoloji Yığını' : 'Tech Stack'}</div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">
                {lang === 'tr' ? 'Kullandığım Teknolojiler' : 'Technologies I Use'}
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 w-full relative z-10">
              {[
                { name: 'C#', color: '#9B4F96', path: 'M11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C2.56 15.77 2 14.16 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.96-.44c-.4-.01-.83.06-1.28.19-.31.09-.6.25-.87.49-.27.23-.49.54-.66.91-.17.38-.26.86-.26 1.45.01.58.1 1.09.28 1.51.18.42.41.77.69 1.04s.59.46.94.58.72.18 1.1.17c.42-.01.81-.05 1.17-.12.35-.08.64-.17.87-.29zm5.47 3.19l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1zm3 0l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1z' },
                { name: '.NET', color: '#512BD4', path: 'M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L5.234 9.936c-.145-.222-.243-.413-.296-.573h-.041c.031.188.047.499.047.932v6.042H3.619V7.53h1.7l3.524 6.302c.19.335.313.572.369.71h.028c-.038-.24-.056-.584-.056-1.03V7.53h1.256v8.805z' },
                { name: 'Python', color: '#3776AB', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
                { name: 'SQL', color: '#CC2927', path: 'M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4m0 6c-3.87 0-6-.9-6-2s2.13-2 6-2 6 .9 6 2-2.13 2-6 2m8 2c0 2.21-3.58 4-8 4s-8-1.79-8-4V9.78C5.61 11.1 8.67 12 12 12s6.39-.9 8-2.22zm0 4c0 2.21-3.58 4-8 4s-8-1.79-8-4v-2.22C5.61 15.1 8.67 16 12 16s6.39-.9 8-2.22z' },
                { name: 'ESP32', color: '#E7352B', path: 'M7 2v2H5v2H3v8h2v2h2v2h10v-2h2v-2h2V6h-2V4h-2V2zm0 2h10v2h2v8h-2v2H7v-2H5V6h2zm3 2H8v2H6v4h2v2h8v-2h2v-4h-2V6h-2v1h-2zm0 1h4v1h2v4h-2v1H9v-1H7V9h2z' },
                { name: 'C++', color: '#00599C', path: 'M10.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C1.56 15.77 1 14.16 1 12.21c.05-2.31.72-4.08 2-5.32C4.32 5.64 5.96 5 7.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.96-.44c-.4-.01-.83.06-1.28.19-.31.09-.6.25-.87.49-.27.23-.49.54-.66.91-.17.38-.26.86-.26 1.45.01.58.1 1.09.28 1.51.18.42.41.77.69 1.04s.59.46.94.58.72.18 1.1.17c.42-.01.81-.05 1.17-.12.35-.08.64-.17.87-.29zM23 11h-2V9h-2v2h-2v2h2v2h2v-2h2z' },
                { name: 'Git', color: '#F05032', path: 'M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.596 0 1.846 1.846 0 0 1-.404-1.996L12.86 8.955v6.525c.176.086.342.203.48.346a1.846 1.846 0 0 1 0 2.6 1.838 1.838 0 0 1-2.6 0 1.846 1.846 0 0 1 0-2.6c.15-.154.33-.277.536-.361V8.904a1.847 1.847 0 0 1-.997-2.416L7.559 3.782.454 10.887a1.55 1.55 0 0 0 0 2.188l10.48 10.478a1.55 1.55 0 0 0 2.187 0l10.425-10.424a1.55 1.55 0 0 0 0-2.199' },
                { name: 'GitHub', color: '#aaa', path: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z' },
                { name: 'VS Code', color: '#007ACC', path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.5v-15a1.5 1.5 0 0 0-.85-1.413zm-5.406 16.329l-6.078-5.581L16.5 10.7v6.9l1.244.916z' },
                { name: 'OpenCV', color: '#5C3EE8', path: 'M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z' },
                { name: 'Blynk', color: '#00E5FF', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
                { name: 'Kali', color: '#268BEE', path: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' },
                { name: 'ADO.NET', color: '#7B2FBE', path: 'M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 3h2v5.5l3.9 2.3-.9 1.7-4-2.4V7z' },
                { name: 'Crossfire', color: '#FF6B35', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
              ].map((tech, i) => (
                <div key={i} className="tech-icon-card group flex flex-col items-center gap-3 p-4 rounded-2xl cursor-default" style={{ '--tech-color': tech.color }}>
                  <div className="tech-icon-wrap">
                    <svg viewBox="0 0 24 24" fill={tech.color} className="w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                      <path d={tech.path} />
                    </svg>
                  </div>
                  <span className="tech-icon-label">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <section id="projects" className="reveal w-full max-w-[1500px] px-6 md:px-12">
          <div className={`section-card p-12 md:p-20 relative overflow-visible ${!darkMode ? 'bg-white border-slate-200/80' : ''}`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-70" />
            <div className="flex flex-col items-center mb-16">
              <div className="accent-pill mb-6"><Code size={13} />{lang === 'tr' ? 'Projeler' : 'Projects'}</div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">{lang === 'tr' ? 'Projelerim' : 'My Projects'}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {projects.map((proj, i) => (
                <div
                  key={proj.id}
                  className={`reveal project-card group flex flex-col p-12 border transition-colors duration-300 ${darkMode
                    ? 'bg-white/[0.025] border-white/8'
                    : 'bg-slate-50 border-slate-200 shadow-sm'
                    }`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {/* Card top accent */}
                  <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#ef4444] transition-all duration-500 group-hover:w-full" />

                  {/* Icon + Title */}
                  <div className="flex items-start gap-5 mb-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <proj.icon size={22} className="text-[#ef4444]" />
                    </div>
                    <h4 className={`font-black text-[16px] uppercase tracking-tight leading-snug mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {lang === 'tr' ? proj.titleTr : proj.titleEn}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className={`text-[13px] leading-[2] font-mono flex-1 mb-10 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    {lang === 'tr' ? proj.descTr : proj.descEn}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-2.5 mb-10">
                    {proj.techs.map((tech, ti) => (
                      <TechBadge key={ti} name={tech.name} color={tech.color} bgColor={tech.bgColor} />
                    ))}
                  </div>

                  {/* GitHub Button */}
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`github-repo-btn flex items-center justify-center gap-2.5 w-full py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${!darkMode ? 'light-github-btn' : ''}`}
                  >
                    <Github size={14} />
                    <span>{lang === 'tr' ? 'GitHub Reposu' : 'GitHub Repo'}</span>
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Form Section ── */}
        <section id="contact" className="reveal w-full max-w-[900px] px-6 md:px-12 pb-4">
          <div className={`section-card p-10 md:p-16 relative overflow-hidden ${!darkMode ? 'bg-white border-slate-200/80' : ''}`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent" />
            <div className="absolute top-[2px] left-0 w-full h-16 bg-gradient-to-b from-[#ef4444]/8 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <Mail size={22} className="text-[#ef4444]" />
              </div>
              <div className="accent-pill mb-4">{lang === 'tr' ? 'İletişim' : 'Contact'}</div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter">
                {lang === 'tr' ? 'Benimle İletişime Geç' : 'Get In Touch'}
              </h3>
              <p className={`text-[12px] mt-3 font-mono text-center ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                {lang === 'tr' ? 'Projeniz veya iş birliği hakkında bir mesaj bırakın.' : 'Leave a message about your project or collaboration.'}
              </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-[0.25em] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'Ad Soyad' : 'Full Name'}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                    placeholder={lang === 'tr' ? 'Adınız...' : 'Your name...'}
                    className={`contact-input px-4 py-3 text-[12px] font-mono outline-none transition-all duration-250 ${darkMode ? 'dark-input' : 'light-input'}`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-[0.25em] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    {lang === 'tr' ? 'E-Posta' : 'Email'}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    required
                    placeholder={lang === 'tr' ? 'email@ornek.com' : 'email@example.com'}
                    className={`contact-input px-4 py-3 text-[12px] font-mono outline-none transition-all duration-250 ${darkMode ? 'dark-input' : 'light-input'}`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`text-[10px] font-black uppercase tracking-[0.25em] ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                  {lang === 'tr' ? 'Mesajınız' : 'Your Message'}
                </label>
                <textarea
                  id="contact-message"
                  value={formMsg}
                  onChange={e => setFormMsg(e.target.value)}
                  required
                  rows={5}
                  placeholder={lang === 'tr' ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                  className={`contact-input px-4 py-3 text-[12px] font-mono outline-none transition-all duration-250 resize-none ${darkMode ? 'dark-input' : 'light-input'}`}
                />
              </div>

              {/* Submit */}
              <button
                id="contact-submit"
                type="submit"
                disabled={formStatus === 'sending' || formStatus === 'sent'}
                className="contact-submit-btn flex items-center justify-center gap-2.5 py-3.5 w-full text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {formStatus === 'sending' && <Loader2 size={14} className="animate-spin" />}
                {formStatus === 'sent' && <CheckCircle size={14} />}
                {formStatus === 'error' && <XCircle size={14} />}
                {!formStatus && <Send size={14} />}
                <span>
                  {formStatus === 'sending' ? (lang === 'tr' ? 'GÖNDERİLİYOR...' : 'SENDING...') :
                    formStatus === 'sent' ? (lang === 'tr' ? 'GÖNDERİLDİ ✓' : 'SENT ✓') :
                      lang === 'tr' ? 'MESAJ GÖNDER' : 'SEND MESSAGE'}
                </span>
              </button>
            </form>
          </div>
        </section>



      </main>

      {/* ═══════════════════════════════════════════════════════
           ABOUT ME FULL-PAGE OVERLAY
      ═══════════════════════════════════════════════════════ */}
      {showAbout && (
        <div className="about-overlay" onClick={(e) => e.target === e.currentTarget && setShowAbout(false)}>
          {/* Backdrop */}
          <div className="about-overlay-bg" onClick={() => setShowAbout(false)} />

          {/* Panel */}
          <div className="about-panel">
            {/* Corner brackets decoration */}
            <div className="about-corner about-corner-tl" />
            <div className="about-corner about-corner-tr" />
            <div className="about-corner about-corner-bl" />
            <div className="about-corner about-corner-br" />

            {/* Scanline */}
            <div className="about-scanline" />

            {/* Top accent line */}
            <div className="about-top-line" />

            {/* Ambient glow */}
            <div className="about-glow" />

            {/* ── Header Bar ── */}
            <div className="about-header">
              <div className="flex items-center gap-3">
                <div className="about-icon-wrap">
                  <User size={18} className="text-[#ef4444]" />
                </div>
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-[#ef4444] opacity-70 leading-none mb-1">
                    {lang === 'tr' ? 'Profil · Özgeçmiş' : 'Profile · Resume'}
                  </p>
                  <h2 className="text-xl font-black tracking-tighter text-white leading-none">
                    {lang === 'tr' ? 'Hakkımda' : 'About Me'}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="about-close-btn"
                aria-label="Kapat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Divider ── */}
            <div className="about-divider" />

            {/* ── Scrollable Content ── */}
            <div className="about-content">

              {/* Identity Card */}
              <div className="about-identity">
                <div className="about-avatar">
                  <span className="about-avatar-initials">SI</span>
                  <div className="about-avatar-ring" />
                  <div className="about-avatar-dot" />
                </div>
                <div className="about-identity-info">
                  <h3 className="text-2xl font-black tracking-tighter text-white">
                    Serkan <span className="text-[#ef4444]">Işık</span>
                  </h3>
                  <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-gray-400 mt-1">
                    {lang === 'tr' ? 'Bilgisayar Programcılığı Öğrencisi' : 'Computer Programming Student'}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {[
                      lang === 'tr' ? 'Anadolu Üniversitesi' : 'Anadolu University',
                      lang === 'tr' ? '21 Yaşında' : '21 y/o',
                      lang === 'tr' ? 'Türkiye' : 'Turkey',
                    ].map((tag, i) => (
                      <span key={i} className="about-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="about-bio-block">
                <div className="about-bio-label">
                  <div className="w-1 h-full absolute left-0 top-0 bg-[#ef4444] rounded-full" />
                  {lang === 'tr' ? 'Biyografi' : 'Biography'}
                </div>
                <p className="about-bio-text">
                  {t.aboutText}
                </p>
              </div>

              {/* Timeline */}
              <div className="about-section-title">
                <Award size={14} className="text-[#ef4444]" />
                {lang === 'tr' ? 'Kilometre Taşları' : 'Milestones'}
              </div>
              <div className="about-timeline">
                {[
                  {
                    year: '2024',
                    icon: Award,
                    titleTr: 'SHGM İHA-1 Ehliyeti',
                    titleEn: 'SHGM UAV-1 License',
                    descTr: 'Lisanslı ticari İHA pilotu',
                    descEn: 'Licensed commercial UAV pilot',
                  },
                  {
                    year: '2024',
                    icon: Terminal,
                    titleTr: 'Groq AI Entegrasyonu',
                    titleEn: 'Groq AI Integration',
                    descTr: 'LLaMA 3 tabanlı AI chatbot geliştirme',
                    descEn: 'LLaMA 3 powered AI chatbot development',
                  },
                  {
                    year: '2023',
                    icon: Cpu,
                    titleTr: 'FPV Drone Üretimi',
                    titleEn: 'FPV Drone Build',
                    descTr: 'Özel FPV drone tasarımı ve optimizasyonu',
                    descEn: 'Custom FPV drone design & optimization',
                  },
                  {
                    year: '2023',
                    icon: Database,
                    titleTr: 'Telefon Rehberi Projesi',
                    titleEn: 'Phone Book Project',
                    descTr: '.NET & C# ile tam kapsamlı CRUD uygulaması',
                    descEn: 'Full-featured CRUD app with .NET & C#',
                  },
                ].map((item, i) => (
                  <div key={i} className="about-timeline-item">
                    <div className="about-timeline-left">
                      <span className="about-timeline-year">{item.year}</span>
                      <div className="about-timeline-line" />
                    </div>
                    <div className="about-timeline-dot">
                      <item.icon size={10} className="text-[#ef4444]" />
                    </div>
                    <div className="about-timeline-content">
                      <p className="text-[13px] font-black uppercase tracking-tight text-white leading-none mb-1">
                        {lang === 'tr' ? item.titleTr : item.titleEn}
                      </p>
                      <p className="text-[11px] font-mono text-gray-500">
                        {lang === 'tr' ? item.descTr : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="about-section-title">
                <Sparkles size={14} className="text-[#ef4444]" />
                {lang === 'tr' ? 'Teknik Yetkinlikler' : 'Technical Skills'}
              </div>
              <div className="about-skills-grid">
                {[
                  { label: 'C# / .NET', level: 88 },
                  { label: 'SQL / ADO.NET', level: 82 },
                  { label: 'Python', level: 75 },
                  { label: 'Embedded / C++', level: 72 },
                  { label: 'FPV / UAV', level: 90 },
                  { label: 'Kali Linux', level: 78 },
                ].map((sk, i) => (
                  <div key={i} className="about-skill-row">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wide text-white">{sk.label}</span>
                      <span className="text-[10px] font-mono text-[#ef4444]">{sk.level}%</span>
                    </div>
                    <div className="about-skill-bar-bg">
                      <div
                        className="about-skill-bar-fill"
                        style={{ '--skill-pct': `${sk.level}%`, animationDelay: `${i * 0.1}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Row */}
              <div className="about-social-row">
                <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="about-social-btn">
                  <Github size={15} />
                  <span>GitHub</span>
                </a>
                <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer" className="about-social-btn about-social-btn-ghost">
                  <Instagram size={15} />
                  <span>Instagram</span>
                </a>
                <a href="mailto:serkanisik67@gmail.com" className="about-social-btn about-social-btn-ghost">
                  <Mail size={15} />
                  <span>E-Posta</span>
                </a>
              </div>

            </div>{/* end about-content */}
          </div>{/* end about-panel */}
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0a0a0f]/95 backdrop-blur-xl" onClick={() => setShowContact(false)} />
          <div className="relative bg-[#0f0a0a] border border-white/10 rounded-2xl w-full max-w-md p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-[#ef4444] to-transparent" />
            <Mail size={48} className="text-[#ef4444] mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase tracking-widest mb-2 text-white">Email</h3>
            <p className="text-lg md:text-xl text-gray-300 font-mono bg-white/[0.05] border border-white/10 rounded-lg px-6 py-4 mt-6 w-full select-all">
              serkanisik67@gmail.com
            </p>
            <button onClick={() => setShowContact(false)} className="mt-8 px-8 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all w-full md:w-auto rounded-lg">
              {lang === 'tr' ? 'KAPAT' : 'CLOSE'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-[#0a0a0f] border-t border-white/5 py-16">
        <div className="w-full px-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[1px] bg-[#ef4444]/30 mb-8" />
          <div className="flex flex-col items-center gap-4 mb-4">
            <a href={import.meta.env.BASE_URL} className="footer-logo transition-transform hover:scale-110">
              <div className="custom-logo scale-75">
                <div className="badge-wrapper">
                  <svg viewBox="0 0 100 100" className="badge-svg w-12 h-12">
                    <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinejoin="round" />
                    <path d="M30 45 L45 45 L48 35 L52 35 L55 45 L70 45 L70 50 L55 50 L52 60 L48 60 L45 50 L30 50 Z" fill="#ef4444" />
                  </svg>
                </div>
              </div>
            </a>
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[#ef4444]">.</span>TECH</span>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.8em] font-black mb-8 opacity-40">{t.footer}</p>
          <div className="flex space-x-12">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-500 hover:text-[#ef4444] transition-all transform hover:scale-110 duration-300"><Instagram size={24} /></a>
            <a href="mailto:serkanisik67@gmail.com" className="text-gray-500 hover:text-[#ef4444] transition-all transform hover:scale-110 duration-300"><Mail size={24} /></a>
            <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ef4444] transition-all transform hover:scale-110 duration-300"><Github size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
