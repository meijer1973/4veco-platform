# §2.1.3 Part A production packet — R5

Producer: paragraph_213_producer. Date: 2026-09-05. Task:
BOOK2-TEXTBOOK-PRODUCTION-1-213-OUTPUT, under #229. This is a **builder
delivery for independent review**, not paragraph acceptance, specialist QC,
handoff approval, CI certification or permission to produce another paragraph.

## Delivered scope and source authority

The canonical §213 lesson folder contains three MD/HTML/PDF editions, three
same-edition deterministic ZIPs, six native SVG/PNG pairs and a thin
`build_pdf.py`. Authored material, generation and checks live in platform
`build-scripts/content/book-2/b2_213.py` and `build-scripts/content/book-2/213/`.
The shared print pipeline remains unchanged. Generated output was never
hand-edited to satisfy a check.

Accepted paragraph-plan LF hash remains
`4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234`.
Frozen target record remains
`df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef`.
Both are checked before writes. The operational stage-2 plan records the exact
paired bases, accepted chapter plan and actual §211/§212 prerequisite pins;
the final build manifest repeats all checked pins. The four literal goals,
two literal target tables, Linea's ten blanks, Curva's six marginal blanks,
Q0 dashes, five literal prompts and 4/3/2/4/2 points are preserved. Curva's
profit column is supplied, not a new pupil operation.

No registry, lifecycle, teaching-hold, companion, machine, shared pipeline,
historical review/quality or accepted-plan changes were made. H-213-OPC2
remains outside the agreed paragraph scope. There is no derivative,
instantaneous marginal interpretation, optimization or formal output-choice
rule. Root owns subsequent independent review, specialist QC, handoff and
integration decisions.

## Actual page and artifact map

| Edition | Pages | PDF SHA-256 | R5 proof folder under reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/ |
|---|---:|---|---|
| paragraaf | 14 | 534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024 | 213-paragraaf-534177c8280e-r5 |
| opgaven | 9 | d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05 | 213-opgaven-d12487671bd2-r5 |
| antwoorden | 6 | aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a | 213-antwoorden-aa3b6ccc9dbb-r5 |

Each R5 directory has the untouched generation `manifest.json`, all page
PNGs, contact sheet and a separate attributed `builder-inspection.json`.
The generation records remain `PENDING`, empty `pages_inspected`, null visible
defects and `inspected_at_normal_reading_scale: false`. They were never
promoted into an approval record.

The builder personally viewed all 29 final page contents individually at
normal reading scale, not only contact sheets. The 14 paragraph pages were
first viewed from R4; after the two final copy fixes, R5 pages 6 and 8 were
individually re-viewed and the other twelve final page PNGs were verified
byte-identical to the individually viewed R4 images. All nine R5 opgaven and
six R5 answer pages were individually viewed. Per-page observations and
final raw PNG hashes are in the separate builder records. No visible pupil
defect remains in the builder's inspection; this is not an independent verdict.

Grayscale full-page views covered paragraph pages 2, 3, 5, 7 and 10: all six
figures. Dark labels, finite-interval arrows, calculations, blank cells and
MK/MO distinctions remain legible without colour. Grayscale captures are
supplementary diagnostic evidence, not new pupil editions. Their exact PDF
and PNG pins are recorded in the rebuild report. The unchanged five capture
files are published under
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/grayscale-r5/`.
`grayscale-relocation-r5.json` in that evidence parent binds every historical
capture path to its published repository path and rechecked identical hash;
the historical rebuild report and capture bytes were not rewritten.

## Teaching and operation fulfilment

| Plan operation | Actual implementation and review location |
|---|---|
| Retrieve totals, averages, signed profit and same-Q meaning | Opening box and Start1; paragraph pp1/8, opgaven p4; answers p1 |
| Introduce interval, numerator, denominator and MK | Holder Q0/10/20 and progressive fig1/2; pp1–3; TK/Q and raw ΔTK explicitly distinguished |
| Introduce MO and fixed-price condition | Same quantity layout plus TO, fig3; p3; no unconditional MO rule |
| Bound interval-value placement and meaning | Explicit right-endpoint convention and Q0 dashes; pp2–4 and worked example; no claim about a single internal product |
| Teach bounded profit-change bridge | Both holder intervals explicitly modelled in prose and fig4 pp4–5, then faded Start2 p9 / opgaven p4; not a fifth goal |
| Full target-shaped model | Lus/Bout initial and complete six-column tables, all differences/denominators and interpretation; paragraph pp5–7, opgaven pp1–3 |
| Fading with planned contexts | G3 fractions/arrows/stems, G4 unequal interval without these templates, G5 combined fixed/price changes; pp10–11 / opgaven pp5–6 |
| Independent target-equivalent operation chain | Draad/Kaft Q0/4/8/12, exact 10/6 missing-cell patterns, five prompts, no computation scaffold; p12 / opgaven p7 |
| Frozen target | Generated directly from verified record; pp13–14 / opgaven pp8–9; expanded answers pp4–6 |
| Optional flexible comparison and spaced retrieval | K/L unequal intervals, missing internal increment information, headphone totals/GTK; final page |

Minimum actual PDF text, tables, captions and footer: **12pt**. Minimum
placed figure label: **15.685038pt**, measured from PDF image transforms;
all SVG labels are 30pt at source. Six large native figures use explicit
labels and dark essential geometry; they are discrete interval diagrams,
not smooth marginal curves. Tables retain handwriting-sized blank cells.
The two-page frozen target is not shortened to fit a smaller page count.

## Validation performed

All commands below used the owned platform worktree unless explicitly noted.

- `C:/Python314/python.exe build-scripts/content/book-2/213/test_source.py`:
  **10 tests pass**, including altered-target and bad-prerequisite fail-closed
  probes, literal target cells/goals/points, all finite case arithmetic,
  supplied formula totals, profit identity, unequal intervals, combination
  case, retrieval, seven-stage headings, source parity and figure bounds/type.
- `C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py
  reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-render-check-r5.json`:
  PASS. Includes native target table cells and PDF text, exact same exercise
  HTML, all question IDs, 12pt floor, placed figures, page bounds smoke check,
  exact six-pair rerasterized PNG bytes and exact edition-specific ZIP
  inventory/CRC/member bytes. It explicitly supplies no visual approval.
- `verify_rebuild.py` with the R5 manifest: PASS for a **full generator
  rebuild** and a **separate print-only rebuild**. Both reproduce all 24
  generated MD/HTML/PDF/ZIP/SVG/PNG artifact bytes exactly. This is measured
  in the stated local toolchain, not a cross-machine portability claim.
- `node scripts/validate-paragraph.js --mode part-a --profile student-web
  <exact lesson folder>`: PASS. The `publisher-print` Part A profile also
  passes. These mechanical checks see the **untouched legacy review and
  quality-ref**; their presence is explicitly NOT fresh acceptance.
- Approved-use `paragraph_production 2.1.3` currentness and durable
  twelve-target authority checks: PASS before generation and each full
  rebuild. They do not claim unrelated-record PR-scope verification.
- `git diff --check` in both owned worktrees: PASS.
- Repository scope was checked separately using the unchanged existing
  classifier: platform **shared lane PASS** (eight paragraph-owned code/source
  files classified `shared_platform`, plus review evidence); lesson
  **textbook lane PASS** (25 Part A paths). No exception, classifier change,
  companion changes or combined textbook-lane pass is claimed.

Source, HTML, PDF, ZIP and asset raw pins are in
`BOOK2-TEXTBOOK-PRODUCTION-1-213-build-r5.json`,
`BOOK2-TEXTBOOK-PRODUCTION-1-213-render-check-r5.json` and
`BOOK2-TEXTBOOK-PRODUCTION-1-213-rebuild-r5.json`.

## Corrections and limitations, without retrospective approval

R1–R4 intermediate build records are retained as historical producer
diagnostics, not current artifacts or approvals. R1 separated some table
labels from tables; source grouping fixed this. The first fenced-div/native
table attempt produced nested blocks and literal fences in R2; conversion
to well-formed raw structural divs fixed it in R3. R4 grouped Start2, kept
G3's complete prompt/visual on one page and retained 12pt typography. R5
fixed a Dutch possessive and changed the common self-check so the standalone
exercise edition does not refer to goals that are not printed at its front.

Default Windows Cairo font hinting initially caused sparse antialias pixel
variation. An investigated paragraph-owned SVG `text-rendering="geometricPrecision"`
setting stabilizes the rasterization. The provisional tolerance was removed;
the final test requires **exact PNG bytes and zero changed pixels**, and both
full and print-only output identity were measured. No raster exception is
being requested or treated as accepted.

Read-only/preflight command mistakes (wrong handoff basename; validator
initially invoked from lesson rather than platform; diagnostic module path;
image path initially omitted `pages/`; shell display encoding and glob
display errors; final ownership-check invocation initially omitted its
required `--check` mode) failed without authority changes, were corrected and were
not counted as passing checks. The apply-patch tool rejected a combined
delete/add of the wrapper; the corrected update succeeded before production.

An earlier combined platform-plus-lesson `checkLaneScope` diagnostic with
`lane: textbook` failed correctly because platform source files classify as
`shared_platform`; the grayscale diagnostic folder was also outside the
rendered-proof classifier's narrowly permitted names. A quoted-path diagnostic
also misclassified Unicode ZIP names until `core.quotepath=false` was applied.
The final checks use separate actual repository lanes, and the unchanged
grayscale captures were relocated to the already permitted sprint-evidence
namespace with explicit old/new path and hash bindings. None of these failed
diagnostics was converted into a retrospective pass or guard exception.

Final independent paragraph review, distinct specialist QC, fresh review and
quality-ref, accepted handoff and integrated CI are **not run by this builder**.
The safe next action is root-assigned independent review at exact published
paired heads, not downstream acceptance inferred from mechanical validators.

## Timing flag retained

Unobserved design estimates: 54-minute core, 66 minutes with all guided
support, 78 minutes with support, bonus and closing retrieval. Core equation:
2 motivation + 13 instruction (including 4 bridge) + 8 worked example +
2 recap/transitions + 3/4 Start + 2/2/1/3/2 independent + 2/3/1/4/2 target
= 54. Guided3/4/5 add 4/4/4; optional bonus adds8 and closing adds4.

The actual copy retains the complete operation chain. Multi-row work,
written interval explanations and page turns may take longer in class;
teachers must observe pacing and comprehension. No frozen operation was
reduced and no numeric timing promise appears in pupil sources.
