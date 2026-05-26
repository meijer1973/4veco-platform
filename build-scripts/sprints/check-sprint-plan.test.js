const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const checker = path.resolve(__dirname, 'check-sprint-plan.js');

function tempPlan(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sprint-plan-'));
  const file = path.join(dir, 'EXAMPLE-plan.md');
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

function validPlan(overrides = {}) {
  return [
    '# Sprint EXAMPLE: Example Plan',
    '',
    '## Goal',
    overrides.goal || 'Build a governed example surface.',
    '',
    '## Context',
    'The plan demonstrates required planning structure.',
    '',
    ...(overrides.omitQualityStandard
      ? []
      : [
          '## Quality Standard',
          overrides.qualityStandard ||
            'The quality floor is specification fulfilment with rendered output proof, student-facing evidence, and named follow-up work.',
          '',
        ]),
    '## Specification Fulfilment Matrix',
    '| Specification requirement | Implementation evidence required | Review/proof required | Status |',
    '|---|---|---|---|',
    '| Student route is clear | Rendered page | Student-facing review proof | pending |',
    '',
    '## Quality Improvement Candidates',
    '| Candidate improvement | Classification | Reason |',
    '|---|---|---|',
    '| Improve button label | `include_now` | Supports student affordance. |',
    '| Add second variant | `defer_named_follow_up` | Useful but outside current scope. |',
    '| Add automatic routing | `reject_scope_creep` | Not authorized. |',
    '',
    '## Allowed paths',
    '- reports/sprints/EXAMPLE-plan.md',
    '',
    '## Forbidden paths',
    '- references/machine/',
    '- references/external/',
    '',
    '## Inputs',
    '- roadmap',
    '',
    '## Outputs',
    '- plan',
    '',
    '## Operationalized sprint procedure',
    '1. Read the specification and roadmap.',
    '2. Implement the scoped change and stop for human review if evidence is missing.',
    '3. Run validator and acceptance checks before closure.',
    '',
    '## Acceptance tests',
    '```bash',
    'node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXAMPLE-plan.md',
    '```',
    '',
    '## Proof Required to Close',
    'Close only with proof from validator, test, or review evidence.',
    '',
    '## Rollback plan',
    'Revert scoped changes.',
    '',
    '## Human review required',
    'No human review required for this example.',
    '',
  ].join('\n');
}

function run(file) {
  return spawnSync(process.execPath, [checker, file], {
    cwd: path.resolve(__dirname, '..', '..'),
    encoding: 'utf8',
  });
}

describe('check-sprint-plan quality floor', () => {
  test('passes when required quality sections are present', () => {
    const result = run(tempPlan(validPlan()));
    expect(result.status).toBe(0);
  });

  test('fails when Quality Standard is missing', () => {
    const result = run(tempPlan(validPlan({ omitQualityStandard: true })));
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Quality Standard');
  });

  test('fails when Quality Standard omits rendered-output proof language', () => {
    const result = run(
      tempPlan(
        validPlan({
          qualityStandard:
            'The quality floor is specification fulfilment with student-facing evidence and named follow-up work.',
        })
      )
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('rendered output');
  });
});
