# §2.1.1 R4 committed-payload scope tail

Builder: paragraph_211_alt_builder. 2026-09-05.

Both checks ran AFTER the respective payload commits, never against empty
pre-commit diffs. Exact identities:

- Platform base: 441b7e7013c74fb80da55d88f84223d233bac6a8.
- Platform payload: c55502b03640ec487f50648ccc7dd5500a9b5257.
- Lessons base: e1170dfc450400040339f96d18e43c0b60bd029d.
- Lessons payload: 94161011747f31ac5d460e247cde0eeb81b18f74.
- Paired branch: agent/book2-211-alt-correction-20260905.

`check-paragraph-lane-scope.js --lane shared --base <platform-base> --head HEAD`
PASS: three platform source/test files and fifty evidence files.

`check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base <lessons-base> --head HEAD`
PASS: exactly five §2.1.1 generated files: two Markdown files, their two HTML
outputs, and fig_3.svg. No PDF, PNG, answer edition, canonical review/QC/handoff,
plan, adjacent paragraph, target or prerequisite pin changed.

Exact commands, exit codes and stdout/stderr hashes are appended in this
prefix's command-log JSONL/Markdown. This tail records scope evidence only.
The subsequent agent-index/URL-index refresh is a separate publication-only
commit. Independent paragraph review and specialist QC are still PENDING;
the candidate does not authorize successor acceptance records or any PR merge.
