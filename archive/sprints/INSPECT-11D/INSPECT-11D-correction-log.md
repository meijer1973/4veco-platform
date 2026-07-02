# INSPECT-11D Correction Log

Status: active
Date: 2026-06-18
Sprint: `INSPECT-11D`

## Corrections

| Finding | Classification | Correction | Validation / re-review |
|---|---|---|---|
| `1.3.4` generated output contained a simultaneous demand/supply shift task that conflicted with the reviewed no-new-theory integration target. | core blocker | Replaced Opgave 4 with an own-price movement versus demand-factor shift consolidation task in platform source and generator, then regenerated lesson output. | Chapter 1.3 validator passed with 0 errors/0 warnings; 1.3.1-1.3.4 paragraph validators passed; specialist gates passed. |
| Initial mobile rendered proof showed horizontal overflow in generated HTML. | accessibility/support blocker | Added route-local screen CSS and populated HTML titles through generated build scripts, then rebuilt HTML/PDF output and recaptured viewport proof. | `viewport-metrics.json` records `horizontalOverflow: false` for selected desktop/mobile surfaces. |
| Lesson `git diff --check` initially failed on regenerated HTML CRLF/trailing whitespace. | mechanical validation blocker | Updated the platform generator to normalize text writes and inject LF-preserving, trailing-whitespace-stripping writes into generated Python build scripts; regenerated and rebuilt Chapter 1.3. | Platform and lesson `git diff --check` now pass. |
| Lead review round 1 found the legacy `check-sprint-bundle` acceptance route unclear because the checker fails on archived sprint paths. | validation route blocker | Updated the sprint plan to classify `check-sprint-bundle` as visibility-only for archived sprint-path layout, matching the validation log. | `check-sprint-plan` rerun passed; lead round 2 returned `PASS`. |
| Lead review round 1 found pending specialist gates were under-carried in the closure packet. | gate sequence carry gap | Added explicit specialist/final-lead gate carried issue to the closure report and JSON. | Specialist results recorded; lead round 2 returned `PASS`. |
| Teacher/economics review found the `1.3.1` Opgave 10 proof-record operation chain overstated equilibrium-effect proof. | proof-record precision flag | Narrowed the `1.3.1` route-local proof record to supply-factor shifts and movement-versus-shift distinction. | Teacher/economics rerun returned `PASS`; finding closed. |

Further correction rows must be added for any subagent `REVISE` finding before
human review.
