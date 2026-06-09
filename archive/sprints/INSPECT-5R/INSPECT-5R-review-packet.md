# INSPECT-5R Review Packet

Status: validated locally, CI waiver recorded, pending lead review and external re-review
Date: 2026-06-09
Branch: `codex/quality-standards-20260608`
Sprint plan: `archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md`

## Review Request

Please review INSPECT-5R as a pre-INSPECT-6 guardrail sprint.

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

The gate remains closed unless all three reviewer roles return
`MORE_THAN_SATISFIED`. A `PASS` verdict is not enough to authorise INSPECT-6.

## Reviewed Scope

INSPECT-5R adds review protocol, privacy/no-personal-data defaults,
safe-claim templates, a teacher-facing pack template, OP0/product-school
boundary wording, roadmap/ledger updates, stale-next-step cleanup, and review
artifacts.

INSPECT-5R does not add a report-only generator, evidence pack, teacher pack
generator, dashboard gate, quality-ref integration, Scale Gate integration,
country overlay, CI/build integration, personal-data processing, generated
lesson-output mutation, or compliance/approval claim.

## Calibration Checks

| Check | Evidence | Expected reviewer judgement |
|---|---|---|
| Sprint plan exists and passed planning review. | `archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md`; `archive/sprints/INSPECT-5R/INSPECT-5R-planning-review.md` | No implementation proceeded before a passed plan. |
| Initial tri-agent `REVISE` findings are recorded. | `archive/sprints/INSPECT-5R/INSPECT-5R-external-review-intake.md` | The packet responds to teacher, legal/privacy, and Dutch quality-inspection blockers. |
| Tri-agent `MORE_THAN_SATISFIED` stop rule is encoded. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`; `docs/roadmaps/quality-standards/sprint-ledger.md` | `PASS` is not enough; all three roles must be more than satisfied. |
| Teacher-facing usefulness is operational. | `docs/inspection-standards/teacher-facing-evidence-pack-template.md` | A Dutch vwo economics teacher/school leader can understand the output shape in 5-10 minutes. |
| Privacy boundary is operational. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md` | Evidence packs contain no student-level personal data by default. |
| Claim safety is operational for future prose. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md` | Future generated prose must use claim IDs/templates and evidence citations. |
| OP0 and product/school boundaries remain visible. | `docs/inspection-standards/teacher-facing-evidence-pack-template.md`; `docs/inspection-standards/nl-vo-evidence-model.md` | OP0 is subject-material only; school-owned evidence stays school-owned. |
| INSPECT-6/7 remain unauthorised. | `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`; `docs/roadmaps/quality-standards/sprint-ledger.md` | INSPECT-5R does not smuggle in generator planning or evidence packs. |

## Evidence Links

Core INSPECT-5R artifacts:

```text
archive/sprints/INSPECT-5R/INSPECT-5R-sprint-plan.md
archive/sprints/INSPECT-5R/INSPECT-5R-planning-review.md
archive/sprints/INSPECT-5R/INSPECT-5R-external-review-intake.md
archive/sprints/INSPECT-5R/INSPECT-5R-correction-log.md
docs/inspection-standards/external-review-privacy-and-claim-guardrails.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
docs/inspection-standards/nl-vo-evidence-model.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
docs/roadmaps/quality-standards/quality-standards-end-state.md
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
```

Evidence basis for teacher-template calibration:

```text
archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md
references/authored/course-target-exercises.json
reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.json
reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md
../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/
```

Official source anchors:

```text
https://www.onderwijsinspectie.nl/onderwerpen/toezicht-2017/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2025/info/op0
https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/verantwoordingsplicht
https://autoriteitpersoonsgegevens.nl/themas/basis-avg/praktisch-avg/data-protection-impact-assessment-dpia
```

## Stop Conditions

Return `REVISE` if any of these are true:

- INSPECT-6 generator planning is treated as authorised.
- INSPECT-7 evidence-pack prototyping is treated as authorised.
- The teacher-facing template is not usable for a Dutch vwo economics teacher
  or school leader in 5-10 minutes.
- Personal data is allowed into packs without a later privacy/DPIA/data-
  processing gate.
- Future claim wording can imply compliance, approval, certification,
  inspection-readiness, complete OP0/basic-skills evidence, PTA validity,
  summative validity, school-obligation satisfaction, classroom
  implementation, or school SKA compliance.
- OP0 is described as complete OP0 evidence rather than subject-material
  economics evidence relevant to basic-skills preparation.
- Product evidence is blurred with school-owned implementation, support,
  assessment, governance, or inspection-judgement evidence.
- The packet lacks reviewed commit SHA, remote push proof, validation evidence,
  or CI proof/waiver at dispatch time.

Return `PASS` only if there are no blockers but you are not more than
satisfied. That still blocks progression.

Return `MORE_THAN_SATISFIED` only if the packet is strong, safe, operational,
and clear enough to authorise the next review step.

## Teacher Review Questions

1. Can a Dutch vwo economics teacher or school leader understand the future
   pack shape in 5-10 minutes?
2. Does the template clearly say what evidence exists, what is weak, what is
   missing, and what the school must still supply?
3. Are OP1, OP0, OP3, OP2, OP6, and SKA explained plainly enough for school
   conversation without becoming inspection advice?
4. Does the template avoid hiding weak evidence behind generic positive
   language?

Direct teacher comment prompts:

```text
Verdict:
Blocking findings:
Teacher-usefulness improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Legal/Privacy Review Questions

1. Is the no-personal-data default strong enough for INSPECT-6/7?
2. Does the later privacy/DPIA/data-processing gate name enough prerequisites
   before personal data can enter generated evidence packs?
3. Do the safe-claim templates and forbidden paraphrase families block legal,
   compliance, approval, certification, inspection-ready, PTA, summative, and
   school-obligation overclaims?
4. Is it clear that this packet is not legal advice, a DPIA, or a compliance
   certificate?

Direct legal/privacy comment prompts:

```text
Verdict:
Blocking findings:
Privacy or claim-safety improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Dutch Quality-Inspection Review Questions

1. Are OP1, OP0, OP3, OP2, OP6, and SKA boundaries accurate enough for a
   bounded Dutch VO quality-standards project?
2. Does OP0 stay subject-material and avoid complete school-wide OP0,
   mathematics/arithmetic, Dutch-language, or citizenship claims?
3. Is the product/school boundary visible per category?
4. Do INSPECT-6 and INSPECT-7 remain closed until the required review and owner
   authorisation happen?

Direct Dutch quality-inspection comment prompts:

```text
Verdict:
Blocking findings:
Inspection-boundary improvements required:
Evidence needed for MORE_THAN_SATISFIED:
```

## Dispatch Metadata

Before this packet is sent for external re-review, the dispatch must record:

```text
reviewed_content_commit_sha: 5dff7e4a
remote_branch: origin/codex/quality-standards-20260608
remote_push_status: pushed
platform_ci_validate_platform: explicit CI waiver; gh run list returned [] for the branch after implementation commit 5dff7e4a
local_validation_log: archive/sprints/INSPECT-5R/INSPECT-5R-validation-log.md
lead_review_round2: pending before external dispatch
```

## Required Next Action

Run lead review, push any correction records, and send this packet to the
teacher, legal/privacy, and Dutch quality-inspection reviewers. Do not
authorise INSPECT-6 unless all three return `MORE_THAN_SATISFIED`.
