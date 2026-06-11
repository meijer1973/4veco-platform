const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const BUILDER = path.join(PLATFORM_ROOT, 'build-scripts', 'platform', 'build-landing-page.js');
const DASH = '\u2013';

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

function expectV2Rows(html) {
    for (const row of ['start', 'skill-tree-games', 'leer', 'oefen', 'check', 'open-verdiep']) {
        expect(html).toContain(`data-route-layer="${row}"`);
    }
}

function expectNoLegacyParagraphStructure(html) {
    expect(html).toContain('data-layout="paragraph-landing-v2"');
    expect(html).not.toContain('data-layout="paragraaf-v2"');
    expect(html).not.toContain('route-secondary-group');
    expect(html).not.toContain('resource-card');
    expect(html).not.toContain('data-learning-aspect=');
}

describe('paragraph landing page V2 route replacement', () => {
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

    test('renders the V2 rows, preserves support links, and avoids legacy Word routes', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} instapquiz.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws-detective.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws met visual.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws met visual.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} samenvatting.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} samenvatting.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} youtube-videos.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} presentatie.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} presentatie.pptx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} stappenplan.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} wiskundevaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} grafiekenspel.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} begeleide inoefening.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} begeleide inoefening ${DASH} vragen.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} begeleide inoefening ${DASH} antwoorden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} basis ${DASH} vragen.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} basis ${DASH} antwoorden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} midden ${DASH} vragen.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} midden ${DASH} antwoorden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} verrijking ${DASH} vragen.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} verrijking ${DASH} antwoorden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} paragraaf.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} paragraaf.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.pdf`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expectNoLegacyParagraphStructure(html);
        expectV2Rows(html);
        for (const tile of [
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
        ]) {
            expect(html).toContain(`data-tile-id="${tile}"`);
        }

        expect(html).not.toContain('Download als Word');
        expect(html).not.toMatch(/href="[^"]+\.docx"/i);
        expect(html).not.toContain('Basisopgaven');
        expect(html).not.toContain('Middenopgaven');
        expect(html).not.toContain('Verrijkingsopgaven');
        expect(html).toContain('PowerPoint');
        expect(html).toContain('.pptx');
        expect(html).toContain('uitleg%20voorkennis.html');
        expect(html).toContain('stappenplan.html');
        expect(html).toContain('begeleide%20inoefening.html');
        expect(html).toContain('data-tile-id="adaptieve-oefenroute" data-tile-state="in-preparation"');
        expect(html).not.toMatch(/\b(PV|A\d{2}|B\d{2}|diagnostisch|diagnose|mastery|sequencing|summatief|AI)\b/i);

        const bookHtml = fs.readFileSync(path.join(tmpDir, 'index.html'), 'utf8');
        const chapterHtml = fs.readFileSync(path.join(tmpDir, '1.1 Hoofdstuk Test', 'index.html'), 'utf8');
        expect(bookHtml).toContain('class="chapter-card domain-economisch"');
        expect(bookHtml).toContain('data-domain="economisch"');
        expect(bookHtml).toContain('Korte route door de teststof.');
        expect(bookHtml).toContain('Verwar oefenen niet met nakijken.');
        expect(chapterHtml).toContain('class="para-card domain-economisch"');
        expect(chapterHtml).toContain('data-domain="economisch"');
        expect(chapterHtml).toContain('Web-first lesmateriaal voor deze paragraaf.');
        expect(chapterHtml).toContain('Gebruik de oude waarde als basis.');
        for (const label of ['Start', 'Skill-tree games', 'Leer', 'Oefen', 'Check', 'Open &amp; verdiep']) {
            expect(chapterHtml).toContain(label);
        }
        expect(chapterHtml).not.toContain('Valkuilen en misvattingen');
    });

    test('keeps an unscoped full-catalog skill tree out of the primary calculation route', () => {
        const configPath = path.join(tmpDir, 'deploy-config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.paragraphs[0].skilltree = { skills: null };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} wiskundevaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} stappenplan.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expectNoLegacyParagraphStructure(html);
        expectV2Rows(html);
        expect(html).toContain('data-tile-id="redeneren" data-tile-state="available"');
        expect(html).toContain('data-tile-id="rekenen" data-tile-state="in-preparation"');
        expect(html).toContain('stappenplan.html');
        expect(html).not.toContain('wiskundevaardigheden.html');
        expect(html).not.toContain('Rekenen / stappenplan');
    });

    test('routes consolidation pages through the same six-row V2 model', () => {
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
        writeFile(path.join(paragraph, `${prefix} ${DASH} opgaven.pdf`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} antwoorden.pdf`));

        const result = runBuilder(tmpDir);

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expectNoLegacyParagraphStructure(html);
        expectV2Rows(html);
        expect(html).toContain('data-tile-id="zelfstandige-oefeningen" data-tile-state="available"');
        expect(html).toContain('data-tile-id="opgaven-antwoorden" data-tile-state="available"');
        expect(html).toContain('data-tile-id="lesboek-openen" data-tile-state="in-preparation"');
        expect(html).toContain('opgaven.html');
        expect(html).toContain('antwoorden.html');
        expect(html).not.toContain('data-consolidation-practice="true"');
        expect(html).not.toContain('Oefen gemengd');
        expect(html).not.toMatch(/\b(diagnostisch|diagnose|mastery|sequencing|summatief|AI)\b/i);

        const chapterHtml = fs.readFileSync(path.join(tmpDir, '1.1 Hoofdstuk Test', 'index.html'), 'utf8');
        for (const label of ['Start', 'Skill-tree games', 'Leer', 'Oefen', 'Check', 'Open &amp; verdiep']) {
            expect(chapterHtml).toContain(label);
        }
    });

    test('renders Check placeholders and upgrades short-check and exit-ticket tiles independently', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));

        let result = runBuilder(tmpDir);
        expect(result.status).toBe(0);
        let html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expectNoLegacyParagraphStructure(html);
        expectV2Rows(html);
        expect(html).toContain('id="check" data-route-layer="check" data-row-ready="0" data-row-total="2"');
        expect(html).toContain('data-tile-id="korte-check" data-tile-state="in-preparation"');
        expect(html).toContain('data-tile-id="exit-ticket" data-tile-state="in-preparation"');

        writeFile(path.join(paragraph, `${prefix} ${DASH} exit-ticket.html`));
        result = runBuilder(tmpDir);
        expect(result.status).toBe(0);
        html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).toContain('id="check" data-route-layer="check" data-row-ready="1" data-row-total="2"');
        expect(html).toContain('data-tile-id="korte-check" data-tile-state="in-preparation"');
        expect(html).toContain('data-tile-id="exit-ticket" data-tile-state="available"');
        expect(html).toContain('exit-ticket.html');
        expect(html).toContain('Maak de eindcheck met dezelfde soort denkstappen als de paragraafopgave.');
        expect(html).not.toContain('Maak de volledige paragraaf-check');

        writeFile(path.join(paragraph, `${prefix} ${DASH} korte-check.html`));
        result = runBuilder(tmpDir);
        expect(result.status).toBe(0);
        html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).toContain('id="check" data-route-layer="check" data-row-ready="2" data-row-total="2"');
        expect(html).toContain('data-tile-id="korte-check" data-tile-state="available"');
        expect(html).toContain('data-tile-id="exit-ticket" data-tile-state="available"');
        expect(html).toContain('korte-check.html');
        expect(html).toContain('exit-ticket.html');
        expect(html).toContain('Krijg lokaal oefenadvies. Dit is geen eindcheck en geen cijfer.');
        expect(html).not.toContain('Kies wat je nog wilt oefenen');
        expect(html).not.toMatch(/\b(PV|A\d{2}|B\d{2}|diagnostisch|diagnose|mastery|sequencing|summatief|summative|AI)\b/i);
    });
});
