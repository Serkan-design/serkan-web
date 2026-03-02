import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    {/* Final Polished SVG Logo - Maximizing similarity to user reference */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 220 60"
                        className="main-logo"
                        aria-label="Si.Tech Logo"
                    >
                        {/* Extended Wing/Tail detail from reference image */}
                        <path
                            d="M5 28 L25 28 L30 15 L70 15 L75 28 L180 28 L185 30 L180 32 L75 32 L70 45 L30 45 L25 32 L5 32 Z"
                            fill="#c29b40"
                            opacity="0.6"
                        />

                        {/* Double-bordered Hexagonal Frame */}
                        <path
                            d="M35 15 L175 15 L187 30 L175 45 L35 45 L23 30 Z"
                            fill="#0c1a2e"
                            stroke="#c29b40"
                            strokeWidth="2.5"
                        />

                        {/* Professional Drone/Plane Icon inside hex */}
                        <g transform="translate(30, 24) scale(0.7)" fill="#ffffff">
                            <path d="M0 8 L12 8 L15 0 L32 0 L35 8 L46 8 L46 12 L35 12 L32 20 L15 20 L12 12 L0 12 Z" />
                        </g>

                        {/* Bold Blocky Text - Industrial Style */}
                        <text
                            x="62"
                            y="37"
                            fontFamily="'Arial Black', 'Inter', sans-serif"
                            fontWeight="900"
                            fontSize="20"
                            letterSpacing="1"
                            fill="#ffffff"
                        >
                            SI<tspan fill="#c29b40">.</tspan>TECH
                        </text>
                    </svg>
                </a>
            </div>
            <nav className="navigation">
                {/* Navigation links */}
            </nav>
        </div>
    </header>
);

export default Header;
