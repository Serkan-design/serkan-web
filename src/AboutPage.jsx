import { useEffect, useState } from 'react';
import {
  User, Award, Cpu, Database, Terminal, Sparkles,
  Github, Instagram, Mail, ArrowLeft, Plane, Code
} from 'lucide-react';

const AboutPage = ({ lang, onBack }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 30);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, []);

  const handleBack = () => {
    setVisible(false);
    setTimeout(onBack, 400);
  };

  const t = {
    tr: {
      label: 'Profil · Özgeçmiş',
      title: 'Hakkımda',
      name: 'Serkan Işık',
      role: 'Bilgisayar Programcılığı Öğrencisi',
      tags: ['Anadolu Üniversitesi', '21 Yaşında', 'Türkiye'],
      bioLabel: 'Biyografi',
      bio: '21 yaşında, Bilgisayar Programcılığı öğrencisi olarak teknoloji dünyasında yer almaktayım. Gömülü sistemler ve veritabanı mimarileri üzerine yoğunlaşmış bir disiplinle çalışmalarımı sürdürüyorum. Modern yazılım prensiplerini mühendislik etiğiyle harmanlayarak kararlı ve ölçeklenebilir çözümler üretmeye odaklanıyorum. Kali Linux\'u günlük işletim sistemi olarak tam kurulum şekliyle yapılandırdım. Aynı zamanda havacılık teknolojilerine duyduğum ilgiyle İHA-1 ticari ehliyetine sahip bir drone pilotuyum.',
      milestonesLabel: 'Kilometre Taşları',
      skillsLabel: 'Teknik Yetkinlikler',
      backBtn: 'Geri Dön',
    },
    en: {
      label: 'Profile · Resume',
      title: 'About Me',
      name: 'Serkan Isik',
      role: 'Computer Programming Student',
      tags: ['Anadolu University', '21 y/o', 'Turkey'],
      bioLabel: 'Biography',
      bio: '21-year-old Computer Programming student focused on embedded systems and database architectures. I blend modern software principles with engineering ethics to build robust, scalable solutions. I run Kali Linux as my daily OS. Licensed Commercial UAV-1 pilot passionate about aviation technology.',
      milestonesLabel: 'Milestones',
      skillsLabel: 'Technical Skills',
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
      icon: Terminal,
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
    <div
      className="about-page-root"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.26,0.64,1)',
      }}
    >
      {/* Background grid */}
      <div className="about-page-bg">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="ap-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(239,68,68,0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ap-grid)" />
        </svg>
        {/* Red glow top-right */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Red glow bottom-left */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Top accent line */}
      <div className="about-page-topline" />

      {/* ── HEADER ── */}
      <header className="about-page-header">
        <button className="about-page-backbtn" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>{t.backBtn}</span>
        </button>

        <div className="about-page-header-center">
          <p className="about-page-label">{t.label}</p>
          <h1 className="about-page-title">{t.title}</h1>
        </div>

        {/* Decorative right element */}
        <div className="about-page-header-right">
          <span className="about-page-live-dot" />
          <span className="about-page-live-text">LIVE</span>
        </div>
      </header>

      {/* ── DIVIDER ── */}
      <div className="about-page-divider" />

      {/* ── MAIN CONTENT ── */}
      <main className="about-page-main">

        {/* ── LEFT COLUMN ── */}
        <div className="about-page-left">

          {/* Identity card */}
          <div className="about-page-card about-page-identity-card">
            <div className="about-pg-avatar">
              <span className="about-pg-initials">SI</span>
              <div className="about-pg-avatar-ring" />
              <div className="about-pg-online-dot" />
            </div>
            <div>
              <h2 className="about-pg-name">
                Serkan <span style={{ color: '#ef4444' }}>Işık</span>
              </h2>
              <p className="about-pg-role">{t.role}</p>
              <div className="about-pg-tags">
                {t.tags.map((tag, i) => (
                  <span key={i} className="about-pg-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="about-page-card about-bio-card">
            <div className="about-bio-heading">
              <span className="about-bio-heading-bar" />
              <span className="about-bio-heading-text">{t.bioLabel}</span>
            </div>
            <p className="about-pg-bio">{t.bio}</p>
          </div>

          {/* Social */}
          <div className="about-page-social-row">
            <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="about-pg-social-btn about-pg-social-red">
              <Github size={15} /><span>GitHub</span>
            </a>
            <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer" className="about-pg-social-btn about-pg-social-ghost">
              <Instagram size={15} /><span>Instagram</span>
            </a>
            <a href={`mailto:serkanisik67@gmail.com?subject=${encodeURIComponent(lang === 'tr' ? 'Portfolyo Üzerinden İletişim' : 'Contact from Portfolio')}`} className="about-pg-social-btn about-pg-social-ghost">
              <Mail size={15} /><span>Mail</span>
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="about-page-right">

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
                    <img src={m.logo} alt="" style={{ width: '16px', height: '16px' }} />
                  ) : (
                    <m.icon size={11} style={{ color: '#ef4444' }} />
                  )}
                </div>
                <div className="about-pg-tl-content">
                  <p className="about-pg-tl-title">{lang === 'tr' ? m.tr[0] : m.en[0]}</p>
                  <p className="about-pg-tl-desc">{lang === 'tr' ? m.tr[1] : m.en[1]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Toolkit */}
          <div className="about-page-section-heading" style={{ marginTop: '32px' }}>
            <Database size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span>{lang === 'tr' ? 'Teknik Araç Kutusu' : 'Technical Toolkit'}</span>
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
                    <span className="tk-badge tk-csharp">C#</span>
                    <span className="tk-badge tk-cpp">C++</span>
                    <span className="tk-badge tk-python">Python</span>
                    <span className="tk-badge tk-js">JavaScript</span>
                  </td>
                </tr>
                <tr>
                  <td className="toolkit-category">Embedded/IoT</td>
                  <td className="toolkit-badges">
                    <span className="tk-badge tk-esp32">ESP32</span>
                    <span className="tk-badge tk-arduino">Arduino</span>
                    <span className="tk-badge tk-blynk">Blynk</span>
                  </td>
                </tr>
                <tr>
                  <td className="toolkit-category">Frameworks & DB</td>
                  <td className="toolkit-badges">
                    <span className="tk-badge tk-dotnet">.NET</span>
                    <span className="tk-badge tk-sql">SQL</span>
                  </td>
                </tr>
                <tr>
                  <td className="toolkit-category">FPV & Hardware</td>
                  <td className="toolkit-badges">
                    <span className="tk-badge tk-soldering">Soldering</span>
                    <span className="tk-badge tk-betaflight">Betaflight</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>
      </main>
    </div>
  );
};

export default AboutPage;
