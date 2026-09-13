#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { markdownAnchors } = require('./check-paragraph-workflow-wording');

const ROOT = path.resolve(__dirname, '..', '..');

const ACTIVE_SURFACES = Object.freeze([
  'references/authored/didactiek-principes.md',
  'references/authored/vraagtypen-en-opgaveontwerp.md',
  'skills/econ-exercise-builder.md',
  'skills/econ-textbook-paragraph.md',
  'skills/econ-didactiek.md',
  'skills/econ-paragraph-review.md',
  'skills/econ-pdf-builder.md',
  'agents/teacher-learning-quality-review-agent.md',
  'BUILD-PARAGRAPH.md',
  'docs/workflows/textbook-paragraph-lane.md',
]);

const SUPPORTING_SURFACES = Object.freeze([
  'package.json',
  '.github/workflows/platform-ci.yml',
  'RESEARCH_AGENT_MAP.md',
  'AGENT_GITHUB_ENTRY.md',
  'build-scripts/sprints/emit-url-index.js',
  'reports/url-index.md',
  'docs/workflows/part-a-review.md',
  'skills/economic-graph.md',
]);

const CANONICAL_HEADINGS = Object.freeze([
  'Uitgewerkt voorbeeld',
  'Startopgaven',
  'Begeleide inoefening',
  'Zelfstandige oefening',
  'Doeloefening',
  'Denkertje / Bonusopgave',
  'Herhaling / Herhaling en interleaving',
]);

const CHECKER_PATH = 'build-scripts/workflows/check-part-a-exercise-authoring-contract.js';
const TEST_PATH = 'build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js';

function normalizeSourceText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function readFiles(root = ROOT) {
  return Object.fromEntries(
    [...ACTIVE_SURFACES, ...SUPPORTING_SURFACES].map((file) => [
      file,
      normalizeSourceText(fs.readFileSync(path.join(root, file), 'utf8')),
    ])
  );
}

function requirePattern(failures, files, file, pattern, message) {
  const text = files[file];
  if (typeof text !== 'string') {
    failures.push(`${file}: source missing from checker input`);
  } else if (!pattern.test(text)) {
    failures.push(`${file}: ${message}`);
  }
}

function firstCodeBlockAfter(text, marker) {
  const markerIndex = text.indexOf(marker);
  if (markerIndex === -1) return '';
  const blockStart = text.indexOf('```', markerIndex);
  if (blockStart === -1) return '';
  const contentStart = text.indexOf('\n', blockStart);
  const blockEnd = text.indexOf('```', contentStart + 1);
  if (contentStart === -1 || blockEnd === -1) return '';
  return text.slice(contentStart + 1, blockEnd);
}

function markdownHeadings(block) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,6})\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => ({ level: match[1].length, title: match[2].trim() }));
}

function markdownLevelTwoHeadings(block) {
  return markdownHeadings(block)
    .filter((heading) => heading.level === 2)
    .map((heading) => heading.title);
}

function requireExactTemplateHeadings(failures, files, file, marker) {
  const text = files[file] || '';
  const actual = markdownLevelTwoHeadings(firstCodeBlockAfter(text, marker));
  if (JSON.stringify(actual) !== JSON.stringify(CANONICAL_HEADINGS)) {
    failures.push(
      `${file}: operational template must contain exactly the seven top-level headings with no extra/intervening heading`
    );
  }
}

function findPrintedTemplateFailures(files) {
  const failures = [];
  const file = 'skills/econ-exercise-builder.md';
  const text = files[file] || '';
  const template = firstCodeBlockAfter(text, '### 7.1 exercises.md structure');
  const workedIndex = template.indexOf('## Uitgewerkt voorbeeld');
  const summaryIndex = template.indexOf('> **Samenvatting §X.Y.Z**');
  const startIndex = template.indexOf('## Startopgaven');

  if (!(workedIndex !== -1 && summaryIndex > workedIndex && startIndex > summaryIndex)) {
    failures.push(`${file}: compact non-heading summary must follow the worked example and precede Startopgaven`);
  }
  if (/^##\s+Samenvatting\b/im.test(template)) {
    failures.push(`${file}: summary must not become an eighth top-level heading`);
  }
  if (!/\*\*Korte route:\*\* Startopgaven → Zelfstandige oefening → Doeloefening\./.test(template)) {
    failures.push(`${file}: paper short-route note missing from printed template`);
  }
  if (!/\*\*Extra hulp nodig\?\*\* Maak eerst Begeleide inoefening\./.test(template)) {
    failures.push(`${file}: paper support note missing from printed template`);
  }
  if (/\b(?:Part A|Part B|lane|companion route|repository)\b/i.test(template)) {
    failures.push(`${file}: printed template exposes internal architecture terminology`);
  }
  const forbiddenPrintedDigitalSupport =
    /\b(?:website|online|laptop|phone|tablet|telefoon|smartphone|computer|internet|app|companion page|digital support|digitale uitleg|digitaal hulpmiddel)\b|\bQR[-\s]?code\b|\bscan\s+de\s+(?:QR[-\s]?code|code)\b/i;
  if (forbiddenPrintedDigitalSupport.test(template)) {
    failures.push(`${file}: printed template depends on or advertises digital support`);
  }

  const obsoletePermission = /Vastgelopen\?|website-help pointer|website help (?:exists|is available)|Part B pointer inside Startopgaven|subordinate[^\n]{0,80}Part B pointer/i;
  for (const activeFile of ACTIVE_SURFACES) {
    if (obsoletePermission.test(files[activeFile] || '')) {
      failures.push(`${activeFile}: obsolete printed website/Part B help permission remains active`);
    }
  }
  return failures;
}

function findContradictoryAuthoringFailures(files) {
  const failures = [];
  const builder = files['skills/econ-exercise-builder.md'] || '';
  if (
    /if guided practice is (?:useful|needed|appropriate)/i.test(builder) ||
    /authors? may (?:omit|skip)[^\n]{0,100}Begeleide inoefening/i.test(builder) ||
    /Begeleide inoefening[^\n]{0,100}optional for (?:the )?author/i.test(builder)
  ) {
    failures.push(
      'skills/econ-exercise-builder.md: author-side guided-practice omission permission contradicts required printed support'
    );
  }

  const unconditionalProduction = [
    /\b(?:must|always)\b[^\n]{0,140}\b(?:draw|produce|construct)\b[^\n]{0,80}\b(?:graph|table)\b/i,
    /\bdraws?\s+(?:their\s+)?own\s+(?:graph|table)\b/i,
    /\b(?:graph|table) production\b[^\n]{0,140}\b(?:regardless of|even (?:if|when)|whether or not)\b[^\n]{0,100}\btarget/i,
  ];
  const unconditionalVisualRemoval = [
    /\bdoelniveau\b[^\n]{0,80}\bzonder dual coding\b[^\n]{0,40}\balleen tekst\b/i,
    /\btarget-level\b[^\n]{0,80}\bwithout dual coding\b[^\n]{0,40}\btext only\b/i,
    /\b(?:visual|visueel)\s*(?:→|->)\s*(?:visual|visueel)\s*(?:→|->)\s*(?:no visual|geen beeld|zonder visueel)\b/i,
    /\b(?:must|always)\b[^\n]{0,100}\bremove\b[^\n]{0,60}\b(?:visual|graph|table|representation)\b/i,
  ];
  // Contradictions remain invalid in callers even when the positive rule lives
  // only in the exercise owner. Do not require artificial section markers.
  for (const file of ACTIVE_SURFACES) {
    const text = files[file] || '';
    if (unconditionalProduction.some((pattern) => pattern.test(text))) {
      failures.push(`${file}: target-absent graph/table production permission remains active`);
    }
    if (unconditionalVisualRemoval.some((pattern) => pattern.test(text))) {
      failures.push(`${file}: target-misaligned unconditional visual-removal instruction remains active`);
    }
  }
  return failures;
}

function findRouteBoundaryFailures(files) {
  const failures = [];
  const route = /Start\s*(?:->|→)\s*Leer\s*(?:->|→)\s*Check\s*(?:->|→)\s*Oefen\s*(?:->|→)\s*Exit ticket/gi;
  for (const file of ACTIVE_SURFACES) {
    const text = files[file] || '';
    for (const match of text.matchAll(route)) {
      if (file === 'BUILD-PARAGRAPH.md') {
        if (!/This Part B route is not the printed Part A exercise sequence/i.test(text)) {
          failures.push(`${file}: companion route is not explicitly bounded to Part B`);
        }
        continue;
      }
      const start = Math.max(0, match.index - 400);
      const end = Math.min(text.length, match.index + match[0].length + 400);
      if (!/Part B|companion route|different product contract/i.test(text.slice(start, end))) {
        failures.push(`${file}: companion route is not explicitly bounded to Part B`);
      }
    }
    route.lastIndex = 0;
  }
  return failures;
}

const CONTRACT_LINKS = Object.freeze([
  ...[
    'skills/econ-textbook-paragraph.md',
    'skills/econ-didactiek.md',
    'skills/econ-paragraph-review.md',
    'skills/econ-pdf-builder.md',
    'agents/teacher-learning-quality-review-agent.md',
    'BUILD-PARAGRAPH.md',
    'docs/workflows/textbook-paragraph-lane.md',
  ].map((file) => [file, 'skills/econ-exercise-builder.md']),
  ['references/authored/vraagtypen-en-opgaveontwerp.md', 'skills/econ-exercise-builder.md'],
  ['references/authored/didactiek-principes.md', 'skills/economic-graph.md'],
  ['references/authored/didactiek-principes.md', 'docs/workflows/part-a-review.md'],
  ...['skills/econ-textbook-paragraph.md', 'skills/econ-exercise-builder.md', 'skills/econ-paragraph-review.md']
    .flatMap((file) => [[file, 'skills/economic-graph.md'], [file, 'docs/workflows/part-a-review.md']]),
]);

function findContractLinkFailures(files) {
  const failures = [];
  for (const [file, owner] of CONTRACT_LINKS) {
    const text = files[file];
    const target = files[owner];
    if (typeof text !== 'string' || typeof target !== 'string') {
      failures.push(`${file}: contract source or owner missing: ${owner}`);
      continue;
    }
    const links = [...text.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)];
    let found = false;
    for (const [, href] of links) {
      const [destination, fragment] = href.split('#');
      if (path.posix.normalize(path.posix.join(path.posix.dirname(file), destination)) !== owner) continue;
      if (fragment !== undefined && (!fragment || !markdownAnchors(target).has(fragment))) {
        failures.push(`${file}: contract link has missing or empty anchor: ${href}`);
      } else {
        found = true;
      }
    }
    if (!found) failures.push(`${file}: link to canonical contract missing: ${owner}`);
  }
  return failures;
}

function findContractFailures(files, options = {}) {
  const failures = [];
  const activeSurfaces = options.activeSurfaces || ACTIVE_SURFACES;

  for (const file of activeSurfaces) {
    if (/4veco-lessen|(?:^|[\\/])book[-_ ]?1(?:[\\/]|$)/i.test(file)) {
      failures.push(`${file}: checker scope must remain platform-source-only and non-retroactive`);
    }
  }

  for (const file of ACTIVE_SURFACES) {
    if (/startoefeningen?/i.test(files[file] || '')) {
      failures.push(`${file}: legacy Startoefening/Startoefeningen guidance remains active`);
    }
    if (/exercise set fits? 40[–-]60|min(?:ute)?s? of student work.{0,40}40[–-]60/i.test(files[file] || '')) {
      failures.push(`${file}: stale 40–60-minute exercise-set timing rule remains active`);
    }
  }

  // The printed template is the single operational heading definition.
  requireExactTemplateHeadings(failures, files, 'skills/econ-exercise-builder.md', '### 7.1 exercises.md structure');
  failures.push(...findContractLinkFailures(files));

  const rules = [
    ['references/authored/didactiek-principes.md', /lesson goals\s*->\s*doeloefening\s*->\s*target operations/i, 'backward-design chain missing'],
    ['references/authored/didactiek-principes.md', /prerequisites that have already been taught/i, 'Startopgaven prerequisite-retrieval safeguard missing'],
    ['references/authored/didactiek-principes.md', /current-content comprehension check/i, 'Startopgaven current-content check missing'],
    ['references/authored/didactiek-principes.md', /not a mastery test, diagnosis, or automatic routing mechanism/i, 'Start check overclaim prohibition missing'],
    ['references/authored/didactiek-principes.md', /Book 1 output is frozen/i, 'Book 1 freeze missing'],
    ['references/authored/didactiek-principes.md', /no new theory/i, 'closing-review no-new-theory rule missing'],
    ['references/authored/vraagtypen-en-opgaveontwerp.md', /not a competing source for paragraph exercise sequence/i, 'question-reference authority boundary missing'],
    ['references/authored/vraagtypen-en-opgaveontwerp.md', /skills\/econ-exercise-builder\.md[\s\S]{0,120}owns the operational seven-section sequence/i, 'operational source pointer missing'],
    ['skills/econ-exercise-builder.md', /Lesson goal\s*\|\s*Target subquestion\/operation\s*\|\s*Worked example\s*\|\s*Start check\s*\|\s*Guided practice\s*\|\s*Independent practice\s*\|\s*Covered\/gap/i, 'required alignment table missing'],
    ['skills/econ-exercise-builder.md', /(?:same|exact target) operation chain[\s\S]{0,180}no operation absent from the target or lesson goals/i, 'worked-example operation constraint missing'],
    ['skills/econ-exercise-builder.md', /retrieval of prerequisites already taught/i, 'Startopgaven retrieval role missing'],
    ['skills/econ-exercise-builder.md', /compact check of\s+current-content comprehension/i, 'Startopgaven comprehension role missing'],
    ['skills/econ-exercise-builder.md', /do not[\s\S]{0,80}mastery, diagnosis,[\s\S]{0,80}automatic routing/i, 'Start check overclaim prohibition missing'],
    ['skills/econ-exercise-builder.md', /Begeleide inoefening[\s\S]{0,80}optional[\s\S]{0,160}deliberately fades/i, 'optional guided/fading rule missing'],
    ['skills/econ-exercise-builder.md', /Heb je deze hulp niet nodig\? Ga dan verder met\s+Zelfstandige oefening\./i, 'neutral guided skip wording missing'],
    ['skills/econ-exercise-builder.md', /Korte route:\*\*?\s*Startopgaven\s*→\s*Zelfstandige oefening\s*→\s*Doeloefening/i, 'core route note missing'],
    ['skills/econ-exercise-builder.md', /Extra hulp nodig\?\*\*?\s*Maak eerst Begeleide inoefening/i, 'paper support note missing'],
    ['skills/econ-exercise-builder.md', /motivation \+ instruction \+ worked example \+ compact summary and transitions \+[\s\S]{0,180}planned lesson minutes <= 55/i, 'whole-lesson timing equation missing'],
    ['skills/econ-exercise-builder.md', /ranges below are recommendations, not proof by themselves/i, 'range-sum-is-not-proof safeguard missing'],
    ['skills/econ-exercise-builder.md', /prerequisite-retrieval task is\s+normally 3[–-]5 minutes/i, 'Start retrieval 3–5-minute norm missing'],
    ['skills/econ-exercise-builder.md', /teacher may assign that printed retrieval task at\s+the beginning of the lesson[\s\S]{0,160}does not change the\s+printed/i, 'classroom-order/printed-order clarification missing'],
    ['skills/econ-exercise-builder.md', /may not expand into adjacent\s+content or hide enrichment inside the core route/i, 'independent-practice scope boundary missing'],
    ['skills/econ-exercise-builder.md', /Light\s+adaptation is allowed only where the blueprint or responsible owner\s+authorizes it[\s\S]{0,160}preserve every target operation/i, 'authorized target-adaptation rule missing'],
    ['skills/econ-exercise-builder.md', /cognitive flexibility[\s\S]{0,180}not more or longer arithmetic/i, 'bonus cognitive-flexibility rule missing'],
    ['skills/econ-exercise-builder.md', /1[–-]2 short, accessible[\s\S]{0,120}introduces no\s+new theory/i, 'closing-review rule missing'],
    ['skills/econ-exercise-builder.md', /Do not insert `## Samenvatting`, `## Website-help`, `## Voorkennis[\s\S]{0,100}generic `## Opgaven`/i, 'additional-heading prohibition missing'],
    ['skills/econ-exercise-builder.md', /Paper-first\/no-device rule:[\s\S]{0,500}must not direct students to a website[\s\S]{0,250}must not expose internal terms/i, 'paper-only/student-terminology rule missing'],
    ['skills/econ-exercise-builder.md', /graph or table production is itself a target operation[\s\S]{0,2500}do not add graph\/table\s+production/i, 'target-aligned visual-fading boundary missing'],
    ['skills/econ-exercise-builder.md', /Book 1 output is frozen/i, 'Book 1 freeze missing'],
    ['references/authored/didactiek-principes.md', /graph or table production is part of the approved target operation and\s+answer form[\s\S]{0,2500}do not add a production demand/i, 'didactic target-aligned visual-fading boundary missing'],
    ['skills/econ-paragraph-review.md', /missing, reordered, wrong-level[\s\S]{0,650}is a FAIL/i, 'review contract hard-fail severity missing'],
    ['BUILD-PARAGRAPH.md', /This Part B route is not the printed Part A exercise sequence/i, 'Part A/Part B boundary missing'],
  ];

  for (const [file, pattern, message] of rules) {
    requirePattern(failures, files, file, pattern, message);
  }

  failures.push(...findRouteBoundaryFailures(files));
  failures.push(...findPrintedTemplateFailures(files));
  failures.push(...findContradictoryAuthoringFailures(files));

  requirePattern(failures, files, 'package.json', /"check:part-a-exercise-authoring-contract"\s*:\s*"node build-scripts\/workflows\/check-part-a-exercise-authoring-contract\.js"/, 'npm checker script missing');
  requirePattern(failures, files, '.github/workflows/platform-ci.yml', /npm run check:part-a-exercise-authoring-contract/, 'explicit CI checker step missing');

  for (const file of ['RESEARCH_AGENT_MAP.md', 'AGENT_GITHUB_ENTRY.md', 'build-scripts/sprints/emit-url-index.js', 'reports/url-index.md']) {
    requirePattern(failures, files, file, new RegExp(CHECKER_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${CHECKER_PATH} navigation entry missing`);
  }
  requirePattern(failures, files, 'RESEARCH_AGENT_MAP.md', new RegExp(TEST_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${TEST_PATH} navigation entry missing`);

  return failures;
}

function checkPartAExerciseAuthoringContract(options = {}) {
  const files = options.files || readFiles(options.root || ROOT);
  const failures = findContractFailures(files, options);
  return {
    ok: failures.length === 0,
    checkedActiveSurfaces: ACTIVE_SURFACES,
    failures,
  };
}

function main() {
  const result = checkPartAExerciseAuthoringContract();
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (result.ok) {
    console.log(`OK Part A exercise authoring contract: ${result.checkedActiveSurfaces.length} platform source surfaces`);
  } else {
    console.error('Part A exercise authoring contract check failed:');
    for (const failure of result.failures) console.error(`- ${failure}`);
  }
  process.exitCode = result.ok ? 0 : 1;
}

if (require.main === module) main();

module.exports = {
  ACTIVE_SURFACES,
  SUPPORTING_SURFACES,
  CANONICAL_HEADINGS,
  normalizeSourceText,
  readFiles,
  firstCodeBlockAfter,
  markdownHeadings,
  markdownLevelTwoHeadings,
  CONTRACT_LINKS,
  findContractLinkFailures,
  findPrintedTemplateFailures,
  findContradictoryAuthoringFailures,
  findRouteBoundaryFailures,
  findContractFailures,
  checkPartAExerciseAuthoringContract,
};
