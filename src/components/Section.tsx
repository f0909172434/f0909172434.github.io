import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { useEnter, useTyped } from "../lib/motion";

interface Props {
  id: string;
  num: string;
  cwd: string;
  cmd: string;
  title: string;
  intro?: string;
  children: ComponentChildren;
}

/** A section is a command and its output: the prompt types itself when it scrolls into view, then the output prints. */
export function Section({ id, num, cwd, cmd, title, intro, children }: Props) {
  const [run, setRun] = useState(false);
  const ref = useEnter<HTMLElement>(() => setRun(true));
  const typed = useTyped(cmd, run);
  return (
    <section id={id} ref={ref} class={`sec container${run || typed.done ? " out" : ""}`} style={{ "--d0": `${run ? typed.ms : 0}ms` }} aria-labelledby={`${id}-title`}>
      <header class="sec-head">
        <p class="cmd">
          <span class="ps1" aria-hidden="true"><span class="ps1-host">ckw</span> <span class="ps1-cwd">{cwd}</span> <span class="ps1-arrow">❯</span> </span>
          <span class="sr-only">{cmd}</span>
          <span class="cmd-typed" aria-hidden="true">{typed.text}</span>
          <span class={`caret${typed.done ? " caret-off" : ""}`} aria-hidden="true" />
        </p>
        <div class="sec-title ln" style={{ "--i": 0 }}>
          <span class="sec-num" aria-hidden="true">{num}</span>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        {intro && <p class="sec-intro ln" style={{ "--i": 1 }}><span class="hash" aria-hidden="true"># </span>{intro}</p>}
      </header>
      <div class="sec-body">{children}</div>
    </section>
  );
}
