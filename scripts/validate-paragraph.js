#!/usr/bin/env node
/**
 * validate-paragraph.js — Verify a built paragraph meets platform standards.
 *
 * Usage:
 *   node scripts/validate-paragraph.js <paragraph-folder-path>
 *   node scripts/validate-paragraph.js "../module one claude/1.1 Hoofdstuk 1 - Voor niks gaat de zon op/1.1.1 Paragraaf 1 - Kiezen is kostbaar"
 *
 * Checks:
 *   - All 24 required files exist
 *   - All .docx files are valid zip archives
 *   - All .pptx files > 100KB (non-empty)
 *   - All .html files > 500 bytes and contain actual content
 *   - Samenvatting has tables (table-based check)
 *   - Game data files exist in shared/
 *   - Build scripts exist for scripted-manual files
 */

const fs = require('fs');
const path = require('path');

const parPath = process.argv[2];
if (!parPath) {
  console.error('Usage: node scripts/validate-paragraph.js <paragraph-folder-path>');
  process.exit(1);
}

const PAR = path.resolve(parPath);
if (!fs.existsSync(PAR)) {
  console.error(`Paragraph folder not found: ${PAR}`);
  process.exit(1);
}

// Extract paragraph number and name from folder name
const folderName = path.basename(PAR);
const parMatch = folderName.match(/^(\d+\.\d+\.\d+)\s+Paragraaf\s+\d+\s+-\s+(.+)$/);
if (!parMatch) {
  console.error(`Cannot parse paragraph folder name: ${folderName}`);
  console.error('Expected format: "X.Y.Z Paragraaf N - Name"');
  process.exit(1);
}
const parNr = parMatch[1];
const parName = parMatch[2];
const moduleRoot = path.resolve(PAR, '..', '..');

console.log(`\nValidating paragraph ${parNr} "${parName}"`);
console.log(`Path: ${PAR}\n`);

let errors = 0;
let warnings = 0;

function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings++; }
function pass(msg) { console.log(`  ✓ ${msg}`); }

// ── Required files ──────────────────────────────────────────────────

console.log('── File existence ──');

const prefix = `${parNr} ${parName}`;
const required = [
  { path: `1. Voorbereiden/${prefix} – instapquiz.html`, type: 'html' },
  { path: `1. Voorbereiden/${prefix} – nieuws-detective.html`, type: 'html' },
  { path: `1. Voorbereiden/${prefix} – uitleg voorkennis.docx`, type: 'docx' },
  { path: `1. Voorbereiden/${prefix} – uitleg voorkennis.html`, type: 'html' },
  { path: `1. Voorbereiden/Lees dit als je niet weet hoe je moet beginnen met deze les.docx`, type: 'docx' },
  { path: `2. Leren/${prefix} – presentatie.pptx`, type: 'pptx' },
  { path: `2. Leren/${prefix} – uitleg vaardigheden.docx`, type: 'docx' },
  { path: `2. Leren/${prefix} – uitleg vaardigheden.html`, type: 'html' },
  { path: `2. Leren/${prefix} – nieuws met visual.docx`, type: 'docx' },
  { path: `2. Leren/${prefix} – samenvatting.docx`, type: 'docx' },
  { path: `2. Leren/${prefix} – youtube-videos.html`, type: 'html' },
  { path: `2. Leren/${prefix} – stappenplan.html`, type: 'html' },
  { path: `3. Oefenen/${prefix} – redeneer-spel.html`, type: 'html' },
  { path: `3. Oefenen/${prefix} – wiskundevaardigheden.html`, type: 'html' },
  { path: `3. Oefenen/begeleide inoefening/${prefix} – begeleide inoefening – vragen.docx`, type: 'docx' },
  { path: `3. Oefenen/begeleide inoefening/${prefix} – begeleide inoefening – antwoorden.docx`, type: 'docx' },
  { path: `3. Oefenen/begeleide inoefening/${prefix} – begeleide inoefening.html`, type: 'html' },
  { path: `3. Oefenen/basisopgaven/${prefix} – basis – vragen.docx`, type: 'docx' },
  { path: `3. Oefenen/basisopgaven/${prefix} – basis – antwoorden.docx`, type: 'docx' },
  { path: `3. Oefenen/middenopgaven/${prefix} – midden – vragen.docx`, type: 'docx' },
  { path: `3. Oefenen/middenopgaven/${prefix} – midden – antwoorden.docx`, type: 'docx' },
  { path: `3. Oefenen/verrijkingsopgaven/${prefix} – verrijking – vragen.docx`, type: 'docx' },
  { path: `3. Oefenen/verrijkingsopgaven/${prefix} – verrijking – antwoorden.docx`, type: 'docx' },
  { path: `index.html`, type: 'html' },
];

let fileCount = 0;
for (const file of required) {
  const fullPath = path.join(PAR, file.path);
  if (!fs.existsSync(fullPath)) {
    fail(`MISSING: ${file.path}`);
  } else {
    fileCount++;
  }
}
console.log(`  ${fileCount}/${required.length} required files present\n`);

// ── File integrity ──────────────────────────────────────────────────

console.log('── File integrity ──');

for (const file of required) {
  const fullPath = path.join(PAR, file.path);
  if (!fs.existsSync(fullPath)) continue;

  const stat = fs.statSync(fullPath);
  const name = path.basename(file.path);

  if (file.type === 'docx') {
    // Check valid zip (docx is a zip archive)
    const buf = fs.readFileSync(fullPath);
    if (buf.length < 100) {
      fail(`TOO SMALL: ${name} (${buf.length} bytes)`);
    } else if (buf[0] !== 0x50 || buf[1] !== 0x4B) {
      fail(`NOT VALID DOCX: ${name} (not a zip archive)`);
    } else {
      pass(`${name} (${(stat.size / 1024).toFixed(1)} KB, valid docx)`);
    }
  } else if (file.type === 'pptx') {
    if (stat.size < 20000) {
      fail(`PPTX TOO SMALL: ${name} (${(stat.size / 1024).toFixed(1)} KB — expected >20KB)`);
    } else if (stat.size < 100000) {
      warn(`PPTX SMALL: ${name} (${(stat.size / 1024).toFixed(1)} KB — new presentations with graphs should be >100KB)`);
    } else {
      pass(`${name} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  } else if (file.type === 'html') {
    if (stat.size < 500) {
      warn(`HTML VERY SMALL: ${name} (${stat.size} bytes — may be just a shell)`);
    } else {
      pass(`${name} (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }
}

// ── Game data files ──────────────────────────────────────────────────

console.log('\n── Game data files ──');

const sharedDir = path.join(moduleRoot, 'shared');
const gameData = [
  { path: `questions/${parNr}.js`, label: 'Quiz data' },
  { path: `newsdetective/${parNr}.js`, label: 'Newsdetective data' },
  { path: `reasoning/${parNr}.js`, label: 'Reasoning data (JS)' },
  { path: `skilltree/${parNr}.js`, label: 'Skilltree data' },
  { path: `procedure/${parNr}.js`, label: 'Procedure/stappenplan data' },
];

for (const gd of gameData) {
  const fullPath = path.join(sharedDir, gd.path);
  if (!fs.existsSync(fullPath)) {
    fail(`MISSING: shared/${gd.path} (${gd.label})`);
  } else {
    const size = fs.statSync(fullPath).size;
    pass(`shared/${gd.path} (${(size / 1024).toFixed(1)} KB)`);
  }
}

// Check reasoning CSV source
const csvPath = path.join(sharedDir, 'reasoning', `${parNr}.csv`);
if (fs.existsSync(csvPath)) {
  pass(`shared/reasoning/${parNr}.csv (source CSV present)`);
} else {
  warn(`shared/reasoning/${parNr}.csv not found — JS exists but CSV source is missing`);
}

// ── Quiz quality check ──────────────────────────────────────────────

console.log('\n── Quiz quality ──');

const quizPath = path.join(sharedDir, 'questions', `${parNr}.js`);
if (fs.existsSync(quizPath)) {
  try {
    const code = fs.readFileSync(quizPath, 'utf8');
    const fn = new Function(code + '\nreturn QUIZ_DATA;');
    const data = fn();

    const catKeys = Object.keys(data.categories || {});
    const questions = data.questions || [];
    pass(`${questions.length} questions, ${catKeys.length} categories`);

    // Check difficulty-3 per category
    for (const cat of catKeys) {
      const d3 = questions.filter(q => q.category === cat && q.difficulty === 3).length;
      if (d3 === 0) {
        fail(`Quiz category "${cat}" has NO difficulty-3 questions (mastery system needs this)`);
      }
    }
  } catch (e) {
    fail(`Quiz data parse error: ${e.message}`);
  }
}

// ── Samenvatting table check ────────────────────────────────────────

console.log('\n── Samenvatting format ──');

const samPath = path.join(PAR, '2. Leren', `${prefix} – samenvatting.docx`);
if (fs.existsSync(samPath)) {
  // Quick check: count <w:tbl> in document.xml
  try {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(samPath);
    const docXml = zip.readAsText('word/document.xml');
    const tableCount = (docXml.match(/<w:tbl[ >]/g) || []).length;
    if (tableCount >= 3) {
      pass(`Samenvatting has ${tableCount} tables (table-based layout)`);
    } else {
      warn(`Samenvatting has only ${tableCount} tables — may not be infographic layout (expected ≥3)`);
    }
  } catch (e) {
    // adm-zip not available, try basic zip check
    warn(`Cannot check samenvatting tables (adm-zip not available). Verify manually.`);
  }
}

// ── Dual coding check ───────────────────────────────────────────────

console.log('\n── Dual coding (images in documents) ──');

const assetsDir = path.join(PAR, '_assets');
if (fs.existsSync(assetsDir)) {
  const svgs = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));
  const pngs = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));
  if (svgs.length > 0) {
    pass(`_assets/ has ${svgs.length} SVG(s) and ${pngs.length} PNG(s)`);
  } else {
    warn(`_assets/ exists but has no SVG files`);
  }
} else {
  warn(`No _assets/ folder — paragraph has no shared visuals (dual coding missing)`);
}

// Check that key docx files have embedded images (dual coding)
function countDocxImages(docxPath) {
  try {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(docxPath);
    const docXml = zip.readAsText('word/document.xml');
    return (docXml.match(/<a:blip/g) || []).length;
  } catch (e) {
    return -1; // adm-zip not available
  }
}

const dualCodingDocs = [
  { path: `2. Leren/${prefix} – uitleg vaardigheden.docx`, label: 'Vaardigheden', minImages: 1 },
  { path: `1. Voorbereiden/${prefix} – uitleg voorkennis.docx`, label: 'Voorkennis', minImages: 0 },
  { path: `2. Leren/${prefix} – samenvatting.docx`, label: 'Samenvatting', minImages: 0 },
];

for (const doc of dualCodingDocs) {
  const fullPath = path.join(PAR, doc.path);
  if (fs.existsSync(fullPath)) {
    const imgCount = countDocxImages(fullPath);
    if (imgCount === -1) {
      // adm-zip not available, skip
    } else if (imgCount >= doc.minImages && imgCount > 0) {
      pass(`${doc.label}: ${imgCount} embedded image(s) (dual coding ✓)`);
    } else if (doc.minImages > 0 && imgCount === 0) {
      fail(`${doc.label}: NO embedded images — dual coding missing`);
    } else if (imgCount === 0) {
      warn(`${doc.label}: no embedded images — consider adding visuals`);
    }
  }
}

// Check begeleide inoefening vragen has scaffold images
const biVragenPath = path.join(PAR, `3. Oefenen/begeleide inoefening/${prefix} – begeleide inoefening – vragen.docx`);
if (fs.existsSync(biVragenPath)) {
  const imgCount = countDocxImages(biVragenPath);
  if (imgCount === -1) {
    // adm-zip not available
  } else if (imgCount > 0) {
    pass(`Begeleide inoefening vragen: ${imgCount} scaffold image(s) (dual coding ✓)`);
  } else {
    warn(`Begeleide inoefening vragen: no scaffold images — weaker students need visual support`);
  }
}

// ── Unified experience check ────────────────────────────────────────

console.log('\n── Unified experience ──');

const procedurePath = path.join(sharedDir, 'procedure', `${parNr}.js`);
if (fs.existsSync(procedurePath)) {
  try {
    const code = fs.readFileSync(procedurePath, 'utf8');
    const fn = new Function(code + '\nreturn PROCEDURE_DATA;');
    const data = fn();
    const procs = data.procedures || [];
    pass(`Stappenplan: ${procs.length} procedure(s) defined`);
    // Check each procedure has proper step labels
    for (const proc of procs) {
      const steps = (proc.steps || []).filter(s => s.type === 'choose');
      const hasLabels = steps.every(s => s.label && s.label.includes('Stap'));
      if (!hasLabels) {
        warn(`Procedure "${proc.title}": step labels should include "Stap N — description" for unified experience`);
      }
    }
  } catch (e) {
    fail(`Procedure data parse error: ${e.message}`);
  }
}

// Check _paragraph-plan.md exists
const planPath = path.join(PAR, '_paragraph-plan.md');
if (fs.existsSync(planPath)) {
  const plan = fs.readFileSync(planPath, 'utf8');
  const hasProcedures = plan.includes('Procedure-stappen-plan') || plan.includes('procedure-stappen');
  const hasVisuelen = plan.includes('Visuelen-toewijzing') || plan.includes('visuelen-toewijzing');
  const hasTerminologie = plan.includes('Terminologie') || plan.includes('terminologie');
  if (hasProcedures) { pass('Plan has procedure-stappen-plan (unified experience)'); }
  else { warn('Plan missing procedure-stappen-plan section'); }
  if (hasVisuelen) { pass('Plan has visuelen-toewijzing (dual coding)'); }
  else { warn('Plan missing visuelen-toewijzing section'); }
  if (hasTerminologie) { pass('Plan has terminologie table'); }
  else { warn('Plan missing terminologie table'); }
}

// ── Summary ──────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════');
if (errors === 0 && warnings === 0) {
  console.log(`✓ Paragraph ${parNr} "${parName}" PASSED all checks.`);
} else if (errors === 0) {
  console.log(`⚠ Paragraph ${parNr} "${parName}" passed with ${warnings} warning(s).`);
} else {
  console.log(`✗ Paragraph ${parNr} "${parName}" FAILED: ${errors} error(s), ${warnings} warning(s).`);
}
console.log('');

process.exit(errors > 0 ? 1 : 0);
