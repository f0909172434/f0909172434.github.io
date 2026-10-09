import type { Locale, UI } from "../locale";
import { formatMonth, pick } from "../locale";
import { caseStudyUrl, type Catalog } from "../catalog";
import { Section } from "./Section";

export function Log({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const { now, contributions } = catalog.profile;
  const merged = [...contributions].sort((a, b) => b.merged.localeCompare(a.merged));
  let i = 2;
  return (
    <Section id="log" num="06" cwd="~" cmd="ckw log --now --merged" title={ui.log.title}>
      <ol class="log">
        {now.items.map((it, k) => (
          <li class="log-row ln" style={{ "--i": i++ }} key={`now-${k}`}>
            <span class="log-node" aria-hidden="true">●</span>
            <time dateTime={now.asOf}>{formatMonth(now.asOf, locale)}</time>
            <span class="tag tag-amber">{ui.log.now}</span>
            <p>{pick(it, locale)}</p>
          </li>
        ))}
        {merged.map((c) => {
          const pr = c.url.match(/\/pull\/(\d+)/)?.[1];
          return (
            <li class="log-row ln" style={{ "--i": i++ }} key={c.url}>
              <span class="log-node g" aria-hidden="true">●</span>
              <time dateTime={c.merged}>{c.merged}</time>
              <span class="tag tag-green">{ui.log.merged}</span>
              <p>
                <a class="log-ref" href={c.url} target="_blank" rel="noreferrer">{c.repo}{pr && <span class="violet">#{pr}</span>}</a>
                <span> {pick(c.title, locale)}</span>
                {c.caseStudy && <> <a class="log-case" href={caseStudyUrl(c.caseStudy)} target="_blank" rel="noreferrer">{ui.log.caseStudy} ↗</a></>}
              </p>
            </li>
          );
        })}
      </ol>
      <p class="log-note ln" style={{ "--i": i }}><span class="hash" aria-hidden="true"># </span>{ui.log.note}</p>
    </Section>
  );
}
