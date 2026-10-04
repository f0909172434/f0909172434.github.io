import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { slug, type Catalog } from "../catalog";

export function Negatives({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const items = catalog.projects.filter((p) => p.negative);
  return (
    <section id="negatives" class="section container" aria-labelledby="negatives-title">
      <div class="section-margin"><h2 class="label" id="negatives-title">{ui.negatives.label}</h2></div>
      <div class="section-body">
        <div class="negatives-box">
          <p class="lede">{pick(catalog.profile.negativesIntro, locale)}</p>
          <ul class="negatives">
            {items.map((p) => (
              <li key={slug(p)}>
                <span class="mono" aria-hidden="true">−</span>
                <span><a href={`#rec-${slug(p)}`}><strong>{p.name}</strong></a> — {pick(p.negative!, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
