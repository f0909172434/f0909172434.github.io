import { useEffect, useState } from "preact/hooks";
import type { Locale, UI } from "../locale";
import { LOCALES } from "../locale";
import { META } from "../catalog";

export const SECTIONS = ["top", "work", "negatives", "cases", "method", "films", "log", "about"] as const;
export type SectionId = (typeof SECTIONS)[number];
const LANG_LABEL: Record<Locale, string> = { en: "EN", "zh-Hant": "繁", "zh-Hans": "简" };

function useTaipeiClock() {
  const [now, setNow] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit" });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/** tmux-style top bar: the session, one window per section, language, theme, palette, Taipei time. */
export function TopBar({ ui, locale, active, onLocale, onTheme, onPalette }: {
  ui: UI; locale: Locale; active: SectionId; onLocale: (l: Locale) => void; onTheme: () => void; onPalette: () => void;
}) {
  const clock = useTaipeiClock();
  return (
    <header class="bar">
      <a class="bar-session" href="#top" aria-label="Chih-Kai Wang">[ckw]</a>
      <nav class="bar-wins" aria-label={ui.nav.main}>
        {SECTIONS.map((s, i) => (
          <a key={s} href={`#${s}`} class={active === s ? "on" : undefined} aria-current={active === s ? "location" : undefined}>
            <span class="n">{i}</span>{ui.nav[s]}{active === s && <span class="star" aria-hidden="true">*</span>}
          </a>
        ))}
      </nav>
      <div class="bar-right">
        <div class="bar-lang" role="group" aria-label={ui.nav.language} data-needs-js>
          {LOCALES.map((l) => (
            <button type="button" key={l} lang={l} aria-pressed={l === locale} onClick={() => onLocale(l)}>{LANG_LABEL[l]}</button>
          ))}
        </div>
        <button type="button" class="bar-btn" onClick={onTheme} aria-label={ui.nav.theme} title={ui.nav.theme} data-needs-js>◐</button>
        <button type="button" class="bar-btn bar-k" onClick={onPalette} aria-label={ui.nav.palette} title={ui.nav.palette} data-needs-js>/</button>
        <span class="bar-clock" aria-label="Taipei time">{clock} <span class="dim">TPE</span></span>
      </div>
    </header>
  );
}

/** vim-style status line: mode, where you are, the catalog it was rendered from, how far down you are. */
export function StatusLine({ ui, locale, active, mode }: { ui: UI; locale: Locale; active: SectionId; mode: "normal" | "command" }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setPct(max > 0 ? Math.round((scrollY / max) * 100) : 0);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);
  const path = active === "top" ? "~" : `~/${active}`;
  return (
    <div class={`status mode-${mode}`} aria-hidden="true">
      <span class="status-mode">{mode === "normal" ? ui.status.normal : ui.status.command}</span>
      <span class="status-path">{path}</span>
      <span class="status-file">{ui.status.catalog} <span class="dim">@</span> {META.sha256.slice(0, 7)}</span>
      <span class="status-sp" />
      <span class="status-cell hide-s">utf-8</span>
      <span class="status-cell">{locale}</span>
      <span class="status-pct">{pct === 0 ? "Top" : pct === 100 ? "Bot" : `${pct}%`}</span>
    </div>
  );
}
