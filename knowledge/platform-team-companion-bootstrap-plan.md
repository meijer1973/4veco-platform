# Platform Team Plan: Book 1 Companion MVP Bootstrap

Generated: 2026-04-23  
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

## Confirmed Blockers

These are the platform-owned bootstrap blockers confirmed in the repo:

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

## Deliverables

### Deliverable A: Docs Patch

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

Create the Book 1 platform-side directories:

- `build-scripts/content/book-1/`
- `source-data/book-1/reasoning/`

Optional but recommended:

- add a small README or placeholder note in each so the intended use is obvious

## Work Plan

### Step 1: Patch The Part B Spec

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

Paths:

- `build-scripts/content/book-1/`
- `source-data/book-1/reasoning/`

Exit criteria:

- Book 1 has a stable home for saved build scripts
- Book 1 reasoning CSVs have a stable home from the first MVP onward

### Step 5: Document The Static File Seed Path

Document the concrete source path for:

- `Lees dit als je niet weet hoe je moet beginnen met deze les.docx`

Current verified legacy source:

- `C:\Projects\4veco\3-Module-3-rewire-test\3.1 Hoofdstuk 1 - Markten\3.1.1 Paragraaf 1 - Markt en marktstructuur\1. Voorbereiden\Lees dit als je niet weet hoe je moet beginnen met deze les.docx`

Exit criteria:

- first-time companion builders do not have to search the repo for the seed file

### Step 6: Validate The Bootstrap

Do these checks after the bootstrap is in place.

Safe validation checks:

1. Manifest load check:

```powershell
node -e "const { loadConfig } = require('./build-scripts/lib/lib-deploy-config'); const cfg = loadConfig('../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod'); console.log(cfg.displayLabel); console.log(cfg.findParagraphFolder('1.1.1'));"
```

2. Paragraph Part B/complete readiness check should still fail for content reasons, but not for missing book bootstrap:

```powershell
node scripts\validate-paragraph.js --mode part-b "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod\1.1 Hoofdstuk Economisch denken en rekenen\1.1.1 Schaarste en economisch denken"
```

Expected after bootstrap:

- still missing the 24 companion files
- still missing `_paragraph-plan.md`
- but no longer blocked by missing book-root setup assumptions

3. Optional deploy smoke test:

```powershell
node scripts\deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Use this only after the team accepts that it writes to the target.

Exit criteria:

- the platform bootstrap no longer blocks the lessen team from starting the MVP paragraph

## Recommended Ownership Split During Execution

### Platform Team Executes Now

- Step 1 through Step 6 in this plan

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

At that point the lessen team should proceed with the first full Part B MVP build.

## Success Definition

This plan is successful when the following statement is true:

> The first Book 1 companion MVP paragraph may still fail for real content-build reasons, but it will no longer fail because the Book 1 platform/bootstrap layer is missing or ambiguous.

That is the right platform-team finish line for this phase.
