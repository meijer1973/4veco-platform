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
        expect(source).toContain("task.family === 'cloze_tile_select'");
        expect(source).toContain('collectClozeTileResponse(root, task)');
        expect(source).toContain("task.family === 'cloze_text'");
        expect(source).toContain('collectClozeTextResponse(root, task)');
        expect(source).toContain("task.family === 'multi_select'");
        expect(source).toContain('collectMultiSelectResponse(root, task)');
        expect(source).toContain('handleMultiSelectClick(els.exStepSlot, e)');
        expect(source).toContain('handleClozeTileClick(els.exStepSlot, e)');
        expect(source).toContain("task.family === 'sentence_builder'");
        expect(source).toContain('collectSentenceBuilderResponse(root, task)');
        expect(source).toContain('handleSentenceBuilderClick(els.exStepSlot, e)');
        expect(source).toContain("task.family === 'formula_builder'");
        expect(source).toContain('collectFormulaBuilderResponse(root, task)');
        expect(source).toContain('handleFormulaBuilderClick(els.exStepSlot, e)');
        expect(source).toContain("task.family === 'step_ordering'");
        expect(source).toContain('collectStepOrderingResponse(root, task)');
        expect(source).toContain('handleStepOrderingClick(els.exStepSlot, e)');
        expect(source).toContain("task.family === 'source_value_selection'");
        expect(source).toContain('collectSourceValueSelectionResponse(root, task)');
        expect(source).toContain('handleSourceValueSelectionClick(els.exStepSlot, e)');
        expect(source).toContain("task.family === 'source_chain_builder'");
        expect(source).toContain('collectSourceChainBuilderResponse(root, task)');
        expect(source).toContain('handleSourceChainBuilderClick(els.exStepSlot, e)');
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
        expect(source).toContain("e.target.closest('.ts-multi-select')");
        expect(source).toContain("e.target.closest('.ts-formula')");
        expect(source).toContain("e.target.closest('.ts-step-ordering')");
        expect(source).toContain("e.target.closest('.ts-source-values')");
        expect(source).toContain("e.target.closest('.ts-source-chain')");
    });

    test('uses student-facing route language without internal codes', () => {
        expect(source).toContain('Schrijf je rekenstap op dezelfde manier als in de route');
        expect(source).not.toContain('Gebruik A38');
        expect(source).not.toContain('Gebruik A39');
        expect(source).not.toContain('MATH-UX-2 oefening');
    });
});
