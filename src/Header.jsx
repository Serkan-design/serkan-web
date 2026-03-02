import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    {/* The EXACT Logo - Hexagonal Gold Badge with Drone Design */}
                    <div className="custom-logo">
                        <div className="badge-wrapper">
                            <svg viewBox="0 0 100 80" className="badge-svg">
                                {/* Hexagon with specific orientation */}
                                <polygon
                                    points="50,5 92,25 92,65 50,85 8,65 8,25"
                                    fill="none"
                                    stroke="#c29b40"
                                    strokeWidth="2.5"
                                />
                                {/* Drone Silhouette inside */}
                                <g transform="translate(25, 30) scale(1)" fill="#c29b40">
                                    <path d="M0 10 L15 10 L18 2 L32 2 L35 10 L50 10 L50 15 L35 15 L32 23 L18 23 L15 15 L0 15 Z" />
                                    <rect x="15" y="0" width="20" height="1.5" rx="1" />
                                    <rect x="15" y="24" width="20" height="1.5" rx="1" />
                                </g>
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
