/**
 * Tests for validate-paragraph.js flat-layout validation.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VALIDATOR = path.resolve(__dirname, '..', 'validate-paragraph.js');
const TMP = path.resolve(__dirname, '..', '..', 'tmp', 'test-paragraph');
const DASH = '\u2013';

function run(paragraphPath, mode) {
  const args = [VALIDATOR];
  if (mode) args.push('--mode', mode);
  args.push(paragraphPath);
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    timeout: 10000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    exitCode: result.status,
    output: (result.stdout || '') + (result.stderr || ''),
  };
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writePdf(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, 'x'.repeat(15000));
}

function writeZipLike(filePath, size = 200) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const buf = Buffer.alloc(size);
  buf[0] = 0x50;
  buf[1] = 0x4B;
  fs.writeFileSync(filePath, buf);
}

function paragraphDir(folderName = '9.9.1 Theory') {
  return path.join(TMP, 'Boek 9 - Test', '9.9 Hoofdstuk Test', folderName);
}

function setupPartA(folderName = '9.9.1 Theory', kind = 'theory') {
  const dir = paragraphDir(folderName);
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, '_assets'), { recursive: true });

  const parNr = folderName.split(' ')[0];
  const suffixes = kind === 'consolidation'
    ? ['opgaven', 'antwoorden']
    : ['paragraaf', 'opgaven', 'antwoorden'];

  for (const suffix of suffixes) {
    writeText(
      path.join(dir, `${folderName} ${DASH} ${suffix}.md`),
      `# ${suffix}\n\n![Figure](_assets/${parNr}_fig_1.svg)\n`
    );
    writePdf(path.join(dir, `${folderName} ${DASH} ${suffix}.pdf`));
  }

  writeText(path.join(dir, 'build_pdf.py'), '# build script\n');
  writeText(path.join(dir, '_assets', `${parNr}_fig_1.svg`), '<svg></svg>');
  writeText(path.join(dir, '_assets', `${parNr}_fig_1.png`), 'png');
  writeText(path.join(dir, `${parNr}-review.md`), '# Review\nAll checks PASS.\n');
  writeText(
    path.join(dir, `${parNr}-quality-ref.yaml`),
    [
      'assets:',
      '  missing: []',
      '  svgpng_paired: true',
      '  naming_compliant: true',
    ].join('\n')
  );
  return dir;
}

function setupPartB(folderName = '9.9.1 Theory', options = {}) {
  const dir = paragraphDir(folderName);
  const parNr = folderName.split(' ')[0];
  const parName = folderName.substring(parNr.length + 1);
  const prefix = `${parNr} ${parName}`;
  fs.mkdirSync(dir, { recursive: true });

  const html = '<!doctype html><html><body>' + 'x'.repeat(600) + '</body></html>';
  const files = [
    [`${prefix} ${DASH} instapquiz.html`, 'html'],
    [`${prefix} ${DASH} nieuws-detective.html`, 'html'],
    [`${prefix} ${DASH} uitleg voorkennis.docx`, 'docx'],
    [`${prefix} ${DASH} uitleg voorkennis.html`, 'html'],
    ['Lees dit als je niet weet hoe je moet beginnen met deze les.docx', 'docx'],
    [`${prefix} ${DASH} presentatie.pptx`, 'pptx'],
    [`${prefix} ${DASH} uitleg vaardigheden.docx`, 'docx'],
    [`${prefix} ${DASH} uitleg vaardigheden.html`, 'html'],
    [`${prefix} ${DASH} nieuws met visual.docx`, 'docx'],
    [`${prefix} ${DASH} samenvatting.docx`, 'docx'],
    [`${prefix} ${DASH} youtube-videos.html`, 'html'],
    [`${prefix} ${DASH} stappenplan.html`, 'html'],
    [`${prefix} ${DASH} redeneer-spel.html`, 'html'],
    [`${prefix} ${DASH} wiskundevaardigheden.html`, 'html'],
    [`${prefix} ${DASH} begeleide inoefening ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} begeleide inoefening ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} begeleide inoefening.html`, 'html'],
    [`${prefix} ${DASH} basis ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} basis ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} midden ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} midden ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} verrijking ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} verrijking ${DASH} antwoorden.docx`, 'docx'],
    ['index.html', 'html'],
  ];

  for (const [name, type] of files) {
    if (type === 'html') writeText(path.join(dir, name), html);
    else if (type === 'pptx') writeZipLike(path.join(dir, name), 120000);
    else writeZipLike(path.join(dir, name), 300);
  }

  writeText(
    path.join(dir, '_paragraph-plan.md'),
    options.planContent || [
      '# Plan',
      '## Procedure-stappen-plan',
      '## Visuelen-toewijzing',
      '## Terminologie',
    ].join('\n')
  );

  const bookRoot = path.resolve(dir, '..', '..');
  writeText(
    path.join(bookRoot, 'shared', 'questions', `${parNr}.js`),
    'var QUIZ_DATA = { categories: { a: {} }, questions: [{ category: "a", difficulty: 3 }] };\n'
  );
  writeText(path.join(bookRoot, 'shared', 'newsdetective', `${parNr}.js`), 'var NEWS_DETECTIVE_DATA = {};\n');
  writeText(path.join(bookRoot, 'shared', 'reasoning', `${parNr}.js`), 'var REASONING_CSV = "";\n');
  writeText(path.join(bookRoot, 'shared', 'procedure', `${parNr}.js`), 'var PROCEDURE_DATA = { procedures: [] };\n');
  writeText(path.join(bookRoot, 'shared', 'skilltree', `${parNr}.js`), 'window = {}; window.SKILL_TREE_DATA = {};\n');

  return dir;
}

beforeEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP, { recursive: true, force: true });
});

describe('validate-paragraph.js', () => {
  test('auto mode validates a flat Part A theory paragraph', () => {
    const dir = setupPartA();
    const { exitCode, output } = run(dir);
    expect(exitCode).toBe(0);
    expect(output).toContain('Mode: part-a (auto)');
    expect(output).toContain('PASSED all checks');
  });

  test('Part A mode accepts consolidation without paragraaf files', () => {
    const dir = setupPartA('9.9.4 Gemengde opgaven', 'consolidation');
    const { exitCode, output } = run(dir, 'part-a');
    expect(exitCode).toBe(0);
    expect(output).toContain('Paragraph type: consolidation');
    expect(output).not.toContain('MISSING paragraaf');
  });

  test('Part A mode fails when quality_ref is missing', () => {
    const dir = setupPartA();
    fs.rmSync(path.join(dir, '9.9.1-quality-ref.yaml'));
    const { exitCode, output } = run(dir, 'part-a');
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING quality_ref');
  });

  test('Part B mode validates the 24 flat companion root files', () => {
    const dir = setupPartB();
    const { exitCode, output } = run(dir, 'part-b');
    expect(exitCode).toBe(0);
    expect(output).toContain('24/24 required Part B files present');
    expect(output).toContain('PASSED all checks');
  });

  test('complete mode accepts companion-only assets declared in _paragraph-plan.md', () => {
    const dir = setupPartA();
    setupPartB('9.9.1 Theory', {
      planContent: [
        '# Plan',
        '## Visuals plan',
        '| Filename | Used by |',
        '|---|---|',
        '| `9.9.1_news_woningtekort.svg/png` | nieuws |',
        '## Procedure-stappen-plan',
        '## Visuelen-toewijzing',
        '| Visual | presentatie | vaardigheden | voorkennis | samenvatting |',
        '|---|---|---|---|---|',
        '| `9.9.1_news_woningtekort.png` | - | - | - | - |',
        '## Terminologie',
      ].join('\n'),
    });
    writeText(path.join(dir, '_assets', '9.9.1_news_woningtekort.svg'), '<svg></svg>');
    writeText(path.join(dir, '_assets', '9.9.1_news_woningtekort.png'), 'png');

    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).toBe(0);
    expect(output).toContain('companion asset(s) declared in _paragraph-plan.md');
    expect(output).not.toContain('Orphaned asset: 9.9.1_news_woningtekort.svg');
  });

  test('complete mode fails on a Part A-only paragraph', () => {
    const dir = setupPartA();
    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING _paragraph-plan.md');
    expect(output).toContain('MISSING: shared/questions/9.9.1.js');
  });
});
