# Independent review — original cold cohort — 2026-09-29

Reviewer: `/root/review_workflow`. Read-only review of the original `223` and `224` pairs, seeded from platform `7ed2500f53fbd29bd0863dfd84b4fd6df57dc34f` and lessons `f2660032cf7e4e3bbab96cf32863d06a38bd74bc`. This report preserves the first-run result; it is not a review of the instruction-only regression retests or permission to replace their evidence. No author contact, checkout edits, or retest inspection.

## Verdict

- **§2.2.3: one P2 opening-support finding; otherwise passes this review.** All required operations are taught before the main practice phase. The finding is the same classroom-conversion issue identified in the earlier cohort, not an additional textbook-foundation gap.
- **§2.2.4: PASS, no actionable findings.** Its opening retrieves knowledge actually taught in §§2.2.1–2.2.3. The four-slide Klimwand recap is proportionate to the mixed task, with a separate authored example and useful modelling of the two-source advice format.

### P2 — make §2.2.3 exercise 2 a visibly supported exploration

Anchor: original `223/4veco-platform/build-scripts/content/book-2/presentation-223.mjs:62–66`; saved overview slides **1, 16, 28**, with the classroom consequence at slide 1. The start assigns exercises 1 and 2 on printed page 59 before instruction. Exercise 1 retrieves percentages and simple substitution; exercise 2 asks for the new Ei/Ek ratios and fixed variables in an income scenario. The overview notes provide an optional short hint (“Ei gaat over inkomen en Ek over de prijs van een ander goed”), which is helpful, but no visible theory-page support or explicit return to exercise 2 after instruction is specified. A learner following the projected opening can therefore meet new formal operations as an unsupported start task.

Source anchors: printed book **p. 59, exercise 2a–b**; definition/denominator support **pp. 52–54** and one-factor function support **pp. 55–56**. `bronnen/H2/Docenten_en_bouwverantwoording.md:117` explicitly classifies Ei, Ek and formal function scenarios at the start of §2.2.3 as new formal learning. The book supplies the foundation before its printed start section; the deck moves that start ahead of instruction. This is a conversion sequencing/support issue, not absent book theory.

Minimal durable remediation: retain start exercises 1–2; label the new part as exploration, visibly offer verified printed theory support, and specify in notes both the new operation and a return to exercise 2 after instruction and before independent practice. Apply through the shared overview source so all three copies agree. Do not alter the book or remove the user-confirmed exercise number. The original remains preserved even if a later cold regression supersedes it for delivery.

## Content and sequence evidence

**§2.2.3.** Slides 3–7 teach denominator selection, Ei calculation and the book's three categories/boundaries, Ek with both goods named, and a falling-price denominator. Slides 8–12 teach full substitution, annual-income/monthly-quantity units, calculation of Ei from two function quantities, and resetting the base before changing Pz. Slide 13 distinguishes separate studies from a joint model; slides 14–15 check the reset. These precede practice overview 16. The target's full context, sources and questions a–e appear on 17–21, before answers 22–26. Checks include TaalClub 450 → 510, Ei = 2/3, separate Pz scenario 460; target Ei 1.6/−0.6, Ek 0.4/−0.6, fitness 390 → 420, Ei = 10/13, reset scenario 392. Signs, monthly units, fixed variables and limited claims are correct. Notes distinguish authored examples from textbook sources and provide misconceptions and transitions. Homework 3–8 and supplementary 9–11 match the ordinary route. No assigned book exercise is worked out on the projected teaching slides before practice.

**§2.2.4.** Exercise 1 (p. 64) selects Ev/Ei/Ek and their denominators, already covered by the prior sequence, especially §2.2.3 slide 3. Slides 2–5 retrieve known operations with the explicitly authored Klimwand example: Ev = −0.5; monthly TO €10,000 → €10,800; Ei 1.5/−0.5; Ek 0.25; separate regional model Q 510 → 516. The advice demonstration uses A and C without combining incompatible quantities or promising a future response. It prepares the answer form practised by book exercise 4 before target 5 (teacher guide line 108). Practice overview 6 precedes complete StreamPlus sources A–D on 7–9, all six questions/points on 10–12, and answers on 13–21. Correct target checks: Ev −0.7, TO €500,000 → €516,000/month, Ei 1.875/−0.5, competitor price +12.5% and Ek 0.4, model Q 14,200 → 14,400 with prices held fixed. The advice supplies two sources and exactly two unsupported conclusions; it does not infer profit from revenue. Start 1, homework 1–7, bonus 6 and chapter check 7 are retained, without an invented basis/core route. Notes explicitly distinguish the classroom homework agreement from the guide's supplementary designation.

The transition to §2.2.4 is supported once the original §2.2.3 opening issue is repaired: the necessary Ei/Ek and scenario operations are genuinely taught in its body. No additional missing prerequisite was found in these two lessons. This does not establish that a particular class has mastered earlier material or that the full route fits one lesson; both decks' notes avoid that claim.

## Saved artifacts and visual fidelity

Independently viewed **every native PowerPoint slide and every PDF-rendered page individually**: §2.2.3 slides/pages 1–28 and §2.2.4 slides/pages 1–23 (102 individual images total). No clipping, unreadable source/question, omitted line, layout discrepancy or substantive PowerPoint/PDF difference found. All saved speaker notes were read. XML confirms 28/23 slides with 28/23 notes and 15/11 native tables respectively. Neither deck contains charts or chart workbooks; these tasks do not require graph production. Independently recalculated example and target arithmetic with exact fractions, and cross-checked target answers against the paired paragraph answer models. Lesson-copy bytes match the reviewed final-directory artifacts.

| Original artifact | Independently verified SHA256 |
| --- | --- |
| §2.2.3 PPTX | `527f6ecb12d20881d037b953c71ce69935693fd8ef17f63a572025403d9f47bf` |
| §2.2.3 PDF | `34c1c41ecd9d32e5ac1a6ca12dc173f8908d99465702b4756bd5c41b7f9e89d9` |
| §2.2.4 PPTX | `40b58dd23408a0d0dae6dc0517520360b4326b9836fc5e024a3f2735fb697900` |
| §2.2.4 PDF | `207072891553d406a542549fe9c27ba01e4643f7a894a21b26eec697750da325` |

Limits: artifact/content review, not an empirical teacher or pupil trial. No fresh PowerPoint export or full builder reproducibility run was performed by this reviewer. No original artifact was modified. Later scoped repairs and fresh regressions require separately identified closure.

## Separate review — scoped opening repairs at e4d4d8e4

This section concerns the later root delivery revisions of §§2.1.1, 2.1.2, 2.1.3 and 2.2.2, not the original-cohort verdict above. **The substantive opening-support repair passes; two P3 prerequisite-trace corrections remain pending.**

Read the source/manifest diff and actual saved overview notes in all four root lesson decks. All three overview copies per deck visibly identify the exploratory part and its printed theory support; all twelve saved notes explain what is new, request evidence of the help used, avoid assuming mastery, and require a retry after instruction before basis practice. Verified the actual book pages: §211 pp. 2–4 supply constant/variable and total/average distinctions; §212 pp. 10–11 supply TO, GO and profit; §213 pp. 19–20 supply ΔTK/ΔQ and interval/table procedure; §222 p. 45 supplies the local revenue rule and its conditions. These are sufficient and preserve the assigned start numbering.

Individually viewed all twelve changed native overview slides under `.series-20260929/repair-{211,212,213,222}/render/` and all four opening PDF renders at `review/pdf-01.png`: clear, no clipping or crowding. Actual root lesson PPTX/PDF hashes matched every `afterPptx`/`afterPdf` entry in `reports/review-gates/classroom-presentation-series-20260929/repairs.json`. Inspected that preservation report; did not independently rerun its full unchanged-page pixel/XML comparison or re-review the unchanged bodies.

Pending small corrections, acknowledged by the parent:

- **P3 — §213 prerequisite trace names GTK instead of TO.** Root `build-scripts/content/book-2/presentation-213.mjs:71` and `presentation-213.manifest.json:108` say start exercise 1 uses TK and GTK plus profit. The actual exercise on printed p. 23 asks for TK, TO and profit; no GTK calculation occurs. Cite TK from §211 and TO/profit from §212 slides 3–4, and rebuild the saved overview notes.
- **P3 — §222 prerequisite trace names Ev instead of percentage revenue change.** Root `build-scripts/content/book-2/presentation-222.mjs:72` and `presentation-222.manifest.json:137` say exercise 1 uses TO and Ev. Printed p. 48 asks for TO and its percentage change; Ev appears in exercise 2a. Cite earlier percentage-change teaching/retrieval alongside TO and retain the correct new-content support for 2a. Rebuild the saved notes.

These inaccuracies do not invalidate the new visible support or the return-before-practice mechanism, but accurate tracing is part of the requested serial evidence. Final closure awaits the corrected source/manifests and exact saved notes/hashes. No changes were made by this reviewer outside this scratch report.

### Narrow repair closure — later on 2026-09-29

**Both P3 trace findings are now closed; the scoped opening repairs PASS.** Independently reopened the installed root lesson decks, verified their hashes below, and read all six corrected saved overview notes. §213 now correctly traces TK to §211 slide 4 and TO/profit to §212 slides 3–4. §222 now correctly traces TO and percentage change using the old value, with retrieval in §221. The builder source and prerequisite manifests agree with those saved notes. The exploration support and required return before basis practice remain intact.

| Corrected artifact | Independently verified SHA256 |
| --- | --- |
| §2.1.3 PPTX | `1d975d886afea3ca2ebbcfc6bac6133f841962f6f4384e650f163a8e29bc6fd0` |
| §2.1.3 PDF | `f4f78ec14282b277747c3a83ec36bdb4805623fd606f5bf5484a354de174282b` |
| §2.2.2 PPTX | `8e9f5f5217d061a76b0a98c7e84459e6d3951ee46dc2bcbf00add162ab2dbc27` |
| §2.2.2 PDF | `07b667bac12a95a90441a8789dde4f0545ae7cbd38115b12c1fa79f8549af2ee` |

This final check is limited to the trace correction and saved-note agreement. The parent reports all PDF pages pixel-identical to the preceding visually reviewed repair; that comparison was not rerun independently. The original §223 first-run finding above remains historical and is unaffected by this closure.
