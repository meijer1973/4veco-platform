# 4veco Platform

All project documentation lives in dedicated files:

- **AGENTS.md** — Repo overview, architecture, deploy scope, model usage, skills, testing, quality standards
- **BUILD-PARAGRAPH.md** — End-to-end paragraph production guide (input contract, workflow, per-asset specs)
- **BUILD-CHAPTER.md** — End-to-end chapter assembly guide (pre-assembly gates, cross-paragraph checks, independent QC)
- **build-scripts/README.md** — Script taxonomy (platform/, lib/, templates/, content/, archive/)
- **source-data/README.md** — Input-side conventions
- **references/** — Authoritative external standards used by skills:
  - `syllabus-economie-vwo-2026-versie-2.pdf` — Official CvTE syllabus (examenprogramma, eindtermen, notation markers)
  - `economie-terminologie.md` — Canonical Dutch economic terms, abbreviations, and translation pitfalls. **All student-facing content must use terms from this reference.**
  - `economic_mathematical_precision_reference.md` — Non-negotiable precision rules for all content: economic object identification, ceteris paribus, text-graph-formula matching, units, movement vs shift, cost terminology, domain restrictions. **Takes precedence over looser wording elsewhere.**
  - `didactiek-principes.md` — Single source of truth for all didactical principles: cognitive load theory, dual coding, scaffolding/fading, differentiation, interleaving, misconceptions, Bloom's taxonomy, exercise design, paragraph structure, quality standards, research evidence
  - `amstelveencollege_quality_standards.md` — School-fit overlay: explicit leerdoelen, formative monitoring, layered differentiation, meaningful context, learner self-monitoring, optional enrichment
  - `inspectie-standaarden.md` — Onderwijsinspectie quality framework (OP1–OP6)
  - `vraagtypen-en-opgaveontwerp.md` — Single source of truth for all question types, exercise formats, answer model conventions, scaffolding systems, Bloom distribution targets, point allocation, and opgave design rules

Skills are in two locations (kept in sync):
- `skills/` — shared canonical location for all agents (Claude, Codex, etc.)
- `.claude/commands/` — Claude Code reads from this path automatically

Temporary files: always clean up after every task. Use `/tmp/claude-work/` for intermediate files.
