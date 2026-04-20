# `syllabus-eindtermen.json` Quality Review

Date: 2026-04-20

Scope: read-only review of [references/external/syllabus-eindtermen.json](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json) as the machine-readable syllabus register used for `exam_codes` validation. I also checked the stated contract in [build-scripts/references/extract-eindtermen.js](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-eindtermen.js:11) and [build-scripts/references/README.md](/C:/Projects/4veco/4veco-platform/build-scripts/references/README.md:41).

## Findings

1. Critical: extraction boundary errors make several entries non-canonical.

   The file is documented as the authoritative source for every `exam_codes` entry ([build-scripts/references/extract-eindtermen.js:11](/C:/Projects/4veco/4veco-platform/build-scripts/references/extract-eindtermen.js:11), [build-scripts/references/README.md:41](/C:/Projects/4veco/4veco-platform/build-scripts/references/README.md:41), [build-scripts/references/README.md:113](/C:/Projects/4veco/4veco-platform/build-scripts/references/README.md:113)), but multiple `tekst` fields visibly swallow content that belongs to later sections of the syllabus PDF.

   Evidence: `F2.4` includes the next domain heading inside its own text at [references/external/syllabus-eindtermen.json:995](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:995). `I2.3` swallows the full `I.3 Monetair beleid en de centrale bank` section at [references/external/syllabus-eindtermen.json:1655](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1655). `I4.6` swallows exam-regulation and appendix text starting with `4 HET CENTRAAL EXAMEN`, `BIJLAGE 1`, and `BIJLAGE 2` at [references/external/syllabus-eindtermen.json:1745](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1745).

   Impact: the JSON is syntactically valid, but it is not yet trustworthy as a canonical register. A validator can resolve a code and still attach the wrong syllabus text to it.

2. High: the dataset is incomplete because the entire `I3.*` block is missing.

   In the `I` domain, the code sequence jumps directly from `I2.3` at [references/external/syllabus-eindtermen.json:1650](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1650) to `I4.1` at [references/external/syllabus-eindtermen.json:1665](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1665). A read-only parse of the committed JSON found no `I3.*` entries at all.

   Impact: valid syllabus references in domain `I3` cannot resolve against this file, so completeness is currently below the level implied by its role in validation.

3. Medium: the cognitive metadata is too flattened to be reliable for downstream didactic use.

   Across 117 entries, the file uses only three unique verbs overall (`toepassen`, `herkennen`, `analyseren`), and only three entries carry `implied_bloom: "analyze"`: `D2.1`, `D2.2`, and `D2.3` at [references/external/syllabus-eindtermen.json:378](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:378), [392](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:392), and [406](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:406). Even `I4.6`, which is a large analytical model section, is still tagged `implied_bloom: "apply"` at [references/external/syllabus-eindtermen.json:1750](/C:/Projects/4veco/4veco-platform/references/external/syllabus-eindtermen.json:1750).

   Impact: this metadata is probably good enough for coarse validation, but not for strong claims about cognitive level, exercise targeting, or teaching-sequence design.

4. Medium: the scope contract is ambiguous around domain `A`.

   The committed JSON starts at `D1.1` and contains no `A*` entries. That may be intentional if this register is meant to cover only the CE content domains `D` to `I`, but the surrounding repo contract elsewhere uses examples like `A4.1` as valid `exam_codes` in [references/machine/micro-teaching-units.md:51](/C:/Projects/4veco/4veco-platform/references/machine/micro-teaching-units.md:51) and [knowledge/micro-teaching-units-plan.md:110](/C:/Projects/4veco/4veco-platform/knowledge/micro-teaching-units-plan.md:110).

   Impact: either the JSON is incomplete, or the contract is under-documented. In its current form, a reader cannot tell which of those two is true from the file itself.

## Strengths

- The JSON parses cleanly and uses a consistent object shape.
- Coverage across the CE domains `D` to `I` is substantial: 117 entries total in the committed file.
- Core fields such as `code`, `domein`, `subdomein`, `tekst`, `verbs`, `implied_bloom`, `examen`, and `year` are present consistently.

## Bottom Line

This file is structurally usable but not yet high-quality enough to be treated as a fully authoritative syllabus register. The biggest blockers are the section-boundary extraction errors and the missing `I3.*` block. After those are fixed, the next quality pass should tighten the semantics of `verbs` and `implied_bloom`, and clarify whether `A*` codes are intentionally out of scope or still missing.
