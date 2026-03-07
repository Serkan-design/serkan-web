import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './App.css';
import Header from './Header';
import Preloader from './Preloader';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import ContactPage from './ContactPage';
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
  const [showProjects, setShowProjects] = useState(false);
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

  // ── Page routing ── 
  if (showAbout)    return <AboutPage    lang={lang} darkMode={darkMode} onBack={() => setShowAbout(false)} />;
  if (showProjects) return <ProjectsPage lang={lang} onBack={() => setShowProjects(false)} />;
  if (showContact)  return <ContactPage  lang={lang} onBack={() => setShowContact(false)} />;

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
      <Header
        lang={lang} setLang={setLang} darkMode={darkMode} setDarkMode={setDarkMode}
        onAboutOpen={() => setShowAbout(true)}
        onProjectsOpen={() => setShowProjects(true)}
        onContactOpen={() => setShowContact(true)}
      />

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
