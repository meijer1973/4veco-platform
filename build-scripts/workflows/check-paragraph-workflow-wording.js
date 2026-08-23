#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const RULES = Object.freeze([
  {
    file: 'AGENTS.md',
    required: [
      /exactly two operational lanes/i,
      /Paragraph PDFs and `build_pdf\.py` are normal Part A textbook outputs for human review/i,
      /14 files as a validator baseline, not as proof that the full product route is complete/i,
    ],
  },
  {
    file: 'BUILD-PARAGRAPH.md',
    required: [
      /Part A mode it checks textbook source, textbook HTML renders, `build_pdf\.py`, and paragraph PDFs for human review/i,
      /14-file companion baseline[\s\S]{0,240}does not by itself prove the full product route/i,
      /Start -> Leer -> Check -> Oefen -> Exit ticket/i,
      /advisory short check and separate target-equivalent exit ticket/i,
      /Every profile requires `build_pdf\.py` and the type-specific paragraph PDFs for human review/i,
    ],
  },
  {
    file: 'build-scripts/README.md',
    required: [
      /Part A mode it checks textbook source, textbook HTML renders,[\s\S]{0,80}`build_pdf\.py`[\s\S]{0,100}paragraph PDF packet for human review/i,
      /14-file Part B baseline is not proof[\s\S]{0,120}full[\s\S]{0,120}route is complete/i,
      /publisher-print[\s\S]{0,100}Part A chapter\/book print-handoff/i,
    ],
  },
  {
    file: 'build-scripts/templates/textbook-to-companion-handoff.md',
    required: [
      /- build_pdf\.py:/i,
      /Part A paragraph PDF outputs for human review/i,
      /Publisher-print chapter\/book handoff evidence/i,
    ],
  },
  {
    file: 'docs/workflows/legacy-full-companion-profile.md',
    required: [
      /14-file validation baseline[\s\S]{0,100}not the complete product route/i,
      /Start -> Leer -> Check -> Oefen -> Exit ticket/i,
      /advisory short check and the separate target-equivalent exit ticket/i,
      /does not create a third lane/i,
    ],
  },
  {
    file: 'docs/workflows/web-companion-paragraph-lane.md',
    required: [
      /normal companion line is web output plus PPTX/i,
      /14-file `student-web` validator baseline[\s\S]{0,100}not[\s\S]{0,80}full product end state/i,
      /Start -> Leer -> Check -> Oefen -> Exit ticket/i,
      /advisory short check[\s\S]{0,30}a separate target-equivalent exit ticket/i,
    ],
  },
  {
    file: 'agents/econ-companion-visual-review.md',
    required: [
      /14-file baseline is not proof that these product-route surfaces are[\s\S]{0,30}complete/i,
      /Start -> Leer -> Check -> Oefen -> Exit ticket/i,
      /Paragraph[\s\S]{0,20}PDF output and `build_pdf\.py` are normal Part A textbook outputs for human[\s\S]{0,20}review/i,
    ],
  },
]);

const FORBIDDEN = Object.freeze([
  /PDF output belongs to Part A \/ publisher-print unless/i,
  /publisher PDFs only in `--profile publisher-print`/i,
  /No DOCX or textbook PDF requirement/i,
  /PDFs and `build_pdf\.py` are required only under `legacy-full` or `publisher-print`/i,
  /PDF outputs, if publisher-print was in scope/i,
]);

function findRuleFailures(file, text, required, forbidden = FORBIDDEN) {
  const failures = [];
  for (const pattern of required) {
    if (!pattern.test(text)) failures.push(`${file}: missing required wording ${pattern}`);
  }
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${file}: contains stale wording ${pattern}`);
  }
  return failures;
}

function checkParagraphWorkflowWording(options = {}) {
  const root = options.root || path.resolve(__dirname, '..', '..');
  const rules = options.rules || RULES;
  const failures = [];
  for (const rule of rules) {
    const filePath = path.join(root, rule.file);
    if (!fs.existsSync(filePath)) {
      failures.push(`${rule.file}: file missing`);
      continue;
    }
    failures.push(...findRuleFailures(
      rule.file,
      fs.readFileSync(filePath, 'utf8'),
      rule.required,
      rule.forbidden || FORBIDDEN
    ));
  }
  return {
    ok: failures.length === 0,
    files_checked: rules.length,
    failures,
  };
}

function runCli() {
  const result = checkParagraphWorkflowWording();
  console.log(JSON.stringify(result, null, 2));
  return result.ok ? 0 : 1;
}

if (require.main === module) process.exit(runCli());

module.exports = {
  RULES,
  FORBIDDEN,
  findRuleFailures,
  checkParagraphWorkflowWording,
  runCli,
};
