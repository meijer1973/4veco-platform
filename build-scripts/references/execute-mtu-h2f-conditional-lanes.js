#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - This is a bounded execution helper for the GATE-MTU-H2E approved MTU-H2F
 *   command set only.
 * - It shells out to the reference CLI; it must not hand-edit
 *   references/machine/ or references/external/.
 * - For a future sprint, change SPRINT_ID/GATE_ID/EXPECTED_UNITS and the
 *   reviewed packet path, then keep the same preflight/spec-logging pattern.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H2F';
const GATE_ID = 'GATE-MTU-H2E';
const REVIEWED_COMMIT = '52ffc484b270182964283e20cd696aca6ce5f9e6';
const PACKET_PATH = 'reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.json';
const CLOSURE_PATH = 'reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/gate-closure.json';
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const LOG_MD = 'reports/sprints/MTU-H2F-execution-log.md';
const LOG_JSON = 'reports/sprints/MTU-H2F-execution-log.json';
const EXECUTION_UNITS = ['A12', 'A88', 'A89', 'A90', 'A92', 'A93'];
const NEW_UNITS = ['A88', 'A89', 'A90', 'A92', 'A93'];
const HELD_UNITS = ['A20'];

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
  console.error(`MTU-H2F execution failed: ${message}`);
  process.exit(1);
}

function commandSpec(command) {
  const match = command.execution_command.match(/--spec '(.+)'$/);
  if (!match) throw new Error(`${command.unit_id} execution command must end with --spec '<JSON>'`);
  return JSON.parse(match[1]);
}

function commandsById(packet) {
  return new Map(packet.exact_command_set.map((command) => [command.unit_id, command]));
}

function assertNoUnexpectedStatus(statusLines, log) {
  const unexpected = statusLines.filter((line) => line.trim() && line.trim() !== '?? knowledge/exit-ticket-game-1.1.1.zip');
  if (unexpected.length) {
    fail(`unexpected pre-execution worktree changes: ${unexpected.join('; ')}`, log);
  }
}

function writeLogs(log) {
  writeJson(LOG_JSON, log);
  const lines = [];
  lines.push(`# Sprint ${SPRINT_ID}: Execution Log`);
  lines.push('');
  lines.push(`Generated: 2026-05-28`);
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
  lines.push('## Extracted Specs');
  lines.push('');
  for (const item of log.extracted_specs) {
    lines.push(`### ${item.unit_id}`);
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(item.spec, null, 2));
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
  if (log.failure) {
    lines.push('## Failure');
    lines.push('');
    lines.push(log.failure);
    lines.push('');
  }
  writeText(LOG_MD, `${lines.join('\n')}\n`);
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
    commands: [],
    protected_reference_data_change_method: 'reference_cli_only',
    held_units: HELD_UNITS,
  };

  const closure = readJson(CLOSURE_PATH);
  if (closure.status !== 'pass_with_conditions') fail('GATE-MTU-H2E closure must be pass_with_conditions', log);
  if (closure.reviewed_remote_commit !== REVIEWED_COMMIT) fail('closure reviewed commit mismatch', log);
  log.preflight.push({ id: 'closure', status: 'passed', detail: CLOSURE_PATH });

  const packet = readJson(PACKET_PATH);
  const reviewedPacket = run('git', ['show', `${REVIEWED_COMMIT}:${PACKET_PATH}`]);
  if (reviewedPacket.status !== 0) fail('reviewed packet could not be read from git', log);
  if (reviewedPacket.stdout.replace(/\r\n/g, '\n') !== fs.readFileSync(repoPath(PACKET_PATH), 'utf8').replace(/\r\n/g, '\n')) {
    fail('current H2E execution packet differs from reviewed remote commit', log);
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
  for (const id of ['A12', 'A20']) {
    if (!ids.has(id)) fail(`${id} must exist before execution`, log);
  }
  for (const id of NEW_UNITS) {
    if (ids.has(id)) fail(`${id} must be absent before execution`, log);
  }
  log.preflight.push({ id: 'id_presence_absence', status: 'passed', detail: 'A12/A20 present; A88/A89/A90/A92/A93 absent' });

  const commandMap = commandsById(packet);
  const commandUnits = packet.exact_command_set.map((command) => command.unit_id);
  if (JSON.stringify(commandUnits) !== JSON.stringify(EXECUTION_UNITS)) {
    fail(`unexpected command set: ${commandUnits.join(', ')}`, log);
  }
  for (const held of HELD_UNITS) {
    if (commandMap.has(held)) fail(`${held} command must not exist`, log);
  }
  log.preflight.push({ id: 'a20_absent_from_commands', status: 'passed' });

  const specs = new Map();
  for (const id of EXECUTION_UNITS) {
    const spec = commandSpec(commandMap.get(id));
    specs.set(id, spec);
    log.extracted_specs.push({ unit_id: id, spec });
  }
  if (!(specs.get('A12').exam_codes || []).includes('A2.11')) {
    fail('A12 extracted spec must retain A2.11', log);
  }
  log.preflight.push({ id: 'extracted_specs_logged', status: 'passed' });

  const a12DryRun = run(process.execPath, [
    path.join('build-scripts', 'references', 'unit-update.js'),
    '--id',
    'A12',
    '--spec',
    JSON.stringify(specs.get('A12')),
    '--dry-run',
  ]);
  log.commands.push({ unit_id: 'A12', phase: 'dry_run', ...a12DryRun });
  if (a12DryRun.status !== 0) fail('A12 dry-run failed', log);

  const executionResults = [];
  for (const id of EXECUTION_UNITS) {
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
    executionResults.push(record);
    if (result.status !== 0) fail(`${id} ${command.action} failed`, log);
  }

  const afterUnits = readJson(UNITS_PATH);
  const afterIds = new Set(afterUnits.map((unit) => unit.id));
  for (const id of EXECUTION_UNITS) {
    if (!afterIds.has(id)) fail(`${id} must exist after execution`, log);
  }
  const a12 = afterUnits.find((unit) => unit.id === 'A12');
  if (!(a12.exam_codes || []).includes('A2.11')) fail('A12 lost A2.11 after execution', log);
  log.preflight.push({ id: 'post_execution_catalog_shape', status: 'passed', detail: 'A12/A88/A89/A90/A92/A93 present and A12 retains A2.11' });

  log.status = 'passed';
  writeLogs(log);
  console.log(`OK ${SPRINT_ID} executed ${EXECUTION_UNITS.join(', ')}`);
}

if (require.main === module) {
  main();
}
