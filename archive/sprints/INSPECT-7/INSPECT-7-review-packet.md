# INSPECT-7 Prototype Review Packet

Status: locally validated, pending lead review and external review
Date: 2026-06-09
Branch: `codex/quality-standards-20260608`

## Review Request

Please review INSPECT-7 as one bounded no-personal-data report-only evidence
pack prototype for Book 1 Chapter 1.1.

Required reviewer roles after lead review:

- teacher reviewer;
- legal/privacy reviewer;
- Dutch quality-inspection reviewer.

Required external verdict scale:

```text
REVISE
PASS
MORE_THAN_SATISFIED
```

The gate remains closed unless all three external reviewers return
`MORE_THAN_SATISFIED`.

## Reviewed Scope

INSPECT-7 creates only:

```text
references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json
archive/sprints/INSPECT-7/build-inspect-7-prototype.js
```

The prototype is bounded to:

```text
Book 1 - Grondslagen, vraag en aanbod
Chapter 1.1 - Economisch denken en rekenen
Paragraphs:
- 1.1.1 Schaarste en economisch denken
- 1.1.2 Percentages en indexcijfers
- 1.1.3 Grafieken en tabellen
```

It does not edit `../4veco-lessen/`. Lesson paths are read-only citations.

## Calibration Checks

| Check | Evidence | Expected judgement |
|---|---|---|
| Source object follows INSPECT-6 contract. | `references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json`; `docs/inspection-standards/evidence-pack-source-contract.md` | Required top-level fields, eight categories, claim records, privacy boundary, and review policy are present. |
| Output is bounded and report-only. | `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md`; `reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json` | Markdown and JSON are diagnostic reports only, not product gates. |
| Prototype assembler is narrow. | `archive/sprints/INSPECT-7/build-inspect-7-prototype.js` | Reads one source file and writes only the two named INSPECT-7 report files. |
| Teacher first screen exists. | Markdown pack first sections. | Scope, safe-use note, evidence summary, weak/missing evidence, school evidence still needed, and recommended next action are visible in 5-10 minutes. |
| No personal data. | Source/output privacy boundary and validation log. | `personal_data_present: false`; no student names, identifiers, grades, answers, attendance, support/care records, accommodations, classroom photos/audio/video. |
| OP0 boundary preserved. | `basic_skills` category. | Subject-material economics evidence only; no full OP0, school-wide basic-skills, or citizenship-curriculum proof. |
| Product/school boundary preserved. | Every category record. | `4veco evidence`, school evidence still needed, weak/missing evidence, and forbidden inference are separated. |
| Weak evidence remains visible. | Teacher first screen and category records. | Migrated target exercises, PASS WITH FLAGS, local-only 1.1.2 proof, and missing school evidence remain visible. |
| INSPECT-7 remains non-integrated. | Sprint plan, source/output file list, Git diff. | No package script, CI gate, dashboard gate, quality-ref integration, Scale Gate integration, country overlay, lesson-output mutation, or compliance/approval claim. |

## Evidence Links

INSPECT-7 artifacts:

```text
archive/sprints/INSPECT-7/INSPECT-7-authorisation.md
archive/sprints/INSPECT-7/INSPECT-7-sprint-plan.md
archive/sprints/INSPECT-7/INSPECT-7-planning-review.md
archive/sprints/INSPECT-7/INSPECT-7-correction-log.md
archive/sprints/INSPECT-7/build-inspect-7-prototype.js
references/data/inspection-standards/prototypes/inspect-7-book-1-1.source.json
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.md
reports/inspection-standards/inspect-7-book-1-1-evidence-pack.json
```

Evidence basis:

```text
archive/sprints/INSPECT-2/INSPECT-2-bounded-pilot-evidence-audit.md
archive/sprints/INSPECT-6/INSPECT-6-closure-log.md
archive/sprints/INSPECT-6/INSPECT-6-external-review-results.md
docs/inspection-standards/report-only-generator-plan.md
docs/inspection-standards/evidence-pack-source-contract.md
docs/inspection-standards/evidence-pack-validation-and-dispatch.md
docs/inspection-standards/teacher-facing-evidence-pack-template.md
references/data/inspection-standards/source-register.json
references/data/inspection-standards/nl-vo-evidence-profile.v0.json
references/authored/course-target-exercises.json
reports/review-gates/GATE-PV-G4-lesson-regression/gate-closure.md
reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/gate-closure.md
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/review-packet.md
reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/live-output-evidence.md
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

- the prototype implies a reusable generator or production surface;
- personal data appears or would be needed;
- a future claim lacks concrete product/review evidence citations;
- OP0 is blurred into full OP0 or school-wide proof;
- product evidence is blurred into school-owned implementation, support,
  assessment, governance, or inspection judgement;
- teacher first-screen usefulness is not reviewable;
- weak/local/pass-with-flags evidence is hidden;
- the packet implies package script, CI, dashboard, quality-ref, Scale Gate,
  country overlay, lesson-output, or compliance/approval authority.

Return `PASS` only if there are no blockers but you are not more than
satisfied. That still blocks external progression.

Return `MORE_THAN_SATISFIED` only if the prototype is strong enough to present
as the final Dutch quality-system packet for external human review.

## Teacher Review Questions

1. Can a Dutch vwo economics teacher or school leader understand the pack in
   5-10 minutes?
2. Are evidence, weak/missing evidence, school-owned evidence, and next action
   visible enough to be useful?
3. Does the pack avoid hiding PASS WITH FLAGS, local-only, migrated, or missing
   evidence behind positive wording?

## Legal/Privacy Review Questions

1. Does the pack keep personal data out by default?
2. Are AP privacy anchors used only as guardrails, not as legal-compliance
   proof?
3. Does the wording avoid legal, compliance, approval, certification,
   inspection-ready, PTA, summative, school-obligation, classroom-
   implementation, and AVG/GDPR overclaims?

## Dutch Quality-Inspection Review Questions

1. Does OP0 remain subject-material economics evidence only?
2. Are OP1, OP2, OP3, OP6, OP0, and SKA boundaries preserved?
3. Is product evidence separated from school-owned evidence and competent-
   authority judgement?
4. Is the report-only prototype useful without implying inspection approval or
   school-level proof?

## Dispatch Metadata

Lead-review round 1 used:

```text
lead_review_round1_packet_sha: cf7d1326dfd97be0e1f63ec8c5f30d9d641c6369
remote_branch: origin/codex/quality-standards-20260608
remote_push_status: pushed
platform_ci_validate_platform: explicit CI waiver; gh run list returned []
local_validation_log: archive/sprints/INSPECT-7/INSPECT-7-validation-log.md
lead_review_round2: archive/sprints/INSPECT-7/INSPECT-7-lead-review-round2.md
correction_log: archive/sprints/INSPECT-7/INSPECT-7-correction-log.md
```

Lead-review round 2 initially reviewed remote head
`cfc1e5e296f767c7d239a322602efd63eb074aec` and returned `REVISE` because the
metadata above used the stale round-1 packet SHA as if it were the final
external dispatch SHA.

The external-review dispatch prompt must cite the exact final pushed branch
HEAD available after lead review passes and all lead-review artifacts are
pushed. Do not reuse an earlier packet SHA as `final_reviewed_commit_sha`.

## Required Next Action

Validate, lead-review, push, and send this packet to the teacher,
legal/privacy, and Dutch quality-inspection reviewers. Do not close INSPECT-7
unless all three return `MORE_THAN_SATISFIED`.
