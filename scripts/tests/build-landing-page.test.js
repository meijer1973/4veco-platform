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
                { id: '1.1', folder: '1.1 Hoofdstuk Test', name: 'Test', number: '1', domain: 'amber' },
            ],
            paragraphs: [
                { id: '1.1.1', name: 'Testparagraaf', chapter: '1.1', domain: 'amber' },
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
        expect(html).not.toMatch(/href="[^"]+\.docx"/i);
        expect(html).not.toContain('Basisopgaven');
        expect(html).not.toContain('Middenopgaven');
        expect(html).not.toContain('Verrijkingsopgaven');
        expect(html).not.toContain('Vragen (docx)');
        expect(html).not.toContain('Antwoorden (docx)');
        expect(html).toContain('Download als PowerPoint');
        expect(html).toContain('begeleide%20inoefening.html');
    });
});
