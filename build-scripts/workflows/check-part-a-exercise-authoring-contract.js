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

function numberedHeadings(block) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*\d+\.\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1].replace(/`/g, '').trim());
}

function markdownLevelTwoHeadings(block) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1].trim());
}

function diagramNumberedHeadings(block) {
  return block
    .split(/\r?\n/)
    .map((line) => line.match(/│\s*(\d+)\.\s*([A-Z][A-Z /]+?)\s*│/))
    .filter(Boolean)
    .map((match) => match[2].trim());
}

function requireExactCanonicalBlock(failures, files, file, marker) {
  const text = files[file] || '';
  const actual = numberedHeadings(firstCodeBlockAfter(text, marker));
  if (JSON.stringify(actual) !== JSON.stringify(CANONICAL_HEADINGS)) {
    failures.push(
      `${file}: canonical seven-heading block after "${marker}" must contain exactly ${CANONICAL_HEADINGS.join(' -> ')}`
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
    'WORKED EXAMPLE',
    'STARTOPGAVEN',
    'BEGELEIDE INOEFENING',
    'ZELFSTANDIGE OEFENING',
    'DOELOEFENING',
    'DENKERTJE / BONUSOPGAVE',
    'HERHALING / HERHALING EN INTERLEAVING',
    'SUMMARY BOX',
  ];
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${file}: canonical paragraph structure diagram is missing, reordered, or has an extra stage`);
  }
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
    'The student-facing headings then form one contiguous block'
  );
  requireExactCanonicalBlock(
    failures,
    files,
    'skills/econ-exercise-builder.md',
    'headings contiguously and never reorder them:'
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
  requireExactParagraphDiagram(failures, files);
  requireOrderedSequenceInSection(failures, files, 'skills/econ-didactiek.md', '**Book 2+ Part A inheritance:**', 'Apply these didactic checks');
  requireOrderedSequenceInSection(failures, files, 'skills/econ-paragraph-review.md', '### 1.5 Exercise design', '### 1.6 Summary and navigation');
  requireOrderedSequenceInSection(failures, files, 'skills/econ-pdf-builder.md', '**Horizontal rules between exercises:**', '**Sub-question blank lines:**');
  requireOrderedSequenceInSection(failures, files, 'agents/teacher-learning-quality-review-agent.md', '### Book 2+ Part A contract-review mode', '## Primary review focus');
  requireOrderedSequenceInSection(failures, files, 'docs/workflows/textbook-paragraph-lane.md', 'For newly authored Book 2 and later theory paragraphs', '## Allowed Outputs');

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
    ['skills/econ-exercise-builder.md', /Korte route: Startopgaven\s*->\s*Zelfstandige oefening\s*->\s*Doeloefening/i, 'core route note missing'],
    ['skills/econ-exercise-builder.md', /motivation \+ instruction \+ worked example \+ transitions\/recap \+ actual[\s\S]{0,180}planned lesson minutes <= 55/i, 'whole-lesson timing equation missing'],
    ['skills/econ-exercise-builder.md', /ranges below are recommendations, not proof by themselves/i, 'range-sum-is-not-proof safeguard missing'],
    ['skills/econ-exercise-builder.md', /prerequisite-retrieval task is\s+normally 3[–-]5 minutes/i, 'Start retrieval 3–5-minute norm missing'],
    ['skills/econ-exercise-builder.md', /teacher may assign that printed retrieval task at\s+the beginning of the lesson[\s\S]{0,160}does not change the\s+printed/i, 'classroom-order/printed-order clarification missing'],
    ['skills/econ-exercise-builder.md', /may not expand into adjacent\s+content or hide enrichment inside the core route/i, 'independent-practice scope boundary missing'],
    ['skills/econ-exercise-builder.md', /Light\s+adaptation is allowed only where the blueprint or responsible owner\s+authorizes it[\s\S]{0,160}preserve every target operation/i, 'authorized target-adaptation rule missing'],
    ['skills/econ-exercise-builder.md', /cognitive flexibility[\s\S]{0,180}not more or longer arithmetic/i, 'bonus cognitive-flexibility rule missing'],
    ['skills/econ-exercise-builder.md', /1[–-]2 short, accessible[\s\S]{0,120}introduces no\s+new theory/i, 'closing-review rule missing'],
    ['skills/econ-exercise-builder.md', /Do not insert a top-level summary, website-help stage, generic `Opgaven`/i, 'contiguity/intervening-stage prohibition missing'],
    ['skills/econ-exercise-builder.md', /Book 1 output is frozen/i, 'Book 1 freeze missing'],
    ['skills/econ-textbook-paragraph.md', /theory\s*->\s*Uitgewerkt voorbeeld\s*->\s*Startopgaven/i, 'theory/example/Start adjacency missing'],
    ['skills/econ-textbook-paragraph.md', /summary (?:follows|after) section 7/i, 'summary placement missing'],
    ['skills/econ-textbook-paragraph.md', /subordinate non-heading optional Part B pointer/i, 'website-help placement/boundary missing'],
    ['skills/econ-didactiek.md', /Book 2\+ Part A inheritance/i, 'didactic inheritance missing'],
    ['skills/econ-didactiek.md', /same goal[\s\S]{0,160}deliberately\s+fades/i, 'guided same-goal/fading invariant missing'],
    ['skills/econ-paragraph-review.md', /Exact structure and adjacency/i, 'review structure check missing'],
    ['skills/econ-paragraph-review.md', /Any missing, reordered, or intervening top-level stage is a FAIL/i, 'review adjacency hard-fail severity missing'],
    ['skills/econ-paragraph-review.md', /Startopgaven roles/i, 'review Start roles check missing'],
    ['skills/econ-paragraph-review.md', /Missing\/ineffective fading[\s\S]{0,100}is a FAIL/i, 'review guided-fading hard-fail severity missing'],
    ['skills/econ-paragraph-review.md', /produce their own graph\/table only when graph\/table production is a target operation/i, 'target-conditional representation rule missing'],
    ['skills/econ-paragraph-review.md', /Demanding a representation absent from the target is a FAIL/i, 'target-absent representation hard fail missing'],
    ['skills/econ-paragraph-review.md', /Route realism[\s\S]{0,400}actual estimated core-route questions at ≤55 minutes[\s\S]{0,120}Range addition/i, 'whole-lesson route-feasibility review missing'],
    ['skills/econ-pdf-builder.md', /exact contiguous[\s\S]{0,220}Uitgewerkt voorbeeld[\s\S]{0,220}Herhaling \/ Herhaling en interleaving/i, 'PDF heading contract missing'],
    ['agents/teacher-learning-quality-review-agent.md', /Book 2\+ Part A contract-review mode/i, 'teacher contract-review mode missing'],
    ['agents/teacher-learning-quality-review-agent.md', /Hard fail any missing\/reordered\/interrupted heading sequence/i, 'teacher hard-fail rule missing'],
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
  numberedHeadings,
  markdownLevelTwoHeadings,
  diagramNumberedHeadings,
  findRouteBoundaryFailures,
  findContractFailures,
  checkPartAExerciseAuthoringContract,
};
