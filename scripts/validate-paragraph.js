#!/usr/bin/env node
/**
 * validate-paragraph.js - Verify one flat-layout 4veco-lessen paragraph.
 *
 * Usage:
 *   node scripts/validate-paragraph.js [--mode auto|part-a|part-b|complete] [--profile student-web|legacy-full|office|publisher-print] <paragraph-folder-path>
 *
 * Modes:
 *   auto      Validates Part A unless companion files are present.
 *   part-a    Textbook paragraph only.
 *   part-b    Companion paragraph only.
 *   complete  Part A + Part B.
 *
 * Profiles:
 *   student-web      Default. Student-facing HTML/games/presentation; no DOCX or PDF requirement.
 *   legacy-full      Previous full contract: Part A PDFs + all 27 Part B files.
 *   office           Student web plus Office exports (.docx handouts).
 *   publisher-print  Publisher/print gate: Part A PDFs required; Part B not required.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DASH = '\u2013';
const VALID_MODES = new Set(['auto', 'part-a', 'part-b', 'complete']);
const VALID_PROFILES = new Set(['student-web', 'legacy-full', 'office', 'publisher-print']);

function usage() {
  console.error('Usage: node scripts/validate-paragraph.js [--mode auto|part-a|part-b|complete] [--profile student-web|legacy-full|office|publisher-print] <paragraph-folder-path>');
}

function parseArgs(argv) {
  let mode = 'auto';
  let profile = process.env.PARAGRAPH_OUTPUT_PROFILE || 'student-web';
  let paragraphPath = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--mode') {
      mode = argv[++i];
    } else if (arg.startsWith('--mode=')) {
      mode = arg.slice('--mode='.length);
    } else if (arg === '--profile') {
      profile = argv[++i];
    } else if (arg.startsWith('--profile=')) {
      profile = arg.slice('--profile='.length);
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
  if (!VALID_PROFILES.has(profile)) {
    console.error(`Invalid profile: ${profile}`);
    usage();
    process.exit(1);
  }
  if (!paragraphPath) {
    usage();
    process.exit(1);
  }

  return { mode, profile, paragraphPath };
}

const { mode: requestedMode, profile, paragraphPath } = parseArgs(process.argv.slice(2));
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

function studentWebPartBFiles() {
  return [
    { path: `${prefix} ${DASH} instapquiz.html`, type: 'html' },
    { path: `${prefix} ${DASH} nieuws-detective.html`, type: 'html' },
    { path: `${prefix} ${DASH} uitleg voorkennis.html`, type: 'html' },
    { path: `${prefix} ${DASH} presentatie.pptx`, type: 'pptx' },
    { path: `${prefix} ${DASH} presentatie.html`, type: 'html' },
    { path: `${prefix} ${DASH} uitleg vaardigheden.html`, type: 'html' },
    { path: `${prefix} ${DASH} nieuws met visual.html`, type: 'html' },
    { path: `${prefix} ${DASH} samenvatting.html`, type: 'html' },
    { path: `${prefix} ${DASH} youtube-videos.html`, type: 'html' },
    { path: `${prefix} ${DASH} stappenplan.html`, type: 'html' },
    { path: `${prefix} ${DASH} redeneer-spel.html`, type: 'html' },
    { path: `${prefix} ${DASH} wiskundevaardigheden.html`, type: 'html' },
    { path: `${prefix} ${DASH} begeleide inoefening.html`, type: 'html' },
    { path: 'index.html', type: 'html' },
  ];
}

function officePartBFiles() {
  return [
    { path: `${prefix} ${DASH} uitleg voorkennis.docx`, type: 'docx' },
    { path: 'Lees dit als je niet weet hoe je moet beginnen met deze les.docx', type: 'docx' },
    { path: `${prefix} ${DASH} uitleg vaardigheden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} nieuws met visual.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} samenvatting.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} begeleide inoefening ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} begeleide inoefening ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} basis ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} basis ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} midden ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} midden ${DASH} antwoorden.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} verrijking ${DASH} vragen.docx`, type: 'docx' },
    { path: `${prefix} ${DASH} verrijking ${DASH} antwoorden.docx`, type: 'docx' },
  ];
}

function partBRequiredFiles(activeProfile = profile) {
  const webFiles = studentWebPartBFiles();
  if (activeProfile === 'student-web' || activeProfile === 'publisher-print') return webFiles;
  return [...webFiles, ...officePartBFiles()];
}

function allKnownPartBFiles() {
  return partBRequiredFiles('legacy-full');
}

function hasPartBMarkers() {
  if (hasFile('_paragraph-plan.md')) return true;
  return allKnownPartBFiles()
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

/**
 * Parse the verdict from a companion-style review file.
 *
 * The review files (X.Y.Z-review.md and X.Y.Z-companion-visual-review.md)
 * declare an explicit verdict block, typically:
 *
 *   ## 2. Verdict
 *
 *   **FAIL**
 *
 * (or **PASS** / **PASS WITH FLAGS**). Pre-L1.5V/F2 the validator counted
 * every `\bFAIL\b` token in the document, including FAIL-named hard-fail
 * sub-headings (`### HF-1`-style entries also include the word FAIL in
 * their explanation). That over-counted FAILs and used a flaky filename
 * match. This parser is structured: it returns the explicit verdict.
 *
 * Returns one of: 'PASS' | 'PASS WITH FLAGS' | 'FAIL' | null.
 */
function parseReviewVerdict(content) {
  // Look for "## ... Verdict" then the next non-empty line.
  const re = /##\s*\d*\.?\s*Verdict[^\n]*\n+([^\n]+)/i;
  const m = content.match(re);
  if (!m) return null;
  const line = m[1].trim().replace(/^\*+|\*+$/g, '').trim().toUpperCase();
  if (line === 'PASS') return 'PASS';
  if (line === 'PASS WITH FLAGS') return 'PASS WITH FLAGS';
  if (line === 'FAIL') return 'FAIL';
  return null;
}

/** Count unresolved hard-fail sections (### HF-* headings) in a review. */
function countHardFails(content) {
  return (content.match(/^###\s*HF-\d+\b/gm) || []).length;
}

/**
 * F2 / L1.5V: gate on the Part A textbook review file specifically.
 * Uses an EXACT filename match (no flaky endsWith). The verdict is parsed
 * structurally from the "## 2. Verdict" line.
 */
function validatePartARecord() {
  console.log('\n-- Part A QC artifacts --');
  const reviewFile = `${parNr}-review.md`;
  if (!hasFile(reviewFile)) {
    fail(`MISSING Part A review report (${reviewFile})`);
  } else {
    const content = fs.readFileSync(path.join(PAR, reviewFile), 'utf8');
    const verdict = parseReviewVerdict(content);
    if (verdict === 'FAIL') {
      fail(`Part A review verdict is FAIL: ${reviewFile}`);
    } else if (verdict === null) {
      // No verdict block found — fall back to legacy FAIL-token count to
      // avoid masking malformed reviews. Strict: any FAIL token fails.
      const failTokens = (content.match(/^\*+FAIL\*+/gm) || []).length;
      if (failTokens > 0) fail(`Part A review has ${failTokens} FAIL marker(s) (no explicit Verdict section): ${reviewFile}`);
      else pass(`Part A review: ${reviewFile} (no explicit verdict, no FAIL markers)`);
    } else {
      pass(`Part A review: ${reviewFile} (verdict ${verdict})`);
    }
  }
  validateQualityRef();
}

/**
 * F2 / L1.5V Bucket A3+A4 (review-output) + B (procedure mismatch) gate.
 * Reads X.Y.Z-companion-visual-review.md if present and FAILs when its
 * verdict is FAIL. The companion review file is the closure proof for
 * Part B; absence in --mode part-b or --mode complete is a hard fail.
 */
function validatePartBRecord() {
  console.log('\n-- Part B QC artifacts --');
  const reviewFile = `${parNr}-companion-visual-review.md`;
  if (!hasFile(reviewFile)) {
    fail(`MISSING companion visual review (${reviewFile}) — run agents/econ-companion-visual-review.md`);
  } else {
    const content = fs.readFileSync(path.join(PAR, reviewFile), 'utf8');
    const verdict = parseReviewVerdict(content);
    const hfCount = countHardFails(content);
    if (verdict === 'FAIL') {
      fail(`Companion review verdict is FAIL (${hfCount} hard-fail section(s)): ${reviewFile}`);
    } else if (verdict === null) {
      // Fall back: explicit verdict missing — surface plainly, don't guess.
      fail(`Companion review has no explicit Verdict section: ${reviewFile}`);
    } else if (hfCount > 0) {
      // Per agents/econ-companion-visual-review.md verdict rules: BOTH
      // PASS and PASS WITH FLAGS require zero hard fails. If a verdict
      // line says PASS / PASS WITH FLAGS but ### HF-N sections still
      // appear in the document, the verdict is internally inconsistent —
      // refuse to pass and require the reviewer to either close the HF
      // sections or revise the verdict to FAIL.
      fail(`Companion review verdict ${verdict} but ${hfCount} unresolved HF section(s) present: ${reviewFile}`);
    } else {
      pass(`Companion review: ${reviewFile} (verdict ${verdict})`);
    }
  }
}

/**
 * F3 / L1.5V: parse quality-ref.yaml respecting both schema_version 2
 * (partA: + companion: blocks) and the legacy top-level layout.
 */
function validateQualityRef() {
  const qualityRefName = `${parNr}-quality-ref.yaml`;
  if (!hasFile(qualityRefName)) {
    fail(`MISSING quality_ref (${qualityRefName})`);
    return;
  }

  const yaml = fs.readFileSync(path.join(PAR, qualityRefName), 'utf8');

  // Locate the partA: block if present; otherwise treat the whole file as
  // legacy top-level (schema_version 1). The block ends at the next non-
  // indented top-level key (column 0). Line-based extraction — JS regex
  // has no `\Z` end-of-string anchor, and `$` with the m flag matches end
  // of line, which trips order-dependent parses when partA: is the final
  // top-level block.
  function blockOf(name) {
    const lines = yaml.split('\n');
    const startRe = new RegExp(`^${name}:\\s*$`);
    const topKeyRe = /^[A-Za-z_][A-Za-z0-9_]*:\s*$/;
    const startIdx = lines.findIndex(l => startRe.test(l));
    if (startIdx < 0) return null;
    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (topKeyRe.test(lines[i])) { endIdx = i; break; }
    }
    return lines.slice(startIdx + 1, endIdx).join('\n');
  }
  const partA = blockOf('partA') || yaml;

  const missingMatch = partA.match(/missing:\s*\[([^\]]*)\]/);
  const hasMissing = missingMatch && missingMatch[1].trim().length > 0;
  const pairedMatch = partA.match(/svgpng_paired:\s*(true|false)/);
  const isPaired = !pairedMatch || pairedMatch[1] === 'true';
  const namingMatch = partA.match(/naming_compliant:\s*(true|false)/);
  const isNaming = !namingMatch || namingMatch[1] === 'true';

  if (hasMissing) fail(`quality_ref reports missing assets: ${qualityRefName}`);
  if (!isPaired) fail(`quality_ref reports unpaired SVG/PNG: ${qualityRefName}`);
  if (!isNaming) fail(`quality_ref reports naming non-compliance: ${qualityRefName}`);
  if (!hasMissing && isPaired && isNaming) pass(`Quality ref: ${qualityRefName} (valid)`);
}

function qualityRefContent() {
  const qualityRefName = `${parNr}-quality-ref.yaml`;
  const fullPath = path.join(PAR, qualityRefName);
  if (!fs.existsSync(fullPath)) return '';
  return fs.readFileSync(fullPath, 'utf8');
}

function declaredB02StepCount() {
  const yaml = qualityRefContent();
  const m = yaml.match(/procedure_b02_step_count:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

function declaredProcedureStepCounts() {
  const yaml = qualityRefContent();
  const counts = [];
  const re = /^\s+([a-z0-9_]+)_step_count:\s*(\d+)/gmi;
  let m;
  while ((m = re.exec(yaml)) !== null) {
    if (m[1] === 'procedure_b02') continue;
    counts.push({ key: m[1], expected: Number(m[2]) });
  }
  return counts;
}

function stripHtml(content) {
  return content
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, ' · ')
    .replace(/&mdash;/g, ' — ')
    .replace(/&ndash;/g, ' – ');
}

function validateB02ProcedureParity() {
  const expected = declaredB02StepCount();
  if (expected !== 4) return;

  console.log('\n-- B02 cross-surface procedure parity --');

  const surfaces = [
    { label: 'paragraaf.md', file: findRootFileBySuffix('paragraaf.md') },
    { label: 'opgaven.md', file: findRootFileBySuffix('opgaven.md') },
    { label: 'antwoorden.md', file: findRootFileBySuffix('antwoorden.md') },
    { label: 'uitleg vaardigheden.html', file: findRootFileBySuffix('uitleg vaardigheden.html'), html: true },
    { label: 'instapquiz.html', file: findRootFileBySuffix('instapquiz.html'), html: true },
    { label: 'presentatie.html', file: findRootFileBySuffix('presentatie.html'), html: true },
    { label: 'stappenplan procedure data', fullPath: path.join(bookRoot, 'shared', 'procedure', `${parNr}.js`) },
    { label: 'begeleide inoefening.html', file: findRootFileBySuffix('begeleide inoefening.html'), html: true },
    { label: 'samenvatting.html', file: findRootFileBySuffix('samenvatting.html'), html: true },
    { label: 'youtube-videos.html', file: findRootFileBySuffix('youtube-videos.html'), html: true },
  ];

  let checked = 0;
  for (const surface of surfaces) {
    if (!surface.file && !surface.fullPath) continue;
    const fullPath = surface.fullPath || path.join(PAR, surface.file);
    if (!fs.existsSync(fullPath)) continue;
    checked++;
    const raw = fs.readFileSync(fullPath, 'utf8');
    const text = surface.html ? stripHtml(raw) : raw;
    const legacyThreeStep = /(?:drie|3)\s*[- ]?\s*stappen/i.test(text);
    const hasFourthStep = /(?:vier|4)\s*[- ]?\s*stappen|Stap\s*4\b|\|\s*4\s*\||\b04\b/i.test(text);
    const hasNetValue = /nettowaarde/i.test(text);

    if (legacyThreeStep || !hasFourthStep || !hasNetValue) {
      const reasons = [];
      if (legacyThreeStep) reasons.push('contains legacy 3-step wording');
      if (!hasFourthStep) reasons.push('missing visible fourth-step signal');
      if (!hasNetValue) reasons.push('missing nettowaarde signal');
      const displayPath = surface.file || path.relative(PAR, fullPath);
      fail(`B02 procedure parity: ${surface.label} (${displayPath}) ${reasons.join('; ')}`);
    }
  }

  if (checked === 0) {
    warn('B02 procedure parity skipped: no tracked surfaces found');
  } else {
    pass(`B02 procedure parity checked ${checked} surface(s) against canonical 4-step procedure`);
  }
}

function normalizeProcedureKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function procedureAliases(key) {
  const aliases = {
    procentuele_verandering: ['procentuele_verandering', 'procentuele_verandering_berekenen'],
    indexcijfer: ['indexcijfer', 'indexcijfer_berekenen'],
    indexpunten_procenten: [
      'indexpunten_procenten',
      'indexpunten_en_procenten_onderscheiden',
      'indexpunten_en_procentuele_verandering_onderscheiden',
    ],
  };
  return aliases[key] || [key];
}

function validateDeclaredProcedureStepCounts() {
  const declared = declaredProcedureStepCounts();
  if (declared.length === 0) return;

  console.log('\n-- Declared procedure step-count parity --');

  const procedurePath = path.join(bookRoot, 'shared', 'procedure', `${parNr}.js`);
  if (!fs.existsSync(procedurePath)) {
    fail(`Procedure step-count parity: missing shared procedure data (${path.relative(PAR, procedurePath)})`);
    return;
  }

  let data;
  try {
    const code = fs.readFileSync(procedurePath, 'utf8');
    const fn = new Function(code + '\nreturn PROCEDURE_DATA;');
    data = fn();
  } catch (e) {
    fail(`Procedure step-count parity: procedure data parse error: ${e.message}`);
    return;
  }

  const procs = data.procedures || [];
  let checked = 0;
  for (const item of declared) {
    const aliases = procedureAliases(item.key);
    const proc = procs.find(p => {
      const id = normalizeProcedureKey(p.id);
      const title = normalizeProcedureKey(p.title);
      return aliases.some(alias => id === alias || title.includes(alias));
    });

    if (!proc) {
      fail(`Procedure step-count parity: no procedure data found for ${item.key}`);
      continue;
    }

    checked++;
    const chooseCount = (proc.steps || []).filter(step => step.type === 'choose').length;
    if (chooseCount !== item.expected) {
      fail(`Procedure step-count parity: ${item.key} declares ${item.expected} step(s), but procedure data has ${chooseCount}`);
    }
  }

  if (checked > 0) {
    pass(`Procedure step-count parity checked ${checked} declared procedure(s)`);
  }
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

  const requireHtml = profile === 'student-web' || profile === 'office';
  const requirePdf = profile === 'legacy-full' || profile === 'publisher-print';

  if (requireHtml) {
    for (const required of spec.requiredMd) {
      const file = findRootFileBySuffix(`${required}.html`);
      if (!file) {
        fail(`MISSING ${required}.html (student-web profile)`);
        continue;
      }
      const size = fileSize(file);
      if (size < 500) warn(`HTML VERY SMALL: ${file} (${size} bytes)`);
      else pass(`${file} (${(size / 1024).toFixed(1)} KB)`);
    }
  }

  if (requirePdf) {
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
  } else {
    const pdfsPresent = spec.requiredPdf.filter(required => findRootFileBySuffix(`${required}.pdf`)).length;
    if (pdfsPresent > 0) pass(`Publisher-print PDFs present but not required by ${profile} profile`);
  }

  if (requirePdf) {
    hasFile('build_pdf.py') ? pass('build_pdf.py') : fail('MISSING build_pdf.py');
  } else if (hasFile('build_pdf.py')) {
    pass(`build_pdf.py present but not required by ${profile} profile`);
  }
  validateAssets(markdownFiles, {
    includePlannedAssets: mode === 'complete' || profile === 'publisher-print',
  });
  validatePartARecord();
}

function validatePartB() {
  console.log('\n-- Part B companion files --');

  const required = partBRequiredFiles();
  pass(`Output profile: ${profile} (${required.length} required Part B file(s))`);
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
  console.log(`  ${present}/${required.length} required Part B files present (${profile})`);

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
console.log(`Profile: ${profile}`);

if (mode === 'part-a' || mode === 'complete') validatePartA();
if (mode === 'part-b' || mode === 'complete') validatePartB();
// L1.5V Bucket F2: companion-review gate is now mode-aware. `--mode part-b`
// and `--mode complete` require X.Y.Z-companion-visual-review.md to exist
// AND have a non-FAIL verdict. The Part A review file is checked inside
// validatePartA() via validatePartARecord().
if (mode === 'part-b' || mode === 'complete') validatePartBRecord();
if (mode === 'complete') validateB02ProcedureParity();
if (mode === 'complete') validateDeclaredProcedureStepCounts();

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
