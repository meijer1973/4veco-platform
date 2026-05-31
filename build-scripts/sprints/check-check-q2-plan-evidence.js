#!/usr/bin/env node
const fs = require('fs');
const { spawnSync } = require('child_process');

function fail(message) {
  console.error(`CHECK-Q2-PLAN evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function parseJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
  }
}

function requireText(markdown, pattern, label, file) {
  if (!pattern.test(markdown)) fail(`${file} missing ${label}`);
}

function gitStatusPorcelain(args, label) {
  const result = spawnSync('git', ['status', '--porcelain', '--', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`git status failed for ${label}`);
  }
  const changed = result.stdout.trim();
  if (changed) fail(`${label} has staged, unstaged, or untracked changes:\n${changed}`);
}

function gitStatusPorcelainLessen(args, label) {
  const result = spawnSync('git', ['-C', '..\\4veco-lessen', 'status', '--porcelain', '--', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail(`lesson git status failed for ${label}`);
  }
  const changed = result.stdout.trim();
  if (changed) fail(`${label} has staged, unstaged, or untracked changes:\n${changed}`);
}

const files = {
  plan: 'reports/sprints/CHECK-Q2-PLAN-plan.md',
  baseline: 'reports/sprints/CHECK-Q2-PLAN-baseline.md',
  planningReview: 'reports/sprints/CHECK-Q2-PLAN-planning-review.md',
  shortCheck: 'reports/sprints/CHECK-Q2-PLAN-short-check-boundary.md',
  coverage: 'reports/sprints/CHECK-Q2-PLAN-operation-chain-coverage.md',
  design: 'reports/sprints/CHECK-Q2-PLAN-target-equivalent-design-plan.md',
  implementationPrep: 'reports/sprints/CHECK-Q2-PLAN-implementation-prep.md',
  handoff: 'reports/sprints/CHECK-Q2-PLAN-gate-handoff.md',
  planJson: 'references/data/sprints/CHECK-Q2-PLAN.plan.json',
  exit111: 'source-data/book-1/exit-ticket/1.1.1.json',
  readiness: 'reports/json/skilltree-generator-readiness.json',
};

const content = {};
for (const [key, file] of Object.entries(files)) {
  if (!['planJson', 'exit111', 'readiness'].includes(key)) content[key] = read(file);
}

const planJson = parseJson(files.planJson);
if (!planJson.lead_review_required) fail('plan JSON must require lead review');
if (planJson.authority.implementation_authorized !== false) fail('implementation must be unauthorized');
if (planJson.authority.generated_output_authorized !== false) fail('generated output must be unauthorized');
if (planJson.authority.exit_ticket_source_data_edits_authorized !== false) fail('exit-ticket source edits must be unauthorized');
if (planJson.authority.target_equivalent_claims_authorized !== false) fail('target-equivalent claims must be unauthorized');
if (planJson.authority.paragraph_completion_language_authorized !== false) fail('paragraph completion language must be unauthorized');

requireText(content.planningReview, /PASS WITH FLAGS/i, 'planning review verdict', files.planningReview);
requireText(content.planningReview, /protected-surface command/i, 'protected-surface correction', files.planningReview);
requireText(content.planningReview, /EUR 1\.75.*350/i, 'graph interpolation correction', files.planningReview);

requireText(content.shortCheck, /The short check remains a useful companion surface/i, 'short-check retained decision', files.shortCheck);
requireText(content.shortCheck, /target-equivalent exit ticket is a separate proof task/i, 'separate proof task', files.shortCheck);
requireText(content.shortCheck, /targetReadinessEvidence": false/i, 'targetReadinessEvidence false', files.shortCheck);
requireText(content.shortCheck, /completionLanguageEligible": false/i, 'completion language false', files.shortCheck);
requireText(content.shortCheck, /Korte check|Oefencheck|Adviescheck/i, 'advisory labels', files.shortCheck);
requireText(content.shortCheck, /must not imply[\s\S]*the student has proven the target exercise/i, 'prohibited proof inference', files.shortCheck);

requireText(content.coverage, /No current paragraph has enough reviewed evidence/i, 'no-ready-paragraph summary', files.coverage);
requireText(content.coverage, /`1\.1\.1`[\s\S]*A43/i, '1.1.1 A43 coverage', files.coverage);
requireText(content.coverage, /A98[\s\S]*held `ANS_ANALYSEER_BEOORDEEL`/i, 'A98 versus held evaluation', files.coverage);
requireText(content.coverage, /`1\.1\.2`[\s\S]*D31/i, '1.1.2 D31 coverage', files.coverage);
requireText(content.coverage, /4 index points/i, 'index point trap', files.coverage);
requireText(content.coverage, /`1\.1\.3`[\s\S]*price vertical/i, '1.1.3 price vertical', files.coverage);
requireText(content.coverage, /quantity horizontal/i, '1.1.3 quantity horizontal', files.coverage);
requireText(content.coverage, /EUR 1\.75[\s\S]*350/i, '1.1.3 interpolation target', files.coverage);
requireText(content.coverage, /EUR 2\.50[\s\S]*EUR 3\.00[\s\S]*200[\s\S]*100/i, '1.1.3 50 percent drop interval', files.coverage);
requireText(content.coverage, /A81[\s\S]*underlying answer form/i, 'A81 modifier boundary', files.coverage);
requireText(content.coverage, /A80`, `A81`, and `A96`-`A99` are generator-blocked\/non-interactive/i, 'generator-blocked answer-form units', files.coverage);

requireText(content.design, /target exercise -> operation chain -> answer forms -> task-shell families/i, 'design chain', files.design);
requireText(content.design, /Paragraph Selection Preflight/i, 'paragraph preflight', files.design);
requireText(content.design, /do not treat any of `1\.1\.1`, `1\.1\.2`, or `1\.1\.3` as\s+ready/i, 'no direct ready candidates', files.design);
requireText(content.design, /gateApproved": false/i, 'gate approval false', files.design);
requireText(content.design, /completionLanguageEligible": false/i, 'completion eligibility false', files.design);
requireText(content.design, /Choice tasks[\s\S]*must not\s+replace calculation, graph\/table, or constructed-response actions/i, 'choice-only guard', files.design);

requireText(content.implementationPrep, /1\.1\.1[\s\S]*A43/i, '1.1.1 future repair', files.implementationPrep);
requireText(content.implementationPrep, /1\.1\.2[\s\S]*D31/i, '1.1.2 future repair', files.implementationPrep);
requireText(content.implementationPrep, /1\.1\.3[\s\S]*price vertical/i, '1.1.3 future repair', files.implementationPrep);
requireText(content.implementationPrep, /source-data\/book-1\/exit-ticket\/\*\.json/i, 'source data owner', files.implementationPrep);
requireText(content.implementationPrep, /Validators.*fail|validators must fail/i, 'validator requirements', files.implementationPrep);
requireText(content.implementationPrep, /Rendered-Output Proof/i, 'rendered output proof', files.implementationPrep);
requireText(content.implementationPrep, /teacher-learning/i, 'teacher review', files.implementationPrep);
requireText(content.implementationPrep, /student-experience/i, 'student experience review', files.implementationPrep);
requireText(content.implementationPrep, /accessibility/i, 'accessibility review', files.implementationPrep);

requireText(content.handoff, /L1\.7B-Q2/i, 'L1.7B-Q2 handoff', files.handoff);
requireText(content.handoff, /GATE-L1\.7B-Q2/i, 'GATE-L1.7B-Q2 handoff', files.handoff);
requireText(content.handoff, /No current paragraph has target-equivalent proof/i, 'no current proof flag', files.handoff);
requireText(content.handoff, /No target-equivalent completion language is authorized/i, 'no completion language authorization', files.handoff);
requireText(content.handoff, /Scale Gate 1/i, 'Scale Gate boundary', files.handoff);

const exit111 = parseJson(files.exit111);
if (exit111.title !== 'Korte check') fail('1.1.1 exit ticket must remain Korte check');
if (exit111.metadataAlignment?.targetReadinessEvidence !== false) {
  fail('1.1.1 targetReadinessEvidence must remain false');
}
if (fs.existsSync('source-data/book-1/exit-ticket/1.1.2.json')) fail('1.1.2 exit-ticket source must remain absent');
if (fs.existsSync('source-data/book-1/exit-ticket/1.1.3.json')) fail('1.1.3 exit-ticket source must remain absent');

const readiness = parseJson(files.readiness);
const ids = ['A80', 'A81', 'A96', 'A97', 'A98', 'A99'];
const found = new Map();
function walk(value) {
  if (Array.isArray(value)) {
    value.forEach(walk);
  } else if (value && typeof value === 'object') {
    const id = value.unit_id || value.unitId || value.id;
    if (ids.includes(id) && value.declared_generator) found.set(id, value);
    Object.values(value).forEach(walk);
  }
}
walk(readiness);
for (const id of ids) {
  const row = found.get(id);
  if (!row) fail(`generator readiness missing ${id}`);
  if (row.generator_blocked !== true) fail(`${id} must be generator-blocked`);
  if (row.interactive_skilltree_use_allowed !== false) fail(`${id} interactive use must be blocked`);
  if (row.student_facing_skilltree_use_allowed !== false) fail(`${id} student-facing use must be blocked`);
}

if (fs.existsSync('references/data/exam-ingestion/answer-skill-candidates.json')) {
  fail('answer-skill candidate storage must remain absent');
}

gitStatusPorcelain(
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
gitStatusPorcelainLessen(['Boek 1 - Grondslagen, vraag en aanbod'], 'generated Book 1 output');

const all = Object.values(content).join('\n') + '\n' + JSON.stringify(planJson);
for (const prohibited of [
  /implementation_authorized"\s*:\s*true/i,
  /generated_output_authorized"\s*:\s*true/i,
  /target_equivalent_claims_authorized"\s*:\s*true/i,
  /paragraph_completion_language_authorized"\s*:\s*true/i,
  /student_or_product_use_authorized"\s*:\s*true/i,
]) {
  if (prohibited.test(all)) fail(`prohibited authority flag found: ${prohibited}`);
}

console.log('CHECK-Q2-PLAN evidence OK');
