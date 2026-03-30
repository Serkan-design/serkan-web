import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from './AppContext';
import { ArrowLeft, Github, ExternalLink, Cpu, Database, Terminal, Code, Box, Calendar, Award, X } from 'lucide-react';
import { createPortal } from 'react-dom';

// ... (projects and certificates data stays the same)

// ── Projects Data ───────────────────────────────────────
const projects = [
  {
    id: 'proj1',
    titleTr: 'Telefon Rehberi (.NET & C#)',
    titleEn: 'Phone Book (.NET & C#)',
    descTr: 'ADO.NET ve C# ile geliştirilmiş, SQL Server tabanlı tam kapsamlı CRUD telefon rehberi uygulaması.',
    descEn: 'Full-featured CRUD phone book built with ADO.NET & C# on SQL Server.',
    github: 'https://github.com/Serkan-design/TelefonRehberi',
    techs: [
      { name: 'C#', color: '#9B4F96' },
      { name: '.NET', color: '#512BD4' },
      { name: 'ADO.NET', color: '#512BD4' },
      { name: 'SQL', color: '#CC2927' },
    ],
    icon: Database,
    accent: '#9B4F96',
  },
  {
    id: 'proj2',
    titleTr: 'ESP32 Blynk LED Kontrol',
    titleEn: 'ESP32 Blynk LED Control',
    descTr: 'ESP32 mikrodenetleyici ve Blynk IoT platformu kullanılarak Wi-Fi üzerinden uzaktan LED kontrolü.',
    descEn: 'Remote LED control over Wi-Fi using ESP32 & the Blynk IoT platform.',
    github: 'https://github.com/Serkan-design/ESP32-Blynk-LED-Control',
    techs: [
      { name: 'C++', color: '#00599C' },
      { name: 'ESP32', color: '#E7352B' },
      { name: 'IoT', color: '#4EAA25' },
    ],
    icon: Cpu,
    accent: '#E7352B',
  },
  {
    id: 'proj3',
    titleTr: 'Finger Control — OpenCV',
    titleEn: 'Finger Control — OpenCV',
    descTr: 'Python ve OpenCV kullanarak el parmak hareketleriyle bilgisayarı kontrol eden gerçek zamanlı görüntü işleme uygulaması.',
    descEn: 'Real-time computer vision app using Python & OpenCV for finger gesture control.',
    github: 'https://github.com/Serkan-design/Finger-Control-OpenCV',
    techs: [
      { name: 'Python', color: '#3776AB' },
      { name: 'OpenCV', color: '#5C3EE8' },
      { name: 'MediaPipe', color: '#00BCD4' },
    ],
    icon: Terminal,
    accent: '#5C3EE8',
  },
  {
    id: 'proj4',
    titleTr: 'SITech Nutrition API',
    titleEn: 'SITech Nutrition API',
    descTr: 'Modern beslenme ve diyet takip sistemleri için geliştirilmiş, yüksek performanslı ve ölçeklenebilir RESTful API projesi.',
    descEn: 'A high-performance, scalable RESTful API project developed for modern nutrition and diet tracking systems.',
    github: 'https://github.com/Serkan-design/SITech.NutritionApi',
    techs: [
      { name: 'C#', color: '#9B4F96' },
      { name: '.NET 8', color: '#512BD4' },
      { name: 'Entity Framework', color: '#512BD4' },
      { name: 'REST API', color: '#00BCD4' }
    ],
    icon: Code,
    accent: '#512BD4',
  },
  {
    id: 'proj5',
    titleTr: 'Exam Study Planner',
    titleEn: 'Exam Study Planner',
    descTr: 'Üniversite sınavları için modüler çalışma planlayıcı. Akıllı zamanlama, ilerleme takibi ve interaktif vize hazırlık testleri sunar.',
    descEn: 'Modular study planner for university exams. Features intelligent scheduling, progress tracking, and interactive prep quizzes.',
    github: 'https://github.com/Serkan-design/exam-study-planner',
    techs: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Tailwind', color: '#06B6D4' },
      { name: 'Framer Motion', color: '#E911E2' },
      { name: 'Lucide', color: '#F97316' },
    ],
    icon: Calendar,
    accent: '#3B82F6',
  },
];

// ── Certificates Data ─────────────────────────────────────
const certificates = [
  {
    id: 'fibon',
    category: 'award',
    titleTr: 'Fibonacci International Robot Olympiad',
    titleEn: 'Fibonacci International Robot Olympiad',
    issuer: 'International Robot Olympiad Committee',
    date: '2024 - 2025',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=1400',
    subItems: [
      { labelTr: 'Dünya Şampiyonası (Roma, İtalya) - Drone Rally (Birincilik)', labelEn: 'World Championship (Rome, Italy) - Drone Rally (1st Place)', pdf: 'DRONE RALLY ÜNİVERSİTE.pdf' },
      { labelTr: 'Dünya Şampiyonası (Roma, İtalya) - MBOT Line Following (Birincilik)', labelEn: 'World Championship (Rome, Italy) - MBOT Line Following (1st Place)', pdf: 'Certificates_Selected_20251128_103104.pdf' },
      { labelTr: 'Dünya Şampiyonası (Roma, İtalya) - Maze Solving (Üçüncülük)', labelEn: 'World Championship (Rome, Italy) - Maze Solving (3rd Place)', pdf: 'MAZE SOLVİNG ÜNİVERSİTE.pdf' },
      { labelTr: 'Dünya Şampiyonası (Roma, İtalya) - Katılım Belgesi', labelEn: 'World Championship (Rome, Italy) - Participation', pdf: 'Certificates_Selected_20251128_075846.pdf' },
      { labelTr: 'Marmara Turnuvası (İstanbul, Türkiye) - Maze Solving (Jüri Özel Ödülü)', labelEn: 'Marmara Tournament (Istanbul, Turkey) - Maze Solving (Jury Award)', pdf: 'Maze Üniversite Sertifika.pdf' },
      { labelTr: 'Avrasya Şampiyonası (Antalya, Türkiye) - Maze Solving (İkincilik)', labelEn: 'Eurasian Championship (Antalya, Turkey) - Maze Solving (2nd Place)', pdf: 'günel sertifika.pdf' },
      { labelTr: 'Avrasya Şampiyonası (Antalya, Türkiye) - Katılım Belgesi', labelEn: 'Eurasian Championship (Antalya, Turkey) - Participation', pdf: '1589.pdf' },
      { labelTr: 'Fibonacci Değişim Hakkı Sertifikası', labelEn: 'Fibonacci Exchange Right Certificate', pdf: '33_OZEL YALOVA TEKNOAKADEMI BILGISAYAR VE ROBOTIK KODLAMA KURSU.pdf' }
    ]
  },
  {
    id: 'cert5',
    category: 'cert',
    titleTr: 'C# Eğitim Sertifikası',
    titleEn: 'C# Programming Certificate',
    issuer: 'Udemy',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    pdf: 'UDEMY SERTİFİKA.pdf'
  },
  {
    id: 'cert3',
    category: 'cert',
    titleTr: 'Python Programlama Sertifikası',
    titleEn: 'Python Programming Certificate',
    issuer: 'Bilgeİş',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    pdf: 'Yeni_Başlayanlar_için_Python_Programlama_Sertifika.pdf'
  }
];

// ── Tech icons ───────────────────────────────────────────
const techs = [
  { name: 'C#',      color: '#9B4F96', path: 'M11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C2.56 15.77 2 14.16 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.96-.44c-.4-.01-.83.06-1.28.19-.31.09-.6.25-.87.49-.27.23-.49.54-.66.91-.17.38-.26.86-.26 1.45.01.58.1 1.09.28 1.51.18.42.41.77.69 1.04s.59.46.94.58.72.18 1.1.17c.42-.01.81-.05 1.17-.12.35-.08.64-.17.87-.29zm5.47 3.19l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1zm3 0l-.71.71.71.71v1h-1v.71l-.71-.71-.71.71V13.5h-1v-1l.71-.71-.71-.71v-1h1V9.5l.71.71.71-.71v1h1v1z' },
  { name: '.NET',    color: '#512BD4', path: 'M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L5.234 9.936c-.145-.222-.243-.413-.296-.573h-.041c.031.188.047.499.047.932v6.042H3.619V7.53h1.7l3.524 6.302c.19.335.313.572.369.71h.028c-.038-.24-.056-.584-.056-1.03V7.53h1.256v8.805z' },
  { name: 'Python',  color: '#3776AB', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
  { name: 'SQL',     color: '#CC2927', path: 'M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4m0 6c-3.87 0-6-.9-6-2s2.13-2 6-2 6 .9 6 2-2.13 2-6 2m8 2c0 2.21-3.58 4-8 4s-8-1.79-8-4V9.78C5.61 11.1 8.67 12 12 12s6.39-.9 8-2.22zm0 4c0 2.21-3.58 4-8 4s-8-1.79-8-4v-2.22C5.61 15.1 8.67 16 12 16s6.39-.9 8-2.22z' },
  { name: 'ESP32',   color: '#E7352B', path: 'M7 2v2H5v2H3v8h2v2h2v2h10v-2h2v-2h2V6h-2V4h-2V2zm0 2h10v2h2v8h-2v2H7v-2H5V6h2zm3 2H8v2H6v4h2v2h8v-2h2v-4h-2V6h-2v1h-2zm0 1h4v1h2v4h-2v1H9v-1H7V9h2z' },
  { name: 'C++',     color: '#00599C', path: 'M10.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96C1.56 15.77 1 14.16 1 12.21c.05-2.31.72-4.08 2-5.32C4.32 5.64 5.96 5 7.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.96-.44c-.4-.01-.83.06-1.28.19-.31.09-.6.25-.87.49-.27.23-.49.54-.66.91-.17.38-.26.86-.26 1.45.01.58.1 1.09.28 1.51.18.42.41.77.69 1.04s.59.46.94.58.72.18 1.1.17c.42-.01.81-.05 1.17-.12.35-.08.64-.17.87-.29zM23 11h-2V9h-2v2h-2v2h2v2h2v-2h2z' },
  { name: 'Git',     color: '#F05032', path: 'M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 0 1 1.9 3.039 1.837 1.837 0 0 1-2.596 0 1.846 1.846 0 0 1-.404-1.996L12.86 8.955v6.525c.176.086.342.203.48.346a1.846 1.846 0 0 1 0 2.6 1.838 1.838 0 0 1-2.6 0 1.846 1.846 0 0 1 0-2.6c.15-.154.33-.277.536-.361V8.904a1.847 1.847 0 0 1-.997-2.416L7.559 3.782.454 10.887a1.55 1.55 0 0 0 0 2.188l10.48 10.478a1.55 1.55 0 0 0 2.187 0l10.425-10.424a1.55 1.55 0 0 0 0-2.199' },
  { name: 'GitHub',  color: '#aaa', path: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z' },
  { name: 'VS Code', color: '#007ACC', path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.5v-15a1.5 1.5 0 0 0-.85-1.413zm-5.406 16.329l-6.078-5.581L16.5 10.7v6.9l1.244.916z' },
  { name: 'OpenCV',  color: '#5C3EE8', path: 'M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z' },
  { name: 'Blynk',   color: '#00E5FF', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' },
  { name: 'Kali',    color: '#268BEE', path: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' },
  { name: 'ADO.NET', color: '#7B2FBE', path: 'M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 3h2v5.5l3.9 2.3-.9 1.7-4-2.4V7z' },
  { name: 'Crossfire', color: '#FF6B35', path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
];

const ProjectsPage = () => {
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const { activeTab: pathTab } = useParams();
  const activeTab = pathTab || 'projects';
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const setActiveTab = (tab) => {
    navigate(`/projects/${tab}`);
  };

  useEffect(() => {
    if (selectedCert) {
      setTimeout(() => {
        const overlay = document.querySelector('.pg-modal-overlay');
        if (overlay) overlay.scrollTop = 0;
      }, 10);
    }
  }, [selectedCert]);

  const tr = lang === 'tr';

  return (
    <>
      <div
        className="pg-root"
        style={{
          color: 'var(--text-primary)'
        }}
      >
        {/* ── Animated circuit background ── */}
        <div className="pg-bg">
          <svg className="pg-bg-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pc-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(239,68,68,0.05)" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pc-grid)" />
            {/* Circuit traces */}
            <line x1="10%" y1="0" x2="10%" y2="100%" stroke="rgba(239,68,68,0.04)" strokeWidth="1" />
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
            <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
            <line x1="90%" y1="0" x2="90%" y2="100%" stroke="rgba(239,68,68,0.04)" strokeWidth="1" />
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
            {/* Diagonal */}
            <line x1="0" y1="0" x2="40%" y2="60%" stroke="rgba(239,68,68,0.03)" strokeWidth="1.5" />
            <line x1="100%" y1="0" x2="60%" y2="80%" stroke="rgba(239,68,68,0.03)" strokeWidth="1.5" />
          </svg>
          <div className="pg-glow-tr" />
          <div className="pg-glow-bl" />
        </div>

        {/* ── Top accent line ── */}
        <div className="pg-topline" />


        {/* ── Header ── */}
        <header className="pg-header">
          <button className="pg-backbtn" onClick={() => navigate('/')}>
            <ArrowLeft size={15} />
            <span>{tr ? 'Geri Dön' : 'Go Back'}</span>
          </button>

          <div className="pg-tabs">
            <button
              className={`pg-tab${activeTab === 'projects' ? ' pg-tab-active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <Code size={13} />
              {tr ? 'Projelerim' : 'My Projects'}
            </button>
            <button
              className={`pg-tab${activeTab === 'tech' ? ' pg-tab-active' : ''}`}
              onClick={() => setActiveTab('tech')}
            >
              <Box size={13} />
              {tr ? 'Teknolojiler' : 'Tech Stack'}
            </button>
            <button
              className={`pg-tab${activeTab === 'certs' ? ' pg-tab-active' : ''}`}
              onClick={() => setActiveTab('certs')}
            >
              <Award size={13} />
              {tr ? 'Sertifikalar' : 'Certificates'}
            </button>
          </div>

          <div className="pg-header-right">
            <span className="pg-live-dot" />
            <span className="pg-live-text">PORTFOLIO</span>
          </div>
        </header>

        {/* ── Divider ── */}
        <div className="pg-divider" />

        {/* ═══ PROJECTS TAB ═══ */}
        {activeTab === 'projects' && (
          <div className="pg-content">
            <div className="pg-section-intro">
              <div className="pg-pill">
                <Code size={11} />
                {tr ? 'Projeler' : 'Projects'}
              </div>
              <h1 className="pg-section-title">{tr ? 'Projelerim' : 'My Projects'}</h1>
              <p className="pg-section-sub">{tr ? 'Geliştirdiğim açık kaynak projeler' : 'Open-source projects I built'}</p>
            </div>

            <div className="pg-proj-grid">
              {projects.map((proj, i) => (
                <div
                  key={proj.id}
                  className="pg-proj-card-premium"
                  style={{ '--accent': proj.accent, animationDelay: `${i * 0.12}s` }}
                >
                  <div className="pg-proj-visual">
                    <div className="pg-proj-glow-premium" style={{ background: `radial-gradient(circle at 30% 30%, ${proj.accent}44 0%, transparent 70%)` }} />
                    <div className="pg-proj-pattern" />
                    <div className="pg-proj-icon-premium" style={{ background: `${proj.accent}15`, borderColor: `${proj.accent}40` }}>
                      <proj.icon size={28} style={{ color: proj.accent }} />
                    </div>
                  </div>

                  <div className="pg-proj-info-premium">
                    <div className="pg-proj-header-premium">
                      <h3 className="pg-proj-title">{lang === 'tr' ? proj.titleTr : proj.titleEn}</h3>
                      <div className="pg-proj-status">
                        <div className="pg-proj-status-dot" style={{ background: proj.accent }} />
                        <span>LIVE</span>
                      </div>
                    </div>

                    <p className="pg-proj-desc">{lang === 'tr' ? proj.descTr : proj.descEn}</p>

                    <div className="pg-proj-techs-premium">
                      {proj.techs.map((t, ti) => (
                        <div key={ti} className="pg-proj-tech-item" title={t.name}>
                          <div className="pg-proj-tech-dot" style={{ background: t.color }} />
                          <span>{t.name}</span>
                        </div>
                      ))}
                    </div>

                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="pg-proj-link-premium">
                      <div className="pg-proj-link-bg" style={{ background: proj.accent }} />
                      <Github size={16} />
                      <span>{tr ? 'Kodu İncele' : 'View Code'}</span>
                      <ArrowLeft size={14} style={{ transform: 'rotate(180deg)', marginLeft: 'auto' }} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TECH STACK TAB ═══ */}
        {activeTab === 'tech' && (
          <div className="pg-content">
            <div className="pg-section-intro">
              <div className="pg-pill">
                <Box size={11} />
                {tr ? 'Teknoloji Yığını' : 'Tech Stack'}
              </div>
              <h1 className="pg-section-title">{tr ? 'Kullandığım Teknolojiler' : 'Technologies I Use'}</h1>
              <p className="pg-section-sub">{tr ? 'Aktif olarak kullandığım araçlar ve platformlar' : 'Tools and platforms I actively use'}</p>
            </div>

            <div className="pg-tech-grid-premium">
              {techs.map((tech, i) => (
                <div
                  key={i}
                  className="pg-tech-card-premium"
                  style={{ '--tc': tech.color, animationDelay: `${i * 0.04}s` }}
                >
                  <div className="pg-tech-body">
                    <div className="pg-tech-icon-box">
                      <svg viewBox="0 0 24 24" fill={tech.color} className="pg-tech-svg-premium">
                        <path d={tech.path} />
                      </svg>
                      <div className="pg-tech-glow" style={{ backgroundColor: tech.color }} />
                    </div>
                    <div className="pg-tech-info-box">
                      <span className="pg-tech-name-premium">{tech.name}</span>
                      <div className="pg-tech-progress">
                        <div className="pg-tech-progress-bar" style={{ backgroundColor: tech.color, width: '100%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="pg-tech-decoration" style={{ borderColor: `${tech.color}40` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CERTIFICATES TAB ═══ */}
        {activeTab === 'certs' && (
          <div className="pg-content">
            <div className="pg-section-intro">
              <div className="pg-pill">
                <Award size={11} />
                {tr ? 'Sertifikalar' : 'Certificates'}
              </div>
              <h1 className="pg-section-title">{tr ? 'Sertifikalarım' : 'My Certificates'}</h1>
              <p className="pg-section-sub">{tr ? 'Kazandığım resmi sertifikalar ve eğitimler' : 'Official certificates and trainings I have earned'}</p>
            </div>

            <div className="pg-cert-grid">
              {certificates.map((cert, i) => (
                <div
                  key={cert.id}
                  className="pg-cert-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="pg-cert-img-wrap">
                    <img src={cert.image} alt={tr ? cert.titleTr : cert.titleEn} className="pg-cert-img" />
                    <div className="pg-cert-overlay">
                      <ExternalLink size={20} />
                      <span>{tr ? 'Görüntüle' : 'View'}</span>
                    </div>
                  </div>
                  <div className="pg-cert-info">
                    <h3 className="pg-cert-title">{tr ? cert.titleTr : cert.titleEn}</h3>
                    <p className="pg-cert-issuer">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Scan Section */}
            <div className="pg-cert-qr-wrap" style={{ 
              marginTop: '60px', 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '15px',
              opacity: 0,
              animation: 'fadeUp 0.8s ease forwards 0.4s'
            }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                position: 'relative'
              }}>
                <img 
                  src={`${import.meta.env.BASE_URL}qrcode_globallycheck.com.png`} 
                  alt="QR Scan" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(1.2) contrast(1.1)' }} 
                />
                <div className="pg-qr-corner pg-qr-tl" />
                <div className="pg-qr-corner pg-qr-tr" />
                <div className="pg-qr-corner pg-qr-bl" />
                <div className="pg-qr-corner pg-qr-br" />
              </div>
              <p style={{ 
                fontFamily: 'Space Mono, monospace', 
                fontSize: '11px', 
                color: '#888', 
                letterSpacing: '0.1em' 
              }}>
                {tr ? '[ TALENTCODERS DOĞRULAMAK İÇİN TARA ]' : '[ SCAN TO VERIFY TALENTCODERS ]'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ LIGHTBOX MODAL (Moved Outside pg-root to fix fixed positioning) ═══ */}
    {selectedCert && createPortal(
      <div className="pg-modal-overlay" onClick={() => setSelectedCert(null)}>
        <button className="pg-modal-close" onClick={() => setSelectedCert(null)}>
          <X size={24} />
        </button>
        
        <div className="pg-modal-content" onClick={e => e.stopPropagation()}>
          <div className="pg-modal-img-container">
            <img src={selectedCert.image} alt={tr ? selectedCert.titleTr : selectedCert.titleEn} className="pg-modal-img" />
          </div>
          <div className="pg-modal-info">
            <h2 className="pg-modal-title">{tr ? selectedCert.titleTr : selectedCert.titleEn}</h2>
            <p className="pg-modal-text">{selectedCert.issuer} — {selectedCert.date}</p>
            
            <div className="pg-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedCert.subItems ? (
                selectedCert.subItems.map((sub, si) => (
                  <a 
                    key={si}
                    href={`${import.meta.env.BASE_URL}${sub.pdf}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pg-modal-btn"
                  >
                    <ExternalLink size={14} />
                    <span>{tr ? sub.labelTr : sub.labelEn}</span>
                  </a>
                ))
              ) : (
                <a 
                  href={`${import.meta.env.BASE_URL}${selectedCert.pdf || selectedCert.image}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="pg-modal-btn"
                >
                  <ExternalLink size={14} />
                  <span>{tr ? 'Tam Boyut PDF / Resim' : 'Full Size PDF / Image'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default ProjectsPage;
