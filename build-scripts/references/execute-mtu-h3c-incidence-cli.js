#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - This is a bounded execution helper for the GATE-MTU-H3B approved MTU-H3C
 *   command set only.
 * - It shells out to the reference CLI for machine-reference changes and
 *   applies only the reviewed authored target-exercise mapping changes.
 * - It must not hand-edit references/machine/ or references/external/.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H3C';
const GATE_ID = 'GATE-MTU-H3B-incidence-cli-execution';
const REVIEWED_COMMIT = 'ad7d69c3836176a10111384aeb640d49e93b705d';
const PACKET_PATH = 'reports/mtu-hardening/mtu-h3b-incidence-cli-execution-packet.json';
const CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H3B-incidence-cli-execution/gate-closure.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const TARGET_PATH = 'references/authored/course-target-exercises.json';
const LOG_MD = 'reports/sprints/MTU-H3C-execution-log.md';
const LOG_JSON = 'reports/sprints/MTU-H3C-execution-log.json';
const ADD_UNITS = ['D41', 'D42', 'D43', 'D45', 'D46'];
const REQUIRED_EXISTING_UNITS = ['D07', 'D05', 'A38', 'A41', 'A93', 'A15'];
const HELD_UNITS = ['D44'];

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

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8' });
  return {
    command: [command, ...args.map((arg) => (/\s/.test(arg) ? JSON.stringify(arg) : arg))].join(' '),
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
  console.error(`MTU-H3C execution failed: ${message}`);
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

function targetById(exercises, id, log) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`, log);
  return target;
}

function unitLane(packet, id, log) {
  const lane = packet.unit_lanes.find((entry) => entry.unit_id === id);
  if (!lane) fail(`missing unit lane ${id}`, log);
  return lane;
}

function mappingPatch(packet, id, log) {
  const patch = packet.target_exercise_mapping_patch_plan.find((entry) => entry.record_id === id);
  if (!patch) fail(`missing mapping patch ${id}`, log);
  return patch;
}

function comparableRecord(record, allowedFields) {
  const copy = deepClone(record);
  for (const field of allowedFields) delete copy[field];
  return JSON.stringify(copy);
}

function assertNoUnexpectedStatus(statusLines, log) {
  const allowed = new Set(['?? knowledge/exit-ticket-game-1.1.1.zip']);
  const unexpected = statusLines.filter((line) => line.trim() && !allowed.has(line.trim()));
  if (unexpected.length) fail(`unexpected pre-execution worktree changes: ${unexpected.join('; ')}`, log);
}

function h3cSpec(packet, id, log) {
  const lane = unitLane(packet, id, log);
  const spec = deepClone(lane.reviewed_spec);
  if (id === 'D42') {
    spec.zero_needs_status = 'true_zero';
    spec.zero_needs_review = {
      reviewed_on: '2026-05-28',
      reviewer: 'GATE-MTU-H3B',
      rationale: 'D42 is an economics-specific root operation from available P0/Pc/Pp/t values. It must not force graphical D41; graph contexts map D41 separately and calculation contexts can supply prices directly.',
      recommended_needs: [],
      severity: 'medium',
      h3c_execution_decision: 'fixed from underbouw_assumed to true_zero per GATE-MTU-H3B condition',
    };
  }
  return spec;
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
  fs.mkdirSync(path.dirname(repoPath(LOG_MD)), { recursive: true });
  fs.writeFileSync(repoPath(LOG_MD), `${lines.join('\n')}\n`, 'utf8');
}

function applyTargetMappings(packet, log) {
  const targetData = readJson(TARGET_PATH);
  const exercises = targetData.exercises || targetData;
  const ids = ['3.1.1', '3.1.2', '3.1.3'];

  for (const id of ids) {
    const target = targetById(exercises, id, log);
    const patch = mappingPatch(packet, id, log);
    for (const field of ['required_skills', 'prior_knowledge_assumed', 'new_skills_introduced', 'missing_units_flagged']) {
      if (patch.before[field]) assertArray(target[field], patch.before[field], `${id} before.${field}`, log);
    }
    log.mapping_patches.push({
      record_id: id,
      before: patch.before,
      after: patch.after,
      patch_fields: patch.patch_fields,
      execution_note: patch.execution_note,
    });
  }

  for (const id of ids) {
    const target = targetById(exercises, id, log);
    const beforeRecord = deepClone(target);
    const patch = mappingPatch(packet, id, log);
    for (const field of patch.patch_fields) {
      target[field] = deepClone(patch.after[field]);
    }
    if (comparableRecord(beforeRecord, patch.patch_fields) !== comparableRecord(target, patch.patch_fields)) {
      fail(`${id} changed outside reviewed patch fields`, log);
    }
  }

  writeJson(TARGET_PATH, targetData);
  log.file_writes.push({
    path: TARGET_PATH,
    summary: 'applied reviewed mapping array patches for 3.1.1, 3.1.2, and 3.1.3',
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
    commands: [],
    file_writes: [],
    protected_reference_data_change_method: 'reference_cli_only',
    d42_zero_needs_execution_decision: 'true_zero',
    held_lanes: HELD_UNITS,
  };

  const closure = readJson(CLOSURE_PATH);
  if (closure.status !== 'pass_with_conditions') fail('GATE-MTU-H3B closure must be pass_with_conditions', log);
  if (closure.reviewed_remote_commit !== REVIEWED_COMMIT) fail('closure reviewed commit mismatch', log);
  if (!closure.authorized_next || closure.authorized_next.sprint_id !== SPRINT_ID || closure.authorized_next.execution_authorized !== true) {
    fail('GATE-MTU-H3B closure must authorize MTU-H3C execution', log);
  }
  log.preflight.push({ id: 'closure', status: 'passed', detail: CLOSURE_PATH });

  const packet = readJson(PACKET_PATH);
  const reviewedPacket = run('git', ['show', `${REVIEWED_COMMIT}:${PACKET_PATH}`]);
  if (reviewedPacket.status !== 0) fail('reviewed packet could not be read from git', log);
  if (reviewedPacket.stdout.replace(/\r\n/g, '\n') !== fs.readFileSync(repoPath(PACKET_PATH), 'utf8').replace(/\r\n/g, '\n')) {
    fail('current H3B execution packet differs from reviewed remote commit', log);
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
  for (const id of ADD_UNITS) {
    if (ids.has(id)) fail(`${id} must be absent before execution`, log);
  }
  for (const id of HELD_UNITS) {
    if (ids.has(id)) fail(`${id} must remain absent before execution`, log);
  }
  if (packet.exact_command_set.some((command) => HELD_UNITS.includes(command.unit_id))) {
    fail('D44 must not appear in the H3B command set', log);
  }
  log.preflight.push({
    id: 'unit_id_presence_absence',
    status: 'passed',
    detail: 'D07/D05/A38/A41/A93/A15 present; D41/D42/D43/D44/D45/D46 absent',
  });

  const commandIds = packet.exact_command_set.map((command) => command.unit_id);
  const expectedCommandIds = [...ADD_UNITS, 'D07'];
  if (JSON.stringify(commandIds) !== JSON.stringify(expectedCommandIds)) {
    fail(`unexpected command set: ${commandIds.join(', ')}`, log);
  }

  for (const id of ADD_UNITS) {
    const spec = h3cSpec(packet, id, log);
    log.extracted_specs.push({ unit_id: id, spec });
    console.log(`\n--- Extracted spec ${id} ---`);
    console.log(JSON.stringify(spec, null, 2));
    const result = run(process.execPath, ['build-scripts/references/unit-add.js', '--spec', JSON.stringify(spec)]);
    log.commands.push({ unit_id: id, ...result });
    if (result.status !== 0) fail(`${id} unit-add failed`, log);
  }

  const d07Patch = deepClone(unitLane(packet, 'D07', log).reviewed_patch);
  log.extracted_specs.push({ unit_id: 'D07', spec: d07Patch });
  console.log('\n--- Extracted spec D07 patch ---');
  console.log(JSON.stringify(d07Patch, null, 2));
  if ((d07Patch.needs || []).includes('A15')) fail('D07 patch must remove A15', log);
  if (!sameArray(d07Patch.needs, ['D42', 'A38'])) fail('D07 patch must need D42 and A38', log);
  if ((d07Patch.procedure || []).some((step) => /elastic/i.test(step))) {
    fail('D07 patch procedure must not retain hidden elasticity explanation', log);
  }

  const dryRun = run(process.execPath, ['build-scripts/references/unit-update.js', '--id', 'D07', '--spec', JSON.stringify(d07Patch), '--dry-run']);
  log.commands.push({ unit_id: 'D07-dry-run', ...dryRun });
  if (dryRun.status !== 0) fail('D07 unit-update dry-run failed', log);

  const update = run(process.execPath, ['build-scripts/references/unit-update.js', '--id', 'D07', '--spec', JSON.stringify(d07Patch)]);
  log.commands.push({ unit_id: 'D07', ...update });
  if (update.status !== 0) fail('D07 unit-update failed', log);

  applyTargetMappings(packet, log);

  log.status = 'passed';
  writeLogs(log);
  console.log(`OK ${SPRINT_ID} execution`);
}

if (require.main === module) main();
