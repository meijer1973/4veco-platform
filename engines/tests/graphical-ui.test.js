/**
 * Source-level safeguards for the graphical-game UI.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'graphical-ui.js'), 'utf8');
const shellSource = fs.readFileSync(path.join(__dirname, '..', '..', 'build-scripts', 'platform', 'build-graphical-shells.js'), 'utf8');

describe('graphical ui safeguards', () => {
    test('answer placeholders do not reveal expected answers', () => {
        expect(source).not.toMatch(/placeholder="[^"]*expected_answer\.value/);
        expect(source).not.toContain('placeholder="Bijvoorbeeld \' + escapeHtml(formatNumber(challenge.expected_answer.value)) + \'"');
        expect(source).toContain('placeholder="Typ je antwoord"');
        expect(source).toContain('placeholder="Typ je percentage"');
    });

    test('percentage challenges require explicit old and new value selection', () => {
        expect(source).toContain('Kies oude waarde');
        expect(source).toContain('Kies nieuwe waarde');
        expect(source).toContain('id="g-old-label" required');
        expect(source).toContain('id="g-new-label" required');
        expect(source).not.toContain('document.getElementById("g-old-label").value = challenge.graph.series[0].label');
        expect(source).not.toContain('document.getElementById("g-new-label").value = challenge.graph.series[challenge.graph.series.length - 1].label');
    });

    test('final challenge feedback renders before the summary screen', () => {
        expect(source).toContain('if (engine.isComplete() && !lastResult)');
        expect(source).not.toContain('if (engine.isComplete()) {');
        expect(source).toContain("engine.index === data.challenges.length - 1 ? 'Bekijk resultaat'");
    });

    test('supports a shared skill-map route and less-labelled graph variants', () => {
        expect(source).toContain('SkillMapRouteUI.renderRequest');
        expect(source).toContain('SkillMapRouteUI.getRouteOptions("graphical"');
        expect(source).toContain('graph.show_value_labels !== false');
        expect(source).toContain('renderYAxisTicks');
    });

    test('uses the shared task shell in graph practice output', () => {
        expect(shellSource).toContain('task-shell.css');
        expect(shellSource).toContain('task-shell-engine.js');
        expect(shellSource).toContain('task-shell-ui.js');
        expect(source).toContain('TaskShellUI.renderTask');
        expect(source).toContain('engine.evaluateTaskShellResponse');
        expect(source).toContain('data-graph-task-shell="GRAPH-UX-2"');
        expect(source).toContain('unitNotation: getValue');
        expect(source).toContain('data-input-role="unit-notation"');
        expect(source).toContain('task.family === "cloze_tile_select"');
        expect(source).toContain('collectClozeTileResponse(rootEl, task)');
        expect(source).toContain('task.family === "cloze_text"');
        expect(source).toContain('collectClozeTextResponse(rootEl, task)');
        expect(source).toContain('task.family === "multi_select"');
        expect(source).toContain('collectMultiSelectResponse(rootEl, task)');
        expect(source).toContain('handleMultiSelectClick(rootEl, event)');
        expect(source).toContain('handleClozeTileClick(rootEl, event)');
        expect(source).toContain('task.family === "sentence_builder"');
        expect(source).toContain('collectSentenceBuilderResponse(rootEl, task)');
        expect(source).toContain('handleSentenceBuilderClick(rootEl, event)');
        expect(source).toContain('task.family === "formula_builder"');
        expect(source).toContain('collectFormulaBuilderResponse(rootEl, task)');
        expect(source).toContain('handleFormulaBuilderClick(rootEl, event)');
        expect(source).toContain('task.family === "step_ordering"');
        expect(source).toContain('collectStepOrderingResponse(rootEl, task)');
        expect(source).toContain('handleStepOrderingClick(rootEl, event)');
        expect(source).toContain('task.family === "matching_pairs"');
        expect(source).toContain('collectMatchingPairsResponse(rootEl, task)');
        expect(source).toContain('handleMatchingPairsClick(rootEl, event)');
        expect(source).toContain('task.family === "source_value_selection"');
        expect(source).toContain('collectSourceValueSelectionResponse(rootEl, task)');
        expect(source).toContain('handleSourceValueSelectionClick(rootEl, event)');
        expect(source).toContain('task.family === "source_chain_builder"');
        expect(source).toContain('collectSourceChainBuilderResponse(rootEl, task)');
        expect(source).toContain('handleSourceChainBuilderClick(rootEl, event)');
        expect(source).toContain('task.family === "label_placement"');
        expect(source).toContain('collectLabelPlacementResponse(rootEl, task)');
        expect(source).toContain('handleLabelPlacementClick(rootEl, event)');
    });

    test('announces task-shell feedback and preserves keyboard flow after checking', () => {
        expect(source).toContain('id="g-task-feedback"');
        expect(source).toContain('aria-label="Feedback op je antwoord"');
        expect(source).toContain('role="status"');
        expect(source).toContain('feedbackRegion.focus');
        expect(source).toContain('preventScroll: true');
        expect(source).toContain('focusFeedbackAfterRender = true');
        expect(source).toContain('other.setAttribute("aria-pressed", "false")');
        expect(source).toContain('Lees de bron, geef je antwoord en kijk rustig na wat je volgende stap is.');
        expect(source).not.toContain('Gebruik dezelfde taakvorm als in de paragraaf-check');
    });
});
