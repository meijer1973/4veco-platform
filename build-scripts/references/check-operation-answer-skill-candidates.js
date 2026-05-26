#!/usr/bin/env node
/**
 * check-operation-answer-skill-candidates.js
 *
 * Read-only validator for future EX operation and answer-skill candidate
 * overlays. Default mode only proves the future candidate storage files are
 * absent. Explicit input mode validates temporary dry-run fixture files.
 *
 * HOW TO ADAPT:
 * - Keep default mode storage-free until a later gate authorizes persistent
 *   candidate files.
 * - Add new rejection rules in the shared validation library, not in one-off
 *   callers.
 */

const {
  ValidationError,
  assertFutureStorageAbsent,
  parseArgs,
  readJson,
  validateAnswerSkillDocument,
  validateOperationAnswerPair,
  validateOperationDocument,
} = require('./lib/exam-ingestion-candidate-validation');

function fail(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Operation/answer-skill candidate check failed: ${message}`);
  process.exit(1);
}

function loadTypedInput(inputPath) {
  const doc = readJson(inputPath);
  if (doc.storage_id === 'operation-candidates') {
    validateOperationDocument(doc, inputPath);
    return { operationDoc: doc };
  }
  if (doc.storage_id === 'answer-skill-candidates') {
    validateAnswerSkillDocument(doc, inputPath);
    return { answerDoc: doc };
  }
  throw new ValidationError(
    `${inputPath} must have storage_id operation-candidates or answer-skill-candidates`
  );
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    assertFutureStorageAbsent();

    let operationDoc = null;
    let answerDoc = null;

    if (args.input) {
      const loaded = loadTypedInput(args.input);
      operationDoc = loaded.operationDoc || null;
      answerDoc = loaded.answerDoc || null;
    }
    if (args['operation-input']) {
      operationDoc = readJson(args['operation-input']);
      validateOperationDocument(operationDoc, args['operation-input']);
    }
    if (args['answer-input']) {
      answerDoc = readJson(args['answer-input']);
      validateAnswerSkillDocument(answerDoc, args['answer-input']);
    }

    if (operationDoc && answerDoc) validateOperationAnswerPair(operationDoc, answerDoc);

    console.log('OK operation/answer-skill candidate validation');
  } catch (error) {
    fail(error);
  }
}

if (require.main === module) main();
