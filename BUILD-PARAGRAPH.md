# How to Build a Complete Paragraph

This document is the full reference for paragraph production. Start ordinary
assignments from the lane runbooks, then use this file for detail:

- Part A textbook lane: `docs/workflows/textbook-paragraph-lane.md`
- Part B companion/student-web lane: `docs/workflows/web-companion-paragraph-lane.md`

Read `docs/workflows/paragraph-lane-vocabulary.md` before using lane terms.
There are exactly two operational lanes:

- **Part A / textbook lane** owns textbook source, textbook HTML renders, core
  textbook visuals, `build_pdf.py`, paragraph PDFs for human review, textbook
  review, `partA:` quality-ref values, and handoff. Publisher-print chapter/book
  handoff also stays in this lane.
- **Part B / companion lane / student-web companion lane** owns companion route
  files, companion HTML/games, PPTX, web visual variants, shared companion data,
  `_paragraph-plan.md`, companion review, and `companion:` quality-ref values.

`student-web` is a validator profile name, not a third lane. When used with
`--mode part-a`, it checks Part A textbook HTML renders and source
prerequisites; it does not make Part A "student-web material".

`complete` is an integration verification state after both lanes exist, not the
default shape of a production assignment.

This document covers two pipelines that can run independently or together.

| Mode | What it produces | When to use |
|------|-----------------|-------------|
| **Part A only** | Textbook source, textbook HTML renders, core visuals, `build_pdf.py`, and paragraph PDFs | Building source content, the human-review packet, or a publisher/print handoff |
| **Part B only** | Companion/student-web route. Default deliverables are companion HTML/games plus presentation HTML/PPTX; DOCX exports are opt-in | Adding companions to a 4veco-lessen paragraph when textbook content exists |
| **Both (A → B)** | Complete paragraph: textbook + companions | Integration verification or explicitly authorized complete bundle |

## Output profiles

`validate-paragraph.js` combines a lane mode with an export/profile selector.
The profile names are not lane names:

```bash
node scripts/validate-paragraph.js --mode part-a --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode part-b --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode complete --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<paragraph>"
```

| Profile | Purpose | Default? |
|---------|---------|----------|
| `student-web` | Baseline validation profile. In Part A mode it checks textbook source, textbook HTML renders, `build_pdf.py`, and paragraph PDFs for human review. In Part B mode it checks the 14-file companion baseline plus plans, reviews, data, and assets. Passing this profile does not by itself prove the full product route or end-state maturity. No Part B DOCX requirement. | Yes for direct `validate-paragraph.js` runs |
| `legacy-full` | Previous 27-file Part B contract, including all DOCX files, for regression checks on older output. | No |
| `office` | Student-web plus Office exports when editable/downloadable teacher files are explicitly requested. | No |
| `publisher-print` | Part A publisher/book print handoff and book-health profile. Paragraph PDFs are already normal Part A human-review outputs; this profile keeps the chapter/book print gate explicit. | `check-book.js` uses this for Part A book health |

For the older 27-file contract, use the opt-in Part B
[legacy-full companion profile](docs/workflows/legacy-full-companion-profile.md).
It does not create a third lane and does not prove the complete product route.

> **Before you start:** Read the strategic product vision at
> `../4veco-lessen/specifications/product-vision.md`, the operational
> product end-state specification at
> `../4veco-lessen/specifications/product-end-state.md`, and the **Design
> Principles** section in [AGENTS.md](AGENTS.md#design-principles). Paragraph
> work should identify which product-vision pillar it supports. The product
> north star is a visible route from current readiness to target-exercise
> readiness. Two design principles govern every surface: **Dual Coding** (every
> concept pairs text with a visual) and **Unified Student Experience** (same
> procedures and approaches across all formats). These are non-negotiable.
> Paragraph landing V2 additionally uses
> `../4veco-lessen/specifications/paragraph-landing-layout-v2.md` and the
> approved visual fixtures in `references/ui/paragraph-landing-v2/` as the
> visual baseline. Do not build paragraph landing pages from the old lesson
> shell or old resource-card route.

## Quality Standard

The expected outcome is not the smallest acceptable artifact. The expected
outcome is a complete, coherent, student-usable implementation of the stated
specification within the authorized scope.

The work must meet the specification first. If the implementation scope is
bounded, the quality bar inside that scope remains full quality. Missing parts
of the full product must be named as follow-up work, blockers, or explicit
human waivers.

A result is not done because files exist, tests pass, or a surface renders. It
is done only when the generated output matches the specification, supports the
intended student action, preserves the canonical procedure and terminology,
and has evidence from the relevant review gates.

## Specification Fulfilment Matrix

Before building or changing a paragraph, create or update the sprint or
paragraph plan with a matrix like this:

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Student knows current route | Rendered landing/page screenshot | Student-experience review | pending |
| Procedure matches canonical steps | Source and rendered artifact comparison | Companion visual review | pending |
| Visuals support the concept | Rendered HTML/DOCX/PPTX evidence | Visual/companion review | pending |
| Target exercise skills are covered | Paragraph plan, tasks, and answer model | Teacher-learning-quality review | pending |
| Feedback gives next step | Interaction/screenshot evidence | Student-experience review | pending |

## Quality Improvement Candidates

Planning may include improvements beyond the strict current specification, but
they must be classified before implementation:

| Candidate improvement | Classification | Reason |
|---|---|---|
| Improve button copy for next route | `include_now` | Directly improves student affordance. |
| Add a second graph-reading variant | `defer_named_follow_up` | Useful, but only if the current sprint is not about graph variant breadth. |
| Build automatic route decisions | `reject_scope_creep` | Not authorized and conflicts with current product boundaries. |

Use this section to improve quality without letting helpful ideas blur the
current specification.

---

# COMMON pre-conditions (read first, applies to BOTH pipelines)

These four references frame every paragraph build, regardless of mode. Read them before touching either Part A or Part B.

- **`AGENTS.md`** — architecture, deploy rules, design principles. Hoist of hard rules.
- **`../4veco-lessen/specifications/product-vision.md`** — canonical
  strategic direction and trade-off logic. Paragraph plans should identify
  which vision pillar they strengthen.
- **`../4veco-lessen/specifications/product-end-state.md`** — canonical
  end-state definition: every paragraph route moves from current readiness to
  target-exercise readiness.
- **`../4veco-lessen/specifications/companion-core-specifications.md`** —
  stable companion-surface specifications for routes, game row, exit tickets,
  review verdicts, and product-use boundaries.
- **`skills/econ-companion-artifacts.md`** — Part B authoring + regeneration spec. Required reading for any companion edit; per-format Part B skills inherit from it. Skill wins over per-format skill on student-facing rules.
- **`agents/econ-companion-visual-review.md`** — the Part B closure gate. Companion edits ship only when this agent returns PASS or PASS WITH FLAGS.
- **`X.Y.Z-textbook-handoff.md`** (per paragraph) — Part A's handoff to Part B, filled from `build-scripts/templates/textbook-to-companion-handoff.md` before companion production starts.
- **`_paragraph-plan.md`** (per paragraph) — Part B's implementation plan for concepts, terminology, visual variants, procedure registry references, and route construction. Existing paragraphs may already have one; new Part A-only assignments do not need to author companion sections.

**Pipeline-aware validator:**

```bash
node scripts/validate-paragraph.js --mode part-a "<paragraph folder>"   # textbook layer only
node scripts/validate-paragraph.js --mode part-b "<paragraph folder>"   # companion layer only
node scripts/validate-paragraph.js --mode complete "<paragraph folder>" # aggregate
```

`--mode part-a` gates `${parNr}-review.md`. `--mode part-b` gates `${parNr}-companion-visual-review.md`. `--mode complete` aggregates both. Verdicts are parsed structurally from each file's `## 2. Verdict` block — non-FAIL is required to pass.

**Quality records (single file, two blocks):**

`${parNr}-quality-ref.yaml` is `schema_version: 2`. Carries a `partA:` block (asset state, content presence, Part A review verdict) and a `companion:` block (Part B review verdict, hard-fail count, procedure step count, alt-text + checklist-route + artifact-tool-render flags, surface-by-surface state). In Part B and complete modes, the validator requires `companion.review_file`, `companion.review_verdict`, and `companion.hard_fails_open` to match `${parNr}-companion-visual-review.md`. Defined in `skills/econ-quality-control` and in `docs/workflows/paragraph-quality-ref-schema-v2.md`.

---

# PART A: TEXTBOOK BUILD (markdown -> graphs -> textbook HTML / print outputs)

Produces the textbook paragraph: theory, exercises, answer models, graphs,
textbook HTML renders, and paragraph PDFs. The baseline `student-web` validator
profile requires the markdown source, textbook HTML renders, `build_pdf.py`,
and the type-specific PDF packet for Part A human review. `publisher-print`
remains a Part A chapter/book print-handoff profile; it is not the only
paragraph PDF gate.

**Skills:** `econ-textbook-paragraph`, `econ-exercise-builder`, `economic-graph`, `econ-pdf-builder`

## A1: Input

- **Blueprint paragraph spec** — target exercise, lesson goals, difficulty notes
- **Shared conventions** — from `_chapter-plan.md` if building as part of a chapter (notation, colours, shared contexts, interleaving targets)
- **Prior paragraph context** — if this paragraph depends on an earlier one (key formulas, terminology)

## Book 2+ Part A exercise-authoring input contract

For every newly authored Book 2 and later theory paragraph—not only official
exam targets—design backward in this order:

`lesson goals -> doeloefening -> target subquestions/operations -> worked
example and practice`

Record this table in the paragraph plan before authoring:

| Lesson goal | Target subquestion/operation | Worked example | Start check | Guided practice | Independent practice | Covered/gap |
|---|---|---|---|---|---|---|
| [goal] | [observable operation] | [where modelled] | [where checked] | [where scaffolded or n/a] | [where practised] | [covered or named gap] |

The worked example uses the same operation chain as the doeloefening at lower
complexity and introduces no operation absent from the target or lesson goals.
Retrieval in Startopgaven may use only prerequisites already taught. Book 1
output is frozen: do not retrofit it and do not use this contract as a
retroactive Book 1 content check.

## Exam-target paragraph input contract

When the target exercise is an official exam question, the paragraph plan must
include an exam-target decomposition table and an exam-target route trace.
Every official answer-model step must be traceable to one of:

- taught explicitly in Part A;
- practised in textbook opgaven;
- scaffolded in begeleide inoefening;
- repeated in a companion/game surface;
- assumed as prior knowledge with MTU evidence;
- deliberately out of scope, with reason.

A paragraph cannot receive an exam-target PASS if students are asked to perform
an answer-model operation that is not taught, practised before the target,
scaffolded in printed Part A, or justified as prior knowledge. A companion or
game repetition may reinforce the operation later, but cannot close a gap in
the paper lesson route.

The trace must follow the student-facing route, not only the source files. For
each official prompt/source/correction-model requirement, name where the
student encounters the required concept or operation in the explanation,
practice route, skill-map route, shared task shell, target-equivalent exit
ticket, and answer model. If a later surface does not exist yet, mark it
`blocked: [named sprint/gate]`; do not silently treat absence as coverage.

Required `_paragraph-plan.md` section for exam-target paragraphs:

```md
## Exam-target exercise decomposition

Source:
- official exam:
- year / tijdvak:
- opgave:
- question(s):
- official correction model:
- source annexes / figures / tables:

Target answer requirements:
| Answer-model step | Points | Required concept | Required calculation | Required visual/source operation | Required answer wording |
|---|---:|---|---|---|---|

Paragraph build implications:
| Required exam operation | Where taught in Part A | Where practised in opgaven | Where scaffolded in begeleide inoefening | Where repeated in game/companion | Status |
|---|---|---|---|---|---|

Exam-target route trace:
| Official requirement | Explanation | Practice route | Skill-map route | Shared task shell need | Target-equivalent exit ticket | Answer model | Review/gate evidence |
|---|---|---|---|---|---|---|---|

Answer-form chain:
| Question / substep | Underlying operation | Answer form or modifier | Required task type | MTU / answer-form evidence | Held or blocked condition |
|---|---|---|---|---|---|
```

The `Shared task shell need` column must use student-action language such as
numeric input, calculation/work capture, final-answer entry, unit/notation
field, short constructed response, table-value selection, graph reading, point
placement, or graph-construction substitute. It must not expose internal MTU or
operation codes to students. The `Answer-form chain` may cite internal MTU IDs
as builder evidence, but generated student-facing labels must remain plain
Dutch.

## A2: Build content

Follow `econ-textbook-paragraph` skill exactly:

1. Write `X.Y.Z [Name] – paragraaf.md` — motivating problem, theory, `## Uitgewerkt voorbeeld`, compact non-heading summary, then the remaining exercise route
2. Extract exercises into `X.Y.Z [Name] – opgaven.md` — the seven canonical `##` headings; keep the compact non-heading summary between `## Uitgewerkt voorbeeld` and `## Startopgaven`
3. Write `X.Y.Z [Name] – antwoorden.md` — complete answer model with step-by-step solutions

For newly authored Book 2+ theory paragraphs the seven printed headings are,
in exact order:

```markdown
## Uitgewerkt voorbeeld
## Startopgaven
## Begeleide inoefening
## Zelfstandige oefening
## Doeloefening
## Denkertje / Bonusopgave
## Herhaling / Herhaling en interleaving
```

Keep the summary as a compact non-heading box after the worked example and
before Startopgaven. No `## Samenvatting`, `## Website-help`, generic `##
Opgaven`, `## Voorkennis ophalen`, or other top-level heading may appear among
the seven canonical headings. Printed student copy uses only this paper route:

> **Korte route:** Startopgaven → Zelfstandige oefening → Doeloefening.
> **Extra hulp nodig?** Maak eerst Begeleide inoefening.

All normal-route explanation and scaffolding must be present in print. Do not
direct students to a website, online explanation, companion page, laptop,
phone, tablet, QR code, or other device. Keep Part A, Part B, lane, companion
route, and repository terminology in internal guidance and handoffs only.

Author to these ranges: Startopgaven 5–8 minutes; optional Begeleide inoefening
8–15; Zelfstandige oefening 10–18; Doeloefening 8–12; optional
Denkertje/Bonusopgave 8–15 outside core; closing review 4–8, often homework.
Startopgaven combines already-taught prerequisite retrieval and a compact,
low-stakes current-content comprehension check—not mastery, diagnosis, or
automatic routing. The guided heading stays printed while its student route is
optional; it keeps the same goal/target, uses stronger explicit support with
deliberate fading, and has neutral skip wording. Bonus
builds cognitive flexibility rather than more arithmetic. Closing review has
1–2 accessible cumulative tasks and no new theory.

For each paragraph, record and verify:
`motivation + instruction + worked example + compact summary and transitions +
actual Startopgaven + actual Zelfstandige oefening + actual Doeloefening =
planned lesson minutes <= 55`. The recommended
23–38-minute core-range sum is not sufficient proof because the other lesson
phases also consume time. Justify any range deviation and never remove a target
operation to force the arithmetic to fit.

For consolidation paragraphs (last § in chapter), follow `econ-consolidation-builder` instead:
1. Write `X.Y.Z Gemengde opgaven – opgaven.md` — source material + exercises
2. Write `X.Y.Z Gemengde opgaven – antwoorden.md` — answer model
3. No paragraaf.md — consolidation has no theory section; its opgaven/antwoorden markdown, textbook HTML renders, `build_pdf.py`, and PDFs are required in Part A baseline validation

## A3: Build graphs

Follow `economic-graph` skill:

1. Create `_assets/` folder in the paragraph folder
2. Generate SVG for every graph referenced in the markdown
3. Convert each SVG to PNG (via cairosvg or sharp)
4. Save both in `_assets/` with naming: `X.Y.Z_{type}_{number}.{svg|png}`
   - Types: `fig` (theory), `ex` (exercises), `we` (worked example)

## A4: Build Part A paragraph PDFs

1. Create `build_pdf.py` (adapt from existing template — `ASSET_DIR="_assets"`, strip Pandoc defaults, paragraph name in footer)
2. Run to generate: paragraaf.pdf, opgaven.pdf, antwoorden.pdf (or opgaven.pdf + antwoorden.pdf for consolidation)
3. Use WeasyPrint (prepend `C:/msys64/mingw64/bin` to PATH)

## A5: Asset completeness gate (HARD GATE)

Before any review, verify:

1. Every `![...](...)` reference in .md files → file exists in `_assets/`
2. Every `.svg` has a matching `.png`
3. Asset naming follows `X.Y.Z_{type}_{number}.{ext}`
4. No orphaned assets (files in `_assets/` not referenced in any .md)
5. All required Part A PDFs exist and are >10KB

**If anything fails → go back and fix it. Cannot proceed with missing assets.**

## A6: QC review (INDEPENDENT SUB-AGENT — MANDATORY)

Run `econ-paragraph-review` via a separate sub-agent (not the builder):

> "You are a QC reviewer. You did NOT build this paragraph. Read `econ-paragraph-review`, then review the paragraph at [path]. Run Pass 0 (asset integrity), Pass 1 (didactic), Pass 2 (mathematical). Report all issues."

Save output as `X.Y.Z-review.md`. Fix all FAIL items before proceeding.

The builder is **prohibited from** running this review itself.

## A7: Quality ref (INDEPENDENT SUB-AGENT — MANDATORY)

Generate `X.Y.Z-quality-ref.yaml` via a separate sub-agent:

> "Read `econ-quality-control`. Inventory all components that actually exist (check file existence). Run asset integrity checks. Generate quality_ref YAML. Be honest about gaps."

## A8: Textbook-to-companion handoff

Copy `build-scripts/templates/textbook-to-companion-handoff.md` to
`X.Y.Z-textbook-handoff.md` and fill the textbook evidence Part B needs:
source files, target exercise, operation chain, terminology, procedures, core
visuals, exercise map, and explicit boundaries. This is the clean interface
between the textbook lane and the companion lane.

## A-verify: Part A checklist

**Theory paragraphs:**
- [ ] paragraaf.md, opgaven.md, antwoorden.md exist
- [ ] paragraaf.pdf, opgaven.pdf, antwoorden.pdf exist (>10KB each)
- [ ] build_pdf.py exists
- [ ] `_assets/` has SVG+PNG pairs with `X.Y.Z_{type}_{number}` naming
- [ ] 0 broken image references
- [ ] `X.Y.Z-review.md` exists (from independent sub-agent)
- [ ] `X.Y.Z-quality-ref.yaml` exists (from independent sub-agent)
- [ ] `X.Y.Z-textbook-handoff.md` exists and names what Part B may reuse/adapt
- [ ] Book 2+ backward-design alignment table covers every goal and target operation
- [ ] Seven Part A headings use exact `##` level and order; theory → Uitgewerkt voorbeeld → compact non-heading summary → Startopgaven is preserved
- [ ] Both Startopgaven roles and route note are present; a whole-lesson equation using actual question estimates totals ≤55 minutes
- [ ] Optional guided route keeps the same goal, adds/fades support, and uses neutral skip wording
- [ ] Bonus builds cognitive flexibility; closing review has 1–2 accessible taught-content tasks and no new theory
- [ ] Summary is before Startopgaven with ≤5 points; printed copy has the paper support note and no website/device/internal-lane direction

**Consolidation paragraphs:**
- [ ] opgaven.md, antwoorden.md exist (no paragraaf.md)
- [ ] opgaven.pdf, antwoorden.pdf exist (>10KB each)
- [ ] build_pdf.py exists
- [ ] `_assets/` has SVG+PNG pairs (if any graphs)
- [ ] 0 broken image references
- [ ] `X.Y.Z-review.md` exists
- [ ] `X.Y.Z-quality-ref.yaml` exists
- [ ] `X.Y.Z-textbook-handoff.md` exists and names what Part B may reuse/adapt

**Part A is complete when all items are checked.**

---

# PART B: LESSEN COMPANIONS (HTML-first, Office optional)

Produces the Part B companion/student-web layer for a lessen paragraph. The
default Part B deliverable set requires HTML companions, HTML games, the
presentation HTML plus editable PPTX, `index.html`, plans, reviews, shared game
data, and assets.
Word documents are optional Office exports and are not part of the default
Part B completion gate. Part B can use `_assets/` graphs from Part A as source
material, but must adapt visuals to the companion surface instead of
copy-pasting textbook images.

Part B starts from the approved Part A handoff. If the handoff is missing,
stale, or says `BLOCKED`, stop and request a Part A repair or handoff update
instead of silently rewriting textbook source files.

**If Part A was run first:** the `_assets/` folder already contains textbook graphs. Part B builders (presentatie, voorkennis, vaardigheden, nieuws, samenvatting, begeleide inoefening) may derive from these graphs, but the preferred output is surface-specific variants: slide, optional Office-doc, summary thumbnail, web-light, and web-dark where relevant. The economic data and reasoning should stay consistent; the layout, contrast, typography, proportions, annotations, and theme colors should be adapted.

> **Visual variant rule:** Do not treat dual coding as literal reuse of Part A book art. A visual anchor means students see the same concept and data across surfaces, not the same PNG pasted everywhere. Web pages with dark mode require a dark visual variant when the image contains text, axes, colored fills, or a light background.

## B0. Target and layout

- **Target repo:** the sibling `../4veco-lessen` checkout unless the task sets an explicit lesson root such as `FOURVECO_LESSEN_ROOT`.
- **Naming:** `Boek N - Title / N.X Hoofdstuk X - Name / N.X.Y [Naam]`. Books replace the old "Module N" level; chapters and paragraphs keep their two- and three-part numbering.
- **Per-paragraph layout is flat.** All generated Part B files, including `index.html`, sit directly in the paragraph folder alongside Part A outputs (`paragraaf.md`, `opgaven.md`, `antwoorden.md`, `_assets/`, review.md, quality-ref.yaml, optional Part A publisher PDFs, and opt-in Office exports). No `1. Voorbereiden/`, `2. Leren/`, `3. Oefenen/` subfolders.
- **Section labels** in tables below (Voorbereiden / Leren / Oefenen) identify the pedagogical role of a file, not a folder. Files are grouped by filename convention (`uitleg voorkennis`, `presentatie`, `begeleide inoefening –`, `basis –`, etc.).
- **`shared/` lives at book root:** `4veco-lessen/Boek N - Title/shared/` holds engine JS/CSS and the game data files (`shared/questions/`, `shared/procedure/`, etc.).
- **Legacy subfolder-layout references in older guides are legacy.** For new work, this spec supersedes them. The old game target stays on its subfolder layout until it retires in September 2026.

## B0a. First-time Book Setup (one-time per book)

Before the first Part B/complete paragraph in a book, bootstrap the book root. Do this once per book, not once per paragraph.

Required bootstrap state:

- Book-root `deploy-config.json` exists and is valid.
- Book-root `shared/` exists.
- The following `shared/` subfolders exist:
  - `shared/questions/`
  - `shared/reasoning/`
  - `shared/newsdetective/`
  - `shared/procedure/`
  - `shared/skilltree/`
- Platform-side book directories exist:
  - `build-scripts/content/book-N/`
  - `source-data/book-N/reasoning/`

For Book 1, the manifest path is:

`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`

The static helper file `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` can be seeded from a verified helper-source document in the current book/source workflow. Prefer a book-local source under `../4veco-lessen/` or an owned reference template when one exists.

Important:

- `scripts/deploy.js` is **not** a read-only probe. It writes engine files and generated shells into the target book.
- For normal Part B companion/student-web builds, deploy skips DOCX-to-HTML converters. Set `RUN_DOCX_CONVERTERS=1` only for Office/legacy builds that intentionally use Word sources.
- Do not use deploy as a harmless existence check.

## B1. Definition of Done: validator baseline and export profiles

The default Part B **validation baseline** is checked with `--mode part-b
--profile student-web`. It has 14 required root files including `index.html`
and keeps Office exports opt-in. Passing this baseline proves the executable
file/profile contract only; it is not, by itself, a claim that the full
student product route or product end state is complete.

Part B `student-web` validation-baseline files:

1. `X.Y.Z [Naam] – instapquiz.html`
2. `X.Y.Z [Naam] – nieuws-detective.html`
3. `X.Y.Z [Naam] – uitleg voorkennis.html`
4. `X.Y.Z [Naam] – presentatie.pptx`
5. `X.Y.Z [Naam] – presentatie.html`
6. `X.Y.Z [Naam] – uitleg vaardigheden.html`
7. `X.Y.Z [Naam] – nieuws met visual.html`
8. `X.Y.Z [Naam] – samenvatting.html`
9. `X.Y.Z [Naam] – youtube-videos.html`
10. `X.Y.Z [Naam] – stappenplan.html`
11. `X.Y.Z [Naam] – redeneer-spel.html`
12. `X.Y.Z [Naam] – wiskundevaardigheden.html`
13. `X.Y.Z [Naam] – begeleide inoefening.html`
14. `index.html`

The current product end state is a coherent route:
`Start -> Leer -> Check -> Oefen -> Exit ticket`. `Check` includes an advisory
short check for feedback and repair, while the exit ticket is a separate
target-equivalent proof task. Those route obligations may be implemented
within or alongside the baseline files, but file existence alone does not
establish their completeness. Plans, rendered reviews, and quality records
must inspect the actual route and name any missing short-check or exit-ticket
surface as a blocker, follow-up, or explicit human waiver.

This Part B route is not the printed Part A exercise sequence and must never be
used as a replacement for the seven Book 2+ Part A headings defined in A2.

Student-web is not a minimal shell contract. For a new scaling paragraph, the
rich HTML companions (`uitleg voorkennis`, `uitleg vaardigheden`,
`samenvatting`, `nieuws met visual`, `youtube-videos`, and
`begeleide inoefening`) must be reviewable as the intended end product:
shared `voorkennis.css` layout, left navigation, hero cards, clear route
affordances, light/dark theme support, and no student-facing internal unit
codes. Use native HTML directly only when it preserves this shared structure.

The table below is the **legacy-full / office export matrix**. It consists of
the 14 baseline files plus exactly 13 additional DOCX files, for 27 root files
in total. Use it only when the requested product explicitly includes Word
handouts or when validating the old 27-file contract. Differentiated
basis/midden/verrijking handouts are Office/legacy exports, not default
`student-web` baseline files.

| # | File | Section | Required | Builder | Source input | Output type |
|---|------|---------|----------|---------|--------------|-------------|
| 1 | `X.Y.Z [Naam] – instapquiz.html` | Voorbereiden | Yes | `generate-quiz-shells.js` (auto) | `shared/questions/X.Y.Z.js` | Generated |
| 2 | `X.Y.Z [Naam] – nieuws-detective.html` | Voorbereiden | Yes | `build-newsdetective-shells.js` (auto) | `shared/newsdetective/X.Y.Z.js` | Generated |
| 3 | `X.Y.Z [Naam] – uitleg voorkennis.docx` | Voorbereiden | Office/legacy only | Adapt `template-B_voorkennis.js` only if Word is requested | Book content + domain knowledge | Optional Office export |
| 4 | `X.Y.Z [Naam] – uitleg voorkennis.html` | Voorbereiden | Yes | Native HTML generator preferred; converter allowed for Office/legacy | Book content + domain knowledge | Generated/converted |
| 5 | `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` | Voorbereiden | Office/legacy only | Copy only for Office package | Static file (identical in every paragraph) | Optional Office export |
| 6 | `X.Y.Z [Naam] – presentatie.pptx` | Leren | Yes | Presentation V2 semantic model when available; legacy Office builds may adapt `pptx-331-rol-overheid.js` | Book content + semantic visuals/SVG graphs | Scripted-manual |
| 7 | `X.Y.Z [Naam] – presentatie.html` | Leren | Yes | Presentation V2 semantic model when available; `convert_presentatie.py` is legacy Office/full-package only | Same semantic model or file #6 (.pptx) | Generated/converted |
| 8 | `X.Y.Z [Naam] – uitleg vaardigheden.docx` | Leren | Office/legacy only | Adapt `template-A_vaardigheden.js` only if Word is requested | Book content + domain knowledge | Optional Office export |
| 9 | `X.Y.Z [Naam] – uitleg vaardigheden.html` | Leren | Yes | Native HTML generator preferred; converter allowed for Office/legacy | Book content + domain knowledge | Generated/converted |
| 10 | `X.Y.Z [Naam] – nieuws met visual.docx` | Leren | Office/legacy only | Adapt `nieuws-351-352-afsluiting.js` only if Word is requested | Recent Dutch news + SVG visual | Optional Office export |
| 11 | `X.Y.Z [Naam] – nieuws met visual.html` | Leren | Yes | Native HTML generator preferred; converter allowed for Office/legacy | Recent Dutch news + SVG visual | Generated/converted |
| 12 | `X.Y.Z [Naam] – samenvatting.docx` | Leren | Office/legacy only | Adapt `samenvatting-351-352-rebuild.js` only if Word is requested | Key concepts from paragraph | Optional Office export |
| 13 | `X.Y.Z [Naam] – samenvatting.html` | Leren | Yes | Native HTML generator preferred; converter allowed for Office/legacy | Key concepts from paragraph | Generated/converted |
| 14 | `X.Y.Z [Naam] – youtube-videos.html` | Leren | Yes | Small per-paragraph generator (e.g. `b1-111-youtube-videos.js`) using shared voorkennis.css | 3 real YouTube video IDs | Scripted-manual |
| 15 | `X.Y.Z [Naam] – stappenplan.html` | Leren | Yes | `build-procedure-shells.js` (auto) | `shared/procedure/X.Y.Z.js` | Generated |
| 16 | `X.Y.Z [Naam] – redeneer-spel.html` | Oefenen | Yes | `build-reasoning-engine.js` (auto) | `shared/reasoning/X.Y.Z.js` | Generated |
| 17 | `X.Y.Z [Naam] – wiskundevaardigheden.html` | Oefenen | Yes | `build-skilltree-shells.js` (auto) | `skilltree` field in book manifest | Generated |
| 18 | `X.Y.Z [Naam] – begeleide inoefening – vragen.docx` | Oefenen/begeleide inoefening | Office/legacy only | Adapt `inoefening-351-afsluiting.js` only if Word is requested | Exercises with scaffolding | Optional Office export |
| 19 | `X.Y.Z [Naam] – begeleide inoefening – antwoorden.docx` | Oefenen/begeleide inoefening | Office/legacy only | Same script as #18 | Same | Optional Office export |
| 20 | `X.Y.Z [Naam] – begeleide inoefening.html` | Oefenen/begeleide inoefening | Yes | Native HTML generator preferred; converter allowed for Office/legacy | Textbook opgaven + answer model | Generated/converted |
| 21 | `X.Y.Z [Naam] – basis – vragen.docx` | Oefenen/basisopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 22 | `X.Y.Z [Naam] – basis – antwoorden.docx` | Oefenen/basisopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 23 | `X.Y.Z [Naam] – midden – vragen.docx` | Oefenen/middenopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 24 | `X.Y.Z [Naam] – midden – antwoorden.docx` | Oefenen/middenopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 25 | `X.Y.Z [Naam] – verrijking – vragen.docx` | Oefenen/verrijkingsopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 26 | `X.Y.Z [Naam] – verrijking – antwoorden.docx` | Oefenen/verrijkingsopgaven | Deprecated/Office only | Do not build for student-web | Legacy three-track exercises | Optional legacy export |
| 27 | `index.html` | Root | Yes | `build-landing-page.js` (auto) | Scans folder contents | Generated |

> **Flat-layout filename change:** in the retargeted Part B, opgavenset and begeleide-inoefening filenames keep the `X.Y.Z [Naam] –` prefix so they stay unique at the paragraph root (since there are no longer `basisopgaven/` or `begeleide inoefening/` subfolders to disambiguate them). Role labels in the Section column identify pedagogical role only, not folder paths.

### Output type definitions

| Type | Meaning | Human effort |
|------|---------|--------------|
| **Generated** | Fully automated from data files. deploy.js handles this. | Create the data file only. |
| **Converted** | Automated transformation of an existing .docx to .html. | Run the converter after creating the .docx. |
| **Scripted-manual** | A Node.js script generates the file, but the script must be written per-paragraph with paragraph-specific content. Copy a reference script, replace the content section. | Write economics content, adapt a reference script, run it. |
| **Manual** | Written by hand (no generator). | Create the file directly. |
| **Static** | Identical copy in every paragraph. | Copy from an existing paragraph. |

---

## B2. Input contract

These are the raw inputs needed to build one paragraph. They must exist BEFORE running any builder.

### A. Game data files (→ `shared/` in module repo)

| Input | Location | Format | Who creates it |
|-------|----------|--------|----------------|
| Quiz questions | `shared/questions/X.Y.Z.js` | JS: `var QUIZ_DATA = { meta, categories, questions }` | Agent writes the JS file. 15 questions, 3-4 categories, at least one difficulty:3 per category. |
| Reasoning questions | `source-data/book-N/reasoning/X.Y.Z.csv` | Semicolon-delimited CSV, 15 rows, 5 modes | Agent writes CSV, then runs `build-reasoning-questions.js` to produce `shared/reasoning/X.Y.Z.js`. |
| Newsdetective data | `shared/newsdetective/X.Y.Z.js` | JS: `var NEWS_DETECTIVE_DATA = { meta, article, rounds }` | Agent writes the JS file. Real Dutch news, 4 rounds. |
| Procedure data | `shared/procedure/X.Y.Z.js` | JS: `var PROCEDURE_DATA = { meta, procedures }` | Agent writes the JS file. Steps aligned with uitleg vaardigheden. |
| Skilltree config | `skilltree` field in the book manifest paragraph entry | JSON: `{ "skills": ["A38", ...], "chapterSkills": ["A38", ...] }`; use `{ "skills": null }` only when paragraph mode should deliberately expose all skills | Agent adds to manifest. Data file auto-generated in `shared/skilltree/`. |

### B. Rich document content — per-asset production specs

Each scripted-manual asset follows the same pattern: **read source → write build script with content → run script → get .docx/.pptx**. But the raw input, the extraction process, and the reusable vs custom split differ per asset. Here is the exact spec for each.

#### Presentatie (.pptx)
| | |
|---|---|
| **Raw input** | Textbook paragraph: concepts, formulas, worked examples. Read via python-docx. |
| **Agent process** | Extract 5-8 key concepts. For each: write a theory slide + design an SVG graph that visualises it. |
| **Reference script** | `pptx-331-rol-overheid.js` — copy, replace slide content + SVG graph functions. Uses shared `lib-pptx.js`. |
| **Reusable (don't change)** | `lib-pptx.js` exports: PC/SC/HEX palettes, T typography presets, `defineMasters()`, `svgToPng()`, `ICON`/`placeIcon()`, `svgHeader()`, `editorialTitle()`, `fixPptxFile()`, `roundtripWithLibreOffice()`. |
| **Custom (must write)** | Slide sequence, text content per slide, SVG graph code per concept, speaker notes. |
| **Skills to read first** | `econ-pptx-templates` + `economic-graph` |
| **Hard rules** | Theory + worked examples only, NEVER exercise instructions. Min 3 SVG→PNG graphs. Min 18pt font. After `writeFile()` always call `fixPptxFile()` + `roundtripWithLibreOffice()` — raw PptxGenJS output triggers PowerPoint repair dialog. **Teacher-supporting slide rules** (see `econ-pptx-templates` skill): one idea per slide, on-slide prose ≤ one sentence per concept, long explanations live in speaker notes using the `Vraag / Uitleg / Pitfall / Overgang` template, complex graphs use progressive disclosure across 2–3 slides. |
| **QA gate — teacher read-through** | After LibreOffice round-trip, render to PDF+PNG (`soffice --convert-to pdf` → `pdftoppm -r 90`). Read the speaker notes aloud at ~45s per slide while looking only at the slide PNG. Confirm: the slide never forces reading during narration, every slide has a clear visual anchor, the `Overgang` cues flow naturally into the next slide. Log failure modes in the paragraph review notes before shipping. |

#### Uitleg voorkennis (.docx)
| | |
|---|---|
| **Raw input** | Prerequisite knowledge: what must students already know from earlier paragraphs? Identify by reading the textbook exercises — which concepts do they assume? |
| **Agent process** | List 5-7 prerequisite concepts. For each: write definition, formula (if any), worked example, tip, checklist item. Assign each to a domain (wiskunde/economisch/grafisch). |
| **Reference script** | `template-B_voorkennis.js` — copy, replace content between `════` markers. |
| **Reusable** | Entire document scaffold: domainBanner, formulaBox, tipBox, warningBox, checkBox, summarySchema, visualTOC, domainLegend. |
| **Custom** | Content sections only (text between ════ markers). |
| **Skills** | `econ-explainer-docs` + `econ-word-templates` |

#### Uitleg vaardigheden (.docx)
| | |
|---|---|
| **Raw input** | Skills taught in this paragraph. Identify from textbook learning goals and exercise types. |
| **Agent process** | List 5-7 skills. For each: write a full page with waarom/hoe/voorbeeld/tip/check/summary. Assign domains. |
| **Reference script** | `template-A_vaardigheden.js` — copy, replace content between ════ markers. |
| **Reusable** | Entire document scaffold (same components as voorkennis). |
| **Custom** | Content sections only. |
| **Skills** | `econ-explainer-docs` + `econ-word-templates` |

#### Nieuws met visual (.docx)
| | |
|---|---|
| **Raw input** | A real, recent Dutch news article (NOS, RTL, Volkskrant, etc.) related to the paragraph topic. Must have a verifiable sourceUrl. |
| **Agent process** | Write 80-word summary → design SVG chart/graph that teaches a concept from the article → write 5 questions (ascending difficulty) + answer key. |
| **Reference script** | `nieuws-351-352-afsluiting.js` — copy, replace article content + SVG function + questions/answers. |
| **Reusable** | Document scaffold (headline, ImageRun, banners, Q&A format), `svgToPng()`, `domainBanner()`. |
| **Custom** | Article text, SVG chart code, questions, answers, source URL. |
| **Skills** | `econ-nieuws-exercise` + `economic-graph` |
| **Hard rules** | Font sizes 16/11/9pt. Real SVG→PNG chart, NOT text placeholder. sourceUrl required. |

#### Samenvatting (.docx)
| | |
|---|---|
| **Raw input** | The paragraph's key concepts, terms, formulas — distilled from the textbook and from the other documents you've already built for this paragraph. |
| **Agent process** | Create a one-page visual summary using a table grid layout with domain-colored sections. |
| **Reference script** | `samenvatting-351-352-rebuild.js` — copy, replace content cells. |
| **Reusable** | Table infrastructure: `colorBorder()`, domain color system, content width constants. |
| **Custom** | Content cells, concept groupings, which colors map to which sections. |
| **Hard rule** | TABLE-BASED infographic layout. Never use paragraph-based layout. |

#### Begeleide inoefening (vragen.docx + antwoorden.docx)
| | |
|---|---|
| **Raw input** | Textbook exercises for this paragraph + worked solutions from the answer key docx. Extract any textbook graphs for reuse. |
| **Agent process** | Start from the textbook opgaven and answer model. Cover every source opgave/subquestion unless the sprint plan explicitly scopes an item out. For each: write the question, add scaffolding (denkstappen, hints, formule-herinneringen), and write the full solution. **Critical: add visual scaffolding (scaffoldImage) for exercises involving graphs, budget lines, or other visual concepts.** This document is used heavily by students who find the material difficult — graphical support is essential, not optional. |
| **Reference script** | `inoefening-351-afsluiting.js` — copy, replace exercise content. |
| **Reusable** | `lib-begeleide-inoefening.js` library (import, don't copy) + script scaffold. Supports `scaffoldImage` (shown in both vragen and antwoorden) and `afterAnswerImage` (shown in antwoorden only). |
| **Custom** | Exercise questions, scaffolding text, worked solutions, scaffold images from `_assets/`. |
| **Skills** | `econ-word-templates` + `econ-didactiek` |
| **Hard rule** | Every exercise that asks students to draw, describe, or interpret a graph MUST have a `scaffoldImage` from `_assets/`. This is dual coding applied to scaffolding — weaker students need visual anchors alongside text-based denkstappen. |
| **HTML-first rule** | In the student-web profile, the HTML version may be authored natively instead of converted from DOCX, but it must still cover the actual textbook opgaven and answer model. Each source subquestion needs a visible prompt plus revealable denkstappen, hint, answer, and explanation unless the sprint plan documents an intentional scope exception. |

#### Opgavensets — zelfstandige oefening and optional stretch files
| | |
|---|---|
| **Raw input** | Textbook exercises after `Startopgaven` are student-facing `Begeleide inoefening` (optional) and `Zelfstandige oefening`. Optional stretch tasks may use `Denkertje` or `Bonusopgave`; do not label the normal post-start exercise block as `Verdieping`. |
| **Agent process** | Write coherent independent exercises plus any explicitly authorized optional stretch tasks, with full answer models for each. |
| **Reference script** | `opgaven-351-afsluiting.js` — copy, replace exercise content. Generates all 6 files. |
| **Reusable** | Document scaffold (headers, numbering, answer formatting). |
| **Custom** | All questions and answers. |

#### YouTube videos (.html)
| | |
|---|---|
| **Raw input** | None. This is a manual search task. |
| **Agent process** | Search YouTube for 3 Dutch-language VWO economics videos matching the paragraph topic. Verify video IDs exist. |
| **Reference** | Copy HTML structure from any existing `youtube-videos.html` file. |
| **Reusable** | Card layout HTML/CSS. |
| **Custom** | Video IDs, titles, channel names, descriptions. |
| **Design note** | Manual by design. No generator exists or is planned. `prompt-youtube-videos.md` has search guidance. |

### C. Registration entries (→ book manifest)

The target book carries a `deploy-config.json` manifest at its root (e.g.
`4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`).
Platform generators read this manifest; it is the single source of truth for
chapter structure, paragraph metadata, and per-paragraph game config.

| Edit | What to add | When |
|------|-------------|------|
| Book manifest `paragraphs[]` | `{ id, name, chapter, domain, skilltree, kind? }` | Every new Part B/complete lessen paragraph |
| Book manifest `chapters[]` | `{ id, folder, name, number, domain }` | Only for a new chapter |
| Paragraph `skilltree` field | `{ skills: ["A38", ...], chapterSkills: ["A38", ...] }`; `{ skills: null }` only for a deliberate all-skills paragraph view | Required for every Part B/complete paragraph because wiskundevaardigheden is one of the companion/student-web required files |
| `engines/theme.js` | DOMAIN_COLORS entry | Only for a brand-new domain name (teal/blue/amber/green/purple already exist) |

Existing Part A-only textbook paragraphs may omit `skilltree` until companion production starts. A paragraph is not a complete Part B paragraph until the `skilltree` field is present and the wiskundevaardigheden shell/data have been generated.

The loader (`build-scripts/lib/lib-deploy-config.js`) hard-fails if the manifest
is missing or malformed. There is no auto-detection fallback.

---

## B3. End-to-end workflow

This is the production sequence for one paragraph. Follow in order.

### Phase 1: Register (2 min)
1. Open the book's `deploy-config.json` manifest.
2. Add an entry to `paragraphs[]`: `{ "id": "X.Y.Z", "name": "...", "chapter": "X.Y", "domain": "<teal|blue|amber|green|purple>", "skilltree": { "skills": [...], "chapterSkills": [...] } }`. Use `"skilltree": { "skills": null }` only when all math skills should be visible in paragraph mode. For normal paragraphs, `skills` is the paragraph-relevant subset; `chapterSkills` is the broader chapter subset; the runtime also offers an all-skills view.
3. If this is the first paragraph in a new chapter, add an entry to `chapters[]` first.
4. For a new domain (beyond teal/blue/amber/green/purple), add it to `engines/theme.js` — otherwise nothing else to touch.

### Phase 2: Create folder structure (1 min)
```bash
BOOK="../4veco-lessen/Boek N - Title"
PAR="$BOOK/N.X Hoofdstuk X - Name/N.X.Y [Naam]"
mkdir -p "$PAR"
# Flat layout: no 1. Voorbereiden / 2. Leren / 3. Oefenen subfolders.
# Part A outputs, all Part B companion/student-web files, and opt-in Office/legacy files live at the paragraph root.
```

For an explicit `office` or `legacy-full` build only, add the static helper
DOCX:

```bash
cp "$BOOK/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/Lees dit als je niet weet hoe je moet beginnen met deze les.docx" "$PAR/" 2>/dev/null || echo "Seed the static file from a verified legacy source."
```

If that export profile is selected and the destination book does not already
contain the static helper file, seed it from the verified legacy source listed
in **B0a**. Do not add this DOCX to a default `student-web` build.

### Phase 2a: Create paragraph plan (15 min)

This paragraph plan is required for Part B/complete companion production. It is not required for Part A-only textbook paragraphs.

Read `X.Y.Z-textbook-handoff.md`, the textbook paragraph, and the answer key
thoroughly, then create the paragraph plan.

1. Copy `build-scripts/templates/template-paragraph-plan.md` → `<paragraph-folder>/_paragraph-plan.md`
2. Fill in every section:
   - **Kernconcepten**: 5-8 key concepts with definitions, formulas, graph types
   - **Visuelen-plan**: every conceptual SVG visual needed, with source filename, graph type, which builders use it, and parameters (e.g. curve equations)
   - **Visual-variants-plan**: every surface-specific derivative needed for layout and accessibility (`*_slide`, `*_doc`, `*_summary`, `*_web_light`, `*_web_dark`). Web-light and web-dark variants are required when a visual is used in a themed HTML page.
   - **Presentatie-outline**: slide sequence with visual references
   - **Nieuws-plan**: article choice + chart type
   - **Samenvatting-concepten**: complete concept checklist (cross-check against kernconcepten)
   - **Terminologie**: use/don't-use table for consistent Dutch economics terms across all documents
   - **Opgaven-verdeling**: exercise distribution across basis/midden/verrijking
   - **Vaardigheden & Voorkennis**: quick reference for the uitleg-builders
   - **Procedure-stappen-plan** (unified experience): for each skill, the exact step labels and sequence. This is the canonical approach — all builders (vaardigheden, stappenplan game, presentatie) must follow these steps. Products/numbers may vary by context, but the approach is fixed.
   - **Visuelen-toewijzing** (dual coding): for each visual concept in `_assets/`, which variant each builder embeds — not just the presentatie. Every document that explains a concept with a matching visual must include an adapted variant.

This plan is the **single source of truth** for all Part B builders. Every companion builder reads it before starting.

### Phase 3: Create game data files (30 min)

Game runtime data files live under `$BOOK/shared/` (e.g. `4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/`). Reasoning runtime data is `shared/reasoning/X.Y.Z.js`. The raw reasoning CSV source lives under `source-data/book-N/reasoning/` in the platform repo.

1. Write `$BOOK/shared/questions/X.Y.Z.js` — quiz data (15 questions)
2. Write `source-data/book-N/reasoning/X.Y.Z.csv` — source-of-truth reasoning CSV
3. Run: `MODULE_ROOT="$BOOK" node build-scripts/platform/build-reasoning-questions.js X.Y.Z <domain> source-data/book-N/reasoning/X.Y.Z.csv` — writes `shared/reasoning/X.Y.Z.js`
4. Write `$BOOK/shared/newsdetective/X.Y.Z.js` — newsdetective data
5. After Phase 2a is complete, write `$BOOK/shared/procedure/X.Y.Z.js` — procedure/stappenplan data. Do **not** re-author the procedure ad hoc. For each skill unit in the paragraph plan, copy its canonical `procedure` array from `references/machine/micro-teaching-units.json` into the procedure data file. The labels and order must match the paragraph plan and the vaardigheden build.

> The `MODULE_ROOT` env-var name is kept (not renamed to `BOOK_ROOT`) so existing scripts continue to work. It points at a lessen book root in the new pipeline.

### Phase 4: Create rich documents (bulk of the work)

Phase 4 has two sub-phases. The planning step already happened in Phase 2a.

#### Phase 4a — Build shared visuals (20 min)

Build all SVG graphics listed in the visuelen-plan, plus the surface variants listed in the visual-variants-plan. Reuse the same data and concept, not necessarily the same artwork.

1. Create `<paragraph-folder>/_assets/` subfolder
2. For each visual in the visuelen-plan:
   - Write the SVG following the `economic-graph` skill spec
   - Render to PNG via `lib/lib-svg-utils.js`: `const { svgToPng } = require('../../lib/lib-svg-utils')`
   - Save both `.svg` and `.png` to `_assets/` (e.g. `_assets/va-equilibrium_slide.svg`, `_assets/va-equilibrium_slide.png`)
   - For web visuals in themed pages, save both light and dark variants (e.g. `_web_light.svg/png` and `_web_dark.svg/png`)
3. Optionally save the asset-builder script as `build-scripts/content/book-N/bN-XYZ-build-assets.js`
4. Quality-check all PNGs before proceeding — verify economic correctness and readability

For critical standalone visuals, screenshots, charts, diagrams, or rendered UI states, use `agents/visual-qa-agent.md` as the specific visual-item gate before embedding the item into companion outputs. Use `agents/econ-companion-visual-review.md` later for the complete rendered companion surface.

#### Phase 4b — Build companion surfaces

Every builder should:
- Read `_paragraph-plan.md` for its outline, terminology, and concept coverage
- Read pre-built adapted variants from `_assets/` instead of generating SVGs inline
- Use `const { svgToPng, pngToBase64, GRAPH_COLORS } = require('./lib-svg-utils')` instead of inline copies
- **Dual coding**: embed every adapted visual variant listed in the visuelen-toewijzing for this builder; use `ImageRun` only in DOCX scripts
- **Unified experience**: follow the exact step sequence from the procedure-stappen-plan — same labels, same order, same approach. The stappenplan game procedures must mirror vaardigheden skill steps exactly.

For the default `student-web` profile, build the native HTML/PPTX products in
the 14-file baseline. The game and route shells are generated in Phase 6.

| Baseline surface | Builder route | Output location |
|------------------|---------------|-----------------|
| Uitleg voorkennis HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |
| Uitleg vaardigheden HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |
| Presentatie HTML + PPTX | Presentation V2 semantic model | `<paragraph folder>` |
| Nieuws met visual HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |
| Samenvatting HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |
| YouTube videos HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |
| Begeleide inoefening HTML | Native paragraph-specific HTML generator | `<paragraph folder>` |

For an explicit `office` or `legacy-full` profile, build the 14 baseline files
first, then add exactly these 13 DOCX exports:

| Additional DOCX output | Reference route |
|------------------------|-----------------|
| Uitleg voorkennis (1) | `template-B_voorkennis.js` |
| Static `Lees dit...` helper (1) | Verified legacy source from B0a |
| Uitleg vaardigheden (1) | `template-A_vaardigheden.js` |
| Nieuws met visual (1) | `nieuws-351-352-afsluiting.js` |
| Samenvatting (1) | `samenvatting-351-352-rebuild.js` |
| Begeleide inoefening, vragen + antwoorden (2) | `inoefening-351-afsluiting.js` |
| Basis, vragen + antwoorden (2) | `opgaven-351-afsluiting.js` |
| Midden, vragen + antwoorden (2) | `opgaven-351-afsluiting.js` |
| Verrijking, vragen + antwoorden (2) | `opgaven-351-afsluiting.js` |

Run a selected Node builder with:
`NODE_PATH="$(npm root -g)" node <script>.js`.

### Phase 5: Convert Office DOCX → HTML (office/legacy only)

Skip this phase for the default `student-web` profile when the required rich
HTML pages are authored natively. Run these converters only for an `office` or
`legacy-full` build where the `.docx` files are deliberately the companion
source:

```bash
python build-scripts/lib/convert_voorkennis.py "$PAR"
python build-scripts/lib/convert_vaardigheden.py "$PAR"
python build-scripts/lib/convert_begeleide_inoefening.py "$PAR"
```
Converters read the source `.docx` from `$PAR` directly (flat layout) and write
the `.html` alongside. They are not a substitute for reviewing the rendered
student-web pages.

### Phase 5a–5c: QC gates

If Part A was run first, these are already done (A5–A7). Skip to Phase 6.

If running Part B only (textbook content already exists), run these QC steps now:
- **5a**: Asset completeness gate — see Part A §A5
- **5b**: Didactic and precision review (independent sub-agent) — see Part A §A6
- **5c**: Generate quality_ref (independent sub-agent) — see Part A §A7

These are backfill checks for older paragraphs that predate the handoff. For
new lane-separated work, Part B should consume the Part A handoff instead of
rerunning Part A quality ownership.

### Phase 6: Deploy (2 min)
```bash
node scripts/deploy.js "$BOOK"
```
`$BOOK` points at a lessen book root (e.g. `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`); `shared/` lives directly under it. This runs ONLY the automated layer: engine copy, game shell generation (flat output into each paragraph root), landing pages, link check, data tests. It does NOT build rich documents.

This command writes to the target book. It is a build/deploy step, not a read-only validation probe.
In the default Part B companion/student-web build, deploy skips DOCX-to-HTML converters. Use
`RUN_DOCX_CONVERTERS=1 node scripts/deploy.js "$BOOK"` only for an Office or
legacy-full run where `.docx` sources are deliberately part of the product.

### Phase 6a: Companion visual review gate

Author/regenerate every in-scope student-facing companion against `skills/econ-companion-artifacts.md`. Review the 14-file `student-web` validation baseline, the actual `Start -> Leer -> Check -> Oefen -> Exit ticket` route (including advisory short check and separate target-equivalent exit ticket), and the 13 additional Office/legacy DOCX files only when that export profile is explicitly selected. Differentiated DOCX handouts belong to the Office/legacy set, not the default baseline. Paragraph PDFs and `build_pdf.py` are normal Part A textbook outputs for human review; `publisher-print` is the later Part A chapter/book handoff profile. Builder skills (`econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, etc.) inherit those rules.

Then run `agents/econ-companion-visual-review.md` as the closure gate when the generated HTML/game shells and native or converted companion pages can be inspected as rendered output:

> "You are the econ-companion-visual-review agent. Read `agents/econ-companion-visual-review.md`, `AGENTS.md`, and `BUILD-PARAGRAPH.md`. Review paragraph [path]. Inspect the available student-facing HTML, PPTX, and opt-in Office companions, rendered browser/document views where possible, `_paragraph-plan.md`, `_assets/`, source builders, canonical units/procedures/terminology, and quality records. Return the required report format and save it as `X.Y.Z-companion-visual-review.md` in the paragraph folder."

Hard fails from this agent block completion. Fix the source, generator, CSS/JS, asset builder, or registry issue; regenerate; then rerun the companion review. Do not close a generated-output defect by hand-editing the generated lesson artifact unless the team explicitly requests a temporary patch.

For broad QA coordination across companion visual review, specific visual QA, accessibility review, teacher learning-quality review, student-experience review, and test evidence, use `agents/lead-reviewer-agent.md`. Use `agents/teacher-learning-quality-review-agent.md` when a paragraph, companion set, activity, or gate claims classroom readiness or learning quality: it checks learning goals, prior knowledge, didactic sequence, formative feedback, differentiation, dual coding, transfer, and retention. Use `agents/student-experience-review-agent.md` when a student-facing surface claims student readiness: it checks orientation, next action, affordance, cognitive load, motivation, confusion risks, and whether visuals are understandable and linked to the text. Use `agents/accessibility-agent.md` when readability, contrast, alt text, OCR, semantic structure, keyboard access, or inclusive usability needs focused review. Use `agents/testing-agent.md` when the paragraph needs a command-by-command test/validator evidence report.

### B-verify: Part B checklist

**Part A prerequisites (skip if running Part B only with existing content):**
- [ ] Part A checklist passed (see A-verify above)
- [ ] `X.Y.Z-textbook-handoff.md` exists and Part A verdict is PASS or PASS WITH FLAGS

**Platform files:**
- [ ] `_paragraph-plan.md` exists and all sections are filled in
- [ ] `_assets/` folder has SVG+PNG pairs matching every entry in the visuelen-plan and visual-variants-plan
- [ ] Validator baseline: 14 required Part B `student-web` root files, including `index.html`
- [ ] Product route: rendered `Start -> Leer -> Check -> Oefen -> Exit ticket` flow is inspected; advisory short check and separate target-equivalent exit ticket are present or explicitly blocked/followed up/waived
- [ ] Office/legacy exports open in Word/PowerPoint when the selected profile includes them (27-file contract only for explicit `office`/`legacy-full` validation)
- [ ] `X.Y.Z-quality-ref.yaml` has a `companion:` block matching `X.Y.Z-companion-visual-review.md`
- [ ] Presentatie has ≥3 economic graphs, presents theory (no exercise instructions)
- [ ] Nieuws met visual has an embedded chart/visual, source URL, questions, and answer model; Office export font sizes are 16/11/9pt when DOCX is in scope
- [ ] Samenvatting uses a table/grid infographic structure in its source medium and renders legibly as HTML
- [ ] Terminology is consistent across all documents (check against terminologie table in plan)

**Design principles:**
- [ ] **Dual coding (`student-web`)**: vaardigheden and voorkennis HTML plus the presentation HTML/PPTX contain the adapted variants assigned in `_assets/` (not text-only and not raw textbook copy-paste)
- [ ] **Dual coding (Office/legacy only)**: when that profile is selected, vaardigheden and voorkennis DOCX files contain embedded adapted variants from `_assets/`
- [ ] **Theme variants**: every themed web visual has a light and dark variant, and the HTML/JS swaps to the correct one
- [ ] **Unified experience**: stappenplan game procedures use the same step labels and sequence as vaardigheden skills
- [ ] **Visuelen-toewijzing**: every visual listed for a builder in the plan is actually embedded in that builder's output
- [ ] `X.Y.Z-companion-visual-review.md` exists and has verdict PASS or PASS WITH FLAGS (no hard fails)
- [ ] If the delivery is being marked classroom-ready, teacher learning-quality review has no FAIL verdict and any required didactic revisions are closed
- [ ] If the delivery is being marked ready for students, student-experience review has no FAIL verdict and any required orientation, affordance, motivation, or text-visual-linking revisions are closed

**Deployment:**
- [ ] Browser: all 4 games load, all section cards appear in landing page
- [ ] Data tests pass: `MODULE_ROOT="$BOOK" npx jest --testPathPatterns "engines/tests/.*-data\.test\.js"`
- [ ] `validate-paragraph.js` passes with 0 errors

---

## B4. Script classification

### Platform generators (reusable, run by deploy.js)
Fully automated from data files. deploy.js runs these.

| Script | Reads from | Writes to |
|--------|-----------|-----------|
| `generate-quiz-shells.js` | `shared/questions/*.js` | `<paragraph folder>/*.html` |
| `build-newsdetective-shells.js` | `shared/newsdetective/*.js` | `<paragraph folder>/*.html` |
| `build-procedure-shells.js` | `shared/procedure/*.js` | `<paragraph folder>/*.html` |
| `build-reasoning-engine.js` | `shared/reasoning/*.js` | `<paragraph folder>/*.html` |
| `build-skilltree-shells.js` | Book manifest paragraphs with `skilltree` + `engines/skilltree/base-elements.js` | `shared/skilltree/*.js` + `<paragraph folder>/*.html` |
| `build-landing-page.js` | Book manifest + scans paragraph folder contents (filename-based classification, flat layout); paragraph pages use the approved landing V2 fixtures | `index.html` at paragraph/chapter/book levels |
| `build-reasoning-questions.js` | CSV file (manual arg) | `shared/reasoning/*.js` |

> **Flat layout:** all generators emit directly to the paragraph root — there are no phase subfolders. Each generator calls `loadConfig(MODULE_ROOT)` to read the book's `deploy-config.json` and resolves each `parNr` to its folder via the manifest. Data files whose parNr is not in the manifest are skipped with a warning. The current skilltree generator only emits for paragraphs that declare `skilltree`; for a complete Part B paragraph, that declaration is required.

### Reusable converters (run manually after .docx creation)

| Script | Input | Output |
|--------|-------|--------|
| `convert_voorkennis.py` | `uitleg voorkennis.docx` in paragraph folder | `uitleg voorkennis.html` alongside |
| `convert_vaardigheden.py` | `uitleg vaardigheden.docx` in paragraph folder | `uitleg vaardigheden.html` alongside |
| `convert_begeleide_inoefening.py` | `begeleide inoefening – vragen.docx` + `antwoorden.docx` | `begeleide inoefening.html` alongside |

### Reference implementations (copy + adapt for each paragraph)
These are paragraph-specific scripts that serve as templates. Copy one, change the content section (marked with `════`), update the output path, run.

| Script | What it builds | Copy for new paragraph |
|--------|---------------|----------------------|
| `template-B_voorkennis.js` | `uitleg voorkennis.docx` | Yes — adapt content section |
| `template-A_vaardigheden.js` | `uitleg vaardigheden.docx` | Yes — adapt content section |
| `pptx-331-rol-overheid.js` | `presentatie.pptx` (with SVG graphs + editorial design) | Yes — new slides + graphs; uses `lib-pptx.js` |
| `nieuws-351-352-afsluiting.js` | `nieuws met visual.docx` (with SVG chart) | Yes — new article + chart |
| `samenvatting-351-352-rebuild.js` | `samenvatting.docx` (table-based) | Yes — new content |
| `inoefening-351-afsluiting.js` | `begeleide inoefening` (vragen + antwoorden) | Yes — new exercises |
| `opgaven-351-afsluiting.js` | `opgavensets` (3 levels × 2 docs) | Yes — new exercises |
| `lib-begeleide-inoefening.js` | Shared library used by inoefening scripts | No — import, don't copy |

### Paragraph-specific productions (archival, not templates)
Scripts built for specific paragraphs in earlier work. Useful as examples but not the primary reference.

| Script | Paragraph |
|--------|-----------|
| `pptx-321-marktevenwicht.js` | 3.2.1 |
| `pptx-322-volkomen-concurrentie.js` | 3.2.2 |
| `pptx-323-monopolie.js` | 3.2.3 |
| `build-311-basisopgaven.js` | 3.1.1 |
| `build-infographic-311.js` | 3.1.1 |

### Utility scripts

| Script | Purpose |
|--------|---------|
| `extract-quiz-data.js` | Extract quiz data from old HTML files |
| `restyle-instapquiz.js` | Restyle legacy quiz files |
| `extract-all-antwoorden.py` | Extract answers from textbook |
| `fix-emoji.py` | Fix emoji encoding |
| `prompt-youtube-videos.md` | Prompt template for finding YouTube videos |

---

## B5. What deploy.js does and does NOT do

For normal Part B companion/student-web work, skip the DOCX-only items in the
manual layer below. They are retained as Office/export tasks for `office` and
`legacy-full`, not as the default paragraph-2 path.

### deploy.js handles (automated layer):
- Copy engine files (JS/CSS) from `engines/` → `<book>/shared/`
- Generate skilltree data + HTML shells (flat output: shells land at paragraph root)
- Generate reasoning game HTML shells (flat output)
- Generate quiz HTML shells (flat output)
- Generate newsdetective HTML shells (flat output)
- Generate procedure (stappenplan) HTML shells (flat output)
- Rebuild all landing pages (index.html at paragraph/chapter/book level)
- Run link checker
- Run data validation tests
- Skip DOCX-to-HTML converters by default for Part B companion/student-web builds; converters
  run only when `RUN_DOCX_CONVERTERS=1` or `BUILD_PROFILE=office|legacy-full`

### deploy.js does NOT handle (paragraph-specific layer):
- Presentatie HTML/PPTX — build from the paragraph-specific semantic model
- Rich `student-web` companion HTML — run the paragraph-specific native HTML builders
- YouTube videos HTML — write the paragraph-specific page
- Office/legacy DOCX exports — only for an explicit `office` or `legacy-full` profile
- Office/legacy HTML conversions (DOCX → HTML) — only when Word files are the deliberate source
- Static `Lees dit...` copy — only for an explicit `office` or `legacy-full` profile

**In short:** deploy.js builds the interactive shell. Rich baseline HTML/PPTX
requires paragraph-specific work before deploying; the 13 DOCX outputs are an
additional Office/legacy step only.

---

## B6. Validation

`validate-paragraph.js` should enforce the flat-layout contract in modes:

Validation combines lane mode and profile. Use `--mode part-a --profile
student-web` for normal Part A textbook work, including the paragraph PDF
human-review packet. Use `--mode part-b --profile student-web` for normal
paragraph companion/student-web work, and `office` or `legacy-full` only when
Word exports are deliberately part of the requested product. Use
`publisher-print` for the Part A chapter/book print handoff or book-health gate.

- **Part A/textbook mode**: validates textbook files at the paragraph root. Every profile requires `build_pdf.py` and the type-specific paragraph PDFs for human review. In `student-web` and `office` profiles, theory paragraphs also require paragraaf/opgaven/antwoorden markdown plus textbook HTML renders; consolidation paragraphs require opgaven/antwoorden markdown plus textbook HTML renders. This remains Part A even though the historical profile name is `student-web`.
- **Part B/companion mode**: validates the profile-specific Part B root-file baseline listed in B1: 14 for default `student-web`, or those same 14 plus 13 DOCX files (27 total) for explicit `office`/`legacy-full`, including `index.html`. `_paragraph-plan.md` is required in this mode because it is the source of truth for companion builders. This validator result does not replace rendered proof of the full product route, advisory short check, or separate target-equivalent exit ticket.
- **Complete mode**: validates both Part A and Part B.

For Part B/complete mode, game runtime data lives in `<book>/shared/`:

- `shared/questions/X.Y.Z.js`
- `shared/newsdetective/X.Y.Z.js`
- `shared/reasoning/X.Y.Z.js`
- `shared/procedure/X.Y.Z.js`
- `shared/skilltree/X.Y.Z.js`

The raw reasoning CSV source is kept in `source-data/book-N/reasoning/X.Y.Z.csv` in the platform repo, then compiled into `shared/reasoning/X.Y.Z.js`. Do not validate it as `shared/reasoning/X.Y.Z.csv`.

After building, run the validator for the lane that changed:

```bash
node scripts/validate-paragraph.js --mode part-a --profile student-web "<path-to-paragraph-folder>"
node scripts/validate-paragraph.js --mode part-b --profile student-web "<path-to-paragraph-folder>"
node scripts/validate-paragraph.js --mode complete --profile student-web "<path-to-paragraph-folder>"
```

Use `complete` only for integration verification after both lanes exist or when
a complete bundle was explicitly authorized.

This checks:
- Part A validation requires `build_pdf.py` and the complete type-specific
  paragraph PDF packet for human review
- All 14 Part B `student-web` validation-baseline files exist at the paragraph root (flat layout), including `index.html`; route completeness still requires separate rendered/product review
- Office/legacy `.docx` files are valid zip archives only when the selected profile requires them; the 27-file contract applies only to explicit `office`/`legacy-full`
- Presentation > 100KB (has graphs)
- All .html files have content (not empty shells)
- Quiz has difficulty-3 per category
- Game data files exist in `<book>/shared/`
- Reasoning runtime JS exists in `<book>/shared/reasoning/`; source CSV exists in platform `source-data/book-N/reasoning/` when source checks are enabled
- The `companion:` quality-ref block names the exact companion review file, verdict, and hard-fail count

**A Part B/complete paragraph is not done until the validator passes with 0 errors.**

---

## B7. Pedagogical approach by paragraph type

| Paragraph type | Approach | Example |
|----------------|----------|---------|
| **Intro** (first in chapter) | Narrative-first: use named characters, everyday situations, concrete-to-abstract | Lisa choosing between phone/festival/savings |
| **Calculation** (formulas) | Formula-first: worked examples, step-by-step, graph-heavy | Budget line: B = p₁q₁ + p₂q₂ |
| **Toepassen** (review) | Cross-topic synthesis, comparison tables, exam-style | Marktvormen vergelijkingstabel |

The default is **narrative-first** — students connect with stories before abstractions. Only switch to formula-first when the paragraph is primarily about calculation skills.

---

## B8. Build script requirement

**Every scripted-manual file MUST have its build script saved** in `build-scripts/content/book-N/` with naming convention `bN-XYZ-<type>.js` (for example `b1-111-presentation-v2.js` or a registered model such as `b1-111-presentation-v2-model.js`). Older legacy scripts under `build-scripts/content/module-N/` stay where they are; new lessen work writes under `book-N/`.

This ensures:
- Any file can be regenerated after corrections
- Other agents can study the script to understand the build approach
- The paragraph is reproducible, not a one-shot output

If a build script is not saved, the paragraph build is **incomplete**.

---

## B9. Quality rules (learned from production)

| Rule | Why |
|------|-----|
| Supply curves must have positive Y-intercept | P = 2Q - 40 creates a gap at the Q-axis and implies negative prices |
| PS triangle: vertices at supply Y-intercept, equilibrium, p* on Y-axis | Prevents surplus on wrong side of curve |
| Presentations: theory + worked examples, NEVER exercise instructions | The teacher decides when students practice |
| Every presentation must have ≥3 SVG→PNG economic graphs | Students need repeated exposure to abstract visuals |
| Font sizes in docx: headline 16pt, body 11pt, source 9pt | Matches reference documents; the old 28/20/16pt was too large |
| Every quiz category needs ≥1 difficulty:3 question | Data validation test requires this for the mastery system |
| Samenvatting uses table-based infographic layout | Paragraph-based layout doesn't match the reference |
| CHAPTER_NUMBERS must be updated alongside CHAPTER_FOLDERS | Otherwise navigation shows "Hundefined" |
| Filter `~$` temp files in directory scans | Office lock files get picked up as real content otherwise |
| Run `validate-paragraph.js` before declaring done | Catches missing files, corrupted docx, empty presentations |
| Save all build scripts in `build-scripts/content/book-N/` | Without scripts, the paragraph can't be regenerated or improved |
| Intro paragraphs: narrative-first approach | Students connect with stories (Lisa, Tom) before abstractions |
| Register paragraph AND run deploy | Without deploy, game shells and landing pages are missing — students can't navigate |
| Create `_paragraph-plan.md` before building documents | Ensures terminology consistency and concept coverage across all 8 documents |
| Build shared visual variants in `_assets/` before Phase 4b | One concept, many surface-specific variants — fix the source idea once, then render for slide/doc/web contexts |
| Use `lib-svg-utils.js` instead of inline `svgToPng()` | The same function was copy-pasted in 8 scripts — import the shared library instead |
| Begeleide inoefening MUST have `scaffoldImage` for graph exercises | This document is scaffolding for weaker students — visual support is essential, not optional |
| Run `econ-paragraph-review` two-pass review before delivering | Catches slope errors, missing domain restrictions, broken dual coding, and other issues that are hard to fix after delivery |
| Generate `quality_ref` YAML after every paragraph build | Powers inspectie-verantwoording and quality reports at chapter/module/course level — see `econ-quality-control` skill |
