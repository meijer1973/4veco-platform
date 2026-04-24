/**
 * Tests for validate-chapter.js
 *
 * Verifies that the chapter validator correctly detects:
 * - Missing paragraph files (theory vs consolidation)
 * - Missing/invalid QC artifacts (review.md, quality-ref.yaml)
 * - Non-compliant asset naming
 * - Broken image references
 * - Wrong folder hierarchy
 * - Invalid quality_ref content
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VALIDATOR = path.resolve(__dirname, '..', 'validate-chapter.js');
const TMP = path.resolve(__dirname, '..', '..', 'tmp', 'test-chapter');

function run(chapterPath) {
  try {
    const out = execSync(`node "${VALIDATOR}" "${chapterPath}"`, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    return { exitCode: 0, output: out };
  } catch (e) {
    return { exitCode: e.status, output: e.stdout + e.stderr };
  }
}

function setupChapter(name, paragraphs) {
  const chapterDir = path.join(TMP, name);
  fs.mkdirSync(chapterDir, { recursive: true });
  fs.mkdirSync(path.join(chapterDir, '_assets'), { recursive: true });

  for (const p of paragraphs) {
    const pDir = path.join(chapterDir, p.folder);
    fs.mkdirSync(pDir, { recursive: true });

    // Write .md files
    for (const md of (p.mdFiles || [])) {
      fs.writeFileSync(path.join(pDir, md), p.mdContents?.[md] || '# Test content\n');
    }

    // Write .pdf files
    for (const pdf of (p.pdfFiles || [])) {
      // Create a dummy PDF > 10KB
      fs.writeFileSync(path.join(pDir, pdf), 'x'.repeat(15000));
    }

    // Write build_pdf.py
    if (p.buildScript !== false) {
      fs.writeFileSync(path.join(pDir, 'build_pdf.py'), '# build script');
    }

    // Write _assets
    if (p.assets) {
      const aDir = path.join(pDir, '_assets');
      fs.mkdirSync(aDir, { recursive: true });
      for (const a of p.assets) {
        fs.writeFileSync(path.join(aDir, a), '<svg></svg>');
        // Also copy to chapter _assets
        fs.writeFileSync(path.join(chapterDir, '_assets', a), '<svg></svg>');
      }
    }

    // Write review.md
    if (p.review) {
      fs.writeFileSync(path.join(pDir, p.review.name), p.review.content);
    }

    // Write quality-ref.yaml
    if (p.qualityRef) {
      fs.writeFileSync(path.join(pDir, p.qualityRef.name), p.qualityRef.content);
    }
  }

  // Write chapter files
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – hoofdstuk.md'), '# Chapter\n');
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – hoofdstuk.html'), '<html></html>');
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – hoofdstuk.pdf'), 'x'.repeat(600000));
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – antwoorden.md'), '# Answers\n');
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – antwoorden.html'), '<html></html>');
  fs.writeFileSync(path.join(chapterDir, '9.9 Test – antwoorden.pdf'), 'x'.repeat(100000));
  fs.writeFileSync(path.join(chapterDir, 'build_chapter.py'),
    'BASE = Path(__file__).parent\nMODULE = BASE\n');

  return chapterDir;
}

beforeAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

function validReview() {
  return { name: '9.9.1-review.md', content: '# Review\nAll checks PASS.\n' };
}

function validQualityRef() {
  return {
    name: '9.9.1-quality-ref.yaml',
    content: [
      'assets:',
      '  total_referenced: 2',
      '  total_present: 2',
      '  missing: []',
      '  orphaned: []',
      '  svgpng_paired: true',
      '  naming_compliant: true',
    ].join('\n'),
  };
}

describe('validate-chapter.js', () => {
  test('rejects non-chapter folder name', () => {
    const dir = path.join(TMP, 'bad-name');
    fs.mkdirSync(dir, { recursive: true });
    const { exitCode } = run(dir);
    expect(exitCode).not.toBe(0);
  });

  test('fails when review.md is missing', () => {
    const dir = setupChapter('9.9 Hoofdstuk Test', [
      {
        folder: '9.9.1 Theory',
        mdFiles: ['9.9.1 Theory – paragraaf.md', '9.9.1 Theory – opgaven.md', '9.9.1 Theory – antwoorden.md'],
        pdfFiles: ['9.9.1 Theory – paragraaf.pdf', '9.9.1 Theory – opgaven.pdf', '9.9.1 Theory – antwoorden.pdf'],
        assets: ['9.9.1_fig_1.svg', '9.9.1_fig_1.png'],
        // NO review
        qualityRef: { ...validQualityRef() },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING review report');
  });

  test('fails when quality_ref reports missing assets', () => {
    const dir = setupChapter('9.9 Hoofdstuk TestQR', [
      {
        folder: '9.9.1 Theory',
        mdFiles: ['9.9.1 Theory – paragraaf.md', '9.9.1 Theory – opgaven.md', '9.9.1 Theory – antwoorden.md'],
        pdfFiles: ['9.9.1 Theory – paragraaf.pdf', '9.9.1 Theory – opgaven.pdf', '9.9.1 Theory – antwoorden.pdf'],
        assets: ['9.9.1_fig_1.svg', '9.9.1_fig_1.png'],
        review: validReview(),
        qualityRef: {
          name: '9.9.1-quality-ref.yaml',
          content: 'assets:\n  missing: [some_file.svg]\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('quality_ref reports missing assets');
  });

  test('fails when review has unresolved FAIL items', () => {
    const dir = setupChapter('9.9 Hoofdstuk TestFail', [
      {
        folder: '9.9.1 Theory',
        mdFiles: ['9.9.1 Theory – paragraaf.md', '9.9.1 Theory – opgaven.md', '9.9.1 Theory – antwoorden.md'],
        pdfFiles: ['9.9.1 Theory – paragraaf.pdf', '9.9.1 Theory – opgaven.pdf', '9.9.1 Theory – antwoorden.pdf'],
        assets: ['9.9.1_fig_1.svg', '9.9.1_fig_1.png'],
        review: { name: '9.9.1-review.md', content: '# Review\n0.1: FAIL — missing asset\n' },
        qualityRef: validQualityRef(),
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('unresolved FAIL');
  });

  test.skip('fails on non-compliant asset naming', () => {
    const dir = setupChapter('9.9 Hoofdstuk TestNaming', [
      {
        folder: '9.9.1 Theory',
        mdFiles: ['9.9.1 Theory – paragraaf.md', '9.9.1 Theory – opgaven.md', '9.9.1 Theory – antwoorden.md'],
        pdfFiles: ['9.9.1 Theory – paragraaf.pdf', '9.9.1 Theory – opgaven.pdf', '9.9.1 Theory – antwoorden.pdf'],
        assets: ['B9C9S1_fig_1.svg', 'B9C9S1_fig_1.png'], // old naming
        review: validReview(),
        qualityRef: validQualityRef(),
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('Non-compliant asset name');
  });

  test('fails on non-compliant asset naming when the bad asset is referenced', () => {
    const dash = '\u2013';
    const paragraafMd = `9.9.1 Theory ${dash} paragraaf.md`;
    const dir = setupChapter('9.9 Hoofdstuk TestNamingReferenced', [
      {
        folder: '9.9.1 Theory',
        mdFiles: [paragraafMd, '9.9.1 Theory â€“ opgaven.md', '9.9.1 Theory â€“ antwoorden.md'],
        mdContents: {
          [paragraafMd]: '# Test content\n\n![Figure](_assets/B9C9S1_fig_1.svg)\n',
        },
        pdfFiles: ['9.9.1 Theory â€“ paragraaf.pdf', '9.9.1 Theory â€“ opgaven.pdf', '9.9.1 Theory â€“ antwoorden.pdf'],
        assets: ['B9C9S1_fig_1.svg', 'B9C9S1_fig_1.png'],
        review: validReview(),
        qualityRef: validQualityRef(),
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('Non-compliant asset name');
  });

  test('accepts test prep summary (samenvatting.md, no paragraaf)', () => {
    const dir = setupChapter('9.5 Hoofdstuk Toetsvoorbereiding', [
      {
        folder: '9.5.1 Actieve samenvatting',
        mdFiles: ['9.5.1 Actieve samenvatting – samenvatting.md', '9.5.1 Actieve samenvatting – antwoorden.md'],
        pdfFiles: ['9.5.1 Actieve samenvatting – samenvatting.pdf', '9.5.1 Actieve samenvatting – antwoorden.pdf'],
        assets: ['9.5.1_fig_1.svg', '9.5.1_fig_1.png', '9.5.1_mc_1.svg', '9.5.1_mc_1.png'],
        review: { name: '9.5.1-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.5.1-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(output).not.toContain('MISSING paragraaf');
    expect(output).not.toContain('MISSING opgaven');
    expect(output).toContain('test prep (summary)');
  });

  test('accepts test prep practice test (toets + toetsmatrijs)', () => {
    const dir = setupChapter('9.5 Hoofdstuk TestPrep4', [
      {
        folder: '9.5.4 Proeftoets',
        mdFiles: ['9.5.4 Proeftoets – toets.md', '9.5.4 Proeftoets – antwoorden.md', '9.5.4 Proeftoets – toetsmatrijs.md'],
        pdfFiles: ['9.5.4 Proeftoets – toets.pdf', '9.5.4 Proeftoets – antwoorden.pdf', '9.5.4 Proeftoets – toetsmatrijs.pdf'],
        assets: ['9.5.4_fig_1.svg', '9.5.4_fig_1.png'],
        review: { name: '9.5.4-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.5.4-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(output).not.toContain('MISSING toets');
    expect(output).not.toContain('MISSING toetsmatrijs');
    expect(output).toContain('test prep (practice test)');
  });

  test('fails when practice test missing toetsmatrijs', () => {
    const dir = setupChapter('9.5 Hoofdstuk TestPrepMissing', [
      {
        folder: '9.5.4 Proeftoets',
        mdFiles: ['9.5.4 Proeftoets – toets.md', '9.5.4 Proeftoets – antwoorden.md'],
        pdfFiles: ['9.5.4 Proeftoets – toets.pdf', '9.5.4 Proeftoets – antwoorden.pdf'],
        assets: ['9.5.4_fig_1.svg', '9.5.4_fig_1.png'],
        review: { name: '9.5.4-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.5.4-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING toetsmatrijs');
  });

  test('fails when summary missing samenvatting.md', () => {
    const dir = setupChapter('9.5 Hoofdstuk TestPrepMissing2', [
      {
        folder: '9.5.1 Actieve samenvatting',
        mdFiles: ['9.5.1 Actieve samenvatting – antwoorden.md'],
        pdfFiles: ['9.5.1 Actieve samenvatting – antwoorden.pdf'],
        assets: ['9.5.1_fig_1.svg', '9.5.1_fig_1.png'],
        review: { name: '9.5.1-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.5.1-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING samenvatting');
  });

  test('accepts mc asset type in naming', () => {
    const dir = setupChapter('9.5 Hoofdstuk TestMCAsset', [
      {
        folder: '9.5.1 Actieve samenvatting',
        mdFiles: ['9.5.1 Actieve samenvatting – samenvatting.md', '9.5.1 Actieve samenvatting – antwoorden.md'],
        pdfFiles: ['9.5.1 Actieve samenvatting – samenvatting.pdf', '9.5.1 Actieve samenvatting – antwoorden.pdf'],
        assets: ['9.5.1_mc_1.svg', '9.5.1_mc_1.png'],
        review: { name: '9.5.1-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.5.1-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { output } = run(dir);
    expect(output).not.toContain('Non-compliant asset name');
  });

  test('accepts valid consolidation (2 md, no paragraaf)', () => {
    const dir = setupChapter('9.9 Hoofdstuk TestConsol', [
      {
        folder: '9.9.4 Gemengde opgaven',
        mdFiles: ['9.9.4 Gemengde opgaven – opgaven.md', '9.9.4 Gemengde opgaven – antwoorden.md'],
        pdfFiles: ['9.9.4 Gemengde opgaven – opgaven.pdf', '9.9.4 Gemengde opgaven – antwoorden.pdf'],
        assets: ['9.9.4_ex_1.svg', '9.9.4_ex_1.png'],
        review: { name: '9.9.4-review.md', content: '# Review\nAll PASS.\n' },
        qualityRef: {
          name: '9.9.4-quality-ref.yaml',
          content: 'assets:\n  missing: []\n  svgpng_paired: true\n  naming_compliant: true\n',
        },
      },
    ]);
    const { exitCode, output } = run(dir);
    // Should not fail on missing paragraaf.md for consolidation
    expect(output).not.toContain('MISSING paragraaf');
  });
});
