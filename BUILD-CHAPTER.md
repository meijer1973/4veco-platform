# Build Chapter — End-to-End Workflow

Builds a complete chapter from blueprint to finished PDF. Two parts:
- **Part A** — Build all paragraphs (follows `econ-chapter-builder` skill)
- **Part B** — Assemble into chapter PDF and run QC (follows `econ-chapter-assembler` skill)

---

## Part A: Paragraph Production

Follow the `econ-chapter-builder` skill for the full orchestration process:

1. **Plan** — read blueprint, analyse dependencies, determine build order (parallel vs sequential), set cross-paragraph conventions (shared contexts, notation, colours, interleaving targets). Save as `_chapter-plan.md`.
2. **Build** — delegate each paragraph to a sub-agent that follows `econ-textbook-paragraph` exactly. Each sub-agent must produce ALL deliverables: 3 .md files, 3 .pdf files, build_pdf.py, _assets/ with SVG+PNG pairs.
3. **Verify** — after each sub-agent returns, run completeness check. If anything missing, send back.
4. **QC** — independent sub-agent review per paragraph (Pass 0 + Pass 1 + Pass 2 from `econ-paragraph-review`).

See `econ-chapter-builder` skill for detailed instructions on dependency analysis, delegation prompts, and completeness gates.

---

## Part B: Assembly and QC

### Phase 1: Pre-assembly gate (5 min)

For each paragraph in the chapter, verify:

1. □ Paragraph `.md` files exist (paragraaf/opgaven + antwoorden)
2. □ `_assets/` folder exists with SVG + PNG pairs
3. □ Asset completeness: extract all image refs from `.md` files → every referenced file exists in `_assets/`
4. □ Review report exists (Phase 5b of BUILD-PARAGRAPH.md was completed by a sub-agent)
5. □ `quality_ref` YAML exists (Phase 5c of BUILD-PARAGRAPH.md was completed by a sub-agent)

**If any paragraph fails this gate → go back and complete that paragraph first.**

---

## Phase 2: Assembly (5 min)

Follow `econ-chapter-assembler` skill:

1. Generate front page as raw HTML in `<div class="chapter-front">` (title → TOC → leerdoelen → catchy intro)
2. Concatenate: front_page + page-breaks + paragraph .md files
3. Rewrite asset paths to point to chapter `_assets/`
4. Collect all paragraph assets into chapter `_assets/` folder
5. Assemble answer booklet separately

---

## Phase 3: Asset verification (2 min)

After assembly, re-verify assets in the chapter context:

1. □ Extract all image refs from assembled chapter `.md` → verify each file exists in chapter `_assets/`
2. □ Extract all image refs from assembled antwoorden `.md` → same check
3. □ Every `.svg` in chapter `_assets/` has a matching `.png`
4. □ All assets follow naming convention `X.Y.Z_{type}_{number}.{ext}`
5. □ All assets share the correct `X.Y` prefix for this chapter
6. □ No stale references (no asset prefix from a different chapter)

**0 errors required before proceeding.**

---

## Phase 4: Cross-paragraph consistency (INDEPENDENT SUB-AGENT — 10 min)

These checks only make sense at the chapter level. Must be run by a sub-agent that did not build the paragraphs.

> Spawn a sub-agent: "You are a chapter-level reviewer. Read all paragraph .md files for chapter [X.Y]. Check the following and report PASS/FLAG/FAIL for each."

| Check | What to look for |
|-------|-----------------|
| 4.1 Notation consistency | Variable names (Q_v, Q_a, P*, TK, TO, etc.) used identically across all paragraphs. FLAG if notation differs. |
| 4.2 Leerdoelen coverage | Every goal on the front page is addressed in at least one paragraph's theory section AND practised in exercises. FLAG gaps. |
| 4.3 Figure numbering | Each paragraph restarts figure numbering at 1. Verify no paragraph skips a number (e.g., Fig 1, 2, 4 — missing 3). FAIL if gaps. |
| 4.4 Forward/backward references | Each paragraph's forward pointer (in summary box) matches the next paragraph's topic. Each herhaling box accurately references the prior paragraph. FLAG mismatches. |
| 4.5 Consolidation coverage | The consolidation paragraph (§X.Y.4) references skills from ALL theory paragraphs, not just one. FLAG if any theory paragraph is under-represented. |
| 4.6 Context reuse | No exercise context (company name, product) is reused across paragraphs (except deliberate continuation like the bakery in §1.3.2/§1.3.3). FLAG unintentional reuse. |
| 4.7 Colour consistency in graphs | SVG files use the same colours for the same concepts across paragraphs (e.g., supply always green, TK always orange). FLAG inconsistencies. |

---

## Phase 5: Build PDF (5 min)

Only after Phase 4 passes:

1. Run `build_chapter.py` with WeasyPrint (prepend `C:/msys64/mingw64/bin` to PATH)
2. Verify PDF file sizes are non-trivial (chapter PDF should be >500KB with embedded images)
3. Open PDF — visual check:
   - Front page fits on one page
   - All images render (no broken image placeholders)
   - Page breaks between paragraphs
   - No orphaned headers at page bottoms
   - Exercise formatting intact

---

## Phase 6: Automated validation

Run the chapter validator:

```bash
node scripts/validate-chapter.js "<path-to-chapter-folder>"
```

This checks:
- Paragraph folders inside chapter folder (correct hierarchy)
- Per paragraph: required .md and .pdf files exist (theory vs consolidation)
- Per paragraph: build_pdf.py exists, _assets/ has SVG+PNG pairs
- Asset naming follows `X.Y.Z_{type}_{number}` convention
- Every image reference resolves to a file
- No orphaned assets
- Chapter assembly files exist (hoofdstuk.md/.pdf, antwoorden.md/.pdf, build_chapter.py)
- Chapter PDF > 500KB (images embedded)
- build_chapter.py uses correct path (MODULE = BASE)
- No paragraph folders at parent level

**The chapter is not done until the validator passes with 0 errors.**

## Phase 7: Final checklist

| # | Check | Status |
|---|-------|--------|
| 1 | `validate-chapter.js` passes with 0 errors | □ |
| 2 | Cross-paragraph consistency review completed (sub-agent) | □ |
| 3 | Front page: title, TOC, leerdoelen, catchy intro — all on one page | □ |
| 4 | Chapter PDF: images render, pages break correctly (visual check) | □ |
| 5 | Answer booklet PDF: images render, pages break correctly | □ |

**A chapter is complete when ALL items are checked. Not before.**

---

## Lessons learned

| Rule | Why |
|------|-----|
| Never declare "complete" without verifying all referenced files exist | Chapter 3 was declared complete with 23 missing SVGs — unacceptable |
| QC reviews must be run by independent sub-agents | Builder agents skip or rubber-stamp their own reviews |
| Asset verification is a hard gate, not a suggestion | Missing images in a PDF are worse than a delayed delivery |
| Front page is raw HTML, not markdown | Pandoc + exercise wrapping breaks markdown front pages |
| Strip Pandoc default stylesheet | Its padding/margins conflict with custom CSS |
| Exercise wrapping must skip `.chapter-front` div | The `</div>` injection before `<h2>` breaks the front page structure |

---

*For the orchestrator skill, see `econ-chapter-builder`. For paragraph builds, see `BUILD-PARAGRAPH.md` and `econ-textbook-paragraph`. For chapter assembly, see `econ-chapter-assembler`. For PDF export, see `econ-pdf-builder`.*
