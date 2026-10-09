import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { caseStudiesFor, caseStudyUrl, type Catalog } from "../catalog";
import { Section } from "./Section";

export function CaseStudies({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const studies = caseStudiesFor(locale);
  return (
    <Section id="cases" num="03" cwd="~/case-studies" cmd="ls *.md" title={ui.cases.title} intro={ui.cases.intro}>
      <ol class="cases">
        {studies.map((s, i) => {
          const project = s.project ? catalog.projects.find((p) => p.repo.endsWith(`/${s.project}`)) : undefined;
          const source = s.url ?? project?.repo;
          return (
            <li class="case ln" style={{ "--i": 2 + i }} key={s.slug}>
              <a class="case-file" href={caseStudyUrl(s.slug)} target="_blank" rel="noreferrer">
                <span class="case-name">{s.slug}<span class="dim">.md</span></span>
                <span class="case-title">{pick(s.title, locale)}</span>
              </a>
              <p class="case-sum">{pick(s.summary, locale)}</p>
              <p class="case-links">
                <a href={caseStudyUrl(s.slug)} target="_blank" rel="noreferrer">{ui.cases.read} ↗</a>
                {source && <a href={source} target="_blank" rel="noreferrer">{ui.common.source} ↗</a>}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
