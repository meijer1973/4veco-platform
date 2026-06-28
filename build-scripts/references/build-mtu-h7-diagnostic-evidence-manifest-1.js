#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const CURATOR_VIEW = 'reports/mtu-hardening/mtu-h7-execution-curator-view-1.json';
const OUT_JSON = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json';
const OUT_MD = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.md';
const EVIDENCE_DIR = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1-evidence';

const AUTHORITY_FLAGS = {
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  target_exercise_mutation_authorized: false,
  candidate_storage_authorized: false,
  candidate_write_authorized: false,
  lesson_output_authorized: false,
  product_route_authorized: false,
  diagnostics_authorized: false,
  mastery_authorized: false,
  adaptive_routing_authorized: false,
  sequencing_authorized: false,
  pv_authorized: false,
  summative_use_authorized: false,
  student_use_authorized: false
};

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function pdfPages(relativePath) {
  const raw = execFileSync('pdfinfo', [repoPath(relativePath)], { encoding: 'utf8' });
  const match = raw.match(/^Pages:\s+(\d+)/m);
  if (!match) throw new Error(`Could not read PDF page count for ${relativePath}`);
  return Number(match[1]);
}

function pdfTextPage(relativePath, page) {
  return execFileSync('pdftotext', ['-f', String(page), '-l', String(page), '-layout', repoPath(relativePath), '-'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10
  });
}

function promptPdfPath(record) {
  return `references/external/exams/${record.source_locator.exam}.pdf`;
}

function correctionPdfPath(record) {
  return `references/external/exams/${record.source_locator.exam.replace(/-o$/, '-c')}.pdf`;
}

function questionStartMap(correctionPdf) {
  const pages = pdfPages(correctionPdf);
  const starts = [];
  for (let page = 1; page <= pages; page += 1) {
    const text = pdfTextPage(correctionPdf, page);
    const regex = /^\s*(\d{1,2})\s+maximumscore\b/gm;
    let match;
    while ((match = regex.exec(text)) !== null) {
      starts.push({ question_num: Number(match[1]), page });
    }
  }
  starts.sort((a, b) => a.question_num - b.question_num || a.page - b.page);
  return { pages, starts };
}

function correctionRange(correctionPdf, questionNum) {
  const { pages, starts } = questionStartMap(correctionPdf);
  const startIndex = starts.findIndex((entry) => entry.question_num === questionNum);
  if (startIndex === -1) {
    throw new Error(`Could not locate correction model for q${questionNum} in ${correctionPdf}`);
  }
  const start = starts[startIndex];
  const next = starts.slice(startIndex + 1).find((entry) => entry.question_num > questionNum);
  return {
    page_start: start.page,
    page_end: next ? Math.max(start.page, next.page - 1) : pages,
    detection: 'pdftotext_layout_question_number_maximumscore'
  };
}

function renderPage(pdfRelativePath, page, outputStem) {
  const outDir = repoPath(EVIDENCE_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  const outputPrefix = path.join(outDir, outputStem);
  const result = spawnSync('pdftoppm', [
    '-f',
    String(page),
    '-l',
    String(page),
    '-png',
    repoPath(pdfRelativePath),
    outputPrefix
  ], {
    cwd: ROOT,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    throw new Error(`pdftoppm failed for ${pdfRelativePath} page ${page}: ${result.stderr || result.stdout}`);
  }
  const renderedName = fs
    .readdirSync(outDir)
    .find((name) => name.startsWith(`${outputStem}-`) && name.endsWith('.png'));
  const renderedPath = `${EVIDENCE_DIR}/${renderedName}`;
  if (!renderedName || !fs.existsSync(repoPath(renderedPath))) {
    throw new Error(`Expected rendered PNG missing for output stem: ${outputStem}`);
  }
  return {
    source_pdf_path: pdfRelativePath,
    source_pdf_sha256: sha256File(pdfRelativePath),
    page_number: page,
    rendered_png_path: renderedPath,
    rendered_png_sha256: sha256File(renderedPath)
  };
}

function safeStem(record, role, page) {
  const exam = record.source_locator.exam.replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');
  return `${exam}-q${String(record.source_locator.question_num).padStart(2, '0')}-${role}-${String(page).padStart(2, '0')}`;
}

function renderRange(record, role, pdfPath, start, end) {
  const rendered = [];
  for (let page = start; page <= end; page += 1) {
    rendered.push(renderPage(pdfPath, page, safeStem(record, role, page)));
  }
  return rendered;
}

function build() {
  const curator = readJson(CURATOR_VIEW);
  const diagnosticRecords = (curator.selected_records || []).filter((record) => record.split === 'diagnostic');
  const generatedAt = new Date().toISOString();
  fs.rmSync(repoPath(EVIDENCE_DIR), { recursive: true, force: true });
  const records = diagnosticRecords.map((record) => {
    const promptPdf = promptPdfPath(record);
    const correctionPdf = correctionPdfPath(record);
    const correction = correctionRange(correctionPdf, record.source_locator.question_num);
    return {
      record_id: record.sample_id,
      evidence_state: 'diagnostic_official_prompt_and_correction_pages_rendered_no_mapping_or_outcome',
      source_locator: {
        exam: record.source_locator.exam,
        opgave_num: record.source_locator.opgave_num,
        question_num: record.source_locator.question_num,
        prompt_pdf_path: promptPdf,
        prompt_page_start: record.source_locator.page_start,
        prompt_page_end: record.source_locator.page_end,
        correction_pdf_path: correctionPdf,
        correction_page_start: correction.page_start,
        correction_page_end: correction.page_end,
        correction_page_detection: correction.detection
      },
      rendered_prompt_pages: renderRange(
        record,
        'prompt',
        promptPdf,
        record.source_locator.page_start,
        record.source_locator.page_end
      ),
      rendered_correction_pages: renderRange(
        record,
        'correction',
        correctionPdf,
        correction.page_start,
        correction.page_end
      )
    };
  });

  const manifest = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    manifest_id: 'mtu-h7-diagnostic-evidence-manifest-1',
    status: 'diagnostic_official_evidence_rendered_no_mapping_or_outcomes',
    generated_at: generatedAt,
    source_curator_view: CURATOR_VIEW,
    diagnostic_record_count: records.length,
    locked_holdout_records_rendered: 0,
    records,
    authority_flags: AUTHORITY_FLAGS
  };

  writeJson(OUT_JSON, manifest);
  writeText(OUT_MD, renderMarkdown(manifest));
  return manifest;
}

function renderMarkdown(manifest) {
  const rows = manifest.records
    .map(
      (record) =>
        `| ${record.record_id} | ${record.source_locator.prompt_page_start}-${record.source_locator.prompt_page_end} | ${record.source_locator.correction_page_start}-${record.source_locator.correction_page_end} | ${record.rendered_prompt_pages.length} | ${record.rendered_correction_pages.length} |`
    )
    .join('\n');

  return `# MTU H7 Diagnostic Evidence Manifest 1

Status: \`${manifest.status}\`

Diagnostic records rendered: ${manifest.diagnostic_record_count}

Locked holdout records rendered: ${manifest.locked_holdout_records_rendered}

No H7 mappings, outcomes, lesson output, protected-reference mutation, product route, or student/product use are authorized.

| Record | Prompt pages | Correction pages | Prompt PNGs | Correction PNGs |
| --- | --- | --- | ---: | ---: |
${rows}
`;
}

try {
  const manifest = build();
  console.log(`OK ${SPRINT_ID}: rendered diagnostic evidence for ${manifest.records.length} records`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
