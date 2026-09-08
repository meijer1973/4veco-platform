# Task Planning and Review

Read for non-trivial sprint, roadmap, gate, reference-system, production or
architecture work. Routine paragraph work uses its required textbook/paragraph
plan; do not invent a roadmap sprint for it. Publication additionally uses
[the publication workflow](../review/agent-publication-workflow.md).

## Quality-Driven Execution

Agents must optimize for specification fulfilment, not ticket closure.

A completed task must satisfy the stated specification within the authorized
scope. Passing tests, producing files, or avoiding forbidden claims is not
sufficient when the student-facing route, learning design, rendered output, or
review evidence remains weak.

For every non-trivial task, the plan must state:

1. the quality floor;
2. the specification requirements being fulfilled;
3. the evidence needed to prove fulfilment;
4. the review gate that will judge student-facing quality;
5. any higher-quality improvements that can be included without scope drift;
6. any omitted requirements as named follow-up work or explicit blockers.

If the plan cannot explain how the work will meet the specification, the plan
is not ready.

For any non-trivial sprint, roadmap, gate, reference-system, production, or architecture task:

- read the relevant roadmap, sprint plan, source files, validators, and prior reports before acting
- write or update a sprint plan before implementation
- make the plan operational, not merely formal: it must expand the roadmap description into concrete procedure, decision points, outputs, acceptance tests, and stop conditions
- log the plan in the expected sprint files before executing
- follow the plan as written
- if the plan is too thin or misses a requirement from the roadmap, stop and fix the plan before continuing
- before moving past a review gate, verify the required artifacts exist and validators pass
- close every non-trivial response with a clear direction for what should happen next: proceed to the next sprint, send a human-review packet, run a specific validation/build step, commit/push, insert a new sprint, or deliberately stop/pause
- when blockers, evidence gaps, planning contradictions, or architectural uncertainty appear, say so plainly at the end and recommend the strategic pause or roadmap adjustment needed before continuing
- do not leave the user to infer the next step from a status summary; the final paragraph must make the operational next action explicit

### Sprint agent structure

For roadmap sprints, use a separated-agent workflow:

- a planning/review subagent checks the sprint outline, baseline needs, required logs, stop conditions, and missing roadmap instructions before execution. The Planning agent checks whether the plan has a clear statement about the generated output including which files should be generated .
- the main agent executes the sprint and owns final integration
- specialist subagents may be used for bounded pedagogy, evidence, data-integrity, or code-review questions
- a verification subagent should review the finished artifacts or test plan. Do a thorough check on all required files are present including the basic plan  and other required logs, but also the other required files that were mentioned as output in the plan.
- a structural lead-review cycle is required before closing non-trivial roadmap
  sprints: lead-review assignment, round-1 review, correction log, and round-2
  recheck. Do not set `lead_review_required: false` unless the sprint records
  an explicit exemption with reason, reviewer/approver, and date.
- human-review gates must receive lead review before the human review starts.
  Human gate artifacts do not replace the pre-gate lead-review check for future
  gates.

The main agent remains accountable. Subagents advise, test, or produce bounded artifacts; they do not replace the roadmap, validators, human gates, or final integration judgement.
