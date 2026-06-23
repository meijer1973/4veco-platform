#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { resolveEvidenceRef } = require('./lib/evidence-reference-resolver');

const ROOT = process.cwd();
const REPORT_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-anchor-integrity-audit.json');
const REPORT_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-anchor-integrity-audit.md');
const WRITE = process.argv.includes('--write');

const INPUTS = [
  'reports/mtu-hardening/mtu-h5-regression-fixture.json',
  'reports/mtu-hardening/mtu-h5-regression-report.json',
  'reports/mtu-hardening/mtu-h5-fu001-q3-execution-readiness-packet.json',
  'reports/mtu-hardening/mtu-h5-rp001-rp002-q3-repair-packet.json',
  'reports/mtu-hardening/mtu-h5-q27-step2-q15-closure-readiness-bundle-1.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-scaling-levy-capacity-package-1.json',
  'reports/mtu-hardening/mtu-h5-q27-incidence-levy-capacity-package-2.json',
  'reports/mtu-hardening/mtu-h5-q19-answer-form-equivalent-execution-gate-1.json',
  'reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json',
];

const TRACKED_RECORDS = [
  'vw-1022-a-25-1-o:opgave-1:question-3',
  'vw-1022-a-25-1-o:opgave-3:question-15',
  'vw-1022-a-25-1-o:opgave-4:question-19',
  'vw-1022-a-25-2-o:opgave-6:question-27',
];

function fail(message) {
  console.error(`MTU-H5 anchor-integrity check failed: ${message}`);
  process.exit(1);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function formatMarkdown(report) {
  return `# MTU-H5 Anchor Integrity Audit

Status: \`${report.status}\`

This audit applies the MTU-H6 evidence-reference integrity resolver to the accepted H5 q3/q15/q19/q27 evidence surfaces without mutating protected references or reopening H5 semantics.

## Summary

- References checked: ${report.summary_counts.references_checked}
- Unresolved references: ${report.summary_counts.unresolved_references}
- Ambiguous references: ${report.summary_counts.ambiguous_references}
- Q19 rendered manifest records: ${report.summary_counts.q19_rendered_manifest_records}
- H5 semantic mappings unchanged: \`${report.h5_semantic_mappings_unchanged}\`

## Rendered Manifest

Q19 rendered evidence manifest verification: \`${report.rendered_manifest_verification.ok ? 'passed' : 'failed'}\`

## Authority Boundary

No protected-reference mutation, machine-reference mutation, external-source mutation, candidate write, lesson output, product-route readiness, or student/product use is authorized by this audit.
`;
}

function assertCurrent(file, expected) {
  if (!fs.existsSync(file)) {
    fail(`${path.relative(ROOT, file)} is missing; run node build-scripts/references/check-mtu-h5-anchor-integrity.js --write`);
  }
  const actual = fs.readFileSync(file, 'utf8');
  if (actual !== expected) {
    fail(`${path.relative(ROOT, file)} is stale; run node build-scripts/references/check-mtu-h5-anchor-integrity.js --write`);
  }
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, relativePath))).digest('hex');
}

function pngDimensions(relativePath) {
  const buffer = fs.readFileSync(path.join(ROOT, relativePath));
  if (buffer.slice(1, 4).toString('ascii') !== 'PNG') throw new Error(`${relativePath} is not a PNG`);
  return { width_px: buffer.readUInt32BE(16), height_px: buffer.readUInt32BE(20) };
}

function isUrl(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

function isLocalReference(value) {
  const text = String(value || '');
  if (!text || isUrl(text)) return false;
  if (text.includes('*')) return false;
  return /^(reports|references|build-scripts|engines|docs|\.github)\//.test(text);
}

function collectReferences(value, refs = [], pointer = '$') {
  if (typeof value === 'string') {
    if (isLocalReference(value)) refs.push({ reference: value, pointer });
    return refs;
  }
  if (!value || typeof value !== 'object') return refs;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectReferences(item, refs, `${pointer}[${index}]`));
    return refs;
  }
  for (const [key, item] of Object.entries(value)) {
    collectReferences(item, refs, `${pointer}.${key}`);
  }
  return refs;
}

function uniqueRefs(refs) {
  const seen = new Set();
  const output = [];
  for (const ref of refs) {
    const key = `${ref.reference}\u0000${ref.pointer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(ref);
  }
  return output;
}

function verifyRenderedManifest(bundle) {
  const manifest = bundle.Q19_DIRECT_RENDERED_OFFICIAL_EVIDENCE_REVIEWED_EQUIVALENT;
  const errors = [];
  if (!manifest || manifest.anchor_id !== 'Q19_DIRECT_RENDERED_OFFICIAL_EVIDENCE_REVIEWED_EQUIVALENT') {
    return { ok: false, errors: [{ reason: 'missing q19 rendered manifest' }], records_checked: 0 };
  }
  const renderIds = new Set();
  const renderedPaths = new Set();
  for (const record of manifest.records || []) {
    if (renderIds.has(record.render_id)) errors.push({ render_id: record.render_id, reason: 'duplicate render_id' });
    renderIds.add(record.render_id);
    if (renderedPaths.has(record.rendered_png_path)) errors.push({ render_id: record.render_id, reason: 'duplicate rendered_png_path' });
    renderedPaths.add(record.rendered_png_path);
    try {
      if (sha256File(record.source_pdf_path) !== record.source_pdf_sha256) {
        errors.push({ render_id: record.render_id, reason: 'source PDF hash mismatch' });
      }
      if (sha256File(record.rendered_png_path) !== record.rendered_png_sha256) {
        errors.push({ render_id: record.render_id, reason: 'rendered PNG hash mismatch' });
      }
      const dimensions = pngDimensions(record.rendered_png_path);
      if (dimensions.width_px !== record.width_px || dimensions.height_px !== record.height_px) {
        errors.push({ render_id: record.render_id, reason: 'PNG dimensions mismatch' });
      }
    } catch (error) {
      errors.push({ render_id: record.render_id, reason: error.message });
    }
  }
  const covered = new Set(renderIds);
  for (const operation of bundle.operation_evidence_surface || []) {
    for (const evidence of operation.rendered_evidence || []) {
      const renderId = path.basename(String(evidence), '.png');
      if (!covered.has(renderId)) {
        errors.push({ operation_id: operation.operation_id, render_id: renderId, reason: 'operation rendered evidence absent from manifest' });
      }
    }
  }
  return { ok: errors.length === 0, errors, records_checked: renderIds.size };
}

function main() {
  const refs = [];
  const inputStatuses = [];
  for (const relativePath of INPUTS) {
    const value = readJson(relativePath);
    inputStatuses.push({ path: relativePath, status: 'read' });
    refs.push(...collectReferences(value).map((ref) => ({ ...ref, source_file: relativePath })));
  }

  const resolved = [];
  const unresolved = [];
  const ambiguous = [];
  for (const ref of uniqueRefs(refs)) {
    const result = resolveEvidenceRef(ROOT, ref.reference, { rejectDuplicateAnchorIds: true });
    const row = { ...ref, ok: result.ok, reason: result.reason || null, type: result.type || null, locations: result.locations || [] };
    resolved.push(row);
    if (!result.ok) {
      if (/ambiguous/i.test(result.reason || '')) ambiguous.push(row);
      else unresolved.push(row);
    }
  }

  const regressionReport = readJson('reports/mtu-hardening/mtu-h5-regression-report.json');
  const semanticsUnchanged = regressionReport.status === 'passed' &&
    TRACKED_RECORDS.every((recordId) => {
      const bucket = regressionReport.question_bucket_counts && Object.values(regressionReport.question_bucket_counts)
        .find((item) => item && item.record_id === recordId);
      return bucket ? bucket.failed === 0 && bucket.review_required === 0 : true;
    });
  const q19Manifest = verifyRenderedManifest(readJson('reports/mtu-hardening/mtu-h5-q19-final-resolution-and-closure-bundle-1.json'));
  const report = {
    schema_version: 1,
    sprint_id: 'MTU-H6',
    audit_id: 'mtu-h5-anchor-integrity-audit',
    status: unresolved.length === 0 && ambiguous.length === 0 && q19Manifest.ok && semanticsUnchanged ? 'passed' : 'failed',
    generated_by: 'build-scripts/references/check-mtu-h5-anchor-integrity.js',
    tracked_h5_records: TRACKED_RECORDS,
    inputs: inputStatuses,
    summary_counts: {
      references_checked: resolved.length,
      unresolved_references: unresolved.length,
      ambiguous_references: ambiguous.length,
      q19_rendered_manifest_records: q19Manifest.records_checked,
    },
    unresolved_references: unresolved,
    ambiguous_references: ambiguous,
    rendered_manifest_verification: q19Manifest,
    h5_semantic_mappings_unchanged: semanticsUnchanged,
    authority_boundary: {
      protected_reference_mutation_authorized: false,
      external_source_mutation_authorized: false,
      machine_reference_mutation_authorized: false,
      authored_target_exercise_mutation_authorized: false,
      candidate_writes_authorized: false,
      lesson_output_mutation_authorized: false,
      product_route_readiness_claimed: false,
      student_product_use_authorized: false,
    },
  };

  const expectedJson = formatJson(report);
  const expectedMarkdown = formatMarkdown(report);
  if (WRITE) {
    writeJson(REPORT_JSON, report);
    fs.writeFileSync(REPORT_MD, expectedMarkdown);
  } else {
    assertCurrent(REPORT_JSON, expectedJson);
    assertCurrent(REPORT_MD, expectedMarkdown);
  }

  if (report.status !== 'passed') {
    fail(`${unresolved.length} unresolved, ${ambiguous.length} ambiguous, q19 manifest ok=${q19Manifest.ok}, semantics unchanged=${semanticsUnchanged}`);
  }
  console.log(`OK MTU-H5 anchor integrity audit: ${resolved.length} refs, q19 renders=${q19Manifest.records_checked}`);
}

if (require.main === module) main();
