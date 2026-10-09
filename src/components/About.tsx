import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { EMAIL, GITHUB, type Catalog } from "../catalog";
import { Section } from "./Section";

export function About({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const { about, learning } = catalog.profile;
  return (
    <Section id="about" num="07" cwd="~" cmd="cat about.md" title={ui.about.title}>
      <div class="about">
        <div class="about-copy">
          <p class="ln" style={{ "--i": 2 }}>{pick(about, locale)}</p>
          <p class="ln" style={{ "--i": 3 }}>{pick(learning, locale)}</p>
        </div>
        <aside class="contact ln" style={{ "--i": 4 }} aria-label={ui.about.contact}>
          <p class="contact-head"><span class="pulse" aria-hidden="true" />{ui.about.contact}</p>
          <a href={EMAIL}><span class="dim">mail</span> f0909172434@gmail.com</a>
          <a href="/Chih-Kai-Wang-CV.pdf"><span class="dim">cv</span> Chih-Kai-Wang-CV.pdf</a>
          <a href={GITHUB}><span class="dim">gh</span> github.com/f0909172434 ↗</a>
          <a href={GITHUB}><span class="dim">md</span> {ui.about.readme} ↗</a>
        </aside>
      </div>
    </Section>
  );
}
