#!/usr/bin/env node
/**
 * Build Book 1 paragraph 1.1.3 graphical-game data.
 *
 * This remains a bounded student-web MVP. It does not create adaptive behavior,
 * diagnostics, mastery routing, sequencing, AI use, summative use, PV machine
 * promotion, or student-facing PV projection.
 */

const fs = require('fs');
const path = require('path');

const PAR_NR = '1.1.3';
const PAR_NAME = 'Grafieken en tabellen';
const PLATFORM_ROOT = path.resolve(__dirname, '..', '..', '..');
const BOOK_ROOT = process.env.MODULE_ROOT
  ? path.resolve(process.env.MODULE_ROOT)
  : path.resolve(PLATFORM_ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const OUT_DIR = path.join(BOOK_ROOT, 'shared', 'graphical');
const OUT_FILE = path.join(OUT_DIR, `${PAR_NR}.js`);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function feedback(source, values, calculation) {
  return [
    { label: 'Bron', text: source },
    { label: 'Waarden', text: values },
    { label: 'Berekening', text: calculation },
  ];
}

const data = {
  schema_version: 1,
  meta: {
    parNr: PAR_NR,
    parName: PAR_NAME,
    title: 'Grafieken lezen'
  },
  aspect: 'grafische voorstelling',
  student_title: 'Grafieken en tabelwaarden lezen',
  student_subtitle: 'Lees eerst titel, assen en eenheid. Kies daarna pas waarden, punten of berekening.',
  internal_pv_boundary: {
    student_facing_pv_projection: false,
    pv_machine_promotion: false,
    adaptive_or_diagnostic_use: false,
    mastery_or_sequencing_use: false,
    ai_or_summative_use: false
  },
  challenges: [
    {
      id: 'table-ice-price-200',
      type: 'table_value_selection',
      title: 'Kies een tabelwaarde',
      prompt: 'Welke verkoop hoort in de tabel bij prijs EUR 2,00?',
      graph: {
        type: 'table',
        title: 'IJsjesverkoop per prijs',
        columns: ['Prijs', 'Verkoop per dag'],
        rows: [
          { values: ['EUR 1,00', '500 ijsjes'] },
          { values: ['EUR 1,50', '400 ijsjes'] },
          { values: ['EUR 2,00', '300 ijsjes'] },
          { values: ['EUR 2,50', '200 ijsjes'] }
        ]
      },
      task_shell: {
        family: 'table_value_selection',
        skillLabel: 'Tabelwaarde kiezen',
        purpose: 'Kies eerst de bronrij die de vraag noemt.',
        interaction: {
          inputLabel: 'Tabelwaarde',
          options: [
            { id: 'a', label: '400 ijsjes', description: 'Hoort bij EUR 1,50.' },
            { id: 'b', label: '300 ijsjes', description: 'Hoort bij EUR 2,00.' },
            { id: 'c', label: '200 ijsjes', description: 'Hoort bij EUR 2,50.' }
          ]
        },
        expected: { kind: 'choice', value: 'b' },
        feedback: {
          matchTitle: 'Juiste tabelrij gekozen',
          matchText: 'Je koppelt de prijs aan de juiste verkoopwaarde.',
          retryTitle: 'Zoek de rij opnieuw',
          retryText: 'Lees eerst de prijskolom en neem daarna de verkoopwaarde uit dezelfde rij.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De tabel toont prijzen en verkoop per dag.',
        'Bij EUR 2,00 staat 300 ijsjes in dezelfde rij.',
        'Kies de waarde uit de bron voordat je gaat rekenen.'
      )
    },
    {
      id: 'bar-ice-quantity-200',
      type: 'bar_value_read',
      title: 'Lees een waarde uit de grafiek',
      prompt: 'Hoeveel ijsjes worden verkocht bij prijs EUR 2,00?',
      graph: {
        type: 'bar',
        title: 'IJsjesverkoop per prijs',
        x_label: 'prijs',
        y_label: 'aantal verkocht',
        unit: 'ijsjes',
        series: [
          { label: 'EUR 1,00', value: 500 },
          { label: 'EUR 1,50', value: 400 },
          { label: 'EUR 2,00', value: 300 },
          { label: 'EUR 2,50', value: 200 },
          { label: 'EUR 3,00', value: 100 }
        ]
      },
      task_shell: {
        family: 'graph_reading',
        skillLabel: 'Grafiek aflezen',
        purpose: 'Lees titel, horizontale as, verticale as en eenheid.',
        interaction: {
          inputLabel: 'Afgelezen waarde',
          placeholder: 'Typ alleen het getal'
        },
        expected: { kind: 'number', value: 300, unit: 'ijsjes', tolerance: 0 },
        feedback: {
          matchTitle: 'Goed afgelezen',
          matchText: 'Bij EUR 2,00 hoort de staaf van 300 ijsjes.',
          retryTitle: 'Lees de staaf opnieuw',
          retryText: 'Zoek EUR 2,00 op de horizontale as en lees de hoogte af.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De grafiek toont ijsjesverkoop bij verschillende prijzen.',
        'Zoek het label EUR 2,00. De staaf hoort bij 300 ijsjes.',
        'Er is hier geen formule nodig. Je leest de bronwaarde af.'
      )
    },
    {
      id: 'axis-price-quantity',
      type: 'axis_convention_check',
      title: 'Controleer de assenafspraak',
      prompt: 'Welke as gebruik je voor prijs en welke as voor hoeveelheid in deze vraag?',
      graph: {
        type: 'bar',
        title: 'Vraag naar bioscoopkaartjes',
        x_label: 'prijs',
        y_label: 'aantal kaartjes',
        unit: 'kaartjes',
        show_value_labels: false,
        y_ticks: [0, 50, 100, 150, 200],
        series: [
          { label: 'EUR 6', value: 180 },
          { label: 'EUR 8', value: 140 },
          { label: 'EUR 10', value: 100 },
          { label: 'EUR 12', value: 60 }
        ]
      },
      task_shell: {
        family: 'graph_construction_substitute',
        skillLabel: 'Asafspraak gebruiken',
        purpose: 'Kies de assen, plaats twee bronpunten en trek de vraaglijn.',
        prompt: 'Maak een eenvoudige P-Q-grafiek bij de tabel met bioscoopkaartjes.',
        interaction: {
          workspaceTitle: 'Grafiekwerkvlak',
          xAxisLabel: 'Horizontale as',
          yAxisLabel: 'Verticale as',
          pointRowsLabel: 'Punten uit de tabel',
          lineConfirmationLabel: 'Trek lijn door punten',
          lineShapeLabel: 'Lijnvorm',
          xInputLabel: 'Prijs',
          yInputLabel: 'Aantal kaartjes',
          emptyGraphAltText: 'Leeg P-Q-diagram met raster voor bioscoopkaartjes.',
          pointCount: 2,
          axes: {
            x: {
              label: 'Prijs (EUR)',
              min: 0,
              max: 12,
              ticks: [0, 6, 8, 10, 12],
              tickDecimals: 0
            },
            y: {
              label: 'Aantal kaartjes',
              min: 0,
              max: 200,
              ticks: [0, 60, 100, 140, 180, 200],
              tickDecimals: 0
            }
          },
          axisOptions: [
            { id: 'prijs', label: 'Prijs P', value: 'prijs' },
            { id: 'hoeveelheid', label: 'Hoeveelheid Q', value: 'hoeveelheid' },
            { id: 'omzet', label: 'Omzet', value: 'omzet' },
            { id: 'tijd', label: 'Tijd', value: 'tijd' }
          ]
        },
        expected: {
          kind: 'graph_construction_substitute',
          axes: {
            xAccepted: ['prijs p', 'prijs', 'p'],
            yAccepted: ['hoeveelheid q', 'hoeveelheid', 'q', 'aantal kaartjes', 'aantal']
          },
          points: [
            { x: 6, y: 180 },
            { x: 12, y: 60 }
          ],
          toleranceX: 0.01,
          toleranceY: 0.01,
          lineShape: 'decreasing'
        },
        feedback: {
          matchTitle: 'Grafiekopzet klopt',
          matchText: 'Je gebruikt prijs horizontaal, hoeveelheid verticaal, twee tabelpunten en een dalende lijn.',
          retryTitle: 'Controleer assen en punten',
          retryText: 'Prijs hoort op de horizontale as. Plaats twee punten uit de tabel en kies een dalende lijn.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De horizontale as toont de prijs.',
        'De verticale as toont het aantal kaartjes.',
        'Een punt heeft dus prijs als x-waarde en hoeveelheid als y-waarde.'
      )
    },
    {
      id: 'line-broodjes-interpolation',
      type: 'interpolation_read',
      title: 'Schat tussen twee punten',
      prompt: 'Schat de prijs bij 175 broodjes.',
      graph: {
        type: 'line',
        title: 'Broodjesverkoop',
        x_label: 'hoeveelheid',
        y_label: 'prijs',
        unit: 'euro',
        show_value_labels: false,
        y_ticks: [2, 2.5, 3, 3.5, 4],
        series: [
          { label: '100 broodjes', value: 4.00 },
          { label: '150 broodjes', value: 3.50 },
          { label: '200 broodjes', value: 3.00 },
          { label: '250 broodjes', value: 2.50 },
          { label: '300 broodjes', value: 2.00 }
        ]
      },
      task_shell: {
        family: 'graph_reading',
        skillLabel: 'Interpoleren in een grafiek',
        purpose: 'Schat een waarde tussen twee bekende punten op de lijn.',
        interaction: {
          inputLabel: 'Geschatte prijs',
          placeholder: 'Typ de prijs'
        },
        expected: { kind: 'number', value: 3.25, unit: 'euro', tolerance: 0.1 },
        feedback: {
          matchTitle: 'Goede schatting',
          matchText: '175 ligt halverwege 150 en 200 broodjes; de prijs ligt rond EUR 3,25.',
          retryTitle: 'Schat tussen de punten',
          retryText: 'Zoek 150 en 200 broodjes en neem ongeveer het midden van EUR 3,50 en EUR 3,00.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De grafiek toont minder labels: je moet tussen twee punten schatten.',
        '175 broodjes ligt halverwege 150 en 200 broodjes.',
        'Halverwege EUR 3,50 en EUR 3,00 ligt ongeveer EUR 3,25.'
      )
    },
    {
      id: 'point-demand-price-10',
      type: 'point_placement',
      title: 'Plaats een punt als coördinaten',
      prompt: 'Welk punt hoort bij prijs EUR 10 en 100 kaartjes?',
      graph: {
        type: 'table',
        title: 'Vraag naar bioscoopkaartjes',
        columns: ['Prijs', 'Aantal kaartjes'],
        rows: [
          { values: ['EUR 6', '180'] },
          { values: ['EUR 8', '140'] },
          { values: ['EUR 10', '100'] },
          { values: ['EUR 12', '60'] }
        ]
      },
      task_shell: {
        family: 'point_placement',
        skillLabel: 'Punt plaatsen',
        purpose: 'Gebruik prijs als x-waarde en aantal als y-waarde.',
        interaction: {
          xLabel: 'x-waarde: prijs',
          yLabel: 'y-waarde: aantal'
        },
        expected: { kind: 'point', x: 10, y: 100, toleranceX: 0, toleranceY: 0 },
        feedback: {
          matchTitle: 'Punt klopt',
          matchText: 'Het punt is (10, 100): prijs op de horizontale as en aantal op de verticale as.',
          retryTitle: 'Controleer de asvolgorde',
          retryText: 'Prijs is de x-waarde; aantal kaartjes is de y-waarde.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De tabel geeft de bronwaarden voor een punt.',
        'Prijs EUR 10 wordt x = 10 en 100 kaartjes wordt y = 100.',
        'Een grafiekpunt noteer je als (x, y).'
      )
    },
    {
      id: 'bar-ice-percentage-change',
      type: 'graph_values_percentage_change',
      title: 'Gebruik twee bronwaarden',
      prompt: 'Bereken de procentuele verandering van EUR 1,00 naar EUR 2,00.',
      graph: {
        type: 'bar',
        title: 'IJsjesverkoop per prijs',
        x_label: 'prijs',
        y_label: 'aantal verkocht',
        unit: 'ijsjes',
        series: [
          { label: 'EUR 1,00', value: 500 },
          { label: 'EUR 1,50', value: 400 },
          { label: 'EUR 2,00', value: 300 },
          { label: 'EUR 2,50', value: 200 },
          { label: 'EUR 3,00', value: 100 }
        ]
      },
      task_shell: {
        family: 'calculation_work_capture',
        skillLabel: 'Bronwaarden gebruiken',
        purpose: 'Laat zien welke bronwaarden je gebruikt en hoe je rekent.',
        interaction: {
          workLabel: 'Berekening met bronwaarden',
          finalAnswerLabel: 'Eindantwoord met procentteken',
          finalAnswerPlaceholder: 'Bijvoorbeeld -40%'
        },
        expected: {
          kind: 'self_check',
          criteria: [
            'Oud = 500 ijsjes en nieuw = 300 ijsjes.',
            'Berekening gebruikt (nieuw - oud) / oud x 100%.',
            'Eindantwoord: -40%, dus de verkoop daalt met 40%.'
          ]
        },
        feedback: {
          selfCheckTitle: 'Controleer je berekening',
          selfCheckText: 'Vergelijk je werk met de bronwaarden en de procentregel.',
          retryTitle: 'Schrijf eerst je berekening',
          retryText: 'Noteer oud, nieuw en de rekenstap voordat je vergelijkt.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De vraag vergelijkt de verkoop bij EUR 1,00 met de verkoop bij EUR 2,00.',
        'Oud = 500 ijsjes en nieuw = 300 ijsjes. Het verschil is -200.',
        '-200 / 500 x 100% = -40%. De verkoop daalt met 40%.'
      )
    },
    {
      id: 'line-water-index',
      type: 'line_value_read',
      title: 'Lees een indexachtige waarde',
      prompt: 'Wat is de verkoopindex in juni als januari 100 is?',
      target_label: 'juni',
      graph: {
        type: 'line',
        title: 'Verkoopindex flesjes water',
        x_label: 'periode',
        y_label: 'index',
        unit: 'index',
        series: [
          { label: 'januari', value: 100 },
          { label: 'juni', value: 70 }
        ]
      },
      task_shell: {
        family: 'graph_reading',
        skillLabel: 'Indexgrafiek aflezen',
        purpose: 'Lees de waarde en houd de indexnotatie apart van procenten.',
        interaction: {
          inputLabel: 'Afgelezen index',
          placeholder: 'Typ de index'
        },
        expected: { kind: 'number', value: 70, unit: 'index', tolerance: 0 },
        feedback: {
          matchTitle: 'Index goed afgelezen',
          matchText: 'Het punt bij juni staat op index 70.',
          retryTitle: 'Lees de index opnieuw',
          retryText: 'Zoek juni op de horizontale as en lees de indexwaarde af.'
        },
        practiceRoute: { label: 'Oefen verder in grafiekenspel', href: '#g-app' }
      },
      feedback_steps: feedback(
        'De grafiek gebruikt januari als basis: januari = 100.',
        'Het punt bij juni staat op 70.',
        'Index 70 betekent dat de verkoop 30% lager is dan in januari.'
      )
    }
  ]
};

ensureDir(OUT_DIR);
fs.writeFileSync(
  OUT_FILE,
  'var GRAPHICAL_GAME_DATA = ' + JSON.stringify(data, null, 2) + ';\n',
  'utf8'
);
console.log('write ' + path.relative(path.resolve(PLATFORM_ROOT, '..'), OUT_FILE));
