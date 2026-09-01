# Part A Textbook Plan: X.Y.Z [Naam]

> Part A copies this template to
> `<paragraph-folder>/X.Y.Z-textbook-plan.md` before goals, target design,
> exercise design, or content production. Part A owns and approves this plan.
> Part B may consume the approved plan and textbook handoff, but must not move,
> replace, or treat it as `_paragraph-plan.md`.

## Book foundation check

Canonical human semantic authority:
`references/authored/book-outlines/book-2-outline.md`. Machine freshness,
target pins, and hold lifecycle:
`references/authored/book-outlines/book-2-outline.meta.json`.

Run structural currentness first, then evaluate the exact current action:

```bash
npm run check:book-outline-currentness
npm run check:book-outline-currentness -- --action <action> --paragraph X.Y.Z
```

Run `npm run check:book-outline-currentness -- --require-approved` only when
the current action requires approved outline use. A failing approved-use check
does not by itself prohibit `goal_design`, `target_design`, or
`specialist_review` when every matching open hold permits that action.

### Authority, outline, chapter, and target pins

| Required pin | Exact value/evidence |
|---|---|
| Active v6 path | `references/owned/course-blueprint-v6-three-year.md` |
| Active v6 version | [exact version from source] |
| Active v6 SHA-256 | [exact metadata/source hash] |
| Active detailed v5 path | `references/owned/course-blueprint-v5.md` |
| Active detailed v5 version | [exact version from source] |
| Active detailed v5 SHA-256 | [exact metadata/source hash] |
| Approved outline path | `references/authored/book-outlines/book-2-outline.md` |
| Outline version | [exact metadata version] |
| Outline SHA-256 | [exact metadata `semantic_authority.sha256`] |
| Outline approval status | [pending / approved / approved_with_holds] |
| Chapter-plan path | [exact lesson-repository `_chapter-plan.md` path] |
| Chapter-plan version | [exact plan version or commit pin] |
| Chapter-plan SHA-256 | [exact canonical-text hash] |
| Chapter-plan currentness | [command/evidence and PASS/FAIL] |
| Target registry record ID | `X.Y.Z` |
| Target status | [exact `target_registry_pins[].target_status`] |
| Target record SHA-256 | [exact `target_registry_pins[].target_record_sha256`] |
| Structural currentness | [exact command/result/evidence] |
| Approved-use currentness, if required | [exact command/result/evidence or `not required for current action`] |

### Canonical paragraph semantics

Copy these decisions from the Markdown outline by reference; do not source them
from machine metadata.

| Required semantic decision | Paragraph-specific value/evidence |
|---|---|
| Paragraph role | [canonical role] |
| Chapter dependency | [canonical incoming sequence/dependency] |
| Incoming prerequisites | [each exact earlier operation] |
| Prerequisite classification | [for each: `previously_taught_probably_secure`, `previously_taught_retrieval_required`, `previously_taught_not_secure_enough_to_assume`, `preview_or_familiarity_only`, or `new_formal_learning`] |
| Classification evidence/support | [curricular evidence plus retrieval/support/hold decision] |
| Explicit non-goals | [canonical exclusions/deferred scope] |
| Downstream prepares-for | [canonical paragraphs/bridges/later route] |
| Retrieval | [only target- and worked-example-dependent retrieval] |
| Interleaving | [earlier operation deliberately mixed here and why] |
| Operation emphasis | [calculation / representation / interpretation / selection-classification / answer form] |
| Misconception boundary | [canonical boundary] |
| Model conditions/relevant range | [time period, capacity/production range, functional/market/transaction assumptions] |

For §2.1.1, non-goals must include revenue, profit, break-even, marginal costs,
`MO=MK`, and formal proportional/degressive/progressive classification;
prepares-for must include §§2.1.2–2.1.4 and the supply-as-MC bridge in §2.3.2;
and retrieval is required only for a previously taught arithmetic, unit, table,
or graph operation directly needed by the approved target and worked example.

### Open holds and current-action effect

| Hold ID | Status | Scope match? | Current action | Listed in blocks? | Listed in permits? | Effect (`BLOCKS` / `PERMITS` / `NOT_APPLICABLE` / `RELEASED`) | Release evidence when released |
|---|---|---|---|---|---|---|---|
| [exact metadata hold] | [open/released] | [yes/no + reason] | [exact action] | [yes/no] | [yes/no] | [effect] | [null for open; exact evidence for released] |

An open hold blocks only when its scope matches and `blocks` contains the
current action. A matching explicit `permits` entry is recorded as permission,
not a blocker. A released hold requires evidence and has effect `RELEASED`.

### Foundation verdict

Current action: `[goal_design | target_design | specialist_review |
outline_approval | goal_approval | target_authority | paragraph_production |
chapter_planning | chapter_production | lesson_authoring | merge | other
registered action]`

Foundation verdict: `[PASS_FOR_<ACTION> | BLOCKED_FOR_<ACTION>]`

Verdict basis: [name the exact matching blocking holds, or state that all open
holds are permitted/out of scope/unrelated to the current action; keep this
foundation verdict distinct from later target, teacher, economics, and
production verdicts].

## Part A backward-design plan

### Goals and target route

[Record goal/target design, operation coverage, target-equivalent evidence,
official-source route trace where applicable, and approval state.]

### Exercise, explanation, and worked-example sequence

[Record the target-first sequence, retrieval/support decisions, model
conditions, misconceptions, paper-only route, and time budget.]

### Textbook visuals and answer model

[Record core SVG/PNG visual assignments, dual-coding purpose, labels/units,
answer-form expectations, and review proof.]

### Part A review and Part B handoff

[Record Part A teacher/economics/visual/lead verdicts and link the approved
`X.Y.Z-textbook-handoff.md`. Part B consumes this plan but owns its separate
`_paragraph-plan.md`.]
