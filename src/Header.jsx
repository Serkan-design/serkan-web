import React from 'react';
import './Header.css';
import logo from './assets/logo.png';

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo-area">
                <a href="index.html" className="logo-link">
                    <img src={logo} alt="Si.Tech Logo" className="main-logo" />
                </a>
            </div>
            <nav className="navigation">
                {/* Navigation links here if needed */}
            </nav>
        </div>
    </header>
);

export default Header;
