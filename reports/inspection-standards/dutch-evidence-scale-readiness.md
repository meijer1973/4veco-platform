# INSPECT-8 Dutch Evidence Scale Readiness

Status: report-only readiness audit
Date: 2026-06-10
Sprint: `INSPECT-8`

## Scope And Safe-Use Note

This report audits existing Dutch-only product-side evidence to decide which
Dutch scope can safely become the next evidence-pack target.

This is not an inspection judgement, compliance claim, approval, certificate,
OP0 completion claim, school-obligation claim, PTA-validity claim,
summative-validity claim, classroom-implementation proof, or school-SKA claim.
School-owned evidence remains school-owned.

Lesson evidence was inspected read-only from:

```text
../4veco-lessen
```

Lesson evidence commit:

```text
b858bca602bb7afdf75cad7c3ecc1a79b31fbb76
```

## Executive Finding

Do not generate an additional Dutch evidence pack yet.

The accepted Book 1 Chapter 1.1 first-three paragraph scope is strong enough
to remain the control scope, because INSPECT-7 produced a reviewed bounded
sample and all three external reviewer roles returned `MORE_THAN_SATISFIED`.
It is not strong enough to justify broadening by itself: target records still
need v5 finality review, exam-code links are absent, and target-equivalent
proof is reviewed only for the exact local `1.1.2` case.

The best next Dutch scope candidate is Book 1 Chapter 1.2 `Vraag`, but only as
an INSPECT-9 gap-closure target. Chapter 1.2 has generated artifacts, review
files, target records, and partial exam-code linkage. It is not pack-ready
because target records are not final, `1.2.4` is a placeholder, exam-code
linkage is incomplete, companion/accessibility/support evidence is weak, and
target-equivalent proof is missing.

## Recommended Next Dutch Scope

| Decision field | Recommendation |
|---|---|
| Additional evidence-pack generation now | No |
| Control scope | Book 1 Chapter 1.1 accepted first-three paragraph baseline |
| Gap-closure candidate | Book 1 Chapter 1.2 `Vraag` |
| Required next sprint | INSPECT-9 Dutch Evidence Gap Closure Plan |

Minimum proof before Chapter 1.2 can become evidence-pack work:

- v5 review/finality route for `1.2.1`, `1.2.2`, and `1.2.3`;
- reviewed integration target for `1.2.4`;
- exam-code linkage decision for `1.2.1` and `1.2.4`;
- target-equivalent proof requirements for Chapter 1.2;
- review-depth decision for companion, accessibility, and support evidence;
- product/school boundary wording retained per category.

## Scope Inventory

Target registry evidence:

```text
references/authored/course-target-exercises.json
```

The target registry contains 12 Module 1 count-bearing records:

| Chapter | Target records | Status |
|---|---:|---|
| 1.1 | 4 | Three theory records migrated from v4 and needing v5 review; `1.1.4` placeholder needing review. |
| 1.2 | 4 | Three theory records migrated from v4 and needing v5 review; `1.2.4` placeholder needing review. |
| 1.3 | 4 | Three theory records migrated from v4 and needing v5 review; `1.3.4` placeholder needing review. |

Lesson evidence contains 21 Book 1 quality-ref files:

| Chapter | Lesson folders | Target-registry coverage | Readiness note |
|---|---:|---:|---|
| 1.1 Economisch denken en rekenen | 4 | 4 | First three paragraphs have accepted INSPECT-7 bounded sample evidence; mixed-practice target remains placeholder. |
| 1.2 Vraag | 4 | 4 | Best gap-closure candidate, not pack-ready. |
| 1.3 Aanbod en marktevenwicht | 4 | 4 | Stronger exam-code linkage than 1.2, but stale/conflicting review metadata and no target-equivalent proof. |
| 1.4 Marktevenwicht en marginale analyse | 5 | 0 | Generated/review evidence exists, but no inspected target-registry coverage. |
| 1.5 Toetsvoorbereiding | 4 | 0 | Generated/review evidence exists, but blocked records and assessment-claim risk make it not ready. |

## Readiness Matrix

| Scope | Target finality | Exam-code linkage | Target-equivalent proof | Review evidence | Generated artifacts | Accessibility/support evidence | Recommendation |
|---|---|---|---|---|---|---|---|
| 1.1 first-three baseline | Weak | Missing | Local `1.1.2` only | Strongest, but flagged | Present | Present but weak | Keep as control scope only. |
| 1.2 Vraag | Weak | Partial | Missing | Present but uneven | Present | Weak | INSPECT-9 gap-closure candidate. |
| 1.3 Aanbod en marktevenwicht | Weak | Partial/stronger | Missing | Present but stale in places | Present | Weak | Later candidate after metadata reconciliation. |
| 1.4 Marktevenwicht en marginale analyse | Missing in inspected target registry | Missing in inspected target registry | Missing | Present | Present | Weak | Not ready. |
| 1.5 Toetsvoorbereiding | Missing in inspected target registry | Missing in inspected target registry | Missing | Blocked/flagged | Present | Weak | Not ready. |

## Evidence Gaps By Dimension

### Paragraph And Chapter Scope Inventory

State: present but uneven.

Book 1 has generated lesson evidence across chapters 1.1 through 1.5, but the
inspected target registry covers only chapters 1.1 through 1.3. Chapters 1.4
and 1.5 must not be treated as evidence-pack-ready merely because lesson
folders and reviews exist.

### Target-Exercise Finality

State: weak.

All nine inspected theory target records remain
`migrated_from_v4_needs_v5_review`. The three mixed-practice records are
`placeholder_needs_review`.

Target-exercise presence is therefore not final-reviewed curriculum evidence.

### Exam-Code Linkage

State: partial.

Exam-code links exist for:

- `1.2.2` with `D1.9`;
- `1.2.3` with `A2.9`;
- `1.3.1` with `D1.12`, `D1.24`;
- `1.3.2` with `A2.10`, `A2.12`, `A2.15`;
- `1.3.3` with `A2.10`, `A2.12`, `A2.15`, `D1.12`, `D1.24`.

Those codes map to official-question records in
`references/external/exam-questions.json`.

Missing links remain for:

- `1.1.1`, `1.1.2`, `1.1.3`, `1.1.4`;
- `1.2.1`, `1.2.4`;
- `1.3.4`.

### Target-Equivalent Proof

State: weak.

`reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/gate-closure.md`
accepts only the exact local `1.1.2` exit-ticket candidate, with flags and
without broad scaling authority.

No reviewed target-equivalent proof was found for `1.1.1`, `1.1.3`, Chapter
1.2, or Chapter 1.3.

### Review Evidence

State: present but uneven.

Chapter 1.1 first-three paragraphs have Part A and companion review evidence
with `PASS WITH FLAGS` preserved. INSPECT-7 external review returned
`MORE_THAN_SATISFIED` for teacher, legal/privacy, and Dutch
quality-inspection roles.

Chapters 1.2 through 1.5 have review files, but not the same companion-review
depth. Chapter 1.5 includes blocked quality-ref states. Chapter 1.3 has a
metadata issue: `1.3.1-quality-ref.yaml` still carries older blocker wording
while `1.3.1-review.md` says the graph-text mismatch was corrected.

### Generated Artifact Evidence

State: present.

Generated folders, Markdown/PDF/HTML artifacts, review files, and quality-ref
files exist across Book 1. This proves artifact presence only. It does not
prove target finality, exam alignment, target-equivalent closure,
accessibility completeness, classroom implementation, or school-owned evidence.

### Accessibility Evidence

State: present but weak.

Accessibility-adjacent evidence exists through Chapter 1.1 companion reviews,
asset/alt-text fields, check-surface review packets, and proof references. No
unified full accessibility audit was found across Book 1 or across Chapter
1.2.

### Differentiation And Support Evidence

State: present but weak.

Product-side support evidence exists in route/check surfaces, practice
progression, feedback/next-action records, and review notes. This remains
advisory product evidence. It is not school monitoring, support decisions,
interventions, accommodations, or care-plan evidence.

## School-Owned Evidence Still Needed

- Full school curriculum plan, scheduling, and implementation choices.
- Classroom enactment, teacher adaptation, and interaction evidence.
- School-wide Dutch language, mathematics/arithmetic, and citizenship
  basic-skills policy and practice.
- Student monitoring, interventions, accommodations, care plans, and support
  decisions.
- PTA, grading, summative assessment policy, transition decisions, and formal
  assessment-validity evidence.
- School governance, self-evaluation, improvement planning, board
  accountability, and inspection-dialogue evidence.

## Unsafe-Claim Risks

- Do not infer final-reviewed curriculum evidence from migrated target records.
- Do not infer target-equivalent closure from target-exercise or answer-model
  presence.
- Do not generalize the exact `1.1.2` local target-equivalent proof to other
  paragraphs.
- Do not treat generated artifact presence as reviewed lesson quality.
- Do not treat review screenshots or route-local checks as full accessibility
  proof.
- Do not treat product route/check surfaces as school monitoring or support
  evidence.
- Do not treat product QA records as school SKA evidence.
- Do not use proeftoets/test-prep evidence to make PTA, summative-validity,
  grading, or school-obligation claims.

## Validation Summary

This report created no evidence packs, no generator, no package script, no
CI/build gate, no dashboard gate, no quality-ref integration, no Scale Gate
integration, and no lesson-output mutation.

No personal data was processed. No non-Dutch standards work was started.

## Next Action

Run INSPECT-9 as a Dutch Evidence Gap Closure Plan. It should harden Chapter
1.2 as the first expansion candidate and decide whether the Chapter 1.1
baseline needs target-finality or exam-code remediation before any additional
evidence-pack generation.
