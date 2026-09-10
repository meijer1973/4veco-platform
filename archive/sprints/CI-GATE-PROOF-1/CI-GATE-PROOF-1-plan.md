# Sprint CI-GATE-PROOF-1: Human-Gate CI Proof Validator

Generated: 2026-06-06

## Goal

Make the human-gate CI proof rule machine-checkable for future gate packets:
a packet must cite a passing `platform-ci / validate-platform` run for the
reviewed remote commit, or record a complete CI waiver.

This sprint changes gate-checking infrastructure and instructions only. It
does not change generated lesson output, protected references, source data,
target registries, candidate storage, PV outputs, product routes,
target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
Scale Gate 1, or student/product use.

## Context

`CI-REMOTE-1A` recorded the procedural rule that future human gate packets must
cite passing CI for the reviewed commit or explicitly record a waiver. The rule
is not yet enforced by a reusable checker. Current gate packet shapes vary, so
the checker must validate a strict new contract while treating incomplete
legacy shapes as failures unless they include an explicit waiver.

## Quality Standard

The specification quality floor is strict gate discipline without retroactive
product claims:

- the checker must accept markdown or JSON packet paths;
- normal proof must include reviewed remote commit SHA, workflow/context,
  GitHub Actions run ID, conclusion `success`, and a statement that the run
  corresponds to the reviewed commit;
- waiver proof must include owner, reason, affected claim, consequence,
  whether review may proceed, and follow-up required;
- negative samples must fail for missing run ID, wrong or missing commit SHA,
  non-success conclusion, vague waiver, run-without-reviewed-commit, and
  local-only command-log citation;
- rendered output and student-facing routes remain intentionally unchanged;
- any current packet-format inconsistency becomes a named follow-up rather
  than weakening the checker.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Validate normal CI proof | `check-gate-ci-proof.js` parses markdown and JSON proof | Positive sample passes | planned |
| Validate explicit waiver | Checker requires all waiver fields | Vague waiver sample fails | planned |
| Reject weak proof | Negative samples cover required failure modes | Jest tests assert intended failures | planned |
| Optional remote verification | `--remote` verifies run head SHA and conclusion through `gh` | Local `--allow-no-gh` behavior documented | planned |
| Preserve boundaries | No historical packet mutation unless explicitly named | Diff summary and lead review | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Modify historical gate packets to pass. | reject_scope_creep | The sprint hardens the future contract and does not rewrite gate history. |
| Add a strict checker with positive and negative samples. | include_now | This directly prevents weak future packets from passing unnoticed. |
| Add optional remote verification through `gh`. | include_now | It strengthens reviewer proof when authentication is available. |
| Enforce the checker against every old packet in CI. | defer_named_follow_up | Current packet shapes vary; universal historical enforcement is too broad. |
| Allow "CI pending" as a waiver. | reject_scope_creep | The user explicitly required vague waivers to fail. |

## Allowed paths

- `build-scripts/sprints/check-gate-ci-proof.js`
- `build-scripts/sprints/check-gate-ci-proof.test.js`
- `reports/fixtures/gate-ci-proof1/*`
- `package.json`
- `AGENTS.md`
- `reports/sprints/CI-GATE-PROOF-1-*`
- `references/data/sprints/CI-GATE-PROOF-1.plan.json`
- `references/data/sprints/CI-GATE-PROOF-1.result.json`
- `references/reference-team-roadmap.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Forbidden paths

- `references/machine/`
- `references/external/`
- `source-data/`
- target-exercise registries
- candidate-storage files
- PV projection outputs
- PV machine-promotion outputs
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- product route files in `../4veco-lessen/`

## Inputs

- `reports/sprints/CI-REMOTE-1A-result.md`
- `references/data/sprints/CI-REMOTE-1A.result.json`
- existing gate packet conventions under `reports/review-gates/`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- `build-scripts/sprints/check-gate-ci-proof.js`;
- checker tests and positive/negative samples;
- optional npm script for the checker;
- small gate-instruction update if needed;
- sprint plan, baseline, planning review, command log, lead-review cycle,
  result, diff summary, and plan/result JSON.

## Operationalized sprint procedure

1. Confirm current gate packet shapes are inconsistent and stop if universal
   historical validation would require weakening the rule.
2. Implement checker normal path and waiver path with explicit failure
   messages for missing run ID, missing reviewed commit, non-success
   conclusion, vague waiver, and local-only evidence.
3. Add positive and negative samples plus Jest tests that prove the intended
   pass/fail behavior.
4. Add optional `--remote` mode through `gh run view`; fail clearly when `gh`
   is unavailable unless `--allow-no-gh` is passed.
5. Add an npm script and minimal gate-instruction update only for the new
   checker contract.
6. Run acceptance validators through `run-sprint-command.js`; stop on any
   failed validator or changed generated/protected output.
7. Complete lead-review round 1, correction log, and round 2 before closure.
8. Push and verify remote `platform-ci / validate-platform` success before
   recording final proof.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-GATE-PROOF-1-plan.md
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-gate-ci-proof.js reports/fixtures/gate-ci-proof1/positive-markdown.md
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-gate-ci-proof.js reports/fixtures/gate-ci-proof1/positive-json.json
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- npm.cmd run check:gate-ci-proof -- reports/fixtures/gate-ci-proof1/positive-markdown.md
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-sprint-command-log.js CI-GATE-PROOF-1
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-lead-review-substance.js CI-GATE-PROOF-1
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-GATE-PROOF-1-result.md
node build-scripts/sprints/run-sprint-command.js CI-GATE-PROOF-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-GATE-PROOF-1 --complete
```

## Proof Required to Close

Proof to close must include review, validator, test, and remote GitHub
evidence:

- positive markdown and JSON samples pass;
- all negative samples fail for the intended reason through Jest;
- optional remote mode behavior is implemented without adding secrets;
- lead-review round 1 and round 2 pass;
- remote `platform-ci / validate-platform` passes on the reviewed commit;
- result states this hardens gate discipline only and authorizes no product or
  lesson readiness.

## Rollback plan

Rollback by reverting the checker, tests/samples, package script, instruction
update, and sprint evidence changes. No generated-output cleanup is required.

## Human review required

No additional human review is required. This is gate-protocol hardening within
the user's authorized packet.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/CI-GATE-PROOF-1-lead-review-assignment.md`
- `reports/sprints/CI-GATE-PROOF-1-lead-review-round1.md`
- `reports/sprints/CI-GATE-PROOF-1-lead-review-corrections.md`
- `reports/sprints/CI-GATE-PROOF-1-lead-review-round2.md`

## Stop Conditions

Stop if existing gate packet formats are too inconsistent for safe validation
and a smaller new-packet contract is needed first, if remote verification
requires unavailable permissions, or if any generated/protected output
changes.

## Next Authorized Work After Closure

After this sprint closes, proceed to `CI-GOVERNANCE-1` only if the user wants
the remaining lower-priority CI governance sprints now.
