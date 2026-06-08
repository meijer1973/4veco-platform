const fs = require('fs');
const path = require('path');

const checker = require('./check-golden-ticket-layout-boundary');
const noLegacy = require('./check-golden-ticket-no-legacy');
const renderedProof = require('./check-golden-ticket-rendered-proof');
const exitTicketShells = require('../platform/build-exit-ticket-shells');
const exit113Data = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');

const ROOT = path.resolve(__dirname, '..', '..');
const FIXTURES = path.join(ROOT, 'build-scripts', 'sprints', 'fixtures');

function readFixture(name) {
  return fs.readFileSync(path.join(FIXTURES, name), 'utf8');
}

describe('golden ticket layout boundary checker', () => {
  test('rejects the pure legacy exit-ticket fixture', () => {
    expect(() => checker.checkHtml(
      readFixture('legacy-exit-ticket.html'),
      { label: 'legacy fixture' }
    )).toThrow(/exit-ticket-app|must load golden-ticket-layout\.css/);
  });

  test('rejects the hybrid ge-in-et failed route fixture', () => {
    expect(() => checker.checkHtml(
      readFixture('hybrid-frankenstein-exit-ticket.html'),
      { label: 'hybrid fixture' }
    )).toThrow(/class attributes mix golden and legacy classes|exit-ticket-app/);
  });

  test('accepts the clean golden ticket reference fixture', () => {
    expect(() => checker.checkHtml(
      readFixture('golden-ticket-reference.html'),
      { label: 'golden reference fixture' }
    )).not.toThrow();
  });

  test('exposes the exact no-legacy checker entrypoint for positional route checks', () => {
    const args = noLegacy.parseArgs([path.join(FIXTURES, 'golden-ticket-reference.html')]);
    const target = noLegacy.readTarget(args);
    expect(target.html).toContain('data-golden-ticket-root');
    expect(() => noLegacy.checkHtml(target.html, { label: 'no-legacy wrapper' })).not.toThrow();
  });

  test('rejects standalone legacy header classes and skill-map route UI injection', () => {
    const clean = readFixture('golden-ticket-reference.html');
    expect(() => checker.checkHtml(
      clean.replace('</main>', '<div class="et-topbar"></div><div class="et-back"></div><div class="et-theme-toggle"></div></main>'),
      { label: 'legacy standalone class probe' }
    )).toThrow(/legacy task-shell\/app-shell classes/);
    expect(() => checker.checkHtml(
      clean.replace('</body>', '<script src="../../shared/skill-map-route-ui.js"></script></body>'),
      { label: 'legacy route UI probe' }
    )).toThrow(/skill-map-route-ui\.js/);
    expect(() => checker.checkHtml(
      clean.replace('</main>', '<label><input type="checkbox"> Verbind mijn punten</label></main>'),
      { label: 'generic connect checkbox probe' }
    )).toThrow(/checkbox controls|connect-line prompt/);
  });

  test('rendered proof rejects weakened after-graph manifest facts', () => {
    const manifestPath = path.join(ROOT, 'reports', 'sprints', 'GOLDEN-TICKET-LAYOUT-RESET-1-screenshots', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const weakened = JSON.parse(JSON.stringify(manifest));
    const mobileAfterGraph = weakened.screenshots.find((item) => path.basename(item.file) === 'implemented-mobile-light-after-graph.png');
    mobileAfterGraph.proof = { graphOk: true };
    expect(() => renderedProof.checkManifestJson(weakened)).toThrow(/graphPoints/);
  });

  test('accepts the generated 1.1.3 golden route shell', () => {
    const html = exitTicketShells.generateShell(
      '1.1.3',
      'Grafieken en tabellen',
      exit113Data,
      '1.1.3-exit-ticket'
    );
    expect(() => checker.checkHtml(html, { label: 'generated shell' })).not.toThrow();
    expect(html).toContain('shared/golden-ticket-layout.css');
    expect(html).toContain('shared/golden-ticket-graph.js');
    expect(html).toContain('shared/golden-ticket-layout.js');
    expect(html).not.toContain('shared/task-shell-engine.js');
    expect(html).not.toContain('shared/task-shell.css');
    expect(html).not.toContain('shared/exit-ticket-engine.js');
    expect(html).not.toContain('shared/exit-ticket.css');
    expect(html).not.toContain('shared/skill-map-route.css');
    expect(html).not.toContain('shared/skill-map-route-ui.js');
    expect(html).not.toContain('shared/task-shell-ui.js');
    expect(html).not.toContain('shared/exit-ticket-ui.js');
    expect(html).not.toContain('id="exit-ticket-app"');
    expect(html).not.toContain('et-page');
  });
});
