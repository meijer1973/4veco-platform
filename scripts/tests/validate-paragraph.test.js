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

function run(paragraphPath, mode, profile) {
  const args = [VALIDATOR];
  if (mode) args.push('--mode', mode);
  if (profile) args.push('--profile', profile);
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

function writeHtml(filePath) {
  writeText(filePath, '<!doctype html><html><body>' + 'x'.repeat(600) + '</body></html>');
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

function setupPartA(folderName = '9.9.1 Theory', kind = 'theory', options = {}) {
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
    if (options.includePdf !== false) {
      writePdf(path.join(dir, `${folderName} ${DASH} ${suffix}.pdf`));
    }
    if (options.includeHtml !== false) {
      writeHtml(path.join(dir, `${folderName} ${DASH} ${suffix}.html`));
    }
  }

  if (options.includeBuildPdf !== false) {
    writeText(path.join(dir, 'build_pdf.py'), '# build script\n');
  }
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
  const webFiles = [
    [`${prefix} ${DASH} instapquiz.html`, 'html'],
    [`${prefix} ${DASH} nieuws-detective.html`, 'html'],
    [`${prefix} ${DASH} uitleg voorkennis.html`, 'html'],
    [`${prefix} ${DASH} presentatie.pptx`, 'pptx'],
    [`${prefix} ${DASH} presentatie.html`, 'html'],
    [`${prefix} ${DASH} uitleg vaardigheden.html`, 'html'],
    [`${prefix} ${DASH} nieuws met visual.html`, 'html'],
    [`${prefix} ${DASH} samenvatting.html`, 'html'],
    [`${prefix} ${DASH} youtube-videos.html`, 'html'],
    [`${prefix} ${DASH} stappenplan.html`, 'html'],
    [`${prefix} ${DASH} redeneer-spel.html`, 'html'],
    [`${prefix} ${DASH} wiskundevaardigheden.html`, 'html'],
    [`${prefix} ${DASH} begeleide inoefening.html`, 'html'],
    ['index.html', 'html'],
  ];
  const officeFiles = [
    [`${prefix} ${DASH} uitleg voorkennis.docx`, 'docx'],
    ['Lees dit als je niet weet hoe je moet beginnen met deze les.docx', 'docx'],
    [`${prefix} ${DASH} uitleg vaardigheden.docx`, 'docx'],
    [`${prefix} ${DASH} nieuws met visual.docx`, 'docx'],
    [`${prefix} ${DASH} samenvatting.docx`, 'docx'],
    [`${prefix} ${DASH} begeleide inoefening ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} begeleide inoefening ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} basis ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} basis ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} midden ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} midden ${DASH} antwoorden.docx`, 'docx'],
    [`${prefix} ${DASH} verrijking ${DASH} vragen.docx`, 'docx'],
    [`${prefix} ${DASH} verrijking ${DASH} antwoorden.docx`, 'docx'],
  ];
  const files = options.includeOffice === false ? webFiles : [...webFiles, ...officeFiles];

  for (const [name, type] of files) {
    if (type === 'html') writeText(path.join(dir, name), html);
    else if (type === 'pptx') writeZipLike(path.join(dir, name), 120000);
    else writeZipLike(path.join(dir, name), 300);
  }

  // L1.5V Bucket F2: --mode part-b and --mode complete require an explicit
  // companion-visual-review.md with a non-FAIL verdict. Seed a passing one
  // by default; tests that need to exercise FAIL behavior overwrite it.
  writeText(
    path.join(dir, `${parNr}-companion-visual-review.md`),
    `# Companion Visual Review\n\n## 2. Verdict\n\n**PASS**\n`
  );

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

function seedB02ParitySurfaces(dir, options = {}) {
  const folderName = path.basename(dir);
  const parNr = folderName.split(' ')[0];
  const parName = folderName.substring(parNr.length + 1);
  const prefix = `${parNr} ${parName}`;
  const passText = 'Economisch denken in vier stappen. Stap 4: bereken nettowaarde.';
  const legacyText = 'Economisch denken in drie stappen. Stap 3: wat geef je op?';

  for (const suffix of ['paragraaf', 'opgaven', 'antwoorden']) {
    const text = options.legacySurface === suffix ? legacyText : passText;
    writeText(path.join(dir, `${prefix} ${DASH} ${suffix}.md`), `# ${suffix}\n\n${text}\n`);
  }

  for (const suffix of [
    'uitleg vaardigheden.html',
    'instapquiz.html',
    'presentatie.html',
    'begeleide inoefening.html',
    'samenvatting.html',
    'youtube-videos.html',
  ]) {
    const text = options.legacySurface === suffix ? legacyText : passText;
    writeText(path.join(dir, `${prefix} ${DASH} ${suffix}`), `<!doctype html><html><body>${text}</body></html>`);
  }

  const bookRoot = path.resolve(dir, '..', '..');
  const procedureText = options.legacySurface === 'procedure-data' ? legacyText : passText;
  writeText(
    path.join(bookRoot, 'shared', 'procedure', `${parNr}.js`),
    `var PROCEDURE_DATA = { procedures: [{ title: ${JSON.stringify(procedureText)}, steps: [] }] };\n`
  );

  writeText(
    path.join(dir, `${parNr}-quality-ref.yaml`),
    [
      'schema_version: 2',
      'partA:',
      '  assets:',
      '    missing: []',
      '    svgpng_paired: true',
      '    naming_compliant: true',
      'companion:',
      '  procedure_b02_step_count: 4',
    ].join('\n')
  );
}

function seedDeclaredProcedureCounts(dir, options = {}) {
  const folderName = path.basename(dir);
  const parNr = folderName.split(' ')[0];
  const bookRoot = path.resolve(dir, '..', '..');
  const declaredIndexpoints = options.declaredIndexpoints || 4;
  writeText(
    path.join(bookRoot, 'shared', 'procedure', `${parNr}.js`),
    [
      'var PROCEDURE_DATA = { procedures: [',
      '  { id: "procentuele-verandering", title: "Procentuele verandering berekenen", steps: [{type:"given"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"given"}] },',
      '  { id: "indexcijfer", title: "Indexcijfer berekenen", steps: [{type:"given"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"given"}] },',
      '  { id: "indexpunten-procenten", title: "Indexpunten en procenten onderscheiden", steps: [{type:"given"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"choose"}, {type:"given"}] }',
      '] };',
      '',
    ].join('\n')
  );

  writeText(
    path.join(dir, `${parNr}-quality-ref.yaml`),
    [
      'schema_version: 2',
      'partA:',
      '  assets:',
      '    missing: []',
      '    svgpng_paired: true',
      '    naming_compliant: true',
      'companion:',
      '  procedures:',
      '    procentuele_verandering_step_count: 4',
      '    indexcijfer_step_count: 4',
      `    indexpunten_procenten_step_count: ${declaredIndexpoints}`,
    ].join('\n')
  );
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

  test('Part B mode validates the student-web companion profile without Office files', () => {
    const dir = setupPartB('9.9.1 Theory', { includeOffice: false });
    const { exitCode, output } = run(dir, 'part-b', 'student-web');
    expect(exitCode).toBe(0);
    expect(output).toContain('Output profile: student-web (14 required Part B file(s))');
    expect(output).toContain('14/14 required Part B files present (student-web)');
    expect(output).toContain('PASSED all checks');
  });

  test('legacy-full profile validates the old 27 flat companion root files', () => {
    const dir = setupPartB();
    const { exitCode, output } = run(dir, 'part-b', 'legacy-full');
    expect(exitCode).toBe(0);
    expect(output).toContain('27/27 required Part B files present (legacy-full)');
    expect(output).toContain('PASSED all checks');
  });

  test('student-web complete profile does not require PDFs or DOCX files', () => {
    const dir = setupPartA('9.9.1 Theory', 'theory', {
      includePdf: false,
      includeBuildPdf: false,
    });
    setupPartB('9.9.1 Theory', { includeOffice: false });

    const { exitCode, output } = run(dir, 'complete', 'student-web');
    expect(exitCode).toBe(0);
    expect(output).toContain('Profile: student-web');
    expect(output).not.toContain('MISSING paragraaf.pdf');
    expect(output).not.toContain('MISSING: 9.9.1 Theory – uitleg voorkennis.docx');
    expect(output).toContain('PASSED all checks');
  });

  test('publisher-print profile requires Part A PDFs', () => {
    const dir = setupPartA('9.9.1 Theory', 'theory', {
      includePdf: false,
      includeBuildPdf: false,
    });

    const { exitCode, output } = run(dir, 'part-a', 'publisher-print');
    expect(exitCode).not.toBe(0);
    expect(output).toContain('MISSING paragraaf.pdf');
    expect(output).toContain('MISSING build_pdf.py');
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

  test('complete mode gates B02 four-step parity when quality-ref declares it', () => {
    const dir = setupPartA('1.1.1 Schaarste en economisch denken');
    setupPartB('1.1.1 Schaarste en economisch denken');
    seedB02ParitySurfaces(dir);

    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).toBe(0);
    expect(output).toContain('B02 procedure parity checked 10 surface(s)');
  });

  test('complete mode fails B02 parity when a tracked surface keeps legacy 3-step wording', () => {
    const dir = setupPartA('1.1.1 Schaarste en economisch denken');
    setupPartB('1.1.1 Schaarste en economisch denken');
    seedB02ParitySurfaces(dir, { legacySurface: 'paragraaf' });

    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).not.toBe(0);
    expect(output).toContain('B02 procedure parity: paragraaf.md');
    expect(output).toContain('contains legacy 3-step wording');
  });

  test('complete mode checks declared procedure step counts against procedure data', () => {
    const dir = setupPartA('1.1.2 Percentages en indexcijfers');
    setupPartB('1.1.2 Percentages en indexcijfers');
    seedDeclaredProcedureCounts(dir);

    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).toBe(0);
    expect(output).toContain('Procedure step-count parity checked 3 declared procedure(s)');
  });

  test('complete mode fails when declared procedure count drifts from procedure data', () => {
    const dir = setupPartA('1.1.2 Percentages en indexcijfers');
    setupPartB('1.1.2 Percentages en indexcijfers');
    seedDeclaredProcedureCounts(dir, { declaredIndexpoints: 5 });

    const { exitCode, output } = run(dir, 'complete');
    expect(exitCode).not.toBe(0);
    expect(output).toContain('indexpunten_procenten declares 5 step(s), but procedure data has 4');
  });
});
