import { hydrate, prerender as ssr } from "preact-iso";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/noto-serif-tc";
import "@fontsource-variable/noto-serif-sc";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/ledger.css";
import App from "./App";
import { uiFor } from "./locale";

if (typeof window !== "undefined") {
  document.documentElement.classList.add("js");
  hydrate(<App />, document.getElementById("root")!);
}

export async function prerender() {
  const { html } = await ssr(<App />);
  return { html, head: { lang: "en", title: uiFor("en").meta.title } };
}
