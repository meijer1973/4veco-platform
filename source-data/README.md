# Source Data

This folder contains structured source inputs for the automated part of the paragraph pipeline.

Use [BUILD-PARAGRAPH.md](C:\Projects\4veco\4veco-platform\BUILD-PARAGRAPH.md) as the full production guide. This README only explains what belongs in `source-data/`.

## What Belongs Here

Store data here when:
- a script can generate output directly from structured input
- the format is stable enough to be reused across paragraphs
- the file is intended to be source-of-truth, not just a temporary working artifact

## Current Structured Inputs

### `book-1/reasoning/`

- One CSV per paragraph: `X.Y.Z.csv`
- Active source-of-truth location for Book 1 reasoning game data
- Consumed by `build-scripts/platform/build-reasoning-questions.js`
- Output becomes `shared/reasoning/X.Y.Z.js` in the target book

### `legacy-target/reasoning/`

- One CSV per paragraph: `X.Y.Z.csv`
- Source-of-truth for the reasoning game
- Consumed by `build-scripts/platform/build-reasoning-questions.js`
- Output becomes `shared/reasoning/X.Y.Z.js` in the frozen legacy target

### `legacy-target/skilltree/`

- One JS config per paragraph: `X.Y.Z.js`
- Source-of-truth for visible skills / paragraph skill mapping
- Used by `build-scripts/platform/build-skilltree-shells.js`
- Output becomes `shared/skilltree/X.Y.Z.js` plus the paragraph HTML shell in the frozen legacy target

## What Does Not Yet Live Here

These assets are part of a complete paragraph, but are not yet modeled as structured source-data files in this repo:

- quiz question source
- newsdetective source
- presentatie source
- uitleg voorkennis source
- uitleg vaardigheden source
- nieuws met visual source
- samenvatting source
- begeleide inoefening source
- opgaven source
- YouTube video source

For those assets, the current workflow is:
- write paragraph-specific content inside a reference script
- run the script to generate `.docx` or `.pptx`
- optionally run a converter to create `.html`

That is intentional for now: the repo currently has a mixed model of:
- structured source-data for the automated game layer
- paragraph-specific scripts for rich teaching documents

## Rule Of Thumb

If you are unsure where a new raw input should live:

- put it in `source-data/` if a reusable generator can consume it directly
- keep it in a paragraph-specific build script if the content still needs substantial authored structure and layout decisions

If a content type becomes stable and repetitive across multiple paragraphs, consider promoting it into a proper `source-data/` format plus generator.
