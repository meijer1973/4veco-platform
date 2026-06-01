/**
 * Source-level safeguards for the skilltree UI task-shell integration.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'skilltree-ui.js'), 'utf8');
const shellSource = fs.readFileSync(path.join(__dirname, '..', '..', 'build-scripts', 'platform', 'build-skilltree-shells.js'), 'utf8');

describe('skilltree ui task-shell safeguards', () => {
    test('loads the shared task shell in math practice shells', () => {
        expect(shellSource).toContain('task-shell.css');
        expect(shellSource).toContain('task-shell-engine.js');
        expect(shellSource).toContain('task-shell-ui.js');
    });

    test('renders shared task-shell steps inside the skilltree exercise flow', () => {
        expect(source).toContain('TaskShellUI.renderTask');
        expect(source).toContain('data-skilltree-task-shell="MATH-UX-2"');
        expect(source).toContain('check-task-shell');
        expect(source).toContain('task-shell-next');
        expect(source).toContain('collectTaskShellResponse');
        expect(source).toContain('unitNotation: getTaskShellValue');
        expect(source).toContain('data-input-role="unit-notation"');
    });

    test('announces task-shell feedback and preserves keyboard/focus flow', () => {
        expect(source).toContain('id="st-task-feedback"');
        expect(source).toContain('aria-label="Feedback op je rekenstap"');
        expect(source).toContain('role="status"');
        expect(source).toContain('feedback.focus');
        expect(source).toContain('preventScroll: true');
        expect(source).toContain('focusTaskFeedback = true');
        expect(source).toContain('choices[ci].setAttribute(\'aria-pressed\', \'false\')');
        expect(source).toContain('e.target.tagName !== \'TEXTAREA\'');
    });

    test('uses student-facing route language without internal codes', () => {
        expect(source).toContain('Schrijf je rekenstap op dezelfde manier als in de route');
        expect(source).not.toContain('Gebruik A38');
        expect(source).not.toContain('Gebruik A39');
        expect(source).not.toContain('MATH-UX-2 oefening');
    });
});
