#!/usr/bin/env node
/**
 * check-mtu-evidence-layer.js
 *
 * Read-only freshness check for the MTU evidence layer. It verifies that the
 * canonical markdown registry projects to the committed JSON companion and
 * that full-catalog generated reports agree on current MTU counts.
 */

const fs = require('fs');
const path = require('path');

const {
  parseMarkdown,
  validate,
  computeLayers,
  buildJsonEntry,
  sortUnits,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

const PATHS = {
  unitsMd: 'references/machine/micro-teaching-units.md',
  unitsJson: 'references/machine/micro-teaching-units.json',
  emptyNeedsAudit: 'references/data/audits/empty-needs-audit.json',
  rx6GeneratorBlock: 'references/data/sprints/RX.6-generator-blocked-units.json',
  dagIntegrity: 'reports/json/dag-integrity.json',
  needsCoverage: 'reports/json/needs-coverage.json',
  termsCoverage: 'reports/json/terms-coverage.json',
  procedureCoverage: 'reports/json/procedure-coverage.json',
  aspectsCoverage: 'reports/json/aspects-coverage.json',
  deadUnits: 'reports/json/dead-units.json',
  emptyNeedsSummary: 'reports/json/empty-needs-audit-summary.json',
  referenceHealth: 'reports/json/reference-health.json',
  skilltreeReadiness: 'reports/json/skilltree-generator-readiness.json',
  procedureVisualCoverage: 'reports/json/procedure-visual-coverage.json',
};

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readText(relPath) {
  const full = repoPath(relPath);
  if (!fs.existsSync(full)) throw new Error(`missing ${relPath}`);
  return fs.readFileSync(full, 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function getPath(object, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => (
    value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined
  ), object);
}

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} MTU evidence-layer validation error(s).`);
  process.exit(1);
}

function expectEqual(errors, label, actual, expected) {
  if (actual !== expected) {
    errors.push(`${label}: expected ${expected}, found ${actual}`);
  }
}

function checkReportFields(errors, relPath, expectedFields) {
  const report = readJson(relPath);
  for (const [fieldPath, expected] of Object.entries(expectedFields)) {
    expectEqual(errors, `${relPath}.${fieldPath}`, getPath(report, fieldPath), expected);
  }
  return report;
}

function buildCurrentProjection(errors) {
  const markdown = readText(PATHS.unitsMd);
  const parsed = parseMarkdown(markdown);
  const { errors: validationErrors, byId } = validate(parsed, {
    terms: loadTerminology(),
    eindtermen: loadEindtermen(),
  });
  if (validationErrors.length > 0) {
    for (const error of validationErrors) errors.push(`${PATHS.unitsMd}: ${error}`);
    return null;
  }

  computeLayers(parsed, byId);
  const projected = sortUnits(parsed).map(buildJsonEntry);
  const stored = readJson(PATHS.unitsJson);
  if (stableJson(projected) !== stableJson(stored)) {
    errors.push(`${PATHS.unitsJson} is stale; regenerate with node build-scripts/references/build-unit-index.js`);
  }
  return projected;
}

function main() {
  const errors = [];
  const units = buildCurrentProjection(errors);
  if (!units) fail(errors);

  const liveUnits = units.filter((unit) => !unit.deprecated);
  const deprecatedUnits = units.filter((unit) => unit.deprecated);
  const activeADomainUnits = liveUnits.filter((unit) => /^A\d+/.test(unit.id));
  const emptyNeedsUnits = liveUnits.filter((unit) => !Array.isArray(unit.needs) || unit.needs.length === 0);

  checkReportFields(errors, PATHS.dagIntegrity, {
    'summary.units': units.length,
    'summary.live_units': liveUnits.length,
    'summary.deprecated_units': deprecatedUnits.length,
  });

  for (const relPath of [
    PATHS.needsCoverage,
    PATHS.termsCoverage,
    PATHS.procedureCoverage,
    PATHS.aspectsCoverage,
    PATHS.deadUnits,
  ]) {
    checkReportFields(errors, relPath, {
      'summary.live_units': liveUnits.length,
    });
  }

  checkReportFields(errors, PATHS.emptyNeedsAudit, {
    live_unit_count: liveUnits.length,
    empty_needs_count: emptyNeedsUnits.length,
  });

  const audit = readJson(PATHS.emptyNeedsAudit);
  expectEqual(errors, `${PATHS.emptyNeedsAudit}.entries.length`, (audit.entries || []).length, emptyNeedsUnits.length);

  checkReportFields(errors, PATHS.emptyNeedsSummary, {
    'summary.live_unit_count': liveUnits.length,
    'summary.empty_needs_count': emptyNeedsUnits.length,
  });

  checkReportFields(errors, PATHS.procedureVisualCoverage, {
    'summary.live_unit_count': liveUnits.length,
  });

  const skilltree = checkReportFields(errors, PATHS.skilltreeReadiness, {
    'summary.active_a_domain_count': activeADomainUnits.length,
  });
  const skilltreeSummary = skilltree.summary || {};
  expectEqual(
    errors,
    `${PATHS.skilltreeReadiness}.summary.interactive_plus_blocked`,
    (skilltreeSummary.interactive_skill_count || 0) + (skilltreeSummary.generator_blocked_count || 0),
    activeADomainUnits.length
  );
  expectEqual(
    errors,
    `${PATHS.skilltreeReadiness}.summary.explicit_generator_block_count`,
    skilltreeSummary.explicit_generator_block_count,
    skilltreeSummary.generator_blocked_count
  );

  checkReportFields(errors, PATHS.rx6GeneratorBlock, {
    unit_count: skilltreeSummary.generator_blocked_count,
  });

  const referenceHealth = checkReportFields(errors, PATHS.referenceHealth, {
    'unit_counts.total': units.length,
    'unit_counts.live': liveUnits.length,
    'unit_counts.deprecated': deprecatedUnits.length,
    'skilltree_generator_readiness.active_a_domain_count': activeADomainUnits.length,
    'skilltree_generator_readiness.generator_blocked_count': skilltreeSummary.generator_blocked_count,
    'procedure_visual_backbone.pv_linked_unit_count': getPath(readJson(PATHS.procedureVisualCoverage), 'summary.pv_linked_unit_count'),
  });
  const referenceHealthSkilltree = referenceHealth.skilltree_generator_readiness || {};
  expectEqual(
    errors,
    `${PATHS.referenceHealth}.skilltree_generator_readiness.interactive_plus_blocked`,
    (referenceHealthSkilltree.interactive_skill_count || 0) +
      (referenceHealthSkilltree.generator_blocked_count || 0),
    activeADomainUnits.length
  );

  if (errors.length > 0) fail(errors);

  console.log(`OK MTU evidence layer: ${units.length} total, ${liveUnits.length} live, ${deprecatedUnits.length} deprecated`);
}

if (require.main === module) main();
