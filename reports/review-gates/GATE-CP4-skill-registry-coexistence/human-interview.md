# CP-4 Human Interview

Gate: `GATE-CP4-skill-registry-coexistence`

Sprint: `S7`

Reviewer role: Head of Content Strategy

Decision: `pass_with_conditions`

S7 closure authorized: yes

Machine registry authorized: no

Bulk backfill authorized: no

PV dependency authorized: provisional references only

## Answers

### CP4-Q1 Storage Location

Answer: A. Yes, `references/data` is correct for S7 MVP storage.

Decision: S7 remains a governed data overlay. Promotion to `references/machine/` is blocked until schema stability, CLI support, validators, mutation logs, and explicit human promotion approval exist.

### CP4-Q2 Field Separation

Answer: A. Yes, keep `required_units`, `exercise_operations`, and `skill_tags` separated; `required_skills` remains legacy/source-only.

Decision: Do not reuse `required_skills` for new semantics. It remains a source/legacy field until an explicit migration sprint changes it.

### CP4-Q3 Broad Skill Tags

Answer: B. Mostly, accept Dutch broad `skill_tags` as v1 with alias/naming follow-up.

Decision: The Dutch broad tags are acceptable as the initial broad taxonomy, but alias handling and normalization rules need follow-up before broader backfill.

### CP4-Q4 English Dry-Run Skill Tags

Answer: B. Treat English dry-run `skill_tags` as provisional aliases/sub-tags until normalization is reviewed.

Decision: English dry-run tags must not become the canonical broad taxonomy by accident. Treat them as provisional aliases, sub-tags, or implementation labels until a normalization review resolves them.

### CP4-Q5 Exercise Operations

Answer: B. Not yet; `exercise_operations` stay provisional and only the coexistence structure is approved.

Decision: CP-4 approves the coexistence model, not full governance of operation records. A later registry path must define stable operation IDs, naming, CLI support, validators, and mutation logs.

### CP4-Q6 Operation-To-Unit Mappings

Answer: B. Mostly; mapped operation records may remain provisional but require proof before bulk backfill.

Decision: Current mappings can support planning and review, but they are not enough for uncontrolled bulk backfill. Each mapped operation should keep evidence/proof-to-close before being used at scale.

### CP4-Q7 Machine Registry

Answer: A. No, do not authorize `references/machine` operation or skill-tag registries now.

Decision: Do not create `references/machine/exercise-operations.json` or `references/machine/skill-tags.json` in S7. Machine promotion requires a later approved sprint with schema, CLI, validator, mutation-log, and human-review discipline.

### CP4-Q8 Gate Status

Answer: `pass_with_conditions`

Decision: The field separation and overlay structure are accepted. The gate is not a clean pass because tag normalization, operation governance, machine-promotion path, and PV dependency constraints remain open conditions.

### CP4-Q9 Procedure-Visual Dependency

Answer: A. Yes, PV templates may reference provisional `exercise_operations` with explicit provisional status and no operation promotion.

Decision: PV may reference provisional operations for planning and template structure only. PV may not promote those operations, create machine registries, or authorize student-facing PV projection before later PV gates approve schema, validators, reports, generator support, and publication controls.

## Pattern Analysis

The answers are internally consistent:

- Field separation is preserved.
- `required_skills` remains legacy/source-only.
- `skill_tags` are accepted as a broad taxonomy field, but vocabulary normalization remains conditional.
- `exercise_operations` remain provisional.
- Mapped operations are allowed for planning but not for bulk backfill.
- Machine registry promotion is explicitly blocked.
- PV may depend on provisional operation references only under overlay constraints.
- Product-surface uses remain blocked.

No targeted follow-up is required before gate closure.

Plain pass authorized: no
