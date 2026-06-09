#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const FORBIDDEN_TERMS = [
  { label: 'MVP', pattern: /\bMVP\b/gi },
  { label: 'minimal viable product', pattern: /\bminimal\s+viable\s+product\b/gi },
  { label: 'minimum viable product', pattern: /\bminimum\s+viable\s+product\b/gi },
  { label: 'pilot', pattern: /\bpilots?\b/gi },
  { label: 'prototype', pattern: /\bprototypes?\b/gi },
];

const AUTH_HEADING = 'scope language authorization';
const POLICY_HEADINGS = new Set(['scope-language discipline', 'scope language discipline']);
const REQUIRED_AUTH_FIELDS = [
  'Authorized term:',
  'Authorizing source:',
  'Reason the term is necessary:',
  'Quality floor:',
  'Missing full-spec requirements / follow-up:',
];

const DEFAULT_EXCLUDED_PARTS = [
  'archive',
  path.join('docs', 'roadmaps', 'outdated'),
  path.join('reports', 'review-gates'),
  path.join('reports', 'internal-dashboard'),
  path.join('reports', 'json'),
  path.join('reports', 'markdown'),
  'node_modules',
  '.git',
];

function fail(message) {
  console.error(`Scope-language check failed: ${message}`);
  process.exit(1);
}

function toPosix(file) {
  return file.replace(/\\/g, '/');
}

function normalizeHeading(line) {
  const match = line.match(/^##\s+(.+?)\s*$/);
  return match ? match[1].trim().toLowerCase() : null;
}

function isExcluded(file) {
  const parts = path.normalize(file).split(path.sep);
  return DEFAULT_EXCLUDED_PARTS.some((excluded) => {
    const excludedParts = path.normalize(excluded).split(path.sep);
    return excludedParts.every((part, index) => parts[index] === part) ||
      parts.some((part, index) =>
        excludedParts.every((excludedPart, offset) => parts[index + offset] === excludedPart)
      );
  });
}

function maskMarkdownCode(content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return ' '.repeat(line.length);
      }
      if (inFence) return ' '.repeat(line.length);
      return line.replace(/`[^`\n]*`/g, (match) => ' '.repeat(match.length));
    })
    .join('\n');
}

function sectionRanges(lines) {
  const ranges = [];
  let current = { heading: '', start: 0 };
  lines.forEach((line, index) => {
    const heading = normalizeHeading(line);
    if (!heading) return;
    ranges.push({ ...current, end: index });
    current = { heading, start: index };
  });
  ranges.push({ ...current, end: lines.length });
  return ranges;
}

function sectionForLine(ranges, lineIndex) {
  return ranges.find((range) => lineIndex >= range.start && lineIndex < range.end) || ranges[0];
}

function sectionText(lines, section) {
  return lines.slice(section.start, section.end).join('\n');
}

function isPolicySpecSection(displayPath, section) {
  const normalized = toPosix(displayPath).toLowerCase();
  return (
    normalized.endsWith('specifications/companion-core-specifications.md') &&
    POLICY_HEADINGS.has(section.heading)
  );
}

function missingAuthorizationFields(text) {
  return REQUIRED_AUTH_FIELDS.filter((field) => !text.includes(field));
}

function tokenAt(line, index) {
  let start = index;
  while (start > 0 && /[A-Za-z0-9._/\\-]/.test(line[start - 1])) start -= 1;
  let end = index;
  while (end < line.length && /[A-Za-z0-9._/\\-]/.test(line[end])) end += 1;
  return line.slice(start, end);
}

function isPathOrCodeToken(line, index) {
  const token = tokenAt(line, index);
  if (!token) return false;
  if (/[./\\_]/.test(token)) return true;
  if (/^[A-Z]+-\d+/i.test(token)) return true;
  return false;
}

function scanContent({ content, displayPath }) {
  const masked = maskMarkdownCode(content);
  const originalLines = content.split(/\r?\n/);
  const maskedLines = masked.split(/\r?\n/);
  const ranges = sectionRanges(originalLines);
  const findings = [];

  maskedLines.forEach((line, lineIndex) => {
    for (const term of FORBIDDEN_TERMS) {
      term.pattern.lastIndex = 0;
      let match;
      while ((match = term.pattern.exec(line)) !== null) {
        if (isPathOrCodeToken(line, match.index)) continue;
        const section = sectionForLine(ranges, lineIndex);
        if (isPolicySpecSection(displayPath, section)) continue;
        if (section.heading === AUTH_HEADING) {
          const missing = missingAuthorizationFields(sectionText(originalLines, section));
          if (missing.length > 0) {
            findings.push({
              file: displayPath,
              line: lineIndex + 1,
              term: match[0],
              message: `authorization section is missing ${missing.join(', ')}`,
            });
          }
          continue;
        }
        findings.push({
          file: displayPath,
          line: lineIndex + 1,
          term: match[0],
          message:
            'restricted scope language requires a ## Scope Language Authorization section with the required fields',
        });
      }
    }
  });

  return findings;
}

function extractMarkdownTableRows(content, completedValue) {
  return content
    .split(/\r?\n/)
    .filter((line) => {
      if (!line.startsWith('|')) return false;
      const cells = line.split('|').map((cell) => cell.trim());
      return cells.length >= 5 && cells[3].toLowerCase() === completedValue;
    })
    .join('\n');
}

function extractSection(content, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^${escaped}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, 'im'));
  return match ? `${heading}\n${match[1]}` : '';
}

function activeRoadmapContent(file, content) {
  const normalized = toPosix(file).toLowerCase();
  if (normalized.endsWith('lessen-team-roadmap.md')) {
    return [
      '# Active lesson roadmap scope',
      extractMarkdownTableRows(content, 'no'),
      extractSection(content, '## Current Status'),
      extractSection(content, '## Team Guardrails'),
      extractSection(content, '### Next 1 Week'),
      extractSection(content, '### Next 2-4 Weeks'),
      extractSection(content, '### Months 1-3'),
    ].join('\n\n');
  }
  if (normalized.endsWith('references/reference-team-roadmap.md')) {
    return [
      '# Active reference roadmap scope',
      extractSection(content, '## Exam Ingestion North Star'),
      extractMarkdownTableRows(content, 'no'),
    ].join('\n\n');
  }
  if (normalized.endsWith('docs/roadmaps/roadmap-version-index.md')) {
    return extractSection(content, '## Active');
  }
  if (normalized.endsWith('docs/roadmaps/roadmap-version-index.json')) {
    const parsed = JSON.parse(content);
    return JSON.stringify(
      {
        active: parsed.roadmaps ? parsed.roadmaps.filter((item) => item.status === 'active') : parsed.active,
      },
      null,
      2
    );
  }
  return content;
}

function currentOperationalRoadmapFiles(root) {
  const indexPath = path.join(root, 'docs', 'roadmaps', 'roadmap-version-index.json');
  if (!fs.existsSync(indexPath)) return [];
  try {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const files = new Set();
    for (const activePath of index.current_operational_roadmaps || []) {
      files.add(path.join(root, activePath));
    }
    for (const entry of index.roadmaps || []) {
      if (entry && entry.status === 'active' && entry.path) {
        files.add(path.join(root, entry.path));
      }
    }
    return [...files];
  } catch (error) {
    return [];
  }
}

function activeFiles(root) {
  const lessonRoot = path.resolve(root, '..', '4veco-lessen');
  const platformFiles = [
    'AGENTS.md',
    'AGENT_GITHUB_ENTRY.md',
    'RESEARCH_AGENT_MAP.md',
    'BUILD-PARAGRAPH.md',
    'BUILD-CHAPTER.md',
    path.join('build-scripts', 'README.md'),
    path.join('references', 'reference-team-roadmap.md'),
    path.join('docs', 'roadmaps', 'roadmap-version-index.json'),
    path.join('docs', 'roadmaps', 'roadmap-version-index.md'),
    'package.json',
  ].map((file) => path.join(root, file));
  const lessonFiles = [
    'AGENTS.md',
    'AGENT_GITHUB_ENTRY.md',
    'RESEARCH_AGENT_MAP.md',
    'lessen-team-roadmap.md',
    path.join('specifications', 'companion-core-specifications.md'),
    path.join('specifications', 'product-end-state.md'),
  ].map((file) => path.join(lessonRoot, file));
  return [...new Set([...platformFiles, ...currentOperationalRoadmapFiles(root), ...lessonFiles])];
}

function parseArgs(argv) {
  const options = { active: false, root: process.cwd(), files: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--active') {
      options.active = true;
    } else if (arg === '--root') {
      index += 1;
      if (!argv[index]) fail('--root requires a path');
      options.root = path.resolve(argv[index]);
    } else {
      options.files.push(path.resolve(arg));
    }
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const targets = options.active ? activeFiles(options.root) : options.files;
  if (targets.length === 0) fail('missing file path or --active');

  const findings = [];
  for (const target of targets) {
    if (!fs.existsSync(target)) {
      if (options.active) continue;
      fail(`file not found: ${target}`);
    }
    const relative = path.relative(options.root, target);
    if (isExcluded(relative)) continue;
    const raw = fs.readFileSync(target, 'utf8');
    const content = options.active ? activeRoadmapContent(relative, raw) : raw;
    findings.push(
      ...scanContent({
        content,
        displayPath: toPosix(relative),
      })
    );
  }

  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(
        `${finding.file}:${finding.line}: "${finding.term}" - ${finding.message}`
      );
    }
    fail(`${findings.length} unauthorized scope-language occurrence(s) found`);
  }

  console.log(`OK scope-language check: ${options.active ? 'active surfaces' : targets.map(toPosix).join(', ')}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  scanContent,
  activeRoadmapContent,
};
