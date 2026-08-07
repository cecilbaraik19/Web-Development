import { useEffect, useState } from 'react';

// Eases a number from 0 to `end` once `started` becomes true
export const useCountUp = (end, started, duration = 1600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    let rafId;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [started, end, duration]);

  return value;
};
