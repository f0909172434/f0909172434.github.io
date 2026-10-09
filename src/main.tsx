import { hydrate, prerender as ssr } from "preact-iso";
import "@fontsource-variable/noto-sans-tc";
import "@fontsource-variable/noto-sans-sc";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/site.css";
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
