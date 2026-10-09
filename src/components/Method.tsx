import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import type { Catalog } from "../catalog";
import { Section } from "./Section";

/** Frame → Execute → Decide, drawn as the git graph it actually is: agents work on a branch, evidence decides the merge. */
export function Method({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const [frame, execute, decide] = catalog.profile.method;
  const step = (m: typeof frame, n: number, lane: "main" | "branch") => (
    <li class={`gl gl-${lane} ln`} style={{ "--i": 2 + n * 2 }}>
      <span class="gl-rail" aria-hidden="true"><span class="gl-dot" /></span>
      <div class="gl-body">
        <h3><span class="gl-n">{String(n + 1).padStart(2, "0")}</span>{pick(m.title, locale)}</h3>
        <p>{pick(m.body, locale)}</p>
      </div>
    </li>
  );
  return (
    <Section id="method" num="04" cwd="~/method" cmd="git log --graph --oneline" title={ui.method.title}>
      <ol class="graph">
        {step(frame, 0, "main")}
        <li class="gl gl-fork ln" style={{ "--i": 3 }} aria-hidden="true"><span class="gl-rail" /><span class="gl-note">{ui.method.branch}</span></li>
        {step(execute, 1, "branch")}
        <li class="gl gl-merge ln" style={{ "--i": 5 }} aria-hidden="true"><span class="gl-rail" /></li>
        {step(decide, 2, "main")}
      </ol>
      <div class="method-notes ln" style={{ "--i": 8 }}>
        <p><span class="hash" aria-hidden="true"># </span>{pick(catalog.profile.methodNote, locale)}</p>
        <p class="dim">{ui.method.tools}</p>
      </div>
    </Section>
  );
}
