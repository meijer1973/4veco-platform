# §2.1.3 R5 — distinct specialist QC

Reviewer: `paragraph_213_r5_specialist_qc`, 2026-09-05.
Task: `BOOK2-TEXTBOOK-PRODUCTION-1-213-R5-QC`; parent #229/#223 production.
Overall verdict: **REVISE**. Three unique HTML short alternatives and the
corresponding we1 SVG accessible title violate the required accessibility
standard. No additional mathematical or visible print
defect was found. This is not paragraph-review, quality-ref or root acceptance.

## Exact subject and independence

Owned, freshly claimed pair:
`C:/wt/book2-213-r5-qc-20260905/{4veco-platform,4veco-lessen}`;
both branches `agent/book2-213-r5-qc-20260905`.
Platform base `6d508f9f0820f112ee5646b971b4f957fd0cf9b1`;
lesson base `1727cd57ea1ceb60db5259b83b2b192389cb7590`.
The preceding independent paragraph reviewer evaluated original producer heads
`955d1a2b1720e6836f2fbcb6c424be09cc93b40b` /
`ff388b9a23336333de114688ba98a14cb4f24e6e`. That PASS WITH FLAGS report and
canonical review were read as inputs, not inherited as personal observations.
This specialist did not author the lesson, paragraph review or root handoff.
All specialist roles below were personally performed in this distinct session.

| Reviewed final PDF | Pages | Raw SHA-256 |
|---|---:|---|
| paragraaf | 14 | 534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024 |
| opgaven | 9 | d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05 |
| antwoorden | 6 | aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a |

Plan LF `4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234`;
C21 LF `ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116`;
frozen target `df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef`.
Full original input/output pins are reverified in `specialist-relocated-build-r5.json`
and all24 artifact snapshots in `specialist-rebuild-r5.json` below.

Read-first basis: both AGENTS, product vision/end-state/companion specifications,
BUILD-PARAGRAPH/BUILD-CHAPTER/build documentation, lane/schema contracts,
textbook/exercise/didactic/graph/PDF/paragraph-review/QC skills, and distinct
teacher/student/visual/accessibility/testing role specifications. Selected
authored didactic, terminology, mathematical-precision, pedagogical-boundary,
figure and rendered-page standards and external school/Inspectie references
were read personally. Root/C21/213 plans, stage1/output plan, scoped semantic
outline/current hold evidence, source generator and all four teaching/answer
sources were inspected. Actual §211 average-cost teaching and §212 revenue,
signed-profit and vertical-distance teaching were read, not inferred from IDs.
The §212 accepted handoff supplements the historical planning-time prerequisite
wait; its source pin is f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09.

The PDF skill required actual full-page views; dependencies were loaded and
fresh Poppler150-DPI proofs generated. Root's existing41-PDF operation marker
was not duplicated for this review/reproduction.

## Blocking finding: 213-R5-A11Y-SHORT-ALT

Classification: `core_spec_failure`. Authority:
`agents/accessibility-agent.md`, Short alt text: at most120 characters,
noun-first, concise and functional. HTML img alternatives were inspected,
not merely Markdown captions. Each embeds the PNG and repeats its full visible
caption after whitespace normalization. No separate short alternative exists.

| Asset | Actual alt length | Actual affected editions | Required correction |
|---|---:|---|---|
| 2.1.3_fig_3 | 158 | paragraaf | Short noun-first functional alt; current start “Bij dezelfde…” is also preposition-first |
| 2.1.3_fig_4 | 155 | paragraaf | Separate concise functional alt within120 characters |
| 2.1.3_we_1 | 160 | paragraaf and opgaven | Separate concise functional alt within120 characters in both generated occurrences |

This is the complete actual HTML violation set among all six unique figures/eight
occurrences, not a sample. Other alts are101,113,60 characters for fig1,fig2,ex1.
Their opening noun phrases identify the day/table/patches and convey function;
no further mandatory short-alt correction is identified. Exact texts, normalized
captions, embedded-PNG identity hashes and all document HTML hashes are in
`specialist-accessibility-r5.json`.

Supplementary direct inspection of all six actual SVG accessible names found
one corresponding metadata violation: `_assets/2.1.3_we_1.svg:1` has
`role="img" aria-labelledby="title"` and `<title id="title">Vergelijk de drie
eindpuntrijen van Lus en Bout; constante en stijgende MK</title>`. The accessible
name starts with the imperative “Vergelijk”, not a noun phrase. It must become
a concise noun-first functional title while the printed labels/geometry remain.
The other five titles are descriptive noun phrases within120 characters;
fig3/fig4 titles need no change. Exact strings, lengths, raw SVG hashes and
accessible-name bindings are in `specialist-svg-metadata-r5.json`. Thus the
bounded complete required set is three unique HTML short alts (four generated
occurrences) plus this one we1 SVG accessible title, not a fourth figure.

The long descriptions are substantively present and must remain: fig3's
Q0/10/20 and TO0/80/160, two80/10 ratios and fixed-price explanation; fig4's
signed endpoints, changes50/30, denominator10 and MO−MK bridge; we1's native
Lus/Bout totals, first fractions, remaining patterns, units and endpoint meaning.
Fig1/2/ex1 likewise have adjacent labels, native tables and explanatory text.
These are interval diagrams, not axes requiring invented axis descriptions.
Do not solve the short-alt issue by deleting the visible educational detail.

Root reported a feasible native Pandoc route, demonstrated on a separate stdin
fragment: `![Long visible caption](figure.svg){alt="Short functional alternative."}`.
This is a proposed bounded builder correction, **not** an independently verified
R5-to-new-output parity result. Builder must prove actual generated img alts,
unchanged visible captions/body, preserved long descriptions and all relevant
source/HTML/PDF/ZIP tests after regeneration. Exact PDF/page parity may be
possible, but is not presumed. SVG title byte change must be distinguished
from visible geometry/PNG parity and proved by actual regeneration. No source
or production helper was edited by this reviewer.

Blocks: final §213 Part A quality-ref/handoff acceptance and downstream reliance
on this package as fully reviewed. Does not block: preparing that bounded
source correction or unrelated authorized paragraph work. Proof to close:
all actual new short alts pass the complete standard; complete descriptions
remain; fresh exact-payload independent review/QC and required rebuild/render
proof pass. No exemption or owner waiver is recorded.

## Specialist role verdicts

### Teacher learning quality — PASS for bounded printed learning design

Rubric14/14: alignment2, prior knowledge2, sequence2, formative assessment2,
differentiation2, dual coding2, transfer/retention2. This is design judgment,
not observed pupil attainment or override of the accessibility blocker.

| Book2 contract criterion | Personal finding |
|---|---|
| Goals/target | Four literal goals; all five target demands receive instruction, practice and corresponding answers |
| Foundation | Current213 action permitted; formal output-choice hold remains separate |
| Prerequisites | §211 explicitly teaches division by positive Q and units; §212 teaches fixed-price TO, signed same-Q profit and vertical distance; printed recall and Start1 retrieve them |
| Sequence | Holder table → normalized cost → revenue analogue → two-interval profit bridge → complete Lus/Bout example |
| Worked example | Both target-like native starting tables and complete calculations, placement and meanings are supplied before independent work |
| Recap/Start | Five-point non-heading recap; Start1 prior arithmetic/units; Start2 current-content misconception and faded bridge |
| Guided practice | Patches has fractions/arrows/stems; coasters removes them and varies interval width; organizers separates then combines changes |
| Independent/target | Draad/Kaft removes worked cells/cues; Linea10/Curva6 blanks and exact15 points remain |
| Differentiation/bonus | Optional printed support, same destination; K/L tests unequal-interval and individual-product inference limits |
| Continuity | Closing positive-Q TK/TO/GTK/profit retrieval; no new theory or device requirement |
| Timing | Actual54 core,66 supported,78 all-item estimates; unobserved flag below |
| Language | Neutral paper route, canonical Dutch economics, no internal lane/device/diagnostic/mastery claim |

The four-minute bridge is inside instruction13 and Start2's4, not an unbudgeted
fifth target. Source totals are supplied so Q² evaluation/calculus is not new
work. Paper answer models provide corrective steps and units, not mere results.
The normal route includes the bridge even when optional support is skipped.

Timing flag `213-R5-TIMING`: 2+13+8+2+(3+4)+(2+2+1+3+2)+(2+3+1+4+2)=54.
Guided adds12=66; bonus8/closing4 gives78 all-item. Integer ratios, supplied
tables and repeated operations support plausibility, but the one-minute margin
is vulnerable to writing, page turns and remediation. Blocks observed55-minute
feasibility/attainment claims; does not by itself require target reduction or
block the bounded printed design. Close through classroom task-time/support
observations and reviewed pacing changes if necessary. No observations exist.

### Economics/mathematical precision — PASS

Independently recomputed14 cases with exact fractions plus Start1/bonus/closing,
then compared every pupil/answer table and explanation. Evidence is
`specialist-arithmetic-r5.json`; all10 source tests also passed.
Linea profit−200/−150/−100/−50, MK3, MO8; Curva profits−100/25/100/125,
finite MK5/15/25, MO30 (not derivative10/20/30). Native supplied Curva profit
and Q0 marginal dashes remain; four goals/five prompts/4+3+2+4+2=15points.
No total-column construction or graph-construction extension is added.

Holder profits−20/30/60 give changes50/30 over10:5/3=MO8−MK3/5.
Start2 has ΔTO12,ΔTK8,ΔQ2:2, checked against (4−0)/2; first interval4 is
modelled and second faded. Coasters uses denominator4, not2. Organizers fixed
fee cancels from ΔTK so MK2; price6→7 gives MO7; combined endpoint profit10
is not an interval value. K/L widths4/8 yield MK3/3 versus5/2 and cannot identify
the fifth unit. Start1 GTK6.50/negative profit−6 and closing GTK7/4.50 use only
positive Q. Q0 averages are never computed; actual prior teaching excludes them.
All conclusions are finite, same-period, same-interval and endpoint-bounded.
No derivatives, area-as-profit, instantaneous single-unit claim or optimal Q.

### Dutch language — PASS

Terms, decimal commas, signs and total-euro versus euro-per-extra-product units
agree across representations. Plain “binnen het interval” and right-endpoint
reminders prevent reading the numbered row as one individual product. No
additional Dutch-content correction; short-alt prose needs the separate repair.

### Student experience — PASS for the printed route

Rubric12/12: orientation2, affordance2, cognitive load2, motivation2,
confusion control2, graphical support2. A15-year-old reader sees the batch-cost
question and four goals, a complete procedure, clearly labelled optional help
and target-like work. Writing blanks are native and legible. Tables/figures use
the same amounts; progressive arrows locate the right endpoints; named totals,
ratios and monetary units prevent guessing. Answers allow checking approach.
The example spans pages and the recap is substantial, but numbered steps and
intact tables keep the paper route navigable. Pacing remains the timing flag,
not empirical proof. This printed judgment does not accept defective HTML alts.

### Visual QA — REVISE (9/10)

Clarity2, contrast/legibility2, hierarchy2, paper affordance2, accessibility1.
All29 final full pages, six standalone PNGs and five fresh grayscale pages were
personally viewed at normal full-page reading scale. Detailed observations:
`specialist-personal-inspection-r5.md`. No clipping, overlap, broken glyph,
missing image, overflow, stranded heading, lost source row or unreadable answer
found. Target d/e continue onto the following page coherently. Exact six SVG
sources/exports agree; tables/interval cards are not unsupported curve diagrams.
Font measurements:12.0pt minimum body/table/footer;15.685038pt minimum placed
figure labels. Dark essential geometry and directly labelled blue revenue
remain identifiable in grayscale. Minimum computed source text contrast is
7.974:1 (blue on#F7FAFC); dark geometry11.438:1, text14.004:1 on that background.
The one required revision is accessible short alternatives, not print geometry.

### Accessibility — REVISE

Readable print, contrast, non-colour meaning, logical h1/h2 structure, nl language,
semantic tables and substantive long descriptions pass these scoped checks.
Alternative-description short form fails as enumerated above. Native text
extraction, not OCR, was used; no OCR confidence was invented. No interactive
controls exist in these three documents; companion keyboard/mobile/dark-mode
interaction, screen-reader user testing and a blanket PDF/UA/WCAG certification
are NOT RUN/outside this bounded paper review. No general accessibility
compliance claim follows from the passing contrast or structural tests.

## Test evidence and scope

Own evidence prefix `reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-`.
Commands, timestamps, cwd, exits and stdout/stderr hashes/excerpts are in
`BOOK2-TEXTBOOK-PRODUCTION-1-213-R5-QC-command-log.{jsonl,md}`.
All Python commands used `C:/Python314/python.exe`, inherited PATH, no MSYS
prepend. Full build used ordinary platform cwd for Node and extended lesson
root; checker used extended Python script path. No renderer patch or tolerance.

| Check actually executed | Exit/result | Evidence |
|---|---|---|
| Own Pass0 integrity before substantive disposition |0/PASS|specialist-pass0-r5.json|
| Own input/output/proof hash bindings |0/PASS|specialist-proof-bindings-r5.json; historical PENDING unchanged|
| Own exact-fraction calculation probe |0/PASS|specialist-arithmetic-r5.json|
| `213/test_source.py` |0/PASS,10 tests|command log|
| Untouched `213/check_render.py` |0/PASS|specialist-render-check-r5.json; six zero pixel/channel/byte differences|
| Full generator and print-only rebuild |0/PASS|specialist-rebuild-r5.json; all24 before/full/print hashes equal|
| ZIP inventory/CRC/member bytes |0/PASS|same checker; exact15/7/3 members, no answer leakage|
| Fresh Poppler pages/grayscale/contrast |0/completed|specialist-media-manifest-r5.json;29+5 pages; not automatic visual approval|
| Complete HTML image inventory |0/diagnostic REVISE|specialist-accessibility-r5.json; PNG-byte identity and alt/caption data|
| Complete SVG accessible-name inventory |0/diagnostic REVISE|specialist-svg-metadata-r5.json; six role/title bindings and one imperative-first title|
| Both normal Part A profiles |0/structural PASS|student-web and publisher-print; sees prior review/legacy quality, not current acceptance|
| Approved paragraph_production213 and durable authority |0/PASS|12 frozen records/current holds; command log|
| Candidate lane scopes |0/PASS|platform base5a5887224e5c0d80f77a795935e44528e48b2cee shared; lessons baseabe73479d900c1c3dd4cccb9c568305eb58c7a18 textbook|

Testing verdict: **PASS for the executed numerical/rebuild/structural checks**,
with a confirmed coverage gap: existing tests did not enforce short-alt policy.
This is not an overall product PASS. Full platform suite, paired-final CI and
future corrected-payload tests were NOT RUN. This evidence-only reviewer diff
is checked separately from whole-candidate scope; no shared source mutation
was manufactured to satisfy a review-only scope checker.

Read/diagnostic incidents remain honest: a few guessed skills-directory paths
and a platform-relative companion-spec path failed read-only and were corrected
by discovery. The first media diagnostic retained embedded base64 source bytes
and compared caption whitespace literally; its generated file remains unchanged.
The compact second diagnostic maps PNG bytes to exact asset names and normalizes
caption whitespace, proving equality. These diagnostic defects did not mutate
the reviewed outputs or conceal a failing render/source test.
The initial staged whitespace check failed on CRLF/trailing-whitespace output
fragments in this review's generated Markdown command log. Only that Markdown
presentation was mechanically normalized to LF with trailing whitespace
removed; the JSONL records, raw stdout/stderr hashes and diagnostic evidence
were preserved. The fresh staged whitespace check then passed with exit0.

## Reference freshness and unchanged boundaries

The QC skill prompted a current official Inspectie source check. The local
reference last-verified2026-04-12 is not asserted current: official
[2026 framework notice](https://www.onderwijsinspectie.nl/actueel/nieuws/2026/07/03/onderzoekskaders-2026-vastgesteld)
and [2026 changes](https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2026)
describe the updated framework effective1August2026. No protected reference
was edited and no current compliance mapping was made. Refresh/mapping remains
the root's separately scoped follow-up, not a local waiver of content QA.

No canonical quality-ref change is justified while REVISE is unresolved.
Unchanged `2.1.3-quality-ref.yaml` raw and LF SHA-256 are both
`c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f`.
Its historical HARDEN/upstream reviewed_final language is not acceptance of
this frozen R5 package. No paragraph review, handoff, pupil source, asset,
target, plan, hold, machine unit, Part B field or protected reference changed.
H-213-OPC2 remains outside agreed scope; Part B is uncommissioned. Root owns
integration and later handoff; no PR/merge/final-CI/attainment claim is made.
Next action: builder short-alt source correction, regeneration and renewed
exact-payload independent check, then root's normal gated continuation.
