#!/usr/bin/env node
/**
 * Build procedure-game data for 1.1.1 Schaarste en economisch denken.
 *
 * This keeps the lesson target generated from platform-owned source and adds
 * formal PV step IDs for the L-PV proof track.
 */
const fs = require('fs');
const path = require('path');

const PLATFORM_ROOT = path.resolve(__dirname, '..', '..', '..');
const BOOK_ROOT = process.env.BOOK_ROOT
  ? path.resolve(process.env.BOOK_ROOT)
  : path.resolve(PLATFORM_ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const SHARED_PROCEDURE_DIR = path.join(BOOK_ROOT, 'shared', 'procedure');
const OUT_FILE = path.join(SHARED_PROCEDURE_DIR, '1.1.1.js');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function given(label, text) {
  return { type: 'given', label, text };
}

function choose(label, formalStepId, correct, wrongs) {
  return {
    type: 'choose',
    label,
    formal_step_id: formalStepId,
    options: [
      { text: correct, correct: true },
      { text: wrongs[0].text, correct: false, feedback: wrongs[0].feedback },
      { text: wrongs[1].text, correct: false, feedback: wrongs[1].feedback },
    ],
  };
}

function buildData() {
  return {
    meta: {
      parNr: '1.1.1',
      parName: 'Schaarste en economisch denken',
    },
    procedures: [
      {
        id: 'altkosten-berekenen',
        title: 'Alternatieve kosten berekenen',
        icon: 'fa-scale-balanced',
        procedure_template_id: 'choose_by_opportunity_cost_flow',
        description: 'Bepaal in vier stappen de alternatieve kosten van een keuze.',
        steps: [
          given(
            'Gegeven',
            'Een schaars middel (tijd, geld, grondstoffen)\nen meerdere mogelijke manieren om het in te zetten,\nmet de opbrengst (of waarde) per alternatief.'
          ),
          choose(
            'Stap 1',
            'list_alternatives',
            'Benoem alle beschikbare alternatieven\nvoor het schaarse middel',
            [
              {
                text: 'Bereken direct de opbrengst van het gekozen alternatief',
                feedback: 'Je moet eerst weten welke alternatieven er zijn.\nZonder alternatieven zijn er ook geen alternatieve kosten.',
              },
              {
                text: 'Bereken het verschil tussen twee willekeurige opties',
                feedback: 'Verschillen bereken je pas in stap 4.\nBegin met alle alternatieven in kaart te brengen.',
              },
            ]
          ),
          choose(
            'Stap 2',
            'calculate_payoffs',
            'Bereken voor elk alternatief de opbrengst\n(of verwachte waarde)',
            [
              {
                text: 'Bereken alleen de opbrengst van het duurste alternatief',
                feedback: 'Je hebt alle opbrengsten nodig om te weten\nwelk niet-gekozen alternatief het beste is.',
              },
              {
                text: 'Tel alle niet-gekozen opbrengsten op',
                feedback: 'Alternatieve kosten zijn niet de som van niet-gekozen alternatieven.\nEen alternatief telt: het beste niet-gekozen.',
              },
            ]
          ),
          choose(
            'Stap 3',
            'rank_not_chosen',
            'Rangschik de alternatieven; het niet-gekozen alternatief\nmet de hoogste opbrengst zijn de alternatieve kosten',
            [
              {
                text: 'De alternatieve kosten zijn het gemiddelde\nvan de niet-gekozen opbrengsten',
                feedback: 'Geen gemiddelde: alternatieve kosten zijn de opbrengst\nvan een specifiek alternatief: het beste niet-gekozen.',
              },
              {
                text: 'De alternatieve kosten zijn de prijs\ndie je voor het gekozen alternatief betaalt',
                feedback: 'Klassieke misconceptie: alternatieve kosten zijn niet hetzelfde als prijs.\nHet gaat om wat je opgeeft, niet wat je betaalt.',
              },
            ]
          ),
          choose(
            'Stap 4',
            'interpret_net_choice_value',
            'Vergelijk de opbrengst van de gekozen optie met\nde alternatieve kosten om de nettowaarde te beoordelen',
            [
              {
                text: 'Verhoog de alternatieve kosten met een risicopremie',
                feedback: 'Risicopremies komen bij een ander onderwerp.\nVoor deze procedure is stap 4: opbrengst minus alternatieve kosten.',
              },
              {
                text: 'Deel de opbrengst door de alternatieve kosten',
                feedback: 'Niet delen, maar vergelijken.\nNettowaarde = opbrengst gekozen alternatief minus alternatieve kosten.',
              },
            ]
          ),
          given(
            'Resultaat',
            'Je hebt de alternatieve kosten bepaald als de opbrengst\nvan het beste niet-gekozen alternatief.\nDe nettowaarde van je keuze is:\nopbrengst gekozen alternatief minus alternatieve kosten.'
          ),
        ],
      },
    ],
  };
}

function main() {
  ensureDir(SHARED_PROCEDURE_DIR);
  const header = [
    '// AUTO-GENERATED by 4veco-platform/build-scripts/content/book-1/b1-111-procedure-data.js',
    '// Do not edit this generated lesson-target file directly.',
    '',
  ].join('\n');
  fs.writeFileSync(OUT_FILE, `${header}var PROCEDURE_DATA = ${JSON.stringify(buildData(), null, 2)};\n`, 'utf8');
  console.log(`write ${path.relative(path.resolve(PLATFORM_ROOT, '..'), OUT_FILE)}`);
}

if (require.main === module) {
  main();
}
