/**
 * Source-level safeguards for the reasoning-game UI task-shell integration.
 */
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'reasoning-ui.js'), 'utf8');
const engineSource = fs.readFileSync(path.join(__dirname, '..', 'reasoning-engine.js'), 'utf8');
const shellSource = fs.readFileSync(path.join(__dirname, '..', '..', 'build-scripts', 'platform', 'build-reasoning-engine.js'), 'utf8');

describe('reasoning ui task-shell safeguards', () => {
    test('loads the shared task shell in reasoning practice shells', () => {
        expect(shellSource).toContain('task-shell.css');
        expect(shellSource).toContain('task-shell-engine.js');
        expect(shellSource).toContain('task-shell-ui.js');
    });

    test('adds a structured reasoning mode without hiding existing modes', () => {
        expect(engineSource).toContain('Build Reasoning Answer');
        expect(engineSource).toContain('Redeneerantwoord opbouwen');
        expect(engineSource).toContain('structured_reasoning');
        expect(source).toContain('for (var i = 0; i < modeNames.length; i++)');
        expect(source).not.toContain('for (var i = 0; i < 5; i++)');
    });

    test('renders shared task-shell mode and neutral feedback', () => {
        expect(source).toContain('TaskShellUI.renderTask');
        expect(source).toContain('data-reasoning-task-shell="REASON-UX-2"');
        expect(source).toContain('data-reasoning-task-shell="REASON-ADOPT-1"');
        expect(source).toContain('bindStandardOrderingTask');
        expect(source).toContain('TaskShellUI.handleStepOrderingClick');
        expect(source).toContain('TaskShellUI.collectStepOrderingResponse');
        expect(source).toContain('standardOrderingToLegacyAnswer');
        expect(source).toContain('TaskShellEngine.evaluateTask');
        expect(source).toContain('TaskShellUI.renderFeedback');
        expect(source).toContain('renderTaskShellFeedback');
        expect(source).toContain('preventScroll: true');
    });

    test('adopts only reviewed step-ordering modes and keeps held modes private', () => {
        expect(source).toContain('case 0: content = hasStandardOrderingTask() ? renderStandardOrderingTask');
        expect(source).toContain('case 1: content = hasStandardOrderingTask() ? renderStandardOrderingTask');
        expect(source).toContain('case 3: content = hasStandardOrderingTask() ? renderStandardOrderingTask');
        expect(source).toContain('case 2: content = renderFindError(); break;');
        expect(source).toContain('case 4: content = renderMatchStructures(); break;');
        expect(source).toContain('currentMode === 0 || currentMode === 1 || currentMode === 3');
        expect(source).toContain('.ts-step-token, .ts-step-remove, .ts-step-move, .ts-step-clear');
    });

    test('keeps structured reasoning self-check separate from goed progress', () => {
        expect(engineSource).toContain('selfCheckOnly: true');
        expect(engineSource).toContain('completed: taskShellResult.state ===');
        expect(engineSource).toContain('if (result.correct && !result.selfCheckOnly)');
        expect(source).toContain('if (!result.selfCheckOnly)');
        expect(source).toContain('Redeneerantwoorden geoefend');
        expect(source).toContain('zelfcheck');
    });

    test('does not place self-check result logic inside scored progress persistence', () => {
        const saveStart = source.indexOf('function saveAnswerProgress');
        const masteryStart = source.indexOf('function getMasteryLevel');
        const saveBlock = source.slice(saveStart, masteryStart);
        const resultsStart = source.indexOf('function showResults');
        const utilityStart = source.indexOf('function esc');
        const resultsBlock = source.slice(resultsStart, utilityStart);
        expect(saveBlock).not.toContain('result.selfCheckOnlyMode');
        expect(saveBlock).not.toContain('breakdownEl');
        expect(resultsBlock).toContain('result.selfCheckOnlyMode');
        expect(resultsBlock).toContain('Redeneerantwoorden geoefend');
    });

    test('feedback explains reasoning repair instead of only revealing answers', () => {
        expect(source).toContain('formatStepList');
        expect(source).toContain('formatFlowList');
        expect(source).toContain('formatMatchGuide');
        expect(source).toContain('Vergelijk je keuze met de denkroute');
        expect(source).toContain('Voorbeeldroute om mee te vergelijken');
    });

    test('does not add target-equivalent or diagnostic product claims', () => {
        expect(source).not.toContain('eindopgave');
        expect(source).not.toContain('aankunt');
        expect(source).not.toContain('bewezen');
        expect(source).not.toContain('aangetoond');
        expect(source).not.toContain('diagnose');
        expect(source).not.toContain('summatief');
    });
});
