# GATE-EX2 Exam-to-MTU Mapping Review Packet

Generated: 2026-05-21

Status: review packet ready, EX-2 not closed.

No protected reference mutation authorized. No external-source mutation authorized. No unit minting authorized. No target-exercise promotion authorized. No lesson-output mutation authorized. No CP-6 or Year-1 closure authorized.

## Review Scope

The reviewer should classify the EX-1 pilot exam requirements against the existing MTU and operation surface, and route later work. The reviewer should not authorize mutation directly.

Evidence base:

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.json`
- `references/machine/micro-teaching-units.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- `references/reference-team-roadmap.md`

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one question at a time.

### EX2-Q1: q3 annual cost threshold

For `vw-1022-a-25-1-o:opgave-1:question-3`, EX-1 found an annual insurance cost-threshold operation. The mirrored source record lists `A15`, but live `A15` is price elasticity, not annual cost comparison. How should `q3-calc-1` be classified?

Options:
- Classify as `operation_registry_need`; treat the A15 mirror mapping as weak/stale until EX-2 names a better route.
- Classify as `existing_mtu_but_procedure_too_weak`; name the existing unit(s) to strengthen.
- Classify as `missing_mtu` for later governed review/mutation.
- Defer until a broader arithmetic/procedure audit names the right existing route.
- Open answer / other, with rationale.

### EX2-Q2: q3 answer wording

For q3, the correction model rewards not only calculation but a threshold conclusion with unit and direction: cheaper up to a stated annual care-cost amount. How should `q3-answer-1` be classified?

Options:
- Classify as `answer_skill_need`; later work should model threshold-conclusion wording explicitly.
- Treat it as part of the same calculation/procedure requirement from EX2-Q1.
- Defer answer-skill classification until an answer-writing registry exists.
- Open answer / other, with rationale.

### EX2-Q3: q19 source and graph reconstruction gaps

For `vw-1022-a-25-1-o:opgave-4:question-19`, EX-1 carries blocking `q19-source-annex-gap` and `q19-graph-object-gap` because the source figure and uitwerkbijlage are not fully reconstructable from the mirrored text. Should these gaps block full MTU mapping and lesson handoff?

Options:
- Yes, keep both gaps blocking full reconstruction, MTU mapping, lesson handoff, and human review until source extraction improves.
- Allow provisional MTU mapping while keeping lesson handoff blocked.
- Accept the current extraction as enough for mapping, but keep graph/PV work blocked.
- Open answer / other, with rationale.

### EX2-Q4: q19 market-shift operation

For q19, students must draw rightward demand shifts in three market diagrams and state wage/price-level directions. Candidate units include `A45`, `D10`, and `D13`, but EX-1 classifies the task as `pv_graph_need` plus `operation_registry_need`. How should `q19-graph-op-1` and `q19-reason-1` be routed?

Options:
- Classify as existing MTUs but procedure too weak; review D10/D13/PV graph support later.
- Classify as `operation_registry_need` plus `pv_graph_need`; no mutation now.
- Classify as `missing_mtu` or `merge_split_candidate`; name what is missing or should be split/merged.
- Defer until q19 source/graph gaps are resolved.
- Open answer / other, with rationale.

### EX2-Q5: q15 content MTU mapping

For `vw-1022-a-25-1-o:opgave-3:question-15`, EX-1 maps the perfect-substitute context to `D27` and the dominant-strategy/prisoner-dilemma concepts to `F03` and `F09`. Is this content mapping sufficient?

Options:
- Yes, classify `D27`, `F03`, and `F09` as existing MTUs for content coverage.
- Partly; classify one or more as existing but procedure too weak, naming which.
- No; route one or more requirements as missing MTU or merge/split candidate.
- Open answer / other, with rationale.

### EX2-Q6: q15 answer-model operation

For q15, the correction model rewards a two-step explanation: undercutting as dominant strategy, then lower revenue/profit as prisoner-dilemma outcome. How should `q15-answer-1` be classified?

Options:
- Classify as `answer_skill_need`; later work should model correction-model explanation structure explicitly.
- Treat it as covered by existing `F03`/`F09` procedures if those are strengthened later.
- Classify as `operation_registry_need` rather than answer-skill need.
- Defer until an answer-writing registry exists.
- Open answer / other, with rationale.

### EX2-Q7: Lesson-build handoff readiness

After EX-2 classification, which pilot items may be considered ready for later lesson-design handoff, and which must remain blocked?

Options:
- q3 and q15 may proceed to later L-EX0/L-EX1 coordination with gaps; q19 remains blocked by source/graph reconstruction.
- All three remain blocked until EX-3/EX-4 reporting and mutation routes are clearer.
- q15 only may proceed; q3 and q19 need further mapping/source work.
- Open answer / other, with rationale.

### EX2-Q8: Mutation and next-sprint authority

Does this gate authorize protected reference mutation, external-source mutation, unit minting, operation-registry mutation, answer-skill mutation, target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure, or student/product use now?

Options:
- No. EX-2 may only record classifications and authorize later bounded sprints such as EX-3 dashboards or EX-4 mutation planning.
- Yes, but only for explicitly named low-risk items after a separate CLI-governed mutation plan.
- Hold; authority cannot be decided until source/graph gaps and answer-skill policy are reviewed.
- Open answer / other, with rationale.

## Future Interview Protocol

- Show the full question list before starting.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a gate decision only after evidence is complete.
- Require explicit human confirmation before writing a gate closure record or authorizing downstream sprint scope.

## Current Stop Conditions

- Stop if any answer authorizes protected reference mutation or external-source mutation.
- Stop if any answer authorizes unit minting before a later CLI-governed mutation sprint.
- Stop if any answer treats q19 as fully reconstructable while its source/graph gaps remain unresolved.
- Stop if any answer hides source-annex, graph-object, or answer-model gaps downstream.
- Stop if any answer authorizes target-exercise promotion, placeholder finalization, CP-6 closure, Year-1 closure, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Recommended Next Action

Run the formal GATE-EX2 human review before treating any EX-1 pilot mapping classification as accepted evidence.
