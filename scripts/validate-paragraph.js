#!/usr/bin/env node
/**
 * validate-paragraph.js - Verify one flat-layout 4veco-lessen paragraph.
 *
 * Usage:
 *   node scripts/validate-paragraph.js [--mode auto|part-a|part-b|complete] <paragraph-folder-path>
 *
 * Modes:
 *   auto      Validates Part A unless companion files are present.
 *   part-a    Textbook paragraph only.
 *   part-b    Companion paragraph only.
 *   complete  Part A + Part B.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DASH = '\u2013';
const VALID_MODES = new Set(['auto', 'part-a', 'part-b', 'complete']);

function usage() {
  console.error('Usage: node scripts/validate-paragraph.js [--mode auto|part-a|part-b|complete] <paragraph-folder-path>');
}

function parseArgs(argv) {
  let mode = 'auto';
  let paragraphPath = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--mode') {
      mode = argv[++i];
    } else if (arg.startsWith('--mode=')) {
      mode = arg.slice('--mode='.length);
    } else if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (!paragraphPath) {
      paragraphPath = arg;
    } else {
      console.error(`Unexpected argument: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  if (!VALID_MODES.has(mode)) {
    console.error(`Invalid mode: ${mode}`);
    usage();
    process.exit(1);
  }
  if (!paragraphPath) {
    usage();
    process.exit(1);
  }

  return { mode, paragraphPath };
}

const { mode: requestedMode, paragraphPath } = parseArgs(process.argv.slice(2));
const PAR = path.resolve(paragraphPath);

if (!fs.existsSync(PAR) || !fs.statSync(PAR).isDirectory()) {
  console.error(`Paragraph folder not found: ${PAR}`);
  process.exit(1);
}

const folderName = path.basename(PAR);
const parMatch = folderName.match(/^(\d+\.\d+\.\d+)\s+(.+)$/);
if (!parMatch) {
  console.error(`Cannot parse paragraph folder name: ${folderName}`);
  console.error('Expected flat format: "X.Y.Z Paragraph Name"');
  process.exit(1);
}

const parNr = parMatch[1];
let parName = parMatch[2];
const legacyName = parName.match(/^Paragraaf\s+\d+\s+-\s+(.+)$/);
if (legacyName) parName = legacyName[1];

const prefix = `${parNr} ${parName}`;
const bookRoot = path.resolve(PAR, '..', '..');
const rootFiles = fs.readdirSync(PAR).filter(f => fs.statSync(path.join(PAR, f)).isFile());

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.log(`  X ${msg}`);
  errors++;
}
function warn(msg) {
  console.log(`  ! ${msg}`);
  warnings++;
}
function pass(msg) {
  console.log(`  OK ${msg}`);
}
function hasFile(name) {
  return fs.existsSync(path.join(PAR, name));
}
function fileSize(name) {
  return fs.statSync(path.join(PAR, name)).size;
}
function suffixOf(fileName) {
  const parts = fileName.split(` ${DASH} `);
  return parts.length > 1 ? parts[parts.length - 1] : fileName;
}
function findRootFileBySuffix(suffix) {
  return rootFiles.find(f => suffixOf(f) === suffix);
}
function isDocxLike(name) {
  const fullPath = path.join(PAR, name);
  if (!fs.existsSync(fullPath)) return false;
  const buf = fs.readFileSync(fullPath);
  return buf.length >= 100 && buf[0] === 0x50 && buf[1] === 0x4B;
}

const PARA_TYPES = {
  consolidation: {
    pattern: /gemengde\s+opgaven/i,
    requiredMd: ['opgaven', 'antwoorden'],
    requiredPdf: ['opgaven', 'antwoorden'],
    label: 'consolidation',
  },
  'testprep-summary': {
    pattern: /actieve\s+samenvatting/i,
    requiredMd: ['samenvatting', 'antwoorden'],
    requiredPdf: ['samenvatting', 'antwoorden'],
    label: 'test prep summary',
  },
  'testprep-examskills': {
    pattern: /examenvaardigheden/i,
    requiredMd: ['opgaven', 'antwoorden'],
    requiredPdf: ['opgaven', 'antwoorden'],
    label: 'test prep exam skills',
  },
  'testprep-integration': {
    pattern: /integratieoefening/i,
    requiredMd: ['opgaven', 'antwoorden'],
    requiredPdf: ['opgaven', 'antwoorden'],
    label: 'test prep integration',
  },
  'testprep-practicetest': {
    pattern: /proeftoets/i,
    requiredMd: ['toets', 'antwoorden', 'toetsmatrijs'],
    requiredPdf: ['toets', 'antwoorden', 'toetsmatrijs'],
    label: 'test prep practice test',
  },
  theory: {
    pattern: null,
    requiredMd: ['paragraaf', 'opgaven', 'antwoorden'],
    requiredPdf: ['paragraaf', 'opgaven', 'antwoorden'],
    label: 'theory',
  },
};

function classifyParagraph(name) {
  for (const [type, spec] of Object.entries(PARA_TYPES)) {
    if (spec.pattern && spec.pattern.test(name)) return type;
  }
  return 'theory';
}

function partBRequiredFiles() {
  return [
    { path: `${prefix} ${DASH} instapquiz.html`, type: 'html' },
    { path: `${prefix} ${DASH} nieuws-detective.html`, type: 'html' },
    { path: `${prefix} ${DASH} uitleg voorkennis.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} uitleg voorkennis.html`, type: 'html' },
    { path: 'Lees dit als je niet weet hoe je moet beginnen met deze les.docx', type: 'docx' },
    { path: `${prefix} ${DASH} presentatie.pptx`, type: 'pptx' },
    { path: `${prefix} ${DASH} uitleg vaardigheden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} uitleg vaardigheden.html`, type: 'html' },
    { path: `${prefix} ${DASH} nieuws met visual.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} samenvatting.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} youtube-videos.html`, type: 'html' },
    { path: `${prefix} ${DASH} stappenplan.html`, type: 'html' },
    { path: `${prefix} ${DASH} redeneer-spel.html`, type: 'html' },
    { path: `${prefix} ${DASH} wiskundevaardigheden.html`, type: 'html' },
    { path: `${prefix} ${DASH} begeleide inoefening ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} begeleide inoefening ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} begeleide inoefening.html`, type: 'html' },
    { path: `${prefix} ${DASH} basis ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} basis ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} midden ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} midden ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} verrijking ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} verrijking ${DASH} antwoorden.docx`, type: 'docx' },
    { path: 'index.html', type: 'html' },
  ];
}

function hasPartBMarkers() {
  if (hasFile('_paragraph-plan.md')) return true;
  return partBRequiredFiles()
    .filter(f => f.path !== 'index.html')
    .some(f => hasFile(f.path));
}

function hasPartAFiles() {
  return rootFiles.some(f => {
    const suffix = suffixOf(f);
    return ['paragraaf.md', 'opgaven.md', 'antwoorden.md', 'samenvatting.md', 'toets.md'].includes(suffix);
  });
}

function effectiveMode() {
  if (requestedMode !== 'auto') return requestedMode;
  if (hasPartBMarkers()) return hasPartAFiles() ? 'complete' : 'part-b';
  return 'part-a';
}

function extractImageRefs(markdownFiles) {
  const refs = new Set();
  for (const mdFile of markdownFiles) {
    const content = fs.readFileSync(path.join(PAR, mdFile), 'utf8');
    const matches = content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g);
    for (const match of matches) {
      const ref = match[1].split('#')[0].trim();
      if (ref && !/^https?:\/\//i.test(ref)) refs.add(ref);
    }
  }
  return refs;
}

function extractPlannedAssetBases() {
  const planPath = path.join(PAR, '_paragraph-plan.md');
  const bases = new Set();
  if (!fs.existsSync(planPath)) return bases;

  const content = fs.readFileSync(planPath, 'utf8');

  for (const match of content.matchAll(/\b(\d+\.\d+\.\d+_[A-Za-z0-9_-]+)\.(svg|png)\b/g)) {
    bases.add(match[1]);
  }
  for (const match of content.matchAll(/\b(\d+\.\d+\.\d+_[A-Za-z0-9_-]+)\.svg\/png\b/g)) {
    bases.add(match[1]);
  }

  return bases;
}

function validateAssets(markdownFiles, options = {}) {
  console.log('\n-- Asset integrity --');
  const assetsDir = path.join(PAR, '_assets');
  if (!fs.existsSync(assetsDir) || !fs.statSync(assetsDir).isDirectory()) {
    fail('MISSING _assets/ folder');
    return;
  }

  const assetFiles = fs.readdirSync(assetsDir).filter(f => fs.statSync(path.join(assetsDir, f)).isFile());
  const svgs = assetFiles.filter(f => f.endsWith('.svg'));
  const pngs = assetFiles.filter(f => f.endsWith('.png'));
  const pngSet = new Set(pngs);
  const svgSet = new Set(svgs);

  const refs = extractImageRefs(markdownFiles);
  const referencedBases = new Set();
  const plannedBases = options.includePlannedAssets ? extractPlannedAssetBases() : new Set();
  const trackedBases = new Set(plannedBases);
  let brokenRefs = 0;
  for (const ref of refs) {
    const normalized = ref.replace(/\\/g, '/');
    const refPath = path.resolve(PAR, normalized);
    const expectedRoot = path.resolve(PAR);
    if (!refPath.startsWith(expectedRoot)) {
      fail(`Image ref escapes paragraph folder: ${ref}`);
      brokenRefs++;
      continue;
    }
    if (!fs.existsSync(refPath)) {
      fail(`Broken image ref: ${ref}`);
      brokenRefs++;
    }
    const base = path.basename(ref).replace(/\.(svg|png)$/i, '');
    referencedBases.add(base);
    trackedBases.add(base);
  }

  for (const base of trackedBases) {
    const svg = `${base}.svg`;
    const png = `${base}.png`;
    if (!svgSet.has(svg)) fail(`Missing SVG for referenced asset: ${svg}`);
    if (!pngSet.has(png)) fail(`Missing PNG for referenced asset: ${png}`);
  }

  const SURFACE_SUFFIX_SRC = '(?:_(?:slide|doc|summary|web_light|web_dark))';
  const assetPattern = new RegExp(
    `^${parNr.replace(/\./g, '\\.')}_(?:fig|ex|we|mc|news)_[A-Za-z0-9]+${SURFACE_SUFFIX_SRC}?\\.(svg|png)$`
  );
  for (const base of referencedBases) {
    for (const ext of ['.svg', '.png']) {
      const file = `${base}${ext}`;
      if (assetFiles.includes(file) && !assetPattern.test(file)) {
        fail(`Non-compliant asset name: ${file} (must match X.Y.Z_{type}_{number}[_{surface}].ext)`);
      }
    }
  }

  const surfaceSuffixRe = new RegExp(`${SURFACE_SUFFIX_SRC}$`);
  for (const svg of svgs) {
    const base = svg.replace(/\.svg$/, '');
    if (trackedBases.size === 0 || trackedBases.has(base)) continue;
    // Accept surface-variant files when their parent concept base is tracked.
    const parent = base.replace(surfaceSuffixRe, '');
    if (parent !== base && trackedBases.has(parent)) continue;
    warn(`Orphaned asset: ${svg}`);
  }

  if (options.includePlannedAssets) {
    const pairs = [
      ['_web_light', '_web_dark'],
      ['_web_dark', '_web_light'],
    ];
    let asymmetryCount = 0;
    for (const [have, need] of pairs) {
      const haveRe = new RegExp(`${have}$`);
      for (const base of trackedBases) {
        if (!haveRe.test(base)) continue;
        const counterpart = base.replace(haveRe, need);
        if (!trackedBases.has(counterpart)) {
          fail(`Light/dark asymmetry: ${base} declared but ${counterpart} is not in _paragraph-plan.md`);
          asymmetryCount++;
        }
      }
    }
    const lightCount = [...trackedBases].filter(b => b.endsWith('_web_light')).length;
    if (asymmetryCount === 0 && lightCount > 0) {
      pass(`${lightCount} web_light/web_dark variant pair(s) symmetric`);
    }
  }

  if (brokenRefs === 0 && refs.size > 0) pass(`${refs.size} image refs all resolve`);
  if (plannedBases.size > 0) pass(`${plannedBases.size} companion asset(s) declared in _paragraph-plan.md`);
  pass(`_assets/: ${svgs.length} SVGs, ${pngs.length} PNGs`);
}

function validateReviewAndQualityRef() {
  console.log('\n-- QC artifacts --');
  const reviewFile = rootFiles.find(f => f === `${parNr}-review.md` || f.endsWith('-review.md'));
  if (!reviewFile) {
    fail('MISSING review report (X.Y.Z-review.md)');
  } else {
    const reviewContent = fs.readFileSync(path.join(PAR, reviewFile), 'utf8');
    const failCount = (reviewContent.match(/\bFAIL\b/gi) || []).length;
    if (failCount > 0) fail(`Review has ${failCount} unresolved FAIL item(s): ${reviewFile}`);
    else pass(`Review: ${reviewFile} (no unresolved FAILs)`);
  }

  const qualityRef = rootFiles.find(f => f === `${parNr}-quality-ref.yaml` || f.endsWith('-quality-ref.yaml'));
  if (!qualityRef) {
    fail('MISSING quality_ref (X.Y.Z-quality-ref.yaml)');
    return;
  }

  const yaml = fs.readFileSync(path.join(PAR, qualityRef), 'utf8');
  const missingMatch = yaml.match(/missing:\s*\[([^\]]*)\]/);
  const hasMissing = missingMatch && missingMatch[1].trim().length > 0;
  const pairedMatch = yaml.match(/svgpng_paired:\s*(true|false)/);
  const isPaired = !pairedMatch || pairedMatch[1] === 'true';
  const namingMatch = yaml.match(/naming_compliant:\s*(true|false)/);
  const isNaming = !namingMatch || namingMatch[1] === 'true';

  if (hasMissing) fail(`quality_ref reports missing assets: ${qualityRef}`);
  if (!isPaired) fail(`quality_ref reports unpaired SVG/PNG: ${qualityRef}`);
  if (!isNaming) fail(`quality_ref reports naming non-compliance: ${qualityRef}`);
  if (!hasMissing && isPaired && isNaming) pass(`Quality ref: ${qualityRef} (valid)`);
}

function validatePartA() {
  const type = classifyParagraph(folderName);
  const spec = PARA_TYPES[type];
  console.log('\n-- Part A textbook files --');
  pass(`Paragraph type: ${spec.label}`);

  const markdownFiles = [];
  for (const required of spec.requiredMd) {
    const file = findRootFileBySuffix(`${required}.md`);
    if (file) {
      markdownFiles.push(file);
      pass(`${required}.md: ${file}`);
    } else {
      fail(`MISSING ${required}.md`);
    }
  }

  for (const required of spec.requiredPdf) {
    const file = findRootFileBySuffix(`${required}.pdf`);
    if (!file) {
      fail(`MISSING ${required}.pdf`);
      continue;
    }
    const size = fileSize(file);
    if (size < 10000) fail(`PDF too small: ${file} (${(size / 1024).toFixed(1)} KB)`);
    else pass(`${file} (${(size / 1024).toFixed(0)} KB)`);
  }

  hasFile('build_pdf.py') ? pass('build_pdf.py') : fail('MISSING build_pdf.py');
  validateAssets(markdownFiles, { includePlannedAssets: mode === 'complete' });
  validateReviewAndQualityRef();
}

function validatePartB() {
  console.log('\n-- Part B companion files --');

  const required = partBRequiredFiles();
  let present = 0;
  for (const file of required) {
    if (!hasFile(file.path)) {
      fail(`MISSING: ${file.path}`);
      continue;
    }
    present++;
    const size = fileSize(file.path);
    if (file.type === 'docx') {
      if (!isDocxLike(file.path)) fail(`NOT VALID DOCX: ${file.path}`);
      else pass(`${file.path} (${(size / 1024).toFixed(1)} KB, valid docx)`);
    } else if (file.type === 'pptx') {
      if (size < 20000) fail(`PPTX TOO SMALL: ${file.path} (${(size / 1024).toFixed(1)} KB)`);
      else if (size < 100000) warn(`PPTX SMALL: ${file.path} (${(size / 1024).toFixed(1)} KB)`);
      else pass(`${file.path} (${(size / 1024).toFixed(1)} KB)`);
    } else if (file.type === 'html') {
      if (size < 500) warn(`HTML VERY SMALL: ${file.path} (${size} bytes)`);
      else pass(`${file.path} (${(size / 1024).toFixed(1)} KB)`);
    }
  }
  console.log(`  ${present}/${required.length} required Part B files present`);

  console.log('\n-- Part B plan and game data --');
  if (!hasFile('_paragraph-plan.md')) {
    fail('MISSING _paragraph-plan.md');
  } else {
    const plan = fs.readFileSync(path.join(PAR, '_paragraph-plan.md'), 'utf8');
    if (!/procedure-stappen/i.test(plan)) warn('Plan missing procedure-stappen-plan section');
    if (!/visuelen-toewijzing/i.test(plan)) warn('Plan missing visuelen-toewijzing section');
    if (!/terminologie/i.test(plan)) warn('Plan missing terminologie section');
    pass('_paragraph-plan.md');
  }

  const sharedDir = path.join(bookRoot, 'shared');
  const dataFiles = [
    { path: `questions/${parNr}.js`, label: 'Quiz data' },
    { path: `newsdetective/${parNr}.js`, label: 'Newsdetective data' },
    { path: `reasoning/${parNr}.js`, label: 'Reasoning data' },
    { path: `procedure/${parNr}.js`, label: 'Procedure data' },
    { path: `skilltree/${parNr}.js`, label: 'Skilltree data' },
  ];

  for (const data of dataFiles) {
    const fullPath = path.join(sharedDir, data.path);
    if (!fs.existsSync(fullPath)) {
      fail(`MISSING: shared/${data.path} (${data.label})`);
    } else {
      pass(`shared/${data.path} (${(fs.statSync(fullPath).size / 1024).toFixed(1)} KB)`);
    }
  }

  validateQuiz(path.join(sharedDir, 'questions', `${parNr}.js`));
  validateProcedure(path.join(sharedDir, 'procedure', `${parNr}.js`));
}

function validateQuiz(quizPath) {
  if (!fs.existsSync(quizPath)) return;
  try {
    const code = fs.readFileSync(quizPath, 'utf8');
    const fn = new Function(code + '\nreturn QUIZ_DATA;');
    const data = fn();
    const catKeys = Object.keys(data.categories || {});
    const questions = data.questions || [];
    pass(`Quiz: ${questions.length} questions, ${catKeys.length} categories`);
    for (const cat of catKeys) {
      const d3 = questions.filter(q => q.category === cat && q.difficulty === 3).length;
      if (d3 === 0) fail(`Quiz category "${cat}" has NO difficulty-3 questions`);
    }
  } catch (e) {
    fail(`Quiz data parse error: ${e.message}`);
  }
}

function validateProcedure(procedurePath) {
  if (!fs.existsSync(procedurePath)) return;
  try {
    const code = fs.readFileSync(procedurePath, 'utf8');
    const fn = new Function(code + '\nreturn PROCEDURE_DATA;');
    const data = fn();
    const procs = data.procedures || [];
    pass(`Stappenplan: ${procs.length} procedure(s) defined`);
  } catch (e) {
    fail(`Procedure data parse error: ${e.message}`);
  }
}

const mode = effectiveMode();

console.log(`\nValidating paragraph ${parNr} "${parName}"`);
console.log(`Path: ${PAR}`);
console.log(`Mode: ${mode}${requestedMode === 'auto' ? ' (auto)' : ''}`);

if (mode === 'part-a' || mode === 'complete') validatePartA();
if (mode === 'part-b' || mode === 'complete') validatePartB();

console.log('\n==========================================');
if (errors === 0 && warnings === 0) {
  console.log(`OK Paragraph ${parNr} "${parName}" PASSED all checks.`);
} else if (errors === 0) {
  console.log(`OK Paragraph ${parNr} "${parName}" passed with ${warnings} warning(s).`);
} else {
  console.log(`FAIL Paragraph ${parNr} "${parName}" failed: ${errors} error(s), ${warnings} warning(s).`);
}
console.log('');

process.exit(errors > 0 ? 1 : 0);
