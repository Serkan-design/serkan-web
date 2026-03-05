import { useState, useEffect } from 'react';

const Preloader = ({ onDone }) => {
    const [out, setOut] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setOut(true), 1900);
        const t2 = setTimeout(() => onDone(), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onDone]);

    return (
        <div className={`preloader${out ? ' preloader-out' : ''}`}>
            <div className="preloader-content">
                {/* Animated hexagon logo */}
                <div className="preloader-logo-wrap">
                    <svg viewBox="0 0 100 100" className="preloader-svg">
                        <polygon
                            points="50,12 88,32 88,68 50,88 12,68 12,32"
                            fill="none"
                            stroke="#c29b40"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            className="preloader-hex"
                        />
                        <path
                            d="M30 45 L45 45 L48 35 L52 35 L55 45 L70 45 L70 50 L55 50 L52 60 L48 60 L45 50 L30 50 Z"
                            fill="#c29b40"
                            className="preloader-mark"
                        />
                    </svg>
                    <div className="preloader-ring" />
                </div>

                {/* Brand name */}
                <div className="preloader-brand">
                    <span className="preloader-brand-text">SI</span>
                    <span className="preloader-brand-dot">.</span>
                    <span className="preloader-brand-text">TECH</span>
                </div>

                {/* Loading bar */}
                <div className="preloader-bar-wrap">
                    <div className="preloader-bar-fill" />
                </div>

                {/* Status */}
                <p className="preloader-status">INITIALIZING</p>
            </div>
        </div>
    );
};

export default Preloader;
