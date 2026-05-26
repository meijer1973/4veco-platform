#!/usr/bin/env node
/**
 * check-source-annex-extraction-overlays.js
 *
 * Read-only validator for future source-annex and graph-object extraction
 * overlays. Default mode only proves the future storage file is absent.
 * Explicit input mode validates temporary dry-run fixture files.
 *
 * HOW TO ADAPT:
 * - Keep q19 reconstructability conservative: source/graph detail must be
 *   substantive before q19 can leave blocking-gap status.
 */

const {
  assertFutureStorageAbsent,
  parseArgs,
  readJson,
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');

function fail(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Source-annex extraction overlay check failed: ${message}`);
  process.exit(1);
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    assertFutureStorageAbsent();

    if (args.input) {
      const doc = readJson(args.input);
      validateSourceExtractionDocument(doc, args.input);
    }

    console.log('OK source-annex extraction overlay validation');
  } catch (error) {
    fail(error);
  }
}

if (require.main === module) main();
