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
    commit: '519cca0', cwd: '~/rulediff-negative-result', exit: 0,
    lines: [
      ['$', 'tar -xzf artifact_bundle.tar.gz'],
      ['$', 'cd artifact && python3 verify_artifact.py 2>/dev/null \\'],
      ['>', "  | grep -E 'private aggregate|ARTIFACT'"],
      [[['PASS ', 'green'], ['private aggregate pairs', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate transitions', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate stratum_macro_f1', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate stale_false_negatives', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate false_invalidations', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate pooled_macro_f1', 'ink']]],
      [[['PASS ', 'green'], ['private aggregate ', 'ink'], ['stratified_macro_f1', 'amber']]],
      [[['ARTIFACT_VERIFICATION_PASS', 'green']]],
    ],
  },
};

/** One line per card under the name; a shell comment in the card. */
export const TAGLINES = {
  'honest-ci': { en: 'Green CI should mean the tests you expected actually ran.', zh: '讓 CI 的綠燈代表：該跑的測試真的跑了。' },
  rigorgraph: { en: 'Ties each claim to the bytes of its evidence; one edited byte fails the audit.', zh: '把每個主張綁到證據的位元組；改動一個位元組，稽核就失敗。' },
  'finite-witness-webmcp': { en: 'Exhaustive counterexample search on small graphs, with certificates anyone can replay.', zh: '在小圖上窮舉反例，輸出任何人都能重播的憑證。' },
  'sair-stage2-proof-press': { en: 'Lean-checked proofs or finite countermodels; 1,669 of 1,669 released inputs accepted.', zh: '輸出 Lean 檢查的證明或有限反模型；1,669 / 1,669 個公開輸入通過。' },
  ORACLE: { en: 'A 4:30 short film rendered entirely from code: at 3 a.m., someone asks an AI a question.', zh: '完全由程式渲染的 4 分 30 秒短片：凌晨三點，有人問 AI 一個問題。' },
  'rulediff-negative-result': { en: "0.99 on development, 0.67 held out. It didn't hold, so it was frozen and published.", zh: '開發集 0.99，保留集 0.67。結果沒有撐住，所以凍結並公開。' },
};
