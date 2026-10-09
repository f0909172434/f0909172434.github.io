import { useEffect, useRef, useState } from "preact/hooks";

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Calls `onEnter` once, the first time the element is at least `threshold` visible. */
export function useEnter<T extends Element>(onEnter: () => void, threshold = 0) {
  const ref = useRef<T>(null);
  const cb = useRef(onEnter);
  cb.current = onEnter;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); cb.current(); }
    }, { threshold, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Types `full` once `run` turns true, driven by elapsed time (so throttled timers cannot slow it down).
 * Server render and reduced motion get the whole string; on the client the command starts empty.
 */
export function useTyped(full: string, run: boolean, perChar = 22) {
  const [n, setN] = useState(full.length);
  const armed = useRef(false);
  useEffect(() => {
    if (reducedMotion()) return;
    armed.current = true;
    setN(0);
  }, []);
  useEffect(() => {
    if (!run || !armed.current) { if (run) setN(full.length); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(full.length, Math.floor((now - t0) / perChar));
      setN(k);
      if (k < full.length) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, full]);
  return { text: full.slice(0, n), done: n >= full.length, ms: full.length * perChar };
}
