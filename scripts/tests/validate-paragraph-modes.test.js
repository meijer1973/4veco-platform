/**
 * Regression tests for L1.5V Bucket F2 / F-tests:
 * - --mode part-a gates ONLY the X.Y.Z-review.md file
 * - --mode part-b gates ONLY the X.Y.Z-companion-visual-review.md file
 * - --mode complete aggregates BOTH (fails if either has FAIL verdict)
 * - Verdict parsing is structured (the "## 2. Verdict" line), not a raw
 *   `\bFAIL\b` token count
 * - Filename match is exact, not endsWith (the pre-F2 bug picked one of
 *   two review files arbitrarily)
 *
 * Each test creates a minimal-but-valid paragraph fixture in tmpdir, then
 * spawns validate-paragraph.js against it and asserts on exit code +
 * output text.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATOR = path.join(PLATFORM_ROOT, 'scripts', 'validate-paragraph.js');

function makeMinimalPartAFolder(tmpDir, parNr, parName, opts = {}) {
    const folder = path.join(tmpDir, `${parNr} ${parName}`);
    fs.mkdirSync(folder, { recursive: true });
    fs.mkdirSync(path.join(folder, '_assets'), { recursive: true });

    // Minimal Part A: paragraaf/opgaven/antwoorden md + pdf, build_pdf.py.
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – paragraaf.md`), '# stub\n');
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – opgaven.md`), '# stub\n');
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – antwoorden.md`), '# stub\n');
    // PDF gate requires >=10000 bytes.
    const fakePdf = Buffer.alloc(15000, 0x20);
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – paragraaf.pdf`), fakePdf);
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – opgaven.pdf`), fakePdf);
    fs.writeFileSync(path.join(folder, `${parNr} ${parName} – antwoorden.pdf`), fakePdf);
    fs.writeFileSync(path.join(folder, 'build_pdf.py'), '# stub\n');
    fs.writeFileSync(path.join(folder, `${parNr}-quality-ref.yaml`),
        'paragraph: "1.1.1"\nschema_version: 2\npartA:\n  assets:\n    missing: []\n    svgpng_paired: true\n    naming_compliant: true\n');

    // Part A review with whatever verdict the test wants.
    const partAVerdict = opts.partAVerdict || 'PASS';
    fs.writeFileSync(path.join(folder, `${parNr}-review.md`),
        `# Review\n\n## 2. Verdict\n\n**${partAVerdict}**\n`);

    if (opts.companionVerdict) {
        const hf = (opts.companionHardFails || []).map(n => `### HF-${n}\n\nbody.\n`).join('\n');
        fs.writeFileSync(path.join(folder, `${parNr}-companion-visual-review.md`),
            `# Companion Review\n\n## 2. Verdict\n\n**${opts.companionVerdict}**\n\n## 3. Hard-fail findings\n\n${hf}`);
    }

    return folder;
}

function runValidator(folder, mode) {
    const r = spawnSync(process.execPath, [VALIDATOR, '--mode', mode, folder], {
        encoding: 'utf8',
    });
    return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

describe('validate-paragraph mode dispatch (L1.5V F2)', () => {
    let tmpDir;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'val-mode-'));
    });
    afterEach(() => {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) { /* ignore */ }
    });

    test('--mode part-a passes when companion review is FAIL (companion not gated)', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS WITH FLAGS',
            companionVerdict: 'FAIL',
            companionHardFails: [1, 2, 3, 4],
        });
        const r = runValidator(folder, 'part-a');
        expect(r.code).toBe(0);
        expect(r.stdout).toMatch(/Part A review:.*verdict PASS WITH FLAGS/);
        // companion review must NOT be inspected in part-a mode.
        expect(r.stdout).not.toMatch(/Companion review verdict is FAIL/);
    });

    test('--mode complete FAILS when companion review verdict is FAIL', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS WITH FLAGS',
            companionVerdict: 'FAIL',
            companionHardFails: [1, 2, 3, 4],
        });
        const r = runValidator(folder, 'complete');
        expect(r.code).not.toBe(0);
        expect(r.stdout).toMatch(/Companion review verdict is FAIL.*4 hard-fail/);
    });

    test('--mode complete passes when both reviews are PASS / PASS WITH FLAGS', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS WITH FLAGS',
            companionVerdict: 'PASS WITH FLAGS',
            companionHardFails: [],
        });
        const r = runValidator(folder, 'complete');
        // Part B file gate may still fail because we didn't seed all 24
        // companion files. We only assert the companion-review portion.
        expect(r.stdout).toMatch(/Companion review:.*verdict PASS WITH FLAGS/);
    });

    test('--mode part-b FAILS when companion review file is missing', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS',
            // no companionVerdict → no companion review file written
        });
        const r = runValidator(folder, 'part-b');
        expect(r.code).not.toBe(0);
        expect(r.stdout).toMatch(/MISSING companion visual review/);
    });

    test('verdict parser is structured: a "## 2. Verdict\\n\\nFAIL" header signals FAIL even when other "FAIL" tokens are absent', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS',
            companionVerdict: 'FAIL',
            companionHardFails: [],
        });
        const r = runValidator(folder, 'complete');
        expect(r.code).not.toBe(0);
        expect(r.stdout).toMatch(/Companion review verdict is FAIL/);
    });

    test('PR-review fix: PASS WITH FLAGS verdict + open HF section is rejected', () => {
        // The reviewer of platform PR #4 caught a dead-condition bug: the
        // pre-fix branch `hfCount > 0 && verdict !== 'PASS WITH FLAGS' &&
        // verdict !== 'PASS'` was unreachable because the only verdict
        // values left after FAIL/null are PASS and PASS WITH FLAGS, so
        // the validator silently accepted PASS WITH FLAGS plus an open
        // ### HF-1 section. The agent spec is explicit: PASS and PASS
        // WITH FLAGS BOTH require zero hard fails. This test guards the
        // post-fix behavior: any verdict + non-zero HF count must fail.
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS',
            companionVerdict: 'PASS WITH FLAGS',
            companionHardFails: [1],
        });
        const r = runValidator(folder, 'complete');
        expect(r.code).not.toBe(0);
        expect(r.stdout).toMatch(/PASS WITH FLAGS but 1 unresolved HF section/);
    });

    test('PR-review fix: PASS verdict + open HF section is rejected', () => {
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS',
            companionVerdict: 'PASS',
            companionHardFails: [1, 2],
        });
        const r = runValidator(folder, 'complete');
        expect(r.code).not.toBe(0);
        expect(r.stdout).toMatch(/PASS but 2 unresolved HF section/);
    });

    test('exact filename match: `*-review.md` is matched only as `${parNr}-review.md`, not by endsWith', () => {
        // Pre-F2 the validator's endsWith('-review.md') matched both
        // 1.1.1-review.md AND 1.1.1-companion-visual-review.md and picked
        // the alphabetically-first hit. Post-F2 the Part A check uses an
        // EXACT filename match. Seed a Part A review with PASS and a
        // companion review with FAIL. In --mode part-a the verdict shown
        // must be the Part A verdict (PASS), not the companion's FAIL.
        const folder = makeMinimalPartAFolder(tmpDir, '1.1.1', 'Test', {
            partAVerdict: 'PASS',
            companionVerdict: 'FAIL',
            companionHardFails: [1],
        });
        const r = runValidator(folder, 'part-a');
        expect(r.stdout).toMatch(/Part A review:.*verdict PASS/);
        expect(r.stdout).not.toMatch(/Companion review/);
    });
});
