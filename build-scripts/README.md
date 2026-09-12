# Build Scripts

This folder contains all production scripts used to turn source material into the rich paragraph outputs that appear in lesson targets.

For textbook work start with the [Part A checklist](../docs/workflows/part-a-start.md); for companion work use the [Part B runbook](../docs/workflows/web-companion-paragraph-lane.md). [BUILD-PARAGRAPH.md](../BUILD-PARAGRAPH.md) covers complete cross-lane verification.

To retrieve an unchanged paragraph PDF edition without renewing its review,
use the [committed-edition compatibility route](../docs/workflows/part-a-review.md#reproducing-an-existing-edition).
New or changed material still needs current review evidence.

The strategic product direction lives in
`../4veco-lessen/specifications/product-vision.md`; the operational product
north star lives in `../4veco-lessen/specifications/product-end-state.md`.
Every generated paragraph route should move students from current readiness to
target-exercise readiness. Generator, engine, and deploy changes should
preserve that end state or name the follow-up sprint that restores it.

Paragraph landing V2 is prototype-owned. `platform/build-landing-page.js` must
use `references/ui/paragraph-landing-v2/approved-light.html` and
`references/ui/paragraph-landing-v2/approved-dark.html` as the visual baseline
for generated paragraph landing pages, with the lesson-side contract in
`../4veco-lessen/specifications/paragraph-landing-layout-v2.md`. Do not rebuild
paragraph landing pages from the old lesson shell, old shared `voorkennis.css`
layout, or legacy resource-card paragraph renderer.

Chapter Landing V2 Minimal Navigation is also prototype-owned. Chapter pages
must use `references/ui/chapter-landing-v2/approved-minimal.html` as the visual
baseline, but generated paragraph cards must show neutral `Paragraaf N` /
`Lesroute` labels instead of fallback aspect/domain labels. Chapter pages are
navigation/orientation only: paragraph route rows, checks, games, textbook
links, and other companion resources remain on paragraph landing pages.

Book Landing V2 Minimal Navigation is fixture-owned one level higher. Book
pages must use `references/ui/book-landing-v2/approved-minimal.html` as the
visual baseline, and generated chapter cards must show neutral `Hoofdstuk N` /
`Hoofdstukroute` labels instead of fallback aspect/domain labels. Book pages are
navigation/orientation only: they link to chapter landing pages, not directly to
paragraph pages, route rows, checks, games, textbook links, or other companion
resources.

Sprint plans and active roadmaps must also pass scope-language discipline:

```bash
node build-scripts/sprints/check-scope-language.js --active
```

Use bounded-scope wording by default. Restricted scope terms require an
explicit authorization section that preserves the full quality floor and names
the follow-up or waiver for any omitted specification requirement.

## Folder Layout

```
build-scripts/
├── platform/       core platform generators (used by scripts/deploy.js)
├── lib/            shared libraries, converters, verifiers
├── templates/      reusable scaffolds to copy when starting a new paragraph
├── content/
│   ├── book-1/     paragraph-specific builders for Book 1 and onward
│   └── legacy-target/ legacy paragraph-specific builders kept as references
└── archive/        legacy / one-off scripts kept for reference
```

The split is: **`platform/`, `lib/`, `templates/` are the reusable core** — they rarely change per paragraph. **`content/` is the per-paragraph material** — each `.js` file is effectively content that happens to live in script form.

## Output Convention

Intermediate build artifacts (pptx, svg, png) go to `output/{paragraph-code}/` at the repo root — e.g. `output/3.3.1/` for §3.3.1 and `output/3.4.2/` for §3.4.2. The whole `/output/` tree is gitignored; scripts may overwrite it freely. Final deployable artifacts still land inside the module repos via `scripts/deploy.js`.

## Script Types

## Output Profiles

New paragraph work uses two operational lanes: Part A / textbook and Part B /
companion / student-web companion. `student-web` below is a validator profile
name, not a separate lane. Use the validator profiles instead of assuming every
build must emit every Office or print artifact:

```bash
node scripts/validate-paragraph.js --mode part-a --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode part-b --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode complete --profile student-web "<paragraph>"
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "<paragraph>"
```

- `student-web` is the baseline validation profile for paragraph 1.1.2 and
  later. In Part A mode it checks textbook source, textbook HTML renders,
  `build_pdf.py`, and the complete paragraph PDF packet for human review. In
  Part B mode it checks companion/student-web HTML, games, presentation
  HTML/PPTX, plans, reviews, data, and assets without requiring DOCX. The
  14-file Part B baseline is not proof that the full
  `Start -> Leer -> Check -> Oefen -> Exit ticket` route is complete; rendered
  review must also inspect the advisory short check and separate
  target-equivalent exit ticket.
- `office` is opt-in when DOCX exports are explicitly requested.
- `legacy-full` checks the older 27-file companion contract. See the opt-in
  Part B [legacy-full companion profile](../docs/workflows/legacy-full-companion-profile.md).
  It does not create a third lane and does not prove the complete product route.
- `publisher-print` keeps the Part A chapter/book print-handoff and book-health
  gate explicit. Paragraph PDFs are already normal Part A human-review output.

### 1. Platform Generators — `platform/`

Reusable scripts that generate the automated layer. These are what `scripts/deploy.js` invokes.

| Script | Purpose |
|--------|---------|
| `platform/generate-quiz-shells.js` | Quiz HTML shells from quiz data files |
| `platform/build-newsdetective-shells.js` | Nieuws-detective HTML shells |
| `platform/build-reasoning-engine.js` | Reasoning game HTML shells |
| `platform/build-reasoning-questions.js` | Reasoning CSV → `shared/reasoning/*.js` |
| `platform/build-skilltree-shells.js` | Skilltree data + HTML shells |
| `platform/build-procedure-shells.js` | Procedure HTML shells |
| `platform/build-graphical-shells.js` | Graphical-game HTML shells |
| `platform/build-landing-page.js` | `index.html` at paragraph/chapter/module level |
| `platform/build-single-page-nav.js` | Single-page navigation for GitHub Pages |

Use when the source already exists as structured data and the output should be fully reproducible.

### 2. Shared Libraries, Profile-Gated Converters, Verifiers — `lib/`

| File | Role |
|------|------|
| `lib/lib-pptx.js` | Palettes, typography, slide masters, SVG pipeline, LibreOffice round-trip |
| `lib/lib-svg-utils.js` | SVG→PNG pipeline + graph color palette |
| `lib/lib-svg-save.js` | Simple SVG file writer used by presentation builders |
| `lib/lib-begeleide-inoefening.js` | Shared document builders for begeleide inoefening |
| `lib/convert_voorkennis.py` | Office/legacy converter: `uitleg voorkennis.docx` → HTML |
| `lib/convert_vaardigheden.py` | Office/legacy converter: `uitleg vaardigheden.docx` → HTML |
| `lib/convert_begeleide_inoefening.py` | Office/legacy converter: vragen + antwoorden `.docx` → HTML |
| `lib/verify_svg_geometry.py` | Checks supported linear-curve coordinates; use it or an equivalent actual-figure check and recheck affected geometry after edits ([graph requirements](../skills/economic-graph.md#verify-and-deliver)) |

`lib-*.js` files are imported by content scripts. Converters and the verifier are invoked standalone.

### 3. Templates — `templates/`

Starting points for new paragraph builders.

| File | Use |
|------|-----|
| `templates/template-A_vaardigheden.js` | Scaffold for `uitleg vaardigheden.docx` builder |
| `templates/template-B_voorkennis.js` | Scaffold for `uitleg voorkennis.docx` builder |
| `templates/template-paragraph-plan.md` | Copy into paragraph folder as `_paragraph-plan.md` during Phase 4a |

### 4. Content — `content/book-N/`, `content/legacy-target/`

Paragraph-specific builders. Each `.js` file builds a single asset (presentatie, voorkennis, vaardigheden, nieuws, inoefening, opgaven, samenvatting) for one paragraph. Naming:

- `content/book-1/b1-XYZ-<asset>.js` — Book 1 builder for paragraph 1.X.Y
- `content/legacy-target/<asset>-XYZ-<slug>.js` — legacy reference builders kept for older material

When starting a new paragraph, copy the closest existing builder from the corresponding `content/` subfolder, replace the content section, and run. New book work should prefer `content/book-N/`.

### 5. Archive — `archive/`

The completed one-off utilities `extract-all-antwoorden.py`, `extract-quiz-data.js`,
`fix-emoji.py`, and `restyle-instapquiz.js` were retired on 2026-09-09 and remain
recoverable from Git history. The archive retains its README and `roundtrip-pptx.py`.
The exported `roundtripWithPythonPptx()` wrapper in `lib/lib-pptx.js` still targets
the absent `lib/roundtrip-pptx.py`; retain the archived helper until that existing
inconsistency is deliberately resolved. The active LibreOffice roundtrip is
separate. See `archive/README.md` for the retention policy.

## How To Use This Folder

### Building the automated layer

```bash
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

This handles engine copy, shell generation (via `platform/`), landing pages, and validation.

### Building a complete paragraph

Follow [BUILD-PARAGRAPH.md](../BUILD-PARAGRAPH.md). Scripts are used in this order:

1. Create or update structured game data (CSV / JS data files)
2. Run platform generators (usually via `deploy.js`)
3. **Phase 2a**: Create `_paragraph-plan.md` from `templates/template-paragraph-plan.md`
4. **Phase 4a**: Build shared visual concepts and surface variants in `_assets/` using `lib/lib-svg-utils.js`
5. **Phase 4b**: Copy the closest `content/book-N/...` or legacy reference builder, adapt, run
6. For Office/legacy profile work only, run converters (`lib/convert_*.py`) for Word-source HTML versions; normal Part B companion/student-web work should prefer native HTML generators
7. Run `deploy.js`
8. Verify output

## Conventions

- Reusable scripts (`platform/`, `lib/`, `templates/`) should include a `HOW TO ADAPT` header.
- Content scripts (`content/`) should have paragraph-specific content in clearly marked sections.
- Shared libraries should be imported, not copied.
- If a script is archival or paragraph-specific, say that explicitly in the header comments.

## Scope Reminder

`deploy.js` does not build the full rich paragraph by itself. It does not create:

- presentaties
- uitleg voorkennis docx
- uitleg vaardigheden docx
- nieuws met visual
- samenvattingen
- begeleide inoefeningen
- opgavensets
- YouTube pages

Those still require paragraph-specific content work first, using the `content/` builders as reference.

## Task completion

For engine changes, run the engine tests, deploy to the authorized target and
test in the browser. Run relevant validators after generation/deployment and
update the relevant roadmap sprint when production or platform state changes.

- Fetch/prune before final commit/push; resolve unexpected behind/diverged state.
- Before closing platform workflow/tooling PRs, run `npm run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD`.
  Lesson PRs use their lane runbook's scope check against the lesson repository;
  cross-lane exceptions must be machine-readable and reviewed.
- Run relevant validation and fix navigation when paths, roadmaps, reports,
  agents, skills, or review surfaces change: `npm.cmd run agent:index`,
  `node build-scripts/sprints/emit-url-index.js`, and `npm.cmd run dashboard:internal`
  when dashboard/roadmap state changes. Keep research maps, GitHub entry, URL
  index, and `reports/github-agent-index-*.md` useful for the real layout.
  For routine maintenance these generated indexes are advisory, and commit-ID
  freshness alone must not create an integration commit.
- For non-trivial work, commit and push validated changes to the task's normal remote branch unless
  the user asks to keep them local. Publish both repositories when both change.
  Do not leave a completed sprint/generated-output task dirty without reporting
  the exact status and blocker. Protected/product governance closure also runs
  `npm.cmd run finalization:freshness` for remote-main, ancestry, and policy hashes.
- For every mutating task, report worktree paths, branches, lock owner/agent ID, local SHAs, push state,
  PR URLs (or why none), and current `platform-ci / validate-platform` status
  when available. End every non-trivial response with the next action or precise remaining blocker.
- After every task, clean up task-owned temporary files. Use OS temp or a named task folder
  outside the repository for intermediates. Preserve reusable scripts in
  `build-scripts/` with a clear name and `HOW TO ADAPT` header.
