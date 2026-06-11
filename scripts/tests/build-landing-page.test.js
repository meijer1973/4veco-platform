const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const BUILDER = path.join(PLATFORM_ROOT, 'build-scripts', 'platform', 'build-landing-page.js');
const DASH = '\u2013';

const REQUIRED_TILE_IDS = [
    'instapquiz',
    'nieuwsdetective',
    'redeneren',
    'rekenen',
    'grafieken',
    'uitleg-vaardigheden',
    'presentatie',
    'skill-engine',
    'begeleide-oefeningen',
    'zelfstandige-oefeningen',
    'adaptieve-oefenroute',
    'korte-check',
    'exit-ticket',
    'lesboek-openen',
    'opgaven-antwoorden',
    'aanvullend-materiaal',
];

function writeFile(filePath, body = 'stub') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, body);
}

function runBuilder(moduleRoot) {
    return spawnSync(process.execPath, [BUILDER], {
        cwd: PLATFORM_ROOT,
        env: { ...process.env, MODULE_ROOT: moduleRoot },
        encoding: 'utf8',
    });
}

function tileBlock(html, tileId) {
    const match = html.match(new RegExp(`<(?:a|article)[^>]*data-tile-id="${tileId}"[\\s\\S]*?</(?:a|article)>`));
    return match ? match[0] : '';
}

describe('paragraph landing V2 prototype port', () => {
    let tmpDir;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'landing-page-'));
        fs.mkdirSync(path.join(tmpDir, '1.1 Hoofdstuk Test'), { recursive: true });
        fs.writeFileSync(path.join(tmpDir, 'deploy-config.json'), JSON.stringify({
            nr: 9,
            name: 'Fixture',
            chapters: [
                {
                    id: '1.1',
                    folder: '1.1 Hoofdstuk Test',
                    name: 'Test',
                    number: '1',
                    domain: 'amber',
                    landing: {
                        summary: 'Korte route door de teststof.',
                        pitfalls: ['Verwar oefenen niet met nakijken.'],
                    },
                },
            ],
            paragraphs: [
                {
                    id: '1.1.1',
                    name: 'Testparagraaf',
                    chapter: '1.1',
                    domain: 'amber',
                    skilltree: {
                        skills: ['A38', 'A39'],
                    },
                    landing: {
                        summary: 'Web-first lesmateriaal voor deze paragraaf.',
                        pitfalls: ['Gebruik de oude waarde als basis.'],
                    },
                },
            ],
        }, null, 2));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('emits the approved prototype structure instead of the legacy lesson shell', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} instapquiz.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws-detective.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} presentatie.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} presentatie.pptx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} stappenplan.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} wiskundevaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} grafiekenspel.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} begeleide inoefening.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} korte-check.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} exit-ticket.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} paragraaf.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} paragraaf.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} samenvatting.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws met visual.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} youtube-videos.html`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');

        for (const marker of ['app-shell', 'route-strip', 'learning-row', 'row-label', 'tile-grid', 'tile']) {
            expect(html).toContain(marker);
        }
        for (const forbidden of [
            'page-layout',
            'sidebar-toggle',
            'sidebar-overlay',
            'resource-card',
            'route-secondary-group',
            'landing-v2-',
            'data-layout="paragraaf-v2"',
            '../../shared/voorkennis.css',
        ]) {
            expect(html).not.toContain(forbidden);
        }
        expect(html).toContain('html[data-theme="dark"]');
        expect((html.match(/class="learning-row"/g) || []).length).toBe(6);
        expect((html.match(/data-tile-id="/g) || []).length).toBe(16);
        for (const tileId of REQUIRED_TILE_IDS) {
            expect(html).toContain(`data-tile-id="${tileId}"`);
        }
        expect(tileBlock(html, 'adaptieve-oefenroute')).toContain('data-tile-state="in-preparation"');
        expect(tileBlock(html, 'adaptieve-oefenroute')).not.toMatch(/\shref=/);
        expect(html).not.toMatch(/\b(PV|diagnostisch|diagnose|mastery|sequencing|summatief|summative|AI)\b/i);

        const chapterHtml = fs.readFileSync(path.join(tmpDir, '1.1 Hoofdstuk Test', 'index.html'), 'utf8');
        expect(chapterHtml).toContain('Skill-tree games');
        expect(chapterHtml).toContain('Open &amp; verdiep');
    });

    test('renders missing future surfaces as disabled placeholders with no href', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} instapquiz.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect((html.match(/class="learning-row"/g) || []).length).toBe(6);
        expect((html.match(/data-tile-id="/g) || []).length).toBe(16);

        for (const tileId of ['nieuwsdetective', 'rekenen', 'grafieken', 'skill-engine', 'adaptieve-oefenroute', 'korte-check', 'exit-ticket']) {
            const block = tileBlock(html, tileId);
            expect(block).toContain('data-tile-state="in-preparation"');
            expect(block).toContain('aria-disabled="true"');
            expect(block).not.toMatch(/\shref=/);
        }
        expect(tileBlock(html, 'instapquiz')).toContain('href="1.1.1%20Testparagraaf%20%E2%80%93%20instapquiz.html"');
        expect(html).not.toContain('href="#"');
    });

    test('keeps an unscoped full-catalog skill tree out of primary route tiles', () => {
        const configPath = path.join(tmpDir, 'deploy-config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.paragraphs[0].skilltree = { skills: null };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} wiskundevaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(tileBlock(html, 'rekenen')).toContain('data-tile-state="in-preparation"');
        expect(tileBlock(html, 'rekenen')).not.toContain('wiskundevaardigheden.html');
        expect(tileBlock(html, 'skill-engine')).toContain('data-tile-state="in-preparation"');
        expect(tileBlock(html, 'skill-engine')).not.toContain('wiskundevaardigheden.html');
    });

    test('renders consolidation pages through the same six-row prototype route', () => {
        const configPath = path.join(tmpDir, 'deploy-config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.paragraphs = [
            {
                id: '1.1.4',
                name: 'Gemengde opgaven',
                chapter: '1.1',
                domain: 'teal',
            },
        ];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.4 Gemengde opgaven');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.4 Gemengde opgaven';
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.html`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).toContain('class="app-shell"');
        expect((html.match(/class="learning-row"/g) || []).length).toBe(6);
        expect((html.match(/data-tile-id="/g) || []).length).toBe(16);
        expect(tileBlock(html, 'zelfstandige-oefeningen')).toContain('data-tile-state="available"');
        expect(tileBlock(html, 'lesboek-openen')).toContain('data-tile-state="in-preparation"');
        expect(html).not.toContain('data-consolidation-practice="true"');
        expect(html).not.toContain('Oefen gemengd');
    });
});
