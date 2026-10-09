import { useEffect, useRef, useState } from "preact/hooks";
import { reducedMotion } from "../lib/motion";

interface Dot { x: number; y: number; arrive: number; ox: number; oy: number; flash: number }

/**
 * The name, rasterised from the actual font into a dot matrix. Dots decode in behind a scan head,
 * idle with a faint sparkle, and lean away from the pointer. The heading text stays in the DOM.
 */
export function DotName({ wide, narrow, label }: { wide: string[]; narrow: string[]; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current!, cv = canvas.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const still = reducedMotion();
    let dots: Dot[] = [], grid: Uint8Array = new Uint8Array(0), C = 0, R = 0, pitch = 6, W = 0;
    let raf = 0, last = 0, start = 0, visible = true, alive = true;
    const pointer = { x: -1e6, y: -1e6 };
    const col = { ink: "#fff", faint: "#444", green: "#0f0" };
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      col.ink = cs.getPropertyValue("--ink").trim();
      col.faint = cs.getPropertyValue("--line-2").trim();
      col.green = cs.getPropertyValue("--green").trim();
    };

    const layout = () => {
      W = el.clientWidth;
      if (!W) return;
      const lines = W < 700 ? narrow : wide;
      pitch = W < 700 ? Math.max(4, W / 78) : Math.min(8, Math.max(5.5, W / 168));
      C = Math.floor(W / pitch);
      const off = document.createElement("canvas");
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.font = `800 100px "JetBrains Mono"`;
      const w100 = Math.max(...lines.map((l) => o.measureText(l).width));
      const fs = Math.floor((100 * (C - 1)) / w100);
      o.font = `800 ${fs}px "JetBrains Mono"`;
      const cap = Math.ceil(o.measureText("H").actualBoundingBoxAscent);
      const lineH = Math.round(cap * 1.45);
      R = cap + (lines.length - 1) * lineH + 2;
      off.width = C; off.height = R;
      o.font = `800 ${fs}px "JetBrains Mono"`;
      o.fillStyle = "#000";
      lines.forEach((l, i) => o.fillText(l, 0, 1 + cap + i * lineH));
      const data = o.getImageData(0, 0, C, R).data;
      grid = new Uint8Array(C * R);
      const next: Dot[] = [];
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
        if (data[(y * C + x) * 4 + 3] < 120) continue;
        grid[y * C + x] = 1;
        next.push({ x, y, arrive: 0.2 + (x / C) * 1.15 + Math.random() * 0.28, ox: 0, oy: 0, flash: 0 });
      }
      dots = next;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(C * pitch * dpr);
      cv.height = Math.round(R * pitch * dpr);
      cv.style.width = `${C * pitch}px`;
      cv.style.height = `${R * pitch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, C * pitch, R * pitch);
      const s0 = Math.max(1, pitch * 0.17), s1 = pitch * 0.64, h = pitch / 2;
      ctx.fillStyle = col.faint;
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
        if (!grid[y * C + x]) ctx.fillRect(x * pitch + h - s0 / 2, y * pitch + h - s0 / 2, s0, s0);
      }
      const reach = pitch * 9;
      if (!still && Math.random() < 0.09 && dots.length) dots[(Math.random() * dots.length) | 0].flash = 1;
      for (const d of dots) {
        const age = t - d.arrive;
        const cx = d.x * pitch + h, cy = d.y * pitch + h;
        if (age < 0) {
          if (age > -0.5 && Math.random() < 0.3) { ctx.fillStyle = col.green; ctx.globalAlpha = 0.55; ctx.fillRect(cx - s0, cy - s0, s0 * 2, s0 * 2); ctx.globalAlpha = 1; }
          else { ctx.fillStyle = col.faint; ctx.fillRect(cx - s0 / 2, cy - s0 / 2, s0, s0); }
          continue;
        }
        let tx = 0, ty = 0, near = 0;
        const dx = cx - pointer.x, dy = cy - pointer.y, dist = Math.hypot(dx, dy);
        if (dist < reach && dist > 0.01) {
          near = 1 - dist / reach;
          const push = near * near * pitch * 2.6;
          tx = (dx / dist) * push; ty = (dy / dist) * push;
        }
        d.ox += (tx - d.ox) * Math.min(1, dt * 12);
        d.oy += (ty - d.oy) * Math.min(1, dt * 12);
        d.flash = Math.max(0, d.flash - dt * 1.3);
        const x = cx + d.ox - s1 / 2, y = cy + d.oy - s1 / 2;
        ctx.fillStyle = col.ink;
        ctx.fillRect(x, y, s1, s1);
        const g = Math.max(1 - age / 0.55, d.flash * 0.9, near * 0.95);
        if (g > 0.02) { ctx.globalAlpha = g; ctx.fillStyle = col.green; ctx.fillRect(x, y, s1, s1); ctx.globalAlpha = 1; }
      }
      const scan = (t - 0.2) / 1.15;
      if (scan > 0 && scan < 1.08) {
        const sx = scan * C * pitch;
        const grad = ctx.createLinearGradient(sx - pitch * 14, 0, sx, 0);
        grad.addColorStop(0, "transparent"); grad.addColorStop(1, col.green);
        ctx.globalAlpha = 0.22; ctx.fillStyle = grad; ctx.fillRect(sx - pitch * 14, 0, pitch * 14, R * pitch);
        ctx.globalAlpha = 0.9; ctx.fillStyle = col.green; ctx.fillRect(sx, 0, 1.5, R * pitch); ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      if (!alive) return;
      if (!start) start = now;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      draw((now - start) / 1000, dt);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => { if (!raf && alive && !still) { last = 0; raf = requestAnimationFrame(frame); } };
    const redraw = () => { if (still) draw(99, 0); };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = -1e6; pointer.y = -1e6; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    const ro = new ResizeObserver(() => { const w = el.clientWidth; if (w !== W) { layout(); redraw(); } });
    const mo = new MutationObserver(() => { readColors(); redraw(); });
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onScheme = () => { readColors(); redraw(); };

    document.fonts.load(`800 100px "JetBrains Mono"`).catch(() => undefined).then(() => {
      if (!alive) return;
      readColors();
      layout();
      setReady(true);
      if (still) redraw(); else raf = requestAnimationFrame(frame);
      io.observe(el); ro.observe(el);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      mq.addEventListener("change", onScheme);
      document.addEventListener("visibilitychange", wake);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    });
    return () => {
      alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
      mq.removeEventListener("change", onScheme);
      document.removeEventListener("visibilitychange", wake);
      el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave);
    };
  }, [wide.join("|"), narrow.join("|")]);

  return (
    <div class={`dotname${ready ? " is-ready" : ""}`} ref={wrap}>
      <h1 class="dotname-text">{label}</h1>
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
