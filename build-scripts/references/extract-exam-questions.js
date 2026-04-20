#!/usr/bin/env node
/**
 * extract-exam-questions.js
 *
 * Parse CvTE havo/vwo economie opgaven PDFs in references/external/exams/
 * into a structured question table at
 *   references/external/exam-questions.json
 *
 * Each row captures the machine-extractable facts about a question; the
 * annotation fields (required_skills, question_type, exam_codes) are left
 * empty for the audit pass to fill via unit-add / unit-update.
 *
 * Row shape:
 *   {
 *     exam: "vw-1022-a-25-1",        // exam code
 *     level: "vwo",                  // vwo | havo
 *     year: 2025,
 *     tijdvak: 1,
 *     opgave_num: 1,
 *     opgave_name: "Zorgverzekering",
 *     question_num: 3,
 *     points: 2,
 *     text: "Bereken tot welk bedrag ...",
 *     required_skills: [],           // unit IDs — TODO via audit
 *     question_type: null,           // from vraagtypen-en-opgaveontwerp — TODO
 *     exam_codes: []                 // eindtermen — TODO
 *   }
 *
 * The opgaven PDFs use tab-separated question rows:
 *   <points>p \t <question-number> \t <question-text>
 * Question text can span multiple lines; we concatenate until the next
 * question start or the next Opgave header.
 */

const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const EXAMS_DIR = path.join(REPO_ROOT, 'references/external/exams');
const OUT_JSON  = path.join(REPO_ROOT, 'references/external/exam-questions.json');

// Match the "2p\t3\t<text>" line. The PDF sometimes renders the tab as
// wide whitespace; we accept runs of whitespace as a tab.
const QUESTION_START_RE = /^(\d+)p\s+(\d+)\s+(.+?)\s*$/;
const OPGAVE_RE = /^Opgave\s+(\d+)\s+(.+?)\s*$/;
const PAGE_FOOTER_RE = /^-- (\d+) of \d+ --$/;
// Case-insensitive: the PDFs render `HA-1022-a-…` with uppercase HA, not the
// lowercase form the exam code uses. Without the /i flag, the page header
// leaks into the preceding question's text on every page.
const PAGE_HEADER_RE = /^[vh][wa]-1022-a-\d+-\d+-o\s+\d+ \/ \d+\s+lees verder/i;
// End-of-exam boilerplate: once any of these appears, stop accumulating.
const END_OF_EXAM_RE = /^(Bronvermelding|einde|Examenopgaven|Let op:)\b/i;
// OOXML broken-image placeholder (from the PowerPoint export of some exams).
const BROKEN_IMG_RE = /De gekoppelde afbeelding kan niet worden weergegeven\.[^]*?juiste locatie\./g;
// Private-use-area glyphs left over from PDF font substitution (bullets, etc.)
const PUA_RE = /[\uE000-\uF8FF]/g;

function parseExamCode(filename) {
  const m = filename.match(/^(vw|ha)-1022-a-(\d\d)-(\d)-o\.pdf$/);
  if (!m) return null;
  return {
    code: filename.replace(/\.pdf$/, ''),
    level: m[1] === 'vw' ? 'vwo' : 'havo',
    year: 2000 + parseInt(m[2], 10),
    tijdvak: parseInt(m[3], 10),
  };
}

function cleanText(s) {
  return s
    .replace(BROKEN_IMG_RE, '')
    .replace(PUA_RE, '')
    // Page header with exam code prefix: `HA-1022-a-23-1-o 3 / 10 lees verder ►►►`
    .replace(/\b[VvHh][WwAa]-1022-a-\d+-\d+-o\s+\d+\s*\/\s*\d+\s+lees verder\s*[►▶\s]*/gi, ' ')
    // Page header without exam code prefix (some PDFs render it that way):
    // `2 / 13 lees verder ►►►`
    .replace(/\b\d+\s*\/\s*\d+\s+lees verder\s*[►▶\s]*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuestions(text, examMeta) {
  const lines = text.split(/\r?\n/);
  const questions = [];
  let currentOpgave = null;
  let currentQuestion = null;
  let currentPage = 1;
  let afterExam = false;

  function flush() {
    if (currentQuestion) {
      if (currentQuestion.page_end == null) currentQuestion.page_end = currentPage;
      currentQuestion.text = cleanText(currentQuestion.text);
      questions.push(currentQuestion);
      currentQuestion = null;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Hard stop once the exam boilerplate section begins — Bronvermelding,
    // einde, etc. — so post-exam text doesn't bleed into the last question.
    if (END_OF_EXAM_RE.test(trimmed)) {
      flush();
      afterExam = true;
      continue;
    }
    if (afterExam) continue;

    // Footer "-- N of M --" tells us which page we just finished; use that
    // as the running page counter for page_start/page_end on each question.
    const footer = PAGE_FOOTER_RE.exec(trimmed);
    if (footer) {
      currentPage = parseInt(footer[1], 10) + 1;
      continue;
    }
    if (PAGE_HEADER_RE.test(trimmed)) continue;

    const op = OPGAVE_RE.exec(trimmed);
    if (op) {
      flush();
      currentOpgave = { num: parseInt(op[1], 10), name: op[2].trim() };
      continue;
    }

    const q = QUESTION_START_RE.exec(line);
    if (q && currentOpgave) {
      flush();
      currentQuestion = {
        exam: examMeta.code,
        level: examMeta.level,
        year: examMeta.year,
        tijdvak: examMeta.tijdvak,
        opgave_num: currentOpgave.num,
        opgave_name: currentOpgave.name,
        question_num: parseInt(q[2], 10),
        points: parseInt(q[1], 10),
        page_start: currentPage,
        page_end: null,
        text: q[3],
        required_skills: [],
        question_type: null,
        exam_codes: [],
      };
      continue;
    }

    if (currentQuestion) {
      currentQuestion.text += ' ' + trimmed;
      currentQuestion.page_end = currentPage;
    }
  }
  flush();
  return questions;
}

async function main() {
  if (!fs.existsSync(EXAMS_DIR)) {
    console.error(`missing: ${EXAMS_DIR}`);
    process.exit(1);
  }

  // Preserve existing annotations (required_skills, question_type, exam_codes)
  // across re-extractions. The raw extraction produces empty placeholders;
  // without this merge they would overwrite audit-applied annotations.
  const existingByKey = new Map();
  if (fs.existsSync(OUT_JSON)) {
    try {
      for (const row of JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'))) {
        existingByKey.set(row.exam + ':' + row.question_num, row);
      }
    } catch { /* ignore malformed */ }
  }

  const pdfFiles = fs.readdirSync(EXAMS_DIR)
    .filter(f => /-o\.pdf$/.test(f))
    .sort();
  if (pdfFiles.length === 0) {
    console.error('no opgaven PDFs found; run download-exams.js first');
    process.exit(1);
  }

  const all = [];
  for (const f of pdfFiles) {
    const meta = parseExamCode(f);
    if (!meta) { console.warn(`skipping ${f}: cannot parse code`); continue; }
    const buf = fs.readFileSync(path.join(EXAMS_DIR, f));
    const text = (await new PDFParse({ data: new Uint8Array(buf) }).getText()).text;
    const questions = extractQuestions(text, meta);
    // Carry forward existing annotations when present.
    for (const q of questions) {
      const prior = existingByKey.get(q.exam + ':' + q.question_num);
      if (prior) {
        if (Array.isArray(prior.required_skills)) q.required_skills = prior.required_skills;
        if (prior.question_type !== undefined) q.question_type = prior.question_type;
        if (Array.isArray(prior.exam_codes)) q.exam_codes = prior.exam_codes;
      }
    }
    console.log(`${f}: ${questions.length} questions`);
    all.push(...questions);
  }

  all.sort((a, b) => {
    if (a.exam !== b.exam) return a.exam.localeCompare(b.exam);
    return a.question_num - b.question_num;
  });

  fs.writeFileSync(OUT_JSON, JSON.stringify(all, null, 2) + '\n');
  const annotated = all.filter(q => q.required_skills && q.required_skills.length > 0).length;
  console.log(`\nwrote ${path.relative(REPO_ROOT, OUT_JSON)} (${all.length} total; ${annotated} already annotated)`);

  const byExam = {};
  const byType = {};
  for (const q of all) {
    byExam[q.exam] = (byExam[q.exam] || 0) + 1;
  }
  console.log('distribution:', byExam);
}

if (require.main === module) main().catch(err => { console.error(err); process.exit(1); });

module.exports = { parseExamCode, extractQuestions };
