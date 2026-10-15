import { useEffect, useRef } from 'react';
import styles from './DotField.module.css';

/*
 * DotField (from the Dotline design system): a grid of --sky-haze dots on
 * --ground that swell and shrink in a slow travelling wave.
 *
 * - Animates by default. With reduced motion on (or animate={false}) it draws
 *   one still frame of square pixels instead.
 * - Pauses while scrolled off-screen and re-reads colours when the theme changes.
 * - With fade on (default) the top quarter stays clear so text can sit there.
 */
export default function DotField({
    children,
    className = '',
    height,
    variant = 'dots',
    animate = true,
    pitch = 8,
    speed = 1,
    fade = true,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d');
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const moving = animate && !reduceMotion;
        const shape = moving ? variant : 'pixels';

        let raf = 0;
        let visible = true;
        let width = 0;
        let heightPx = 0;
        let frame = 0;
        let dotColor = '#8cc8e8';
        let groundColor = '#050505';

        // Colours come from the CSS tokens, so the field follows the theme
        const readColors = () => {
            const cs = getComputedStyle(canvas);
            dotColor = cs.getPropertyValue('--sky-haze').trim() || dotColor;
            groundColor = cs.getPropertyValue('--ground').trim() || groundColor;
        };

        // Match the canvas to its CSS size, sharp on high-DPI screens
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            heightPx = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(heightPx * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // One frame of the wave at time t (seconds)
        const draw = (t) => {
            if (frame++ % 30 === 0) readColors();

            ctx.fillStyle = groundColor;
            ctx.fillRect(0, 0, width, heightPx);
            ctx.fillStyle = dotColor;

            const cols = Math.ceil(width / pitch) + 1;
            const rows = Math.ceil(heightPx / pitch) + 1;
            const maxRadius = pitch * 0.5;

            for (let j = 0; j < rows; j++) {
                const y = j * pitch + pitch / 2;
                // Fade: 0 in the top quarter, rising to 1 by three quarters down
                const f = fade ? Math.min(1, Math.max(0, (y / heightPx - 0.25) / 0.5)) : 1;
                if (f <= 0) continue;

                for (let i = 0; i < cols; i++) {
                    const x = i * pitch + pitch / 2;
                    // Two sine waves combined: a travelling wave that bends as it moves
                    let v = 0.5 + 0.5 * Math.sin(x * 0.035 + t * 1.1 + 2.2 * Math.sin(y * 0.022 + t * 0.5));
                    v = v * v * f;

                    if (shape === 'pixels') {
                        const q = v > 0.55 ? 1 : v > 0.22 ? 0.6 : v > 0.06 ? 0.3 : 0;
                        if (!q) continue;
                        const s = (pitch - 1) * q;
                        ctx.fillRect(x - s / 2, y - s / 2, s, s);
                    } else {
                        const r = maxRadius * v;
                        if (r < 0.35) continue;
                        ctx.beginPath();
                        ctx.arc(x, y, r, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };

        const loop = (ms) => {
            if (visible) draw((ms / 1000) * speed);
            raf = requestAnimationFrame(loop);
        };

        resize();
        readColors();
        draw(1.7);

        const resizeObserver = new ResizeObserver(() => {
            resize();
            draw(1.7);
        });
        resizeObserver.observe(canvas);

        const visibilityObserver = new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
        });
        visibilityObserver.observe(canvas);

        const themeObserver = new MutationObserver(() => {
            readColors();
            if (!moving) draw(1.7);
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        if (moving) raf = requestAnimationFrame(loop);

        // Clean up when the component unmounts or its props change
        return () => {
            cancelAnimationFrame(raf);
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            themeObserver.disconnect();
        };
    }, [variant, animate, pitch, speed, fade]);

    return (
        <section
            className={`${styles.field} ${className}`}
            style={height ? { minHeight: height } : undefined}
        >
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
        </section>
    );
}
