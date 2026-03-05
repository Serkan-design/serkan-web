import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import Header from './Header';
import {
  Instagram, Mail, Cpu, Database, Wind, Terminal, User, Plane,
  Award, Sparkles, Loader2, Box, Code
} from 'lucide-react';

const apiKey = "gsk_" + "OOSoS1IkP0c5XaQLcb1tWGdyb3FYgbekc8jatcT3yndhkcWGOd0k";

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

const App = () => {
  const [lang, setLang] = useState('tr');
  const [showContact, setShowContact] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Slider state
  const [aviationIdx, setAviationIdx] = useState(0);
  const [techIdx, setTechIdx] = useState(0);
  const [aviationGlitch, setAviationGlitch] = useState(false);
  const [techGlitch, setTechGlitch] = useState(false);

  // Parallax
  const [scrollY, setScrollY] = useState(0);

  // Particles
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 8,
      gold: i % 4 === 0,
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
      subtitle: "Anadolu Üniversitesi | Bilgisayar Programcılığı",
      focus: "Gömülü Sistemler ve Veritabanı Geliştirme Odaklı",
      aboutTitle: "Hakkında & Özgeçmiş",
      aboutText: "21 yaşında; gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşmış bir yazılım geliştirici olarak teknoloji dünyasında yer almaktayım. Modern yazılım prensiplerini mühendislik etiği ile harmanlayarak kararlı ve ölçeklenebilir çözümler üretmeye odaklanıyorum. Kali Linux'u günlük işletim sistemi olarak tam kurulum şekilde yapılandırdım; sistem mimarisi ve araçlarına hâkim, güvenli ve verimli bir kullanıcı olarak aktif biçimde kullanıyorum. Aynı zamanda havacılık teknolojilerine duyduğum ilgiyle İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
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
      subtitle: "Anadolu University | Computer Programming",
      focus: "Embedded Systems & Database Development",
      aboutTitle: "About & Resume",
      aboutText: "21-year-old software developer focused on embedded systems and database architectures. I blend modern software principles with engineering ethics to build robust, scalable solutions. I run Kali Linux as my daily OS with a full custom installation — deeply familiar with its system architecture and toolset for productive everyday use. Licensed Commercial UAV-1 pilot.",
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
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans relative overflow-x-hidden">

      {/* Navigation */}
      <Header lang={lang} setLang={setLang} />

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
                background: p.gold ? 'rgba(194,155,64,0.85)' : 'rgba(255,255,255,0.5)',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        {/* ── Left Panel: Aviation/FPV ── */}
        <div className="relative w-full md:w-1/2 h-full overflow-hidden border-r border-white/5">
          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 bg-[#c29b40] px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase mb-8 w-fit shadow-xl">
              <Plane size={14} className="text-white" />
              <span>Aviation &amp; FPV Expert</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{t.name}</h2>
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
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-[#020617]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent pointer-events-none" />

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
                  <div className="w-2 h-2 rounded-full bg-[#c29b40] animate-pulse" />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(194,155,64,0.5), transparent)' }} />
                <span className="text-[9px] font-mono tracking-[0.4em] uppercase" style={{ color: 'rgba(194,155,64,0.5)' }}>AI · LIVE</span>
              </div>

              {/* Main AI Panel */}
              <div className="ai-panel relative overflow-hidden">
                <div className="ai-scanline" />
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#c29b40]" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(194,155,64,0.35)' }} />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(194,155,64,0.35)' }} />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#c29b40]" />
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(194,155,64,0.10) 0%, transparent 70%)' }} />

                <div className="px-6 pt-5 pb-5 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#c29b40,#7a5c10)', border: '1px solid rgba(194,155,64,0.35)' }}>
                          <Sparkles size={12} className="text-white" />
                        </div>
                        <div className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-[1.5px]"
                          style={{ background: '#34d399', borderColor: '#020617' }} />
                      </div>
                      <div className="leading-none">
                        <h3 className="text-[11px] font-black text-white tracking-[0.18em] uppercase leading-none mb-1">Serkan AI</h3>
                        <p className="text-[9px] font-mono leading-none" style={{ color: '#34d399', letterSpacing: '0.05em' }}>● Aktif</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1"
                      style={{ background: 'rgba(194,155,64,0.06)', border: '1px solid rgba(194,155,64,0.14)', borderRadius: '2px' }}>
                      <Terminal size={8} className="text-[#c29b40]" />
                      <span className="text-[8px] font-mono tracking-[0.25em] uppercase" style={{ color: 'rgba(194,155,64,0.6)' }}>LLaMA 3</span>
                    </div>
                  </div>

                  {/* Chat bubble area */}
                  <div className="mb-4 flex flex-col gap-2.5">
                    {!chatResponse && !isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg,#c29b40,#7a5c10)' }}>
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
                          style={{ background: 'linear-gradient(135deg,#c29b40,#7a5c10)' }}>
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <div className="px-3.5 py-2.5 flex items-center gap-1.5"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(194,155,64,0.15)' }}>
                          <div className="ai-dot" style={{ animationDelay: '0ms' }} />
                          <div className="ai-dot" style={{ animationDelay: '160ms' }} />
                          <div className="ai-dot" style={{ animationDelay: '320ms' }} />
                        </div>
                      </div>
                    )}
                    {chatResponse && !isTyping && (
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{ background: 'linear-gradient(135deg,#c29b40,#7a5c10)' }}>
                          <Sparkles size={8} className="text-white" />
                        </div>
                        <div className="flex-1 px-3.5 py-2.5"
                          style={{ background: 'rgba(194,155,64,0.05)', border: '1px solid rgba(194,155,64,0.18)' }}>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(226,232,240,0.9)', fontFamily: 'monospace' }}>{chatResponse}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px mb-3.5"
                    style={{ background: 'linear-gradient(90deg,rgba(194,155,64,0.25),rgba(255,255,255,0.04),transparent)' }} />

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
                  className="social-link-gold flex items-center justify-center gap-2.5 h-11 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300">
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
          style={{ height: '44px', background: 'rgba(2,6,23,0.92)', borderTop: '1px solid rgba(194,155,64,0.18)', backdropFilter: 'blur(12px)' }}
        >
          <div className="ticker-track h-full flex items-center">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center flex-shrink-0 px-6" style={{ gap: '10px' }}>
                <span className="text-[9px] font-mono uppercase tracking-[0.35em]" style={{ color: '#c29b40', opacity: 0.9 }}>
                  {item.label}
                </span>
                <span style={{ color: 'rgba(194,155,64,0.2)', fontSize: '8px' }}>|</span>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {item.value}
                </span>
                <span style={{ color: 'rgba(194,155,64,0.22)', marginLeft: '16px', fontSize: '8px' }}>◆</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── Main Content Sections ── */}
      <main className="w-full flex flex-col items-center gap-24 relative z-30 -mt-32">

        {/* FPV Details */}
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <div className="bg-[#1e293b]/10 backdrop-blur-3xl border border-white/5 p-12 md:p-24 relative overflow-visible transition-all duration-700 hover:border-[#c29b40]/20 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#c29b40]/5 to-transparent pointer-events-none" />
            <div className="flex flex-col items-center justify-center gap-6 mb-24 relative z-10 w-full">
              <div className="w-20 h-[3px] bg-[#c29b40] mb-4" />
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{t.fpvTitle}</h3>
              <Wind className="text-[#c29b40] opacity-40 animate-pulse mt-2" size={40} />
            </div>
            <p className="text-gray-400 text-xl md:text-2xl leading-relaxed italic max-w-4xl relative z-10 px-6" style={{ marginBottom: '80px' }}>
              {t.fpvDesc}
            </p>
            <div style={{ height: '40px' }} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-10 px-8">
              {[
                { icon: Award, label: "SHGM İHA-1", desc: "Commercial License" },
                { icon: Cpu, label: "BTFA-FLIGHT", desc: "System Optimization" },
                { icon: Box, label: "LRS/CROSSFIRE", desc: "Long Range Control" }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] p-12 border border-white/10 group/item hover:bg-white/[0.05] transition-all hover:translate-y-[-8px] flex flex-col items-center text-center">
                  <item.icon size={36} className="text-[#c29b40] mb-12 group-hover/item:scale-110 transition-transform" />
                  <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-4">{item.label}</p>
                  <div className="h-6" />
                  <p className="text-[11px] text-gray-500 font-mono italic mt-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <div className="bg-white/[0.01] backdrop-blur-3xl p-12 md:p-24 border border-white/5 relative overflow-visible group transition-all duration-700 hover:border-[#c29b40]/20 flex flex-col items-center">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#c29b40]/5 rounded-full blur-[200px] pointer-events-none opacity-40" />
            <div className="flex flex-col items-center justify-center mb-28 relative z-10 w-full text-center">
              <Database size={40} className="text-[#c29b40] opacity-50 mb-8" />
              <h3 className="text-[16px] font-black uppercase tracking-[0.8em] text-gray-400">{t.skillsTitle}</h3>
              <div className="w-16 h-[1px] bg-white/20 mt-8" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-16 w-full relative z-10 px-12 mt-12">
              {t.skills.map((skill, index) => (
                <div key={index} className="group/skill cursor-default flex flex-col items-center text-center p-8 bg-white/[0.02] border border-white/5 hover:border-[#c29b40]/30 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center gap-6 mb-8 w-full">
                    <div className="mb-4">
                      {skill.name.includes(".NET") && (
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#c29b40]" fill="currentColor">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      )}
                      {skill.name.includes("Python") && (
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#c29b40]" fill="currentColor">
                          <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm1 14h-2v2h2v-2zm-1-10c-2.206 0-4 1.794-4 4h2c0-1.103.897-2 2-2s2 .897 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.206-1.794-4-4-4z" />
                        </svg>
                      )}
                      {skill.name.includes("Veritabanı") && <Database size={48} className="text-[#c29b40]" />}
                      {skill.name.includes("Gömülü") && <Cpu size={48} className="text-[#c29b40]" />}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-6 h-[1px] bg-white/10 group-hover/skill:bg-[#c29b40]/30" />
                      <span className="font-black text-xl md:text-2xl tracking-tighter uppercase group-hover/skill:text-[#c29b40] transition-colors">{skill.name}</span>
                      <div className="w-6 h-[1px] bg-white/10 group-hover/skill:bg-[#c29b40]/30" />
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-500 uppercase tracking-[0.2em] italic leading-relaxed group-hover/skill:text-gray-300 transition-all max-w-sm">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="relative z-30 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-12 text-center flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-12 w-full">
            <User size={32} className="text-[#c29b40] mb-8 opacity-30" />
            <h3 className="text-[16px] font-black uppercase tracking-[0.8em] text-gray-400">{t.aboutTitle}</h3>
            <div className="w-24 h-[1px] bg-[#c29b40]/30 mt-8" />
          </div>
          <p className="text-[13px] text-gray-400 font-mono leading-relaxed italic tracking-widest max-w-4xl px-4 md:px-12 text-center opacity-80">
            {t.aboutText}
          </p>
        </section>
      </main>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={() => setShowContact(false)} />
          <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-md p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c29b40]" />
            <Mail size={48} className="text-[#c29b40] mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase tracking-widest mb-2 text-white">Email</h3>
            <p className="text-lg md:text-xl text-gray-300 font-mono bg-white/[0.05] border border-white/10 px-6 py-4 mt-6 w-full select-all">
              serkanisik67@gmail.com
            </p>
            <button onClick={() => setShowContact(false)} className="mt-8 px-8 py-3 bg-[#c29b40] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all w-full md:w-auto">
              {lang === 'tr' ? 'KAPAT' : 'CLOSE'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-30 bg-[#020617] border-t border-white/5 py-16">
        <div className="w-full px-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[1px] bg-[#c29b40]/30 mb-8" />
          <div className="flex flex-col items-center gap-4 mb-4">
            <a href={import.meta.env.BASE_URL} className="footer-logo transition-transform hover:scale-110">
              <div className="custom-logo scale-75">
                <div className="badge-wrapper">
                  <svg viewBox="0 0 100 100" className="badge-svg w-12 h-12">
                    <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5" fill="none" stroke="#c29b40" strokeWidth="3.5" strokeLinejoin="round" />
                    <path d="M30 45 L45 45 L48 35 L52 35 L55 45 L70 45 L70 50 L55 50 L52 60 L48 60 L45 50 L30 50 Z" fill="#c29b40" />
                  </svg>
                </div>
              </div>
            </a>
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-[0.8em] font-black mb-8 opacity-40">{t.footer}</p>
          <div className="flex space-x-12">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-500 hover:text-[#c29b40] transition-all transform hover:scale-110 duration-300"><Instagram size={24} /></a>
            <a href="mailto:serkanisik67@gmail.com" className="text-gray-500 hover:text-[#c29b40] transition-all transform hover:scale-110 duration-300"><Mail size={24} /></a>
            <a href="https://github.com/Serkan-design" className="text-gray-500 hover:text-[#c29b40] transition-all transform hover:scale-110 duration-300"><Code size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
