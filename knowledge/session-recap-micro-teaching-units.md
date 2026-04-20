# Session Recap — Micro-Teaching Units Architecture & Audit

This document summarizes a multi-phase session that designed, built, and populated a machine-managed teaching-unit registry for the 4veco platform, deferred the student-facing deploy to September 2026, and ran a 3-year exam audit against real CvTE exam papers.

## Session arc

1. **Architecture discussion** — iterated on the micro-teaching-units reference design via `knowledge/micro-teaching-units-plan.md` (v1 → v3). Key architectural keystones established below.
2. **Back-end implementation** — built the CLI suite, eindtermen extractor, integrity reports, deploy bundler. All on `4veco-platform/main`.
3. **Skilltree rewire** — isolated in a git worktree; merged to platform `main` only when verified. Module 3 deploy deliberately NOT run.
4. **Exam audit** — 3-year batch audit of havo/vwo 2025+2024+2023 exams via parallel subagents; catalog grew from 37 to 144 units.

## Architectural keystones (durable principles)

These are also saved as auto-memory under `~/.claude/projects/C--Projects-4veco-4veco-platform/memory/`:

- **Machine-only editing.** References under `references/machine/` are edited only via CLI scripts under `build-scripts/references/`. Hand-edits don't survive updates.
- **Exercises are the source of truth.** Units exist because an exercise requires a skill, not because a syllabus sentence implies one might. Ground-truth order: real exam questions > blueprint target exercises > built paragraph exercises > proeftoets > syllabus eindtermen > blueprint prose.
- **CvTE domain letters as ID prefix (A–K).** `A01–A37` for math (vaardigheden), `D/E/F/G/H/I` for central-exam concept domains. `B/C/J/K` are school-exam only and not populated. Two-digit numbering avoids collision with eindtermen codes.
- **Pilots stay outside the platform.** Ephemeral experimentation happens in sibling worktrees or separate folders; platform tree stays clean to prevent context rot.
- **Use `git worktree` for risky changes.** Platform rewires and Module-3 deploy tests isolate in sibling worktrees. Merge only when verified.
- **Building for September 2026 deployment.** Skilltree rewire merged to platform `main` but NOT deployed to Module 3. Student localStorage is keyed by old `F/B/S/E` IDs; clean-cohort boundary in September avoids orphaned-star data mid-year.
- **Understand fully before integrating.** Don't carry a legacy prefix/convention into a new architecture without first confirming what it means in practice today.

## Schema of a unit entry

Each unit in `references/machine/micro-teaching-units.md` has:

- `id` — `<DomainLetter><2-digit>` (e.g. `A01`, `D05`). Permanent once minted.
- `name` — Dutch canonical name with optional `(mode)` suffix.
- `layer` — optionally stored, else derived. Validator enforces `layer >= max(needs.layer)+1`.
- `duration_min` — 3–7 target.
- `kern` — one-sentence mastery statement.
- `needs` — prerequisite unit IDs (DAG edges).
- `exam_codes` — CvTE eindterm codes (validated against `syllabus-eindtermen.json`).
- `mastery_target` — `remember | understand | apply | analyze | evaluate` (ceiling).
- `prior_learning` — `previously_taught | new_this_year | review_and_extend`.
- `terms` — canonical Dutch terms (validated against `economie-terminologie.md`).
- `procedure` — numbered steps; mandatory for `apply+`.
- `pitfalls` — 1–2 bullets (optional).
- `generator` — `GEN_A01`-style name; A-domain only.
- `deprecated` / `deprecated_in_favor_of` — stability markers.

Three-bucket `references/` layout:

```
references/
├── external/   — mirrored from outside bodies (CvTE syllabus + exam PDFs, inspectie, school)
├── authored/   — hand-edited legacy (terminologie, didactiek, vraagtypen, blueprint)
└── machine/    — edited only via CLI (micro-teaching-units)
```

## Commits (chronological, most recent first)

On `4veco-platform/main` branch:

```
f1a83c3  Expand audit to 3 years (2023-2025); catalog now 144 units
f336b90  Audit havo/vwo 2025 exams: catalog grows from 37 to 99 units
f15d2d9  Extract exam questions into structured table
e91bac2  Download havo/vwo 2025 exam PDFs; add machine-refresh script
3d82c0b  Paragraph-plan template now cites unit IDs instead of free text
12e528f  Address implementation-review findings: procedures, pitfalls, tests
bfc39dd  Extract CvTE syllabus eindtermen; wire into validator
4e89bbf  Add unit-split and unit-merge: complete the CLI surface
ae1862c  Deploy: bundle skilltree catalog + generators for browser
3b42a00  Add dead-units.md diagnostic report
c3629eb  Add 3 CI-failing integrity reports: dag, refs, terminology
9af7924  Add 5 more unit-* CLI commands: rename, update, deprecate, add-dep, remove-dep
ace3086  Rewire skilltree to consume micro-teaching-units catalog
6af75bf  Seed math units A01–A37 from skilltree base-elements   ← safe midpoint pre-rewire
d4df162  Add unit-add: mint new unit via CLI
a8d9747  Add build-unit-index: parser + validator + JSON emitter
922ca66  Relocate references/ into external/authored/machine/ buckets
5520344  Scaffold micro-teaching-units reference architecture
```

## Current state of the platform

### Catalog
- **144 units total**: `A=37` (math) + `D=30 + E=6 + F=15 + G=11 + H=26 + I=19` (economic, from audit).
- All integrity reports PASS: `dag-integrity`, `unresolved-refs`, `terminology-drift`.
- 62 tests in `engines/tests/micro-teaching-units.test.js`; 340+ pass across the platform (26 pre-existing failures unrelated).

### CLI suite (all 8 commands in `build-scripts/references/`)
`unit-add`, `unit-rename`, `unit-update`, `unit-deprecate`, `unit-add-dep`, `unit-remove-dep`, `unit-split`, `unit-merge`. Each is a thin wrapper over `unit-lib.js` which loads → mutates → validates (terminology + eindtermen cross-refs) → writes markdown + regenerates JSON atomically.

### Reports (in `reports/`)
- `dag-integrity.md` — fails CI on cycles / schema / stored-layer violations
- `unresolved-refs.md` — fails CI on unknown unit-ID citations in source tree
- `terminology-drift.md` — fails CI on non-canonical terms
- `dead-units.md` — informational: 107 currently "dead" by source-tree scan (they're cited only in `exam-questions.json`, which isn't yet scanned)

### External data
- `references/external/syllabus-economie-vwo-2026-versie-2.pdf` — CvTE syllabus
- `references/external/syllabus-eindtermen.md` + `.json` — 117 eindtermen, machine-extracted
- `references/external/exams/*.pdf` — 24 PDFs (3 years × 2 levels × 2 tijdvakken × {opgaven, correctievoorschrift})
- `references/external/exam-questions.json` — 349 structured questions, all annotated

### Build scripts (in `build-scripts/references/`)
- `build-unit-index.js` — parser + validator + JSON emitter (the foundation)
- `unit-lib.js` — shared helpers for all mutation CLIs
- `unit-*.js` — 8 mutation commands
- `download-exams.js` — yearly CvTE exam refresh (idempotent)
- `extract-exam-questions.js` — opgaven PDF → structured JSON (preserves annotations)
- `extract-eindtermen.js` — syllabus PDF → eindtermen register
- `seed-math-units.js` — one-shot math seed
- `refresh-math-procedures.js` — enrich A-units from explanations.js
- `rewire-skilltree.js` — one-shot rewire of base-elements.js
- `migrate-paths.js` — one-shot references-folder migration
- `apply-audit.js` — merge audit JSONs into catalog
- `audit-2025.json`, `audit-2023-2024.json` — consolidated subagent outputs

### Worktree state
- `4veco-platform/` (main) — at `f1a83c3`, rewire + audit merged
- `4veco-platform-rewire/` — **removed** (merge complete)
- `3. Module 3 - Markt en overheid/` — at `b1f5b88` on its own `main`, **untouched, frozen until Sept 2026**
- `3-Module-3-rewire-test/` — **kept** as a scratch/experimentation space for design improvements for next year

## The 3-year exam audit — headline findings

**349 questions** across 12 exams (havo+vwo × tijdvak 1+2 × 2023/2024/2025) machine-annotated with `question_type`, `required_skills` (unit IDs), `exam_codes` (eindtermen).

**Question-type mix:**
```
uitleg_dat     171 (49%)   "Leg uit dat …"
berekenen       76 (22%)
uitleg_of       33 ( 9%)
noem            25 ( 7%)
classificatie   23 ( 7%)
bron            12 ( 3%)
grafisch         9 ( 3%)
```

**Top-tested eindtermen (concentration of real exam demand):**
```
H1.1  14   Macro-economische begrippen
F2.4  12   Externe effecten
H4.6  10   Belastingschijven
G3.2  10   Principaal-agent
G4.5   7   Moral hazard / eigen risico
D2.1   7   Marktvormen
D3.1   7   Welvaart / surplus
E1.1   7   Intertemporele ruil
I4.1   7   Keynesiaans kruis
```

**Program-only ghost rate: 85 / 117 eindtermen (73%) were not cited in any 2023–2025 exam question.**
By domain: D=34, E=10, F=11, G=10, H=14, I=6. This is the concrete signal that tons of syllabus material is never tested in recent cycles — prime candidate for "redundant blueprint coverage" discussions.

## Module 3 deploy — why NOT shipped

The skilltree rewire renamed 37 math skill IDs from `F/B/S/E` to `A01–A37`. Students' localStorage is keyed by the old IDs (star counts per skill, achieved goals, per-paragraph progress). A mid-year deploy would orphan existing stars — not visibly lost, but dissociated from displayed skills, confusing for students who rely on the tool for homework.

**Decision: deploy after the school year ends.** September 2026 gives a clean-cohort boundary where localStorage resets naturally. Platform work continues on `4veco-platform/main` in the meantime — invisible to students until someone runs `scripts/deploy.js` and pushes Module 3. Deploy bundler (commit `ae1862c`) is ready when that time comes.

## Deferred / not yet built

- **Consumer skill updates.** The 14 `econ-*` skills in `skills/` + `.claude/commands/` (e.g. `econ-explainer-docs`, `econ-exercise-builder`, `econ-textbook-paragraph`) still describe free-text skill references in their prompt contracts. Paragraph-plan template is updated; skills themselves are not.
- **Reasoning CSV `unit_id` column.** `source-data/module-*/reasoning/*.csv` files don't yet tag each row with a unit ID; the build-reasoning-questions script doesn't enforce it.
- **Domain A eindtermen backfill.** The A (Vaardigheden) domain in the syllabus has a different bullet-based structure; `extract-eindtermen.js` skipped it. Needs a special-case parser.
- **Exam-coverage.md report.** For each eindterm: cited N times across years X/Y/Z by questions A/B/C, with the 85 ghosts highlighted. Specs in `reports/README.md`; generator not yet written.
- **Exam-question-audit.md** / **exam-question-type-distribution.md** / **exam-vs-program-gaps.md** / **blueprint-vs-exam-gaps.md** — all spec'd in `reports/README.md`, generators not yet written. The audit data these need is all present in `exam-questions.json`.
- **Blueprint-vs-exam gap analysis.** Read `knowledge/course_blueprint_v4.md` target exercises, intersect required skills with the 144-unit catalog, surface blueprint items with no exam backing (candidates for trimming) and exam skills missing from blueprint (candidates for adding).

## External dependencies added this session

- `pdf-parse` ^2.x as `devDependency` in `package.json` — used by `extract-eindtermen.js` and `extract-exam-questions.js`.

## Reference documents created this session

- `knowledge/micro-teaching-units-plan.md` (v3) — the architecture plan
- `knowledge/references-migration-plan.md` — folder-reorg blast-radius audit
- `knowledge/micro-teaching-units-implementation-review.md` — mid-session review finding 5 gaps, most addressed
- `knowledge/session-recap-micro-teaching-units.md` — this file

## Auto-memory files created/updated

- `project_machine_only_editing.md`
- `project_exercises_source_of_truth.md`
- `project_pilot_policy.md`
- `project_building_for_next_year.md`
- `feedback_worktree_for_risky_changes.md`
- `feedback_understand_before_integrating.md`
- Plus `MEMORY.md` index entries for each

## Natural next steps (for a fresh session)

1. **Build the `exam-coverage.md` and `exam-vs-program-gaps.md` reports.** All input data is in `exam-questions.json` + `syllabus-eindtermen.json`. Each is ~50–100 lines of Node. Produces the definitive "what's heavily tested / what's ghost" artifact for curriculum decisions.
2. **Blueprint-vs-exam gap analysis.** Read `course_blueprint_v4.md`, extract target-exercise skill lists, intersect with the 144-unit catalog, output gap report. Directly answers "is the blueprint complete / what's redundant?"
3. **Propagate unit-ID citation into consumer skills.** Edit `econ-exercise-builder`, `econ-textbook-paragraph`, `econ-explainer-docs` etc. to instruct authors to cite unit IDs. Surgical content edits.
4. **Design-side work in the Module-3 worktree.** User mentioned planning design improvements for next year; worktree is ready as a scratch space.

All four are independent. (1) + (2) together are the most directly actionable for the "building material for next September" goal.
