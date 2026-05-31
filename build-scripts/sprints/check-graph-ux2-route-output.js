#!/usr/bin/env node
/**
 * Validate GRAPH-UX-2 generated graph/task-shell output.
 *
 * HOW TO ADAPT:
 * - Keep this focused on graph/table task-shell integration proof.
 * - Do not let this checker publish or require target-equivalent checkpoints.
 * - Add new cases only after the roadmap authorizes more graph routes.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const GraphicalEngine = require('../../engines/graphical-engine');
const TaskShellEngine = require('../../engines/task-shell-engine');
const TaskShellUI = require('../../engines/task-shell-ui');
const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const ExitTicketUI = require('../../engines/exit-ticket-ui');

const bookRoot = path.resolve(
  process.argv[2] || path.join(__dirname, '..', '..', '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);

const CHAPTER = '1.1 Hoofdstuk Economisch denken en rekenen';
const PAR_DIR = path.join(bookRoot, CHAPTER, '1.1.3 Grafieken en tabellen');
const GRAPH_PAGE = path.join(PAR_DIR, '1.1.3 Grafieken en tabellen \u2013 grafiekenspel.html');
const EXIT_TICKET_PAGE = path.join(PAR_DIR, '1.1.3 Grafieken en tabellen \u2013 exit-ticket.html');
const GRAPH_DATA = path.join(bookRoot, 'shared', 'graphical', '1.1.3.js');
const DEPLOYED_GRAPH_UI = path.join(bookRoot, 'shared', 'graphical-ui.js');

const REQUIRED_FAMILIES = [
  'table_value_selection',
  'graph_reading',
  'graph_construction_substitute',
  'point_placement',
  'calculation_work_capture'
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

function loadGraphData() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(read(GRAPH_DATA), context, { filename: GRAPH_DATA });
  return context.GRAPHICAL_GAME_DATA;
}

function checkpointGraphFixture() {
  const task = (id, family, prompt, interaction, expected, feedback) => ({
    id,
    type: 'task_shell',
    taskShell: {
      id,
      family,
      skillLabel: family === 'point_placement' ? 'Punt plaatsen' : 'Grafiek of tabel gebruiken',
      purpose: 'Gebruik dezelfde taakvorm als in het grafiekenspel.',
      prompt,
      interaction,
      expected,
      feedback,
      practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
    }
  });
  return {
    schema_version: 1,
    parNr: '1.1.3',
    parName: 'Grafieken en tabellen',
    title: 'Grafiektaak oefenvorm',
    intro: 'Deze fixture bewijst alleen gedeelde taaktaal voor graph/table taken.',
    targetSkillIds: ['A61', 'A62', 'A63'],
    skillScopeIds: ['A61', 'A62', 'A63'],
    metadataAlignment: {
      status: 'paragraph_skill_aligned_not_target_readiness',
      paragraphSkillIds: ['A61', 'A62', 'A63'],
      targetExerciseSkillIds: ['A61', 'A62', 'A63', 'A38'],
      targetReadinessEvidence: false
    },
    tasks: [
      task('checkpoint-table', 'table_value_selection', 'Welke tabelwaarde hoort bij EUR 2,00?', {
        inputLabel: 'Tabelwaarde',
        options: [{ id: 'a', label: '300 ijsjes' }, { id: 'b', label: '400 ijsjes' }]
      }, { kind: 'choice', value: 'a' }, {
        matchTitle: 'Juiste bronwaarde',
        matchText: 'Je koos de waarde uit dezelfde rij.',
        retryTitle: 'Zoek opnieuw',
        retryText: 'Lees prijs en waarde in dezelfde rij.'
      }),
      task('checkpoint-graph', 'graph_reading', 'Lees de indexwaarde bij juni af.', {
        inputLabel: 'Afgelezen waarde'
      }, { kind: 'number', value: 70, tolerance: 0, unit: 'index' }, {
        matchTitle: 'Goed afgelezen',
        matchText: 'De waarde is 70.',
        retryTitle: 'Lees opnieuw',
        retryText: 'Zoek juni en lees de verticale waarde.'
      }),
      task('checkpoint-point', 'point_placement', 'Welk punt hoort bij prijs 10 en aantal 100?', {
        xLabel: 'prijs',
        yLabel: 'aantal'
      }, { kind: 'point', x: 10, y: 100, toleranceX: 0, toleranceY: 0 }, {
        matchTitle: 'Punt klopt',
        matchText: 'Het punt is (10, 100).',
        retryTitle: 'Controleer asvolgorde',
        retryText: 'Prijs is x en aantal is y.'
      })
    ]
  };
}

function main() {
  const page = read(GRAPH_PAGE);
  assert(page.includes('task-shell.css'), 'graph page must load task-shell.css');
  assert(page.includes('task-shell-engine.js'), 'graph page must load task-shell-engine.js');
  assert(page.includes('task-shell-ui.js'), 'graph page must load task-shell-ui.js');
  assert(page.includes('skill-map-route-ui.js'), 'graph page must load skill-map-route-ui.js');
  assert(!fs.existsSync(EXIT_TICKET_PAGE), 'GRAPH-UX-2 must not publish a 1.1.3 exit-ticket page');

  const deployedUi = read(DEPLOYED_GRAPH_UI);
  assert(deployedUi.includes('data-graph-task-shell="GRAPH-UX-2"'), 'deployed graph UI must render GRAPH-UX-2 task-shell marker');
  assert(deployedUi.includes('TaskShellUI.renderTask'), 'deployed graph UI must render TaskShellUI tasks');
  assert(deployedUi.includes('engine.evaluateTaskShellResponse'), 'deployed graph UI must evaluate through GraphicalEngine task-shell path');
  assert(deployedUi.includes('id="g-task-feedback"'), 'deployed graph UI must render a labelled task-shell feedback region');
  assert(deployedUi.includes('aria-label="Feedback op je antwoord"'), 'deployed graph UI feedback region must have an accessible label');
  assert(deployedUi.includes('role="status"'), 'deployed graph UI feedback region must announce status');
  assert(deployedUi.includes('feedbackRegion.focus'), 'deployed graph UI must move focus to feedback after checking');
  assert(deployedUi.includes('preventScroll: true'), 'deployed graph UI focus repair must avoid sticky-header scroll jumps');

  const data = loadGraphData();
  assert(GraphicalEngine.validateData(data), '1.1.3 graph data must validate');
  assert(data.challenges.length >= 6, '1.1.3 graph route must include a real task sequence');

  const families = new Set();
  const renderedTasks = [];
  data.challenges.forEach((challenge, index) => {
    const task = GraphicalEngine.buildTaskShellTask(challenge, index);
    TaskShellEngine.validateTask(task);
    families.add(task.family);
    const html = TaskShellUI.renderTask(task, index);
    renderedTasks.push(html);
    assert(html.includes(`data-task-family="${task.family}"`), `${challenge.id}: missing task-family marker`);
    checkNoStudentCodeLeak(visibleText(html), `${challenge.id} task shell`);
    checkNoProductClaim(visibleText(html), `${challenge.id} task shell`);
  });

  for (const family of REQUIRED_FAMILIES) {
    assert(families.has(family), `1.1.3 graph route missing task family: ${family}`);
  }
  assert(data.challenges.some(challenge => challenge.graph && challenge.graph.show_value_labels === false), 'missing less-labelled graph variant');
  assert(data.challenges.some(challenge => challenge.type === 'interpolation_read'), 'missing interpolation challenge');
  assert(data.challenges.some(challenge => challenge.type === 'axis_convention_check'), 'missing axis convention challenge');

  const renderedAll = renderedTasks.join('\n');
  assert(renderedAll.includes('data-task-family="table_value_selection"'), 'rendered graph tasks missing table task marker');
  assert(renderedAll.includes('data-task-family="graph_reading"'), 'rendered graph tasks missing graph-reading marker');
  assert(renderedAll.includes('data-task-family="point_placement"'), 'rendered graph tasks missing point-placement marker');
  assert(renderedAll.includes('data-task-family="graph_construction_substitute"'), 'rendered graph tasks missing graph-construction substitute marker');

  const fixture = checkpointGraphFixture();
  assert(ExitTicketEngine.validateData(fixture), 'checkpoint graph fixture must validate');
  assert(fixture.metadataAlignment.targetReadinessEvidence === false, 'checkpoint graph fixture must not claim target-readiness evidence');
  const fixtureHtml = ExitTicketUI.renderStaticHtml(fixture, {});
  for (const family of ['table_value_selection', 'graph_reading', 'point_placement']) {
    assert(fixtureHtml.includes(`data-task-family="${family}"`), `checkpoint fixture missing task family: ${family}`);
  }
  checkNoStudentCodeLeak(visibleText(fixtureHtml), 'checkpoint graph fixture');
  checkNoProductClaim(visibleText(fixtureHtml), 'checkpoint graph fixture');

  console.log(`GRAPH-UX-2 route output OK (${data.challenges.length} graph tasks; ${REQUIRED_FAMILIES.length} required families)`);
}

try {
  main();
} catch (error) {
  console.error(`GRAPH-UX-2 route output check failed: ${error.message}`);
  process.exit(1);
}
