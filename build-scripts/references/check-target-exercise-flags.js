#!/usr/bin/env node
/**
 * check-target-exercise-flags.js
 *
 * Non-mutating R4.3 checker. Reads raw `missing_units_flagged` entries from
 * course-target-exercises.json and writes a curated triage backlog. The
 * output is a decision queue, not a unit mutation.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TARGETS_JSON = path.join(REPO_ROOT, 'references/authored/course-target-exercises.json');
const UNITS_JSON = path.join(REPO_ROOT, 'references/machine/micro-teaching-units.json');
const REPORT_MD = path.join(REPO_ROOT, 'reports/blueprint-flag-triage.md');
const REPORT_JSON = path.join(REPO_ROOT, 'reports/json/blueprint-flag-triage.json');

const STOPWORDS = new Set([
  'aan', 'als', 'and', 'are', 'as', 'bij', 'by', 'de', 'een', 'en', 'for', 'from',
  'het', 'in', 'is', 'met', 'of', 'on', 'op', 'or', 'the', 'to', 'uit', 'van',
  'voor', 'why', 'with', 'zonder',
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function snippet(value, max = 240) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 3).trimEnd() + '...';
}

function exercisePromptSnippet(exercise) {
  const parts = [];
  if (exercise.target_exercise && exercise.target_exercise.context) {
    parts.push(exercise.target_exercise.context);
  }
  for (const sub of (exercise.target_exercise && exercise.target_exercise.subquestions) || []) {
    parts.push(`${sub.label}. ${sub.prompt}`);
  }
  return snippet(parts.join(' '), 420);
}

function unitHaystack(unit) {
  return [
    unit.id,
    unit.name,
    unit.kern,
    ...(unit.terms || []),
    ...(unit.procedure || []),
  ].join(' ');
}

function bestUnitMatches(flag, units) {
  const flagTokens = new Set(tokens(flag));
  const scored = [];
  for (const unit of units) {
    const unitTokens = new Set(tokens(unitHaystack(unit)));
    let overlap = 0;
    for (const token of flagTokens) if (unitTokens.has(token)) overlap++;
    const score = flagTokens.size === 0 ? 0 : overlap / Math.max(4, Math.min(flagTokens.size, 14));
    if (score > 0) scored.push({ id: unit.id, name: unit.name, score: Number(score.toFixed(3)) });
  }
  return scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, 5);
}

function explicitUnitIds(flag, unitIds) {
  return [...new Set((flag.match(/\b[A-L]\d{2}\b/g) || []).filter((id) => unitIds.has(id)))];
}

function semanticDuplicateKey(flag) {
  const norm = normalize(flag);
  if (/\bmo\b/.test(norm) && /\bp\b/.test(norm) && /(constant|price taker|prijsnemer|volkomen concurrentie)/.test(norm)) {
    return 'mo-equals-p-price-taker';
  }
  return null;
}

function classifyFlag({ flag, seen, seenSemantic, matches, explicitIds }) {
  const norm = normalize(flag);
  const lower = flag.toLowerCase();
  const best = matches[0] || { score: 0 };
  const semanticKey = semanticDuplicateKey(flag);

  if (seen.has(norm)) {
    return {
      decision_category: 'duplicate',
      handoff_status: 'duplicate',
      priority: 'low',
      next_action: 'merge_with_existing_triage_record',
      rationale: 'Exact normalized duplicate of an earlier raw flag.',
    };
  }

  if (semanticKey && seenSemantic.has(semanticKey)) {
    return {
      decision_category: 'duplicate',
      handoff_status: 'duplicate',
      priority: 'low',
      next_action: 'merge_with_existing_triage_record',
      rationale: `Semantic duplicate of earlier flag cluster ${semanticKey}.`,
    };
  }

  const overlapLanguage = /(covers|covered by|registered as|verify|close|overlap|partly covered|partial overlap)/i.test(flag);
  const saysNotCovered = /(not this specific|not cleanly|not the conceptual distinction|but not)/i.test(flag);
  if (explicitIds.length > 0 && overlapLanguage && !saysNotCovered) {
    return {
      decision_category: 'existing_unit_match',
      handoff_status: 'minted',
      priority: 'medium',
      next_action: 'review_existing_unit_scope',
      rationale: `Raw flag explicitly references existing unit ${explicitIds.join(', ')} and asks for scope verification rather than a new unit.`,
    };
  }

  if (best.score >= 0.75 && !saysNotCovered) {
    return {
      decision_category: 'existing_unit_match',
      handoff_status: 'minted',
      priority: 'medium',
      next_action: 'review_existing_unit_match',
      rationale: `High lexical match to existing unit ${best.id}.`,
    };
  }

  if (/(standpuntbepaling|integration|integratie|payoff|breadth|diagnostic|reversed-sign|good diagnostic|balanced|evaluate)/i.test(flag)) {
    return {
      decision_category: 'defer',
      handoff_status: 'defer',
      priority: 'low',
      next_action: 'keep_for_later_integration_or_verbal-design_review',
      rationale: 'Target-exercise backed, but best treated as later integration, verbal, or diagnostic refinement rather than immediate unit creation.',
    };
  }

  if (/(A-domain candidate|reken skill|compute|calculate|draw|read|determine|invert|differentiate|build|herleid|apply|execute|construct|approximate)/i.test(flag)) {
    return {
      decision_category: 'still_needed',
      handoff_status: 'still_needed',
      priority: best.score >= 0.5 ? 'medium' : 'high',
      next_action: 'review_for_cli_unit_creation_or_existing_A_domain_merge',
      rationale: 'Concrete target-exercise procedure or calculation flag with no high-confidence existing unit match.',
    };
  }

  if (/(concept-level|concept|verbal|state|name|explain|recognise|distinguish|classify|argue|compare|contrast|define|characterise)/i.test(flag)) {
    return {
      decision_category: 'still_needed',
      handoff_status: 'still_needed',
      priority: 'medium',
      next_action: 'review_for_concept_unit_or_merge_with_existing_unit',
      rationale: 'Target-exercise backed concept flag with no high-confidence existing unit match.',
    };
  }

  return {
    decision_category: 'needs_evidence',
    handoff_status: 'needs_evidence',
    priority: 'low',
    next_action: 'inspect_target_exercise_before_unit_decision',
    rationale: 'The raw flag is not specific enough for deterministic unit decision.',
  };
}

function main() {
  const targets = readJson(TARGETS_JSON);
  const exercises = targets.exercises || [];
  const units = readJson(UNITS_JSON).filter((unit) => !unit.deprecated);
  const unitIds = new Set(units.map((unit) => unit.id));

  const records = [];
  const seen = new Set();
  const seenSemantic = new Set();
  let rawFlagCount = 0;
  let exercisesWithFlags = 0;

  for (const exercise of exercises) {
    const flags = exercise.missing_units_flagged || [];
    if (flags.length > 0) exercisesWithFlags++;
    flags.forEach((flag, index) => {
      rawFlagCount++;
      const matches = bestUnitMatches(flag, units);
      const explicitIds = explicitUnitIds(flag, unitIds);
      const semanticKey = semanticDuplicateKey(flag);
      const classification = classifyFlag({ flag, seen, seenSemantic, matches, explicitIds });
      seen.add(normalize(flag));
      if (semanticKey) seenSemantic.add(semanticKey);
      records.push({
        id: `${exercise.id}:flag-${index + 1}`,
        paragraph_id: exercise.id,
        paragraph_title: exercise.paragraph_title,
        source_ref: exercise.source_ref,
        raw_flag: flag,
        decision_category: classification.decision_category,
        handoff_status: classification.handoff_status,
        priority: classification.priority,
        next_action: classification.next_action,
        rationale: classification.rationale,
        evidence: {
          target_exercise_snippet: exercisePromptSnippet(exercise),
          required_skills: exercise.required_skills || [],
          new_skills_introduced: exercise.new_skills_introduced || [],
          prior_knowledge_assumed: exercise.prior_knowledge_assumed || [],
          explicit_unit_ids_in_flag: explicitIds,
          best_existing_unit_matches: matches,
        },
      });
    });
  }

  const byDecision = {};
  const byPriority = {};
  const byAction = {};
  for (const record of records) {
    byDecision[record.decision_category] = (byDecision[record.decision_category] || 0) + 1;
    byPriority[record.priority] = (byPriority[record.priority] || 0) + 1;
    byAction[record.next_action] = (byAction[record.next_action] || 0) + 1;
  }

  if (records.length !== rawFlagCount) {
    console.error(`ERROR expected ${rawFlagCount} triage records, got ${records.length}`);
    process.exit(1);
  }

  const json = {
    schema_version: '0.1',
    sprint_id: 'R4.3',
    generated_on: new Date().toISOString().slice(0, 10),
    source: 'references/authored/course-target-exercises.json',
    exercise_count: exercises.length,
    exercises_with_flags: exercisesWithFlags,
    raw_flag_count: rawFlagCount,
    unique_raw_flags: new Set(records.map((record) => normalize(record.raw_flag))).size,
    summary: {
      by_decision_category: byDecision,
      by_priority: byPriority,
      by_next_action: byAction,
    },
    triage_records: records,
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(json, null, 2) + '\n');

  const lines = [];
  lines.push('# Blueprint Flag Triage');
  lines.push('');
  lines.push(`Generated: ${json.generated_on}`);
  lines.push(`Target exercises: ${json.exercise_count}`);
  lines.push(`Exercises with flags: ${json.exercises_with_flags}`);
  lines.push(`Raw flags: ${json.raw_flag_count}`);
  lines.push(`Unique raw flags: ${json.unique_raw_flags}`);
  lines.push('');
  lines.push('## Summary By Decision');
  lines.push('');
  for (const [category, count] of Object.entries(byDecision).sort()) {
    lines.push(`- ${category}: ${count}`);
  }
  lines.push('');
  lines.push('## Summary By Priority');
  lines.push('');
  for (const [priority, count] of Object.entries(byPriority).sort()) {
    lines.push(`- ${priority}: ${count}`);
  }
  lines.push('');
  lines.push('## Triage Records');
  lines.push('');
  for (const record of records) {
    lines.push(`### ${record.id}`);
    lines.push('');
    lines.push(`- decision: ${record.decision_category}`);
    lines.push(`- handoff_status: ${record.handoff_status}`);
    lines.push(`- priority: ${record.priority}`);
    lines.push(`- next action: ${record.next_action}`);
    lines.push(`- source: ${record.source_ref}`);
    lines.push(`- paragraph: ${record.paragraph_id} ${record.paragraph_title}`);
    lines.push(`- raw flag: ${record.raw_flag}`);
    lines.push(`- rationale: ${record.rationale}`);
    lines.push(`- current required skills: [${record.evidence.required_skills.join(', ')}]`);
    lines.push(`- best existing matches: ${record.evidence.best_existing_unit_matches.map((match) => `${match.id} (${match.score})`).join(', ') || 'none'}`);
    lines.push(`- target exercise: ${record.evidence.target_exercise_snippet}`);
    lines.push('');
  }

  fs.writeFileSync(REPORT_MD, lines.join('\n').replace(/\n+$/g, '') + '\n');
  console.log(`OK  ${records.length}/${rawFlagCount} target-exercise flag(s) triaged. Report: ${path.relative(REPO_ROOT, REPORT_MD)}`);
}

if (require.main === module) main();

module.exports = { main, classifyFlag, bestUnitMatches };
