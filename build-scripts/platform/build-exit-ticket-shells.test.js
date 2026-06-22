const fs = require('fs');
const path = require('path');

const shells = require('./build-exit-ticket-shells');
const exit112Data = require('../../source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const short112Data = require('../../source-data/book-1/exit-ticket/1.1.2-korte-check.json');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');
const short113Data = require('../../source-data/book-1/exit-ticket/1.1.3-korte-check.json');

const ROOT = path.resolve(__dirname, '..', '..');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeNewlines(value) {
  return String(value).replace(/\r\n/g, '\n');
}

function syntheticSupportedGoldenData() {
  const data = clone(exit113Data);
  data.parNr = '2.1.1';
  data.parName = 'Synthetic graph route';
  data.layout.kicker = 'Exit ticket - section 2.1.1';
  return data;
}

describe('exit-ticket shell Golden Exercise renderer selection', () => {
  test('keeps the implemented 1.1.3 Golden output unchanged', () => {
    const generated = shells.generateShell(
      '1.1.3',
      'Grafieken en tabellen',
      exit113Data,
      '1.1.3-exit-ticket'
    );
    const snapshot = fs.readFileSync(
      path.join(ROOT, 'references', 'exemplars', 'implemented', '1.1.3-golden-exercise-workbench', 'generated-route-snapshot.html'),
      'utf8'
    );
    expect(normalizeNewlines(generated)).toBe(normalizeNewlines(snapshot));
  });

  test('selects the Golden renderer by layout framework and supported capability shape', () => {
    const data = syntheticSupportedGoldenData();
    const renderer = shells.goldenExerciseRendererFor(data);
    const html = shells.generateShell('2.1.1', 'Synthetic graph route', data, '2.1.1-exit-ticket');

    expect(renderer.id).toBe('golden_graph_reading_claim_v1');
    expect(shells.usesGoldenExerciseWorkbench(data)).toBe(true);
    expect(shells.usesGoldenTicketLayout(data)).toBe(true);
    expect(html).toContain('class="ge-topbar"');
    expect(html).toContain('class="ge-page" data-golden-ticket-root');
    expect(html).toContain('shared/exit-ticket/2.1.1-exit-ticket.js');
    expect(html).toContain('shared/golden-ticket-graph.js');
    expect(html).toContain('data-graph-id="golden-ticket-211"');
    expect(html).not.toContain('id="exit-ticket-app"');
    expect(html).not.toContain('et-page');
    expect(html).not.toContain('et-topbar');
    expect(html).not.toContain('shared/task-shell.css');
    expect(html).not.toContain('shared/exit-ticket.css');
    expect(html).not.toContain('shared/skill-map-route.css');
    expect(html).not.toContain('shared/task-shell-ui.js');
    expect(html).not.toContain('shared/exit-ticket-ui.js');
  });

  test('selects the calculation/structured Golden renderer for the 1.1.2 transfer route', () => {
    const renderer = shells.goldenExerciseRendererFor(exit112Data);
    const html = shells.generateShell(
      '1.1.2',
      'Percentages en indexcijfers',
      exit112Data,
      '1.1.2-exit-ticket'
    );

    expect(renderer.id).toBe('golden_calculation_structured_v1');
    expect(shells.usesGoldenExerciseWorkbench(exit112Data)).toBe(true);
    expect(shells.usesGoldenTicketLayout(exit112Data)).toBe(true);
    expect(html).toContain('class="ge-topbar"');
    expect(html).toContain('class="ge-page" data-golden-ticket-root');
    expect(html).toContain('shared/exit-ticket/1.1.2-exit-ticket.js');
    expect(html).toContain('shared/golden-ticket-layout.css');
    expect(html).toContain('shared/golden-ticket-layout.js');
    expect(html).toContain('data-ge-work');
    expect(html).toContain('data-ge-structured-choice');
    expect(html).not.toContain('shared/golden-ticket-graph.js');
    expect(html).not.toContain('id="exit-ticket-app"');
    expect(html).not.toContain('et-page');
    expect(html).not.toContain('shared/task-shell.css');
    expect(html).not.toContain('shared/exit-ticket.css');
    expect(html).not.toContain('shared/task-shell-ui.js');
    expect(html).not.toContain('shared/exit-ticket-ui.js');
  });

  test('selects the advisory short-check Golden renderer for the 1.1.2 short check', () => {
    const renderer = shells.goldenExerciseRendererFor(short112Data);
    const html = shells.generateShell(
      '1.1.2',
      'Percentages en indexcijfers',
      short112Data,
      '1.1.2-korte-check'
    );

    expect(renderer.id).toBe('golden_advisory_short_check_v1');
    expect(shells.usesGoldenExerciseWorkbench(short112Data)).toBe(true);
    expect(shells.usesGoldenTicketLayout(short112Data)).toBe(true);
    expect(html).toContain('class="ge-topbar"');
    expect(html).toContain('class="ge-page" data-golden-ticket-root');
    expect(html).toContain('shared/exit-ticket/1.1.2-korte-check.js');
    expect(html).toContain('shared/golden-ticket-layout.css');
    expect(html).toContain('shared/golden-ticket-layout.js');
    expect(html).toContain('data-ge-choice-option');
    expect(html).toContain('data-source-key="1.1.2-korte-check"');
    expect(html).not.toContain('shared/golden-ticket-graph.js');
    expect(html).not.toContain('data-ge-work');
    expect(html).not.toContain('data-ge-structured-choice');
    expect(html).not.toContain('id="exit-ticket-app"');
    expect(html).not.toContain('et-page');
    expect(html).not.toContain('shared/task-shell.css');
    expect(html).not.toContain('shared/exit-ticket.css');
    expect(html).not.toContain('shared/task-shell-ui.js');
    expect(html).not.toContain('shared/exit-ticket-ui.js');
  });

  test('selects the graph advisory Golden renderer for the 1.1.3 short check', () => {
    const renderer = shells.goldenExerciseRendererFor(short113Data);
    const html = shells.generateShell(
      '1.1.3',
      'Grafieken en tabellen',
      short113Data,
      '1.1.3-korte-check'
    );

    expect(renderer.id).toBe('golden_graph_advisory_v1');
    expect(shells.usesGoldenExerciseWorkbench(short113Data)).toBe(true);
    expect(shells.usesGoldenTicketLayout(short113Data)).toBe(true);
    expect(html).toContain('class="ge-topbar"');
    expect(html).toContain('class="ge-page" data-golden-ticket-root');
    expect(html).toContain('shared/exit-ticket/1.1.3-korte-check.js');
    expect(html).toContain('shared/golden-ticket-layout.css');
    expect(html).toContain('shared/golden-ticket-graph.js');
    expect(html).toContain('shared/golden-ticket-layout.js');
    expect(html).toContain('data-ge-axis-option');
    expect(html).toContain('data-ge-route-choice-option');
    expect(html).toContain('data-source-key="1.1.3-korte-check"');
    expect(html).not.toContain('id="exit-ticket-app"');
    expect(html).not.toContain('et-page');
    expect(html).not.toContain('shared/task-shell.css');
    expect(html).not.toContain('shared/exit-ticket.css');
    expect(html).not.toContain('shared/task-shell-ui.js');
    expect(html).not.toContain('shared/exit-ticket-ui.js');
  });

  test('fails clearly instead of falling back when a Golden route has an unsupported task shape', () => {
    const data = syntheticSupportedGoldenData();
    data.tasks = data.tasks.filter((task) => {
      return !task.taskShell || task.taskShell.family !== 'graph_reading';
    });

    expect(() => shells.goldenExerciseRendererFor(data)).toThrow(/Unsupported Golden Exercise Workbench variant.*graph_reading/);
    expect(() => shells.generateShell('2.1.1', 'Synthetic graph route', data, '2.1.1-exit-ticket')).toThrow(/Unsupported Golden Exercise Workbench variant.*graph_reading/);
  });

  test('keeps non-Golden routes on the legacy shell even when their data has task-shell content', () => {
    const data = syntheticSupportedGoldenData();
    delete data.layout.framework;

    const html = shells.generateShell('2.1.1', 'Synthetic legacy route', data, '2.1.1-exit-ticket');

    expect(shells.goldenExerciseRendererFor(data)).toBeNull();
    expect(shells.usesGoldenExerciseWorkbench(data)).toBe(false);
    expect(html).toContain('class="et-topbar"');
    expect(html).toContain('class="et-page" id="exit-ticket-app"');
    expect(html).toContain('shared/task-shell.css');
    expect(html).toContain('shared/exit-ticket.css');
    expect(html).not.toContain('data-golden-ticket-root');
  });
});
