#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

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

function diagramNumberedHeadings(block) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(/│\s*(\d+)\.\s*((?:##\s+)?[A-Z][A-Z /]+?)\s*│/))
    .filter(Boolean)
    .map((match) => match[2].trim());
}

function requireExactCanonicalBlock(failures, files, file, marker) {
  const text = files[file] || '';
  const actual = markdownHeadings(firstCodeBlockAfter(text, marker));
  const expected = CANONICAL_HEADINGS.map((title) => ({ level: 2, title }));
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(
      `${file}: canonical block after "${marker}" must contain exactly seven ## headings in canonical order`
    );
  }
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

function requireExactParagraphDiagram(failures, files) {
  const file = 'skills/econ-textbook-paragraph.md';
  const actual = diagramNumberedHeadings(
    firstCodeBlockAfter(files[file] || '', 'Every newly authored Book 2+ theory paragraph follows this structure')
  );
  const expected = [
    'HEADER',
    'MOTIVATING PROBLEM',
    'THEORY',
    '## UITGEWERKT VOORBEELD',
    'SUMMARY BOX',
    '## STARTOPGAVEN',
    '## BEGELEIDE INOEFENING',
    '## ZELFSTANDIGE OEFENING',
    '## DOELOEFENING',
    '## DENKERTJE / BONUSOPGAVE',
    '## HERHALING / HERHALING EN INTERLEAVING',
  ];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${file}: canonical paragraph structure diagram is missing, reordered, or has an extra stage`);
  }
}

function requireExactInlineHeadingSequence(failures, files, file, startMarker, endMarker) {
  const text = files[file] || '';
  const start = text.indexOf(startMarker);
  const end = endMarker ? text.indexOf(endMarker, start + startMarker.length) : text.length;
  if (start === -1 || (endMarker && end === -1)) {
    failures.push(`${file}: sequence section markers missing`);
    return;
  }
  const matches = [...text.slice(start, end).matchAll(/`(#{1,6})\s+([^`]+)`/g)]
    .map((match) => ({ level: match[1].length, title: match[2].trim() }))
    .filter((heading) => CANONICAL_HEADINGS.includes(heading.title));
  const expected = CANONICAL_HEADINGS.map((title) => ({ level: 2, title }));
  if (JSON.stringify(matches) !== JSON.stringify(expected)) {
    failures.push(`${file}: inherited heading sequence must use exact canonical names, order, and ## level`);
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
  if (/\b(?:website|online|laptop|phone|tablet|QR code|companion page|digital support)\b/i.test(template)) {
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

function requireOrderedSequenceInSection(failures, files, file, startMarker, endMarker) {
  const text = files[file] || '';
  const start = text.indexOf(startMarker);
  const end = endMarker ? text.indexOf(endMarker, start + startMarker.length) : text.length;
  if (start === -1 || (endMarker && end === -1)) {
    failures.push(`${file}: sequence section markers missing`);
    return;
  }
  const sectionText = text.slice(start, end).replace(/\s+/g, ' ');
  const indices = CANONICAL_HEADINGS.map((heading) => sectionText.indexOf(heading.replace(/\s+/g, ' ')));
  if (indices.some((index) => index === -1) || indices.some((index, position) => position > 0 && index <= indices[position - 1])) {
    failures.push(`${file}: inherited seven-heading sequence is missing or reordered`);
  }
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

  requireExactCanonicalBlock(
    failures,
    files,
    'references/authored/didactiek-principes.md',
    'The student-facing exercise headings use this exact Markdown hierarchy'
  );
  requireExactCanonicalBlock(
    failures,
    files,
    'skills/econ-exercise-builder.md',
    'hierarchy and never reorder the seven exercise headings:'
  );
  requireExactTemplateHeadings(
    failures,
    files,
    'skills/econ-exercise-builder.md',
    '### 7.1 exercises.md structure'
  );
  requireExactCanonicalBlock(
    failures,
    files,
    'BUILD-PARAGRAPH.md',
    'For newly authored Book 2+ theory paragraphs the seven printed headings are'
  );
  requireExactCanonicalBlock(
    failures,
    files,
    'skills/econ-pdf-builder.md',
    'Book 2+ Part A paragraphs use this exact Markdown hierarchy and order:'
  );
  requireExactParagraphDiagram(failures, files);
  requireExactInlineHeadingSequence(failures, files, 'skills/econ-paragraph-review.md', '### 1.5 Exercise design', '### 1.6 Summary and navigation');
  requireExactInlineHeadingSequence(failures, files, 'agents/teacher-learning-quality-review-agent.md', '### Book 2+ Part A contract-review mode', '## Primary review focus');

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
    ['skills/econ-exercise-builder.md', /Book 1 output is frozen/i, 'Book 1 freeze missing'],
    ['skills/econ-textbook-paragraph.md', /theory\s*->\s*Uitgewerkt voorbeeld\s*->\s*compact\s+non-heading summary\s*->\s*Startopgaven/i, 'theory/example/summary/Start adjacency missing'],
    ['skills/econ-textbook-paragraph.md', /summary[\s\S]{0,180}after worked example, before exercises/i, 'summary placement missing'],
    ['skills/econ-textbook-paragraph.md', /complete on paper[\s\S]{0,180}does not[\s\S]{0,100}website, device, online explanation, or Part B/i, 'paper-only paragraph boundary missing'],
    ['skills/econ-didactiek.md', /Book 2\+ Part A inheritance/i, 'didactic inheritance missing'],
    ['skills/econ-didactiek.md', /same goal[\s\S]{0,160}deliberately\s+fades/i, 'guided same-goal/fading invariant missing'],
    ['skills/econ-paragraph-review.md', /Exact structure and adjacency/i, 'review structure check missing'],
    ['skills/econ-paragraph-review.md', /Any missing, reordered, wrong-level, or additional top-level stage is a FAIL/i, 'review heading/adjacency hard-fail severity missing'],
    ['skills/econ-paragraph-review.md', /Startopgaven roles/i, 'review Start roles check missing'],
    ['skills/econ-paragraph-review.md', /Missing\/ineffective fading[\s\S]{0,100}is a FAIL/i, 'review guided-fading hard-fail severity missing'],
    ['skills/econ-paragraph-review.md', /produce their own graph\/table only when graph\/table production is a target operation/i, 'target-conditional representation rule missing'],
    ['skills/econ-paragraph-review.md', /Demanding a representation absent from the target is a FAIL/i, 'target-absent representation hard fail missing'],
    ['skills/econ-paragraph-review.md', /Route realism[\s\S]{0,400}actual estimated core-route questions at ≤55 minutes[\s\S]{0,120}Range addition/i, 'whole-lesson route-feasibility review missing'],
    ['skills/econ-pdf-builder.md', /exact Markdown hierarchy and order/i, 'PDF heading contract missing'],
    ['agents/teacher-learning-quality-review-agent.md', /Book 2\+ Part A contract-review mode/i, 'teacher contract-review mode missing'],
    ['agents/teacher-learning-quality-review-agent.md', /Hard fail any missing\/reordered\/wrong-level\/additional heading sequence/i, 'teacher hard-fail rule missing'],
    ['agents/teacher-learning-quality-review-agent.md', /1\. paper-only usability;[\s\S]{0,900}12\. absence of student-facing internal architecture terminology/i, 'teacher twelve-criterion contract review missing'],
    ['BUILD-PARAGRAPH.md', /Book 2\+ Part A exercise-authoring input contract/i, 'all-target Part A input contract missing'],
    ['BUILD-PARAGRAPH.md', /Lesson goal\s*\|\s*Target subquestion\/operation[\s\S]{0,160}Covered\/gap/i, 'BUILD alignment table missing'],
    ['BUILD-PARAGRAPH.md', /This Part B route is not the printed Part A exercise sequence/i, 'Part A/Part B boundary missing'],
    ['docs/workflows/textbook-paragraph-lane.md', /skills\/econ-exercise-builder\.md[\s\S]{0,100}operational Part A exercise contract/i, 'lane source pointer missing'],
    ['docs/workflows/textbook-paragraph-lane.md', /Book 1 output is frozen/i, 'lane Book 1 freeze missing'],
  ];

  for (const [file, pattern, message] of rules) {
    requirePattern(failures, files, file, pattern, message);
  }

  failures.push(...findRouteBoundaryFailures(files));
  failures.push(...findPrintedTemplateFailures(files));

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
  diagramNumberedHeadings,
  findPrintedTemplateFailures,
  findRouteBoundaryFailures,
  findContractFailures,
  checkPartAExerciseAuthoringContract,
};
