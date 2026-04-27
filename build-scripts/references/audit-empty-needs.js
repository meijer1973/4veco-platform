#!/usr/bin/env node
/**
 * Non-mutating audit for units with empty `needs`.
 *
 * This script proposes review classifications only. It never edits
 * references/machine/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const OUT_JSON = 'references/data/audits/empty-needs-audit.json';
const OUT_MD = 'reports/reference-audits/empty-needs-audit.md';

const KNOWN_RECOMMENDATIONS = {
  A16: ['A15'],
  A17: ['A15'],
  A43: ['A10', 'A38'],
  D04: ['A15'],
  D06: ['A15'],
  D10: ['D01', 'D03'],
  D13: ['D03'],
  D16: ['D34'],
  D32: ['D01', 'D03'],
  H13: ['D13'],
  H14: ['I14'],
  H16: ['L10'],
  I04: ['L17', 'L19'],
  I10: ['L19'],
  L09: ['L05', 'L03'],
  L17: ['D16'],
  L19: ['L09'],
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8'));
}

function write(relPath, text) {
  const full = path.join(REPO_ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function isDeprecated(unit) {
  return unit.deprecated === true || unit.status === 'deprecated';
}

function domainOf(unit) {
  return unit.domain || unit.id.slice(0, 1);
}

function classify(unit) {
  const domain = domainOf(unit);
  const mastery = unit.mastery_target || unit.mastery || 'unknown';
  const layer = Number(unit.layer || 0);
  const recommended = KNOWN_RECOMMENDATIONS[unit.id] || [];

  if (recommended.length) {
    return {
      recommended_status: 'false_zero',
      recommended_needs: recommended,
      severity: mastery === 'understand' ? 'medium' : 'high',
      rationale: `Machine audit found likely hidden prerequisite(s): ${recommended.join(', ')}.`,
      human_question: `Should ${unit.id} depend on ${recommended.join(', ')}, or should the prerequisite be represented differently?`,
    };
  }

  if (domain === 'A' && layer <= 1) {
    return {
      recommended_status: 'underbouw_assumed',
      recommended_needs: [],
      severity: 'low',
      rationale: 'A-domain foundational math/skill unit can plausibly rely on lower-school or general mathematical prior knowledge rather than platform prerequisites.',
      human_question: null,
    };
  }

  if (layer === 0 || unit.id === 'B01') {
    return {
      recommended_status: 'true_zero',
      recommended_needs: [],
      severity: 'low',
      rationale: 'Layer-0 or foundational concept with no obvious internal platform prerequisite.',
      human_question: null,
    };
  }

  if (mastery === 'apply' || mastery === 'analyze' || mastery === 'evaluate' || layer >= 2) {
    return {
      recommended_status: 'ambiguous',
      recommended_needs: [],
      severity: layer >= 3 ? 'high' : 'medium',
      rationale: 'Non-foundational unit has empty needs but no deterministic prerequisite recommendation from the machine audit.',
      human_question: `Which internal prerequisite(s), if any, should ${unit.id} require?`,
    };
  }

  return {
    recommended_status: 'ambiguous',
    recommended_needs: [],
    severity: 'medium',
    rationale: 'Empty-needs status needs reviewer judgement.',
    human_question: `Should ${unit.id} remain zero-needs or receive internal prerequisites?`,
  };
}

function summarize(entries) {
  const byStatus = {};
  const bySeverity = {};
  const byDomain = {};
  for (const entry of entries) {
    byStatus[entry.recommended_status] = (byStatus[entry.recommended_status] || 0) + 1;
    bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    const domain = entry.unit_id.slice(0, 1);
    byDomain[domain] = (byDomain[domain] || 0) + 1;
  }
  return { by_status: byStatus, by_severity: bySeverity, by_domain: byDomain };
}

function renderMarkdown(audit) {
  const rows = audit.entries.map((entry) =>
    `| ${entry.unit_id} | ${entry.unit_name} | ${entry.layer} | ${entry.mastery_target} | ${entry.recommended_status} | ${entry.severity} | ${entry.recommended_needs.join(', ') || '-'} |`
  ).join('\n');

  return `# Empty-Needs Audit

Generated: ${audit.generated_at}
Sprint: ${audit.sprint_id}
Source: \`${UNITS_PATH}\`

## Status

Non-mutating audit. No machine-reference data was changed.

## Summary

- Live units: ${audit.live_unit_count}
- Units with empty needs: ${audit.empty_needs_count}
- Status distribution: ${Object.entries(audit.summary.by_status).map(([k, v]) => `${k}=${v}`).join(', ')}
- Severity distribution: ${Object.entries(audit.summary.by_severity).map(([k, v]) => `${k}=${v}`).join(', ')}

## Review Table

| Unit | Name | Layer | Mastery | Recommended status | Severity | Recommended needs |
|---|---|---:|---|---|---|---|
${rows}

## Review Rule

These are machine-suggested classifications for review. They are not accepted dependency changes. Human review is required before applying any \`false_zero\` recommendation to \`references/machine/\`.
`;
}

function main() {
  const units = readJson(UNITS_PATH);
  const live = units.filter((unit) => !isDeprecated(unit));
  const entries = live
    .filter((unit) => (unit.needs || []).length === 0)
    .map((unit) => {
      const decision = classify(unit);
      return {
        unit_id: unit.id,
        unit_name: unit.name || unit.titel || '',
        layer: unit.layer || 0,
        mastery_target: unit.mastery_target || unit.mastery || 'unknown',
        current_needs: [],
        assumed_prior_knowledge: decision.recommended_status === 'underbouw_assumed'
          ? ['lower-secondary mathematics or general reasoning']
          : [],
        ...decision,
        review_status: 'machine_suggested',
        evidence_paths: [UNITS_PATH],
      };
    });

  const audit = {
    schema_version: '0.1',
    sprint_id: 'R2.1',
    generated_at: new Date().toISOString(),
    source_path: UNITS_PATH,
    live_unit_count: live.length,
    empty_needs_count: entries.length,
    summary: summarize(entries),
    entries,
  };

  write(OUT_JSON, `${JSON.stringify(audit, null, 2)}\n`);
  write(OUT_MD, renderMarkdown(audit));
  console.log(`OK empty-needs audit: ${entries.length} units`);
  console.log(`JSON: ${OUT_JSON}`);
  console.log(`Markdown: ${OUT_MD}`);
}

if (require.main === module) main();
