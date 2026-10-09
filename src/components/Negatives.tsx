import type { Locale, UI } from "../locale";
import { fmt, pick } from "../locale";
import { slug, type Catalog } from "../catalog";
import { Section } from "./Section";

export function Negatives({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const items = catalog.projects.filter((p) => p.negative);
  return (
    <Section id="negatives" num="02" cwd="~/work" cmd="ckw verify --keep-negatives" title={ui.negatives.title} intro={pick(catalog.profile.negativesIntro, locale)}>
      <ul class="neg">
        {items.map((p, i) => (
          <li class="ln" style={{ "--i": 2 + i }} key={slug(p)}>
            <span class="neg-mark" aria-hidden="true">✗</span>
            <span class="tag tag-red">{ui.negatives.tag}</span>
            <a class="neg-name" href={`#rec-${slug(p)}`}>{p.name}</a>
            <span class="neg-text">{pick(p.negative!, locale)}</span>
          </li>
        ))}
      </ul>
      <p class="neg-sum ln" style={{ "--i": 3 + items.length }}>
        <span class="neg-bar" aria-hidden="true" />
        <span>{fmt(ui.negatives.summary, { n: items.length })}</span>
      </p>
    </Section>
  );
}
