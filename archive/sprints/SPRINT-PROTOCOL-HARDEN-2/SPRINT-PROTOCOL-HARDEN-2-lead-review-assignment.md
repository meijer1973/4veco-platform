# Sprint SPRINT-PROTOCOL-HARDEN-2: Lead Review Assignment

Generated: 2026-06-03

Sprint: `SPRINT-PROTOCOL-HARDEN-2`

## Scope

The lead reviewer agent must review the sprint protocol hardening
implementation before closure.

Evidence to inspect:

- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-baseline.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-planning-review.md`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`
- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-command-log.js`
- `build-scripts/sprints/check-lead-review-substance.js`
- `build-scripts/sprints/check-batch-sprint-closure.js`
- `build-scripts/sprints/check-sprint-protocol-harden2.js`
- `build-scripts/sprints/check-sprint-result.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.jsonl`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.md`
- `references/reference-team-roadmap.md`

## Review task

Use the strict lead-review report structure required by
`build-scripts/sprints/check-sprint-bundle.js`.

Round 1 must inspect:

- whether command-log schema fields match the handoff;
- whether passed acceptance-test claims require command-log `exit_code: 0`
  evidence;
- whether the currently-running wrapped checker exception is narrow and does
  not create a loophole after command completion;
- whether lead-review substance validation requires actual output artifacts
  separate from plan/baseline/roadmap and command-log evidence;
- whether batch sprint closure requires a human waiver when multiple sprints
  are completed;
- whether the negative fixture checker proves the required failures;
- whether protected reference data and generated lesson output boundaries are
  preserved;
- whether the work implies any unauthorized product-route adoption,
  target-equivalent proof, diagnostics, mastery, sequencing, PV, Scale Gate 1,
  or student/product use.

## Required output

Return a lead-review round-1 report with:

- `# Lead Review Summary`
- `Sprint: \`SPRINT-PROTOCOL-HARDEN-2\``
- `Round: lead review round 1`
- all strict schema sections
- a verdict of PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE
- concrete blocking findings if any
- concrete required next action

If the result is REVISE, name each correction required before round 2.
