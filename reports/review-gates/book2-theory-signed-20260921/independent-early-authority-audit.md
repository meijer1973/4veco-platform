# Early independent audit — Book 2 signed elasticity

Reviewer: `review_book2`; 2026-09-21. Read-only repositories. This is an early audit of active authority and mutation paths, not a content, implementation or artifact PASS. Actual task bases are platform `37cc57bda5096b6b8cb455fe9cd27b20acacd3fe` and lessons `fdad5d8f62b7e12618e6a3b8d344c407c259ed35`. The package's older inspected commits are historical evidence. I read the handoff, platform AGENTS, source-of-truth policy, Part A start/review rules, econ-paragraph-review skill, current book build guidance and actual updater/checker implementations.

## Current lifecycle: what is active

The twelve Book 2 records in `references/authored/course-target-exercises.json` are the active integrated Issue #229 package. `issue_229_candidate` is `integrated`, with integrated commit `206c018478654db781cc879e7ea36adcd9ef600c` and frozen ordered-package SHA256 `914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`. Each record still has `record_status: candidate_review_ready`; that status is not evidence that integration is pending. My preliminary message inferred otherwise before inspecting this lifecycle; this corrects it.

The `BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json` package, historical owner decision, integration decision, alignment proof and released target bindings remain immutable evidence. Do not mutate the candidate package or replace historical hashes with current hashes to make new content look previously approved. The explicit current request covers the bounded signed-convention implementation; it does not promote records to reviewed_final or release protected/product holds.

Affected active target fields are finite:

| Record | Current compulsory absolute-value text |
|---|---|
| 2.2.1 | Question b (`met |Ev|`), third lesson goal, short answers b/c (`|−0,8|`, `|−2|`). |
| 2.2.2 | Short answers b/d (`|Ev|=0,8<1`, `|Ev|=2>1`). |
| 2.2.4 | Short answer 2 (`|Ev|=0,7<1`). |

Preserve question labels, point allocations, numerical data, contexts, IDs, required-skills lists, Ei/Ek content and lifecycle status. A notation-only answer edit does not justify adopting the different target context of a package PDF over the active registry. Preserve and explicitly map each authored target/context where these differ.

## Exact live units and terms

The affected unit set is **A15 plus A82/A83/A84**, not merely the RX.4 trio. A15 procedure explicitly requires `|Ev|` comparisons and says ordinary Ev is always negative; the adopted zero case must remain expressible. A82/A83 require absolute-value interpretation in both procedure and pitfalls. A84 requires it in two procedure steps. Retain all source selection, percentage, pairing and graph discipline.

| Unit | Dependencies that must remain | Generator |
|---|---|---|
| A15 | A04, A38 | GEN_A15 |
| A82 | A15, A61, A66 | GEN_A82 |
| A83 | A15, A46, A66 | GEN_A83 |
| A84 | A15, A67 | GEN_A84 |

Four current term slugs require source edits: `prijselasticiteit-en-to` (definition/example), `prijselasticiteit-van-de-vraag` (example/pitfall and consistent bounded definition), `prijselastische-vraag` (definition/example), and `prijsinelastische-vraag` (definition/example). No distinct unitary term is needed merely for this task. Preserve term IDs, syllabus links, deprecation state and derived teaching-unit relationships. My preliminary shorthand “omzet example” refers specifically to `prijselasticiteit-en-to`.

Both the A84 procedure and the price-elasticity/revenue term currently state direction rules too generally. The replacement must limit that rule to local/small changes and retain direct `TO=P×Q` before/after checks for finite changes. Positive observed ratios under confounding changes are not mechanically classified using the ordinary non-positive demand table. Zero is a distinct limiting case. Ei/Ek/supply rules are not replaced.

H03's Armington absolute-value step concerns another elasticity and is not automatically in this removal scope. A16/A17, D06 and D25 were inspected: no compulsory own-price absolute-value procedure there needs this mutation. Keep A17's existing three-way Ei convention and its unlabelled boundary values. Existing D25 coverage limitations remain; do not newly cite it as authority for the local revenue rule.

## Supported mutation path and a CLI hazard

`unit-update.js --id ID --spec '<JSON>' --dry-run` validates without writing. Removing `--dry-run` applies the reviewed patch, regenerating both unit Markdown and JSON. The patch replaces top-level field values, including entire procedure/pitfall arrays; it is not a recursive merge. Supply only the affected fields. The command preserves the unit ID and runs catalog/graph validation. Compare the complete before/after catalog so unintended serialization/layer changes cannot pass unnoticed.

**`term-update.js` requires `--id`, not the README's stale `--slug`. It has no dry-run mode.** Its parser accepts generic flags, but the implementation calls `saveAtomically(registry)` unconditionally, so `--dry-run` is not a safe preview. Do not run that supposed preview against the live checkout. For non-mutating preparation, use exported `term-lib` load/merge/normalize functions on an in-memory copy and `build-begrippen-index` validation with the actual unit/eindterm inputs; inspect the exact before/after proposal. Then use the supported `term-update.js --id SLUG --spec '<JSON>'`. It regenerates `begrippen.json`, `begrippen.md`, and `reports/begrippen-coverage.md`; teaching_units is derived and must not be supplied. The generated_at timestamp changes legitimately.

The CLI README's R2.4/R3.2 human-review restriction concerns that named old packet, not an automatic requirement for an extra human approval of this explicitly requested new bounded revision. The present execute instruction supplies implementation authority. Exact patches and dry-run evidence still need the package's requested review before applying; this early inventory is not review of a yet-unwritten patch. No new human decision/comment may be fabricated.

## Current checker transition and holds

Baseline commands independently run:

- `node build-scripts/workflows/check-book-outline-currentness.js`: PASS.
- `node build-scripts/workflows/check-book2-target-authority-remediation.js --durable`: PASS, frozen package/lifecycle mode.
- `node build-scripts/references/check-rx4-elasticity-market-diagram-mutations.js`: PASS under the old live pedagogy.
- `node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1`: correctly FAIL/BLOCKED for H-221-PRIOR and H-22-ELASTIC-CONTRAST.

The no-argument remediation checker is the obsolete Issue #229 sprint-scope proof; it fails today's baseline because the candidate holds have been integrated and unrelated targets subsequently changed. The npm current command correctly uses `--durable`. Do not “repair” history to pass the obsolete invocation.

The current remaining open holds are:

| Hold | Existing restriction |
|---|---|
| H-213-OPC2 | Formal output-choice teaching in §2.1.3 long route; no formal MO=MK/derivatives expansion. |
| H-221-PRIOR | Approved goal use/paragraph production §2.2.1; prior-teaching issue. |
| H-22-ELASTIC-CONTRAST | Approved goal use/paragraph production §§2.2.1–2.2.2; explicit contrast. |
| H-BOOK2-ROOT-PLAN | Book readiness/whole-book assembly. |
| H-CHAPTER-23-PLAN | H2.3 planning and production/authoring plus whole-book readiness/assembly. |

Keep those records and effects intact. A bounded existing-edition revision must state its own supported acceptance scope and user authorization, not claim that ordinary paragraph_production or whole_book_assembly holds have been released. No unrestricted foundation PASS is justified by current metadata.

An ordinary metadata rehash cannot support this change: `book2-owner-decision.validateEiDecision` pins the entire old outline semantic hash, while durable target validation demands exact equality to the frozen candidate package and historical released pins. A new explicitly bound successor/transition must recognize the exact old and new identities, prove only the authorized fields changed, retain the complete historical decisions/hold set and Ei content, and reject any other mismatch. `check-book-outline-currentness.js` exports the semantic/LF hash functions and hold projection formatter; I found no generic outline-mutation CLI that grants a new approval merely by refreshing pins. Use an owning narrow transition/projection tool, with negative tests for unlisted target, status, hold, source and outline changes.

RX.4 historical review/candidate/closure evidence can continue validating its historical snapshot. The live mutation checker must accept the explicitly bound signed successor and continue requiring the unchanged IDs/dependencies/generators, sign/percentage reasoning, A82 paired situations, A83 graph-source discipline, A84 local revenue logic, and all product blocks. Retain `student_facing_skilltree_use_allowed=false`, `pv_projection_allowed=false`, and `generator_implemented=false` for the three blocked RX.4 units. Do not replay `close-and-apply-rx4-elasticity-market-diagram.js`: it writes historical gate artifacts and seeds the old procedures. Its historical reproduction role must be explicit or safely reject current reseeding.

## Additional active consumers and final review obligations

- `engines/skilltree/explanations.js` A15 and `engines/skilltree/generators.js` GEN.A15 still teach `|Ev|` in learner text. Fix those owning current sources; internal `Math.abs` need not be deleted merely because learner notation is removed. A15 is distinct from the three blocked RX.4 generators. Preserve existing publication/use constraints.
- Regenerate the embedded catalog with `build-scripts/tools/build-skill-tree-viewer.js`. Trace other active copies through their owning build/deploy path; a new Part B build or release is not implied.
- `references/owned/course-blueprint-v5.md` §2.2.1 still describes a cinema/petrol “current/reviewed-final” target with `|Ev|`; add a precise current supersession reference. Do not silently elevate the integrated Nova/StreamNow candidate-status records or rewrite old promotion evidence. The active outline §2.2.1 also incorrectly says both current target contexts are inelastic: current StreamNow is −2. Preserve the contrasting cases while correcting that stale claim within the bounded revision.
- Protected legacy Module 3 builders, Book 1, external exams/correction models, archived v4 material, imported provenance, old RX.4 evidence and prior reviews are not automatic replacement targets.
- The current Book2 owning path already supports `--revised-chapters` and source-bound route manifests; the handoff's assembly-only description predates that addition. Extend that actual route instead of reverting to the old cover-only path. Preserve the normal guided route, challenging target+bonus, additional practice labels, and the final §2.2.4 “Hoofdstukcheck 7” correction. Record those explicit deviations from package pixels.
- Final independent review must inspect all 43 approved theory/reference pages, the three changed §2.2.1 exercise pages, affected answer/H3 retrieval/teacher pages, exact cover vectors, untouched questions/data/points, and all dependencies/neighbours. It must independently check numerical cases, finite TO results, named-link targets (H2 overview 72/H3 109) and semantic native sources. No full-page image/vector facsimile masquerading as native authoring is acceptable.
- Keep the old manifests/reviews immutable. The current content-revision manifest must enumerate exact source/output replacements and mappings, protect unlisted files, and bind the actual paired heads. Check all four old/new platform/lesson combinations and the proposed safe merge order. Merge/publication still needs its separately applicable authority. Books 3/4 NAV1 remains separate.

## Inventory and source-port observations

I independently ran the supplied scanner: 7,159 platform text files / 401 matches and 2,535 lesson text files / 494 matches. Two archived roadmap files have invalid UTF-8 and were reported as skipped. Windows ordinary paths silently excluded 13 long lesson filenames via is_file; I independently read those with extended-length paths and recovered two further generated-copy matches in §2.2.3. The combined 897 matches agree with the author's extended-path inventory. Evidence is `independent-elasticity-inventory.json` and `independent-inventory-long-path-supplement.json`. This inventory is not a claim that all matches are errors or that each historical match has already been dispositioned; the concrete current hotspots above have been inspected.

The author's proposed semantic HTML port inside existing PAGE blocks has no early architectural blocker: use real heading/paragraph/table/caption structure and meaningful reading order, not per-glyph PDF text positioning. Bounded diagram SVGs need explicit data/equations/coordinates, descriptive text and independent geometry checks. PDF coordinates/drawings can be recovery references but must not become runtime full-page facsimiles or substitute for semantic native source. Fixed panels require overflow and page-count checks plus final complete-page inspection. Retain and document current route overlays (including page 86) and the §2.2.4 chapter-check wording when their pixels differ from the package. This architecture observation is conditional, not acceptance of the future implementation.

No final review verdict is issued. The source/record/tooling checks above identify the bounded implementation constraints and the concrete current hotspots for the author.
