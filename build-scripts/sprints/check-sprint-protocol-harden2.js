#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const crypto = require('crypto');

function fail(message) {
  console.error(`SPRINT-PROTOCOL-HARDEN-2 fixture check failed: ${message}`);
  cleanup();
  process.exit(1);
}

const root = path.join(os.tmpdir(), `sprint-protocol-harden2-${process.pid}`);

function cleanup() {
  fs.rmSync(root, { recursive: true, force: true });
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value || '', 'utf8').digest('hex');
}

function commandEntry(command, exitCode = 0, sprintId = 'TEST-PROTOCOL-1') {
  return {
    schema_version: 1,
    sprint_id: sprintId,
    command,
    cwd: process.cwd(),
    started_at: '2026-06-03T00:00:00.000Z',
    finished_at: '2026-06-03T00:00:01.000Z',
    duration_ms: 1000,
    exit_code: exitCode,
    stdout_sha256: sha256('ok'),
    stderr_sha256: sha256(''),
    stdout_excerpt: 'ok',
    stderr_excerpt: '',
  };
}

function resultJson(command, sprintId = 'TEST-PROTOCOL-1') {
  return {
    schema_version: 1,
    sprint_id: sprintId,
    status: 'completed',
    acceptance_tests: [{ command, status: 'passed' }],
  };
}

function runNode(args, expectedStatus, expectedText, extraEnv = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status !== expectedStatus) {
    fail(`expected status ${expectedStatus}, got ${result.status} for node ${args.join(' ')}\n${output}`);
  }
  if (expectedText && !output.includes(expectedText)) {
    fail(`expected output to include "${expectedText}" for node ${args.join(' ')}\n${output}`);
  }
  console.log(`OK fixture: node ${args.join(' ')} -> ${expectedStatus}`);
}

function writeCommandLog(file, entries) {
  writeFile(file, entries.map((entry) => JSON.stringify(entry)).join('\n') + '\n');
}

function reviewMarkdown(sprintId, evidencePaths, commandEvidence) {
  return `# Lead Review Summary

Sprint: \`${sprintId}\`

Round: lead review round 1

## Scope

Evidence inspected: ${evidencePaths.map((item) => `\`${item}\``).join(', ')}

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Fixture | lead reviewer | Evidence | PASS |

## Consolidated Verdict

Verdict: PASS

## Blocking Findings

None.

## Specialist Findings

No specialist findings.

## Test Evidence

${commandEvidence}

## Learning Quality Evidence

No learning output changed.

## Student Experience Evidence

No student-facing output changed.

## Ownership and Handoff

Fixture only.

## Required Next Action

Continue fixture validation.
`;
}

function planMarkdown(id) {
  return `# Sprint ${id}: Protocol Fixture

## Goal

Exercise protocol validator behavior.

## Context

Temporary fixture for SPRINT-PROTOCOL-HARDEN-2 validation.

## Quality Standard

The quality floor is specification proof for student-facing governance while
rendered output remains unchanged and follow-up evidence is named.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Protocol fixture validates command logs | Temporary fixture files | Validator result | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Use command-log fixtures | \`include_now\` | Proves validator behavior. |
| Add broader historical migration | \`defer_named_follow_up\` | Historical command evidence cannot be recreated honestly. |
| Mutate protected references | \`reject_scope_creep\` | Fixtures must not mutate protected data. |

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
2. Run the validator and inspect the result.
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

Temporary protocol validation fixture result.

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

function leadReviewSupport(id, kind) {
  if (kind === 'assignment') {
    return `# Sprint ${id}: Lead Review Assignment

Lead reviewer must inspect fixture output artifacts and command logs.
`;
  }
  return `# Sprint ${id}: Lead Review Corrections

Round-1 verdict: PASS.

Correction record: no corrections required.

Round-2 recheck is ready.
`;
}

function leadReviewReport(id, round, command) {
  return `# Lead Review Summary

Sprint: \`${id}\`

Round: lead review round ${round}

## Scope

Evidence inspected: \`build-scripts/sprints/run-sprint-command.js\`,
\`build-scripts/sprints/check-sprint-command-log.js\`,
\`reports/sprints/${id}-command-log.jsonl\`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Fixture validation | Lead reviewer | Command log and implementation files | PASS |

## Consolidated Verdict

Verdict: PASS

## Blocking Findings

None.

## Specialist Findings

Fixture only.

## Test Evidence

Passed: \`${command}\`

Command log: \`reports/sprints/${id}-command-log.jsonl\`

## Learning Quality Evidence

No learning content changed.

## Student Experience Evidence

No student-facing output changed.

## Ownership and Handoff

Fixture only.

## Required Next Action

Remove temporary fixture files.
`;
}

function createSprintBundleFixture(id, command, options = {}) {
  writeFile(`reports/sprints/${id}-plan.md`, planMarkdown(id));
  writeFile(`reports/sprints/${id}-baseline.md`, baselineMarkdown(id));
  writeFile(`reports/sprints/${id}-result.md`, resultMarkdown(id));
  writeFile(`reports/sprints/${id}-diff-summary.md`, diffMarkdown(id));
  writeFile(`reports/sprints/${id}-lead-review-assignment.md`, leadReviewSupport(id, 'assignment'));
  writeFile(`reports/sprints/${id}-lead-review-round1.md`, leadReviewReport(id, 1, command));
  writeFile(`reports/sprints/${id}-lead-review-corrections.md`, leadReviewSupport(id, 'corrections'));
  writeFile(`reports/sprints/${id}-lead-review-round2.md`, leadReviewReport(id, 2, command));
  writeFile(
    `references/data/sprints/${id}.plan.json`,
    `${JSON.stringify(
      {
        schema_version: 1,
        sprint_id: id,
        name: 'Protocol Fixture',
        created: '2026-06-03',
        plan: `reports/sprints/${id}-plan.md`,
        baseline: `reports/sprints/${id}-baseline.md`,
        protected_reference_data_changes_allowed: false,
        human_review_required: false,
        lead_review_required: true,
        lead_review_schema_version: 2,
        lead_review_phase: 'before_sprint_closure',
        acceptance_tests: [command],
      },
      null,
      2
    )}\n`
  );
  writeFile(
    `references/data/sprints/${id}.result.json`,
    `${JSON.stringify(
      {
        schema_version: 1,
        sprint_id: id,
        status: 'completed',
        plan: `reports/sprints/${id}-plan.md`,
        baseline: `reports/sprints/${id}-baseline.md`,
        result: `reports/sprints/${id}-result.md`,
        diff_summary: `reports/sprints/${id}-diff-summary.md`,
        protected_reference_data_changed: false,
        lead_review_required: true,
        lead_review_schema_version: 2,
        lead_review: {
          assignment: `reports/sprints/${id}-lead-review-assignment.md`,
          round1: `reports/sprints/${id}-lead-review-round1.md`,
          corrections: `reports/sprints/${id}-lead-review-corrections.md`,
          round2: `reports/sprints/${id}-lead-review-round2.md`,
          final_verdict: 'PASS',
          flags: [],
        },
        acceptance_tests: [{ command, status: 'passed' }],
      },
      null,
      2
    )}\n`
  );
  if (options.commandLog) {
    writeCommandLog(`reports/sprints/${id}-command-log.jsonl`, options.commandLog);
    writeFile(`reports/sprints/${id}-command-log.md`, `# Sprint ${id}: Command Log\n\n${command}\n`);
  }
}

function cleanupSprintBundleFixture(id) {
  for (const suffix of [
    'plan',
    'baseline',
    'result',
    'diff-summary',
    'lead-review-assignment',
    'lead-review-round1',
    'lead-review-corrections',
    'lead-review-round2',
    'command-log',
  ]) {
    fs.rmSync(`reports/sprints/${id}-${suffix}.md`, { force: true });
  }
  fs.rmSync(`reports/sprints/${id}-command-log.jsonl`, { force: true });
  fs.rmSync(`references/data/sprints/${id}.plan.json`, { force: true });
  fs.rmSync(`references/data/sprints/${id}.result.json`, { force: true });
}

try {
  cleanup();
  fs.mkdirSync(root, { recursive: true });

  const command = 'node build-scripts/sprints/check-sprint-plan.js reports/sprints/TEST-plan.md';
  const resultPath = path.join(root, 'result.json');
  const missingLogPath = path.join(root, 'missing-command-log.jsonl');
  writeFile(resultPath, `${JSON.stringify(resultJson(command), null, 2)}\n`);
  runNode(
    [
      'build-scripts/sprints/check-sprint-command-log.js',
      'TEST-PROTOCOL-1',
      '--jsonl',
      missingLogPath,
      '--markdown',
      path.join(root, 'missing-command-log.md'),
      '--result-json',
      resultPath,
      '--require-result-tests',
    ],
    1,
    'missing command log'
  );

  const nonzeroLogPath = path.join(root, 'nonzero-command-log.jsonl');
  const nonzeroMdPath = path.join(root, 'nonzero-command-log.md');
  writeCommandLog(nonzeroLogPath, [commandEntry(command, 1)]);
  writeFile(nonzeroMdPath, `# Sprint TEST-PROTOCOL-1: Command Log\n\n${command}\n`);
  runNode(
    [
      'build-scripts/sprints/check-sprint-command-log.js',
      'TEST-PROTOCOL-1',
      '--jsonl',
      nonzeroLogPath,
      '--markdown',
      nonzeroMdPath,
      '--result-json',
      resultPath,
      '--require-result-tests',
    ],
    1,
    'lacks command-log exit_code 0'
  );

  const goodLogPath = path.join(root, 'good-command-log.jsonl');
  const goodMdPath = path.join(root, 'good-command-log.md');
  writeCommandLog(goodLogPath, [commandEntry(command, 0)]);
  writeFile(goodMdPath, `# Sprint TEST-PROTOCOL-1: Command Log\n\n${command}\n`);
  runNode(
    [
      'build-scripts/sprints/check-sprint-command-log.js',
      'TEST-PROTOCOL-1',
      '--jsonl',
      goodLogPath,
      '--markdown',
      goodMdPath,
      '--result-json',
      resultPath,
      '--require-result-tests',
    ],
    0
  );

  const spoofResultPath = path.join(root, 'spoof-result.json');
  writeFile(spoofResultPath, `${JSON.stringify(resultJson('node fake-spoof.js'), null, 2)}\n`);
  runNode(
    [
      'build-scripts/sprints/check-sprint-command-log.js',
      'TEST-PROTOCOL-1',
      '--jsonl',
      goodLogPath,
      '--markdown',
      goodMdPath,
      '--result-json',
      spoofResultPath,
      '--require-result-tests',
    ],
    1,
    'lacks command-log exit_code 0',
    { SPRINT_COMMAND_UNDER_RUN: 'node fake-spoof.js' }
  );

  const thinReview = path.join(root, 'thin-review.md');
  writeFile(
    thinReview,
    reviewMarkdown('TEST-PROTOCOL-1', ['reports/sprints/TEST-PROTOCOL-1-plan.md'], 'No command evidence.')
  );
  runNode(
    [
      'build-scripts/sprints/check-lead-review-substance.js',
      'TEST-PROTOCOL-1',
      '--review-file',
      thinReview,
      '--command-log-jsonl',
      goodLogPath,
    ],
    1,
    'must inspect actual output artifacts'
  );

  const planningOnlyReview = path.join(root, 'planning-only-review.md');
  writeFile(
    planningOnlyReview,
    reviewMarkdown(
      'TEST-PROTOCOL-1',
      [
        'reports/sprints/TEST-PROTOCOL-1-plan.md',
        'reports/sprints/TEST-PROTOCOL-1-baseline.md',
        'references/reference-team-roadmap.md',
      ],
      `Command log: \`reports/sprints/TEST-PROTOCOL-1-command-log.jsonl\``
    )
  );
  runNode(
    [
      'build-scripts/sprints/check-lead-review-substance.js',
      'TEST-PROTOCOL-1',
      '--review-file',
      planningOnlyReview,
      '--command-log-jsonl',
      goodLogPath,
    ],
    1,
    'must inspect actual output artifacts'
  );

  const goodReview = path.join(root, 'good-review.md');
  writeFile(
    goodReview,
    reviewMarkdown(
      'TEST-PROTOCOL-1',
      [
        'build-scripts/sprints/run-sprint-command.js',
        'build-scripts/sprints/check-sprint-command-log.js',
        'reports/sprints/TEST-PROTOCOL-1-command-log.jsonl',
      ],
      `Passed: \`${command}\`\n\nCommand log: \`reports/sprints/TEST-PROTOCOL-1-command-log.jsonl\``
    )
  );
  runNode(
    [
      'build-scripts/sprints/check-lead-review-substance.js',
      'TEST-PROTOCOL-1',
      '--review-file',
      goodReview,
      '--command-log-jsonl',
      goodLogPath,
    ],
    0
  );

  const bogusReview = path.join(root, 'bogus-review.md');
  writeFile(
    bogusReview,
    reviewMarkdown(
      'TEST-PROTOCOL-1',
      [
        'build-scripts/sprints/does-not-exist-for-protocol-fixture.js',
        'reports/sprints/TEST-PROTOCOL-1-command-log.jsonl',
      ],
      `Passed: \`${command}\`\n\nCommand log: \`reports/sprints/TEST-PROTOCOL-1-command-log.jsonl\``
    )
  );
  runNode(
    [
      'build-scripts/sprints/check-lead-review-substance.js',
      'TEST-PROTOCOL-1',
      '--review-file',
      bogusReview,
      '--command-log-jsonl',
      goodLogPath,
    ],
    1,
    'cites missing output artifact'
  );

  const sprintFixtureId = 'TEST-PROTOCOL-2';
  const sprintCommand = 'node build-scripts/sprints/check-sprint-plan.js reports/sprints/TEST-PROTOCOL-2-plan.md';
  cleanupSprintBundleFixture(sprintFixtureId);
  createSprintBundleFixture(sprintFixtureId, sprintCommand);
  runNode(
    ['build-scripts/sprints/check-sprint-result.js', `reports/sprints/${sprintFixtureId}-result.md`],
    1,
    'missing command log'
  );
  runNode(
    ['build-scripts/sprints/check-sprint-bundle.js', sprintFixtureId, '--complete'],
    1,
    'missing command log',
    { SPRINT_BUNDLE_ALLOW_TEST_FIXTURES: '1' }
  );
  createSprintBundleFixture(sprintFixtureId, sprintCommand, {
    commandLog: [commandEntry('node something-else.js', 0, sprintFixtureId)],
  });
  runNode(
    ['build-scripts/sprints/check-sprint-result.js', `reports/sprints/${sprintFixtureId}-result.md`],
    1,
    'lacks command-log exit_code 0',
    { SPRINT_COMMAND_UNDER_RUN: sprintCommand }
  );
  cleanupSprintBundleFixture(sprintFixtureId);

  const batchRoot = path.join(root, 'batch-root');
  const changedFilesPath = path.join(root, 'changed-files.txt');
  writeFile(
    path.join(batchRoot, 'references/data/sprints/TEST-A.result.json'),
    `${JSON.stringify({ sprint_id: 'TEST-A', status: 'completed' }, null, 2)}\n`
  );
  writeFile(
    path.join(batchRoot, 'references/data/sprints/TEST-B.result.json'),
    `${JSON.stringify({ sprint_id: 'TEST-B', status: 'completed' }, null, 2)}\n`
  );
  writeFile(
    changedFilesPath,
    ['references/data/sprints/TEST-A.result.json', 'references/data/sprints/TEST-B.result.json'].join('\n')
  );
  runNode(
    [
      'build-scripts/sprints/check-batch-sprint-closure.js',
      '--root',
      batchRoot,
      '--changed-files',
      changedFilesPath,
    ],
    1,
    'missing batch closure waiver'
  );

  writeFile(path.join(batchRoot, 'BATCH-CLOSURE-WAIVER.md'), 'Human authorized batch closure on 2026-06-03.\n');
  runNode(
    [
      'build-scripts/sprints/check-batch-sprint-closure.js',
      '--root',
      batchRoot,
      '--changed-files',
      changedFilesPath,
    ],
    0
  );
} finally {
  cleanupSprintBundleFixture('TEST-PROTOCOL-2');
  cleanup();
}

console.log('OK SPRINT-PROTOCOL-HARDEN-2 fixtures');
