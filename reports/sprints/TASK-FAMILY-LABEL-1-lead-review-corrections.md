# TASK-FAMILY-LABEL-1 Lead Review Corrections

Generated: 2026-06-01

Status: corrections applied for round-2 recheck.

## Round-1 Blocker

BF-1 required symmetric negative coverage for `label_placement` validation and
matching:

- non-string `targetId` in a student response;
- duplicate expected target;
- unknown expected label id;
- unknown expected target id.

## Corrections Applied

### Engine Tests

Updated `engines/tests/task-shell-engine.test.js`:

- added response rejection for non-string `targetId`;
- added schema rejection for unknown expected label id;
- added schema rejection for unknown expected target id;
- added schema rejection for duplicate expected target.

### Custom Checker

Updated `build-scripts/sprints/check-task-family-label1.js`:

- added checker assertion for non-string `targetId`;
- added checker assertion for unknown expected label id;
- added checker assertion for unknown expected target id;
- added checker assertion for duplicate expected target.

### Proof JSON

Updated `reports/json/task-family-label1-proof.json` to record:

- `unknown_expected_label_rejected`;
- `unknown_expected_target_rejected`;
- `duplicate_expected_label_rejected`;
- `duplicate_expected_target_rejected`.

## Recheck Commands To Run

```bash
node build-scripts/sprints/check-task-family-label1.js
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
```

## Boundary

The correction changes only tests, checker coverage, and proof metadata. It
does not change source data, generated lesson output, product-route adoption,
target-equivalent reliance, diagnostics, mastery, sequencing, PV, Scale Gate 1,
or student/product authority.
