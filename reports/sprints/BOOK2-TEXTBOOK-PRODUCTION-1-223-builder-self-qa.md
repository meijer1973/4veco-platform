# §2.2.3 builder completion and independent-review map

Date: 2026-09-05. Author: `paragraph_223_builder`. Task:
`BOOK2-TEXTBOOK-PRODUCTION-1-223`; accountable root `codex-root`, umbrella #229.
This is builder self-QA, **not independent paragraph review, specialist QC,
handoff acceptance or integration permission**. Root assigns those gates next.

## Exact production boundary

Stage-2 preimplementation/release evidence is
`BOOK2-TEXTBOOK-PRODUCTION-1-223-stage-2-plan.md`; it records the normal adopted
root heads, accepted §221 source/review/quality/handoff hashes and root's explicit
production release. The independently accepted paragraph plan remains unchanged,
LF SHA-256 `dd2f91d0035829986076b7d5e96b43fa9c45f3d3698da1d159a955634fa01497`.
Frozen target-record SHA-256 remains
`9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5`.
No registry, target, approved plan, hold, historical authority or companion was
changed. The out-of-project §213 output-choice extension remains outside scope.

Both owned worktrees are under `C:/wt/book2-223-production-20260905/`, on
`agent/book2-223-production-20260905`, owner `paragraph_223_builder`. Preflight
claims match the same task and owner. Normal root adoption produced implementation
bases platform `d180eff8924ad014c4a1f362c2b6fcbb53283e91` and lessons
`7f6e6622592af016e29e10ec7a9370f3f9b89ac4`; the stage-2 plan was published before
source authoring at platform `e6f6db132c2f8c30d106cd621bf504973079de3b`.
Lesson production is committed and pushed at
`b23e0056511fc5b9b10f0b8e6bbe130d2599c36b`.

## Artifact and reproduction map

Platform source: `build-scripts/content/book-2/b2_223.py`; owned Markdown in
`build-scripts/content/book-2/223/{theory,exercises,answers,target-answers}.md`;
owned checks `223/test_source.py` and `223/check_render.py`.
The shared `print_pipeline.py` is unchanged, raw SHA-256
`51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5`.

Canonical lesson folder:
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/`.
It contains the existing filesystem stem `2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit`
followed by ` – paragraaf`, ` – opgaven`, or ` – antwoorden`, each as MD, HTML,
PDF and ZIP. Student prose/title uses canonical **kruislingse**. `build_pdf.py`
is a thin entry point into the paired platform builder. `_assets/2.2.3_fig_1`
through `_fig_4` each have editable SVG and matching PNG.

Final authoritative build manifest: `BOOK2-TEXTBOOK-PRODUCTION-1-223-build-r3.json`.
It hashes the generator/shared helper/four authored sources, accepted prerequisites,
all lesson MD/HTML/PDF/ZIP outputs and all eight figure files. Mechanical result:
`BOOK2-TEXTBOOK-PRODUCTION-1-223-check-r3.json`; actual builder visual observations
and every individually inspected page pin: `...-223-builder-inspection.json`.
All report names in this paragraph are under `reports/sprints/`.

| Final PDF | Pages | Raw SHA-256 | Proof directory suffix |
|---|---:|---|---|
| paragraaf | 15 | `ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb` | `223-paragraaf-ca27f8bd6cbb-r3` |
| opgaven | 10 | `50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80` | `223-opgaven-50cf2bbeaa19-r3` |
| antwoorden | 7 | `30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10` | `223-antwoorden-30cd682358c5-r3` |

Proofs are under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.
Their generation manifests remain **PENDING**, with empty pages-inspected fields;
the separate builder observation record does not overwrite or impersonate review.

Reproduction uses existing Python `C:/Python314/python.exe`, Pandoc and
CairoSVG/WeasyPrint; prepend `C:/msys64/mingw64/bin`, local Pandoc and bundled
Poppler `Library/bin` to this process's PATH as needed. Invoke Python by its
explicit path after changing PATH, since an MSYS Python also exists.

```text
C:/Python314/python.exe build-scripts/content/book-2/223/test_source.py
C:/Python314/python.exe build-scripts/content/book-2/b2_223.py --lesson-root ../4veco-lessen
C:/Python314/python.exe build-scripts/content/book-2/223/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-build-r3.json --rebuild
```

To capture new proof use `--proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1`
and a fresh `--proof-suffix r4` (or later), never overwrite an existing proof
directory. Independent reviewers may read existing proof without rebuilding.

## Teaching, mathematics and target alignment

| Frozen goal / units | Visible teaching and practice | Target and answer evidence |
|---|---|---|
| G1; A17/D11 with retrieved A15/A38 | Income theory and sign-first diagram; worked income; S2a, G1a–b, G2/G3, I1/I2 | a: +1.6/−0.6; b: luxe/inferieur; d: exact 10/13, normaal |
| G2; A16/D12/D27 | Two named goods above/below each Ek fraction; worked books/kaften; S2b, G1c–d, I1 | c: tea/coffee +0.4 substitutes and filters/coffee −0.6 complements |
| G3; retrieved A04, supported multivariable substitution | Printed Book1 substitution reminder; W3 full termwise chain; G2 filled base then frames; G3 no frames; I2 no hints | d: 390→420 with only annual Y changed; e: reset baseline then 392 |
| G4; one-input comparison and fixed conditions | W3 common baseline; S2c; G2/G3; I0 supplied combined-change rows and refutation; I2 | d: +30/month with Px/Pz fixed; e: positive Pz/Qx direction with Px/Y fixed |

No more than four goals, no new target operation or percentage-point claim.
Seven exercise-stage headings and exercises 1–12 are present in order. The
exercise body is generated once for both student editions. The answer edition
retains meaningful Start/guided/independent/target/bonus/closing headings.
S1 retrieves two signed old-base percentages, their Ev quotient, A04 substitution
and D27 pairs. S2 is already faded in the normal core. G1 removes fraction/goods
labels progressively; G2 supplies the base and percentage frames; G3 retains all
givens but no answer, filled term, diagram, numbered method or sentence frame.
I0–I2 have no answer support. Repair and neutral skip routes are printed.

Ei keeps its sign: inferieur below 0, normaal strictly between 0 and 1, luxe
strictly above 1. Ei=0 and Ei=1 are unlabelled boundaries; no necessity category.
The old Ev absolute-value rule is explicitly rejected for Ei. The five-point
recap includes positive old bases, nonzero denominator change, units, controlled
variables, resets and model scope. Named Ek goods, annual-income coefficients and
monthly output/price units are explicit; Y is never divided by 12.

Exact rational tests cover all numerical cases: W3 200→230/Ei0.75/reset204;
G2 160→180/Ei0.625/reset162; G3 200→220/Ei0.5/reset205;
I2 180→200/Ei5/9/reset184; target 390→420/Ei10/13/reset392.
Target a/b/c/e short answers are serialized directly from frozen authority.
Target d is expanded termwise and checked against **every** assertion in the
frozen short answer, including its rounded 7.69%/0.769 displays. The exact
10/13 is retained until final 0.77 rounding, not silently treated as exact0.769.
All three frozen sources, context, five prompts and 3+2+4+4+3=16 points are
verified literally in Markdown, HTML and extracted PDF. Scoring expansion
accounts for each requested method, category, named-good or fixed-variable step.

## Actual readable workload and remaining timing flag

The final source/layout audit counts 1,191 whitespace-delimited theory tokens
(including hook, four goals, tables and reminders), 464 worked-example tokens,
196 Start tokens, 353 independent tokens and 258 target tokens. These are
source-workload measurements, not reading-speed measurements. Figure labels are
additional visible representations of the same givens, not extra exercises.

Core rendered route: paragraph pp1–9, then pp12–14 (skip guided pp10–11 and
optional p15). The theory occupies pp1–6; worked examples continue pp6–8; recap
and Start are p9; I0 is p12, I1/I2 p13, all target sources/questions p14.
The exercise-only route uses pp1–4 and pp7–9. Learners use one edition, not both.
Independent written operations remain I0 four controlled-comparison explanations,
I1 four signed ratios with goods/categories, I2 three function evaluations,
two percentage changes, Ei/category and both fixed-variable explanations.
The target still includes four direct ratios, their classifications/goods,
three function evaluations, two old-base percentages, Ei/category and two
direction/fixed-input explanations. No graph construction or table production
has been added to the target or independent route.

Reviewed whole-core hypothesis remains hook2 + teaching11 + worked8 +
recap/transitions2 + Start6 + independent14 + target11 = **54 minutes**.
Guided15 raises this to69; bonus8 and closing4 raise all work to81.
Actual student classroom timing has **not** been observed, and no stopwatch
walkthrough or measured novice reading speed is claimed. The desk workload and
readable pages do not justify downgrading the independent plan review's tight
timing flag. Class observation must check both pace and explanation completeness;
if a learner needs guided repair, schedule the explicitly optional continuation.
Do not shrink type, omit core operations or claim everyone finishes in54 minutes.

## Rendered and mechanical checks actually completed

All **32 current R3 full-page PNGs** were opened individually with the image
viewer at normal reading scale, including all four figures in actual placement.
No visible clipping, overlapping text, missing image/glyph, overflowing table,
unreadable label or isolated question label remained in the builder's inspection.
The target is one complete page in both student editions. Detailed answer9 is
grouped a–c then d–e across pp5–6. Equations wrap at available width without
missing terms. Whitespace keeps sources and their questions together.

PDF text transforms prove a minimum **12.000pt** including footer/counter,
table, caption, box and code-style recall formula. SVG-to-PDF image transforms
preserve aspect ratio and show minimum placed figure labels **14.117pt**.
Signed bars use one zero/common proportional scale, with hatching and labels;
Ei diagram leaves 0/1 open and unclassified. Essential dark strokes/text meet
contrast checks against both white and pale backgrounds. Four matched SVG/PNG
pairs remain editable/reproducible; there is no bitmap-only figure source.

Seven source/calculation/geometry/contrast tests PASS. Approved scoped production
gate and durable twelve-record lifecycle check PASS. Actual source/HTML/PDF/
asset/page hash checks PASS, and full MD/HTML/PDF/PNG/SVG/ZIP rebuild is
**byte-identical**. ZIP member checks enforce only the same edition's three
documents and its referenced paired assets: 11 members paragraph,5 exercises,
3 answers. No answer files occur in either student archive; no script enters ZIPs.

Both `scripts/validate-paragraph.js --mode part-a --profile student-web` and
`--profile publisher-print` PASS with zero errors. Their reported June legacy
review/quality PASS is **stale and explicitly excluded** from renewed acceptance.
Builder preserved both files unchanged for the separate reviewers.
Lesson committed lane scope against `7f6e662...` PASS: exactly21 Part A files,
no companion/shared/evidence-category leak. Platform implementation commit
`1d52021c30a9057727df1e2f4c05ae765914ed31` passes the shared lane against
`e6f6db132c2f8c30d106cd621bf504973079de3b`: seven owned source/check files and
43 review-evidence files, no unrelated or protected mutation. The lane name is
the classifier's platform-source category, not permission to edit shared helpers.
Paired `git diff --check` and scoped language checks PASS. Governance freshness
PASS against origin/main `96416b6b5bd57094576e9aba0a42d682584ec479`, no differing
entrypoints. Both fetches completed before publication; neither branch is behind
or diverged. Full platform suite/remote CI is not claimed by this builder.

## Honest correction trail and next gate

R1→R2 fixed the remaining English scoring label and source/answer grouping;
R3 only keeps answer7 together. Scoring `3921/3901 punt` was corrected before
final serialization. The d expansion does not mutate the frozen short answer.
Draft tool failures were diagnostic, not passes: duplicate-target patch rejected
without edits; an MSYS Python shadowed the intended runtime until its absolute
path was used; check stdout initially hit Windows cp1252 after writing its result
and was changed to ASCII-safe JSON before the successful rebuild check; early
guessed validator/skill paths and literal glob searches failed and were corrected
by repository discovery. No shared helper or environment installation was used.
The redundant extra three-PDF telemetry marker is honestly documented in stage2;
the root's total final artifact scope remains41 PDFs and no marker was repeated.

Only own superseded R1/R2 proof directories and their three draft build/check
JSONs were moved, not deleted, to recoverable
`C:/Users/meije/AppData/Local/Temp/book2-223-superseded-e02e669051bb4dcab0e0a7458c9b4bac`.
Every source path was resolved and validated beneath the own proof/evidence
root before moving. R3 and all other paragraph evidence were untouched.

Publication indexing is refreshed on this owned candidate pair using
`npm.cmd run agent:index`, `node build-scripts/sprints/emit-url-index.js` and
`npm.cmd run dashboard:internal`. Generated outputs are kept in a separate tail
so root can adopt bounded source/output/evidence and regenerate combined indexes.
The existing platform/lesson RESEARCH_AGENT_MAP and AGENT_GITHUB_ENTRY remain
valid entry-point maps; no new top-level route, skill, authority or folder naming
contract requires a manual map rewrite. The generated per-repository indexes
and exact artifact map above provide the new file-level review route.

Next: root assigns independent paragraph review, then specialist QC; those agents
own fresh review/quality evidence. Root owns accepted handoff, combined index/map
adoption, umbrella CI and package continuation. No PR was opened because the
explicit subtask prohibits PR creation/merging; no integration grant is inferred.
