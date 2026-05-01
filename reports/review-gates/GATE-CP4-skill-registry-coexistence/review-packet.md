# CP-4 Skill Registry Coexistence Review Packet

Status: `prepared_for_human_review`

S7 prepared a governed `references/data/` skill-and-operation registry overlay. It does not close the sprint, promote a machine registry, or authorize bulk exercise metadata backfill.

Addendum: `pv-addendum.md` adds the Procedure-Visual dependency decision. CP-4 should explicitly decide whether PV templates may reference provisional `exercise_operations` while keeping operation promotion and machine registry creation blocked.

## Registry Summary

- Skill tags: `9`
- Overlay skill tags observed: `6`
- Exercise operations: `33`
- Mapped operations: `17`
- Coexistence issues: `3`

## Field Policy

| Field | Status | Meaning |
|---|---|---|
| `required_units` | `canonical` | Micro-teaching-unit IDs required by an exercise or exam question. |
| `required_skills` | `legacy_source_field_only` | Legacy/source field currently used in external and authored source data; do not reuse for new skill-tag or operation semantics. |
| `exercise_operations` | `provisional_until_cp4` | Fine-grained learner actions inside an exercise. |
| `skill_tags` | `canonical_field_name_pending_cp4_vocabulary` | Broader taxonomy labels; CP-4 must decide vocabulary coexistence and migration rules. |

## Review Questions

### CP4-Q1

Is references/data/ the correct storage location for the S7 MVP, with machine-registry promotion blocked until CLI support exists?

Recommended answer: Yes. Keep S7 as a governed data overlay.

### CP4-Q2

Should required_units, exercise_operations, and skill_tags remain the three canonical fields, with required_skills legacy/source-only?

Recommended answer: Yes. This preserves CP-1 semantics.

### CP4-Q3

Are the broad Dutch skill_tags from skill-categories.md acceptable as the v1 broad taxonomy?

Recommended answer: Mostly, but CP-4 should decide alias and naming rules.

### CP4-Q4

How should the English-style dry-run overlay skill_tags coexist with the Dutch broad categories?

Recommended answer: Treat them as provisional aliases/sub-tags until CP-4 decides whether to normalize or split them.

### CP4-Q5

Are RX.1 exercise_operations ready to become governed operation records?

Recommended answer: Not yet. Keep them provisional and approve only the coexistence structure.

### CP4-Q6

Are operation-to-unit mappings clear enough where live units or dry-run overlays make the relation explicit?

Recommended answer: Mostly. Approve mapped records as provisional; require proof before bulk backfill.

### CP4-Q7

Should S7 authorize a references/machine operation or skill-tag registry now?

Recommended answer: No. Machine promotion requires CLI and mutation logs.

### CP4-Q8

What gate status should GATE-CP4-skill-registry-coexistence receive?

Recommended answer: Expected status is pass_with_conditions unless field separation or tag coexistence is rejected.

### CP4-Q9

May Procedure-Visual templates reference provisional `exercise_operations` while PV remains a `references/data/procedure-visual/` overlay?

Recommended answer: Yes, with explicit provisional status on every operation reference. PV may not promote those operations to governed records, create `references/machine/` PV registries, or authorize student-facing projection before later PV gates approve schema, validators, reports, and publication controls.

## Required Human Decisions

- Confirm field separation and required_skills legacy status.
- Decide broad skill_tags vocabulary and alias policy.
- Decide whether exercise_operations stay provisional or receive limited approval.
- Confirm no references/machine registry is authorized in S7.
- Decide whether PV may reference provisional exercise_operations without promoting them.

## Blocked Until Gate Closure

- S7 sprint closure
- bulk exercise metadata backfill
- machine registry promotion
- student diagnostics
- adaptive routing
- student-facing AI
- automatic sequencing
- mastery decisions
- summative decisions
- Procedure-Visual machine registry promotion
- Procedure-Visual student-facing projection
