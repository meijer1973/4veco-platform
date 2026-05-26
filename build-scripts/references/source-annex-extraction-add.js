#!/usr/bin/env node
/**
 * source-annex-extraction-add.js
 *
 * EX-7 dry-run-only validator for a single future source-annex or graph-object
 * extraction overlay record. It does not execute extraction and cannot write
 * records.
 */

const {
  assertFutureStorageAbsent,
  ensureDryRunOnly,
  loadSpecFromArgs,
  parseArgs,
  validateGraphOverlay,
  validateSourceAnnexOverlay,
} = require('./lib/exam-ingestion-candidate-validation');

function fail(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Source-annex extraction dry-run failed: ${message}`);
  process.exit(1);
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    ensureDryRunOnly(args, 'source-annex-extraction-add');
    assertFutureStorageAbsent();
    const record = loadSpecFromArgs(args, 'source-annex extraction overlay');
    const kind = args.kind || 'graph';
    if (kind === 'graph') {
      validateGraphOverlay(record, 'graph extraction dry-run spec');
      console.log(`OK dry-run graph extraction overlay: ${record.extraction_id}`);
    } else if (kind === 'source-annex') {
      validateSourceAnnexOverlay(record, 'source-annex extraction dry-run spec');
      console.log(`OK dry-run source-annex extraction overlay: ${record.extraction_id}`);
    } else {
      throw new Error('--kind must be graph or source-annex');
    }
  } catch (error) {
    fail(error);
  }
}

if (require.main === module) main();
