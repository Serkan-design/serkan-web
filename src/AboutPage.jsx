import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';
import {
  User, Award, Cpu, Database, Sparkles,
  Github, Instagram, Mail, ArrowLeft, Plane, Code
} from 'lucide-react';

const AboutPage = () => {
  const { lang } = useAppContext();
  const navigate = useNavigate();

  // Scroll to top on mount, ensure page scrolls naturally
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const t = {
    tr: {
      label: 'Profil · Özgeçmiş',
      title: 'Hakkımda',
      role: 'Bilgisayar Programcılığı Öğrencisi',
      tags: ['Anadolu Üniversitesi', '21 Yaşında', 'Türkiye'],
      bioLabel: 'Biyografi',
      bio: "21 yaşında, Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında aktif şekilde yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşarak disiplinli bir şekilde çalışmalarımı sürdürüyorum.\n\n.NET ekosistemi ve SQL tabanlı veri yapıları ile ölçeklenebilir backend sistemler geliştirirken, aynı zamanda Docker, Linux ve Cloudflare Tunnel gibi teknolojiler kullanarak kendi self-hosted sunucu altyapımı kuruyor ve yönetiyorum.\n\nModern yazılım prensiplerini mühendislik yaklaşımıyla birleştirerek kararlı, sürdürülebilir ve gerçek dünya problemlerine çözüm üreten sistemler geliştirmeye odaklanıyorum.\n\nKali Linux'u günlük işletim sistemi olarak tam kurulum şeklinde aktif olarak kullanıyorum. Ayrıca havacılık teknolojilerine olan ilgim doğrultusunda İHA-1 ticari ehliyetine sahip bir drone pilotuyum.",
      milestonesLabel: 'Kilometre Taşları',
      toolkitLabel: 'Teknik Araç Kutusu',
      backBtn: 'Geri Dön',
    },
    en: {
      label: 'Profile · Resume',
      title: 'About Me',
      role: 'Computer Programming Student',
      tags: ['Anadolu University', '21 y/o', 'Turkey'],
      bioLabel: 'Biography',
      bio: "As a 21-year-old Computer Programming student, I am actively involved in the technology world. I continue my studies in a disciplined manner, focusing on embedded systems and database architectures.\n\nWhile developing scalable backend systems with the .NET ecosystem and SQL-based data structures, I also build and manage my own self-hosted server infrastructure using technologies such as Docker, Linux, and Cloudflare Tunnel.\n\nI focus on developing stable, sustainable systems that provide solutions to real-world problems by combining modern software principles with an engineering approach.\n\nI actively use Kali Linux as my daily operating system in a full installation. Additionally, in line with my interest in aviation technologies, I am a drone pilot with a commercial UAV-1 license.",
      milestonesLabel: 'Milestones',
      toolkitLabel: 'Technical Toolkit',
      backBtn: 'Go Back',
    },
  }[lang];

  const milestones = [
    {
      icon: Award,
      tr: ['SHGM İHA-1 Ehliyeti', 'Lisanslı ticari İHA pilotu'],
      en: ['SHGM UAV-1 License', 'Licensed commercial UAV pilot'],
    },
    {
      icon: Sparkles,
      tr: ['Groq AI Entegrasyonu', 'LLaMA 3 tabanlı AI chatbot geliştirme'],
      en: ['Groq AI Integration', 'LLaMA 3 powered AI chatbot development'],
    },
    {
      icon: Plane,
      tr: ['FPV Drone Üretimi', 'Özel FPV drone tasarımı ve optimizasyonu'],
      en: ['FPV Drone Build', 'Custom FPV drone design & optimization'],
    },
    {
      logo: 'https://cdn.simpleicons.org/dotnet/ef4444',
      tr: ['Telefon Rehberi Projesi', '.NET & C# ile tam kapsamlı CRUD uygulaması'],
      en: ['Phone Book Project', 'Full-featured CRUD app with .NET & C#'],
    },
    {
      logo: 'https://cdn.simpleicons.org/arduino/ef4444',
      tr: ['ESP32 IoT Projesi', 'Blynk platformu ile uzaktan LED kontrolü'],
      en: ['ESP32 IoT Project', 'Remote LED control via Blynk platform'],
    },
    {
      logo: 'https://cdn.simpleicons.org/kalilinux/ef4444',
      tr: ['Kali Linux Tam Kurulum', 'Günlük kullanım için özelleştirilmiş sistem'],
      en: ['Kali Linux Full Setup', 'Custom configured daily driver system'],
    },
  ];

  return (
    <div className="about-page-root" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-primary)', minHeight: '100vh', overflowY: 'auto' }}>

      {/* Background */}
      <div className="about-page-bg">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="ap-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ap-grid)" />
        </svg>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Top accent line */}
      <div className="about-page-topline" />

      {/* ── HEADER ── */}
      <header className="about-page-header">
        <button className="about-page-backbtn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>{t.backBtn}</span>
        </button>
        <div className="about-page-header-center">
          <p className="about-page-label">{t.label}</p>
          <h1 className="about-page-title">{t.title}</h1>
        </div>
        <div className="about-page-header-right">
          <span className="about-page-live-dot" />
          <span className="about-page-live-text">LIVE</span>
        </div>
      </header>

      <div className="about-page-divider" />

      {/* ── CONTENT (original card-based layout) ── */}
      <div className="about-page-content">
        
        {/* Identity & Socials */}
        <div className="about-page-card about-page-identity-card">
          <div className="about-pg-avatar">
            <span className="about-pg-initials">SI</span>
            <div className="about-pg-avatar-ring" />
            <div className="about-pg-online-dot" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="about-pg-name">Serkan <span style={{ color: '#ef4444' }}>Işık</span></h2>
            <p className="about-pg-role">{t.role}</p>
            <div className="about-pg-tags">
              {t.tags.map((tag, i) => (
                <span key={i} className="about-pg-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="about-page-social-row">
          <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="about-pg-social-btn about-pg-social-red">
            <Github size={15} /><span>GitHub</span>
          </a>
          <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer" className="about-pg-social-btn about-pg-social-ghost">
            <Instagram size={15} /><span>Instagram</span>
          </a>
          <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=serkanisik67@gmail.com&su=${encodeURIComponent(lang === 'tr' ? 'İletişim' : 'Contact')}`} target="_blank" rel="noopener noreferrer" className="about-pg-social-btn about-pg-social-ghost">
            <Mail size={15} /><span>Mail</span>
          </a>
        </div>

        {/* Bio */}
        <div className="about-page-card about-bio-card">
          <div className="about-bio-heading">
            <span className="about-bio-heading-bar" />
            <span className="about-bio-heading-text">{t.bioLabel}</span>
          </div>
          <p className="about-pg-bio">{t.bio}</p>
        </div>

        {/* Milestones */}
        <div className="about-page-section-heading">
          <Award size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span>{t.milestonesLabel}</span>
        </div>

        <div className="about-page-timeline">
          {milestones.map((m, i) => (
            <div key={i} className="about-pg-timeline-item">
              <div className="about-pg-tl-dot">
                {m.logo ? (
                  <img src={m.logo} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                ) : (
                  <m.icon size={20} style={{ color: '#ef4444' }} />
                )}
              </div>
              <div className="about-pg-tl-content">
                <p className="about-pg-tl-title">{lang === 'tr' ? m.tr[0] : m.en[0]}</p>
                <p className="about-pg-tl-desc">{lang === 'tr' ? m.tr[1] : m.en[1]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolkit */}
        <div className="about-page-section-heading">
          <Database size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span>{t.toolkitLabel}</span>
        </div>

        <div className="about-toolkit-container">
          <table className="about-toolkit-table">
            <thead>
              <tr>
                <th>{lang === 'tr' ? 'Kategori' : 'Category'}</th>
                <th>{lang === 'tr' ? 'Teknolojiler' : 'Technologies'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="toolkit-category">{lang === 'tr' ? 'Diller' : 'Languages'}</td>
                <td className="toolkit-badges">
                  <span className="tech-badge-premium" style={{"--bg": "#9B4F9615", "--color": "#9B4F96"}}>C#</span>
                  <span className="tech-badge-premium" style={{"--bg": "#00599C15", "--color": "#00599C"}}>C++</span>
                  <span className="tech-badge-premium" style={{"--bg": "#3776AB15", "--color": "#3776AB"}}>Python</span>
                  <span className="tech-badge-premium" style={{"--bg": "#f7df1e15", "--color": "#f7df1e"}}>JavaScript</span>
                </td>
              </tr>
              <tr>
                <td className="toolkit-category">Embedded/IoT</td>
                <td className="toolkit-badges">
                  <span className="tech-badge-premium" style={{"--bg": "#E7352B15", "--color": "#E7352B"}}>ESP32</span>
                  <span className="tech-badge-premium" style={{"--bg": "#00979D15", "--color": "#00979D"}}>Arduino</span>
                  <span className="tech-badge-premium" style={{"--bg": "#00E5FF15", "--color": "#00E5FF"}}>Blynk</span>
                </td>
              </tr>
              <tr>
                <td className="toolkit-category">Frameworks & DB</td>
                <td className="toolkit-badges">
                  <span className="tech-badge-premium" style={{"--bg": "#512BD415", "--color": "#512BD4"}}>.NET</span>
                  <span className="tech-badge-premium" style={{"--bg": "#CC292715", "--color": "#CC2927"}}>SQL</span>
                  <span className="tech-badge-premium" style={{"--bg": "#311B9215", "--color": "#311B92"}}>ADO.NET</span>
                </td>
              </tr>
              <tr>
                <td className="toolkit-category">FPV & Hardware</td>
                <td className="toolkit-badges">
                  <span className="tech-badge-premium" style={{"--bg": "#ff910015", "--color": "#ff9100"}}>Soldering</span>
                  <span className="tech-badge-premium" style={{"--bg": "#27272a15", "--color": "#fff"}}>Betaflight</span>
                  <span className="tech-badge-premium" style={{"--bg": "#F0503215", "--color": "#F05032"}}>Git</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ height: '40px' }} />
      </div>
    </div>
  );
};

export default AboutPage;
