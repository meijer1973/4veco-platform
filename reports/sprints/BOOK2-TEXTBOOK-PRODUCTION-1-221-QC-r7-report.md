# §2.2.1 R7 specialist QC — REVISE

Date: 2026-09-05. Reviewer: **paragraph_221_r7_specialist_qc**.
Task: BOOK2-TEXTBOOK-PRODUCTION-1-221-R7-QC.

## Verdict and exact scope

**REVISE** for one required semantic-accessibility correction,
**B2-221-R7-ALT-01**. No visible mathematical, teaching-route or page-layout
defect was found. The six R7 timing-label replacements are exact and all
candidate source/render, arithmetic, typography and page-integrity checks pass.
Passing structural validators do not waive the explicit alt-text requirement.
No new canonical quality-ref, paragraph review or handoff is issued or edited.

Reviewed published platform **298c9e359e27d63c8950c4fc7e93491173c2b0fd**
and lessons **73e552fb83bc3a79b9bec1f15bd3919af2a5ea0b** in the separately
claimed C:/wt/book2-221-r7-qc-20260905 pair, branch
agent/book2-221-r7-qc-20260905. No other pair was edited.
Builder and paragraph-review ownership are distinct from this QC reviewer.
This one specialist personally performed the separately attributed teacher,
student-experience, visual/accessibility and testing lenses below. These are
not claims that four separately staffed agents supplied independent decisions.

Fresh independent paragraph review PASS WITH FLAGS is attributed to
paragraph_221_r7_independent_review, platform report commit
0786233a5ee25380287fa722d7e0345f9dc25b9b. Canonical lesson review is at the
lesson base above; its raw and LF SHA-256 are both
36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13.
It remains that reviewer's decision, not rewritten by this later specialist gate.

## Required finding B2-221-R7-ALT-01

Classification: required_revision; blocks fresh specialist quality acceptance
and R7 quality-ref promotion. This is a semantic alternative-description issue,
not an economic error or a requirement to change the visible figure design.

`agents/accessibility-agent.md`, lines63–72, requires a short alternative that
is concise, at most120 characters, noun-first and functionally descriptive.
The first figure has two imperative descriptions:

| Authoritative source | Actual string | Affected artifact |
|---|---|---|
| build-scripts/content/book-2/221/theory.md:48 | `Vergelijk de procentuele reacties op dezelfde schaal.` | Generated paragraph Markdown caption/alt, paragraph HTML img alt and visible figcaption; current caption also prints on PDFp2. |
| build-scripts/content/book-2/b2_221.py:158 | `Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken` | `_assets/2.2.1_fig_1.svg` accessible title. |

Both begin with the command “Vergelijk”, rather than describing the visual as
a noun phrase. Length and nonempty-alt checks alone miss this requirement.
The first automated inspection record was provisional PASS before this final
language-specific check; its final published record is explicitly REVISE.

Minimal correction route for the builder, not performed by this reviewer:

```markdown
![Vergelijk de procentuele reacties op dezelfde schaal.](_assets/2.2.1_fig_1.svg){alt="Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal."}
```

This uses Pandoc's native image alt attribute to separate the short functional
description from the already readable visible caption. Root has verified the
native syntax on a stdin fragment; the actual candidate still needs regenerated
HTML and exact source/render proof. No shared renderer/helper patch is justified.
Change the SVG title to a noun phrase such as
`Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal`.
Do not change numerical geometry, target, approved plan or visible math/layout.

Proof to close: source-only correction by the builder, regenerated artifacts,
all actual HTML alts and SVG titles checked against the requirement, length and
functional meaning verified, exact unchanged-caption and visible-page parity
where achievable, byte/source/proof integrity, then renewed independent paragraph
review and distinct specialist QC. No inherited R7 acceptance or self-approval.

The other descriptions were explicitly examined, not inferred from presence:

| Figure | HTML short alternative | SVG title judgment |
|---|---|---|
| fig2 | `Dezelfde absolute-waardeschaal; twee verschillende classificaties.` is a descriptive noun phrase, not an instruction. | `Twee vergelijkbare absolute-waardeschalen met grens één` is a descriptive noun phrase. |
| we1 | `Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev.` names the visual's referents and given/computed distinction. | `De berekende Bowlpleinreactie en de gegeven klimhalratio, zonder verzonnen percentages` is a descriptive noun phrase. |

All alternatives are shorter than120 characters. Noun-first is interpreted as
a referent-first noun phrase; ordinary Dutch articles, adjectives and numerical
determiners do not themselves create a defect. No fig2/we1 correction required.
Adjacent prose supplies the numerical relationships, directions, thresholds,
conditions and conclusions as long descriptions. No second accessibility finding.

## Teacher-learning-quality lens

Attribution: paragraph_221_r7_specialist_qc applying
agents/teacher-learning-quality-review-agent.md. **Teaching judgment: PASS,
14/14**, within the paper lesson's learning-design scope, not observed attainment.

| Rubric dimension | Score | Fresh observed evidence |
|---|---:|---|
| Learning-goal alignment | 2/2 | Four printed goals match signed percentages, signed ratio, magnitude classification and bounded explanation, all independently practised in5 and assessed in6. |
| Prior-knowledge fit | 2/2 | Actual Book1 §1.1.2 formula/four steps/old-base warning and §1.2.2 own-price/substitutes/ceteris-paribus teaching read; Start1 retrieves these, not formal Ev. |
| Didactic sequence | 2/2 | Concrete fruitbox/oefenruimte contrast precedes formula, warning and classification; full Bowlplein worked chain and five-point recap precede Start. |
| Formative assessment | 2/2 | Start1 old-base/sign errors point to printed task3 reminder and fresh teacher checking; Start2 probes current misconception. Answer-after-attempt advice is explicit. |
| Differentiation | 2/2 | Printed optional3 supplies steps/formulas/first result;4 reduces support to one comparison cue;5 requires independent calculations and justification. Same goals, neutral skip. |
| Dual coding | 2/2 | Common-zero signed bars explain percentage response; magnitude bars isolate classification; worked figure separates computed percentages from given-only ratio. |
| Transfer and retention | 2/2 | Arcade/pool reverse price directions;5 and6 change contexts;7 tests overgeneralization;8 changes old bases and9 retrieves demand-factor logic. |

### Twelve Book 2 paper-contract judgments

| Criterion | Judgment and exact evidence |
|---|---|
| Paper-only usability | PASS: theory, worked steps, tasks1–9 and separate full answers are printed; no external dependency. |
| No-device compatibility | PASS: all calculations, source values and explanations can be completed with paper; no QR/link/device instruction. |
| Required printed support | PASS: task3 four-step old-base/sign reminder, formulas and first calculation; answer key offers complete five-step solutions. |
| Simple printed route | PASS: paragraphp6 / exercisesp2 explicitly gives Start → Independent → Target and optional guided help. |
| Backward alignment | PASS: approved plan and actual worked/practice/target map below have no missing operation. |
| 55-minute feasibility | PASS as an estimate only: 3+10+7+3+5.5+11+9=48.5core; solving actual tasks preserves full target. Support adds10 and needs continuation/homework. Empirical flag retained. |
| Same-goal differentiation | PASS:3–4 fade support without a lower target, extra theory or fixed-ability label. |
| Bonus cognitive flexibility | PASS:7 critiques invariant-Ev generalization and a plausible change in available alternatives, not more same-kind arithmetic. |
| Accessible closing review | PASS:8 old-base reversal and9 own/substitute-price reasoning are two accessible earlier-learning tasks; no new theory. |
| Book1 continuity | PASS: actual earlier teaching supports proportionate retrieval; A38 old-base/sign is retrieved, A15/D06 Ev formal learning is taught here. |
| Summary placement | PASS: five non-heading bullets, after complete worked example and before Start, paragraphp5 / exercisesp2. |
| No internal terminology | PASS: no PartA/PartB/lane/repository language, numeric timing or kernroute in student editions. |

| Goal/target action | Worked teaching | Start | Guided | Independent/target |
|---|---|---|---|---|
| Old-base signed percentages | Bowlplein1–2, theoryp1–2 | 1a–b | 3a,4a–b | 5a /6a |
| Signed dimensionless Ev | Bowlplein3, theoryp2–3 | Sign understanding2 | 3b,4a–b | 5a /6a |
| Absolute classification/comparison | Bowlplein4, warningp3 and figures | 2 | 3c,4a–c | 5b–c /6b–c |
| Bounded contextual explanation | Bowlplein5, theoryp4 | 1c prerequisite | 3c,4c–d | 5b–d /6b–d |

Risk: estimates do not establish readiness or attainment. All work including
support, bonus and closing is71.5min, not a single55min claim. Remove neither
support nor target work merely to fit a clock. No required teaching revision.

## Student-experience lens

Attribution: paragraph_221_r7_specialist_qc applying
agents/student-experience-review-agent.md. **PASS,12/12** for the visible paper
route; semantic alternative-description acceptance is separately withheld.

| Dimension | Score | Evidence from a first-time student walkthrough |
|---|---:|---|
| Orientation | 2/2 | Opening asks why equal price changes produce different reactions; four goals and cinema/streaming target destination are explicit. |
| Affordance | 2/2 | Named short route, optional help/skip, independent-work instruction and answer-after-attempt note make next actions clear. |
| Cognitive load | 2/2 | Percentage table → signed bars → ratio → magnitude; conditions stay beside formula. Tables and prompts are grouped, not mixed across pages. |
| Motivation | 2/2 | Familiar contexts and neutral errors-as-practice language; no ability ranking, diagnosis or forced device use. |
| Confusion control | 2/2 | Explicit wrong/correct −2 comparison, unchanged-is-not-inelastic warning, units, old denominators and given-only ratio notices. |
| Graphical support and text linking | 2/2 | Each figure corresponds to immediately discussed calculations/meaning; no slope-based inference or unintroduced graphical task. |

The student can distinguish sign from magnitude and explain only a plausible
mechanism. Likely difficulties are old denominators and treating a negative
number as smaller-than-one classification; these receive specific printed
support and fresh checking. No missing visible next action or required Dutch
student-copy correction. The short-alt defect remains a separate required fix.

## Economics, answer and authority checks

All four authored Markdown sources, generated editions and answers were read.
Fresh exact-rational arithmetic verifies fruitbox−0.5, oefenruimte−2,
Bowlplein−0.4, repair−0.5, arcade−1.5, pool−0.5, Skatehal−1.5 and Nova−0.8.
Nova:+20% price,−16% quantity; Start:+10%,−10%; closing:+25%,−20%.
Every result uses its own positive old base and nonzero price change; Ev is
signed and dimensionless. The |Ev|=1 boundary remains distinct. No rounding,
unit, reversed-ratio or price-fall sign defect. All9 answer numbers, all target
subquestions and3/2/2/2 marking are complete; plausible alternative mechanisms
are accepted without causal certainty. Closing9 shifts umbrella demand left
when its substitute becomes cheaper, with ceteris-paribus assumptions explicit.

The exact frozen target remains
61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288,
four goals and9points. No target diagram/table is introduced. Ei/Ek calculation,
necessary/luxury classification, revenue calculation, optimization, midpoint
elasticity, graph construction and slope inference stay outside this paragraph.
StreamNow/Klimhal/Podiumhuis given-only ratios acquire no invented percentages.

Plan LF29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345
and chapter LF3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7
match owner-approved lessons10334028bbadd537fc3790281e90bebdfa827c1e.
Owner release record26a330cd1b3a306a801366d119a64474eb7782ed remains operative
for H-221-PRIOR and H-22-ELASTIC-CONTRAST; frozen draft-plan wording is history,
not a newly reopened hold. Durable twelve-record integration and currentness
pass. Source status candidate_review_ready remains unchanged. A15/A38 broad
A2.5 and stale D06 D1.3 metadata are not imported as coverage or registry edits.
Only excluded H-213-OPC2 remains open; no future merge grant is inferred.

## Visual and accessibility lenses

Attribution: paragraph_221_r7_specialist_qc applying agents/visual-qa-agent.md
and agents/accessibility-agent.md. **Visual rubric9/10, REVISE overall**:
clarity2, contrast/legibility2, hierarchy2, paper actionability2,
accessibility1 due to B2-221-R7-ALT-01. The required correction is semantic,
not a clipped/unreadable visual or mathematical-content error.

I personally viewed all20 current full-page PNGs: paragraph10, exercises6,
answers4; all3 full PNG figures; fresh150dpi Poppler grayscale paragraphpp2,3,5.
No inherited page-view claim, contact-sheet-only acceptance or OCR confidence
was used. The exact page observations and raw hashes are in
`BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r7-inspection.json`.

No clipping, overlap, missing glyph, stranded heading, illegible essential
label, distorted aspect ratio or lost prompt. Paragraphp8/exercisesp4 retain
the final5d above the footer. Target blocks stay together. Answers3→4 splits
between target6c and intact6d, not inside its scoring explanation.
All native PDF text including footers is at least12pt; the actual placed
figure labels are at least12.221pt, including the85% worked figure.

Fresh source geometry verifies all10 bars: correct zeros, signed x placement,
width=absolute(value)×scale, equal comparison scales. No arrowheaded economic
axes, slope heuristic or unsupported percentages. Contrast ratios are ink on
white14.528, ink/callout13.088, ink/table-header12.729, blue/white8.358,
footer/white7.455, caption/white9.461. Essential axes/labels are ink on white;
threshold one has a labelled tick and visible dashed segments outside the bar,
not reliance on the lower-contrast dashed segment inside the coloured bar.
Hatching, signs, labels and geometry retain meaning in grayscale; colour alone
encodes no required distinction. Faint table/heading rules are supplementary
grouping, not the sole carrier of a required datum.

HTML has meaningful headings and header cells; adjacent prose describes full
numerical visual relationships. Native PDF text extraction is coherent, so
OCR is not applicable; no artificial confidence number is supplied. There
are no interactive controls in this PartA route. Keyboard/mobile/PartB,
screen-reader certification and PDF/UA compliance are not claimed.

## Fresh verification and retained flags

Fresh npm ci installed the lockfile's385 packages; audit reports8 existing
vulnerabilities(1low,1moderate,6high). No upgrade or audit-fix mutation performed.
Ten source tests PASS. Exact6replacement/55hash probes PASS. All other seven
checked source/test files,6assets and answer MD/HTML/PDF remain unchanged.
Own remapped diagnostic manifest was used before rebuild; no command wrote
through another agent's manifest paths. Explicit C:/Python314/python.exe with
inherited PATH reproduced all9 document and6asset bytes; no MSYS-first retry
was needed. All20 immutable proof pages and PENDING manifests remain unchanged.
Both student-web and publisher-print PartA structural profiles PASS, but their
valid historical R6 quality block does not constitute fresh R7 QC acceptance.

Exact QC-only scope plus the normal classifier on actual correction-base
changes pass; lesson QC delta is empty. Two initial scope runs correctly
rejected my noncanonical grayscale-proof paths. The three unchanged diagnostic
PNGs were relocated to the existing reports/sprints evidence convention;
the checker was not broadened and no exception or synthetic path was used.

| Retained condition | Blocks | Does not block | Proof to close |
|---|---|---|---|
| Unobserved48.5/58.5/71.5min pacing and attainment | Claims of observed timing/attainment; all-work-in55 claim | Correct bounded PartA learning-design and rendering judgments | Classroom completion/error observations, teacher review, evidence-led pacing revision if needed. |
| PartB not commissioned | Companion/digital exit-ticket/full product claims | This paper lesson's content review | Separately commissioned production and its gates. |
| Optional Inspectie mapping omitted | Current inspection-compliance mapping | Material-quality review | Root-governed protected-reference refresh and renewed mapping review. |

The QC skill's required official freshness check confirmed the August2026
revision; protected references were not edited. This is not a school/inspection
compliance claim. [Official revision announcement](https://www.onderwijsinspectie.nl/actueel/nieuws/2026/07/03/onderzoekskaders-2026-vastgesteld).

No full repository test suite, remote CI, chapter/book acceptance, cumulative
finding closure or successor handoff is claimed. Root owns those later gates
and the minimal builder correction/renewed independent reviews. No future PR
merge is authorized. Historical R6 quality/handoff and fresh R7 paragraph review
remain untouched; **R7 specialist approval is withheld pending ALT-01**.
