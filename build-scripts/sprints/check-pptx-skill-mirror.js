#!/usr/bin/env node
// Retained as a narrow retired-surface guard: PPTX workflow guidance now lives
// in skills/, and .claude/commands must not return as a mirrored command tree.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SOURCE_SKILL = 'skills/econ-pptx-templates.md';
const RETIRED_COMMAND_DIR = '.claude/commands';

function normalizePath(value) {
  return String(value).replace(/\\/g, '/');
}

function collectPresentFiles(root, relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  const files = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
      } else if (entry.isFile()) {
        files.push(normalizePath(path.relative(root, absolute)));
      }
    }
  }
  walk(absoluteDir);
  return files.sort();
}

function gitTrackedFiles(root, relativeDir) {
  try {
    return execFileSync('git', ['ls-files', '--', relativeDir], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(normalizePath)
      .sort();
  } catch (error) {
    return [];
  }
}

function validatePptxSkillMirror(root = path.resolve(__dirname, '..', '..'), options = {}) {
  const sourcePath = path.join(root, SOURCE_SKILL);
  const failures = [];

  if (!fs.existsSync(sourcePath)) {
    failures.push(`missing ${SOURCE_SKILL}`);
    return failures;
  }
  const presentFiles = collectPresentFiles(root, RETIRED_COMMAND_DIR);
  const trackedFiles = options.trackedFiles || gitTrackedFiles(root, RETIRED_COMMAND_DIR);

  if (presentFiles.length > 0) {
    failures.push(`${RETIRED_COMMAND_DIR} is retired but present files remain: ${presentFiles.join(', ')}`);
  }

  if (trackedFiles.length > 0) {
    failures.push(`${RETIRED_COMMAND_DIR} is retired but tracked files remain: ${trackedFiles.join(', ')}`);
  }

  return failures;
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const failures = validatePptxSkillMirror(root);
  if (failures.length) {
    console.error('PPTX retired mirror check failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('OK PPTX skill has no retired command mirror');
}

if (require.main === module) main();

module.exports = {
  validatePptxSkillMirror,
  SOURCE_SKILL,
  RETIRED_COMMAND_DIR,
  collectPresentFiles,
};
