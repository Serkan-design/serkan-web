import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';
import { ArrowLeft, Mail, Send, Instagram, Github, CheckCircle, XCircle, Loader2, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMsg.trim()) return;
    setFormStatus('sending');
    const subject = encodeURIComponent(`Portfolio İletişim - ${formName}`);
    const body = encodeURIComponent(`Ad: ${formName}\nEmail: ${formEmail}\n\nMesaj:\n${formMsg}`);
    setTimeout(() => {
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=serkanisik67@gmail.com&su=${subject}&body=${body}`;
      window.open(gmailLink, '_blank');
      setFormStatus('sent');
      setFormName(''); setFormEmail(''); setFormMsg('');
      setTimeout(() => setFormStatus(null), 4000);
    }, 600);
  };

  const tr = lang === 'tr';

  const infos = [
    { 
      icon: Mail, label: 'Email', value: 'serkanisik67@gmail.com', 
      link: `https://mail.google.com/mail/?view=cm&fs=1&to=serkanisik67@gmail.com&su=${encodeURIComponent(tr ? 'Portfolyo Üzerinden İletişim' : 'Contact from Portfolio')}` 
    },
    { icon: MapPin, label: tr ? 'Konum' : 'Location', value: tr ? 'Türkiye' : 'Turkey', link: null },
    { icon: Clock, label: tr ? 'Yanıt Süresi' : 'Response Time', value: tr ? '24 saat içinde' : 'Within 24 hours', link: null },
  ];

  return (
    <div
      className="ct-root"
      style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)'
      }}
    >
      {/* ── Particle-wave background ── */}
      <div className="ct-bg">
        <svg className="ct-bg-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ct-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(239,68,68,0.08)" />
            </pattern>
            <radialGradient id="ct-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="ct-mask">
              <rect width="100%" height="100%" fill="url(#ct-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#ct-dots)" mask="url(#ct-mask)" />
          {/* Wave lines */}
          <path d="M0 60% Q25% 55% 50% 60% T100% 60%" fill="none" stroke="rgba(239,68,68,0.04)" strokeWidth="1.5" />
          <path d="M0 70% Q25% 65% 50% 70% T100% 70%" fill="none" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
          <path d="M0 40% Q35% 35% 65% 40% T100% 38%" fill="none" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
        </svg>
        <div className="ct-glow-tl" />
        <div className="ct-glow-br" />
        {/* Big faded mail icon bg */}
        <div className="ct-bg-icon">✉</div>
      </div>

      <div className="ct-topline" />

      <div style={{ height: '20px' }} />

      {/* ── Main ── */}
      <main className="ct-main">

        {/* ── LEFT: Info + Social ── */}
        <div className="ct-left">
          <div className="ct-left-title-block">
            <h2 className="ct-left-title">
              {tr ? 'Selamlaşalım' : "Let's talk"}
              <span style={{ color: '#ef4444' }}>{tr ? ' 👋' : ' 👋'}</span>
            </h2>
            <p className="ct-left-sub">
              {tr
                ? 'Proje, iş birliği veya her konuda mesaj atabilirsin.'
                : 'Feel free to reach out for projects, collaborations, or anything.'}
            </p>
          </div>

          {/* Info cards */}
          <div className="ct-info-list">
            {infos.map((info, i) => {
              const Content = (
                <>
                  <div className="ct-info-icon">
                    <info.icon size={16} style={{ color: '#ef4444' }} />
                  </div>
                  <div>
                    <p className="ct-info-label">{info.label}</p>
                    <p className={`ct-info-value ${info.link ? 'ct-info-link' : ''}`}>{info.value}</p>
                  </div>
                </>
              );

              if (info.link) {
                return (
                  <a key={i} href={info.link} className="ct-info-card ct-info-card-clickable">
                    {Content}
                  </a>
                );
              }

              return (
                <div key={i} className="ct-info-card">
                  {Content}
                </div>
              );
            })}
          </div>

          {/* Social */}
          <div className="ct-social-row">
            <a href="https://github.com/Serkan-design" target="_blank" rel="noopener noreferrer" className="ct-social-btn ct-social-red">
              <Github size={15} /><span>GitHub</span>
            </a>
            <a href="https://www.instagram.com/sserkan.77/" target="_blank" rel="noopener noreferrer" className="ct-social-btn ct-social-ghost">
              <Instagram size={15} /><span>Instagram</span>
            </a>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=serkanisik67@gmail.com&su=${encodeURIComponent(tr ? 'Portfolyo Üzerinden İletişim' : 'Contact from Portfolio')}`} target="_blank" rel="noopener noreferrer" className="ct-social-btn ct-social-ghost">
              <Mail size={15} /><span>Mail</span>
            </a>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="ct-right">
          <div className="ct-form-card">
            {/* Top shine */}
            <div className="ct-form-topshine" />
            {/* Corner brackets */}
            <div className="ct-form-corner ct-form-corner-tl" />
            <div className="ct-form-corner ct-form-corner-br" />

            <form ref={formRef} onSubmit={handleSubmit} className="ct-form">
              <div className="ct-form-row">
                <div className="ct-field">
                  <label className="ct-label">{tr ? 'Ad Soyad' : 'Full Name'}</label>
                  <input
                    type="text" value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required
                    placeholder={tr ? 'Adınız...' : 'Your name...'}
                    className="ct-input"
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label">{tr ? 'E-Posta' : 'Email'}</label>
                  <input
                    type="email" value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    required
                    placeholder={tr ? 'email@ornek.com' : 'email@example.com'}
                    className="ct-input"
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">{tr ? 'Mesajınız' : 'Your Message'}</label>
                <textarea
                  value={formMsg}
                  onChange={e => setFormMsg(e.target.value)}
                  required rows={6}
                  placeholder={tr ? 'Mesajınızı buraya yazın...' : 'Write your message here...'}
                  className="ct-input ct-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending' || formStatus === 'sent'}
                className="ct-submit"
              >
                {formStatus === 'sending' && <Loader2 size={14} className="animate-spin" />}
                {formStatus === 'sent' && <CheckCircle size={14} />}
                {formStatus === 'error' && <XCircle size={14} />}
                {!formStatus && <Send size={14} />}
                <span>
                  {formStatus === 'sending' ? (tr ? 'GÖNDERİLİYOR...' : 'SENDING...') :
                    formStatus === 'sent' ? (tr ? 'GÖNDERİLDİ ✓' : 'SENT ✓') :
                      tr ? 'MESAJ GÖNDER' : 'SEND MESSAGE'}
                </span>
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ContactPage;
