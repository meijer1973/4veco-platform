#!/usr/bin/env node
/**
 * operation-candidate-add.js
 *
 * EX-7 dry-run-only validator for a single future operation-candidate record.
 * It does not create storage and cannot write candidate records.
 *
 * Usage:
 *   node build-scripts/references/operation-candidate-add.js --dry-run --spec-file tmp.json
 *   node build-scripts/references/operation-candidate-add.js --dry-run --spec '{...}'
 */

const {
  assertFutureStorageAbsent,
  ensureDryRunOnly,
  loadSpecFromArgs,
  parseArgs,
  validateOperationCandidate,
} = require('./lib/exam-ingestion-candidate-validation');

function fail(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Operation candidate dry-run failed: ${message}`);
  process.exit(1);
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    ensureDryRunOnly(args, 'operation-candidate-add');
    assertFutureStorageAbsent();
    const candidate = loadSpecFromArgs(args, 'operation candidate');
    validateOperationCandidate(candidate, 'operation candidate dry-run spec');
    console.log(`OK dry-run operation candidate: ${candidate.operation_id}`);
  } catch (error) {
    fail(error);
  }
}

if (require.main === module) main();
