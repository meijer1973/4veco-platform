# MTU-H2C Preflight Log

Generated: 2026-05-28

Status: final preflight passed for reduced clean-lane execution.

## Source Authority

- Source gate: `reports/review-gates/GATE-MTU-H2B-cli-execution/gate-closure.json`
- Sprint plan: `reports/sprints/MTU-H2C-plan.md`
- Reviewed mutation plan: `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`
- Current commit before execution: `4c6793c`
- Reviewed mutation-plan SHA-256:
  `F3064251AC6C2F7AD597D2057FEC246A61C360DA7A0C5FD597BAA09A223EC2FF`
- Local diff on reviewed mutation plan: none

## Working Tree

`git status --short` before execution:

```text
?? knowledge/exit-ticket-game-1.1.1.zip
```

The untracked exit-ticket zip predates MTU-H2C and is outside this sprint. It
must remain untouched and uncommitted.

## Live Registry Check

| ID | Preflight state | Decision |
|---|---|---|
| `F19` | absent | execute `unit-add` |
| `F20` | absent | execute `unit-add` |
| `A85` | absent | execute `unit-add` |
| `A86` | absent | execute `unit-add` |
| `A87` | absent | execute `unit-add` |
| `A91` | absent | execute `unit-add` |
| `A88` | absent | hold as conditional/revise-first |
| `A89` | absent | hold as conditional/revise-first |
| `A90` | absent | hold as conditional/revise-first |
| `A92` | absent | hold until `A89` dependency route is resolved |
| `A93` | absent | hold as conditional/revise-first |
| `A12` | present as `MO bepalen`, `exam_codes: [A2.11]` | hold until update spec retains `A2.11` or removal is separately authorized |
| `A20` | present as `MO = MK oplossen`, `exam_codes: [A2.10, A2.12]` | hold because active target exercise `4.1.2` uses A20 in a given-MK context |

## Candidate Storage Check

The following forbidden candidate-storage paths are absent:

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`

## Execution Scope

Authorized for this reduced MTU-H2C execution:

- `F19` Maatschappelijke kosten verbaal herkennen
- `F20` Maatschappelijke kosten uitleggen met voorbeeld
- `A85` Totale opbrengst puntberekening: TO = P x Q
- `A86` TVK berekenen uit constante variabele kosten
- `A87` Onbekende vaste kosten berekenen uit winstvergelijking
- `A91` MO = gegeven MK oplossen

Explicitly not executed:

- `A12`
- `A20`
- `A88`
- `A89`
- `A90`
- `A92`
- `A93`

## Command Standard

Before each CLI command, the execution script must print the exact JSON spec
extracted from `solo-q1-q3-cli-mutation-plan.json`. The only allowed mutation
command in MTU-H2C is:

```bash
node build-scripts/references/unit-add.js --spec "<printed spec>"
```

Any changed registry state, missing dependency, unexpected candidate-storage
file, or hidden attempt to execute `A12`/`A20` must stop the sprint and route a
new review.
