# Lead Review Summary

Sprint: `EXAM-SOURCE-AUTH-1`

Round: lead review round 1

Generated: 2026-06-03

## Scope

Evidence inspected:

- `reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-baseline.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-planning-review.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-lead-review-assignment.md`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.plan.json`
- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-source-authority.md`
- `build-scripts/sprints/check-exam-source-authority1.js`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`
- `reports/sprints/EXAM-SOURCE-AUTH-1-command-log.jsonl`

The review checked external-primary authority, official source linkage, table
value matching, answer-model references, forbidden local substitute rejection,
and product-boundary enforcement.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Source authority contract | Lead-review subagent | `external_primary`, official item, overlay, prompt/correction PDFs, source material ID | pass |
| Overlay value matching | Lead-review subagent | Table-only source with exact Zoohee table values | pass |
| Answer-model authority | Lead-review subagent | Correction PDF refs and EUR 649 threshold | pass |
| Negative fixtures | Lead-review subagent | Exact forbidden-term rejection | revise |
| Boundary flags | Lead-review subagent | Every named product/source boundary key required and false | revise |

## Consolidated Verdict

Verdict: REVISE

Round 1 found two blocking checker weaknesses that must be corrected before
closure.

## Blocking Findings

Blocking findings existed in round 1:

1. Negative fixtures did not prove rejection for the exact forbidden proof
   terms. The checker only required some validation error, so a path mismatch
   could satisfy a forbidden-proof negative fixture.
2. Product-boundary enforcement was incomplete. The checker did not require all
   named boundary keys for product route adoption, target-equivalent proof,
   diagnostics, adaptive routing, mastery/sequencing, and PV.

## Specialist Findings

The canonical `sourceAuthority` is present and external-primary. The selected
overlay record is external-primary, table-only, and contains the expected
Zoohee table rows. The answer model references the correction PDF and includes
the EUR 649 threshold. Prompt and correction PDFs exist locally.

## Test Evidence

Command-log evidence existed for:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js EXAM-SOURCE-AUTH-1`
- `node build-scripts/sprints/check-exam-source-authority1.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`

Closure commands were not complete yet, as expected before round 2.

## Learning Quality Evidence

No student-facing learning surface was changed. The learning-quality relevance
is boundary preservation: later exam source-context learning tasks cannot claim
real exam proof without external-primary source authority and answer-model
references.

## Student Experience Evidence

No rendered student experience was changed. The student-experience risk is
indirect: weak source authority could allow future tasks to present local
official-style reconstructions as if they were official exam evidence.

## Ownership and Handoff

The main agent owns the correction. Required files to correct:

- `build-scripts/sprints/check-exam-source-authority1.js`
- `reports/sprints/EXAM-SOURCE-AUTH-1-lead-review-corrections.md`

## Required Next Action

Harden exact forbidden-term rejection and full product-boundary enforcement,
rerun the checker through the command wrapper, record corrections, and request
lead-review round 2.
