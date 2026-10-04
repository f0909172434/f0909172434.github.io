import type { Locale, UI } from "../locale";
import { LOCALES } from "../locale";

const LABELS: Record<Locale, string> = { en: "EN", "zh-Hant": "繁", "zh-Hans": "简" };

export function Nav({ ui, locale, onLocale }: { ui: UI; locale: Locale; onLocale: (l: Locale) => void }) {
  return (
    <header class="site-nav container">
      <a class="nav-name" href="#top">Chih-Kai Wang</a>
      <nav aria-label={ui.nav.main} class="nav-links">
        <a href="#work">{ui.nav.work}</a>
        <a href="#cases">{ui.nav.cases}</a>
        <a href="#method">{ui.nav.method}</a>
        <a href="#films">{ui.nav.films}</a>
        <a href="#log">{ui.nav.log}</a>
        <a href="#about">{ui.nav.about}</a>
      </nav>
      <div class="locale" role="group" aria-label={ui.nav.language} data-needs-js>
        {LOCALES.map((l) => (
          <button type="button" key={l} aria-pressed={l === locale} lang={l} onClick={() => onLocale(l)}>{LABELS[l]}</button>
        ))}
      </div>
    </header>
  );
}
