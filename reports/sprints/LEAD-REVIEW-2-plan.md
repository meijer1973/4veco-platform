# Sprint LEAD-REVIEW-2: Lead-Review Strict Validation

Generated: 2026-05-31

## Goal

Make lead-review validation stricter so future sprint bundles cannot bypass
lead review through backdated metadata, casual exemptions, thin review files,
or untracked PASS WITH FLAGS dispositions.

## Context

LEAD-REVIEW-1 repaired the normal lead-review path and ran real lead-review
audits for recent non-MTU/non-human-gated sprints. The remaining weakness is
that the validator still trusts `created` metadata too much and checks
lead-review artifact presence more than lead-review artifact content.

This sprint hardens that path before `GRAPH-UX-2` proceeds.

## Quality Standard

The quality floor is deterministic specification enforcement, not advisory
guidance. Proof must show that future sprint bundles cannot silently skip lead
review by backdating, cannot exempt human gates, cannot close PASS WITH FLAGS
without explicit flag disposition, and cannot satisfy lead review with empty or
thin files. This sprint changes process validation only; rendered output is not
changed, and there is no student-facing output except named follow-up work.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Future sprint bundles cannot bypass lead review by backdating | Introduce an explicit legacy-grandfather list and apply policy to any sprint not on that list | Negative fixture where a backdated new sprint fails | planned |
| Human-review gates cannot bypass pre-gate lead review | Reject lead-review exemptions for human-review sprint metadata or inferred human gates | Negative fixture where a human gate with exemption fails | planned |
| Lead-review files must contain real review structure | Validate required lead-review report sections, sprint id, round label, evidence inspected, verdict, findings, and next action | Negative fixture where thin lead-review files fail | planned |
| PASS WITH FLAGS must preserve concrete flags | Require structured `lead_review.flags` entries when final verdict is PASS WITH FLAGS | Negative fixture where PASS WITH FLAGS without flags fails | planned |
| Stricter policy remains compatible with repaired current bundles | Keep LEAD-REVIEW-1 and recent repaired bundles validating, with strict semantics active for LEAD-REVIEW-2 and future bundles | Complete bundle validation and lead-review recheck | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add legacy-grandfather list | `include_now` | This closes the backdating loophole while keeping old bundles inspectable. |
| Add semantic lead-review report checks | `include_now` | Presence-only review files are too easy to fake. |
| Require structured flag disposition | `include_now` | PASS WITH FLAGS must produce actionable carried flags, not vague caveats. |
| Require human reviewer signatures for every exemption through an external identity provider | `defer_named_follow_up` | Useful later, but not available in current local validation. |
| Reopen MTU human-gated sprints | `reject_scope_creep` | The user explicitly excluded already human-gated MTU sprints from retroactive re-review. |

## Allowed paths

- `build-scripts/sprints/check-sprint-bundle.js`
- `build-scripts/sprints/check-lead-review-strict-fixtures.js`
- `references/data/sprints/lead-review-policy-legacy-exemptions.json`
- `reports/sprints/LEAD-REVIEW-2-*`
- `references/data/sprints/LEAD-REVIEW-2.*.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- generated repository maps and URL indexes

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- generated lesson output under `../4veco-lessen/Boek *`
- MTU human-review gate closure rewrites
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `build-scripts/sprints/check-sprint-bundle.js`
- `reports/sprints/LEAD-REVIEW-1-result.md`
- `reports/sprints/LEAD-REVIEW-1-lead-review-round2.md`
- Existing sprint plan metadata under `references/data/sprints/`
- `AGENTS.md`

## Outputs

- Stricter sprint-bundle checker.
- Legacy-grandfather data file for pre-policy bundles.
- Strict negative/positive fixture validator.
- LEAD-REVIEW-2 plan, baseline, result, diff summary, metadata, and
  lead-review cycle.
- Roadmap and index refresh.

## Operationalized sprint procedure

1. Create the LEAD-REVIEW-2 plan and baseline before implementation.
2. Add an explicit grandfather list for existing pre-policy bundles that do not
   carry lead review. Stop if the list would mask new work or reopen MTU human
   gates.
3. Patch `check-sprint-bundle.js` so future bundles not on the grandfather
   list require lead review regardless of backdated `created` values.
4. Add semantic report validation for required lead-review sections, round
   labels, evidence inspected, verdict matching, and flag disposition.
5. Add a strict fixture checker with positive and negative cases.
6. Run the strict fixture checker, sprint bundle checks, report/roadmap/scope
   validators, protected-reference diff checks, and generated-output diff
   checks.
7. Run the actual lead-review cycle for LEAD-REVIEW-2. Stop if round 2 is not
   PASS or PASS WITH FLAGS.
8. Refresh maps/indexes, fetch/prune, commit, push, and report the pushed
   hashes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/LEAD-REVIEW-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-2
node build-scripts/sprints/check-lead-review-strict-fixtures.js
node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-1 --complete
node build-scripts/sprints/check-sprint-bundle.js LEAD-REVIEW-2 --complete
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

## Proof Required to Close

Proof required to close must include strict fixture results for all intended
failure branches, LEAD-REVIEW-2 lead-reviewer-agent audit artifacts, complete
bundle validation, report JSON validation, roadmap version validation,
scope-language validation, URL-index validation, diff checks, refreshed
repository maps/indexes, and a clear next action: resume `GRAPH-UX-2` after
strict lead-review validation closes.

## Rollback plan

If this sprint is rejected, revert the checker patch, strict fixture checker,
legacy-grandfather data file, LEAD-REVIEW-2 records, roadmap/index updates, and
generated maps. Do not edit protected references, generated lesson output,
target-exercise mappings, answer-skill candidate storage, or MTU gate closures
as part of rollback.

## Human review required

No interactive human review gate is required for this process hardening sprint
because the user explicitly authorized stricter lead-review validation in this
thread. A lead-review cycle is required for this sprint and must be completed
before closure.
