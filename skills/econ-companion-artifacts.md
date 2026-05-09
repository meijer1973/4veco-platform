---
name: econ-companion-artifacts
description: "Authoring + regeneration spec for student-facing companion artifacts (uitleg voorkennis, uitleg vaardigheden, begeleide inoefening, stappenplan, instapquiz, redeneer-spel, nieuws-detective, differentiated exercise handouts, and matching DOCX/PPTX/PDF companion outputs). Defines the source-first rule, required pre-checks, procedure-fidelity rules, visual-as-instruction rules, dual coding, cognitive load, scaffold appropriateness, source-output parity, affordance/routing, terminology, and the self-review-before-delivery gate. ALWAYS use this skill when creating, regenerating, or fixing any companion artifact in the surface family above. Pair with the matching builder skill (`econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, `econ-word-templates`, `economic-graph`, `econ-nieuws-exercise`, etc.) and run `agents/econ-companion-visual-review.md` as the closure gate."
pipeline: "Part B producer (umbrella; per-format Part B skills inherit; if a per-format skill conflicts on student-facing rules, this skill wins)"
---

# Companion Learning Artifacts Skill

General authoring + regeneration recipe for **student-facing companion artifacts**, including:

- `uitleg voorkennis.html`
- `uitleg vaardigheden.html`
- `begeleide inoefening.html`
- `stappenplan.html`
- `instapquiz.html`
- `redeneer-spel.html`
- `nieuws-detective.html`
- differentiated exercise handouts where the visual or route-choice layer matters
- companion DOCX/PPTX/PDF outputs when they are part of the same surface family

This skill encodes the platform-wide standard. Companion-specific builders (`econ-explainer-docs` for voorkennis/vaardigheden DOCX, `econ-exercise-builder` for fading-exercise handouts, `econ-pptx-templates` for slide companions, etc.) inherit these rules; if a builder skill conflicts with this skill, this skill wins for student-facing rules and the builder skill should be updated.

The matching review agent is `agents/econ-companion-visual-review.md`. Every companion delivery passes through that agent (or its review heuristics simulated by the author) before it is marked done.

## When to use this skill

Trigger when:

- Creating a new companion artifact for any paragraph (HTML, DOCX, PPTX, PDF, or matched set).
- Regenerating an existing companion artifact after a registry, visual, or content change.
- Fixing a hard fail or flagged issue from `econ-companion-visual-review`.
- Reviewing your own companion before handing off, in lieu of the agent if it is unavailable.

Always read first:

- `AGENTS.md` (architecture + canonical authority)
- `BUILD-PARAGRAPH.md` (paragraph build pipeline)
- `agents/econ-companion-visual-review.md` (the review gate)
- The matching builder skill (`econ-explainer-docs`, `econ-exercise-builder`, etc.)
- The paragraph's `_paragraph-plan.md` and the canonical unit/procedure/terminology registries

---

## Core rule

Create student-facing companion artifacts from the **platform source layer**, not by hand-editing generated output. Generated artifacts must be **reproducible, reviewable, and consistent** across HTML, DOCX, PPTX, games, and visual variants.

The artifact must answer three student questions:

1. **What do I do here, now?**
2. **What do I do next after this?**
3. **Which path should I take if there are multiple routes?**

If any of these are unclear, the artifact is not finished.

---

## Required source checks before creating the artifact

Before writing or generating the artifact, inspect the relevant sources:

1. **Repository maps and access rules** — `AGENTS.md`, `BUILD-PARAGRAPH.md`, `BUILD-CHAPTER.md`, the lessen tree layout.
2. **Paragraph plan** — `_paragraph-plan.md` for the target paragraph.
3. **Paragraph markdown/PDF source** — the textbook content the companion supports.
4. **Course blueprint and target exercise** — what skill the companion serves.
5. **Canonical unit/procedure registry** — `references/machine/micro-teaching-units.json`, terminology registry.
6. **Existing visual assets and required surface variants** — `_assets/` with `_doc`, `_slide`, `_summary`, `_web_light`, `_web_dark` variants.
7. **Paragraph index and companion route structure** — `index.html` routing for this paragraph.
8. **Relevant platform generator/template** — the builder script (`b1-XYZ-<companion>.js`), converter (`convert_<companion>.py`), shared engine (`engines/`, `build-scripts/lib/`).

**Do not infer artifact existence or correctness from a plan alone. Verify the actual generated artifact** in the lessen tree (HTML in browser, DOCX rendered to PDF, image variants opened directly).

---

## Procedure fidelity

If the artifact teaches or uses a named procedure, the procedure must match the canonical registry.

Check:

- same step count;
- same step order;
- same step names;
- same function of each step;
- same terminology across text, visuals, examples, games, and checklist.

A visual, table, game, or worked example may not silently use a different version of the procedure.

If a simplified version is needed, it must be **explicitly registered or named as a didactic variant**, and the artifact must explain its relationship to the canonical procedure. Do not invent a bridge after the fact.

---

## Visuals are instructional content

Treat visuals as part of the explanation, not decoration.

For every visual, check:

- Does it match the adjacent text?
- Does it use the same numbers, labels, and terms?
- Does it reduce cognitive load?
- Is it legible in the rendered surface?
- Are arrows, labels, axes, legends, and captions clear?
- Is the visual free of production labels, placeholder text, debug labels, and irrelevant chrome (`COMPANION VISUAL`, asset filenames, internal IDs)?
- Does it have meaningful alt text (no filename-like alt such as `alt="1.1.1_fig_1"`)?
- Does it work in required surface variants, including light/dark web variants?

A visual that contradicts the text is a hard fail.

---

## Dual coding

Verbal and visual channels must reinforce each other.

- Do not let the visual carry an essential procedure step or calculation that is missing from the text.
- Do not let the text describe a different example than the visual.
- Worked examples must be **text-complete and visually reinforced**: the student can follow the calculation in prose alone, and the visual matches.

---

## Cognitive load

Reduce extraneous load.

Avoid:

- multiple new terms in one sentence without support;
- stacked visuals with unclear priority;
- unexplained switches between examples;
- unlabelled procedure variants;
- legends separated from the figure they explain;
- formulas separated from the worked example;
- decorative labels that do not help learning;
- inconsistent notation, spelling, units, or terminology.

Chunk the page around canonical learning moves, not around every possible subtopic.

---

## Scaffold appropriateness

Match the scaffold to the artifact role.

For a **skills explanation page** (uitleg voorkennis, uitleg vaardigheden):

- show the procedure explicitly;
- show worked examples step by step;
- include common pitfalls;
- include short control prompts;
- include a checklist;
- include a next-step route.

For an **exercise or fading-stage artifact** (begeleide inoefening, basisopgaven, middenopgaven, verrijking):

- remove scaffolds only when the fading sequence requires it;
- do not leave full support in a stage that should be independent;
- do not remove visual/procedural support too early.

---

## Source-output parity

Generated output must preserve the intended source content.

After generation, inspect the rendered artifact and verify that these survived:

- bullets and numbered steps;
- calculations;
- tables;
- formulas;
- captions;
- visual references;
- checklist items;
- route links;
- light/dark visual switching;
- alt text.

If the source is correct but the rendered output loses content, **treat that as a platform/generator issue, not as an acceptable artifact**. Fix the converter/template, not the rendered file.

---

## Affordance and routing

Every companion artifact must include a clear handoff.

At the end, tell the student what to do next. If the artifact contains a checklist, quiz result, diagnostic result, or self-assessment, **convert it into route advice**.

Example:

| Student state | Next route |
|---|---|
| I do not understand the concept yet | Uitleg voorkennis or reread concept section |
| I understand the concept but not the steps | Stappenplan |
| I can follow examples but not solve alone | Begeleide inoefening |
| I can solve simple tasks | Basisopgaven |
| I can solve independently in new contexts | Middenopgaven |
| I can reason beyond the standard task | Verrijking |

A checklist without next-step routing is incomplete.

---

## Terminology

Use canonical Dutch terms consistently.

- Do not introduce English variants, informal labels, or alternative names unless the paragraph plan explicitly allows them.
- If informal labels are used as scaffolds, label them as scaffolds and keep canonical terminology dominant.
- Units, spelling, and notation must be consistent across text and visuals (`maïs` not `Mais`, `alternatieve kosten` not `alt.kosten` and not English equivalents).

Canonical Dutch abbreviations (BBP, MK, MO, BTW, etc.) are allowed if introduced and explained correctly at first use; ad-hoc shortenings are spelled out everywhere.

---

## Review before delivery

Before marking the artifact ready, run or simulate the companion visual review (`agents/econ-companion-visual-review.md`):

1. Artifact role check.
2. Canonical source check.
3. Rendered visual check.
4. Visual-text synchronization check.
5. Procedure isomorphism check.
6. Worked-example completeness check.
7. Cognitive-load check.
8. Accessibility check.
9. Affordance and route-choice check.
10. Platform ownership check.

**Do not return PASS if:**

- a canonical procedure is represented with a different step count or order;
- a visual contradicts adjacent text;
- a required calculation or step is missing in rendered output;
- a student-facing graphic contains production/debug labels;
- alt text is filename-like;
- the artifact ends without next-step guidance;
- the fix depends on hand-editing generated lesson output.

If the review agent is not available in the current run, simulate the same checks and surface the same verdict in your delivery.

---

## Required delivery

When you hand off the artifact, deliver:

1. **The regenerated artifact** (path in the lessen tree).
2. **A short explanation of the changes** (which builders/converters/registry entries changed and why).
3. **Evidence that the rendered page was checked** (browser/DOCX inspection, not just source diff).
4. **A source-output parity note** (which source elements you confirmed survive in the rendered output).
5. **Any unresolved issues with severity and platform handoff** (lesson-side / platform / asset-generator / shared CSS-JS / canonical-registry / quality-log).
6. **Review-agent output** or a statement that the agent is not yet available, with the simulated review verdict.

---

## How this skill connects to the rest of the platform

- **Builders**: `econ-explainer-docs`, `econ-exercise-builder`, `econ-pptx-templates`, `econ-word-templates`, `economic-graph`, `econ-nieuws-exercise`, `econ-consolidation-builder`, `econ-testprep-builder`. Builders produce the source; this skill scopes how that source must serve the student.
- **Review gate**: `agents/econ-companion-visual-review.md` (FAIL on any hard fail listed in the "Review before delivery" section).
- **Closure**: `econ-quality-control` and `qc-references` for logging defects. A companion is not closed by passing `validate-paragraph.js` alone; the visual review must also pass or pass-with-flags.
- **Pipeline**: `BUILD-PARAGRAPH.md` Phase 6 (Deploy + validate) runs this skill's review heuristics; closure is recorded as `X.Y.Z-companion-visual-review.md` in the paragraph folder.
