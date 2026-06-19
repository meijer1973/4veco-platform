const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const BUILDER = path.join(PLATFORM_ROOT, 'build-scripts', 'platform', 'build-newsdetective-shells.js');
const DASH = '\u2013';

const requiredMarkers = [
    'data-layout="news-detective-v2"',
    'app-shell',
    'sidebar',
    'content',
    'topbar',
    'hero',
    'hero-grid',
    'progress-rail',
    'screen-start',
    'screen-game',
    'game-layout',
    'article-dossier',
    'article-card',
    'round-card',
    'screen-result',
];

const forbiddenMarkers = [
    'nd-header',
    'nd-container',
    'nd-start-card',
    'nd-article-compact',
    'renderArticleCompact',
    '-webkit-line-clamp',
    'line-clamp',
    'back-to-overview',
    'href="#"',
];

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function writeSyntheticBook(root) {
    fs.mkdirSync(path.join(root, '9.9 Hoofdstuk Test', '9.9.1 Lang artikel'), { recursive: true });
    fs.mkdirSync(path.join(root, 'shared', 'newsdetective'), { recursive: true });
    fs.writeFileSync(path.join(root, 'deploy-config.json'), JSON.stringify({
        nr: 9,
        name: 'Fixture',
        chapters: [{ id: '9.9', folder: '9.9 Hoofdstuk Test', name: 'Test', number: 9, domain: 'teal' }],
        paragraphs: [{ id: '9.9.1', name: 'Lang artikel', chapter: '9.9', domain: 'teal' }],
    }, null, 2));

    const body = [
        'Lang artikel zin een met voldoende context voor ronde een.',
        'Lang artikel zin twee zodat de dossierkolom niet kan worden vervangen door een samenvatting.',
        'Lang artikel zin drie: de leerling moet deze tekst in elke ronde kunnen blijven lezen.',
        'Lang artikel zin vier: mobiele schermen mogen scrollen, maar de bron mag niet standaard inklappen.',
    ].join(' ');
    const data = {
        meta: { parNr: '9.9.1', parName: 'Lang artikel' },
        domainColors: { primary: '#17A2B8', primaryDk: '#117A8B', primaryLt: '#E8F8FB', accent: '#F8C471', navy: '#1E2761' },
        article: {
            headline: 'Lang nieuwsbericht',
            body,
            source: 'Fixture News',
            sourceDate: '18 juni 2026',
            sourceUrl: 'https://example.com/fixture',
            visualAlt: 'Fixture visual',
            facts: [{ value: 'Volledig', detail: 'niet ingeklapt' }],
        },
        rounds: [
            {
                type: 'concept',
                question: 'Welk concept past?',
                options: [
                    { text: 'Goed', correct: true, feedback: 'Goed.' },
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
                question: 'Welk model?',
                options: [
                    { id: 'goed', label: 'Goed', description: 'Past.', correct: true, feedback: 'Goed.' },
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
        lesLink: 'Terug naar de les.',
    };
    fs.writeFileSync(
        path.join(root, 'shared', 'newsdetective', '9.9.1.js'),
        `var NEWS_DETECTIVE_DATA = ${JSON.stringify(data, null, 2)};\n`
    );
    return { data, output: path.join(root, '9.9 Hoofdstuk Test', '9.9.1 Lang artikel', `9.9.1 Lang artikel ${DASH} nieuws-detective.html`) };
}

describe('News Detective V2 production UI', () => {
    test('source uses V2 structure and excludes legacy compact layout markers', () => {
        const ui = fs.readFileSync(path.join(PLATFORM_ROOT, 'engines', 'newsdetective-ui.js'), 'utf8');
        const css = fs.readFileSync(path.join(PLATFORM_ROOT, 'engines', 'newsdetective.css'), 'utf8');
        const shell = fs.readFileSync(BUILDER, 'utf8');
        const combined = `${ui}\n${css}\n${shell}`;

        for (const marker of ['news-detective-v2', 'article-dossier', 'game-layout', 'round-card', 'progress-rail']) {
            expect(combined).toContain(marker);
        }
        for (const marker of forbiddenMarkers) {
            expect(combined).not.toContain(marker);
        }
    });

    test('synthetic generated output keeps the complete article in the active game screen', () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nd-v2-ui-'));
        try {
            const { data, output } = writeSyntheticBook(tmp);
            const result = spawnSync(process.execPath, [BUILDER], {
                cwd: PLATFORM_ROOT,
                env: { ...process.env, MODULE_ROOT: tmp },
                encoding: 'utf8',
            });
            expect(result.status).toBe(0);

            const html = fs.readFileSync(output, 'utf8');
            const css = fs.readFileSync(path.join(tmp, 'shared', 'newsdetective.css'), 'utf8');
            const article = escapeHtml(data.article.body);

            for (const marker of requiredMarkers) expect(html).toContain(marker);
            for (const marker of forbiddenMarkers) {
                expect(html).not.toContain(marker);
                expect(css).not.toContain(marker);
            }
            expect(html.split(article).length - 1).toBeGreaterThanOrEqual(2);
            expect(html.match(/<section id="screen-game"[\s\S]*?<\/section>/)[0]).toContain(article);
            expect(html).toContain('https://example.com/fixture');
            expect(html).toContain('Fixture News');
            expect(html).toContain('18 juni 2026');
            expect(html).toContain('article-facts');
            expect(html).toContain('href="index.html"');
            expect(css).toMatch(/\.article-dossier\s*\{[\s\S]*position:\s*sticky/);
            expect(css).toMatch(/@media\s*\(max-width:[\s\S]*\.game-layout\s*\{[\s\S]*grid-template-columns:\s*1fr/);
        } finally {
            fs.rmSync(tmp, { recursive: true, force: true });
        }
    });
});
