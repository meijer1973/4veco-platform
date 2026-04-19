# Plan — Micro-teaching Unit Reference

## Context

Across the platform we build three "teaching surfaces" that all present small, composable chunks of knowledge, but only one of them has an explicit unit catalog today:

1. **Math game (skill tree)** — 37 skills in a 6-layer DAG with explicit `needs:[...]` prerequisites. Defined in `engines/skilltree/base-elements.js`. Explanations per skill live in `engines/skilltree/explanations.js`. This works well: each node is a ~5-minute teachable chunk, dependencies are clear, and per-paragraph `activeSkills`/`newSkills` arrays control what's visible.
2. **Explainer documents** — `uitleg voorkennis` (domains: wiskunde / economisch / grafisch) and `uitleg vaardigheden` (domains: markt / bedrijf / arbeid). Built by the `econ-explainer-docs` skill using the section pattern `domainBanner → Uitleg → formulaBox → Voorbeeld → tipBox → checkBox → summarySchema`. Each section *is* a micro-teaching unit, but there is **no central registry** — each paragraph re-extracts its own prerequisites by hand (see `econ-explainer-docs.md` §4.1). No cross-paragraph dependency graph exists.
3. **Reasoning game** — 3-step chains + flow-block reasoning, data in `source-data/module-{1,3}/reasoning/*.csv`. Steps are currently tied to a single paragraph, not catalogued as reusable units.

The user's insight: the skill-tree model should be extended so that every 5-minute teaching chunk — mathematical, economic, graphical, and reasoning — has a named unit, a description, prerequisites, and a layer. Then larger explanations, presentations, and game questions become compositions of these units, with the reference file acting as the canonical index.

**Outcome wanted:** a reference file (or files) that gives an overview of all micro-teaching units and their dependencies, usable by both humans (planning materials) and skills (extracting prerequisites automatically).

## Recommended approach

### 1. One file, not two

Keep unit definition **and** dependencies in a single Markdown reference. The existing `base-elements.js` already pairs `needs:[...]` with the skill object — separating them invites drift. Human readers also want to see "what depends on what" right next to "what is it". Precedent in `references/`: every other reference file (terminology, didactiek, vraagtypen) is a single authoritative markdown.

A JSON companion (`references/micro-teaching-units.json`) is generated from the markdown by a build script, and is what code consumes. The markdown stays the human source of truth.

### 2. Location and name

Create **`references/micro-teaching-units.md`** alongside the existing reference standards. This matches the pattern (`economie-terminologie.md`, `didactiek-principes.md`, …) and lets skills reference it the same way they reference the others.

### 2a. Reference becomes source of truth for math skills

The 37 math skills currently defined inline in `engines/skilltree/base-elements.js` move into the reference. `base-elements.js` is refactored to `require('../../references/micro-teaching-units.json')` for skill **data** (`id/name/layer/needs/desc`) while keeping the `GEN.*` exercise-generator functions in place — generators are code and stay in JS. This avoids two copies of the DAG.

### 3. Structure of the reference

Four unit categories, one section each, each unit numbered with an ID that encodes its category + layer. Reuse IDs from the existing math tree verbatim so we don't fork that data.

| Category | ID prefix | Source of truth | Example |
|---|---|---|---|
| Wiskunde (math) | `F`, `B`, `S`, `E` (existing) | Mirrors `base-elements.js` | `F1 Lineaire functie opstellen` |
| Economisch (concepts) | `EC` | New, extracted from voorkennis sections + syllabus | `EC3 Marktevenwicht (begrip)` |
| Grafisch (reading/drawing graphs) | `GR` | New, extracted from voorkennis sections | `GR2 Snijpunt aflezen` |
| Vaardigheden (procedures) | `VM` (markt), `VB` (bedrijf), `VA` (arbeid) | New, extracted from vaardigheden sections | `VM4 CS/PS berekenen` |
| Redeneren (reasoning) | `R` | New, from reasoning CSV step labels | `R1 Gegevens verzamelen → vergelijking` |

For each unit the entry contains:
- **ID + name** (Dutch, canonical terminology per `economie-terminologie.md`)
- **Layer** (0 foundation → 5 master) — same semantics as the math tree
- **Duration** — target 3–7 minutes of explanation, flagged if it exceeds
- **Kern** — one-sentence "what the student can do/explain after this unit"
- **Needs** — list of unit IDs that must be mastered first (the DAG edges)
- **Used in** — references to paragraphs, voorkennis sections, vaardigheden sections, reasoning problems (back-links)
- **Pitfalls/misconceptions** — 1–2 bullets (optional)

### 4. Machine-readable companion (day one)

**`references/micro-teaching-units.json`** — generated from the markdown by `build-scripts/build-micro-units-index.js`. Each entry: `{id, category, name, layer, needs, desc, duration_min, pitfalls, used_in}`. The build script:

- parses the markdown unit blocks (one unit per `### ID` heading),
- validates that every `needs` ID exists and the graph is acyclic (reuses the check already present in `tests/skilltree-data.test.js`, extended to cover all units),
- emits JSON sorted by category + layer + id,
- fails CI on any unresolved reference or cycle.

`engines/skilltree/base-elements.js` and `econ-explainer-docs` both read this JSON. The markdown is the only thing authors edit.

### 5. How existing skills consume it

- `econ-explainer-docs` §4.1 — replace "ask three questions per exercise" with "look up unit IDs in `micro-teaching-units.md` and pick prerequisites by ID".
- `econ-textbook-paragraph` / `econ-exercise-builder` — reference unit IDs in `_paragraph-plan.md` under "Prior knowledge" and "Skills".
- `build-reasoning-questions` — label each CSV row with a reasoning unit ID.
- Math skill-tree stays the source for `F/B/S/E` IDs; the reference file imports those rows verbatim.

### 6. Seeding the catalog

Four passes, in order:

1. **Wiskunde (F/B/S/E)** — lift the 37 skills from `engines/skilltree/base-elements.js` verbatim (id, name, layer, needs, desc). Sanity check against `explanations.js` for longer descriptions.
2. **Economisch + Grafisch (EC/GR)** — walk every built `*-voorkennis.js` in `build-scripts/` and lift each section. Deduplicate by name; cross-check terms against `references/economie-terminologie.md`.
3. **Vaardigheden (VM/VB/VA)** — same pass over `*-vaardigheden.js` files. Each "Hoe werkt het?" section becomes one unit; the Voorbeeld stays in the unit body.
4. **Redeneren (R)** — walk `source-data/module-{1,3}/reasoning/*.csv`; each distinct step label ("Gegevens verzamelen", "Budgetvergelijking opstellen", …) becomes one `R*` unit.

After each pass: assign layers as `max(needs.layer) + 1`, run the validator, commit. Expected total: ~80–120 units.

## Critical files

**Read/import from:**
- `engines/skilltree/base-elements.js` — canonical math skills (37 entries, already DAG-checked)
- `engines/skilltree/explanations.js` — per-skill long-form explanation text
- `build-scripts/m1-111-voorkennis.js`, `m1-111-vaardigheden.js`, `template-A_vaardigheden.js`, `template-B_voorkennis.js` — existing section structures to lift into units
- `source-data/module-{1,3}/reasoning/*.csv` — reasoning step labels
- `knowledge/course_blueprint_v4.md` — prerequisite chains already documented in prose
- `references/economie-terminologie.md` — canonical Dutch terms (must match)
- `references/didactiek-principes.md` — rules for chunk size, cognitive load

**Create:**
- `references/micro-teaching-units.md` — the single authoritative reference (markdown)
- `references/micro-teaching-units.json` — generated index consumed by code
- `build-scripts/build-micro-units-index.js` — parser + DAG validator
- `tests/micro-teaching-units.test.js` — extends the current skilltree DAG test to cover all categories

**Update:**
- `engines/skilltree/base-elements.js` — replace inline skill data with `require('../../references/micro-teaching-units.json')`; keep `GEN.*` generators in place. Verify no regressions via existing skilltree tests.
- `CLAUDE.md` — add the new reference to the list under "references/"
- `AGENTS.md` — same
- `.claude/commands/econ-explainer-docs.md` §4.1 — replace the "ask three questions per exercise" extraction with "pick unit IDs from `micro-teaching-units.md`"
- `.claude/commands/econ-textbook-paragraph.md` + `build-scripts/template-paragraph-plan.md` — add "cite unit IDs" in the "Prior knowledge / Skills" block of `_paragraph-plan.md`
- `build-scripts/build-reasoning-questions.js` (or reasoning CSV schema) — add a `unit_id` column/field pointing at `R*` units

## Verification

End-to-end check once the catalog is seeded:

1. **Structural** — every `needs` ID resolves to an existing unit; no cycles (run the same DAG check used in `tests/skilltree-data.test.js`, extended to cover all units).
2. **Coverage** — pick one already-built paragraph (e.g. 1.1.1) and confirm every section in its `voorkennis.docx` and `vaardigheden.docx` maps to a unit ID in the reference. Any section without a match is a gap.
3. **Terminology** — grep unit names against `economie-terminologie.md`; flag any non-canonical term.
4. **Time budget** — read 5 random units and confirm each can realistically be taught in 3–7 minutes (subjective but important).
5. **Reuse check** — for a new paragraph (e.g. 3.2.1 Marktevenwicht), try to build the voorkennis section list by picking unit IDs from the reference instead of extracting from scratch. The list should match what's already in the built document.
