#!/usr/bin/env node
/**
 * HOW TO ADAPT: after committing reviewed successor sources, run this writer
 * with their full Platform SHA and an observed Lesson SHA. Commit the resulting
 * certificate before full CI/review. This command grants no validation or merge
 * decision and never rewrites historical evidence.
 */
const fs = require('fs');
const path = require('path');
const verifier = require('./check-y1-golden-rollout-wave-1-current');

function write(argv) {
  if (argv.length !== 4 || argv[0] !== '--source-head' || argv[2] !== '--lesson-head' ||
      !/^[0-9a-f]{40}$/.test(argv[1]) || !/^[0-9a-f]{40}$/.test(argv[3])) {
    throw new Error('usage: --source-head <full Platform SHA> --lesson-head <full Lesson SHA>');
  }
  const record = verifier.buildCertificate(argv[1], argv[3]);
  const output = path.join(verifier.ROOT, verifier.CERTIFICATE);
  fs.writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return { certificate_written: verifier.CERTIFICATE, source_payload_sha: argv[1], validation_performed: false };
}

if (require.main === module) {
  try { process.stdout.write(`${JSON.stringify(write(process.argv.slice(2)), null, 2)}\n`); }
  catch (error) { process.stderr.write(`Y1 certificate writer failed: ${error.message}\n`); process.exitCode = 1; }
}
module.exports = { write };
