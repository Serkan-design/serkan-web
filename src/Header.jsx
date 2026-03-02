import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="/" className="logo-link">
                    <div className="custom-logo">
                        <div className="badge-wrapper">
                            <svg viewBox="0 0 100 100" className="badge-svg">
                                {/* Outer Glow/Shadow Hex (Subtle) */}
                                <polygon
                                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                                    fill="rgba(194, 155, 64, 0.1)"
                                />
                                {/* Main Gold Hexagon */}
                                <polygon
                                    points="50,10 90,30 90,70 50,90 10,70 10,30"
                                    fill="none"
                                    stroke="#c29b40"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {/* Drone/Aviation Icon inside */}
                                <path
                                    d="M30 45 L45 45 L48 35 L52 35 L55 45 L70 45 L70 50 L55 50 L52 60 L48 60 L45 50 L30 50 Z"
                                    fill="#c29b40"
                                />
                                {/* Propellers / Details */}
                                <line x1="45" y1="33" x2="55" y2="33" stroke="#c29b40" strokeWidth="2" strokeLinecap="round" />
                                <line x1="45" y1="62" x2="55" y2="62" stroke="#c29b40" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            SI<span className="dot">.</span>TECH
                        </div>
                    </div>
                </a>
            </div>
            <nav className="navigation">
                {/* Nav links */}
            </nav>
        </div>
    </header>
);

export default Header;
