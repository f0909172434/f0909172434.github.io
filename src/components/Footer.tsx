import type { UI } from "../locale";
import { META, SITE_REPO_URL } from "../catalog";

export function Footer({ ui }: { ui: UI }) {
  return (
    <footer class="foot container">
      <p class="cmd"><span class="ps1"><span class="ps1-host">ckw</span> <span class="ps1-cwd">~</span> <span class="ps1-arrow">❯</span> </span>exit</p>
      <p class="dim">{ui.footer.exit}</p>
      <p class="foot-fine">{ui.footer.colophon}</p>
      <p class="foot-fine">© 2026 Chih-Kai Wang · sha256 {META.sha256.slice(0, 12)}… · <a href={SITE_REPO_URL}>{ui.footer.source} ↗</a> · <a href="#top">{ui.footer.top} ↑</a></p>
    </footer>
  );
}
