---
name: econ-chapter-builder
description: "End-to-end chapter production: reads the blueprint, plans paragraph progression, builds each paragraph via econ-textbook-paragraph, runs QC, and assembles into a chapter PDF via econ-chapter-assembler. Use when building a complete chapter from scratch. Trigger when the user mentions hoofdstuk bouwen, chapter build, build chapter, alle paragrafen maken, or complete chapter from blueprint. This is the top-level orchestrator — it calls econ-textbook-paragraph for each paragraph, econ-consolidation-builder for §4, and econ-chapter-assembler for final assembly."
---

# Economics Chapter Builder

End-to-end orchestrator for building a complete textbook chapter from blueprint to finished PDF. This skill does NOT build content itself — it plans, delegates, verifies, and assembles.

**Skills called by this orchestrator:**
- `econ-textbook-paragraph` → builds each theory paragraph (§1–§3)
- `econ-consolidation-builder` → builds the consolidation paragraph (§4)
- `econ-chapter-assembler` → wraps all paragraphs into a chapter PDF
- `econ-paragraph-review` → independent QC review per paragraph
- `econ-quality-control` → generates quality_ref per paragraph

**Workflow documents:**
- `BUILD-CHAPTER.md` → the step-by-step process this skill follows
- `BUILD-PARAGRAPH.md` → the process each paragraph sub-agent follows

---

## PART 1: INPUT

Required:
1. **Blueprint chapter spec** — the chapter section from the course blueprint (e.g., `course_blueprint_v3.md`). Contains: paragraph titles, target exercises, lesson goals, difficulty notes.
2. **Output folder** — where to save all output (e.g., `module test/`)
3. **Chapter number** — X.Y format (e.g., 1.3)

Optional:
- Prior chapter context — if this is not the first chapter, a brief summary of what students already know
- Specific conventions — notation, colour palette, shared contexts decided by the teacher

---

## PART 2: PLANNING PHASE

Before building anything, analyse the blueprint and produce a chapter plan.

### 2.1 List paragraphs

Extract all paragraphs from the blueprint:
- Standard chapter: §X.Y.1 (theory), §X.Y.2 (theory), §X.Y.3 (theory), §X.Y.4 (consolidation)
- Exception: Book 1 Chapter 4 has §X.Y.1–§X.Y.4 (theory) + §X.Y.5 (consolidation)

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

Common patterns:
- **All independent:** Wave 1 = {§1, §2, §3}, Wave 2 = {§4}
- **Chain §2→§3:** Wave 1 = {§1, §2}, Wave 2 = {§3}, Wave 3 = {§4}
- **Full chain:** Wave 1 = {§1}, Wave 2 = {§2}, Wave 3 = {§3}, Wave 4 = {§4}

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
```

---

## PART 3: BUILDING PARAGRAPHS

### 3.1 Delegation rules

Each paragraph is built by a **separate sub-agent**. The orchestrator provides:

1. The blueprint paragraph spec (target exercise, lesson goals, difficulty notes)
2. The shared conventions from Part 2
3. Context from prior paragraphs (if sequential) — key formulas, terminology, context details
4. Explicit instruction: **"Follow the `econ-textbook-paragraph` skill exactly. You must produce ALL deliverables: paragraaf.md, opgaven.md, antwoorden.md, all SVG+PNG assets in `_assets/`, build_pdf.py, and all PDFs (paragraaf.pdf, opgaven.pdf, antwoorden.pdf)."**

The sub-agent prompt must include:
- The full blueprint spec for that paragraph
- The shared conventions document
- For sequential builds: a summary of what the prior paragraph established
- The instruction to follow `econ-textbook-paragraph` skill
- The instruction that ALL deliverables are mandatory — the paragraph is not complete without PDFs and graphs

### 3.2 Completeness verification after each paragraph

After each sub-agent returns, the orchestrator runs these checks before proceeding:

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

Asset checks:
  □ Every ![...] reference in .md files → file exists in _assets/
  □ Every .svg has a matching .png
  □ Asset names follow B{X}C{Y}S{Z}_{type}_{number} convention
  □ No orphaned assets
```

**If anything fails → send the sub-agent back** with specific instructions about what's missing. Do not proceed to the next wave.

### 3.3 Sequential context handoff

When building sequentially, after completing paragraph N:
1. Read the completed paragraaf.md
2. Extract: key definitions, formulas, context details (company name, numbers), notation
3. Include this summary in the prompt for paragraph N+1
4. The next paragraph's herhaling box and forward references should connect naturally

---

## PART 4: QC REVIEW

After ALL paragraphs are built and verified:

### 4.1 Per-paragraph review (independent sub-agents)

For each paragraph, spawn a review sub-agent:
> "You are a QC reviewer. You did NOT build this paragraph. Read `econ-paragraph-review`, then review the paragraph at [path]. Run Pass 0 (asset integrity), Pass 1 (didactic), Pass 2 (mathematical). Report all issues."

Fix any FAIL items before proceeding.

### 4.2 Chapter-level consistency (independent sub-agent)

Spawn a chapter-level reviewer:
> "Read all paragraph .md files for chapter X.Y. Check: notation consistency, leerdoelen coverage, figure numbering, forward/backward references, consolidation coverage, context reuse, colour consistency in SVGs."

See `BUILD-CHAPTER.md` Phase 4 for the full checklist.

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

### Per paragraph (×3 theory + ×1 consolidation):

| Check | Method |
|---|---|
| 3 .md files exist (paragraaf, opgaven, antwoorden) | ls |
| 3 .pdf files exist, each >10KB | ls + file size check |
| build_pdf.py exists | ls |
| _assets/ has SVG+PNG pairs | count + pair check |
| 0 broken image refs | grep refs → verify existence |
| Asset naming convention followed | regex check on filenames |

### Chapter level:

| Check | Method |
|---|---|
| hoofdstuk.md + .html + .pdf exist | ls |
| antwoorden.md + .html + .pdf exist | ls |
| build_chapter.py exists | ls |
| Chapter PDF >500KB (images embedded) | file size check |
| 0 broken image refs in assembled .md | grep → verify |
| Front page fits on one page | visual check |

**Only after every check passes can the chapter be reported as complete.**

---

## DECISION CHECKLIST

1. □ Blueprint chapter spec read and understood
2. □ Chapter plan written (`_chapter-plan.md`) with build order, dependencies, conventions
3. □ All theory paragraphs built via `econ-textbook-paragraph` (sub-agents)
4. □ Consolidation paragraph built via `econ-consolidation-builder` (sub-agent)
5. □ Each paragraph passed completeness verification (Part 3.2)
6. □ Independent QC review per paragraph (Part 4.1, sub-agents)
7. □ Chapter-level consistency review (Part 4.2, sub-agent)
8. □ All FAIL items fixed
9. □ Chapter assembled via `econ-chapter-assembler`
10. □ Final completeness gate passed (Part 6)
11. □ Chapter reported as complete

---

*This skill orchestrates chapter production. For individual paragraph specs, see `econ-textbook-paragraph`. For consolidation exercises, see `econ-consolidation-builder`. For chapter assembly, see `econ-chapter-assembler`. For the step-by-step workflow, see `BUILD-CHAPTER.md`.*
