# INSPECT-7 Lead Review Assignment

Status: assigned
Date: 2026-06-09
Reviewer role: lead reviewer

## Scope

Review INSPECT-7 for closure readiness before the external teacher,
legal/privacy, and Dutch quality-inspection review starts.

INSPECT-7 is one bounded no-personal-data report-only prototype. The review
must reject any accidental reusable generator, package script, CI gate,
dashboard gate, quality-ref integration, Scale Gate integration, country
overlay, lesson-output mutation, personal-data processing, or
compliance/approval claim.

## Evidence To Inspect

```text
archive/sprints/INSPECT-7/INSPECT-7-authorisation.md
archive/sprints/INSPECT-7/INSPECT-7-sprint-plan.md
archive/sprints/INSPECT-7/INSPECT-7-planning-review.md
archive/sprints/INSPECT-7/INSPECT-7-correction-log.md
archive/sprints/INSPECT-7/INSPECT-7-review-packet.md
archive/sprints/INSPECT-7/INSPECT-7-validation-log.md
archive/sprints/INSPECT-7/build-inspect-7-prototype.js
references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json
docs/inspection-standards/evidence-pack-source-contract.md
docs/inspection-standards/evidence-pack-validation-and-dispatch.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
reports/url-index.md
reports/github-agent-index-platform.md
reports/internal-dashboard/dashboard-data.json
```

## Review Questions

| Question | Expected result |
|---|---|
| Did INSPECT-7 stay within one bounded no-personal-data prototype scope? | pass/revise |
| Is the assembler narrow, fixed-path, and not a reusable production generator? | pass/revise |
| Do source, Markdown, and JSON outputs preserve the INSPECT-6 source contract? | pass/revise |
| Does the teacher first screen work in 5-10 minutes? | pass/revise |
| Are `4veco evidence`, school evidence still needed, weak/missing evidence, and forbidden inference separated per category? | pass/revise |
| Are OP0 and product/school/authority boundaries preserved? | pass/revise |
| Are privacy/no-personal-data and later privacy gate boundaries explicit? | pass/revise |
| Are weak/local/PASS WITH FLAGS evidence states visible? | pass/revise |
| Is CI proof or explicit CI waiver recorded without implying a CI pass? | pass/revise |
| Is the packet ready for teacher, legal/privacy, and Dutch quality-inspection `MORE_THAN_SATISFIED` review? | pass/revise |

## Required Output

Produce:

```text
archive/sprints/INSPECT-7/INSPECT-7-lead-review-round1.md
archive/sprints/INSPECT-7/INSPECT-7-lead-review-round2.md
```

## Required Next Action

Run lead-review round 1 after the packet is pushed or otherwise visible to the
lead reviewer. Apply any required corrections, record them, then run round 2
before external tri-agent review.
