#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const RAW_PLATFORM_MAIN = 'https://raw.githubusercontent.com/meijer1973/4veco-platform/main/';

const CANONICAL_NAVIGATION_PATHS = Object.freeze([
  'build-scripts/workflows/check-part-a-pdf-readiness.js',
  'build-scripts/workflows/check-paragraph-workflow-wording.js',
  'docs/workflows/legacy-full-companion-profile.md',
  'scripts/lib/paragraph-types.js',
]);

const LEGACY_PROFILE_LINKS = Object.freeze({
  'BUILD-PARAGRAPH.md': 'docs/workflows/legacy-full-companion-profile.md',
  'build-scripts/README.md': '../docs/workflows/legacy-full-companion-profile.md',
  'docs/workflows/web-companion-paragraph-lane.md': 'legacy-full-companion-profile.md',
  'docs/workflows/paragraph-lane-vocabulary.md': 'legacy-full-companion-profile.md',
});

const NAVIGATION_FILES = Object.freeze([
  'RESEARCH_AGENT_MAP.md',
  'AGENT_GITHUB_ENTRY.md',
  'build-scripts/sprints/emit-url-index.js',
  'reports/url-index.md',
  ...Object.keys(LEGACY_PROFILE_LINKS),
]);

// Bounded entry-guide audit, not a general Markdown crawler. Lesson entry is
// opt-in: required platform CI intentionally checks out lesson main.
const ENTRY_LINK_FILES = Object.freeze(['AGENTS.md', 'BUILD-PARAGRAPH.md', 'skills/econ-chapter-builder.md']);
const ACCESS_LINK_FILES = Object.freeze(['RESEARCH_AGENT_MAP.md', 'AGENT_GITHUB_ENTRY.md', 'RESEARCH_AGENT_PROMPT.md']);
const PARAGRAPH_ENTRY_LINK_FILES = Object.freeze(['docs/workflows/part-a-start.md', 'docs/workflows/paired-paragraph-ci.md']);

function markdownAnchors(text) {
  const anchors = new Set();
  const counts = new Map();
  let fence = null;
  for (const line of text.split(/\r?\n/)) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    for (const match of line.matchAll(/<a\s+(?:name|id)=["']([^"']+)["']/gi)) anchors.add(match[1]);
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$/);
    if (!heading) continue;
    const slug = heading[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) || 0;
    counts.set(slug, count + 1);
    anchors.add(count ? `${slug}-${count}` : slug);
  }
  return anchors;
}

function findEntryLinkFailures(root, options = {}) {
  const read = options.read || ((file) => !fs.existsSync(file) ? null
    : fs.statSync(file).isDirectory() ? '' : fs.readFileSync(file, 'utf8'));
  const files = [...ENTRY_LINK_FILES, ...PARAGRAPH_ENTRY_LINK_FILES, ...ACCESS_LINK_FILES, ...(options.includeLessonEntry ? ['AGENTS.md', ...ACCESS_LINK_FILES].map(file => `../4veco-lessen/${file}`) : [])];
  const failures = [];
  for (const file of files) {
    const absolute = path.resolve(root, file);
    const text = read(absolute);
    if (text === null) {
      failures.push(`${file}: entry navigation surface missing`);
      continue;
    }
    const strictGuide = path.basename(file) === 'AGENTS.md' || PARAGRAPH_ENTRY_LINK_FILES.includes(file);
    const guide = strictGuide || ACCESS_LINK_FILES.includes(path.basename(file));
    let incomingSection = false;
    for (const match of text.matchAll(/\[[^\]\r\n]+\]\(([^\s)]+)\)/g)) {
      const href = match[1];
      if (!guide && !/AGENTS\.md#/.test(href)) continue;
      if (!guide) incomingSection = true;
      if (/(?:^|\/)\.\.\/4veco-(?:platform|lessen)\//.test(href)) {
        failures.push(`${file}: cross-repository hyperlink must use an explicit GitHub URL: ${href}`);
        continue;
      }
      let destination = href;
      if (/^https?:/.test(href)) {
        const url = new URL(href);
        const githubPath = url.pathname.match(/^\/meijer1973\/(4veco-platform|4veco-lessen)\/blob\/main\/(.+)$/);
        const rawPath = url.hostname === 'raw.githubusercontent.com' && url.pathname.match(/^\/meijer1973\/(4veco-platform|4veco-lessen)\/main\/(.+)$/);
        if (url.hostname !== 'github.com' || !githubPath) {
          if (!strictGuide && rawPath) {
            destination = `${path.resolve(root, '..', rawPath[1], decodeURIComponent(rawPath[2]))}${url.hash}`;
          } else if (!strictGuide) continue;
          else failures.push(`${file}: unexpected entry-guide GitHub destination: ${href}`);
          if (strictGuide) continue;
        } else destination = `${path.resolve(root, '..', githubPath[1], decodeURIComponent(githubPath[2]))}${url.hash}`;
      }
      const [targetPath, fragment] = destination.split('#');
      if (!guide && !fragment) {
        failures.push(`${file}: linked section fragment is empty: ${href}`);
        continue;
      }
      const target = targetPath ? path.resolve(path.dirname(absolute), targetPath) : absolute;
      const targetText = read(target);
      if (targetText === null) failures.push(`${file}: linked file missing: ${href}`);
      else if (fragment && !markdownAnchors(targetText).has(decodeURIComponent(fragment))) {
        failures.push(`${file}: linked section missing: ${href}`);
      }
    }
    if (!guide && !incomingSection) failures.push(`${file}: missing linked AGENTS.md section guidance`);
  }
  return failures;
}

const RULES = Object.freeze([
  {
    file: 'AGENTS.md',
    required: [
      /exactly two operational lanes/i,
      /\]\(docs\/workflows\/paragraph-lane-vocabulary\.md\)/,
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

function sectionBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) return '';
  const endIndex = end ? text.indexOf(end, startIndex + start.length) : text.length;
  if (end && endIndex === -1) return '';
  return text.slice(startIndex, endIndex);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findNavigationFailures(files) {
  const failures = [];
  const requireValue = (condition, id) => {
    if (!condition) failures.push(id);
  };

  for (const file of NAVIGATION_FILES) {
    requireValue(typeof files[file] === 'string', `${file}: navigation surface missing`);
  }
  if (failures.length > 0) return failures;

  // Maps expose one useful link per contract. Generated inventories own the
  // complete machine listing; repeated JSON, raw URLs and traversal prose add
  // no navigation protection.
  const researchMap = files['RESEARCH_AGENT_MAP.md'];
  for (const canonicalPath of CANONICAL_NAVIGATION_PATHS) {
    requireValue(researchMap.includes(`](${canonicalPath})`),
      `RESEARCH_AGENT_MAP.md: linked contract missing ${canonicalPath}`);
  }
  requireValue(files['AGENT_GITHUB_ENTRY.md'].includes('](RESEARCH_AGENT_MAP.md)'),
    'AGENT_GITHUB_ENTRY.md: map link missing');

  const urlIndexSource = sectionBetween(
    files['build-scripts/sprints/emit-url-index.js'],
    "lines.push('## Repo Operating Rules');",
    "lines.push('## PR Governance');"
  );
  const urlIndex = sectionBetween(
    files['reports/url-index.md'],
    '## Repo Operating Rules',
    '## PR Governance'
  );
  for (const canonicalPath of CANONICAL_NAVIGATION_PATHS) {
    requireValue(
      urlIndexSource.includes(`platform('${canonicalPath}')`),
      `build-scripts/sprints/emit-url-index.js: Repo Operating Rules missing ${canonicalPath}`
    );
    requireValue(
      urlIndex.includes(`- ${RAW_PLATFORM_MAIN}${canonicalPath}`),
      `reports/url-index.md: Repo Operating Rules missing ${canonicalPath}`
    );
  }

  for (const [file, href] of Object.entries(LEGACY_PROFILE_LINKS)) {
    const linkPattern = new RegExp(`\\[[^\\]\\r\\n]+\\]\\(${escapeRegex(href)}\\)`);
    const match = linkPattern.exec(files[file]);
    requireValue(Boolean(match), `${file}: missing relative Markdown link to legacy profile`);
    if (!match) continue;
    const context = files[file].slice(
      Math.max(0, match.index - 120),
      match.index + match[0].length + 240
    );
    requireValue(
      /opt-in\s+Part B[\s\S]*does\s+not\s+create\s+a\s+third\s+lane[\s\S]*does\s+not\s+prove\s+the\s+complete\s+product\s+route/i.test(context),
      `${file}: legacy-profile link is missing two-lane or route context`
    );
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
  const navigationFiles = {};
  for (const file of NAVIGATION_FILES) {
    const filePath = path.join(root, file);
    if (fs.existsSync(filePath)) navigationFiles[file] = fs.readFileSync(filePath, 'utf8');
  }
  failures.push(...findNavigationFailures(navigationFiles));
  failures.push(...findEntryLinkFailures(root, options));
  return {
    ok: failures.length === 0,
    files_checked: new Set([...rules.map((rule) => rule.file), ...NAVIGATION_FILES, ...ENTRY_LINK_FILES, ...PARAGRAPH_ENTRY_LINK_FILES, ...ACCESS_LINK_FILES,
      ...(options.includeLessonEntry ? ['AGENTS.md', ...ACCESS_LINK_FILES].map(file => `../4veco-lessen/${file}`) : [])]).size,
    failures,
  };
}

function runCli() {
  const result = checkParagraphWorkflowWording({ includeLessonEntry: process.argv.includes('--include-lesson-entry') });
  console.log(JSON.stringify(result, null, 2));
  return result.ok ? 0 : 1;
}

if (require.main === module) process.exit(runCli());

module.exports = {
  RULES,
  FORBIDDEN,
  CANONICAL_NAVIGATION_PATHS,
  ACCESS_LINK_FILES,
  LEGACY_PROFILE_LINKS,
  NAVIGATION_FILES,
  ENTRY_LINK_FILES,
  markdownAnchors,
  findEntryLinkFailures,
  findRuleFailures,
  findNavigationFailures,
  checkParagraphWorkflowWording,
  runCli,
};
