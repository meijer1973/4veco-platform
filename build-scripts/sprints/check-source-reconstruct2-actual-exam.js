#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const sprintId = 'SOURCE-RECONSTRUCT-2-ACTUAL-EXAM';
const platformRoot = path.resolve(__dirname, '..', '..');
const lessonRoot = path.resolve(platformRoot, '..', '4veco-lessen');

const paths = {
  reconstruction: path.join(platformRoot, 'reports/json/source-reconstruct2-actual-exam.json'),
  proof: path.join(platformRoot, 'reports/json/source-reconstruct2-actual-exam-proof.json'),
  authority: path.join(platformRoot, 'reports/json/exam-source-authority1-contract.json'),
  contextContract: path.join(platformRoot, 'reports/json/task-context-spec1-contract.json'),
  visualContract: path.join(platformRoot, 'reports/json/context-visual-std1-contract.json'),
  roadmap: path.join(platformRoot, 'references/reference-team-roadmap.md'),
  lessonRoadmap: path.join(lessonRoot, 'lessen-team-roadmap.md'),
  promptPdf: path.join(platformRoot, 'references/external/exams/vw-1022-a-25-1-o.pdf'),
  correctionPdf: path.join(platformRoot, 'references/external/exams/vw-1022-a-25-1-c.pdf'),
  normalized: path.join(platformRoot, `reports/sprints/${sprintId}-normalized-source.md`),
  sourceMap: path.join(platformRoot, `reports/sprints/${sprintId}-source-map.md`),
  visualNotes: path.join(platformRoot, `reports/sprints/${sprintId}-visual-fidelity-notes.md`),
  reviewerComparison: path.join(platformRoot, `reports/sprints/${sprintId}-reviewer-comparison.md`),
  lab: path.join(platformRoot, `reports/sprints/${sprintId}-rendered-lab.html`),
  manifest: path.join(platformRoot, `reports/sprints/${sprintId}-screenshot-manifest.md`),
};

function fail(message) {
  console.error(`ERROR ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  assert(fs.existsSync(file), `missing ${path.relative(platformRoot, file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  assert(fs.existsSync(file), `missing ${path.relative(platformRoot, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || platformRoot,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    fail(`${command} ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function findPdfToText() {
  if (process.env.PDFTOTEXT && fs.existsSync(process.env.PDFTOTEXT)) return process.env.PDFTOTEXT;
  const where = spawnSync('where.exe', ['pdftotext'], { encoding: 'utf8', shell: false });
  if (where.status === 0) {
    const candidate = (where.stdout || '').split(/\r?\n/).find((line) => line.trim().length > 0);
    if (candidate) return candidate.trim();
  }
  return 'pdftotext';
}

function pdfText(pdfPath, page) {
  const exe = findPdfToText();
  const result = spawnSync(exe, ['-layout', '-f', String(page), '-l', String(page), pdfPath, '-'], {
    cwd: platformRoot,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    fail(`pdftotext failed for ${rel(pdfPath)} page ${page}: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').replace(/\s+/g, ' ');
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${rel(file)} is not a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function assertRoadmapPrerequisitesClosed(markdown, label) {
  for (const prereq of ['EXAM-SOURCE-AUTH-1', 'TASK-CONTEXT-SPEC-1', 'TASK-CONTEXT-RUNTIME-1', 'CONTEXT-VISUAL-STD-1']) {
    const line = markdown.split(/\r?\n/).find((candidate) => candidate.includes(`| ${prereq} |`));
    assert(line, `${label}: missing roadmap row ${prereq}`);
    assert(/\|\s*(yes|\*\*2026-\d{2}-\d{2}\*\*)\s*\|/.test(line), `${label}: prerequisite ${prereq} is not closed`);
  }
}

function collectKeys(value, keys = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectKeys(item, keys));
  } else if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      keys.push(key);
      collectKeys(value[key], keys);
    });
  }
  return keys;
}

function gitStatus(args, cwd = platformRoot) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    fail(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function main() {
  const reconstruction = readJson(paths.reconstruction);
  const proof = readJson(paths.proof);
  const authority = readJson(paths.authority);
  const contextContract = readJson(paths.contextContract);
  const visualContract = readJson(paths.visualContract);

  assert(reconstruction.schema_version === 1, 'reconstruction schema_version must be 1');
  assert(reconstruction.sprint_id === sprintId, 'wrong reconstruction sprint_id');
  assert(reconstruction.status === 'actual_exam_source_reconstructed', 'wrong reconstruction status');
  assert(deepEqual(reconstruction.sourceAuthority, authority.sourceAuthority), 'sourceAuthority does not match authority contract');
  assert(deepEqual(reconstruction.sourceAuthority, contextContract.sourceAuthority), 'sourceAuthority does not match context contract');
  assert(visualContract.sourceOutputParity.raw_copied_images_allowed === false, 'visual contract must forbid raw copied images');

  assertRoadmapPrerequisitesClosed(readText(paths.roadmap), 'platform roadmap');
  assertRoadmapPrerequisitesClosed(readText(paths.lessonRoadmap), 'lesson roadmap');

  assert(fs.existsSync(paths.promptPdf), `missing ${rel(paths.promptPdf)}`);
  assert(fs.existsSync(paths.correctionPdf), `missing ${rel(paths.correctionPdf)}`);
  const promptText = pdfText(paths.promptPdf, 2);
  const correctionText = pdfText(paths.correctionPdf, 6);
  for (const needle of ['Zoohee! zorgverzekering', 'eigen risico', '385', '885', '108,25', '86,25', 'Bereken tot welk bedrag aan zorgkosten per jaar', 'verhoogd eigen risico']) {
    assert(promptText.includes(needle), `prompt PDF text missing ${needle}`);
  }
  for (const needle of ['12 x 108,25', '12 x 86,25', '649']) {
    assert(correctionText.includes(needle), `correction PDF text missing ${needle}`);
  }

  const material = reconstruction.sourceMaterials && reconstruction.sourceMaterials[0];
  assert(material, 'missing sourceMaterials[0]');
  assert(material.source_material_id === authority.sourceAuthority.source_material_id, 'wrong source material id');
  assert(material.type === 'semantic_table', 'source material must be semantic_table');
  assert(material.rawCopiedImage === false, 'source material must not be a copied image');
  assert(material.caption === 'Tabel 1: Zoohee! zorgverzekering', 'wrong table caption');
  assert(deepEqual(material.row_order, ['wettelijk eigen risico', 'verhoogd eigen risico']), 'wrong row order');
  assert(material.rows[0].variant === 'wettelijk eigen risico', 'wrong first row label');
  assert(material.rows[0].eigen_risico_per_jaar_eur === 385, 'wrong first row deductible');
  assert(material.rows[0].premie_per_maand_eur === 108.25, 'wrong first row premium');
  assert(material.rows[1].variant === 'verhoogd eigen risico', 'wrong second row label');
  assert(material.rows[1].eigen_risico_per_jaar_eur === 885, 'wrong second row deductible');
  assert(material.rows[1].premie_per_maand_eur === 86.25, 'wrong second row premium');

  const blockTypes = new Set((reconstruction.contextBlocks || []).map((block) => block.type));
  for (const requiredType of ['markdown', 'source_excerpt', 'table', 'formula']) {
    assert(blockTypes.has(requiredType), `missing context block type ${requiredType}`);
  }
  for (const block of reconstruction.contextBlocks || []) {
    assert(contextContract.allowedBlockTypes.includes(block.type), `unknown block type ${block.type}`);
    const rule = contextContract.blockTypeRules[block.type];
    assert(rule, `missing context rule for ${block.type}`);
    for (const field of rule.required) {
      assert(block[field] !== undefined, `${block.id} missing required field ${field}`);
    }
    if (rule.captionPrefix) {
      assert(String(block.caption).startsWith(rule.captionPrefix), `${block.id} caption must start with ${rule.captionPrefix}`);
    }
    if (rule.altTextRequired) {
      assert(String(block.altText || '').trim().length > 0, `${block.id} missing altText`);
    }
  }

  const forbiddenKeys = new Set([
    'tasks',
    'taskFamilyCompositions',
    'operationTraceTasks',
    'targetExercise',
    'generatedLessonOutput',
    'studentRoute',
    'diagnosticRules',
    'masteryRules',
  ]);
  const keys = collectKeys(reconstruction);
  for (const key of keys) {
    assert(!forbiddenKeys.has(key), `reconstruction contains forbidden task/product key ${key}`);
  }

  const boundary = reconstruction.productBoundary;
  assert(boundary.source_reconstruction_authorized === true, 'source reconstruction must be authorized in result boundary');
  for (const [key, value] of Object.entries(boundary)) {
    if (key !== 'source_reconstruction_authorized') assert(value === false, `boundary ${key} must be false`);
  }
  assert(reconstruction.correctionModelComparison.comparison_only === true, 'correction model must be comparison-only');
  assert(reconstruction.correctionModelComparison.required_threshold === authority.answerModelAuthority.required_threshold, 'wrong threshold evidence');
  assert(reconstruction.correctionModelComparison.rendered_lab_answer_amount_visible === false, 'answer amount must be hidden from lab');

  const docs = {
    normalized: readText(paths.normalized),
    sourceMap: readText(paths.sourceMap),
    visualNotes: readText(paths.visualNotes),
    reviewerComparison: readText(paths.reviewerComparison),
  };
  for (const [name, text] of Object.entries(docs)) {
    assert(text.includes('SOURCE-RECONSTRUCT-2-ACTUAL-EXAM'), `${name} doc missing sprint id`);
  }
  for (const needle of ['385', '885', '108,25', '86,25', 'wettelijk eigen risico', 'verhoogd eigen risico']) {
    assert(docs.sourceMap.includes(needle), `source-map missing ${needle}`);
    assert(docs.visualNotes.includes(needle) || ['wettelijk eigen risico', 'verhoogd eigen risico'].includes(needle), `visual notes missing ${needle}`);
  }
  assert(docs.visualNotes.includes('Semantic table') || docs.visualNotes.includes('semantic table'), 'visual notes must name semantic table');
  assert(docs.reviewerComparison.includes('EUR 649'), 'reviewer comparison missing threshold evidence');

  assert(fs.existsSync(paths.lab), `missing ${rel(paths.lab)}`);
  const labHtml = readText(paths.lab);
  for (const forbiddenAnswer of ['649', '1.684', '1684', '1.035', '1035']) {
    assert(!labHtml.includes(forbiddenAnswer), `rendered lab HTML source contains answer evidence ${forbiddenAnswer}`);
  }
  assert(fs.existsSync(paths.manifest), `missing ${rel(paths.manifest)}`);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === sprintId, 'wrong proof sprint_id');
  assert(proof.status === 'source_reconstruction_rendering_proof_complete', 'wrong proof status');
  assert(proof.lab === rel(paths.lab), 'proof lab path mismatch');
  assert(proof.screenshot_manifest === rel(paths.manifest), 'proof manifest path mismatch');
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length === 3, 'proof must include three screenshots');

  const expectedCases = new Map([
    ['desktop-light', { width: 1280, theme: 'light' }],
    ['mobile-light', { width: 390, theme: 'light' }],
    ['mobile-dark', { width: 390, theme: 'dark' }],
  ]);
  for (const capture of proof.screenshots) {
    const expected = expectedCases.get(capture.case);
    assert(expected, `unexpected screenshot case ${capture.case}`);
    assert(capture.theme === expected.theme, `${capture.case} wrong theme`);
    assert(capture.viewport.width === expected.width, `${capture.case} wrong requested width`);
    const file = path.join(platformRoot, capture.file);
    assert(fs.existsSync(file), `missing screenshot ${capture.file}`);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === expected.width, `${capture.case} screenshot width ${dimensions.width}, expected ${expected.width}`);
    assert(dimensions.height >= 400, `${capture.case} screenshot height too small`);
    assert(capture.proof.contextBlockCount === 4, `${capture.case} wrong context block count`);
    assert(capture.proof.contextBeforeComparison === true, `${capture.case} does not render context before review panel`);
    assert(capture.proof.tableCount === 1, `${capture.case} wrong table count`);
    assert(capture.proof.formulaCount === 1, `${capture.case} wrong formula count`);
    assert(capture.proof.rawImageCount === 0, `${capture.case} contains raw image`);
    assert(capture.proof.visibleInternalContextIds === false, `${capture.case} exposes internal context ids`);
    assert(capture.proof.answerAmountVisible === false, `${capture.case} exposes answer amount`);
    assert(capture.proof.overflowingCount === 0, `${capture.case} has non-table overflow`);
    assert(capture.proof.sourceLabels.includes('Bron 1'), `${capture.case} missing Bron 1 label`);
    assert(capture.proof.sourceLabels.includes('Tabel 1'), `${capture.case} missing Tabel 1 label`);
    assert(capture.proof.sourceLabels.includes('Formule 1'), `${capture.case} missing Formule 1 label`);
    assert(capture.proof.tableValues.every((item) => item.visible === true), `${capture.case} missing visible table values`);
    assert(capture.proof.sourceRefsVisible === true, `${capture.case} missing source refs`);
  }
  assert(proof.source_reconstruction.context_before_comparison === true, 'proof context_before_comparison aggregate failed');
  assert(proof.source_reconstruction.answer_amount_visible === false, 'proof aggregate exposes answer amount');
  assert(proof.source_reconstruction.raw_image_count === 0, 'proof aggregate contains raw images');
  assert(proof.source_reconstruction.table_values_visible === true, 'proof aggregate missing table values');

  assert(proof.boundary_evidence.protected_reference_status === '', 'proof recorded protected reference changes');
  assert(proof.boundary_evidence.source_data_status === '', 'proof recorded source-data changes');
  assert(proof.boundary_evidence.book1_generated_output_status === '', 'proof recorded Book 1 generated-output changes');
  assert(gitStatus(['status', '--short', '--', 'references/machine', 'references/external']) === '', 'protected reference paths changed');
  assert(gitStatus(['status', '--short', '--', 'source-data']) === '', 'source-data paths changed');
  assert(
    gitStatus([
      '-c',
      'safe.directory=C:/Projects/4veco/4veco-lessen',
      '-C',
      '../4veco-lessen',
      'status',
      '--short',
      '--',
      'Boek 1 - Grondslagen, vraag en aanbod',
    ]) === '',
    'Book 1 generated-output paths changed'
  );

  console.log(`OK ${sprintId} actual exam source reconstruction`);
}

main();
