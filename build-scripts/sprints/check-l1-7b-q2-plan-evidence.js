#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

function fail(message) {
  console.error(`L1.7B-Q2 plan evidence check failed: ${message}`);
  process.exit(1);
}

function read(relPath) {
  const file = path.join(ROOT, relPath);
  if (!fs.existsSync(file)) fail(`missing ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function requireText(content, pattern, label, file) {
  if (!pattern.test(content)) fail(`${file} missing ${label}`);
}

function statusMustBeClean(relPaths, label, cwd = ROOT) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...relPaths], {
    cwd,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    fail(`git status failed for ${label}: ${result.stderr || result.stdout}`);
  }
  if ((result.stdout || '').trim()) {
    fail(`${label} has unauthorized changes:\n${result.stdout}`);
  }
}

const files = {
  plan: 'reports/sprints/L1.7B-Q2-plan.md',
  baseline: 'reports/sprints/L1.7B-Q2-baseline.md',
  planningReview: 'reports/sprints/L1.7B-Q2-planning-review.md',
  selection: 'reports/sprints/L1.7B-Q2-paragraph-selection.md',
  operation: 'reports/sprints/L1.7B-Q2-operation-chain.md',
  answerModel: 'reports/sprints/L1.7B-Q2-answer-model.md',
  contract: 'reports/sprints/L1.7B-Q2-source-data-contract.md',
  state: 'reports/sprints/L1.7B-Q2-state-metadata-contract.md',
  outputPlan: 'reports/sprints/L1.7B-Q2-generated-output-plan.md',
  prep: 'reports/sprints/L1.7B-Q2-implementation-prep.md',
  handoff: 'reports/sprints/L1.7B-Q2-gate-handoff.md',
  planJson: 'references/data/sprints/L1.7B-Q2.plan.json',
};

const content = Object.fromEntries(
  Object.entries(files)
    .filter(([key]) => key !== 'planJson')
    .map(([key, file]) => [key, read(file)])
);
const planJson = readJson(files.planJson);

if (planJson.sprint_id !== 'L1.7B-Q2') fail('plan JSON has wrong sprint_id');
if (planJson.selected_paragraph !== '1.1.2') fail('plan JSON must select 1.1.2');
if (planJson.source_data_mutation_authorized !== false) fail('source data mutation must be false during planning');
if (planJson.lesson_output_mutation_authorized !== false) fail('lesson output mutation must be false during planning');
if (planJson.authority && planJson.authority.implementation_authorized !== false) {
  fail('implementation_authorized must be false during planning');
}

requireText(content.plan, /1\.1\.2 Percentages en indexcijfers/i, 'selected paragraph in plan', files.plan);
requireText(content.plan, /D31/i, 'D31 blocker in plan', files.plan);
requireText(content.plan, /Korte check/i, 'copy blocker in plan', files.plan);
requireText(content.plan, /GATE-L1\.7B-Q2/i, 'human gate boundary in plan', files.plan);
requireText(content.baseline, /1\.1\.2\.json` is absent/i, '1.1.2 source absence baseline', files.baseline);
requireText(content.planningReview, /PASS WITH FLAGS/i, 'planning review verdict', files.planningReview);
requireText(content.planningReview, /Sartre/i, 'real planning reviewer record', files.planningReview);
requireText(content.selection, /Select `1\.1\.2/i, 'paragraph selection decision', files.selection);
requireText(content.selection, /1\.1\.1[\s\S]*A98/i, '1.1.1 rejection rationale', files.selection);
requireText(content.selection, /1\.1\.3[\s\S]*graph-axis/i, '1.1.3 rejection rationale', files.selection);
requireText(content.operation, /15%/i, 'percentage-change answer', files.operation);
requireText(content.operation, /108/i, 'price-index answer', files.operation);
requireText(content.operation, /3\.7%/i, 'index percent-change answer', files.operation);
requireText(content.operation, /four index points|4 index points/i, 'D31 index-point distinction', files.operation);
requireText(content.answerModel, /15%/i, 'answer model 15 percent', files.answerModel);
requireText(content.answerModel, /index 108|`108`/i, 'answer model index 108', files.answerModel);
requireText(content.answerModel, /3\.7%/i, 'answer model 3.7 percent', files.answerModel);
requireText(content.answerModel, /old index `108`|old index 108/i, 'answer model D31 denominator', files.answerModel);
requireText(content.contract, /target_equivalent_exit_ticket/i, 'target-equivalent surface contract', files.contract);
requireText(content.contract, /completionLanguageEligible/i, 'completion language gate flag', files.contract);
requireText(content.contract, /D31 is only mentioned in feedback/i, 'D31 validator rule', files.contract);
requireText(content.state, /completionLanguageEligible/i, 'state completion-language eligibility', files.state);
requireText(content.state, /self-check completion sets proof state/i, 'self-check proof-state prohibition', files.state);
requireText(content.outputPlan, /build-landing-page\.js/i, 'landing copy repair', files.outputPlan);
requireText(content.outputPlan, /Korte check/i, 'Korte check copy blocker', files.outputPlan);
requireText(content.outputPlan, /No Hand Patches/i, 'generated output no hand patches', files.outputPlan);
requireText(content.prep, /teacher-learning-quality/i, 'teacher review requirement', files.prep);
requireText(content.prep, /student-experience/i, 'student review requirement', files.prep);
requireText(content.prep, /lead-review/i, 'lead review requirement', files.prep);
requireText(content.handoff, /Does the exit ticket cover the complete target-exercise operation chain/i, 'gate coverage question', files.handoff);
requireText(content.handoff, /diagnostics/i, 'product boundary in gate handoff', files.handoff);

if (fs.existsSync(path.join(ROOT, 'source-data/book-1/exit-ticket/1.1.2.json'))) {
  fail('source-data/book-1/exit-ticket/1.1.2.json must remain absent during this planning step');
}

statusMustBeClean(
  [
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/data/exam-ingestion/answer-skill-candidates.json',
    'source-data/book-1/exit-ticket',
    'source-data/book-1/reasoning',
  ],
  'protected/source surfaces'
);

const lessonRoot = path.resolve(ROOT, '..', '4veco-lessen');
statusMustBeClean(
  ['Boek 1 - Grondslagen, vraag en aanbod'],
  'generated Book 1 output',
  lessonRoot
);

console.log('OK L1.7B-Q2 plan evidence');
