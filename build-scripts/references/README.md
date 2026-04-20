# build-scripts/references/

CLI suite for the machine-edited references under `references/machine/`. Every mutation to those references flows through one of these scripts. Hand-editing machine references is forbidden; see `knowledge/micro-teaching-units-plan.md` §5.

**All scripts in this folder are yet to be built.** This README defines the contract so the implementation session has a clear target.

---

## Shared invariants

Every CLI command in this folder:

1. **Accepts flags OR a `--spec` JSON argument.** The JSON spec form is the machine contract; the flags form is the human convenience wrapper. Both paths must yield byte-identical output.
2. **Validates atomically.** A command either fully succeeds (markdown + JSON both written) or fully fails (neither written). No partial states.
3. **Runs the full validator after every write.** The validator re-checks the entire catalog, not just the changed entry. A single edit that introduces a cycle elsewhere is caught immediately.
4. **Fails loudly with a specific error.** Unresolved ref → name the unit. Cycle → name the cycle path. Eindterm unknown → name the code. No silent best-effort.
5. **Regenerates `references/machine/micro-teaching-units.json` on every successful write.** The JSON is the machine-consumed projection; never hand-committed.

---

## Command catalog

### `unit-add`

Mint a new unit.

```
node build-scripts/references/unit-add.js --spec '<JSON>'
```

Required JSON fields: `id`, `name`, `kern`, `needs`, `mastery_target`, `prior_learning`, `terms`.
Required when `mastery_target >= apply`: `procedure`.
Required when `id.startsWith('A')`: `generator`.
Optional: `exam_codes`, `pitfalls`, `duration_min`.

Validates:
- ID is available (not already minted, not a deprecation pointer).
- ID prefix matches a valid CvTE domain letter (A–K).
- Every `needs` entry resolves and forms no cycle with the new entry.
- Every `terms` entry resolves to a canonical term in `economie-terminologie.md`.
- Every `exam_codes` entry resolves to a real eindterm in `syllabus-eindtermen.json`.
- `procedure` is present when required, absent when not needed.
- `generator` is valid for A-units, absent for non-A units.
- Computes `layer = max(needs.layer) + 1`.

### `unit-rename`

Change the display name of an existing unit. ID stays. All citations unchanged.

```
node build-scripts/references/unit-rename.js --id <ID> --name "<new name>"
```

### `unit-update`

Change any schema field (except `id`, `layer`, derived fields).

```
node build-scripts/references/unit-update.js --id <ID> --spec '<JSON patch>'
```

Merge-patches the provided JSON over the existing entry, re-validates everything.

### `unit-add-dep` / `unit-remove-dep`

Edit DAG edges. Triggers layer recomputation cascading to every dependent.

```
node build-scripts/references/unit-add-dep.js --from <ID> --to <prereq>
node build-scripts/references/unit-remove-dep.js --from <ID> --to <prereq>
```

### `unit-deprecate`

Mark a unit as deprecated. Optional replacement pointer. Deprecated units remain in the catalog (as stubs) for at least one release cycle.

```
node build-scripts/references/unit-deprecate.js --id <ID> [--replaced-by <IDs>]
```

Every live paragraph plan citing the deprecated ID triggers a warning in `reports/unresolved-refs.md` on next build (warning, not CI failure, since deprecation is an expected transitional state).

### `unit-split`

One unit becomes several. Deprecates the old with `replaced_by: [new IDs]`, mints the new ones, offers optional migration mapping for paragraph plans.

```
node build-scripts/references/unit-split.js --from <ID> --into <new IDs> --spec '<JSON with full specs for the new IDs>'
```

### `unit-merge`

Several units collapse into one. Deprecates all but the target, which absorbs the others.

```
node build-scripts/references/unit-merge.js --from <IDs> --into <ID>
```

---

## Supporting scripts

### `build-unit-index.js`

Regenerates `references/machine/micro-teaching-units.json` from the markdown. Invoked at the end of every `unit-*` command, but also available stand-alone for full-catalog rebuilds after git operations.

```
node build-scripts/references/build-unit-index.js
```

### `extract-eindtermen.js`

One-shot (per syllabus year): parse `references/external/syllabus-economie-vwo-2026-versie-2.pdf` into `references/external/syllabus-eindtermen.md` + `.json`. The validator uses the JSON form.

```
node build-scripts/references/extract-eindtermen.js
```

### `seed-math-units.js`

One-shot: migrate the 37 math skills from `engines/skilltree/base-elements.js` into `micro-teaching-units.md` as `A01–A37`. Records the `F/B/S/E → A*` migration map for the coordinated commit that also updates the 23 per-paragraph `activeSkills` arrays. This is the only bulk seeding script — all other seeding happens exercise-by-exercise via `unit-add`.

```
node build-scripts/references/seed-math-units.js
```

### `migrate-paths.js`

Used once for the references folder migration (see `knowledge/references-migration-plan.md`). Walks every file in the repo, rewrites `references/X.md` → `references/<bucket>/X.md` exactly. Reports diffs. Idempotent.

```
node build-scripts/references/migrate-paths.js
```

---

## Future `/unit` skill

A Claude Code skill (Phase 2, deferred) will parse Dutch natural language ("maak nieuwe unit D12 voor prijsdiscriminatie berekenen, volgt op D06 en A15, mastery apply"), generate the equivalent `--spec` JSON, echo the exact CLI call for user confirmation, and then shell out to run it.

The skill has **no file-write capability of its own.** All edits flow through the CLI. The skill is optional sugar; removing it would not break anything. Keep this dependency direction — skill depends on CLI, not the other way around.
