# L1.5V Bucket F — Part A / Part B Quality-Cycle Separation: Design Proposal

**Status:** F-plan deliverable. F-execute is gated on user approval of this document.
**Author:** F-plan sub-agent.
**Date:** 2026-05-09.
**Worktree / branch:** `C:/Projects/4veco/4veco-platform-companion`, branch `content/1.1.1-companion-quality`, off platform main `5dcaf2a` (HEAD `fb77a74`).
**Pilot paragraph:** §1.1.1 Schaarste en economisch denken.
**Scope:** §1.1.1 only. L1.4 paragraph 2 inherits the cleaned pipeline; older paragraphs out of scope.

This proposal answers the seven questions in the roadmap (Bucket F, lines 712-872 of `lessen-team-roadmap.md`) and in section 7 of `plan-l1.5v-companion-quality.md`. The reader should be able to approve, override, or reject any single decision without rereading the audited source.

Throughout, "Part A" means the textbook-build pipeline (markdown + graphs + PDFs, consumed by chapter assembly). "Part B" means the lessen-companion pipeline (24 root files including `index.html`, consumed by students through the lessen book site). "Shared infra" means anything that is neither (validators, registries, didactic skills, PDF builder, etc.).

---

## 0. Required reading: what this proposal is grounded in

Verified this turn:

- `git log -15 --oneline` on companion worktree → HEAD `fb77a74`, branch `content/1.1.1-companion-quality`, working tree clean.
- `git status` on lessen-side → clean recent commits including L1.5V scaffolding (`6983de7`).
- `BUILD-PARAGRAPH.md` (657 lines) — full read this turn.
- `BUILD-CHAPTER.md` (164 lines) — full read this turn.
- `scripts/validate-paragraph.js` (516 lines) — full read this turn, with focus on lines 23, 167-194, 211-214, 343-371.
- `AGENTS.md` (404 lines) — full read this turn.
- `agents/econ-companion-visual-review.md` (303 lines) — full read this turn.
- `agents/README.md` (24 lines) — full read this turn.
- `skills/` directory listing (21 skill files) and frontmatter of every skill — read this turn.
- `engines/tests/` directory listing (16 entries; 13 `.test.js` suites) — read this turn.
- `scripts/tests/` directory listing (3 test files: `check-book.test.js`, `validate-chapter.test.js`, `validate-paragraph.test.js`) — read this turn.
- Lessen §1.1.1 paragraph folder listing — read this turn (40 entries).
- `1.1.1-review.md`, `1.1.1-companion-visual-review.md`, `1.1.1-quality-ref.yaml` — full read this turn.
- `lessen-team-roadmap.md` Bucket F section — full read this turn.
- `plan-l1.5v-companion-quality.md` — full read this turn.
- `package.json` — read this turn (Jest 30; no Jest projects defined yet).

Findings 0.6 (validator filename-match defect), 0.5 (vaardigheden converter has same list-item bug), 0.4 (voorkennis is intentionally pre-B02), and 0.10 (Heading1 collision possibly in vaardigheden builder too) from the whole-sprint plan are confirmed by direct code read.

---

## 1. Mixed-scope section list with proposed split

### 1.1 Audit of `BUILD-PARAGRAPH.md`

Tagged scan, line-anchored to the version at HEAD `fb77a74`:

| Section | Lines | Tag | Notes |
|---|---|---|---|
| Title + intro table | 1-13 | A+B index | Already explicit about the two pipelines. Keep, with the proposed common-prerequisites note added. |
| Part A header | 14-19 | A | Explicit; clean. |
| A1 Input | 21-26 | A | Clean. |
| A2 Build content | 27-39 | A | Clean. |
| A3 Build graphs | 40-49 | A | Clean. |
| A4 Build PDFs | 50-55 | A | Clean. |
| A5 Asset completeness gate | 56-66 | A | Clean. Note: same kind of gate exists implicitly for Part B `_assets/` companion variants. |
| A6 QC review | 68-76 | A | **Mixed risk.** Produces `X.Y.Z-review.md`. The skill is `econ-paragraph-review` (Part A pass-1+pass-2). The filename is currently *also* read by Part B closure logic (because of finding 0.6). Document the file as Part A only; F2 in validator carves Part B FAILs to a separate file. |
| A7 Quality ref | 78-83 | A | Produces `X.Y.Z-quality-ref.yaml`. Today: Part A only. Per E1, gets a `companion:` block (proposed in §4 below). |
| A-verify checklist | 84-104 | A | Clean. |
| Part B header | 106-114 | B | Clean. |
| B0 Target and layout | 116-124 | B | Clean. |
| B0a Book setup | 125-153 | B | Clean. Lives at book scope but only triggers in Part B paths. |
| B1 Definition of Done | 154-196 | B | Clean. Twenty-four-file table is Part B canonical. |
| B2 Input contract | 198-318 | B | Clean. |
| B3 End-to-end workflow | 320-475 | **mixed** | Phases 1-4b are Part B; Phase 5 is Part B. **Phase 5a-5c is the textbook QC re-run for Part-B-only flow.** It cross-references "Part A §A5/§A6/§A7" — meaning the same gate is reused. **Phase 6** is Part B (deploy). **Phase 6a** is the *Part B closure gate* (`econ-companion-visual-review`). The B-verify checklist (lines 452-478) bundles Part A prerequisites + Part B platform files + design principles + deployment. |
| B-verify checklist | 452-478 | **mixed** | First section "Part A prerequisites" is a backreference; rest is Part B. |
| B4 Script classification | 480-540 | B | Clean. |
| B5 Deploy scope | 542-568 | B | Clean. |
| B6 Validation | 570-606 | A+B (overview) | Documents the modes. The `validate-paragraph.js` is shared infrastructure. |
| B7 Pedagogical approach | 608-617 | shared (didactic) | Currently under Part B but applies to both pipelines. Move out, see §2. |
| B8 Build script requirement | 619-630 | B | Clean. |
| B9 Quality rules | 632-657 | mostly B + a few A | Mixed: rules about supply curves are Part A; rules about presentaties and font sizes are Part B. |

### 1.2 Mixed-scope sections — explicit list

The following sections are mixed in the current document and need the cleanest split decision:

1. **A6 review file naming** — `X.Y.Z-review.md` is owned by Part A but the validator (finding 0.6) accidentally reads it for Part B. **Proposed split:** keep `X.Y.Z-review.md` strictly Part A; introduce no new filename for Part B (it already has `X.Y.Z-companion-visual-review.md`). The validator changes (F2) make scope explicit. **Default decision: enforced.**

2. **A7 quality-ref scope** — `X.Y.Z-quality-ref.yaml` records Part A only. **Proposed split:** keep one file with both Part A and Part B sections (option (a) of three in §4). **Default decision: extend the existing YAML with a `companion:` block.**

3. **B3 Phases 5a-5c** — these tell a Part-B-only flow to run the Part A QC gates after generating companions. That is correct in practice (some teams Part-B-add to existing Part-A paragraphs) but the labelling is muddled. **Proposed split:** rename these "Phase 5a-5c: textbook QC backfill (only when running Part B without prior Part A)" and add a one-line note that they are the same gates as A5-A7, not a new gate set.

4. **B-verify Part A prerequisites block** — first three lines reference the A-verify checklist. **Proposed split:** keep the cross-reference but make the wording explicit ("if Part A was run separately, A-verify must pass first"). No structural change.

5. **B7 Pedagogical approach** — applies to both pipelines. **Proposed split:** lift to a new "Common pre-conditions / shared concerns" section at the top of the document.

6. **B9 Quality rules** — rule rows mix A and B. **Proposed split:** annotate each row with `[A]`, `[B]`, or `[both]`; sort within block.

### 1.3 Audit of `BUILD-CHAPTER.md`

Already cleanly Part A only. Confirms Part A scope: paragraph builds, chapter front page, assembly, asset verification, cross-paragraph consistency, PDF, validator. No Part B scope leaks here. **No structural change proposed in F.**

One edit recommended: add an explicit single-line statement at the top: "This document is Part A only. For Part B (lessen companions), see BUILD-PARAGRAPH.md." This matches the pattern in `econ-chapter-assembler` skill (which already says "It does not use or require Part B (platform) outputs.").

---

## 2. Proposed final shape of `BUILD-PARAGRAPH.md`

### 2.1 Options recap

Per the roadmap (lines 825-828):

- **(a) one file with three top-level sections:** Common pre-conditions, Part A, Part B.
- **(b) split into `BUILD-PARAGRAPH-A.md` + `BUILD-PARAGRAPH-B.md`** with a small `BUILD-PARAGRAPH.md` index.

Roadmap default: (a) unless (b) is clearly better.

### 2.2 Recommendation: **option (a)**.

Rationale:

1. **The two pipelines genuinely share infrastructure.** Both use `_paragraph-plan.md`, both consume `_assets/`, both feed the same validator (different mode), both write into the same paragraph folder (flat layout per B0). A single document captures these correctly without forcing a reader to flip between two files.

2. **The three-section structure already exists in skeleton.** The current document's "Part A" / "Part B" headers (lines 14, 106) need only a "Common pre-conditions" header inserted on top. No new content needs to be invented; the move is editorial.

3. **Skill files reference `BUILD-PARAGRAPH.md` by name in many places.** Every reference (`AGENTS.md`, `agents/README.md`, `agents/econ-companion-visual-review.md`, several skills) would need updating in option (b). Option (a) keeps the existing path stable.

4. **Build-time the document is read by an agent end-to-end.** Splitting forces double-fetching across files when an agent runs a complete-mode build (which is exactly the flow §1.1.1 had). This is rare today but the direction is more complete-mode work, not less.

5. **The document is currently 657 lines.** Not so long that splitting solves a real navigation problem. A clearly-structured TOC at the top fixes navigation cheaply.

The only argument for (b) would be that splitting makes it physically impossible to read mixed-scope advice. But mixed scope is already the failure mode (see §1.2), and option (a) plus per-row tagging in B9 plus the reorganised "Common pre-conditions" section handles that without splitting.

### 2.3 Proposed final TOC under option (a)

```
# How to Build a Complete Paragraph

## 0. Common pre-conditions (read first)
   0.1. Two pipelines, three modes (intro table — moved up from current top)
   0.2. Design principles (one-paragraph reminder + AGENTS.md link)
   0.3. Pedagogical approach by paragraph type (lifted from current B7)
   0.4. Quality rules — annotated [A] / [B] / [both] (lifted from current B9)
   0.5. The flat-layout contract (one paragraph; was scattered)

## PART A: Textbook Build (markdown -> graphs -> PDF)
   A1. Input
   A2. Build content
   A3. Build graphs
   A4. Build PDFs
   A5. Asset completeness gate (HARD GATE)
   A6. QC review (econ-paragraph-review; produces X.Y.Z-review.md)
   A7. Quality ref (produces partA: section in X.Y.Z-quality-ref.yaml)
   A-verify checklist

## PART B: Lessen Companions (docx, pptx, html, landing page)
   B0. Target and layout
   B0a. First-time book setup
   B1. Definition of Done (24 root files)
   B2. Input contract
   B3. End-to-end workflow (Phases 1 - 6a)
       Phase 5a-5c renamed to "textbook QC backfill (Part B only)"
       Phase 6a (Companion visual review gate) explicit as Part B closure
   B-verify checklist (Part A prerequisites cross-reference at top, not embedded)
   B4. Script classification
   B5. What deploy.js does and does NOT do

## Validation (single section, replaces current B6)
   Mode summary table (--mode auto / part-a / part-b / complete)
   What each mode checks
   What each mode does NOT check (link to companion visual review for hard fails)
   Run command and exit codes

## Build-script requirement (lifted from current B8; one paragraph)
```

Total: ~700 lines after restructure (current 657 + ~50 lines of new clarification text). No content lost; some moved.

### 2.4 Cross-references after restructure

After the restructure, every skill file referencing `BUILD-PARAGRAPH.md` should be checked for:

- "Part A" / "Part B" labels in skill descriptions (already present in `econ-chapter-assembler`, `econ-chapter-builder`, `econ-companion-artifacts`).
- Section anchors. `BUILD-PARAGRAPH.md#A6` etc. become stable.

This is a low-touch sweep handled in F4.

### 2.5 Recommended naming after restructure

Keep the filename `BUILD-PARAGRAPH.md`. Do **not** rename to `BUILD-PARAGRAPH-COMPLETE.md` or similar — the name is referenced by enough callers that rename costs more than it earns.

---

## 3. Proposed validator behaviour

### 3.1 Confirmed: three modes already exist

Verified by reading `validate-paragraph.js`:

- Line 21: `VALID_MODES = new Set(['auto', 'part-a', 'part-b', 'complete'])`.
- Lines 27-60: `parseArgs` supports `--mode <value>` and `--mode=<value>`.
- Lines 196-214: `effectiveMode()` resolves `auto` from filesystem markers; lines 502-503 dispatch.

So `--mode part-a`, `--mode part-b`, `--mode complete` are already functional. F-plan is **clarifying and correcting**, not introducing modes.

### 3.2 Current per-mode coverage

From `validate-paragraph.js`:

| Mode | What it actually validates today |
|---|---|
| `part-a` | (lines 373-404) Paragraph type classification (theory / consolidation / testprep variants). Required `.md` files per type. Required `.pdf` files per type, all >10KB. `build_pdf.py`. `_assets/` integrity (image refs resolve, SVG/PNG paired, naming compliant). Calls `validateReviewAndQualityRef` (lines 341-371) which reads the `*-review.md` file (with the buggy match — see §3.4) and checks the YAML `missing` / `svgpng_paired` / `naming_compliant` fields. |
| `part-b` | (lines 406-463) All 24 required Part B root files. DOCX zip-magic check. PPTX size > 20 KB. HTML size > 500 bytes. `_paragraph-plan.md` exists with the three required sections (procedure-stappen-plan, visuelen-toewijzing, terminologie). Game data files in `<book>/shared/`. Quiz difficulty-3 per category. Procedure data parses. **Does NOT call `validateReviewAndQualityRef`** — Part B passes today even when `1.1.1-companion-visual-review.md` says FAIL. |
| `complete` | Calls both. The buggy filename match means `validateReviewAndQualityRef` runs once and may pick the companion review's FAIL count by accident (finding 0.6). |
| `auto` | Resolves to one of the above by sniffing files. Inherits the same buggy logic. |

### 3.3 Defects to fix in F2

#### Defect F2.a — `validateReviewAndQualityRef` filename match is wrong (finding 0.6)

Lines 343 and 353:

```js
const reviewFile = rootFiles.find(f => f === `${parNr}-review.md` || f.endsWith('-review.md'));
const qualityRef = rootFiles.find(f => f === `${parNr}-quality-ref.yaml` || f.endsWith('-quality-ref.yaml'));
```

`endsWith('-review.md')` matches BOTH `1.1.1-review.md` AND `1.1.1-companion-visual-review.md`. `Array.prototype.find` returns the first match in directory-listing order; on Windows that is alphabetical, so the companion review wins. **Defect:** Part A's review-file check is reading Part B's review file. The function counts FAIL tokens in the wrong file.

**Fix:** match exactly. Drop the `endsWith` fallback. Both files have well-defined names:

- Part A review: exactly `${parNr}-review.md` (e.g. `1.1.1-review.md`).
- Part B review: exactly `${parNr}-companion-visual-review.md`.

Update both review and quality-ref searches the same way.

#### Defect F2.b — Part B has no review-file gate today

`validatePartB()` does not call any review-file check. So Part B can pass the validator even when the companion visual review says FAIL.

**Fix:** add a `validateCompanionReview()` helper that:

- Reads `${parNr}-companion-visual-review.md` if present.
- Counts unresolved FAIL items (same regex as today: `/\bFAIL\b/gi`).
- Counts hard-fail tokens specifically (e.g. `/^### HF-/m`) for cross-validation.
- Reports verdict line if present (e.g. `**FAIL**`, `**PASS**`, `**PASS WITH FLAGS**`) — many existing reports include this.
- Fails the validator with a clear message if any unresolved FAIL is present.

#### Defect F2.c — `complete` mode must aggregate both review files

User-confirmed this turn: `complete` mode should aggregate FAIL counts from BOTH `${parNr}-review.md` and `${parNr}-companion-visual-review.md`. Today it only counts one (whichever the buggy match returns).

**Fix:** in `complete` mode, run both `validatePartA` (which reads the Part A review) AND `validatePartB` extended to call `validateCompanionReview` (which reads the Part B review). Each function increments the shared `errors` counter. Final exit non-zero if any FAILs present in scope.

### 3.4 Proposed final per-mode contract

After F2:

| Mode | Reads Part A review (`X.Y.Z-review.md`) | Reads Part B review (`X.Y.Z-companion-visual-review.md`) | Reads quality-ref Part A section | Reads quality-ref Part B section |
|---|---|---|---|---|
| `part-a` | yes — required, 0 unresolved FAILs | no | yes — `assets.missing`, `assets.svgpng_paired`, `assets.naming_compliant` (existing logic) | no |
| `part-b` | no | yes — required if file present; FAIL when verdict is FAIL or any HF-* line is open | no | yes — `companion.hard_fails_open`, `companion.review_verdict` |
| `complete` | yes | yes | yes | yes |
| `auto` | dispatched per existing rules | dispatched per existing rules | dispatched per existing rules | dispatched per existing rules |

Edge cases to handle:

- **Companion review file missing in `part-b` or `complete` mode.** Default: treat as FAIL with message "missing required companion review report". User override path: `--allow-missing-companion-review` flag (not recommended; documented for migration windows). **Default decision:** require the file in `part-b` and `complete`; no skip flag.
- **Companion review file says PASS WITH FLAGS but has narrative `FAIL` tokens in body.** Today's logic (regex on `\bFAIL\b`) over-counts because the report itself documents FAIL conditions in the spec section. The Part A review file `1.1.1-review.md` has the same risk in principle but it's been clean. **Fix:** parse the verdict from a structured marker (e.g. require `## Verdict\n\n**FAIL|PASS|PASS WITH FLAGS**` block; or look at HF-* sections) rather than `\bFAIL\b` count. **Default decision:** prefer structured verdict parsing. Fall-back regex is a stop-gap only.

### 3.5 New jest test required

`scripts/tests/validate-paragraph-modes.test.js`:

1. Set up Part A + Part B paragraph with both review files PASS → `--mode complete` exits 0.
2. Same fixture with Part A review FAIL → `--mode part-a` exits non-zero, `--mode part-b` exits 0, `--mode complete` exits non-zero.
3. Same fixture with Part B review FAIL → `--mode part-a` exits 0, `--mode part-b` exits non-zero, `--mode complete` exits non-zero.
4. Both reviews FAIL → `complete` reports both, exits non-zero, output mentions both review file names.
5. Filename-match regression: paragraph with `${parNr}-review.md` (PASS, no FAIL tokens) AND `${parNr}-companion-visual-review.md` (FAIL) → `--mode part-a` exits 0 (does NOT pick the companion file). This is the regression test for finding 0.6.

This test goes to `scripts/tests/` (alongside existing `validate-paragraph.test.js`); not `engines/tests/`.

### 3.6 Documentation impact

`BUILD-PARAGRAPH.md` Validation section gets a per-mode contract table (the table in §3.4 above). The current B6 section (lines 572-606) gets rewritten around modes rather than around content surfaces.

---

## 4. Proposed quality-record schema

### 4.1 Options recap

- **(a) Single file, two top-level sections** — `partA:` and `companion:` in `${parNr}-quality-ref.yaml`. Default per E1.
- **(b) Two files** — `${parNr}-quality-ref-part-a.yaml` + `${parNr}-quality-ref-part-b.yaml`.
- **(c) Three files** — existing + companion-specific + maybe a master pointer.

### 4.2 Recommendation: **option (a) — single file, two top-level sections.**

Rationale:

1. **The current file already exists with a clean Part A schema.** Migration is additive: add a `companion:` block; existing Part A consumers keep reading what they read today.

2. **Symmetry with validator modes.** `--mode complete` reads one file; `--mode part-a` reads the same file but ignores the companion block; `--mode part-b` reads the same file but ignores the partA block. One file, three views.

3. **One document per paragraph is easier to inspect.** A reviewer opening the paragraph folder sees one quality record; the companion visual review document and Part A review document remain separate (because they are human-narrative, not machine-readable state).

4. **Two-file or three-file splits create ordering questions.** Which file is canonical? What if they disagree? Which file is created first? With option (a) there is one canonical file; sections may be present or absent but they cannot disagree about identity.

5. **The paragraph folder is already crowded** (40+ entries in §1.1.1 today). Adding a second YAML increases noise.

The argument for (b) would be locking each pipeline's QC inside its own file so a Part-B-only regen does not touch Part A's record. But the YAML edits in option (a) are clearly partitioned (the agent updates `companion:` only). Risk of accidental Part A edit during companion regen is the same as risk of accidental edit of any unrelated YAML key — caught by review, not by file boundary.

The argument for (c) would be if a third dimension of QC emerges (e.g. game-engine QC). That can be added later inside the same file with a `games:` block. **Default decision: stick with option (a). Add new sections in-file as needs arise.**

### 4.3 Proposed schema (option (a) finalised)

Existing top-level fields stay. Add `partA:` wrapper for clarity and `companion:` block as new sibling. Backward-compatibility: keep current top-level keys for one transition window so existing readers don't break, and document deprecation.

```yaml
# Quality Reference — 1.1.1 Schaarste en economisch denken
# Schema version: 2 (introduces companion: block)
# Generated: 2026-04-14 (Part A) / 2026-05-09 (Part B)

paragraph: "1.1.1"
title: "Schaarste en economisch denken"
type: theory
schema_version: 2

partA:
  content:
    paragraaf_md: true
    opgaven_md: true
    antwoorden_md: true
    paragraaf_pdf: true
    opgaven_pdf: true
    antwoorden_pdf: true
    build_pdf_py: true
  assets:
    total_referenced: 5
    total_present: 5
    missing: []
    svgpng_paired: true
    naming_compliant: true
    inventory:
      - 1.1.1_fig_1 (schaarste: behoeften vs middelen)
      - 1.1.1_fig_2 (opportuniteitskosten: bar chart)
      - 1.1.1_fig_3 (economisch denken: 4 stappen)   # was 3 stappen pre-Bucket B
      - 1.1.1_we_1 (uitgewerkt voorbeeld: tarwe vs maïs)
      - 1.1.1_ex_1 (opgave: drie gewassen)
  review:
    file: "1.1.1-review.md"
    unresolved_fails: 0
    verdict: "PASS WITH FLAGS"
    last_reviewed: "2026-04-14"

companion:
  review_file: "1.1.1-companion-visual-review.md"
  review_verdict: "PASS"            # one of: PASS / PASS WITH FLAGS / FAIL
  last_reviewed: "2026-05-XX"        # populated post-Bucket-A-D regen
  hard_fails_open: 0                 # count of unresolved HF-* items
  procedure_b02_step_count: 4        # canonical 4 (post-Bucket B)
  assets_meaningful_alt: true        # post-Bucket A4
  checklist_route_present: true      # post-Bucket A3 (voorkennis)
  artifact_tool_render_clean: true   # post-Bucket A5 (Heading1 collision fix)
  surfaces:
    voorkennis_html: clean
    voorkennis_docx: clean
    vaardigheden_html: clean
    vaardigheden_docx: clean
    presentatie_pptx: clean
    nieuws_docx: clean
    samenvatting_docx: clean
    begeleide_inoefening_html: clean
    games:
      instapquiz: clean
      nieuws_detective: clean
      stappenplan: clean
      redeneer_spel: clean
      wiskundevaardigheden: clean

# Deprecated top-level keys (kept for one transition window).
# Readers should consult partA:/companion: instead.
content:
  paragraaf_md: true
  # ... (mirrors partA.content during transition)
assets:
  total_referenced: 5
  # ... (mirrors partA.assets during transition)
review:
  file: "1.1.1-review.md"
  unresolved_fails: 0
  verdict: "PASS WITH FLAGS"
```

### 4.4 Field-name sourcing

Every `companion:` field is justified by the §1.1.1 review:

- `review_verdict` — from review file's "## 2. Verdict" section. Drives validator pass/fail.
- `review_file` — provenance.
- `last_reviewed` — provenance, useful for staleness checks.
- `hard_fails_open` — count of unresolved HF-* sections (the review file's "## 3. Hard-fail findings" enumerates these as `### HF-1`, `### HF-2`, etc.).
- `procedure_b02_step_count` — from Bucket B. Today's review specifically called out 3-step vs 4-step.
- `assets_meaningful_alt` — from HF-4. Asserts the alt-text infrastructure is wired and producing meaningful strings.
- `checklist_route_present` — from HF-3. Asserts the voorkennis checklist routes onward.
- `artifact_tool_render_clean` — from QA-1. Asserts `render_docx.py --renderer artifact-tool` succeeds on the voorkennis DOCX.
- `surfaces:` map — one row per Part B surface family. Lets the dashboard or reviewer see at a glance which surfaces are clean.

I recommend these as the canonical set. If F-execute discovers that a particular field is hard to populate automatically, the reviewer agent can write `unknown` and surface it as a follow-up; that beats inventing a new field per surface.

### 4.5 Schema authority

`econ-quality-control` skill (today's authority for quality_ref) needs an updated section documenting the new shape. **Default decision:** the platform's authority for the YAML schema is `skills/econ-quality-control.md`; F4 updates it. The companion review agent (`agents/econ-companion-visual-review.md`) updates the `companion:` block at the end of every run; it does NOT touch `partA:`.

### 4.6 Migration path for §1.1.1

1. Read existing `1.1.1-quality-ref.yaml` (10 lines under `content:`, `assets:`, `review:`).
2. Wrap them in `partA:` (preserve all values).
3. Add `companion:` block with values from the post-Bucket-A-D state.
4. Bump `schema_version: 2`.
5. Keep top-level deprecated mirrors during transition (one paragraph; remove on next paragraph build).
6. Write back to file.

This is a single ~30-line YAML edit. Lessen-side commit, batched with E3.

### 4.7 Schema version policy

Going forward, `schema_version` increments on any breaking change. Readers can branch on version. E1 proposes version 2.

---

## 5. Proposed skill ownership table

Read frontmatter of every skill in `skills/`. Cross-checked against `BUILD-PARAGRAPH.md` and `BUILD-CHAPTER.md`. Current state and proposed clean classification:

| Skill | Today's de-facto scope | Proposed clean ownership | Notes / rationale |
|---|---|---|---|
| `econ-textbook-paragraph` | Part A | **Part A producer** | Frontmatter explicit: builds paragraaf.md + assets + PDF. Part A only. |
| `econ-exercise-builder` | Part A | **Part A producer** | Frontmatter says exercises.md and answers.md. Part A only. |
| `econ-consolidation-builder` | Part A | **Part A producer** | Builds consolidation paragraphs (last § of chapter). Part A only. |
| `econ-testprep-builder` | Part A | **Part A producer** | Builds Chapter 5 testprep paragraphs. Part A only. |
| `econ-pdf-builder` | Part A | **Part A producer** | Pandoc + WeasyPrint pipeline for textbook materials. Part A only. |
| `econ-paragraph-review` | Part A | **Part A reviewer** | Two-pass review of textbook paragraphs. Output: `X.Y.Z-review.md`. Part A only. |
| `econ-chapter-assembler` | Part A | **Part A assembler** | Frontmatter is explicit: "It does not use or require Part B (platform) outputs." |
| `econ-chapter-builder` | Part A | **Part A orchestrator** | Frontmatter says it calls Part-A-only sub-skills. Part A only. |
| `econ-book-builder` | Part A | **Part A orchestrator** | Stitches chapters into a book PDF. Part A only. |
| `aanpak-samenvattingen` | Part A (chapter scope) | **Part A producer (chapter)** | Builds chapter samenvatting.docx, not paragraph-level companion samenvatting. **Note:** name collides conceptually with paragraph-level samenvatting (Part B file #10). Document this in the skill frontmatter to prevent confusion. |
| `economic-graph` | shared | **shared infrastructure** | Used by both Part A (textbook graphs) and Part B (companion visuals). Frontmatter already says "presentations, Word documents, HTML files". |
| `econ-didactiek` | shared | **shared infrastructure** | Format-independent didactic principles. Used by both pipelines. |
| `manage-references` | shared | **shared infrastructure** | Policy + CLI for `references/` folder. Used by both. |
| `qc-references` | shared | **shared infrastructure** | LLM-judgment QC layer for catalog. Cross-pipeline. |
| `senior-dev-planning` | shared (meta) | **shared infrastructure** | Planning skill, not domain-specific. Cross-pipeline. |
| `econ-companion-artifacts` | Part B | **Part B producer (umbrella)** | New skill, frontmatter explicit about student-facing companion artifacts. |
| `econ-explainer-docs` | Part B | **Part B producer** | Builds uitleg voorkennis + uitleg vaardigheden DOCX (Part B files #3, #4, #7, #8). |
| `econ-nieuws-exercise` | Part B | **Part B producer** | Builds nieuws met visual DOCX (Part B file #9). Note: textbook paragraphs may also reference nieuws-style exercises, but the standalone "nieuws met visual" file is Part B. |
| `econ-pptx-templates` | Part B | **Part B producer** | Builds presentatie.pptx (Part B file #6). Strict Part B. |
| `econ-word-templates` | Part B | **Part B producer (component library)** | Reusable docx components used by all Part B docx producers. |
| `econ-quality-control` | mixed (today) | **shared infrastructure (extended scope)** | Today: quality_ref for Part A only. Frontmatter mentions "scope (paragraph, chapter, module, course)". After F3, this skill governs the full schema (partA + companion). |

### 5.1 Ownership leakage — what changes

Two skills have de-facto leakage in today's state:

1. **`econ-quality-control`** today only documents Part A scope. Fix: extend the skill to document the combined `partA:` + `companion:` schema (option (a) of §4). Mark it shared infrastructure since both pipelines feed it.

2. **`aanpak-samenvattingen`** is paragraph-level samenvatting-naming-collision-prone. The chapter-level "samenvatting.docx" handled by this skill is a Part A artifact; the paragraph-level "samenvatting.docx" is Part B file #10 and is handled by `econ-pptx-templates`-adjacent or `samenvatting-351-352-rebuild.js` reference scripts. Fix: add a one-line scope note to the skill frontmatter ("This skill builds chapter-level samenvatting only. Paragraph-level samenvatting.docx (Part B file #10) is built via the reference script samenvatting-351-352-rebuild.js, not via this skill.").

### 5.2 Skills that could go either way — recommendation

- **`econ-pdf-builder`** — could in principle render any markdown to PDF, including potentially Part B HTML-to-PDF. Today it is Part A only (paragraph PDFs, chapter PDFs, book PDF). **Recommendation:** keep as Part A producer; if Part B ever needs PDF export of companion HTML, that would be a separate path (artifact-tool style) and a separate skill.

- **`econ-companion-artifacts`** vs the per-format builder skills (`econ-explainer-docs`, `econ-pptx-templates`, etc.) — overlap is by design: companion-artifacts is the umbrella authoring + regeneration spec; per-format skills inherit. Document this in F4 (one explicit sentence: "If a per-format skill conflicts with `econ-companion-artifacts`, the companion-artifacts skill wins on student-facing rules"). This sentence already exists in `AGENTS.md`; replicate it in each per-format skill frontmatter.

### 5.3 New skill (out of scope for F, surfaced as follow-up)

There is no Part B producer skill explicitly named "samenvatting" (paragraph-level), "begeleide inoefening", or "opgavensets". They are built from reference scripts (`samenvatting-351-352-rebuild.js`, `inoefening-351-afsluiting.js`, `opgaven-351-afsluiting.js`). This is a documented design choice (`BUILD-PARAGRAPH.md` B4 "Reference implementations"). **No action in F.** If a future task adds skills for these, they slot in as Part B producers under the umbrella.

### 5.4 Test ownership classification (which gate runs against which skill's output)

This dovetails into §6, but in summary:

- Part A producers → `validate-paragraph.js --mode part-a` + `econ-paragraph-review` agent → `${parNr}-review.md`.
- Part B producers → `validate-paragraph.js --mode part-b` + `econ-companion-visual-review` agent → `${parNr}-companion-visual-review.md`.
- Shared infrastructure → its own jest test suites (engines/tests/, scripts/tests/), no review agent.

---

## 6. Proposed test taxonomy

### 6.1 Inventory of existing tests

`engines/tests/` (13 `.test.js` suites):

| File | Today's scope (audit) | Proposed classification |
|---|---|---|
| `converter-error-exit.test.js` | Tests that DOCX-as-web converter exits non-zero on conversion errors. Used by Part B converters. | **Part B** |
| `micro-teaching-units.test.js` | Tests the units catalog integrity (DAG, schema). Cross-pipeline. | **shared** |
| `newsdetective-data.test.js` | Tests `shared/newsdetective/X.Y.Z.js` data correctness for all paragraphs. | **Part B (game data)** |
| `newsdetective-engine.test.js` | Tests the news-detective engine logic. Game runtime. | **Part B (engine)** |
| `procedure-data.test.js` | Tests `shared/procedure/X.Y.Z.js` data. | **Part B (game data)** |
| `procedure-data-formal-step.test.js` | Tests procedure data conforms to canonical step rules. | **Part B (game data)** |
| `procedure-engine.test.js` | Procedure (stappenplan) engine. | **Part B (engine)** |
| `quiz-data.test.js` | Tests `shared/questions/X.Y.Z.js` per paragraph. | **Part B (game data)** |
| `quiz-engine.test.js` | Quiz engine. | **Part B (engine)** |
| `reasoning-data.test.js` | Reasoning data integrity. | **Part B (game data)** |
| `reasoning-engine.test.js` | Reasoning engine. | **Part B (engine)** |
| `skilltree-data.test.js` | Skilltree data integrity. | **Part B (game data)** |
| `skilltree-engine.test.js` | Skilltree engine. | **Part B (engine)** |

`scripts/tests/` (3 suites):

| File | Today's scope | Proposed classification |
|---|---|---|
| `check-book.test.js` | Tests `scripts/check-book.js` (book-level health check). | **shared** |
| `validate-chapter.test.js` | Tests chapter validator. Part A scope (chapters are Part A territory). | **Part A** |
| `validate-paragraph.test.js` | Tests paragraph validator. Tests both modes. | **shared (covers both modes)** |

### 6.2 Observation

Today's tests are essentially Part B (engines) + shared infrastructure. There are very few Part A tests in jest — Part A QC is mostly enforced through validators and the review agent producing `X.Y.Z-review.md`. That asymmetry is real and not wrong: Part A's grade-quality gate is the review agent, not a unit test. Game engines need unit tests because they have runtime logic; markdown content does not.

Many new Part B tests will be added in Buckets A-D (per the whole-sprint plan):

- `engines/tests/visual-surfaces-no-prod-label.test.js` (A1, Part B)
- `engines/tests/companion-html-list-rendering.test.js` (A2, Part B)
- `engines/tests/companion-html-checklist-routes.test.js` (A3, Part B)
- `engines/tests/companion-alt-text-meaningful.test.js` (A4, Part B)
- `engines/tests/docx-style-ids-unique.test.js` (A5, Part B)
- `engines/tests/fig-3-step-count.test.js` (B2, Part B)
- `engines/tests/companion-procedure-step-count.test.js` (B3e, Part B)
- `engines/tests/companion-terminology.test.js` (C6, Part B)
- `scripts/tests/validate-paragraph-modes.test.js` (F2, shared)

### 6.3 Recommendation: lightweight tag-based classification, not Jest projects

Two ways to enable selective test runs:

- **Jest projects (heavy):** add `jest.config.js` with `projects: [...]`. Each project has its own `testMatch`. Run `npx jest --selectProjects=part-a`. Pros: clean, declarative. Cons: requires a Jest config file (currently not present — `package.json` has no jest config block); changes the test discovery mechanism for everyone; affects watch mode.

- **Folder + filename tag (lightweight):** rename test files with a stable prefix or move to subfolders. Example folder structure:

  ```
  engines/tests/
    part-b/
      converter-error-exit.test.js
      newsdetective-data.test.js
      ...
    shared/
      micro-teaching-units.test.js
  scripts/tests/
    part-a/
      validate-chapter.test.js
    shared/
      check-book.test.js
      validate-paragraph.test.js
  ```

  Run with `npx jest engines/tests/part-b` or `npx jest --testPathPatterns "tests/(part-b|shared)/"`. Pros: no Jest config; `git mv` only; works with current `npm test` script unchanged. Cons: longer paths; some dev workflows expect tests right in `engines/tests/`.

**Recommendation: lightweight (folder + filename).** Reason: this is a documentation problem, not a tooling problem. The existing `npm test` runs everything; nobody is currently filtering. Adding filters is for cases where Part A and Part B move in separate PRs. Folder structure communicates ownership without forcing a Jest config refactor.

**Default decision: folder-based grouping**, applied as part of F-execute item F-tests (new sub-item not in current F1-F6 but proposed below; user can drop if scope is too broad).

### 6.4 Folder-based reorganisation — concrete proposal

```
engines/tests/
  shared/
    micro-teaching-units.test.js
  part-b/
    converter-error-exit.test.js
    newsdetective-data.test.js
    newsdetective-engine.test.js
    procedure-data.test.js
    procedure-data-formal-step.test.js
    procedure-engine.test.js
    quiz-data.test.js
    quiz-engine.test.js
    reasoning-data.test.js
    reasoning-engine.test.js
    skilltree-data.test.js
    skilltree-engine.test.js
    (NEW) visual-surfaces-no-prod-label.test.js
    (NEW) companion-html-list-rendering.test.js
    (NEW) companion-html-checklist-routes.test.js
    (NEW) companion-alt-text-meaningful.test.js
    (NEW) docx-style-ids-unique.test.js
    (NEW) fig-3-step-count.test.js
    (NEW) companion-procedure-step-count.test.js
    (NEW) companion-terminology.test.js
  (no part-a/ subfolder — Part A has no engine-level tests today)

scripts/tests/
  shared/
    check-book.test.js
    validate-paragraph.test.js
    (NEW) validate-paragraph-modes.test.js
  part-a/
    validate-chapter.test.js
  (no part-b/ subfolder — Part B uses engines/tests/part-b/)
```

`engines/tests/_wiskundevaardigheden-template.html`, `engines/tests/harness-skilltree-ui.html`, and `engines/tests/REFACTOR-NOTES.md` stay at the top level (they are not test files, just adjacent fixtures and notes). Update any path references in jest if they exist (they don't appear to).

### 6.5 If user prefers Jest projects (alternative)

If the user prefers Jest projects over folder grouping, the equivalent is:

```js
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'shared',
      testMatch: ['<rootDir>/engines/tests/micro-teaching-units.test.js',
                  '<rootDir>/scripts/tests/check-book.test.js',
                  '<rootDir>/scripts/tests/validate-paragraph.test.js'],
    },
    {
      displayName: 'part-a',
      testMatch: ['<rootDir>/scripts/tests/validate-chapter.test.js'],
    },
    {
      displayName: 'part-b',
      testMatch: ['<rootDir>/engines/tests/!(micro-teaching-units).test.js'],
    },
  ],
};
```

Then `npx jest --selectProjects=part-b`. This avoids file moves but adds a config file. Both approaches achieve the same goal. **Default: folder-based.**

---

## 7. Migration plan (§1.1.1 only)

§1.1.1 is the pilot. L1.4 paragraph 2 inherits the cleaned pipeline. Older paragraphs (Module 3) are out of scope; Module 3 stays frozen until Sept 2026.

The migration is partly platform-side (companion worktree) and partly lessen-side. F-plan keeps the cross-repo boundary explicit (see §10).

### 7.1 Step-by-step sequence

Each step is a separate commit unless noted. Gates run between commits; if a gate fails, fix before proceeding.

**Step 1 — F1: Restructure `BUILD-PARAGRAPH.md` per option (a).**

- Edit `BUILD-PARAGRAPH.md`:
  - Insert new "## 0. Common pre-conditions" section above current Part A header.
  - Move B7 (Pedagogical approach) and B9 (Quality rules) into 0.3 and 0.4.
  - Annotate B9 rows with `[A]`, `[B]`, `[both]`.
  - Update Phase 5a-5c heading to "textbook QC backfill (Part B only when Part A skipped)".
  - Update B6 to a clean per-mode contract table (table from §3.4 of this proposal).
  - Add a one-line top-of-file "This document is Part A + Part B." Mirror it in `BUILD-CHAPTER.md`: "This document is Part A only."
- Update cross-references: AGENTS.md "Read first" block, agents/README.md, any skill that anchors into `BUILD-PARAGRAPH.md#sectionN`.
- Gate: `npx jest` (no test changes; just sanity); manual link-grep in skills/ + agents/ + AGENTS.md to confirm no broken anchors.
- Commit: `docs(L1.5V): restructure BUILD-PARAGRAPH.md to Part A / Part B / Common shape (F1)`.

**Step 2 — F2: Fix validator filename match + aggregate complete-mode FAILs.**

- Edit `scripts/validate-paragraph.js`:
  - Replace `endsWith('-review.md')` and `endsWith('-quality-ref.yaml')` with exact matches.
  - Extract `validateReviewAndQualityRef` into:
    - `validatePartAReviewAndQualityRef()` — reads `${parNr}-review.md` and the `partA:` block (or top-level keys during transition).
    - `validateCompanionReviewAndQualityRef()` — reads `${parNr}-companion-visual-review.md` and the `companion:` block.
  - Wire them into `validatePartA()` and `validatePartB()` respectively.
  - In `complete` mode, both run; their FAIL counts aggregate via the shared `errors` counter.
  - Replace `\bFAIL\b` regex with structured verdict-line parsing (look for `## Verdict` or `## 2. Verdict` block, then `**FAIL**` / `**PASS**` marker; fall back to HF-* count).
  - Add `--allow-missing-companion-review` not implemented; failure mode is hard.
- Add `scripts/tests/validate-paragraph-modes.test.js` with the 5 cases from §3.5.
- Run `npx jest scripts/tests/`. Confirm green.
- Gate: full `npx jest` (all suites should still pass — no behavior change for Part-A-only paragraphs).
- Smoke test: run validator against §1.1.1 in `--mode part-a` (expect PASS), `--mode part-b` (expect FAIL until A-D land), `--mode complete` (expect FAIL until A-D land). Confirm error messages name the correct file.
- Commit: `fix(validator): exact filename match + per-mode review-file scoping + complete-mode FAIL aggregation (F2)`.

**Step 3 — F3: Implement quality-record schema; migrate §1.1.1.**

- Platform side:
  - Update `skills/econ-quality-control.md` to document schema version 2 with `partA:` and `companion:` blocks.
  - Update `agents/econ-companion-visual-review.md` "Quality log entries" / "closure proof" sections to instruct the agent to write into `companion:` of the YAML (additive; do not touch `partA:`).
  - Update `BUILD-PARAGRAPH.md` A7 + B-verify to reference the new schema.
  - Commit: `feat(quality-ref): schema v2 with partA: + companion: blocks; doc updates (F3a)`.
- Lessen side:
  - Migrate `1.1.1-quality-ref.yaml`: wrap existing keys in `partA:`, add `companion:` block (populated post-Bucket-A-D regen during E3).
  - Bump `schema_version: 2`.
  - Keep deprecated top-level mirrors during transition.
  - Commit: `content(1.1.1): migrate quality-ref to schema v2 (F3b / E1)`. **This commit is queued for E3 — it lands after Bucket A-D regen so `companion:` values are real, not placeholder.**

**Step 4 — F4: Update skill files where ownership unclear.**

- Edit skill frontmatter for the two leakage cases (§5.1):
  - `skills/econ-quality-control.md` — frontmatter description mentions partA + companion; add Part-A/Part-B/shared label.
  - `skills/aanpak-samenvattingen.md` — add scope note distinguishing chapter-level samenvatting from paragraph-level.
- Add explicit Part A / Part B / shared label to every skill frontmatter `description` (one keyword: `Pipeline: Part A`, `Pipeline: Part B`, `Pipeline: Shared`).
- Update `skills/econ-companion-artifacts.md` cross-reference list to call out that per-format skills inherit (already done, verify).
- Gate: no jest impact. Manual review of skill descriptions for consistency.
- Commit: `docs(skills): add Part A / Part B / shared pipeline labels to skill frontmatter (F4)`.

**Step 5 — F5: Adjust agents/README.md + cross-references.**

- Update `agents/README.md`:
  - Add a "Pipeline scope" column to the agents table indicating Part A / Part B / shared.
  - Currently only one agent (`econ-companion-visual-review`); label it Part B.
  - Note that Part A's reviewer is a skill (`econ-paragraph-review`), not an agent file. Document the asymmetry plainly.
- Update cross-refs in `econ-companion-artifacts.md` if the F1 restructure changed anchor names in `BUILD-PARAGRAPH.md`.
- Commit: `docs(agents): add pipeline-scope column to agents/README.md (F5)`.

**Step 6 — F6: Update CLAUDE.md (project-level) and AGENTS.md "Quality control" sections.**

- Edit project-level `C:/Projects/4veco/CLAUDE.md`:
  - Update the "Werkwijze" table row for "Content bouwen (paragraaf)" to include the Part A / Part B / complete distinction.
  - Update "Kwaliteitsregels" to reference the new validator modes and quality-record schema.
- Edit `4veco-platform-companion/AGENTS.md`:
  - Add a "Quality control" subsection documenting the four validator modes, the two review files, the quality-record schema, and the agent cadence.
  - Cross-link to BUILD-PARAGRAPH.md, agents/README.md, skills/econ-quality-control.md, agents/econ-companion-visual-review.md.
- Commit: `docs(quality-control): document Part A / Part B pipeline, validator modes, review files, schema (F6)`.

**Step 7 — F-tests: reorganise tests by pipeline (proposed addition to F1-F6).**

- `git mv` engines/tests/*.test.js into engines/tests/part-b/ + engines/tests/shared/ per §6.4.
- `git mv` scripts/tests/validate-chapter.test.js into scripts/tests/part-a/.
- Update any path references inside tests (none expected; `__dirname` is used in the existing `validate-paragraph.test.js`).
- Run full `npx jest` to confirm nothing breaks.
- Commit: `chore(tests): reorganise test suites by Part A / Part B / shared (F-tests)`.

This step is lighter than F1-F6. **Default decision: include F-tests in F-execute** because (a) the new tests already need a home (engines/tests/part-b/), (b) reorganising 14 files is a git mv batch, and (c) it locks in the taxonomy. User can drop if undesired.

**Step 8 — F-verify (end-to-end on §1.1.1).**

- After Buckets A-D land and after F1-F6 + F-tests land:
  - Run `node scripts/validate-paragraph.js "<§1.1.1 path>" --mode part-a`. Expect PASS.
  - Run `node scripts/validate-paragraph.js "<§1.1.1 path>" --mode part-b`. Expect PASS.
  - Run `node scripts/validate-paragraph.js "<§1.1.1 path>" --mode complete`. Expect PASS.
  - Run `npm test`. Expect PASS.
  - Run `npm run check:book`. Expect PASS.
  - Re-run the companion visual review agent on §1.1.1 voorkennis + vaardigheden. Expect verdict PASS or PASS WITH FLAGS, no hard fails. Overwrite `1.1.1-companion-visual-review.md`.
  - Spot-check `1.1.1-quality-ref.yaml` schema_version: 2 with both `partA:` and `companion:` blocks populated.
- Optional regression: inject one HF defect (e.g. revert A1's COMPANION VISUAL strip), re-run validator complete mode → expect FAIL with companion review file named in error → revert.
- Save report to `docs/L1.5V/F-verify-1.1.1.md`.
- Commit (lessen-side): `docs(L1.5V): F-verify report + closure proof for 1.1.1 pilot (F-verify)`.

### 7.2 What NOT to do in F migration

- **Do not move generated lesson files into Part A / Part B subfolders.** The flat layout is canonical; physical reorganisation of the lessen tree is an explicit user decision, not an F-plan default. Roadmap line 818-820 explicitly defaults this off.
- **Do not bump quality-record schema_version twice.** Bump once to 2 in F3.
- **Do not retire the deprecated top-level YAML keys yet.** Leave them mirrored during the transition window. A separate cleanup task (out of scope for L1.5V) removes them once paragraph 2 is also on schema v2.
- **Do not change `econ-paragraph-review` skill or rename `X.Y.Z-review.md` filename.** Those are stable Part A surfaces.
- **Do not introduce a Part A reviewer agent in `agents/`.** Part A's reviewer remains a skill (`econ-paragraph-review`). Asymmetry is documented in F5 but not "fixed" by inventing a parallel agent.

### 7.3 Step ordering matrix

| Step | Side | Depends on | Blocks |
|---|---|---|---|
| F1 (BUILD-PARAGRAPH.md restructure) | platform | none | F4 (anchor refs), F5, F6 |
| F2 (validator) | platform | none | F-verify |
| F3a (skill + agent docs for schema) | platform | F1 (anchor stability) | F3b |
| F3b (lessen-side §1.1.1 YAML migration) | lessen | F3a + Buckets A-D regen | F-verify |
| F4 (skill frontmatter labels) | platform | F1 | F-verify |
| F5 (agents/README.md) | platform | F1 | F-verify |
| F6 (CLAUDE.md + AGENTS.md QC section) | platform | F1, F2, F3a, F4, F5 | F-verify |
| F-tests (folder reorg) | platform | none (parallelisable with F1-F6) | F-verify |
| F-verify (end-to-end on §1.1.1) | both | all of A-D + F1-F6 + F-tests + F3b | sprint closure |

### 7.4 How to validate the migration is clean

After F-verify:

1. **No broken cross-references.** Grep for `BUILD-PARAGRAPH.md#` in skills/, agents/, AGENTS.md, CLAUDE.md, agents/README.md. All anchors must resolve.
2. **No skill missing a pipeline label.** Grep skills/*.md frontmatter; all must have `Pipeline: ...` label.
3. **No quality-ref reader breaks on schema v2.** Manually read `1.1.1-quality-ref.yaml` post-migration; confirm validator (which reads it) passes.
4. **No test moved without its imports updating.** `npm test` green.
5. **§1.1.1 passes all three validator modes.**
6. **Companion review file is regenerated, not stale.** `last_reviewed` field in YAML matches actual review file timestamp.
7. **No leakage in BUILD-PARAGRAPH.md.** A second-pass scan: every section under "Part A:" header is Part-A scope; every section under "Part B:" header is Part-B scope; "Common pre-conditions" applies to both.

---

## 8. Default decisions taken

The user can override any of these. Listed in order of impact, highest first.

1. **Final shape of `BUILD-PARAGRAPH.md`: option (a) — single file, three top-level sections (Common / Part A / Part B).** Default per roadmap; concrete TOC in §2.3.
2. **Quality-record schema: option (a) — single file, two top-level sections (`partA:` + `companion:`).** Default per E1; full schema in §4.3.
3. **Validator behaviour: enforce exact-filename match; aggregate `complete` mode FAILs from both review files.** Resolves finding 0.6 directly.
4. **Validator failure on missing companion review in `--mode part-b` / `--mode complete`: hard fail, no skip flag.** Migration window for §1.1.1 is short enough that allow-missing complicates more than it simplifies.
5. **Verdict parsing: structured (look for `## Verdict` block + `**FAIL/PASS/PASS WITH FLAGS**` marker). Fall back to HF-* count. `\bFAIL\b` regex retired.**
6. **Test taxonomy: lightweight folder grouping (engines/tests/part-b/, engines/tests/shared/, scripts/tests/part-a/, scripts/tests/shared/).** No Jest projects config. Concrete reorganisation in §6.4.
7. **Skill ownership labels: every skill frontmatter gets a `Pipeline: Part A | Part B | Shared` label.** New convention.
8. **Skill leakage handling: `econ-quality-control` becomes shared infrastructure with extended schema; `aanpak-samenvattingen` gets a scope note distinguishing chapter-level from paragraph-level samenvatting.**
9. **Agent ownership: Part A reviewer stays as a skill (`econ-paragraph-review`); no parallel `agents/econ-paragraph-review.md` is created. Asymmetry documented, not fixed.**
10. **Lessen-tree physical layout: NOT reorganised. Flat per-paragraph layout stays. No `Voorbereiden/` `Leren/` `Oefenen/` subfolders. Explicit decision per roadmap line 818-820.**
11. **Schema version policy: bump to `schema_version: 2` once, in F3. Deprecated top-level keys mirrored for one transition window (until paragraph 2 ships on schema v2).**
12. **§1.1.1 only — older paragraphs out of scope. L1.4 paragraph 2 inherits.** Per roadmap line 839-840.
13. **No new Part A or Part B producer skills introduced in F.** New skills are out of scope; F is restructure + clarity.
14. **F-tests (test folder reorg) included in F-execute scope.** User can drop. Default include because new tests are already arriving in Buckets A-D and need a home.
15. **No CHAPTER-side restructure.** `BUILD-CHAPTER.md` stays Part A only; one-line scope statement added at top, no other change.

---

## 9. What F-execute will commit

Per §7 step list, planned commits in execution order. F1-F6 are platform-side (companion worktree). F3b and F-verify reports are lessen-side.

| # | Commit message | Side | Files |
|---|---|---|---|
| F1 | `docs(L1.5V): restructure BUILD-PARAGRAPH.md to Part A / Part B / Common shape` | platform | `BUILD-PARAGRAPH.md`, `BUILD-CHAPTER.md` (one-line scope tag), `AGENTS.md` (Read first block), `agents/README.md` (cross-ref), `skills/*.md` (anchor refs only if any break) |
| F2 | `fix(validator): exact filename match + per-mode review-file scoping + complete-mode FAIL aggregation` | platform | `scripts/validate-paragraph.js`, `scripts/tests/validate-paragraph-modes.test.js` (new), possibly `scripts/tests/validate-paragraph.test.js` (additional cases) |
| F3a | `feat(quality-ref): schema v2 with partA: + companion: blocks; doc updates` | platform | `skills/econ-quality-control.md`, `agents/econ-companion-visual-review.md` (Quality log instruction), `BUILD-PARAGRAPH.md` A7 + B-verify references |
| F3b | `content(1.1.1): migrate quality-ref to schema v2 + populate companion: post-regen` | lessen | `Boek 1 .../1.1.1.../1.1.1-quality-ref.yaml` (queued for E3) |
| F4 | `docs(skills): add Part A / Part B / Shared pipeline labels to all skill frontmatter; resolve econ-quality-control + aanpak-samenvattingen scope leakage` | platform | every file in `skills/*.md` (frontmatter only) |
| F5 | `docs(agents): add pipeline-scope column to agents/README.md` | platform | `agents/README.md` |
| F6 | `docs(quality-control): document Part A / Part B pipeline, validator modes, review files, schema in CLAUDE.md + AGENTS.md` | platform | `4veco-platform-companion/AGENTS.md` (Quality control section), `C:/Projects/4veco/CLAUDE.md` (Werkwijze + Kwaliteitsregels) |
| F-tests | `chore(tests): reorganise test suites by Part A / Part B / Shared` | platform | git mv `engines/tests/*.test.js` → `engines/tests/{part-b,shared}/`; `scripts/tests/validate-chapter.test.js` → `scripts/tests/part-a/`; `scripts/tests/{check-book,validate-paragraph,validate-paragraph-modes}.test.js` → `scripts/tests/shared/` |
| F-verify | `docs(L1.5V): F-verify report + closure proof for 1.1.1 pilot` | lessen (reports/) or platform (docs/L1.5V/) | `docs/L1.5V/F-verify-1.1.1.md` |

Total: 8 commits in F-execute (F1, F2, F3a, F4, F5, F6, F-tests, F-verify) + 1 lessen-side commit (F3b, queued for E3).

If a commit grows above ~400 lines of diff, split it. Risk-flagged: F1 may be large because of the BUILD-PARAGRAPH.md restructure and the cross-references.

---

## 10. Cross-repo coordination

Two repositories are touched: `4veco-platform-companion` (worktree on platform branch `content/1.1.1-companion-quality`) and `4veco-lessen` (no branch; main is the working surface).

### 10.1 Order of pushes

1. **Platform-side commits (F1, F2, F3a, F4, F5, F6, F-tests) all land first** as part of the L1.5V PR to platform main.
2. After PR merge:
   - Run `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` to redeploy any platform changes to the lessen tree.
   - Regenerate §1.1.1 companions (this is part of E3 / F-verify, not pure F).
3. **Lessen-side commit F3b lands after** the platform PR is merged AND Buckets A-D regen has produced the post-fix surfaces, AND the companion review agent has been re-run, AND the resulting verdict is PASS or PASS WITH FLAGS.
4. **F-verify report commit lands last.** Goes either platform-side (in `docs/L1.5V/`) or lessen-side (under a reports folder); recommend platform-side because it documents platform behaviour.

### 10.2 Boundary rules

- **Never co-mix platform and lessen edits in one commit.** Each commit lives entirely in one repo.
- **Never push a lessen-side commit referencing platform behaviour that hasn't shipped.** The F3b YAML schema bump must follow F3a's documentation update.
- **Validator changes (F2) must not break existing lessen-side validator runs.** Specifically: §1.1.1 today FAILs `--mode complete` because of the buggy match. After F2, it should still FAIL (because the companion review file genuinely says FAIL pre-A-D regen). The error message just becomes accurate. Don't ship F2 in a way that makes pre-regen §1.1.1 spuriously pass.

### 10.3 Other paragraphs / other books

- Module 3 paragraphs are out of scope (frozen until Sept 2026 per CLAUDE.md). Do not regenerate; do not run validator against them as part of F-verify.
- L1.4 (paragraph 2 / §1.1.2) is out of scope for L1.5V. F-verify only proves §1.1.1.
- Other Book-1 paragraphs that get caught by deploy regen: confirm none are in flight. Today only §1.1.1 is a complete Part B. Other paragraphs are Part A only or empty. No spillover risk.

### 10.4 Rollback path

If F-verify fails:

1. Revert F-tests (folder moves) — easy, single git revert.
2. Revert F6, F5, F4 — doc-only, easy.
3. Revert F3a — doc-only, easy.
4. Revert F2 — code revert; validator returns to current buggy state, which is the baseline.
5. Revert F1 — doc-only.
6. Lessen side: revert F3b YAML migration (single file).

No data loss; all reverts are file edits, not deletions.

---

## 11. Contradictions and follow-ups surfaced

Per the constraint to surface contradictions explicitly, not silently choose:

1. **Roadmap claim "validate-paragraph.js ALREADY reads `*-companion-visual-review.md` and FAILs the paragraph if the verdict is FAIL" vs. actual code.** Roadmap implies designed integration. Actual code (lines 343-350) integrates by accident through a buggy filename match. F2 resolves the validator side; the roadmap text should be edited as a follow-up (out of F scope; queue for editor).

2. **`BUILD-PARAGRAPH.md` and `AGENTS.md` reference paths under `C:\Projects\4veco\4veco-platform\` (not `4veco-platform-companion`).** This is correct from the perspective of platform main; the companion worktree is ephemeral and merges back to platform main. F1 may surface stale absolute paths during the cross-reference scrub. **Follow-up:** confirm during F1 that path references either are unchanged or are corrected to relative paths.

3. **Phase 5a-5c naming.** Today says "If running Part B only (textbook content already exists), run these QC steps now". The wording works but the rename in F1 ("textbook QC backfill (Part B only when Part A skipped)") should be reviewed by the user — there's a small risk that shortening obscures intent.

4. **`econ-paragraph-review` is a skill, not an agent.** Asymmetric with `econ-companion-visual-review.md` which lives in `agents/`. F5 documents this asymmetry; does not "fix" it. **Follow-up (out of F scope):** if the team wants symmetry, promote `econ-paragraph-review` to a parallel `agents/econ-paragraph-review.md` file. Recommend deferring to a separate sprint; it touches Part A QC stability, which has been clean.

5. **Schema v2 deprecation window length.** F3 keeps top-level keys mirrored "for one transition window". The plan says "until paragraph 2 is also on schema v2". That's a soft deadline. **Follow-up:** when L1.4 ships, schedule a tiny cleanup commit removing the deprecated mirrors.

6. **`aanpak-samenvattingen` skill names a Part A artifact, not the paragraph-level Part B file #10.** Surface scope explicitly in F4. The Part-B paragraph-level samenvatting has no dedicated skill — it's built via reference scripts. This is documented in `BUILD-PARAGRAPH.md` B4 but not surfaced in the skill catalog. **Follow-up:** consider promoting the reference script's role into a `econ-paragraph-samenvatting` Part B producer skill in a later sprint.

7. **Test reorg: existing `_wiskundevaardigheden-template.html` and `harness-skilltree-ui.html` are not test files but live in `engines/tests/`.** F-tests proposal keeps them at the top level. This is a small inconsistency and is explicitly accepted in §6.4. **Follow-up:** none recommended.

---

## 12. Closing notes

This proposal answers all seven questions from the roadmap and the whole-sprint plan.

The F-execute that follows after user approval is bounded:
- 7 platform-side commits (F1, F2, F3a, F4, F5, F6, F-tests)
- 1 lessen-side commit (F3b, queued for E3)
- 1 closure-proof commit (F-verify)

§1.1.1 is the only paragraph touched. §1.1.1 must pass `--mode complete` after the full sprint (Buckets A-D + F + verification regen) lands.

**F-plan delivers and STOPS here.** F-execute is gated on user approval of:
- option (a) for `BUILD-PARAGRAPH.md` shape;
- option (a) for quality-record schema;
- the eight commits planned;
- inclusion of F-tests in F-execute scope;
- the cross-repo push order in §10.1.

If the user prefers any alternative (e.g. option (b) for either shape question, Jest projects instead of folder grouping, drop F-tests from execute scope, etc.), the relevant section is ready to swap.
