# Lead Review Assignment

Sprint: `EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1`

## Scope

Review the implemented currentness hardening bundle for durable evidence
governance. Confirm that the manifest, classifier, checker, stale-checker
guards, metadata status fields, roadmap annotations, npm wiring, and CI wiring
satisfy the sprint plan.

## Evidence To Inspect

- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-plan.md`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-baseline.md`
- `references/data/exercise-surface-manifest.json`
- `build-scripts/lib/exercise-currentness.js`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `package.json`
- `.github/workflows/platform-ci.yml`
- `references/data/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1.plan.json`
- `reports/sprints/EXERCISE-EVIDENCE-CURRENTNESS-HARDENING-1-command-log.jsonl`

## Reviewer Instructions

Use REV-STD-1. Cite product end-state and sprint-plan authority where relevant,
name non-negotiable requirements, classify findings, and include
blocks / does_not_block / proof_required_to_close for carried issues.

The reviewer is a sub-agent lead reviewer. The expected output is PASS,
PASS WITH FLAGS, REVISE, FAIL, or PAUSE.
