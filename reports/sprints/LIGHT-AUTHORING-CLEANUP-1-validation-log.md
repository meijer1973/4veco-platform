# LIGHT-AUTHORING-CLEANUP-1 validation log

Date: 2026-09-08. Commands below ran in the named isolated task worktrees.
This log distinguishes source checks, rollback checks, the production trial and
release CI. A passing documentation check is not production validation.

## Preflight and source checks

Platform base: 96416b6b5bd57094576e9aba0a42d682584ec479; lesson base:
f09fd6e88edc5049b026b16b0158e7e188091d2d. Both fetched origin/main refs matched.
Both maps available; main paired worktree ownership and clean branch preflights
passed. Initial `npm.cmd run check:governance-freshness` passed without an exception.
Intentional policy edits subsequently use the existing `--allow-policy-edit` flag.

| Command/inspection | Result |
|---|---|
| npm.cmd ci --no-audit --no-fund | exit 0; 385 locked packages; no dependency changes |
| npm.cmd run check:active-governance-wording | exit 0, A and A+B |
| npm.cmd run check:paragraph-workflow-wording | exit 0; A 13 surfaces; A+B 18 |
| npm.cmd run check:part-a-exercise-authoring-contract | exit 0; 10 unchanged contract surfaces |
| npx.cmd jest build-scripts/workflows/check-paragraph-workflow-wording.test.js build-scripts/review-gates/cross-repo-bundle-workflow.test.js --runInBand | A: exit 0, 47 tests |
| npx.cmd jest build-scripts/workflows/check-paragraph-workflow-wording.test.js build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js build-scripts/review-gates/cross-repo-bundle-workflow.test.js --runInBand | A+B: exit 0, 103 tests |
| npm.cmd run check:pr-readiness | A: exit 0, 186 tests; unchanged policy semantics, extra relocated-path protection cases |
| node build-scripts/sprints/check-scope-language.js --active | exit 0, including relocated instruction surfaces |
| node build-scripts/sprints/check-reasoning-game-skill.js | exit 0; assertion follows retained scoped detail |
| node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 96416b6b --head HEAD --json | exit 0 at 06c7925b; shared governance scope, no unknown or production-output paths, no exception |
| Same lane checker with --cwd ../4veco-lessen --lane shared --base f09fd6e8 --head HEAD --json | exit 0 at 937934f2; only AGENTS.md, no exception |
| Relative Markdown link inspection of A changed files | 22 local link targets checked; none missing |
| git diff --check (both primary worktrees) | exit 0 |
| npm.cmd run agent:index; node build-scripts/sprints/emit-url-index.js | exit 0; existing generators |
| node build-scripts/reports/check-agent-index-freshness.js; node build-scripts/sprints/emit-url-index.js --check | exit 0 at c8caa165; lesson index correctly pins origin/main, not paired branch |

Initial corrections: one literal PDF wording assertion failed across a newline;
the same unchanged sentence was rejoined. An existing literal file-count test
needed its expected count updated after the new scoped rule. B now computes
that count from the actual rule/navigation union. Python writes initially used
Windows line endings against the platform's LF policy; normalized only edited
files to LF, then diff hygiene passed. No check was disabled. The B cherry-pick
conflicted only on that test counter; retained B's dynamic union and A's relocated
rule. B's standalone author reported initial sibling/dependency setup failures,
then passing checks with clean lesson-base sibling and locked dependencies.

## Independent source precheck and corrections

`comparison_preflight` independently reviewed A/B under the original base rules.
Two findings were fixed in A follow-up 06c7925b: duplicated specialist assignment
clauses now route through the existing agents README/lead protocol; broad sprint
plan wording now selects the applicable textbook or actual sprint/gate plan.
Completed dual-lane review-record wording no longer implies a companion review
for Part A-only work. Wording checks and diff hygiene passed after repair.
The reviewer clarified that the original root's instruction to use specialist
protocols does not itself require separate model instances; B remains coherent
with the original root through its explicit assignment conditions.

## Rollback verification

Isolated platform branch `codex/light-cleanup-rollback-check-20260908`, sibling
lesson checkout at the unchanged base. No rollback was applied to the PR branch.

- From c8caa165, `git revert --no-edit f608748a` created test commit
  321b0bf70d1c635b4cb614c0daf9df5526cb4f47. A remained. Workflow wording (13),
  exercise contract (10), PR-readiness (186 tests), and diff hygiene passed.
- Restored B with a revert of that test revert, then reverted A's map commit
  35f286dd and A source commit a5d74a36. The single test-counter conflict retained
  `new Set([...RULES.map((rule) => rule.file), ...NAVIGATION_FILES]).size`.
  Result: dd3091ef6467290a778f0ca40379fa4434228a35. Active wording, workflow
  wording (17), exercise contract (10), focused suites (62 tests), PR-readiness
  (180 tests), and diff hygiene passed. Non-report source diff against B's
  standalone 33f3113d commit was empty.
- Repeated both combinations from final source 06c7925b on isolated branch
  `codex/light-cleanup-rollback-final-20260908`. Reverting B produced
  1c1762539e247691446a3fd1a0b194dfd0ddae93; A-final active/workflow wording
  (13 surfaces) and the two focused suites (47 tests) passed. Restored B,
  reverted 06c7925b and 35f286dd, then reverted a5d74a36 with the same single
  counter resolution. Final B-only commit dddba7f7 passed active/workflow
  wording (17), exercise contract (10), focused suites (62 tests), PR-readiness
  (180 tests), and diff hygiene. Its non-report source diff against 33f3113d
  was empty. Refresh generated indexes after either rollback and use the
  normal reviewed PR process.

## Comparison and CI

See the comparison report for actual authoring/review commands and limitations.
Full production closure is blocked by the mandatory quality-reference freshness
update; no reference or teaching-standard change is authorized in this cleanup.
`npm.cmd run check:platform` completed locally with exit 0: 110 suites passed,
six skipped; 1,889 tests passed, eight skipped (1,897 total), 628.467 seconds.
The final A scoped-routing repair was committed while this broad run was in
progress, so this local result is not represented as an immutable final-head
certificate. Its relevant wording checks passed separately after repair.

`npm.cmd run check:branch-protection` passed against live GitHub: strict required
`validate-platform`, admin enforcement and force/deletion protection retained;
required approval count 0 under the existing single-account policy. The inspected
response did not expose bypass allowances; that field is unavailable, not a
claim that unobserved settings were checked.

Initial remote CI passed at c8caa1650dd60eddcf657af10e41daf4ba2a18c7:
https://github.com/meijer1973/4veco-platform/actions/runs/34200021897.
Final reviewed-head CI and paired compatibility proof are recorded with the
release review once the comparison evidence is complete.

## Completed comparison packet pre-publication checks

Both repositories were fetched again at approximately 09:07 UTC; origin/main
remained at the recorded bases and both draft PRs were open and mergeable.
After both arms sealed, the final source wording checks passed again (active,
workflow 18, exercise contract 10), governance freshness passed with declared
policy edits, and the existing review-throughput checker passed the paired L4
JSON envelope. No per-PR live readiness decision is committed in that envelope.

Sample X packaging matched its exact 139-file allowlist plus its inventory;
Sample Y preserves 279 files. Every original and archived hash was verified,
and ZIP CRC/readback checks passed. Initially all 13 X and 9 Y direct PDF/Markdown
copies matched their originals byte-for-byte. Both archived supplied prompts match the
committed common prompt exactly. The six neutral PDF links resolve. The first
ad hoc link read used the Windows default encoding and falsely failed on the
en dash; rerunning with explicit UTF-8 passed without changing any file.

The unchanged production validator is not represented as passing both arms:
X exits 1 for its missing quality-ref; Y exits 0 with a blocked inventory record
whose freshness/completion the validator does not enforce. X also records its
existing CRLF-sensitive verdict-parser fallback. Full details, actual review
findings and the common reference-update blocker are in the comparison and
unmodified archived evidence.

The staged Git hygiene check then rejected the copied CRLF Markdown and original
handoff's trailing hard-break spaces. Normalized only the repository convenience
Markdown copies to LF, trimmed trailing whitespace and one final newline; no
original trial file or archive was edited. Direct PDFs remain byte-exact, and
the manifests record original and normalized-copy hashes separately. The exact
owner attachment is preserved in `LIGHT-AUTHORING-CLEANUP-1-owner-handoff-original.zip`:
original SHA-256 c8f04d6345d971b3507737e4adc377f2b187343c64b7b9221ba8cd9f38d200af;
normalized Markdown 475d3bdf16fb3201f62ba7847f3a1c0bd216d9b54c1d2cfef476bda5ca1872ac;
ZIP ca0336a235019eb97c525b45b02a927bcbb008c6698f7b4617647c51fe70815d.
No whitespace rule or validator was weakened.
