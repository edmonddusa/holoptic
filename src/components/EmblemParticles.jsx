import { useEffect, useRef } from "react";

// The emblem as a cloud of gold dots. They gather into the logo when it
// scrolls into view and scatter away from the cursor.
const SIZE = 260; // drawn size in CSS pixels
const TONES = ["#a57939", "#c9a46b", "#f6d68f"];

// Load the emblem SVG with an explicit size so every browser can rasterize it.
async function loadEmblem(size) {
  const text = await (await fetch("/images/holoptic-algiz.svg")).text();
  const sized = text.replace("<svg ", `<svg width="${size}" height="${size}" `);
  const url = URL.createObjectURL(new Blob([sized], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function EmblemParticles({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer = { x: -1e4, y: -1e4 };
    let particles = [];
    let raf = 0;
    let visible = false;
    let cancelled = false;
    let last = performance.now();
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      for (let tone = 0; tone < TONES.length; tone++) {
        ctx.fillStyle = TONES[tone];
        for (const p of particles) {
          if (p.tone === tone) ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
        }
      }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50) / 16.7;
      last = now;
      if (!visible) return;
      time += dt / 60;
      for (const p of particles) {
        const hx = p.tx + Math.sin(time * 0.9 + p.seed) * 0.5;
        const hy = p.ty + Math.cos(time * 0.8 + p.seed) * 0.5;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1600) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d2 / 1600) * 2.4 * dt;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
        p.vx = (p.vx + (hx - p.x) * 0.03 * dt) * 0.88;
        p.vy = (p.vy + (hy - p.y) * 0.03 * dt) * 0.88;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      draw();
    };

    loadEmblem(200).then((img) => {
      if (cancelled) return;
      const off = document.createElement("canvas");
      off.width = off.height = 200;
      const o = off.getContext("2d");
      o.drawImage(img, 0, 0, 200, 200);
      const data = o.getImageData(0, 0, 200, 200).data;
      const scale = (SIZE - 20) / 200;
      for (let y = 0; y < 200; y += 2) {
        for (let x = 0; x < 200; x += 2) {
          const i = (y * 200 + x) * 4;
          if (data[i + 3] < 110) continue;
          const light = data[i] + data[i + 1] + data[i + 2];
          const angle = Math.random() * Math.PI * 2;
          const radius = SIZE * (0.45 + Math.random() * 0.4);
          particles.push({
            tx: 10 + x * scale,
            ty: 10 + y * scale,
            x: reduced ? 10 + x * scale : SIZE / 2 + Math.cos(angle) * radius,
            y: reduced ? 10 + y * scale : SIZE / 2 + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            seed: Math.random() * Math.PI * 2,
            tone: light > 600 ? 2 : light > 470 ? 1 : 0,
          });
        }
      }
      if (reduced) draw();
      else raf = requestAnimationFrame(frame);
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    io.observe(canvas);

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - b.left) / b.width) * SIZE;
      pointer.y = ((e.clientY - b.top) / b.height) * SIZE;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e4;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
