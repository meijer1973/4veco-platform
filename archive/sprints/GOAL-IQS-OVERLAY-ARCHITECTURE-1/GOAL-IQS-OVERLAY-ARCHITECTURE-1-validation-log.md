# GOAL-IQS-OVERLAY-ARCHITECTURE-1 Validation Log

Status: local validation passed before and after rebase
Date: 2026-06-22

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec:
  `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`
- Foundation decision source:
  `reports/inspection-standards/international-foundation-decision.md`

## Non-Negotiable Requirements

- Use REV-STD-1 for the validation record and final review packet.
- Preserve explicit source and output allowlists.
- Preserve deterministic currentness and refusal checks.
- Preserve blocked authority for country editions, evidence packs,
  teacher/school-facing output, public output, package/CI product integration,
  dashboard gates, quality-ref or Scale Gate integration, product-route
  adoption, diagnostics/mastery/PV, student/product use, personal-data
  processing, compliance, approval, OP0, PTA, summative, accreditation, and
  inspection-readiness claims.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| Deterministic overlay generator produces the exact governed output set | passed | `node build-scripts/inspection/build-international-overlay-architecture.js --check` PASS |
| Overlay architecture checker validates schema, descriptors, docs, reports, currentness, and refusals | passed | `node build-scripts/inspection/check-international-overlay-architecture.js` PASS |
| Refusal tests cover forbidden audiences, authority jumps, generated lesson scans, globbing, and jurisdiction overreach | passed | Overlay checker reports `refusal_cases=31`; Jest refusal smoke tests PASS |
| Roadmap/index records are current | passed | `node build-scripts/references/check-roadmap-version-index.js` PASS |
| Scope-language guardrails are preserved | passed | `npm.cmd run check:scope-language` PASS |
| Report JSON remains contract-valid | passed | `node build-scripts/reports/validate-report-json.js` PASS |
| URL index remains current | passed | `node build-scripts/sprints/emit-url-index.js --check` PASS |
| Platform tests pass | passed | `npm.cmd run check:platform` PASS |
| Diff hygiene passes | passed | `git diff --check` PASS and evidence line endings PASS |

## Validation Commands

```text
node build-scripts/inspection/build-international-overlay-architecture.js
PASS

node build-scripts/inspection/check-international-overlay-architecture.js
OK international overlay architecture check descriptors=4 archetypes=4 crosswalk_rows=10 refusal_cases=31 decision=PROCEED_TO_SELECTED_JURISDICTION_DEEPENING

node build-scripts/inspection/build-international-overlay-architecture.js --check
OK international overlay architecture outputs are current.

node build-scripts/references/check-roadmap-version-index.js
OK roadmap version index covers 152 roadmap file(s).

npm.cmd run check:scope-language
OK scope-language check: active surfaces

node build-scripts/reports/validate-report-json.js
OK report JSON contract: 14 report(s)

node build-scripts/sprints/emit-url-index.js --check
OK url-index: reports/url-index.md is current

git diff --check
PASS

node build-scripts/ci/check-evidence-line-endings.js
OK evidence line endings: scanned 87 text file(s); CRLF files: 0
```

The first platform test attempt needed workspace dependencies installed in this
new worktree. `npm.cmd ci` completed successfully with pre-existing audit
warnings reported by npm: 1 low and 17 moderate vulnerabilities. No dependency
files changed.

```text
npm.cmd run check:platform
PASS

Test Suites: 58 passed, 6 skipped, 64 total
Tests:       822 passed, 8 skipped, 830 total
```

The platform test run retained existing diagnostic fixture noise such as
`Cannot parse chapter folder name: bad-name`; the command completed
successfully.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Local validation passed after specialist corrections. | `core_requirement_met` | Nothing for lead architecture review. | Proceeding to lead architecture review and final PR review. | Re-run final validation after rebase and before PR finalization. |
| `npm.cmd ci` reported existing audit warnings. | `minor_carry_flag` | Dependency/security closure claims for this sprint. | Overlay architecture PR because it does not change dependencies and validation passed. | Separate dependency-audit maintenance item if the owner chooses to address npm audit findings. |
| Branch was later observed behind `origin/main`. | `freshness_required` | Human-review readiness until rebase and final validation pass. | Local architecture content review. | Rebase onto current `main`, re-run validation, push PR, confirm green CI and mergeability. |

## Post-Rebase Validation

The branch was rebased onto `origin/main` after the lead architecture review.
`npm.cmd ci` was rerun because the upstream `main` changes touched platform
package surfaces. It completed successfully and again reported the same npm
audit warning class: 1 low and 17 moderate vulnerabilities. No dependency files
changed.

```text
git rebase origin/main --autostash
Successfully rebased and updated refs/heads/codex/goal-iqs-overlay-architecture-1-20260622.

node build-scripts/inspection/check-international-overlay-architecture.js
OK international overlay architecture check descriptors=4 archetypes=4 crosswalk_rows=10 refusal_cases=31 decision=PROCEED_TO_SELECTED_JURISDICTION_DEEPENING

node build-scripts/inspection/build-international-overlay-architecture.js --check
International overlay architecture output is current.

npx.cmd jest build-scripts/inspection/check-international-overlay-architecture.test.js --runInBand
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total

node build-scripts/references/check-roadmap-version-index.js
OK roadmap version index: 152 entries

npm.cmd run check:scope-language
OK scope-language check: active surfaces

node build-scripts/reports/validate-report-json.js
OK report JSON contract: 14 report(s)

node build-scripts/sprints/emit-url-index.js --check
OK url-index: reports/url-index.md is current

git diff --check
PASS

node build-scripts/ci/check-evidence-line-endings.js
OK evidence line endings: scanned 87 text file(s), skipped 0, CRLF 0

npm.cmd run check:platform
Test Suites: 58 passed, 6 skipped, 58 of 64 total
Tests:       826 passed, 8 skipped, 834 total
```

The platform test run retained existing diagnostic fixture noise such as
`Cannot parse chapter folder name: bad-name`; the command completed
successfully.

## Post-Rebase Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Rebase onto current `main` completed cleanly and validation passed. | `core_requirement_met` | Nothing for PR publication. | Proceeding to commit, PR publication, CI, and final lead review. | Confirm remote PR is fresh, mergeable, and green after push. |
| Dependency audit warnings remained present after `npm.cmd ci`. | `minor_carry_flag` | Dependency/security closure claims. | Overlay architecture PR because it does not change dependencies and validation passed. | Separate dependency-audit maintenance item if owner authorizes it. |
