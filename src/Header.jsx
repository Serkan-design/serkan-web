import React from 'react';
import './Header.css';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    <img src="/img/si-tech-logo.png" alt="Si.Tech Logo" className="main-logo" />
                </a>
            </div>
            <nav className="navigation">
                {/* Add navigation links here if needed */}
            </nav>
        </div>
    </header>
);

export default Header;
