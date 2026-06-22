const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const NewsDetectiveEngine = require('../newsdetective-engine');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');

function makeData() {
    return {
        meta: { parNr: '9.9.1', parName: 'Interactietest' },
        article: {
            headline: 'Testartikel',
            body: 'Een volledig testartikel blijft beschikbaar tijdens elke ronde.',
            source: 'Fixture',
            sourceDate: '2026',
            sourceUrl: 'https://example.com/news',
        },
        rounds: [
            {
                type: 'concept',
                question: 'Welk concept past?',
                options: [
                    { text: 'Goed concept', correct: true, feedback: 'Goed.' },
                    { text: 'Fout A', correct: false, feedback: 'Nee.' },
                    { text: 'Fout B', correct: false, feedback: 'Nee.' },
                    { text: 'Fout C', correct: false, feedback: 'Nee.' },
                ],
            },
            {
                type: 'consequence',
                question: 'Orden de keten.',
                chain: [
                    { text: 'Stap 1', position: 0 },
                    { text: 'Stap 2', position: 1 },
                    { text: 'Stap 3', position: 2 },
                    { text: 'Stap 4', position: 3 },
                ],
                distractors: [{ text: 'Afleider 1' }, { text: 'Afleider 2' }],
            },
            {
                type: 'model',
                question: 'Welk model past?',
                options: [
                    { id: 'goed', label: 'Goed model', description: 'Past.', correct: true, feedback: 'Goed.' },
                    { id: 'fout-a', label: 'Fout A', description: 'Past niet.', correct: false, feedback: 'Nee.' },
                    { id: 'fout-b', label: 'Fout B', description: 'Past niet.', correct: false, feedback: 'Nee.' },
                ],
            },
            {
                type: 'error',
                question: 'Welke zin klopt niet?',
                fakeAnalysis: 'De analyse zegt dat er geen keuze nodig is en dat alternatieven gratis zijn.',
                errorPhrase: 'geen keuze nodig',
                errorExplanation: 'Er is juist keuze nodig.',
                distractorPhrases: ['alternatieven gratis zijn', 'De analyse zegt'],
            },
        ],
    };
}

function createDom() {
    const dom = new JSDOM(`<!doctype html>
<html data-theme="light">
<body data-layout="news-detective-v2">
  <div id="nd-app" class="app-shell">
    <button id="themeToggle" type="button">Licht / donker</button>
    <div id="progressRail"></div>
    <section id="screen-start" class="screen">
      <h1 id="startTitle"></h1>
      <div id="startArticle"></div>
      <button id="startBtn" type="button">Start</button>
    </section>
    <section id="screen-game" class="screen">
      <div id="gameArticle"></div>
      <div id="roundCard"></div>
    </section>
    <section id="screen-result" class="screen">
      <div id="resultCard"></div>
    </section>
  </div>
</body>
</html>`, {
        runScripts: 'outside-only',
        url: 'https://example.test/news-detective.html',
        pretendToBeVisual: true,
    });

    dom.window.NEWS_DETECTIVE_DATA = makeData();
    dom.window.NewsDetectiveEngine = NewsDetectiveEngine;
    dom.window.eval(fs.readFileSync(path.join(PLATFORM_ROOT, 'engines', 'newsdetective-ui.js'), 'utf8'));
    return dom;
}

function buttonByText(document, selector, text) {
    const button = Array.from(document.querySelectorAll(selector))
        .find((candidate) => candidate.textContent.includes(text));
    if (!button) throw new Error(`Missing ${selector} containing ${text}`);
    return button;
}

function clickButton(document, selector) {
    const button = document.querySelector(selector);
    if (!button) throw new Error(`Missing ${selector}`);
    button.click();
    return button;
}

describe('News Detective V2 reset interactions', () => {
    test('reset cannot reopen an answered concept round and next still advances', () => {
        const dom = createDom();
        const { document } = dom.window;
        const errors = [];
        dom.window.addEventListener('error', (event) => errors.push(event.error || event.message));

        clickButton(document, '#startBtn');
        const correct = buttonByText(document, '[data-action="concept"]', 'Goed concept');
        correct.click();

        expect(Array.from(document.querySelectorAll('[data-action="concept"]')).every((button) => button.disabled)).toBe(true);
        expect(document.querySelector('[data-action="reset-round"]')).toBeNull();

        clickButton(document, '#nextBtn');
        expect(document.querySelector('.round-badge').textContent).toContain('Ronde 2');
        expect(errors).toEqual([]);
    });

    test('incomplete consequence chain can be reset before first submission', () => {
        const dom = createDom();
        const { document } = dom.window;
        const errors = [];
        dom.window.addEventListener('error', (event) => errors.push(event.error || event.message));

        clickButton(document, '#startBtn');
        buttonByText(document, '[data-action="concept"]', 'Goed concept').click();
        clickButton(document, '#nextBtn');

        buttonByText(document, '[data-action="chain-place"]', 'Stap 1').click();
        buttonByText(document, '[data-action="chain-place"]', 'Stap 2').click();
        expect(document.querySelectorAll('.chain-slot.filled')).toHaveLength(2);

        const reset = clickButton(document, '[data-action="reset-round"]');
        expect(reset.disabled).toBe(false);
        expect(document.querySelectorAll('.chain-slot.filled')).toHaveLength(0);

        for (const step of ['Stap 1', 'Stap 2', 'Stap 3', 'Stap 4']) {
            buttonByText(document, '[data-action="chain-place"]', step).click();
        }
        expect(document.querySelector('#checkChain').disabled).toBe(false);
        clickButton(document, '#checkChain');

        const hiddenReset = document.querySelector('[data-action="reset-round"]');
        expect(hiddenReset.disabled).toBe(true);
        expect(hiddenReset.style.display).toBe('none');
        expect(document.querySelector('#nextBtn').style.display).toBe('inline-flex');
        expect(errors).toEqual([]);
    });
});
