# INSPECT-6 Generator Planning Packet

Status: accepted by lead review and external tri-agent review
Date: 2026-06-09
Branch: `codex/quality-standards-20260608`

## Review Request

Please review INSPECT-6 as a planning-only sprint for a future report-only
generator.

Required reviewer roles:

- teacher reviewer;
- legal/privacy reviewer;
- Dutch quality-inspection reviewer.

Required verdict scale:

```text
REVISE
PASS
MORE_THAN_SATISFIED
```

The gate remains closed unless all three reviewers return
`MORE_THAN_SATISFIED`.

## Reviewed Scope

INSPECT-6 plans:

- report-only generator architecture;
- evidence-pack source contract;
- validation and dispatch strategy;
- safe-claim and semantic-overclaiming review requirements;
- teacher-facing output shape;
- INSPECT-7 readiness criteria.

INSPECT-6 does not implement a generator and does not generate an evidence
pack.

## Calibration Checks

| Check | Evidence | Expected judgement |
|---|---|---|
| Planning-only scope | `archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md`; `docs/inspection-standards/report-only-generator-plan.md` | No generator/evidence-pack implementation is introduced. |
| Source contract requires concrete evidence citations. | `docs/inspection-standards/evidence-pack-source-contract.md` | Every future claim needs product/review evidence. |
| Teacher first screen is planned. | `docs/inspection-standards/report-only-generator-plan.md` | A teacher/school leader can understand the planned output in 5-10 minutes. |
| Privacy default is no personal data. | `docs/inspection-standards/evidence-pack-source-contract.md`; `docs/inspection-standards/evidence-pack-validation-and-dispatch.md` | Personal data stops generation until a later privacy gate. |
| Safe claims and semantic review are planned. | `docs/inspection-standards/report-only-generator-plan.md` | Claim IDs/templates and semantic overclaiming review are required. |
| OP0 and product/school boundaries are planned. | `docs/inspection-standards/evidence-pack-source-contract.md` | OP0 remains subject-material; school-owned evidence remains school-owned. |
| INSPECT-7 remains gated. | `docs/inspection-standards/evidence-pack-validation-and-dispatch.md`; roadmap and ledger | Prototype starts only after tri-agent review and owner authorisation. |

## Evidence Links

INSPECT-6 artifacts:

```text
archive/sprints/INSPECT-6/INSPECT-6-authorisation.md
archive/sprints/INSPECT-6/INSPECT-6-sprint-plan.md
archive/sprints/INSPECT-6/INSPECT-6-planning-review.md
archive/sprints/INSPECT-6/INSPECT-6-correction-log.md
docs/inspection-standards/report-only-generator-plan.md
docs/inspection-standards/evidence-pack-source-contract.md
docs/inspection-standards/evidence-pack-validation-and-dispatch.md
```

Boundary and prior-review artifacts:

```text
archive/sprints/INSPECT-5R/INSPECT-5R-external-review-results.md
archive/sprints/INSPECT-5R/INSPECT-5R-closure-log.md
docs/inspection-standards/external-review-privacy-and-claim-guardrails.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md
```

Candidate INSPECT-7 evidence basis:

```text
references/authored/course-target-exercises.json
reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.json
reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/
```

Official boundary anchors:

```text
Inspectie OP0 Basisvaardigheden:
https://www.onderwijsinspectie.nl/onderwerpen/toezicht-2017/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025/info/op0

Inspectie bijgestelde onderzoekskaders 2025:
https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025

Autoriteit Persoonsgegevens verantwoordingsplicht:
https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verantwoordingsplicht

Autoriteit Persoonsgegevens DPIA:
https://autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia
```

## Stop Conditions

Return `REVISE` if:

- the plan implies generator implementation in INSPECT-6;
- the plan implies generated evidence packs in INSPECT-6;
- a future claim can rely on planning records alone;
- personal data can enter a pack without a later privacy gate;
- OP0 is blurred into complete OP0 or school-wide proof;
- product evidence is blurred into school-owned implementation, support,
  assessment, governance, or inspection judgement;
- teacher first-screen usefulness is not reviewable;
- INSPECT-7 readiness is not explicit.

Return `PASS` only if there are no blockers but you are not more than
satisfied. That still blocks progression.

Return `MORE_THAN_SATISFIED` only if the planning packet is strong enough to
authorise the repository owner to decide whether INSPECT-7 may prototype one
bounded pack.

## Teacher Review Questions

1. Can a Dutch vwo economics teacher or school leader understand the planned
   future pack output in 5-10 minutes?
2. Are scope, safe-use note, evidence summary, weak/missing evidence,
   school-owned evidence, and recommended next action visible?
3. Are `4veco evidence`, `school evidence still needed`, weak/missing evidence,
   and forbidden inference separated per category?
4. Does the plan avoid hiding weak evidence behind general positive wording?

Direct teacher comment prompts:

```text
Verdict:
Blocking findings:
Teacher-usefulness improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Legal/Privacy Review Questions

1. Does the plan keep personal data out by default?
2. Does the plan require a later privacy/DPIA/data-processing gate if personal
   data is ever proposed?
3. Do claim IDs/templates and semantic overclaiming review block legal,
   compliance, approval, certification, inspection-ready, PTA, summative,
   school-obligation, classroom-implementation, and AVG/GDPR overclaims?
4. Is the CI proof/waiver requirement still explicit for future dispatch?

Direct legal/privacy comment prompts:

```text
Verdict:
Blocking findings:
Privacy or claim-safety improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Dutch Quality-Inspection Review Questions

1. Does OP0 remain subject-material economics evidence only?
2. Are OP1, OP2, OP3, OP6, OP0, and SKA boundaries preserved?
3. Is product evidence separated from school-owned evidence and competent-
   authority judgement?
4. Is INSPECT-7 still gated until this packet passes tri-agent review and the
   owner explicitly authorises one bounded prototype?

Direct Dutch quality-inspection comment prompts:

```text
Verdict:
Blocking findings:
Inspection-boundary improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Dispatch Metadata Used

External review used:

```text
final_reviewed_commit_sha: 6217443be2a05c0aaa99ff5101d8dc85a1bb0a5f
remote_branch: origin/codex/quality-standards-20260608
remote_push_status: pushed
platform_ci_validate_platform: explicit CI waiver; gh run list returned []
local_validation_log: archive/sprints/INSPECT-6/INSPECT-6-validation-log.md
lead_review_round2: archive/sprints/INSPECT-6/INSPECT-6-lead-review-round2.md
correction_log: archive/sprints/INSPECT-6/INSPECT-6-correction-log.md
```

## Required Next Action

Close INSPECT-6 and open INSPECT-7 with a dedicated sprint plan and planning
review for one bounded no-personal-data prototype.
