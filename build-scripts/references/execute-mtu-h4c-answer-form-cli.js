#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this script bounded to the GATE-MTU-H4B reviewed answer-form command
 *   set. It may execute only the reviewed unit-add specs for A96, A97, A98,
 *   A99, A80, and A81.
 * - Do not add target-exercise writes, candidate storage, projection refresh,
 *   lesson output, or student-facing exposure to this script.
 * - If future answer-form lanes are authorized, create a new sprint-specific
 *   executor rather than widening this one silently.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const ACCEPTED_IDS = ['A96', 'A97', 'A98', 'A99', 'A80', 'A81'];
const HELD_ID = 'A71';
const INVALID_ID = 'A100';
const REVIEWED_REMOTE_COMMIT = 'f59c83a7067678aa3ff2c4bab4455ab9d90d72af';

const PACKET_PATH = 'reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json';
const CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H4B-answer-form-cli-execution/gate-closure.json';
const UNITS_JSON_PATH = 'references/machine/micro-teaching-units.json';
const TARGETS_PATH = 'references/authored/course-target-exercises.json';
const CANDIDATE_STORAGE_PATH = 'references/data/exam-ingestion/answer-skill-candidates.json';
const LOG_JSON_PATH = 'reports/sprints/MTU-H4C-execution-log.json';
const LOG_MD_PATH = 'reports/sprints/MTU-H4C-execution-log.md';

function repoPath(relPath) {
  return path.join(ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(relPath, text) {
  const full = repoPath(relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}

function fail(message) {
  throw new Error(message);
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    ...options,
  });
  return {
    command: [command, ...args].join(' '),
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function git(args) {
  const result = run('git', args);
  if (result.status !== 0) {
    fail(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function targetRecords(data) {
  return Array.isArray(data) ? data : data.exercises || data.target_exercises || [];
}

function idMap(units) {
  return new Map(units.map((unit) => [unit.id, unit]));
}

function selectedSpecShape(spec) {
  return {
    id: spec.id,
    name: spec.name,
    kern: spec.kern,
    needs: spec.needs,
    exam_codes: spec.exam_codes,
    mastery_target: spec.mastery_target,
    prior_learning: spec.prior_learning,
    aspects: spec.aspects,
    terms: spec.terms,
    procedure: spec.procedure,
    pitfalls: spec.pitfalls,
    generator: spec.generator,
    zero_needs_status: spec.zero_needs_status,
    zero_needs_review: spec.zero_needs_review,
  };
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function compactSpec(spec) {
  const text = JSON.stringify(spec);
  if (text.includes("'")) fail(`spec for ${spec.id} contains a single quote`);
  return text;
}

function loadReviewedSpecs() {
  const packet = readJson(PACKET_PATH);
  const closure = readJson(CLOSURE_PATH);
  if (closure.status !== 'pass_with_conditions') fail('H4B closure is not pass_with_conditions');
  if (closure.reviewed_remote_commit !== REVIEWED_REMOTE_COMMIT) fail('H4B reviewed remote commit mismatch');
  if (!closure.authorized_next || closure.authorized_next.sprint_id !== 'MTU-H4C') {
    fail('H4B closure does not authorize MTU-H4C');
  }
  if (closure.authorized_next.execution_authorized !== true) fail('H4B closure does not authorize bounded execution');
  if (closure.authorized_next.student_product_use_authorized !== false) fail('H4B closure must keep student product use false');

  const commands = packet.exact_command_set || [];
  const lanes = packet.exact_unit_lanes || [];
  const closureRows = closure.accepted_for_later_bounded_execution || [];
  const specs = ACCEPTED_IDS.map((id) => {
    const command = commands.find((item) => item.unit_id === id);
    const lane = lanes.find((item) => item.unit_id === id);
    const closureRow = closureRows.find((item) => item.unit_id === id);
    if (!command || !lane || !closureRow) fail(`missing reviewed command/spec/closure row for ${id}`);
    const specJson = compactSpec(lane.reviewed_spec);
    const hash = sha256(specJson);
    if (hash !== command.command_spec_sha256) fail(`${id} hash mismatch against command set`);
    if (hash !== closureRow.command_spec_sha256) fail(`${id} hash mismatch against closure`);
    if (command.execution_authorized_by_packet !== false) fail(`${id} packet command must not self-authorize execution`);
    return {
      unit_id: id,
      lane: lane.lane,
      spec: lane.reviewed_spec,
      spec_json: specJson,
      command_spec_sha256: hash,
      reviewed_command: command.execution_command,
    };
  });
  return { packet, closure, specs };
}

function preflight(specs) {
  const units = readJson(UNITS_JSON_PATH);
  const targets = targetRecords(readJson(TARGETS_PATH));
  const byId = idMap(units);
  const acceptedPresence = Object.fromEntries(ACCEPTED_IDS.map((id) => [id, byId.has(id)]));
  for (const id of ACCEPTED_IDS) {
    if (byId.has(id)) fail(`${id} already exists before execution`);
  }
  if (byId.has(HELD_ID)) fail(`${HELD_ID} is live but must remain held`);
  if (byId.has(INVALID_ID)) fail(`${INVALID_ID} is live but must remain invalid/absent`);
  if (/^[A-L]\d\d$/.test(INVALID_ID)) fail(`${INVALID_ID} unexpectedly validates under current regex`);
  if (fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH))) fail('answer-skill candidate storage exists');
  const questionTypeCount = targets.filter((item) => Object.prototype.hasOwnProperty.call(item, 'question_type')).length;
  const answerFormCount = targets.filter((item) => Object.prototype.hasOwnProperty.call(item, 'answer_form')).length;
  if (questionTypeCount !== 0) fail('target exercise question_type fields are present before H4C');
  if (answerFormCount !== 0) fail('target exercise answer_form fields are present before H4C');
  if (specs.some((row) => row.unit_id === HELD_ID || row.unit_id === INVALID_ID)) {
    fail('reviewed specs include held or invalid ID');
  }
  return {
    unit_count: units.length,
    accepted_presence: acceptedPresence,
    held_id_present: byId.has(HELD_ID),
    invalid_id_present: byId.has(INVALID_ID),
    invalid_id_valid_by_regex: /^[A-L]\d\d$/.test(INVALID_ID),
    candidate_storage_exists: fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH)),
    target_exercise_records: targets.length,
    target_question_type_field_count: questionTypeCount,
    target_answer_form_field_count: answerFormCount,
  };
}

function postflight(specs) {
  const units = readJson(UNITS_JSON_PATH);
  const targets = targetRecords(readJson(TARGETS_PATH));
  const byId = idMap(units);
  for (const row of specs) {
    const live = byId.get(row.unit_id);
    if (!live) fail(`${row.unit_id} missing after execution`);
    if (!sameJson(selectedSpecShape(live), selectedSpecShape(row.spec))) {
      fail(`${row.unit_id} live unit does not match reviewed spec shape`);
    }
  }
  if (byId.has(HELD_ID)) fail(`${HELD_ID} became live`);
  if (byId.has(INVALID_ID)) fail(`${INVALID_ID} became live`);
  if (fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH))) fail('answer-skill candidate storage was created');
  const questionTypeCount = targets.filter((item) => Object.prototype.hasOwnProperty.call(item, 'question_type')).length;
  const answerFormCount = targets.filter((item) => Object.prototype.hasOwnProperty.call(item, 'answer_form')).length;
  if (questionTypeCount !== 0) fail('target exercise question_type fields were written');
  if (answerFormCount !== 0) fail('target exercise answer_form fields were written');
  return {
    unit_count: units.length,
    accepted_presence: Object.fromEntries(ACCEPTED_IDS.map((id) => [id, byId.has(id)])),
    held_id_present: byId.has(HELD_ID),
    invalid_id_present: byId.has(INVALID_ID),
    candidate_storage_exists: fs.existsSync(repoPath(CANDIDATE_STORAGE_PATH)),
    target_exercise_records: targets.length,
    target_question_type_field_count: questionTypeCount,
    target_answer_form_field_count: answerFormCount,
  };
}

function renderMarkdown(log) {
  const commandRows = log.commands.map((item) => [
    item.unit_id,
    item.lane,
    item.command_spec_sha256,
    item.status === 0 ? 'passed' : 'failed',
    (item.stdout || '').trim().replace(/\|/g, '\\|'),
  ]);
  return `# Sprint MTU-H4C Execution Log

Generated: ${log.generated_on}
Status: \`${log.status}\`

## Authority

- Source gate: \`${CLOSURE_PATH}\`
- Reviewed remote commit: \`${REVIEWED_REMOTE_COMMIT}\`
- Execution scope: \`A96\`, \`A97\`, \`A98\`, \`A99\`, \`A80\`, \`A81\`
- Student/product use authorized: no

## Preflight

\`\`\`json
${JSON.stringify(log.preflight, null, 2)}
\`\`\`

## Reviewed Specs

${log.reviewed_specs.map((row) => `### ${row.unit_id} ${row.lane}

- SHA-256: \`${row.command_spec_sha256}\`
- Reviewed command: \`${row.reviewed_command}\`

\`\`\`json
${JSON.stringify(row.spec, null, 2)}
\`\`\`
`).join('\n')}

## Commands

| Unit | Lane | Spec hash | Status | Output |
|---|---|---|---:|---|
${commandRows.map((row) => `| ${row.join(' | ')} |`).join('\n')}

## Postflight

\`\`\`json
${JSON.stringify(log.postflight, null, 2)}
\`\`\`

## Boundary Proof

- A71 remains held/absent.
- A100 remains invalid/absent.
- No target-exercise question_type or answer_form fields were written.
- No answer-skill candidate storage was created.
- No lesson output, diagnostics, adaptive routing, mastery/sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion,
  Scale Gate 1, or student/product use was authorized by this execution.
`;
}

function checkLog() {
  const log = readJson(LOG_JSON_PATH);
  if (log.sprint_id !== 'MTU-H4C') fail('execution log sprint_id mismatch');
  if (log.status !== 'passed') fail('execution log status must be passed');
  if (!sameJson(log.accepted_unit_ids, ACCEPTED_IDS)) fail('execution log accepted ID order mismatch');
  if (log.preflight.unit_count !== 250) fail('preflight unit count must be 250');
  if (log.postflight.unit_count !== 256) fail('postflight unit count must be 256');
  for (const id of ACCEPTED_IDS) {
    if (log.preflight.accepted_presence[id] !== false) fail(`${id} must be absent in preflight`);
    if (log.postflight.accepted_presence[id] !== true) fail(`${id} must be present in postflight`);
  }
  if (log.postflight.held_id_present !== false) fail('A71 must remain absent after execution');
  if (log.postflight.invalid_id_present !== false) fail('A100 must remain absent after execution');
  if (log.postflight.candidate_storage_exists !== false) fail('candidate storage must remain absent');
  if (log.postflight.target_question_type_field_count !== 0) fail('question_type fields must remain absent');
  if (log.postflight.target_answer_form_field_count !== 0) fail('answer_form fields must remain absent');
  if (log.commands.length !== ACCEPTED_IDS.length) fail('execution log must contain six commands');
  for (const command of log.commands) {
    if (command.status !== 0) fail(`${command.unit_id} command did not pass`);
  }
  console.log('OK MTU-H4C execution log');
}

function execute() {
  const started = new Date().toISOString();
  const log = {
    schema_version: 1,
    sprint_id: 'MTU-H4C',
    generated_on: started,
    status: 'running',
    source_gate: CLOSURE_PATH,
    source_packet: PACKET_PATH,
    reviewed_remote_commit: REVIEWED_REMOTE_COMMIT,
    accepted_unit_ids: ACCEPTED_IDS,
    pre_execution_git: {
      head: git(['rev-parse', 'HEAD']),
      status_short: git(['status', '--short']),
    },
    reviewed_specs: [],
    commands: [],
    preflight: null,
    postflight: null,
    boundaries: {
      target_exercise_field_writes_authorized: false,
      candidate_storage_creation_authorized: false,
      lesson_output_authorized: false,
      student_product_use_authorized: false,
    },
  };

  try {
    const { specs } = loadReviewedSpecs();
    log.reviewed_specs = specs.map((row) => ({
      unit_id: row.unit_id,
      lane: row.lane,
      command_spec_sha256: row.command_spec_sha256,
      reviewed_command: row.reviewed_command,
      spec: row.spec,
    }));
    log.preflight = preflight(specs);

    for (const row of specs) {
      console.log(`\n[MTU-H4C] ${row.unit_id} ${row.lane}`);
      console.log(row.spec_json);
      const result = run(process.execPath, [
        path.join('build-scripts', 'references', 'unit-add.js'),
        '--spec',
        row.spec_json,
      ]);
      log.commands.push({
        unit_id: row.unit_id,
        lane: row.lane,
        command_spec_sha256: row.command_spec_sha256,
        command: result.command,
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
      });
      if (result.status !== 0) {
        fail(`${row.unit_id} unit-add failed: ${result.stderr || result.stdout}`);
      }
    }

    log.postflight = postflight(specs);
    log.status = 'passed';
  } catch (error) {
    log.status = 'failed';
    log.error = error.message;
    throw error;
  } finally {
    log.completed_on = new Date().toISOString();
    writeJson(LOG_JSON_PATH, log);
    writeText(LOG_MD_PATH, renderMarkdown(log));
  }

  console.log(`wrote ${LOG_JSON_PATH}`);
  console.log(`wrote ${LOG_MD_PATH}`);
}

if (require.main === module) {
  if (process.argv.includes('--check-log')) {
    checkLog();
  } else {
    execute();
  }
}
