# Sprint ISSUE-223-GATE-0-1: Book 2 Paragraph 2.1.1 Part A Contract Application

## Goal

Apply the approved Book 2+ Part A exercise-authoring contract to §2.1.1
Kostenstructuren without changing the reviewed target authority or broadening
the lesson into Book 1, Part B, another Book 2 paragraph, or adjacent economic
topics. Gate 0 freezes the authority and baseline, proves a realistic route,
and obtains independent planning review before any student-facing edit.

## Context

Issue #223 is authorized after PR #222 merged as platform commit
`15bb80496916e3c07f5c957226b857cc689d9f43` and exact-commit post-merge CI run
`33399439318` passed. The lesson baseline is clean `main` commit
`f09fd6e88edc5049b026b16b0158e7e188091d2d`.

The target registry is authoritative. The exact §2.1.1 record has SHA-256
`f01cd43c65e639e396a14b3dcfe5ed546ed7baa5cf8d2aa20a8bbe0c2c310de8` when
serialized with `JSON.stringify(record)` in repository property order. Its
source file has SHA-256
`33928e7929fa1c9af86159b07769e2f01d28963873ef34c40e55c2001feb87ac`.
The record is `reviewed_final`; the older `2.1.1-review.md` sentence that says
v5 review is still needed is stale historical prose and must be superseded in
the lesson review evidence, not used to reopen or mutate the target.

The committed PR #222 result and roadmap sentences that described remote gates
as pending were accurate pre-integration snapshots. They are superseded by
merge `15bb8049...`, CI run `33399439318`, and Issue #223's prerequisite record.
That evidence-hygiene wording may be refreshed in this normal platform evidence
update; it does not justify an emergency repair or any PR #222 source change.

### Frozen target decomposition

| Authority element | Frozen requirement |
|---|---|
| Context | Bakery; `TCK = €500` per month; variable cost `€0.80` per loaf. |
| Lesson goals | Distinguish fixed/constant from variable cost; calculate `TK = TCK + TVK`; calculate `GTK`, `GVK`, and `GCK`; explain falling `GCK` as spreading fixed cost; understand constant `GVK` when variable cost per unit is constant. |
| Target a | Construct `TCK`, `TVK`, and `TK` as functions of `Q`. |
| Target b | Calculate `TCK`, `TVK`, and `TK` at labeled `Q = 500` and `Q = 1000`. |
| Target c | Calculate `GCK`, `GVK`, and `GTK` at both labeled quantities. |
| Target d | Compare `GTK` as `Q` rises and explain the result economically. |
| Target e | Reject or accept “GCK is always the same” and explain. |
| Operation chain | Identify cost parameters → construct three total-cost relations → substitute two quantities → calculate six total-cost values → divide by `Q` for six average-cost values → compare `GTK` → explain fixed-cost spreading → evaluate the `GCK` misconception. |
| Required representations | Written bakery context; algebraic relations as functions of `Q`; clearly labeled `Q = 500` and `Q = 1000` calculation rows or tables. A supplied graph may support instruction, but graph construction is not required. |
| Required answer forms | Formulas; labeled substitutions; total costs in euros for the monthly production level; average costs in euros per loaf; numerical comparison; causal explanation; misconception judgment plus explanation. |
| Registry prior knowledge | `prior_knowledge_assumed: []`; no cost-structure concept may be treated as mastered before this paragraph. |
| Safe generic retrieval | Previously taught arithmetic only: decimal multiplication, division by a supplied quantity, substitution into a supplied expression, euro/unit notation, and reading a simple table. This is a planning boundary, not a claim that the registry names domain prerequisites. |
| Explicitly non-target | Graph construction; break-even, revenue, or profit reasoning; formal proportional/degressive/progressive cost classification; device use; diagnostics or mastery decisions. |

### Goal, target, and operation alignment

| Lesson goal | Target subquestion/operation | Worked example | Start check | Guided practice | Independent practice | Covered/gap |
|---|---|---|---|---|---|---|
| Distinguish constant and variable costs. | Context and a: identify the fixed amount and variable amount per loaf before constructing relations. | Foodtruck separates permit cost from per-product cost. | After instruction, the compressed graph check distinguishes the horizontal `TCK` line from changing `TVK`. | Opgave 2 classifies supplied costs, then writes relations. | Opgave 4 derives relations from a fresh context. | Covered; opening arithmetic retrieval receives no credit for this domain goal. |
| Calculate `TK = TCK + TVK`. | a/b: construct `TCK`, `TVK`, `TK`; substitute both quantities; calculate six labeled total-cost values. | Full three-relation and two-quantity route at lower values. | Read/check `TCK`, `TVK`, and `TK` values in the supplied graph. | Opgaven 2/3 move from supported formulas to table completion. | Opgave 4A/B constructs and evaluates all three relations. | Covered; preserve both target quantities and show substitutions/euros in answers. |
| Calculate `GTK`, `GVK`, and `GCK`. | c: divide the appropriate total by `Q` at both quantities; calculate six labeled average values. | Completes all three averages in a labeled table. | Generic division/table/unit retrieval prepares arithmetic but does not count as target coverage. | Opgave 3 supplies the table structure and then asks all three averages. | Opgave 4C calculates all three without table prompts. | Covered; target answers label euro per loaf. |
| Explain why `GCK` falls as `Q` rises. | d/e: compare results and explain unchanged fixed cost spread over more units. | Conclusion links larger quantity to lower `GCK`. | Not credited; the supplied graph displays total rather than average costs. | Opgave 3C compares averages with a prompt. | Opgave 4D combines the `GTK`/`GCK` comparison with the fixed-cost-spreading explanation. | Covered; final explanation must name unchanged `TCK`, larger `Q`, and spreading. |
| Understand constant `GVK` when variable cost per unit is constant. | c numerical pair plus the lesson-goal interpretation. | Conclusion explicitly compares equal `GVK` values. | Not credited. | Opgave 3C identifies which average remains equal. | Opgave 4D explains constant `GVK` alongside falling `GCK`/`GTK`. | Covered; target-c answer records the equal values and one concise interpretation without adding a new independent target operation. |
| Compare `GTK` as output rises. | d: compare `GTK` and explain why the change is logical. | Conclusion compares `GTK` at two quantities. | Not credited. | Opgave 3C provides a prompted comparison. | Opgave 4D gives an unprompted written comparison. | Covered; preserve written economic reasoning rather than calculations alone. |
| Evaluate “GCK is always the same.” | e: judgment plus explanation. | Worked conclusion supplies the causal knowledge but does not repeat the claim. | Not credited. | Guided comparison prepares the distinction. | Reframe Opgave 4D to include the misconception judgment in the same explanation, rather than retain another full calculation exercise. | Covered; target e remains explicit and independent preparation is mandatory, not optional. |

No target operation is supplied only by a preview, optional guided route, bonus,
or answer model. Each target operation remains visible in the doeloefening.

### Seven-section disposition

The student-facing exercise route must use exactly these seven level-2 headings
in this order. The compact four- or five-point summary is not a heading and sits
after the worked example and before `Startopgaven`.

| Required section | Current source | Planned disposition |
|---|---|---|
| `Uitgewerkt voorbeeld` | Foodtruck worked example and five-step procedure table. | Preserve the lower-complexity full operation chain; verify formulas, units, and target parity. Use its procedure table as the seed for the compact summary. |
| `Startopgaven` | Current Opgave 1 graph reading; no genuine prior arithmetic retrieval. | Add short generic arithmetic/table/unit retrieval, then compress Opgave 1 as the current-content comprehension check. Keep both roles under one heading. |
| `Begeleide inoefening` | Current Opgaven 2 and 3. | Put strongest support first and deliberately fade toward less support. Author and print the section; only student use is optional. |
| `Zelfstandige oefening` | Current Opgave 4; current Opgave 5 partly duplicates it. | Use Opgave 4 for the full independent chain and reframe its final explanation to include the `GCK` misconception judgment. Remove duplicate Opgave 5 calculation load. |
| `Doeloefening` | Current Opgave 7. | Preserve all target suboperations at `Q = 500` and `Q = 1000`; strengthen unit, comparison, and explanation evidence. |
| `Denkertje / Bonusopgave` | Current Opgave 8. | Preserve as optional cognitive flexibility; do not count it toward target coverage or lesson time. |
| `Herhaling / Herhaling en interleaving` | Current Opgave 6, currently before the doeloefening. | Move to the final section and compress as lower-load review/homework. It does not count toward the core route. |

For §2.1.1, use the literal combined canonical headings
`## Denkertje / Bonusopgave` and
`## Herhaling / Herhaling en interleaving`; do not substitute a shorter variant.

The exact printed route note is:

`**Korte route:** Startopgaven → Zelfstandige oefening → Doeloefening.`

`**Extra hulp nodig?** Maak eerst Begeleide inoefening.`

The exact neutral guided-skip sentence inside `Begeleide inoefening` is:

`Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.`

### Question-level timing proof

The provisional 53-minute estimate is treated as a risk. The implementation
target is 52 minutes including ordinary classroom contingency:

| Core component | Question-level estimate | Minutes |
|---|---|---:|
| Motivation | Read bakery problem, predict which costs change, brief response. | 3.0 |
| Instruction | `TCK` 2; `TVK` 2; `TK` 2; read supplied graph/table 2; three average costs 3. | 11.0 |
| Worked example | Read/setup 1; formulas 1; total-cost table 1; average-cost table 1; conclusion 1. | 5.0 |
| Summary, route reading, transitions | Compact summary 0.75; short-route instruction 0.50; transitions into practice 0.75. | 2.0 |
| Startopgaven | Decimal multiplication/substitution 1.5; division/table/unit notation 1.5; compressed current-content graph check A 1, B/C 1, D 1. | 6.0 |
| Zelfstandige oefening | Read/setup 1; formulas 1; total costs 2; average costs 3; combined comparison, constant-`GVK`, spreading, and misconception explanation 3. | 10.0 |
| Doeloefening | Read 0.5; a formulas 1.5; b totals 2.5; c averages 3.5; d comparison/explanation 2; e judgment/explanation 2. | 12.0 |
| Contingency | Normal writing, table completion, and classroom variation. | 3.0 |
| **Core total** | `3 + 11 + 5 + 2 + 6 + 10 + 12 + 3` | **52.0** |

The guided section is an optional 9-minute support detour (supported
classification/formulas 3; supported table completion and explanation 6).
Bonus and herhaling are outside the core equation. The implementation review
must re-estimate from the final questions; it may reduce duplicated independent
practice, but it must stop rather than delete a target operation to fit 55
minutes.

### Validator decision

`build-scripts/workflows/check-part-a-exercise-authoring-contract.js` protects
the contract and template surfaces. `scripts/validate-paragraph.js` validates
package presence, PDFs, assets, and review metadata. Neither currently validates
the concrete §2.1.1 student text for exact heading order, compact-summary
placement/count, exact route wording, device/internal language, both
Startopgaven roles, target-operation coverage, or exercise/answer parity.

Gate 0 therefore demonstrates a real focused-guardrail need. Any guardrail must
be developed on a new platform implementation branch and separate focused PR,
remain opt-in to §2.1.1, include positive and mutation tests, and integrate
before final lesson integration. This Gate 0 planning branch must not become
that implementation branch. Student-facing drafting may begin after planning
PASS; final lesson readiness may not pass until the focused guardrail is
integrated and run against the exact lesson head.

## Quality Standard

The implementation must satisfy the merged Part A specification, preserve the
reviewed target and printed-textbook quality floor, and produce rendered output
that can be inspected page by page. Student-facing theory, examples, exercises,
tables, graph use, route wording, and answer models must trace to the frozen
lesson goals and target operations. Proof must include focused mutation-tested
guardrails, paragraph validation, exact exercise/answer parity, 52-minute route
evidence, rendered-page inspection, specialist reviews, structural lead review,
and named follow-up disposition for every non-blocking defect.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Preserve frozen target authority and all target operations. | Alignment table, target-equivalent doeloefening, complete answers, unchanged target registry. | Focused contract checker, answer/source parity check, teacher-quality and lead review. | include_now |
| Use exact seven-section order and compact non-heading summary. | Updated paragraph/opgaven markdown plus generated HTML/PDF. | Positive and mutation tests for heading order and summary placement/count. | include_now |
| Provide both Startopgaven roles without assuming cost mastery. | Generic arithmetic retrieval plus post-instruction current-content check. | Teacher-quality review and focused role assertions. | include_now |
| Print exact paper-only short and support route. | Exact route sentence; no website, device, or internal lane language. | Focused wording/device-language mutations and student-experience review. | include_now |
| Deliberately fade toward target representation and answer form. | Guided-to-independent-to-target progression with no new graph/table production demand. | Alignment review and teacher-quality review. | include_now |
| Keep core route realistic. | Final question-level timing equation at 50–52 minutes with contingency and every target operation. | Planning review now; final specialist/lead review on concrete questions. | include_now |
| Regenerate and inspect rendered output. | Rebuilt paragraph, exercises, and answers HTML/PDF through `build_pdf.py`. | Every page rendered and inspected; defects such as overlap, clipping, blank space, page breaks, and glyphs dispositioned. | include_now |
| Close the Part A lane without stale packages or companion claims. | Remove the obsolete tracked `opgaven.zip`; fill `2.1.1-textbook-handoff.md` from the governed template. | Lane-scope check and handoff review prove current Part A evidence and preserve the Part B boundary. | include_now |
| Preserve repository boundaries. | Lesson changes limited to §2.1.1 Part A allowlist; separate opt-in platform guardrail PR. | Diff summaries, exact-head CI, readiness, and governed integration. | include_now |

## Quality Improvement Candidates

| Candidate | Classification | Rationale |
|---|---|---|
| Replace duplicate calculation load before shortening the target. | include_now | Current Opgave 5 repeats the independent chain and creates the timing risk. |
| Fix the graph legend overlap and target-question PDF page breaks. | include_now | Both are concrete rendered-output defects inside §2.1.1. |
| Add an opt-in §2.1.1 contract guardrail with mutation tests. | include_now | Existing validators do not check the required concrete lesson properties. This must be a separate platform implementation PR. |
| Remove the tracked stale `opgaven.zip`. | include_now | It is not a required Part A output and contains materially older HTML, PDFs, and asset exports. Removing it prevents a second stale distribution surface. |
| Refresh stale PR #222 pre-integration roadmap wording. | defer_named_follow_up | It is evidence hygiene, not a lesson blocker; refresh only in a normal platform evidence update. |
| Redesign Chapter 2.1 assembly or other paragraphs. | reject_scope_creep | Issue #223 is paragraph-only and does not authorize unrelated Book 2 changes. |
| Add graph construction, break-even, profit, revenue, or formal cost-shape classification. | reject_scope_creep | These are not independent operations in the reviewed §2.1.1 target. |

## Allowed paths

Gate 0 planning/evidence branch only:

- `reports/sprints/ISSUE-223-GATE-0-1-*.md`
- `reports/sprints/ISSUE-223-GATE-0-1-command-log.jsonl`
- `references/data/sprints/ISSUE-223-GATE-0-1.plan.json`
- `references/data/sprints/ISSUE-223-GATE-0-1.result.json`
- `docs/roadmaps/textbook/sprint-ledger.md`
- `docs/roadmaps/textbook/textbook-production-roadmap.md`
- `references/reference-team-roadmap.md`
- Generated repository indexes only when required by their freshness checks.

Lesson implementation after independent planning PASS, rooted at
`../issue223-lesson/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/`:

- `2.1.1 Kostenstructuren – paragraaf.md`
- `2.1.1 Kostenstructuren – paragraaf.html`
- `2.1.1 Kostenstructuren – paragraaf.pdf`
- `2.1.1 Kostenstructuren – opgaven.md`
- `2.1.1 Kostenstructuren – opgaven.html`
- `2.1.1 Kostenstructuren – opgaven.pdf`
- `2.1.1 Kostenstructuren – antwoorden.md`
- `2.1.1 Kostenstructuren – antwoorden.html`
- `2.1.1 Kostenstructuren – antwoorden.pdf`
- `_assets/2.1.1_fig_1.svg`
- `_assets/2.1.1_fig_1.png`
- `2.1.1-review.md`
- `2.1.1-quality-ref.yaml`
- `2.1.1-textbook-handoff.md`
- `build_pdf.py`
- `2.1.1 Kostenstructuren – opgaven.zip` **deletion only**; do not regenerate
  or replace it because zip output is not part of the governed Part A lane.

A later, separate platform guardrail branch may change only the focused checker,
its tests/fixtures, and the minimum package/CI wiring proven necessary by Gate
0. Those paths must be fixed in that branch's own plan before implementation.

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No mutation of `references/authored/course-target-exercises.json`, target,
  MTU, candidate, PV, blueprint authority, or other protected reference data.
- No Book 1 edit or revalidation, Part B companion/website output, or
  `_paragraph-plan.md` creation.
- No source or generated-output edits for 2.1.2, 2.1.3, 2.1.4, Chapter 2.1
  assembly, another chapter, or another book.
- No hand patch of generated HTML/PDF and no regeneration/replacement of zip
  output; the frozen stale tracked zip is removed after planning PASS.
- No graph/table construction demand absent from the target.
- No break-even, revenue, profit, formal cost-shape classification, device,
  diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative, product-wide, or broad companion authorization.
- No substantive checker or contract implementation on the Gate 0 evidence
  branch; use a separately claimed platform guardrail worktree/branch.

## Inputs

- GitHub Issue #223 and its accepted PR #222 prerequisite.
- `references/authored/course-target-exercises.json` §2.1.1.
- `references/owned/course-blueprint-v5.md` §2.1.1.
- `references/owned/course-blueprint-pedagogical-boundaries.md` as the
  read-only PR #222 contract.
- `skills/econ-exercise-builder.md`.
- `skills/econ-textbook-paragraph.md`.
- `skills/econ-didactiek.md`.
- `skills/economic-graph.md`.
- `skills/econ-pdf-builder.md`.
- `docs/workflows/textbook-paragraph-lane.md`.
- Current §2.1.1 source, review, quality-ref, assets, build script, HTML, and PDF
  output at lesson commit `f09fd6e...`.

## Outputs

- `reports/sprints/ISSUE-223-GATE-0-1-baseline.md`.
- `reports/sprints/ISSUE-223-GATE-0-1-planning-review-assignment.md`.
- `reports/sprints/ISSUE-223-GATE-0-1-planning-review.md`.
- `reports/sprints/ISSUE-223-GATE-0-1-command-log.jsonl`.
- `references/data/sprints/ISSUE-223-GATE-0-1.plan.json`.
- After planning PASS only: updated allowed §2.1.1 Part A source and generated
  output, `2.1.1-textbook-handoff.md`, deletion of the stale tracked zip,
  focused guardrail evidence, final reviews, sprint result, diff summary, and
  result JSON.

## Operationalized sprint procedure

1. Pin exact platform and lesson baselines, claim dedicated worktrees, freeze
   the full target record and current artifact hashes, and record visual PDF
   observations. Stop if either baseline differs from Issue #223.
2. Complete the alignment, seven-section disposition, implementation allowlist,
   question-level 50–52 minute equation, validator-gap decision, review gates,
   and stop conditions. Keep both worktrees free of student-facing changes.
3. Give the plan, baseline, target authority, current lesson files, and Issue
   #223 to an independent planning reviewer. Resolve every blocking finding and
   record a PASS before any student-facing edit.
4. After planning PASS, create a separate platform guardrail branch/PR because
   the existing validators lack concrete §2.1.1 checks. Add opt-in positive and
   mutation tests without weakening the merged Part A or PR #222 contract.
5. Revise only the allowed §2.1.1 Part A lesson files. Preserve the complete
   target operation chain, exact route wording, seven-section order, paper-only
   language, and final 50–52 minute estimate. Stop for a human decision if
   compliance would require target mutation, non-allowed content, or deleting a
   target operation.
6. Regenerate HTML/PDF only through `build_pdf.py`; remove rather than regenerate
   the stale tracked `opgaven.zip`; render every page and inspect paragraph,
   exercises, and answers. Correct graph overlap, target-question page breaks,
   clipping, overflow, broken glyphs, and avoidable blank pages.
7. Fill `2.1.1-textbook-handoff.md` from
   `build-scripts/templates/textbook-to-companion-handoff.md`. Record Part A
   evidence and future reuse boundaries without creating Part B output or
   claiming companion completion.
8. Run focused contract mutations, paragraph and textbook-lane validation,
   parity checks, diff hygiene, teacher-learning-quality review,
   student-experience review, and structural lead review. Resolve blocking
   findings, bind evidence to exact heads, and use governed readiness/integration
   without direct merge or bypass.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/ISSUE-223-GATE-0-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js ISSUE-223-GATE-0-1
node build-scripts/sprints/check-scope-language.js --active
node build-scripts/workflows/check-part-a-exercise-authoring-contract.js
node scripts/validate-paragraph.js --mode part-a --profile publisher-print "../issue223-lesson/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren"
node build-scripts/workflows/check-issue-223-211-contract.js "../issue223-lesson/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren"
node build-scripts/workflows/check-issue-223-211-contract.test.js
node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../issue223-lesson --lane textbook --base origin/main --head HEAD
node build-scripts/sprints/check-sprint-result.js reports/sprints/ISSUE-223-GATE-0-1-result.md
node build-scripts/sprints/check-sprint-bundle.js ISSUE-223-GATE-0-1 --complete
git diff --check
git -C "../issue223-lesson" diff --check
```

The two `check-issue-223-211-contract` commands are planned final acceptance
tests and remain intentionally unavailable until the separately reviewed
platform guardrail branch is integrated. Gate 0 validates the plan and current
contract authority, not future implementation output.

## Proof Required to Close

Closure proof must include exact baseline hashes, planning PASS, complete
target-operation alignment, the final 50–52 minute question-level equation,
focused positive and mutation-test evidence, paragraph validation, exact
exercise/answer parity, regenerated HTML/PDF, every-page visual inspection,
specialist and lead-review evidence, exact-head CI, governed readiness and
integration, and diff proof for every forbidden surface. The sprint cannot
close while a target operation is missing, a rendered defect is undispositioned,
or a review/validator/test is failing.

## Rollback plan

Revert the separate lesson implementation commit(s) to lesson baseline
`f09fd6e88edc5049b026b16b0158e7e188091d2d`, revert the separate focused
platform guardrail commit(s) to platform baseline
`15bb80496916e3c07f5c957226b857cc689d9f43`, and remove only this sprint's
planning/result artifacts and ledger row. Do not reset or rewrite either
repository and do not touch protected reference data.

## Human review required

Independent agent planning review is required before student-facing edits.
Fresh teacher-learning-quality, student-experience, and structural lead reviews
are required before closure. Human review is required if target authority,
scope boundaries, route timing, or integration authorization cannot be
satisfied as written. Governed human readiness/merge authorization remains
required by repository policy.
