/**
 * Regression test for L1.5D D1 PR-3 review finding:
 *
 *   Issue: convert_samenvatting.py / convert_nieuws.py used to print
 *   "ERROR ..." on parse failures and return False, but main() ran on
 *   regardless and exit 0. scripts/deploy.js's runDocxConverters then
 *   counted the run as OK (anything that wasn't matched by the OK/SKIP
 *   regex fell through to okCount++).
 *
 * This test enforces two contracts:
 *
 *   1. Each Python converter must exit non-zero when it cannot parse
 *      its input docx. We trigger this by pointing the converter at a
 *      paragraph folder that contains a malformed (non-zip-archive)
 *      *.docx — python-docx raises Package not found.
 *
 *   2. Each converter must exit zero when there is nothing to do (no
 *      matching docx in the folder). That's the SKIP path; deploy
 *      shouldn't blow up just because most paragraphs don't carry a
 *      samenvatting yet.
 *
 * Skipped automatically if Python is not on the runner's PATH.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

function pythonAvailable() {
    const r = spawnSync(PYTHON, ['--version'], { stdio: 'ignore' });
    return r.status === 0;
}

const converters = [
    { name: 'convert_samenvatting', script: 'build-scripts/lib/convert_samenvatting.py', filename: '1.1.1 Test – samenvatting.docx' },
    { name: 'convert_nieuws',       script: 'build-scripts/lib/convert_nieuws.py',       filename: '1.1.1 Test – nieuws met visual.docx' },
];

const describeOrSkip = pythonAvailable() ? describe : describe.skip;

describeOrSkip('docx-as-web converter exit codes', () => {
    let tmpDir;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'converter-exit-'));
        fs.mkdirSync(path.join(tmpDir, '_assets'), { recursive: true });
    });

    afterEach(() => {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) { /* ignore */ }
    });

    for (const conv of converters) {
        describe(conv.name, () => {
            test('exits 0 when no matching docx is present (SKIP path)', () => {
                const r = spawnSync(PYTHON, [conv.script, tmpDir], {
                    cwd: PLATFORM_ROOT,
                    encoding: 'utf8',
                });
                expect(r.status).toBe(0);
                expect(r.stdout + r.stderr).toMatch(/SKIP\b/);
            });

            test('exits non-zero when the docx is malformed (ERROR path)', () => {
                fs.writeFileSync(path.join(tmpDir, conv.filename), 'not a real docx, not a zip', 'utf8');
                const r = spawnSync(PYTHON, [conv.script, tmpDir], {
                    cwd: PLATFORM_ROOT,
                    encoding: 'utf8',
                });
                expect(r.status).not.toBe(0);
                expect(r.stdout + r.stderr).toMatch(/ERROR\b/);
            });
        });
    }
});
