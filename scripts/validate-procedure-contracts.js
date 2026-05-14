#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PLATFORM_ROOT = path.resolve(__dirname, '..');
const DEFAULT_CONTRACT_PATH = path.join(
  PLATFORM_ROOT,
  'references',
  'data',
  'procedure-visual',
  'lesson-procedure-contracts.json'
);

function usage() {
  console.error('Usage: node scripts/validate-procedure-contracts.js [--contract <json>] [--book-root <path>] [--report <json>]');
  process.exit(2);
}

function parseArgs(argv) {
  const args = {
    contractPath: DEFAULT_CONTRACT_PATH,
    bookRoot: null,
    reportPath: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--contract') {
      args.contractPath = argv[++i];
    } else if (arg === '--book-root') {
      args.bookRoot = argv[++i];
    } else if (arg === '--report') {
      args.reportPath = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      usage();
    } else {
      usage();
    }
  }
  return args;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function normalize(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&ndash;|&#8211;/gi, '-')
    .replace(/&mdash;|&#8212;/gi, '-')
    .replace(/&minus;|&#8722;/gi, '-')
    .replace(/&euro;|&#8364;/gi, 'euro')
    .toLowerCase();
}

function containsNeedle(haystack, needle) {
  return normalize(haystack).includes(normalize(needle));
}

function containsAny(haystack, needles) {
  return needles.some((needle) => containsNeedle(haystack, needle));
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function writeJson(file, data) {
  ensureDir(file);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function loadProcedureData(file) {
  const code = readText(file);
  const fn = new Function(`${code}\nreturn PROCEDURE_DATA;`);
  return fn();
}

function qualityRefCount(text, key) {
  const m = text.match(new RegExp(`${key}:\\s*(\\d+)`));
  return m ? Number(m[1]) : null;
}

function correctOptionText(step) {
  const correct = Array.isArray(step.options)
    ? step.options.find((option) => option && option.correct === true)
    : null;
  return correct ? String(correct.text || '') : '';
}

function gitHash(repoRoot) {
  try {
    const { execSync } = require('child_process');
    return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch (_) {
    return null;
  }
}

function validateContract(contract, bookRoot) {
  const checks = [];
  const failures = [];
  const stepIds = contract.steps.map((step) => step.formal_step_id);

  function addCheck(surfaceId, checkId, status, detail, extra = {}) {
    const check = {
      contract_id: contract.contract_id,
      surface_id: surfaceId,
      check_id: checkId,
      status,
      detail,
      ...extra,
    };
    checks.push(check);
    if (status === 'failed') failures.push(check);
  }

  for (const surface of contract.required_surfaces || []) {
    const fullPath = path.join(bookRoot, surface.path);
    if (!fs.existsSync(fullPath)) {
      addCheck(surface.id, 'surface_exists', 'failed', `Missing surface ${surface.path}`);
      continue;
    }
    addCheck(surface.id, 'surface_exists', 'passed', `Found ${surface.path}`);
    const text = readText(fullPath);

    if (surface.scan_legacy && Array.isArray(contract.forbidden_legacy_patterns)) {
      for (const pattern of contract.forbidden_legacy_patterns) {
        const found = containsNeedle(text, pattern);
        addCheck(
          surface.id,
          `forbidden_legacy:${pattern}`,
          found ? 'failed' : 'passed',
          found ? `Forbidden legacy wording found: ${pattern}` : `Legacy wording absent: ${pattern}`
        );
      }
    }

    if (surface.student_facing && Array.isArray(contract.student_facing_forbidden_codes)) {
      for (const code of contract.student_facing_forbidden_codes) {
        const found = containsNeedle(text, code);
        addCheck(
          surface.id,
          `student_code_leak:${code}`,
          found ? 'failed' : 'passed',
          found ? `Student-facing internal code found: ${code}` : `Student-facing internal code absent: ${code}`
        );
      }
    }

    if (surface.require_step_keywords) {
      for (const step of contract.steps) {
        const ok = containsAny(text, step.required_surface_keywords || [step.student_label]);
        addCheck(
          surface.id,
          `step_keywords:${step.formal_step_id}`,
          ok ? 'passed' : 'failed',
          ok
            ? `Surface contains keyword for ${step.formal_step_id}`
            : `Surface misses keyword for ${step.formal_step_id}: ${(step.required_surface_keywords || []).join(' | ')}`
        );
      }
    }

    if (surface.quality_ref) {
      const actual = qualityRefCount(text, contract.quality_ref_key);
      addCheck(
        surface.id,
        'quality_ref_step_count',
        actual === contract.canonical_step_count ? 'passed' : 'failed',
        actual === null
          ? `Missing quality-ref key ${contract.quality_ref_key}`
          : `${contract.quality_ref_key}=${actual}, expected ${contract.canonical_step_count}`,
        { expected: contract.canonical_step_count, actual }
      );
    }

    if (surface.procedure_data) {
      let data;
      try {
        data = loadProcedureData(fullPath);
      } catch (error) {
        addCheck(surface.id, 'procedure_data_parse', 'failed', error.message);
        continue;
      }
      addCheck(surface.id, 'procedure_data_parse', 'passed', 'Procedure data parsed');
      const procedures = Array.isArray(data.procedures) ? data.procedures : [];
      const procedure = procedures.find((item) => item && item.id === contract.procedure_id);
      if (!procedure) {
        addCheck(surface.id, 'procedure_exists', 'failed', `Missing procedure ${contract.procedure_id}`);
        continue;
      }
      addCheck(surface.id, 'procedure_exists', 'passed', `Found procedure ${contract.procedure_id}`);

      if (contract.procedure_template_id) {
        const actualTemplate = procedure.procedure_template_id || null;
        addCheck(
          surface.id,
          'procedure_template_id',
          actualTemplate === contract.procedure_template_id ? 'passed' : 'failed',
          `procedure_template_id=${actualTemplate || '<missing>'}, expected ${contract.procedure_template_id}`,
          { expected: contract.procedure_template_id, actual: actualTemplate }
        );
      }

      const chooseSteps = Array.isArray(procedure.steps)
        ? procedure.steps.filter((step) => step && step.type === 'choose')
        : [];
      addCheck(
        surface.id,
        'procedure_choose_step_count',
        chooseSteps.length === contract.canonical_step_count ? 'passed' : 'failed',
        `choose step count=${chooseSteps.length}, expected ${contract.canonical_step_count}`,
        { expected: contract.canonical_step_count, actual: chooseSteps.length }
      );

      const actualFormalIds = chooseSteps.map((step) => step.formal_step_id || null);
      if (contract.formal_step_ids_required) {
        const missingFormalId = actualFormalIds.some((id) => typeof id !== 'string' || id.length === 0);
        addCheck(
          surface.id,
          'formal_step_ids_present',
          missingFormalId ? 'failed' : 'passed',
          missingFormalId ? `formal_step_id missing in ${actualFormalIds.join(', ')}` : 'All choose steps have formal_step_id',
          { actual: actualFormalIds }
        );
        const sameOrder = JSON.stringify(actualFormalIds) === JSON.stringify(stepIds);
        addCheck(
          surface.id,
          'formal_step_id_order',
          sameOrder ? 'passed' : 'failed',
          `formal_step_ids=${actualFormalIds.join(' > ')}, expected ${stepIds.join(' > ')}`,
          { expected: stepIds, actual: actualFormalIds }
        );
      }

      contract.steps.forEach((step, index) => {
        const choose = chooseSteps[index];
        if (!choose) return;
        const labelText = `${choose.label || ''} ${correctOptionText(choose)}`;
        const ok = containsAny(labelText, step.required_surface_keywords || [step.student_label]);
        addCheck(
          surface.id,
          `procedure_step_label:${step.formal_step_id}`,
          ok ? 'passed' : 'failed',
          ok
            ? `Procedure step ${index + 1} matches ${step.formal_step_id}`
            : `Procedure step ${index + 1} misses expected keyword(s): ${(step.required_surface_keywords || []).join(' | ')}`
        );
      });
    }
  }

  return { checks, failures };
}

function main() {
  const args = parseArgs(process.argv);
  const contractPath = path.resolve(args.contractPath);
  const contractSet = readJson(contractPath);
  const bookRoot = path.resolve(
    PLATFORM_ROOT,
    args.bookRoot || contractSet.default_book_root || '../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod'
  );

  if (!fs.existsSync(bookRoot)) {
    console.error(`ERROR Procedure contract validation: book root not found: ${bookRoot}`);
    process.exit(1);
  }

  const startedOn = new Date().toISOString();
  const allChecks = [];
  const allFailures = [];
  for (const contract of contractSet.contracts || []) {
    const result = validateContract(contract, bookRoot);
    allChecks.push(...result.checks);
    allFailures.push(...result.failures);
  }

  const report = {
    schema_version: 1,
    report_id: 'lesson-procedure-contract-validation',
    generated_by: 'scripts/validate-procedure-contracts.js',
    generated_on: startedOn,
    platform_repo_commit: gitHash(PLATFORM_ROOT),
    lesson_repo_commit: gitHash(path.resolve(PLATFORM_ROOT, '..', '4veco-lessen')),
    contract_path: path.relative(PLATFORM_ROOT, contractPath),
    book_root: bookRoot,
    contract_count: (contractSet.contracts || []).length,
    check_count: allChecks.length,
    failure_count: allFailures.length,
    status: allFailures.length === 0 ? 'passed' : 'failed',
    failures: allFailures,
    checks: allChecks,
  };

  if (args.reportPath) {
    writeJson(path.resolve(args.reportPath), report);
  }

  if (allFailures.length > 0) {
    console.error(`ERROR Procedure contract validation failed (${allFailures.length} failure(s))`);
    for (const failure of allFailures.slice(0, 20)) {
      console.error(`- ${failure.contract_id} / ${failure.surface_id} / ${failure.check_id}: ${failure.detail}`);
    }
    if (allFailures.length > 20) {
      console.error(`- ... ${allFailures.length - 20} more failure(s)`);
    }
    process.exit(1);
  }

  console.log(`OK Procedure contract validation passed (${allChecks.length} checks)`);
}

if (require.main === module) {
  main();
}
