import type { Locale, UI } from "../locale";
import { formatDate, formatMonth, pick } from "../locale";
import { caseStudyUrl, type Catalog } from "../catalog";

export function Log({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const { now, contributions } = catalog.profile;
  const merged = [...contributions].sort((a, b) => b.merged.localeCompare(a.merged));
  return (
    <section id="log" class="section container" aria-labelledby="log-title">
      <div class="section-margin"><p class="label">{ui.log.label}</p><p class="mono muted">{formatMonth(now.asOf, locale)}</p></div>
      <div class="section-body">
        <h2 id="log-title">{ui.log.title}</h2>
        <ol class="log">
          {now.items.map((it, i) => (
            <li key={`now-${i}`}>
              <time dateTime={now.asOf}>{formatMonth(now.asOf, locale)}</time>
              <p class="log-text">{pick(it, locale)}</p>
            </li>
          ))}
          {merged.map((c) => (
            <li key={c.url}>
              <time dateTime={c.merged}>{formatDate(c.merged)}</time>
              <p class="log-text">
                <span class="mono">{c.repo}</span> — {pick(c.title, locale)} — <a href={c.url} target="_blank" rel="noreferrer">PR ↗</a>
                {c.caseStudy && <> — <a href={caseStudyUrl(c.caseStudy)} target="_blank" rel="noreferrer">{ui.log.caseStudy} ↗</a></>}
              </p>
            </li>
          ))}
        </ol>
        <p class="mono muted">{ui.log.note}</p>
      </div>
    </section>
  );
}
