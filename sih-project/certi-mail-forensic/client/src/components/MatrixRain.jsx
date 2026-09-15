import React, { useRef, useEffect } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, columns, drops;
    const fontSize = 15;
    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      // Static, dim, non-animated rain for reduced-motion users
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < columns; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, Math.random() * height);
      }
      return () => window.removeEventListener('resize', resize);
    }

    let animationId;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-25 z-0"
    />
  );
}