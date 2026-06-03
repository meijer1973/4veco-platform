# Sprint SPRINT-PROTOCOL-HARDEN-2: Lead Review Corrections

Generated: 2026-06-03

Sprint: `SPRINT-PROTOCOL-HARDEN-2`

## Round-1 verdict

Lead-review round 1 returned REVISE in
`reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-round1.md`.

## Correction record

Blocking finding 1: negative fixture proof did not directly exercise
`check-sprint-result.js` or `check-sprint-bundle.js --complete`.

Correction:

- Extended `build-scripts/sprints/check-sprint-protocol-harden2.js` with
  temporary `TEST-PROTOCOL-2` sprint-bundle fixtures.
- Added direct negative checks proving:
  - `node build-scripts/sprints/check-sprint-result.js reports/sprints/TEST-PROTOCOL-2-result.md` rejects a completed result when the command log is missing.
  - `node build-scripts/sprints/check-sprint-bundle.js TEST-PROTOCOL-2 --complete` rejects the same condition.
  - `check-sprint-result.js` rejects a passed result command when the command log exists but lacks matching `exit_code: 0` evidence.

Blocking finding 2: lead-review substance validation accepted
implementation-looking paths without verifying existence.

Correction:

- Tightened `build-scripts/sprints/check-lead-review-substance.js` so every
  non-planning output artifact path cited in a lead review must exist.
- Kept command-log paths excluded from the output-artifact count so a review
  must cite actual implementation/proof artifacts in addition to command-log
  evidence.
- Added a negative fixture proving a bogus `build-scripts/...` path is
  rejected with `cites missing output artifact`.

Blocking finding 3: the currently-running-command exception was too broad and
could be env-spoofed.

Correction:

- Replaced the broad `SPRINT_COMMAND_UNDER_RUN === command` skip with a
  narrower `canSkipCurrentlyRunningCommand()` helper in:
  - `build-scripts/sprints/check-sprint-command-log.js`
  - `build-scripts/sprints/check-sprint-result.js`
  - `build-scripts/sprints/check-sprint-bundle.js`
- The helper now requires both:
  - `SPRINT_COMMAND_UNDER_RUN` equals the passed command claim; and
  - the command claim equals the current validator invocation reconstructed
    from `process.argv`.
- Added a negative fixture proving direct env spoofing with
  `SPRINT_COMMAND_UNDER_RUN: node fake-spoof.js` does not satisfy command-log
  evidence.

## Correction validation

Passed through the command wrapper:

```text
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-protocol-harden2.js
```

The corrected fixture suite now proves:

- missing command log rejected;
- non-zero command log rejected;
- good command log accepted;
- env-spoofed current command rejected;
- headings-only lead review rejected;
- plan/baseline/roadmap-only lead review rejected;
- valid lead-review evidence accepted;
- bogus output-artifact path rejected;
- `check-sprint-result.js` rejects missing command-log evidence;
- `check-sprint-bundle.js --complete` rejects missing command-log evidence;
- `check-sprint-result.js` rejects an env-spoofed passed command lacking
  matching log evidence;
- batch closure without waiver rejected;
- batch closure with waiver accepted.

Temporary `TEST-PROTOCOL-2` fixture files were checked absent after cleanup.

## Round-2 readiness

The sprint is ready for lead-review round 2. The recheck should inspect:

- `build-scripts/sprints/check-sprint-protocol-harden2.js`
- `build-scripts/sprints/check-lead-review-substance.js`
- `build-scripts/sprints/check-sprint-command-log.js`
- `build-scripts/sprints/check-sprint-result.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.jsonl`
- this correction log

Round 2 should verify that all round-1 blockers are resolved and that no
protected-reference, generated-output, source-data, product-authority, or
student-facing boundary was widened.
