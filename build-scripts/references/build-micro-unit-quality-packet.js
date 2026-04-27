#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'reports', 'review-gates', 'GATE-R4-micro-unit-quality');
const OUT_JSON = path.join(OUT_DIR, 'R4.4-micro-unit-quality-packet.json');
const OUT_MD = path.join(OUT_DIR, 'R4.4-micro-unit-quality-packet.md');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function isLive(unit) {
  return unit && unit.deprecated !== true && unit.status !== 'deprecated';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(value, max = 360) {
  const text = String(value || '');
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function groupCount(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function candidateTerms(unit, termEntries) {
  const unitSlug = slugify(unit.name);
  const unitWords = new Set(unitSlug.split('-').filter((word) => word.length >= 5));
  const matches = [];
  for (const term of termEntries) {
    const termSlug = slugify(term.term_nl || term.id);
    if (!termSlug) continue;
    const termWords = termSlug.split('-').filter((word) => word.length >= 5);
    const exactish = unitSlug.includes(termSlug) || termSlug.includes(unitSlug);
    const shared = termWords.filter((word) => unitWords.has(word));
    if (exactish || shared.length >= 1) {
      matches.push({
        id: term.id,
        term_nl: term.term_nl,
        reason: exactish ? 'slug_overlap' : `shared_word:${shared.join(',')}`,
      });
    }
  }
  return matches.slice(0, 5);
}

const units = readJson('references/machine/micro-teaching-units.json');
const begrippen = readJson('references/machine/begrippen.json');
const termEntries = Object.values(begrippen.terms || {}).filter((term) => term && term.deprecated !== true);
const needsCoverage = readJson('reports/json/needs-coverage.json');
const termsCoverage = readJson('reports/json/terms-coverage.json');
const migration = readJson('reports/json/unit-term-slug-migration.json');
const blueprint = readJson('reports/json/blueprint-flag-triage.json');
const cliCoverage = readJson('reports/json/reference-cli-coverage.json');

const unitsById = new Map(units.map((unit) => [unit.id, unit]));
const liveUnits = units.filter(isLive);

const emptyNeedsQueue = needsCoverage.issues.map((issue) => {
  const unit = unitsById.get(issue.affected_entity) || {};
  const zeroStatus = String(issue.category || '').split(':')[1] || 'unknown';
  const reviewed = Boolean(unit.zero_needs_review);
  const actionCategory = zeroStatus === 'underbouw_assumed' && reviewed
    ? 'reviewed_non_mutation'
    : 'review_before_mutation';
  return {
    unit_id: issue.affected_entity,
    unit_name: unit.name || null,
    severity: issue.severity,
    current_zero_needs_status: zeroStatus,
    has_zero_needs_review: reviewed,
    action_category: actionCategory,
    recommended_next_action: actionCategory === 'reviewed_non_mutation'
      ? 'No mutation proposed; preserve accepted foundational prior-knowledge classification.'
      : 'Human review must decide whether to add prerequisite edges, mark true zero, mark underbouw_assumed, or hold as unit-design issue.',
    mutation_authorized: false,
    evidence_path: issue.evidence_path,
  };
});

const missingTermQueue = termsCoverage.issues.map((issue) => {
  const unit = unitsById.get(issue.affected_entity) || {};
  const matches = candidateTerms(unit, termEntries);
  return {
    unit_id: issue.affected_entity,
    unit_name: unit.name || null,
    severity: issue.severity,
    action_category: 'term_link_review',
    candidate_term_matches: matches,
    recommended_next_action: matches.length
      ? 'Review candidate term matches; apply canonical term links through CLI only if confirmed.'
      : 'Review whether this unit needs canonical term links or an explicit not-applicable status/design note.',
    mutation_authorized: false,
    evidence_path: issue.evidence_path,
  };
});

const unresolvedTermQueue = (migration.unresolved_queue || []).map((item) => ({
  term: item.term,
  action_category: 'term_registry_review',
  recommended_next_action: item.next_action || 'Review whether the term belongs in begrippen.json.',
  possible_mutation_types_after_review: ['term_add', 'term_update', 'unit_terms_update', 'defer_as_authored_only'],
  mutation_authorized: false,
  evidence_path: 'reports/json/unit-term-slug-migration.json',
}));

const blueprintQueue = (blueprint.triage_records || []).map((record) => {
  const categoryMap = {
    still_needed: 'unit_creation_or_existing_merge_review',
    existing_unit_match: 'existing_unit_scope_review',
    duplicate: 'duplicate_no_mutation',
    defer: 'deferred',
  };
  return {
    flag_id: record.id,
    paragraph_id: record.paragraph_id,
    paragraph_title: record.paragraph_title,
    raw_flag: record.raw_flag,
    decision_category: record.decision_category,
    priority: record.priority,
    action_category: categoryMap[record.decision_category] || 'review_required',
    next_action: record.next_action,
    explicit_unit_ids_in_flag: record.evidence?.explicit_unit_ids_in_flag || [],
    best_existing_unit_matches: record.evidence?.best_existing_unit_matches || [],
    required_skills: record.evidence?.required_skills || [],
    target_exercise_snippet: truncate(record.evidence?.target_exercise_snippet || ''),
    mutation_authorized: false,
    evidence_path: 'reports/json/blueprint-flag-triage.json',
  };
});

const packet = {
  schema_version: '0.1',
  sprint_id: 'R4.4',
  packet_id: 'GATE-R4-micro-unit-quality',
  generated_on: new Date().toISOString(),
  generated_by: 'build-scripts/references/build-micro-unit-quality-packet.js',
  protected_reference_data_changed: false,
  mutation_authorized_by_this_packet: false,
  requires_human_review_before_mutation: true,
  recommended_next_sprint: 'R4.5',
  source_files: [
    'references/machine/micro-teaching-units.json',
    'references/machine/begrippen.json',
    'reports/json/needs-coverage.json',
    'reports/json/terms-coverage.json',
    'reports/json/unit-term-slug-migration.json',
    'reports/json/blueprint-flag-triage.json',
    'reports/json/reference-cli-coverage.json',
  ],
  summary: {
    live_units: liveUnits.length,
    empty_needs_total: emptyNeedsQueue.length,
    empty_needs_by_action_category: groupCount(emptyNeedsQueue, 'action_category'),
    missing_term_links_total: missingTermQueue.length,
    unresolved_unit_term_strings_total: unresolvedTermQueue.length,
    blueprint_flags_total: blueprintQueue.length,
    blueprint_flags_by_action_category: groupCount(blueprintQueue, 'action_category'),
    blueprint_flags_by_priority: groupCount(blueprintQueue, 'priority'),
    cli_overall_status: cliCoverage.summary?.overall_status || 'unknown',
  },
  queues: {
    empty_needs: emptyNeedsQueue,
    missing_term_links: missingTermQueue,
    unresolved_unit_term_strings: unresolvedTermQueue,
    blueprint_missing_unit_flags: blueprintQueue,
  },
  r4_5_scope_recommendation: {
    allowed_after_human_review: [
      'unit_dependency_add',
      'unit_dependency_remove',
      'zero_needs_review_fields',
      'unit_terms_update',
      'term_registry_update',
      'unit_add',
      'unit_deprecate',
      'unit_split_or_merge',
    ],
    not_allowed_without_new_review: [
      'broad graph rewiring',
      'syllabus-only unit minting',
      'hand edits to references/machine',
      'hand edits to references/external',
      'student diagnostics or adaptive routing',
    ],
  },
};

const reviewedNonMutation = emptyNeedsQueue.filter((item) => item.action_category === 'reviewed_non_mutation');
const needsReview = emptyNeedsQueue.filter((item) => item.action_category === 'review_before_mutation');
const blueprintStillNeeded = blueprintQueue.filter((item) => item.action_category === 'unit_creation_or_existing_merge_review');
const blueprintExisting = blueprintQueue.filter((item) => item.action_category === 'existing_unit_scope_review');

const md = [
  '# R4.4 Micro-Teaching Unit Quality Packet',
  '',
  `Generated: ${packet.generated_on}`,
  '',
  '## Status',
  '',
  '- Protected reference data changed: no',
  '- Machine mutations authorized by this packet: no',
  '- Human review required before R4.5 mutation: yes',
  '- Recommended next sprint: R4.5 Apply Reviewed Micro-Unit Corrections',
  '',
  '## Summary',
  '',
  `- Live units: ${packet.summary.live_units}`,
  `- Empty-needs units in current report: ${packet.summary.empty_needs_total}`,
  `- Empty-needs already reviewed as non-mutation/foundational: ${reviewedNonMutation.length}`,
  `- Empty-needs needing review before mutation: ${needsReview.length}`,
  `- Live units without term links: ${packet.summary.missing_term_links_total}`,
  `- Unresolved unit term strings: ${packet.summary.unresolved_unit_term_strings_total}`,
  `- Blueprint missing-unit flags in packet: ${packet.summary.blueprint_flags_total}`,
  `- Blueprint flags needing unit creation or merge review: ${blueprintStillNeeded.length}`,
  `- Blueprint existing-unit match reviews: ${blueprintExisting.length}`,
  `- CLI coverage status: ${packet.summary.cli_overall_status}`,
  '',
  '## Empty-Needs Queue',
  '',
  `Reviewed non-mutation units: ${reviewedNonMutation.map((item) => item.unit_id).join(', ') || 'none'}.`,
  '',
  `Needs review before mutation: ${needsReview.map((item) => `${item.unit_id} ${item.unit_name || ''}`.trim()).join('; ') || 'none'}.`,
  '',
  '## Missing Term Links',
  '',
  `Units without term links: ${missingTermQueue.map((item) => item.unit_id).join(', ') || 'none'}.`,
  '',
  'Candidate term matches are included in the JSON packet. They are suggestions for review only, not mutation approval.',
  '',
  '## Unresolved Unit Term Strings',
  '',
  unresolvedTermQueue.length
    ? unresolvedTermQueue.map((item) => `- ${item.term}: ${item.recommended_next_action}`).join('\n')
    : '- none',
  '',
  '## Blueprint Missing-Unit Flags',
  '',
  `By action category: ${JSON.stringify(packet.summary.blueprint_flags_by_action_category)}.`,
  '',
  'High-priority still-needed flags:',
  '',
  ...blueprintStillNeeded
    .filter((item) => item.priority === 'high')
    .slice(0, 20)
    .map((item) => `- ${item.flag_id} (${item.paragraph_id}): ${item.raw_flag}`),
  '',
  '## R4.5 Mutation Boundary',
  '',
  'R4.5 may only mutate items that are explicitly approved by human review of this packet or a follow-up decision record. All mutations must go through CLI. If validation fails, R4.5 must stop and report rather than patching machine references by hand.',
  '',
  '## Source Files',
  '',
  ...packet.source_files.map((file) => `- ${file}`),
  '',
].join('\n');

write(OUT_JSON, `${JSON.stringify(packet, null, 2)}\n`);
write(OUT_MD, md);

console.log(`OK R4.4 packet: ${path.relative(ROOT, OUT_JSON)}`);
console.log(`OK R4.4 packet: ${path.relative(ROOT, OUT_MD)}`);
