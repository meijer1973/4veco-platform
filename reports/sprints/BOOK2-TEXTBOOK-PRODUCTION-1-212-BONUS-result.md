# §2.1.2 R7 bonus-criteria correction — builder result

2026-09-05. Builder `paragraph_212_bonus_correction_builder`, task
`BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS`; root remains sole integrator.
Candidate for distinct paragraph review and separate specialist QC, not a new
acceptance record. No canonical review, quality-ref, handoff or prior pin changed.

## Scope and exact test semantics

Paired owned worktrees:
`C:/wt/book2-212-bonus-correction-20260905/{4veco-platform,4veco-lessen}`.
Both use `agent/book2-212-bonus-correction-20260905`. Assigned clean bases are
platform `2bf6260c5d4d799c5408f898d0dab126eff9e5ac` and lessons
`917115c8da631d65eefbdb1f15c13b2291cd9e1d`; claims passed without lock override.
The operational plan was written before the source correction. Work order:
[bounded §211/212 bonus correction](BOOK2-TEXTBOOK-PRODUCTION-1-211-212-bonus-correction-work-order.md).

`212/answers.md` has exactly one six-line insertion: criteria label, blank
separation and three Dutch bullets immediately after all of bonus8a–b and before
Herhaling. They assess equal €30 profit per evening atQ30, the150→300 scale
explanation for the half-sized paper gap, and comparison of quantities/units/
period/Q/scale/TO–TK amounts. They do not allocate points or add pupil questions.
Every previous model-answer byte, target question, 11-point scheme, nine alt
attributes, full captions, five contextual titles, eleven figures, accepted
plans, holds and prior-input pins remain intact.

The ten original `test_source.py` test bodies are byte-exact. Four of the five
`test_metadata.py` bodies are byte-exact, including full-generator equality to
the historic generator plus its five title-only edits. The one specifically
authorized method still compares all four full source texts to immutable
`798cacfeeb40e4e0ba54d26f2b040cbdeec327a9` plus exactly nine alt insertions; only
answers.md additionally receives `test_bonus.insertion(expected)` before full
equality. No generalized list stripping, substring acceptance, allowlist of
acceptable source hashes, skipped test, or weakened generator assertion exists.

Three new test methods check the exact four-source transformation and reject
actual missing, extra, duplicate, before-model and after-Herhaling criteria;
changed €30→€15 model text; unrelated first-answer arithmetic; theory/exercise
drift and target points11→12. Fixtures prove a real mutation before rejection.
The new positive test was run on the real old answer first and failed as
expected because the criteria were absent. That full failure remains logged.

## Build, exact deltas and verification

All15 previous tests passed before correction; all18 tests passed afterward and
on final rerun. Native build, actual read-only `check_render.py`, full native
reproduction and direct print-only reproduction passed. Used explicit
`C:/Python314/python.exe` and inherited PATH. No environment package install,
invented checker flag, historic one-shot helper rerun or generated hand patch.

All34 native outputs reproduced byte-exactly in both rebuild routes. Only four
lesson files changed: answer MD/HTML/PDF/ZIP. The other30 remain exact. The full
generated Markdown equals its old source plus the exact insertion. Complete
HTML DOM equality holds after reversing only the exact new label/list and the
native bonus wrapper's documented short-exercise classification change: its
text crosses the existing650-character threshold, so `exercise-short` disappears.
No other DOM attribute, caption, image payload or source change is accepted.

ZIP membership remains exactly19/11/9 for paragraph/exercises/answers, unique and
CRC-valid, with every member equal to the current native file. Only the three
answer MD/HTML/PDF members change; all six answer asset members remain exact.

Fresh R7 proof contains14 paragraph +7 exercise +6 answer pages =27. Only answer
page6 differs; all other26 page PNGs equal R6. Every full page was personally
opened and inspected, as were all11 actual figures and fresh grayscale figures.
The new criteria and original model answers are together on answer page6.
Body/footer minimum12pt; placed-figure minimum12.548030598958333pt overall.
No font, CSS or margin shrink. Full observations:
[builder inspection](BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-inspection.md).

Both Part A profiles (`student-web`, `publisher-print`), approved paragraph2.1.2
currentness, and durable12-target authority checks pass. Those structural
validators read the preserved historical canonical review/quality-ref: they do
not approve this R7 body. Current independent review and QC remain pending.
Actual committed lane scopes are recorded separately after the payload commits.

## Exact evidence navigation

All paths below are beneath
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/`.
Use [visual-binding-r7.json](BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/visual-binding-r7.json)
for every current source/test/PDF/page/figure/gray hash and report binding.

| Evidence | SHA256 |
|---|---|
|baseline.json|560b928e69262c79f1afc3bb325df0e58f437c3b63d1c3393d1b8cd664b32001|
|build-r7.json|aadfedcb49d0e533ec26c87fcdc6750a76fd1933e1396d1edd794a3706a8aec2|
|mechanical-r7.json|9098f1f6fca5de526a431ad3862f22de6668c7604d4968a0c2088a09b074fb7d|
|render-check-r7.json|bfa66abf5d67a8f16025386246d714fb82c5067ebbf541b3d9b1473328730cfc|
|reproduction-r7.json|df4686015ffed45778f9f3b5cb6d8a2ebd65393e493006d4782eca84e506b99b|
|visual-binding-r7.json|ef9c433205c72a9e8da5b9804ed7e90a6518190bdbd489f2a76a611ec84b0eb1|

| Current native file | SHA256 |
|---|---|
|answers.md source|b67a0959f2fcba00d1399f26d51d866a2a40589b74f780384300eebd9ded8324|
|answer MD|4ffcb70c96f2c0c178a06a6092ec6701c4323cc1ac697de4156bc7cf0d43b8b3|
|answer HTML|be02782985485caca268df98af897104d78feec9737032cd14803c978a318a82|
|answer PDF|d55f1da66723cd6f932cbf0793ce79d8d4188d2d907244fd40cc6f6fbad5ac90|
|answer ZIP|575fe9051596241c1bd0a29b5ca40bdd3ad4a357f6fd387508277362abe7a28e|
|paragraph PDF unchanged|e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2|
|exercise PDF unchanged|94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a|

Full pages are in `212-paragraaf-e94d42f66ab9-r7/pages`,
`212-opgaven-94ebe5d35207-r7/pages`, and
`212-antwoorden-d55f1da66723-r7/pages`. Immutable native PENDING manifests were
not promoted; builder observations are separate exact-bound evidence.

## Diagnostics, limitations and next gate

The expected old-source missing-block failure is retained in the parent sprint
JSONL/readable command logs. No native build or reproduction failure occurred.
`git diff --check` initially identified CRLF whitespace in the generated readable
command-log excerpt, not in the content source; formatting normalized only that
readable log while retaining raw JSONL results. Read-only instruction/path
discovery had truncated output and several mistaken filenames; missing pieces were
read from real discovered paths. No content or authority repair followed those
discovery mistakes.
One final lock recheck initially used the wrong script directory; the canonical
npm entrypoint was then used successfully. The lesson repository has no
package.json; its final lock check invokes the real companion-platform script.

Full repository Jest/CI was not run by this builder; exact-head CI is not claimed
and no CI waiver is fabricated. No PR opened or merged: root owns combined
integration. No independent review/QC, internal acceptance, classroom-readiness
or book completion claim. Timing54/67/77 remains observation-dependent. Later
accepted-predecessor repinning remains a distinct reviewed transition.

Next: root adopts the paired payload/evidence commits, excluding the generated
index-only tail if necessary, and assigns distinct paragraph review of the
criteria/test delta and separate specialist QC before current acceptance.
