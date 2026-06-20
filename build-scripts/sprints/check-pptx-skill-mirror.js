#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SOURCE_SKILL = 'skills/econ-pptx-templates.md';
const COMMAND_MIRROR = '.claude/commands/econ-pptx-templates.md';

function validatePptxSkillMirror(root = path.resolve(__dirname, '..', '..')) {
  const sourcePath = path.join(root, SOURCE_SKILL);
  const mirrorPath = path.join(root, COMMAND_MIRROR);
  const failures = [];

  if (!fs.existsSync(sourcePath)) {
    failures.push(`missing ${SOURCE_SKILL}`);
    return failures;
  }
  if (!fs.existsSync(mirrorPath)) {
    failures.push(`missing ${COMMAND_MIRROR}`);
    return failures;
  }

  const source = fs.readFileSync(sourcePath);
  const mirror = fs.readFileSync(mirrorPath);
  if (!source.equals(mirror)) {
    failures.push(`${COMMAND_MIRROR} must exactly mirror ${SOURCE_SKILL}`);
  }

  return failures;
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const failures = validatePptxSkillMirror(root);
  if (failures.length) {
    console.error('PPTX skill mirror check failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('OK PPTX skill mirror parity');
}

if (require.main === module) main();

module.exports = {
  validatePptxSkillMirror,
  SOURCE_SKILL,
  COMMAND_MIRROR,
};
