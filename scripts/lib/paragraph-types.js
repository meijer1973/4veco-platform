'use strict';

const PARA_TYPES = Object.freeze({
  consolidation: Object.freeze({
    pattern: /gemengde\s+opgaven/i,
    requiredMd: Object.freeze(['opgaven', 'antwoorden']),
    requiredPdf: Object.freeze(['opgaven', 'antwoorden']),
    label: 'consolidation',
  }),
  'testprep-summary': Object.freeze({
    pattern: /actieve\s+samenvatting/i,
    requiredMd: Object.freeze(['samenvatting', 'antwoorden']),
    requiredPdf: Object.freeze(['samenvatting', 'antwoorden']),
    label: 'test prep summary',
  }),
  'testprep-examskills': Object.freeze({
    pattern: /examenvaardigheden/i,
    requiredMd: Object.freeze(['opgaven', 'antwoorden']),
    requiredPdf: Object.freeze(['opgaven', 'antwoorden']),
    label: 'test prep exam skills',
  }),
  'testprep-integration': Object.freeze({
    pattern: /integratieoefening/i,
    requiredMd: Object.freeze(['opgaven', 'antwoorden']),
    requiredPdf: Object.freeze(['opgaven', 'antwoorden']),
    label: 'test prep integration',
  }),
  'testprep-practicetest': Object.freeze({
    pattern: /proeftoets/i,
    requiredMd: Object.freeze(['toets', 'antwoorden', 'toetsmatrijs']),
    requiredPdf: Object.freeze(['toets', 'antwoorden', 'toetsmatrijs']),
    label: 'test prep practice test',
  }),
  theory: Object.freeze({
    pattern: null,
    requiredMd: Object.freeze(['paragraaf', 'opgaven', 'antwoorden']),
    requiredPdf: Object.freeze(['paragraaf', 'opgaven', 'antwoorden']),
    label: 'theory',
  }),
});

function classifyParagraph(name) {
  for (const [type, spec] of Object.entries(PARA_TYPES)) {
    if (spec.pattern && spec.pattern.test(name)) return type;
  }
  return 'theory';
}

module.exports = {
  PARA_TYPES,
  classifyParagraph,
};
