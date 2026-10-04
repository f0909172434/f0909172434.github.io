import type { Locale, UI } from "../locale";
import { fmt, formatMonth, pick } from "../locale";
import { EMAIL, GITHUB, type Catalog } from "../catalog";
import { RecordCard } from "./RecordCard";
import { Phrases } from "./Phrases";

export function Hero({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  return (
    <section id="top" class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="label">{ui.hero.kicker}</p>
        <h1 id="hero-title"><Phrases text={ui.hero.title} locale={locale} /></h1>
        <p class="lede">{pick(catalog.positioning, locale)}</p>
        <ul class="facts">
          {catalog.profile.facts.map((f, i) => (
            <li key={i}><span class="mono">{String(i + 1).padStart(2, "0")}</span><span>{pick(f, locale)}</span></li>
          ))}
        </ul>
        <div class="actions">
          <div class="action-row">
            <a class="btn btn-primary" href="#work">{ui.hero.primary}</a>
            <a class="btn" href="/Chih-Kai-Wang-CV.pdf">{ui.common.cv}</a>
          </div>
          <div class="action-row">
            <a class="text-link" href={GITHUB}>GitHub ↗</a>
            <a class="text-link" href={EMAIL}>{ui.common.email}</a>
          </div>
        </div>
        <p class="mono hero-updated">{fmt(ui.hero.updated, { date: formatMonth(catalog.profile.now.asOf, locale) })}</p>
      </div>
      <RecordCard ui={ui} locale={locale} catalog={catalog} />
    </section>
  );
}
