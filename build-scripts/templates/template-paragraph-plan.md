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

List every SVG visual needed across all builders. Each visual is built once in Phase 4b and stored in `_assets/`.
For companion-only visuals, always write the full file name with extension somewhere in the plan (for example `X.Y.Z_news_topic.svg/png` here and `X.Y.Z_news_topic.png` in the visual-assignment table) so `validate-paragraph.js --mode complete` can verify it instead of flagging it as an orphan.

| Filename | Graph type (economic-graph.md) | Used by | Description | Parameters |
|---|---|---|---|---|
| `va-equilibrium` | A. Supply & Demand | presentatie (slide N), nieuws | ... | V: p = ..., A: p = ... |
| | | | | |

**Graph types** (from `economic-graph.md` Part 3): A. Supply & Demand, B. Cost curves (MK/GTK/GVK), C. Market equilibrium + surplus, D. Tax/subsidy shift, E. Comparative advantage (PPF), F. Flowchart, G. Bar/line chart, H. Custom.

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

> **Critical**: Every document that explains a concept with a matching visual MUST embed it. Not just the presentatie.

| Visual | presentatie | vaardigheden | voorkennis | samenvatting |
|---|---|---|---|---|
| `[filename].png` | slide [N] | skill [N] ([name]) | section [N] ([name]) | cell [N] |
| | | | | |
