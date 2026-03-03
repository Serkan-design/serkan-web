import React from 'react';
import './Header.css';

const Header = ({ lang, setLang }) => (
    <header className="header">
        <div className="container" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div className="logo-area">
                <a href={import.meta.env.BASE_URL} className="logo-link">
                    <div className="custom-logo">
                        <div className="badge-wrapper">
                            <svg viewBox="0 0 100 100" className="badge-svg">
                                {/* Outer Glow/Shadow Hex */}
                                <polygon
                                    points="50,10 90,30 90,70 50,90 10,70 10,30"
                                    fill="rgba(194, 155, 64, 0.05)"
                                />
                                {/* Main Gold Hexagon Wrapper */}
                                <polygon
                                    points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5"
                                    fill="none"
                                    stroke="#c29b40"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                                {/* Improved Drone/Aviation Icon - More aerodynamic and techy */}
                                <g transform="translate(25, 35) scale(1.1)" fill="#c29b40">
                                    <path d="M0 8 L15 8 L18 2 L32 2 L35 8 L46 8 L46 12 L35 12 L32 18 L18 18 L15 12 L0 12 Z" />
                                    {/* Propeller details */}
                                    <circle cx="20" cy="1" r="1.5" />
                                    <circle cx="30" cy="1" r="1.5" />
                                    <circle cx="20" cy="19" r="1.5" />
                                    <circle cx="30" cy="19" r="1.5" />
                                </g>
                            </svg>
                        </div>
                        <div className="logo-text">
                            SI<span className="dot">.</span>TECH
                        </div>
                    </div>
                </a>
            </div>
            <nav className="navigation flex items-center gap-6">
                <button
                    onClick={() => {
                        const aboutEl = document.getElementById('about');
                        if (aboutEl) aboutEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[12px] font-black uppercase tracking-[0.2em] text-white hover:text-[#c29b40] transition-colors cursor-pointer"
                >
                    {lang === 'tr' ? 'Hakkımda' : 'About Me'}
                </button>
                <div className="w-[1px] h-4 bg-white/20"></div>
                <button
                    onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                    className="text-[12px] font-black uppercase tracking-[0.2em] px-4 py-2 border border-white/20 hover:border-[#c29b40] hover:text-[#c29b40] transition-all text-white rounded-sm cursor-pointer"
                >
                    {lang === 'tr' ? 'EN' : 'TR'}
                </button>
            </nav>
        </div>
    </header>
);

export default Header;
