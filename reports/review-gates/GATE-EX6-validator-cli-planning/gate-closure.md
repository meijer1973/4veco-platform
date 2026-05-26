# GATE-EX6 Validator And CLI Planning Gate Closure

Status: `pass_with_conditions`

Closed on: 2026-05-26

Closure scope: validator/dry-run CLI implementation only.

## Summary

GATE-EX6 closes as `pass_with_conditions`. The gate accepts the EX-6 schemas
and validator/CLI implementation plan as adequate to authorize a later bounded
implementation sprint for validators and dry-run CLIs only.

Allowed next sprint: `EX-7 Validator And Dry-Run CLI Implementation`.

EX-7 may implement validators and dry-run CLIs for operation candidates,
answer-skill candidates, and source-annex extraction overlays. EX-7 may use
temporary, non-persistent, test-only fixtures. EX-7 may not create candidate
storage, write candidate records, execute q19 extraction, mutate protected or
machine references, mutate lesson output, or authorize student/product use.

## Accepted Outcomes

- The three-schema split is accepted for later validator implementation:
  operation candidates, answer-skill candidates, and source-annex extraction
  overlays.
- The validator/CLI implementation plan is adequate for a bounded
  implementation sprint.
- The next sprint may implement validators and dry-run CLIs only.
- Dry-run fixtures may be used only as non-persistent, test-only artifacts.
- GATE-EX5 routing facts remain binding:
  - q3 `A61` support with `A15` rejected;
  - q19 `A42`/`D10` support with `A45` weak;
  - q19 source/graph gaps blocking;
  - q3/q15 answer-skill needs visible.

## Conditions

1. No candidate-storage files may be created.
2. No candidate writes may occur.
3. No q19 source-annex or graph-object extraction execution may occur.
4. No protected reference, external-source, machine-reference, unit,
   operation-registry, answer-skill, PV/graph, target-exercise, lesson-output,
   CP-6, Year-1, or product mutation is authorized.
5. Validators must reject empty or vague q19 reconstructability fields.
6. Validators must preserve the distinction between weak and rejected unit
   evidence.
7. Dry-run CLIs must not expose usable write mode under EX-6 authority.
8. `A15` cannot be q3 annual-threshold support.
9. `A45` cannot be primary q19 graph-shift support.
10. q3 threshold wording and q15 two-step correction-model explanation must
    remain separate answer-skill needs downstream.
11. Product boundaries remain false.

## Final Routing Table

| Requirement | Review classification | Notes |
|---|---|---|
| `q3-calc-1` | operation candidate for validator/dry-run CLI implementation | `A61` supports table-value selection only; `A15` remains rejected. No candidate write. |
| `q3-answer-1` | answer-skill candidate for validator/dry-run CLI implementation | Threshold conclusion with unit and direction remains visible. No answer-skill write. |
| `q19-source-annex-gap` | blocking extraction prerequisite | Blocks q19 reconstructability, graph/PV route execution, lesson handoff, PV projection, and student-facing output. |
| `q19-graph-object-gap` | blocking extraction prerequisite | Blocks q19 reconstructability, graph/PV route execution, lesson handoff, PV projection, and student-facing output. |
| `q19-graph-op-1` | held graph/PV route | Carry `A42` and `D10` as candidates; keep `A45` weak support only. |
| `q19-reason-1` | provisional operation candidate, blocked | `D10` and `D13` partially support the reasoning; q19 source/graph gaps still block execution. |
| `q15-answer-1` | answer-skill candidate for validator/dry-run CLI implementation | `D27`, `F03`, and `F09` cover content only. |
| GATE-EX6 authority | validator/dry-run CLI implementation only | No candidate storage, no candidate writes, no q19 extraction execution, no mutation, no lesson output, no student/product use. |

## Blocked Outcomes

- candidate-storage creation;
- candidate writes;
- q19 source-annex extraction execution;
- q19 graph-object extraction execution;
- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- hand edits to `references/external/`;
- hand edits to `references/machine/`;
- unit minting;
- operation-registry mutation;
- answer-skill mutation;
- PV/graph mutation;
- target-exercise promotion;
- lesson-output mutation;
- CP-6 closure;
- Year-1 closure;
- student diagnostics;
- adaptive routing;
- mastery decisions;
- automatic sequencing;
- student-facing AI;
- summative use;
- PV projection;
- PV machine promotion;
- student-facing output.

## Quality Log

| Issue | Category | Severity | Next action | Proof required to close |
|---|---|---:|---|---|
| EX5/EX6 field-name mismatch | schema-contract consistency | medium | Choose one naming convention before validator implementation. | Schema, contract, validator, and dry-run fixture use the same field names. |
| Weak and rejected unit evidence collapsed | schema precision | medium-high | Split weak/rejected fields or add typed support-assessment objects. | q3 `A15` can be recorded as rejected while q19 `A45` can be recorded as weak prerequisite support. |
| q19 extraction arrays can be empty | source/graph reconstruction integrity | high for q19 | Add conditional validator rules for reconstructable states. | Validator rejects reconstructable q19 records with empty units, scale/ticks, student-action regions, worksheet regions, or marks. |
| Dry-run CLI filenames imply write intent | tooling/authority clarity | medium | Make scripts dry-run-only or hard-fail write mode unless later gate authorizes. | Running without dry-run cannot write; write mode requires later gate proof. |
| Fixture path is environment-specific | implementation portability | low-medium | Use OS temp directory in implementation or document Codex-only assumption. | Tests pass cross-platform, or path is clearly scoped to Codex execution. |
| q19 remains blocked across multiple gates | evidence gap / source-annex extraction | high | Keep q19 blocked; later create extraction validator before extraction execution. | q19 figure/worksheet graph objects are reconstructable and reviewed, or gaps remain blocking. |
| Future storage paths are named but must not exist yet | governance boundary | medium | Implementation sprint must verify absence before and after. | Checker proves no candidate-storage files exist after sprint. |

## Explicit Human Confirmation

The human reviewer supplied a complete answer set and confirmed closure as
`PASS WITH CONDITIONS - validator/dry-run CLI implementation only` on
2026-05-26.

## Next Operational Step

Start `EX-7 Validator And Dry-Run CLI Implementation` as a bounded
implementation sprint. Do not create candidate storage, write candidate
records, execute q19 extraction, mutate protected references, mutate lesson
output, or authorize product use from GATE-EX6.
