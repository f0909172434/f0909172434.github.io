// Terminal sessions shown on the pinned-project cards. Every command was run against the named commit and every
// output line is copied from that run; nothing here is paraphrased. Tones only colour what the tool printed.
//   line kinds: ['$', text]   a command line typed at the prompt ('>' continuation lines stay with it)
//               ['>', text]   continuation of the previous command
//               [tone, text]  output; tone is a palette key, or an array of [text, tone] runs
export const RUNS = {
  'honest-ci': {
    commit: 'fb01546', cwd: '~/honest-ci', exit: 1,
    lines: [
      ['$', 'node dist/cli/index.js run --config demo/launch/honest-ci.yml \\'],
      ['>', '  -- node demo/launch/false-green-runner.mjs'],
      ['dim', 'test runner: wrote JUnit XML with tests=0'],
      ['dim', 'test runner: exited 0, so ordinary CI stays green'],
      ['red', 'HonestCI FAILED'],
      ['ink', 'Tests: 0  Failures: 0  Errors: 0  Skipped: 0'],
      [[['Baseline: 1  Drop: ', 'ink'], ['100%', 'amber']]],
      [[['ERROR ', 'red'], ['HCI004_ZERO_TESTS', 'amber'], [' Report "unit" contains zero tests.', 'ink']]],
    ],
  },
  rigorgraph: {
    commit: '655e0aa', cwd: '~/demo', exit: 1,
    lines: [
      ['$', 'rigorgraph audit math-demo'],
      ['green', 'Audit passed with 0 warning(s).'],
      ['dim', '1 claims · 1 evidence records · 1 verifications'],
      ['$', 'echo "% edited after review" >> math-demo/evidence/odd-sum-proof.md'],
      ['$', 'rigorgraph audit math-demo'],
      ['red', 'Audit failed with 1 error(s) and 0 warning(s).'],
      ['dim', '1 claims · 1 evidence records · 1 verifications'],
      [[[' ERROR ', 'red'], [' RG_HASH_MISMATCH ', 'amber'], [' EV-PROOF-001  Evidence file hash does not', 'ink']]],
      ['ink', '                                        match:'],
      ['ink', '                                        evidence/odd-sum-proof.md.'],
    ],
  },
  'finite-witness-webmcp': {
    commit: '8be145e', cwd: '~/finite-witness-webmcp', exit: 0,
    lines: [
      ['$', 'python3 tools/verify_certificate.py examples/c4-certificate.json \\'],
      ['>', "  | jq -c '{status, witness_valid}'"],
      [[['{"status":', 'dim'], ['"PASS"', 'green'], [',"witness_valid":', 'dim'], ['true', 'amber'], ['}', 'dim']]],
      ['$', 'python3 tools/verify_certificate.py examples/c4-certificate.json \\'],
      ['>', "  | jq -c '.metrics | {vertices, degrees, triangles, isCycle}'"],
      [[['{"vertices":', 'dim'], ['4', 'violet'], [',"degrees":', 'dim'], ['[2,2,2,2]', 'violet'], [',"triangles":', 'dim'], ['0', 'violet'], [',"isCycle":', 'dim'], ['true', 'amber'], ['}', 'dim']]],
    ],
  },
  'sair-stage2-proof-press': {
    commit: '920f0de', cwd: '~/sair-stage2-proof-press', exit: 0,
    lines: [
      ['$', 'python3 tools/verify_public_snapshot.py --replay-candidates \\'],
      ['>', "  | jq -r '.status, (.artifacts[] |"],
      ['>', '      "\\(.identity)  \\(.candidate_replay)  \\(.path)")\''],
      ['green', 'PASS'],
      [[['PASS  PASS  ', 'green'], ['dist/final/solo_safe/solver.py', 'ink']]],
      [[['PASS  PASS  ', 'green'], ['dist/final/solo_aggressive/solver.py', 'ink']]],
      [[['PASS  PASS  ', 'green'], ['dist/final/marathon_safe/solver.py', 'ink']]],
      [[['PASS  PASS  ', 'green'], ['dist/final/marathon_aggressive/solver.py', 'ink']]],
    ],
  },
  'rulediff-negative-result': {
    commit: '493df8c', cwd: '~/rulediff-negative-result', exit: 0,
    lines: [
      ['$', 'sed -n 5p README.md | fold -s -w 60'],
      ['ink', 'The report is not peer reviewed, accepted, or published in'],
      ['ink', 'MLSys proceedings. It preserves the terminal confirmatory'],
      [[['result: the frozen lexical model scored ', 'ink'], ['0.9919', 'green'], [' stratified', 'ink']]],
      [[['macro-F1 on development and ', 'ink'], ['0.6661', 'red'], [' on one held-out retail', 'ink']]],
      ['ink', 'packet, with 14 affected-guard false negatives. The work'],
      ['ink', 'does not claim observed unsafe executions or a validated'],
      ['ink', 'end-to-end safety guarantee.'],
    ],
  },
};

/** One line per card under the name; a shell comment in the card. */
export const TAGLINES = {
  'honest-ci': { en: 'A green check should mean the tests you expected really ran.', zh: '讓綠燈代表：該跑的測試，真的跑了。' },
  rigorgraph: { en: 'Every claim tied to the bytes of its evidence. Change one byte and the audit fails.', zh: '每個主張都綁著證據的位元組；改動一個位元組，稽核就失敗。' },
  'finite-witness-webmcp': { en: 'Checks every small graph for a counterexample, then hands you a certificate to replay.', zh: '把小圖全部檢查一遍找反例，再交給你一張能重播的憑證。' },
  'sair-stage2-proof-press': { en: 'Lean-checked proofs or finite countermodels — all 1,669 released inputs accepted.', zh: 'Lean 檢查過的證明或有限反模型；1,669 個公開輸入全數通過。' },
  ORACLE: { en: 'At 3 a.m., someone asks an AI a question. A 4:30 film rendered entirely from code.', zh: '凌晨三點，有人問 AI 一個問題。一部完全由程式渲染的 4 分 30 秒短片。' },
  'rulediff-negative-result': { en: "0.99 in development, 0.67 held out. It didn't hold, so I froze it and published it.", zh: '開發集 0.99，保留集 0.67。結果沒撐住，所以我把它凍結、公開。' },
};
