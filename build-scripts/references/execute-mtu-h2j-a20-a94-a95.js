#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - This is a bounded execution helper for the GATE-MTU-H2I approved MTU-H2J
 *   command set only.
 * - It shells out to the reference CLI for machine-reference changes and
 *   applies only the reviewed authored/generator source changes.
 * - It must not hand-edit references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H2J';
const GATE_ID = 'GATE-MTU-H2I-a20-cli-execution';
const REVIEWED_COMMIT = '1fb0b95fc6b031f37ff780fb3db063dd9deb7d25';
const PACKET_PATH = 'reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.json';
const CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H2I-a20-cli-execution/gate-closure.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const TARGET_PATH = 'references/authored/course-target-exercises.json';
const GENERATORS_PATH = 'engines/skilltree/generators.js';
const LOG_MD = 'reports/sprints/MTU-H2J-execution-log.md';
const LOG_JSON = 'reports/sprints/MTU-H2J-execution-log.json';
const COMMAND_UNITS = ['A20', 'A94', 'A95'];
const NEW_UNITS = ['A94', 'A95'];
const REQUIRED_EXISTING_UNITS = ['A20', 'A91', 'A12', 'A13', 'A02'];

function repoPath(relPath) {
  return path.join(ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readText(relPath) {
  return fs.readFileSync(repoPath(relPath), 'utf8');
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), text, 'utf8');
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    ...options,
  });
  return {
    command: [command, ...args].join(' '),
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function fail(message, log) {
  if (log) {
    log.status = 'failed';
    log.failure = message;
    writeLogs(log);
  }
  console.error(`MTU-H2J execution failed: ${message}`);
  process.exit(1);
}

function sameArray(left, right) {
  return Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index]);
}

function assertArray(actual, expected, label, log) {
  if (!sameArray(actual, expected)) {
    fail(`${label} mismatch: expected [${expected.join(', ')}], got [${(actual || []).join(', ')}]`, log);
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function commandSpec(command) {
  const match = command.execution_command.match(/--spec '(.+)'$/);
  if (!match) throw new Error(`${command.unit_id} execution command must end with --spec '<JSON>'`);
  return JSON.parse(match[1]);
}

function commandsById(packet) {
  return new Map(packet.exact_command_set.map((command) => [command.unit_id, command]));
}

function targetById(exercises, id, log) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`, log);
  return target;
}

function assertNoUnexpectedStatus(statusLines, log) {
  const allowed = new Set(['?? knowledge/exit-ticket-game-1.1.1.zip']);
  const unexpected = statusLines.filter((line) => line.trim() && !allowed.has(line.trim()));
  if (unexpected.length) {
    fail(`unexpected pre-execution worktree changes: ${unexpected.join('; ')}`, log);
  }
}

function comparableRecord(record, allowedFields) {
  const copy = deepClone(record);
  for (const field of allowedFields) delete copy[field];
  return JSON.stringify(copy);
}

function writeLogs(log) {
  writeJson(LOG_JSON, log);
  const lines = [];
  lines.push(`# Sprint ${SPRINT_ID}: Execution Log`);
  lines.push('');
  lines.push('Generated: 2026-05-28');
  lines.push('');
  lines.push(`Status: ${log.status}`);
  lines.push('');
  lines.push(`Reviewed remote commit: \`${log.reviewed_remote_commit}\``);
  lines.push('');
  lines.push('## Preflight');
  lines.push('');
  for (const item of log.preflight) {
    lines.push(`- ${item.id}: ${item.status}`);
    if (item.detail) lines.push(`  - ${item.detail}`);
  }
  lines.push('');
  lines.push('## Extracted Unit Specs');
  lines.push('');
  for (const item of log.extracted_specs) {
    lines.push(`### ${item.unit_id}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(item.spec, null, 2));
    lines.push('```');
    lines.push('');
  }
  lines.push('## Mapping Patches');
  lines.push('');
  for (const item of log.mapping_patches) {
    lines.push(`### ${item.record_id}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify({ before: item.before, after: item.after }, null, 2));
    lines.push('```');
    lines.push('');
  }
  lines.push('## Generator Patch Summary');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(log.generator_patch, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Command Log');
  lines.push('');
  for (const item of log.commands) {
    lines.push(`### ${item.unit_id || item.id}`);
    lines.push('');
    lines.push(`Command: \`${item.command}\``);
    lines.push('');
    lines.push(`Exit status: ${item.status}`);
    if (item.stdout) {
      lines.push('');
      lines.push('Stdout:');
      lines.push('```text');
      lines.push(item.stdout.trim());
      lines.push('```');
    }
    if (item.stderr) {
      lines.push('');
      lines.push('Stderr:');
      lines.push('```text');
      lines.push(item.stderr.trim());
      lines.push('```');
    }
    lines.push('');
  }
  if (log.file_writes.length) {
    lines.push('## File Writes');
    lines.push('');
    for (const item of log.file_writes) {
      lines.push(`- ${item.path}: ${item.summary}`);
    }
    lines.push('');
  }
  if (log.failure) {
    lines.push('## Failure');
    lines.push('');
    lines.push(log.failure);
    lines.push('');
  }
  writeText(LOG_MD, `${lines.join('\n')}\n`);
}

function applyTargetMappings(packet, log) {
  const targetData = readJson(TARGET_PATH);
  const exercises = targetData.exercises || targetData;
  const patchMap = new Map(packet.target_exercise_mapping_patch_plan.map((patch) => [patch.record_id, patch]));
  const changedIds = ['3.2.2', '4.1.2'];
  const unchangedIds = ['3.3.3'];

  for (const id of [...changedIds, ...unchangedIds]) {
    const target = targetById(exercises, id, log);
    const patch = patchMap.get(id);
    if (!patch) fail(`missing reviewed mapping patch for ${id}`, log);
    assertArray(target.required_skills, patch.before.required_skills, `${id} before.required_skills`, log);
    assertArray(target.prior_knowledge_assumed, patch.before.prior_knowledge_assumed, `${id} before.prior_knowledge_assumed`, log);
    assertArray(target.new_skills_introduced, patch.before.new_skills_introduced, `${id} before.new_skills_introduced`, log);
    log.mapping_patches.push({
      record_id: id,
      before: patch.before,
      after: patch.after,
      patch_fields: patch.patch_fields,
      execution_note: patch.execution_note,
    });
  }

  for (const id of changedIds) {
    const target = targetById(exercises, id, log);
    const beforeRecord = deepClone(target);
    const patch = patchMap.get(id);
    for (const field of patch.patch_fields) {
      target[field] = deepClone(patch.after[field]);
    }
    if (comparableRecord(beforeRecord, patch.patch_fields) !== comparableRecord(target, patch.patch_fields)) {
      fail(`${id} changed outside reviewed patch fields`, log);
    }
  }

  for (const id of unchangedIds) {
    const target = targetById(exercises, id, log);
    const patch = patchMap.get(id);
    assertArray(target.required_skills, patch.after.required_skills, `${id} after.required_skills`, log);
    assertArray(target.prior_knowledge_assumed, patch.after.prior_knowledge_assumed, `${id} after.prior_knowledge_assumed`, log);
    assertArray(target.new_skills_introduced, patch.after.new_skills_introduced, `${id} after.new_skills_introduced`, log);
  }

  writeJson(TARGET_PATH, targetData);
  log.file_writes.push({
    path: TARGET_PATH,
    summary: 'applied reviewed array-only mapping patches for 3.2.2 and 4.1.2; verified 3.3.3 unchanged',
  });
}

function applyGeneratorRoute(log) {
  const source = readText(GENERATORS_PATH);
  if (!source.includes('GEN.A20 = function ()')) fail('GEN.A20 must exist before generator route', log);
  if (source.includes('GEN.A95 = function ()')) fail('GEN.A95 must be absent before generator route', log);
  if (source.includes('GEN.A94 = function ()')) fail('GEN.A94 must be absent unless separately approved', log);

  const start = source.indexOf('    GEN.A20 = function () {');
  const next = source.indexOf('    GEN.A21 = function () {', start);
  if (start === -1 || next === -1) fail('could not isolate GEN.A20 block', log);

  const a20Block = source.slice(start, next);
  const a95Block = a20Block.replace('GEN.A20 = function ()', 'GEN.A95 = function ()');
  const nextSource = source.slice(0, start) + a95Block + source.slice(next);

  log.generator_patch = {
    source: GENERATORS_PATH,
    route: 'move_current_GEN_A20_behavior_to_GEN_A95_and_block_GEN_A20',
    removed_or_disabled: ['GEN.A20'],
    added_or_moved: ['GEN.A95'],
    intentionally_absent: ['GEN.A94'],
    note: 'GEN.A95 receives the current GEN.A20 given-MO/given-MK-function body. GEN.A20 is absent so narrowed A20 is generator-blocked until a matching derive-both generator exists.',
  };

  writeText(GENERATORS_PATH, nextSource);
  log.file_writes.push({
    path: GENERATORS_PATH,
    summary: 'moved current GEN.A20 body to GEN.A95 and left GEN.A20/GEN.A94 without implementations',
  });
}

function main() {
  const log = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    generated_on: '2026-05-28',
    status: 'started',
    reviewed_remote_commit: REVIEWED_COMMIT,
    preflight: [],
    extracted_specs: [],
    mapping_patches: [],
    generator_patch: null,
    commands: [],
    file_writes: [],
    protected_reference_data_change_method: 'reference_cli_only',
  };

  const closure = readJson(CLOSURE_PATH);
  if (closure.status !== 'pass_with_conditions') fail('GATE-MTU-H2I closure must be pass_with_conditions', log);
  if (closure.reviewed_remote_commit !== REVIEWED_COMMIT) fail('closure reviewed commit mismatch', log);
  if (!closure.authorized_next || closure.authorized_next.sprint_id !== SPRINT_ID || closure.authorized_next.execution_authorized !== true) {
    fail('GATE-MTU-H2I closure must authorize MTU-H2J execution', log);
  }
  log.preflight.push({ id: 'closure', status: 'passed', detail: CLOSURE_PATH });

  const packet = readJson(PACKET_PATH);
  const reviewedPacket = run('git', ['show', `${REVIEWED_COMMIT}:${PACKET_PATH}`]);
  if (reviewedPacket.status !== 0) fail('reviewed packet could not be read from git', log);
  if (reviewedPacket.stdout.replace(/\r\n/g, '\n') !== fs.readFileSync(repoPath(PACKET_PATH), 'utf8').replace(/\r\n/g, '\n')) {
    fail('current H2I execution packet differs from reviewed remote commit', log);
  }
  log.preflight.push({ id: 'reviewed_packet_match', status: 'passed', detail: PACKET_PATH });

  const status = run('git', ['status', '--short']);
  const statusLines = status.stdout.split(/\r?\n/).filter(Boolean);
  assertNoUnexpectedStatus(statusLines, log);
  log.preflight.push({
    id: 'git_status',
    status: 'passed',
    detail: statusLines.length ? statusLines.join('; ') : 'clean',
  });

  const units = readJson(UNITS_PATH);
  const ids = new Set(units.map((unit) => unit.id));
  for (const id of REQUIRED_EXISTING_UNITS) {
    if (!ids.has(id)) fail(`${id} must exist before execution`, log);
  }
  for (const id of NEW_UNITS) {
    if (ids.has(id)) fail(`${id} must be absent before execution`, log);
  }
  log.preflight.push({ id: 'unit_id_presence_absence', status: 'passed', detail: 'A20/A91/A12/A13/A02 present; A94/A95 absent' });

  const generatorSource = readText(GENERATORS_PATH);
  if (!generatorSource.includes('GEN.A20 = function ()')) fail('GEN.A20 must exist before execution', log);
  if (generatorSource.includes('GEN.A94 = function ()')) fail('GEN.A94 must be absent before execution', log);
  if (generatorSource.includes('GEN.A95 = function ()')) fail('GEN.A95 must be absent before execution', log);
  log.preflight.push({ id: 'generator_presence_absence', status: 'passed', detail: 'GEN.A20 present; GEN.A94/GEN.A95 absent' });

  const commandMap = commandsById(packet);
  const commandUnits = packet.exact_command_set.map((command) => command.unit_id);
  if (JSON.stringify(commandUnits) !== JSON.stringify(COMMAND_UNITS)) {
    fail(`unexpected command set: ${commandUnits.join(', ')}`, log);
  }

  const specs = new Map();
  for (const id of COMMAND_UNITS) {
    const spec = commandSpec(commandMap.get(id));
    specs.set(id, spec);
    log.extracted_specs.push({ unit_id: id, spec });
  }
  if (!(specs.get('A20').exam_codes || []).includes('A2.11')) {
    fail('A20 extracted spec must retain A2.11', log);
  }
  log.preflight.push({ id: 'extracted_specs_logged', status: 'passed' });

  const a20DryRun = run(process.execPath, [
    path.join('build-scripts', 'references', 'unit-update.js'),
    '--id',
    'A20',
    '--spec',
    JSON.stringify(specs.get('A20')),
    '--dry-run',
  ]);
  log.commands.push({ unit_id: 'A20', phase: 'dry_run', ...a20DryRun });
  if (a20DryRun.status !== 0) fail('A20 dry-run failed', log);

  for (const id of COMMAND_UNITS) {
    const command = commandMap.get(id);
    const spec = specs.get(id);
    const script = command.action === 'unit-update'
      ? path.join('build-scripts', 'references', 'unit-update.js')
      : path.join('build-scripts', 'references', 'unit-add.js');
    const args = command.action === 'unit-update'
      ? [script, '--id', id, '--spec', JSON.stringify(spec)]
      : [script, '--spec', JSON.stringify(spec)];
    const result = run(process.execPath, args);
    const record = { unit_id: id, phase: 'execution', reviewed_action: command.action, ...result };
    log.commands.push(record);
    if (result.status !== 0) fail(`${id} ${command.action} failed`, log);
  }

  applyTargetMappings(packet, log);
  applyGeneratorRoute(log);

  const afterUnits = readJson(UNITS_PATH);
  const afterMap = new Map(afterUnits.map((unit) => [unit.id, unit]));
  for (const id of COMMAND_UNITS) {
    if (!afterMap.has(id)) fail(`${id} must exist after execution`, log);
  }
  if (!(afterMap.get('A20').exam_codes || []).includes('A2.11')) fail('A20 lost A2.11 after execution', log);
  if ((afterMap.get('A94').needs || []).includes('A12')) fail('A94 must not gain A12 dependency', log);

  const afterGenerator = readText(GENERATORS_PATH);
  if (afterGenerator.includes('GEN.A20 = function ()')) fail('GEN.A20 must be blocked by missing implementation after execution', log);
  if (!afterGenerator.includes('GEN.A95 = function ()')) fail('GEN.A95 must exist after generator move', log);
  if (afterGenerator.includes('GEN.A94 = function ()')) fail('GEN.A94 must remain absent unless separately implemented', log);

  log.preflight.push({
    id: 'post_execution_shape',
    status: 'passed',
    detail: 'A20/A94/A95 catalog shape, mapping patch, and generator route applied',
  });

  log.status = 'passed';
  writeLogs(log);
  console.log(`OK ${SPRINT_ID} executed ${COMMAND_UNITS.join(', ')} plus target mappings and generator route`);
}

if (require.main === module) {
  main();
}
