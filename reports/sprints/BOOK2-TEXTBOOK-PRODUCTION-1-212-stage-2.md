# BOOK2-TEXTBOOK-PRODUCTION-1-212: stage 2 builder evidence

Date: 2026-09-05. Builder: `paragraph_212_builder`.
State: `BUILDER_COMPLETE_READY_FOR_INDEPENDENT_PARAGRAPH_REVIEW_AND_QC`.
This is builder evidence only, not independent review, acceptance, a quality-ref,
a human-review packet, a classroom trial or integration permission.

## Scope and prerequisite release

Both worktrees remain on `agent/book2-212-production-20260905`, owned by
`paragraph_212_builder` / `BOOK2-TEXTBOOK-PRODUCTION-1-212`:

- `C:/wt/book2-212-production-20260905/4veco-platform`
- `C:/wt/book2-212-production-20260905/4veco-lessen`

The unchanged plan is lesson commit
`48690ee5bc46b86e2a6b29ce3b8693ca756b8af2`, canonical LF SHA-256
`5e1d318dd1b841467ca297d67956304d1861e3eb68d1df56cc4d32f6434d34a4`.
Independent `correction_plan_review` returned PASS with no required changes.
Root recorded that actual review and explicit production release at platform
`45458b2c8fa5c988756ca9733a4cc261cbed1ea7`,
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-plan-review.md`.
The builder read the release and the accepted §211 handoff before production.

Only the explicitly requested missing prerequisite imports were cherry-picked:

| Repository | Published source | Local import |
|---|---|---|
| Lessons | 938426e9857eff6a7ef54f47c784fd5d70bd44dc | 3c77629 |
| Lessons | 60ad41b555d26b12ba74e9df3014e920bcf99264 | 99827ba |
| Lessons | 7d46d26e54e96e05aa295e6dcfab22f57a2f270e | 94107626f4079ec89c63398ff927032a0b77b6d3 |
| Platform | f7bf6912 | 2cb6d8c4 |
| Platform | 45f8bc6e691297a9eeca83dbb1705292ee327a77 | 117ee7c0 |
| Platform | 45458b2c8fa5c988756ca9733a4cc261cbed1ea7 | 7870560778f672e8ba58bfafa82739838a982c39 |

The final platform import conflicted only in the root command-log append.
The builder stopped. Root inspected the conflict, confirmed no builder changes
to that log and explicitly authorized deleting only the three conflict-marker
lines. An apply_patch removed those markers, retained the complete incoming
append, and changed no other content. Staged diff check passed; cherry-pick
continued. A read-only canonical-LF comparison confirmed the entire command-log
blob equals the published `45458b2c` blob. This is a disclosed bounded import
resolution, not independent builder authorship of root evidence.

Exact §211 prerequisites were verified:
review `92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96`;
quality `0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18`.
The production generator fails closed if these, the paragraph plan, chapter
plan or frozen target record differ.

## Produced payload and pedagogical route

Platform owns `build-scripts/content/book-2/b2_212.py` and the four paragraph
source fragments plus two builder test/check scripts in
`build-scripts/content/book-2/212/`. The lesson `build_pdf.py` is a thin
entrypoint to that generator. The existing reviewed shared print helper remains
unchanged, SHA-256
`570cecd697a3123f145d30dfd25eae738d423baa317f2d6469a2dbaf59aeed2f`.

The lesson folder now contains three current MD/HTML/PDF/ZIP sets and all eleven
pre-pinned SVG/PNG pairs. ZIPs contain the matching current MD, self-contained
HTML, PDF and only their referenced SVG/PNG assets. No student task needs an
external link, online tool, companion or unpublished source.

The four goals and exact bakery target context/prompts/2–2–3–4 points are
serialized from the frozen record; target short answers are also sourced there.
Record SHA-256 remains
`19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9`;
frozen twelve-record package remains
`914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`.
No official CvTE provenance was invented. Literal registry status is unchanged;
governed activation remains separate authority.

The paragraph teaches TO, conditionally GO=P for Q>0 at fixed price, signed
profit with consistent periods, algebraic break-even, continuous versus first
whole-number non-loss quantity, and graph construction/vertical distance.
The theatre visual progression preserves axes while adding TO, TK, break-even
and zones, then the vertical €30 bracket. The kayak example explicitly models
all six planned procedure steps. Start 1–2 retrieves actual prior operations;
optional soap/pots/dance tasks 3–5 provide full-to-partial support and a combined
price/cost misconception contrast. Independent minigolf task 6 and exact target
7 contain no answer graphs. Bonus 8 compares scales without changing economics.
One cumulative later/home task 9 retrieves §211 costs and units.

The complete exercise fragment is emitted once into both paragraph and opgaven,
including the worked example and five-bullet recap. The seven prescribed
exercise headings, all numbers 1–9 and literal a–d target letters survive HTML
and print. All planned cases, goal requirements and scope are unchanged.
No material plan change was made.

## Builder iteration and final page inspection

| Build | Observed pages (paragraph / opgaven / answers) | Builder correction or status |
|---|---|---|
| R1 | 15 / 9 / 6 | First render; recap split and over-expanded bonus layout were not accepted |
| R2 | 14 / 8 / 6 | Kept recap together and compacted bonus; target/bonus page grouping still needed work |
| R3 | 14 / 7 / 6 | Kept complete target and bonus groups; widened compact source geometry with measured placed type |
| R4 | 14 / 7 / 6 | Corrected worked-example tick wording to two and partial-graph vertical title to TK and TO |
| R5 | 14 / 7 / 6 | Kept step 6 heading with its explanation in opgaven; final builder candidate |

The final R5 PDF/image bytes for paragraph and answers equal R4; only opgaven
pages 1 and 2 changed. A read-only page-PNG byte comparison verified that delta.
Nevertheless, the builder personally opened **every final R5 full-page PNG**:
paragraph 1–14, opgaven 1–7 and answers 1–6, not merely the contact sheets.
All are readable with consistent footers, captions and table layout; the final
orphaned heading is repaired. The target stays intact with no answer leakage.
Some deliberate whitespace protects complete graphs/targets; none is a blank
or abandoned context page. Guided pots context and its source occupy facing
opgaven pages 4–5. Page-specific observations are in each final
`builder-inspection.json`.

Generated proof manifests remain immutable with `inspection_status: PENDING`,
empty `pages_inspected` and no manufactured acceptance. The separate
`builder-inspection.json` files explicitly identify the author as builder,
bind exact PDF/HTML/MD/manifest/page hashes, and do not approve student use.
Only these three final proof directories are published:

- `C:\wt\book2-212-production-20260905\4veco-platform\reports\rendered-proof\BOOK2-TEXTBOOK-PRODUCTION-1\212-paragraaf-e94d42f66ab9-r5`
- `C:\wt\book2-212-production-20260905\4veco-platform\reports\rendered-proof\BOOK2-TEXTBOOK-PRODUCTION-1\212-opgaven-94ebe5d35207-r5`
- `C:\wt\book2-212-production-20260905\4veco-platform\reports\rendered-proof\BOOK2-TEXTBOOK-PRODUCTION-1\212-antwoorden-07a75d7b5b69-r5`

Root instructed the builder to keep superseded proof directories untracked and
not delete them. R1–R4 remain local historical material, not published proof or
current acceptance. The historical build/check JSONs are published as truthful
iteration records; only R5 binds the final current source/output package.

## Typography, contrast and geometry

Automated PDF text-transform checks measured **12.0pt minimum**, including every
footer. Raster figure placement was checked from actual PDF image bounding boxes,
not source font declarations alone. All SVG labels use 30pt source type (40 CSS
pixels); normal 1000-wide figures place at 18.822pt, and the full-width compact
1500-wide bonus places at 12.548pt. No figure or text extends beyond page bounds.

On #F7FAFC the measured contrast ratios are:

| Role | Colour | Contrast |
|---|---|---|
| Essential cost stroke/label | #6F3611 | 9.05867:1 |
| Essential TO stroke/label | #1A5276 | 7.97421:1 |
| Axes, intersection, bracket and ordinary labels | #1F2937 | 14.00439:1 |
| Narrow non-essential cost accent | #E67E22 | 2.71766:1 |

TK uses a 9px dark dashed stroke with a 2px orange accent; TO is a 7px solid blue
stroke. Orange is never the sole carrier of a task-critical line or label.
Direct dark labels and dash/solid distinctions preserve the geometry in grayscale.
Two explicit Poppler `-gray -png -r 150` probes were personally inspected:
answers page 5 (target intersection/vertical profit) and opgaven page 7 (two-scale
bonus). Their PNGs and hashes are in the final builder-inspection records.
Grid lines are subordinate scaffolding, not the task's only numerical source.

A single coordinate transform places each line, crossing and vertical bracket.
Exact-rational tests recompute all six graph cases and first non-loss integers.
For the target, continuous Q = 5000/7 and TO = 7500/7; Q714 gives -€0.20,
Q715 gives +€0.50, and Q1000 gives €200 vertical profit. No profit area is drawn.
All candle, dance and cumulative-cost arithmetic is separately tested.

## Checks actually run and limits

| Check | Observed result |
|---|---|
| Fetch both remotes before edits/imports and before publication | Exit 0; three expected imported commits ahead, zero behind/divergence |
| Claimed-worktree checks after imports and during final QA, both paths | PASS exact owner/task/branch; current authored files and historical proof explicitly dirty |
| Governance freshness before production and final publication | PASS; origin/main 96416b6b5bd57094576e9aba0a42d682584ec479, no differing governance entrypoints |
| Approved outline `paragraph_production` for 2.1.2 | PASS after imports, on every build and at final QA |
| Durable Book2 target authority | PASS twelve records after imports, on every build and at final QA |
| `python build-scripts/content/book-2/212/test_source.py` | PASS 10 tests, including exact target, arithmetic, geometry, source parity, no answer leakage, contrast, timing and reproducibility |
| `python build-scripts/content/book-2/212/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-render-check-r5.json` | PASS all 27 pages, exact frozen target text/points, paired HTML, text/figure size and ZIP byte parity |
| Normal `validate-paragraph.js --mode part-a --profile student-web` | Mechanical PASS only; legacy review reports no explicit verdict |
| Normal `validate-paragraph.js --mode part-a --profile publisher-print` | Mechanical PASS only; same legacy limitation |
| Personally viewed final R5 pages | All 27 full pages plus two explicit grayscale probes |
| Raw-byte source check | All seven owned Python/Markdown source files are LF with no BOM |

Both normal paragraph validators accepted the untouched old review because it has
no explicit verdict and no FAIL marker, and accepted the old syntactically valid
quality-ref. Those records are **unaccepted legacy salvage for this new payload**,
not a fresh review or approval. Root was explicitly notified of this mechanical
limitation. The builder did not alter either file, create a replacement verdict,
or claim that a validator PASS supplies independent paragraph acceptance.

No full platform test suite, independent paragraph review, independent QC,
classroom timing observation, integration CI or production-use acceptance is
claimed here. The 10 source tests are builder regressions, not an independent
review. The final lane/scope and commit/publication results are recorded in the
delivery message; exact new commit hashes cannot be self-referentially embedded
in this same commit.

The production-only lesson lane probe at
`afc2ed53e6ae5f85bbeaa3c61172fc419b59e08f`, base
`94107626f4079ec89c63398ff927032a0b77b6d3`, returned **FAIL**: 32 paths were
correctly classified as Part A and the three planned textbook ZIP downloads
were unclassified. No Part B or other unknown file was present. Root was asked
to own a bounded shared classifier fix or reviewed exception. The builder did
not edit the shared checker, drop the planned outputs, or claim this scope
failure was a PASS. The lesson commit contains exactly the 35 planned output,
entrypoint and asset changes; its staged whitespace check passed.

Three extra blank lines at EOF in builder-only inspection JSON were removed
after the staged whitespace check identified them. A generated report heading
label was corrected from its path-splitting draft value. Failed exact-context
report patches changed nothing and were retried against the actual file text.

Final R5 build manifest:
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-build-r5.json`,
SHA-256 `b9e286b0f27fa65f92f24a8e379e10d5d39e5d41ec4334e5f72c8987cbbbb7b1`.
Final rendered-check record:
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-render-check-r5.json`,
SHA-256 `1657539883505ed2791a18b9ab1e2797b4839c2117bbfed9b1d77fef4f4d48b4`.

### Paragraaf

- PDF SHA-256: `e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2`
- HTML SHA-256: `be9a3618444b65cc3aa5c2a33b94a81c5cbe864da7e7ea8fea63d746a60ef006`
- Markdown SHA-256: `f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09`
- ZIP SHA-256: `9e08b74bfb676bd92f07c56ebbb7767d8c380b49a1754b981fd8b45a0def492a`
- Immutable proof manifest SHA-256: `db1a80500e15785ca605ff672704d3c66a22a0d15a256fff95a8582afd0f0ac5`

### Opgaven

- PDF SHA-256: `94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a`
- HTML SHA-256: `69e45f51c2c5690235e1d68f54dadf76818e190b9e10a96afbcfb50c2f71eb85`
- Markdown SHA-256: `f96c6393ec72488d925d432dec256db714396f210107f5e5abd8f235bfccb938`
- ZIP SHA-256: `d8e3e6714a09e50f6e702b2956f41ec37dfd73cb8b0044e8f90495738f5c1c20`
- Immutable proof manifest SHA-256: `701acab4c0210e2744a32dd5ee3a08388942d20ec97314208a121674843fbc9f`

### Antwoorden

- PDF SHA-256: `07a75d7b5b69344d38d5da9e5f2e0a3b964d86cc64c383b37809f8263fb33192`
- HTML SHA-256: `767bf8ee21be2b67676e0a80558d7bbe373cc7cab8c8ac0c96a0056f7228f221`
- Markdown SHA-256: `d7dbebf97de900b7ecc4520e63c822201d39ce796c5c7e3aab83b4dcc9e900ee`
- ZIP SHA-256: `810166af6f45837381a4b8333bbff08d279773ccc4419b839c6a25b8e05d69d1`
- Immutable proof manifest SHA-256: `a6c832c6ad3416fa6bd84599ed402c3efbd806556af543fe50163bd12d1b75c2`

## Timing and publication boundary

The separate `BOOK2-TEXTBOOK-PRODUCTION-1-212-timing.md` records the unchanged
54-minute whole-core estimate, including instruction rather than exercises only.
Support adds 13 minutes (67 total), bonus adds 6 and closing retrieval adds 4
(all-item estimate 77). These are not measured timings or evidence of mastery.

No target, outline, root/chapter plan, shared helper, index, Part B file, review
or quality-ref was changed by production. Root remains sole coordinator and
owns global map/index refresh, exact-head CI or explicit waiver where required,
fresh independent paragraph review, separate independent QC, integration of
accepted outputs, and later chapter/book assembly. No PR or merge was opened;
the parent explicitly prohibited both in this bounded builder assignment.

Corrected working mistakes are disclosed rather than counted as successful
checks: a guessed §211 generator path was corrected with rg; one unfocused file
discovery was truncated; an unsupported same-file Delete/Add apply_patch attempt
failed without edits and was replaced by Update; one exact-context step-6 patch
missed and was retried against observed text; two read-only Node command quoting/
syntax errors and a downstream JSON parse were corrected. None changed sources,
authority, tests or proof. The only actual merge conflict and its explicit root
authorization are documented above.

Next action: root should integrate the exact published production-only commits,
refresh the shared discovery surfaces, arrange any required current-head CI
evidence, then assign fresh independent §212 paragraph review and separate QC
against R5. This package is review-ready, not accepted for students.
