#!/usr/bin/env node
const fs = require('fs');

function fail(message) {
  console.error(`MATH-REFINE-1 evidence check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function requireText(markdown, pattern, label, file) {
  if (!pattern.test(markdown)) fail(`${file} missing ${label}`);
}

const files = {
  plan: 'reports/sprints/MATH-REFINE-1-plan.md',
  baseline: 'reports/sprints/MATH-REFINE-1-baseline.md',
  planningReview: 'reports/sprints/MATH-REFINE-1-planning-review.md',
  operationPlan: 'reports/sprints/MATH-REFINE-1-operation-chain-plan.md',
  coverage: 'reports/sprints/MATH-REFINE-1-task-coverage-matrix.md',
  implementationPrep: 'reports/sprints/MATH-REFINE-1-implementation-prep.md',
  handoff: 'reports/sprints/MATH-REFINE-1-gate-handoff.md',
};

const content = {};
for (const [key, file] of Object.entries(files)) content[key] = read(file);

requireText(content.operationPlan, /EUR 800.*EUR 920|800.*920/i, 'target percentage-change values', files.operationPlan);
requireText(content.operationPlan, /15%|15 percent/i, '15 percent answer', files.operationPlan);
requireText(content.operationPlan, /EUR 150.*EUR 162|150.*162/i, 'target index values', files.operationPlan);
requireText(content.operationPlan, /162\s*\/\s*150\s*\*\s*100\s*=\s*108|index 108/i, 'index 108 calculation', files.operationPlan);
requireText(content.operationPlan, /108.*112/i, 'index 108 to 112 chain', files.operationPlan);
requireText(content.operationPlan, /3\.7%|3,7%|about `?3\.7%|ongeveer 3,7%/i, '3.7 percent answer', files.operationPlan);
requireText(content.operationPlan, /4 index points|4 indexpunten/i, '4 index-point distinction', files.operationPlan);
requireText(content.operationPlan, /short explanation|constructed-response|short_constructed_response|structured_reasoning/i, 'explicit D31 explanation task', files.operationPlan);
requireText(content.operationPlan, /Current A39 pitfall text.*not enough|pitfall text.*not enough/i, 'A39 pitfall text is insufficient', files.operationPlan);

requireText(content.coverage, /D31/i, 'D31 coverage', files.coverage);
requireText(content.coverage, /Subquestion `d`|subquestion `d`/i, 'subquestion d coverage', files.coverage);
requireText(content.coverage, /blocked/i, 'blocked coverage status', files.coverage);
requireText(content.coverage, /A39 pitfall text.*no explicit short explanation|pitfall text.*not.*checked/i, 'generic pitfall is not proof', files.coverage);
requireText(content.coverage, /short_constructed_response|structured_reasoning/i, 'short explanation family', files.coverage);
requireText(content.coverage, /activeSkills:\s*A38,\s*A39/i, 'current active skill scope', files.coverage);
requireText(content.coverage, /A38,\s*A39,\s*D31/i, 'target skill scope', files.coverage);

requireText(content.implementationPrep, /MATH-REFINE-2/i, 'future implementation route', files.implementationPrep);
requireText(content.implementationPrep, /D31 should be surfaced in the math route/i, 'D31 route ownership decision', files.implementationPrep);
requireText(content.implementationPrep, /calculation-plus-short-explanation/i, 'combined calculation explanation task', files.implementationPrep);
requireText(content.implementationPrep, /validator/i, 'validator upgrade requirements', files.implementationPrep);
requireText(content.implementationPrep, /screenshots|rendered-output/i, 'rendered-output proof requirements', files.implementationPrep);
requireText(content.implementationPrep, /targetEquivalentProof: false/i, 'target equivalent false boundary', files.implementationPrep);

requireText(content.handoff, /GATE-L1\.7B-Q2/i, 'future gate handoff', files.handoff);
requireText(content.handoff, /CHECK-Q2-PLAN/i, 'checkpoint planning handoff', files.handoff);
requireText(content.handoff, /No target-equivalent completion language is authorized/i, 'negative target-equivalent language block', files.handoff);
requireText(content.handoff, /A38.*A39.*D31|A38`, `A39`, and `D31`/i, 'A38 A39 D31 target chain', files.handoff);
requireText(content.handoff, /Scale Gate 1/i, 'Scale Gate boundary', files.handoff);

const all = Object.values(content).join('\n');
const withoutNegativeAuthority = all.replace(/No target-equivalent completion language is authorized/gi, '');
if (/target-equivalent completion language is authorized/i.test(withoutNegativeAuthority)) {
  fail('positive target-equivalent completion-language authority found');
}
for (const prohibited of [
  /authorizes implementation/i,
  /authorizes generated lesson output/i,
  /authorizes target-equivalent completion/i,
  /authorizes diagnostics/i,
  /authorizes Scale Gate 1/i,
  /student\/product use is authorized by this sprint/i,
]) {
  if (prohibited.test(all)) fail(`prohibited authority phrase found: ${prohibited}`);
}

console.log('MATH-REFINE-1 evidence OK');
