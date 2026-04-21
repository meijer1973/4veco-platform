# Plan — Micro-teaching Unit Reference (v3)

## Context

Across `4veco-platform` we build three teaching surfaces that all present small, composable knowledge chunks:

1. **Math skilltree** — 37 skills with explicit DAG in `engines/skilltree/base-elements.js`; rich per-skill content in `engines/skilltree/explanations.js`; pure-randomizer generators in `GEN.*`; validated by `engines/tests/skilltree-data.test.js`.
2. **Explainer docs** (`uitleg voorkennis`, `uitleg vaardigheden`) — stable section structure via `template-B_voorkennis.js` / `template-A_vaardigheden.js`, but **no cross-paragraph unit registry**. Each paragraph re-extracts prerequisites by hand.
3. **Reasoning game** — 3-step reasoning chains in `source-data/module-{1,3}/reasoning/*.csv`; step labels are problem-specific but map to a small vocabulary of cognitive operations.

Paragraph plans (`build-scripts/templates/template-paragraph-plan.md`) already carry a "Skills & prior knowledge" list and a "Procedure step plan" — but as free-text per paragraph, not citations to a canonical registry.

Three concrete problems motivate this change:

- **No mechanized coverage check** against the CvTE exam program. We cannot prove every eindterm is addressed, nor that every unit maps to something students actually need to do.
- **Procedure drift across materials.** The same skill (e.g. "maximale winst monopolist berekenen") gets different step sequences in voorkennis, vaardigheden, worked examples, answer models, and slides. Students see inconsistency.
- **No bidirectional trace from exercises to skills.** Units, exam codes, and exercises live in separate document silos; drift between what we teach and what's tested goes undetected.

**Outcome wanted:** a machine-managed, DAG-validated micro-teaching-unit reference that serves as the canonical registry across all three surfaces, enables bidirectional traceability between exercises and skills, enables coverage reports against both exercise sets and the exam program, and enforces procedure consistency. Human hand-edits to machine references are forbidden — all edits flow through a CLI.

---

## Design principle — exercises are the source of truth

**This is the architectural keystone.** Lesson goals derive from *target exercises — especially real exam questions — not from exam-program text*. Units exist because an exercise requires a skill, not because a syllabus sentence implies one might.

Ground-truth hierarchy (strongest to weakest):

1. **Real CvTE exam questions** from past havo/vwo papers (external reality)
2. **Blueprint target exercises** — each lesson in `course_blueprint_v4.md` is anchored by one target exercise. These are the *center* of each lesson; the lesson's skills, voorkennis, vaardigheden, and consolidation all derive from the target exercise. Treat these as first-class minting input, not descriptive prose.
3. **Target exercises already built** in the platform (paragraph-level `antwoordmodel.md` / `exercises.md`)
4. **Proeftoets-eindbazen and consolidation exercises** (exam-style practice)
5. **Syllabus eindtermen** (`syllabus-eindtermen.md`) — used for *grouping and coverage reporting*, not as the unit-minting source
6. **Blueprint prose around the target exercises** — descriptive context for the target exercises above

**Consequences for how the catalog grows:**

- Units are **minted lazily**. When building or analysing an exercise, if a required skill isn't yet a unit, mint one via CLI. No bulk pre-seeding from the exam program.
- Every unit traces back to at least one exercise that requires it. The `exercise-coverage.md` report makes this traceability visible; units with zero exercise backing are candidates for deprecation.
- **Domain A especially** must be grown exercise-first. CvTE's Vaardigheden domain lists many abstract skills (e.g. "argumenteren met economische begrippen") that rarely surface in concrete exam questions. Pre-minting A-units from the syllabus produces ghost skills — visible in reports but absent from real work.
- **Exam-program coverage is an informational report, not a minting driver.** Gaps surface as "domains/subdomains without exercise-backed units" — diagnostic signal, not a to-do list.

**Reference expansion:** real exam papers join the `external/` bucket and become the primary audit source.

---

## 1. References folder reorganised into three buckets

Track human-in-loop reduction over time via folder location:

```
references/
├── external/   — sourced from authoritative outside bodies; machine-refreshed
├── authored/   — still hand-edited; legacy bucket, target to shrink
└── machine/    — edited only via CLI; integrity-enforced
```

Initial placement:

| File | Bucket | Status |
|---|---|---|
| `syllabus-economie-vwo-2026-versie-2.pdf` | `external/` | mirror |
| `syllabus-eindtermen.md` + `.json` | `external/` | **new**, extracted from PDF |
| `exams/havo-2025-tijdvak-1.pdf` | `external/` | **new**, CvTE download |
| `exams/havo-2025-tijdvak-2.pdf` | `external/` | **new** |
| `exams/vwo-2025-tijdvak-1.pdf` | `external/` | **new** |
| `exams/vwo-2025-tijdvak-2.pdf` | `external/` | **new** |
| `inspectie-standaarden.md` | `external/` | moved |
| `amstelveencollege_quality_standards.md` | `external/` | moved |
| `economie-terminologie.md` | `authored/` | moved; future migration to `machine/` |
| `vraagtypen-en-opgaveontwerp.md` | `authored/` | moved |
| `economic_mathematical_precision_reference.md` | `authored/` | moved |
| `didactiek-principes.md` | `authored/` | moved |
| `skill-categories.md` | `authored/` | moved; provides the 8-way cognitive categorization used during the exam-audit pass; may be partly absorbed into `vraagtypen-en-opgaveontwerp.md` and `micro-teaching-units.md` later |
| `course_blueprint_v4.md` | `authored/` | moved from `knowledge/`; future: machine-managed |
| `micro-teaching-units.md` + `.json` | `machine/` | **new**, born machine-edited |

Earlier years (2020–2024) may be added later for trend analysis; defer unless the 2025 audit reveals a need.

---

## 2. Unit ID prefixes — CvTE domain letters

Eleven prefixes, one per CvTE domain, matching the exam program exactly. Two-digit sequential numbering within domain visually distinguishes unit IDs from eindterm codes (`D01 Marktevenwicht` vs eindterm `D3.2`).

| Prefix | Domain | Scope (relevant slice in current curriculum) |
|---|---|---|
| `A` | Vaardigheden | Math, graph reading, calculation, reasoning — minted lazily as exercises demand |
| `B` | Schaarste | School exam |
| `C` | Ruil | School exam |
| `D` | Markt | Central exam — vraag, aanbod, evenwicht, marktvormen, welvaart |
| `E` | Ruilen over tijd | Central exam |
| `F` | Samenwerken en onderhandelen | Central exam |
| `G` | Risico en informatie | Central exam |
| `H` | Welvaart en groei | Central exam (macro) |
| `I` | Goede en slechte tijden | Central exam (conjunctuur) |
| `J` | Onderzoek en experiment | School exam |
| `K` | Keuzeonderwerpen | School exam |

**Why this works with the exercise-first principle:** since units are minted lazily, the A-bucket stays bounded — only A-skills that a real exercise demands exist. Empty/sparse domains (H, I, G for the current curriculum) are honest gaps in the coverage report, not prefixes we invent materials for.

**Concept-mode pluralism handled natively:** a concept taught at multiple Bloom levels becomes multiple units in the same domain, distinguished by `mastery_target`, `procedure`, and a naming suffix:

| ID | Name | mastery_target | procedure |
|---|---|---|---|
| `D05` | Marktevenwicht (begrip) | understand | — |
| `D06` | Marktevenwicht (berekening) | apply | 6-step |
| `D07` | Marktevenwicht (welvaartsanalyse) | analyze | strategy |

Three-aspect routing (verbal / reasoning / calculation) is captured on each unit via the `aspects` field (`verbaal` / `grafisch` / `rekenen`). **Traceability** to the CvTE exam program goes through `exam_codes`, which can cite A-subdomain eindtermen (e.g. `A2.10` for tweedegraadsvergelijkingen) alongside content-domain codes. The two fields are complementary: `aspects` routes downstream format; `exam_codes` proves coverage.

---

## 3. Unit schema

Each unit entry in `micro-teaching-units.md`:

- **`id`** — `<DomainLetter><2-digit-number>`, e.g. `A01`, `D22`. Permanent once minted, never reused.
- **`name`** — Dutch canonical name with optional parenthesised mode suffix (`(begrip)`, `(berekening)`, `(welvaartsanalyse)`).
- **`layer`** — *derived*: `max(needs.layer) + 1`. Machine computes; never human-assigned.
- **`duration_min`** — target 3–7 minutes; validator warns outside range.
- **`kern`** — one-sentence mastery statement.
- **`needs`** — list of prerequisite unit IDs (DAG edges).
- **`exam_codes`** — list of CvTE eindterm codes from domains A, D, E, F, G, H, I (e.g. `["D3.2", "A2.10"]`); validator rejects unknown codes. `aspects` handles routing; `exam_codes` handles syllabus traceability — complementary, not interchangeable. Empty list allowed for units that cover skills CvTE hasn't codified (legitimate exercise-first discoveries).
- **`mastery_target`** — remember | understand | apply | analyze | evaluate (ceiling, not cap).
- **`prior_learning`** — `previously_taught` | `new_this_year` | `review_and_extend`.
- **`terms`** — list of canonical Dutch terms (validated against `economie-terminologie.md`).
- **`procedure`** — *mandatory for `mastery_target: apply` and above*; numbered steps. Single-source for voorkennis steps, vaardigheden steps, worked-example steps, answer-model steps, slide step-sequences.
- **`pitfalls`** — 1–2 bullets (optional).
- **`generator`** *(math / A units only)* — name of the `GEN_*` function in `engines/skilltree/generators.js`. CLI rejects for non-A units.
- **`deprecated`** / **`deprecated_in_favor_of`** — stability markers.

**Derived at JSON-build time (not human-authored):**
- `category` — from ID prefix (`D05` → `markt`).
- `aspects` — set of verbs from cited eindtermen (`["berekenen", "uitleggen"]`). Lets reports filter "units tested via calculation" without redundant storage.

**Explicitly NOT on the unit:**
- `used_in` paragraph / exercise back-references (reports only, regenerated each build).
- Per-exercise Bloom tags or question types (property of exercises, not units).
- `status: pilot` (pilots don't live long enough to warrant a field).

---

## 4. Stability policy

| Operation | Effect |
|---|---|
| Rename (display name) | free; ID stays |
| Split | mint new IDs; old marked `deprecated_in_favor_of: [...]`; validator warns on stale citations |
| Merge | mint merged ID; old marked deprecated with pointer |
| Renumber | forbidden |
| Delete | `deprecated: true`; citing materials get migration warning |

Deprecated entries remain for ≥1 release cycle; hard-deleted only when validator confirms zero live citations.

---

## 5. Machine-only editing (CLI + future skill)

All edits flow through `build-scripts/references/unit-*.js`. Each accepts `--flag` args or `--spec <JSON>`, validates (schema, refs, cycles, layer derivation, eindterm resolution, procedure-required-for-apply), writes markdown + regenerates JSON, fails loudly.

CLI commands:
- `unit-add`, `unit-rename`, `unit-deprecate`, `unit-update`
- `unit-add-dep`, `unit-remove-dep`
- `unit-split`, `unit-merge`

**Phase 2 (deferred):** `/unit` skill parses Dutch natural language, generates JSON spec, echoes for confirmation, shells out to CLI. Skill has **no file-write tool** — it can only call the CLI. Ship CLI first; add skill after the CLI proves stable through the exercise-audit passes.

---

## 6. Math skilltree migration (first concrete action)

One atomic commit:

1. `seed-math-units.js` reads `base-elements.js`, lifts the 37 skills into `micro-teaching-units.md` as `A01–A37` with a recorded migration map (`F1→A01`, `B3→A09`, ...). Each unit gets `generator: "GEN_A01"`, and rich content from `explanations.js` merged into `kern` / `procedure` / `pitfalls` where applicable.
2. `GEN.*` functions extracted verbatim to `engines/skilltree/generators.js`.
3. `base-elements.js` rewrites to `require('../../references/machine/micro-teaching-units.json')`, filters by `id.startsWith('A')`, joins each unit with its generator via the `generator` field.
4. The 23 per-paragraph data files updated via migration-map substitution (`activeSkills: ["F1", "B2"]` → `["A01", "A09"]`).
5. `engines/tests/skilltree-data.test.js` runs unchanged — all 37 units present, all generators valid under 20-retry stress, all per-paragraph files reference valid IDs.
6. `engines/skilltree/explanations.js` stays for now (rich per-section content); future cleanup folds it into unit entries. Defer.

**Why the 37 math units are pre-justified under the exercise-first principle:** each has a `GEN_*` randomizer that literally generates exercises. The skill tree already embodies "a unit = a skill exercised." Post-migration, run `exercise-coverage.md` to flag any skills never activated in the 23 per-paragraph files as candidates for later review.

---

## 7. Eindtermen register extraction

`build-scripts/references/extract-eindtermen.js` parses `syllabus-economie-vwo-2026-versie-2.pdf` into `references/external/syllabus-eindtermen.md` + `.json`. Format:

```
### D1.4a
- Domein: D (Concept markt)
- Subdomein: D1 (Vraag)
- Tekst: "Het verband tussen de betalingsbereidheid..."
- Verb: herkennen
- Implied bloom: understand
- Year: 2026
```

Run yearly. Yearly delta (`reports/exam-program-delta.md`) diffs against prior snapshot.

---

## 8. Reports

Generated each build at `reports/` (repo root):

| Report | Purpose | CI action |
|---|---|---|
| `exercise-coverage.md` | Per unit → exercises requiring it (target + exam). Units with zero backing flagged. | informational |
| `exam-coverage.md` | Per eindterm → units teaching it → paragraphs citing those units | informational |
| `exam-question-audit.md` | Per exam question (havo/vwo 2025+): **required skills** (unit IDs) + **question type** (from `vraagtypen-en-opgaveontwerp.md`) + referenced eindtermen. Two-dimensional trace. | informational |
| `exam-question-type-distribution.md` | Distribution of question types across real exams vs. platform materials. Highlights under-served question types. | informational |
| `exam-vs-program-gaps.md` | Bidirectional: (a) eindtermen with no real-exam presence ("program-only" ghosts); (b) skills observed in exams without a clear eindterm link ("exam-only" signal). | informational |
| `blueprint-vs-exam-gaps.md` | Skills in real exams not covered by any blueprint target exercise, and blueprint target exercises not exercised in real exams. | informational |
| `dead-units.md` | Units defined but unused by any paragraph plan | informational |
| `orphaned-builds.md` | Built outputs with no live paragraph plan | informational |
| `unresolved-refs.md` | Paragraph plans citing missing unit IDs | **fails CI** |
| `terminology-drift.md` | Units using non-canonical terms | **fails CI** |
| `dag-integrity.md` | Cycles, layer consistency | **fails CI** |
| `exam-program-delta.md` | Yearly syllabus diff | yearly manual review |
| `pilot-status.md` | Pilot paragraph age | monthly |

`exercise-coverage.md` is the primary exercise-first audit surface. The three gap reports (`exam-question-type-distribution`, `exam-vs-program-gaps`, `blueprint-vs-exam-gaps`) are the diagnostic lens: they make visible the drift between (a) what CvTE's syllabus claims is tested, (b) what real exam questions actually test, (c) what the blueprint plans to teach, and (d) what's built in the platform. Gaps the user has intuited for years become mechanically surfaced.

---

## 9. Seeding — exercise-driven, not bulk extraction

**Order (external reality first, then platform intent, each pass dogfoods the CLI):**

1. **Math migration** (see §6). 37 pre-justified `A*` units. Atomic commit. Establishes the CLI + validator as a working system.
2. **Exam audit pass — two-dimensional analysis.** Download havo 2025 and vwo 2025 papers (tijdvak 1 + 2, four PDFs total). Analyse each question individually and record:
   - **Required skills** — the specific cognitive operations / procedures / concepts the student must execute. Each becomes a unit ID (new mint or existing).
   - **Question type** — from the canonical taxonomy in `vraagtypen-en-opgaveontwerp.md` (rekenen, grafisch, uitleg, casus, multiple choice, etc.).
   - **Referenced eindtermen** — which syllabus codes the question plausibly tests.

   For each required skill: if already a unit, cite its ID in `exam-question-audit.md`; if not, mint via `unit-add` with `exam_codes` and `needs` populated. Typically grows D-, E-, H-domain units. The question-type column feeds `exam-question-type-distribution.md` and `exam-vs-program-gaps.md`.
3. **Blueprint target-exercise pass.** Each lesson in `course_blueprint_v4.md` has a target exercise at its centre. Walk every lesson's target exercise, extract required skills, mint missing units. This pass captures *what we plan to teach*. Any skill minted here that didn't appear in the exam audit is either genuine curriculum enrichment or a planning blind spot — `blueprint-vs-exam-gaps.md` surfaces which.
4. **Paragraph-exercise pass.** Walk existing paragraph `antwoordmodel.md` + `exercises.md` files. For each exercise, list required skills. Mint missing units. This pass captures *what's already built*.
5. **Proeftoets / consolidation pass.** Same for `Proeftoets_Eindbazen` and consolidation exercises in `build-scripts/content/`.
6. **Stop.** The catalog now reflects real-exam reality (pass 2), planning intent (pass 3), and built materials (passes 4–5). The three gap reports make any divergence mechanically visible.

**What we explicitly do NOT do:**
- No bulk extraction from voorkennis/vaardigheden builder scripts. Those docs are *outputs* of unit selection, not inputs. If a unit lacks exercise backing, the voorkennis/vaardigheden content attached to it is suspect.
- No pre-minting of domain-A skills from CvTE's A1–A5 subdomain lists. Only mint when an exercise requires it.
- No minting from the blueprint's descriptive prose. Only from the concrete target exercise at each lesson's centre.

Expected unit count after all passes: smaller than the v2 estimate of 80–120 — more like 40–80, reflecting real exercise demand. If it climbs higher, the exam-audit pass should be the single largest contributor, followed by the blueprint target-exercise pass.

---

## 10. How consumers use the reference

- **`econ-explainer-docs`** §4.1 — "cite unit IDs for prior knowledge and new skills" replaces the per-paragraph extraction instruction.
- **`econ-textbook-paragraph`** — `_paragraph-plan.md`'s "Skills & prior knowledge" and "Procedure step plan" fields cite unit IDs.
- **`econ-exercise-builder`** — answer models follow the unit's `procedure` field verbatim. Additionally: the *creation* of a new exercise is the trigger for checking whether every required skill is already a unit, and minting if not.
- **`econ-pptx-templates`** — step slides mirror `procedure`.
- **`build-reasoning-questions`** — each CSV row tagged with `unit_id`.
- **Skilltree engine** — `SKILLS` array derived from JSON filter on `A*`.

---

## Critical files

**Read / reference during implementation:**
- `engines/skilltree/base-elements.js`, `explanations.js`, `skilltree-engine.js`
- `engines/tests/skilltree-data.test.js`
- `build-scripts/templates/template-B_voorkennis.js`, `template-A_vaardigheden.js`, `template-paragraph-plan.md`
- `build-scripts/content/module-1/m1-111-voorkennis.js`, `m1-111-vaardigheden.js`
- `source-data/module-{1,3}/reasoning/*.csv`
- `references/external/syllabus-economie-vwo-2026-versie-2.pdf`
- **`references/external/exams/havo-2025-*.pdf`** (new, to be downloaded from CvTE)
- **`references/external/exams/vwo-2025-*.pdf`** (new, to be downloaded from CvTE)
- `knowledge/course_blueprint_v4.md`
- `references/authored/economie-terminologie.md`

**Create:**
- `references/machine/micro-teaching-units.md` + `.json`
- `references/external/syllabus-eindtermen.md` + `.json`
- `references/external/exams/*.pdf` (downloaded)
- `build-scripts/references/unit-{add,rename,deprecate,update,add-dep,remove-dep,split,merge}.js`
- `build-scripts/references/{extract-eindtermen,build-unit-index}.js`
- `build-scripts/references/seed-math-units.js` (only bulk seeding script; others deprecated in favour of exercise-driven minting)
- `build-scripts/reports/{exercise-coverage,exam-coverage,exam-question-audit,dead-units,orphaned-builds,unresolved-refs,terminology-drift,dag-integrity,exam-program-delta,pilot-status}.js`
- `engines/skilltree/generators.js` (extracted `GEN.*`)
- `tests/micro-teaching-units.test.js`

**Update (in migration commit, atomic):**
- `engines/skilltree/base-elements.js` — imports JSON, joins with generators
- 23 per-paragraph data files — `activeSkills` IDs migrated via mapping table (`F*`/`B*`/`S*`/`E*` → `A*`)
- Existing `references/*.md` files relocated into `external/` or `authored/`
- `CLAUDE.md`, `AGENTS.md` — reference the new folder structure and the exercise-first seeding principle
- `.claude/commands/econ-explainer-docs.md` §4.1 — ID-citation extraction instruction
- `.claude/commands/econ-textbook-paragraph.md`, `build-scripts/templates/template-paragraph-plan.md` — cite unit IDs in "Skills & prior knowledge" and "Procedure step plan"
- `.claude/commands/econ-exercise-builder.md` — add the "mint missing units during exercise creation" workflow step

---

## Verification

End-to-end checks after math migration + exam audit pass:

1. **Math migration parity** — `engines/tests/skilltree-data.test.js` passes unchanged: all 37 units present under new `A01–A37` IDs, all generators valid under 20-retry stress, all 23 per-paragraph data files still reference valid IDs.
2. **Structural** — `tests/micro-teaching-units.test.js` passes: no DAG cycles, every `need` resolves, layers derived correctly, every apply-level unit has a `procedure`, every `exam_codes` entry resolves to a real eindterm.
3. **Exercise backing (primary)** — `exercise-coverage.md` shows zero units with no exercise backing after the exam and target-exercise passes. Any unbackeds remaining are flagged and either linked to an exercise or deprecated.
4. **Exam question traceability** — `exam-question-audit.md` for havo/vwo 2025 shows every question's required skills map to units AND records question type per question. Questions with unmapped skills surface concrete gaps for the next minting pass.
5. **Gap diagnostics** — `exam-vs-program-gaps.md`, `exam-question-type-distribution.md`, and `blueprint-vs-exam-gaps.md` each produce concrete, investigable differences. Review and act or acknowledge; do not auto-fill.
6. **Exam-program coverage (secondary, diagnostic)** — `exam-coverage.md` shows which eindtermen have unit backing and which don't. Gaps are expected and honest; they are NOT auto-filled.
7. **Consistency** — `terminology-drift.md` reports zero non-canonical terms.
8. **Reuse** — rebuild the voorkennis section list for §3.2.1 Marktevenwicht by citing unit IDs from the reference; result matches the already-built document.
9. **CLI dogfood** — run `unit-add` for one net-new unit end-to-end during the exam audit; run `unit-split` end-to-end; verify JSON regenerates, validator passes, and a paragraph plan citing the old ID surfaces as a deprecation warning in the next build's reports.

---

## Open items to confirm with user before implementation

- **Exam years** beyond 2025: add 2024 / 2023 immediately (richer audit baseline) or only if the 2025 pass reveals blind spots.
- **Migration order**: whether the 23 per-paragraph data files migrate atomically with `base-elements.js` (default, recommended) or in a follow-up commit.
- **Blueprint relocation**: `knowledge/course_blueprint_v4.md` moves to `references/authored/` (default) or stays in `knowledge/`.
- **Post-migration math review**: whether to run a review pass of the 37 `A*` units against 23 per-paragraph activeSkills immediately after migration, or defer until after the exam audit produces the broader coverage report.
