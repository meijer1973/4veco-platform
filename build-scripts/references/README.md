# build-scripts/references/

CLI suite for the machine-edited references under `references/machine/`.

Machine references are protected. Do not hand-edit `references/machine/*`; use these commands so markdown, JSON projections, validation, and auditability stay together.

## Current Status

The core reference CLI exists. This folder is no longer only a future contract.

Implemented unit commands:

- `build-unit-index.js`
- `unit-add.js`
- `unit-update.js`
- `unit-rename.js`
- `unit-add-dep.js`
- `unit-remove-dep.js`
- `unit-deprecate.js`
- `unit-split.js`
- `unit-merge.js`

Implemented term commands:

- `build-begrippen-index.js`
- `term-add.js`
- `term-update.js`
- `term-rename.js`
- `term-deprecate.js`

Known gaps:

- Dedicated evidence-anchor mutation commands are planned for R5.1.
- R3.2 corrections still require human mutation review of the R2.4 packet before any protected reference writes.
- Mutation commands write protected references by design. Do not run mutation commands during review-only or non-mutating sprints.

Coverage status is checked by:

```powershell
node build-scripts/references/check-reference-cli-coverage.js
```

## Shared Invariants

Every mutation command in this folder:

1. Accepts flags or a `--spec` JSON argument when the command supports rich mutation input.
2. Validates atomically. A command either fully succeeds or fully fails.
3. Regenerates the machine-consumed JSON projection after successful markdown writes.
4. Runs the relevant full validator after every write.
5. Fails loudly with a specific error.
6. Treats generated reports as diagnostics, not as primary source evidence.

## Unit Registry Commands

### `build-unit-index.js`

Regenerates `references/machine/micro-teaching-units.json` from `references/machine/micro-teaching-units.md`.

```powershell
node build-scripts/references/build-unit-index.js
```

R3.1 support:

- parses `assumed_prior_knowledge`
- parses `zero_needs_status`
- parses `zero_needs_review`
- validates zero-needs review enums and object shape
- projects the fields into the JSON index

### `unit-add.js`

Mints a new unit through the protected machine-reference workflow.

```powershell
node build-scripts/references/unit-add.js --spec '<JSON>'
```

Required JSON fields: `id`, `name`, `kern`, `needs`, `mastery_target`, `prior_learning`, `aspects`, `terms`.

Optional fields include `exam_codes`, `procedure`, `pitfalls`, `duration_min`, `generator`, `assumed_prior_knowledge`, `zero_needs_status`, and `zero_needs_review`.

### `unit-update.js`

Changes editable schema fields for an existing unit.

```powershell
node build-scripts/references/unit-update.js --id <ID> --spec '<JSON patch>'
```

Use this for accepted zero-needs review classifications, term-link updates, status fields, and other schema-preserving corrections.

### `unit-rename.js`

Changes a unit display name while preserving the unit ID.

```powershell
node build-scripts/references/unit-rename.js --id <ID> --name "<new name>"
```

### `unit-add-dep.js` / `unit-remove-dep.js`

Adds or removes prerequisite edges in the unit DAG.

```powershell
node build-scripts/references/unit-add-dep.js --from <ID> --to <prereq>
node build-scripts/references/unit-remove-dep.js --from <ID> --to <prereq>
```

Use these only after the edge has human-reviewed evidence. The validator recomputes layers and rejects unresolved IDs or cycles.

### `unit-deprecate.js`

Marks a unit deprecated, optionally with replacement pointers.

```powershell
node build-scripts/references/unit-deprecate.js --id <ID> [--replaced-by <IDs>]
```

### `unit-split.js`

Deprecates one unit and mints several replacement units from a full spec.

```powershell
node build-scripts/references/unit-split.js --from <ID> --into <new IDs> --spec '<JSON with full specs for the new IDs>'
```

### `unit-merge.js`

Collapses several units into one target unit.

```powershell
node build-scripts/references/unit-merge.js --from <IDs> --into <ID>
```

## Term Registry Commands

### `build-begrippen-index.js`

Regenerates `references/machine/begrippen.json` from the term markdown.

```powershell
node build-scripts/references/build-begrippen-index.js
```

### `term-add.js`

Adds a canonical term.

```powershell
node build-scripts/references/term-add.js --spec '<JSON>'
```

### `term-update.js`

Updates editable term fields.

```powershell
node build-scripts/references/term-update.js --slug <slug> --spec '<JSON patch>'
```

### `term-rename.js`

Renames a term while preserving or migrating references through the term workflow.

```powershell
node build-scripts/references/term-rename.js --slug <slug> --label "<new label>"
```

### `term-deprecate.js`

Deprecates a term, optionally with replacement pointers.

```powershell
node build-scripts/references/term-deprecate.js --slug <slug> [--replaced-by <slugs>]
```

## R2.4 To R3.2 Readiness

R2.4 produced a non-mutating evidence and unit-design packet. R3.2 must not apply that packet until human mutation review authorizes specific changes.

Current readiness:

| R2.4 decision type | CLI path | R3.2 status |
|---|---|---|
| Accepted dependency edge | `unit-add-dep.js` | Ready after human mutation review |
| Rejected dependency edge | no mutation | Preserve the rejection record |
| Foundational A-domain `underbouw_assumed` | `unit-update.js` with zero-needs fields | Ready after human mutation review |
| `D04` retirement, split, merge, or redistribution | `unit-deprecate.js`, `unit-split.js`, or `unit-merge.js` | Blocked until a specific human design decision exists |
| Unit term-link cleanup | `unit-update.js` | Ready for reviewed unit-side changes |
| Term registry changes | `term-*` commands | Available, but no R2.4 term mutation is currently required |
| Evidence-anchor storage | planned R5.1 layer | Not an R3.2 blocker if the R2.4 packet remains the provenance record |

The readiness report is stored in:

- `reports/json/reference-cli-coverage.json`
- `reports/reference-cli-coverage.md`

## Historical Utility Scripts

Some scripts in this folder are one-shot or migration utilities rather than normal mutation commands.

- `extract-eindtermen.js`: extracts syllabus eindtermen from the source PDF.
- `seed-math-units.js`: historical A-domain seed migration.
- `migrate-paths.js`: historical references-folder migration.

## Future `/unit` Skill

A future natural-language unit skill may generate CLI specs and ask for confirmation, but it must not write machine references directly. The dependency direction is skill -> CLI -> validator -> protected reference projection.
