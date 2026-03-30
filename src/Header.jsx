import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
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

const Header = ({ lang, setLang, darkMode, setDarkMode }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Force visible background on sub-pages
    const isSubPage = pathname !== '/';
    const headerClass = `header${(scrolled || isSubPage) ? ' header-scrolled' : ''}${isMenuOpen ? ' header-menu-open' : ''}`;

    return (
        <header className={headerClass}>
            <div className="header-inner">
                {/* Logo */}
                <Link to="/" className="logo-link" onClick={() => setIsMenuOpen(false)}>
                    <div className="custom-logo">
                        <div className="badge-wrapper">
                            <svg viewBox="0 0 100 100" className="badge-svg">
                                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="var(--accent-dim)" />
                                <polygon points="50,15 85,32.5 85,67.5 50,85 15,67.5 15,32.5"
                                    fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" />
                                <g transform="translate(25,35) scale(1.1)" fill="var(--accent)">
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
                </Link>

                {/* Nav links */}
                <nav className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
                    <NavLink to="/projects" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
                        {lang === 'tr' ? 'Projeler' : 'Projects'}
                        <span className="nav-underline" />
                    </NavLink>
                    <NavLink to="/about" className="nav-btn" onClick={() => setIsMenuOpen(false)}>
                        {lang === 'tr' ? 'Hakkımda' : 'About Me'}
                        <span className="nav-underline" />
                    </NavLink>
                    <NavLink to="/contact" className="nav-btn nav-btn-special" onClick={() => setIsMenuOpen(false)}>
                        {lang === 'tr' ? 'Mesaj Gönder' : 'Join Chat'}
                        <ArrowRight size={14} className="ml-2" />
                    </NavLink>
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
