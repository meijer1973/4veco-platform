#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add stable operation mappings when CP-4 approves them.
 * - Keep this registry under references/data/ until a CLI-backed machine
 *   registry exists.
 * - Do not use this script to mutate references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REGISTRY_PATH = 'references/data/skill-operation-registry.json';
const REPORT_JSON_PATH = 'reports/json/skill-operation-registry.json';
const REPORT_MD_PATH = 'reports/markdown/skill-operation-registry.md';
const CP4_DIR = 'reports/review-gates/GATE-CP4-skill-registry-coexistence';
const CP4_PACKET_MD = `${CP4_DIR}/review-packet.md`;
const CP4_PACKET_JSON = `${CP4_DIR}/review-packet.json`;
const CP4_URLS = `${CP4_DIR}/bundle-urls.md`;

const SKILL_CATEGORIES_PATH = 'references/authored/skill-categories.md';
const RX1_INVENTORY_PATH = 'references/data/sprints/RX.1-representation-operation-inventory.json';
const EXAM_OVERLAYS_PATH = 'references/data/exercises/exam-question-overlays.json';
const TARGET_OVERLAYS_PATH = 'references/data/exercises/target-exercise-overlays.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const CP1_CLOSURE_PATH = 'reports/review-gates/GATE-CP1-schema-audit/gate-closure.json';
const CP3_CLOSURE_PATH = 'reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json';

const BROAD_SKILL_TAGS = [
  {
    tag_id: 'rekenen',
    label_nl: 'Rekenen',
    description: 'Numerieke berekeningen, formulegebruik, data-extractie, substitutie, eenheden, en afronding.',
    source_section: '2.1 Rekenen',
  },
  {
    tag_id: 'grafisch',
    label_nl: 'Grafisch werken',
    description: 'Grafieken lezen, interpreteren, tekenen, verschuiven, arceren, en grafische conclusies trekken.',
    source_section: '2.2 Grafisch werken',
  },
  {
    tag_id: 'redeneren',
    label_nl: 'Redeneren',
    description: 'Causale ketens construeren en economische mechanismen uitleggen.',
    source_section: '2.3 Redeneren',
  },
  {
    tag_id: 'begrippen',
    label_nl: 'Begrippen en classificatie',
    description: 'Definities oproepen en toepassen op concrete casussen.',
    source_section: '2.4 Begrippen & classificatie',
  },
  {
    tag_id: 'bron-info',
    label_nl: 'Bron- en informatievaardigheden',
    description: 'Relevante informatie uit tekst, tabel, figuur, of nieuwsbericht halen.',
    source_section: '2.5 Bron- en informatievaardigheden',
  },
  {
    tag_id: 'standpunt',
    label_nl: 'Standpunt en evaluatie',
    description: 'Argumenten wegen en een onderbouwde conclusie formuleren.',
    source_section: '2.6 Standpunt & evaluatie',
  },
  {
    tag_id: 'strategisch',
    label_nl: 'Strategisch inzicht',
    description: 'Strategische interactie, prikkels, commitment, en speltheorie analyseren.',
    source_section: '2.7 Strategisch inzicht',
  },
  {
    tag_id: 'toetsvaardigheden',
    label_nl: 'Toetsvaardigheden',
    description: 'Instructiewoord, antwoordvorm, tijd, en integratievaardigheden onder toetscondities.',
    source_section: '2.8 Toetsvaardigheden',
  },
  {
    tag_id: 'onderzoek',
    label_nl: 'Onderzoek en experimenten',
    description: 'Economische experimenten ontwerpen, uitvoeren, en interpreteren; optioneel SE-context.',
    source_section: 'Part 3 Onderzoek / experimenten',
  },
];

const OVERLAY_OPERATION_UNIT_MAP = {
  calculate_percentage_share_from_source_values: ['A04', 'A61'],
  draw_pq_graph_from_table: ['A45'],
  read_interpolate_pq_graph: ['A46'],
  evaluate_percentage_claim_from_table: ['A38', 'A61', 'A67'],
};

const FIELD_POLICY = {
  required_units: {
    status: 'canonical',
    meaning: 'Micro-teaching-unit IDs required by an exercise or exam question.',
  },
  required_skills: {
    status: 'legacy_source_field_only',
    meaning: 'Legacy/source field currently used in external and authored source data; do not reuse for new skill-tag or operation semantics.',
  },
  exercise_operations: {
    status: 'provisional_until_cp4',
    meaning: 'Fine-grained learner actions inside an exercise.',
  },
  skill_tags: {
    status: 'canonical_field_name_pending_cp4_vocabulary',
    meaning: 'Broader taxonomy labels; CP-4 must decide vocabulary coexistence and migration rules.',
  },
};

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

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function by(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || '<missing>';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function liveUnitIds() {
  return new Set(readJson(UNITS_PATH).map((unit) => unit.id));
}

function operationStatus(record, liveIds) {
  if (record.classification && record.classification.includes('hold')) return 'held_for_duplicate_or_scope_review';
  if (record.candidate_unit_id && liveIds.has(record.candidate_unit_id)) return 'live_unit_mapped';
  if (record.mutation_authorized === true) return 'authorized_elsewhere';
  return 'candidate_pending_review';
}

function operationFromRx(record, liveIds) {
  const mapped = record.candidate_unit_id && liveIds.has(record.candidate_unit_id)
    ? [record.candidate_unit_id]
    : [];
  return {
    operation_id: record.operation_id,
    operation_key: slug(record.name),
    name: record.name,
    status: operationStatus(record, liveIds),
    governance_status: 'provisional_until_cp4',
    source_path: RX1_INVENTORY_PATH,
    source_record_id: record.operation_id,
    base_operation: record.base_operation,
    representation: record.representation,
    economic_context: record.economic_context,
    source_values_task: record.source_values_task,
    composition_pattern: record.composition_pattern,
    evidence_status: record.evidence_status,
    candidate_unit_id: record.candidate_unit_id || null,
    mapped_unit_ids: mapped,
    held_reason: record.duplicate_overlap ? record.duplicate_overlap.hold_reason : null,
    notes: [
      'Imported from RX.1 representation-operation inventory.',
      'Operation remains provisional until CP-4 approves coexistence and promotion rules.',
    ],
  };
}

function overlayRecords(relPath) {
  const overlay = readJson(relPath);
  return (overlay.records || []).map((record) => ({ ...record, overlay_path: relPath }));
}

function overlayOperationRecords() {
  const rows = [...overlayRecords(EXAM_OVERLAYS_PATH), ...overlayRecords(TARGET_OVERLAYS_PATH)];
  const operations = new Map();
  const tags = new Map();

  for (const row of rows) {
    for (const op of row.exercise_operations || []) {
      if (!operations.has(op)) {
        operations.set(op, {
          operation_id: `OVERLAY_${slug(op).toUpperCase()}`,
          operation_key: op,
          name: op.replace(/_/g, ' '),
          status: 'overlay_provisional',
          governance_status: 'provisional_until_cp4',
          source_path: row.overlay_path,
          source_record_id: row.overlay_record_id,
          base_operation: 'not_yet_normalized',
          representation: row.graph_spec && row.graph_spec.representation_types ? row.graph_spec.representation_types.join('+') : 'not_declared',
          economic_context: row.source_type,
          source_values_task: row.graph_spec && row.graph_spec.source_values_required ? 'source_values_required' : 'not_declared',
          composition_pattern: 'overlay_dry_run_label',
          evidence_status: row.evidence_status,
          candidate_unit_id: null,
          mapped_unit_ids: OVERLAY_OPERATION_UNIT_MAP[op] || [],
          held_reason: null,
          notes: [
            'Observed in S4 dry-run overlay.',
            'This operation label is not yet governed and may need renaming or mapping in CP-4.',
          ],
        });
      }
    }
    for (const tag of row.skill_tags || []) {
      if (!tags.has(tag)) {
        tags.set(tag, {
          tag_id: tag,
          status: 'observed_overlay_tag_needs_cp4_mapping',
          observed_in: [row.overlay_path],
          example_record_id: row.overlay_record_id,
        });
      } else {
        const existing = tags.get(tag);
        if (!existing.observed_in.includes(row.overlay_path)) existing.observed_in.push(row.overlay_path);
      }
    }
  }
  return {
    operations: [...operations.values()].sort((a, b) => a.operation_id.localeCompare(b.operation_id)),
    tags: [...tags.values()].sort((a, b) => a.tag_id.localeCompare(b.tag_id)),
  };
}

function buildRegistry() {
  const cp1 = readJson(CP1_CLOSURE_PATH);
  const cp3 = readJson(CP3_CLOSURE_PATH);
  const rx1 = readJson(RX1_INVENTORY_PATH);
  const liveIds = liveUnitIds();
  const overlay = overlayOperationRecords();
  const rxOperations = (rx1.records || []).map((record) => operationFromRx(record, liveIds));
  const operationById = new Map(rxOperations.map((record) => [record.operation_id, record]));
  for (const op of overlay.operations) operationById.set(op.operation_id, op);
  const exerciseOperations = [...operationById.values()].sort((a, b) => a.operation_id.localeCompare(b.operation_id));

  const skillTags = BROAD_SKILL_TAGS.map((tag) => ({
    ...tag,
    status: 'authored_taxonomy_candidate_pending_cp4',
    source_path: SKILL_CATEGORIES_PATH,
    field_name: 'skill_tags',
    notes: [
      'Promoted from authored skill-categories reference into S7 review overlay.',
      'CP-4 must decide whether this vocabulary becomes the governed broad-tag vocabulary.',
    ],
  }));

  const coexistenceIssues = [
    {
      issue_id: 'S7-COEX-001',
      severity: 'medium',
      summary: 'Dry-run overlays use English-style skill_tags while skill-categories.md uses Dutch broad categories.',
      next_action: 'CP-4 should decide whether to normalize overlay tags to Dutch broad categories, keep English sub-tags as aliases, or split broad tags from operation labels.',
      proof_required_to_close: 'Registry records show approved tag IDs, alias policy, and validator rules.',
    },
    {
      issue_id: 'S7-COEX-002',
      severity: 'high',
      summary: 'exercise_operations are useful but not yet governed machine registry records.',
      next_action: 'Keep operations provisional until CP-4 approves governance and a later CLI-backed registry path exists.',
      proof_required_to_close: 'Operation records have stable IDs, statuses, source provenance, validator coverage, and promotion policy.',
    },
    {
      issue_id: 'S7-COEX-003',
      severity: 'high',
      summary: 'required_skills remains a legacy/source field and must not be reused for a new concept.',
      next_action: 'Validators and review packet should preserve required_units/exercise_operations/skill_tags separation.',
      proof_required_to_close: 'CP-4 closure confirms field semantics and blocks required_skills reuse until migration.',
    },
  ];

  return {
    schema_version: 1,
    registry_id: 'skill-operation-registry',
    generated_by: 'build-scripts/references/build-skill-operation-registry.js',
    generated_on: new Date().toISOString(),
    status: 'prepared_for_cp4_review',
    storage_decision: {
      registry_location: REGISTRY_PATH,
      machine_registry_created: false,
      reason: 'S7 prepares a governed data overlay. Machine promotion remains blocked until schema, CLI, validators, mutation logs, and CP-4 approval exist.',
    },
    source_files: [
      SKILL_CATEGORIES_PATH,
      RX1_INVENTORY_PATH,
      EXAM_OVERLAYS_PATH,
      TARGET_OVERLAYS_PATH,
      UNITS_PATH,
      CP1_CLOSURE_PATH,
      CP3_CLOSURE_PATH,
    ],
    field_policy: FIELD_POLICY,
    cp1_gate_status: cp1.status,
    cp3_gate_status: cp3.status,
    summary: {
      skill_tag_count: skillTags.length,
      overlay_skill_tag_count: overlay.tags.length,
      exercise_operation_count: exerciseOperations.length,
      operation_count_by_status: by(exerciseOperations, 'status'),
      mapped_operation_count: exerciseOperations.filter((op) => op.mapped_unit_ids.length > 0).length,
      live_unit_mapped_operation_count: exerciseOperations.filter((op) => op.status === 'live_unit_mapped').length,
      coexistence_issue_count: coexistenceIssues.length,
    },
    skill_tags: skillTags,
    overlay_skill_tags_observed: overlay.tags,
    exercise_operations: exerciseOperations,
    coexistence_issues: coexistenceIssues,
  };
}

function markdownReport(registry) {
  const lines = [];
  lines.push('# Skill And Operation Registry MVP');
  lines.push('');
  lines.push(`Status: \`${registry.status}\``);
  lines.push(`Generated by: \`${registry.generated_by}\``);
  lines.push('');
  lines.push('## Field Policy');
  lines.push('');
  lines.push('| Field | Status | Meaning |');
  lines.push('|---|---|---|');
  for (const [field, policy] of Object.entries(registry.field_policy)) {
    lines.push(`| \`${field}\` | \`${policy.status}\` | ${policy.meaning} |`);
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`Skill tags: \`${registry.summary.skill_tag_count}\``);
  lines.push(`Overlay skill tags observed: \`${registry.summary.overlay_skill_tag_count}\``);
  lines.push(`Exercise operations: \`${registry.summary.exercise_operation_count}\``);
  lines.push(`Mapped operations: \`${registry.summary.mapped_operation_count}\``);
  lines.push('');
  lines.push('### Operation Statuses');
  lines.push('');
  lines.push('| Status | Count |');
  lines.push('|---|---:|');
  for (const [status, count] of Object.entries(registry.summary.operation_count_by_status).sort()) {
    lines.push(`| \`${status}\` | ${count} |`);
  }
  lines.push('');
  lines.push('## Broad Skill Tags');
  lines.push('');
  lines.push('| Tag | Label | Status |');
  lines.push('|---|---|---|');
  for (const tag of registry.skill_tags) {
    lines.push(`| \`${tag.tag_id}\` | ${tag.label_nl} | \`${tag.status}\` |`);
  }
  lines.push('');
  lines.push('## Overlay Skill Tags Observed');
  lines.push('');
  lines.push('| Tag | Status | Example |');
  lines.push('|---|---|---|');
  for (const tag of registry.overlay_skill_tags_observed) {
    lines.push(`| \`${tag.tag_id}\` | \`${tag.status}\` | \`${tag.example_record_id}\` |`);
  }
  lines.push('');
  lines.push('## Coexistence Issues');
  lines.push('');
  for (const issue of registry.coexistence_issues) {
    lines.push(`- \`${issue.issue_id}\` (${issue.severity}): ${issue.summary}`);
  }
  lines.push('');
  lines.push('## Boundary Notes');
  lines.push('');
  lines.push('- `required_units` remains the canonical unit-ID field.');
  lines.push('- `required_skills` remains legacy/source-only.');
  lines.push('- `exercise_operations` remains provisional until CP-4 review.');
  lines.push('- No machine registry is created in S7.');
  lines.push('');
  return `${lines.join('\n')}`;
}

function reviewPacket(registry) {
  const questions = [
    {
      id: 'CP4-Q1',
      question: 'Is references/data/ the correct storage location for the S7 MVP, with machine-registry promotion blocked until CLI support exists?',
      recommendation: 'Yes. Keep S7 as a governed data overlay.',
    },
    {
      id: 'CP4-Q2',
      question: 'Should required_units, exercise_operations, and skill_tags remain the three canonical fields, with required_skills legacy/source-only?',
      recommendation: 'Yes. This preserves CP-1 semantics.',
    },
    {
      id: 'CP4-Q3',
      question: 'Are the broad Dutch skill_tags from skill-categories.md acceptable as the v1 broad taxonomy?',
      recommendation: 'Mostly, but CP-4 should decide alias and naming rules.',
    },
    {
      id: 'CP4-Q4',
      question: 'How should the English-style dry-run overlay skill_tags coexist with the Dutch broad categories?',
      recommendation: 'Treat them as provisional aliases/sub-tags until CP-4 decides whether to normalize or split them.',
    },
    {
      id: 'CP4-Q5',
      question: 'Are RX.1 exercise_operations ready to become governed operation records?',
      recommendation: 'Not yet. Keep them provisional and approve only the coexistence structure.',
    },
    {
      id: 'CP4-Q6',
      question: 'Are operation-to-unit mappings clear enough where live units or dry-run overlays make the relation explicit?',
      recommendation: 'Mostly. Approve mapped records as provisional; require proof before bulk backfill.',
    },
    {
      id: 'CP4-Q7',
      question: 'Should S7 authorize a references/machine operation or skill-tag registry now?',
      recommendation: 'No. Machine promotion requires CLI and mutation logs.',
    },
    {
      id: 'CP4-Q8',
      question: 'What gate status should GATE-CP4-skill-registry-coexistence receive?',
      recommendation: 'Expected status is pass_with_conditions unless field separation or tag coexistence is rejected.',
    },
  ];

  const json = {
    gate_id: 'GATE-CP4-skill-registry-coexistence',
    sprint_id: 'S7',
    status: 'prepared_for_human_review',
    generated_by: 'build-scripts/references/build-skill-operation-registry.js',
    generated_on: registry.generated_on,
    registry: REGISTRY_PATH,
    report: REPORT_JSON_PATH,
    summary: registry.summary,
    field_policy: registry.field_policy,
    review_questions: questions,
    required_human_decisions: [
      'Confirm field separation and required_skills legacy status.',
      'Decide broad skill_tags vocabulary and alias policy.',
      'Decide whether exercise_operations stay provisional or receive limited approval.',
      'Confirm no references/machine registry is authorized in S7.',
    ],
    blocked_until_gate_closure: [
      'S7 sprint closure',
      'bulk exercise metadata backfill',
      'machine registry promotion',
      'student diagnostics',
      'adaptive routing',
      'student-facing AI',
      'automatic sequencing',
      'mastery decisions',
      'summative decisions',
    ],
  };

  const md = [
    '# CP-4 Skill Registry Coexistence Review Packet',
    '',
    'Status: `prepared_for_human_review`',
    '',
    'S7 prepared a governed `references/data/` skill-and-operation registry overlay. It does not close the sprint, promote a machine registry, or authorize bulk exercise metadata backfill.',
    '',
    '## Registry Summary',
    '',
    `- Skill tags: \`${registry.summary.skill_tag_count}\``,
    `- Overlay skill tags observed: \`${registry.summary.overlay_skill_tag_count}\``,
    `- Exercise operations: \`${registry.summary.exercise_operation_count}\``,
    `- Mapped operations: \`${registry.summary.mapped_operation_count}\``,
    `- Coexistence issues: \`${registry.summary.coexistence_issue_count}\``,
    '',
    '## Field Policy',
    '',
    '| Field | Status | Meaning |',
    '|---|---|---|',
    ...Object.entries(registry.field_policy).map(([field, policy]) => `| \`${field}\` | \`${policy.status}\` | ${policy.meaning} |`),
    '',
    '## Review Questions',
    '',
    ...questions.flatMap((question) => [
      `### ${question.id}`,
      '',
      question.question,
      '',
      `Recommended answer: ${question.recommendation}`,
      '',
    ]),
    '## Required Human Decisions',
    '',
    ...json.required_human_decisions.map((item) => `- ${item}`),
    '',
    '## Blocked Until Gate Closure',
    '',
    ...json.blocked_until_gate_closure.map((item) => `- ${item}`),
    '',
  ].join('\n');

  return { json, md };
}

function bundleUrls() {
  return [
    '# GATE-CP4 Skill Registry Coexistence Bundle URLs',
    '',
    '- `reports/review-gates/GATE-CP4-skill-registry-coexistence/review-packet.md`',
    '- `reports/review-gates/GATE-CP4-skill-registry-coexistence/review-packet.json`',
    '- `references/data/skill-operation-registry.json`',
    '- `reports/json/skill-operation-registry.json`',
    '- `reports/markdown/skill-operation-registry.md`',
    '',
  ].join('\n');
}

function main() {
  const registry = buildRegistry();
  writeJson(REGISTRY_PATH, registry);
  writeJson(REPORT_JSON_PATH, {
    generated_by: registry.generated_by,
    generated_on: registry.generated_on,
    status: 'prepared_for_cp4_review',
    summary: registry.summary,
    field_policy: registry.field_policy,
    coexistence_issues: registry.coexistence_issues,
  });
  writeText(REPORT_MD_PATH, markdownReport(registry));

  const packet = reviewPacket(registry);
  writeJson(CP4_PACKET_JSON, packet.json);
  writeText(CP4_PACKET_MD, packet.md);
  writeText(CP4_URLS, bundleUrls());
  console.log(`Wrote ${REGISTRY_PATH} with ${registry.exercise_operations.length} operations`);
}

if (require.main === module) main();
