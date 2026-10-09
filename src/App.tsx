import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { detectLocale, uiFor, type Locale } from "./locale";
import { catalogFor } from "./catalog";
import { Hero } from "./components/Hero";
import { Ledger, type Filter } from "./components/Ledger";
import { Negatives } from "./components/Negatives";
import { CaseStudies } from "./components/CaseStudies";
import { Method } from "./components/Method";
import { Films } from "./components/Films";
import { Log } from "./components/Log";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { SECTIONS, StatusLine, TopBar, type SectionId } from "./components/Chrome";
import { Palette } from "./components/Palette";

type Theme = "dark" | "light" | "auto";
const THEME_KEY = "ckw-theme";
function applyTheme(t: Theme) {
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try { t === "auto" ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, t); } catch { /* storage may be unavailable */ }
}
const effectiveTheme = (): "dark" | "light" =>
  (document.documentElement.dataset.theme as "dark" | "light" | undefined) ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");     // prerendered HTML is English; detection runs after hydration
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<SectionId>("top");
  const [palette, setPalette] = useState(false);
  const ui = uiFor(locale);
  const catalog = catalogFor(locale);
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  useEffect(() => {
    setLocale(detectLocale());
    setReady(true);
    const id = location.hash.slice(1);       // the locale switch reflows the page; land on the linked section afterwards
    if ((SECTIONS as readonly string[]).includes(id)) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 80);
    try { const t = localStorage.getItem(THEME_KEY); if (t === "dark" || t === "light") applyTheme(t); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.title = ui.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", ui.meta.description);
    const url = new URL(location.href);
    url.searchParams.set("lang", locale);
    history.replaceState(null, "", url);
  }, [locale, ready]);

  // Which section is under the reading line (35% down the viewport).
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let cur: SectionId = "top";
        for (const id of SECTIONS) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.35) cur = id; }
        setActive(cur);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const go = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `${location.search}#${id}`);
  }, []);
  const openRecord = useCallback((s: string) => { setFilter("all"); location.hash = `rec-${s}`; }, []);
  const toggleTheme = useCallback(() => applyTheme(effectiveTheme() === "dark" ? "light" : "dark"), []);

  // Keyboard: / or ⌘K opens the palette; j/k move between sections; t switches theme.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((v) => !v); return; }
      if (typing || paletteRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/" || e.key === ":") { e.preventDefault(); setPalette(true); }
      else if (e.key === "j" || e.key === "k") {
        const tops = SECTIONS.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? 0);
        let here = 0;
        tops.forEach((top, i) => { if (top <= 60) here = i; });
        const next = e.key === "j" ? Math.min(SECTIONS.length - 1, here + 1) : tops[here] < -60 ? here : Math.max(0, here - 1);
        go(SECTIONS[next]);
      } else if (e.key === "t") toggleTheme();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [go, toggleTheme]);

  return (
    <>
      <a class="skip-link" href="#work">{ui.nav.skip}</a>
      <TopBar ui={ui} locale={locale} active={active} onLocale={setLocale} onTheme={toggleTheme} onPalette={() => setPalette(true)} />
      <main>
        <Hero ui={ui} locale={locale} catalog={catalog} />
        <Ledger ui={ui} locale={locale} catalog={catalog} filter={filter} onFilter={setFilter} />
        <Negatives ui={ui} locale={locale} catalog={catalog} />
        <CaseStudies ui={ui} locale={locale} catalog={catalog} />
        <Method ui={ui} locale={locale} catalog={catalog} />
        <Films ui={ui} locale={locale} catalog={catalog} />
        <Log ui={ui} locale={locale} catalog={catalog} />
        <About ui={ui} locale={locale} catalog={catalog} />
      </main>
      <Footer ui={ui} />
      <StatusLine ui={ui} locale={locale} active={active} mode={palette ? "command" : "normal"} />
      <Palette ui={ui} catalog={catalog} open={palette} onClose={() => setPalette(false)}
        act={{ go, filter: setFilter, open: openRecord, lang: setLocale, theme: applyTheme }} />
    </>
  );
}
