#!/usr/bin/env node
const fs = require('fs');

function fail(message) {
  console.error(`REASON-REFINE-1 evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function requireText(markdown, pattern, label, file) {
  if (!pattern.test(markdown)) fail(`${file} missing ${label}`);
}

function parseJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
  }
}

const files = {
  plan: 'reports/sprints/REASON-REFINE-1-plan.md',
  baseline: 'reports/sprints/REASON-REFINE-1-baseline.md',
  planningReview: 'reports/sprints/REASON-REFINE-1-planning-review.md',
  integration: 'reports/sprints/REASON-REFINE-1-answer-form-integration-plan.md',
  coverage: 'reports/sprints/REASON-REFINE-1-task-coverage-matrix.md',
  implementationPrep: 'reports/sprints/REASON-REFINE-1-implementation-prep.md',
  handoff: 'reports/sprints/REASON-REFINE-1-gate-handoff.md',
  planJson: 'references/data/sprints/REASON-REFINE-1.plan.json',
  readiness: 'reports/json/skilltree-generator-readiness.json',
};

const content = {};
for (const [key, file] of Object.entries(files)) {
  if (key !== 'planJson' && key !== 'readiness') content[key] = read(file);
}

const planJson = parseJson(files.planJson);
if (!planJson.lead_review_required) fail('plan JSON must require lead review');
if (planJson.authority.implementation_authorized !== false) fail('implementation must be unauthorized in plan JSON');
if (planJson.authority.generated_output_authorized !== false) fail('generated output must be unauthorized in plan JSON');
if (planJson.authority.target_equivalent_claims_authorized !== false) fail('target-equivalent claims must be unauthorized in plan JSON');

requireText(content.planningReview, /PASS WITH FLAGS/i, 'planning-review verdict', files.planningReview);
requireText(content.planningReview, /generator-blocked\/non-interactive status/i, 'generator-blocked checker flag', files.planningReview);
requireText(content.planningReview, /agent:index.*emit-url-index.*dashboard:internal/s, 'repository-publication flag', files.planningReview);

requireText(content.integration, /structured_reasoning/i, 'structured reasoning task family', files.integration);
requireText(content.integration, /ANS_LEG_UIT_DAT[\s\S]*A97/i, 'A97 leg-uit-dat lane', files.integration);
requireText(content.integration, /ANS_LEG_UIT_OF[\s\S]*A98/i, 'A98 leg-uit-of lane', files.integration);
requireText(content.integration, /ANS_LEG_UIT_MET_VOORBEELD[\s\S]*A99/i, 'A99 example lane', files.integration);
requireText(content.integration, /ANS_BRON_GEBRUIKEN[\s\S]*A81/i, 'A81 source-use lane', files.integration);
requireText(content.integration, /A81.*never be a complete answer by itself|A81.*never standalone/i, 'A81 not standalone', files.integration);
requireText(content.integration, /A81 \+ A97|A81 \+ A98|A81 \+ A96/i, 'A81 combined with underlying answer form', files.integration);
requireText(content.integration, /ANS_ANALYSEER_BEOORDEEL.*held/i, 'analysis evaluation held lane', files.integration);
requireText(content.integration, /ANS_MOTIVEER_CLASSIFICATIE|Type 4/i, 'Type 4 held lane', files.integration);
requireText(content.integration, /q3\/q15 EX answer-skill overlays remain visible as no-write/i, 'EX no-write overlay boundary', files.integration);
requireText(content.integration, /No target-equivalent completion language is authorized/i, 'no target-equivalent language block', files.integration);

requireText(content.coverage, /`1\.1\.1`|1\.1\.1/i, '1.1.1 coverage', files.coverage);
requireText(content.coverage, /`1\.1\.2`|1\.1\.2/i, '1.1.2 coverage', files.coverage);
requireText(content.coverage, /`1\.1\.3`|1\.1\.3/i, '1.1.3 coverage', files.coverage);
requireText(content.coverage, /A98.*held `ANS_ANALYSEER_BEOORDEEL`|held evaluation/i, '1.1.1 A98 versus held evaluation decision', files.coverage);
requireText(content.coverage, /D31/i, 'D31 coverage', files.coverage);
requireText(content.coverage, /4 index points|4 indexpunten|4 percent/i, 'index-point trap', files.coverage);
requireText(content.coverage, /GRAPH-REFINE-1.*graph-axis blocker|graph-axis target-chain blocker/i, 'graph-axis blocker', files.coverage);
requireText(content.coverage, /Generic self-check is not answer-form proof/i, 'generic self-check gap', files.coverage);
requireText(content.coverage, /A81.*underlying answer form/i, 'A81 modifier boundary in coverage', files.coverage);
requireText(content.coverage, /Target-equivalent exit-ticket proof[\s\S]*blocked/i, 'target-equivalent proof blocked', files.coverage);

requireText(content.implementationPrep, /REASON-REFINE-2|equivalent separately authorized implementation plan/i, 'future implementation route', files.implementationPrep);
requireText(content.implementationPrep, /source-data\/book-1\/reasoning\/\*\.csv/i, 'reasoning CSV ownership', files.implementationPrep);
requireText(content.implementationPrep, /build-reasoning-questions\.js/i, 'reasoning builder ownership', files.implementationPrep);
requireText(content.implementationPrep, /engines\/reasoning-engine\.js/i, 'reasoning engine ownership', files.implementationPrep);
requireText(content.implementationPrep, /validator/i, 'validator upgrade requirements', files.implementationPrep);
requireText(content.implementationPrep, /rendered-output proof/i, 'rendered-output proof requirements', files.implementationPrep);
requireText(content.implementationPrep, /targetEquivalentProof: false/i, 'target equivalent false boundary', files.implementationPrep);
requireText(content.implementationPrep, /generator-blocked `A80`, `A81`, or `A96`-`A99`|A80`, `A81`, and `A96`-`A99`/i, 'generator-blocked guardrail', files.implementationPrep);

requireText(content.handoff, /CHECK-Q2-PLAN/i, 'CHECK-Q2-PLAN handoff', files.handoff);
requireText(content.handoff, /GATE-L1\.7B-Q2/i, 'GATE-L1.7B-Q2 handoff', files.handoff);
requireText(content.handoff, /No target-equivalent completion language is authorized/i, 'negative target-equivalent language block', files.handoff);
requireText(content.handoff, /A97/i, 'A97 handoff', files.handoff);
requireText(content.handoff, /A98/i, 'A98 handoff', files.handoff);
requireText(content.handoff, /A81/i, 'A81 handoff', files.handoff);
requireText(content.handoff, /Scale Gate 1/i, 'Scale Gate boundary', files.handoff);

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
  if (row.generator_implemented !== false) fail(`${id} generator must not be implemented for this planning sprint`);
  if (row.generator_blocked !== true) fail(`${id} must be generator-blocked`);
  if (row.interactive_skilltree_use_allowed !== false) fail(`${id} interactive skilltree use must be blocked`);
  if (row.student_facing_skilltree_use_allowed !== false) fail(`${id} student-facing skilltree use must be blocked`);
}

if (fs.existsSync('references/data/exam-ingestion/answer-skill-candidates.json')) {
  fail('answer-skill candidate storage must remain absent');
}

const all = Object.values(content).join('\n') + '\n' + JSON.stringify(planJson);
const allowedNegative = all
  .replace(/No target-equivalent completion language is authorized/gi, '')
  .replace(/No implementation, generated output,[\s\S]*?student\/product use is authorized\./gi, '')
  .replace(/This file does not authorize implementation/gi, '')
  .replace(/does not authorize `REASON-REFINE-2`/gi, '')
  .replace(/does not authorize target-equivalent claims/gi, '');

for (const prohibited of [
  /implementation_authorized"\s*:\s*true/i,
  /generated_output_authorized"\s*:\s*true/i,
  /target_equivalent_claims_authorized"\s*:\s*true/i,
  /student_or_product_use_authorized"\s*:\s*true/i,
  /target-equivalent completion language is authorized/i,
  /student\/product use is authorized/i,
]) {
  if (prohibited.test(allowedNegative)) fail(`prohibited authority phrase found: ${prohibited}`);
}

console.log('REASON-REFINE-1 evidence OK');
