#!/usr/bin/env node
/**
 * Build Book 1 paragraph 1.1.2 graphical-game pilot data.
 *
 * This writes explicit student-web data only. It does not create an adaptive
 * advisor, diagnostic layer, PV projection, or broad random challenge universe.
 */

const fs = require('fs');
const path = require('path');

const PAR_NR = '1.1.2';
const PAR_NAME = 'Percentages en indexcijfers';
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
    student_title: 'Grafieken lezen met percentages',
    student_subtitle: 'Lees eerst de bron, kies dan de waarden en reken daarna pas verder.',
    internal_pv_boundary: {
        student_facing_pv_projection: false,
        pv_machine_promotion: false,
        adaptive_or_diagnostic_use: false,
        mastery_or_sequencing_use: false,
        ai_or_summative_use: false
    },
    challenges: [
        {
            id: 'bar-smartphones-2025',
            type: 'bar_value_read',
            title: 'Lees een staaf af',
            prompt: 'Hoeveel smartphones zijn er in 2025 verkocht?',
            target_label: '2025',
            graph: {
                type: 'bar',
                title: 'Verkoop smartphones',
                x_label: 'jaar',
                y_label: 'aantal',
                unit: 'stuks',
                series: [
                    { label: '2023', value: 120 },
                    { label: '2024', value: 150 },
                    { label: '2025', value: 180 }
                ]
            },
            expected_answer: { kind: 'number', value: 180, unit: 'stuks', tolerance: 0 },
            feedback_steps: feedback(
                'Kijk naar de titel en de x-as: de grafiek gaat over smartphoneverkoop per jaar.',
                'Zoek het label 2025 en lees de hoogte van die staaf af: 180.',
                'Er is hier geen formule nodig. De gevraagde waarde staat direct in de grafiek.'
            )
        },
        {
            id: 'line-index-2024',
            type: 'line_value_read',
            title: 'Lees een lijn af',
            prompt: 'Wat is het indexcijfer in 2024?',
            target_label: '2024',
            graph: {
                type: 'line',
                title: 'Prijsindex boodschappen',
                x_label: 'jaar',
                y_label: 'index',
                unit: 'index',
                series: [
                    { label: '2021', value: 100 },
                    { label: '2022', value: 108 },
                    { label: '2023', value: 125 },
                    { label: '2024', value: 135 }
                ]
            },
            expected_answer: { kind: 'number', value: 135, unit: 'index', tolerance: 0 },
            feedback_steps: feedback(
                'De grafiek geeft indexcijfers van het boodschappenmandje.',
                'Bij 2024 hoort het punt op 135.',
                'Index 135 betekent 35% hoger dan het basisjaar.'
            )
        },
        {
            id: 'bar-smartphones-percentage-change',
            type: 'graph_values_percentage_change',
            title: 'Gebruik twee staven',
            prompt: 'Bereken de procentuele verandering van 2023 naar 2024.',
            graph: {
                type: 'bar',
                title: 'Verkoop smartphones',
                x_label: 'jaar',
                y_label: 'aantal',
                unit: 'stuks',
                series: [
                    { label: '2023', value: 120 },
                    { label: '2024', value: 150 },
                    { label: '2025', value: 180 }
                ]
            },
            expected_answer: {
                kind: 'percentage_change',
                old_label: '2023',
                new_label: '2024',
                value: 25,
                unit: '%',
                tolerance: 0.1
            },
            feedback_steps: feedback(
                'De vraag vergelijkt 2023 met 2024, dus 2023 is de oude waarde.',
                'Oud = 120 en nieuw = 150. Het verschil is 30.',
                '30 / 120 x 100% = 25%. De verkoop stijgt met 25%.'
            )
        },
        {
            id: 'line-index-percentage-change',
            type: 'graph_values_percentage_change',
            title: 'Indexpunten zijn nog geen procenten',
            prompt: 'Bereken de procentuele verandering van index 125 naar index 135.',
            graph: {
                type: 'line',
                title: 'Prijsindex boodschappen',
                x_label: 'jaar',
                y_label: 'index',
                unit: 'index',
                series: [
                    { label: '2021', value: 100 },
                    { label: '2022', value: 108 },
                    { label: '2023', value: 125 },
                    { label: '2024', value: 135 }
                ]
            },
            expected_answer: {
                kind: 'percentage_change',
                old_label: '2023',
                new_label: '2024',
                value: 8,
                unit: '%',
                tolerance: 0.1
            },
            feedback_steps: feedback(
                'De bron is een indexgrafiek. Je vergelijkt het indexcijfer van 2023 met dat van 2024.',
                'Oud = 125 en nieuw = 135. Het verschil is 10 indexpunten.',
                '10 / 125 x 100% = 8%. Dat is 10 indexpunten, maar 8 procent.'
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
