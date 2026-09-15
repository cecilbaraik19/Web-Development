import React, { useRef, useEffect } from 'react';

export default function MatrixRain({ boosted = false }) {
  const canvasRef = useRef(null);
  const boostedRef = useRef(boosted);

  useEffect(() => { boostedRef.current = boosted; }, [boosted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, columns, drops;
    const fontSize = 16;
    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF#$%&';
    const colors = ['#22d3ee', '#34d399', '#00ff41', '#00ff41'];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) return () => window.removeEventListener('resize', resize);

    let animationId;
    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      const speedFactor = boostedRef.current ? 1.8 : 1;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = boostedRef.current ? 6 : 2;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += speedFactor;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.16] z-0 transition-opacity duration-500"
    />
  );
}