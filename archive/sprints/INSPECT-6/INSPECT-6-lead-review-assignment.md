# INSPECT-6 Lead Review Assignment

Status: assigned
Date: 2026-06-09
Reviewer role: lead reviewer

## Scope

Review INSPECT-6 for closure readiness before the external teacher,
legal/privacy, and Dutch quality-inspection review starts.

INSPECT-6 is planning-only. The review must reject any accidental generator
implementation, generated evidence pack, dashboard gate, quality-ref
integration, Scale Gate integration, generated lesson-output mutation,
personal-data processing, or compliance/approval claim.

## Evidence To Inspect

```text
archive/sprints/INSPECT-6/INSPECT-6-authorisation.md
archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md
archive/sprints/INSPECT-6/INSPECT-6-planning-review.md
archive/sprints/INSPECT-6/INSPECT-6-correction-log.md
archive/sprints/INSPECT-6/INSPECT-6-generator-planning-packet.md
archive/sprints/INSPECT-6/INSPECT-6-validation-log.md
docs/inspection-standards/report-only-generator-plan.md
docs/inspection-standards/evidence-pack-source-contract.md
docs/inspection-standards/evidence-pack-validation-and-dispatch.md
docs/inspection-standards/external-review-privacy-and-claim-guardrails.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/quality-standards/quality-standards-end-state.md
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
reports/url-index.md
reports/github-agent-index-platform.md
reports/internal-dashboard/dashboard-data.json
```

## Review Questions

| Question | Expected result |
|---|---|
| Did INSPECT-6 stay within the authorised planning-only scope? | pass/revise |
| Are all future generator claims tied to concrete product/review evidence rather than planning records alone? | pass/revise |
| Is the future teacher first screen understandable to a Dutch vwo economics teacher or school leader in 5-10 minutes? | pass/revise |
| Are `4veco evidence`, `school evidence still needed`, weak/missing evidence, and forbidden inference separated? | pass/revise |
| Are privacy/no-personal-data and later privacy/DPIA/data-processing gates explicit? | pass/revise |
| Are safe claim IDs/templates and semantic-overclaiming review strong enough before future generated prose? | pass/revise |
| Are OP0, OP1, OP2, OP3, OP6, and SKA boundaries preserved? | pass/revise |
| Is product evidence clearly separated from school-owned evidence and competent-authority judgement? | pass/revise |
| Does INSPECT-7 remain gated until tri-agent `MORE_THAN_SATISFIED` review and owner authorisation? | pass/revise |
| Are validation, map refresh, branch/worktree safety, and CI proof/waiver requirements recorded? | pass/revise |

## Required Output

Produce:

```text
archive/sprints/INSPECT-6/INSPECT-6-lead-review-round1.md
archive/sprints/INSPECT-6/INSPECT-6-lead-review-round2.md
```

## Required Next Action

Run lead-review round 1 after the packet is pushed or otherwise visible to the
lead reviewer. Apply any required corrections, record them, then run round 2
before external tri-agent review.
