import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    {/* Inline SVG Logo — hexagonal badge with plane + SI.TECH */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 160 54"
                        className="main-logo"
                        aria-label="Si.Tech Logo"
                    >
                        {/* Hexagonal badge shape */}
                        <polygon
                            points="26,4 46,4 56,20 46,36 26,36 16,20"
                            fill="#0c1a2e"
                            stroke="#c29b40"
                            strokeWidth="2"
                        />
                        {/* Plane icon inside hex */}
                        <g transform="translate(28, 12) scale(0.75)" fill="#c29b40">
                            {/* Simple plane silhouette */}
                            <path d="M2 10 L18 4 L22 8 L10 12 L14 20 L10 18 L8 14 L2 16 Z" />
                        </g>
                        {/* SI.TECH text */}
                        <text
                            x="66"
                            y="25"
                            fontFamily="'Arial Black', Arial, sans-serif"
                            fontWeight="900"
                            fontSize="17"
                            letterSpacing="2"
                            fill="#ffffff"
                        >
                            SI
                            <tspan fill="#c29b40">.</tspan>
                            TECH
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
