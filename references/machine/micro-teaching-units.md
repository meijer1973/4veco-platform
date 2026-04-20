# Micro-teaching Units — Canonical Registry

**Do not hand-edit this file.** All changes flow through `build-scripts/references/unit-*.js`. Hand-edits are flagged and reverted by the next script run. See `knowledge/micro-teaching-units-plan.md` for the architecture.

---

## What this is

A registry of every discrete teaching chunk (roughly 3–7 minutes of instruction) across the platform:
- Mathematical skills used in economic work (domain `A`, from CvTE Vaardigheden)
- Economic concepts, procedures, and reasoning skills (domains `B`–`K`, from CvTE content domains)

Each unit has a stable permanent ID, prerequisite links forming a DAG, a mastery target (Bloom ceiling), a canonical procedure when applicable, links to the exam program, and links to canonical terminology.

---

## ID scheme

`<DomainLetter><2-digit number>`, sequential within domain. Example: `A01`, `D05`, `H12`.

Eleven domain prefixes match the CvTE examenprogramma exactly:

| Prefix | CvTE domain | Scope |
|---|---|---|
| `A` | Vaardigheden | Math, graph reading, calculation, reasoning — minted lazily as exercises demand |
| `B` | Schaarste | School exam |
| `C` | Ruil | School exam |
| `D` | Markt | Central exam |
| `E` | Ruilen over tijd | Central exam |
| `F` | Samenwerken en onderhandelen | Central exam |
| `G` | Risico en informatie | Central exam |
| `H` | Welvaart en groei | Central exam (macro) |
| `I` | Goede en slechte tijden | Central exam (conjunctuur) |
| `J` | Onderzoek en experiment | School exam |
| `K` | Keuzeonderwerpen | School exam |

IDs are **permanent once minted**. Renames change only the display name. Splits/merges mint new IDs and deprecate the old with pointers. Renumbering is forbidden.

---

## Unit schema

Each unit entry uses this format:

```markdown
### <ID> <Name with optional (mode) suffix>
- layer: <derived integer>
- duration_min: <3-7>
- kern: "<one-sentence mastery statement>"
- needs: [<prerequisite unit IDs>]
- exam_codes: [<CvTE eindterm codes, e.g. D3.2, A4.1>]
- mastery_target: <remember | understand | apply | analyze | evaluate>
- prior_learning: <previously_taught | new_this_year | review_and_extend>
- terms: [<canonical Dutch terms from economie-terminologie.md>]
- procedure:  # mandatory for mastery_target >= apply
  1. <step>
  2. <step>
  ...
- pitfalls:   # optional, 1-2 bullets
  - <common misconception>
- generator: <GEN_* function name, A-domain only>
- deprecated: <true | false>
- deprecated_in_favor_of: [<replacement IDs>]
```

**Validation rules enforced by the build CLI:**

1. `needs` entries must all resolve to existing unit IDs.
2. The `needs` graph must be acyclic.
3. `layer` is derived: `max(needs.layer) + 1`. Not human-set.
4. `exam_codes` entries must resolve to real eindtermen in `references/external/syllabus-eindtermen.json`.
5. `terms` entries must resolve to canonical terms in `economie-terminologie.md`.
6. `procedure` is mandatory when `mastery_target` is `apply`, `analyze`, or `evaluate`.
7. `generator` is only valid for `id.startsWith('A')`.
8. `duration_min` outside 3–7 triggers a validator warning.

**Derived in JSON only (not human-authored in the markdown):**
- `category`: derived from ID prefix (`D05` → `markt`).
- `aspects`: set of verbs from cited eindtermen (`["berekenen", "uitleggen"]`).

**Not stored on the unit (by design):**
- `used_in` paragraph / exercise back-references (lives in reports, regenerated each build).
- Per-exercise Bloom tags or question types (property of exercises).

---

## How to change a unit

Humans propose changes; CLI executes and validates.

| Operation | Command |
|---|---|
| Create a new unit | `node build-scripts/references/unit-add.js --spec '<JSON>'` |
| Rename (display only) | `node build-scripts/references/unit-rename.js --id <ID> --name "<new name>"` |
| Update a field | `node build-scripts/references/unit-update.js --id <ID> --spec '<JSON>'` |
| Add a prerequisite edge | `node build-scripts/references/unit-add-dep.js --from <ID> --to <prereq>` |
| Remove a prerequisite edge | `node build-scripts/references/unit-remove-dep.js --from <ID> --to <prereq>` |
| Deprecate with replacement | `node build-scripts/references/unit-deprecate.js --id <ID> --replaced-by <IDs>` |
| Split one into several | `node build-scripts/references/unit-split.js --from <ID> --into <IDs> --spec '<JSON>'` |
| Merge several into one | `node build-scripts/references/unit-merge.js --from <IDs> --into <ID>` |

A future `/unit` skill will accept Dutch natural language ("maak nieuwe unit D12 voor prijsdiscriminatie berekenen, volgt op D06 en A15, mastery apply"), echo the generated CLI call for confirmation, and execute it. Skill calls CLI — never the other way around.

---

## Units

*The registry is currently empty. The math migration (see `knowledge/micro-teaching-units-plan.md` §6) will populate `A01`–`A37` from `engines/skilltree/base-elements.js`. The exam audit pass will then add D/E/H/etc. units as demanded by real havo/vwo 2025 questions.*

<!-- UNIT ENTRIES BELOW THIS LINE — managed by build-scripts/references/unit-*.js -->
