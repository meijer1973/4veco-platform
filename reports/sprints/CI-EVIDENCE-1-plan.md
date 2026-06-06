# Sprint CI-EVIDENCE-1: Cross-Repo Checkout Evidence Artifact

Generated: 2026-06-06

## Goal

Make each remote `platform-ci / validate-platform` run reproducible by
uploading a JSON evidence artifact that records the exact platform checkout,
lesson-target checkout, runtime versions, and package-lock hash used by the
run.

This sprint changes CI/build-authoring evidence only. It does not change
generated lesson output, protected references, source data, target registries,
candidate storage, PV outputs, product routes, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1, or
student/product use.

## Context

The workflow already checks out `4veco-platform` and `4veco-lessen` as
siblings, which is the correct access model. Current evidence records the
platform commit for the run, but not the exact lesson-target SHA validated
alongside it. Reviewers need the sibling checkout state without relying on
local assumptions.

## Quality Standard

The specification quality floor is a reproducible, non-dirty CI artifact:

- evidence JSON must be written outside both tracked repositories;
- required fields must include workflow/job/run metadata, platform SHA, lessen
  SHA, runtime versions, package-lock hash, and creation time;
- a local checker must validate required keys, SHA shape, package hash, and
  sibling paths;
- rendered output and student-facing routes remain intentionally unchanged;
- proof must show the artifact is uploaded with `platform-ci-diagnostics` and
  no follow-up is hidden if artifact upload or SHA discovery fails.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Record platform and lessen SHAs | CI evidence JSON has both repository blocks | Local checker and remote artifact inspection | planned |
| Keep repos clean | Artifact path is outside `4veco-platform` and `4veco-lessen` | Diff hygiene for both repos | planned |
| Record runtime/package evidence | JSON includes node, python, and package-lock SHA-256 | Checker validates shape | planned |
| Upload with existing artifact | Workflow upload path includes `ci-artifacts/platform-ci-evidence.json` | Remote artifact listing and content inspection | planned |
| Preserve boundaries | No lesson target or protected reference changes | Diff summary and lessen diff hygiene | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Write evidence into `reports/` during CI. | reject_scope_creep | It would dirty the tracked platform checkout. |
| Write evidence into `4veco-lessen`. | reject_scope_creep | The lesson target is generated/student-facing and not an evidence-write location. |
| Use `$GITHUB_WORKSPACE/ci-artifacts/platform-ci-evidence.json`. | include_now | It is outside both tracked repositories and can be uploaded directly. |
| Include dependency tree hashes beyond package-lock. | defer_named_follow_up | Useful later, but package-lock hash is enough for this sprint. |
| Add high-privilege GitHub permissions. | reject_scope_creep | The evidence can be produced with current read-only checkout state. |

## Allowed paths

- `.github/workflows/platform-ci.yml`
- `build-scripts/ci/platform-ci-evidence.js`
- `build-scripts/ci/platform-ci-evidence.test.js`
- `reports/sprints/CI-EVIDENCE-1-*`
- `references/data/sprints/CI-EVIDENCE-1.plan.json`
- `references/data/sprints/CI-EVIDENCE-1.result.json`
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

- `.github/workflows/platform-ci.yml`
- `package-lock.json`
- `build-scripts/sprints/run-sprint-command.js`
- `reports/sprints/CI-REMOTE-1A-result.md`
- Git metadata from `4veco-platform` and `../4veco-lessen`

## Outputs

No student-facing or generated lesson output is generated or changed.

Required outputs:

- CI evidence helper/checker and tests;
- workflow step that writes `$GITHUB_WORKSPACE/ci-artifacts/platform-ci-evidence.json`;
- upload-artifact path for that JSON;
- sprint plan, baseline, planning review, command log, lead-review cycle,
  result, diff summary, and plan/result JSON;
- remote artifact proof after push.

## Operationalized sprint procedure

1. Confirm the platform and lesson target are sibling checkouts and stop if
   the lesson target path is missing.
2. Implement a helper that writes evidence only to an explicit output path
   outside tracked repos, then validate the generated JSON locally.
3. Add tests for required keys, SHA shape, missing path failure, and
   package-lock hash validation.
4. Add the workflow step after Node/Python setup and add the evidence JSON to
   the existing artifact upload path.
5. Run acceptance validators through `run-sprint-command.js`; stop if either
   repository becomes dirty or if evidence is written into a tracked path.
6. Complete lead-review round 1, correction log, and round 2 before closure.
7. Push and verify remote CI success, then inspect the uploaded artifact for
   platform SHA, lessen SHA, and required metadata.

## Acceptance tests

```bash
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/CI-EVIDENCE-1-plan.md
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/ci/platform-ci-evidence.js write --output ..\ci-artifacts-local\platform-ci-evidence.json --platform-path . --lessen-path ..\4veco-lessen
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/ci/platform-ci-evidence.js check ..\ci-artifacts-local\platform-ci-evidence.json --platform-path . --lessen-path ..\4veco-lessen
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- git diff --check
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-sprint-command-log.js CI-EVIDENCE-1
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-lead-review-substance.js CI-EVIDENCE-1
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/CI-EVIDENCE-1-result.md
node build-scripts/sprints/run-sprint-command.js CI-EVIDENCE-1 -- node build-scripts/sprints/check-sprint-bundle.js CI-EVIDENCE-1 --complete
```

## Proof Required to Close

Proof to close must include review, validator, test, and remote GitHub
evidence:

- remote artifact contains `platform-ci-evidence.json`;
- evidence records both platform and lessen SHAs;
- evidence records runtime and package-lock hash fields;
- neither checked-out repository is dirty from evidence creation;
- lead-review round 1 and round 2 pass;
- remote `platform-ci / validate-platform` passes on the reviewed commit;
- result records run ID, platform SHA, lessen SHA, and artifact name/id when
  available.

## Rollback plan

Rollback by reverting the CI evidence helper, tests, workflow step, artifact
upload path, and sprint evidence changes. No generated-output cleanup is
required.

## Human review required

No additional human review is required. This is CI evidence hardening within
the user's authorized packet.

## Lead Review Required

Lead review is required before closure.

Lead review artifacts:

- `reports/sprints/CI-EVIDENCE-1-lead-review-assignment.md`
- `reports/sprints/CI-EVIDENCE-1-lead-review-round1.md`
- `reports/sprints/CI-EVIDENCE-1-lead-review-corrections.md`
- `reports/sprints/CI-EVIDENCE-1-lead-review-round2.md`

## Stop Conditions

Stop if evidence writes into either tracked repository, if `4veco-lessen` SHA
cannot be determined, if artifact upload needs unavailable permissions, or if
any protected reference/source-data/product-route surface changes.

## Next Authorized Work After Closure

After this sprint closes, proceed to `CI-GATE-PROOF-1` unless remote artifact
proof is blocked.
