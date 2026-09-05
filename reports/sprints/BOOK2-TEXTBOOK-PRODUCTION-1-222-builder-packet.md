# §2.2.2 builder packet — R12

2026-09-05. Builder: paragraph_222_builder. Task BOOK2-TEXTBOOK-PRODUCTION-1-222.
Status: authored/rendered candidate for independent paragraph review and a
distinct specialist QC. **No independent acceptance or handoff is supplied.**
The existing lesson review/quality-ref are unchanged historical records and do
not cover this new output, even though the structural validator reads them.

## Exact artifacts and reproducibility

Platform source: `build-scripts/content/book-2/b2_222.py` and `222/` beneath it.
Lesson folder: `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/`.
Stem: `2.2.2 Elasticiteit en omzet – `; three MD/HTML/PDF editions and thin
`build_pdf.py`. Four paired assets: `2.2.2_fig_1`, `fig_2`, `fig_3`, `we_1`.

| Edition | Pages | Final PDF SHA-256 |
|---|---:|---|
| paragraaf | 10 | 36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c |
| opgaven | 6 | 0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555 |
| antwoorden | 5 | b68d0429a9d739d0587f7a1c95ca922e188061b4821920b1d0f6459766adc6ab |

The full MD/HTML/PDF/source/asset hash map is
`BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r12.json`; all current R12 page hashes and
honestly PENDING generation status remain in the three immutable manifests:

- `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-paragraaf-36feb7873637-r12/`
- `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-opgaven-0a251a4973b1-r12/`
- `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-b68d0429a9d7-r12/`

Each also has a separate `builder-inspection.json`, explicitly not independent
acceptance. Final-page direct views/verified raw transfers cover all21 full
pages, never contact sheets alone. Paragraaf pages1,2,4,5,6,7 were directly
inspected at R6; pages3,8,9 at R7; page10 at R8. Opgaven pages1–3 were directly
inspected at R7 and4–6 at R8; all five answers pages at R8. Every transfer was
rechecked as exact PNG-byte equality with R8. Grayscale full-page probes3 and6
in `222-grayscale-r8/` were also personally inspected: dashed old boundaries,
filled new revenue, labels and arrows stay legible without colour. Both student
PDFs and every student page remain exact bytes in R12, so those grayscale probes
remain applicable. R12 answers page4 was directly inspected; page1 is exact to
the directly inspected R11 page1; pages2,3,5 remain exact to R8. The complete
rehashed R8-to-R12 page map is `BOOK2-TEXTBOOK-PRODUCTION-1-222-r8-r12-page-transition.json`.
Only answers pages1 and4 changed. All21 final full-page bytes are covered.

Earlier R1–R7 proof directories/build manifests are generation history, not
current artifacts or fresh acceptance. R1 had split supports/recap; R2–R5
pagination iterations had avoidable blank pages; R6 exposed a Markdown
completion-blank emphasis bug; R7 repaired the escaped blanks and legend
spacing; R8 corrects singular `1 punt` in target display. The exact registry
context/prompts/goals/points were never changed. R9/R10 tested supported MathML
for three split absolute-Ev tokens, but actual PDF checks and full-page views
still found the breaks. R11 used supported structural line breaks; R12 adjusted
one break to avoid an isolated word. Only the three generated explanation
breaks changed; all authored source words and frozen short answers are intact.
No shared CSS/sanitizer override or monkeypatch was introduced. Only R12 is
offered for review; earlier revisions remain immutable generation history.

Rebuild from either paired checkout:

```powershell
python build-scripts/content/book-2/b2_222.py --lesson-root ../4veco-lessen
python build-scripts/content/book-2/222/check_render.py --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-render-check-r12.json
```

The checker safely relocates recorded source/proof paths to the explicitly
selected paired checkout, without editing immutable manifests or their hashes.
The approved plan and chapter hash are checked before writes. Build scripts
own output, so source changes require regeneration and renewed exact-page QA.
No shared print-pipeline file changed.

## Operation, answer and visual map

| Goal / operation | Teaching and worked chain | Guided fading | Independent / target | Answers |
|---|---|---|---|---|
| G1 matched old/new TO | T1; W1a/c | G1a/c formula then own products; G2a one cue | I1a/c; target a/c | Formula, substitution, units/period, scale/selection why |
| G2 local directions and finite boundary | T2 rule+schematic; W1e concert counterexample | G1f/g completion→G2e/f uncued rule/fresh photoclub | I1e fresh benefiet; target e | Both local classes, small/near-reference/fixed-other conditions; interval not proof throughout |
| G3 observed percentage with Ev | T1 products/old-base %; W1b/d | G1b/d structured→G2a–d comparison of rise/fall | I1b/d; target b/d | Exact %, old base, magnitude meaning, observed-case limit |
| G4 revenue not profit | Retrieval/T3/W1f | G1e, G2 explanation bounds | I1f; target f | TO−TK; missing old/new costs |

Four precise graphic roles: first old500 revenue rectangle; two matched
before/after panel products500→522.50 and500→440 on identical scales;
two-column local schematic including reverse price direction and conditions;
concert1000→900 finite counterexample. Price is vertical, quantity horizontal,
area is revenue per week, not a demand curve or profit. Every figure is direct
source-owned SVG with paired PNG, redundant labels and matching adjacent text.
No required graph/table construction was added to the target chain.

Nova target: TO5000→5040, +0.8% per week, interval Ev−0.8. Stream target:
TO20000→17600, −12% per month, interval Ev−2. Four frozen goals; six exact
questions scored2/2/2/2/2/1 =11. All short answers are serialized unchanged;
the fuller rubric states the missing local conditions explicitly without
claiming the finite interval class holds at each intervening price.

## Actual rendered workload walkthrough — estimate, not observation

The final rendered HTML body word counts are approximately2,716 paragraaf,
1,799 opgaven (including its duplicated worked route),1,941 answers. These
whitespace counts are orientation, not reading-time or attainment evidence.
Students use one route, not both duplicate editions. No time estimate is
printed in student files. The builder read/solved the actual questions and
checked their complete answer operations against the rendered page layout.

| Core element | Concrete workload and question-level estimate | Minutes |
|---|---|---:|
| Motivation | One higher-price/lower-afzet problem and goal orientation | 2 |
| Instruction | Matched products/old-base %, three figure stages, local conditions and finite boundary; profit distinction | 9 |
| Worked example | W1a–d two contexts with products/%/Ev; W1e explicit concert products/factors/local limitation; W1f missing costs | 9 |
| Recap/transitions | Five-point box, route selection and quick checking | 3 |
| Start1 | a sign/magnitude1.5; b one product0.75; c old-base percentage1.25 | 3.5 |
| Start2 | a competing factors1; b missing costs1 | 2 |
| Independent1 | a1.5+b2+c1.5+d2+e4+f1; includes fresh counterexample and both local cases | 12 |
| Frozen target | a1.5+b1.5+c1.5+d1.5+e4+f1, all six parts | 11 |

Explicit core equation: **2+9+9+3+3.5+2+12+11 =51.5minutes**.
Guided1: a0.75+b1.25+c1.25+d1.25+e0.5+f1+g1 =7minutes.
Guided2: a1.5+b2+c0.75+d0.75+e1+f2 =8minutes.
Support total15; core plus all support **66.5**, not a55-minute claim.
Optional bonus8 and closing8/9 total5 remain outside core; everything79.5.

The read/solve walkthrough contains17 core subquestions (Start5, independent6,
target6), with repeated arithmetic intentionally simple and substantial time
reserved for I1e/target e. No curve drawing, separate diagram creation, hidden
online work or additional timed task was omitted from this accounting. The
explanatory local-vs-finite contrast is relatively demanding: **classroom timing
and attainment remain unobserved**, and a class needing all support requires
additional time. Normal teacher observation may require pacing adjustments.

## Checks and flags for the independent reviewers

- Eleven focused source tests PASS, including all15 old/new contexts, exact
  rational percentages/ratios/products, retrieval calculations, counterexample
  factor multiplication, target tamper rejection, four-figure geometry,
  safe suffixes, route/recap/fading, cross-worktree manifest relocation, and
  supported structural breaks through the unchanged print sanitizer.
- Actual render checker with second build PASS: byte-identical MD/HTML/PDF and
  SVG/PNG assets; complete exact target/goals/short answers; same exercise HTML
  across student editions; literal guided blanks; all page hashes fresh; no
  absolute-Ev token split across PDF text lines.
- Minimum actual body/table/footer type12.000pt; minimum placed figure
  label14.378pt. No builder-observed clipping, overlap, missing content,
  unresolved markup or answer leakage remains. Whole supports/recap and
  counterexample are kept together; the question and answer editions remain
  distinct. Complete paragraphs are for assembly once, not duplicate opgaven.
- Both Part A profiles student-web/publisher-print structurally PASS. Their
  recognition of inherited review/QC is **not current independent acceptance**.
  Root must replace them through distinct reviewer and specialist gates.
- Shared print-pipeline regression tests20 PASS. Current paragraph-production
  and durable twelve-target authority checks PASS. Root retains full-suite and
  exact remote-CI/compatibility decisions; this packet has no CI waiver or
  claim of final-head remote CI.
- Optional current Inspectie mapping omitted. No protected-reference refresh,
  compliance claim, machine-unit promotion or D25 coverage claim. The new local
  Ev/TO machine-unit gap remains explicit as in frozen target metadata.
- No target/plan/registry/hold changes, Ei/Ek, midpoint/calculus, optimal pricing,
  formal output choice, Part B, handoff acceptance, PR or merge. The earlier
  teaching hold owner decisions are not reopened. H-213-OPC2 stays out of scope.
- `npm ci --ignore-scripts` completed with8 existing dependency vulnerability
  notices; no dependency versions or lockfile were changed in this paragraph.

Root may now assign distinct independent paragraph and specialist reviewers to
the exact published paired heads. Required source corrections must regenerate
and receive renewed review; none of the builder records substitutes for that.
