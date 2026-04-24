# Platform Team Plan: Book 1 Companion MVP Bootstrap

Generated: 2026-04-23  
Updated: 2026-04-23 after executing Sprint P1.1  
Owner: Platform team  
Scope: make the first flat-layout Part B MVP paragraph executable for Book 1 without pushing platform-bootstrap work onto the lessen team

## Purpose

Sprint 0.5 is green for Part A textbook/book production. The next platform-side job is narrower than "build companions":

> Bootstrap Book 1 so the lessen team can build the first real Part B MVP paragraph cleanly.

This plan is specifically about the platform-owned blockers confirmed during the 1.1.1 Part B clarity audit.

## Goal

After this plan is complete, the lessen team should be able to start the first Book 1 companion paragraph with:

- a valid Book 1 `deploy-config.json`
- the expected Book 1 `shared/` tree
- the expected platform-side Book 1 script/data directories
- a corrected `BUILD-PARAGRAPH.md` sequence for Part B
- a documented source path for the static "Lees dit..." file

This plan does **not** promise that the full companion pipeline is already proven. It makes the first MVP build possible without platform ambiguity.

## Status

Bootstrap status: complete. Proof sprint status: complete for the first MVP paragraph.

Completed:

- `BUILD-PARAGRAPH.md` now contains the Book 1 first-time setup guidance and the corrected ordering around `_paragraph-plan.md` and procedure data.
- Book 1 now has a book-root `deploy-config.json`.
- Book 1 now has a book-root `shared/` tree.
- `build-scripts/content/book-1/` now exists.
- `source-data/book-1/reasoning/` now exists.
- the static `Lees dit als je niet weet hoe je moet beginnen met deze les.docx` source path is documented and the file has been seeded into `1.1.1`.
- `loadConfig()` for Book 1 passes.
- `validate-paragraph.js --mode complete` for `1.1.1` passes.
- `scripts/deploy.js` now runs cleanly against Book 1, including link checks and data tests.
- the flat-layout converters for voorkennis, vaardigheden, and begeleide inoefening now support Book 1 root-level companion files.

Resolved during proof sprint:

- `scripts/deploy.js` behaves cleanly and repeatably against Book 1 during real MVP work
- the remaining Part B failures for `1.1.1` were platform-owned until fixed, and no platform blockers remain after the proof run
- one complete paragraph can pass `validate-paragraph.js --mode complete`

## Original Blockers (Now Resolved)

These were the platform-owned bootstrap blockers confirmed in the repo:

1. Book 1 has no `deploy-config.json` at the book root.
2. Book 1 has no `shared/` tree at the book root.
3. `build-scripts/content/book-1/` does not exist.
4. `source-data/book-1/reasoning/` does not exist.
5. `BUILD-PARAGRAPH.md` has an ordering ambiguity between Phase 3 procedure data and Phase 4a paragraph planning.
6. `BUILD-PARAGRAPH.md` references first-run seeding of the static "Lees dit..." file but does not give the actual legacy source path.

Important nuance:

- Running `scripts/deploy.js` is **not** a read-only verification step. It writes engine files into `<book>/shared/` before later build stages run.

## What The Platform Team Owns

- Book-root deploy/config plumbing
- shared directory bootstrap
- platform-side script/data directory bootstrap
- Part B pipeline documentation clarity
- validation/deploy assumptions for the first MVP paragraph

## What The Platform Team Does Not Own

- the actual `_paragraph-plan.md` for 1.1.1
- the skilltree mapping decision for 1.1.1 as a teaching choice
- writing quiz/newsdetective/reasoning/procedure content
- writing docx/pptx/HTML companion content

Those stay with the lessen team once the bootstrap is in place.

## Remaining Platform Questions

The bootstrap layer is now in place. The platform-side question has narrowed to:

> Is the Book 1 companion path stable under real MVP use, or does `1.1.1` still reveal platform-owned defects?

The next phase is therefore not "create the floor" but "prove the floor."

## Deliverables

### Deliverable A: Docs Patch

Status: complete.

Patch `BUILD-PARAGRAPH.md` so the first Book 1 Part B run is not ambiguous.

Required doc changes:

- Add a first-time bootstrap section for Book 1 companion work.
- State explicitly that Book 1 must have:
  - book-root `deploy-config.json`
  - book-root `shared/`
  - `build-scripts/content/book-1/`
  - `source-data/book-1/reasoning/`
- Fix the Phase 3 / Phase 4a ordering:
  - `_paragraph-plan.md` must exist before authoring procedure data
  - procedure data should be copied from canonical unit procedures, not re-authored ad hoc
- Add the real source path for the static "Lees dit..." file
- Clarify that `scripts/deploy.js` writes to the target and is not a read-only probe

### Deliverable B: Book 1 Bootstrap

Status: complete.

Bootstrap the Book 1 target at:

`C:\Projects\4veco\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod`

Required filesystem state:

- `deploy-config.json` exists at the book root
- `shared/` exists at the book root with:
  - `questions/`
  - `reasoning/`
  - `newsdetective/`
  - `procedure/`
  - `skilltree/`

Manifest minimum for first MVP:

- chapter `1.1`
- paragraph `1.1.1`
- correct flat-layout chapter folder name
- paragraph entry that resolves to the existing 1.1.1 folder

Note:

- The skilltree declaration may be left for a joint decision with the lessen team if needed, but the manifest itself must exist and be structurally valid.

### Deliverable C: Platform Repo Bootstrap

Status: complete.

Create the Book 1 platform-side directories:

- `build-scripts/content/book-1/`
- `source-data/book-1/reasoning/`

Optional but recommended:

- add a small README or placeholder note in each so the intended use is obvious

### Deliverable D: Proof Sprint Support

Status: complete.

Support the first MVP paragraph until the remaining failures are clearly separated into:

- platform-owned defects
- lessen-team content/data work

Exit criteria:

- Book 1 deploy/generator behavior is stable under real use
- the platform bootstrap no longer hides any structural surprises
- the roadmap can move from "bootstrap" to "proof sprint" language

Observed result:

- `check:platform` passes
- `check:book` passes
- `1.1.1` passes `validate-paragraph.js --mode complete`
- `scripts/deploy.js` passes its link and data verification against Book 1

## Work Plan

### Step 1: Patch The Part B Spec

Status: complete.

Files:

- `BUILD-PARAGRAPH.md`

Changes:

- add "first-time Book 1 setup" section
- fix ordering so planning precedes procedure-data authoring
- tell builders to copy canonical `procedure` arrays from `references/machine/micro-teaching-units.json`
- add the concrete static-file source path
- clarify deploy write behavior

Exit criteria:

- an agent reading `BUILD-PARAGRAPH.md` can distinguish bootstrap prerequisites from paragraph-level build work
- the procedure-data step no longer depends implicitly on future vaardigheden writing

### Step 2: Create The Book 1 Manifest

Status: complete.

Files:

- `..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\deploy-config.json`

Minimum contents:

- `nr`
- `name`
- `chapters`
- `paragraphs`
- valid chapter entry for `1.1`
- valid paragraph entry for `1.1.1`

Exit criteria:

- `loadConfig()` can parse Book 1 without error
- `findParagraphFolder("1.1.1")` resolves the existing paragraph folder

### Step 3: Create The Book 1 Shared Tree

Status: complete.

Path:

- `..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\shared\`

Create:

- `questions/`
- `reasoning/`
- `newsdetective/`
- `procedure/`
- `skilltree/`

Exit criteria:

- the target book has the expected flat-layout companion runtime structure
- later data files can be added without inventing folder structure on the fly

### Step 4: Create The Book 1 Platform Directories

Status: complete.

Paths:

- `build-scripts/content/book-1/`
- `source-data/book-1/reasoning/`

Exit criteria:

- Book 1 has a stable home for saved build scripts
- Book 1 reasoning CSVs have a stable home from the first MVP onward

### Step 5: Document The Static File Seed Path

Status: complete.

Document the concrete source path for:

- `Lees dit als je niet weet hoe je moet beginnen met deze les.docx`

Current verified legacy source:

- `C:\Projects\4veco\3-Module-3-rewire-test\3.1 Hoofdstuk 1 - Markten\3.1.1 Paragraaf 1 - Markt en marktstructuur\1. Voorbereiden\Lees dit als je niet weet hoe je moet beginnen met deze les.docx`

Exit criteria:

- first-time companion builders do not have to search the repo for the seed file

### Step 6: Validate The Bootstrap

Status: complete.

These checks have now been run successfully against the first Book 1 MVP paragraph.

Safe validation checks:

1. Manifest load check:

```powershell
node -e "const { loadConfig } = require('./build-scripts/lib/lib-deploy-config'); const cfg = loadConfig('../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod'); console.log(cfg.displayLabel); console.log(cfg.findParagraphFolder('1.1.1'));"
```

2. Paragraph proof check:

```powershell
node scripts\validate-paragraph.js --mode complete "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
```

Observed result:

- `1.1.1` passes complete mode
- one non-blocking orphan-asset warning remains for `1.1.1_news_woningtekort.svg`
- no bootstrap/platform assumptions block the paragraph anymore

3. Deploy proof check:

```powershell
node scripts\deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Observed result:

- deploy completes successfully
- link checks pass
- data tests pass

Exit criteria:

- the platform bootstrap no longer blocks the lessen team from starting the MVP paragraph
- the first MVP paragraph is now technically proven on the Book 1 path

Current observed state for `1.1.1`:

- `Lees dit...docx` is present
- `index.html` is present
- `wiskundevaardigheden.html` is present
- `shared/skilltree/1.1.1.js` is present
- all 24 required Part B files are present
- all required shared game-data files are present
- the paragraph passes complete-mode validation with one warning

## Recommended Ownership Split During Execution

### Platform Team Executes Now

- Keep the bootstrap layer stable
- verify `scripts/deploy.js` and validator behavior under real Book 1 MVP work
- fix platform-owned blockers surfaced by `1.1.1`

### Lessen Team Can Work In Parallel

- choose the MVP paragraph
- decide the skilltree mapping for 1.1.1
- prepare `_paragraph-plan.md`
- prepare the actual quiz/newsdetective/reasoning/procedure/docx/pptx content

### Handoff Point

The handoff happens when:

- the manifest exists
- the shared tree exists
- the Book 1 platform directories exist
- `BUILD-PARAGRAPH.md` is patched
- bootstrap validation passes

That handoff is now active and proven for the first MVP paragraph. The next platform-owned phase is repeatability and scale, not bootstrap creation.

At that point the lessen team should proceed with the first full Part B MVP build.

## Success Definition

This plan is successful when the following statement is true:

> The first Book 1 companion MVP paragraph no longer fails because the Book 1 platform/bootstrap layer is missing or ambiguous, and the Book 1 path is proven end-to-end for one real paragraph.

That is the right platform-team finish line for this phase.
