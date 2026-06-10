const fs = require('fs');
const path = require('path');

const shells = require('./build-exit-ticket-shells');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');

const ROOT = path.resolve(__dirname, '..', '..');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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
    expect(generated).toBe(snapshot);
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
