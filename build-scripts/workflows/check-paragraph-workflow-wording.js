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

const MAP_ANCHOR_KEYS = Object.freeze({
  'build-scripts/workflows/check-part-a-pdf-readiness.js': 'part_a_pdf_readiness_checker',
  'build-scripts/workflows/check-paragraph-workflow-wording.js': 'paragraph_workflow_wording_checker',
  'docs/workflows/legacy-full-companion-profile.md': 'legacy_full_companion_profile',
  'scripts/lib/paragraph-types.js': 'paragraph_type_contract',
});

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

  const researchMap = files['RESEARCH_AGENT_MAP.md'];
  const entryPoints = sectionBetween(researchMap, '## Entry Points', '## Index Anchors');
  const humanEntryPoints = sectionBetween(entryPoints, 'Human-readable:', 'Machine-readable:');
  const entryPointUrls = sectionBetween(entryPoints, 'entry_points (full URLs):', null);
  const anchors = sectionBetween(researchMap, '## Index Anchors', '## Path Registry');
  const anchorMatch = anchors.match(/```json\s*([\s\S]*?)```/);
  let anchorJson = {};
  try {
    anchorJson = anchorMatch ? JSON.parse(anchorMatch[1]) : {};
  } catch (error) {
    failures.push(`RESEARCH_AGENT_MAP.md: index-anchor JSON is invalid: ${error.message}`);
  }
  const anchorUrls = sectionBetween(anchors, 'index_anchors (full URLs):', null);

  requireValue(
    /check-part-a-pdf-readiness\.js[\s\S]{0,120}Part A surfaces/i.test(humanEntryPoints) &&
      /scripts\/lib\/paragraph-types\.js[\s\S]{0,80}Part A surfaces/i.test(humanEntryPoints),
    'RESEARCH_AGENT_MAP.md: missing Part A navigation ownership wording'
  );
  requireValue(
    /legacy-full-companion-profile\.md[\s\S]{0,80}opt-in Part B profile/i.test(humanEntryPoints),
    'RESEARCH_AGENT_MAP.md: missing opt-in Part B navigation wording'
  );
  requireValue(
    /check-paragraph-workflow-wording\.js[\s\S]{0,80}shared two-lane guardrail/i.test(humanEntryPoints),
    'RESEARCH_AGENT_MAP.md: missing shared two-lane navigation wording'
  );

  for (const canonicalPath of CANONICAL_NAVIGATION_PATHS) {
    const rawUrl = `${RAW_PLATFORM_MAIN}${canonicalPath}`;
    const anchorKey = MAP_ANCHOR_KEYS[canonicalPath];
    requireValue(
      humanEntryPoints.includes(`- \`${canonicalPath}\``),
      `RESEARCH_AGENT_MAP.md: human-readable entry missing ${canonicalPath}`
    );
    requireValue(
      entryPointUrls.includes(`- ${rawUrl}`),
      `RESEARCH_AGENT_MAP.md: entry-point URL missing ${canonicalPath}`
    );
    requireValue(
      anchorJson[anchorKey] === canonicalPath,
      `RESEARCH_AGENT_MAP.md: index-anchor JSON missing ${canonicalPath}`
    );
    requireValue(
      anchorUrls.includes(`- ${rawUrl}`),
      `RESEARCH_AGENT_MAP.md: index-anchor URL missing ${canonicalPath}`
    );
  }

  const githubEntry = files['AGENT_GITHUB_ENTRY.md'];
  const paragraphRouting = githubEntry
    .split(/\r?\n/)
    .find((line) => line.startsWith('| How should paragraph work be split')) || '';
  const usefulEntryPoints = sectionBetween(githubEntry, 'Useful entry points:', 'Task-routing guidance:');
  requireValue(
    /Part A PDF readiness and paragraph-type rules/i.test(paragraphRouting),
    'AGENT_GITHUB_ENTRY.md: routing row missing Part A ownership wording'
  );
  requireValue(
    /Opt-in Part B legacy profile/i.test(paragraphRouting),
    'AGENT_GITHUB_ENTRY.md: routing row missing opt-in Part B wording'
  );
  requireValue(
    /Shared two-lane wording guardrail/i.test(paragraphRouting),
    'AGENT_GITHUB_ENTRY.md: routing row missing shared two-lane wording'
  );
  for (const canonicalPath of CANONICAL_NAVIGATION_PATHS) {
    requireValue(
      paragraphRouting.includes(`\`${canonicalPath}\``),
      `AGENT_GITHUB_ENTRY.md: routing row missing ${canonicalPath}`
    );
    requireValue(
      usefulEntryPoints.includes(`- \`${canonicalPath}\``),
      `AGENT_GITHUB_ENTRY.md: useful entry missing ${canonicalPath}`
    );
  }

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
  return {
    ok: failures.length === 0,
    files_checked: new Set([...rules.map((rule) => rule.file), ...NAVIGATION_FILES]).size,
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
  CANONICAL_NAVIGATION_PATHS,
  MAP_ANCHOR_KEYS,
  LEGACY_PROFILE_LINKS,
  NAVIGATION_FILES,
  findRuleFailures,
  findNavigationFailures,
  checkParagraphWorkflowWording,
  runCli,
};
