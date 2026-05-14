'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VALIDATOR = path.resolve(__dirname, '..', 'validate-procedure-contracts.js');
const TMP = path.resolve(__dirname, '..', '..', 'tmp', 'test-procedure-contracts');

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function run(contractPath, bookRoot) {
  const result = spawnSync(process.execPath, [
    VALIDATOR,
    '--contract', contractPath,
    '--book-root', bookRoot,
  ], {
    encoding: 'utf8',
    timeout: 10000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    exitCode: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

function baseContract() {
  return {
    schema_version: 1,
    default_book_root: TMP,
    contracts: [
      {
        contract_id: 'test-b02',
        par_nr: '9.9.1',
        par_name: 'Test',
        procedure_id: 'altkosten-berekenen',
        procedure_template_id: 'choose_by_opportunity_cost_flow',
        quality_ref_key: 'procedure_b02_step_count',
        canonical_step_count: 4,
        formal_step_ids_required: true,
        steps: [
          { formal_step_id: 'list_alternatives', student_label: 'Benoem alternatieven', required_surface_keywords: ['alternatieven'] },
          { formal_step_id: 'calculate_payoffs', student_label: 'Bereken opbrengsten', required_surface_keywords: ['opbrengst'] },
          { formal_step_id: 'rank_not_chosen', student_label: 'Rangschik', required_surface_keywords: ['beste niet-gekozen'] },
          { formal_step_id: 'interpret_net_choice_value', student_label: 'Nettowaarde', required_surface_keywords: ['nettowaarde'] },
        ],
        required_surfaces: [
          { id: 'student_page', path: 'student.html', student_facing: true, require_step_keywords: true, scan_legacy: true },
          { id: 'quality_ref', path: 'quality-ref.yaml', student_facing: false, quality_ref: true },
          { id: 'procedure_game_data', path: 'shared/procedure/9.9.1.js', student_facing: true, procedure_data: true, scan_legacy: true },
        ],
        student_facing_forbidden_codes: ['B02'],
        forbidden_legacy_patterns: ['drie stappen'],
      },
    ],
  };
}

function writeContract(contract = baseContract()) {
  const contractPath = path.join(TMP, 'contract.json');
  writeText(contractPath, `${JSON.stringify(contract, null, 2)}\n`);
  return contractPath;
}

function writeProcedureData(stepIds = ['list_alternatives', 'calculate_payoffs', 'rank_not_chosen', 'interpret_net_choice_value'], description = 'Bepaal in vier stappen de alternatieve kosten.') {
  const steps = stepIds.map((formalStepId, index) => ({
    type: 'choose',
    label: `Stap ${index + 1}`,
    formal_step_id: formalStepId,
    options: [
      {
        text: [
          'Benoem alternatieven',
          'Bereken opbrengst',
          'Bepaal beste niet-gekozen alternatief',
          'Bereken nettowaarde',
        ][index],
        correct: true,
      },
    ],
  }));
  writeText(
    path.join(TMP, 'shared', 'procedure', '9.9.1.js'),
    `var PROCEDURE_DATA = ${JSON.stringify({
      procedures: [{
        id: 'altkosten-berekenen',
        procedure_template_id: 'choose_by_opportunity_cost_flow',
        description,
        steps,
      }],
    }, null, 2)};\n`
  );
}

function setupValidBook() {
  fs.rmSync(TMP, { recursive: true, force: true });
  writeText(
    path.join(TMP, 'student.html'),
    'Alternatieven benoemen. Opbrengst berekenen. Beste niet-gekozen alternatief bepalen. Nettowaarde berekenen.'
  );
  writeText(path.join(TMP, 'quality-ref.yaml'), 'procedure_b02_step_count: 4\n');
  writeProcedureData();
  return writeContract();
}

describe('validate-procedure-contracts', () => {
  test('passes a complete contract with formal step order', () => {
    const contractPath = setupValidBook();
    const result = run(contractPath, TMP);
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain('OK Procedure contract validation passed');
  });

  test('fails when formal step order drifts with the same step count', () => {
    const contractPath = setupValidBook();
    writeProcedureData(['calculate_payoffs', 'list_alternatives', 'rank_not_chosen', 'interpret_net_choice_value']);
    const result = run(contractPath, TMP);
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain('formal_step_id_order');
  });

  test('fails on student-facing internal code leakage', () => {
    const contractPath = setupValidBook();
    writeText(
      path.join(TMP, 'student.html'),
      'Alternatieven, opbrengst, beste niet-gekozen alternatief, nettowaarde. B02'
    );
    const result = run(contractPath, TMP);
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain('student_code_leak:B02');
  });

  test('fails on legacy three-step wording', () => {
    const contractPath = setupValidBook();
    writeText(
      path.join(TMP, 'student.html'),
      'Alternatieven, opbrengst, beste niet-gekozen alternatief, nettowaarde. Je gebruikt drie stappen.'
    );
    const result = run(contractPath, TMP);
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain('forbidden_legacy:drie stappen');
  });
});
