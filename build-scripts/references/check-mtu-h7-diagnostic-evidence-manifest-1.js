#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const MANIFEST = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json';

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function pngDimensions(relativePath) {
  const buffer = fs.readFileSync(repoPath(relativePath));
  if (buffer.slice(1, 4).toString('ascii') !== 'PNG') return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function validate() {
  const failures = [];
  const manifest = readJson(MANIFEST);
  if (manifest.sprint_id !== SPRINT_ID) failures.push('sprint_id mismatch');
  if (manifest.status !== 'diagnostic_official_evidence_rendered_no_mapping_or_outcomes') {
    failures.push(`status mismatch: ${manifest.status}`);
  }
  if (manifest.diagnostic_record_count !== 16 || (manifest.records || []).length !== 16) {
    failures.push('diagnostic evidence manifest must contain exactly 16 diagnostic records');
  }
  if (manifest.locked_holdout_records_rendered !== 0) {
    failures.push('diagnostic evidence manifest must not render locked-holdout records');
  }
  if (!allFalse(manifest.authority_flags)) failures.push('authority flags must all be false');

  const seen = new Set();
  for (const record of manifest.records || []) {
    if (seen.has(record.record_id)) failures.push(`duplicate record: ${record.record_id}`);
    seen.add(record.record_id);
    if (!record.rendered_prompt_pages || record.rendered_prompt_pages.length < 1) {
      failures.push(`missing prompt render for ${record.record_id}`);
    }
    if (!record.rendered_correction_pages || record.rendered_correction_pages.length < 1) {
      failures.push(`missing correction render for ${record.record_id}`);
    }
    for (const render of [...(record.rendered_prompt_pages || []), ...(record.rendered_correction_pages || [])]) {
      if (!fs.existsSync(repoPath(render.source_pdf_path))) failures.push(`missing source PDF: ${render.source_pdf_path}`);
      if (!fs.existsSync(repoPath(render.rendered_png_path))) failures.push(`missing rendered PNG: ${render.rendered_png_path}`);
      if (fs.existsSync(repoPath(render.source_pdf_path)) && render.source_pdf_sha256 !== sha256File(render.source_pdf_path)) {
        failures.push(`source PDF hash mismatch: ${render.source_pdf_path}`);
      }
      if (fs.existsSync(repoPath(render.rendered_png_path)) && render.rendered_png_sha256 !== sha256File(render.rendered_png_path)) {
        failures.push(`rendered PNG hash mismatch: ${render.rendered_png_path}`);
      }
      const dimensions = pngDimensions(render.rendered_png_path);
      if (!dimensions || dimensions.width < 500 || dimensions.height < 500) {
        failures.push(`rendered PNG appears invalid or too small: ${render.rendered_png_path}`);
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      records: (manifest.records || []).length,
      prompt_pngs: (manifest.records || []).reduce((sum, record) => sum + (record.rendered_prompt_pages || []).length, 0),
      correction_pngs: (manifest.records || []).reduce((sum, record) => sum + (record.rendered_correction_pages || []).length, 0)
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(
    `OK ${SPRINT_ID}: diagnostic evidence manifest rendered ${result.summary.records} records (${result.summary.prompt_pngs} prompt PNGs, ${result.summary.correction_pngs} correction PNGs)`
  );
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
