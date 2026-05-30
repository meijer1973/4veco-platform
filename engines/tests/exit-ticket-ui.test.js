const fs = require('fs');
const path = require('path');
const ExitTicketUI = require('../exit-ticket-ui');
const ExitTicketEngine = require('../exit-ticket-engine');
const data = require('../../source-data/book-1/exit-ticket/1.1.1.json');
const exitTicketShells = require('../../build-scripts/platform/build-exit-ticket-shells');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');

function visibleHtml() {
    const engine = new ExitTicketEngine({ data });
    const view = ExitTicketUI.buildSkillView(data, engine, {});
    return ExitTicketUI.renderStaticHtml(data, view);
}

describe('ExitTicketUI', () => {
    test('renders student-visible text without internal MTU codes', () => {
        const html = visibleHtml();
        expect(html).toContain('Korte check');
        expect(html).toContain('Schaarste herkennen');
        expect(html).toContain('Alternatieve kosten kiezen');
        expect(html).not.toMatch(/\b(?:A\d{2}|B\d{2}|PV|MTU)\b/);
    });

    test('renders no blocked product-boundary words in the checkpoint surface', () => {
        const html = visibleHtml().toLowerCase();
        for (const term of ExitTicketEngine.BLOCKED_STUDENT_TERMS) {
            expect(html).not.toContain(term.toLowerCase());
        }
    });

    test('generator shell loads shared skill-map and exit-ticket runtime files', () => {
        const shell = exitTicketShells.generateShell('1.1.1', 'Schaarste en economisch denken');
        expect(shell).toContain('shared/skill-map-engine.js');
        expect(shell).toContain('shared/skilltree/base-elements.js');
        expect(shell).toContain('shared/skilltree/1.1.1.js');
        expect(shell).toContain('shared/skill-map-route-ui.js');
        expect(shell).toContain('shared/task-shell.css');
        expect(shell).toContain('shared/task-shell-engine.js');
        expect(shell).toContain('shared/task-shell-ui.js');
        expect(shell).toContain('shared/exit-ticket/1.1.1.js');
        expect(shell).toContain('shared/exit-ticket-engine.js');
        expect(shell).toContain('shared/exit-ticket-ui.js');
        expect(shell).toContain('shared/exit-ticket.css');
    });

    test('deploy copies checkpoint runtime and runs the shell generator before landing pages', () => {
        const deploy = fs.readFileSync(path.join(PLATFORM_ROOT, 'scripts', 'deploy.js'), 'utf8');
        expect(deploy).toContain("'task-shell-engine.js'");
        expect(deploy).toContain("'task-shell-ui.js'");
        expect(deploy).toContain("'task-shell.css'");
        expect(deploy).toContain("'exit-ticket-engine.js'");
        expect(deploy).toContain("'exit-ticket-ui.js'");
        expect(deploy).toContain("'exit-ticket.css'");
        const exitTicketIndex = deploy.indexOf('build-exit-ticket-shells.js');
        const landingIndex = deploy.indexOf('build-landing-page.js');
        expect(exitTicketIndex).toBeGreaterThan(-1);
        expect(landingIndex).toBeGreaterThan(-1);
        expect(exitTicketIndex).toBeLessThan(landingIndex);
    });
});
