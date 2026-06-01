# CHECK-SHORT-EXIT-1 Check Surface Inventory

Generated: 2026-06-01

Status: audit/contract only. No implementation, generated output, or product
authority.

## Evidence Read

- `source-data/book-1/exit-ticket/1.1.1.json`
- `source-data/book-1/exit-ticket/1.1.2.json`
- absence of `source-data/book-1/exit-ticket/1.1.3.json`
- `references/authored/course-target-exercises.json`
- generated Book 1 landing pages for `1.1.1`, `1.1.2`, and `1.1.3`
- generated Book 1 exit-ticket pages for `1.1.1` and `1.1.2`
- absence of generated Book 1 `1.1.3` exit-ticket page/data

## Inventory Matrix

| Paragraph | Target exercise | Short/advisory check | Target-equivalent exit ticket | Check visible on landing? | Hints visible or hidden? | Task types used | Target-readiness evidence | Completion language | Missing work |
|---|---|---|---|---|---|---|---|---|---|
| `1.1.1` | Wheat/corn allocation: revenue, opportunity costs, mixed allocation profit, scarcity explanation. | Exists as `Korte check`; advisory-only. | Missing. Current check is not target-equivalent. | Yes: `Check` route with `Korte check` card. | No explicit pre-attempt hints; retry feedback and practice-route tips appear after interaction. | 4 choice tasks. | `false`. | Advisory next-practice copy only. | Build separate target-equivalent ticket or reviewed alternative proof route; cover A43 calculation/allocation plus B01/B02 explanation; keep short check visually distinct. |
| `1.1.2` | Percentage change, price index, index-to-index percentage change, index-points-versus-percent explanation. | Missing. | Exists and approved locally for reviewed `1.1.2` only. | Yes: `Check` route with `Exit ticket` card. | No content hints in exit ticket. | 3 `calculation_work_capture`; 1 `structured_short_response`. | `true` for reviewed local proof only. | Approved local non-summative copy: `Je hebt laten zien dat je de eindopgave van deze paragraaf aankunt.` | Add separate advisory short check for full end state; keep copy and deterministic matching scoped to reviewed `1.1.2`. |
| `1.1.3` | Price/quantity graph with price vertical, quantity horizontal; interpolate at EUR 1.75; explain 50 percent sales drop interval. | Missing. | Missing. | No `Check` route. | Not applicable. | None in check surfaces. | `false` / absent. | None. | Build advisory short check; build graph/table target-equivalent exit ticket using graph/table task families; resolve graph-axis and answer-form blockers before claims. |

## Paragraph Notes

### `1.1.1`

The current source is a useful advisory `Korte check`. It samples B01/B02
concepts and gives practice-route feedback. It explicitly records
`metadataAlignment.targetReadinessEvidence: false` because the target exercise
also requires A43 mixed-allocation calculation and explanation. It must not be
renamed or treated as a target-equivalent exit ticket without a separate proof
sprint.

Status:

- short check: `exists_advisory_only`
- exit ticket: `missing`
- product risk: students may see a `Check` route, but it proves only local
  practice readiness, not target-exercise completion.

### `1.1.2`

The current source is the reviewed local target-equivalent exit ticket. It has
three calculation-work tasks and one structured short-response task. It carries
gate-approved local completion language for reviewed `1.1.2` only. It has
clickable route entries to relevant practice surfaces.

Status:

- short check: `missing`
- exit ticket: `target_equivalent_approved_local`
- product risk: the paragraph now has the stronger proof surface but not yet
  the separate advisory short check required by the full Product Proof Track.

### `1.1.3`

There is no check source and no generated check route. Current graph/table
practice is useful local practice, but no target-equivalent graph/table exit
ticket exists. The target exercise requires table reading, graph construction
or substitute, axis convention, interpolation, and explanation from table data.

Status:

- short check: `missing`
- exit ticket: `missing`
- product risk: no Check surface exists for the paragraph; graph/table
  target-equivalent proof remains blocked by the known graph-axis and
  answer-form concerns.

## Contract For Later Sprints

`CHECK-SHORT-EXIT-2` may not treat this audit as implementation authority. It
must either implement both check types for each paragraph or record explicit
blockers/waivers:

- `1.1.1`: preserve advisory `Korte check`; add target-equivalent proof or
  reviewed alternative.
- `1.1.2`: preserve approved local target-equivalent ticket; add advisory short
  check for the full product route.
- `1.1.3`: add both advisory short check and graph/table target-equivalent exit
  ticket after prerequisite task-shell/route/standard work.

Scale Gate 1 remains blocked until the Product Proof Track reaches
`GATE-PRODUCT-3P` and `REV-STD-1` closes, or a human waiver explicitly records
the consequences.
