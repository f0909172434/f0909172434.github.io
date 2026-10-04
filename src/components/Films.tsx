import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { slug, type Catalog } from "../catalog";

export function Films({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const films = catalog.projects.filter((p) => p.kind === "creative");
  return (
    <section id="films" class="section container" aria-labelledby="films-title">
      <div class="section-margin"><p class="label">{ui.films.label}</p></div>
      <div class="section-body">
        <h2 id="films-title">{ui.films.title}</h2>
        <p class="lede">{pick(catalog.profile.filmsIntro, locale)}</p>
        <div class="film-grid">
          {films.map((p) => (
            <article class="card" key={slug(p)}>
              <p class="mono made">{p.made} · {p.status}</p>
              <h3>{p.name}</h3>
              <p>{locale === "en" ? p.descEn : p.descZh}</p>
              <p class="links mono">
                {p.watch && <a href={p.watch} target="_blank" rel="noreferrer">{ui.ledger.watch} ↗</a>}
                <a href={p.repo} target="_blank" rel="noreferrer">{ui.ledger.source} ↗</a>
                {p.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
