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

describe('paragraph landing page student-web links', () => {
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

    test('hides Word downloads and legacy exercise rows when HTML counterparts exist', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg voorkennis.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws met visual.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} nieuws met visual.docx`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} samenvatting.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} samenvatting.docx`));
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

        const result = spawnSync(process.execPath, [BUILDER], {
            cwd: PLATFORM_ROOT,
            env: { ...process.env, MODULE_ROOT: tmpDir },
            encoding: 'utf8',
        });

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).not.toContain('Download als Word');
        expect(html).not.toContain('resource-card-type');
        expect(html).not.toMatch(/>html<\/span>/i);
        expect(html).not.toMatch(/href="[^"]+\.docx"/i);
        expect(html).not.toContain('Basisopgaven');
        expect(html).not.toContain('Middenopgaven');
        expect(html).not.toContain('Verrijkingsopgaven');
        expect(html).not.toContain('Vragen (docx)');
        expect(html).not.toContain('Antwoorden (docx)');
        expect(html).toContain('Download als PowerPoint');
        expect(html).toContain('begeleide%20inoefening.html');
        expect(html).toContain('data-layout="paragraaf-v2"');
        expect(html).toContain('data-route-layer="start"');
        expect(html).toContain('data-route-layer="learn"');
        expect(html).toContain('data-route-layer="practice"');
        expect(html).toContain('data-route-layer="deepen"');
        expect(html).not.toContain('data-route-layer="check"');
        expect(html).toContain('Start');
        expect(html).toContain('Leer');
        expect(html).toContain('Oefen');
        expect(html).toContain('Verdiep');
        expect(html).toContain('Kies wat je wilt trainen');
        expect(html).toContain('data-learning-aspect="reasoning"');
        expect(html).toContain('data-learning-aspect="calculation"');
        expect(html).toContain('data-learning-aspect="graphical"');
        expect(html).toContain('Redeneren');
        expect(html).toContain('Rekenen / stappenplan');
        expect(html).toContain('Grafieken');
        expect(html).toContain('stappenplan.html');
        expect(html).toContain('Volledige vaardigheidskaart');
        expect(html).toContain('Begeleide inoefening');
        expect(html).toContain('route-secondary-group');
        expect(html).not.toMatch(/\b(PV|A\d{2}|B\d{2}|adaptief|diagnostisch|diagnose|mastery|sequencing|summatief|AI)\b/i);

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
        expect(chapterHtml).toContain('Start');
        expect(chapterHtml).toContain('Leer');
        expect(chapterHtml).toContain('Oefen');
        expect(chapterHtml).toContain('Verdiep');
        expect(chapterHtml).not.toContain('Valkuilen en misvattingen');
    });

    test('routes consolidation pages to mixed practice instead of Verdiep-only', () => {
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

        const result = spawnSync(process.execPath, [BUILDER], {
            cwd: PLATFORM_ROOT,
            env: { ...process.env, MODULE_ROOT: tmpDir },
            encoding: 'utf8',
        });

        expect(result.status).toBe(0);
        const html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).toContain('data-layout="paragraaf-v2"');
        expect(html).toContain('data-route-layer="practice"');
        expect(html).toContain('data-consolidation-practice="true"');
        expect(html).toContain('Oefen gemengd');
        expect(html).toContain('Maak gemengde opgaven');
        expect(html).toContain('Gemengde opgaven');
        expect(html).not.toContain('data-route-layer="deepen"');
        expect(html).not.toContain('Verdiep');
        expect(html).not.toMatch(/\b(adaptief|diagnostisch|diagnose|mastery|sequencing|summatief|AI)\b/i);

        const chapterHtml = fs.readFileSync(path.join(tmpDir, '1.1 Hoofdstuk Test', 'index.html'), 'utf8');
        expect(chapterHtml).toContain('Oefen gemengd');
        expect(chapterHtml).not.toContain('Verdiep</span>');
    });

    test('shows Check only when a generated checkpoint page exists', () => {
        const paragraph = path.join(tmpDir, '1.1 Hoofdstuk Test', '1.1.1 Testparagraaf');
        fs.mkdirSync(paragraph, { recursive: true });
        const prefix = '1.1.1 Testparagraaf';

        writeFile(path.join(paragraph, `${prefix} ${DASH} uitleg vaardigheden.html`));
        writeFile(path.join(paragraph, `${prefix} ${DASH} redeneer-spel.html`));

        let result = spawnSync(process.execPath, [BUILDER], {
            cwd: PLATFORM_ROOT,
            env: { ...process.env, MODULE_ROOT: tmpDir },
            encoding: 'utf8',
        });
        expect(result.status).toBe(0);
        let html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).not.toContain('data-route-layer="check"');

        writeFile(path.join(paragraph, `${prefix} ${DASH} exit-ticket.html`));
        result = spawnSync(process.execPath, [BUILDER], {
            cwd: PLATFORM_ROOT,
            env: { ...process.env, MODULE_ROOT: tmpDir },
            encoding: 'utf8',
        });
        expect(result.status).toBe(0);
        html = fs.readFileSync(path.join(paragraph, 'index.html'), 'utf8');
        expect(html).toContain('data-route-layer="check"');
        expect(html).toContain('Korte check');
        expect(html).toContain('Kies wat je nog wilt oefenen');
        expect(html).toContain('Rond af met gerichte oefentips');
        expect(html).not.toMatch(/\b(PV|A\d{2}|B\d{2}|adaptief|diagnostisch|diagnose|mastery|sequencing|summatief|summative|AI)\b/i);
    });
});
