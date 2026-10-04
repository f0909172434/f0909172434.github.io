import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { caseStudiesFor, caseStudyUrl, type Catalog } from "../catalog";

export function CaseStudies({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const studies = caseStudiesFor(locale);
  return (
    <section id="cases" class="section container" aria-labelledby="cases-title">
      <div class="section-margin"><p class="label">{ui.cases.label}</p></div>
      <div class="section-body">
        <h2 id="cases-title">{ui.cases.title}</h2>
        <p class="lede">{ui.cases.intro}</p>
        <ol class="cases">
          {studies.map((s) => {
            const project = s.project ? catalog.projects.find((p) => p.repo.endsWith(`/${s.project}`)) : undefined;
            const source = s.url ?? project?.repo;
            return (
              <li key={s.slug}>
                <h3><a href={caseStudyUrl(s.slug)} target="_blank" rel="noreferrer">{pick(s.title, locale)}</a></h3>
                <p>{pick(s.summary, locale)}</p>
                <p class="links mono">
                  <a href={caseStudyUrl(s.slug)} target="_blank" rel="noreferrer">{ui.cases.read} ↗</a>
                  {source && <a href={source} target="_blank" rel="noreferrer">{ui.ledger.source} ↗</a>}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
