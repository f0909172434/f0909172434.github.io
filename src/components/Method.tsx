import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import type { Catalog } from "../catalog";
import { Phrases } from "./Phrases";

export function Method({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const { method, methodNote } = catalog.profile;
  return (
    <section id="method" class="section container" aria-labelledby="method-title">
      <div class="section-margin"><p class="label">{ui.method.label}</p></div>
      <div class="section-body">
        <h2 id="method-title"><Phrases text={ui.method.title} locale={locale} /></h2>
        <ol class="method-cols">
          {method.map((m, i) => (
            <li key={i}>
              <span class="mono">{String(i + 1).padStart(2, "0")}</span>
              <h3>{pick(m.title, locale)}</h3>
              <p>{pick(m.body, locale)}</p>
            </li>
          ))}
        </ol>
        <div class="method-notes">
          <p class="mono muted">{pick(methodNote, locale)}</p>
          <p class="mono muted">{ui.method.tools}</p>
        </div>
      </div>
    </section>
  );
}
