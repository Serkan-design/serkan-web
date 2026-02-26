import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Mail,
  Cpu,
  Database,
  ChevronRight,
  Globe,
  Wind,
  Terminal,
  User,
  X,
  Plane,
  Award,
  Sparkles,
  Loader2,
  Box,
  Code
} from 'lucide-react';

const apiKey = "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";

const App = () => {
  const [lang, setLang] = useState('tr');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Arkaplan görsel döngüsü için state
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
      aboutText: "21 yaşında, Anadolu Üniversitesi Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşmış bir disiplin ile çalışmalarımı sürdürüyorum. Modern yazılım prensiplerini mühendislik etiği ile harmanlayarak kararlı ve ölçeklenebilir çözümler üretmeye odaklanıyorum. Aynı zamanda havacılık teknolojilerine duyduğum ilgiyle İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
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
      aboutText: "21-year-old student at Anadolu University. Focused on embedded systems and database architectures. Licensed Commercial UAV-1 pilot.",
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
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

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

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
      if (retryCount >= 2 || !chatInput.trim()) {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans relative overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-md border-b border-[#c29b40]/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#c29b40] flex items-center justify-center rounded-sm">
              <Box size={20} className="text-white group-hover:rotate-90 transition-transform" />
            </div>
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="text-[12px] font-bold tracking-widest text-gray-400 hover:text-white uppercase transition-colors">
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <a href="mailto:serkanisik67@gmail.com" className="px-6 py-2 bg-[#c29b40] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(194,155,64,0.3)]">
              {t.contactBtn}
            </a>
          </div>
        </div>
      </nav>

      {/* Split-Screen Hero Section */}
      <section className="relative h-[90vh] md:h-[80vh] w-full flex flex-col md:flex-row pt-14 overflow-hidden">

        {/* Left Panel: Aviation/FPV */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden border-r border-[#c29b40]/10">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/40 group-hover:bg-transparent transition-colors duration-700"></div>
          <img
            src={images.aviation[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110"
            alt="Aviation Background"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12 pb-20 md:pb-32">
            <div className="inline-flex items-center gap-2 bg-[#c29b40] px-3 py-1 text-[9px] font-bold tracking-widest uppercase mb-4 w-fit">
              <Plane size={12} className="text-white" />
              <span>Aviation & FPV Expert</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter leading-none">{t.name}</h2>
            <p className="text-gray-300 font-mono text-xs tracking-widest uppercase opacity-70 italic">Licensed UAV-1 Pilot</p>
          </div>
        </div>

        {/* Right Panel: Software/DB */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-transparent to-transparent opacity-80"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/60 group-hover:bg-transparent transition-colors duration-700"></div>
          <img
            src={images.tech[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110 grayscale group-hover:grayscale-0"
            alt="Software Background"
          />

          <div className="relative z-20 h-full flex flex-col justify-center items-center md:items-start p-8 md:p-12">
            <div className="max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <Code size={16} className="text-[#c29b40]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Dev Environment</span>
              </div>

              {/* AI Tool Integrated in Right Panel */}
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#c29b40]"></div>
                <p className="text-[10px] font-bold text-[#c29b40] mb-3 tracking-[0.2em] uppercase">Serkan'a Sorun (AI)</p>
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    placeholder={t.aiPlaceholder}
                    className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-[#c29b40] text-white"
                  />
                  <button onClick={() => askAI()} disabled={isTyping} className="bg-[#c29b40] px-4 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    {isTyping ? <Loader2 size={14} className="animate-spin" /> : t.aiButton}
                  </button>
                </div>
                {chatResponse && (
                  <div className="mt-3 text-[10px] text-gray-300 italic border-t border-white/10 pt-2 animate-in fade-in slide-in-from-top-1">
                    {chatResponse}
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-4 justify-center md:justify-start">
                <button onClick={() => setIsAboutOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#c29b40] hover:text-white transition-all">
                  <User size={14} /> {t.openAbout}
                </button>
                <a href="https://www.instagram.com/sserkan.77/" target="_blank" className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  <Instagram size={14} /> INSTA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-12 gap-8 relative z-30 -mt-10">

        {/* FPV Details */}
        <div className="lg:col-span-7">
          <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 p-8 group relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-10 h-[2px] bg-[#c29b40]"></span>
                {t.fpvTitle}
              </h3>
              <Wind className="text-[#c29b40] opacity-50 group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-10 italic border-l-2 border-[#c29b40]/50 pl-4">
              {t.fpvDesc}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Award, label: "SHGM İHA-1" },
                { icon: Cpu, label: "Betaflight" },
                { icon: Box, label: "LRS/Crossfire" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 border border-white/5 text-center">
                  <item.icon size={16} className="text-[#c29b40] mx-auto mb-2" />
                  <p className="text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 backdrop-blur-md p-8 border border-white/10 h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] opacity-80">{t.skillsTitle}</h3>
              <Database size={16} className="text-[#c29b40]" />
            </div>
            <div className="space-y-8">
              {t.skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] tracking-widest uppercase group-hover:text-[#c29b40] transition-colors">{skill.name}</span>
                    <div className="h-[1px] flex-1 mx-4 bg-white/5 group-hover:bg-[#c29b40]/30 transition-all"></div>
                    <ChevronRight size={12} className="text-gray-600" />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider italic leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-md" onClick={() => setIsAboutOpen(false)}></div>
          <div className="relative bg-[#0f172a] border border-[#c29b40]/30 w-full max-w-lg p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase italic border-b-4 border-[#c29b40] pb-1 tracking-tighter">{t.aboutTitle}</h3>
              <button onClick={() => setIsAboutOpen(false)} className="text-white hover:text-[#c29b40] transition-colors"><X size={32} /></button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-light text-justify italic bg-white/5 p-6 border-l-2 border-[#c29b40]">
              {t.aboutText}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-30 bg-[#020617] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="w-12 h-[1px] bg-[#c29b40] mb-6 opacity-50"></div>
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.5em] font-black mb-6">{t.footer}</p>
          <div className="flex space-x-8">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-600 hover:text-[#c29b40] transition-all"><Instagram size={20} /></a>
            <a href="mailto:serkanisik67@gmail.com" className="text-gray-600 hover:text-[#c29b40] transition-all"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
