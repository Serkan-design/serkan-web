import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const SunIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const Header = ({ lang, setLang, darkMode, setDarkMode, onAboutOpen, onProjectsOpen, onContactOpen }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu when a link is clicked
    const handleNavClick = (action) => {
        action();
        setIsMenuOpen(false);
    };

    return (
        <header className={`header${scrolled ? ' header-scrolled' : ''}${isMenuOpen ? ' header-menu-open' : ''}`}>
            <div className="header-inner">
                {/* Logo */}
                <a href={import.meta.env.BASE_URL} className="logo-link">
                    <div className="custom-logo">
                        <div className="badge-wrapper">
                            <svg viewBox="0 0 100 100" className="badge-svg">
                                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="rgba(239,68,68,0.05)" />
                                <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5"
                                    fill="none" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" />
                                <g transform="translate(25,35) scale(1.1)" fill="#ef4444">
                                    <path d="M0 8 L15 8 L18 2 L32 2 L35 8 L46 8 L46 12 L35 12 L32 18 L18 18 L15 12 L0 12 Z" />
                                    <circle cx="20" cy="1" r="1.5" />
                                    <circle cx="30" cy="1" r="1.5" />
                                    <circle cx="20" cy="19" r="1.5" />
                                    <circle cx="30" cy="19" r="1.5" />
                                </g>
                            </svg>
                        </div>
                        <div className="logo-text">SI<span className="dot">.</span>TECH</div>
                    </div>
                </a>

                {/* Nav links */}
                <nav className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
                    <button onClick={() => handleNavClick(onAboutOpen)} className="nav-btn">
                        {lang === 'tr' ? 'Hakkımda' : 'About Me'}
                        <span className="nav-underline" />
                    </button>
                    <button onClick={() => handleNavClick(onProjectsOpen)} className="nav-btn">
                        {lang === 'tr' ? 'Projeler' : 'Projects'}
                        <span className="nav-underline" />
                    </button>
                    <button onClick={() => handleNavClick(onContactOpen)} className="nav-btn">
                        {lang === 'tr' ? 'İletişim' : 'Contact'}
                        <span className="nav-underline" />
                    </button>
                </nav>

                {/* Right controls */}
                <div className="header-controls">
                    {/* Lang toggle */}
                    <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="lang-btn">
                        <span>{lang === 'tr' ? 'EN' : 'TR'}</span>
                    </button>

                    {/* Divider */}
                    <div className="ctrl-divider" />

                    {/* Dark mode */}
                    <button
                        id="dark-mode-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                        title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        className={`theme-btn${darkMode ? ' theme-btn-dark' : ''}`}
                    >
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </button>

                    {/* Mobile menu toggle */}
                    <button 
                        className="mobile-menu-btn" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
