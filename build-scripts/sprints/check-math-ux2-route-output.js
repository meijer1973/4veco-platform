#!/usr/bin/env node
/**
 * Validate MATH-UX-2 generated math/task-shell output.
 *
 * HOW TO ADAPT:
 * - Keep this focused on calculation task-shell integration proof.
 * - Do not let this checker publish or require target-equivalent checkpoints.
 * - Add new paragraph cases only after roadmap authorization.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TaskShellEngine = require('../../engines/task-shell-engine');
const TaskShellUI = require('../../engines/task-shell-ui');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');

const platformRoot = path.resolve(__dirname, '..', '..');
const bookRoot = path.resolve(
  process.argv[2] || path.join(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const PAR_DIR = path.join(bookRoot, CHAPTER, '1.1.2 Percentages en indexcijfers');
const MATH_PAGE = path.join(PAR_DIR, '1.1.2 Percentages en indexcijfers \u2013 wiskundevaardigheden.html');
const EXIT_TICKET_PAGE = path.join(PAR_DIR, '1.1.2 Percentages en indexcijfers \u2013 exit-ticket.html');
const SKILLTREE_DATA = path.join(bookRoot, 'shared', 'skilltree', '1.1.2.js');
const DEPLOYED_BASE_ELEMENTS = path.join(bookRoot, 'shared', 'skilltree', 'base-elements.js');
const DEPLOYED_SKILLTREE_UI = path.join(bookRoot, 'shared', 'skilltree-ui.js');
const DEPLOYED_SKILLTREE_CSS = path.join(bookRoot, 'shared', 'skilltree.css');
const LEGACY_SOURCE_EXIT_TICKET = path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', '1.1.2.json');
const CURRENT_SOURCE_EXIT_TICKET = path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', '1.1.2-exit-ticket.json');
const TARGET_EXERCISES = path.join(platformRoot, 'references', 'authored', 'course-target-exercises.json');
const CANDIDATE_STORAGE = path.join(platformRoot, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');

const REQUIRED_FAMILIES = [
  'numeric_input',
  'calculation_work_capture',
  'final_answer_entry',
  'unit_notation_field'
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(filePath) {
  assert(fs.existsSync(filePath), `Missing file: ${filePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

function requireFresh(filePath) {
  const resolved = require.resolve(filePath);
  delete require.cache[resolved];
  return require(resolved);
}

function visibleText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkNoStudentCodeLeak(text, label) {
  assert(!/\b(?:[A-Z]\d{2}|MTU|PV|GEN_[A-Z]\d{2})\b/.test(text), `${label}: visible text leaks internal code`);
}

function checkNoProductClaim(text, label) {
  const prohibited = /Je hebt laten zien dat je de eindopgave|eindopgave.*aankunt|beheerst|bewezen|aangetoond|\bcijfer\b|summatief|adaptief|diagnose|diagnostisch|automatische route|student-facing AI|PV projection/i;
  assert(!prohibited.test(text), `${label}: prohibited product claim found`);
}

function loadSkillTreeData() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(SKILLTREE_DATA), context, { filename: SKILLTREE_DATA });
  return context.window.SKILL_TREE_DATA;
}

function taskShellSteps(elements, ids) {
  const steps = [];
  for (const id of ids) {
    const gen = elements.GEN[id];
    assert(typeof gen === 'function', `missing deployed generator: ${id}`);
    const exercise = gen();
    assert(exercise && Array.isArray(exercise.steps), `${id}: generator did not return steps`);
    for (const step of exercise.steps) {
      if (step.taskShell) steps.push({ id, step });
    }
  }
  return steps;
}

function checkpointCalculationFixture() {
  const task = (id, family, prompt, interaction, expected, feedback) => ({
    id,
    type: 'task_shell',
    taskShell: {
      id,
      family,
      skillLabel: family === 'unit_notation_field' ? 'Notatie controleren' : 'Rekenen met procenten en indexgetallen',
      purpose: 'Gebruik dezelfde taakvorm als in de rekenroute.',
      prompt,
      interaction,
      expected,
      feedback,
      practiceRoute: { label: 'Oefen verder met rekenen', href: 'wiskundevaardigheden.html' }
    }
  });
  return {
    schema_version: 1,
    parNr: '1.1.2',
    parName: 'Percentages en indexgetallen',
    title: 'Rekentaak oefenvorm',
    intro: 'Deze fixture bewijst alleen gedeelde taaktaal voor rekentaken.',
    targetSkillIds: ['A38', 'A39'],
    skillScopeIds: ['A38', 'A39'],
    metadataAlignment: {
      status: 'paragraph_skill_aligned_not_target_readiness',
      paragraphSkillIds: ['A38', 'A39'],
      targetExerciseSkillIds: ['A38', 'A39'],
      targetReadinessEvidence: false
    },
    tasks: [
      task('checkpoint-math-numeric', 'numeric_input', 'Bereken nieuw min oud.', {
        inputLabel: 'Verschil'
      }, { kind: 'number', value: 20, tolerance: 0 }, {
        matchTitle: 'Verschil klopt',
        matchText: 'Je hebt nieuw min oud gebruikt.',
        retryTitle: 'Controleer volgorde',
        retryText: 'Gebruik nieuwe waarde min oude waarde.'
      }),
      task('checkpoint-math-work', 'calculation_work_capture', 'Laat je procentberekening zien.', {
        workLabel: 'Berekening',
        finalAnswerLabel: 'Eindantwoord met procentteken'
      }, { kind: 'self_check', criteria: ['Formule staat zichtbaar.', 'Waarden zijn ingevuld.', 'Eindantwoord heeft een procentteken.'] }, {
        selfCheckTitle: 'Vergelijk je berekening',
        selfCheckText: 'Loop formule, waarden en notatie na.',
        retryTitle: 'Schrijf eerst je uitwerking',
        retryText: 'Vul berekening en eindantwoord in.'
      }),
      task('checkpoint-math-final', 'final_answer_entry', 'Geef het eindantwoord met procentteken.', {
        inputLabel: 'Eindantwoord'
      }, { kind: 'text', accepted: ['20%', '20 %'] }, {
        matchTitle: 'Antwoord klopt',
        matchText: 'Je antwoord heeft getal en procentteken.',
        retryTitle: 'Controleer getal en teken',
        retryText: 'Schrijf de uitkomst als percentage.'
      }),
      task('checkpoint-math-notation', 'unit_notation_field', 'Welke notatie hoort bij een procentuele verandering?', {
        inputLabel: 'Notatie'
      }, { kind: 'text', accepted: ['%', 'procent', 'procentteken'] }, {
        matchTitle: 'Notatie klopt',
        matchText: 'Een procentuele verandering krijgt een procentteken.',
        retryTitle: 'Gebruik procentnotatie',
        retryText: 'Schrijf het teken of woord voor procent.'
      })
    ]
  };
}

function checkTargetFieldsStillAbsent() {
  const data = JSON.parse(read(TARGET_EXERCISES));
  const records = data.exercises || data.paragraphs || data;
  const record = records.find(item => item.id === '1.1.2');
  assert(record, 'missing target-exercise record 1.1.2');
  assert(record.question_type === undefined, '1.1.2 target exercise must not receive question_type in MATH-UX-2');
  assert(record.answer_form === undefined, '1.1.2 target exercise must not receive answer_form in MATH-UX-2');
}

function main() {
  const page = read(MATH_PAGE);
  assert(page.includes('task-shell.css'), 'math page must load task-shell.css');
  assert(page.includes('task-shell-engine.js'), 'math page must load task-shell-engine.js');
  assert(page.includes('task-shell-ui.js'), 'math page must load task-shell-ui.js');
  assert(page.includes('skill-map-route-ui.js'), 'math page must load skill-map-route-ui.js');
  checkNoStudentCodeLeak(visibleText(page), '1.1.2 math page static HTML');
  checkNoProductClaim(visibleText(page), '1.1.2 math page static HTML');

  const exitTicketPage = read(EXIT_TICKET_PAGE);
  checkNoStudentCodeLeak(visibleText(exitTicketPage), '1.1.2 exit-ticket page static HTML');
  checkNoProductClaim(visibleText(exitTicketPage), '1.1.2 exit-ticket page static HTML');
  assert(fs.existsSync(CURRENT_SOURCE_EXIT_TICKET), 'current suffixed 1.1.2 exit-ticket source must exist');
  assert(!fs.existsSync(LEGACY_SOURCE_EXIT_TICKET), 'legacy source-data/book-1/exit-ticket/1.1.2.json must remain absent');
  assert(!fs.existsSync(CANDIDATE_STORAGE), 'MATH-UX-2 must not create answer-skill candidate storage');
  checkTargetFieldsStillAbsent();

  const deployedUi = read(DEPLOYED_SKILLTREE_UI);
  assert(deployedUi.includes('data-skilltree-task-shell="MATH-UX-2"'), 'deployed skilltree UI must render MATH-UX-2 task-shell marker');
  assert(deployedUi.includes('TaskShellUI.renderTask'), 'deployed skilltree UI must render TaskShellUI tasks');
  assert(deployedUi.includes('id="st-task-feedback"'), 'deployed skilltree UI must render a labelled task-shell feedback region');
  assert(deployedUi.includes('aria-label="Feedback op je rekenstap"'), 'deployed skilltree UI feedback region must have an accessible label');
  assert(deployedUi.includes('role="status"'), 'deployed skilltree UI feedback region must announce status');
  assert(deployedUi.includes('preventScroll: true'), 'deployed skilltree UI focus repair must avoid scroll jumps');

  const deployedCss = read(DEPLOYED_SKILLTREE_CSS);
  assert(deployedCss.includes('.st-task-shell-step'), 'deployed skilltree CSS must style embedded task-shell steps');
  assert(deployedCss.includes('.st-task-shell-step .ts-task'), 'embedded task shell must be unframed inside the skilltree card');

  const data = loadSkillTreeData();
  assert(data && data.parNr === '1.1.2', 'generated 1.1.2 skilltree data must load');
  assert(Array.isArray(data.activeSkills) && data.activeSkills.includes('A38') && data.activeSkills.includes('A39'), '1.1.2 math route must include A38 and A39');
  assert(data.skillMapRoutes && data.skillMapRoutes.calculation, '1.1.2 must expose a calculation skill-map route');

  const elements = requireFresh(DEPLOYED_BASE_ELEMENTS);
  const steps = taskShellSteps(elements, ['A38', 'A39']);
  assert(steps.length >= 8, 'A38/A39 must expose task-shell steps in the deployed generator bundle');

  const families = new Set();
  const renderedTasks = [];
  for (const { id, step } of steps) {
    const task = step.taskShell;
    TaskShellEngine.validateTask(task);
    assert(TaskShellEngine.findStudentTextViolations(task).length === 0, `${id} ${task.id}: student-facing text violation`);
    families.add(task.family);
    const html = TaskShellUI.renderTask(task, renderedTasks.length);
    renderedTasks.push(html);
    assert(html.includes(`data-task-family="${task.family}"`), `${id} ${task.id}: missing task-family marker`);
    checkNoStudentCodeLeak(visibleText(html), `${id} ${task.id} task shell`);
    checkNoProductClaim(visibleText(html), `${id} ${task.id} task shell`);
  }

  for (const family of REQUIRED_FAMILIES) {
    assert(families.has(family), `1.1.2 math route missing task family: ${family}`);
  }
  assert(renderedTasks.join('\n').includes('data-input-role="work"'), 'rendered math tasks must include calculation/work capture');
  assert(renderedTasks.join('\n').includes('data-input-role="final-answer"'), 'rendered math tasks must include final-answer capture');

  const fixture = checkpointCalculationFixture();
  assert(ExitTicketEngine.validateData(fixture), 'checkpoint calculation fixture must validate');
  assert(fixture.metadataAlignment.targetReadinessEvidence === false, 'checkpoint calculation fixture must not claim target-readiness evidence');
  const fixtureHtml = ExitTicketUI.renderStaticHtml(fixture, {});
  for (const family of REQUIRED_FAMILIES) {
    assert(fixtureHtml.includes(`data-task-family="${family}"`), `checkpoint fixture missing task family: ${family}`);
  }
  checkNoStudentCodeLeak(visibleText(fixtureHtml), 'checkpoint calculation fixture');
  checkNoProductClaim(visibleText(fixtureHtml), 'checkpoint calculation fixture');

  console.log(`MATH-UX-2 route output OK (${steps.length} A38/A39 task-shell steps; ${REQUIRED_FAMILIES.length} required families)`);
}

try {
  main();
} catch (error) {
  console.error(`MATH-UX-2 route output check failed: ${error.message}`);
  process.exit(1);
}
