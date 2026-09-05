# §2.2.1 ONLY — R8 short-alternative builder execution

Date: 2026-09-05. Builder: book2_short_alt_correction_builder.
Task: BOOK2-TEXTBOOK-PRODUCTION-1-SHORT-ALT. Candidate ready for independent
paragraph review and distinct specialist QC, not accepted by this builder.
Preimplementation authority/scope/quality matrix: 221-ALT-builder-plan.md.

## Exact bounded implementation

Owned pair C:/wt/book2-short-alt-correction-20260905/{4veco-platform,4veco-lessen};
branch agent/book2-short-alt-correction-20260905. Bases platform
199772e2aa586fce0f71b647ed5188e568dba2e5 / lessons
4c4cd7d0c1d2e5242c818399a96dce3e26013e9c. No other pair was written.
This closes the builder implementation work for B2-221-R7-ALT-01, not the
review finding or root's cumulative B2-SHORT-ALT-01 acceptance gate.

Only two authored metadata strings changed: theory.md first figure gained
Pandoc's native alt attribute; b2_221.py first figure's accessible title changed
to a functional noun phrase. No source body/caption/exercise/answer/goal, figure
geometry, unit, path, target, shared helper/style/guard, plan, hold or prerequisite
pin was altered. Ten original source tests remain unchanged; two new regressions
pin every actual native-Pandoc alternative/full caption and generated SVG title.
Only three lesson files differ: paragraph MD/HTML and fig1 SVG. All PDFs, all PNGs,
fig2/we1 SVG, exercise/answer editions and historical governance files are unchanged.
Nothing in §§211,212,213,222,223 or other paragraphs was edited.

Actual native HTML behavior was inspected: the new short alt also causes Pandoc
to omit aria-hidden="true" from the first full figcaption and move a source
soft-wrap. The full caption remains `Vergelijk de procentuele reacties op dezelfde
schaal.` with exactly the same words/punctuation, visible layout and PDF bytes.
The mechanical proof enumerates these three exact HTML changes and rejects any
other HTML byte drift. It does not claim the whole HTML file is byte-identical.
The retained full caption is now exposed separately from the distinct short alt.
No sanitizer or shared rendering workaround was needed.

## Semantic alternative audit

All actual images were inspected: paragraph fig1/fig2/we1 and exercise we1;
answers contain none. All three SVG accessible titles were read independently
of their drawn titles. Noun-first means a descriptive referent-first noun phrase,
allowing normal Dutch articles/adjectives/determiners, not an instruction.

| Figure | Actual HTML alt (characters) | Actual SVG title (characters) | Functional judgment |
|---|---|---|---|
| fig1 | Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal. (62) | Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal (71) | Names the comparable signed percentage responses and common scale; no imperative |
| fig2 | Dezelfde absolute-waardeschaal; twee verschillende classificaties. (66) | Twee vergelijkbare absolute-waardeschalen met grens één (55) | Names the magnitude comparison/classification visual; unchanged |
| we1 | Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev. (64) | De berekende Bowlpleinreactie en de gegeven klimhalratio, zonder verzonnen percentages (86) | Names computed versus given-only referents; unchanged in both editions |

All alternatives/titles are <=120 characters. Full adjacent descriptions retain
signs, values, thresholds, model conditions, conclusions and given-only limits.
Visible imperative figure headings/captions are not replaced with short metadata.

## Fresh mechanical evidence

All record filenames below are under reports/sprints with prefix
BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-.

- baseline-r8.json: 61 actual pre-metadata-edit file hashes, including all R7
  proof pages/manifests and historical paragraph review/QC/handoff/plans. New
  regressions were already added and failing when this snapshot was taken.
- build-r8.json: fresh full generator with --proof-suffix r8; immutable PENDING
  proof directories 221-{paragraaf,opgaven,antwoorden}-{pdf hash prefix}-r8.
- render-check-r8.json: unchanged checker --rebuild PASS, exact second full
  generation of all MD/HTML/PDF/assets, 10/6/4 pages, minimum native body/footer
  12.000pt and placed figure labels 12.221pt, correct aspect ratios and fresh hashes.
- mechanical-r8.json: before/after 61-file inventory, exact two metadata source
  substitutions and one new-test whitespace correction, three lesson changes,
  all HTML alternatives/captions, all SVG titles and exact geometry-only equality,
  fresh SVG→PNG rerasterization with zero channel delta and identical PNG bytes,
  all twenty R8 versus R7 PNG page bytes identical. No ZIP exists in §221;
  same-edition ZIP/CRC verification is not applicable, not silently presumed.
- evidence.py: reproducible bounded baseline/verification procedure, immutable
  collision guards; never supplies visual or independent-review acceptance.
- SHORT-ALT-command-log.md/jsonl: actual source/build/rebuild/profile command
  outcomes and retained failed diagnostics. No remote CI/full-suite claim.

Explicit runtime C:/Python314/python.exe 3.14.3 used with inherited PATH;
Pandoc 3.9 and bundled Poppler resolved normally. No MSYS-first PATH, retry with
tolerance, restore, monkeypatch, guard broadening or historical proof rewrite.
Both normal Part A profiles passed. They recognize the unchanged historical R7
paragraph review and R6 quality-ref, which is structural only, not R8 acceptance.

| Edition | Unchanged PDF SHA-256 | Personally viewed final pages |
|---|---|---|
| paragraaf | 98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6 | 1–10 |
| opgaven | a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af | 1–6 |
| antwoorden | d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d | 1–4 |

All 20 page hashes are recorded in mechanical-r8.json and the R8 manifests.
Source/HTML paragraph hashes are ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db /
ac568897e03adcc88aab6a8710771d189d1a6e4bb18b85e63fdc4b3d32a7140b.
Fig1 SVG hash 1abc7cc2a150318a84341bf89886543cd94e5fc63dd120cf18244e62032536b2.
Every source plan pin at both full-build checkpoints remained:
§221 LF29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345;
C22 LF3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7.
§221 generator has no other paragraph review/QC/handoff hard pin. Frozen target
61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288 stays intact.
Scoped approved paragraph_production and durable authority passed before editing
and at both build checkpoints. This does not issue a successor's prerequisite grant.

## Own visual self-QA, not borrowed review acceptance

The PDF skill required personal final-page inspection. I viewed each of all20
full-page 150dpi PNGs individually at readable scale, all three full PNG figures,
and fresh Poppler grayscale paragraph pages2,3,5. No contact-sheet-only judgment,
borrowed page observation or hash-only viewing transfer was used. Historical
reviewers' previous judgments remain attributed history; these are builder views.

| Edition/page | Own observed result |
|---|---|
| Paragraph1 | Four goals and complete old/new/% table fit; motivation and old-base explanation readable; no clipped row or footer |
| Paragraph2 | Signed common-zero chart, full unchanged caption, formula/conditions box and both example ratios clear; no collisions |
| Paragraph3 | Sign/magnitude misconception box, both classifications, labelled threshold-one diagram and full caption remain readable |
| Paragraph4 | Bounded explanation and worked context/steps1–2 intact; percentage calculations stay together before the figure continuation |
| Paragraph5 | Worked figure, given-only Klimhal note, steps3–5 and all five recap bullets clear; full recap above footer |
| Paragraph6 | Named short route, printed repair/teacher-check advice and Start1–2 intact; no missing prompt |
| Paragraph7 | Optional-help/skip advice, task3 table, four-step reminder, first result and a–c grouped without clipping |
| Paragraph8 | Task4 table/a–d plus independent5/a–d intact; final explanation prompt fits above footer despite dense page |
| Paragraph9 | Complete unscaffolded Nova/StreamNow target and3/2/2/2 points together, total9 clear |
| Paragraph10 | Bonus7, closing8–9 and full conditional substitute prompt present with homework note and clear footer |
| Exercises1 | Worked context and signed %ΔQ then %ΔP, full figure/caption and step3 readable; next-page step4 is coherent |
| Exercises2 | Steps4–5, complete recap, route/repair advice and Start1–2 readable, task2 above footer |
| Exercises3 | Full guided3 and old-base/sign support grouped; no displaced prompt or clipped table |
| Exercises4 | Faded4 and independent5 complete; final5d remains clear above footer |
| Exercises5 | Exact Nova/StreamNow target context and all point-bearing a–d remain on one page |
| Exercises6 | Bonus and both closing tasks retain all text/conditions, no stranded heading |
| Answers1 | Answer-after-attempt advice, complete Start answers and guided3 steps1–4 readable; step5 continues coherently |
| Answers2 | Guided3 conclusion, full arcade/pool chains and independent5 steps1–3 clear, signed ratios unbroken semantically |
| Answers3 | Independent5 classifications/context and target6a–c including full frozen answers/marking intact;6d begins intact next page |
| Answers4 | Whole6d explanation/marking, bonus model/criteria and all closing answers readable without footer overlap |

All three full figure images were inspected: signs, common scale, direct labels,
threshold1 and hatching visible; no clipping, missing glyph, distortion or overlap.
Fresh grayscale2 preserves price/quantity hatching and direction; grayscale3
preserves magnitude/threshold labels and classification; grayscale5 retains
computed-versus-given separation and all essential labels. Meaning is not carried
by color alone. No visible defect found in this bounded self-QA. Native PDF text
is extractable: OCR not applicable. No screen-reader certification or PDF/UA claim.

Fresh gray-r8-p2.png SHA256 fa6567b2b2274eaabc041f99b0a7c3f48260a0154fdc2f3ae114c68874236dc7;
gray-r8-p3.png 2a1e5b16e0744177b2fd6684a27bd933b89ed4c2aad8bd12a006962e83dea476;
gray-r8-p5.png 0e5cac18e99ddf243084531526f53de84923ced80e60a606bb05f1dd006b7dc4.
Generation manifests remain PENDING with empty inspected-page arrays; this
separate builder observation record does not prefill independent acceptance.

## Retained diagnostics and continuation

The first new-test run failed exactly the original imperative alt and title.
After the two edits, a new test incorrectly treated Pandoc's soft-wrap newline
as changed caption wording; corrected that new test to normalize whitespace only
while pinning all words/punctuation. All12 tests then passed. The already queued
full generation ran despite that test failure and produced the immutable R8
candidate; corrected tests and independent full rebuild then passed before QA.
The first mechanical HTML probe expected only an alt byte change and correctly
failed on native caption aria-hidden removal/soft-wrap. Inspected the exact diff,
enumerated those exact native effects, then the complete proof passed. No source,
renderer or parity threshold was weakened to hide either diagnostic. One broad
read-only git diff displayed embedded image data and was truncated; repeated it
with image-data-only display elision, not a file edit, to inspect the actual diff.

Required next gates are distinct independent paragraph review, specialist QC and
root successor handoff before cumulative finding closure/any successor repinning.
Historical R7 review and R6 quality/handoff remain untouched; the published R7
specialist REVISE is read-only evidence, not replaced or imported for green profiles.
Unobserved48.5/58.5/71.5minute pacing, attainment, PartB and protected optional
reference refresh remain named follow-ups. No PR/merge authorization, final CI,
whole-book acceptance, classroom-fit or approval of successors is claimed.
