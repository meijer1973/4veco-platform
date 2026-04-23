/* Current coverage: one generator for every active A-domain skill in the catalog. */
/**
 * SkillTree Generators — 37 exercise randomizers, one per unit.
 * Extracted from base-elements.js during the unit-catalog rewire.
 * Keyed by A01–A37 (CvTE domain A). Generator behaviour is unchanged;
 * only the key names differ from the legacy F/B/S/E scheme.
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.SKILL_TREE_GENERATORS = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /* ── helpers ─────────────────────────────────────────────── */
    var ri = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
    var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    var round1 = function (n) { return Math.round(n * 10) / 10; };
    var round2 = function (n) { return Math.round(n * 100) / 100; };

    /**
     * Build an MC step from a correct answer and distractor candidates.
     * Returns { q, mode:'mc', options:[4], correctIdx, hint, expl }.
     */
    var mcStep = function (q, correct, distractors, hint, expl) {
        var pool = [];
        for (var i = 0; i < distractors.length; i++) {
            if (distractors[i] !== correct) pool.push(distractors[i]);
        }
        // Deduplicate
        var seen = {};
        var unique = [];
        for (var j = 0; j < pool.length; j++) {
            var key = String(pool[j]);
            if (!seen[key]) { seen[key] = true; unique.push(pool[j]); }
        }
        // Pad if needed
        while (unique.length < 3) {
            var offset = ri(1, 5) * (Math.random() < 0.5 ? 1 : -1);
            var candidate = typeof correct === 'number' ? correct + offset : correct + '*';
            if (String(candidate) !== String(correct) && !seen[String(candidate)]) {
                seen[String(candidate)] = true;
                unique.push(candidate);
            }
        }
        var opts = unique.slice(0, 3);
        var insertAt = ri(0, 3);
        opts.splice(insertAt, 0, correct);
        return { q: q, mode: 'mc', options: opts, correctIdx: insertAt, hint: hint, expl: expl };
    };

    var GEN = {};

    GEN.A01 = function () {
        var slope = ri(2, 6), intercept = slope * ri(10, 25);
        var correct = -slope;
        var step3 = mcStep(
            'De vraaglijn is Qv = ' + intercept + ' + ? \u00D7 P. Wat is de co\u00EBffici\u00EBnt van P?',
            correct,
            [slope, -intercept, intercept, slope + 1, -(slope - 1)],
            'De vraag daalt, dus de co\u00EBffici\u00EBnt is negatief.',
            'Qv = ' + intercept + ' \u2212 ' + slope + 'P, dus de co\u00EBffici\u00EBnt is \u2212' + slope + '.'
        );
        return {
            context: 'De vraag naar een product daalt met ' + slope + ' stuks per euro prijsverhoging. Bij een prijs van \u20AC0 is de vraag ' + intercept + ' stuks.',
            steps: [
                { q: 'Hoeveel is de vraag bij P = 0?', a: intercept, hint: 'Dit staat direct in de opgave.', expl: 'Bij P = 0 is Qv = ' + intercept + '.' },
                { q: 'Met hoeveel stuks daalt de vraag per euro prijsverhoging?', a: slope, hint: 'Zoek het woord \'daalt\' in de tekst.', expl: 'Per euro stijging daalt de vraag met ' + slope + '.' },
                step3
            ]
        };
    };

    GEN.A02 = function () {
        var Q = ri(5, 20), b = ri(2, 5), d = ri(1, 4);
        var c = ri(10, 40), a = c + Q * (b + d);
        var orderStep = {
            q: 'Zet de oplosstappen in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Deel door de co\u00EBffici\u00EBnt van Q',
                'Breng Q-termen naar \u00E9\u00E9n kant',
                'Breng constanten naar de andere kant'
            ],
            correctOrder: [1, 2, 0],
            hint: 'Eerst verzamelen, dan isoleren, dan delen.',
            expl: 'Stap 1: Q-termen verzamelen \u2192 Stap 2: constanten apart \u2192 Stap 3: delen door co\u00EBffici\u00EBnt.'
        };
        return {
            context: 'Los op: ' + a + ' \u2212 ' + b + 'Q = ' + c + ' + ' + d + 'Q',
            steps: [
                orderStep,
                { q: 'Tel +' + b + 'Q bij beide kanten op. Hoeveel Q staat er rechts?', a: b + d, hint: 'Rechts stond ' + d + 'Q, daar komt ' + b + 'Q bij: ' + d + ' + ' + b + ' = ' + (b + d) + '.', expl: a + ' = ' + c + ' + ' + d + 'Q + ' + b + 'Q = ' + c + ' + ' + (b + d) + 'Q' },
                { q: 'Trek ' + c + ' af aan beide kanten: ' + a + ' \u2212 ' + c + ' = ?', a: a - c, hint: 'Trek ' + c + ' af van ' + a + '.', expl: a + ' \u2212 ' + c + ' = ' + (a - c) + ', dus ' + (b + d) + 'Q = ' + (a - c) },
                { q: 'Los op: ' + (b + d) + 'Q = ' + (a - c) + '. Q = ?', a: Q, hint: 'Deel ' + (a - c) + ' door ' + (b + d) + '.', expl: 'Q = ' + (a - c) + ' \u00F7 ' + (b + d) + ' = ' + Q }
            ]
        };
    };

    GEN.A03 = function () {
        var b = pick([2, 4, 5]), aOver = ri(10, 30), a = b * aOver;
        var coefQ = round2(1 / b);
        var correctCoef = -coefQ;
        var step2 = mcStep(
            'Wat is de co\u00EBffici\u00EBnt van Q?',
            correctCoef,
            [coefQ, -1 / (b + 1), 1 / b, -b, b],
            'Je deelt \u2212Q door ' + b + '. Let op: het teken blijft negatief.',
            'P = ' + aOver + ' \u2212 ' + coefQ + 'Q, dus de co\u00EBffici\u00EBnt is \u2212' + coefQ + '.'
        );
        return {
            context: 'Schrijf om: Qv = ' + a + ' \u2212 ' + b + 'P  \u2192  P = ?',
            steps: [
                { q: 'Herschrijf naar P = \u2026 Wat is de constante term?', a: aOver, hint: 'Isoleer ' + b + 'P aan \u00E9\u00E9n kant en deel alles door ' + b + '.', expl: b + 'P = ' + a + ' \u2212 Q \u2192 P = ' + a + '/' + b + ' \u2212 Q/' + b + ' \u2192 constante = ' + aOver },
                step2
            ]
        };
    };

    GEN.A04 = function () {
        var a = ri(30, 80), b = pick([2, 3, 4, 5]), Q = ri(3, 15);
        var ans = a - b * Q;
        var mcFirst = mcStep(
            'Wat bereken je eerst?',
            b + ' \u00D7 ' + Q,
            [a + ' \u2212 ' + b, a + ' \u00D7 ' + Q, Q + ' \u2212 ' + b, a + ' + ' + b],
            'Eerst vermenigvuldigen, dan aftrekken.',
            'Eerst ' + b + ' \u00D7 ' + Q + ' uitrekenen, dan pas aftrekken van ' + a + '.'
        );
        return {
            context: 'Gegeven: P = ' + a + ' \u2212 ' + b + 'Q. Bereken P als Q = ' + Q + '.',
            steps: [
                mcFirst,
                { q: 'Bereken ' + b + ' \u00D7 ' + Q + ' = ?', a: b * Q, hint: 'Vermenigvuldig ' + b + ' met ' + Q + '.', expl: b + ' \u00D7 ' + Q + ' = ' + (b * Q) },
                { q: 'P = ' + a + ' \u2212 ' + (b * Q) + ' = ?', a: ans, hint: 'Trek ' + (b * Q) + ' af van ' + a + '.', expl: 'P = ' + a + ' \u2212 ' + (b * Q) + ' = ' + ans }
            ]
        };
    };

    GEN.A10 = function () {
        var base = ri(4, 20) * 2, height = ri(4, 20) * 2;
        var area = 0.5 * base * height;
        return {
            context: 'Bereken de oppervlakte van een driehoek met basis = ' + base + ' en hoogte = ' + height + '.',
            steps: [
                { q: 'Bereken de oppervlakte (\u00BD \u00D7 basis \u00D7 hoogte).', a: area, hint: 'Oppervlakte = \u00BD \u00D7 ' + base + ' \u00D7 ' + height, expl: 'Oppervlakte = \u00BD \u00D7 ' + base + ' \u00D7 ' + height + ' = ' + area }
            ]
        };
    };

    GEN.A11 = function () {
        var a = ri(1, 4), b = ri(3, 12), c = ri(10, 100);
        var mcConst = mcStep(
            'Wat is de afgeleide van de constante ' + c + '?',
            0,
            [c, 1, -c, c / 2],
            'Wat gebeurt er met een constante bij differenti\u00EBren?',
            'De afgeleide van een constante is altijd 0.'
        );
        return {
            context: 'Bepaal de afgeleide van f(Q) = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '.',
            steps: [
                { q: 'Wat is de afgeleide van ' + a + 'Q\u00B2? Geef de co\u00EBffici\u00EBnt van Q.', a: 2 * a, hint: 'Bij differenti\u00EBren: vermenigvuldig de co\u00EBffici\u00EBnt met de macht.', expl: a + 'Q\u00B2 \u2192 ' + (2 * a) + 'Q' },
                { q: 'Wat is de afgeleide van ' + b + 'Q?', a: b, hint: 'De afgeleide van bQ is gewoon b.', expl: b + 'Q \u2192 ' + b },
                mcConst
            ]
        };
    };

    GEN.A05 = function () {
        var b = pick([2, 3, 4, 5]), alphaDiv = ri(8, 25), alpha = b * alphaDiv;
        var d = pick([1, 2, 3, 4]), cDiv = ri(3, 12), c = d * cDiv;
        var mcSnijpunt = mcStep(
            'Wat stel je gelijk aan nul om het snijpunt met de P-as te vinden?',
            'Q',
            ['Q', 'P', 'Qv \u2212 Qa', 'P \u2212 Q'],
            'Het snijpunt met de P-as is het punt waar de hoeveelheid nul is.',
            'Op de P-as is Q = 0. Je vult Q = 0 in om P te berekenen.'
        );
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nBepaal de snijpunten met de P-as.',
            steps: [
                mcSnijpunt,
                { q: 'Bij welke prijs is de gevraagde hoeveelheid nul? (snijpunt vraaglijn met P-as)', a: alphaDiv, hint: 'Vul Qv = 0 in en los op naar P.', expl: '0 = ' + alpha + ' \u2212 ' + b + 'P \u2192 P = ' + alpha + '/' + b + ' = ' + alphaDiv },
                { q: 'Bij welke prijs begint het aanbod? (snijpunt aanbodlijn met P-as)', a: cDiv, hint: 'Vul Qa = 0 in en los op naar P.', expl: '0 = \u2212' + c + ' + ' + d + 'P \u2192 P = ' + c + '/' + d + ' = ' + cDiv }
            ]
        };
    };

    GEN.A06 = function () {
        var b = ri(2, 5), d = ri(1, 4), Ps = ri(8, 25);
        var maxC = Math.min(50, d * Ps - 1);
        if (maxC < 2) return GEN.A06();
        var c = ri(2, maxC);
        var a = (b + d) * Ps - 2 * c;
        if (a <= 0) return GEN.A06();
        var alpha = a + c;
        var Qs = alpha - b * Ps;
        if (Qs <= 0) return GEN.A06();
        var orderEvenwicht = {
            q: 'Zet de stappen voor het berekenen van het marktevenwicht in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Vul P* in om Q* te berekenen',
                'Stel Qv = Qa',
                'Los op naar P'
            ],
            correctOrder: [1, 2, 0],
            hint: 'Eerst gelijkstellen, dan oplossen, dan invullen.',
            expl: 'Stap 1: Qv = Qa \u2192 Stap 2: los op naar P* \u2192 Stap 3: vul P* in voor Q*.'
        };
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P  en  Qa = \u2212' + c + ' + ' + d + 'P. Bereken het marktevenwicht.',
            steps: [
                orderEvenwicht,
                { q: 'Stel Qv = Qa en los op. P* = ?', a: Ps, hint: alpha + ' \u2212 ' + b + 'P = \u2212' + c + ' + ' + d + 'P \u2192 ' + (b + d) + 'P = ' + (alpha + c), expl: 'P* = ' + (alpha + c) + ' \u00F7 ' + (b + d) + ' = ' + Ps },
                { q: 'Q* = ?', a: Qs, hint: 'Vul P* in bij Qv: ' + alpha + ' \u2212 ' + b + '\u00D7' + Ps, expl: 'Q* = ' + Qs }
            ]
        };
    };

    GEN.A07 = function () {
        var a = ri(30, 80), b = ri(1, 4);
        var mcQ2 = mcStep(
            'Wat is de co\u00EBffici\u00EBnt van Q\u00B2?',
            -b,
            [b, -a, a, -(b + 1), b - 1],
            '\u2212' + b + 'Q \u00D7 Q = \u2212' + b + 'Q\u00B2. De co\u00EBffici\u00EBnt is negatief.',
            'TO = ' + a + 'Q \u2212 ' + b + 'Q\u00B2, dus de co\u00EBffici\u00EBnt van Q\u00B2 is \u2212' + b + '.'
        );
        return {
            context: 'De vraaglijn is P = ' + a + ' \u2212 ' + b + 'Q. Stel de TO-functie op (TO = P \u00D7 Q).',
            steps: [
                { q: 'TO = P \u00D7 Q = (' + a + ' \u2212 ' + b + 'Q) \u00D7 Q. Werk de haakjes uit. Wat is de co\u00EBffici\u00EBnt van Q?', a: a, hint: a + ' \u00D7 Q \u2192 co\u00EBffici\u00EBnt is ' + a + '.', expl: 'De eerste term is ' + a + 'Q.' },
                mcQ2
            ]
        };
    };

    GEN.A08 = function () {
        var a = round1(ri(1, 5) * 0.5), b = ri(5, 20), c = ri(50, 300);
        var Q = ri(5, 15);
        var vk = round1(a * Q * Q + b * Q);
        var mcVK = mcStep(
            'Wat zijn de vaste kosten?',
            c,
            [b, a, round1(a + b), round1(a * Q * Q)],
            'De vaste kosten zijn de kosten als er niets geproduceerd wordt (Q = 0).',
            'TK(0) = ' + c + '. De constante term is de vaste kosten.'
        );
        return {
            context: 'TK = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c,
            steps: [
                mcVK,
                { q: 'Bereken de variabele kosten bij Q = ' + Q + '.', a: vk, hint: 'De variabele kosten zijn TK minus de vaste kosten. Of: de termen m\u00E9t Q.', expl: 'TVK = ' + a + '\u00D7' + (Q * Q) + ' + ' + b + '\u00D7' + Q + ' = ' + vk }
            ]
        };
    };

    GEN.A09 = function () {
        var a1 = pick([1, 2]), c1 = ri(4, 12);
        var a2 = pick([1, 2]), c2 = ri(4, 12);
        var coefA = round2(1 / a1), constA = round2(-c1 / a1);
        var coefB = round2(1 / a2), constB = round2(-c2 / a2);
        var coefCol = round2(coefA + coefB);
        var constCol = round2(constA + constB);
        var orderB4 = {
            q: 'Zet de stappen voor het opstellen van de collectieve aanbodfunctie in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Schrijf individuele functies om naar Q = f(P)',
                'Tel de Q-functies van alle bedrijven op',
                'Vereenvoudig de collectieve functie'
            ],
            correctOrder: [0, 1, 2],
            hint: 'Eerst omschrijven, dan optellen, dan vereenvoudigen.',
            expl: 'Stap 1: Omschrijven naar Q = f(P) \u2192 Stap 2: Optellen \u2192 Stap 3: Vereenvoudigen.'
        };
        return {
            context: 'Bedrijf A: P = ' + a1 + 'Qa + ' + c1 + '\nBedrijf B: P = ' + a2 + 'Qb + ' + c2 + '\nStel de collectieve aanbodfunctie op.',
            steps: [
                orderB4,
                { q: 'Herschrijf het aanbod van A naar Qa = \u2026P + \u2026 Wat is de co\u00EBffici\u00EBnt van P?', a: coefA, hint: 'P = ' + a1 + 'Qa + ' + c1 + ' \u2192 ' + a1 + 'Qa = P \u2212 ' + c1 + ' \u2192 deel door ' + a1, expl: 'Qa = ' + coefA + 'P + (' + constA + '). De co\u00EBffici\u00EBnt van P is ' + coefA + '.' },
                { q: 'Wat is de constante in Qa = ' + coefA + 'P + ?', a: constA, hint: '\u2212' + c1 + ' \u00F7 ' + a1 + ' = ? (let op het minteken!)', expl: 'Qa = ' + coefA + 'P + (' + constA + '). De constante is ' + constA + '.' },
                { q: 'Herschrijf het aanbod van B naar Qb = \u2026P + \u2026 Wat is de co\u00EBffici\u00EBnt van P?', a: coefB, hint: 'P = ' + a2 + 'Qb + ' + c2 + ' \u2192 deel door ' + a2, expl: 'Qb = ' + coefB + 'P + (' + constB + '). De co\u00EBffici\u00EBnt van P is ' + coefB + '.' },
                { q: 'Wat is de constante in Qb = ' + coefB + 'P + ?', a: constB, hint: '\u2212' + c2 + ' \u00F7 ' + a2 + ' = ? (let op het minteken!)', expl: 'Qb = ' + coefB + 'P + (' + constB + '). De constante is ' + constB + '.' },
                { q: 'Tel de co\u00EBffici\u00EBnten van P op voor de collectieve aanbodfunctie. Wat is de co\u00EBffici\u00EBnt van P in Qcol?', a: coefCol, hint: 'Co\u00EBffici\u00EBnt A was ' + coefA + ', co\u00EBffici\u00EBnt B was ' + coefB + '. Tel op.', expl: coefA + ' + ' + coefB + ' = ' + coefCol },
                { q: 'Wat is de constante in Qcol = ' + coefCol + 'P + ?', a: constCol, hint: 'Constante A was ' + constA + ', constante B was ' + constB + '. Tel op.', expl: constA + ' + (' + constB + ') = ' + constCol + '. De collectieve aanbodfunctie is Qcol = ' + coefCol + 'P + (' + constCol + ').' }
            ]
        };
    };

    GEN.A12 = function () {
        var a = ri(30, 80), b = ri(1, 4);
        var mcMO = mcStep(
            'Wat is de co\u00EBffici\u00EBnt van Q in MO?',
            -(2 * b),
            [2 * b, -b, b, -(2 * b + 1), 2 * b - 1],
            'Wat is de afgeleide van \u2212' + b + 'Q\u00B2? Let op het teken.',
            'MO = ' + a + ' \u2212 ' + (2 * b) + 'Q, dus de co\u00EBffici\u00EBnt is \u2212' + (2 * b) + '.'
        );
        return {
            context: 'TO = ' + a + 'Q \u2212 ' + b + 'Q\u00B2. Bepaal de MO-functie (= afgeleide van TO).',
            steps: [
                { q: 'Wat is de constante term in MO?', a: a, hint: 'MO is de afgeleide van TO naar Q. Wat is de afgeleide van ' + a + 'Q?', expl: 'MO begint met ' + a },
                mcMO,
                { q: 'Bij welke Q is MO = 0?', a: round1(a / (2 * b)), hint: 'Stel MO = 0 en los op naar Q.', expl: 'Q = ' + a + ' \u00F7 ' + (2 * b) + ' = ' + round1(a / (2 * b)) }
            ]
        };
    };

    GEN.A13 = function () {
        var a = round1(pick([0.5, 1, 1.5, 2])), b = ri(5, 20), c = ri(50, 200);
        var mcMK = mcStep(
            'Wat is de co\u00EBffici\u00EBnt van Q in MK?',
            round1(2 * a),
            [a, round1(a / 2), round1(2 * a + 1), round1(a * a)],
            'MK is de afgeleide van TK. Wat is de afgeleide van ' + a + 'Q\u00B2?',
            a + 'Q\u00B2 \u2192 ' + round1(2 * a) + 'Q (vermenigvuldig co\u00EBffici\u00EBnt met macht).'
        );
        return {
            context: 'TK = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '. Bepaal de MK-functie.',
            steps: [
                mcMK,
                { q: 'Wat is de constante in MK?', a: b, hint: 'Wat is de afgeleide van ' + b + 'Q?', expl: 'MK = ' + round1(2 * a) + 'Q + ' + b }
            ]
        };
    };

    GEN.A14 = function () {
        var a = pick([0.5, 1, 2]), b = ri(5, 15), c = ri(50, 200);
        var Q = ri(5, 20);
        var tk = round1(a * Q * Q + b * Q + c);
        var gtk = round2(tk / Q);
        var mcGTK = mcStep(
            'Hoe bereken je de GTK?',
            'TK / Q',
            ['TK \u2212 Q', 'TK \u00D7 Q', 'Q / TK'],
            'GTK staat voor Gemiddelde Totale Kosten.',
            'GTK = TK gedeeld door Q. "Gemiddelde" betekent: delen door de hoeveelheid.'
        );
        return {
            context: 'TK = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '. Bereken GTK bij Q = ' + Q + '.',
            steps: [
                mcGTK,
                { q: 'Bereken eerst TK bij Q = ' + Q + '.', a: tk, hint: 'Vul Q = ' + Q + ' in de kostenfunctie in en reken stap voor stap uit.', expl: 'TK = ' + a + '\u00D7' + (Q * Q) + ' + ' + (b * Q) + ' + ' + c + ' = ' + tk },
                { q: 'Bereken nu GTK.', a: gtk, hint: 'GTK = TK gedeeld door Q.', expl: 'GTK = ' + tk + ' \u00F7 ' + Q + ' = ' + gtk }
            ]
        };
    };

    GEN.A15 = function () {
        var P1 = pick([5, 8, 10, 12, 15, 20, 25, 40, 50]);
        var pctP = pick([5, 10, 20, 25, 50]);
        var deltaP = P1 * pctP / 100;
        if (deltaP < 1 || deltaP % 1 !== 0) return GEN.A15();
        var P2 = P1 + deltaP;
        var Q1 = pick([40, 50, 60, 80, 100, 120, 150, 200]);
        var pctQ = pick([-5, -10, -15, -20, -25, -30, -40, -50]);
        var deltaQ = Q1 * pctQ / 100;
        if (deltaQ % 1 !== 0) return GEN.A15();
        var Q2 = Q1 + deltaQ;
        if (Q2 <= 0) return GEN.A15();
        var Ev = round2(pctQ / pctP);
        var absEv = Math.abs(Ev);
        var elastic = absEv > 1 ? 'elastisch' : absEv < 1 ? 'inelastisch' : 'eenheidselastisch';
        var mcInterp = mcStep(
            'De Ev = ' + Ev + '. De vraag is\u2026',
            elastic,
            ['elastisch', 'inelastisch', 'eenheidselastisch', 'perfect elastisch'],
            '|Ev| > 1 \u2192 elastisch, |Ev| < 1 \u2192 inelastisch, |Ev| = 1 \u2192 eenheidselastisch.',
            '|Ev| = ' + absEv + (absEv > 1 ? ' > 1 \u2192 elastisch.' : absEv < 1 ? ' < 1 \u2192 inelastisch.' : ' = 1 \u2192 eenheidselastisch.')
        );
        // Error step: 3 attempts at %ΔQ, one uses wrong base value (P2 instead of Q1)
        var wrongPctQ = round2(((Q2 - Q1) / P2) * 100);
        var errorStep = {
            q: 'E\u00E9n van deze berekeningen van %\u0394Qv bevat een fout. Welke?',
            mode: 'error',
            shownSteps: [
                { text: '%\u0394Qv = (' + Q2 + ' \u2212 ' + Q1 + ') / ' + Q1 + ' \u00D7 100 = ' + pctQ + '%', isError: false },
                { text: '%\u0394Qv = (' + Q2 + ' \u2212 ' + Q1 + ') / ' + P2 + ' \u00D7 100 = ' + wrongPctQ + '%', isError: true },
                { text: '%\u0394Qv = ' + deltaQ + ' / ' + Q1 + ' \u00D7 100 = ' + pctQ + '%', isError: false }
            ],
            hint: 'Bij procentuele verandering deel je altijd door de oorspronkelijke waarde.',
            expl: 'Stap 2 deelt door ' + P2 + ' (de nieuwe prijs) in plaats van door ' + Q1 + ' (de oorspronkelijke hoeveelheid). Dat is fout!'
        };
        // Shuffle error step position so the error isn't always in the middle
        var errIdx = ri(0, 2);
        var errSteps = errorStep.shownSteps.slice();
        var errItem = errSteps.splice(1, 1)[0]; // remove the error from position 1
        errSteps.splice(errIdx, 0, errItem);     // insert at random position
        errorStep.shownSteps = errSteps;

        return {
            context: 'De prijs stijgt van \u20AC' + P1 + ' naar \u20AC' + P2 + '.\nDe gevraagde hoeveelheid daalt van ' + Q1 + ' naar ' + Q2 + '.\nBereken de prijselasticiteit van de vraag.',
            steps: [
                { q: 'Bereken de procentuele verandering van de prijs (%\u0394P).', a: pctP, hint: '%\u0394P = (\u0394P / P\u2081) \u00D7 100 = (' + deltaP + ' / ' + P1 + ') \u00D7 100', expl: '%\u0394P = (' + deltaP + ' / ' + P1 + ') \u00D7 100 = ' + pctP + '%' },
                errorStep,
                { q: 'Bereken nu zelf %\u0394Qv.', a: pctQ, hint: '%\u0394Q = ((Q\u2082 \u2212 Q\u2081) / Q\u2081) \u00D7 100 = ((' + Q2 + ' \u2212 ' + Q1 + ') / ' + Q1 + ') \u00D7 100', expl: '%\u0394Q = ((' + Q2 + ' \u2212 ' + Q1 + ') / ' + Q1 + ') \u00D7 100 = ' + pctQ + '%' },
                { q: 'Bereken de prijselasticiteit (Ev = %\u0394Q / %\u0394P).', a: Ev, hint: 'Deel de procentuele verandering van Q door die van P.', expl: 'Ev = ' + pctQ + ' / ' + pctP + ' = ' + Ev },
                mcInterp
            ]
        };
    };

    GEN.A16 = function () {
        var Pb1 = pick([5, 8, 10, 15, 20, 25]);
        var pctPb = pick([-20, -10, 10, 20, 25, 50]);
        var deltaPb = Pb1 * pctPb / 100;
        if (deltaPb % 1 !== 0 || deltaPb === 0) return GEN.A16();
        var Pb2 = Pb1 + deltaPb;
        if (Pb2 <= 0) return GEN.A16();
        var Qa1 = pick([40, 50, 60, 80, 100, 120, 200]);
        var pctQa = pick([-20, -10, -5, 5, 10, 15, 20, 25]);
        var deltaQa = Qa1 * pctQa / 100;
        if (deltaQa % 1 !== 0 || deltaQa === 0) return GEN.A16();
        var Qa2 = Qa1 + deltaQa;
        if (Qa2 <= 0) return GEN.A16();
        var Ekr = round2(pctQa / pctPb);
        var goodA = pick(['brood', 'koffie', 'fietsen', 'laptops', 'boeken', 'schoenen']);
        var goodB = pick(['boter', 'thee', 'auto\u2019s', 'tablets', 'e-readers', 'laarzen']);
        var relation = Ekr > 0 ? 'substituten' : 'complementen';
        var mcRelation = mcStep(
            'Ekr = ' + Ekr + '. ' + goodA + ' en ' + goodB + ' zijn\u2026',
            relation,
            ['substituten', 'complementen', 'onafhankelijke goederen', 'inferieure goederen'],
            'Ekr > 0 \u2192 substituten, Ekr < 0 \u2192 complementen.',
            'Ekr = ' + Ekr + (Ekr > 0 ? ' > 0 \u2192 substituten.' : ' < 0 \u2192 complementen.')
        );
        return {
            context: 'De prijs van ' + goodB + ' verandert van \u20AC' + Pb1 + ' naar \u20AC' + Pb2 + '.\nDe gevraagde hoeveelheid ' + goodA + ' verandert van ' + Qa1 + ' naar ' + Qa2 + '.\nBereken de kruiselasticiteit.',
            steps: [
                { q: 'Bereken de procentuele prijsverandering van ' + goodB + ' (%\u0394Pb).', a: pctPb, hint: '%\u0394Pb = ((' + Pb2 + ' \u2212 ' + Pb1 + ') / ' + Pb1 + ') \u00D7 100', expl: '%\u0394Pb = (' + deltaPb + ' / ' + Pb1 + ') \u00D7 100 = ' + pctPb + '%' },
                { q: 'Bereken de procentuele hoeveelheidsverandering van ' + goodA + ' (%\u0394Qa).', a: pctQa, hint: '%\u0394Qa = ((' + Qa2 + ' \u2212 ' + Qa1 + ') / ' + Qa1 + ') \u00D7 100', expl: '%\u0394Qa = (' + deltaQa + ' / ' + Qa1 + ') \u00D7 100 = ' + pctQa + '%' },
                { q: 'Bereken de kruiselasticiteit (Ekr = %\u0394Qa / %\u0394Pb).', a: Ekr, hint: 'Deel %\u0394Qa door %\u0394Pb.', expl: 'Ekr = ' + pctQa + ' / ' + pctPb + ' = ' + Ekr },
                mcRelation
            ]
        };
    };

    GEN.A17 = function () {
        var Y1 = pick([1500, 2000, 2500, 3000, 4000, 5000]);
        var pctY = pick([5, 10, 20, 25]);
        var deltaY = Y1 * pctY / 100;
        if (deltaY % 1 !== 0) return GEN.A17();
        var Y2 = Y1 + deltaY;
        var Q1 = pick([40, 50, 60, 80, 100, 120, 200]);
        var pctQ = pick([-10, -5, 5, 10, 15, 20, 25, 30, 40]);
        var deltaQ = Q1 * pctQ / 100;
        if (deltaQ % 1 !== 0 || deltaQ === 0) return GEN.A17();
        var Q2 = Q1 + deltaQ;
        if (Q2 <= 0) return GEN.A17();
        var Ey = round2(pctQ / pctY);
        var good = pick(['bioscoopkaartjes', 'brood', 'tweedehands kleding', 'restaurantbezoeken', 'luxe horloges', 'biologische groenten']);
        var goodType = Ey > 1 ? 'luxe goed' : Ey > 0 ? 'normaal (noodzakelijk) goed' : 'inferieur goed';
        var mcType = mcStep(
            'Ey = ' + Ey + '. ' + good.charAt(0).toUpperCase() + good.slice(1) + ' is een\u2026',
            goodType,
            ['luxe goed', 'normaal (noodzakelijk) goed', 'inferieur goed', 'Giffen-goed'],
            'Ey > 1 \u2192 luxe, 0 < Ey < 1 \u2192 noodzakelijk, Ey < 0 \u2192 inferieur.',
            'Ey = ' + Ey + (Ey > 1 ? ' > 1 \u2192 luxe goed.' : Ey > 0 ? ', 0 < Ey < 1 \u2192 normaal (noodzakelijk) goed.' : ' < 0 \u2192 inferieur goed.')
        );
        return {
            context: 'Het inkomen stijgt van \u20AC' + Y1 + ' naar \u20AC' + Y2 + ' per maand.\nDe gevraagde hoeveelheid ' + good + ' verandert van ' + Q1 + ' naar ' + Q2 + '.\nBereken de inkomenselasticiteit.',
            steps: [
                { q: 'Bereken de procentuele inkomensverandering (%\u0394Y).', a: pctY, hint: '%\u0394Y = (\u0394Y / Y\u2081) \u00D7 100 = (' + deltaY + ' / ' + Y1 + ') \u00D7 100', expl: '%\u0394Y = (' + deltaY + ' / ' + Y1 + ') \u00D7 100 = ' + pctY + '%' },
                { q: 'Bereken de procentuele hoeveelheidsverandering (%\u0394Q).', a: pctQ, hint: '%\u0394Q = ((' + Q2 + ' \u2212 ' + Q1 + ') / ' + Q1 + ') \u00D7 100', expl: '%\u0394Q = (' + deltaQ + ' / ' + Q1 + ') \u00D7 100 = ' + pctQ + '%' },
                { q: 'Bereken de inkomenselasticiteit (Ey = %\u0394Q / %\u0394Y).', a: Ey, hint: 'Deel %\u0394Q door %\u0394Y.', expl: 'Ey = ' + pctQ + ' / ' + pctY + ' = ' + Ey },
                mcType
            ]
        };
    };

    GEN.A19 = function () {
        var b = ri(2, 4), d = ri(1, 3), Ps = ri(10, 20);
        var maxC = Math.min(d * Ps - 1, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 2) return GEN.A19();
        var c = ri(2, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A19();
        var pIntercept = round1(alpha / b);
        var cs = round1(0.5 * Qs * (pIntercept - Ps));
        var mcCS = mcStep(
            'Wat is de vorm van het consumentensurplus in de grafiek?',
            'Driehoek tussen vraaglijn, prijslijn en P-as',
            ['Rechthoek onder de vraaglijn', 'Driehoek tussen aanbodlijn en prijslijn', 'Het verschil tussen vraag en aanbod'],
            'Het CS is het gebied boven de prijs en onder de vraaglijn.',
            'Het consumentensurplus is een driehoek: basis = Q*, hoogte = Pmax \u2212 P*.'
        );
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nEvenwicht: P* = ' + Ps + ', Q* = ' + Qs + '.\nBereken het consumentensurplus.',
            steps: [
                mcCS,
                { q: 'Bepaal het snijpunt van de vraaglijn met de P-as.', a: pIntercept, hint: 'Het snijpunt met de P-as vind je door Q = 0 in te vullen.', expl: 'Qv = 0 \u2192 ' + alpha + ' = ' + b + 'P \u2192 Pmax = ' + pIntercept },
                { q: 'Bereken het consumentensurplus.', a: cs, hint: 'CS is een driehoek met basis Q* en hoogte Pmax \u2212 P*.', expl: 'CS = \u00BD \u00D7 ' + Qs + ' \u00D7 (' + pIntercept + ' \u2212 ' + Ps + ') = ' + cs }
            ]
        };
    };

    GEN.A20 = function () {
        var bMO = ri(2, 6), bMK = ri(1, 4);
        var totalB = bMO + bMK;
        var Qs = ri(3, 15);
        var aMK = ri(5, 20);
        var aMO = aMK + totalB * Qs;
        return {
            context: 'MO = ' + aMO + ' \u2212 ' + bMO + 'Q en MK = ' + aMK + ' + ' + bMK + 'Q.\nBij welke Q is de winst maximaal?',
            steps: [
                { q: 'Stel MO = MK en los op. Q* = ?', a: Qs, hint: aMO + ' \u2212 ' + bMO + 'Q = ' + aMK + ' + ' + bMK + 'Q \u2192 ' + totalB + 'Q = ' + (aMO - aMK), expl: 'Q* = ' + (aMO - aMK) + ' \u00F7 ' + totalB + ' = ' + Qs }
            ]
        };
    };

    GEN.A21 = function () {
        var a = ri(40, 80), b = ri(1, 3), tkA = pick([0.5, 1, 2]), tkB = ri(5, 15), tkC = ri(50, 200);
        var Q = ri(5, 15);
        var to = round1(a * Q - b * Q * Q);
        var tk = round1(tkA * Q * Q + tkB * Q + tkC);
        var profit = round1(to - tk);
        var wrongProfit = round1(to + tk);
        var errorS3 = {
            q: 'E\u00E9n van deze winstberekeningen bevat een fout. Welke?',
            mode: 'error',
            shownSteps: [
                { text: 'Winst = TO \u2212 TK = ' + to + ' \u2212 ' + tk + ' = ' + profit, isError: false },
                { text: 'Winst = TO + TK = ' + to + ' + ' + tk + ' = ' + wrongProfit, isError: true },
                { text: 'Winst = ' + a + '\u00D7' + Q + ' \u2212 ' + b + '\u00D7' + (Q * Q) + ' \u2212 (' + tkA + '\u00D7' + (Q * Q) + ' + ' + tkB + '\u00D7' + Q + ' + ' + tkC + ') = ' + profit, isError: false }
            ],
            hint: 'Winst = TO \u2212 TK, niet TO + TK.',
            expl: 'De fout telt TO en TK op in plaats van af te trekken. Winst = TO \u2212 TK.'
        };
        // Shuffle error position
        var errS3Items = errorS3.shownSteps.slice();
        var errS3Item = errS3Items.splice(1, 1)[0];
        errS3Items.splice(ri(0, 2), 0, errS3Item);
        errorS3.shownSteps = errS3Items;
        return {
            context: 'TO = ' + a + 'Q \u2212 ' + b + 'Q\u00B2 en TK = ' + tkA + 'Q\u00B2 + ' + tkB + 'Q + ' + tkC + '.\nBereken de winst bij Q = ' + Q + '.',
            steps: [
                errorS3,
                { q: 'Bereken TO bij Q = ' + Q + '.', a: to, hint: 'TO = ' + a + 'Q \u2212 ' + b + 'Q\u00B2. Vul Q = ' + Q + ' in.', expl: 'TO = ' + a + '\u00D7' + Q + ' \u2212 ' + b + '\u00D7' + (Q * Q) + ' = ' + to },
                { q: 'Bereken TK bij Q = ' + Q + '.', a: tk, hint: 'Vul Q = ' + Q + ' in de kostenfunctie in.', expl: 'TK = ' + tkA + '\u00D7' + (Q * Q) + ' + ' + tkB + '\u00D7' + Q + ' + ' + tkC + ' = ' + tk },
                { q: 'Bereken de winst.', a: profit, hint: 'Winst = TO \u2212 TK.', expl: 'Winst = ' + to + ' \u2212 ' + tk + ' = ' + profit }
            ]
        };
    };

    GEN.A22 = function () {
        var P = ri(30, 60);
        var a = pick([0.5, 1, 2]);
        var Q1 = ri(3, 8), Q2 = ri(Q1 + 4, Q1 + 12);
        var b = round1(P - a * (Q1 + Q2));
        var c = round1(a * Q1 * Q2);
        if (b < 0) return GEN.A22();
        var orderS4 = {
            q: 'Zet de stappen voor een break-even berekening in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Stel TO = TK',
                'Herschrijf naar aQ\u00B2 + bQ + c = 0',
                'Los op met de abc-formule'
            ],
            correctOrder: [0, 1, 2],
            hint: 'Eerst gelijkstellen, dan herschrijven, dan oplossen.',
            expl: 'Stap 1: TO = TK \u2192 Stap 2: alles naar \u00E9\u00E9n kant \u2192 Stap 3: abc-formule.'
        };
        return {
            context: 'TO = ' + P + 'Q en TK = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '.\nBij welke hoeveelheden is er break-even?',
            steps: [
                orderS4,
                { q: 'Stel TO = TK en herschrijf naar de vorm \u2026Q\u00B2 + \u2026Q + \u2026 = 0. Wat is de co\u00EBffici\u00EBnt van Q?', a: round1(b - P), hint: P + 'Q = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '. Breng alles naar \u00E9\u00E9n kant.', expl: a + 'Q\u00B2 + (' + b + ' \u2212 ' + P + ')Q + ' + c + ' = 0 \u2192 co\u00EBffici\u00EBnt = ' + round1(b - P) },
                { q: 'Bereken de kleinste break-even hoeveelheid.', a: Q1, hint: 'Los de kwadratische vergelijking op met de abc-formule.', expl: 'Q\u2081 = ' + Q1 },
                { q: 'Bereken de grootste break-even hoeveelheid.', a: Q2, hint: 'De tweede oplossing van dezelfde vergelijking.', expl: 'Q\u2082 = ' + Q2 + '. Tussen Q=' + Q1 + ' en Q=' + Q2 + ' maakt het bedrijf winst.' }
            ]
        };
    };

    GEN.A23 = function () {
        var b = ri(2, 5), d = ri(1, 4), Ps = ri(10, 25);
        var maxC = Math.min(d * Ps - 1, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 3) return GEN.A23();
        var c = ri(3, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A23();
        var heffing = ri(2, 8);
        var newC = c + d * heffing;
        var newPs = round1((alpha + newC) / (b + d));
        var newQs = round1(alpha - b * newPs);
        if (newQs <= 0) return GEN.A23();
        var mcS5 = mcStep(
            'Wat verandert er aan de aanbodfunctie na een heffing van \u20AC' + heffing + '?',
            'De aanbodcurve schuift omhoog (naar links)',
            ['De aanbodcurve schuift omlaag (naar rechts)', 'De vraagcurve schuift naar links', 'Beide curves schuiven'],
            'Een heffing bij de producent verhoogt de kosten per stuk.',
            'De producent ontvangt P \u2212 heffing, waardoor de aanbodcurve omhoog (naar links) schuift.'
        );
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nDe overheid heft \u20AC' + heffing + ' per stuk bij de producent.\nBereken het nieuwe evenwicht.',
            steps: [
                mcS5,
                { q: 'Wat is de nieuwe constante in de aanbodfunctie na de heffing?', a: newC, hint: 'De producent ontvangt P \u2212 ' + heffing + '. Vul dat in bij Qa.', expl: 'Qa = \u2212' + c + ' + ' + d + '(P \u2212 ' + heffing + ') = \u2212' + newC + ' + ' + d + 'P' },
                { q: 'Bereken de nieuwe evenwichtsprijs.', a: newPs, hint: 'Stel de nieuwe Qa gelijk aan Qv en los op naar P.', expl: alpha + ' \u2212 ' + b + 'P = \u2212' + newC + ' + ' + d + 'P \u2192 P* = ' + newPs },
                { q: 'Bereken de nieuwe evenwichtshoeveelheid.', a: newQs, hint: 'Vul de nieuwe P* in bij Qv.', expl: 'Q* = ' + alpha + ' \u2212 ' + b + '\u00D7' + newPs + ' = ' + newQs }
            ]
        };
    };

    GEN.A24 = function () {
        var n = ri(2, 4);
        var aInd = ri(1, 3), cInd = ri(4, 10);
        var testP = cInd + aInd * ri(2, 6);
        var qInd = (testP - cInd) / aInd;
        var qCol = n * qInd;
        var mcS6 = mcStep(
            'Hoe vind je de minimumprijs waarvoor er wordt aangeboden?',
            'Vul Qi = 0 in en los op naar P',
            ['Vul P = 0 in en los op naar Q', 'Stel Qv = Qa', 'Neem de afgeleide van de aanbodfunctie'],
            'Het aanbod begint bij de prijs waar Qi precies nul is.',
            'Qi = 0 invullen geeft de minimumprijs. Pas vanaf die prijs wordt er aangeboden.'
        );
        return {
            context: n + ' identieke bedrijven, elk met individueel aanbod: P = ' + aInd + 'Qi + ' + cInd + '.\nBepaal het collectieve aanbod.',
            steps: [
                mcS6,
                { q: 'Vanaf welke prijs wordt er aangeboden?', a: cInd, hint: 'Schrijf om naar Qi als functie van P. Bij welke P is Qi = 0?', expl: 'Qi = (P \u2212 ' + cInd + ') / ' + aInd + '. Minimumprijs = ' + cInd },
                { q: 'Bereken Qi per bedrijf bij P = ' + testP + '.', a: qInd, hint: 'Vul P = ' + testP + ' in bij Qi = (P \u2212 ' + cInd + ') / ' + aInd + '.', expl: 'Qi = (' + testP + ' \u2212 ' + cInd + ') / ' + aInd + ' = ' + qInd },
                { q: 'Bereken het collectieve aanbod bij P = ' + testP + '.', a: qCol, hint: 'Er zijn ' + n + ' identieke bedrijven.', expl: 'Qcol = ' + n + ' \u00D7 ' + qInd + ' = ' + qCol }
            ]
        };
    };

    GEN.A25 = function () {
        var b = ri(2, 5), d = ri(1, 4), Ps = ri(8, 20);
        var maxC = Math.min(d * Ps - 1, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 2) return GEN.A25();
        var c = ri(2, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A25();
        var Pmin = Ps + ri(2, 6);
        var QvMin = alpha - b * Pmin;
        var QaMin = -c + d * Pmin;
        if (QvMin <= 0 || QaMin <= 0) return GEN.A25();
        var overschot = QaMin - QvMin;
        if (overschot <= 0) return GEN.A25();
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nDe overheid stelt een minimumprijs van \u20AC' + Pmin + '.\nAnalyseer het effect.',
            steps: [
                { q: 'Bereken de evenwichtsprijs zonder overheidsingrijpen.', a: Ps, hint: 'Stel Qv = Qa en los op naar P.', expl: 'P* = (' + alpha + '+' + c + ') \u00F7 ' + (b + d) + ' = ' + Ps },
                { q: 'Bereken de gevraagde hoeveelheid bij de minimumprijs.', a: QvMin, hint: 'Vul P = ' + Pmin + ' in bij Qv.', expl: 'Qv = ' + alpha + ' \u2212 ' + b + '\u00D7' + Pmin + ' = ' + QvMin },
                { q: 'Bereken de aangeboden hoeveelheid bij de minimumprijs.', a: QaMin, hint: 'Vul P = ' + Pmin + ' in bij Qa.', expl: 'Qa = \u2212' + c + ' + ' + d + '\u00D7' + Pmin + ' = ' + QaMin },
                { q: 'Bereken het overschot op de markt.', a: overschot, hint: 'Overschot = aanbod \u2212 vraag.', expl: 'Overschot = ' + QaMin + ' \u2212 ' + QvMin + ' = ' + overschot },
                mcStep(
                    'Er is een overschot van ' + overschot + ' stuks. Wat is het gevolg?',
                    'Aanbieders kunnen niet alles kwijt',
                    ['Consumenten kunnen niet genoeg kopen', 'De prijs zal dalen naar het evenwicht', 'Er ontstaat een zwarte markt met hogere prijzen'],
                    'Bij een minimumprijs is het aanbod groter dan de vraag.',
                    'Bij een overschot produceren aanbieders meer dan consumenten willen kopen.'
                )
            ]
        };
    };

    GEN.A26 = function () {
        var b = ri(2, 5), d = ri(1, 4), Ps = ri(10, 25);
        var maxC = Math.min(d * Ps - 1, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 2) return GEN.A26();
        var c = ri(2, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A26();
        var Pmax = Ps - ri(2, Math.min(6, Ps - 2));
        if (Pmax <= 0) return GEN.A26();
        var QvMax = alpha - b * Pmax;
        var QaMax = -c + d * Pmax;
        if (QaMax <= 0) return GEN.A26();
        var tekort = QvMax - QaMax;
        if (tekort <= 0) return GEN.A26();
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nDe overheid stelt een maximumprijs van \u20AC' + Pmax + '.\nAnalyseer het effect.',
            steps: [
                { q: 'Bereken de evenwichtsprijs zonder overheidsingrijpen.', a: Ps, hint: 'Stel Qv = Qa en los op naar P.', expl: 'P* = (' + alpha + '+' + c + ') \u00F7 ' + (b + d) + ' = ' + Ps },
                { q: 'Bereken de gevraagde hoeveelheid bij de maximumprijs.', a: QvMax, hint: 'Vul P = ' + Pmax + ' in bij Qv.', expl: 'Qv = ' + alpha + ' \u2212 ' + b + '\u00D7' + Pmax + ' = ' + QvMax },
                { q: 'Bereken de aangeboden hoeveelheid bij de maximumprijs.', a: QaMax, hint: 'Vul P = ' + Pmax + ' in bij Qa.', expl: 'Qa = \u2212' + c + ' + ' + d + '\u00D7' + Pmax + ' = ' + QaMax },
                { q: 'Bereken het tekort op de markt.', a: tekort, hint: 'Tekort = vraag \u2212 aanbod.', expl: 'Tekort = ' + QvMax + ' \u2212 ' + QaMax + ' = ' + tekort },
                mcStep(
                    'Er is een tekort van ' + tekort + ' stuks. Wat is een waarschijnlijk gevolg?',
                    'Er kan een zwarte markt ontstaan',
                    ['De prijs daalt verder', 'Producenten gaan meer produceren', 'Het tekort lost zichzelf op'],
                    'Bij een maximumprijs is de vraag groter dan het aanbod.',
                    'Bij een tekort zijn er consumenten die meer willen betalen. Dat cre\u00EBert ruimte voor een zwarte markt.'
                )
            ]
        };
    };

    GEN.A27 = function () {
        var b = ri(2, 5), d = ri(1, 4), Ps = ri(10, 25);
        var maxC = Math.min(d * Ps - 1, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 3) return GEN.A27();
        var c = ri(3, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A27();
        var subsidie = ri(2, 8);
        var newC = c - d * subsidie;
        var newPs = round1((alpha + newC) / (b + d));
        var newQs = round1(alpha - b * newPs);
        if (newQs <= 0 || newPs <= 0) return GEN.A27();
        var totaalSubsidie = round1(subsidie * newQs);
        var mcS9 = mcStep(
            'Wat verandert er aan de aanbodfunctie na een subsidie van \u20AC' + subsidie + '?',
            'De aanbodcurve schuift omlaag (naar rechts)',
            ['De aanbodcurve schuift omhoog (naar links)', 'De vraagcurve schuift naar rechts', 'De vraagcurve schuift naar links'],
            'Een subsidie verlaagt de kosten per stuk voor de producent.',
            'De producent ontvangt P + subsidie, waardoor de aanbodcurve omlaag (naar rechts) schuift.'
        );
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nDe overheid geeft een subsidie van \u20AC' + subsidie + ' per stuk aan de producent.\nBereken het nieuwe evenwicht.',
            steps: [
                mcS9,
                { q: 'Wat is de nieuwe constante in de aanbodfunctie na de subsidie?', a: newC, hint: 'De producent ontvangt P + ' + subsidie + '. Vul dat in bij Qa.', expl: 'Qa = \u2212' + c + ' + ' + d + '(P + ' + subsidie + ') = ' + newC + ' + ' + d + 'P' },
                { q: 'Bereken de nieuwe evenwichtsprijs.', a: newPs, hint: 'Stel de nieuwe Qa gelijk aan Qv en los op naar P.', expl: alpha + ' \u2212 ' + b + 'P = ' + newC + ' + ' + d + 'P \u2192 P* = ' + newPs },
                { q: 'Bereken de nieuwe evenwichtshoeveelheid.', a: newQs, hint: 'Vul de nieuwe P* in bij Qv.', expl: 'Q* = ' + alpha + ' \u2212 ' + b + '\u00D7' + newPs + ' = ' + newQs },
                { q: 'Bereken de totale subsidie-uitgaven van de overheid.', a: totaalSubsidie, hint: 'Totale subsidie = subsidie per stuk \u00D7 hoeveelheid.', expl: 'Totaal = ' + subsidie + ' \u00D7 ' + newQs + ' = ' + totaalSubsidie }
            ]
        };
    };

    GEN.A28 = function () {
        // MK = GTK oplossen: find Q where MK equals GTK
        // TK = aQ² + bQ + c → MK = 2aQ + b, GTK = aQ + b + c/Q
        // MK = GTK → 2aQ + b = aQ + b + c/Q → aQ = c/Q → Q = √(c/a)
        // Choose Q first for clean numbers: c = a × Q²
        var Qstar = ri(5, 15);
        var a = pick([0.5, 1, 1.5, 2]);
        var bk = ri(3, 12);
        var c = round1(a * Qstar * Qstar);
        // Test value for steps 1 and 2 (different from Qstar)
        var Qtest = Qstar + pick([-2, -1, 1, 2]);
        if (Qtest <= 0) Qtest = Qstar + 2;
        var mkTest = round1(2 * a * Qtest + bk);
        var gtkTest = round2(a * Qtest + bk + c / Qtest);
        var mcS10 = mcStep(
            'Wat betekent het punt waar MK = GTK economisch gezien?',
            'Het minimum van de GTK-curve (effici\u00EBnte schaal)',
            ['Het punt van maximale winst', 'Het break-even punt', 'Het punt waar de productie stopt'],
            'De MK-curve snijdt de GTK-curve altijd in het laagste punt.',
            'Waar MK = GTK bereikt de GTK zijn minimum. Dit heet de effici\u00EBnte schaal.'
        );
        return {
            context: 'TK = ' + a + 'Q\u00B2 + ' + bk + 'Q + ' + c + '.\nBij welke hoeveelheid is MK = GTK?',
            steps: [
                mcS10,
                { q: 'Stel de MK-functie op. Wat is MK bij Q = ' + Qtest + '?', a: mkTest, hint: 'MK is de afgeleide van TK. MK = ' + round1(2 * a) + 'Q + ' + bk + '.', expl: 'MK = ' + round1(2 * a) + '\u00D7' + Qtest + ' + ' + bk + ' = ' + mkTest },
                { q: 'Stel de GTK-functie op. Wat is GTK bij Q = ' + Qtest + '?', a: gtkTest, hint: 'GTK = TK/Q = ' + a + 'Q + ' + bk + ' + ' + c + '/Q.', expl: 'GTK = ' + a + '\u00D7' + Qtest + ' + ' + bk + ' + ' + c + '/' + Qtest + ' = ' + gtkTest },
                { q: 'Stel MK = GTK en los Q op.', a: Qstar, hint: round1(2 * a) + 'Q + ' + bk + ' = ' + a + 'Q + ' + bk + ' + ' + c + '/Q. Vereenvoudig: ' + a + 'Q = ' + c + '/Q.', expl: a + 'Q = ' + c + '/Q \u2192 Q\u00B2 = ' + round1(c / a) + ' \u2192 Q = ' + Qstar }
            ]
        };
    };

    GEN.A18 = function () {
        var landen = [
            ['Nederland', 'Duitsland'], ['Frankrijk', 'Spanje'],
            ['Japan', 'Zuid-Korea'], ['Belgi\u00EB', 'Denemarken']
        ];
        var producten = [
            ['kaas', 'wijn'], ['auto\u2019s', 'kleding'],
            ['elektronica', 'textiel'], ['machines', 'voedsel']
        ];
        var landPaar = pick(landen);
        var prodPaar = pick(producten);
        // Land 1 can produce maxA1 of product A or maxB1 of product B
        var maxA1 = ri(3, 12) * 10, maxB1 = ri(3, 12) * 10;
        var maxA2 = ri(3, 12) * 10, maxB2 = ri(3, 12) * 10;
        // Alternatieve kosten product A = hoeveel B je opgeeft per eenheid A
        var akA1 = round2(maxB1 / maxA1);
        var akA2 = round2(maxB2 / maxA2);
        // Ensure different comparative advantages (not equal)
        if (akA1 === akA2) return GEN.A18();
        var laagsteAK = akA1 < akA2 ? akA1 : akA2;
        return {
            context: landPaar[0] + ' kan ' + maxA1 + ' ' + prodPaar[0] + ' of ' + maxB1 + ' ' + prodPaar[1] + ' produceren.\n' + landPaar[1] + ' kan ' + maxA2 + ' ' + prodPaar[0] + ' of ' + maxB2 + ' ' + prodPaar[1] + ' produceren.\nBepaal het comparatief voordeel bij ' + prodPaar[0] + '.',
            steps: [
                { q: 'Bereken de alternatieve kosten van ' + prodPaar[0] + ' voor ' + landPaar[0] + ' (in eenheden ' + prodPaar[1] + ').', a: akA1, hint: 'Hoeveel ' + prodPaar[1] + ' geeft ' + landPaar[0] + ' op per eenheid ' + prodPaar[0] + '? Deel ' + maxB1 + ' door ' + maxA1 + '.', expl: 'AK = ' + maxB1 + ' / ' + maxA1 + ' = ' + akA1 + ' ' + prodPaar[1] + ' per ' + prodPaar[0] },
                { q: 'Bereken de alternatieve kosten van ' + prodPaar[0] + ' voor ' + landPaar[1] + ' (in eenheden ' + prodPaar[1] + ').', a: akA2, hint: 'Hoeveel ' + prodPaar[1] + ' geeft ' + landPaar[1] + ' op per eenheid ' + prodPaar[0] + '? Deel ' + maxB2 + ' door ' + maxA2 + '.', expl: 'AK = ' + maxB2 + ' / ' + maxA2 + ' = ' + akA2 + ' ' + prodPaar[1] + ' per ' + prodPaar[0] },
                { q: 'Wat zijn de laagste alternatieve kosten? (het land met comparatief voordeel)', a: laagsteAK, hint: 'Vergelijk de twee alternatieve kosten. De laagste wint.', expl: 'Laagste AK = ' + laagsteAK + ', dus ' + (akA1 < akA2 ? landPaar[0] : landPaar[1]) + ' heeft het comparatief voordeel bij ' + prodPaar[0] + '.' },
                mcStep(
                    'Welk land moet zich specialiseren in ' + prodPaar[0] + '?',
                    akA1 < akA2 ? landPaar[0] : landPaar[1],
                    [landPaar[0], landPaar[1], 'Beide landen', 'Geen van beide'],
                    'Het land met de laagste alternatieve kosten specialiseert zich.',
                    (akA1 < akA2 ? landPaar[0] : landPaar[1]) + ' heeft de laagste AK (' + laagsteAK + ') en specialiseert zich dus in ' + prodPaar[0] + '.'
                )
            ]
        };
    };

    /* ── Eindbazen ──────────────────────────────────────────── */

    GEN.A29 = function () {
        var P = ri(40, 70);
        var a = pick([0.5, 1, 2]);
        var Q1 = ri(3, 8), Q2 = ri(Q1 + 5, Q1 + 15);
        var b = round1(P - a * (Q1 + Q2));
        var c = round1(a * Q1 * Q2);
        if (b < 0) return GEN.A29();
        var Qmid = Math.round((Q1 + Q2) / 2);
        var profitMid = round1(P * Qmid - (a * Qmid * Qmid + b * Qmid + c));
        var orderE1 = {
            q: 'Zet de stappen van een volledige break-even analyse in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Stel TO = TK op',
                'Herschrijf naar aQ\u00B2 + bQ + c = 0',
                'Bereken break-even Q met abc-formule',
                'Bereken de winst bij een gegeven Q'
            ],
            correctOrder: [0, 1, 2, 3],
            hint: 'Eerst opstellen, dan herschrijven, dan oplossen, dan interpreteren.',
            expl: 'TO = TK \u2192 herschrijven \u2192 abc-formule \u2192 winst bij specifiek punt.'
        };
        return {
            context: 'Een producent verkoopt voor P = ' + P + '.\nTK = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '.\nVoer een volledige break-even analyse uit.',
            steps: [
                orderE1,
                { q: 'Stel TO = TK en herschrijf naar \u2026Q\u00B2 + \u2026Q + \u2026 = 0. Wat is de co\u00EBffici\u00EBnt van Q?', a: round1(b - P), hint: P + 'Q = ' + a + 'Q\u00B2 + ' + b + 'Q + ' + c + '. Breng alles naar \u00E9\u00E9n kant.', expl: a + 'Q\u00B2 + (' + b + ' \u2212 ' + P + ')Q + ' + c + ' = 0 \u2192 co\u00EBffici\u00EBnt = ' + round1(b - P) },
                { q: 'Bereken de kleinste break-even hoeveelheid.', a: Q1, hint: 'Gebruik de abc-formule.', expl: 'Q\u2081 = ' + Q1 },
                { q: 'Bereken de grootste break-even hoeveelheid.', a: Q2, hint: 'De tweede oplossing van dezelfde vergelijking.', expl: 'Q\u2082 = ' + Q2 },
                { q: 'Bereken de winst bij Q = ' + Qmid + '.', a: profitMid, hint: 'Winst = TO \u2212 TK. Bereken beide bij Q = ' + Qmid + '.', expl: 'TO = ' + (P * Qmid) + ', TK = ' + round1(a * Qmid * Qmid + b * Qmid + c) + ', Winst = ' + profitMid }
            ]
        };
    };

    GEN.A30 = function () {
        var b = ri(2, 5), d = ri(1, 4);
        var Ps = ri(8, 20);
        var maxC = Math.min(d * Ps - 2, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 2) return GEN.A30();
        var c = ri(2, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 2) return GEN.A30();
        var pMax = round1(alpha / b);
        var cs = round1(0.5 * Qs * (pMax - Ps));
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P en Qa = \u2212' + c + ' + ' + d + 'P.\nBereken het consumentensurplus volledig.',
            steps: [
                { q: 'Bereken de evenwichtsprijs.', a: Ps, hint: 'Stel Qv = Qa en los op naar P.', expl: 'P* = (' + alpha + '+' + c + ') \u00F7 ' + (b + d) + ' = ' + Ps },
                { q: 'Bereken de evenwichtshoeveelheid.', a: Qs, hint: 'Vul P* in bij Qv of Qa.', expl: 'Q* = ' + alpha + ' \u2212 ' + b + '\u00D7' + Ps + ' = ' + Qs },
                { q: 'Bepaal het snijpunt van de vraaglijn met de P-as.', a: pMax, hint: 'Bij welke prijs is de gevraagde hoeveelheid nul?', expl: 'Q = 0 \u2192 ' + alpha + ' = ' + b + 'P \u2192 Pmax = ' + pMax },
                (function () {
                    var wrongCS = round1(0.5 * Ps * (pMax - Qs));
                    var errE2 = {
                        q: 'E\u00E9n van deze CS-berekeningen bevat een fout. Welke?',
                        mode: 'error',
                        shownSteps: [
                            { text: 'CS = \u00BD \u00D7 ' + Qs + ' \u00D7 (' + pMax + ' \u2212 ' + Ps + ') = ' + cs, isError: false },
                            { text: 'CS = \u00BD \u00D7 ' + Ps + ' \u00D7 (' + pMax + ' \u2212 ' + Qs + ') = ' + wrongCS, isError: true },
                            { text: 'CS = \u00BD \u00D7 Q* \u00D7 (Pmax \u2212 P*) = \u00BD \u00D7 ' + Qs + ' \u00D7 ' + round1(pMax - Ps) + ' = ' + cs, isError: false }
                        ],
                        hint: 'De basis van de driehoek is Q*, de hoogte is Pmax \u2212 P*.',
                        expl: 'De fout verwisselt Q* en P* in de formule. De basis is altijd de hoeveelheid.'
                    };
                    var items = errE2.shownSteps.slice();
                    var item = items.splice(1, 1)[0];
                    items.splice(ri(0, 2), 0, item);
                    errE2.shownSteps = items;
                    return errE2;
                })(),
                { q: 'Bereken het consumentensurplus.', a: cs, hint: 'CS is een driehoek met basis Q* en hoogte Pmax \u2212 P*.', expl: 'CS = \u00BD \u00D7 ' + Qs + ' \u00D7 (' + pMax + ' \u2212 ' + Ps + ') = ' + cs }
            ]
        };
    };

    GEN.A31 = function () {
        var n1 = ri(2, 3), n2 = ri(1, 2);
        var a1 = pick([1, 2]), c1 = ri(4, 10);
        var a2 = pick([1, 2, 3]), c2 = ri(6, 14);
        var testP = Math.max(c1, c2) + ri(4, 10);
        var q1 = round1((testP - c1) / a1);
        var q2 = round1((testP - c2) / a2);
        var qTot = round1(n1 * q1 + (testP >= c2 ? n2 * q2 : 0));
        var orderE3 = {
            q: 'Zet de stappen voor het bepalen van het collectieve aanbod in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Bereken het aanbod per bedrijf bij de gegeven prijs',
                'Vermenigvuldig met het aantal bedrijven per groep',
                'Tel het aanbod van alle groepen bij elkaar op'
            ],
            correctOrder: [0, 1, 2],
            hint: 'Eerst individueel, dan per groep, dan totaal.',
            expl: 'Stap 1: Q per bedrijf \u2192 Stap 2: \u00D7 aantal bedrijven \u2192 Stap 3: groepen optellen.'
        };
        return {
            context: 'Groep A: ' + n1 + ' bedrijven, elk P = ' + a1 + 'Q + ' + c1 + '\nGroep B: ' + n2 + ' bedrijf(ven), elk P = ' + a2 + 'Q + ' + c2 + '\nBepaal het collectieve aanbod.',
            steps: [
                orderE3,
                { q: 'Bereken het aanbod per bedrijf van groep A bij P = ' + testP + '.', a: q1, hint: 'Schrijf om: Qa = (P \u2212 ' + c1 + ') / ' + a1 + '. Vul P in.', expl: 'Qa = (' + testP + ' \u2212 ' + c1 + ') / ' + a1 + ' = ' + q1 },
                { q: 'Bereken het totale aanbod van groep A.', a: round1(n1 * q1), hint: 'Er zijn ' + n1 + ' bedrijven in groep A.', expl: n1 + ' \u00D7 ' + q1 + ' = ' + round1(n1 * q1) },
                { q: 'Bereken het aanbod per bedrijf van groep B bij P = ' + testP + '.', a: q2, hint: 'Schrijf om: Qb = (P \u2212 ' + c2 + ') / ' + a2 + '. Vul P in.', expl: 'Qb = (' + testP + ' \u2212 ' + c2 + ') / ' + a2 + ' = ' + q2 },
                { q: 'Bereken het totale collectieve aanbod.', a: qTot, hint: 'Tel het totale aanbod van beide groepen op.', expl: 'Qcol = ' + round1(n1 * q1) + ' + ' + round1(n2 * q2) + ' = ' + qTot }
            ]
        };
    };

    GEN.A32 = function () {
        var b = ri(2, 4), d = ri(1, 3);
        var Ps = ri(10, 20), heffing = ri(3, 8);
        var maxC = Math.min(d * Ps - 2, Math.floor((b + d) * Ps / 2) - 1);
        if (maxC < 3) return GEN.A32();
        var c = ri(3, maxC);
        var alpha = (b + d) * Ps - c;
        var Qs = d * Ps - c;
        if (Qs <= 5) return GEN.A32();
        var newC = c + d * heffing;
        var Pn = round1((alpha + newC) / (b + d));
        var Qn = round1(alpha - b * Pn);
        if (Qn <= 0) return GEN.A32();
        var dwl = round1(0.5 * (Qs - Qn) * heffing);
        var orderE4 = {
            q: 'Zet de stappen voor het berekenen van het welvaartsverlies in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Bereken het oude evenwicht',
                'Pas de aanbodfunctie aan voor de heffing',
                'Bereken het nieuwe evenwicht',
                'Bereken het welvaartsverlies als driehoek'
            ],
            correctOrder: [0, 1, 2, 3],
            hint: 'Je moet eerst beide evenwichten kennen voordat je het verschil kunt berekenen.',
            expl: 'Oud evenwicht \u2192 aanpassen aanbod \u2192 nieuw evenwicht \u2192 DWL = \u00BD \u00D7 \u0394Q \u00D7 heffing.'
        };
        return {
            context: 'Qv = ' + alpha + ' \u2212 ' + b + 'P, Qa = \u2212' + c + ' + ' + d + 'P.\nHeffing: \u20AC' + heffing + '/stuk.\nBereken het welvaartsverlies.',
            steps: [
                orderE4,
                { q: 'Bereken de oude evenwichtsprijs.', a: Ps, hint: 'Stel Qv = Qa en los op naar P.', expl: 'P* = (' + alpha + '+' + c + ') \u00F7 ' + (b + d) + ' = ' + Ps },
                { q: 'Bereken de oude evenwichtshoeveelheid.', a: Qs, hint: 'Vul P* in bij Qv.', expl: 'Q* = ' + alpha + ' \u2212 ' + b + '\u00D7' + Ps + ' = ' + Qs },
                { q: 'Wat is de nieuwe constante in Qa na de heffing?', a: newC, hint: 'De producent ontvangt P \u2212 ' + heffing + '. Vul dat in.', expl: 'Qa = \u2212' + c + ' + ' + d + '(P \u2212 ' + heffing + ') \u2192 constante = ' + newC },
                { q: 'Bereken de nieuwe evenwichtsprijs.', a: Pn, hint: 'Stel de nieuwe Qa gelijk aan Qv en los op.', expl: 'P_nieuw = (' + alpha + '+' + newC + ') \u00F7 ' + (b + d) + ' = ' + Pn },
                { q: 'Bereken de nieuwe evenwichtshoeveelheid.', a: Qn, hint: 'Vul de nieuwe P* in bij Qv.', expl: 'Q_nieuw = ' + alpha + ' \u2212 ' + b + '\u00D7' + Pn + ' = ' + Qn },
                { q: 'Bereken het welvaartsverlies.', a: dwl, hint: 'Het welvaartsverlies is een driehoek. Wat zijn de basis en hoogte?', expl: 'DWL = \u00BD \u00D7 (' + Qs + ' \u2212 ' + round1(Qn) + ') \u00D7 ' + heffing + ' = ' + dwl }
            ]
        };
    };

    GEN.A33 = function () {
        var P = ri(25, 50);
        var a = pick([0.5, 1, 1.5, 2]), bk = ri(3, 12), ck = ri(50, 200);
        var Qs = round1((P - bk) / (2 * a));
        if (Qs <= 0 || Qs !== Math.round(Qs * 10) / 10) return GEN.A33();
        var tk = round1(a * Qs * Qs + bk * Qs + ck);
        var gtk = round2(tk / Qs);
        var profitPerUnit = round2(P - gtk);
        var totalProfit = round1(profitPerUnit * Qs);
        var mcE5 = mcStep(
            'Wat is de voorwaarde voor optimale productie bij volkomen mededinging?',
            'P = MK',
            ['MO = MK', 'P = GTK', 'TO = TK'],
            'Bij VM is de prijs gegeven. De producent is een prijsnemer.',
            'Bij VM geldt P = MO (horizontale vraaglijn). Dus MO = MK wordt P = MK.'
        );
        return {
            context: 'Marktprijs P = ' + P + ' (volledige mededinging).\nTK = ' + a + 'Q\u00B2 + ' + bk + 'Q + ' + ck + '.\nBepaal de optimale productie en winst.',
            steps: [
                mcE5,
                { q: 'Bepaal de optimale productiehoeveelheid Q*.', a: Qs, hint: 'Bij volledige mededinging geldt: P = MK. Bepaal eerst MK.', expl: 'MK = ' + round1(2 * a) + 'Q + ' + bk + '. P = MK \u2192 Q* = (' + P + ' \u2212 ' + bk + ') \u00F7 ' + round1(2 * a) + ' = ' + Qs },
                { q: 'Bereken TK bij de optimale hoeveelheid.', a: tk, hint: 'Vul Q* = ' + Qs + ' in de kostenfunctie in.', expl: 'TK = ' + a + '\u00D7' + Qs + '\u00B2 + ' + bk + '\u00D7' + Qs + ' + ' + ck + ' = ' + tk },
                { q: 'Bereken GTK bij de optimale hoeveelheid.', a: gtk, hint: 'GTK = TK gedeeld door Q.', expl: 'GTK = ' + tk + ' \u00F7 ' + Qs + ' = ' + gtk },
                { q: 'Bereken de winst per stuk.', a: profitPerUnit, hint: 'Winst per stuk = prijs minus gemiddelde kosten.', expl: 'Winst/stuk = ' + P + ' \u2212 ' + gtk + ' = ' + profitPerUnit },
                { q: 'Bereken de totale winst.', a: totalProfit, hint: 'Totale winst = winst per stuk \u00D7 hoeveelheid.', expl: 'Totale winst = ' + profitPerUnit + ' \u00D7 ' + Qs + ' = ' + totalProfit }
            ]
        };
    };

    GEN.A34 = function () {
        var b = ri(2, 4), d = ri(1, 3);
        var Ps = ri(15, 25);
        var c = ri(5, d * Ps - 2);
        var a = (b + d) * Ps + c;
        var Qs = a - b * Ps;
        var Pw = Ps - ri(3, 7);
        var Qd = a - b * Pw;
        var Qsup = Math.max(0, -c + d * Pw);
        var importR = ri(2, 5);
        var QdNew = a - b * (Pw + importR);
        var QsupNew = Math.max(0, -c + d * (Pw + importR));
        var govRev = round1(importR * (QdNew - QsupNew));
        if (Qsup < 0 || QsupNew < 0 || QdNew <= QsupNew) return GEN.A34();
        var orderE6 = {
            q: 'Zet de analysestappen voor een invoerrecht in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Bereken vraag en aanbod bij de wereldmarktprijs',
                'Bereken de import zonder invoerrecht',
                'Bereken vraag en aanbod bij Pw + invoerrecht',
                'Bereken de overheidsinkomsten'
            ],
            correctOrder: [0, 1, 2, 3],
            hint: 'Begin met de situatie zonder ingrijpen, dan met invoerrecht.',
            expl: 'Uitgangssituatie \u2192 import berekenen \u2192 nieuwe situatie \u2192 overheidsinkomsten.'
        };
        return {
            context: 'Qv = ' + a + ' \u2212 ' + b + 'P, Qa = \u2212' + c + ' + ' + d + 'P.\nWereldmarktprijs Pw = ' + Pw + '. Invoerrecht: \u20AC' + importR + '/stuk.\nAnalyseer de effecten.',
            steps: [
                orderE6,
                { q: 'Bereken de binnenlandse vraag bij de wereldmarktprijs.', a: Qd, hint: 'Vul Pw = ' + Pw + ' in bij Qv.', expl: 'Qd = ' + a + ' \u2212 ' + b + '\u00D7' + Pw + ' = ' + Qd },
                { q: 'Bereken het binnenlandse aanbod bij de wereldmarktprijs.', a: Qsup, hint: 'Vul Pw = ' + Pw + ' in bij Qa.', expl: 'Qs = \u2212' + c + ' + ' + d + '\u00D7' + Pw + ' = ' + Qsup },
                { q: 'Hoeveel wordt er ge\u00EFmporteerd zonder invoerrecht?', a: Qd - Qsup, hint: 'Import = binnenlandse vraag \u2212 binnenlands aanbod.', expl: 'Import = ' + Qd + ' \u2212 ' + Qsup + ' = ' + (Qd - Qsup) },
                { q: 'Wat is de nieuwe binnenlandse prijs na het invoerrecht?', a: Pw + importR, hint: 'Het invoerrecht wordt opgeteld bij de wereldmarktprijs.', expl: 'P_nieuw = ' + Pw + ' + ' + importR + ' = ' + (Pw + importR) },
                { q: 'Hoeveel wordt er ge\u00EFmporteerd m\u00E9t invoerrecht?', a: QdNew - QsupNew, hint: 'Bereken vraag en aanbod bij de nieuwe prijs en trek af.', expl: 'Import = ' + QdNew + ' \u2212 ' + QsupNew + ' = ' + (QdNew - QsupNew) },
                { q: 'Bereken de overheidsinkomsten uit het invoerrecht.', a: govRev, hint: 'Overheidsinkomsten = tarief \u00D7 ge\u00EFmporteerde hoeveelheid.', expl: importR + ' \u00D7 ' + (QdNew - QsupNew) + ' = ' + govRev }
            ]
        };
    };

    GEN.A35 = function () {
        var aP = ri(60, 120), bP = ri(1, 4);
        var aTK = pick([0.5, 1, 2]), bTK = ri(5, 20), cTK = ri(50, 200);
        var Qs = round1((aP - bTK) / (2 * bP + 2 * aTK));
        if (Qs <= 0 || Qs !== Math.round(Qs * 10) / 10) return GEN.A35();
        var Pstar = round1(aP - bP * Qs);
        var TO = round1(Pstar * Qs);
        var TK = round1(aTK * Qs * Qs + bTK * Qs + cTK);
        var profit = round1(TO - TK);
        var wrongQs = round1(aP / (2 * bP));
        var errorE7 = {
            q: 'E\u00E9n van deze methoden voor winstmaximalisatie bevat een fout. Welke?',
            mode: 'error',
            shownSteps: [
                { text: 'MO = MK: ' + aP + ' \u2212 ' + (2 * bP) + 'Q = ' + round1(2 * aTK) + 'Q + ' + bTK + ' \u2192 Q = ' + Qs, isError: false },
                { text: 'MO = 0: ' + aP + ' \u2212 ' + (2 * bP) + 'Q = 0 \u2192 Q = ' + wrongQs, isError: true },
                { text: 'MO = ' + aP + ' \u2212 ' + (2 * bP) + 'Q en MK = ' + round1(2 * aTK) + 'Q + ' + bTK, isError: false }
            ],
            hint: 'De monopolist maximaliseert winst bij MO = MK, niet bij MO = 0.',
            expl: 'MO = 0 geeft de opbrengstmaximaliserende hoeveelheid, niet de winstmaximaliserende.'
        };
        var errE7Items = errorE7.shownSteps.slice();
        var errE7Item = errE7Items.splice(1, 1)[0];
        errE7Items.splice(ri(0, 2), 0, errE7Item);
        errorE7.shownSteps = errE7Items;
        return {
            context: 'Monopolist: P = ' + aP + ' \u2212 ' + bP + 'Q.\nTK = ' + aTK + 'Q\u00B2 + ' + bTK + 'Q + ' + cTK + '.\nBepaal de maximale winst.',
            steps: [
                errorE7,
                { q: 'Bepaal de winstmaximaliserende hoeveelheid Q*.', a: Qs, hint: 'Stel MO = MK. Bepaal eerst MO en MK uit de gegeven functies.', expl: 'MO = ' + aP + ' \u2212 ' + (2 * bP) + 'Q, MK = ' + round1(2 * aTK) + 'Q + ' + bTK + '. MO = MK \u2192 Q* = ' + Qs },
                { q: 'Bereken de prijs die de monopolist vraagt.', a: Pstar, hint: 'Vul Q* in de vraaglijn (P = \u2026).', expl: 'P* = ' + aP + ' \u2212 ' + bP + '\u00D7' + Qs + ' = ' + Pstar },
                { q: 'Bereken de totale opbrengst.', a: TO, hint: 'TO = P* \u00D7 Q*.', expl: 'TO = ' + Pstar + ' \u00D7 ' + Qs + ' = ' + TO },
                { q: 'Bereken de totale kosten bij Q*.', a: TK, hint: 'Vul Q* in de kostenfunctie.', expl: 'TK = ' + aTK + '\u00D7' + Qs + '\u00B2 + ' + bTK + '\u00D7' + Qs + ' + ' + cTK + ' = ' + TK },
                { q: 'Bereken de maximale winst.', a: profit, hint: 'Winst = TO \u2212 TK.', expl: 'Winst = ' + TO + ' \u2212 ' + TK + ' = ' + profit }
            ]
        };
    };

    GEN.A36 = function () {
        var a1 = ri(60, 100), b1 = ri(1, 3);
        var a2 = ri(80, 140), b2 = ri(2, 5);
        var mk = ri(10, 25);
        var Q1 = round1((a1 - mk) / (2 * b1));
        var Q2 = round1((a2 - mk) / (2 * b2));
        if (Q1 <= 0 || Q2 <= 0) return GEN.A36();
        var P1 = round1(a1 - b1 * Q1);
        var P2 = round1(a2 - b2 * Q2);
        var profit1 = round1((P1 - mk) * Q1);
        var profit2 = round1((P2 - mk) * Q2);
        var totalProfit = round1(profit1 + profit2);
        var orderE8 = {
            q: 'Zet de stappen voor prijsdiscriminatie in de juiste volgorde.',
            mode: 'order',
            blocks: [
                'Stel MO = MK op voor elke markt apart',
                'Bereken Q* per markt',
                'Bepaal de prijs per markt via de vraaglijn',
                'Bereken de winst per markt en tel op'
            ],
            correctOrder: [0, 1, 2, 3],
            hint: 'Bij prijsdiscriminatie optimaliseer je elke markt apart.',
            expl: 'Per markt: MO = MK \u2192 Q* \u2192 P* \u2192 winst. Totaal = som van deelmarkten.'
        };
        return {
            context: 'Prijsdiscriminatie. MK = ' + mk + ' (constant).\nMarkt 1: P\u2081 = ' + a1 + ' \u2212 ' + b1 + 'Q\u2081\nMarkt 2: P\u2082 = ' + a2 + ' \u2212 ' + b2 + 'Q\u2082',
            steps: [
                orderE8,
                { q: 'Bepaal de optimale hoeveelheid op markt 1.', a: Q1, hint: 'Stel MO\u2081 = MK en los op. MO\u2081 is de afgeleide van TO\u2081.', expl: 'MO\u2081 = ' + a1 + ' \u2212 ' + (2 * b1) + 'Q\u2081 = ' + mk + ' \u2192 Q\u2081 = ' + Q1 },
                { q: 'Welke prijs vraagt de monopolist op markt 1?', a: P1, hint: 'Vul Q\u2081 in de vraagfunctie van markt 1.', expl: 'P\u2081 = ' + a1 + ' \u2212 ' + b1 + '\u00D7' + Q1 + ' = ' + P1 },
                { q: 'Bepaal de optimale hoeveelheid op markt 2.', a: Q2, hint: 'Stel MO\u2082 = MK en los op.', expl: 'MO\u2082 = ' + a2 + ' \u2212 ' + (2 * b2) + 'Q\u2082 = ' + mk + ' \u2192 Q\u2082 = ' + Q2 },
                { q: 'Welke prijs vraagt de monopolist op markt 2?', a: P2, hint: 'Vul Q\u2082 in de vraagfunctie van markt 2.', expl: 'P\u2082 = ' + a2 + ' \u2212 ' + b2 + '\u00D7' + Q2 + ' = ' + P2 },
                { q: 'Bereken de winst op markt 1.', a: profit1, hint: 'Winst = (prijs \u2212 MK) \u00D7 hoeveelheid.', expl: 'Winst\u2081 = (' + P1 + ' \u2212 ' + mk + ') \u00D7 ' + Q1 + ' = ' + profit1 },
                { q: 'Bereken de winst op markt 2.', a: profit2, hint: 'Winst = (prijs \u2212 MK) \u00D7 hoeveelheid.', expl: 'Winst\u2082 = (' + P2 + ' \u2212 ' + mk + ') \u00D7 ' + Q2 + ' = ' + profit2 },
                { q: 'Bereken de totale winst.', a: totalProfit, hint: 'Tel de winst van beide markten op.', expl: 'Totaal = ' + profit1 + ' + ' + profit2 + ' = ' + totalProfit }
            ]
        };
    };

    GEN.A37 = function () {
        // Lange-termijnevenwicht VM: MK = GTK → find Q, then price, verify profit = 0
        // Same number strategy as S10: Q first, c = a × Q²
        var Qstar = ri(5, 15);
        var a = pick([0.5, 1, 1.5, 2]);
        var bk = ri(3, 12);
        var c = round1(a * Qstar * Qstar);
        var mkStar = round1(2 * a * Qstar + bk);
        var gtkStar = round2(a * Qstar + bk + c / Qstar);
        // At MK = GTK, price = MK = GTK (by definition), so profit = 0
        return {
            context: 'Volkomen mededinging, lange termijn.\nTK = ' + a + 'Q\u00B2 + ' + bk + 'Q + ' + c + '.\nBepaal het lange-termijnevenwicht.',
            steps: [
                { q: 'Stel MK = GTK en los Q op.', a: Qstar, hint: 'MK = ' + round1(2 * a) + 'Q + ' + bk + ', GTK = ' + a + 'Q + ' + bk + ' + ' + c + '/Q. Stel gelijk en vereenvoudig.', expl: a + 'Q = ' + c + '/Q \u2192 Q\u00B2 = ' + round1(c / a) + ' \u2192 Q* = ' + Qstar },
                { q: 'Bereken MK bij Q* = ' + Qstar + '.', a: mkStar, hint: 'MK = ' + round1(2 * a) + 'Q + ' + bk + '. Vul Q* in.', expl: 'MK = ' + round1(2 * a) + '\u00D7' + Qstar + ' + ' + bk + ' = ' + mkStar },
                { q: 'Wat is de lange-termijn evenwichtsprijs?', a: mkStar, hint: 'Op lange termijn bij VM geldt: P = MK = GTK.', expl: 'P = MK(Q*) = ' + mkStar },
                { q: 'Bereken GTK bij Q* (ter verificatie).', a: gtkStar, hint: 'GTK = ' + a + 'Q + ' + bk + ' + ' + c + '/Q. Vul Q* = ' + Qstar + ' in.', expl: 'GTK = ' + a + '\u00D7' + Qstar + ' + ' + bk + ' + ' + c + '/' + Qstar + ' = ' + gtkStar + ' \u2248 P \u2713' },
                { q: 'Wat is de winst per stuk op lange termijn?', a: 0, hint: 'Bij lange-termijnevenwicht bij VM geldt P = GTK.', expl: 'Winst/stuk = P \u2212 GTK = ' + mkStar + ' \u2212 ' + gtkStar + ' \u2248 0 (afrondingsverschil)' },
                mcStep(
                    'De economische winst is nul. Waarom blijven bedrijven toch produceren?',
                    'Ze maken normale winst (ondernemersbeloning zit in de kosten)',
                    ['Ze hopen dat de prijs stijgt', 'Ze zijn verplicht om door te gaan', 'Ze maken eigenlijk wel winst maar die is verborgen'],
                    'Denk aan het verschil tussen economische winst en boekhoudkundige winst.',
                    'Bij economische winst = 0 is de ondernemersbeloning al verrekend in TK. Het bedrijf maakt "normale winst".'
                )
            ]
        };
    };

    GEN.A38 = function () {
        var oldValue = ri(50, 200);
        var pct = pick([-25, -20, -10, -5, 5, 10, 20, 25]);
        var newValue = round1(oldValue * (1 + pct / 100));
        var diff = round1(newValue - oldValue);
        return {
            context: 'Een waarde verandert van ' + oldValue + ' naar ' + newValue + '. Bereken de procentuele verandering.',
            steps: [
                { q: 'Bereken nieuw minus oud.', a: diff, hint: 'Trek de oude waarde af van de nieuwe waarde.', expl: 'Verschil = ' + newValue + ' - ' + oldValue + ' = ' + diff + '.' },
                { q: 'Bereken de procentuele verandering.', a: pct, hint: 'Gebruik: (nieuw - oud) / oud x 100.', expl: '(' + diff + ' / ' + oldValue + ') x 100 = ' + pct + '%.' },
                mcStep(
                    'Hoe interpreteer je het teken?',
                    pct > 0 ? 'stijging' : 'daling',
                    ['stijging', 'daling', 'procentpunt', 'indexcijfer'],
                    'Een positief percentage betekent omhoog; een negatief percentage betekent omlaag.',
                    'De uitkomst is ' + pct + '%, dus dit is een ' + (pct > 0 ? 'stijging' : 'daling') + '.'
                )
            ]
        };
    };

    GEN.A39 = function () {
        var basePrice = ri(40, 120);
        var index = pick([85, 90, 95, 105, 110, 115, 120, 125]);
        var currentPrice = round1(basePrice * index / 100);
        var previousIndex = pick([90, 95, 100, 105, 110]);
        if (previousIndex === index) previousIndex += 5;
        var inflation = round2((index - previousIndex) / previousIndex * 100);
        return {
            context: 'Een boodschappenmand kost in het basisjaar ' + basePrice + '. In het doeljaar kost dezelfde mand ' + currentPrice + '.',
            steps: [
                { q: 'Bereken de prijsindex van het doeljaar.', a: index, hint: 'Index = mandprijs doeljaar / mandprijs basisjaar x 100.', expl: 'Index = ' + currentPrice + ' / ' + basePrice + ' x 100 = ' + index + '.' },
                { q: 'Als de vorige index ' + previousIndex + ' was, hoeveel procent inflatie is er dan?', a: inflation, hint: 'Gebruik A38 op de indexwaarden.', expl: 'Inflatie = (' + index + ' - ' + previousIndex + ') / ' + previousIndex + ' x 100 = ' + inflation + '%.' },
                mcStep(
                    'Wat betekent een index van ' + index + '?',
                    index > 100 ? 'de mand is duurder dan in het basisjaar' : 'de mand is goedkoper dan in het basisjaar',
                    ['de mand is duurder dan in het basisjaar', 'de mand is goedkoper dan in het basisjaar', 'de inflatie is precies ' + index + '%', 'het basisjaar kost ' + index],
                    'Vergelijk de index met 100.',
                    'Het basisjaar is 100. Een index ' + (index > 100 ? 'boven' : 'onder') + ' 100 betekent dat de mand ' + (index > 100 ? 'duurder' : 'goedkoper') + ' is.'
                )
            ]
        };
    };

    GEN.A40 = function () {
        var kind = pick(['consumentensurplus', 'producentensurplus', 'belastingopbrengst', 'welvaartsverlies']);
        var correctRegion = {
            consumentensurplus: 'tussen vraagcurve en prijs, links van Q',
            producentensurplus: 'tussen prijs en aanbodcurve, links van Q',
            belastingopbrengst: 'rechthoek: heffing per stuk x verhandelde hoeveelheid',
            welvaartsverlies: 'driehoek tussen oude en nieuwe hoeveelheid'
        }[kind];
        return {
            context: 'Je krijgt een P-Q diagram en moet het gebied voor ' + kind + ' arceren.',
            steps: [
                mcStep(
                    'Welk gebied hoort bij ' + kind + '?',
                    correctRegion,
                    [
                        'tussen vraagcurve en prijs, links van Q',
                        'tussen prijs en aanbodcurve, links van Q',
                        'rechthoek: heffing per stuk x verhandelde hoeveelheid',
                        'driehoek tussen oude en nieuwe hoeveelheid',
                        'alles onder de aanbodcurve'
                    ],
                    'Bepaal eerst welke economische grootheid gevraagd wordt.',
                    kind + ' hoort bij: ' + correctRegion + '.'
                ),
                {
                    q: 'Zet de arceerstappen in de juiste volgorde.',
                    mode: 'order',
                    blocks: [
                        'Bepaal welke grootheid gevraagd wordt',
                        'Zoek de grenzen van het gebied',
                        'Arceer de gesloten figuur en label die'
                    ],
                    correctOrder: [0, 1, 2],
                    hint: 'Eerst herkennen, dan grenzen zoeken, dan tekenen.',
                    expl: 'Je voorkomt een verkeerd gebied door eerst de definitie en grenzen vast te leggen.'
                }
            ]
        };
    };

    GEN.A41 = function () {
        var intercept = ri(4, 16);
        var slope = pick([1, 2, 3, 4]);
        var amount = ri(2, 8);
        var isTax = Math.random() < 0.5;
        var newIntercept = isTax ? intercept + amount : intercept - amount;
        return {
            context: 'De inverse aanbodfunctie is P = ' + intercept + ' + ' + slope + 'Q. Er komt een ' + (isTax ? 'heffing' : 'subsidie') + ' van ' + amount + ' per stuk.',
            steps: [
                mcStep(
                    'Wat gebeurt er met de aanbodcurve in P-vorm?',
                    isTax ? 'heffing: aanbod schuift omhoog' : 'subsidie: aanbod schuift omlaag',
                    ['heffing: aanbod schuift omhoog', 'heffing: aanbod schuift omlaag', 'subsidie: aanbod schuift omhoog', 'subsidie: aanbod schuift omlaag'],
                    'Denk vanuit de kosten per extra product.',
                    (isTax ? 'Een heffing verhoogt' : 'Een subsidie verlaagt') + ' de prijs die aanbieders nodig hebben bij elke hoeveelheid.'
                ),
                { q: 'Wat wordt de nieuwe constante term in de inverse aanbodfunctie?', a: newIntercept, hint: (isTax ? 'Tel de heffing erbij op.' : 'Trek de subsidie ervan af.'), expl: 'Nieuwe constante = ' + intercept + (isTax ? ' + ' : ' - ') + amount + ' = ' + newIntercept + '.' },
                {
                    q: 'Zet de aanpak in de juiste volgorde.',
                    mode: 'order',
                    blocks: [
                        'Schrijf aanbod in inverse vorm',
                        'Verwerk heffing of subsidie in de constante term',
                        'Stel de nieuwe aanbodfunctie gelijk aan vraag'
                    ],
                    correctOrder: [0, 1, 2],
                    hint: 'Eerst de vorm goed zetten, dan verschuiven, dan evenwicht oplossen.',
                    expl: 'De fout zit vaak in de richting van de verschuiving; daarom werk je eerst in P-vorm.'
                }
            ]
        };
    };

    GEN.A42 = function () {
        var curve = pick(['vraagcurve', 'aanbodcurve']);
        var direction = pick(['rechts', 'links']);
        var label = curve === 'vraagcurve' ? 'D' : 'S';
        return {
            context: 'Teken een verschuiving van de ' + curve + ' naar ' + direction + ' met een oud-en-nieuw diagram.',
            steps: [
                mcStep(
                    'Welke labels gebruik je voor de oude en nieuwe curve?',
                    label + ' en ' + label + "'",
                    [label + ' en ' + label + "'", 'P en Q', "E en E'", 'MK en MO'],
                    'Vraag is D, aanbod is S. De nieuwe curve krijgt een accent.',
                    'De oude curve is ' + label + ', de nieuwe curve is ' + label + "'."
                ),
                mcStep(
                    'Welke richting krijgen de verschuivingspijlen?',
                    'horizontaal',
                    ['horizontaal', 'verticaal', 'diagonaal', 'langs de curve'],
                    'Een verschuiving laat zien hoeveel Q verandert bij dezelfde P.',
                    'De pijlen zijn horizontaal omdat je de hoeveelheid bij gelijke prijs vergelijkt.'
                ),
                {
                    q: 'Zet de tekenstappen in de juiste volgorde.',
                    mode: 'order',
                    blocks: [
                        'Teken en label de oude curve',
                        'Teken en label de nieuwe curve',
                        'Plaats horizontale pijlen tussen oud en nieuw'
                    ],
                    correctOrder: [0, 1, 2],
                    hint: 'Het oude beeld blijft zichtbaar.',
                    expl: 'Een verschuivingsdiagram toont altijd oud, nieuw en richting.'
                }
            ]
        };
    };

    GEN.A43 = function () {
        var qA = ri(2, 9), qB = ri(2, 9), qC = ri(2, 9);
        var pA = ri(3, 12), pB = ri(3, 12), pC = ri(3, 12);
        var winA = qA * pA, winB = qB * pB, winC = qC * pC;
        var total = winA + winB + winC;
        return {
            context: 'Een leerling verdeelt tijd over drie activiteiten.\nA: ' + qA + ' uur x ' + pA + ' winst per uur.\nB: ' + qB + ' uur x ' + pB + ' winst per uur.\nC: ' + qC + ' uur x ' + pC + ' winst per uur.',
            steps: [
                { q: 'Bereken de winst van activiteit A.', a: winA, hint: 'Hoeveelheid x winst per eenheid.', expl: 'A = ' + qA + ' x ' + pA + ' = ' + winA + '.' },
                { q: 'Bereken de winst van activiteit B.', a: winB, hint: 'Hoeveelheid x winst per eenheid.', expl: 'B = ' + qB + ' x ' + pB + ' = ' + winB + '.' },
                { q: 'Bereken de totale winst van de gekozen mix.', a: total, hint: 'Tel de winst van A, B en C op.', expl: 'Totaal = ' + winA + ' + ' + winB + ' + ' + winC + ' = ' + total + '.' },
                mcStep(
                    'Welke activiteiten tel je mee?',
                    'alleen de daadwerkelijk gekozen activiteiten',
                    ['alleen de daadwerkelijk gekozen activiteiten', 'alle mogelijke alternatieven', 'alleen de activiteit met hoogste winst per uur', 'alleen de niet-gekozen alternatieven'],
                    'De vraag gaat over deze allocatie.',
                    'Totale winst hoort bij wat echt gekozen is, niet bij de gemiste alternatieven.'
                )
            ]
        };
    };

    GEN.A44 = function () {
        var w1 = ri(14, 20);
        var w2 = w1 - ri(2, 4);
        var w3 = w2 - ri(2, 4);
        var w4 = w3 - ri(2, 4);
        var price = pick([w2, w3 + 1, w3, w4 + 1]);
        var values = [w1, w2, w3, w4];
        var demanded = values.filter(function (v) { return v >= price; }).length;
        var totalWtp = values.slice(0, demanded).reduce(function (sum, v) { return sum + v; }, 0);
        return {
            context: 'Betalingsbereidheid per extra eenheid: 1e=' + w1 + ', 2e=' + w2 + ', 3e=' + w3 + ', 4e=' + w4 + '. De marktprijs is ' + price + '.',
            steps: [
                mcStep(
                    'Welke vorm heeft de individuele vraagcurve?',
                    'een dalende stapfunctie',
                    ['een dalende stapfunctie', 'een stijgende rechte lijn', 'een horizontale prijslijn', 'een U-vormige kostencurve'],
                    'Elke extra eenheid heeft een eigen betalingsbereidheid.',
                    'Per eenheid teken je een horizontale stap op de hoogte van de betalingsbereidheid.'
                ),
                { q: 'Hoeveel eenheden koopt deze consument bij prijs ' + price + '?', a: demanded, hint: 'Tel elke eenheid met betalingsbereidheid groter dan of gelijk aan de prijs.', expl: demanded + ' eenheid/eenheden hebben betalingsbereidheid >= ' + price + '.' },
                { q: 'Wat is de totale betalingsbereidheid voor deze gekochte eenheden?', a: totalWtp, hint: 'Tel de betalingsbereidheid van de gekochte eenheden op.', expl: 'Totale betalingsbereidheid = ' + values.slice(0, demanded).join(' + ') + ' = ' + totalWtp + '.' },
                {
                    q: 'Zet de tekenstappen in de juiste volgorde.',
                    mode: 'order',
                    blocks: [
                        'Zet P op de verticale as en Q op de horizontale as',
                        'Teken per eenheid een horizontale stap',
                        'Laat de stappen dalen als betalingsbereidheid afneemt'
                    ],
                    correctOrder: [0, 1, 2],
                    hint: 'Eerst assen, dan stappen, dan controleren of de curve daalt.',
                    expl: 'Een individuele vraagcurve uit betalingsbereidheid is trapsgewijs.'
                }
            ]
        };
    };

    return {
        GEN: GEN,
        helpers: { ri: ri, pick: pick, round1: round1, round2: round2, mcStep: mcStep }
    };
});
