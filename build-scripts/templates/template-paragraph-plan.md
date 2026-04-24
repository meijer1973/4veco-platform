# Paragraph Plan: X.Y.Z [Naam]

> Copy this template into `<paragraph-folder>/_paragraph-plan.md` and fill in every section during **Phase 4a**.
> This plan is the single source of truth for all builders working on this paragraph.

---

## Key concepts

List the 5-8 key concepts that this paragraph teaches. Every builder draws from this list.

| # | Concept | Definition (1 sentence) | Formula | Graph type needed |
|---|---------|------------------------|---------|-------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

## Visuals plan

List every conceptual SVG visual needed across all builders. Part A textbook visuals may be source material, but companion output should use surface-adapted variants rather than copy-pasted book images.
For companion-only visuals, always write the full file name with extension somewhere in the plan (for example `X.Y.Z_news_topic.svg/png` here and `X.Y.Z_news_topic.png` in the visual-assignment table) so `validate-paragraph.js --mode complete` can verify it instead of flagging it as an orphan.

| Filename | Graph type (economic-graph.md) | Used by | Description | Parameters |
|---|---|---|---|---|
| `va-equilibrium` | A. Supply & Demand | presentatie (slide N), nieuws | ... | V: p = ..., A: p = ... |
| | | | | |

**Graph types** (from `economic-graph.md` Part 3): A. Supply & Demand, B. Cost curves (MK/GTK/GVK), C. Market equilibrium + surplus, D. Tax/subsidy shift, E. Comparative advantage (PPF), F. Flowchart, G. Bar/line chart, H. Custom.

---

## Visual variants plan

For each conceptual visual, list the surface-specific files that must be rendered to `_assets/`. Use the same economic data and reasoning, but adapt layout, proportions, typography, contrast, annotations, and color treatment to the surface.

Web pages with a light/dark theme need both `_web_light` and `_web_dark` variants whenever the visual contains text, axes, fills, or a non-transparent background. Do not put a light-mode textbook PNG inside dark mode.

| Concept visual | Source/base | Slide variant | Docx variant | Summary variant | Web light | Web dark | Notes |
|---|---|---|---|---|---|---|---|
| [concept] | `[filename].svg` | `[filename]_slide.png` | `[filename]_doc.png` | `[filename]_summary.png` | `[filename]_web_light.svg/png` | `[filename]_web_dark.svg/png` | [what changes per surface] |
| | | | | | | | |

---

## Presentation outline

Slide sequence for the presentation. Each theory slide should reference a visual from the visuals plan.

1. **Title slide**: [paragraph title]
2. **Theory**: [concept] — visual: `[filename].png`
3. **Theory**: [concept] — visual: `[filename].png`
4. **Theory**: [concept] — visual: `[filename].png`
5. ...

Minimum: 3 slides with SVG graphs. Theory + worked examples only, never exercise instructions.

---

## News plan

| | |
|---|---|
| **Article** | [title, source, URL] |
| **Summary** | [80 words max] |
| **Visual** | `[filename]` from visuals plan |
| **Graph type** | [bar chart / line chart / supply-demand / ...] |
| **Questions (5)** | [brief description, increasing difficulty] |

---

## Summary concepts

Complete list of concepts, terms, and formulas that the "samenvatting" infographic must cover. Cross-check against key concepts — nothing should be missing.

- [ ] [concept 1]
- [ ] [concept 2]
- [ ] [formula 1]
- [ ] ...

---

## Terminology

Consistent term usage across all 8 documents. When in doubt, prefer the textbook's exact wording.

| Term | Use everywhere | Do not use |
|---|---|---|
| | | |
| | | |

---

## Exercise distribution

How exercises are distributed across the three difficulty levels.

| Level | Count | Topics | Question type |
|---|---|---|---|
| **Basic** (8-10) | | knowledge recall: ... | multiple choice, fill-in-the-blank |
| **Intermediate** (6-8) | | application: ... | calculation questions, graph questions |
| **Enrichment** (4-6) | | analysis/evaluation: ... | open questions, case studies |

---

## Skills & prior knowledge

Quick reference for the "uitleg" builders. **Cite unit IDs from `references/machine/micro-teaching-units.md`** — not free text — so the registry integrity reports can catch drift.

**Prior knowledge** (unit IDs, comma-separated): [A01, A02, ...]
**Skills** (unit IDs, comma-separated): [D05, D06, ...]

Every cited ID must resolve to a live unit (the build fails the `unresolved-refs.md` CI check otherwise). If a required skill doesn't exist yet, mint it via `node build-scripts/references/unit-add.js --spec '{...}'` before referencing it here.

Optional graphs needed for these documents: [list or "none"].

---

## Procedure step plan (unified experience)

> **Critical**: This section is now **derived from the units, not authored here**. Each skill cited above has a canonical `procedure` field in `micro-teaching-units.md`. Downstream builders ("vaardigheden", "stappenplan" game, presentatie, "inoefening") must pull procedure steps from the registry via the unit ID, not re-author them. Products and numbers may vary by context, but the step sequence is fixed.

If a unit's procedure needs a refinement, use `unit-update --id <ID> --spec '{"procedure":[...]}'`. Changes flow back into every consumer automatically via the generated JSON; no per-paragraph duplication.

For the convenience of the paragraph author: a snapshot table copied here as documentation only (NOT the source of truth):

| Unit ID | Unit name | Steps (see micro-teaching-units.md#<ID> for the authoritative list) |
|---|---|---|
| [A01] | [name] | [N steps] |
| [D05] | [name] | [N steps] |

---

## Visual assignment (dual coding)

> **Critical**: Every document that explains a concept with a matching visual MUST embed an adapted variant. Not just the presentatie. Dual coding means conceptual continuity, not literal copy-paste of a textbook image.

| Visual concept | presentatie | vaardigheden | voorkennis | samenvatting | themed web |
|---|---|---|---|---|
| `[concept]` | `[filename]_slide.png`, slide [N] | `[filename]_doc.png`, skill [N] ([name]) | `[filename]_doc.png`, section [N] ([name]) | `[filename]_summary.png`, cell [N] | `[filename]_web_light.svg/png` + `[filename]_web_dark.svg/png` |
| | | | | | |
