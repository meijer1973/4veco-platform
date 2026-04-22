# 4veco Platform

**Working agreement** — read `../CLAUDE.md` "Working agreement — how Claude operates in this repo". Seven non-negotiable operating rules (read-first, sanity-check-plans, be-honest-about-mistakes, quality-over-patchwork). Apply to every task in this repo, not just the root.

**Deze directory bevat geen student-facing output.** Er zijn twee outputpaden, beide naar sibling-directories:

- **Games → Module 3.** `node scripts/deploy.js "<module-pad>"` genereert HTML-games naar `../3. Module 3 - Markt en overheid/` of `../3-Module-3-rewire-test/`.
- **Paragrafen, hoofdstukken, boeken → 4veco-lessen.** Skills `econ-textbook-paragraph`, `econ-chapter-builder` en `econ-book-builder` schrijven markdown + PDF naar `../4veco-lessen/Boek N - titel/X.Y Hoofdstuk naam/`. Dit is de student-facing structuur die Module 3 op termijn vervangt.

Zie `../CLAUDE.md` voor de volledige pipeline + directory-kaart. Als je een browser- of PDF-wijziging verwacht te zien, moet je eerst deployen of opnieuw bouwen — niets rendert rechtstreeks vanuit de platform-tree.

All project documentation lives in dedicated files:

- **AGENTS.md** — Repo overview, architecture, deploy scope, model usage, skills, testing, quality standards
- **BUILD-PARAGRAPH.md** — End-to-end paragraph production guide (input contract, workflow, per-asset specs)
- **BUILD-CHAPTER.md** — End-to-end chapter assembly guide (pre-assembly gates, cross-paragraph checks, independent QC)
- **build-scripts/README.md** — Script taxonomy (platform/, lib/, templates/, content/, archive/)
- **source-data/README.md** — Input-side conventions
- **references/** — Authoritative standards used by skills. Three buckets signal maintenance status:
  - **`references/external/`** — Mirrored from authoritative outside bodies; machine-refreshed (see `references/external/README.md`). Never hand-edit.
    - `syllabus-economie-vwo-2026-versie-2.pdf` — Official CvTE syllabus (examenprogramma, eindtermen, notation markers)
    - `syllabus-eindtermen.md` + `.json` — machine-extracted projection of the syllabus (when generated)
    - `exams/` — CvTE havo/vwo exam PDFs; primary ground-truth for the exercise-first unit catalog
    - `inspectie-standaarden.md` — Onderwijsinspectie quality framework (OP1–OP6)
    - `amstelveencollege_quality_standards.md` — School-fit overlay
  - **`references/authored/`** — Still hand-edited; shrinks over time as machine pipelines replace manual maintenance (see `references/authored/README.md`).
    - `economie-terminologie.md` — Canonical Dutch economic terms. **All student-facing content must use terms from this reference.**
    - `economic_mathematical_precision_reference.md` — Non-negotiable precision rules (economic object identification, ceteris paribus, text-graph-formula matching, units, movement vs shift, cost terminology, domain restrictions). **Takes precedence over looser wording elsewhere.**
    - `didactiek-principes.md` — Single source of truth for didactical principles (cognitive load, dual coding, scaffolding, interleaving, misconceptions, Bloom, exercise design)
    - `vraagtypen-en-opgaveontwerp.md` — Single source of truth for question types, exercise formats, answer model conventions, scaffolding, Bloom distribution targets
    - `skill-categories.md` — 8-way cognitive categorization aligned with CvTE Domein A
  - **`references/machine/`** — Edited only via CLI scripts under `build-scripts/references/`; never by hand (see `references/machine/README.md`).
    - `micro-teaching-units.md` + `.json` — canonical registry of teaching units; see `knowledge/micro-teaching-units-plan.md` for the architecture

Skills are in two locations (kept in sync):
- `skills/` — shared canonical location for all agents (Claude, Codex, etc.)
- `.claude/commands/` — Claude Code reads from this path automatically

**Meta-skill:** `senior-dev-planning` — planning methodology for any non-trivial coding task in this repo (investigate before asserting, be honest about uncertainty, reason backwards from the user's actual need). Triggers on requests like "plan before coding" or whenever work touches unfamiliar code. Operationalizes the Working agreement rules for the specific artifact of a plan document; not tied to the AGENTS.md build-artifact trigger table.

Temporary files: always clean up after every task. Use `/tmp/claude-work/` for intermediate files.
