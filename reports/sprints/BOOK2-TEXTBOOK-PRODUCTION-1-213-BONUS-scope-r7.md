# §2.1.3 R7 committed payload scope and publication plan

The actual corrected payload checked here is platform
`0f684f41c48eb79a51e2dedca2472819e11e0f42`, consisting of initial payload
`9d4e319d53d41eec2d10d6b6691fbb33c381f872` plus the evidence-only LF repair.
Paired lesson payload is `40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99`.
Both use branch `agent/book2-213-bonus-correction-20260905` in the claimed pair
`C:/wt/book2-213-bonus-correction-20260905/{4veco-platform,4veco-lessen}`.
Lock owner: `paragraph_213_bonus_correction_builder`.

Relative to exact REVISE baselines platform
`984547a17c966d3749d08ef34b92747de21eacbf` / lesson
`5d67998d1e1d1aa5497d59850b53aebc780eaa96`, actual committed scopes both PASS:

- Platform shared: 53 paths; only source `213/answers.md`, regression
  `213/test_bonus_contract.py`, three native hash-named R7 proof directories
  and task-prefixed supplemental sprint evidence. No canonical target/plan,
  quality-ref, review or handoff changes. Strict own allowlist and no deletions.
- Lessons textbook: exactly four `– antwoorden` files (.md/.html/.pdf/.zip).
  No other generated files, source/asset files or authority records changed.
- Whole-candidate platform shared from `199772e2aa586fce0f71b647ed5188e568dba2e5`
  and lessons textbook from `4c4cd7d0c1d2e5242c818399a96dce3e26013e9c` also PASS.
- Final corrected payload `git diff --check` PASS. First payload's CRLF JSON
  failure and the LF-only semantic-parity repair remain explicitly recorded.

Exact paths and committed blob SHA-256 values are in
`BOOK2-TEXTBOOK-PRODUCTION-1-213-BONUS-evidence-r7/payload-scope.json`.
Actual scope command JSON/exit codes are in that directory's `command-log.jsonl`.
This scope-evidence successor adds only the strict scope helper, payload-scope
JSON, this record and appended command evidence; it changes no lesson source.

Final workflow: commit this evidence successor, generate the four GitHub maps
with explicit paired lesson source ref `40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99`
and source branch `agent/book2-213-bonus-correction-20260905`, run the URL-index
generator, then commit those deterministic index tails separately. Normal push
both branches, verify fetched remote heads and clean owned worktrees. Report
actual final IDs to root after those actions, not future guessed hashes here.

Root adopts the source/evidence payload, excludes mechanical index tails and
assigns distinct R7 paragraph review and distinct specialist QC. The candidate
is not approved, integrated or handed off. No PR was opened by this bounded
builder; PR/merge remain the root integrator's governed lane. No new platform
CI run is claimed or required as proof of an independent review that has not
yet occurred. Canonical R6 specialist REVISE and legacy QC remain unchanged.
