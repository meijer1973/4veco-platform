# Micro-Teaching Units Implementation Review

## Findings

### 1. Critical — the write-path CLIs do not enforce the canonical terminology/eindterm contract

**Refs**
- `build-scripts/references/unit-add.js:193-207`
- `build-scripts/references/unit-lib.js:44-56`
- `build-scripts/references/build-unit-index.js:156-163`
- `build-scripts/references/build-unit-index.js:281-290`
- `references/external/syllabus-eindtermen.md:95-104`

Both mutation paths (`unit-add` and every command routed through `unit-lib.saveCatalog`) call `validate(nextUnits, {})`, which disables terminology and syllabus-code validation during writes. The only loader that can supply real eindtermen data is `loadEindtermen()`, but that function explicitly returns `null` when `references/external/syllabus-eindtermen.json` is absent or unparsable, and the committed register is still a placeholder markdown file with no generated JSON alongside it.

That breaks the core safety claim of the architecture: invalid `exam_codes` and non-canonical `terms` can be minted and committed by the official CLI, even though the docs say writes fail atomically on those violations.

### 2. Critical — the exercise/exam traceability half of the plan is still not implemented

**Refs**
- `reports/README.md:21-42`
- `references/external/README.md:16-21`
- `references/external/syllabus-eindtermen.md:102-104`

The repo documentation now describes an exercise-first audit stack (`exercise-coverage`, `exam-coverage`, `exam-question-audit`, `exam-question-type-distribution`, `exam-vs-program-gaps`, `blueprint-vs-exam-gaps`, `exam-program-delta`) and a populated `references/external/exams/` folder. In the actual implementation, only four report generators exist (`dag-integrity`, `dead-units`, `terminology-drift`, `unresolved-refs`), the exam PDF folder only contains a README, and the syllabus register is still empty.

This means the implementation currently provides registry scaffolding plus a math migration, but not the plan’s main outcome: bidirectional coverage/traceability against exercises and the CvTE exam program.

### 3. High — the other teaching surfaces are still disconnected from the unit registry

**Refs**
- `build-scripts/templates/template-paragraph-plan.md:95-112`
- `build-scripts/platform/build-reasoning-questions.js:47-58`
- `build-scripts/platform/build-reasoning-questions.js:348-355`

The paragraph-plan template still asks authors to fill free-text “Prior knowledge”, free-text “Skills”, and a manual procedure table instead of citing unit IDs. The reasoning CSV schema/output still has no `unit_id` field, so reasoning exercises cannot trace back to the catalog either.

So far, only the skilltree slice has really been migrated. The plan’s “single canonical registry across all three surfaces” objective is not met yet, which means the original procedure-drift problem is still present outside the skilltree.

### 4. High — `layer` is no longer a derived invariant, so layer drift can be silently committed

**Refs**
- `build-scripts/references/build-unit-index.js:235-263`
- `build-scripts/references/seed-math-units.js:49-60`

The plan defined `layer` as derived only: `max(needs.layer) + 1`, never human-assigned. The implementation explicitly changed that policy: stored layers are preserved from the legacy skilltree and only validated as a minimum bound. `computeLayers()` fills `layer` only when it is missing, and `seed-math-units.js` seeds explicit layer values from the old `base-elements.js`.

That makes `layer` a manually stored curriculum tier, not a derived graph property. Any future dependency changes can leave stale layer values in place while integrity reports still pass, so “layer distribution” is no longer trustworthy as a structural signal.

### 5. Medium — seeded math units do not contain the rich canonical procedures the plan expected

**Refs**
- `build-scripts/references/seed-math-units.js:49-60`
- `references/machine/micro-teaching-units.md:243-252`
- `engines/skilltree/explanations.js:245-252`
- `engines/skilltree/explanations.js:422-427`

The math seeding script copies `skill.desc` into both `kern` and a one-line `procedure`, leaves `terms` empty, and does not pull in the richer multi-step content from `engines/skilltree/explanations.js`. For example, `A12` ends up with a one-step procedure in the registry, while the explanation source already contains a proper three-step sequence.

That weakens the registry’s usefulness as the canonical procedure source for answer models, slides, worked examples, and explainers. The data structure exists, but it is not yet carrying the fidelity the plan said downstream builders would rely on.

## Open Questions / Assumptions

- I reviewed the current committed implementation in `4veco-platform`, not a specific PR diff.
- I treated missing exam assets/scripts as implementation gaps rather than “future work”, because the repo docs now describe them as present parts of the system.
- I did not score stale module-repo deployment as a core platform finding, because that may be a deployment step that simply has not been rerun yet.

## Verification Notes

- Passed: `node node_modules/jest/bin/jest.js --runInBand engines/tests/micro-teaching-units.test.js`
- Passed: `node build-scripts/reports/dag-integrity.js`
- Passed: `node build-scripts/reports/unresolved-refs.js`
- Passed: `node build-scripts/reports/terminology-drift.js`
- Failed: `MODULE_ROOT="..\\3. Module 3 - Markt en overheid" node node_modules/jest/bin/jest.js --runInBand engines/tests/skilltree-data.test.js`

The `skilltree-data` failure is a deployment-state issue, not necessarily a platform-code defect: the checked module repo still contains legacy IDs like `F1`/`B8` in `shared/skilltree/3.1.1.js`, and it is missing some expected generated files (`1.1.2.js`, `1.1.3.js`).
