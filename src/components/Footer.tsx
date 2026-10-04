import type { UI } from "../locale";
import { META, SITE_REPO_URL, GITHUB } from "../catalog";

export function Footer({ ui }: { ui: UI }) {
  return (
    <footer class="site-footer container">
      <p class="mono">© 2026 Chih-Kai Wang · <a href={GITHUB}>GitHub ↗</a> · <a href="#top">{ui.footer.top} ↑</a></p>
      <p class="mono fine">{ui.footer.colophon} · sha256 {META.sha256.slice(0, 12)}… · <a href={SITE_REPO_URL}>{ui.footer.source} ↗</a></p>
    </footer>
  );
}
