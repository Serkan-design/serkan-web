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
      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=70&w=1200",
      "https://images.unsplash.com/photo-1473960104312-30e37d59074b?auto=format&fit=crop&q=70&w=1200",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=70&w=1200"
    ],
    tech: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=70&w=1200",
      "https://images.unsplash.com/photo-1544380903-583b710c5e04?auto=format&fit=crop&q=70&w=1200",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=70&w=1200"
    ]
  };

  useEffect(() => {
    // Görselleri önceden yükle
    [...images.aviation, ...images.tech].forEach(src => {
      const img = new Image();
      img.src = src;
    });

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
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="w-full px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#c29b40] flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(194,155,64,0.3)]">
              <Box size={20} className="text-white fill-current" />
            </div>
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
          </div>

          <div className="flex items-center gap-10">
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="text-[12px] font-bold tracking-[0.2em] text-gray-500 hover:text-white uppercase transition-colors">
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <a href="mailto:serkanisik67@gmail.com" className="px-8 py-2.5 bg-[#c29b40] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(194,155,64,0.3)]">
              {t.contactBtn}
            </a>
          </div>
        </div>
      </nav>

      {/* Split-Screen Hero Section */}
      <section className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden">

        {/* Left Panel: Aviation/FPV */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden border-r border-white/5">
          <div className="absolute top-6 left-6 z-30 opacity-20 pointer-events-none">
            <span className="text-[10px] uppercase tracking-[0.8em] font-light">Aviation Background</span>
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-90"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/20 group-hover:bg-transparent transition-colors duration-1000"></div>
          <img
            src={images.aviation[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] scale-100 group-hover:scale-110"
            alt="Aviation Background"
          />
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-12 md:px-24">
            <div className="inline-flex items-center gap-2 bg-[#c29b40] px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase mb-8 w-fit shadow-xl">
              <Plane size={14} className="text-white" />
              <span>Aviation & FPV Expert</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{t.name}</h2>
            <div className="h-4 md:h-6"></div>
            <p className="text-[#c29b40] font-mono text-sm tracking-[0.4em] uppercase opacity-90">{lang === 'tr' ? 'Lisanslı İHA-1 Pilotu' : 'Licensed UAV-1 Pilot'}</p>
          </div>
        </div>

        {/* Right Panel: Software/DB */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden">
          <div className="absolute top-6 right-6 z-30 opacity-20 pointer-events-none text-right">
            <span className="text-[10px] uppercase tracking-[0.8em] font-light">Software Background</span>
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-transparent to-transparent opacity-90"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/40 group-hover:bg-transparent transition-colors duration-1000"></div>
          <img
            src={images.tech[bgIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] scale-100 group-hover:scale-110 grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0"
            alt="Software Background"
          />

          <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 md:px-12">
            <div className="max-w-4xl w-full">

              {/* Centralized AI Container - Transparent & Optimized */}
              <div className="bg-transparent backdrop-blur-md border border-white/10 p-6 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-visible group/box transition-all duration-500 hover:border-white/20 flex flex-col justify-center min-h-[380px]">


                <div className="flex items-center gap-4 px-4">
                  <Terminal size={22} className="text-[#c29b40] animate-pulse" />
                  <span className="text-[12px] font-black tracking-[0.6em] text-white uppercase opacity-90">SYST_ENV_PRO.03</span>
                </div>

                <div className="h-10"></div>

                <div className="mb-4 px-6">
                  <p className="text-[11px] font-black text-[#c29b40] mb-12 tracking-[0.4em] uppercase opacity-80">Serkan'a Sorun (AI Assistant)</p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && askAI()}
                      placeholder={t.aiPlaceholder}
                      className="flex-1 bg-white/5 border border-white/10 px-8 py-5 text-sm focus:outline-none focus:border-[#c29b40]/50 text-white placeholder:text-gray-600 transition-all rounded-sm font-mono"
                    />
                    <button onClick={() => askAI()} disabled={isTyping} className="bg-[#c29b40] px-10 py-5 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(194,155,64,0.2)]">
                      {isTyping ? <Loader2 size={18} className="animate-spin" /> : <>SOR <Sparkles size={16} /></>}
                    </button>
                  </div>
                  {chatResponse && (
                    <div className="mt-8 text-[12px] text-gray-300 font-mono italic border-t border-white/10 pt-6 animate-in fade-in slide-in-from-top-4 duration-500 leading-relaxed bg-white/[0.01] p-6">
                      <span className="text-[#c29b40] font-bold inline-block mr-3">SERK_AI&gt;</span>{chatResponse}
                    </div>
                  )}
                </div>

                <div className="h-6 md:h-10"></div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/5 px-6">
                  <button onClick={() => setIsAboutOpen(true)} className="flex items-center justify-center gap-3 px-6 h-16 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#c29b40] hover:text-white transition-all shadow-lg">
                    <User size={16} /> {t.openAbout}
                  </button>
                  <a href="https://www.instagram.com/sserkan.77/" target="_blank" className="flex items-center justify-center gap-3 px-6 h-16 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                    <Instagram size={16} /> INSTA
                  </a>
                  <a href="https://github.com/Serkan-design" target="_blank" className="flex items-center justify-center gap-3 px-6 h-16 border border-white/10 text-[#c29b40] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#c29b40] hover:text-white transition-all">
                    <Code size={16} /> GITHUB
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections - Centered & Optimized */}
      <main className="w-full flex flex-col items-center gap-24 relative z-30 -mt-32">

        {/* FPV Details - Symmetric Content */}
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <div className="bg-[#1e293b]/10 backdrop-blur-3xl border border-white/5 p-12 md:p-24 relative overflow-visible transition-all duration-700 hover:border-[#c29b40]/20 flex flex-col items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#c29b40]/5 to-transparent pointer-events-none"></div>

            <div className="flex flex-col items-center justify-center gap-6 mb-24 relative z-10 w-full">
              <div className="w-20 h-[3px] bg-[#c29b40] mb-4"></div>
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                {t.fpvTitle}
              </h3>
              <Wind className="text-[#c29b40] opacity-40 animate-pulse mt-2" size={40} />
            </div>

            <p className="text-gray-400 text-xl md:text-2xl leading-relaxed mb-[120px] italic max-w-4xl relative z-10 px-6">
              {t.fpvDesc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-10 px-8">
              {[
                { icon: Award, label: "SHGM İHA-1", desc: "Commercial License" },
                { icon: Cpu, label: "BTFA-FLIGHT", desc: "System Optimization" },
                { icon: Box, label: "LRS/CROSSFIRE", desc: "Long Range Control" }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] p-12 border border-white/10 group/item hover:bg-white/[0.05] transition-all hover:translate-y-[-8px] flex flex-col items-center text-center">
                  <item.icon size={36} className="text-[#c29b40] mb-10 group-hover/item:scale-110 transition-transform" />
                  <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-2">{item.label}</p>
                  <p className="text-[11px] text-gray-500 font-mono italic mt-6">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills - Symmetric & Centered */}
        <div className="w-full max-w-[1500px] px-6 md:px-12">
          <div className="bg-white/[0.01] backdrop-blur-3xl p-12 md:p-24 border border-white/5 relative overflow-visible group transition-all duration-700 hover:border-[#c29b40]/20 flex flex-col items-center">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#c29b40]/5 rounded-full blur-[200px] pointer-events-none opacity-40"></div>

            <div className="flex flex-col items-center justify-center mb-28 relative z-10 w-full text-center">
              <Database size={40} className="text-[#c29b40] opacity-50 mb-8" />
              <h3 className="text-[16px] font-black uppercase tracking-[0.8em] text-gray-400">
                {t.skillsTitle}
              </h3>
              <div className="w-16 h-[1px] bg-white/20 mt-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-24 w-full relative z-10 px-12">
              {t.skills.map((skill, index) => (
                <div key={index} className="group/skill cursor-default flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-8 mb-4 w-full">
                    <div className="w-10 h-[1.5px] bg-white/5 group-hover/skill:bg-[#c29b40]/30 transition-all"></div>
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase group-hover/skill:text-[#c29b40] transition-colors">{skill.name}</span>
                    <div className="w-10 h-[1.5px] bg-white/5 group-hover/skill:bg-[#c29b40]/30 transition-all"></div>
                  </div>
                  <p className="text-[14px] text-gray-400 uppercase tracking-[0.2em] italic leading-relaxed group-hover/skill:text-gray-200 transition-all max-w-xl px-4 mt-8">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={() => setIsAboutOpen(false)}></div>
          <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-2xl p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#c29b40]"></div>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">{t.aboutTitle}</h3>
                <div className="w-20 h-1 bg-[#c29b40]"></div>
              </div>
              <button onClick={() => setIsAboutOpen(false)} className="text-gray-500 hover:text-white transition-colors transform hover:rotate-90 duration-300">
                <X size={40} strokeWidth={1.5} />
              </button>
            </div>
            <div className="relative">
              <p className="text-lg text-gray-300 leading-relaxed font-light text-justify italic bg-white/[0.03] p-10 border border-white/5">
                {t.aboutText}
              </p>
              <div className="absolute -bottom-4 -right-4 text-[#c29b40]/10 font-black text-8xl pointer-events-none select-none">RESUME</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-30 bg-[#020617] border-t border-white/5 py-16">
        <div className="w-full px-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-[1px] bg-[#c29b40]/30 mb-8"></div>

          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#c29b40] flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(194,155,64,0.2)]">
              <Box size={24} className="text-white fill-current" />
            </div>
            <span className="font-black tracking-tighter text-2xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
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
