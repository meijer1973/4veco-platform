#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add new owned lesson/book roots to LESSON_ROOTS.
 * - Add new source-surface classifiers in classifyOwnedLessonFile.
 * - Keep this registry descriptive. Projection edges belong in R9.2.
 * - Do not use this script to mutate references/machine/ or references/external/.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/owned-source-registry.json';
const REPORT_JSON_PATH = 'reports/json/owned-source-registry.json';
const REPORT_MD_PATH = 'reports/owned-source-registry.md';
const CP2_DIR = 'reports/review-gates/GATE-CP2-owned-source-scope';
const CP2_PACKET_MD = `${CP2_DIR}/review-packet.md`;
const CP2_PACKET_JSON = `${CP2_DIR}/review-packet.json`;

const LESSON_ROOTS = [
  {
    root_id: 'lesson-root:book-1',
    path: '../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod',
    title: 'Boek 1 - Grondslagen, vraag en aanbod',
    curriculum_version: 'owned-book-1-current',
  },
];

const OWNED_BLUEPRINT_PATH = 'references/owned/course-blueprint-v4.md';
const OWNED_BLUEPRINT_META_PATH = 'references/owned/course-blueprint-v4.meta.json';
const TARGET_EXERCISES_PATH = 'references/authored/course-target-exercises.json';

function slashPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function sha256(fullPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
}

function existsRel(relPath) {
  return fs.existsSync(repoPath(relPath));
}

function resolveMaybeOutside(relPath) {
  return path.resolve(REPO_ROOT, relPath);
}

function relFromLessonRoot(rootFull, fileFull) {
  return slashPath(path.relative(rootFull, fileFull));
}

function walkFiles(rootFull) {
  if (!fs.existsSync(rootFull)) return [];
  const out = [];
  const stack = [rootFull];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile()) out.push(full);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function extension(fileName) {
  return path.extname(fileName).toLowerCase();
}

function classifyOwnedLessonFile(relPath) {
  const name = path.basename(relPath);
  const lower = name.toLowerCase();
  const ext = extension(name);

  if (name === 'deploy-config.json') return 'deployment_config';
  if (name === 'index.html') return 'generated_navigation_html';
  if (/boek\.md$/i.test(name)) return 'book_markdown';
  if (/boek\.html$/i.test(name)) return 'book_html';
  if (/boek\.pdf$/i.test(name)) return 'book_pdf';
  if (/chapter-plan/i.test(name)) return 'chapter_plan';
  if (/quality-ref\.ya?ml$/i.test(name)) return 'quality_reference_yaml';
  if (/review\.md$/i.test(name)) return 'review_note';
  if (/paragraaf\.md$/i.test(name)) return 'paragraph_markdown';
  if (/paragraaf\.html$/i.test(name)) return 'paragraph_html';
  if (/paragraaf\.pdf$/i.test(name)) return 'paragraph_pdf';
  if (/opgaven\.md$/i.test(name)) return 'opgaven_markdown';
  if (/opgaven\.html$/i.test(name)) return 'opgaven_html';
  if (/opgaven\.pdf$/i.test(name)) return 'opgaven_pdf';
  if (/antwoorden\.md$/i.test(name)) return 'answer_model_markdown';
  if (/antwoorden\.html$/i.test(name)) return 'answer_model_html';
  if (/antwoorden\.pdf$/i.test(name)) return 'answer_model_pdf';
  if (/samenvatting/i.test(name)) return 'summary_surface';
  if (/presentatie|\.pptx$/i.test(name)) return 'presentation_surface';
  if (/voorkennis/i.test(name)) return 'voorkennis_surface';
  if (/vaardigheden/i.test(name)) return 'vaardigheden_surface';
  if (/inoefening/i.test(name)) return 'guided_practice_surface';
  if (relPath.includes('/shared/') && (ext === '.js' || ext === '.css')) return 'shared_engine_output';
  if (ext === '.svg') return 'visual_svg_source';
  if (ext === '.png') return 'visual_png_projection';
  if (ext === '.docx') return 'companion_docx';
  if (ext === '.html') return 'generated_html_surface';
  if (ext === '.pdf') return 'generated_pdf_surface';
  if (ext === '.md') return 'owned_markdown_surface';
  if (ext === '.js') return 'generated_js_surface';
  if (ext === '.yaml' || ext === '.yml') return 'quality_yaml_surface';
  if (ext === '.py') return 'local_build_helper';
  return 'other_owned_lesson_file';
}

const SURFACE_POLICY = {
  course_blueprint: {
    source_status: 'authored_source',
    authority_level: 'owned_curriculum_design',
    authority_weight: 70,
    primary_evidence: false,
    evidence_use: 'course_design_backbone_and_target_exercise_alignment',
    allowed_use: ['course_design', 'rag_retrieval', 'owned_source_projection', 'target_exercise_alignment'],
    not_allowed_use: ['external_authority', 'automatic_unit_minting_from_prose', 'override_machine_registry'],
  },
  course_blueprint_metadata: {
    source_status: 'planning_artifact',
    authority_level: 'owned_curriculum_design',
    authority_weight: 50,
    primary_evidence: false,
    evidence_use: 'completion_and_authority_context',
    allowed_use: ['retrieval_context', 'source_versioning', 'owned_source_projection'],
    not_allowed_use: ['curriculum_claim_proof'],
  },
  target_exercise_index: {
    source_status: 'exercise_evidence',
    authority_level: 'owned_curriculum_design',
    authority_weight: 75,
    primary_evidence: true,
    evidence_use: 'owned_target_exercise_evidence',
    allowed_use: ['unit_gap_discovery', 'target_exercise_alignment', 'rag_retrieval', 'owned_source_projection'],
    not_allowed_use: ['external_authority', 'silent_source_mutation'],
  },
  chapter_plan: {
    source_status: 'planning_artifact',
    authority_level: 'owned_curriculum_design',
    authority_weight: 45,
    primary_evidence: false,
    evidence_use: 'planning_context',
    allowed_use: ['course_planning', 'owned_source_projection', 'rag_retrieval'],
    not_allowed_use: ['external_authority', 'primary_unit_proof'],
  },
  paragraph_markdown: {
    source_status: 'authored_source',
    authority_level: 'owned_lesson_exposition',
    authority_weight: 50,
    primary_evidence: false,
    evidence_use: 'lesson_exposition_context',
    allowed_use: ['rag_retrieval', 'lesson_authoring_support', 'owned_source_projection'],
    not_allowed_use: ['external_authority', 'override_reviewed_references'],
  },
  book_markdown: {
    source_status: 'authored_source',
    authority_level: 'owned_lesson_exposition',
    authority_weight: 48,
    primary_evidence: false,
    evidence_use: 'compiled_exposition_context',
    allowed_use: ['rag_retrieval', 'lesson_authoring_support'],
    not_allowed_use: ['external_authority'],
  },
  opgaven_markdown: {
    source_status: 'exercise_evidence',
    authority_level: 'owned_lesson_exercise',
    authority_weight: 65,
    primary_evidence: true,
    evidence_use: 'owned_built_exercise_evidence',
    allowed_use: ['exercise_lookup', 'rag_retrieval', 'owned_source_projection'],
    not_allowed_use: ['external_authority'],
  },
  answer_model_markdown: {
    source_status: 'answer_model',
    authority_level: 'owned_answer_model',
    authority_weight: 55,
    primary_evidence: false,
    evidence_use: 'solution_and_feedback_context',
    allowed_use: ['answer_model_lookup', 'rag_retrieval', 'lesson_authoring_support'],
    not_allowed_use: ['external_authority', 'unit_creation_without_exercise'],
  },
  visual_svg_source: {
    source_status: 'authored_source',
    authority_level: 'owned_visual_source',
    authority_weight: 40,
    primary_evidence: false,
    evidence_use: 'visual_explanation_context',
    allowed_use: ['visual_lookup', 'dual_coding_review', 'rag_retrieval'],
    not_allowed_use: ['external_authority'],
  },
  default_generated_projection: {
    source_status: 'generated_projection',
    authority_level: 'generated_projection',
    authority_weight: 20,
    primary_evidence: false,
    evidence_use: 'generated_output_trace',
    allowed_use: ['rag_retrieval_with_warning', 'implementation_trace'],
    not_allowed_use: ['primary_evidence', 'external_authority'],
  },
  default_implementation_output: {
    source_status: 'implementation_output',
    authority_level: 'implementation_output',
    authority_weight: 10,
    primary_evidence: false,
    evidence_use: 'implementation_trace_only',
    allowed_use: ['debugging', 'implementation_trace'],
    not_allowed_use: ['curriculum_authority', 'primary_evidence'],
  },
};

function policyForType(type) {
  if (SURFACE_POLICY[type]) return SURFACE_POLICY[type];
  if (type.endsWith('_html') || type.endsWith('_pdf') || type.includes('projection') || type.startsWith('generated_') || type === 'visual_png_projection' || type === 'presentation_surface' || type === 'summary_surface' || type === 'voorkennis_surface' || type === 'vaardigheden_surface' || type === 'guided_practice_surface' || type === 'companion_docx') {
    return SURFACE_POLICY.default_generated_projection;
  }
  if (type.includes('engine') || type.includes('build_helper') || type === 'deployment_config') {
    return SURFACE_POLICY.default_implementation_output;
  }
  return SURFACE_POLICY.default_generated_projection;
}

function compactExamples(files, limit = 5) {
  return files.slice(0, limit).map((file) => file.rel_path);
}

function summarizeLessonRoot(rootConfig) {
  const rootFull = resolveMaybeOutside(rootConfig.path);
  const exists = fs.existsSync(rootFull);
  const files = exists ? walkFiles(rootFull).map((full) => ({
    full_path: full,
    rel_path: relFromLessonRoot(rootFull, full),
    type: classifyOwnedLessonFile(relFromLessonRoot(rootFull, full)),
    extension: extension(full) || '<none>',
  })) : [];

  const byType = {};
  const byExtension = {};
  for (const file of files) {
    if (!byType[file.type]) byType[file.type] = [];
    byType[file.type].push(file);
    byExtension[file.extension] = (byExtension[file.extension] || 0) + 1;
  }

  const paragraphDirs = exists ? walkParagraphDirs(rootFull) : [];
  return {
    ...rootConfig,
    exists,
    full_path: slashPath(rootFull),
    file_count: files.length,
    paragraph_directory_count: paragraphDirs.length,
    by_extension: Object.fromEntries(Object.entries(byExtension).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    by_type: Object.fromEntries(Object.entries(byType).map(([type, values]) => [type, values.length]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
    files_by_type: byType,
  };
}

function walkParagraphDirs(rootFull) {
  const out = [];
  const stack = [rootFull];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (!entry.isDirectory()) continue;
      if (/^\d+\.\d+\.\d+ /.test(entry.name)) out.push(full);
      stack.push(full);
    }
  }
  return out.sort();
}

function sourceHashRel(relPath) {
  const full = repoPath(relPath);
  if (!fs.existsSync(full)) return null;
  return sha256(full);
}

function buildRegistry() {
  const generatedOn = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const blueprintMeta = readJson(OWNED_BLUEPRINT_META_PATH);
  const targetExercises = readJson(TARGET_EXERCISES_PATH);
  const lessonRoots = LESSON_ROOTS.map(summarizeLessonRoot);

  const sourceSurfaces = [
    {
      surface_id: 'owned:course-blueprint-v4',
      title: 'Course Blueprint v4',
      path: OWNED_BLUEPRINT_PATH,
      source_surface_type: 'course_blueprint',
      exists: existsRel(OWNED_BLUEPRINT_PATH),
      source_hash: sourceHashRel(OWNED_BLUEPRINT_PATH),
      completion_status: blueprintMeta.completion_status || 'unknown',
      curriculum_version: blueprintMeta.source_id || 'owned:course-blueprint-v4',
      notes: blueprintMeta.authority_notes || [],
      ...SURFACE_POLICY.course_blueprint,
      projection_policy: 'May create owned-source projection edges in R9.2; blueprint prose is not a direct evidence edge.',
    },
    {
      surface_id: 'owned:course-blueprint-v4-meta',
      title: 'Course Blueprint v4 metadata',
      path: OWNED_BLUEPRINT_META_PATH,
      source_surface_type: 'course_blueprint_metadata',
      exists: existsRel(OWNED_BLUEPRINT_META_PATH),
      source_hash: sourceHashRel(OWNED_BLUEPRINT_META_PATH),
      completion_status: blueprintMeta.completion_status || 'unknown',
      curriculum_version: blueprintMeta.source_id || 'owned:course-blueprint-v4',
      notes: blueprintMeta.authority_notes || [],
      ...SURFACE_POLICY.course_blueprint_metadata,
      projection_policy: 'Metadata informs authority and completion labels only.',
    },
    {
      surface_id: 'authored:course-target-exercises',
      title: 'Course target exercises',
      path: TARGET_EXERCISES_PATH,
      source_surface_type: 'target_exercise_index',
      exists: existsRel(TARGET_EXERCISES_PATH),
      source_hash: sourceHashRel(TARGET_EXERCISES_PATH),
      record_count: (targetExercises.exercises || []).length,
      blueprint_source: targetExercises.blueprint_source,
      stale_blueprint_reference_count: JSON.stringify(targetExercises).split('knowledge/course_blueprint_v4.md').length - 1,
      ...SURFACE_POLICY.target_exercise_index,
      projection_policy: 'Target exercises may support unit-gap discovery; content graph links must be projection/evidence typed explicitly.',
    },
  ];

  for (const lessonRoot of lessonRoots) {
    sourceSurfaces.push({
      surface_id: lessonRoot.root_id,
      title: lessonRoot.title,
      path: lessonRoot.path,
      source_surface_type: 'active_lesson_root',
      exists: lessonRoot.exists,
      file_count: lessonRoot.file_count,
      paragraph_directory_count: lessonRoot.paragraph_directory_count,
      source_status: 'owned_lesson_surface',
      authority_level: 'owned_lesson_exposition',
      authority_weight: 35,
      primary_evidence: false,
      evidence_use: 'owned_lesson_corpus_context',
      allowed_use: ['rag_retrieval', 'owned_source_projection', 'lesson_authoring_support'],
      not_allowed_use: ['external_authority', 'override_machine_registry'],
      projection_policy: 'Root is a corpus boundary, not an evidence edge.',
    });

    for (const [type, files] of Object.entries(lessonRoot.files_by_type).sort((a, b) => a[0].localeCompare(b[0]))) {
      const policy = policyForType(type);
      sourceSurfaces.push({
        surface_id: `${lessonRoot.root_id}:${type}`,
        title: `${lessonRoot.title}: ${type}`,
        path: lessonRoot.path,
        source_surface_type: type,
        exists: lessonRoot.exists,
        observed_count: files.length,
        example_paths: compactExamples(files),
        ...policy,
        projection_policy: policy.primary_evidence
          ? 'May support owned-source evidence or projection edges only when individual records are identified later.'
          : 'May support projection, retrieval context, or implementation trace; not a primary evidence edge.',
      });
    }
  }

  const surfaceTypes = {};
  for (const surface of sourceSurfaces) {
    const type = surface.source_surface_type;
    if (!surfaceTypes[type]) {
      surfaceTypes[type] = {
        source_surface_type: type,
        surface_count: 0,
        observed_count: 0,
        authority_levels: new Set(),
        source_statuses: new Set(),
        primary_evidence_allowed: false,
      };
    }
    surfaceTypes[type].surface_count++;
    surfaceTypes[type].observed_count += surface.observed_count || surface.record_count || surface.file_count || 0;
    surfaceTypes[type].authority_levels.add(surface.authority_level);
    surfaceTypes[type].source_statuses.add(surface.source_status);
    surfaceTypes[type].primary_evidence_allowed = surfaceTypes[type].primary_evidence_allowed || surface.primary_evidence === true;
  }

  const companionTypes = Object.values(surfaceTypes)
    .filter((entry) => entry.source_surface_type !== 'course_blueprint' && entry.source_surface_type !== 'course_blueprint_metadata')
    .map((entry) => ({
      ...entry,
      authority_levels: Array.from(entry.authority_levels).sort(),
      source_statuses: Array.from(entry.source_statuses).sort(),
    }))
    .sort((a, b) => a.source_surface_type.localeCompare(b.source_surface_type));

  return {
    schema_version: 1,
    registry_id: 'owned-source-registry',
    generated_by: 'build-scripts/references/build-owned-source-registry.js',
    generated_on: generatedOn,
    source_files: [
      OWNED_BLUEPRINT_PATH,
      OWNED_BLUEPRINT_META_PATH,
      TARGET_EXERCISES_PATH,
      ...LESSON_ROOTS.map((root) => root.path),
    ],
    cp1_gate_status: 'pass_with_conditions',
    cp2_gate_id: 'GATE-CP2-owned-source-scope',
    authority_policy: {
      principle: 'Owned sources are important course-design and retrieval surfaces, but they do not override external authority or reviewed machine registry truth.',
      projection_edges_must_be_separate_from_evidence_edges: true,
      generated_outputs_are_primary_evidence: false,
      lesson_exposition_can_override_external_authority: false,
      lesson_exposition_can_override_machine_registry: false,
      allowed_downstream_uses: [
        'rag_retrieval',
        'owned_source_projection',
        'lesson_authoring_support',
        'course_design_review',
      ],
      blocked_downstream_uses: [
        'student_diagnostics',
        'adaptive_routing',
        'student_facing_ai',
        'automatic_lesson_sequencing',
        'automatic_mastery_decisions',
        'summative_assessment_decisions',
      ],
    },
    lesson_roots: lessonRoots.map((root) => ({
      root_id: root.root_id,
      path: root.path,
      title: root.title,
      exists: root.exists,
      file_count: root.file_count,
      paragraph_directory_count: root.paragraph_directory_count,
      by_extension: root.by_extension,
      by_type: root.by_type,
    })),
    companion_artifact_types: companionTypes,
    source_surfaces: sourceSurfaces,
  };
}

function markdownReport(registry) {
  const lines = [];
  lines.push('# Owned Source Registry Report');
  lines.push('');
  lines.push(`Generated by: \`${registry.generated_by}\``);
  lines.push(`Generated on: \`${registry.generated_on}\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Source surfaces: ${registry.source_surfaces.length}`);
  lines.push(`- Companion/source artifact types: ${registry.companion_artifact_types.length}`);
  lines.push(`- Projection edges must be separate from evidence edges: ${registry.authority_policy.projection_edges_must_be_separate_from_evidence_edges}`);
  lines.push(`- Generated outputs are primary evidence: ${registry.authority_policy.generated_outputs_are_primary_evidence}`);
  lines.push('');
  lines.push('## Lesson Roots');
  lines.push('');
  for (const root of registry.lesson_roots) {
    lines.push(`- \`${root.path}\`: ${root.file_count} files, ${root.paragraph_directory_count} paragraph directories`);
  }
  lines.push('');
  lines.push('## Companion Artifact Types');
  lines.push('');
  lines.push('| Type | Count | Source status | Authority | Primary evidence |');
  lines.push('|---|---:|---|---|---|');
  for (const type of registry.companion_artifact_types) {
    lines.push(`| \`${type.source_surface_type}\` | ${type.observed_count} | ${type.source_statuses.join(', ')} | ${type.authority_levels.join(', ')} | ${type.primary_evidence_allowed} |`);
  }
  lines.push('');
  lines.push('## Authority Policy');
  lines.push('');
  lines.push(registry.authority_policy.principle);
  lines.push('');
  lines.push('Owned source surfaces may support RAG retrieval, owned-source projection, lesson-authoring support, and course-design review. Student-facing diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, and summative decisions remain blocked.');
  return `${lines.join('\n')}\n`;
}

function cp2ReviewPacket(registry) {
  const questions = [
    {
      id: 'CP2-Q1',
      question: 'Does the owned-source registry include all relevant companion artefact types for current Book 1 work?',
      options: ['A. Yes', 'B. Mostly, with additions needed', 'C. No, important source classes are missing', 'D. Cannot decide from the packet'],
    },
    {
      id: 'CP2-Q2',
      question: 'Are the authority labels clear enough to distinguish owned design, owned lesson exposition, generated projection, answer model, planning artifact, and implementation output?',
      options: ['A. Yes', 'B. Mostly, wording needs improvement', 'C. No', 'D. Cannot decide'],
    },
    {
      id: 'CP2-Q3',
      question: 'Is it correct that generated HTML/PDF/PNG/shared-engine outputs are not primary evidence?',
      options: ['A. Yes', 'B. Yes with stronger warnings', 'C. No', 'D. Cannot decide'],
    },
    {
      id: 'CP2-Q4',
      question: 'Is the target-exercise index correctly treated as owned exercise evidence while remaining separate from external authority?',
      options: ['A. Yes', 'B. Yes with conditions', 'C. No', 'D. Cannot decide'],
    },
    {
      id: 'CP2-Q5',
      question: 'Should R9.2 proceed using projection edges only, with evidence edges reserved for explicitly evidence-qualified records?',
      options: ['A. Yes', 'B. Yes with stricter labels', 'C. Hold R9.2 until registry repair', 'D. Cannot decide'],
    },
    {
      id: 'CP2-Q6',
      question: 'What CP-2 gate status is appropriate?',
      options: ['A. pass', 'B. pass_with_conditions', 'C. hold'],
    },
  ];

  const packetJson = {
    gate_id: registry.cp2_gate_id,
    sprint_id: 'R9.1',
    status: 'review_packet_prepared',
    generated_on: registry.generated_on,
    registry: REGISTRY_PATH,
    registry_report: REPORT_MD_PATH,
    calibration_questions: questions,
    answer_recording_required: true,
    pattern_analysis_criteria: [
      'Any answer indicating missing source classes requires registry repair before R9.1 closure.',
      'Any answer allowing generated projections as primary evidence requires gate hold.',
      'R9.2 can proceed only if projection/evidence separation is approved.',
    ],
    targeted_followups: [],
    closure_proposal: 'pass_with_conditions',
    explicit_human_confirmation_required: true,
  };

  const lines = [];
  lines.push('# CP-2 Owned Source Scope Review Packet');
  lines.push('');
  lines.push(`Gate ID: \`${registry.cp2_gate_id}\``);
  lines.push(`Sprint: \`R9.1\``);
  lines.push('');
  lines.push('## Context');
  lines.push('');
  lines.push('R9.1 built the first owned-source registry and repaired target-exercise blueprint references. CP-2 reviews whether the source surface list and authority labels are accurate enough for R9.2 content graph projection.');
  lines.push('');
  lines.push('## Registry Summary');
  lines.push('');
  lines.push(`- Registry: \`${REGISTRY_PATH}\``);
  lines.push(`- Report: \`${REPORT_MD_PATH}\``);
  lines.push(`- Source surfaces: ${registry.source_surfaces.length}`);
  lines.push(`- Companion/source artifact types: ${registry.companion_artifact_types.length}`);
  lines.push(`- Projection/evidence separation required: ${registry.authority_policy.projection_edges_must_be_separate_from_evidence_edges}`);
  lines.push('');
  lines.push('## Calibration Questions');
  lines.push('');
  for (const question of questions) {
    lines.push(`### ${question.id}`);
    lines.push('');
    lines.push(question.question);
    lines.push('');
    for (const option of question.options) lines.push(`- ${option}`);
    lines.push('');
  }
  lines.push('## Answer Recording');
  lines.push('');
  lines.push('Record each answer in `human-interview.json` and summarize rationale in `human-interview.md` before gate closure.');
  lines.push('');
  lines.push('## Pattern Analysis');
  lines.push('');
  for (const criterion of packetJson.pattern_analysis_criteria) lines.push(`- ${criterion}`);
  lines.push('');
  lines.push('## Targeted Follow-Ups');
  lines.push('');
  lines.push('Add targeted follow-ups only if the reviewer flags missing source surfaces, weak labels, or evidence/projection confusion.');
  lines.push('');
  lines.push('## Closure Proposal');
  lines.push('');
  lines.push('Expected closure proposal: `pass_with_conditions`, unless generated projections are accepted as evidence or major source classes are missing. In that case use `hold`.');
  lines.push('');
  lines.push('## Explicit Human Confirmation');
  lines.push('');
  lines.push('R9.1 must not close until a human reviewer explicitly confirms the CP-2 gate decision.');

  return {
    json: packetJson,
    markdown: `${lines.join('\n')}\n`,
  };
}

function main() {
  const registry = buildRegistry();
  writeJson(REGISTRY_PATH, registry);
  writeJson(REPORT_JSON_PATH, {
    report_id: 'owned-source-registry',
    generated_by: registry.generated_by,
    generated_on: registry.generated_on,
    source_files: registry.source_files,
    schema_version: 1,
    status: 'info',
    issues: [],
    summary: {
      source_surface_count: registry.source_surfaces.length,
      companion_artifact_type_count: registry.companion_artifact_types.length,
      lesson_roots: registry.lesson_roots,
      projection_edges_must_be_separate_from_evidence_edges: registry.authority_policy.projection_edges_must_be_separate_from_evidence_edges,
      generated_outputs_are_primary_evidence: registry.authority_policy.generated_outputs_are_primary_evidence,
    },
  });
  writeText(REPORT_MD_PATH, markdownReport(registry));

  const packet = cp2ReviewPacket(registry);
  writeJson(CP2_PACKET_JSON, packet.json);
  writeText(CP2_PACKET_MD, packet.markdown);

  console.log(`Wrote ${REGISTRY_PATH}`);
  console.log(`Wrote ${REPORT_JSON_PATH}`);
  console.log(`Wrote ${REPORT_MD_PATH}`);
  console.log(`Wrote ${CP2_PACKET_MD}`);
  console.log(`Owned source surfaces: ${registry.source_surfaces.length}`);
}

if (require.main === module) main();
