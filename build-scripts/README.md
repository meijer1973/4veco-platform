# Build Scripts

Reusable Node.js scripts for generating lesson materials. Each script implements a specific template from the `skills/` folder and can be adapted for any paragraph by changing the content data section.

## Purpose

When a task runs and produces scripts that can be reused for similar tasks, those scripts go here. This avoids rebuilding from scratch every time we generate materials for a new paragraph.

## How to use

1. Copy the relevant script for your document type
2. Change the **content data section** (marked with `════` separators) — this is where paragraph-specific text lives
3. Update the **output path** to point to the correct paragraph folder
4. Run with: `NODE_PATH="$(npm root -g)" node <script>.js`

## Available scripts

| Script | Template | Generates |
|--------|----------|-----------|
| `template-B_voorkennis.js` | econ-word-templates Template B | `X.X.X [Naam] – uitleg voorkennis.docx` |
| `template-A_vaardigheden.js` | econ-word-templates Template A | `X.X.X [Naam] – uitleg vaardigheden.docx` |
| `pptx-template_presentatie.js` | econ-pptx-templates | `X.X.X [Naam] – presentatie.pptx` |

## Conventions

- Scripts are named `template-{letter}_{doctype}.js` for Word documents
- Scripts are named `pptx-template_{doctype}.js` for PowerPoint
- The content data section is clearly separated from the template infrastructure
- All scripts self-verify: they check the output directory exists and report file size
- All scripts use the shared color palette and component library from the skills

## Notes

- The nieuws (Template C) script was not preserved but follows the same pattern — the key components are `titleBlock()`, `QUESTION_NUMBERING`, tight margins (`PAGE_TIGHT`), and image extraction from existing docx
- Opgaven files use custom styles from the textbook source and don't currently need build scripts
