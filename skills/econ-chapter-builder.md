---
name: econ-chapter-builder
description: "End-to-end chapter production: reads the blueprint, plans paragraph progression, builds each paragraph via econ-textbook-paragraph, runs QC, and assembles into a chapter PDF via econ-chapter-assembler. Use when building a complete chapter from scratch. Trigger when the user mentions hoofdstuk bouwen, chapter build, build chapter, alle paragrafen maken, or complete chapter from blueprint. This is the top-level orchestrator — it calls econ-textbook-paragraph for each paragraph, econ-consolidation-builder for §4, and econ-chapter-assembler for final assembly."
pipeline: "Part A orchestrator"
---

# Economics Chapter Builder

End-to-end orchestrator for building a complete textbook chapter from blueprint to finished PDF. This skill does NOT build content itself — it plans, delegates, verifies, and assembles.

**Skills called by this orchestrator:**
- `econ-textbook-paragraph` → builds each theory paragraph (§1–§3)
- `econ-consolidation-builder` → builds the consolidation paragraph (§4)
- `econ-testprep-builder` → builds test preparation paragraphs (Chapter 5: §1–§4)
- `econ-chapter-assembler` → wraps all paragraphs into a chapter PDF
- `econ-paragraph-review` → independent QC review per paragraph
- `econ-quality-control` → generates quality_ref per paragraph

**Workflow documents:**
- `BUILD-CHAPTER.md` → the step-by-step process this skill follows
- `BUILD-PARAGRAPH.md` Part A → the textbook build process each paragraph sub-agent follows (Part B is the platform pipeline — separate, not used by this skill)

**Reference standards (sub-agents must comply):**
- `references/authored/didactiek-principes.md` → didactical principles (source of truth)
- `references/authored/economic_mathematical_precision_reference.md` → precision rules
- `references/authored/economie-terminologie.md` → canonical Dutch terms
- `references/external/amstelveencollege_quality_standards.md` → school-fit overlay

---

## PART 1: INPUT AND FOLDER STRUCTURE

### 1.1 Required input

1. **Blueprint chapter spec** — the chapter section from the course blueprint (e.g., `course_blueprint_v3.md`). Contains: paragraph titles, target exercises, lesson goals, difficulty notes.
2. **Output folder** — the parent folder where the chapter folder will be created (e.g., `module test/`)
3. **Chapter number** — X.Y format (e.g., 1.3)

Optional:
- Prior chapter context — if this is not the first chapter, a brief summary of what students already know
- Specific conventions — notation, colour palette, shared contexts decided by the teacher

### 1.2 Folder hierarchy (MANDATORY)

All paragraph folders go **inside** the chapter folder, and the chapter folder
goes **inside** its book folder at
`<lessen-root>/Boek N - <title>/`. Never create paragraph folders alongside the
chapter folder. Never create chapter folders at the lessen-root.

Chapter 1.Y belongs to Boek 1, chapter 2.Y to Boek 2, etc. Look up the book
title in `build-scripts/books/book-manifests/book-N.json`.

```
<lessen-root>/Boek N - <title>/                  ← book folder
  X.Y Hoofdstuk [Name]/                          ← chapter folder (inside book)
    X.Y.1 [Paragraph 1 name]/                    ← paragraph folder (inside chapter)
      X.Y.1 [Name] – paragraaf.md
      X.Y.1 [Name] – opgaven.md
      X.Y.1 [Name] – antwoorden.md
      X.Y.1 [Name] – paragraaf.pdf
      X.Y.1 [Name] – opgaven.pdf
      X.Y.1 [Name] – antwoorden.pdf
      build_pdf.py
      _assets/
        X.Y.1_fig_1.svg + .png
        X.Y.1_ex_1.svg + .png
        ...
    X.Y.2 [Paragraph 2 name]/
      ...
    X.Y.3 [Paragraph 3 name]/
      ...
    X.Y.4 Gemengde opgaven/                       ← consolidation
      X.Y.4 Gemengde opgaven – opgaven.md
      X.Y.4 Gemengde opgaven – antwoorden.md
      ...
    _assets/                                      ← chapter-level (collected from all paragraphs)

Test preparation chapter (Chapter 5) has a different layout:

  X.5 Hoofdstuk Toetsvoorbereiding/
    X.5.1 Actieve samenvatting/
      X.5.1 Actieve samenvatting – samenvatting.md
      X.5.1 Actieve samenvatting – antwoorden.md
      build_pdf.py + _assets/
    X.5.2 Examenvaardigheden/
      X.5.2 Examenvaardigheden – opgaven.md
      X.5.2 Examenvaardigheden – antwoorden.md
      build_pdf.py + _assets/
    X.5.3 Integratieoefening/
      X.5.3 Integratieoefening – opgaven.md
      X.5.3 Integratieoefening – antwoorden.md
      build_pdf.py + _assets/
    X.5.4 Proeftoets/
      X.5.4 Proeftoets – toets.md
      X.5.4 Proeftoets – antwoorden.md
      X.5.4 Proeftoets – toetsmatrijs.md
      build_pdf.py + _assets/
    _assets/
    X.Y [Name] – hoofdstuk.md
    X.Y [Name] – hoofdstuk.html
    X.Y [Name] – hoofdstuk.pdf
    X.Y [Name] – antwoorden.md
    X.Y [Name] – antwoorden.html
    X.Y [Name] – antwoorden.pdf
    build_chapter.py
    _chapter-plan.md
```

### 1.3 Naming rules

| Element | Convention | Example |
|---------|-----------|---------|
| Chapter folder | `X.Y Hoofdstuk [Name]` | `1.3 Hoofdstuk Aanbod en kosten` |
| Paragraph folder | `X.Y.Z [Name]` — must match file prefix | `1.3.2 Kostenstructuren` |
| Main files | `X.Y.Z [Name] – <type>.<ext>` with en-dash (–) | `1.3.2 Kostenstructuren – paragraaf.md` |
| Chapter files | `X.Y [Name] – <type>.<ext>` (no "Hoofdstuk") | `1.3 Aanbod en kosten – hoofdstuk.pdf` |
| Assets | `X.Y.Z_{type}_{number}.{svg\|png}` | `1.3.2_fig_1.svg` |

**The folder name must exactly match the file prefix.** If files say `1.2.3 Van individuele naar collectieve vraag – paragraaf.md`, the folder must be `1.2.3 Van individuele naar collectieve vraag`, not `1.2.3 Collectieve vraag`.

### 1.4 build_chapter.py path rule

In `build_chapter.py`, paragraph folders are referenced relative to the chapter folder (same directory), NOT from the parent:

```python
BASE = Path(__file__).parent          # chapter folder
MODULE = BASE                         # paragraphs are INSIDE the chapter folder
# NOT: MODULE = BASE.parent           # WRONG — this would look outside the chapter
```

---

## PART 2: PLANNING PHASE

Before building anything, analyse the blueprint and produce a chapter plan.

### 2.1 List paragraphs

Extract all paragraphs from the blueprint:
- Standard theory chapter: §X.Y.1 (theory), §X.Y.2 (theory), §X.Y.3 (theory), §X.Y.4 (consolidation)
- Exception: Book 1 Chapter 4 has §X.Y.1–§X.Y.4 (theory) + §X.Y.5 (consolidation)
- Test preparation chapter (Chapter 5): §X.5.1 (active summary), §X.5.2 (exam skills), §X.5.3 (integration), §X.5.4 (practice test)

### 2.2 Analyse dependencies

For each paragraph, check whether it references content from a prior paragraph in the same chapter:

| Dependency type | Example | Build order |
|---|---|---|
| No dependency | §1.2.1 (individual demand) and §1.2.2 (demand factors) teach independent concepts | Parallel |
| Shared context | §1.3.3 (revenue) uses "the bakery from §1.3.2" with specific CK/VK values | Sequential: §2 before §3 |
| Conceptual prerequisite | §1.3.2 (cost structures) needed to understand §1.3.3 (revenue = TO − TK) | Sequential: §2 before §3 |
| Always last | Consolidation (§4) combines skills from all theory paragraphs | After all theory |

**Default rules:**
- §1 can always start immediately (no in-chapter dependencies)
- §4 (consolidation) always goes last
- Between §1, §2, §3: read the blueprint difficulty notes for explicit references

### 2.3 Determine build order

Group paragraphs into **build waves**:

```
Wave 1: paragraphs with no dependencies (build in parallel)
Wave 2: paragraphs that depend on Wave 1 (build in parallel within wave)
Wave 3: consolidation (always last, depends on all theory)
```

Common patterns for theory chapters:
- **All independent:** Wave 1 = {§1, §2, §3}, Wave 2 = {§4}
- **Chain §2→§3:** Wave 1 = {§1, §2}, Wave 2 = {§3}, Wave 3 = {§4}
- **Full chain:** Wave 1 = {§1}, Wave 2 = {§2}, Wave 3 = {§3}, Wave 4 = {§4}

**Test preparation chapter (Chapter 5):** Fixed build order:
- Wave 1: §1 (active summary) — always first: establishes review foundation, catches knowledge gaps
- Wave 2: §2 (exam skills) — uses summary as reference, trains answer craft
- Wave 3: §3 (integration) + §4 (practice test) — can be parallel: §3 is cross-chapter synthesis, §4 is exam simulation

### 2.4 Cross-paragraph conventions

Before any building starts, decide and document:

1. **Shared contexts** — if multiple paragraphs use the same company/scenario (e.g., "the bakery"), fix the numbers upfront: CK = €500, VK/stuk = €0,80, P = €1,50. All sub-agents receive these.
2. **Notation** — variable names (Q_v, Q_a, TK, TO, MK, MO), subscript style, function notation
3. **Graph colours** — which colour = which concept. Must be consistent across all paragraphs:
   - Demand: #1A5276 (blue)
   - Supply: #27AE60 (green)
   - TK/TCK: #E67E22 (orange)
   - TO: #1A5276 (blue)
   - GTK: #8E44AD (purple)
4. **Interleaving plan** — which earlier skills each paragraph should revisit in its "Herhaling" section. Spread interleaving across paragraphs; don't repeat the same skill in every paragraph.
5. **Dual coding plan** — for each paragraph, list which key concepts require graph support. Identify visuals that should be shared or consistent across paragraphs (e.g., a supply/demand graph that appears in §1 and is extended in §2). Every concept that is explained in text must also have a visual representation — this is non-negotiable (see AGENTS.md Design Principles).
6. **Procedure plan** — for each paragraph, list the key skills and their canonical step sequences. If §1 teaches "step 1: stel Qa = Qv, step 2: los op naar P, step 3: vul terug in", then §2 must use those exact same steps when revisiting equilibrium calculation. The procedure is the constant; context/numbers change. This ensures unified student experience across paragraphs.
7. **Precision standards** — all paragraphs must adhere to `references/authored/economic_mathematical_precision_reference.md`. Ensure consistent use of: individual vs market-level language, ceteris paribus framing on curve introductions, units on all axis labels, movement vs shift vocabulary, formula domain restrictions at first presentation, cost terminology (TK ≠ GTK ≠ MK), and text-graph-table-formula number matching.
8. **School-fit overlay** — all paragraphs must satisfy `references/external/amstelveencollege_quality_standards.md`: explicit leerdoelen, formative checkpoints, layered differentiation (support without separate tracks), meaningful context for concept transfer, learner self-monitoring prompts. This overlay adjusts emphasis, not structure.

When running Part B (platform build) later, these plans feed into the full `_paragraph-plan.md` with visuelen-toewijzing and procedure-stappen-plan. For Part A (textbook only), enforce dual coding and unified experience through the content itself — every theory section pairs text with graphs, every worked example uses the same procedure as the exercises.

### 2.5 Write the chapter plan

Save a brief plan document in the output folder as `_chapter-plan.md`:

```markdown
# Chapter Plan: X.Y [Title]

## Build order
- Wave 1 (parallel): §X.Y.1 [title], §X.Y.2 [title]
- Wave 2 (sequential after Wave 1): §X.Y.3 [title]
- Wave 3 (after all theory): §X.Y.4 Consolidatie

## Dependencies
- §X.Y.3 uses the bakery context from §X.Y.2 (CK=500, VK=0.80, P=1.50)

## Shared conventions
- Notation: TK, TCK, TVK, GTK, GVK, GCK, TO, GO
- Colours: TK=#E67E22, TO=#1A5276, supply=#27AE60
- Shared context: bakkerij (CK=€500, VK=€0,80/brood, P=€1,50/brood)

## Interleaving plan
- §X.Y.1: herhaling from §X.(Y-1).2, §X.(Y-1).3
- §X.Y.2: herhaling from §X.Y.1, §X.(Y-1).1
- §X.Y.3: herhaling from §X.Y.1, §X.Y.2

## Dual coding plan
- §X.Y.1: fig_1 (demand only), fig_2 (+ supply), fig_3 (equilibrium), fig_4 (overview)
- §X.Y.2: reuses equilibrium graph from §X.Y.1, adds shift arrows
- §X.Y.3: new cost/revenue graphs, independent from §1-2
- Every theory concept has a paired visual — no text-only explanations

## Procedure plan (unified experience)
- Equilibrium calculation: (1) stel Qa = Qv, (2) los op naar P, (3) vul terug in, (4) controleer
  → used in §X.Y.1 theory, §X.Y.1 exercises, §X.Y.2 when recalculating after shifts
- [repeat for each key skill in the chapter]
```

---

## PART 3: BUILDING PARAGRAPHS

### 3.1 Delegation rules

Each paragraph is built by a **separate sub-agent**. The orchestrator provides:

1. The blueprint paragraph spec (target exercise, lesson goals, difficulty notes)
2. The shared conventions from Part 2
3. Context from prior paragraphs (if sequential) — key formulas, terminology, context details
4. Explicit instruction — differs by paragraph type:
   - **Theory paragraphs (§1–§3, or §1–§4 for Ch4):** "Follow `BUILD-PARAGRAPH.md` Part A steps A1–A5. Use `econ-textbook-paragraph` for content. Produce ALL deliverables: paragraaf.md, opgaven.md, antwoorden.md, all SVG+PNG assets in `_assets/`, build_pdf.py, and all PDFs (paragraaf.pdf, opgaven.pdf, antwoorden.pdf). Run the A5 asset completeness gate before returning."
   - **Consolidation paragraph (last §):** "Follow `BUILD-PARAGRAPH.md` Part A steps A1–A5. Use `econ-consolidation-builder` for content. Produce ALL deliverables: opgaven.md, antwoorden.md, all SVG+PNG assets in `_assets/`, build_pdf.py, and PDFs (opgaven.pdf, antwoorden.pdf). No paragraaf.md — consolidation has no theory. Run the A5 asset completeness gate before returning."
   - **Test prep paragraphs (Chapter 5, §1–§4):** "Follow `BUILD-PARAGRAPH.md` Part A steps A1–A5. Use `econ-testprep-builder` for content. No new theory. Produce deliverables per type:
     - §1 (Actieve samenvatting): samenvatting.md + antwoorden.md + PDFs + _assets/ + build_pdf.py
     - §2 (Examenvaardigheden): opgaven.md + antwoorden.md + PDFs + _assets/ + build_pdf.py
     - §3 (Integratieoefening): opgaven.md + antwoorden.md + PDFs + _assets/ + build_pdf.py
     - §4 (Proeftoets): toets.md + antwoorden.md + toetsmatrijs.md + PDFs + _assets/ + build_pdf.py
     Run the A5 asset completeness gate before returning."

**Important:** Do NOT ask paragraph sub-agents to produce review.md or quality-ref.yaml. A sub-agent cannot independently review its own work. The orchestrator handles QC in Part 4 after all paragraphs are built.

The sub-agent prompt must include:
- The full blueprint spec for that paragraph
- The shared conventions document
- For sequential builds: a summary of what the prior paragraph established
- The instruction to follow `BUILD-PARAGRAPH.md` Part A (steps A1–A5) with the correct content skill
- The instruction that ALL content deliverables for that type are mandatory (md + pdf + assets + build script)

### 3.2 Completeness verification after each paragraph

After each sub-agent returns, the orchestrator runs these checks before proceeding.

**For theory paragraphs (§1–§3, or §1–§4 for Ch4):**

```
Required files:
  □ X.Y.Z [Name] – paragraaf.md
  □ X.Y.Z [Name] – opgaven.md
  □ X.Y.Z [Name] – antwoorden.md
  □ X.Y.Z [Name] – paragraaf.pdf   (>10KB)
  □ X.Y.Z [Name] – opgaven.pdf     (>10KB)
  □ X.Y.Z [Name] – antwoorden.pdf  (>10KB)
  □ build_pdf.py
  □ _assets/ folder exists
```

**For the consolidation paragraph (last §):**

```
Required files:
  □ X.Y.Z Gemengde opgaven – opgaven.md
  □ X.Y.Z Gemengde opgaven – antwoorden.md
  □ X.Y.Z Gemengde opgaven – opgaven.pdf    (>10KB)
  □ X.Y.Z Gemengde opgaven – antwoorden.pdf (>10KB)
  □ build_pdf.py
  □ _assets/ folder exists
  (No paragraaf.md/pdf — consolidation has no theory section)
```

**For test prep §1 (Actieve samenvatting):**

```
Required files:
  □ X.5.1 Actieve samenvatting – samenvatting.md
  □ X.5.1 Actieve samenvatting – antwoorden.md
  □ X.5.1 Actieve samenvatting – samenvatting.pdf   (>10KB)
  □ X.5.1 Actieve samenvatting – antwoorden.pdf     (>10KB)
  □ build_pdf.py
  □ _assets/ folder exists
  (No paragraaf.md — test prep has no theory)
```

**For test prep §2 (Examenvaardigheden) and §3 (Integratieoefening):**

```
Required files:
  □ X.5.Z [Name] – opgaven.md
  □ X.5.Z [Name] – antwoorden.md
  □ X.5.Z [Name] – opgaven.pdf    (>10KB)
  □ X.5.Z [Name] – antwoorden.pdf (>10KB)
  □ build_pdf.py
  □ _assets/ folder exists
  (No paragraaf.md — test prep has no theory)
```

**For test prep §4 (Proeftoets):**

```
Required files:
  □ X.5.4 Proeftoets – toets.md
  □ X.5.4 Proeftoets – antwoorden.md
  □ X.5.4 Proeftoets – toetsmatrijs.md
  □ X.5.4 Proeftoets – toets.pdf         (>10KB)
  □ X.5.4 Proeftoets – antwoorden.pdf    (>10KB)
  □ X.5.4 Proeftoets – toetsmatrijs.pdf  (>10KB)
  □ build_pdf.py
  □ _assets/ folder exists
```

**Asset checks (all types):**

```
  □ Every ![...] reference in .md files → file exists in _assets/
  □ Every .svg has a matching .png
  □ Asset names follow X.Y.Z_{type}_{number} convention
  □ No orphaned assets
```

**If anything fails → send the sub-agent back** with specific instructions about what's missing. Do not proceed to the next wave.

### 3.3 Sequential context handoff (with inter-wave QC)

When building sequentially, after completing paragraph N and before starting paragraph N+1:

1. Read the completed paragraaf.md
2. Extract: key definitions, formulas, context details (company name, numbers), notation
3. **Run a lightweight QC check on the completed paragraph** — spawn a review sub-agent for Pass 0 (asset integrity) and Pass 2 (mathematical precision) only. This catches notation errors, formula mistakes, and broken assets BEFORE they propagate into the next paragraph. Save as `X.Y.Z-review.md`.
4. If the review finds FAIL items in Pass 2 (e.g., wrong formula, notation mismatch with chapter conventions), fix them before proceeding. This is critical — a slope error in §2 will be carried into §3's exercises.
5. Include the verified summary in the prompt for paragraph N+1
6. The next paragraph's herhaling box and forward references should connect naturally

**Why inter-wave QC matters:** In a sequential build (e.g., §1→§2→§3), content from §1 feeds into §2's context. If §1 has a notation error or a wrong formula, §2 will inherit it, and §3 will inherit it from §2. Running QC between waves catches errors at the source instead of after they've spread to 3 paragraphs.

For parallel waves (e.g., §1 and §3 built simultaneously), inter-wave QC is not needed — they don't share context. The full Part 4 QC runs after all waves complete.

---

## PART 4: QC REVIEW

After ALL paragraphs are built and verified (Part 3), the **orchestrator** runs QC. This is not delegated to the paragraph builders — they cannot review their own work.

### 4.1 Per-paragraph review (independent sub-agents)

For **each paragraph** (theory AND consolidation), spawn a separate review sub-agent:

> "You are a QC reviewer. You did NOT build this paragraph. Read the `econ-paragraph-review` skill at `skills/econ-paragraph-review.md`. Then review the paragraph at [path].
> Run Pass 0 (asset integrity), Pass 1 (didactic architecture), Pass 2 (mathematical precision).
> Report ALL issues with PASS/FLAG/FAIL ratings. Do not fix anything — only report.
> Save your report as `X.Y.Z-review.md` in the paragraph folder."

**This applies to consolidation paragraphs too.** The consolidation builder skill does not include QC steps — that is intentional. QC for consolidation is handled here by the chapter orchestrator, using the same `econ-paragraph-review` process (Pass 0 asset check + Pass 2 mathematical precision; Pass 1 didactic checks apply where relevant).

Fix any FAIL items before proceeding. The orchestrator sends fixes back to the original builder sub-agent or fixes them directly.

### 4.1b Quality_ref generation (independent sub-agents)

For **each paragraph** (theory AND consolidation), spawn a sub-agent:

> "Read the `econ-quality-control` skill. Inventory all components that actually exist for this paragraph (check file existence, not just intent). Run asset integrity checks. Generate `X.Y.Z-quality-ref.yaml` in the paragraph folder. Be honest about gaps."

This produces the quality_ref YAML required by the completeness gate.

### 4.2 Chapter-level consistency (independent sub-agent)

Spawn a chapter-level reviewer with these inputs:
> "You are a chapter-level reviewer. Read the following files for chapter X.Y:
> 1. `_chapter-plan.md` — shared conventions, interleaving plan, build order
> 2. The blueprint chapter spec (from the course blueprint)
> 3. All paragraph paragraaf.md and opgaven.md files
> 4. All SVG files in each paragraph's `_assets/` folder (for colour checks)
>
> Check the following and report PASS/FLAG/FAIL for each:
> - Notation consistency across paragraphs
> - Figure numbering (no gaps within each paragraph)
> - Forward/backward references match (summary → next paragraph, herhaling → prior paragraph)
> - Consolidation covers skills from ALL theory paragraphs
> - No unintentional context reuse across paragraphs
> - Colour consistency in SVGs (same concept = same colour)
> - **Dual coding**: every theory concept in every paragraph has a paired visual (graph, diagram, or table). FLAG any text-only concept explanations.
> - **Procedure consistency**: when the same skill appears in multiple paragraphs (e.g., equilibrium calculation), verify the step sequence is identical. Check worked examples and exercises use the same procedure as the theory section. FLAG any procedure mismatches across paragraphs.
>
> Note: leerdoelen coverage will be checked post-assembly against the front page."

See `BUILD-CHAPTER.md` Phase 4 for the full checklist.

### 4.3 QC artifact verification

After Parts 4.1, 4.1b, and 4.2, verify QC artifacts for each paragraph. **Check content, not just existence.**

```
Per paragraph:
  □ X.Y.Z-review.md exists
  □ X.Y.Z-review.md contains no unresolved FAIL items (grep for "FAIL" — all should be fixed)
  □ X.Y.Z-quality-ref.yaml exists
  □ quality_ref.assets.missing is empty ([])
  □ quality_ref.assets.svgpng_paired is true
  □ quality_ref.assets.naming_compliant is true
  □ quality_ref.assets.total_referenced == quality_ref.assets.total_present
  □ quality_ref has a Generated date (not stale — should match current build)
```

A quality_ref that exists but reports missing assets, unpaired SVGs, or naming violations is **invalid** — the gate fails. Go back and fix the underlying issues, then regenerate the quality_ref.

---

## PART 5: CHAPTER ASSEMBLY

Follow `econ-chapter-assembler` skill exactly:

1. Generate front page as raw HTML in `<div class="chapter-front">`
   - Order: title → table of contents → leerdoelen → catchy intro headline
   - All at 11pt font (same as body text)
2. Collect assets from all paragraphs into chapter `_assets/`
3. Concatenate markdown with page breaks
4. Rewrite asset paths (`_assets/` in each paragraph → `_assets/` in chapter)
5. Create `build_chapter.py` (WeasyPrint, strip Pandoc defaults, exercise wrapping skips front page)
6. Build chapter PDF + answer booklet PDF
7. Run final asset verification: 0 broken refs in assembled .md files

---

## PART 6: COMPLETENESS GATE

**Do not declare the chapter complete until ALL of the following are verified:**

### Step 1: Run the automated validator

```bash
node scripts/validate-chapter.js "<path-to-chapter-folder>"
```

This checks all of the following automatically:
- Per theory paragraph: 3 .md + 3 .pdf (>10KB) + build_pdf.py + _assets/ with SVG+PNG pairs
- Per consolidation paragraph: 2 .md + 2 .pdf (>10KB) + build_pdf.py + _assets/
- Per test prep paragraph: type-specific .md + .pdf counts (see Part 3.2) + build_pdf.py + _assets/
- Asset naming follows `X.Y.Z_{type}_{number}` convention
- Every image reference in .md resolves to a file in _assets/
- No orphaned assets
- Paragraph folders inside chapter folder (correct hierarchy)
- Chapter assembly files exist (hoofdstuk.md/.pdf, antwoorden.md/.pdf, build_chapter.py)
- Chapter PDF > 500KB (images embedded)
- build_chapter.py uses MODULE = BASE (not BASE.parent)

**The validator must pass with 0 errors.**

### Step 2: Manual checks (not automatable)

| Check | Method |
|---|---|
| Front page fits on one page | Open PDF, visual check |
| QC artifacts exist per paragraph | `X.Y.Z-review.md` + `X.Y.Z-quality-ref.yaml` (validator warns if missing) |

**Only after both steps pass can the chapter be reported as complete.**

---

## DECISION CHECKLIST

1. □ Blueprint chapter spec read and understood
2. □ Chapter plan written (`_chapter-plan.md`) with build order, dependencies, conventions
3. □ All theory paragraphs built via `econ-textbook-paragraph` (sub-agents)
4. □ Consolidation paragraph built via `econ-consolidation-builder` (sub-agent)
4b. □ Test prep paragraphs built via `econ-testprep-builder` (sub-agents, Chapter 5 only)
5. □ Each paragraph passed completeness verification (Part 3.2)
6. □ Independent QC review per paragraph (Part 4.1, sub-agents)
7. □ Chapter-level consistency review (Part 4.2, sub-agent)
8. □ All FAIL items fixed
9. □ Chapter assembled via `econ-chapter-assembler`
10. □ Final completeness gate passed (Part 6)
11. □ Chapter reported as complete

---

*This skill orchestrates chapter production. For individual paragraph specs, see `econ-textbook-paragraph`. For consolidation exercises, see `econ-consolidation-builder`. For chapter assembly, see `econ-chapter-assembler`. For the step-by-step workflow, see `BUILD-CHAPTER.md`.*
