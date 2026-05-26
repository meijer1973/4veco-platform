#!/usr/bin/env node
/**
 * answer-skill-candidate-add.js
 *
 * EX-7 dry-run-only validator for a single future answer-skill candidate
 * record. It does not create storage and cannot write candidate records.
 */

const {
  assertFutureStorageAbsent,
  ensureDryRunOnly,
  loadSpecFromArgs,
  parseArgs,
  validateAnswerSkillCandidate,
} = require('./lib/exam-ingestion-candidate-validation');

function fail(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Answer-skill candidate dry-run failed: ${message}`);
  process.exit(1);
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    ensureDryRunOnly(args, 'answer-skill-candidate-add');
    assertFutureStorageAbsent();
    const candidate = loadSpecFromArgs(args, 'answer-skill candidate');
    validateAnswerSkillCandidate(candidate, 'answer-skill candidate dry-run spec');
    console.log(`OK dry-run answer-skill candidate: ${candidate.answer_skill_id}`);
  } catch (error) {
    fail(error);
  }
}

if (require.main === module) main();
