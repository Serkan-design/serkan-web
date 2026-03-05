import { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const ringRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const ring = ringRef.current;
        const dot = dotRef.current;
        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;
        let raf;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        };

        const onDown = (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;`;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        };

        const animate = () => {
            curX += (mouseX - curX) * 0.11;
            curY += (mouseY - curY) * 0.11;
            ring.style.left = curX + 'px';
            ring.style.top = curY + 'px';
            raf = requestAnimationFrame(animate);
        };

        const onEnter = () => ring.classList.add('cursor-hover');
        const onLeave = () => ring.classList.remove('cursor-hover');

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mousedown', onDown);
        raf = requestAnimationFrame(animate);

        const addHover = () => {
            document.querySelectorAll('a,button,.slider-dot').forEach(el => {
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        };
        addHover();
        const obs = new MutationObserver(addHover);
        obs.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mousedown', onDown);
            cancelAnimationFrame(raf);
            obs.disconnect();
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className="custom-cursor-ring" />
            <div ref={dotRef} className="custom-cursor-dot" />
        </>
    );
};

export default CustomCursor;
