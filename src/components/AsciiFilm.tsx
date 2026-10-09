import { useEffect, useRef } from "preact/hooks";
import { FILMS, brailleDots } from "../art/films";
import { reducedMotion } from "../lib/motion";

const TONE_VARS = ["--line-2", "--dim", "--ink", "--green", "--amber", "--red", "--blue", "--violet"];
const FPS = 15;

/** Plays one of the shared ASCII films on a canvas: live while on screen, the poster frame otherwise. */
export function AsciiFilm({ id, label }: { id: keyof typeof FILMS; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const film = FILMS[id];
    const el = box.current!, canvas = cv.current!, ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = reducedMotion();
    let tones: string[] = [], cw = 0, ch = 0, fs = 0, raf = 0, visible = false, alive = true, t0 = 0, lastDraw = -1;
    const read = () => { const cs = getComputedStyle(document.documentElement); tones = TONE_VARS.map((v) => cs.getPropertyValue(v).trim()); };
    const size = () => {
      const w = el.clientWidth;
      fs = w / (film.cols * 0.6);
      cw = fs * 0.6; ch = fs * 1.22;
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(ch * film.rows * dpr);
      canvas.style.height = `${ch * film.rows}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      const f = film.render(t);
      ctx.clearRect(0, 0, cw * f.cols, ch * f.rows);
      ctx.font = `${fs}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "middle";
      const dot = Math.max(1, fs * 0.16);
      for (let y = 0; y < f.rows; y++) for (let x = 0; x < f.cols; x++) {
        const i = y * f.cols + x, c = f.chars[i];
        if (c === " ") continue;
        ctx.fillStyle = tones[f.tones[i]];
        const dots = brailleDots(c);
        if (dots) for (const [dx, dy] of dots) ctx.fillRect(x * cw + (dx + 0.5) * cw / 2 - dot / 2, y * ch + (dy + 0.5) * ch / 4 - dot / 2, dot, dot);
        else ctx.fillText(c, x * cw, y * ch + ch / 2);
      }
      const p = (t % film.seconds) / film.seconds;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (clock.current) clock.current.textContent = `${(t % film.seconds).toFixed(1).padStart(4, "0")}s`;
    };
    const loop = (now: number) => {
      if (!alive) return;
      if (!t0) t0 = now - film.poster * film.seconds * 1000;
      const t = (now - t0) / 1000, k = Math.floor(t * FPS);
      if (k !== lastDraw) { lastDraw = k; draw(k / FPS); }
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => { if (!raf && visible && !still && alive) raf = requestAnimationFrame(loop); };
    const poster = () => draw(film.poster * film.seconds);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { threshold: 0.05 });
    const ro = new ResizeObserver(() => { size(); poster(); lastDraw = -1; });
    const mo = new MutationObserver(() => { read(); poster(); lastDraw = -1; });
    const mq = matchMedia("(prefers-color-scheme: light)");
    const onScheme = () => { read(); poster(); lastDraw = -1; };
    document.fonts.load(`16px "JetBrains Mono"`).catch(() => undefined).then(() => {
      if (!alive) return;
      read(); size(); poster();
      io.observe(el); ro.observe(el);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      mq.addEventListener("change", onScheme);
      document.addEventListener("visibilitychange", wake);
    });
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect(); mq.removeEventListener("change", onScheme); document.removeEventListener("visibilitychange", wake); };
  }, [id]);

  return (
    <div class="film-screen" ref={box}>
      <canvas ref={cv} role="img" aria-label={label} />
      <div class="film-progress" aria-hidden="true"><span ref={bar} /></div>
      <span class="film-clock" ref={clock} aria-hidden="true" />
    </div>
  );
}
