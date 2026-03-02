import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    {/* Refined SVG Logo based on user reference image */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 60"
                        className="main-logo"
                        aria-label="Si.Tech Logo"
                    >
                        {/* Background / Shape Tail (Left) */}
                        <path
                            d="M10 25 L35 25 L40 15 L80 15 L85 25 L160 25 L165 30 L160 35 L85 35 L80 45 L40 45 L35 35 L10 35 Z"
                            fill="none"
                            stroke="#c29b40"
                            strokeWidth="1.5"
                            opacity="0.3"
                        />

                        {/* Main Hexagonal Badge Frame */}
                        <path
                            d="M38 18 L155 18 L165 30 L155 42 L38 42 L28 30 Z"
                            fill="#0c1a2e"
                            stroke="#c29b40"
                            strokeWidth="2.5"
                        />

                        {/* Drone Silhouette on the left side of the badge */}
                        <g transform="translate(10, 20) scale(0.8)" fill="#c29b40">
                            <path d="M0 10 L15 10 L18 2 L35 2 L38 10 L50 10 L50 15 L38 15 L35 23 L18 23 L15 15 L0 15 Z" />
                            {/* Propellers */}
                            <rect x="16" y="0" width="20" height="1.5" rx="1" />
                            <rect x="16" y="24" width="20" height="1.5" rx="1" />
                        </g>

                        {/* SI.TECH Text */}
                        <text
                            x="55"
                            y="36"
                            fontFamily="system-ui, -apple-system, sans-serif"
                            fontWeight="900"
                            fontSize="18"
                            letterSpacing="1.5"
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
