#!/usr/bin/env node
/**
 * Build REF-CT2 precision and dual-coding audit artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only with respect to reference and lesson sources.
 * - For a later sprint, change SPRINT_ID, output paths, and the source baseline.
 * - Do not turn metadata booleans or asset counts into quality passes. The
 *   sprint rule is semantic evidence: a visible learning object must be
 *   inspectable in the reviewed surface.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'REF-CT2';
const GENERATED_ON = '2026-05-19';

const SOURCES = {
  refCt1Coverage: 'references/data/sprints/REF-CT1-year1-coverage.json',
  targetExercises: 'references/authored/course-target-exercises.json',
  roadmap: 'references/reference-team-roadmap.md',
  l16rIncident: '../4veco-lessen/archive/sprints/L1.6R/L1.6R-dual-coding-incident-record.md',
  l16rSemanticQa: '../4veco-lessen/archive/sprints/L1.6R/L1.6R-semantic-visual-qa-report.md',
  lessonRoot: '../4veco-lessen',
};

const OUTPUTS = {
  auditJson: 'references/data/sprints/REF-CT2-precision-dual-coding-audit.json',
  auditReport: 'reports/reference-planning/REF-CT2-precision-dual-coding-audit.md',
  evidenceReport: 'reports/reference-planning/REF-CT2-graph-visual-surface-evidence.md',
  cp6StatusReport: 'reports/reference-planning/REF-CT2-cp6-status-update.md',
};

const VISUAL_PATTERNS = {
  table: /\b(tabel|table|tabellarisch|kolom|rij|waarden)\b/i,
  graph: /\b(grafiek|graph|diagram|curve|lijn|vraaglijn|aanbodlijn|lijndiagram)\b/i,
  axis: /\b(as|assen|x-as|y-as|verticale as|horizontale as|prijsas|q-as|p-as|prijs|hoeveelheid)\b/i,
  point_or_guideline: /\b(punt|snijpunt|break-even|hulplijn|interpol|aflezen|read from|guide line)\b/i,
  scale_or_comparison: /\b(schaal|schaalverdeling|index|procent|percentage|prijsontwikkeling|vergelijk)\b/i,
  curve_shift: /\b(verschuiving|verschuift|pijl|naar links|naar rechts|movement|shift)\b/i,
  surplus_area: /\b(surplus|overschot|consumentensurplus|aanbodoverschot|vraagoverschot|vlak|area)\b/i,
  formula_link: /\b(formule|functie|lineair|algebra|bereken|vergelijking)\b/i,
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function readTextIfExists(absPath) {
  return fs.existsSync(absPath) ? fs.readFileSync(absPath, 'utf8') : '';
}

function writeFile(relPath, content) {
  const file = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/§/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function lessonComparableTitle(value) {
  const normalized = normalizeText(value)
    .replace(/^\d+\s+\d+\s+\d+\s+/, '')
    .replace(/^gemengde opgaven\s+.*/, 'gemengde opgaven')
    .trim();
  return normalized;
}

function md(value) {
  if (value === undefined || value === null || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.map(md).join('<br>') : '-';
  return String(value).replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

function findChildStartingWith(base, prefix) {
  if (!fs.existsSync(base)) return null;
  const match = fs.readdirSync(base).find((name) => name.startsWith(prefix));
  return match ? path.join(base, match) : null;
}

function findLessonParagraphDir(lessonRoot, paragraphId) {
  const bookDir = findChildStartingWith(lessonRoot, 'Boek 1 - ');
  if (!bookDir) return null;
  const chapterPrefix = paragraphId.split('.').slice(0, 2).join('.') + ' ';
  const chapterDir = findChildStartingWith(bookDir, chapterPrefix);
  if (!chapterDir) return null;
  return findChildStartingWith(chapterDir, `${paragraphId} `);
}

function listFilesRecursive(base, predicate) {
  if (!base || !fs.existsSync(base)) return [];
  const out = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const full = path.join(base, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__pycache__') continue;
      out.push(...listFilesRecursive(full, predicate));
    } else if (!predicate || predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function rel(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, '/');
}

function extractScalar(text, pattern) {
  const match = text.match(pattern);
  return match ? String(match[1]).replace(/^"|"$/g, '').trim() : null;
}

function parseQualityRef(yaml) {
  const schemaVersion = extractScalar(yaml, /schema_version:\s*"?([^"\n#]+)"?/);
  const title =
    extractScalar(yaml, /^title:\s*"?([^"\n#]+)"?/m) ||
    extractScalar(yaml, /paragraph:\s*"?([^"\n#]+)"?/m);
  const assetsReferenced = Number(extractScalar(yaml, /total_referenced:\s*([0-9]+)/)) || 0;
  const assetsPresent = Number(extractScalar(yaml, /total_present:\s*([0-9]+)/)) || 0;
  const partAVerdict =
    extractScalar(yaml, /^partA:[\s\S]*?^\s{4}verdict:\s*"?([^"\n#]+)"?/m) ||
    extractScalar(yaml, /^\s{2}verdict:\s*"?([^"\n#]+)"?/m);
  const reviewStatus = extractScalar(yaml, /review_status:\s*"?([^"\n#]+)"?/);
  const companionVerdict = extractScalar(yaml, /^\s{2}review_verdict:\s*"?([^"\n#]+)"?/m);
  const companionHumanStatus = extractScalar(yaml, /^\s{2}human_review_status:\s*"?([^"\n#]+)"?/m);
  const l16rStatus = extractScalar(yaml, /^\s{4}status:\s*"?([^"\n#]+)"?/m);
  const companionMaterialsPresent = /companion_materialen:[\s\S]*?\n\s+aanwezig:\s*true\b/.test(yaml);
  const companionMaterialsFalse = /companion_materialen:[\s\S]*?\n\s+aanwezig:\s*false\b/.test(yaml);
  const dualCodingNote = extractScalar(yaml, /dual_coding:\s*"?([^"\n]+)"?/);

  return {
    schema_version: schemaVersion || (/^quality_ref:/m.test(yaml) ? 'legacy_quality_ref' : 'legacy_flat'),
    lesson_title_raw: title,
    lesson_title: title ? title.replace(/^\d+\.\d+\.\d+\s+/, '') : null,
    assets_referenced: assetsReferenced,
    assets_present: assetsPresent,
    assets_missing: /\n\s+missing:\s*\[\]/.test(yaml) ? 0 : null,
    partA_verdict: partAVerdict,
    review_status: reviewStatus,
    companion_verdict: companionVerdict,
    companion_human_review_status: companionHumanStatus,
    l16r_dual_coding_status: l16rStatus,
    companion_materials_present: companionMaterialsPresent,
    companion_materials_absent: companionMaterialsFalse,
    dual_coding_note: dualCodingNote,
    has_blocker_language: /\b(blocker|must-fix|must fix|inconsistenties|FLAG)\b/i.test(yaml),
  };
}

function collectSurfaceEvidence(paragraphDir, paragraphId, targetText) {
  const markdownFiles = listFilesRecursive(
    paragraphDir,
    (file) => /\.md$/i.test(file) && !/review|quality-ref|plan/i.test(path.basename(file))
  );
  const htmlFiles = listFilesRecursive(
    paragraphDir,
    (file) => /\.html$/i.test(file) && !/review/i.test(path.basename(file))
  );
  const svgFiles = listFilesRecursive(paragraphDir, (file) => /\.svg$/i.test(file));
  const pngFiles = listFilesRecursive(paragraphDir, (file) => /\.png$/i.test(file));
  const chapterAssetsDir = paragraphDir ? path.join(path.dirname(paragraphDir), '_assets') : null;
  const chapterAssetFiles = listFilesRecursive(
    chapterAssetsDir,
    (file) => path.basename(file).startsWith(`${paragraphId}_`) && /\.(svg|png)$/i.test(file)
  );
  const assetFiles = [...new Set([...svgFiles, ...pngFiles, ...chapterAssetFiles])];
  const svgText = svgFiles.concat(chapterAssetFiles.filter((file) => /\.svg$/i.test(file)))
    .slice(0, 30)
    .map(readTextIfExists)
    .join('\n');
  const markdownText = markdownFiles.map(readTextIfExists).join('\n');
  const htmlText = htmlFiles.slice(0, 10).map(readTextIfExists).join('\n');
  const combined = [targetText, markdownText, htmlText, svgText, assetFiles.map((file) => path.basename(file)).join(' ')].join('\n');

  const categories = [];
  for (const [category, pattern] of Object.entries(VISUAL_PATTERNS)) {
    if (pattern.test(combined)) categories.push(category);
  }
  if (categories.includes('table') && categories.includes('graph')) categories.push('table_graph_link');

  const imageRefs = (markdownText.match(/!\[[^\]]*]\([^)]+\)/g) || []).length;
  const markdownTables = (markdownText.match(/^\s*\|.+\|\s*$/gm) || []).length;
  const evidenceFiles = [...new Set([...markdownFiles, ...assetFiles])]
    .slice(0, 24)
    .map(rel);

  const sampleSnippets = [];
  for (const pattern of Object.values(VISUAL_PATTERNS)) {
    const match = combined.match(new RegExp(`.{0,45}${pattern.source}.{0,45}`, 'i'));
    if (match) sampleSnippets.push(match[0].replace(/\s+/g, ' ').trim());
    if (sampleSnippets.length >= 5) break;
  }

  return {
    markdown_file_count: markdownFiles.length,
    html_file_count: htmlFiles.length,
    asset_file_count: assetFiles.length,
    svg_file_count: assetFiles.filter((file) => /\.svg$/i.test(file)).length,
    png_file_count: assetFiles.filter((file) => /\.png$/i.test(file)).length,
    markdown_image_refs: imageRefs,
    markdown_table_lines: markdownTables,
    semantic_categories: [...new Set(categories)].sort(),
    evidence_files: evidenceFiles,
    sample_evidence: [...new Set(sampleSnippets)].slice(0, 5),
    semantic_evidence_present: categories.length > 0 && (assetFiles.length > 0 || imageRefs > 0 || markdownTables > 0),
  };
}

function sourceLessonAlignment(targetTitle, lessonTitle, isPlaceholder) {
  if (!lessonTitle) return 'lesson_quality_ref_missing';
  const target = lessonComparableTitle(targetTitle);
  const lesson = lessonComparableTitle(lessonTitle);
  if (target === lesson || target.includes(lesson) || lesson.includes(target)) {
    return isPlaceholder ? 'placeholder_title_aligned' : 'aligned';
  }
  if (target.startsWith('gemengde opgaven') && lesson.startsWith('gemengde opgaven')) {
    return 'consolidation_title_partial';
  }
  return 'topic_mismatch';
}

function qualityBlocker(quality) {
  return (
    quality?.partA_verdict === 'FLAG' ||
    /\b(blocker|must-fix|must fix|inconsistenties)\b/i.test(quality?.review_status || '') ||
    quality?.has_blocker_language === true
  );
}

function classify(record, quality, evidence, targetText, alignment) {
  const placeholder = record.target_exercise_placeholder || record.record_status === 'placeholder_needs_review';
  const categories = evidence.semantic_categories || [];
  const visualByText = Object.values(VISUAL_PATTERNS).some((pattern) => pattern.test(targetText));
  const visualApplies = !placeholder && (visualByText || categories.length > 0 || (quality?.assets_referenced || 0) > 0);
  const graphHeavy =
    visualApplies &&
    categories.some((category) =>
      ['graph', 'axis', 'point_or_guideline', 'curve_shift', 'surplus_area', 'table_graph_link'].includes(category)
    );
  const l16rPending = /pending_human_review/.test(quality?.l16r_dual_coding_status || quality?.companion_human_review_status || '');
  const mismatch = alignment === 'topic_mismatch';
  const hasQualityBlocker = qualityBlocker(quality);
  const missingFlagCount = (record.missing_flags || []).length;
  const hasCompanionReview = Boolean(quality?.companion_verdict);

  let precision = 'not_applicable';
  if (placeholder) precision = 'not_auditable_placeholder';
  else if (mismatch) precision = 'blocked_source_lesson_mismatch';
  else if (hasQualityBlocker) precision = 'blocked_existing_quality_flag';
  else if (missingFlagCount > 0) precision = 'needs_review_missing_unit_flags';
  else if (graphHeavy && !hasCompanionReview && quality?.schema_version !== '2') precision = 'evidence_present_legacy_review_needed';
  else if (visualApplies) precision = 'evidence_present_not_final';

  let dualCoding = 'not_applicable';
  if (placeholder) dualCoding = 'not_auditable_placeholder';
  else if (mismatch) dualCoding = 'blocked_source_lesson_mismatch';
  else if (l16rPending) dualCoding = 'remediated_pending_human_review';
  else if (visualApplies && !evidence.semantic_evidence_present) dualCoding = 'fail_missing_learning_object';
  else if (hasQualityBlocker) dualCoding = 'blocked_existing_quality_flag';
  else if (graphHeavy && !hasCompanionReview && quality?.schema_version !== '2') dualCoding = 'legacy_evidence_needs_companion_review';
  else if (visualApplies) dualCoding = 'semantic_evidence_present_not_final';

  const blockers = [];
  if (placeholder) blockers.push('Placeholder target-exercise record: no reviewed integration target exercise.');
  if (mismatch) blockers.push('Active-v5 target title and built lesson-side title do not describe the same topic.');
  if (l16rPending) blockers.push('L1.6R visual remediation is still pending human review.');
  if (hasQualityBlocker) blockers.push('Existing quality reference contains FLAG/blocker language.');
  if (missingFlagCount > 0) blockers.push(`${missingFlagCount} REF-CT1 missing-flag/backfill candidate(s) still need review.`);
  if (graphHeavy && !hasCompanionReview && quality?.schema_version !== '2') {
    blockers.push('Graph/visual evidence is from legacy quality-ref shape without companion visual-review closure.');
  }
  if (visualApplies && !evidence.semantic_evidence_present) {
    blockers.push('No inspectable semantic learning-object evidence found in readable surfaces/assets.');
  }
  if (record.record_status !== 'reviewed_final') {
    blockers.push(`Target-exercise record status is ${record.record_status}, not reviewed_final.`);
  }

  const cp6Ready = blockers.length === 0 && record.record_status === 'reviewed_final';

  return {
    visual_reasoning_applies: visualApplies,
    graph_heavy: graphHeavy,
    precision_lint_status: precision,
    dual_coding_status: dualCoding,
    cp6_quality_ready: cp6Ready,
    cp6_readiness_status: cp6Ready ? 'ready_for_cp6_review' : 'blocked_or_not_final',
    blockers,
  };
}

function main() {
  const coverage = readJson(SOURCES.refCt1Coverage);
  const targetSource = readJson(SOURCES.targetExercises);
  const targetById = new Map((targetSource.exercises || []).map((record) => [record.id, record]));
  const lessonRoot = path.resolve(ROOT, SOURCES.lessonRoot);

  const records = coverage.paragraphs.map((coverageRecord) => {
    const target = targetById.get(coverageRecord.paragraph_id) || {};
    const targetText = [
      coverageRecord.title,
      coverageRecord.lesson_goals?.join(' '),
      coverageRecord.missing_flags?.map((flag) => flag.flag).join(' '),
      target.target_exercise?.context,
      (target.target_exercise?.subquestions || []).map((question) => question.prompt).join(' '),
      target.difficulty_notes,
    ].join('\n');
    const paragraphDir = findLessonParagraphDir(lessonRoot, coverageRecord.paragraph_id);
    const qualityRef = paragraphDir ? path.join(paragraphDir, `${coverageRecord.paragraph_id}-quality-ref.yaml`) : null;
    const qualityYaml = qualityRef ? readTextIfExists(qualityRef) : '';
    const quality = qualityYaml ? parseQualityRef(qualityYaml) : null;
    const evidence = collectSurfaceEvidence(paragraphDir, coverageRecord.paragraph_id, targetText);
    const alignment = sourceLessonAlignment(
      coverageRecord.title,
      quality?.lesson_title,
      coverageRecord.target_exercise_placeholder
    );
    const classification = classify(coverageRecord, quality, evidence, targetText, alignment);

    return {
      paragraph_id: coverageRecord.paragraph_id,
      target_title: coverageRecord.title,
      target_record_status: coverageRecord.record_status,
      target_exercise_placeholder: coverageRecord.target_exercise_placeholder,
      lesson_quality_ref_path: qualityRef ? rel(qualityRef) : null,
      lesson_title: quality?.lesson_title || null,
      lesson_quality_ref_shape: quality?.schema_version || null,
      source_lesson_alignment: alignment,
      lesson_review_status: quality?.review_status || quality?.partA_verdict || null,
      companion_review_status: quality?.companion_verdict || null,
      l16r_status: quality?.l16r_dual_coding_status || quality?.companion_human_review_status || null,
      assets_referenced: quality?.assets_referenced || 0,
      assets_present: quality?.assets_present || 0,
      companion_materials_absent: quality?.companion_materials_absent || false,
      missing_flag_count: (coverageRecord.missing_flags || []).length,
      missing_flags: (coverageRecord.missing_flags || []).map((flag) => flag.flag),
      visual_reasoning_applies: classification.visual_reasoning_applies,
      graph_heavy: classification.graph_heavy,
      precision_lint_status: classification.precision_lint_status,
      dual_coding_status: classification.dual_coding_status,
      cp6_quality_ready: classification.cp6_quality_ready,
      cp6_readiness_status: classification.cp6_readiness_status,
      blockers: classification.blockers,
      semantic_evidence: evidence,
    };
  });

  const summary = {
    active_v5_paragraph_count: records.length,
    placeholder_count: records.filter((record) => record.target_exercise_placeholder).length,
    visual_reasoning_applicable_count: records.filter((record) => record.visual_reasoning_applies).length,
    graph_heavy_count: records.filter((record) => record.graph_heavy).length,
    semantic_evidence_present_count: records.filter((record) => record.semantic_evidence.semantic_evidence_present).length,
    source_lesson_mismatch_count: records.filter((record) => record.source_lesson_alignment === 'topic_mismatch').length,
    l16r_pending_count: records.filter((record) => /pending_human_review/.test(record.l16r_status || '')).length,
    l16r_pass_with_flags_count: records.filter((record) => record.l16r_status === 'pass_with_flags').length,
    companion_review_present_count: records.filter((record) => Boolean(record.companion_review_status)).length,
    legacy_quality_ref_count: records.filter((record) => record.lesson_quality_ref_shape !== '2').length,
    cp6_quality_ready_count: records.filter((record) => record.cp6_quality_ready).length,
    records_with_blockers_count: records.filter((record) => record.blockers.length > 0).length,
  };

  const audit = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_on: GENERATED_ON,
    generated_by: 'build-scripts/references/build-ref-ct2-precision-dual-coding-audit.js',
    authority_level: 'non_mutating_precision_dual_coding_audit',
    protected_reference_data_changed: false,
    lesson_output_changed: false,
    no_cli_mutation_authorized: true,
    no_cp6_closure_authorized: true,
    source_paths: SOURCES,
    repository_state: {
      platform_commit: runGit(ROOT, ['rev-parse', 'HEAD']),
      lesson_commit: runGit(lessonRoot, ['rev-parse', 'HEAD']),
      lesson_status: runGit(lessonRoot, ['status', '--short', '--branch']),
      active_roadmap_version_at_plan: 'v2.49-ref-ct1-year1-coverage-baseline',
    },
    allowed_use: [
      'CP-6 precision and dual-coding review preparation',
      'Year-1 audit reporting',
      'identifying source/lesson mismatch and semantic evidence gaps before closure',
    ],
    not_allowed_use: [
      'CP-6 closure',
      'Year-1 closure',
      'target-exercise promotion',
      'placeholder finalization',
      'unit minting',
      'lesson output mutation',
      'student diagnostics',
      'adaptive routing',
      'mastery decisions',
      'student-facing AI',
      'summative use',
      'PV projection',
    ],
    summary,
    cp6_decision: {
      status: 'blocked_not_ready_for_closure',
      reason:
        'REF-CT2 found unresolved placeholders, migrated target-exercise statuses, remaining 1.1.3 Part A FLAG status, legacy review evidence, missing flags, and source/lesson mismatches.',
      required_before_cp6_closure: [
        'Resolve or formally accept the 1.3.2 and 1.3.3 source/lesson topic mismatch through an authorized roadmap path.',
        'Keep the L1.6R pass-with-flags evidence visible and resolve the remaining 1.1.3 Part A FLAG status before final closure.',
        'Replace or review the three placeholder target-exercise records.',
        'Review the nine Year-1 backfill candidates before CLI mutation.',
        'Upgrade graph-heavy legacy quality refs to current Part A/Part B review evidence where needed.',
        'Run a formal CP-6 human-review gate before any Year-1 closure claim.',
      ],
    },
    calibration_rule:
      'Procedure parity and asset counts are insufficient. Graph/table-heavy guided practice needs inspectable learning-object evidence in the generated surface.',
    records,
  };

  writeFile(OUTPUTS.auditJson, `${JSON.stringify(audit, null, 2)}\n`);
  writeFile(OUTPUTS.auditReport, renderAuditReport(audit));
  writeFile(OUTPUTS.evidenceReport, renderEvidenceReport(audit));
  writeFile(OUTPUTS.cp6StatusReport, renderCp6StatusReport(audit));

  console.log(`Wrote ${OUTPUTS.auditJson}`);
  console.log(`Wrote ${OUTPUTS.auditReport}`);
  console.log(`Wrote ${OUTPUTS.evidenceReport}`);
  console.log(`Wrote ${OUTPUTS.cp6StatusReport}`);
}

function renderAuditReport(audit) {
  const rows = audit.records.map((record) => {
    return `| ${record.paragraph_id} | ${md(record.target_title)} | ${md(record.lesson_title)} | ${record.source_lesson_alignment} | ${record.visual_reasoning_applies ? 'yes' : 'no'} | ${record.graph_heavy ? 'yes' : 'no'} | ${record.precision_lint_status} | ${record.dual_coding_status} | ${record.cp6_quality_ready ? 'yes' : 'no'} | ${md(record.blockers.slice(0, 3))} |`;
  });

  return `# REF-CT2 Precision And Dual-Coding Audit

Generated: ${audit.generated_on}

Authority: ${audit.authority_level}. No CLI mutation authorized. No lesson output mutation authorized.

## Summary

- Active-v5 Book 1 records audited: ${audit.summary.active_v5_paragraph_count}
- Visual reasoning applicable: ${audit.summary.visual_reasoning_applicable_count}
- Graph-heavy records: ${audit.summary.graph_heavy_count}
- Semantic evidence present: ${audit.summary.semantic_evidence_present_count}
- Source/lesson topic mismatches: ${audit.summary.source_lesson_mismatch_count}
- L1.6R pending records: ${audit.summary.l16r_pending_count}
- L1.6R pass-with-flags records: ${audit.summary.l16r_pass_with_flags_count}
- Companion visual-review records present: ${audit.summary.companion_review_present_count}
- Legacy quality-ref records: ${audit.summary.legacy_quality_ref_count}
- CP-6 quality-ready records: ${audit.summary.cp6_quality_ready_count}

## CP-6 Decision

Status: \`${audit.cp6_decision.status}\`

Reason: ${audit.cp6_decision.reason}

## Calibration Rule

${audit.calibration_rule}

## Audit Table

| Paragraph | Target title | Lesson title | Alignment | Visual applies | Graph-heavy | Precision lint | Dual coding | CP-6 ready | Blockers |
|---|---|---|---|---:|---:|---|---|---:|---|
${rows.join('\n')}

## Boundary

This audit reads active v5, REF-CT1, and lesson-side generated evidence. It does not edit \`references/machine/\`, \`references/external/\`, \`references/authored/course-target-exercises.json\`, \`references/owned/course-blueprint-v5.md\`, or \`../4veco-lessen\`.
`;
}

function renderEvidenceReport(audit) {
  const rows = audit.records.map((record) => {
    return `| ${record.paragraph_id} | ${record.semantic_evidence.semantic_evidence_present ? 'yes' : 'no'} | ${md(record.semantic_evidence.semantic_categories)} | ${record.semantic_evidence.asset_file_count} | ${record.semantic_evidence.markdown_image_refs} | ${md(record.semantic_evidence.sample_evidence)} | ${md(record.semantic_evidence.evidence_files.slice(0, 8))} |`;
  });

  return `# REF-CT2 Graph/Visual Surface Evidence

Generated: ${audit.generated_on}

Authority: ${audit.authority_level}. No CLI mutation authorized. No lesson output mutation authorized.

## Evidence Rule

A paragraph is not considered semantically dual-coded because a quality ref says "dual coding" or because assets exist. This report lists inspectable evidence categories found in target prompts, readable lesson surfaces, SVG text, Markdown image references, Markdown table lines, and paragraph assets.

## Evidence Table

| Paragraph | Semantic evidence | Categories | Asset files | Markdown image refs | Sample evidence | Evidence files |
|---|---:|---|---:|---:|---|---|
${rows.join('\n')}

## L1.6R Calibration

\`1.1.3\` is deliberately not marked quality-ready. The audit preserves its current L1.6R status and the remaining Part A \`FLAG\`.
`;
}

function renderCp6StatusReport(audit) {
  const blockerRows = audit.records
    .filter((record) => record.blockers.length > 0)
    .map((record) => `| ${record.paragraph_id} | ${md(record.target_title)} | ${md(record.blockers)} |`);

  return `# REF-CT2 CP-6 Status Update

Generated: ${audit.generated_on}

Status: \`${audit.cp6_decision.status}\`

No CLI mutation authorized. CP-6 not closed. Year 1 not closed.

## Required Before CP-6 Closure

${audit.cp6_decision.required_before_cp6_closure.map((item) => `- ${item}`).join('\n')}

## Blocking Evidence

| Paragraph | Target title | Blockers |
|---|---|---|
${blockerRows.join('\n')}

## Operational Recommendation

Do not send Year 1 to closure as quality-ready from REF-CT2 alone. Use this audit to drive the next formal CP-6 review path, target-exercise/placeholder review, source/lesson alignment decision, and remaining L1.6R/Part A closure evidence.
`;
}

main();
