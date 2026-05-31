# Sprint CHECK-Q2-PLAN: Baseline

Generated: 2026-05-31

## Purpose

Record the current evidence before preparing the target-equivalent
exit-ticket implementation plan.

This baseline is read-only evidence. It authorizes no implementation,
generated output, source-data mutation, protected reference mutation,
target-exercise field writes, candidate storage, target-equivalent claims,
Scale Gate 1, or student/product use.

## Plan reference

- Plan: `reports/sprints/CHECK-Q2-PLAN-plan.md`
- Plan metadata: `references/data/sprints/CHECK-Q2-PLAN.plan.json`

## Roadmap Authority

`GATE-ENGINE-1` authorized `CHECK-Q2-PLAN` as a planning/preparation lane only.
The roadmap row says the sprint may prepare `L1.7B-Q2` and
`GATE-L1.7B-Q2`, while preserving the advisory short check as a separate local
advice surface.

No downstream implementation is authorized by this baseline.

## Product Specification Baseline

The product end state requires:

- every paragraph to route the student from current readiness to local
  target-equivalent proof for the paragraph target exercise;
- advisory short checks to remain local and non-binding;
- target-equivalent exit tickets to be separate from short checks;
- the exit ticket to check the same target-exercise operation chain at the
  same cognitive level using matching answer forms;
- completion language to remain behind `GATE-L1.7B-Q2`.

The companion specification allows short-check advice such as practising a
named skill, going to the exit-ticket check, or continuing for now while
revisiting a weak skill later. It prohibits proof, diagnostic, sequencing,
mastery, summative, AI, PV, and broad scale meanings from short-check output.

## Current Checkpoint State

`source-data/book-1/exit-ticket/1.1.1.json` currently defines:

- title: `Korte check`;
- `targetSkillIds`: `B01`, `B02`;
- `metadataAlignment.status`:
  `paragraph_skill_aligned_not_target_readiness`;
- `metadataAlignment.targetExerciseSkillIds`: `A43`, `B01`, `B02`;
- `metadataAlignment.targetReadinessEvidence`: `false`;
- notes saying the checkpoint samples B01/B02 and does not cover the full A43
  mixed-allocation calculation chain.

This is an advisory/local checkpoint only. It is not target-equivalent proof.

No source-controlled `1.1.2` or `1.1.3` exit-ticket source exists for
target-equivalent proof. Prior UI sprints used non-published fixtures with
`targetReadinessEvidence: false`.

Auditable inventory command:

```powershell
Get-ChildItem source-data/book-1/exit-ticket -Filter *.json | Select-Object -ExpandProperty Name
```

Recorded result at baseline:

```text
1.1.1.json
```

Generated-output inspection basis is read-only: GATE-ENGINE-1 inspected live
rendered output for `1.1.1` landing/advisory check, `1.1.2` landing/math,
`1.1.3` landing/graph, one reasoning route, mobile/narrow route panel,
dark-mode route/task state, and task-shell feedback states. That inspection
does not create target-equivalent proof status.

## Target-Exercise Baseline

The first three Book 1 target exercises are read from
`references/authored/course-target-exercises.json` as read-only context.

| Paragraph | Target exercise chain | Required skills | Current proof status |
|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Wheat revenue; opportunity costs; mixed wheat/corn profit; compare choice; explain with scarcity | `A43`, `B01`, `B02` | advisory check only; full A43 chain not covered |
| `1.1.2` Percentages en indexcijfers | Old/new percentage change; price index; index-to-index percentage change; explain index points versus percent | `A38`, `A39`, `D31` | useful A38/A39 practice; explicit D31 check blocked |
| `1.1.3` Grafieken en tabellen | Draw P-Q graph from table; read/interpolate at EUR 1.75; identify and explain 50 percent drop using table evidence | `A38` plus graph/table candidates | useful graph practice; axis convention and source-explanation blockers |

The target-exercise records are still read-only in this sprint. They must not
receive `question_type`, `answer_form`, operation-chain, or mapping fields.

## Prior Handoff Findings

`GAME-ARCH-2` created the architecture model:

- shared route layer;
- shared task shell;
- advisory short check as advice-only;
- target-equivalent checkpoint composition as future gated state;
- state ownership separating local practice and proof;
- feedback ownership separating neutral feedback and future completion
  language.

`GRAPH-REFINE-1` found:

- graph/table is the strongest practice reference pattern;
- current `1.1.3` graph-route data contains price-as-horizontal/x wording;
- the target requires price vertical and quantity horizontal;
- target-equivalent graph use is blocked until repaired and re-proven.

`MATH-REFINE-1` found:

- current `1.1.2` math route covers useful A38/A39 local practice;
- target-equivalent math use is blocked until D31 is explicitly routed and
  checked;
- the exact target trap is 108 to 112 equals 4 index points, not 4 percent.

`REASON-REFINE-1` found:

- generic `structured_reasoning` is useful local practice but not answer-form
  proof;
- `1.1.1` needs an A98 versus held-evaluation decision before proof use;
- `1.1.2` D31 explanation must coordinate with math coverage;
- `1.1.3` source reasoning requires A81 source-use scaffolding plus graph-axis
  repair;
- answer-form units `A80`, `A81`, and `A96`-`A99` remain
  generator-blocked/non-interactive.

Graph-specific blockers that must be preserved in Q2 planning:

- price must be vertical and quantity horizontal for the `1.1.3` target graph;
- interpolation at EUR 1.75 should answer around 350 ice creams;
- the 50 percent drop must be identified from EUR 2.50 to EUR 3.00 using
  source values 200 and 100;
- source/table evidence must feed an underlying calculation or explanation
  answer form, not stand alone.

## Baseline Conclusion

No current paragraph is ready to be treated as target-equivalent exit-ticket
proof without further implementation and review.

`CHECK-Q2-PLAN` should therefore prepare:

1. a short-check boundary contract;
2. an operation-chain coverage model for Q2;
3. a target-equivalent exit-ticket design plan;
4. implementation-prep requirements for `L1.7B-Q2`;
5. `GATE-L1.7B-Q2` proof requirements;
6. stop conditions that block direct implementation if the chosen paragraph's
   operation-chain blockers remain unresolved.

## Data integrity notes

This sprint must leave these unchanged:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-*/exit-ticket/*.json`;
- `source-data/book-1/reasoning/*.csv`;
- generated Book 1 output;
- engine implementation files.
