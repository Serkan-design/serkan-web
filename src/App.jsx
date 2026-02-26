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
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#c29b40] flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(194,155,64,0.3)]">
              <Box size={22} className="text-white fill-current" />
            </div>
            <span className="font-black tracking-tighter text-2xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
          </div>

          <div className="flex items-center gap-10">
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="text-[13px] font-bold tracking-[0.2em] text-gray-500 hover:text-white uppercase transition-colors">
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
            <a href="mailto:serkanisik67@gmail.com" className="px-8 py-3 bg-[#c29b40] text-white text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_25px_rgba(194,155,64,0.4)]">
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
          <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-20">
            <div className="inline-flex items-center gap-2 bg-[#c29b40] px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase mb-8 w-fit shadow-xl">
              <Plane size={14} className="text-white" />
              <span>Aviation & FPV Expert</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-none">{t.name}</h2>
            <p className="text-[#c29b40] font-mono text-sm tracking-[0.4em] uppercase opacity-80">Licensed UAV-1 Pilot</p>
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

          <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-20">
            <div className="max-w-xl w-full">
              <div className="flex items-center gap-3 mb-12">
                <Code size={20} className="text-[#c29b40]" />
                <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase">Dev Environment</span>
              </div>

              {/* AI Tool Integrated in Right Panel */}
              <div className="bg-[#020617]/60 backdrop-blur-2xl border border-white/5 p-8 shadow-2xl relative group/ai overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#c29b40]"></div>
                <p className="text-[11px] font-black text-[#c29b40] mb-6 tracking-[0.3em] uppercase opacity-80">Serkan'a Sorun (AI)</p>
                <div className="flex gap-4">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    placeholder={t.aiPlaceholder}
                    className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-[#c29b40]/50 text-white placeholder:text-gray-600 transition-all"
                  />
                  <button onClick={() => askAI()} disabled={isTyping} className="bg-[#c29b40] px-8 py-4 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-2 group-hover/ai:translate-x-1 duration-300">
                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <>SOR <Sparkles size={14} /></>}
                  </button>
                </div>
                {chatResponse && (
                  <div className="mt-4 text-[11px] text-gray-400 italic border-t border-white/5 pt-4 animate-in fade-in slide-in-from-top-2">
                    {chatResponse}
                  </div>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-6">
                <button onClick={() => setIsAboutOpen(true)} className="flex items-center justify-center gap-3 px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#c29b40] hover:text-white transition-all min-w-[180px]">
                  <User size={16} /> {t.openAbout}
                </button>
                <a href="https://www.instagram.com/sserkan.77/" target="_blank" className="flex items-center justify-center gap-3 px-10 py-4 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all min-w-[180px]">
                  <Instagram size={16} /> INSTA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12 relative z-30 -mt-20">

        {/* FPV Details */}
        <div className="lg:col-span-7">
          <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 p-12 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c29b40]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                <span className="w-12 h-[2px] bg-[#c29b40]"></span>
                {t.fpvTitle}
              </h3>
              <Wind className="text-[#c29b40] opacity-40 group-hover:rotate-180 transition-transform duration-[2000ms]" />
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-12 italic border-l-2 border-[#c29b40]/30 pl-6">
              {t.fpvDesc}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { icon: Award, label: "SHGM İHA-1" },
                { icon: Cpu, label: "Betaflight" },
                { icon: Box, label: "LRS/Crossfire" }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] p-6 border border-white/5 text-center group/item hover:bg-white/[0.05] transition-all">
                  <item.icon size={20} className="text-[#c29b40] mx-auto mb-4 group-hover/item:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="lg:col-span-5">
          <div className="bg-white/[0.02] backdrop-blur-3xl p-12 border border-white/5 h-full relative">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-500">{t.skillsTitle}</h3>
              <Database size={20} className="text-[#c29b40] opacity-60" />
            </div>
            <div className="space-y-10">
              {t.skills.map((skill, index) => (
                <div key={index} className="group cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-[11px] tracking-[0.2em] uppercase group-hover:text-[#c29b40] transition-colors">{skill.name}</span>
                    <div className="h-[1px] flex-1 mx-6 bg-white/5 group-hover:bg-[#c29b40]/20 transition-all"></div>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-[#c29b40] transition-colors" />
                  </div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest italic leading-relaxed group-hover:text-gray-400 transition-colors">{skill.desc}</p>
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
      <footer className="relative z-30 bg-[#020617] border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-[1px] bg-[#c29b40]/30 mb-10"></div>
          <div className="flex items-center gap-4 mb-8">
            <Box size={20} className="text-[#c29b40]" />
            <span className="font-black tracking-tighter text-xl">SI<span className="text-[#c29b40]">.</span>TECH</span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.8em] font-black mb-10 opacity-60 text-center">{t.footer}</p>
          <div className="flex space-x-12">
            <a href="https://www.instagram.com/sserkan.77/" className="text-gray-500 hover:text-[#c29b40] transition-all transform hover:scale-110"><Instagram size={24} /></a>
            <a href="mailto:serkanisik67@gmail.com" className="text-gray-500 hover:text-[#c29b40] transition-all transform hover:scale-110"><Mail size={24} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
