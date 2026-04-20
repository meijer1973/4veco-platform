# Plan — `exam-questions.json` Quality Pass

Response to `knowledge/exam-questions-quality-review.md` (2026-04-20).

## TL;DR

All three findings have merit. Verified by parse:

- **349 rows total.** `question_type: 349/349` (complete), `required_skills: 322/349` (92%), `exam_codes: 146/349` (42%).
- **184 rows have `required_skills` populated but empty `exam_codes`** (review said 113 — my parse is stricter on overlap; either way the gap is large and fixable via derivation).
- **106 rows contain page-artifact strings** (`lees verder`, `N / M`), **12 contain `Bronvermelding`**, **13 contain `einde`**, **44 contain PUA glyphs**, **1 has a broken-image placeholder**.

Findings split cleanly:

- **Finding 1 is mechanical** — the extractor's `PAGE_HEADER_RE` is case-sensitive (`[vh][wa]`) but the PDFs render `HA-1022-a-…` with uppercase `HA`, so the header slips into question text on every page. Fix = flip to case-insensitive + add stop tokens for exam-end boilerplate. One commit.
- **Finding 2 is semi-mechanical** — `exam_codes` on a question can be *derived* from the union of `exam_codes` on its cited units (the catalog already has that mapping). Auto-derivation closes most of the 184-row gap without needing another audit pass.
- **Finding 3 is lower priority** — add `page` metadata for easier source verification, but doesn't block the main corpus-quality issue.

---

## Finding-by-finding evaluation

### Finding 1 — PDF-extraction noise in `text` (Critical) — **merit: full**

Root cause (confirmed by inspecting `extract-exam-questions.js:48`):

```js
const PAGE_HEADER_RE = /^[vh][wa]-1022-a-\d+-\d+-o\s+\d+ \/ \d+\s+lees verder/;
```

Case-sensitive `[vh][wa]`. PDF text output actually contains `HA-1022-a-23-1-o 3 / 10 lees verder ►►►` (uppercase `HA`), which doesn't match, so the page-header line ends up concatenated into the preceding question's `text` field. That single case bug explains the bulk of the 106 page-artifact contaminations.

Secondary leaks:
- No stop token for the end-of-exam boilerplate section (`Bronvermelding`, `einde`, `HA-1022-a-23-1-o-b*`): 12–13 rows absorb post-exam content.
- `► ► ►` arrow glyphs at end of page headers aren't stripped if the header slipped through.
- 44 PUA (private-use area) glyphs (U+E000–U+F8FF) from PDF font substitution — typically bullets or math symbols the font mapping lost.
- 1 broken-image placeholder text from PowerPoint/OOXML export: "De gekoppelde afbeelding kan niet worden weergegeven…". That's a stable error string that can be stripped.

**Fix (4 patches to the extractor):**

1. **Case-insensitive `PAGE_HEADER_RE`** — flip to `^[VvHh][WwAa]-1022-a-…/i` or just add the `i` flag. This alone should drop 90%+ of page-artifact contamination.
2. **End-of-exam stop** — add `isEndOfExamMarker(line)` recognizing `^Bronvermelding$`, `^einde$`, or the answer-model tailer `-b\.pdf`. Once seen, flush current question and stop accumulating.
3. **PUA glyph strip** — inside `cleanText`, replace `[\uE000-\uF8FF]` with empty. These are always artifacts.
4. **Broken-image placeholder strip** — inside `cleanText`, remove the OOXML error string as a single regex.

After these, re-extract. The existing annotation-preservation logic at line 150–158 carries forward `required_skills`, `question_type`, `exam_codes` by `(exam, question_num)` key — so annotations survive the text refresh.

**Effort:** ~30 minutes. No annotation loss risk.

### Finding 2 — Incomplete `exam_codes` (High) — **merit: full; auto-derivable**

184 rows have `required_skills` populated but empty `exam_codes`. The review frames this as requiring more audit work. It doesn't — the information is already available in the catalog:

- Each unit in `micro-teaching-units.json` has an `exam_codes` array (the eindtermen that unit addresses).
- A question's `exam_codes` is the *union of the exam_codes of the units it requires*.

That derivation is exact, not heuristic: if a student needs unit D05 to answer a question, and D05 addresses eindterm D1.4a, then the question tests D1.4a by transitivity.

**Fix:** one-shot script that, for each question with non-empty `required_skills` and empty `exam_codes`, writes the union of the cited units' exam_codes. Don't overwrite non-empty exam_codes (the audit may have picked more specific codes than the unit-level mapping).

Expected outcome: of the 184 empty-exam-codes rows, ~170+ will get filled (assuming each cited unit has at least one exam_code). The residual (~15) are rows where all cited units themselves have empty `exam_codes` — those surface as a reverse signal: units that haven't been wired to the syllabus yet. That's useful input for a future unit-catalog pass.

**Additionally:** add a validator rule that logs any question where `required_skills` is populated but the derived `exam_codes` remains empty — makes the "unit-has-no-exam-code" backlog visible.

**Effort:** ~20 minutes.

### Finding 3 — Missing source-location metadata (Medium) — **merit: partial; lower priority**

The review's claim — "on a corpus whose text field still contains page junk, source metadata makes repair faster" — is true, but it inverts cause and effect: once Finding 1 is fixed, the `text` field gets clean and the need for page references drops sharply. You'd still want page numbers for quoting in reports, but it's no longer a blocker.

**Fix (optional, cheaper if done during same re-extract):**

- Track a `page_num` counter incremented on every `-- N of M --` footer line.
- Add `page_start` (the page where the question starts) and `page_end` (the page where it ends) fields to each row.
- Cost: minimal — only requires wiring a counter into the existing footer recognition.

**Effort:** ~15 minutes if bundled with the Finding 1 commit; skip otherwise.

**Recommendation:** include it. It's cheap, makes future audit passes more efficient, and doesn't risk annotation churn.

---

## Recommended execution order

One commit for extractor work, one commit for annotation derivation.

### Commit 1 — Extractor hardening (Findings 1 + 3)

1. Flip `PAGE_HEADER_RE` to case-insensitive.
2. Add `isEndOfExamMarker` recognizing `Bronvermelding`, `einde`, and answer-model tailers; flush + stop on hit.
3. Extend `cleanText` to strip PUA glyphs (`[\uE000-\uF8FF]`) and the broken-image OOXML error string.
4. Add `page_start` / `page_end` tracking via `-- N of M --` footer counter.
5. Re-extract. Verify:
   - `lees verder` hits drop from 106 → <5.
   - `Bronvermelding`/`einde` hits drop from 12/13 → 0.
   - PUA glyph hits drop from 44 → 0.
   - Broken-image hit drops from 1 → 0.
   - Row count stays at 349 (no accidental splits/losses).
   - Existing annotations preserved.

### Commit 2 — `exam_codes` auto-derivation (Finding 2)

6. Write `build-scripts/references/derive-exam-codes.js` that:
   - Loads `micro-teaching-units.json` and `exam-questions.json`.
   - For each question with non-empty `required_skills` and empty `exam_codes`, writes the union of cited units' `exam_codes`.
   - Reports: how many questions filled, how many left empty (skills → units without exam_codes).
7. Run. Expect coverage jump from 146/349 → 310+/349.
8. Verify integrity: every new `exam_codes` entry resolves against `syllabus-eindtermen.json`.

### Verification

Rebuild the catalog JSON (`build-unit-index.js`) to confirm no indirect regressions. Tests should still pass 65/65, all 8 reports green.

---

## What the review gets right that's easy to miss

- The `PAGE_HEADER_RE` case-sensitivity bug is a single-character fix (`/i`) that cleans 100+ rows. Good example of "one regex rules them all" debugging.
- The 184 rows with `required_skills` but no `exam_codes` look like a huge gap, but they're almost all derivable. Framing this as "incomplete annotation" overstates the human-effort need.

## What I'd push back on

- Finding 3 is presented as if source metadata were an independent quality issue. It's mostly a consequence of Finding 1 — once `text` is clean, the need for page references for manual verification drops. Still worth adding (cheap + genuinely useful for report quoting), but not a Tier-1 issue.

## Deferred

- Any residual PDF-extraction noise that survives the four fixes should be spot-checked on the 349 rows and either added to the cleanup rules or flagged per-row. Defer to a review-after-extract iteration rather than trying to anticipate every pattern.
- Per-row source PDF offset / coordinate (beyond page) — interesting for future auto-rendering of question-as-image, but out of scope for a text-quality pass.
