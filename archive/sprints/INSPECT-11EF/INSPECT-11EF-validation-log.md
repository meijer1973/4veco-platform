# INSPECT-11E/F Validation Log

Status: passed
Date: 2026-06-20

## Scope

This log covers the manual internal Chapter 1.3 diagnostic onboarding track and
Chapter 1.2 regression/currentness proof. It does not validate evidence-pack,
teacher/school-facing, public/external, product-route, Scale Gate,
diagnostics/mastery/PV, student/product-use, personal-data, or compliance
authority.

## Command Results

| Command | Result | Evidence |
|---|---:|---|
| `npm.cmd run check:agent-worktree-safety -- --check --task INSPECT-11EF --agent codex-main --require-prefix codex/,agent/` | PASS | Worktree safety returned `ok: true`; branch is `codex/inspect-11ef-chapter-13-diagnostic-onboarding-20260619`; dirty state expected during implementation. |
| `node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md` | PASS | `OK sprint plan: archive\sprints\INSPECT-11EF\INSPECT-11EF-sprint-plan.md`. |
| `node -e "<parse onboarding/report JSON files>"` | PASS | Chapter 1.3 onboarding plan JSON, Chapter 1.3 diagnostic report JSON, and Chapter 1.2 diagnostic report JSON parsed. |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all` | PASS | Diagnostic report output current for `chapter-1-2` and `chapter-1-3`. |
| `node build-scripts/inspection/check-dutch-diagnostic-report-stability.js` | PASS | `OK INSPECT-11E/F diagnostic stability check`; scopes `chapter-1-2,chapter-1-3`; refusal cases `20`; Chapter 1.2 semantic SHA-256 `76b683b6370c1e13cf46cb8094fd52c71d8d24b723b90d14fd257d5287ea7132`. |
| `npm.cmd run check:scope-language` | PASS | `OK scope-language check: active surfaces`. |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS | `OK roadmap version index: 151 entries`. |
| `node build-scripts/sprints/emit-url-index.js --check` | PASS | `OK url-index: reports/url-index.md is current`. |
| `node build-scripts/reports/validate-report-json.js` | PASS | `OK report JSON contract: 14 report(s)`. |
| `git diff --check` | PASS | No whitespace errors. |
| `npm.cmd run check:platform` | INITIAL ENV FAIL | First run failed before tests because this fresh worktree had no `node_modules`; `jest` was not on PATH. |
| `npm.cmd install` | PASS | Installed repo dependencies locally; no source/package metadata changes were left in git status. npm reported existing audit/deprecation advisories. |
| `npm.cmd run check:platform` | PASS | 54 suites passed, 6 skipped; 809 tests passed, 8 skipped. Known fixture diagnostic output printed during tests. |
| `node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht"` | PASS | Chapter 1.3 validator: 0 errors, 0 warnings. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.1 through 1.3.4>` | PASS | Paragraph validators for `1.3.1`, `1.3.2`, `1.3.3`, and `1.3.4` passed. |

## Refusal Checks

The stability checker also runs the full refusal matrix. The explicit
INSPECT-11E/F acceptance-test refusal commands produced the expected nonzero
STOP codes:

| Command | Expected result | Actual result |
|---|---|---|
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --public` | `STOP_PUBLIC_EXTERNAL_REQUEST` | PASS |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --teacher` | `STOP_PACK_STRENGTH_REQUEST` | PASS |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --product-route` | `STOP_DOWNSTREAM_GATE_AUTHORITY` | PASS |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --lesson-output-scan` | `STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE` | PASS |

## Legal/Privacy Correction Rerun

After legal/privacy REVISE, the generator was corrected and reports were
regenerated. The stale phrase scan found no remaining instances of:

- `No generated lesson output is read`;
- `diagnostic report generation until human review`;
- `INSPECT-11D is not closed`.

Rerun proof:

| Command | Result | Evidence |
|---|---:|---|
| `node --check build-scripts/inspection/build-dutch-diagnostic-report.js` | PASS | Generator syntax valid. |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope all` | PASS | Report pair regenerated for Chapter 1.2 and Chapter 1.3. |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all` | PASS | Outputs current for both scopes. |
| `node build-scripts/inspection/check-dutch-diagnostic-report-stability.js` | PASS | Stability/refusal checker passed after correction. |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope chapter-1-3 --lesson-output-scan` | Expected refusal | `STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE`. |

## Chapter 1.2 Regression Proof

Chapter 1.2 report semantics are protected by stability-checker hash:

```text
76b683b6370c1e13cf46cb8094fd52c71d8d24b723b90d14fd257d5287ea7132
```

The only intended Chapter 1.2 report JSON change is deterministic currentness
metadata: replacing the embedded volatile `lesson_specs_head` value with a
policy string. The stable semantic snapshot remains unchanged.

## Chapter 1.3 Report Proof

Generated outputs:

- `reports/inspection-standards/chapter-1-3-diagnostic-report.md`
- `reports/inspection-standards/chapter-1-3-diagnostic-report.json`

The report visibly retains:

- route-local-only evidence status;
- school-owned evidence still needed;
- forbidden inferences;
- accessibility/support limitations;
- check-surface authority separation;
- owner next action;
- proof required to close.

## Final PR CI Evidence

PR #119 remote `platform-ci / validate-platform` passed on reviewed head
`83d315bfd8066d713d0a02252a6c95da9173571a` in run `27831402581`.

The final closure-only reconciliation commit must still receive fresh green PR
CI before merge. That CI run is the governed publication guard; it is not a
remaining implementation validation or human-review blocker.

## Post-Rebase Validation

After rebasing onto current `origin/main`, the conflict in
`docs/roadmaps/roadmap-version-index.md` was resolved by preserving both the
new upstream Golden Workbench roadmap row and the INSPECT-11E/F inspection
roadmap version row. Generated agent, URL, and dashboard indexes were
refreshed.

Post-rebase rerun:

| Command | Result | Evidence |
|---|---:|---|
| `node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md` | PASS | Sprint plan checker passed. |
| `node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all` | PASS | Outputs current for both scopes. |
| `node build-scripts/inspection/check-dutch-diagnostic-report-stability.js` | PASS | Stability/refusal checker passed; Chapter 1.2 semantic hash unchanged. |
| `npm.cmd run check:scope-language` | PASS | Active surfaces passed. |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS | 151 entries. |
| `node build-scripts/sprints/emit-url-index.js --check` | PASS | URL index current. |
| `node build-scripts/reports/validate-report-json.js` | PASS | 14 report JSON contracts passed. |
| `git diff --check` | PASS | No whitespace errors. |
| `npm.cmd run check:platform` | PASS | 54 suites passed, 6 skipped; 809 tests passed, 8 skipped. |
| `node scripts/validate-chapter.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht"` | PASS | Chapter 1.3: 0 errors, 0 warnings. |
| `node scripts/validate-paragraph.js --mode part-a --profile publisher-print <1.3.1 through 1.3.4>` | PASS | Paragraph validators for `1.3.1`, `1.3.2`, `1.3.3`, and `1.3.4` passed. |

## Final Closure-Record Rerun

The required closure-record reconciliation reruns passed:

- `node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md`
- `node build-scripts/inspection/build-dutch-diagnostic-report.js --check --scope all`
- `node build-scripts/inspection/check-dutch-diagnostic-report-stability.js`
- `npm.cmd run check:scope-language`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/reports/validate-report-json.js`
- `git diff --check`
- `npm.cmd run check:platform`

No final-lead or PR-publication validation item remains open in this record.
