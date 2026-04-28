#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join('reports', 'review-gates', 'GATE-CP1-schema-audit');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readJsonl(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeMd(file, text) {
  fs.writeFileSync(file, `${text.trimEnd()}\n`);
}

function schemaSummary(schema) {
  return {
    required: schema.required || [],
    properties: Object.keys(schema.properties || {}),
  };
}

function fieldCounts(records) {
  const counts = {};
  for (const record of records) {
    for (const key of Object.keys(record || {})) {
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

function presence(records, fields) {
  const counts = fieldCounts(records);
  return Object.fromEntries(
    fields.map((field) => [
      field,
      {
        present_count: counts[field] || 0,
        missing_count: records.length - (counts[field] || 0),
      },
    ]),
  );
}

function compareSchemaToData(schema, records) {
  const required = schema.required || [];
  const schemaFields = new Set(Object.keys(schema.properties || {}));
  const dataFields = new Set(Object.keys(fieldCounts(records)));
  return {
    required_presence: presence(records, required),
    schema_fields_missing_from_all_records: [...schemaFields].filter((field) => !dataFields.has(field)).sort(),
    data_fields_missing_from_schema: [...dataFields].filter((field) => !schemaFields.has(field)).sort(),
  };
}

function countTargetRefs(records) {
  return records.filter((record) => String(record.source_ref || '').includes('knowledge/course_blueprint_v4.md')).length;
}

function main() {
  ensureDir(OUT_DIR);

  const generatedOn = new Date().toISOString();
  const examSchemaPath = 'references/schemas/exam-question.schema.json';
  const targetSchemaPath = 'references/schemas/target-exercise.schema.json';
  const ragSchemaPath = 'references/schemas/rag-chunk.schema.json';
  const examDataPath = 'references/external/exam-questions.json';
  const targetDataPath = 'references/authored/course-target-exercises.json';
  const ragChunkPath = 'references/data/rag/chunk_index.jsonl';

  const examSchema = readJson(examSchemaPath);
  const targetSchema = readJson(targetSchemaPath);
  const ragSchema = readJson(ragSchemaPath);
  const examData = readJson(examDataPath);
  const targetData = readJson(targetDataPath);
  const chunks = readJsonl(ragChunkPath);

  const examRecords = Array.isArray(examData) ? examData : examData.questions || examData.exam_questions || [];
  const targetRecords = targetData.exercises || [];

  const hcsFields = [
    'instructional_role',
    'assessment_role',
    'authority_tier',
    'scaffolding',
    'bloom_level',
    'instruction_word',
    'answer_format',
    'graph_specs',
    'precision_lint_status',
    'evidence_status',
    'source_version',
    'content_status',
    'required_units',
    'exercise_operations',
    'skill_tags',
  ];

  const audit = {
    report_id: 'CP1-schema-audit',
    generated_by: 'build-scripts/references/audit-exercise-schema-contract.js',
    generated_on: generatedOn,
    gate_id: 'GATE-CP1-schema-audit',
    sprint_id: 'S1',
    protected_reference_data_changed: false,
    source_files: [
      examSchemaPath,
      targetSchemaPath,
      ragSchemaPath,
      examDataPath,
      targetDataPath,
      ragChunkPath,
      'references/reference-team-roadmap.md',
      'knowledge/Exercise schema and quality/roadmap-updated-repository-checked.md',
    ],
    baseline_counts: {
      exam_questions: examRecords.length,
      target_exercises: targetRecords.length,
      rag_chunks: chunks.length,
      target_exercises_source_ref_knowledge_blueprint: countTargetRefs(targetRecords),
    },
    schemas: {
      exam_question: schemaSummary(examSchema),
      target_exercise: schemaSummary(targetSchema),
      rag_chunk: schemaSummary(ragSchema),
    },
    comparisons: {
      exam_question_schema_to_data: compareSchemaToData(examSchema, examRecords),
      target_exercise_schema_to_data: compareSchemaToData(targetSchema, targetRecords),
      rag_chunk_schema_to_data: compareSchemaToData(ragSchema, chunks),
    },
    hcs_field_presence: {
      exam_questions: presence(examRecords, hcsFields),
      target_exercises: presence(targetRecords, hcsFields),
      rag_chunks: presence(chunks, ['evidence_ids', 'edge_statuses', 'authority_level', 'source_type', 'primary_evidence', 'curriculum_authority']),
    },
    precision_lint_path_check: {
      expected_by_hcs_or_prior_roadmap: 'build-scripts/verify_svg_geometry.py',
      expected_path_exists: fs.existsSync('build-scripts/verify_svg_geometry.py'),
      actual_repo_path: 'build-scripts/lib/verify_svg_geometry.py',
      actual_repo_path_exists: fs.existsSync('build-scripts/lib/verify_svg_geometry.py'),
      recommendation: 'Use build-scripts/lib/verify_svg_geometry.py or add a wrapper before requiring precision_lint_status automation.',
    },
    findings: [
      {
        id: 'CP1-F01',
        severity: 'high',
        title: 'Current schemas and current data shapes are not equivalent contracts.',
        evidence: [examSchemaPath, targetSchemaPath, examDataPath, targetDataPath],
        recommendation: 'Treat current schemas as aspirational or partial until CP-1 approves compatibility and migration names.',
      },
      {
        id: 'CP1-F02',
        severity: 'high',
        title: 'required_skills is currently used for micro-teaching-unit IDs.',
        evidence: [examDataPath, targetDataPath],
        recommendation: 'Adopt required_units for unit IDs, exercise_operations for fine-grained actions, and skill_tags for broader taxonomy tags.',
      },
      {
        id: 'CP1-F03',
        severity: 'high',
        title: 'External exam-question metadata must use overlays or refresh scripts.',
        evidence: [examDataPath, 'references/SOURCE_OF_TRUTH.md'],
        recommendation: 'Do not hand-edit references/external/exam-questions.json for role, scaffolding, Bloom, operation, or evidence-status metadata.',
      },
      {
        id: 'CP1-F04',
        severity: 'medium',
        title: 'Target exercises still point to the old knowledge blueprint path.',
        evidence: [targetDataPath, 'references/owned/course-blueprint-v4.md'],
        recommendation: 'R9.1 should repair 49 target-exercise source_ref values and blueprint_source to references/owned/course-blueprint-v4.md through an approved authored-reference update or migration script.',
      },
      {
        id: 'CP1-F05',
        severity: 'medium',
        title: 'Precision lint path in planning docs needs correction.',
        evidence: ['build-scripts/README.md', 'build-scripts/lib/verify_svg_geometry.py'],
        recommendation: 'Use build-scripts/lib/verify_svg_geometry.py or add a wrapper path before making precision_lint_status required.',
      },
    ],
    proposed_decisions_for_human_review: [
      'Approve required_units for micro-teaching-unit IDs.',
      'Approve exercise_operations for fine-grained exercise actions.',
      'Approve skill_tags or skill_category_tags for broader taxonomy labels.',
      'Approve instructional_role and assessment_role as separate fields.',
      'Approve the four-field scaffolding object.',
      'Approve protected-source-safe overlays under references/data/exercises/ for external exam-question metadata.',
      'Approve build-scripts/lib/verify_svg_geometry.py as the canonical verifier path or require a wrapper.',
      'Confirm whether CP-1 closes as pass_with_conditions or hold.',
    ],
  };

  const vocabulary = {
    report_id: 'CP1-vocabulary-decision-table',
    generated_by: audit.generated_by,
    generated_on: generatedOn,
    gate_id: audit.gate_id,
    sprint_id: audit.sprint_id,
    proposed_contract: [
      {
        field: 'required_units',
        meaning: 'Micro-teaching-unit IDs required by an exam question or target exercise.',
        current_conflict: 'Current data uses required_skills for this meaning.',
        recommendation: 'Approve and migrate toward required_units while treating required_skills as legacy/source field until migration.',
      },
      {
        field: 'exercise_operations',
        meaning: 'Fine-grained learner actions inside an exercise, for example calculate, compare, infer, interpret, draw, classify.',
        current_conflict: 'No current stable field.',
        recommendation: 'Approve as overlay field after CP-3 dry run.',
      },
      {
        field: 'skill_tags',
        meaning: 'Broad skill/category taxonomy labels.',
        current_conflict: 'Name could collide with old required_skills if not documented.',
        recommendation: 'Approve name or choose skill_category_tags at CP-1.',
      },
      {
        field: 'instructional_role',
        meaning: 'What the exercise is for in authored learning flow.',
        initial_values: ['worked_example', 'startoefening', 'independent_practice', 'interleaving', 'target', 'verdieping', 'consolidatie', 'instapquiz', 'diagnostic', 'nieuws'],
        recommendation: 'Approve as separate from assessment_role.',
      },
      {
        field: 'assessment_role',
        meaning: 'How the exercise relates to exam/evidence graph.',
        initial_values: ['exam_mirror', 'bridge', 'prerequisite'],
        open_question: 'Should non-assessment items use null, not_applicable, or omit the field?',
      },
      {
        field: 'scaffolding',
        meaning: 'Object describing verbal support, visual support, fading, and dual coding.',
        object_fields: {
          verbal_level: 'integer 0-5',
          visual_stage: 'integer 1-4',
          fading_position: 'integer',
          dual_coding_present: 'boolean',
        },
        recommendation: 'Approve object; do not collapse to a single scaffolding_level field.',
      },
    ],
  };

  const overlay = {
    report_id: 'CP1-overlay-strategy',
    generated_by: audit.generated_by,
    generated_on: generatedOn,
    gate_id: audit.gate_id,
    sprint_id: audit.sprint_id,
    strategy: {
      external_exam_questions: {
        source_file: examDataPath,
        edit_policy: 'protected_external_source',
        proposed_metadata_location: 'references/data/exercises/exam-question-overlays.json',
        rationale: 'External mirrored authority should not be hand-edited for authored metadata.',
      },
      target_exercises: {
        source_file: targetDataPath,
        edit_policy: 'authored_reference_but_schema_sensitive',
        proposed_metadata_location: 'references/data/exercises/target-exercise-overlays.json for first pass; later migrate if approved',
        rationale: 'The target-exercise file is authored, but CP-1 should avoid bulk source mutation before names and schema are approved.',
      },
      rag_chunks: {
        source_file: ragChunkPath,
        edit_policy: 'generated_projection',
        proposed_metadata_location: 'regenerate from approved source and overlays',
        rationale: 'Chunk metadata should be generated, not hand-patched.',
      },
    },
  };

  const reviewPacket = {
    gate_id: 'GATE-CP1-schema-audit',
    sprint_id: 'S1',
    packet_status: 'prepared_for_human_review',
    gate_closure_status: 'not_closed',
    prepared_on: generatedOn.slice(0, 10),
    proposed_gate_status: 'pass_with_conditions',
    proposed_status_rationale: 'The audit found no blocker to proceeding to R9.1 if the naming contract, overlay strategy, role split, scaffolding object, and precision-lint path are accepted as conditions.',
    source_artifacts: [
      'reports/review-gates/GATE-CP1-schema-audit/schema-audit.md',
      'reports/review-gates/GATE-CP1-schema-audit/vocabulary-decision-table.md',
      'reports/review-gates/GATE-CP1-schema-audit/overlay-strategy.md',
    ],
    review_questions: [
      {
        id: 'CP1-Q1',
        question: 'Approve required_units as the canonical field for micro-teaching-unit IDs?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q2',
        question: 'Approve exercise_operations as the canonical field for fine-grained exercise actions?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q3',
        question: 'Should the broader taxonomy field be named skill_tags or skill_category_tags?',
        recommended_answer: 'skill_tags unless the reviewer wants maximum explicitness.',
      },
      {
        id: 'CP1-Q4',
        question: 'Approve instructional_role and assessment_role as separate fields rather than one flat exercise role enum?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q5',
        question: 'Approve the initial instructional_role vocabulary?',
        recommended_answer: 'approve_with_conditions: allow CP-3 to refine values during dry run.',
      },
      {
        id: 'CP1-Q6',
        question: 'For assessment_role, should non-assessment items use null, not_applicable, or omit the field?',
        recommended_answer: 'not_applicable for explicitness in overlays.',
      },
      {
        id: 'CP1-Q7',
        question: 'Approve scaffolding as a four-field object with verbal_level, visual_stage, fading_position, and dual_coding_present?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q8',
        question: 'Approve references/data/exercises/ overlays for external exam-question metadata?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q9',
        question: 'For authored target exercises, should Sprint 4 use overlays first and leave source mutation to a later approved migration?',
        recommended_answer: 'approve overlays first.',
      },
      {
        id: 'CP1-Q10',
        question: 'Approve build-scripts/lib/verify_svg_geometry.py as the canonical precision verifier path, with optional wrapper later?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q11',
        question: 'May R9.1 proceed after CP-1 if it repairs blueprint references and owned-source registry only, without exercise metadata backfill?',
        recommended_answer: 'approve',
      },
      {
        id: 'CP1-Q12',
        question: 'Gate status: pass, pass_with_conditions, hold, or fail?',
        recommended_answer: 'pass_with_conditions',
      },
    ],
    proposed_conditions: [
      'Do not bulk-extend exercise metadata until CP-3 schema-extension dry run passes.',
      'Do not hand-edit references/external/ for exercise metadata.',
      'Treat required_skills as legacy/source field until migration is approved.',
      'R9.1 may proceed only with owned-source registry and blueprint reference repair scope.',
    ],
    blocked_until_later: [
      'bulk exercise metadata backfill',
      'machine registry creation without CLI',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic lesson sequencing',
      'automatic mastery decisions',
      'summative assessment decisions',
    ],
  };

  writeJson(path.join(OUT_DIR, 'schema-audit.json'), audit);
  writeJson(path.join(OUT_DIR, 'vocabulary-decision-table.json'), vocabulary);
  writeJson(path.join(OUT_DIR, 'overlay-strategy.json'), overlay);
  writeJson(path.join(OUT_DIR, 'review-packet.json'), reviewPacket);

  writeMd(
    path.join(OUT_DIR, 'schema-audit.md'),
    `# CP-1 Schema Audit

Generated: ${generatedOn}

## Summary

The current repository is ready for a non-mutating schema decision gate, but not ready for bulk exercise metadata implementation.

Main findings:

- Current schemas and current data shapes are not equivalent contracts.
- \`required_skills\` currently means micro-teaching-unit IDs in source data.
- Exercise metadata for external exam questions must live in overlays or refresh outputs, not hand edits.
- All ${audit.baseline_counts.target_exercises_source_ref_knowledge_blueprint} target exercises still point to \`knowledge/course_blueprint_v4.md\`.
- The SVG verifier exists at \`${audit.precision_lint_path_check.actual_repo_path}\`.

## Baseline Counts

| Surface | Count |
|---|---:|
| Exam questions | ${audit.baseline_counts.exam_questions} |
| Target exercises | ${audit.baseline_counts.target_exercises} |
| RAG chunks | ${audit.baseline_counts.rag_chunks} |
| Target exercises pointing to old blueprint path | ${audit.baseline_counts.target_exercises_source_ref_knowledge_blueprint} |

## Schema/Data Findings

### Exam Questions

Required fields in schema:

\`\`\`json
${JSON.stringify(audit.schemas.exam_question.required, null, 2)}
\`\`\`

Current data fields missing from schema include:

\`\`\`json
${JSON.stringify(audit.comparisons.exam_question_schema_to_data.data_fields_missing_from_schema, null, 2)}
\`\`\`

### Target Exercises

Required fields in schema:

\`\`\`json
${JSON.stringify(audit.schemas.target_exercise.required, null, 2)}
\`\`\`

Current data fields missing from schema include:

\`\`\`json
${JSON.stringify(audit.comparisons.target_exercise_schema_to_data.data_fields_missing_from_schema, null, 2)}
\`\`\`

### RAG Chunks

The chunk schema covers the minimal retrieval contract, but current chunks already carry additional governance fields. Sprint 4 and R7.6 should regenerate chunks from approved source and overlay data rather than patch chunks by hand.

## Recommended CP-1 Outcome

Close CP-1 as \`pass_with_conditions\` if the human reviewer approves:

- \`required_units\`
- \`exercise_operations\`
- \`skill_tags\` or \`skill_category_tags\`
- \`instructional_role\` and \`assessment_role\`
- the four-field \`scaffolding\` object
- protected-source-safe overlays under \`references/data/exercises/\`
- \`${audit.precision_lint_path_check.actual_repo_path}\` as the current verifier path

Do not proceed to bulk metadata backfill until CP-3 passes.
`,
  );

  writeMd(
    path.join(OUT_DIR, 'vocabulary-decision-table.md'),
    `# CP-1 Vocabulary Decision Table

Generated: ${generatedOn}

| Field | Meaning | Decision Needed |
|---|---|---|
| \`required_units\` | Micro-teaching-unit IDs required by an exercise or exam question | Approve as canonical successor to current \`required_skills\` usage |
| \`exercise_operations\` | Fine-grained learner actions inside an exercise | Approve |
| \`skill_tags\` or \`skill_category_tags\` | Broader taxonomy labels | Choose one name |
| \`instructional_role\` | What the exercise is for in authored learning flow | Approve separate field |
| \`assessment_role\` | How the exercise relates to the exam/evidence graph | Approve separate field and decide nullability |
| \`scaffolding.verbal_level\` | Verbal support level, integer 0-5 | Approve |
| \`scaffolding.visual_stage\` | Visual support stage, integer 1-4 | Approve |
| \`scaffolding.fading_position\` | Position in fading sequence | Approve |
| \`scaffolding.dual_coding_present\` | Whether dual coding is present | Approve |

## Recommendation

Approve the naming triple:

\`\`\`text
required_units
exercise_operations
skill_tags
\`\`\`

Keep \`required_skills\` as a legacy/source field until an explicit migration is approved.
`,
  );

  writeMd(
    path.join(OUT_DIR, 'overlay-strategy.md'),
    `# CP-1 Overlay Strategy

Generated: ${generatedOn}

## Decision

Use protected-source-safe overlays for first-pass exercise metadata.

## External Exam Questions

- Source: \`${examDataPath}\`
- Policy: protected external source
- Proposed overlay: \`references/data/exercises/exam-question-overlays.json\`
- Reason: exam-question metadata such as role, scaffolding, Bloom level, operations, and evidence status is authored analysis, not mirrored external authority.

## Target Exercises

- Source: \`${targetDataPath}\`
- Policy: authored reference, but schema-sensitive
- Proposed first pass: \`references/data/exercises/target-exercise-overlays.json\`
- Reason: avoid bulk source mutation before CP-1 and CP-3 settle names and dry-run shape.

## RAG Chunks

- Source: \`${ragChunkPath}\`
- Policy: generated projection
- Proposed handling: regenerate from approved source and overlay data.

## Precision Lint

Use \`build-scripts/lib/verify_svg_geometry.py\` or add a wrapper before making \`precision_lint_status\` required.
`,
  );

  writeMd(
    path.join(OUT_DIR, 'review-packet.md'),
    `# CP-1 Review Packet

Generated: ${generatedOn}

Gate: \`GATE-CP1-schema-audit\`
Sprint: \`S1\`
Status: prepared for human review, not closed.

## Proposed Status

\`pass_with_conditions\`

## Rationale

The schema audit found real compatibility issues, but they are exactly the issues CP-1 was meant to surface. R9.1 can proceed after CP-1 if the naming contract and overlay strategy are approved, because R9.1 is owned-source registry and blueprint-reference repair, not bulk exercise metadata backfill.

## Review Questions

${reviewPacket.review_questions.map((q) => `### ${q.id}\n\n${q.question}\n\nRecommended answer: ${q.recommended_answer}`).join('\n\n')}

## Proposed Conditions

${reviewPacket.proposed_conditions.map((condition) => `- ${condition}`).join('\n')}

## Blocked Until Later

${reviewPacket.blocked_until_later.map((item) => `- ${item}`).join('\n')}
`,
  );

  console.log(`Wrote CP-1 audit artifacts to ${OUT_DIR}`);
}

main();
