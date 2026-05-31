#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`GRAPH-REFINE-1 evidence check failed: ${message}`);
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
  plan: 'reports/sprints/GRAPH-REFINE-1-plan.md',
  baseline: 'reports/sprints/GRAPH-REFINE-1-baseline.md',
  planningReview: 'reports/sprints/GRAPH-REFINE-1-planning-review.md',
  operationPlan: 'reports/sprints/GRAPH-REFINE-1-operation-chain-plan.md',
  coverage: 'reports/sprints/GRAPH-REFINE-1-task-coverage-matrix.md',
  implementationPrep: 'reports/sprints/GRAPH-REFINE-1-implementation-prep.md',
  handoff: 'reports/sprints/GRAPH-REFINE-1-gate-handoff.md',
};

const content = {};
for (const [key, file] of Object.entries(files)) content[key] = read(file);

requireText(content.operationPlan, /price on the vertical axis/i, 'target price vertical wording', files.operationPlan);
requireText(content.operationPlan, /quantity on the horizontal axis/i, 'target quantity horizontal wording', files.operationPlan);
requireText(content.operationPlan, /Prijs staat op de verticale as/i, 'Dutch price vertical wording', files.operationPlan);
requireText(content.operationPlan, /Hoeveelheid .*horizontale as|aantal .*horizontale as/i, 'Dutch quantity horizontal wording', files.operationPlan);
requireText(content.operationPlan, /EUR 1\.75|EUR 1,75/i, 'EUR 1.75 interpolation target', files.operationPlan);
requireText(content.operationPlan, /350 ice creams|350 ijs/i, '350 ice-cream interpolation answer', files.operationPlan);
requireText(content.operationPlan, /EUR 2\.50.*EUR 3\.00|EUR 2,50.*EUR 3,00/i, '50 percent drop price interval', files.operationPlan);

requireText(content.coverage, /blocked/i, 'blocked coverage status', files.coverage);
requireText(content.coverage, /wrong target convention|wrong-axis|contradicts the target convention/i, 'axis mismatch blocker', files.coverage);
requireText(content.coverage, /price.*horizontal|Prijs staat op de horizontale as/i, 'current wrong-axis evidence', files.coverage);
requireText(content.coverage, /Price .*vertical|prijs.*vertical|prijs.*verticale as/i, 'target-aligned axis evidence', files.coverage);
requireText(content.coverage, /50 percent|50 procent|50%/i, '50 percent drop coverage', files.coverage);
requireText(content.coverage, /short_constructed_response|structured_reasoning/i, 'short explanation family', files.coverage);

requireText(content.implementationPrep, /GRAPH-REFINE-2/i, 'future implementation route', files.implementationPrep);
requireText(content.implementationPrep, /must not be used for target-equivalent|not be used for target-equivalent|must not.*target-equivalent/i, 'no target-equivalent use of current wrong-axis route', files.implementationPrep);
requireText(content.implementationPrep, /validator/i, 'validator upgrade requirements', files.implementationPrep);
requireText(content.implementationPrep, /screenshots|rendered-output/i, 'rendered-output proof requirements', files.implementationPrep);

requireText(content.handoff, /GATE-L1\.7B-Q2/i, 'future gate handoff', files.handoff);
requireText(content.handoff, /not yet|not infer|practice evidence only|useful local practice/i, 'practice-only boundary', files.handoff);
requireText(content.handoff, /No target-equivalent completion language is authorized/i, 'negative target-equivalent language block', files.handoff);
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

console.log('GRAPH-REFINE-1 evidence OK');
