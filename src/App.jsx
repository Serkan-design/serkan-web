import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Mail,
  Cpu,
  Database,
  ChevronRight,
  Wind,
  User,
  X,
  Plane,
  Award,
  Loader2,
  Box,
  Code
} from 'lucide-react';

const apiKey = ""; // Gemini API key buraya

const App = () => {
  const [lang, setLang] = useState('tr');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  const images = {
    aviation: [
      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1473960104312-30e37d59074b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=1000"
    ],
    tech: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1544380903-583b710c5e04?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000"
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.aviation.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const content = {
    tr: {
      title: "Resmî Portfolyo",
      name: "SERKAN IŞIK",
      subtitle: "Anadolu Üniversitesi | Bilgisayar Programcılığı",
      focus: "Gömülü Sistemler ve Veritabanı Geliştirme Odaklı",
      aboutTitle: "Hakkında & Özgeçmiş",
      aboutText:
        "21 yaşında, Anadolu Üniversitesi Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşmış bir disiplin ile çalışmalarımı sürdürüyorum. Modern yazılım prensiplerini mühendislik etiği ile harmanlayarak kararlı ve ölçeklenebilir çözümler üretmeye odaklanıyorum. Aynı zamanda havacılık teknolojilerine duyduğum ilgiyle İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
      skillsTitle: "Teknik Yetkinlikler",
      fpvTitle: "Havacılık ve FPV Teknolojileri",
      fpvDesc:
        "FPV drone üretimi ve optimizasyonu gerçekleştirilmiştir. İHA-1 ehliyeti ile profesyonel uçuş yetkinliğine sahibim.",
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
      aboutText:
        "21-year-old student at Anadolu University. Focused on embedded systems and database architectures. Licensed Commercial UAV-1 pilot.",
      skillsTitle: "Skills",
      fpvTitle: "Aviation & FPV",
      fpvDesc: "FPV drone optimization. Commercial UAV-1 licensed pilot.",
      footer: "© 2024 Serkan Isik",
      contactBtn: "Contact",
      openAbout: "About Me",
      aiPlaceholder: "Ask something about Serkan...",
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

  const askAI = async (retryCount = 0) => {
    if (!chatInput.trim()) return;
    setIsTyping(true);
    const systemPrompt = `User: Serkan Işık. Bio: 21, Anadolu University student. Skills: Embedded, SQL, FPV, UAV-1 Pilot. Response must be concise and professional in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: chatInput }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      const data = await response.json();
      setChatResponse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Yanıt alınamadı.");
    } catch (error) {
      if (retryCount < 5) setTimeout(() => askAI(retryCount + 1), 1000);
      else setChatResponse("Yapay zeka şu an meşgul.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans relative overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gold flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(194,155,64,0.3)] group-hover:shadow-[0_0_30px_rgba(194,155,64,0.5)] transition-all">
              <Box size={22} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black tracking-[0.2em] text-xl leading-none">SERKAN<span className="text-gold">.</span>I</span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.4em] uppercase">Systems Engineer</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              className="text-[11px] font-black tracking-widest text-gray-400 hover:text-white uppercase transition-all hover:scale-110 active:scale-95"
            >
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <a
              href="mailto:serkanisik67@gmail.com"
              className="px-6 py-2.5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              {t.contactBtn}
            </a>
          </div>
        </div>
      </nav>

      {/* Split-Screen Hero Section */}
      <section className="relative h-screen w-full flex flex-col lg:flex-row overflow-hidden">

        {/* Left Panel: Aviation/FPV */}
        <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full group overflow-hidden border-r border-[#c29b40]/10">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-90 lg:opacity-70"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/30 group-hover:bg-transparent transition-colors duration-1000"></div>
          <img
            src={images.aviation[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] scale-105 group-hover:scale-110"
            alt="Aviation Background"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-8 lg:p-20 pb-16 lg:pb-32 text-left">
            <div className="inline-flex items-center gap-3 bg-gold/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-black tracking-[0.3em] uppercase mb-6 w-fit rounded-sm shadow-lg">
              <Plane size={14} className="text-white animate-pulse" />
              <span>{lang === 'tr' ? 'Havacılık & FPV' : 'Aviation & FPV'}</span>
            </div>
            <h1 className="text-5xl lg:text-8xl font-black mb-4 tracking-tighter leading-[0.9] drop-shadow-2xl text-left">
              {t.name.split(' ')[0]}<br />
              <span className="text-gold">{t.name.split(' ')[1]}</span>
            </h1>
            <p className="text-gray-400 font-mono text-[10px] tracking-[0.5em] uppercase opacity-80 italic flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gold"></span>
              Licensed UAV-1 Pilot
            </p>
          </div>
        </div>

        {/* Right Panel: Software/DB */}
        <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full group overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-transparent to-transparent opacity-90 lg:opacity-70"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/50 group-hover:bg-transparent transition-colors duration-1000"></div>
          <img
            src={images.tech[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] scale-105 group-hover:scale-110 grayscale group-hover:grayscale-0"
            alt="Software Background"
          />

          <div className="relative z-20 h-full flex flex-col justify-center items-center lg:items-start p-8 lg:p-20 text-left">
            <div className="max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-gold/50"></div>
                <span className="text-[11px] font-black tracking-[0.5em] text-gray-400 uppercase">Interactive Core</span>
              </div>

              {/* Redesigned AI Tool */}
              <div className="glass p-8 shadow-2xl relative overflow-hidden group/ai rounded-2xl border-white/5">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gold shadow-[0_0_15px_rgba(194,155,64,0.5)]"></div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[11px] font-black text-gold tracking-[0.3em] uppercase">AI Command Center</p>
                  <Sparkles size={14} className="text-gold/50 group-hover/ai:rotate-12 transition-transform" />
                </div>

                <div className="relative flex flex-col gap-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    placeholder={t.aiPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-600 shadow-inner"
                  />
                  <button
                    onClick={() => askAI()}
                    disabled={isTyping}
                    className="w-full bg-gold px-6 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                  >
                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <><Terminal size={14} /> {t.aiButton}</>}
                  </button>
                </div>

                {chatResponse && (
                  <div className="mt-6 p-4 bg-white/5 border-l-2 border-gold/30 rounded-r-xl text-xs text-gray-300 leading-relaxed animate-in fade-in slide-in-from-top-2 text-left">
                    <p className="font-mono opacity-60 text-[10px] mb-2 font-bold uppercase tracking-widest">Response:</p>
                    {chatResponse}
                  </div>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setIsAboutOpen(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gold hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-lg"
                >
                  <User size={16} /> {t.openAbout}
                </button>
                <a
                  href="https://www.instagram.com/sserkan.77/"
                  target="_blank"
                  className="flex items-center gap-3 px-8 py-4 border border-white/10 glass text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all transform hover:-translate-y-1"
                >
                  <Instagram size={16} /> INSTAGRAM
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-12 gap-12 relative z-30 lg:-mt-20">

        {/* FPV Details */}
        <div className="lg:col-span-7">
          <div className="glass p-12 group relative rounded-3xl overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-6">
                <span className="w-12 h-[3px] bg-gold rounded-full"></span>
                {t.fpvTitle}
              </h3>
              <Wind className="text-gold opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-12 italic border-l-4 border-gold/20 pl-6 bg-white/5 py-6 rounded-r-2xl">
              "{t.fpvDesc}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Award, label: "SHGM İHA-1", desc: "Commercial License" },
                { icon: Cpu, label: "Betaflight", desc: "Flight Control" },
                { icon: Box, label: "LRS System", desc: "Long Range Radio" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-6 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:border-gold/20 group/card text-center">
                  <item.icon size={20} className="text-gold mb-4 group-hover/card:scale-110 transition-transform mx-auto" />
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="lg:col-span-5">
          <div className="glass p-12 h-full rounded-3xl relative overflow-hidden text-left">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 blur-[60px] rounded-full -ml-16 -mb-16"></div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-gray-400">{t.skillsTitle}</h3>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Database size={20} className="text-gold" />
              </div>
            </div>
            <div className="space-y-10">
              {t.skills.map((skill, index) => (
                <div key={index} className="group cursor-default">
                  <div className="flex items-center justify-between mb-3 text-left">
                    <span className="font-black text-xs tracking-[0.2em] uppercase group-hover:text-gold transition-colors">{skill.name}</span>
                    <div className="h-[2px] flex-1 mx-6 bg-white/5 group-hover:bg-gold/20 transition-all rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gold/40 -translate-x-[100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                    </div>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-gold transition-colors" />
                  </div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest italic leading-relaxed pl-2 border-l border-white/10 group-hover:border-gold/30 transition-all">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={() => setIsAboutOpen(false)}></div>
          <div className="relative glass w-full max-w-2xl p-12 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-3xl border-gold/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="flex justify-between items-start mb-16 relative z-10 text-left">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-gold tracking-[0.5em] uppercase mb-4">Curriculum Vitae</span>
                <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">{t.aboutTitle}</h3>
              </div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="p-3 bg-white/5 hover:bg-gold hover:text-white transition-all rounded-2xl hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
            <div className="relative z-10 text-left">
              <div className="bg-white/5 p-10 lg:p-12 border-l-4 border-gold rounded-r-3xl relative">
                <blockquote className="text-lg lg:text-xl text-gray-300 leading-relaxed font-medium italic mb-8">
                  "{t.aboutText}"
                </blockquote>
                <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gold tracking-[0.3em] uppercase mb-1">Location</span>
                    <span className="text-xs font-bold text-gray-400">Eskisehir, TR</span>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gold tracking-[0.3em] uppercase mb-1">Occupation</span>
                    <span className="text-xs font-bold text-gray-400">Student & Pilot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-30 bg-[#020617] border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-[2px] bg-gold mb-12 opacity-30 rounded-full"></div>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.8em] font-black mb-12 text-center">{t.footer}</p>
          <div className="flex space-x-12">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-500 hover:text-gold transition-all transform hover:scale-125"><Instagram size={24} /></a>
            <a href="mailto:serkanisik67@gmail.com" className="text-gray-500 hover:text-gold transition-all transform hover:scale-125"><Mail size={24} /></a>
            <a href="#" className="text-gray-500 hover:text-gold transition-all transform hover:scale-125"><Globe size={24} /></a>
          </div>
          <div className="mt-16 text-[9px] text-gray-700 font-bold tracking-[0.4em] uppercase">
            Built with React & Tailwind & Gemini
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
