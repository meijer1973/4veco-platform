# GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1 Correction Log

Status: corrections resolved locally before PR publication
Date: 2026-06-24

## Product End-State And Original Sprint/Gate Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Controlling roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## Non-Negotiable Requirements

- Use REV-STD-1.
- Preserve the accepted selected-deepening decision as planning authority only.
- Keep all downstream product, school-facing, public, evidence-pack, Scale Gate,
  diagnostics/mastery/PV, student/product-use, personal-data, compliance,
  OP0, PTA, summative, inspection-readiness, support-sufficiency, and
  accommodation-sufficiency authority blocked.
- PASS WITH FLAGS may not carry a missing core requirement.

## Corrections Applied

| Finding | Classification | blocks | does_not_block | proof_required_to_close | Resolution |
|---|---|---|---|---|---|
| Active roadmap/index prose contained restricted scope wording outside masked identifiers. | `core_spec_failure` | Scope-language validation and PR publication. | Internal planning implementation. | `npm.cmd run check:scope-language` PASS. | Reworded active prose to trial/planning language while preserving formal identifiers in code spans or JSON-neutral prose. |
| Generated report titles and prose overused restricted scope wording. | `quality_improvement_available` | Nothing after scope-language PASS. | Planning packet review. | Generator currentness PASS after regeneration. | Changed generated human-facing titles/prose to internal overlay trial planning while keeping file names and historical decision identifiers stable. |
| Dutch product-boundary reviewer found the generated sprint-plan title/body did not satisfy the shared sprint-plan checker. | `core_spec_failure` | Human-review-ready proof. | Product/school-boundary content review. | `node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md` PASS. | Regenerated the sprint plan with `# Sprint <id>: <name>` format and all required checker sections. |
| Accessibility reviewer found support/accommodation boundary fields were not explicit enough. | `minor_carry_flag` | Later trial-contract draft/schema acceptance and any support/accommodation sufficiency claim. | Current internal planning review. | Accessibility re-review PASS; checker and focused Jest PASS. | Added support/accommodation blocked authority flags, blocker-display fields, parser refusals, checker assertions, and focused refusal tests. |
| Legal/privacy reviewer noted canonical refusal matrix rows did not list several parser-enforced synonyms. | `documentation_symmetry_carry` | Perfect refusal-matrix exhaustiveness in later contract work. | Current legal/privacy PASS because synonyms already failed closed. | Checker reports 43 refusal cases. | Added matrix rows for external/student-facing/data-processing/approved/inspection-readiness/AQA-approval and support/accommodation synonyms. |
| `--aqa-approval` initially matched the general approval guard before the jurisdiction-overgeneralisation guard. | `core_spec_failure` | Jurisdiction-source refusal proof. | Other refusal classes. | Packet checker PASS with `--aqa-approval` expecting `STOP_GOVERNANCE_OVERGENERALISATION`. | Moved the governance-overgeneralisation parser guard before the general compliance/approval guard. |

## Carried Issues

| Issue | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Final exact-head lead review, CI, branch protection, and PR Readiness Reviewer proof cannot exist until the PR branch is pushed. | `scale_blocker` | Human approval and merge. | Local validation, specialist review, commit, push, and PR publication. | Run final lead review and PR readiness against the exact remote head. |
| Product end-state sibling path was absent in this isolated worktree, though the canonical product-end-state copy exists in the broader local checkout. | `minor_carry_flag` | Treating the local sibling path as self-contained proof. | Planning packet content review. | Reconfirm product-end-state path in CI/PR context or cite canonical copy in final review evidence. |
| Source-freshness trigger fields from upstream descriptors should be carried into any later trial-contract draft. | `minor_carry_flag` | Closing a later source-review gate if freshness triggers are hidden. | Current internal planning packet. | Add explicit source-refresh display/checking in the later human-authorized trial-contract draft. |
