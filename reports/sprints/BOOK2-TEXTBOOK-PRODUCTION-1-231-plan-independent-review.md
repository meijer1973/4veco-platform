# Independent §2.3.1 plan review — REVISE

Reviewer: paragraph_213_r6_independent_review. Date: 2026-09-05.
Independent of paragraph_231_builder. This is a plan decision, not a paragraph,
specialist-QC, rendered-product or handoff decision.

## Exact subject and verdict

Lessons 80977d94dcf3705841b6541b7cde1ee91dd767ee, file
`Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md`,
canonical-LF SHA-256
`8d92ed823e96a773a378c74d707c2afa4cd8cb3ee3b8bcba08b217ee5883cac1`.
Platform subject 788145fbdbb8731c8dd7d836a07cf259932780e2.
All subject bytes remain unchanged in this review pair.

**REVISE before recommending source production.** The economics, target coverage,
retrieval/fading and three-criterion conceptual bonus are sound as a plan. Three
bounded implementation-plan corrections remain: compliant asset names, an
explicit feasible typography/layout decision, and an unconditional native
print/profile/provenance contract. None requires a target, lifecycle or policy
change. No new owner decision is identified; root routes the bounded corrections
and later continuation.

## Required corrections

### P231-1 — Planned asset names fail the existing validator

Plan lines 219–228 name ten pairs as `start_2`, `guided_3`, `guided_4`,
`answer_2` through `answer_7`, and `target_answer`, all with prefix `2.3.1_`.
`scripts/validate-paragraph.js:279` accepts only
`X.Y.Z_(fig|ex|we|mc|news)_[A-Za-z0-9]+` plus its optional known surface suffix.
The ten stems fail that exact contract; SVG and PNG means twenty rejected files.
The four `fig` pairs and one `we` pair comply. The builder's alt/inventory check
counts the intended fifteen but does not test this naming rule.

Correction: keep all fifteen roles and pairings, but use ten unique compliant
`2.3.1_ex_N` stems for the exercise/answer roles. Record the old-to-new role map,
including the separate target-answer-only asset, before authoring. Update only
the plan and its own planning evidence; do not expand the validator's grammar.
Proof to close: all thirty proposed filenames match the unchanged native rule,
each role remains uniquely mapped, and no solution asset enters a student
independent/target prompt. This blocks the §231 build specification, not the
approved economics or unaffected paragraphs.

### P231-2 — Resolve typography against the proposed coordinates before building

Plan line 230 fixes a 720×360 canvas, plot ending at y=310, title near y=25 and
Q-axis title near y=355, while leaving actual source font sizes unspecified.
The active `textbook-figure-standard.md:96` recommends avoiding source text below
30pt; lines 105–108 explicitly permit smaller type only with full-page readable
proof. This is **not** an absolute 30pt prohibition or permission to waive the
final 12pt floor. The old 10–14px examples in `economic-graph.md` cannot establish
compliance with the newer textbook standards.

Native `print_pipeline.py:24` gives 166mm usable A4 width, approximately 470.551pt.
At full-width placement, a 720px figure needs at least 18.3615 source CSS px to
reach 12pt; 30 source pt is 40 CSS px and would place at about 26.1417pt. Actual
placement still needs measurement. A 30pt/40px Arial baseline-box diagnostic
gives `Consumentensurplus` and `Q (kaartjes)` y offsets −29 through +8: baseline
25 reaches y=−4, and baseline 355 reaches y=363, outside the proposed viewport.
Only 45px below the plot is available for a tick row, axis-title row and gap.
These are concrete feasibility risks, not a claim to have seen a defective PDF;
the word “near” allows coordinates to move but does not specify the resolution.

Correction: state actual source text sizes/units and planned print placement,
then choose a roomier paragraph-owned canvas/margins or a deliberate smaller-
source-text case with the standard's explicit full-page proof requirement.
Recompute mappings if plot geometry changes. Reserve measured boxes and gaps
for titles, tick numbers, units, direct demand/price labels and CS/payment labels.
Do not simply inherit the old graph skill's tiny sizes or rotate/shrink to fit.
Proof to close the plan: an internally feasible coordinate/font/placement budget
and the explicit later all-page 12pt/legibility gate. Final figure acceptance
remains deferred until actual native pages exist. No drawing or PDF was created
for this review.

### P231-3 — Make the native acceptance/proof contract unconditional and explicit

Plan Gate 5, line 260, requires student-web but postpones publisher-print “where
root's print handoff requires it.” The approved root plan's Quality floor and
C23's Outputs/proof sections require **both** profiles for paragraph acceptance.
Make both mandatory before §231's independent acceptance/handoff, not a later
conditional option.

The proposed §231 CLI is explicitly new: `--lessons-root` is not the existing
`b2_212.py`, `b2_213.py` or `b2_223.py` interface, which uses `--lesson-root`,
`--proof-root`, `--proof-suffix` and `--manifest`. A new paragraph-owned alias is
possible; its mere spelling is not a blocker. However, the revised plan should
give the one exact implemented command/thin-wrapper contract, explicit
`C:/Python314/python.exe`, manifest capture, and next-unused rN behavior before
calling the command native-compatible. Shared pipeline changes remain excluded.

Native `print_pipeline.render_proof` at lines 256–301 rejects nonempty proof
directories, captures all pages at 150dpi and writes generation manifests with
`pages_inspected=[]`, `inspection_status=PENDING`, and no asserted defect verdict.
Clarify Gate 6's “only actual inspection fills them”: keep those emitted
generation manifests immutable and record human inspection in separately named
evidence bound to their hashes. Do not overwrite a prior PENDING manifest to
make it green. The approved root proof location uses native output-hash folders
under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`; if root deliberately
retains the proposed `reports/sprints/...231-proof-r1` root, document that
location decision while retaining the native hashed per-artifact structure and
freshness/non-overwrite contract. No shared scope-rule waiver is needed.

Retain the plan's actual full plus print-only exact MD/HTML/PDF/ZIP/SVG/PNG parity,
but name byte hashes as raw bytes for binary outputs and archive members rather
than treating “canonical” as a binary normalization. Require exact ZIP membership
and CRC as well as whole-archive identity. This is clarification of the chosen
three-archive output contract, not an imposed archive requirement on paragraphs
whose approved contracts lack one. Proof to close: revised explicit commands,
both profiles, independent inspection lineage and fresh immutable proof rules.

## Economics and target audit — acceptable planning

Independently verified against the complete actual registry record, not an
earlier review summary: target hash
`a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571`, all four goals
verbatim and in order, complete context and five prompts, 2/3/2/3/2 = 12 points.
The target remains candidate_review_ready, frozen and governed-integrated.
The frozen twelve-record ordered-JSON package remains
`914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`.

- P=50−0.5Q at given P=20 yields Qd=60, not an equilibrium calculation. The
  required axes are Q in kaartjes and P in euros per kaartje; demand intercepts
  are (0,50)/(100,0), price intersection (60,20).
- The CS boundary is below demand, above P=20 and Q from 0 to 60; its base is
  60 kaartjes and height is 30 euros per kaartje, so its area is €900 total.
  The model answer correctly interprets the sum across the sixty sold tickets,
  not €900 per person, money paid, accounting profit or utility.
- No supply curve/function is introduced to solve the target. Sufficient units,
  actual sales and highest-WTP allocation are explicit; equality WTP=P may trade
  with zero surplus. Relevant domain is stated. No equilibrium or formal output
  optimization is smuggled into the answer.
- The opening four people at WTP18/14/10/6 and price10 are a discrete sum:
  three purchases, gaps8+4+0=12, payment30, WTP42; the unbought person is excluded.
  The plan explicitly changes representation to a continuous ordered-WTP demand
  model; the later triangle is not an exact triangle of those four observations.
  No integration or demand-derivation proof is added to the frozen target.

All proposed continuous calculations were recomputed independently:

| Model | Given price | Qd | CS (€) | Payment (€) |
|---|---:|---:|---:|---:|
| Book fair | 10 | 60 | 900 | 600 |
| Museum worked example | 10 | 20 | 200 | 200 |
| Aquarium Start | 8 | 32 | 256 | 256 |
| Garden strong support | 10 | 40 | 400 | 400 |
| Climbing faded support | 12 | 24 | 144 | 288 |
| Board games final support | 5 | 30 | 225 | 150 |
| Skate independent | 12 | 48 | 576 | 576 |
| Café representation transfer | 14 | 28 | 196 | 392 |
| Concert frozen target | 20 | 60 | 900 | 1,200 |

The separate retrieval model gives Q16/intercepts24; the unrelated geometry
retrieval gives ½×8×6=24 square units, not economic surplus. Closing P18−0.5Q at
P6 gives Q24; closing WTP12/9/5 at price9 gives two buyers and CS3. All plotted
target/theory/museum coordinates and categorical bar tops are mathematically
correct under the proposed mappings. The fifteen planned alts are concise,
noun-first and no longer than120 characters; actual native HTML occurrences,
SVG titles, visible captions and noncolour distinctions still require production
checks. Correct proposed geometry does not cure the naming/typography findings.

## Teaching, load, Dutch and bonus

Five-way prerequisite classification is justified: algebra/intercepts/axes and
triangle geometry receive explicit retrieval; price versus price difference and
economic area units are not presumed secure; formal CS is new learning despite
Book1 familiarity. The sequence retains problem-first explanation, a fully
worked museum example, compact non-heading recap, the two different Start roles,
printed optional strong-to-faded support, and genuinely unsupported graph
construction in independent6 and target8. The café transfer uses endpoint data
without requiring an extra algebraic derivation. Solution figures stay in the
answer packet for unsupported tasks. A brief forward pointer to §232 may be
added to the recap/final sentence; it must not introduce producer-surplus work
here and is not a new blocking teaching requirement.

The bonus is genuinely conceptual. The initial highest-three allocation at
price10 has CS12; the specified buyers14/10/6 at price6 also have CS12. Highest
three18/14/10 at price6 would instead give24. The explanatory purpose is that
changed actual trades/allocation invalidate a price-only inference, not that a
lower price mechanically leaves surplus unchanged. The planned coherent model
paragraph followed by exactly three criteria covers changed premises, actual
willing buyers' WTP-minus-payment, and a bounded outcome conclusion. It avoids
new policy machinery, optimal output and a fairness claim. No bonus correction
is required in this plan.

Whole core arithmetic: 2+9+7+2+4+3+8+7+10 = **52 minutes**. Printed guided support
adds12 = **64**; bonus8–10 and closing4–6 produce **76–80** for all items. These
remain UNOBSERVED. Three complete graph constructions in the main route and the
three-minute current-content Start are specific load risks for the actual
teacher/student walkthrough, not a proven timing failure from this plan alone.
Do not trim frozen operations or force type smaller if the eventual source is
too long. Dutch terms and units are consistent at planning level; final wording,
answer continuity and all-page usability have not yet been reviewed.

## Evidence, gates and boundary

Read applicable AGENTS/product/end-state/companion/build/lane instructions,
planning template, approved root and C23, outline/boundaries/actual target,
paragraph/didactic/exercise/review/precision/Dutch/accessibility/PDF/graph guidance
and both active textbook figure/rendered-page standards personally. Previously
fully read relevant instructions were verified unchanged against the preceding
review snapshot; relevant exact sections were reread. This review intentionally
does not create the canonical paragraph-review file required for an actual
student packet.

Own reproducible evidence: `BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-independent-probes.js`
and `...-231-plan-independent-checks.json`, in this directory. Structural
currentness, approved scoped specialist_review, scoped paragraph_production and
durable frozen authority all ran and passed. Root/C23/v6/v5/registry pins match.
The production-foundation PASS is not approval to start: plan corrections,
independent plan acceptance, root's explicit continuation and truthful prerequisite
status remain required. §213's positive R6 bridge decision is not its pending
bonus correction's specialist acceptance or a current accepted handoff.

No student source, asset, canonical plan, target, hold, review, quality-ref,
handoff or old evidence was edited. No PDF/figure or webpage was authored or
rendered, so final rendered proof is not applicable to this evidence-only change.
No pupil profile PASS, classroom success, full suite, new-head CI, PR or merge
is claimed. Separate committed scope evidence records own-path and whole-candidate
classification, retaining the narrow evidence-only shared-lane failure honestly.
Distinct specialist QC and root acceptance remain separate future gates.
