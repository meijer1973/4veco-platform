#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ACTIVE_ROOTS = Object.freeze([
  'AGENTS.md',
  'AGENT_GITHUB_ENTRY.md',
  'agents',
  'docs/review',
  'build-scripts',
  '.github/workflows',
  'package.json',
]);

const TEXT_EXTENSIONS = new Set([
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.txt',
  '.yaml',
  '.yml',
]);

const EXCLUDED_SEGMENTS = new Set([
  '.git',
  'node_modules',
  'reports',
  'archive',
  'archives',
  'archived',
  'outdated',
  'coverage',
  'dist',
]);

const EXCLUDED_FILES = new Set([
  'build-scripts/review-gates/check-active-governance-wording.js',
  'build-scripts/review-gates/check-active-governance-wording.test.js',
]);

const FORBIDDEN_PATTERNS = Object.freeze([
  {
    id: 'owner-authorization-before-ready',
    regex: /owner authorization required before marking ready/i,
  },
  {
    id: 'do-not-mark-ready-without-owner',
    regex: /do not mark ready without owner authorization/i,
  },
  {
    id: 'human-authorization-every-integration-head',
    regex: /human authorization tied to every exact integration head/i,
  },
  {
    id: 'owner-approval-tied-to-exact-head',
    regex: /(owner|human|explicit owner)[^\n]{0,80}(approval|authorization)[^\n]{0,80}tied to (the )?exact (pr |remote )?head/i,
  },
  {
    id: 'owner-approval-tied-to-exact-sha',
    regex: /(owner|human|explicit owner)[^\n]{0,80}(approval|authorization)[^\n]{0,80}tied to (the )?exact sha/i,
  },
  {
    id: 'human-decision-exact-head-sha',
    regex: /human (merge )?decision must identify the pr number, exact head sha/i,
  },
  {
    id: 'merge-decision-exact-pr-head',
    regex: /(owner )?merge decision tied to the exact pr head/i,
  },
  {
    id: 'owner-authorization-exact-sha-field',
    regex: /owner_authorization_exact_sha/i,
  },
  {
    id: 'exact-head-human-merge',
    regex: /exact-head human merge/i,
  },
]);

function normalizePath(filePath) {
  return String(filePath).replace(/\\/g, '/');
}

function relativePath(filePath, cwd = process.cwd()) {
  return normalizePath(path.relative(cwd, filePath) || filePath);
}

function shouldExcludePath(filePath, cwd = process.cwd()) {
  const normalized = normalizePath(path.isAbsolute(filePath) ? path.relative(cwd, filePath) : filePath);
  if (EXCLUDED_FILES.has(normalized)) return true;
  return normalized
    .split('/')
    .filter(Boolean)
    .some((segment) => EXCLUDED_SEGMENTS.has(segment.toLowerCase()));
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function collectFilesFromRoot(root, cwd = process.cwd()) {
  const absolute = path.resolve(cwd, root);
  if (!fs.existsSync(absolute)) return [];
  const stats = fs.statSync(absolute);
  if (stats.isFile()) return isTextFile(absolute) && !shouldExcludePath(absolute, cwd) ? [absolute] : [];
  if (!stats.isDirectory() || shouldExcludePath(absolute, cwd)) return [];

  const files = [];
  for (const entry of fs.readdirSync(absolute)) {
    files.push(...collectFilesFromRoot(path.join(path.relative(cwd, absolute), entry), cwd));
  }
  return files;
}

function collectActiveFiles(roots = ACTIVE_ROOTS, cwd = process.cwd()) {
  return roots.flatMap((root) => collectFilesFromRoot(root, cwd));
}

function findViolationsInText(filePath, text) {
  const violations = [];
  const lines = String(text).split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.regex.test(line)) {
        violations.push({
          file: normalizePath(filePath),
          line: index + 1,
          pattern: pattern.id,
          text: line.trim(),
        });
      }
    }
  }
  return violations;
}

function scanFiles(files, options = {}) {
  const cwd = options.cwd || process.cwd();
  const violations = [];
  for (const entry of files) {
    const filePath = typeof entry === 'string' ? entry : entry.path;
    if (shouldExcludePath(filePath, cwd)) continue;
    const text = typeof entry === 'string' ? fs.readFileSync(entry, 'utf8') : entry.text;
    violations.push(...findViolationsInText(relativePath(filePath, cwd), text));
  }
  return violations;
}

function scanActiveGovernanceWording(options = {}) {
  const cwd = options.cwd || process.cwd();
  const roots = options.roots || ACTIVE_ROOTS;
  return scanFiles(collectActiveFiles(roots, cwd), { cwd });
}

function optionValues(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === name) values.push(args[index + 1]);
  }
  return values.filter(Boolean);
}

function runCli(argv) {
  const roots = optionValues(argv, '--root');
  const violations = scanActiveGovernanceWording({ roots: roots.length > 0 ? roots : ACTIVE_ROOTS });
  if (violations.length === 0) {
    process.stdout.write('Active governance wording check passed.\n');
    return;
  }
  process.stderr.write('Active governance wording check failed:\n');
  for (const violation of violations) {
    process.stderr.write(
      `- ${violation.file}:${violation.line} [${violation.pattern}] ${violation.text}\n`
    );
  }
  process.exit(1);
}

if (require.main === module) {
  runCli(process.argv.slice(2));
}

module.exports = {
  collectActiveFiles,
  findViolationsInText,
  scanActiveGovernanceWording,
  scanFiles,
  shouldExcludePath,
};
