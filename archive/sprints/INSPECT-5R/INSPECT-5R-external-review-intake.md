# INSPECT-5R External Review Intake

Status: intake recorded
Date: 2026-06-09
Reviewed commit: `178c12ea73ac7228e877779f9b282d9b1c5076c7`
Branch: `codex/quality-standards-20260608`

## Purpose

This intake records the first teacher, legal, and Dutch quality-inspection
external-agent reviews after INSPECT-5. All three returned `REVISE`, so the
roadmap must insert INSPECT-5R before INSPECT-6.

## Reviewers

| Role | Agent | Verdict | Core blocker |
|---|---|---|---|
| Teacher reviewer | Zeno, `019eab3d-303e-7f13-93f6-c70a4d01aad5` | `REVISE` | INSPECT-6/7 path was not teacher-operational and lacked a teacher-facing output shape. |
| Legal/privacy reviewer | Fermat, `019eab3d-6ac1-7042-9911-a5e26cd7a925` | `REVISE` | Tri-agent rule, privacy/AVG guardrails, and generated-claim safety were not encoded. |
| Dutch quality-inspection reviewer | Pauli, `019eab3d-ac35-7ad0-a832-6f27a40975e0` | `REVISE` | INSPECT-6/7 remained unauthorised, the tri-agent stop rule was missing, and OP0 boundaries needed operational pack wording. |

## Shared Findings

- INSPECT-6 and INSPECT-7 remained candidate future sprints, not authorised
  work.
- The user-required teacher/legal/inspection review gate and
  `MORE_THAN_SATISFIED` threshold were not encoded in the roadmap or ledger.
- The next step after INSPECT-5 needed an added guardrail sprint before any
  generator planning.
- Future output must be useful to a Dutch vwo economics teacher or school
  leader, not only a JSON/report object.
- Future packs must expose weak and missing evidence, school-owned evidence,
  and forbidden inferences.
- Privacy boundaries were under-specified for evidence packs.
- Claim safety had to move beyond exact forbidden-phrase checks before any
  generated teacher/school-facing prose.
- OP0/basic-skills boundaries had to remain subject-material and not become
  complete OP0, school-wide, or citizenship-curriculum claims.
- `docs/inspection-standards/nl-vo-evidence-model.md` still pointed to
  INSPECT-4 as the recommended next step.

## Implemented Response Map

| Reviewer requirement | INSPECT-5R artifact |
|---|---|
| Add tri-agent review gate and `MORE_THAN_SATISFIED` stop rule. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`; roadmap and ledger updates. |
| Add teacher-facing evidence-pack output shape. | `docs/inspection-standards/teacher-facing-evidence-pack-template.md`. |
| Add privacy/AVG no-personal-data default and later DPIA/data-processing gate. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`. |
| Add safe-claim contract for future generated prose. | `docs/inspection-standards/external-review-privacy-and-claim-guardrails.md`. |
| Keep OP0 subject-material and product/school boundaries visible. | `docs/inspection-standards/teacher-facing-evidence-pack-template.md`; roadmap and evidence-model updates. |
| Fix stale next-step language. | `docs/inspection-standards/nl-vo-evidence-model.md`. |
| Keep INSPECT-6 planning-only and INSPECT-7 bounded. | INSPECT-5R sprint plan, roadmap, and ledger. |

## Required Next Action

Complete INSPECT-5R implementation, validate, lead-review, push the review
packet, and ask the same three external reviewer roles for
`MORE_THAN_SATISFIED` re-review.
