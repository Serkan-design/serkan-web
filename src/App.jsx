import { useState } from 'react';
import {
  Instagram,
  Mail,
  Cpu,
  Database,
  Wind,
  Terminal,
  User,
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
  const [showContact, setShowContact] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const images = {
    aviation: [
      "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=50&w=800",
    ],
    tech: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=50&w=800",
    ]
  };

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
            <a href="#about" className="text-[12px] font-bold tracking-[0.2em] text-gray-500 hover:text-white uppercase transition-colors">
              {t.openAbout}
            </a>
            <button onClick={() => setShowContact(true)} className="px-8 py-2.5 bg-[#c29b40] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(194,155,64,0.3)]">
              {t.contactBtn}
            </button>
          </div>
        </div>
      </nav>

      {/* Split-Screen Hero Section */}
      <section className="relative h-screen w-full flex flex-col md:flex-row overflow-hidden">

        {/* Left Panel: Aviation/FPV */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
          <img
            src={images.aviation[0]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-110 opacity-100"
            alt="Aviation Background"
          />
          <div className="relative z-20 h-full flex flex-col items-start" style={{ justifyContent: 'center', paddingLeft: '18%', paddingRight: '5%', marginTop: '8%' }}>
            <div className="inline-flex items-center gap-2 bg-[#c29b40] px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase mb-8 w-fit shadow-xl">
              <Plane size={14} className="text-white" />
              <span>Aviation & FPV Expert</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{t.name}</h2>
            <div className="h-4 md:h-6"></div>
            <p className="font-mono text-sm tracking-[0.4em] uppercase" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)' }}>{lang === 'tr' ? 'Lisanslı İHA-1 Pilotu' : 'Licensed UAV-1 Pilot'}</p>
          </div>
        </div>

        {/* Right Panel: Software/DB */}
        <div className="relative w-full md:w-1/2 h-full group overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#020617] via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute inset-0 z-10 bg-[#020617]/40 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
          <img
            src={images.tech[0]}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-110 opacity-100"
            alt="Software Background"
          />

          <div className="relative z-20 h-full flex flex-col justify-center items-center px-8 md:px-14">
            <div className="w-full max-w-lg">

              {/* Terminal system tag */}
              <div className="flex items-center gap-2 mb-6 opacity-60">
                <Terminal size={11} className="text-[#c29b40]" />
                <span className="text-[10px] font-mono tracking-[0.35em] text-gray-400 uppercase">SYST_ENV_PRO.03</span>
                <div className="flex-1 h-px bg-white/10 ml-2"></div>
              </div>

              {/* DEV ENVIRONMENT label */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[#c29b40] font-mono text-[15px] font-bold">&lt;&gt;</span>
                <span className="text-[12px] font-bold tracking-[0.25em] text-gray-300 uppercase">Dev Environment</span>
              </div>

              {/* Main AI Box — glassmorphism */}
              <div className="relative border-l-[3px] border-[#c29b40] bg-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(194,155,64,0.08)] overflow-hidden">
                {/* top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#c29b40]/60 via-white/5 to-transparent"></div>
                {/* subtle glow orb */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#c29b40]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-6 relative z-10">
                  {/* AI label */}
                  <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
                    <Sparkles size={11} className="text-[#c29b40] opacity-80" />
                    <h3 className="text-[11px] font-black text-[#c29b40] tracking-[0.2em] uppercase">
                      SERKAN&apos;A SORUN <span className="text-white/30 font-normal">(AI Assistant)</span>
                    </h3>
                  </div>

                  {/* Input row */}
                  <div className="flex w-full gap-2" style={{ height: '52px' }}>
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && askAI()}
                      placeholder={t.aiPlaceholder}
                      style={{ height: '52px' }}
                      className="flex-1 bg-white/[0.05] border border-white/[0.10] px-5 text-[13px] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#c29b40]/40 transition-colors font-sans"
                    />
                    <button
                      onClick={() => askAI()}
                      disabled={isTyping}
                      style={{ height: '52px' }}
                      className="bg-[#c29b40] px-8 font-black text-[12px] uppercase tracking-[0.2em] text-white hover:bg-[#d4a845] focus:outline-none transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(194,155,64,0.3)]"
                    >
                      {isTyping ? <Loader2 size={16} className="animate-spin" /> : <>SOR <span className="opacity-70">→</span></>}
                    </button>
                  </div>

                  {/* AI response */}
                  {chatResponse && (
                    <div className="mt-4 text-[12px] text-gray-300 font-mono border-t border-white/5 pt-4 leading-relaxed bg-black/20 px-4 py-3">
                      <span className="text-[#c29b40] font-bold mr-2">SERK_AI&gt;</span>{chatResponse}
                    </div>
                  )}
                </div>

                {/* bottom scan line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c29b40]/20 to-transparent"></div>
              </div>

              {/* Social links — refined */}
              <div className="grid grid-cols-2 gap-3" style={{ marginTop: '16px' }}>
                <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 bg-white/[0.04] border border-white/[0.08] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                  <Instagram size={13} /> INSTA
                </a>
                <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 bg-white/[0.04] border border-[#c29b40]/30 text-[#c29b40] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#c29b40] hover:text-white hover:border-[#c29b40] transition-all duration-300">
                  <Code size={13} /> GITHUB
                </a>
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
                  <item.icon size={36} className="text-[#c29b40] mb-12 group-hover/item:scale-110 transition-transform" />
                  <p className="text-[13px] font-black uppercase tracking-[0.4em] mb-4">{item.label}</p>
                  <div className="h-6"></div>
                  <p className="text-[11px] text-gray-500 font-mono italic mt-4">{item.desc}</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-32 w-full relative z-10 px-12 mt-12">
              {t.skills.map((skill, index) => (
                <div key={index} className="group/skill cursor-default flex flex-col items-center text-center mb-8">
                  <div className="flex items-center justify-center gap-8 mb-8 w-full">
                    <div className="w-10 h-[1.5px] bg-white/5 group-hover/skill:bg-[#c29b40]/30 transition-all"></div>
                    <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase group-hover/skill:text-[#c29b40] transition-colors">{skill.name}</span>
                    <div className="w-10 h-[1.5px] bg-white/5 group-hover/skill:bg-[#c29b40]/30 transition-all"></div>
                  </div>
                  <div className="h-8"></div>
                  <p className="text-[14px] text-gray-400 uppercase tracking-[0.2em] italic leading-relaxed group-hover/skill:text-gray-200 transition-all max-w-xl px-4 mt-4">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* About Section at Bottom */}
        <section id="about" className="relative z-30 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-12 text-center flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-12 w-full">
            <User size={32} className="text-[#c29b40] mb-8 opacity-30" />
            <h3 className="text-[16px] font-black uppercase tracking-[0.8em] text-gray-400">
              {t.aboutTitle}
            </h3>
            <div className="w-24 h-[1px] bg-[#c29b40]/30 mt-8"></div>
          </div>
          <p className="text-[13px] text-gray-400 font-mono leading-relaxed italic tracking-widest max-w-4xl px-4 md:px-12 text-center decoration-white/5 opacity-80">
            {t.aboutText}
          </p>
        </section>
      </main>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={() => setShowContact(false)}></div>
          <div className="relative bg-[#0f172a] border border-white/10 w-full max-w-md p-12 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c29b40]"></div>
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
