"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Blob {
  x: number;
  y: number;
  radius: number;
  t: number;
  tSpeed: number;
  ampX: number;
  ampY: number;
  color: [number, number, number];
  alpha: number;
}

const N = 127;
const CONNECT_DIST = 130;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
const PUSH_RADIUS = 110;
const PUSH_RADIUS_SQ = PUSH_RADIUS * PUSH_RADIUS;
const GRID_SIZE = 60;

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    setSize();

    /* ── Particles ── */
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.4 + 0.5
    }));

    /* ── Aurora blobs ── */
    const blobs: Blob[] = [
      {
        x: W * 0.18, y: H * 0.18,
        radius: Math.min(W, H) * 0.55,
        t: 0, tSpeed: 0.00028,
        ampX: W * 0.22, ampY: H * 0.18,
        color: [185, 28, 28], alpha: 0.13
      },
      {
        x: W * 0.82, y: H * 0.72,
        radius: Math.min(W, H) * 0.42,
        t: 2.1, tSpeed: 0.00018,
        ampX: W * 0.18, ampY: H * 0.22,
        color: [245, 158, 11], alpha: 0.07
      },
      {
        x: W * 0.55, y: H * 0.45,
        radius: Math.min(W, H) * 0.35,
        t: 4.4, tSpeed: 0.00022,
        ampX: W * 0.25, ampY: H * 0.25,
        color: [109, 40, 217], alpha: 0.05
      }
    ];

    /* ── Origin centers for blob drift ── */
    const origins = blobs.map((b) => ({ x: b.x, y: b.y }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* ── Grid ── */
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      /* ── Aurora blobs ── */
      blobs.forEach((b, i) => {
        b.t += b.tSpeed;
        const ox = origins[i].x;
        const oy = origins[i].y;
        b.x = ox + Math.sin(b.t * 1.3) * b.ampX;
        b.y = oy + Math.cos(b.t * 0.9) * b.ampY;

        const [r, g, bv] = b.color;
        const g2 = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        g2.addColorStop(0, `rgba(${r},${g},${bv},${b.alpha})`);
        g2.addColorStop(0.5, `rgba(${r},${g},${bv},${b.alpha * 0.4})`);
        g2.addColorStop(1, `rgba(${r},${g},${bv},0)`);
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      /* ── Cursor spotlight ── */
      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx > -100) {
        const sg = ctx.createRadialGradient(mx, my, 0, mx, my, 240);
        sg.addColorStop(0, "rgba(185,28,28,0.09)");
        sg.addColorStop(0.5, "rgba(185,28,28,0.03)");
        sg.addColorStop(1, "transparent");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(mx, my, 240, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Update particles ── */
      for (let i = 0; i < N; i++) {
        const p = particles[i];

        /* cursor repulsion */
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < PUSH_RADIUS_SQ && d2 > 0) {
          const d = Math.sqrt(d2);
          const force = ((PUSH_RADIUS - d) / PUSH_RADIUS) * 0.12;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        /* damping + random drift */
        p.vx *= 0.965;
        p.vy *= 0.965;
        const spd = p.vx * p.vx + p.vy * p.vy;
        if (spd < 0.01) {
          p.vx += (Math.random() - 0.5) * 0.06;
          p.vy += (Math.random() - 0.5) * 0.06;
        }

        p.x += p.vx;
        p.y += p.vy;

        /* soft boundary wrap */
        if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx); }
        if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy); }
        if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }

        /* draw dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
      }

      /* ── Connection lines ── */
      ctx.lineWidth = 0.7;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_DIST_SQ) {
            const alpha = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.2;
            ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    const onResize = () => {
      setSize();
      /* re-clamp particles */
      particles.forEach((p) => {
        p.x = Math.min(p.x, W);
        p.y = Math.min(p.y, H);
      });
      /* re-center blob origins */
      const scales = [
        [0.18, 0.18], [0.82, 0.72], [0.55, 0.45]
      ];
      scales.forEach(([sx, sy], i) => {
        origins[i].x = W * sx;
        origins[i].y = H * sy;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
