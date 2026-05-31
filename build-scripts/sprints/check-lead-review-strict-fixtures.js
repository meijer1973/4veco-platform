#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CASES = [
  {
    id: 'TEST-STRICT-1',
    mode: 'planned',
    planJson: { created: '2026-01-01', lead_review_required: false },
    expectedStatus: 1,
    expectedText: 'must declare lead_review_required: true',
  },
  {
    id: 'TEST-STRICT-2',
    mode: 'planned',
    planJson: {
      created: '2026-05-31',
      human_review_required: true,
      lead_review_required: false,
      gate_id: 'GATE-TEST-STRICT-2',
      review_packet: 'reports/review-gates/GATE-TEST-STRICT-2/review-packet.md',
      valid_gate_statuses: ['pass', 'pass_with_conditions'],
      lead_review_exemption: {
        reason: 'test exemption',
        approved_by: 'test human',
        approval_evidence: 'reports/sprints/TEST-STRICT-2-plan.md',
        reviewed_on: '2026-05-31',
      },
    },
    expectedStatus: 1,
    expectedText: 'human-review sprints cannot use lead_review_exemption',
  },
  {
    id: 'TEST-STRICT-3',
    mode: 'complete',
    omitFlags: true,
    expectedStatus: 1,
    expectedText: 'lead_review.flags must list carried flags',
  },
  {
    id: 'TEST-STRICT-4',
    mode: 'complete',
    thinRound2: true,
    expectedStatus: 1,
    expectedText: 'missing required lead-review section',
  },
  {
    id: 'TEST-STRICT-5',
    mode: 'complete',
    expectedStatus: 0,
  },
];

function fail(message) {
  console.error(`Lead-review strict fixture check failed: ${message}`);
  cleanup();
  process.exit(1);
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function planMarkdown(id) {
  return `# Sprint ${id}: Strict Fixture

## Goal

Exercise strict lead-review validation.

## Context

Temporary fixture for validator testing.

## Quality Standard

The quality floor is specification proof for a student-facing governance path
with rendered output mentioned as not applicable and follow-up evidence named.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Strict fixture validates lead review | Temporary fixture files | Validator result | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Use strict fixtures | \`include_now\` | Proves validator behavior. |
| Add more fixture branches | \`defer_named_follow_up\` | Current sprint covers critical paths. |
| Use production mutation | \`reject_scope_creep\` | Fixtures must not mutate product data. |

## Allowed paths

- \`reports/sprints/${id}-*\`

## Forbidden paths

- \`references/machine/\`
- \`references/external/\`

## Inputs

- Validator fixture.

## Outputs

- Temporary validation result.

## Operationalized sprint procedure

1. Create a temporary fixture.
2. Run the validator and inspect the decision.
3. Stop if the validator result does not match the expected acceptance or rejection.

## Acceptance tests

\`\`\`bash
node build-scripts/sprints/check-sprint-bundle.js ${id}
\`\`\`

## Proof Required to Close

Proof to close is validator/test evidence for this temporary fixture.

## Rollback plan

Delete the temporary fixture files.

## Human review required

No human review is required for this temporary fixture.
`;
}

function baselineMarkdown(id) {
  return `# Sprint ${id}: Baseline

## Plan reference

Plan: \`reports/sprints/${id}-plan.md\`

## Current state

Temporary strict validation fixture.

## Data integrity notes

No protected reference data changed. \`references/machine/\` and
\`references/external/\` are not mutated.
`;
}

function resultMarkdown(id) {
  return `# Sprint ${id}: Result

## Plan reference

\`reports/sprints/${id}-plan.md\`

## Summary

Temporary strict validation fixture result.

## Acceptance test results

- Fixture command recorded.

## Changed files

- Temporary fixture files only.

## Data integrity notes

No protected reference data changed.

## Open follow-ups

- None.

## Rollback instructions

Delete the temporary fixture files.
`;
}

function diffMarkdown(id) {
  return `# Sprint ${id}: Diff Summary

## Summary

Temporary fixture diff.

## Protected surfaces

No \`references/machine/\` or \`references/external/\` changes.
`;
}

function supportFile(id, type) {
  if (type === 'assignment') {
    return `# Sprint ${id}: Lead Review Assignment

Scope: temporary strict validation fixture.

Lead reviewer agent must inspect evidence in \`reports/sprints/${id}-plan.md\`,
\`reports/sprints/${id}-baseline.md\`, and
\`references/data/sprints/${id}.plan.json\`.
`;
  }
  return `# Sprint ${id}: Lead Review Corrections

Round-1 verdict: PASS WITH FLAGS.

Correction record: accepted carried flag for temporary fixture validation.

Round-2 recheck is ready.
`;
}

function reviewReport(id, round, thin = false) {
  if (thin) {
    return `# Lead Review Summary

Sprint: \`${id}\`

Round: lead review round ${round}

Verdict: PASS WITH FLAGS
`;
  }
  return `# Lead Review Summary

Sprint: \`${id}\`

Round: lead review round ${round}

## Scope

- Artifact/task: temporary strict validation fixture.
- Requested outcome: validate strict lead-review semantics.
- Evidence inspected:
  - \`reports/sprints/${id}-plan.md\`
  - \`reports/sprints/${id}-baseline.md\`
  - \`references/data/sprints/${id}.plan.json\`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Fixture validation | Lead Reviewer Agent | Strict fixture files | PASS WITH FLAGS |

## Consolidated Verdict

- Verdict: PASS WITH FLAGS
- Reason: Fixture passes with a carried validation flag.

## Blocking Findings

- None.

## Specialist Findings

- No specialist review required for temporary validator fixture.

## Test Evidence

- \`node build-scripts/sprints/check-sprint-bundle.js ${id} --complete\` expected path.

## Learning Quality Evidence

- No learning content changed.

## Student Experience Evidence

- No student-facing output changed.

## Ownership and Handoff

- Platform: strict validation fixture.

## Required Next Action

- Remove temporary fixture files after test completion.
`;
}

function basePlanJson(id, overrides = {}) {
  return {
    schema_version: 1,
    sprint_id: id,
    name: 'Strict Fixture',
    status: 'planned_active',
    created: '2026-05-31',
    plan: `reports/sprints/${id}-plan.md`,
    baseline: `reports/sprints/${id}-baseline.md`,
    protected_reference_data_changes_allowed: false,
    human_review_required: false,
    lead_review_required: true,
    lead_review_schema_version: 2,
    acceptance_tests: [`node build-scripts/sprints/check-sprint-bundle.js ${id}`],
    ...overrides,
  };
}

function resultJson(id, omitFlags = false) {
  const leadReview = {
    assignment: `reports/sprints/${id}-lead-review-assignment.md`,
    round1: `reports/sprints/${id}-lead-review-round1.md`,
    corrections: `reports/sprints/${id}-lead-review-corrections.md`,
    round2: `reports/sprints/${id}-lead-review-round2.md`,
    final_verdict: 'PASS WITH FLAGS',
  };
  if (!omitFlags) {
    leadReview.flags = [
      {
        id: `${id}-F1`,
        description: 'Temporary fixture carries a non-blocking validation flag.',
        disposition: 'accepted_follow_up',
        owner: 'LEAD-REVIEW-2',
        next_action: 'Remove fixture files after validation.',
        blocking: false,
      },
    ];
  }
  return {
    schema_version: 1,
    sprint_id: id,
    status: 'completed',
    completed_on: '2026-05-31',
    plan: `reports/sprints/${id}-plan.md`,
    baseline: `reports/sprints/${id}-baseline.md`,
    result: `reports/sprints/${id}-result.md`,
    diff_summary: `reports/sprints/${id}-diff-summary.md`,
    protected_reference_data_changed: false,
    lead_review_required: true,
    lead_review_schema_version: 2,
    lead_review: leadReview,
    acceptance_tests: [{ command: `node build-scripts/sprints/check-sprint-bundle.js ${id} --complete`, status: 'passed' }],
  };
}

function createCase(testCase) {
  const id = testCase.id;
  writeFile(`reports/sprints/${id}-plan.md`, planMarkdown(id));
  writeFile(`reports/sprints/${id}-baseline.md`, baselineMarkdown(id));
  writeFile(`references/data/sprints/${id}.plan.json`, `${JSON.stringify(basePlanJson(id, testCase.planJson || {}), null, 2)}\n`);
  if (testCase.mode === 'complete') {
    writeFile(`reports/sprints/${id}-result.md`, resultMarkdown(id));
    writeFile(`reports/sprints/${id}-diff-summary.md`, diffMarkdown(id));
    writeFile(`reports/sprints/${id}-lead-review-assignment.md`, supportFile(id, 'assignment'));
    writeFile(`reports/sprints/${id}-lead-review-round1.md`, reviewReport(id, 1));
    writeFile(`reports/sprints/${id}-lead-review-corrections.md`, supportFile(id, 'corrections'));
    writeFile(`reports/sprints/${id}-lead-review-round2.md`, reviewReport(id, 2, testCase.thinRound2));
    writeFile(`references/data/sprints/${id}.result.json`, `${JSON.stringify(resultJson(id, testCase.omitFlags), null, 2)}\n`);
  }
}

function cleanup() {
  for (const { id } of CASES) {
    for (const suffix of [
      'plan',
      'baseline',
      'result',
      'diff-summary',
      'lead-review-assignment',
      'lead-review-round1',
      'lead-review-corrections',
      'lead-review-round2',
    ]) {
      fs.rmSync(`reports/sprints/${id}-${suffix}.md`, { force: true });
    }
    fs.rmSync(`references/data/sprints/${id}.plan.json`, { force: true });
    fs.rmSync(`references/data/sprints/${id}.result.json`, { force: true });
  }
}

try {
  cleanup();
  for (const testCase of CASES) {
    createCase(testCase);
    const args = ['build-scripts/sprints/check-sprint-bundle.js', testCase.id];
    if (testCase.mode === 'complete') args.push('--complete');
    const result = spawnSync(process.execPath, args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, SPRINT_BUNDLE_ALLOW_TEST_FIXTURES: '1' },
    });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    if (result.status !== testCase.expectedStatus) {
      fail(`${testCase.id} expected status ${testCase.expectedStatus}, got ${result.status}\n${output}`);
    }
    if (testCase.expectedText && !output.includes(testCase.expectedText)) {
      fail(`${testCase.id} output did not include expected text "${testCase.expectedText}"\n${output}`);
    }
    console.log(`OK ${testCase.id}: ${testCase.expectedStatus === 0 ? 'accepted' : 'rejected as expected'}`);
  }
} finally {
  cleanup();
}

console.log('OK lead-review strict fixtures');
