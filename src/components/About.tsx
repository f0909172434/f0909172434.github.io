import type { Locale, UI } from "../locale";
import { pick } from "../locale";
import { EMAIL, GITHUB, type Catalog } from "../catalog";

export function About({ ui, locale, catalog }: { ui: UI; locale: Locale; catalog: Catalog }) {
  const { about, learning } = catalog.profile;
  return (
    <section id="about" class="section container" aria-labelledby="about-title">
      <div class="section-margin"><p class="label">{ui.about.label}</p></div>
      <div class="section-body">
        <h2 id="about-title">{ui.about.name}</h2>
        <div class="about-grid">
          <div class="about-copy">
            <p>{pick(about, locale)}</p>
            <p>{pick(learning, locale)}</p>
          </div>
          <div class="contact">
            <p class="label">{ui.about.contact}</p>
            <a href={EMAIL}>f0909172434@gmail.com</a>
            <a href="/Chih-Kai-Wang-CV.pdf">{ui.common.cv}</a>
            <a href={GITHUB}>GitHub ↗</a>
            <a href={GITHUB}>{ui.about.readme} ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
