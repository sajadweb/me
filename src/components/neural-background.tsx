'use client';

import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  density?: number;
  color?: string;
};

/**
 * Animated neural-network / genetic-algorithm style background.
 * Nodes drift and connect when close, suggesting an evolving optimization landscape.
 */
export function NeuralBackground({ className = '', density = 70, color = '#22d3ee' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    const dpr = window.devicePixelRatio;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      fitness: number;
      generation: number;
    };

    const count = Math.min(density, Math.floor((width * height) / (40000 * dpr * dpr)) + 30);
    const nodes: Node[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      fitness: Math.random(),
      generation: Math.floor(Math.random() * 6),
    }));

    const maxDist = 140 * dpr;
    let raf = 0;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          // small "mutation"
          n.vx += (Math.random() - 0.5) * 0.01 * dpr;
          n.vy += (Math.random() - 0.5) * 0.01 * dpr;
          n.vx = Math.max(-0.6 * dpr, Math.min(0.6 * dpr, n.vx));
          n.vy = Math.max(-0.6 * dpr, Math.min(0.6 * dpr, n.vy));
        }
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            const hue = (a.fitness + b.fitness) / 2;
            const r = 34 + hue * 105;
            const g = 211 - hue * 60;
            const b2 = 238 + hue * 40;
            ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${Math.min(255, b2) | 0}, ${alpha})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const radius = (1.2 + n.fitness * 1.8) * dpr;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
        grad.addColorStop(0, `rgba(34,211,238,${0.6 + n.fitness * 0.4})`);
        grad.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
