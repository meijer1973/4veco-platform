#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Update OLD_BLUEPRINT and NEW_BLUEPRINT only when the canonical owned
 *   blueprint path changes through an approved roadmap decision.
 * - This script may edit references/authored/course-target-exercises.json.
 * - Do not extend it to mutate references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TARGET_EXERCISES_PATH = 'references/authored/course-target-exercises.json';
const OLD_BLUEPRINT = 'knowledge/course_blueprint_v4.md';
const NEW_BLUEPRINT = 'references/owned/course-blueprint-v4.md';

function fail(message) {
  console.error(`Target exercise blueprint-ref repair failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function countString(value, needle) {
  return String(value).split(needle).length - 1;
}

function readTargetJson() {
  try {
    return JSON.parse(fs.readFileSync(repoPath(TARGET_EXERCISES_PATH), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${TARGET_EXERCISES_PATH}: ${error.message}`);
  }
}

function mutate(data) {
  let changed = 0;
  if (data.blueprint_source === OLD_BLUEPRINT) {
    data.blueprint_source = NEW_BLUEPRINT;
    changed++;
  }
  for (const exercise of data.exercises || []) {
    if (typeof exercise.source_ref === 'string' && exercise.source_ref.startsWith(OLD_BLUEPRINT)) {
      exercise.source_ref = exercise.source_ref.replace(OLD_BLUEPRINT, NEW_BLUEPRINT);
      changed++;
    }
  }
  return changed;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has('--check');
  const dryRun = args.has('--dry-run');
  const data = readTargetJson();
  const beforeText = JSON.stringify(data);
  const oldBefore = countString(beforeText, OLD_BLUEPRINT);
  const newBefore = countString(beforeText, NEW_BLUEPRINT);
  const changed = mutate(data);
  const afterText = `${JSON.stringify(data, null, 2)}\n`;
  const oldAfter = countString(afterText, OLD_BLUEPRINT);
  const newAfter = countString(afterText, NEW_BLUEPRINT);

  if (checkOnly) {
    if (oldBefore !== 0) {
      fail(`${TARGET_EXERCISES_PATH} contains ${oldBefore} stale references to ${OLD_BLUEPRINT}`);
    }
    if (newBefore < 50) {
      fail(`${TARGET_EXERCISES_PATH} contains only ${newBefore} references to ${NEW_BLUEPRINT}; expected at least 50`);
    }
    console.log(`OK target exercise blueprint refs: ${newBefore} repaired references`);
    return;
  }

  if (dryRun) {
    console.log(`Dry run: ${oldBefore} stale references, ${changed} replacements available, ${oldAfter} stale after mutation, ${newAfter} repaired after mutation`);
    return;
  }

  if (changed === 0 && oldBefore === 0) {
    console.log(`No changes needed: ${newBefore} repaired blueprint references already present`);
    return;
  }
  if (oldAfter !== 0) fail(`mutation would leave ${oldAfter} stale references`);

  fs.writeFileSync(repoPath(TARGET_EXERCISES_PATH), afterText);
  console.log(`Repaired ${changed} blueprint references in ${TARGET_EXERCISES_PATH}`);
  console.log(`New blueprint reference count: ${newAfter}`);
}

if (require.main === module) main();
