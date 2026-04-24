#!/usr/bin/env node
/**
 * validate-chapter.js — Verify a built chapter meets Part A (textbook) standards.
 *
 * Usage:
 *   node scripts/validate-chapter.js <chapter-folder-path>
 *   node scripts/validate-chapter.js "../module test/1.4 Hoofdstuk Marktevenwicht en marginale analyse"
 *
 * Checks:
 *   - Chapter folder contains paragraph subfolders
 *   - Each paragraph has required files (theory: 3md+3pdf, consolidation: 2md+2pdf, test prep: type-specific)
 *   - Each paragraph has build_pdf.py
 *   - Asset completeness: every ![...] ref in .md resolves to a file in _assets/
 *   - SVG/PNG pairing: every .svg has a .png and vice versa
 *   - Asset naming convention: X.Y.Z_{type}_{number}.{ext}
 *   - No orphaned assets
 *   - Chapter assembly files exist (hoofdstuk.md/.pdf, antwoorden.md/.pdf, build_chapter.py)
 *   - Chapter PDF size > 500KB (images embedded)
 *   - Folder hierarchy: paragraphs inside chapter folder
 *   - Folder names match file prefixes
 */

const fs = require('fs');
const path = require('path');

const chapterPath = process.argv[2];
if (!chapterPath) {
  console.error('Usage: node scripts/validate-chapter.js <chapter-folder-path>');
  process.exit(1);
}

const CHAPTER = path.resolve(chapterPath);
if (!fs.existsSync(CHAPTER)) {
  console.error(`Chapter folder not found: ${CHAPTER}`);
  process.exit(1);
}

const chapterName = path.basename(CHAPTER);
const chapterMatch = chapterName.match(/^(\d+\.\d+)\s+Hoofdstuk\s+(.+)$/);
if (!chapterMatch) {
  console.error(`Cannot parse chapter folder name: ${chapterName}`);
  console.error('Expected format: "X.Y Hoofdstuk Name"');
  process.exit(1);
}
const chapterNr = chapterMatch[1];
const chapterTitle = chapterMatch[2];

console.log(`\nValidating chapter ${chapterNr} "${chapterTitle}"`);
console.log(`Path: ${CHAPTER}\n`);

let errors = 0;
let warnings = 0;

function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings++; }
function pass(msg) { console.log(`  ✓ ${msg}`); }

// ── Discover paragraph folders ─────────────────────────────────

console.log('── Paragraph discovery ──');

const entries = fs.readdirSync(CHAPTER, { withFileTypes: true });
const paraFolders = entries
  .filter(e => e.isDirectory() && /^\d+\.\d+\.\d+\s+/.test(e.name))
  .map(e => e.name)
  .sort();

if (paraFolders.length === 0) {
  fail('No paragraph folders found inside chapter folder');
  console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
}

// ── Paragraph type classification ──────────────────────────────
// Each type has: pattern (regex on folder name), required .md files, expected PDF count

const PARA_TYPES = {
  consolidation:          { pattern: /gemengde\s+opgaven/i,      requiredMd: ['opgaven', 'antwoorden'],                    pdfCount: 2, label: 'consolidation' },
  'testprep-summary':     { pattern: /actieve\s+samenvatting/i,  requiredMd: ['samenvatting', 'antwoorden'],                pdfCount: 2, label: 'test prep (summary)' },
  'testprep-examskills':  { pattern: /examenvaardigheden/i,      requiredMd: ['opgaven', 'antwoorden'],                     pdfCount: 2, label: 'test prep (exam skills)' },
  'testprep-integration': { pattern: /integratieoefening/i,      requiredMd: ['opgaven', 'antwoorden'],                     pdfCount: 2, label: 'test prep (integration)' },
  'testprep-practicetest':{ pattern: /proeftoets/i,              requiredMd: ['toets', 'antwoorden', 'toetsmatrijs'],       pdfCount: 3, label: 'test prep (practice test)' },
  theory:                 { pattern: null,                       requiredMd: ['paragraaf', 'opgaven', 'antwoorden'],        pdfCount: 3, label: 'theory' },
};

function classifyParagraph(folderName) {
  for (const [type, spec] of Object.entries(PARA_TYPES)) {
    if (spec.pattern && spec.pattern.test(folderName)) return type;
  }
  return 'theory'; // default
}

// Classify all paragraphs
const classified = {};
for (const f of paraFolders) {
  const type = classifyParagraph(f);
  if (!classified[type]) classified[type] = [];
  classified[type].push(f);
}

for (const [type, spec] of Object.entries(PARA_TYPES)) {
  const folders = classified[type] || [];
  if (folders.length > 0) {
    pass(`${folders.length} ${spec.label} paragraph(s): ${folders.map(f => f.split(' ')[0]).join(', ')}`);
  }
}
console.log();

// ── Per-paragraph checks ────────────────────────────────────────

function extractImageRefs(folder) {
  const refs = new Set();
  const mdFiles = fs.readdirSync(folder).filter(f => f.endsWith('.md'));
  for (const mdFile of mdFiles) {
    const content = fs.readFileSync(path.join(folder, mdFile), 'utf-8');
    const matches = content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g);
    for (const m of matches) {
      refs.add(m[1]);
    }
  }
  return refs;
}

function validateParagraph(folderName, paraType) {
  const folder = path.join(CHAPTER, folderName);
  const parNr = folderName.split(' ')[0];
  const parName = folderName.substring(parNr.length + 1);
  const spec = PARA_TYPES[paraType];

  console.log(`── ${folderName} (${spec.label}) ──`);

  // Check folder name matches file prefix
  const mdFiles = fs.readdirSync(folder).filter(f => f.endsWith('.md'));
  const partAMdFiles = mdFiles.filter(f => !f.startsWith('_'));
  for (const mdFile of partAMdFiles) {
    const filePrefix = mdFile.split(' – ')[0];
    if (filePrefix !== folderName) {
      // Check if it's just a different name format
      if (!mdFile.startsWith(parNr)) {
        fail(`File prefix mismatch: folder="${folderName}" file="${filePrefix}"`);
      }
    }
  }

  // Required .md files (type-specific)
  // Match on the suffix after the en-dash to avoid false positives from folder names
  // e.g., "9.5.1 Actieve samenvatting – antwoorden.md" should NOT match "samenvatting"
  for (const required of spec.requiredMd) {
    const found = mdFiles.find(f => {
      const suffix = f.split(' – ').pop() || f;
      return suffix.includes(required);
    });
    found ? pass(`${required}.md`) : fail(`MISSING ${required}.md`);
  }

  // Required .pdf files
  const pdfFiles = fs.readdirSync(folder).filter(f => f.endsWith('.pdf'));
  const expectedPdfCount = spec.pdfCount;
  if (pdfFiles.length >= expectedPdfCount) {
    for (const pdf of pdfFiles) {
      const size = fs.statSync(path.join(folder, pdf)).size;
      if (size < 10000) {
        fail(`PDF too small: ${pdf} (${(size / 1024).toFixed(1)} KB)`);
      } else {
        pass(`${pdf} (${(size / 1024).toFixed(0)} KB)`);
      }
    }
  } else {
    fail(`Expected ${expectedPdfCount} PDFs, found ${pdfFiles.length}`);
  }

  // build_pdf.py
  const buildScript = path.join(folder, 'build_pdf.py');
  fs.existsSync(buildScript) ? pass('build_pdf.py') : fail('MISSING build_pdf.py');

  // _assets/ folder
  const assetsDir = path.join(folder, '_assets');
  if (!fs.existsSync(assetsDir)) {
    fail('MISSING _assets/ folder');
  } else {
    const assetFiles = fs.readdirSync(assetsDir);
    const svgs = assetFiles.filter(f => f.endsWith('.svg'));
    const pngs = assetFiles.filter(f => f.endsWith('.png'));
    const svgSet = new Set(svgs);
    const pngSet = new Set(pngs);

    // Image reference resolution (Part A only)
    const refs = extractImageRefs(folder);
    let brokenRefs = 0;
    for (const ref of refs) {
      // Resolve relative to paragraph folder
      const refBase = path.basename(ref).replace('.svg', '.png');
      const fullPath = path.join(assetsDir, refBase);
      if (!fs.existsSync(fullPath)) {
        fail(`Broken image ref: ${ref}`);
        brokenRefs++;
      }
    }
    if (brokenRefs === 0 && refs.size > 0) {
      pass(`${refs.size} image refs all resolve`);
    }

    const referencedBases = new Set();
    for (const ref of refs) {
      const base = path.basename(ref).replace('.svg', '').replace('.png', '');
      referencedBases.add(base);
    }

    // SVG/PNG pairing for textbook-referenced assets only. Companion MVP work
    // may add extra visuals to _assets/ that are not used by the chapter gate.
    for (const base of referencedBases) {
      const svgName = `${base}.svg`;
      const pngName = `${base}.png`;
      if (!svgSet.has(svgName)) {
        fail(`Missing SVG for referenced asset: ${svgName}`);
      }
      if (!pngSet.has(pngName)) {
        fail(`Missing PNG for referenced asset: ${pngName}`);
      }
    }

    // Asset naming convention for textbook-referenced assets only.
    const validPattern = /^\d+\.\d+\.\d+_(fig|ex|we|mc)_\d+\.(svg|png)$/;
    for (const base of referencedBases) {
      for (const ext of ['.svg', '.png']) {
        const f = `${base}${ext}`;
        if (assetFiles.includes(f) && !validPattern.test(f)) {
          fail(`Non-compliant asset name: ${f} (must match X.Y.Z_{type}_{number}.ext)`);
        }
        if (assetFiles.includes(f) && !f.startsWith(parNr + '_')) {
          fail(`Asset prefix mismatch: ${f} does not start with ${parNr}_`);
        }
      }
    }

    pass(`_assets/: ${svgs.length} SVGs, ${pngs.length} PNGs`);

    // Orphaned assets
    for (const f of svgs) {
      const base = f.replace('.svg', '');
      if (!referencedBases.has(base)) {
        warn(`Orphaned asset: ${f}`);
      }
    }
  }

  // QC artifacts — required, not optional
  const reviewFile = fs.readdirSync(folder).find(f => f.endsWith('-review.md'));
  if (reviewFile) {
    // Check for unresolved FAIL items
    const reviewContent = fs.readFileSync(path.join(folder, reviewFile), 'utf-8');
    const failCount = (reviewContent.match(/\bFAIL\b/gi) || []).length;
    if (failCount > 0) {
      fail(`Review has ${failCount} unresolved FAIL item(s): ${reviewFile}`);
    } else {
      pass(`Review: ${reviewFile} (no unresolved FAILs)`);
    }
  } else {
    fail('MISSING review report (X.Y.Z-review.md)');
  }

  const qualityRef = fs.readdirSync(folder).find(f => f.endsWith('-quality-ref.yaml'));
  if (qualityRef) {
    // Validate quality_ref content
    const yamlContent = fs.readFileSync(path.join(folder, qualityRef), 'utf-8');
    const missingMatch = yamlContent.match(/missing:\s*\[([^\]]*)\]/);
    const hasMissing = missingMatch && missingMatch[1].trim().length > 0;
    const pairedMatch = yamlContent.match(/svgpng_paired:\s*(true|false)/);
    const isPaired = !pairedMatch || pairedMatch[1] === 'true';
    const namingMatch = yamlContent.match(/naming_compliant:\s*(true|false)/);
    const isNaming = !namingMatch || namingMatch[1] === 'true';

    if (hasMissing) fail(`quality_ref reports missing assets: ${qualityRef}`);
    if (!isPaired) fail(`quality_ref reports unpaired SVG/PNG: ${qualityRef}`);
    if (!isNaming) fail(`quality_ref reports naming non-compliance: ${qualityRef}`);
    if (!hasMissing && isPaired && isNaming) pass(`Quality ref: ${qualityRef} (valid)`);
  } else {
    fail('MISSING quality_ref (X.Y.Z-quality-ref.yaml)');
  }

  console.log();
}

for (const folder of paraFolders) {
  const type = classifyParagraph(folder);
  validateParagraph(folder, type);
}

// ── Chapter-level checks ────────────────────────────────────────

console.log('── Chapter assembly ──');

// Chapter files
const chapterFiles = fs.readdirSync(CHAPTER).filter(f => !fs.statSync(path.join(CHAPTER, f)).isDirectory());

const hoofdstukMd = chapterFiles.find(f => f.includes('hoofdstuk.md'));
const hoofdstukPdf = chapterFiles.find(f => f.includes('hoofdstuk.pdf'));
const antwMd = chapterFiles.find(f => f.includes('antwoorden.md'));
const antwPdf = chapterFiles.find(f => f.includes('antwoorden.pdf'));
const buildChapter = chapterFiles.includes('build_chapter.py');
const chapterPlan = chapterFiles.includes('_chapter-plan.md') || chapterFiles.find(f => f.includes('chapter-plan'));

hoofdstukMd ? pass(`Chapter md: ${hoofdstukMd}`) : fail('MISSING hoofdstuk.md');
hoofdstukPdf ? pass(`Chapter pdf: ${hoofdstukPdf}`) : fail('MISSING hoofdstuk.pdf');
antwMd ? pass(`Answers md: ${antwMd}`) : fail('MISSING antwoorden.md');
antwPdf ? pass(`Answers pdf: ${antwPdf}`) : fail('MISSING antwoorden.pdf');
buildChapter ? pass('build_chapter.py') : fail('MISSING build_chapter.py');
chapterPlan ? pass('Chapter plan exists') : warn('No _chapter-plan.md');

// Chapter PDF size
if (hoofdstukPdf) {
  const size = fs.statSync(path.join(CHAPTER, hoofdstukPdf)).size;
  if (size > 500000) {
    pass(`Chapter PDF size: ${(size / 1024).toFixed(0)} KB (images likely embedded)`);
  } else if (size > 100000) {
    warn(`Chapter PDF size: ${(size / 1024).toFixed(0)} KB (images may be missing)`);
  } else {
    fail(`Chapter PDF too small: ${(size / 1024).toFixed(0)} KB (images likely missing)`);
  }
}

// Chapter _assets/
const chapterAssets = path.join(CHAPTER, '_assets');
if (fs.existsSync(chapterAssets)) {
  const files = fs.readdirSync(chapterAssets);
  const svgs = files.filter(f => f.endsWith('.svg')).length;
  const pngs = files.filter(f => f.endsWith('.png')).length;
  pass(`Chapter _assets/: ${svgs} SVGs, ${pngs} PNGs`);

  // All assets should have the chapter prefix
  const expectedPrefix = chapterNr + '.';
  for (const f of files) {
    if ((f.endsWith('.svg') || f.endsWith('.png')) && !f.startsWith(expectedPrefix)) {
      fail(`Chapter asset wrong prefix: ${f} (expected ${expectedPrefix}*)`);
    }
  }
} else {
  fail('MISSING chapter _assets/ folder');
}

// Chapter markdown image refs
if (hoofdstukMd) {
  const refs = extractImageRefs(CHAPTER);
  let brokenRefs = 0;
  for (const ref of refs) {
    const refBase = path.basename(ref).replace('.svg', '.png');
    const fullPath = path.join(chapterAssets, refBase);
    if (!fs.existsSync(fullPath)) {
      fail(`Broken ref in chapter md: ${ref}`);
      brokenRefs++;
    }
  }
  if (brokenRefs === 0 && refs.size > 0) {
    pass(`${refs.size} chapter image refs all resolve`);
  }
}

// build_chapter.py path check
if (buildChapter) {
  const script = fs.readFileSync(path.join(CHAPTER, 'build_chapter.py'), 'utf-8');
  if (script.includes('BASE.parent')) {
    fail('build_chapter.py uses BASE.parent (should use BASE — paragraphs are inside chapter folder)');
  } else {
    pass('build_chapter.py path: MODULE = BASE (correct)');
  }
}

// ── Folder hierarchy check ──────────────────────────────────────

console.log('\n── Folder hierarchy ──');

// Check that no paragraph folders exist at the same level as the chapter folder
const parentDir = path.dirname(CHAPTER);
const siblings = fs.readdirSync(parentDir, { withFileTypes: true })
  .filter(e => e.isDirectory() && /^\d+\.\d+\.\d+\s+/.test(e.name))
  .map(e => e.name);

if (siblings.length > 0) {
  for (const s of siblings) {
    const sibNr = s.split(' ')[0];
    if (sibNr.startsWith(chapterNr + '.')) {
      fail(`Paragraph folder "${s}" is OUTSIDE the chapter folder (should be inside)`);
    }
  }
} else {
  pass('No paragraph folders at parent level (correct hierarchy)');
}

// ── Summary ─────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(50)}`);
console.log(`Chapter ${chapterNr}: ${errors} error(s), ${warnings} warning(s)`);
if (errors === 0) {
  console.log('✓ CHAPTER VALIDATION PASSED');
} else {
  console.log('✗ CHAPTER VALIDATION FAILED');
}
console.log();

process.exit(errors > 0 ? 1 : 0);
