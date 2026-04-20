#!/usr/bin/env node
/**
 * extract-eindtermen.js
 *
 * Parse the CvTE syllabus PDF at
 *   references/external/syllabus-economie-vwo-2026-versie-2.pdf
 * into
 *   references/external/syllabus-eindtermen.md
 *   references/external/syllabus-eindtermen.json
 *
 * The syllabus is the authoritative source for every `exam_codes` entry
 * on a teaching unit. Re-run yearly when CvTE publishes a new syllabus;
 * reports/exam-program-delta.md diffs the new extraction against the
 * committed snapshot.
 *
 * The emitted format is defined in references/external/syllabus-eindtermen.md
 * (format spec, produced by the scaffold commit). Each eindterm is emitted
 * as an H3 block with fixed fields; the JSON is a sorted array.
 */

const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PDF_PATH  = path.join(REPO_ROOT, 'references/external/syllabus-economie-vwo-2026-versie-2.pdf');
const OUT_MD    = path.join(REPO_ROOT, 'references/external/syllabus-eindtermen.md');
const OUT_JSON  = path.join(REPO_ROOT, 'references/external/syllabus-eindtermen.json');

const VERB_TO_BLOOM = [
  // order matters: evaluate > analyze > apply > understand > remember
  { verbs: ['beoordelen', 'evalueren'], bloom: 'evaluate' },
  { verbs: ['analyseren', 'onderscheiden', 'classificeren'], bloom: 'analyze' },
  { verbs: ['berekenen', 'toepassen', 'afleiden'], bloom: 'apply' },
  { verbs: ['uitleggen', 'beschrijven', 'verklaren'], bloom: 'understand' },
  { verbs: ['herkennen', 'benoemen'], bloom: 'remember' },
];

const DOMAIN_NAMES = {
  A: 'Vaardigheden',
  D: 'Concept markt',
  E: 'Concept ruilen over tijd',
  F: 'Concept samenwerken en onderhandelen',
  G: 'Concept risico en informatie',
  H: 'Concept welvaart en groei',
  I: 'Concept goede tijden, slechte tijden',
};

const SYLLABUS_YEAR = 2026;

// ----- pdf → raw text -----

async function extractText() {
  const buf = fs.readFileSync(PDF_PATH);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const result = await parser.getText();
  return result.text;
}

// ----- line-based parser -----

function isPageFooter(line) {
  if (!line.trim()) return true;
  if (/^-- \d+ of \d+ --$/.test(line.trim())) return true;
  if (/^Pagina \d+ van \d+$/.test(line.trim())) return true;
  if (/^ECONOMIE VWO \| SYLLABUS CENTRAAL EXAMEN \d+$/.test(line.trim())) return true;
  if (/^Versie \d+$/.test(line.trim())) return true;
  return false;
}

function isTocDomainLine(line) {
  // TOC entries end with a page number; spec headers don't.
  return /^\s*\d+\.\d+\s+DOMEIN\s+[A-K]\s+.+\s+\d+\s*$/.test(line);
}

function isSpecDomainLine(line) {
  return /^\s*\d+\.\d+\s+DOMEIN\s+[A-K]\s+.+$/.test(line) && !isTocDomainLine(line);
}

function parseDomainLine(line) {
  const m = line.match(/^\s*\d+\.\d+\s+DOMEIN\s+([A-K])\s+(.+?)\s*$/);
  return m ? { letter: m[1], title: m[2].replace(/\s+\d+\s*$/, '').trim() } : null;
}

function parseSubdomainHeader(line) {
  const m = line.match(/^([A-K])(\d+):?\s+(.+?)\s*$/);
  return m ? { letter: m[1], num: m[2], title: m[3].trim() } : null;
}

function verbsFromIntro(line) {
  const verbs = [];
  const lower = line.toLowerCase();
  for (const { verbs: vs } of VERB_TO_BLOOM) {
    for (const v of vs) {
      if (lower.includes(v)) verbs.push(v);
    }
  }
  return verbs;
}

function bloomFromVerbs(verbs) {
  for (const { verbs: vs, bloom } of VERB_TO_BLOOM) {
    if (verbs.some(v => vs.includes(v))) return bloom;
  }
  return 'understand';
}

function parseEindtermStart(line) {
  const m = line.match(/^\s*(\d+)\.(\d+)([a-z]?)\s+(.+?)\s*$/);
  return m ? { sub: m[1], num: m[2], suffix: m[3], text: m[4] } : null;
}

// Main line-by-line parser. Returns an array of entries.
function parseEindtermen(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let currentDomain = null;
  let currentSubdomain = null;
  let currentVerbs = [];
  let currentEindterm = null;
  let inSpecSection = false;

  function flushCurrent() {
    if (!currentEindterm) return;
    let tekst = currentEindterm.lines.join(' ').replace(/\s+/g, ' ').trim();
    // Strip trailing footnote refs like "… van vraag. (1)".
    tekst = tekst.replace(/\s*\(\d+\)\s*$/g, '');
    entries.push({
      code: currentEindterm.code,
      domein: currentDomain ? currentDomain.letter : null,
      domein_title: currentDomain ? DOMAIN_NAMES[currentDomain.letter] || currentDomain.title : null,
      subdomein: currentSubdomain ? `${currentSubdomain.letter}${currentSubdomain.num}` : null,
      subdomein_title: currentSubdomain ? currentSubdomain.title : null,
      tekst,
      verbs: [...currentVerbs],
      implied_bloom: bloomFromVerbs(currentVerbs),
      examen: 'centraal',
      year: SYLLABUS_YEAR,
    });
    currentEindterm = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isPageFooter(line)) continue;

    if (isSpecDomainLine(line)) {
      flushCurrent();
      currentDomain = parseDomainLine(line);
      currentSubdomain = null;
      currentVerbs = [];
      inSpecSection = true;
      continue;
    }

    if (!inSpecSection) continue;

    const sub = parseSubdomainHeader(line);
    // Accept subdomain header as an implicit domain switch when the letter
    // differs from currentDomain (the CvTE PDF omits "3.X DOMEIN G" before
    // the G-subdomains and jumps straight from F content into "G1:").
    if (sub && currentDomain && sub.letter !== currentDomain.letter && DOMAIN_NAMES[sub.letter]) {
      flushCurrent();
      currentDomain = { letter: sub.letter, title: DOMAIN_NAMES[sub.letter] };
      currentSubdomain = sub;
      currentVerbs = [];
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (/^\s*De kandidaat kan /.test(lines[j])) {
          let verbLine = lines[j].trim();
          if (!/:\s*$/.test(verbLine) && j + 1 < lines.length) verbLine += ' ' + lines[j + 1].trim();
          currentVerbs = verbsFromIntro(verbLine);
          break;
        }
      }
      continue;
    }
    if (sub && currentDomain && sub.letter === currentDomain.letter) {
      flushCurrent();
      currentSubdomain = sub;
      currentVerbs = [];
      // Look ahead for the "De kandidaat kan ..." line to pick up verbs.
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (/^\s*De kandidaat kan /.test(lines[j])) {
          // verbs line may span two lines; collect a bit.
          let verbLine = lines[j].trim();
          if (!/:\s*$/.test(verbLine) && j + 1 < lines.length) verbLine += ' ' + lines[j + 1].trim();
          currentVerbs = verbsFromIntro(verbLine);
          break;
        }
      }
      continue;
    }

    // Skip "De kandidaat kan ..." intro lines — they're handled above.
    if (/^\s*De kandidaat kan /.test(line)) continue;

    const start = parseEindtermStart(line);
    if (start && currentSubdomain && start.sub === currentSubdomain.num) {
      flushCurrent();
      currentEindterm = {
        code: `${currentSubdomain.letter}${currentSubdomain.num}.${start.num}${start.suffix}`,
        lines: [start.text],
      };
      continue;
    }

    // Continuation of current eindterm.
    if (currentEindterm) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Stop accumulating when we hit a new subdomain letter prefix unlikely
      // to be part of eindterm text (e.g. "G2: ...").
      if (parseSubdomainHeader(line) && currentDomain && parseSubdomainHeader(line).letter === currentDomain.letter) {
        // Handled at top of loop on next iteration; don't absorb here.
        flushCurrent();
        continue;
      }
      // Skip footnote lines (single digit + space + text at the tail of a page).
      if (/^\d+\s+Moral Hazard\b/.test(trimmed)) continue;
      currentEindterm.lines.push(trimmed);
    }
  }
  flushCurrent();

  // Deduplicate by code (same code may appear in TOC page as a repeat; we
  // prefer the one with non-empty text and the most specific tekst).
  const byCode = new Map();
  for (const e of entries) {
    if (!byCode.has(e.code) || byCode.get(e.code).tekst.length < e.tekst.length) {
      byCode.set(e.code, e);
    }
  }
  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code, 'en', { numeric: true }));
}

// ----- emit -----

function emitMarkdown(entries) {
  const lines = [
    '# Syllabus Eindtermen — Machine-Extracted Register',
    '',
    `**This file is machine-generated.** Source: \`references/external/syllabus-economie-vwo-2026-versie-2.pdf\` (CvTE official syllabus). Regenerated by \`build-scripts/references/extract-eindtermen.js\`. Do not hand-edit.`,
    '',
    `Generated: ${new Date().toISOString()}`,
    `Entries:   ${entries.length}`,
    `Year:      ${SYLLABUS_YEAR}`,
    '',
    '---',
    '',
    '## Entries',
    '',
  ];
  for (const e of entries) {
    lines.push(`### ${e.code}`);
    lines.push(`- Domein: ${e.domein} (${e.domein_title})`);
    lines.push(`- Subdomein: ${e.subdomein} (${e.subdomein_title})`);
    lines.push(`- Tekst: ${JSON.stringify(e.tekst)}`);
    lines.push(`- Verbs: [${e.verbs.join(', ')}]`);
    lines.push(`- Implied bloom: ${e.implied_bloom}`);
    lines.push(`- Examen: ${e.examen}`);
    lines.push(`- Year: ${e.year}`);
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`missing: ${PDF_PATH}`);
    process.exit(1);
  }
  console.log(`reading ${path.relative(REPO_ROOT, PDF_PATH)}...`);
  const text = await extractText();
  console.log(`extracted ${text.length} chars`);

  const entries = parseEindtermen(text);
  console.log(`parsed ${entries.length} eindtermen`);

  fs.writeFileSync(OUT_MD, emitMarkdown(entries));
  fs.writeFileSync(OUT_JSON, JSON.stringify(entries, null, 2) + '\n');
  console.log(`wrote ${path.relative(REPO_ROOT, OUT_MD)}`);
  console.log(`wrote ${path.relative(REPO_ROOT, OUT_JSON)}`);

  // Small preview for the log.
  const byDomain = {};
  for (const e of entries) byDomain[e.domein] = (byDomain[e.domein] || 0) + 1;
  console.log('distribution:', byDomain);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { parseEindtermen, emitMarkdown };
