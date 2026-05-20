#!/usr/bin/env node
/**
 * Build CP.6c MTU backfill classification artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this script read-only for source references.
 * - Add later review evidence to references/data/sprints or governed overlays;
 *   do not write back to references/machine here.
 * - If CP-6 human decisions change, update the classification categories and
 *   validator together.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const GENERATED_ON = '2026-05-20';

const REF_CT1 = 'references/data/sprints/REF-CT1-year1-coverage.json';
const CP6B = 'references/data/sprints/CP.6b-target-exercise-review.json';
const UNITS = 'references/machine/micro-teaching-units.json';
const D04_STATUS = 'references/data/unit-design-status/unit-design-status-overlay.json';
const OUTPUT_JSON = 'references/data/sprints/CP.6c-mtu-backfill-classification.json';
const OUTPUT_MD = 'reports/reference-planning/CP.6c-mtu-backfill-classification.md';

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function writeJson(relPath, data) {
  fs.writeFileSync(path.join(ROOT, relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.writeFileSync(path.join(ROOT, relPath), text);
}

function git(command, cwd = ROOT) {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_error) {
    return 'unavailable';
  }
}

function sortFlags(flags) {
  return flags.slice().sort((a, b) => a.record_id.localeCompare(b.record_id, undefined, { numeric: true }));
}

const classifications = {
  'missing_flag:1.1.3:1': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A45'],
    supporting_unit_ids: ['A38'],
    rationale:
      'The live registry already contains A45, whose kern and procedure exactly cover drawing a P-Q graph from table values with P vertical and Q horizontal.',
    next_action:
      'Use A45 as the mapping during later target-exercise review. CP.6d/CP.6e still need graph-heavy evidence and Part A closure before CP-6 closure.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.1.3:2': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A46'],
    supporting_unit_ids: ['A45', 'A38'],
    rationale:
      'The live registry already contains A46 for reading values and interpolating in a P-Q graph, with A45 as the graph-construction prerequisite.',
    next_action:
      'Use A46 as the mapping during later target-exercise review. CP.6e still needs to clear or explicitly fail the 1.1.3 Part A flag.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.2.2:1': {
    classification: 'merge_candidate',
    mapped_unit_ids: [],
    supporting_unit_ids: ['A17', 'D11', 'D33'],
    deprecated_context_unit_ids: ['D04'],
    rationale:
      'The concept is present in successor income-elasticity units A17 and D11, while D33 covers demand-shift factors. The old standalone D04 record is deprecated and must not be revived. A later design review should decide whether the Year-1 pre-elasticity version is handled by successor-unit wording, a paragraph-level note, or a governed split.',
    next_action:
      'Route to target-exercise and unit-design review if final Year-1 coverage keeps normal/inferior goods before formal income elasticity. Do not add a D04 edge or revive D04.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.2.3:1': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A47'],
    supporting_unit_ids: ['A46'],
    rationale:
      'The live registry already contains A47 for calculating collective demand by adding individual demanded quantities at the same price.',
    next_action:
      'Use A47 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.2.3:2': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A48'],
    supporting_unit_ids: ['A03', 'A47'],
    rationale:
      'The live registry already contains A48 for algebraic horizontal summation of linear individual demand functions at equal price.',
    next_action:
      'Use A48 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.2.3:3': {
    classification: 'defer_candidate',
    mapped_unit_ids: [],
    supporting_unit_ids: ['A47', 'A48'],
    rationale:
      'The active target-exercise difficulty note says the kink can be mentioned but is not essential. A47/A48 cover the main horizontal-sum operation; the kink/price-range edge case should not force immediate unit mutation before a final target-exercise review decides whether to retain it.',
    next_action:
      'Defer. If later reviewed target exercises retain the kink as required performance, review whether A48 needs a governed procedure refinement for valid price ranges or piecewise demand.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.3.1:1': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A49'],
    supporting_unit_ids: ['A45'],
    rationale:
      'The live registry already contains A49 for drawing an upward-sloping supply curve with economist axes and a supply/S label.',
    next_action:
      'Use A49 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.3.2:1': {
    classification: 'existing_unit_mapping',
    mapped_unit_ids: ['A51'],
    supporting_unit_ids: ['A06'],
    rationale:
      'The live registry already contains A51 for determining overschot/tekort at a non-equilibrium price and calculating the difference between Qa and Qv.',
    next_action:
      'Use A51 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.',
    later_cli_mutation_candidate: false,
  },
  'missing_flag:1.3.3:1': {
    classification: 'true_missing_unit',
    mapped_unit_ids: [],
    supporting_unit_ids: ['A06', 'A42', 'D10', 'D13', 'D32', 'D33'],
    candidate_future_unit_concept:
      'Reason about simultaneous demand and supply shifts, distinguishing determinate and ambiguous effects on equilibrium price and quantity.',
    rationale:
      'Existing units cover equilibrium solving, single-curve shifts, and specific supply/demand shock reasoning, but no live unit explicitly teaches the simultaneous-shift answer operation where one equilibrium direction is determinate and the other is ambiguous without magnitudes.',
    next_action:
      'Prepare a later bounded review before any CLI mutation. If confirmed, mint or adjust the operation through governed scripts only; CP.6c does not authorize that mutation.',
    later_cli_mutation_candidate: true,
  },
};

function unitLookup(units) {
  const list = units.units || units.micro_teaching_units || units;
  return new Map(list.map((unit) => [unit.id, unit]));
}

function unitSummary(unit) {
  if (!unit) return null;
  return {
    id: unit.id,
    name: unit.name,
    deprecated: Boolean(unit.deprecated),
    deprecated_in_favor_of: unit.deprecated_in_favor_of || [],
    needs: unit.needs || [],
    mastery_target: unit.mastery_target || null,
    aspects: unit.aspects || [],
    kern: unit.kern || '',
  };
}

function classifyFlag(flag, unitsById) {
  const decision = classifications[flag.record_id];
  if (!decision) {
    throw new Error(`No CP.6c classification configured for ${flag.record_id}`);
  }

  const mappedUnits = (decision.mapped_unit_ids || []).map((id) => unitSummary(unitsById.get(id)));
  const supportingUnits = (decision.supporting_unit_ids || []).map((id) => unitSummary(unitsById.get(id)));
  const deprecatedContextUnits = (decision.deprecated_context_unit_ids || []).map((id) => unitSummary(unitsById.get(id)));

  return {
    record_id: flag.record_id,
    paragraph_id: flag.paragraph_id,
    paragraph_label: flag.label,
    source_flag: flag.flag,
    source_required_skills: flag.required_skills || [],
    source_classification: flag.classification,
    cp6c_classification: decision.classification,
    mapped_unit_ids: decision.mapped_unit_ids || [],
    supporting_unit_ids: decision.supporting_unit_ids || [],
    deprecated_context_unit_ids: decision.deprecated_context_unit_ids || [],
    mapped_units: mappedUnits,
    supporting_units: supportingUnits,
    deprecated_context_units: deprecatedContextUnits,
    candidate_future_unit_concept: decision.candidate_future_unit_concept || null,
    rationale: decision.rationale,
    next_action: decision.next_action,
    mutation_authorized_now: false,
    protected_reference_mutation_authorized_now: false,
    later_cli_mutation_candidate: Boolean(decision.later_cli_mutation_candidate),
    may_count_as_cp6_closure_evidence_now: false,
  };
}

function countBy(records, field) {
  return records.reduce((acc, record) => {
    acc[record[field]] = (acc[record[field]] || 0) + 1;
    return acc;
  }, {});
}

function markdownFor(data) {
  const rows = data.classifications
    .map((record) => {
      const mapped = record.mapped_unit_ids.length ? record.mapped_unit_ids.join(', ') : 'none';
      const supporting = record.supporting_unit_ids.length ? record.supporting_unit_ids.join(', ') : 'none';
      return `| ${record.record_id} | ${record.paragraph_id} | ${record.cp6c_classification} | ${mapped} | ${supporting} | ${record.later_cli_mutation_candidate ? 'yes, later review only' : 'no'} |`;
    })
    .join('\n');

  const details = data.classifications
    .map((record) => {
      const mapped = record.mapped_units.length
        ? record.mapped_units.map((unit) => `- ${unit.id} ${unit.name}: ${unit.kern}`).join('\n')
        : '- none';
      const supporting = record.supporting_units.length
        ? record.supporting_units.map((unit) => `- ${unit.id} ${unit.name}: ${unit.kern}`).join('\n')
        : '- none';
      const deprecated = record.deprecated_context_units.length
        ? `\nDeprecated context:\n\n${record.deprecated_context_units.map((unit) => `- ${unit.id} ${unit.name}: deprecated=${unit.deprecated}; replacements=${unit.deprecated_in_favor_of.join(', ')}`).join('\n')}\n`
        : '';
      const future = record.candidate_future_unit_concept
        ? `\nCandidate future unit concept: ${record.candidate_future_unit_concept}\n`
        : '';
      return `### ${record.record_id} - ${record.paragraph_label}

Source flag: ${record.source_flag}

Classification: \`${record.cp6c_classification}\`

Mapped units:

${mapped}

Supporting units:

${supporting}${deprecated}${future}
Rationale: ${record.rationale}

Next action: ${record.next_action}

Mutation authorized now: no
`;
    })
    .join('\n');

  return `# CP.6c Year-1 MTU Backfill Classification

Generated: ${data.generated_on}

Status: ${data.status}

CP-6 not closed. Year 1 not closed. No protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, lesson-output mutation, or student-facing/product authorization occurred.

## Summary

| Metric | Count |
|---|---:|
| REF-CT1 Year-1 backfill candidates classified | ${data.summary.candidate_count} |
| Existing-unit mappings | ${data.summary.by_classification.existing_unit_mapping || 0} |
| True missing units | ${data.summary.by_classification.true_missing_unit || 0} |
| Merge candidates | ${data.summary.by_classification.merge_candidate || 0} |
| Defer candidates | ${data.summary.by_classification.defer_candidate || 0} |
| Mutations authorized now | ${data.summary.mutations_authorized_now_count} |

## Classification Table

| Candidate | Paragraph | Classification | Mapped units | Supporting units | Later CLI candidate |
|---|---|---|---|---|---|
${rows}

## Decision

CP.6c classifies the nine REF-CT1 backfill candidates against the current live MTU registry. Six candidates already map to explicit live units, one is a merge/design candidate around the retired D04 successor cluster, one is deferred until target-exercise review decides whether the kink remains required, and one is a true missing simultaneous-shift reasoning operation for later review.

This sprint does not authorize mutation. The next operational sprint remains \`${data.next_operational_sprint}\`.

## Detailed Classifications

${details}

## Blocked Outcomes

${data.blocked_outcomes.map((item) => `- ${item}`).join('\n')}

## Next Operational Step

Proceed to \`${data.next_operational_sprint} Book 1 Graph-Heavy Evidence Upgrade\`. Do not draft a CP-6 closure proposal yet.
`;
}

const refCt1 = readJson(REF_CT1);
const cp6b = readJson(CP6B);
const units = readJson(UNITS);
const d04Status = readJson(D04_STATUS);
const unitsById = unitLookup(units);

const flags = sortFlags(refCt1.missing_flags || []);
const records = flags.map((flag) => classifyFlag(flag, unitsById));

const data = {
  schema_version: 1,
  sprint_id: 'CP.6c',
  generated_on: GENERATED_ON,
  generated_by: 'build-scripts/references/build-cp6c-mtu-backfill-classification.js',
  status: 'mtu_backfill_classification_recorded_not_mutating',
  authority_level: 'non_mutating_year1_mtu_backfill_classification',
  cp6_closed: false,
  year1_closed: false,
  protected_reference_data_changed: false,
  lesson_output_changed: false,
  target_exercise_promotions: false,
  placeholder_finalization: false,
  unit_minting: false,
  machine_registry_mutation: false,
  no_protected_mutation_authorized: true,
  no_lesson_output_mutation_authorized: true,
  no_target_exercise_promotion_authorized: true,
  no_placeholder_finalization_authorized: true,
  no_unit_minting_authorized: true,
  no_cli_mutation_authorized: true,
  source_paths: {
    ref_ct1: REF_CT1,
    cp6b: CP6B,
    units: UNITS,
    d04_status: D04_STATUS,
  },
  repository_state: {
    platform_head_before_cp6c_commit: git('git rev-parse HEAD'),
    lesson_head_at_generation: git('git -C ..\\4veco-lessen rev-parse HEAD'),
  },
  source_evidence: {
    ref_ct1_missing_flag_count: flags.length,
    cp6b_next_operational_sprint: cp6b.next_operational_sprint || null,
    d04_status_records_seen: Array.isArray(d04Status.records) ? d04Status.records.length : 'unavailable',
  },
  summary: {
    candidate_count: records.length,
    by_classification: countBy(records, 'cp6c_classification'),
    mutations_authorized_now_count: records.filter((record) => record.mutation_authorized_now).length,
    later_cli_mutation_candidate_count: records.filter((record) => record.later_cli_mutation_candidate).length,
    existing_live_unit_mapping_count: records.filter((record) => record.cp6c_classification === 'existing_unit_mapping').length,
  },
  classifications: records,
  remaining_blockers: [
    'CP.6d must upgrade graph-heavy evidence before graph/table-heavy records support CP-6 closure.',
    'CP.6e must clear or explicitly fail the remaining 1.1.3 Part A FLAG before unconditioned CP-6 closure.',
    'CP.6b target-exercise records remain non-final until later teacher/review artifacts and governed registry procedures exist.',
    'The simultaneous-shift true missing candidate needs later review before any CLI-backed mutation sprint.',
  ],
  blocked_outcomes: [
    'protected reference mutation',
    'lesson output mutation',
    'target-exercise promotion',
    'placeholder replacement',
    'placeholder finalization',
    'unit minting',
    'machine registry mutation',
    'CLI mutation authorization',
    'CP-6 closure',
    'Year-1 closure',
    'student diagnostics',
    'adaptive routing',
    'mastery decisions',
    'automatic sequencing',
    'student-facing AI',
    'summative use',
    'PV projection',
    'PV machine promotion',
    'student-facing generated output',
  ],
  next_operational_sprint: 'CP.6d',
};

writeJson(OUTPUT_JSON, data);
writeText(OUTPUT_MD, markdownFor(data));

console.log(`Wrote ${OUTPUT_JSON}`);
console.log(`Wrote ${OUTPUT_MD}`);
