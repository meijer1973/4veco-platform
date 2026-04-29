# Scaffolding Calibration

Calibration ID: `SCAFFOLDING-CALIBRATION-V1`

CP-3 condition: add reviewer calibration notes for scaffolding scale values.

## verbal_level

| Value | Label | Review note |
|---:|---|---|
| 0 | no added wording | Exam-like or independent task wording; no scaffold beyond the source prompt. |
| 1 | minimal cue | A short cue or reminder is present, but the student chooses the procedure. |
| 2 | light guided wording | The task names the representation or operation but does not provide steps. |
| 3 | step cueing | The task gives partial procedural sequencing or asks substeps separately. |
| 4 | worked scaffold | Most of the procedure is explicitly guided; student fills key values or decisions. |
| 5 | full worked example | The procedure is effectively demonstrated before or during the task. |

## visual_stage

| Value | Label | Review note |
|---:|---|---|
| 1 | visual provided and labelled | The visual representation is provided with explicit labels or highlighted reading path. |
| 2 | visual provided without full guidance | The visual or table is present, but the student must choose values or paths. |
| 3 | student constructs visual | The student must draw, complete, or transform the visual representation. |
| 4 | no visual support or exam-like source only | No extra instructional visual is supplied beyond the source/exam material. |

## fading_position

| Range | Label | Review note |
|---|---|---|
| 0 | not part of a fading sequence | Use for standalone exam records or records where sequence position is unknown. |
| 1 | early guided practice | High support; first or early exercise after explanation. |
| 2 | middle practice | Some supports removed; student applies known steps. |
| 3+ | late independent practice | Support mostly faded; task resembles target/exam performance. |

## dual_coding_present

Use `true` when the exercise explanation or task relies on a visual/table/graph representation as part of the learning route. Begeleide inoefening graph tasks require `true` even when verbal support is low.

These notes support review consistency; they do not authorize student diagnostics or adaptive routing.
