---
name: manage-references
description: "Canonical policy + operations reference for the references/ folder — the platform's data backbone. Lists every rule that governs external/authored/machine files, every CLI script that edits or extracts them, and every refresh path. Trigger when the user mentions references, syllabus, eindtermen, catalog, unit-add, unit-update, unit-deprecate, exam_codes, aspects, terms, schema, micro-teaching-units, extract-eindtermen, derive-exam-codes, external/authored/machine, or asks any question about what rules govern data files under references/. This skill is the single authoritative home for policy; if a rule isn't here, it isn't policy — it's a local decision that needs lifting."
---

# Manage-References Skill

## Why this folder exists

Teaching is the work of squaring a circle: on one side a **human** with finite cognitive capacity, prior knowledge, and state of mind; on the other side a **task** with a concrete technical demand. A lesson succeeds when the gap between those two is bridged at an appropriate step size — not too easy (no learning), not too hard (collapse).

`references/` is that bridge in data form. Every file in it holds one side of the pair or the mapping between them:

| Side | What it encodes | Primary files |
|---|---|---|
| **Task demand** | What the exam actually asks; what skills the task requires | `exam-questions.json` (real CvTE questions), `syllabus-eindtermen.json` (what CvTE claims to test) |
| **Student side** | What a unit of teaching looks like — prior knowledge, cognitive load, procedure, mastery level | `micro-teaching-units.{md,json}` (the catalog) |
| **Bridge / contract** | The mapping between student and task (which units each question requires; which eindtermen each unit covers; which canonical vocabulary anchors both) | `exam_codes` and `required_skills` fields; `economie-terminologie.md`; `didactiek-principes.md` |

The **exercise-first principle** follows directly from this framing: the task demand is the ground truth. If a real exam question requires a skill, that skill belongs in the catalog as a teaching unit — independent of whether CvTE has formally named it in the syllabus text. The syllabus register is a mirror of what CvTE describes; it is not a gatekeeper on what students need.

When a policy question comes up, ask the student/task question first: *does a student need this to do an exercise?* If yes, it's in scope. Everything else in this skill operationalises that principle.

## How this skill is used

**Authoritative-reference pattern:** the source-of-truth for each rule is the file this skill points at (schema headers, code, READMEs). The skill consolidates pointers; it does not duplicate content. If the skill and a source file disagree, **the source file wins** and the skill is out of date — fix the skill.

**Policy-change protocol:** if you want to change a policy,
1. edit this skill first (so the rule has one canonical wording),
2. edit the source-of-truth file(s) it points at,
3. mention both in the commit message.

Any rule that isn't listed here is not policy. It's a local decision that should be lifted to policy or dropped.

---

## PART 1: THE THREE BUCKETS

Everything under `references/` belongs to exactly one of three buckets. The bucket determines who can edit the file.

| Bucket | Purpose | Edit policy |
|---|---|---|
| `external/` | Mirrored from authoritative outside bodies (CvTE, Onderwijsinspectie, schools). Ground truth that we cannot change unilaterally. | **Never hand-edit.** Refresh via extractor or downloader script. |
| `authored/` | Hand-edited standards and references maintained by the project (terminology, didactics, precision rules). Legacy bucket — **shrinks over time** as machine pipelines mature. | Hand-editable by humans. |
| `machine/` | CLI-only, integrity-enforced. Catalog + derived artifacts. | **Never hand-edit.** All changes flow through `build-scripts/references/*.js`. Hand edits are reverted by the next script run. |

Source: `references/external/README.md`, `references/authored/README.md`, `references/machine/README.md`, `4veco-platform/CLAUDE.md`.

---

## PART 2: FILES INVENTORY

### `references/external/`

| File | Refresh path | Notes |
|---|---|---|
| `syllabus-economie-vwo-2026-versie-2.pdf` | Download from CvTE when a new syllabus is published | Input to `extract-eindtermen.js` |
| `syllabus-eindtermen.md` + `.json` | `node build-scripts/references/extract-eindtermen.js` | Machine-extracted from the PDF above |
| `exams/*.pdf` | `node build-scripts/references/download-exams.js` | Mirrored from examenblad.nl |
| `exam-questions.json` | `node build-scripts/references/extract-exam-questions.js` | Structured from `exams/*.pdf` |
| `inspectie-standaarden.md` | Manual mirror on regulator update | Onderwijsinspectie framework |
| `amstelveencollege_quality_standards.md` | Manual mirror on school update | School-fit overlay |

### `references/authored/`

| File | Purpose |
|---|---|
| `economie-terminologie.md` | **Legacy canonical Dutch term list.** Being migrated to `machine/begrippen.{md,json}`; still read by the unit-index validator as a fallback for terms not yet seeded into begrippen. |
| `economic_mathematical_precision_reference.md` | Non-negotiable precision rules (object identification, ceteris paribus, text-graph-formula matching). |
| `didactiek-principes.md` | Single source of truth for didactical principles (cognitive load, dual coding, scaffolding, interleaving, Bloom, exercise design). |
| `vraagtypen-en-opgaveontwerp.md` | Question types + exercise formats + answer-model conventions. |
| `skill-categories.md` | 8-way cognitive categorization aligned with CvTE Domein A. |

### `references/machine/`

| File | Refresh path | Notes |
|---|---|---|
| `micro-teaching-units.md` + `.json` | CLI-only (`unit-add`, `unit-update`, `unit-deprecate`, `unit-rename`, `unit-add-dep`, `unit-remove-dep`, `unit-split`, `unit-merge`) | The catalog; schema in the file header |
| `begrippen.md` + `begrippen.json` | CLI-only (`term-add`, `term-update`, `term-deprecate`, `term-rename`); regenerated by `build-begrippen-index` | Platform-wide Dutch term registry with student-facing definitions. JSON is source of truth; `.md` is a generated projection. Derived reverse-index `teaching_units` per term. |

---

## PART 3: POLICIES — FULL LIST

Every rule that governs these files, grouped by topic. Each rule has a source-of-truth pointer and a one-line description of when it applies.

### 3.1 Folder structure (the three buckets)

1. **Three-bucket structure.** Every file under `references/` is `external/`, `authored/`, or `machine/`. New files must land in exactly one bucket at creation.
   *Source:* `references/{external,authored,machine}/README.md`.
2. **`external/` is mirrored.** Never hand-edit; refresh via extractor or downloader script.
   *Source:* `references/external/README.md`.
3. **`authored/` shrinks over time.** Each authored file is a migration candidate to `machine/` once a canonical-editing pipeline exists for it.
   *Source:* `4veco-platform/CLAUDE.md`.
4. **`machine/` is CLI-only.** Hand edits flagged and reverted by the next script run.
   *Source:* `references/machine/README.md`; catalog file preamble.

### 3.2 Catalog schema (`micro-teaching-units.md`)

5. **IDs permanent once minted.** Renames change display name only. Renumber forbidden. Splits/merges mint new IDs and deprecate the old with `deprecated_in_favor_of`.
   *Source:* `references/machine/micro-teaching-units.md` ID-scheme section.
6. **Deprecated units retained ≥1 release cycle** before hard-delete. Hard-deletion requires zero live citations.
   *Source:* catalog schema (lifecycle section).
7. **`needs` forms a DAG; `layer` is stored-with-lower-bound.** Validator enforces `layer >= max(needs.layer) + 1`. Stored layer may exceed derived (for curated tier placements like the skilltree Eindbazen layer).
   *Source:* `references/machine/micro-teaching-units.md` Validation-rules §1–§3.
8. **`aspects` required, non-empty subset of `[verbaal, grafisch, rekenen]`.** Validator hard-fails on empty.
   *Source:* schema §9; `build-scripts/references/build-unit-index.js`.
9. **`terms` must resolve to a canonical Dutch term.** Validator rejects unknown terms. Authoritative source is `references/machine/begrippen.json` (term_nl + synonyms_nl per entry); during the migration phase `references/authored/economie-terminologie.md` is unioned in as a fallback so terms not yet seeded into begrippen still resolve.
   *Source:* schema §5; `build-scripts/references/build-unit-index.js` `loadTerminology`.
10. **`procedure` warned-not-failed for apply+ units** lacking a canonical recipe. Tracked in `reports/procedure-coverage.md`.
    *Source:* schema §6; `build-scripts/references/build-unit-index.js`.
11. **Kern style:** imperative for `apply` / `analyze` / `evaluate`; declarative allowed for `remember` / `understand`. Not validator-enforced.
    *Source:* schema §7.
12. **Canonical-procedure refs.** Voorkennis, vaardigheden, answer-models, slides all cite the unit's `procedure` field verbatim. Drift is flagged in paragraph reviews.
    *Source:* `knowledge/micro-teaching-units-plan.md` §3.

### 3.3 Units lifecycle

13. **Exercise-first minting.** Units are minted lazily when an exercise (real CvTE exam question, blueprint target exercise, or paragraph exercise) requires a skill. No bulk pre-seeding from syllabus text.
    *Source:* `knowledge/micro-teaching-units-plan.md` §9; auto-memory `project_exercises_source_of_truth.md`.
14. **Schema examples must use real CvTE codes.** Invented codes in schema comments are policy violations (learned after the `A4.1` incident).
    *Source:* catalog schema `exam_codes` comment.

### 3.4 Register scope (`syllabus-eindtermen.json`)

15. **Covers CvTE central-exam content for domains A, D, E, F, G, H, I.** A-domain bullets are minted as codes `A1.1..A4.N` from the syllabus spec section. A5 (Experimenten) is excluded per the syllabus' own statement that it is not tested in the CE. School-exam-only domains B, C, J, K are excluded pending a future revision that brings a school-exam need into the catalog.
    *Source:* `references/external/syllabus-eindtermen.md` frontmatter; `build-scripts/references/extract-eindtermen.js` hardcoded scope string.
16. **Terminology-extractor canonicity rules.** Pipe-table rows produce canonical entries; `/` or `,` separates alternatives; em-dash / hyphen placeholder accepted in the number column; gloss-stripped forms added alongside the full form.
    *Source:* `build-scripts/references/build-unit-index.js` `loadTerminology`; `build-scripts/reports/terminology-drift.js` `loadCanonicalTerms`.

### 3.5 Derivation and validation

17. **Question `exam_codes` derive by union.** For each question with non-empty `required_skills` and empty `exam_codes`, the derivation script writes the union of cited units' `exam_codes`. Non-empty question `exam_codes` are preserved (audit-set values take precedence over derivation).
    *Source:* `build-scripts/references/derive-exam-codes.js` docstring.
18. **Stats-line auto-regenerated.** The block between `<!-- STATS LINE -->` and `<!-- STATS END -->` in the catalog markdown is regenerated on every CLI save. Hand edits to the stats line are overwritten.
    *Source:* `build-scripts/references/unit-lib.js` `renderPreamble`.

### 3.6 Reports

19. **Reports are diagnostic; three are CI-gating.** `dag-integrity`, `unresolved-refs`, and `terminology-drift` fail CI. `dead-units`, `needs-coverage`, `terms-coverage`, `procedure-coverage`, `aspects-coverage` are informational-only.
    *Source:* `build-scripts/reports/*.js` exit codes.

### 3.7 Deploy / build

20. **Deploy-time bundling** inlines the catalog + generators into the browser-loadable `shared/skilltree/base-elements.js` at deploy time.
    **The legacy game target is frozen until September 2026** for student-localStorage protection — do not deploy catalog rewires that change skill IDs mid-year.
    *Source:* `scripts/deploy.js` `bundleSkilltreeBaseElements`; auto-memory `project_building_for_next_year.md`.

### 3.8 Workflow

21. **Git worktrees for risky changes.** Platform rewires and legacy deploy tests use sibling worktrees, never modify main directly.
    *Source:* auto-memory `feedback_worktree_for_risky_changes.md`.
22. **Pilots stay outside the platform tree.** Long-term pilot storage lives outside `4veco-platform/` to prevent context rot.
    *Source:* auto-memory `project_pilot_policy.md`.

---

## PART 4: CLI SURFACE

Every script under `build-scripts/references/` and `build-scripts/reports/`, with its one-line purpose. Detailed usage lives in each script's docstring.

### 4.1 Catalog mutation CLIs (`build-scripts/references/unit-*.js`)

All mutation CLIs run the full catalog validator before writing; any validation error rolls back the write. Run these when you need to change a catalog entry — never hand-edit.

| Command | Purpose |
|---|---|
| `unit-add` | Mint a new unit from a JSON spec. Fails on duplicate ID or schema violation. |
| `unit-rename` | Change the display `name` only. ID stays. |
| `unit-update` | Merge-patch any non-ID field on an existing unit (terms, exam_codes, procedure, aspects, needs, kern, …). |
| `unit-add-dep` | Add a prerequisite edge `from → to`. Cycle-checked. |
| `unit-remove-dep` | Remove a prerequisite edge. |
| `unit-deprecate` | Mark a unit deprecated with `replaced_by` pointer. Does not delete. |
| `unit-split` | Split a source unit into multiple new IDs. Source deprecated. |
| `unit-merge` | Merge ≥2 sources into one target (existing or new). Non-target sources deprecated. |

### 4.1b Begrippen mutation CLIs (`build-scripts/references/term-*.js`)

Every CLI regenerates `begrippen.md` and `reports/begrippen-coverage.md` after writing the JSON source-of-truth, and rolls back on validation failure.

| Command | Purpose |
|---|---|
| `term-add` | Mint a new begrip. `--id` auto-slugged from `--term-nl` when omitted. |
| `term-update` | Patch fields on an existing begrip (definition, example, synonyms, related_terms, …). `id` and the derived `teaching_units` cannot be changed here. |
| `term-deprecate` | Mark a begrip deprecated with `--in-favor-of <id>`; `--undo` reverses. |
| `term-rename` | Mint a new id cloned from the old, keep the old as a deprecated redirect, and rewrite `related_terms` cross-links. |
| `build-begrippen-index` | Validate + regenerate md + coverage. `--allow-empty-definitions` during migration. Invoked automatically by every term-* CLI. |

### 4.2 Extraction / derivation scripts

Run these to refresh or derive artifacts; not editors.

| Script | Purpose | When to run |
|---|---|---|
| `extract-eindtermen.js` | Parse syllabus PDF → `syllabus-eindtermen.{md,json}` | Yearly on new CvTE syllabus publication |
| `extract-exam-questions.js` | Parse exams PDFs → `exam-questions.json` | When new exam years are added |
| `derive-exam-codes.js` | Fill question `exam_codes` as union of cited units' codes | After catalog `exam_codes` changes |
| `download-exams.js` | Mirror exam PDFs from examenblad.nl | Yearly or on tijdvak publication |
| `build-unit-index.js` | Validate + emit `micro-teaching-units.json` from `.md` | After any catalog change; each mutation CLI invokes internally |

### 4.3 One-shot migration / audit scripts

Historical / one-shot. Kept for audit reruns; do not invoke casually.

| Script | Purpose |
|---|---|
| `seed-math-units.js` | Initial A-domain seed from skilltree base-elements (one-shot) |
| `seed-begrippen.js` | Parse `authored/economie-terminologie.md` into initial `machine/begrippen.json` with empty definitions (one-shot migration; Phase B editorial fills the definitions). |
| `refresh-math-procedures.js` | Re-pull numbered procedures from `explanations.js` |
| `rewire-skilltree.js` | Rewire `base-elements.js` onto the catalog (one-shot) |
| `apply-audit.js` | Apply exam-audit JSON to catalog (multi-year audits) |
| `migrate-paths.js` | Historical path-migration helper |
| `rewrite-skilltree-test-ids.js` | Legacy ID-rewrite for tests |

### 4.4 Report scripts (`build-scripts/reports/*.js`)

Invoked individually; each writes a markdown file under `reports/`.

| Report | Gates CI | What it shows |
|---|---|---|
| `dag-integrity` | **YES** | Cycles, layer violations, missing IDs |
| `unresolved-refs` | **YES** | Citations to missing or deprecated units in source tree |
| `terminology-drift` | **YES** | Non-canonical terms in unit `terms` field or in `kern`/`name` |
| `dead-units` | no | Live units with zero source-tree citations |
| `needs-coverage` | no | Units with empty `needs` backlog |
| `terms-coverage` | no | Units with empty `terms` backlog |
| `procedure-coverage` | no | apply+ units without a canonical procedure |
| `aspects-coverage` | no | Distribution of `verbaal`/`grafisch`/`rekenen` across the catalog |

---

## PART 5: POLICY-CHANGE PROTOCOL

When you want to change a rule in PART 3:

1. **Edit this skill first** — update the rule wording and any PART 2 / PART 4 consequences.
2. **Edit the source-of-truth file(s)** — schema comment, code docstring, README, or extractor string — so the canonical file matches the skill.
3. **Log the supersession in PART 6** if an older version of the rule still lives in a plan doc or an older commit message.
4. **Commit message convention:** start with `policy:` and name the rule. Example: `policy: extend syllabus register to include A-domain`.
5. **If the rule affects the validator,** update `build-scripts/references/build-unit-index.js` and the tests in `engines/tests/micro-teaching-units.test.js` in the same commit.

Any rule not listed in PART 3 is not policy. It's a local decision. If it should be policy, lift it here first.

---

## PART 6: SUPERSEDED POLICIES

History of retired rules, so a future reader can trace what was tried and why.

- **Register scope = D–I only** (superseded 2026-04-21). Held briefly on the argument that A-domain was "already captured via `aspects`." Rejected by the user on exercise-first grounds: if solving a tweedegraadsvergelijking is exam-required, it belongs in the register regardless of whether CvTE formally numbers it. Also contradicted `didactiek-principes.md` §5.7 which prescribes explicit graph-skill layers. Scope extended to A, D, E, F, G, H, I. Plan: `knowledge/exam-codes-scope-policy-revision-plan.md`.
- **Placeholder single-step procedures** (superseded 2026-04-20). Apply+ units used to be seeded with a procedure = `[kern]` to pass the mandatory-procedure validator. Validator was later relaxed from fail to warn; placeholders were stripped. See commit history + `reports/procedure-coverage.md`.
- **Case-sensitive PDF page-header regex** (superseded 2026-04-20). `extract-exam-questions.js` `PAGE_HEADER_RE` required lowercase `[vh][wa]`; PDFs render `HA-…` uppercase, so headers leaked into question text. Now case-insensitive.
- **Comma-joined canonical terms treated as one token** (superseded 2026-04-20). `loadTerminology` used to split only on `/`; extended to also split on `,`.
- **Stale `A4.1` example in catalog schema** (superseded 2026-04-21). `A4.1` was not a real code when cited. Replaced first with `D3.2, I3.5`; now (after A-domain scope extension) `A2.10` is a real code and becomes the new schema example.
- **"Eleven domain prefixes match CvTE exactly"** (superseded 2026-04-21). Held that the catalog ID prefix set must equal the CvTE A–K domain letters. Superseded after the blueprint walk (49 target exercises across Modules 1–4) surfaced that arbeidsmarkt content — heavily central-exam tested — sits awkwardly across A / D3.10 / H5 / I-labor fragments. New prefix `L` (Arbeidsmarkt) is platform-added as a point-of-attention domain: its `exam_codes` still reference CvTE (H5.x etc.), but the distinct catalog prefix keeps the labor-market coverage visible in reports. Validator regex widened `[A-K]` → `[A-L]` in 6 files. See `references/machine/micro-teaching-units.md` domain table.
- **"H = school exam only" claim in blueprint audit** (superseded 2026-04-21). `knowledge/blueprint-v4-audit.md` classified H as school-exam-only. Wrong: the CvTE register contains 21 H-eindtermen (H1 kringloop, H2 productiefunctie, H3 welvaart, H4 verdeling, H5 arbeidsmarkt), and real CvTE exam-questions cite H-codes 52× across havo+vwo. Audit corrected to "central exam."

---

## PART 7: QUALITY CONTROL PIPELINE

The 8 deterministic report scripts under `build-scripts/reports/` (see PART 4) check the **shape** of the catalog: schema validity, DAG acyclicity, terminology canonicity, reference-resolvability. They cannot judge whether `exam_codes` point to the *right* CvTE eindterm, whether `needs` edges are *structurally justified*, or whether the catalog can be *reached* from a real exam question. That LLM-judgment layer is the QC pipeline.

**Operational entry point:** `skills/qc-references.md` (slash command `/qc-references`). The runner reads versioned prompt files, launches subagents in parallel, walks resulting trees, and writes one timestamped report per run — without ever editing the catalog. The user remains the gate for any mints / edits triggered by findings.

**Test specifications** (one prompt per file under `references/qc-prompts/`):

| Test ID | Prompt file | Catches |
|---|---|---|
| `probe-questions` | `references/qc-prompts/probe-questions.md` | Catalog gaps that real exam topics demand but no unit covers |
| `exam-derived-skills` | `references/qc-prompts/exam-derived-skills.md` | Whether catalog can be reached from real CvTE exam questions |
| `tree-integrity-audit` | `references/qc-prompts/tree-integrity-audit.md` | Wrong exam_codes, over-wired needs, kern↔procedure drift (top-down per-unit) |
| `foundation-audit` | `references/qc-prompts/foundation-audit.md` | L0 units that claim mathematical-foundation status but are really economic; L1 units with unjustified `needs` (bottom-up by layer) |

**Outputs** (visible under `reports/`):
- `reports/qc/qc-run-YYYY-MM-DD.md` — one per run (overwrite if same day).
- `reports/qc/SUMMARY.md` — append-one-row-per-run trend table.

**Cadence:** invoked manually after ≥5 catalog edits since last run, or at minimum monthly. No CI hook (none exists in this repo); re-evaluate when CI lands.

**Adding a new test:** create a new `*.md` prompt file under `references/qc-prompts/`, add a row to its README and to the runner's MVP-test table, and document one expected failure signal so reviewers know what good looks like.

---

## PART 8: LAYER SEMANTICS

The validator in `build-scripts/references/build-unit-index.js` enforces only the structural rule `layer >= max(needs.layer) + 1`. That ensures the DAG math is consistent, but says nothing about **what a given layer number means** for the course. This section is the semantic policy.

### The rule

| Layer | Content | Structural requirement |
|---|---|---|
| **L0** | Pre-course mathematical / calculation skills. Onderbouw-wiskunde that the economics course uses but does NOT teach. Examples: linear-equation solving, percentage change, substituting into a function, reading a graph-axis scale. | `needs=[]`. Content is **mathematical or notational, not economic**. |
| **L1** | Foundational economic concepts. The course's opening vocabulary — things like schaarste, vraag/aanbod, alternatieve kosten, betalingsbereidheid. Some students may have heard these in onderbouw, but the course re-teaches them as first-class content. | Preferred: `needs=[]`. Acceptable: `needs` contain only L0 math primitives (e.g. an economic concept that requires percentage calculation). |
| **L2+** | Economic scaffolding built on earlier economic concepts. | Structural math: `layer = max(needs.layer) + 1`. Some drift tolerated for curated tier placements; flagged by QC runs when severe. |

### Tiebreak rule

When a unit *could* sit at either L0 or L1, **prefer L1**. L0 is the small, bounded set of math primitives; it does not grow unless we're adding genuinely new calculation territory.

### What this means operationally

- **Minting a new unit**: first ask "is this mathematical or economic?" Mathematical → L0 candidate. Economic → L1 candidate (unless it has economic prereqs → L2+). Never assign L0 to an economic concept just because it happens to have `needs=[]`.
- **A unit with `needs=[]` is not automatically L0**. Most `needs=[]` units should sit at L1 (the foundational economic concepts that the course teaches from scratch).
- **A unit that only depends on math primitives** can legitimately be L1 with `needs` pointing at specific A-domain math units — that reflects that the economic concept uses a calculation the student already has.

### What the foundation-audit test checks

The `foundation-audit` QC test samples L0 units and asks: *is this mathematical in character, or is it an economic concept that should be at L1?* It also samples L1 units and asks: *do you actually need the cited `needs`, or is this a standalone economic concept that got over-wired?*

### Drift policy

L0/L1 are the tight layers. Errors here cascade: if an L0 is wrongly classified, dependent chains inherit the misreading. L2+ is allowed looser tolerances — the math still binds, but the "is this the right layer?" judgment relaxes as we climb.
