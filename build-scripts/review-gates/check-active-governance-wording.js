#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ACTIVE_ROOTS = Object.freeze([
  'AGENTS.md',
  'AGENT_GITHUB_ENTRY.md',
  'RESEARCH_AGENT_MAP.md',
  'RESEARCH_AGENT_PROMPT.md',
  'agents',
  'skills',
  'docs/review',
  'build-scripts',
  '.github/workflows',
  '.gitattributes',
  '.gitignore',
  'package.json',
  '../4veco-lessen/AGENTS.md',
  '../4veco-lessen/AGENT_GITHUB_ENTRY.md',
  '../4veco-lessen/RESEARCH_AGENT_MAP.md',
  '../4veco-lessen/RESEARCH_AGENT_PROMPT.md',
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

const TEXT_BASENAMES = new Set([
  '.gitattributes',
  '.gitignore',
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
  'build-scripts/sprints/check-pptx-skill-mirror.js',
  'build-scripts/sprints/check-pptx-skill-mirror.test.js',
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
  {
    id: 'obtain-authorization-exact-head-sha',
    regex: /obtain explicit (human|owner|human\/owner) authorization for the exact head sha/i,
  },
  {
    id: 'do-not-ready-or-merge-until-owner',
    regex: /do not mark ready or merge until owner authorization/i,
  },
  {
    id: 'marking-ready-requires-owner',
    regex: /marking ready still requires owner authorization/i,
  },
  {
    id: 'authorization-exact-platform-lesson-heads',
    regex: /authorization for the exact platform and lesson heads/i,
  },
  {
    id: 'normal-merge-path-permission',
    regex: /\b(normal merge path|use normal merge)\b/i,
  },
  {
    id: 'direct-gh-pr-merge-permission',
    regex: /\b(may|can|should)\s+(?:directly\s+)?(?:call\s+)?`?gh pr merge`?\b/i,
  },
  {
    id: 'cloud-workflow-fallback-direct-merge',
    regex: /(cloud|github-hosted|trusted|authorized-pr-integration)[^\n]{0,120}(workflow|lane)[^\n]{0,120}(fails?|403|cannot read branch protection)[^\n]{0,120}(direct merge|`?gh pr merge`?)/i,
  },
  {
    id: 'activation-required-context-operating-mode',
    regex: /after activation[^\n]{0,120}required contexts? (?:are|is) exactly[^\n]{0,120}integration-authorized/i,
  },
  {
    id: 'activation-direct-merge-operating-mode',
    regex: /after activation[^\n]{0,120}agents must not call `?gh pr merge`? directly/i,
  },
  {
    id: 'activation-auto-merge-operating-mode',
    regex: /activated integration[^\n]{0,120}requires repository `?allow_auto_merge:? ?true`?/i,
  },
  {
    id: 'claude-md-read-first',
    regex: /(read|use|load)[^\n]{0,80}`?(\.\.\/)?CLAUDE\.md`?/i,
  },
  {
    id: 'claude-md-operating-rules',
    regex: /(`?CLAUDE\.md`?[^\n]{0,80}(operating rules|working agreement|policy)|(?:operating rules|working agreement|policy)[^\n]{0,80}`?CLAUDE\.md`?)/i,
  },
  {
    id: 'claude-command-skill-surface',
    regex: /(\.claude\/commands[^\n]{0,80}(skill|workflow|mirror|command)|(?:skill|workflow|mirror|command)[^\n]{0,80}\.claude\/commands)/i,
  },
  {
    id: 'claude-command-path',
    regex: /(^|\s)\.claude\/commands\//i,
  },
  {
    id: 'claude-work-temp-path',
    regex: /\/tmp\/claude-work/i,
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
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase()) ||
    TEXT_BASENAMES.has(path.basename(filePath));
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
  const matchedPatterns = new Set();
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.regex.test(line)) {
        matchedPatterns.add(pattern.id);
        violations.push({
          file: normalizePath(filePath),
          line: index + 1,
          pattern: pattern.id,
          text: line.trim(),
        });
      }
    }
  }
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (matchedPatterns.has(pattern.id)) continue;
    const match = normalized.match(pattern.regex);
    if (match) {
      violations.push({
        file: normalizePath(filePath),
        line: 1,
        pattern: pattern.id,
        text: match[0].trim(),
      });
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
