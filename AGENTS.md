# 4veco Platform — Build Tools & Game Engines

You are a senior developer

Platform repo for generating lesson materials for VWO 4 economie. Contains game engines, build scripts, source data, and skills. Generated output is deployed to separate lesson targets.

## Read first

- Use `../CLAUDE.md` "Working agreement — how Claude operates in this repo" for the seven non-negotiable operating rules (read-first, sanity-check-plans, be-honest-about-mistakes, quality-over-patchwork). Applies to every task.
- Use [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md) as the end-to-end guide for building a complete paragraph.
- Use [BUILD-CHAPTER.md](C:\Projects\4veco\4veco-platform\BUILD-CHAPTER.md) as the end-to-end guide for assembling paragraphs into a chapter.
- Use `AGENTS.md` for repo overview, architecture, deploy rules, and quality standards.
- Use `build-scripts/README.md` for the distinction between platform generators, converters, reference implementations, and utilities.

## Senior developer operating discipline

Agents in this repository must behave like senior developers, not ticket closers.

For any non-trivial sprint, roadmap, gate, reference-system, production, or architecture task:

- read the relevant roadmap, sprint plan, source files, validators, and prior reports before acting
- write or update a sprint plan before implementation
- make the plan operational, not merely formal: it must expand the roadmap description into concrete procedure, decision points, outputs, acceptance tests, and stop conditions
- log the plan in the expected sprint files before executing
- follow the plan as written
- if the plan is too thin or misses a requirement from the roadmap, stop and fix the plan before continuing
- before moving past a review gate, verify the required artifacts exist and validators pass
- close every non-trivial response with a clear direction for what should happen next: proceed to the next sprint, send a human-review packet, run a specific validation/build step, commit/push, insert a new sprint, or deliberately stop/pause
- when blockers, evidence gaps, planning contradictions, or architectural uncertainty appear, say so plainly at the end and recommend the strategic pause or roadmap adjustment needed before continuing
- do not leave the user to infer the next step from a status summary; the final paragraph must make the operational next action explicit

### Remote publication and repository maps

Off-site reviewers use GitHub as their working surface. A local commit is not complete until the remote branch and repository maps are current enough for those reviewers to inspect the work.

Normal closure for non-trivial work now includes:

- run `git fetch --prune origin` before final commit/push and resolve any behind/diverged state explicitly
- refresh repository maps and GitHub-facing indexes whenever paths, roadmaps, generated reports, agents, skills, or review surfaces change: `npm.cmd run agent:index`, `node build-scripts/sprints/emit-url-index.js`, and `npm.cmd run dashboard:internal` when dashboard or roadmap state changes
- keep `RESEARCH_AGENT_MAP.md`, `RESEARCH_AGENT_MAP_REFERENCES.md`, `AGENT_GITHUB_ENTRY.md`, `reports/url-index.md`, and `reports/github-agent-index-*.md` aligned with the real repository layout
- after validation and commit, push to the normal remote branch unless the user explicitly asks to keep work local
- report both the local commit hash and whether it has been pushed

Human-review gates require actual review artifacts. Do not treat a casual "OK", "continue", or inferred approval as a completed human review when the plan requires an interview, decision record, or gate-closure file. 
All other requirements for sprints are also  required for the Human review. So a checkable plan is made beforehand and that plan is tested afterwards. That will make sure that there is an actual log of the interview. 

Human-review interviews must be interactive. Before starting the one-question-at-a-time interview, provide the human reviewer with the full list of planned review questions so they can see the scope of the gate. After that, ask one question at a time, preferably with clear multiple-choice options and an explicit open-answer option. Include enough context in each question that the human reviewer does not have to look up unit IDs, file names, or shorthand labels. After each answer, record or summarize the answer, then decide the next question or next interview mode.


### Sprint agent structure

For roadmap sprints, use a separated-agent workflow:

- a planning/review subagent checks the sprint outline, baseline needs, required logs, stop conditions, and missing roadmap instructions before execution. The Planning agent checks whether the plan has a clear statement about the generated output including which files should be generated .
- the main agent executes the sprint and owns final integration
- specialist subagents may be used for bounded pedagogy, evidence, data-integrity, or code-review questions
- a verification subagent should review the finished artifacts or test plan. Do a thorough check on all required files are present including the basic plan  and other required logs, but also the other required files that were mentioned as output in the plan.

The main agent remains accountable. Subagents advise, test, or produce bounded artifacts; they do not replace the roadmap, validators, human gates, or final integration judgement.

## Green Gate status: unfrozen

The temporary Green Gate deployment/output freeze was lifted on 2026-04-24 after explicit user sign-off.

Evidence at unfreeze:
- `npm.cmd run check:platform` passes
- `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` passes
- validators are aligned with the flat layout
- `validate-paragraph.js` is active and required
- stale blocking reports are resolved or explicitly excluded
- `1.1.1 Schaarste en economisch denken` proves the first Book 1 companion path end-to-end

Allowed after unfreeze:
- controlled chapter/book/paragraph production in `../4veco-lessen`
- companion-material generation in `../4veco-lessen`
- deploy/generator runs against `../4veco-lessen` when the task intentionally calls for production output
- normal platform code, validator, report, and planning work

Required after unfreeze:
- follow `BUILD-PARAGRAPH.md` and `BUILD-CHAPTER.md` for production work
- run the relevant validators after generating or deploying output
- keep roadmap sprint status current when production or platform state changes
- do not treat `scripts/deploy.js` as read-only; it writes to the target

Still frozen separately:
- the legacy Module 3 target remains frozen until September 2026 for student-localStorage integrity; do not reason new work back into that retiring stack

## Design Principles

These two principles are the DNA of every product this platform produces — lesson materials, textbooks, assessments, and any future format. Every builder, skill, and template must follow them.

### 1. Dual Coding (Paivio/Mayer)

Every document that explains a concept must pair text with a visual aid. Information is retained better when it arrives through both verbal (text/speech) and visual (graph/diagram/color) channels.

**Rules:**
- Explainer documents (voorkennis, vaardigheden) embed relevant visual variants from `_assets/` — not just the presentatie
- Samenvatting includes key concept graphs alongside text cells
- Exercises reference or include graphs where the concept involves graphical reasoning
- The same visual concept that appears in the presentatie should reappear in the vaardigheden doc that teaches the same skill, but not as a literal copy-paste of the textbook image. Use surface-adapted variants: slide, docx, summary thumbnail, web-light, and web-dark where relevant.
- Part A textbook visuals are source material, not finished companion artwork. Companion visuals may reuse the same data, labels, and SVG geometry, or may be redrawn, but they must be adapted to the layout and medium where they appear.
- Web pages with light/dark modes must provide theme-appropriate visual variants when a graphic contains backgrounds, axes, text, fills, or low-contrast colors. Do not rely on a light-mode textbook PNG inside dark mode.
- Domain color coding (blauw/amber/groen) provides visual recognition without reading
- Formula boxes in monospace provide visual distinction from running text

### 2. Unified Student Experience

A student working through all materials for one paragraph should feel like they're following one coherent lesson, not 8 independent documents. The core anchor is **consistent procedures and approaches** — the same method, the same steps, the same reasoning structure everywhere. Products and numbers may vary by context, but the approach must be identical.

**Rules:**
- **Same procedure steps**: If a skill has 3 steps in the vaardigheden doc, the stappenplan game must use those exact 3 steps (same labels, same order, same reasoning). The procedure is the constant; the context can change.
- **Same approach to solving**: If the vaardigheden teaches "step 1: vul q₂=0 in, step 2: vul q₁=0 in, step 3: verbind", then every document that references snijpunten calculation follows that same approach.
- **Same visual concept reinforcing the approach**: The graph/concept from the presentatie should reappear in the vaardigheden explanation of the same skill — so students see the visual anchor for the procedure they're learning. This means conceptual continuity, not literal file reuse. Adapt the visual to the surface: slide composition, Word layout, web light mode, web dark mode, and thumbnail use can each need their own SVG/PNG variant.
- **Same terminology**: Enforced via the `_paragraph-plan.md` terminologie table.

**How to enforce:** The `_paragraph-plan.md` contains a **procedure-stappen-plan** that defines the canonical step sequence for each skill. All builders — vaardigheden, stappenplan game, presentatie, inoefening — must follow these exact steps. A **visual-variants plan** maps each concept visual to its surface-specific files, and a **visuelen-toewijzing** table maps those variants to every builder that must embed them.

For companion artifact **authoring and regeneration**, use `skills/econ-companion-artifacts.md`. It is the platform-wide standard for student-facing companion artifacts (uitleg voorkennis, uitleg vaardigheden, begeleide inoefening, stappenplan, instapquiz, redeneer-spel, nieuws-detective, differentiated exercise handouts, and matched DOCX/PPTX/PDF outputs). Builder skills (`econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, etc.) inherit those rules; if a builder skill conflicts, the companion-artifacts skill wins on student-facing rules.

For companion artifact **review**, use `agents/econ-companion-visual-review.md`. It checks the rendered student experience, not just source files: visual-text synchronization, procedure fidelity, affordance, cognitive load, accessibility, and source-output parity. A companion surface with missing visual variants, conflicting visual/text examples, broken procedure steps, debug labels, or no next-step routing is not done. The skill above and this agent are aligned: the skill is the authoring spec, the agent is the closure gate.

### Quality control: Part A and Part B have separate review records (L1.5V Bucket F)

Every paragraph carries TWO review records and ONE quality-ref:

- `${parNr}-review.md` — Part A textbook review (output of `econ-paragraph-review` skill).
- `${parNr}-companion-visual-review.md` — Part B companion review (output of `econ-companion-visual-review` agent).
- `${parNr}-quality-ref.yaml` (`schema_version: 2`) — single file with `partA:` block (asset state, content presence, Part A review verdict) and `companion:` block (Part B review verdict, hard-fail count, procedure step count, alt-text + checklist-route + artifact-tool-render flags, surface-by-surface state).

`scripts/validate-paragraph.js` reads each review file by EXACT name (no `endsWith` filename match) and parses verdicts structurally from the `## 2. Verdict` block. Modes: `--mode part-a` gates Part A review only; `--mode part-b` gates companion review only; `--mode complete` aggregates both. A FAIL verdict in either review fails the corresponding mode. Schema details: `docs/L1.5V/F-plan-part-a-b-separation.md` §4.3.

Every skill in `skills/` carries a `pipeline:` frontmatter field (Part A producer / Part B producer / shared infrastructure / Part A reviewer / Part A assembler / Part A orchestrator / Part B producer (umbrella)) so a glance at frontmatter tells you which pipeline owns the skill's output and which gate runs against it.

For a narrower review of a specific visual item, screenshot, rendered UI, graph, chart, diagram, or generated asset, use `agents/visual-qa-agent.md`. It is the conservative visual QA gate for clarity, legibility, hierarchy, affordance, accessibility, geometry, overflow, clipping, and production readiness.

For learning-design and classroom-readiness review, use `agents/teacher-learning-quality-review-agent.md`. It checks whether learning goals, prior knowledge, didactic sequence, formative feedback, differentiation, dual coding, transfer, and retention make student learning likely. Visual polish, accessibility, and passing tests do not prove this.

For lived student-experience review, use `agents/student-experience-review-agent.md`. It checks whether a typical 15-year-old 4 vwo economics student can orient, understand the next action, handle the cognitive load, stay motivated, and connect graphs or flow charts to the explanatory text. Teacher approval does not prove student usability.

For multi-surface QA orchestration, use `agents/lead-reviewer-agent.md`; it routes work to the right specialist agents, verifies evidence completeness, and produces the consolidated go/no-go decision. Use `agents/testing-agent.md` for test command selection, exit-code evidence, validator results, and residual-risk reporting. Use `agents/accessibility-agent.md` for focused readability, contrast, alt-text, OCR, semantic, keyboard, and inclusive-usability review.

## Architectural principles

Three decisions that govern what lives in this platform and how it evolves. These are not style preferences — they determine which proposals fit the project and which are reasoning backwards into a dying direction.

### 1. Exercises are the source of truth

Lesson goals and the micro-teaching-units catalog derive from target exercises — especially real CvTE exam questions — not from exam-program text or syllabus abstractions. Units exist because an exercise requires a skill, not because a syllabus sentence implies one might. Bulk-extracting from the exam program produces ghost skills that appear in reports but never in real work.

**Ground-truth hierarchy (strongest to weakest):**
1. Real CvTE exam questions from past havo/vwo papers
2. Blueprint target exercises in `references/authored/course-target-exercises.json`, currently backed by the active owned blueprint declared in that registry
3. Target exercises already built in the platform (paragraph-level)
4. Proeftoets-eindbazen and consolidation exercises
5. Syllabus eindtermen — for grouping and coverage reporting only, never for minting
6. Blueprint prose in the active `references/owned/course-blueprint-v*.md` source — descriptive context for the target exercises above

**How to apply:**
- When creating an exercise or analyzing an exam question, check every required skill. Missing units are minted via CLI (`build-scripts/references/unit-add.js`) with exam_codes and needs populated.
- Never pre-mint units from the syllabus. Domain A (Vaardigheden) especially grows exercise-first — CvTE lists many abstract skills there that rarely concretize into exam questions.
- Gap reports (exam-vs-program-gaps, blueprint-vs-exam-gaps, exam-question-type-distribution) surface drift between syllabus claims, real exam reality, blueprint intent, and built materials. **Gaps are diagnostic signal, not a to-do list to auto-fill.**

### 2. Machine-only editing — the goal end-state

Hand-edits to machine-authored references and generated artifacts are forbidden. Humans propose changes via CLI scripts (eventually wrapped by natural-language skills); the CLI validates and writes. If a human hand-edits a machine reference, the change does not survive: next script run or next report reverts or flags it.

**Why:** Integrity at scale. A catalog with DAG dependencies, exam-code cross-references, and procedure consistency cannot be maintained by hand without silent drift as soon as the dataset exceeds one person's working memory.

**Current state (direction, not yet uniform):**
- `references/machine/` — already enforced. Edits only via `build-scripts/references/*-edit.js`. Never via Edit/Write tools.
- `references/external/` — machine-refreshed (re-extracted from PDFs, re-fetched from URLs). Same principle, different source.
- `references/authored/` — still hand-edited by design. Long-term direction: shrink this folder as more references gain machine-editing pipelines. Folder location signals current status.

**How to apply:**
- When the user asks to change a unit, formula, procedure, or term in a machine reference: invoke or design the appropriate CLI command. Do not open the file and edit.
- Skills that modify machine references shell out to the CLI; they have no file-write capability on machine references.
- When a new hand-maintained reference becomes painful (drift, inconsistency, scale): the answer is to build a CLI pipeline and migrate it from `authored/` to `machine/`, not to add more manual process.

### 3. The legacy game target is being retired — don't reason backwards into it

The current legacy game target (historically Module 3) is frozen until September 2026 for student-localStorage integrity. It will be retired in favor of markdown-native material in `4veco-lessen/`. `3-Module-3-rewire-test/` is a testing surround layered on top of that legacy target — partially broken in several places because the target itself is (vaardigheden pages come from `.docx` via `convert_vaardigheden.py`, a lossy binary source).

**How to apply:**
- Don't propose refactors that improve the legacy target's `.docx → HTML` path (e.g. teaching `convert_vaardigheden.py` to emit editorial HTML, or building a proper `build-vaardigheden-shells.js` that reads the `.docx`). That's reasoning backwards into a dying stack.
- The `reskin-vaardigheden.js` + deploy pipeline is a bridge that works until the next-year testing surround exists — leave it.
- If a legacy-target-specific issue looks expensive to fix, flag the decision back to the user ("this is in the retiring stack — is it worth the time?") rather than diving in.
- New content flows into `4veco-lessen/Boek N - titel/` as markdown-native; that is the direction.

## Structuur

```
4veco-platform/
├── engines/                    ← Game engines (broncode) — 5 games
│   ├── quiz-engine.js, quiz-ui.js, quiz.css
│   ├── reasoning-engine.js, reasoning-ui.js, reasoning.css
│   ├── skilltree-engine.js, skilltree-ui.js, skilltree.css
│   ├── newsdetective-engine.js, newsdetective-ui.js, newsdetective.css
│   ├── procedure-engine.js, procedure-ui.js, procedure.css  ← stappenplan-game
│   ├── skilltree/base-elements.js, explanations.js
│   ├── voorkennis.js, voorkennis.css  ← geen game, maar een doc-renderlaag
│   ├── theme.js
│   └── tests/                  ← Unit tests + data validation tests
├── build-scripts/              ← Build pipeline (platform/, lib/, templates/, content/, archive/)
├── source-data/
│   ├── book-1/
│   │   └── reasoning/          ← Boekgerichte reasoning-CSV's (actieve richting)
│   └── legacy-target/          ← Legacy input voor het oude game-target
│       ├── reasoning/*.csv     ← Bron-CSV's voor redeneer-spel
│       └── skilltree/*.js      ← Per-paragraaf skill config
├── scripts/
│   ├── deploy.js               ← Kopieert engines + genereert content naar module-repo
│   ├── check-links.js          ← Verifieert alle interne links
│   ├── verify-deployment.sh    ← Post-push verificatie
│   └── pre-push-hook.js        ← Git hook
├── skills/                     ← Shared skills (didactiek, templates, grafieken, quality control) — for Claude, Codex, and any agent
├── agents/                     ← Reusable review-agent specifications for bounded QA roles
├── references/                 ← Authoritative standards, organised by maintenance status:
│   ├── external/                ←   Mirrored from outside bodies (CvTE, inspectie, school); machine-refreshed
│   ├── authored/                ←   Hand-edited (legacy bucket; target to shrink)
│   └── machine/                 ←   Edited only via CLI scripts; integrity-enforced
└── package.json                ← Jest voor tests
```

## Deploy workflow

```bash
# Automated layer bouwen en kopiëren naar een target:
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"

# Legacy alias:
npm run deploy:legacy
```

De deploy doet:
1. Kopieert engine files → `<module>/shared/`
2. Runt alle generators (skilltree, reasoning, quiz, newsdetective, landing pages)
3. Verificatie: link checker + data tests

### Belangrijk: scope van deploy

`deploy.js` bouwt alleen de **automated layer**:
- engine-copy
- quiz/newsdetective/reasoning/skilltree shells
- landing pages
- link checks
- data tests

`deploy.js` bouwt **niet** automatisch:
- presentaties
- uitleg voorkennis
- uitleg vaardigheden
- nieuws met visual
- samenvattingen
- begeleide inoefeningen
- opgavensets
- YouTube-video pagina's
- docx → html conversies

Voor de volledige paragraaf-productie: volg [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md).

### Deployen naar een ander target
```bash
node scripts/deploy.js "../4veco-lessen/Boek N - [Titel]"
```
Zelfde engines, zelfde base-elements, andere content data.

## Build scripts met MODULE_ROOT

Alle build scripts accepteren `MODULE_ROOT` als env var. Zonder die var schrijven ze naar hun parent directory (backward-compatible).

```bash
# Eén script draaien tegen een specifieke target-root:
MODULE_ROOT="../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod" node build-scripts/platform/build-skilltree-shells.js
```

| Script | Genereert |
|--------|-----------|
| `build-skilltree-shells.js` | HTML shells + data files in `shared/skilltree/` |
| `build-reasoning-engine.js` | HTML shells voor redeneer-spel |
| `build-reasoning-questions.js` | CSV → JS data file in `shared/reasoning/` |
| `generate-quiz-shells.js` | HTML shells voor instapquiz |
| `build-newsdetective-shells.js` | HTML shells voor nieuws-detective |
| `build-landing-page.js` | index.html voor paragrafen, hoofdstukken, module |
| `template-B_voorkennis.js` | `uitleg voorkennis.docx` |
| `pptx-331-rol-overheid.js` | Presentatie `.pptx` (reference builder; uses `lib-pptx.js`) |

Let op: deze tabel is niet de volledige paragraph workflow. Veel rijke assets gebruiken reference scripts of converters buiten `deploy.js`. Zie [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md) voor de complete productieketen.

---

## Modelgebruik

| Taak | Model | Toelichting |
|------|-------|-------------|
| Opzet en ontwerp presentaties | **Opus 4.6** | Creatieve kwaliteit en visueel ontwerp |
| Economische grafieken en visuals | **Opus 4.6** | Precisie en vakinhoudelijke correctheid |
| Subtaken (research, berekeningen) | **Sonnet 4.6 of Opus 4.6** | Bij twijfel Opus |
| Eindcontroles en QA | **Opus 4.6** | Kritische feedback essentieel |
| **Nooit gebruiken** | ~~Haiku~~ | Niet geschikt voor presentaties en creatief werk |

---

## Skills — Automatische trigger-regels

Skills staan in `skills/`. Ze worden automatisch geladen op basis van de taak.

| Taak | Laad deze skills |
|------|-----------------|
| Presentatie maken | `econ-pptx-templates` + `economic-graph` + `econ-didactiek` |
| Uitleg voorkennis maken | `econ-explainer-docs` + `econ-word-templates` + `economic-graph` |
| Uitleg vaardigheden maken | `econ-explainer-docs` + `econ-word-templates` + `economic-graph` |
| Nieuws met visual maken | `econ-nieuws-exercise` + `econ-word-templates` + `economic-graph` |
| Begeleide inoefening maken | `econ-word-templates` + `econ-didactiek` |
| Opgaven/antwoorden maken | `econ-word-templates` + `econ-didactiek` |
| Hoofdstuksamenvatting maken | `aanpak-samenvattingen` + `econ-word-templates` + `economic-graph` |
| Textbook paragraph bouwen | `econ-textbook-paragraph` + `econ-exercise-builder` + `econ-didactiek` + `economic-graph` + `econ-pdf-builder` |
| Exercises genereren (standalone) | `econ-exercise-builder` + `econ-didactiek` + `economic-graph` |
| Markdown → PDF exporteren | `econ-pdf-builder` + `economic-graph` |
| Consolidatie/toets bouwen | `econ-consolidation-builder` + `econ-didactiek` + `economic-graph` + `econ-pdf-builder` |
| Hoofdstuk bouwen (end-to-end) | `econ-chapter-builder` (orchestrator) → `econ-textbook-paragraph` + `econ-consolidation-builder` + `econ-chapter-assembler` |
| Hoofdstuk samenstellen (assembly only) | `econ-chapter-assembler` + `econ-pdf-builder` |

---

## Presentatie-eisen (kernregels)

### Didactisch
- Start met leerdoelen
- Groepeer per vaardigheid of deeldomein
- Leg de denkroute uit
- Besteed kort aandacht aan veelgemaakte fouten
- Sluit af met samenvatting

### Visueel
- **Minimaal 18pt** lettergrootte, liever 20-24pt
- **Eén hoofdidee per dia**
- Veel witruimte, rustige compositie
- Grafieken op witte achtergrond
- Varieer lay-outs per dia

### Grafieken
Volg de `economic-graph` skill. Kernprincipe: economisch correct, geometrisch exact, visueel rustig.

**Architectuurbeslissing (2026-03):** Gebruik raw SVG → Sharp → PNG pipeline. Geen declaratieve libraries.

---

## Testing

```bash
# Engine unit tests (geen MODULE_ROOT nodig):
npx jest --testPathPatterns "engines/tests/.*-engine\.test\.js"

# Data tests (tegen een target-root met manifest):
MODULE_ROOT="../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod" npx jest --testPathPatterns "engines/tests/.*-data\.test\.js"

# Alle tests:
npm test
```

### Engines wijzigen
1. Edit in `engines/`
2. Run engine tests
3. Deploy naar module-repo
4. Test in browser
5. Commit en push module-repo

### Nieuw reasoning game toevoegen
1. CSV maken → `source-data/book-1/reasoning/X.Y.Z.csv`
2. `node build-scripts/platform/build-reasoning-questions.js X.Y.Z <domain> source-data/book-1/reasoning/X.Y.Z.csv --generate-review`
3. Economics review subagent op het review document
4. Correcties doorvoeren in CSV, opnieuw builden
5. `node scripts/deploy.js <module-path>`

---

## Game Architectuur (overzicht)

### Instapquiz
- Engine: `engines/quiz-engine.js` + `quiz-ui.js`
- Data: `shared/questions/X.Y.Z.js` per paragraaf
- HTML: thin shell in `1. Voorbereiden/`

### Redeneer-spel (5 modi)
- Engine: `engines/reasoning-engine.js` + `reasoning-ui.js`
- Data: `shared/reasoning/X.Y.Z.js` (gegenereerd uit CSV)
- HTML: thin shell in `3. Oefenen/`
- Domeinen: economics, math-economics, arithmetic

### Wiskundevaardigheden (Skill Tree)
- Engine: `engines/skilltree-engine.js` + `skilltree-ui.js`
- Generators: `engines/skilltree/base-elements.js` (35 skills, 4 lagen)
- Data: `shared/skilltree/X.Y.Z.js` per paragraaf
- Global progress via `localStorage` key `skilltree_global_stars`

### Nieuws-detective
- Engine: `engines/newsdetective-engine.js` + `newsdetective-ui.js`
- Data: `shared/newsdetective/X.Y.Z.js` per paragraaf
- HTML: thin shell in `1. Voorbereiden/`
- 4 rondes per paragraaf, score 0-4

---

## Technische omgeving

### Node.js
Beschikbare modules: `pptxgenjs`, `sharp`, `docx`, `pdf-lib`, `marked`, `graphviz`

> Stel `NODE_PATH` in als modules globaal geïnstalleerd zijn.

### Python
Module `python-docx` voor het lezen van bestaande Word-bestanden.

De Python converters in `build-scripts/` zijn een vast onderdeel van de workflow voor:
- `uitleg voorkennis.docx` → `uitleg voorkennis.html`
- `uitleg vaardigheden.docx` → `uitleg vaardigheden.html`
- `begeleide inoefening` docx-bestanden → interactieve HTML

---

## Kwaliteitsstandaard

Een presentatie is pas af als een docent deze **direct in de les kan gebruiken**, zonder aanpassingen.

**Bij twijfel over kwaliteit: gebruik Opus 4.6 en doe een extra QA-ronde.**

## Temporary Files & Workspace Cleanup

### MANDATORY: Clean up after every task

You MUST treat temporary/intermediate files as your responsibility. Delete all temp files when done. Use `/tmp/Codex-work/` for intermediate files. Never litter the project root.

### Beleid: scripts bewaren

Wanneer een taak een script produceert dat herbruikbaar is, sla dit op in `build-scripts/` met een duidelijke naam en een `HOW TO ADAPT`-header.
