#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`Lead-review substance check failed: ${message}`);
  process.exit(1);
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return null;
  if (!args[index + 1]) fail(`missing value for ${name}`);
  return args[index + 1];
}

function readCommandEntries(jsonlPath, sprintId) {
  if (!fs.existsSync(jsonlPath)) fail(`missing command log: ${jsonlPath}`);
  return fs
    .readFileSync(jsonlPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      let entry;
      try {
        entry = JSON.parse(line);
      } catch (error) {
        fail(`${jsonlPath}:${index + 1} invalid JSON: ${error.message}`);
      }
      if (entry.sprint_id !== sprintId) fail(`${jsonlPath}:${index + 1} wrong sprint_id`);
      return entry;
    });
}

function backtickedPaths(markdown) {
  const matches = markdown.match(/`([^`]+)`/g) || [];
  return matches
    .map((item) => item.slice(1, -1))
    .filter((item) => /^(reports|references|build-scripts|engines|scripts|docs|knowledge|source-data|\.\.\/4veco-lessen)/.test(item));
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${escaped}\\s+([\\s\\S]*?)(?=\\n## |$)`));
  return match ? match[1].trim() : '';
}

function isOnlyPlanningPath(file) {
  return (
    /reference-team-roadmap\.md$/.test(file) ||
    /lessen-team-roadmap\.md$/.test(file) ||
    /-plan\.md$/.test(file) ||
    /-baseline\.md$/.test(file) ||
    /-command-log\.(?:jsonl|md)$/.test(file) ||
    /\.plan\.json$/.test(file)
  );
}

function validateReviewFile(file, sprintId, commandEntries) {
  if (!fs.existsSync(file)) fail(`missing lead-review file: ${file}`);
  const markdown = fs.readFileSync(file, 'utf8');
  if (!/^# Lead Review Summary/m.test(markdown)) fail(`${file} must start with "# Lead Review Summary"`);
  if (!new RegExp(`Sprint:\\s*\`${sprintId}\``).test(markdown)) {
    fail(`${file} must identify Sprint: \`${sprintId}\``);
  }
  const scope = section(markdown, '## Scope');
  if (!/Evidence inspected:/i.test(scope)) fail(`${file} Scope must include Evidence inspected`);
  const paths = backtickedPaths(markdown);
  const outputPaths = paths.filter((item) => !isOnlyPlanningPath(item));
  if (outputPaths.length === 0) {
    fail(`${file} must inspect actual output artifacts, not only plan/baseline/roadmap`);
  }
  for (const outputPath of outputPaths) {
    if (!fs.existsSync(path.resolve(process.cwd(), outputPath))) {
      fail(`${file} cites missing output artifact: ${outputPath}`);
    }
  }
  if (!/command-log|Command Log|exit_code|Acceptance test|Test Evidence/i.test(markdown)) {
    fail(`${file} must cite command-log or executed test evidence`);
  }
  const successfulCommands = new Set(
    commandEntries.filter((entry) => entry.exit_code === 0).map((entry) => entry.command)
  );
  const citesSuccessfulCommand = [...successfulCommands].some((command) => markdown.includes(command));
  const citesCommandLogPath = paths.some((item) => item.endsWith(`${sprintId}-command-log.jsonl`));
  if (!citesSuccessfulCommand && !citesCommandLogPath) {
    fail(`${file} must cite a successful command-log command or the sprint command-log JSONL path`);
  }
}

const args = process.argv.slice(2);
const sprintId = args.find((arg) => !arg.startsWith('--'));
if (!sprintId) fail('missing sprint id');

const commandLogPath =
  optionValue(args, '--command-log-jsonl') ||
  path.join('reports', 'sprints', `${sprintId}-command-log.jsonl`);
const reviewFile = optionValue(args, '--review-file');
const commandEntries = readCommandEntries(commandLogPath, sprintId);

if (reviewFile) {
  validateReviewFile(reviewFile, sprintId, commandEntries);
} else {
  for (const suffix of ['round1', 'round2']) {
    validateReviewFile(path.join('reports', 'sprints', `${sprintId}-lead-review-${suffix}.md`), sprintId, commandEntries);
  }
}

console.log(`OK lead-review substance: ${sprintId}`);
