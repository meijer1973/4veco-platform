/**
 * ReasoningEngine — Pure game logic for the Reasoning Game.
 * Supports 6 game modes and 3 content domains.
 * No DOM references. Works in both browser (<script>) and Node.js (require).
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.ReasoningEngine = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function readAdaptivePayload(paragraphId, storage) {
        var seam = null;
        if (typeof globalThis !== 'undefined' && globalThis.AdaptiveSeam) {
            seam = globalThis.AdaptiveSeam;
        }
        if (!seam && typeof require === 'function') {
            try { seam = require('./adaptive-seam'); } catch (e) { seam = null; }
        }
        if (seam && typeof seam.readPayload === 'function') {
            return seam.readPayload({ paragraphId: paragraphId || null, storage: storage });
        }
        return {
            schema_version: 1,
            paragraph_id: paragraphId || null,
            focus_skills: [],
            difficulty_hint: 'default',
            allowed_hints: 'default',
            source: 'none'
        };
    }

    function buildSkillMapRequest(surface, aspectFilter, paragraphId, options) {
        options = options || {};
        var engine = null;
        if (typeof globalThis !== 'undefined' && globalThis.SkillMapEngine) engine = globalThis.SkillMapEngine;
        if (!engine && typeof require === 'function') {
            try { engine = require('./skill-map-engine'); } catch (e) { engine = null; }
        }
        if (engine && typeof engine.createRequest === 'function') {
            return engine.createRequest(surface, Object.assign({ paragraph: paragraphId, aspectFilter: aspectFilter }, options));
        }
        return {
            paragraph: paragraphId || null,
            surface: surface,
            mode: options.mode || 'route',
            aspectFilter: aspectFilter,
            skillScope: Array.isArray(options.skillScope) ? options.skillScope.slice() : null,
            targetSkills: Array.isArray(options.targetSkills) ? options.targetSkills.slice() : [],
            maxVisibleAvailable: options.maxVisibleAvailable || 4,
            allowFullView: false,
            boundaryFlags: {
                diagnostics: false,
                adaptiveRouting: false,
                masteryDecisions: false,
                automaticSequencing: false,
                studentFacingAI: false,
                summativeUse: false,
                pvProjection: false,
                pvMachinePromotion: false,
                studentFacingOutput: false
            }
        };
    }

    function getTaskShellEngine() {
        if (typeof globalThis !== 'undefined' && globalThis.TaskShellEngine) {
            return globalThis.TaskShellEngine;
        }
        if (typeof require === 'function') {
            try { return require('./task-shell-engine'); } catch (e) { return null; }
        }
        return null;
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    // ── Domain configurations ───────────────────────────────────────

    var DOMAINS = {
        arithmetic: {
            showFormula: false,
            useOperationCounting: true,
            hideFormulaInErrorMode: false,
            flowTypeColors: {
                given:     { bg: '#eff6ff', border: '#93c5fd', icon: '\uD83D\uDCE6' },
                operation: { bg: '#fff7ed', border: '#fdba74', icon: '\u2699\uFE0F' }
            },
            validFlowTypes: ['given', 'operation']
        },
        economics: {
            showFormula: false,
            useOperationCounting: false,
            hideFormulaInErrorMode: false,
            flowTypeColors: {
                cause:     { bg: '#fef3c7', border: '#f59e0b', icon: '\u26A1' },
                reasoning: { bg: '#e0f2fe', border: '#0ea5e9', icon: '\uD83D\uDD17' },
                effect:    { bg: '#dcfce7', border: '#22c55e', icon: '\uD83C\uDFAF' }
            },
            validFlowTypes: ['cause', 'reasoning', 'effect']
        },
        'math-economics': {
            showFormula: true,
            useOperationCounting: false,
            hideFormulaInErrorMode: true,
            flowTypeColors: {
                given:  { bg: '#eef2ff', border: '#818cf8', icon: '\uD83D\uDCCB' },
                step:   { bg: '#fef3c7', border: '#f59e0b', icon: '\u2699\uFE0F' },
                result: { bg: '#dcfce7', border: '#22c55e', icon: '\uD83C\uDFAF' }
            },
            validFlowTypes: ['given', 'step', 'result']
        }
    };

    var MODE_NAMES = [
        'Order Steps',
        'Build Sub-Questions',
        'Find the Error',
        'Build Flow Diagram',
        'Match Structures',
        'Build Reasoning Answer'
    ];

    var MODE_NAMES_NL = [
        'Stappen ordenen',
        'Deelvragen opbouwen',
        'Vind de fout',
        'Stroomdiagram bouwen',
        'Structuren matchen',
        'Redeneerantwoord opbouwen'
    ];

    var ANSWER_FORM_SCAFFOLDS = {
        A97: {
            unitId: 'A97',
            lane: 'leg_uit_dat',
            studentLabel: 'Leg uit dat',
            studentPurpose: 'Onderbouw een gegeven conclusie met een duidelijke oorzaak-gevolgketen.',
            checklist: [
                'Neem de conclusie uit de vraag als eindpunt.',
                'Start bij het gegeven of de oorzaak in de context.',
                'Schrijf minstens een controleerbare tussenstap.',
                'Koppel je redenering terug aan de conclusie.'
            ],
            repairFocus: [
                'Ontbreekt de tussenstap?',
                'Komt de conclusie nog terug?',
                'Is het economische begrip duidelijk gebruikt?'
            ]
        },
        A98: {
            unitId: 'A98',
            lane: 'leg_uit_of',
            studentLabel: 'Leg uit of',
            studentPurpose: 'Kies eerst de richting of ja/nee-uitkomst en leg daarna uit waarom.',
            checklist: [
                'Kies eerst je richting of oordeel.',
                'Zet die richting in je eerste zin.',
                'Leg de economische oorzaak of regel uit.',
                'Laat je antwoord niet beide kanten open.'
            ],
            repairFocus: [
                'Staat de richting duidelijk vooraan?',
                'Is de oorzaak of regel genoemd?',
                'Wordt de andere kant niet alsnog open gelaten?'
            ]
        },
        A99: {
            unitId: 'A99',
            lane: 'leg_uit_met_voorbeeld',
            studentLabel: 'Leg uit met voorbeeld',
            studentPurpose: 'Gebruik een concreet voorbeeld en leg uit waarom dat voorbeeld past.',
            checklist: [
                'Kies een voorbeeld dat bij de context past.',
                'Benoem welk kenmerk van het voorbeeld belangrijk is.',
                'Leg uit waarom dat kenmerk bij het begrip hoort.',
                'Koppel het voorbeeld terug aan de vraag.'
            ],
            repairFocus: [
                'Is het voorbeeld concreet?',
                'Leg je uit waarom het voorbeeld past?',
                'Sluit het voorbeeld aan op de context?'
            ]
        },
        A81: {
            unitId: 'A81',
            lane: 'bron_modifier',
            studentLabel: 'Bron gebruiken',
            studentPurpose: 'Gebruik een brongegeven als startpunt en maak daarna de onderliggende antwoordvorm af.',
            checklist: [
                'Noem het relevante brongegeven met label, periode, eenheid of richting.',
                'Zeg wat dat gegeven economisch betekent.',
                'Verbind het brongegeven met je uitleg, berekening of conclusie.',
                'Stop niet bij alleen aflezen of citeren.'
            ],
            repairFocus: [
                'Is de bron echt gebruikt?',
                'Staat de eenheid of richting erbij?',
                'Is er ook een onderliggende uitleg of berekening?'
            ],
            requiresUnderlyingAnswerForm: true
        },
        A96: {
            unitId: 'A96',
            lane: 'bereken',
            studentLabel: 'Berekening tonen',
            studentPurpose: 'Toon formule, invulling, tussenstappen, eindantwoord en notatie.',
            checklist: [
                'Kies de juiste formule of rekenregel.',
                'Vul de gegevens zichtbaar in.',
                'Werk de tussenstappen uit.',
                'Geef het eindantwoord met eenheid of notatie.'
            ],
            repairFocus: [
                'Is de basiswaarde juist?',
                'Ontbreekt de notatie?',
                'Is er te vroeg afgerond?'
            ]
        }
    };

    function answerFormBoundaryFlags() {
        return {
            diagnostics: false,
            adaptiveRouting: false,
            masteryDecisions: false,
            automaticSequencing: false,
            studentFacingAI: false,
            summativeUse: false,
            pvProjection: false,
            pvMachinePromotion: false,
            scaleGate1: false,
            targetEquivalentProof: false,
            studentProductUse: false
        };
    }

    function mergeChecklist(base, extra) {
        var out = (base || []).slice();
        for (var i = 0; i < (extra || []).length; i++) out.push(extra[i]);
        return out;
    }

    function makeAnswerFormScaffold(unitId, options) {
        options = options || {};
        var base = ANSWER_FORM_SCAFFOLDS[unitId];
        if (!base) throw new Error('Unknown answer-form scaffold: ' + unitId);
        var unitIds = [unitId];
        var modifierUnitIds = options.modifierUnitIds || [];
        var coordinationUnitIds = options.coordinationUnitIds || [];
        for (var i = 0; i < modifierUnitIds.length; i++) unitIds.push(modifierUnitIds[i]);
        for (var j = 0; j < coordinationUnitIds.length; j++) unitIds.push(coordinationUnitIds[j]);
        return {
            schemaVersion: 1,
            visibility: 'practice_scaffold',
            primaryUnitId: unitId,
            unitIds: unitIds,
            modifierUnitIds: modifierUnitIds,
            coordinationUnitIds: coordinationUnitIds,
            lane: base.lane,
            studentLabel: options.studentLabel || base.studentLabel,
            studentPurpose: options.studentPurpose || base.studentPurpose,
            checklist: mergeChecklist(base.checklist, options.additionalChecklist),
            repairFocus: mergeChecklist(base.repairFocus, options.additionalRepairFocus),
            requiresUnderlyingAnswerForm: !!base.requiresUnderlyingAnswerForm,
            underlyingAnswerFormUnitId: options.underlyingAnswerFormUnitId || null,
            routeStatus: options.routeStatus || 'local_practice_scaffold',
            paragraphId: options.paragraphId || null,
            problemId: options.problemId || null,
            boundaryFlags: answerFormBoundaryFlags()
        };
    }

    function makeSourceUseScaffold(underlyingUnitId, options) {
        options = options || {};
        var underlying = ANSWER_FORM_SCAFFOLDS[underlyingUnitId];
        if (!underlying || underlyingUnitId === 'A81') {
            throw new Error('A81 source-use scaffold requires a non-A81 underlying answer form');
        }
        var scaffold = makeAnswerFormScaffold(underlyingUnitId, {
            paragraphId: options.paragraphId || null,
            problemId: options.problemId || null,
            modifierUnitIds: ['A81'],
            underlyingAnswerFormUnitId: underlyingUnitId,
            studentLabel: 'Bron gebruiken bij ' + underlying.studentLabel.toLowerCase(),
            studentPurpose: 'Gebruik eerst het brongegeven en bouw daarna de ' + underlying.studentLabel.toLowerCase() + '-redenering af.',
            additionalChecklist: ANSWER_FORM_SCAFFOLDS.A81.checklist,
            additionalRepairFocus: ANSWER_FORM_SCAFFOLDS.A81.repairFocus,
            routeStatus: options.routeStatus || 'future_source_use_pattern'
        });
        scaffold.requiresUnderlyingAnswerForm = true;
        scaffold.sourceUseModifier = true;
        return scaffold;
    }

    function inferAnswerFormScaffold(problem, domain, paragraphId) {
        var text = ((problem && problem.text) || '').toLowerCase();
        var label = ((problem && problem.structureLabel) || '').toLowerCase();
        var structureType = (problem && problem.structureType) || '';
        var baseOptions = {
            paragraphId: paragraphId || null,
            problemId: problem && problem.id || null
        };

        if (text.indexOf('voorbeeld') >= 0 || label.indexOf('voorbeeld') >= 0) {
            return makeAnswerFormScaffold('A99', baseOptions);
        }

        if (
            text.indexOf('klopt') >= 0 ||
            text.indexOf('corrigeer') >= 0 ||
            text.indexOf('welke keuze') >= 0
        ) {
            return makeAnswerFormScaffold('A98', baseOptions);
        }

        if (domain === 'math-economics') {
            if (structureType === 'C') {
                return makeAnswerFormScaffold('A97', Object.assign({}, baseOptions, {
                    coordinationUnitIds: ['A96'],
                    studentPurpose: 'Leg de indexpuntenfout uit en koppel de uitleg aan de berekening.',
                    additionalChecklist: [
                        'Noem indexpunten en procentuele verandering apart.',
                        'Gebruik het oude indexcijfer als basis voor de procentuele verandering.'
                    ],
                    additionalRepairFocus: [
                        'Worden indexpunten verward met procenten?',
                        'Is de oude index als basis gebruikt?'
                    ]
                }));
            }
            return makeAnswerFormScaffold('A97', Object.assign({}, baseOptions, {
                coordinationUnitIds: ['A96'],
                studentPurpose: 'Leg de rekenroute uit met zichtbaar gegeven, bewerking en conclusie.',
                additionalChecklist: [
                    'Gebruik de juiste basiswaarde.',
                    'Sluit af met de betekenis van het rekenantwoord.'
                ]
            }));
        }

        if (structureType === 'C') {
            return makeAnswerFormScaffold('A98', baseOptions);
        }

        return makeAnswerFormScaffold('A97', baseOptions);
    }

    // ── CSV Parser ──────────────────────────────────────────────────

    function parseCSV(csvString) {
        var lines = csvString.trim().split('\n');
        if (lines.length < 2) return [];

        var headers = parseLine(lines[0]);
        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            var values = parseLine(line);
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = (j < values.length) ? values[j] : '';
            }
            rows.push(obj);
        }
        return rows;
    }

    /** Parse a single CSV line respecting quoted fields */
    function parseLine(line) {
        var fields = [];
        var current = '';
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var ch = line[i];
            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < line.length && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ';') {
                    fields.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
        }
        fields.push(current.trim());
        return fields;
    }

    // ── Problem builder ─────────────────────────────────────────────

    function buildProblem(row) {
        var flowSlots = [];
        for (var i = 1; i <= 6; i++) {
            var type = row['flow_' + i + '_type'];
            var text = row['flow_' + i + '_text'];
            if (type && text) flowSlots.push({ type: type, text: text, origIdx: i - 1 });
        }

        return {
            id: parseInt(row.id) || 0,
            text: row.problem_text || '',
            structureType: row.structure_type || '',
            structureLabel: row.structure_label || '',

            steps: [
                { label: row.step_1_label || '', detail: row.step_1_detail || '', formula: row.step_1_formula || null },
                { label: row.step_2_label || '', detail: row.step_2_detail || '', formula: row.step_2_formula || null },
                { label: row.step_3_label || '', detail: row.step_3_detail || '', formula: row.step_3_formula || null }
            ],

            distractorSteps: [
                { label: row.distractor_1_label || '', detail: row.distractor_1_detail || '', formula: row.distractor_1_formula || null },
                { label: row.distractor_2_label || '', detail: row.distractor_2_detail || '', formula: row.distractor_2_formula || null },
                { label: row.distractor_3_label || '', detail: row.distractor_3_detail || '', formula: row.distractor_3_formula || null }
            ],

            subQuestions: {
                correct: [row.subq_1 || '', row.subq_2 || '', row.subq_3 || ''],
                distractors: [row.subq_distractor_1 || '', row.subq_distractor_2 || '']
            },

            errorInfo: {
                errorIdx: (parseInt(row.error_step_index) || 1) - 1,
                wrong: {
                    label: row.error_wrong_label || '',
                    detail: row.error_wrong_detail || '',
                    formula: row.error_wrong_formula || null
                }
            },

            flowSlots: flowSlots
        };
    }

    function buildStructuredReasoningTask(problem, scaffold) {
        var criteria = scaffold && scaffold.checklist && scaffold.checklist.length ? scaffold.checklist : [
            'Noem de beginsituatie of oorzaak.',
            'Leg de economische tussenstap uit.',
            'Sluit af met de conclusie in de context.'
        ];
        var task = {
            id: 'reasoning-answer-' + problem.id,
            family: 'structured_reasoning',
            skillLabel: scaffold ? scaffold.studentLabel : 'Redeneerantwoord opbouwen',
            purpose: scaffold ? scaffold.studentPurpose : 'Schrijf de denkroute in woorden en vergelijk daarna met de zelfcheck.',
            prompt: scaffold ? 'Schrijf je antwoord met deze antwoordvorm in gedachten.' : 'Schrijf een korte redenering bij de situatie hierboven.',
            interaction: {
                inputLabel: 'Jouw redenering',
                placeholder: 'Oorzaak -> tussenstap -> conclusie'
            },
            expected: {
                kind: 'self_check',
                criteria: criteria
            },
            feedback: {
                selfCheckTitle: 'Vergelijk je redenering',
                selfCheckText: 'Loop oorzaak, tussenstap en conclusie rustig na.',
                retryTitle: 'Schrijf eerst je redenering',
                retryText: 'Noteer minimaal de oorzaak, een tussenstap en de conclusie.'
            },
            practiceRoute: {
                label: 'Oefen verder met redeneren',
                href: 'redeneer-spel.html'
            }
        };
        if (scaffold) task.answerFormScaffold = clone(scaffold);
        return task;
    }

    function practiceRoute() {
        return {
            label: 'Oefen verder met redeneren',
            href: 'redeneer-spel.html'
        };
    }

    function appendFormula(text, formula) {
        if (!formula) return text;
        return text + ' (' + formula + ')';
    }

    function validateStandardTask(task) {
        var taskShell = getTaskShellEngine();
        if (taskShell && typeof taskShell.validateTask === 'function') {
            taskShell.validateTask(task);
        }
        return task;
    }

    function buildStepOrderingTask(problem, scaffold) {
        var steps = [];
        var order = [];
        for (var i = 0; i < problem.steps.length; i++) {
            var id = 'step-' + (i + 1);
            order.push(id);
            steps.push({
                id: id,
                label: problem.steps[i].label,
                description: appendFormula(problem.steps[i].detail, problem.steps[i].formula),
                kind: 'answer'
            });
        }
        for (var j = 0; j < problem.distractorSteps.length; j++) {
            if (!problem.distractorSteps[j].label) continue;
            steps.push({
                id: 'distractor-' + (j + 1),
                label: problem.distractorSteps[j].label,
                description: appendFormula(problem.distractorSteps[j].detail, problem.distractorSteps[j].formula),
                kind: 'distractor',
                distractorFor: order[Math.min(j, order.length - 1)]
            });
        }
        var task = {
            id: 'reasoning-step-order-' + problem.id,
            family: 'step_ordering',
            skillLabel: 'Redeneerstappen ordenen',
            purpose: 'Kies de stappen die samen de economische redenering vormen en zet ze in volgorde.',
            prompt: 'Zet de juiste redeneerstappen in de goede volgorde.',
            interaction: {
                stepBankLabel: 'Redeneerstappen',
                sequenceLabel: 'Jouw denkroute',
                placeholder: 'Bouw de redenering stap voor stap.',
                separator: ' -> ',
                steps: steps
            },
            expected: {
                kind: 'step_ordering',
                order: order,
                partialFeedback: 'practice_only'
            },
            feedback: {
                matchTitle: 'De denkroute klopt',
                matchText: 'Je hebt de noodzakelijke stappen in de juiste volgorde gezet.',
                retryTitle: 'Controleer de volgorde',
                retryText: 'Begin bij de oorzaak of gegevens, werk via de tussenstap en sluit af met de conclusie.'
            },
            practiceRoute: practiceRoute()
        };
        if (scaffold) task.answerFormScaffold = clone(scaffold);
        return validateStandardTask(task);
    }

    function buildClaimReasonEvidenceTask(problem, scaffold) {
        var steps = [];
        var order = [];
        for (var i = 0; i < problem.subQuestions.correct.length; i++) {
            var id = 'question-' + (i + 1);
            order.push(id);
            steps.push({
                id: id,
                label: problem.subQuestions.correct[i],
                kind: 'answer'
            });
        }
        for (var j = 0; j < problem.subQuestions.distractors.length; j++) {
            if (!problem.subQuestions.distractors[j]) continue;
            steps.push({
                id: 'question-distractor-' + (j + 1),
                label: problem.subQuestions.distractors[j],
                kind: 'distractor',
                distractorFor: order[Math.min(j, order.length - 1)]
            });
        }
        var task = {
            id: 'reasoning-claim-route-' + problem.id,
            family: 'step_ordering',
            skillLabel: 'Deelvragen als redeneerroute',
            purpose: 'Bouw de claim-redenering-bewijs route met de vragen die je eerst moet beantwoorden.',
            prompt: 'Zet de deelvragen in de volgorde waarin ze de redenering opbouwen.',
            interaction: {
                stepBankLabel: 'Deelvragen',
                sequenceLabel: 'Jouw redeneerroute',
                placeholder: 'Kies de deelvragen die nodig zijn.',
                separator: ' -> ',
                steps: steps
            },
            expected: {
                kind: 'step_ordering',
                order: order,
                partialFeedback: 'practice_only'
            },
            feedback: {
                matchTitle: 'De route klopt',
                matchText: 'Je deelvragen bouwen de redenering logisch op.',
                retryTitle: 'Kijk naar de denkroute',
                retryText: 'Laat losse weetjes weg en kies alleen vragen die helpen om de conclusie te onderbouwen.'
            },
            practiceRoute: practiceRoute()
        };
        if (scaffold) task.answerFormScaffold = clone(scaffold);
        return validateStandardTask(task);
    }

    function buildFlowOrderingTask(problem, scaffold) {
        var steps = [];
        var order = [];
        for (var i = 0; i < problem.flowSlots.length; i++) {
            var id = 'flow-' + (i + 1);
            order.push(id);
            steps.push({
                id: id,
                label: problem.flowSlots[i].text,
                description: 'Rol in de keten: ' + problem.flowSlots[i].type,
                kind: 'answer'
            });
        }
        var distractor = problem.errorInfo && problem.errorInfo.wrong && problem.errorInfo.wrong.detail
            ? problem.errorInfo.wrong.detail
            : (problem.distractorSteps[0] && problem.distractorSteps[0].detail) || 'Afleidende stap die niet in deze keten hoort';
        steps.push({
            id: 'flow-distractor-1',
            label: distractor,
            description: 'Afleider: deze stap past niet als onderdeel van de gevraagde keten.',
            kind: 'distractor',
            distractorFor: order[0]
        });
        var task = {
            id: 'reasoning-flow-chain-' + problem.id,
            family: 'step_ordering',
            skillLabel: 'Causale keten bouwen',
            purpose: 'Bouw de oorzaak-gevolgketen van beginpunt naar conclusie.',
            prompt: 'Zet de blokken in de volgorde van de economische keten.',
            interaction: {
                stepBankLabel: 'Ketenblokken',
                sequenceLabel: 'Jouw stroomdiagram',
                placeholder: 'Bouw de keten van oorzaak naar gevolg.',
                separator: ' -> ',
                steps: steps
            },
            expected: {
                kind: 'step_ordering',
                order: order,
                partialFeedback: 'practice_only'
            },
            feedback: {
                matchTitle: 'De keten loopt logisch',
                matchText: 'Je bouwt van beginpunt via tussenstappen naar conclusie.',
                retryTitle: 'Controleer de keten',
                retryText: 'Zoek eerst het beginpunt, daarna de tussenstap en eindig bij het effect of de conclusie.'
            },
            practiceRoute: practiceRoute()
        };
        if (scaffold) task.answerFormScaffold = clone(scaffold);
        return validateStandardTask(task);
    }

    function reasoningStandardDisposition(modeIndex) {
        var map = {
            0: {
                candidateFamily: 'step_ordering',
                standardAction: 'step_ordering',
                disposition: 'wrap_now'
            },
            1: {
                candidateFamily: 'claim_reason_evidence',
                standardAction: 'step_ordering',
                disposition: 'wrap_now'
            },
            2: {
                candidateFamily: 'error_detection',
                standardAction: 'two_tier_choice_or_choice',
                disposition: 'defer_mapping',
                answerFormRoute: 'local_error_repair_only'
            },
            3: {
                candidateFamily: 'flow_diagram_build',
                standardAction: 'step_ordering',
                disposition: 'wrap_now_visual_flow_follow_up'
            },
            4: {
                candidateFamily: 'classification_with_explanation',
                standardAction: 'matching_pairs_plus_structured_short_response',
                disposition: 'refactor_before_adoption',
                answerFormRoute: 'held_for_classification_with_explanation_design'
            },
            5: {
                candidateFamily: 'structured_reasoning',
                standardAction: 'structured_reasoning',
                disposition: 'already_wrapped_self_check'
            }
        };
        return map[modeIndex] || null;
    }

    // ── Shuffle (Fisher-Yates) ──────────────────────────────────────

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    // ── ReasoningEngine constructor ─────────────────────────────────

    /**
     * @param {Object} config
     * @param {string} config.csvString    — raw CSV content
     * @param {string} config.domain       — 'arithmetic' | 'economics' | 'math-economics'
     * @param {number} [config.roundsPerGame=5]
     */
    function ReasoningEngine(config) {
        if (!config) throw new Error('ReasoningEngine: config is required');
        if (!config.csvString) throw new Error('ReasoningEngine: csvString is required');
        if (!config.domain || !DOMAINS[config.domain]) {
            throw new Error('ReasoningEngine: invalid domain "' + config.domain + '"');
        }

        this.domain = config.domain;
        this.domainConfig = DOMAINS[config.domain];
        this.roundsPerGame = config.roundsPerGame || 5;
        this.paragraphId = config.parNr || config.paragraphId || null;
        this.adaptivePayload = readAdaptivePayload(
            this.paragraphId,
            config.adaptiveStorage
        );

        // Parse CSV into problems
        var rows = parseCSV(config.csvString);
        this.problems = rows.map(buildProblem);

        if (this.problems.length < 1) {
            throw new Error('ReasoningEngine: no valid problems found in CSV');
        }

        // Group by structure type (for Match mode)
        this._structureGroups = {};
        for (var i = 0; i < this.problems.length; i++) {
            var st = this.problems[i].structureType;
            if (!this._structureGroups[st]) this._structureGroups[st] = [];
            this._structureGroups[st].push(this.problems[i]);
        }

        // Game state
        this._mode = -1;
        this._rounds = [];
        this._roundIdx = -1;
        this._score = 0;
        this._answered = false;
        this._matchData = null;
    }

    ReasoningEngine.prototype.getAdaptivePayload = function () {
        return JSON.parse(JSON.stringify(this.adaptivePayload));
    };

    ReasoningEngine.prototype.getSkillMapRequest = function (options) {
        return buildSkillMapRequest('reasoning-game', 'reasoning', this.paragraphId, options);
    };

    ReasoningEngine.prototype.getStandardFamilyMap = function () {
        var out = [];
        for (var i = 0; i < MODE_NAMES_NL.length; i++) {
            var row = reasoningStandardDisposition(i);
            out.push({
                mode: i,
                modeName: MODE_NAMES_NL[i],
                candidateFamily: row.candidateFamily,
                standardAction: row.standardAction,
                disposition: row.disposition,
                answerFormRoute: row.answerFormRoute || null
            });
        }
        out.push({
            mode: null,
            modeName: 'Source-based explanation',
            candidateFamily: 'source_based_explanation',
            standardAction: 'source_value_selection + source_chain_builder + structured_short_response',
            disposition: 'future_composed_pattern'
        });
        return out;
    };

    ReasoningEngine.prototype.getAnswerFormScaffoldMap = function () {
        var active = [];
        var seen = {};
        for (var i = 0; i < this.problems.length; i++) {
            var scaffold = inferAnswerFormScaffold(this.problems[i], this.domain, this.paragraphId);
            var key = scaffold.primaryUnitId + ':' + scaffold.routeStatus;
            if (!seen[key]) {
                seen[key] = true;
                active.push(scaffold);
            }
        }
        return {
            schemaVersion: 1,
            paragraphId: this.paragraphId,
            routeStatus: 'local_practice_scaffold',
            activeScaffolds: active,
            availableScaffolds: clone(ANSWER_FORM_SCAFFOLDS),
            sourceUsePattern: makeSourceUseScaffold('A97', {
                paragraphId: this.paragraphId,
                routeStatus: 'future_source_use_pattern'
            }),
            modeDisposition: this.getStandardFamilyMap(),
            boundaryFlags: answerFormBoundaryFlags()
        };
    };

    // ── Session management ──────────────────────────────────────────

    /**
     * Start a new game with the given mode.
     * @param {number} modeIndex — 0-4
     * @returns {{ roundCount: number, modeName: string }}
     */
    ReasoningEngine.prototype.startGame = function (modeIndex) {
        if (modeIndex < 0 || modeIndex >= MODE_NAMES.length) throw new Error('Invalid mode: ' + modeIndex);

        this._mode = modeIndex;
        this._score = 0;
        this._roundIdx = 0;
        this._answered = false;
        this._matchData = null;
        this._roundResults = [];

        if (modeIndex === 4) {
            // Match mode: single round
            this._rounds = [0];
            this._matchData = this._generateMatchData();
        } else {
            // All other modes: pick random problems
            var indices = [];
            for (var i = 0; i < this.problems.length; i++) indices.push(i);
            indices = shuffle(indices);
            this._rounds = indices.slice(0, Math.min(this.roundsPerGame, indices.length));
        }

        return {
            roundCount: this._rounds.length,
            modeName: MODE_NAMES_NL[modeIndex]
        };
    };

    // ── Round presentation ──────────────────────────────────────────

    /**
     * Get the current round's presentation data.
     * Returns null if game is over.
     */
    ReasoningEngine.prototype.getRound = function () {
        if (this._roundIdx >= this._rounds.length) return null;

        this._answered = false;
        var problem = this.problems[this._rounds[this._roundIdx]];

        switch (this._mode) {
            case 0: return this._presentOrderSteps(problem);
            case 1: return this._presentSubQuestions(problem);
            case 2: return this._presentFindError(problem);
            case 3: return this._presentFlowDiagram(problem);
            case 4: return this._presentMatchStructures();
            case 5: return this._presentStructuredReasoning(problem);
            default: return null;
        }
    };

    // Mode 0: Order Steps
    ReasoningEngine.prototype._presentOrderSteps = function (problem) {
        var scaffold = inferAnswerFormScaffold(problem, this.domain, this.paragraphId);
        var allSteps = problem.steps.concat(problem.distractorSteps);
        var options;

        if (this.domainConfig.useOperationCounting) {
            // Arithmetic: count duplicate labels
            var counts = {};
            for (var i = 0; i < allSteps.length; i++) {
                var lbl = allSteps[i].label;
                counts[lbl] = (counts[lbl] || 0) + 1;
            }
            // Deduplicate by label, keep first occurrence
            var seen = {};
            options = [];
            for (var j = 0; j < allSteps.length; j++) {
                var label = allSteps[j].label;
                if (!seen[label]) {
                    seen[label] = true;
                    options.push({
                        label: label,
                        detail: allSteps[j].detail,
                        formula: allSteps[j].formula,
                        count: counts[label],
                        isCorrect: j < 3,
                        origIdx: j
                    });
                }
            }
            options = shuffle(options);
        } else {
            options = shuffle(allSteps.map(function (s, idx) {
                return {
                    label: s.label,
                    detail: s.detail,
                    formula: s.formula,
                    count: 1,
                    isCorrect: idx < 3,
                    origIdx: idx
                };
            }));
        }

        return {
            mode: 0,
            modeName: MODE_NAMES_NL[0],
            problemText: problem.text,
            options: options,
            correctOrder: problem.steps.map(function (s) { return s.label; }),
            maxSelections: 3,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            showFormula: this.domainConfig.showFormula,
            standardFamily: reasoningStandardDisposition(0),
            answerFormScaffold: scaffold,
            taskShellTask: buildStepOrderingTask(problem, scaffold)
        };
    };

    // Mode 1: Build Sub-Questions
    ReasoningEngine.prototype._presentSubQuestions = function (problem) {
        var scaffold = inferAnswerFormScaffold(problem, this.domain, this.paragraphId);
        var all = problem.subQuestions.correct.map(function (q, i) {
            return { text: q, isCorrect: true, correctIdx: i };
        }).concat(problem.subQuestions.distractors.map(function (q) {
            return { text: q, isCorrect: false, correctIdx: -1 };
        }));

        return {
            mode: 1,
            modeName: MODE_NAMES_NL[1],
            problemText: problem.text,
            options: shuffle(all),
            correctOrder: problem.subQuestions.correct.slice(),
            maxSelections: 3,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            standardFamily: reasoningStandardDisposition(1),
            answerFormScaffold: scaffold,
            taskShellTask: buildClaimReasonEvidenceTask(problem, scaffold)
        };
    };

    // Mode 2: Find the Error
    ReasoningEngine.prototype._presentFindError = function (problem) {
        var scaffold = inferAnswerFormScaffold(problem, this.domain, this.paragraphId);
        var steps = [];
        for (var i = 0; i < 3; i++) {
            if (i === problem.errorInfo.errorIdx) {
                steps.push({
                    label: problem.errorInfo.wrong.label,
                    detail: problem.errorInfo.wrong.detail,
                    formula: problem.errorInfo.wrong.formula,
                    isError: true,
                    stepNumber: i + 1
                });
            } else {
                steps.push({
                    label: problem.steps[i].label,
                    detail: problem.steps[i].detail,
                    formula: problem.steps[i].formula,
                    isError: false,
                    stepNumber: i + 1
                });
            }
        }

        return {
            mode: 2,
            modeName: MODE_NAMES_NL[2],
            problemText: problem.text,
            steps: steps,
            errorIdx: problem.errorInfo.errorIdx,
            correctStep: problem.steps[problem.errorInfo.errorIdx],
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            showFormula: this.domainConfig.showFormula,
            hideFormulaBeforeAnswer: this.domainConfig.hideFormulaInErrorMode,
            standardFamily: reasoningStandardDisposition(2),
            answerFormScaffold: scaffold,
            modeDisposition: 'local_error_repair_only'
        };
    };

    // Mode 3: Build Flow Diagram
    ReasoningEngine.prototype._presentFlowDiagram = function (problem) {
        var scaffold = inferAnswerFormScaffold(problem, this.domain, this.paragraphId);
        var blocks = problem.flowSlots.map(function (slot, idx) {
            return {
                type: slot.type,
                text: slot.text,
                origIdx: idx
            };
        });

        return {
            mode: 3,
            modeName: MODE_NAMES_NL[3],
            problemText: problem.text,
            blocks: shuffle(blocks),
            correctOrder: problem.flowSlots.map(function (s) { return s.text; }),
            flowTypeColors: this.domainConfig.flowTypeColors,
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            standardFamily: reasoningStandardDisposition(3),
            answerFormScaffold: scaffold,
            taskShellTask: buildFlowOrderingTask(problem, scaffold)
        };
    };

    // Mode 4: Match Structures
    ReasoningEngine.prototype._presentMatchStructures = function () {
        return {
            mode: 4,
            modeName: MODE_NAMES_NL[4],
            items: this._matchData.items,
            correctPairs: this._matchData.correctPairs,
            roundNumber: 1,
            totalRounds: 1,
            standardFamily: reasoningStandardDisposition(4),
            modeDisposition: 'held_for_classification_with_explanation_design'
        };
    };

    // Mode 5: Build Reasoning Answer
    ReasoningEngine.prototype._presentStructuredReasoning = function (problem) {
        var scaffold = inferAnswerFormScaffold(problem, this.domain, this.paragraphId);
        var task = buildStructuredReasoningTask(problem, scaffold);
        var taskShell = getTaskShellEngine();
        if (taskShell && typeof taskShell.validateTask === 'function') {
            taskShell.validateTask(task);
        }
        return {
            mode: 5,
            modeName: MODE_NAMES_NL[5],
            problemText: problem.text,
            taskShellTask: task,
            answerFormScaffold: scaffold,
            reasoningGuide: problem.steps.map(function (step) {
                return {
                    label: step.label,
                    detail: step.detail,
                    formula: step.formula
                };
            }),
            flowGuide: problem.flowSlots.map(function (slot) {
                return {
                    type: slot.type,
                    text: slot.text
                };
            }),
            roundNumber: this._roundIdx + 1,
            totalRounds: this._rounds.length,
            standardFamily: reasoningStandardDisposition(5)
        };
    };

    // ── Answer checking ─────────────────────────────────────────────

    /**
     * Submit an answer for the current round.
     * @param {*} answer — mode-specific answer format
     * @returns {{ correct: boolean, score: number, feedback: object }}
     */
    ReasoningEngine.prototype.submitAnswer = function (answer) {
        if (this._answered) throw new Error('Already answered this round');
        this._answered = true;

        var result;
        switch (this._mode) {
            case 0: result = this._checkOrderSteps(answer); break;
            case 1: result = this._checkSubQuestions(answer); break;
            case 2: result = this._checkFindError(answer); break;
            case 3: result = this._checkFlowDiagram(answer); break;
            case 4: result = this._checkMatchStructures(answer); break;
            case 5: result = this._checkStructuredReasoning(answer); break;
            default: result = { correct: false, feedback: {} };
        }

        if (result.correct && !result.selfCheckOnly) this._score++;

        var currentProblem = this.problems[this._rounds[this._roundIdx]];
        this._roundResults.push({
            structureType: currentProblem.structureType,
            correct: result.selfCheckOnly ? false : result.correct,
            practiced: !!result.selfCheckOnly && !!result.completed
        });

        return {
            correct: result.correct,
            selfCheckOnly: !!result.selfCheckOnly,
            completed: !!result.completed,
            score: this._score,
            totalRounds: this._rounds.length,
            feedback: result.feedback
        };
    };

    // Mode 0 check: answer = array of selected labels in order
    ReasoningEngine.prototype._checkOrderSteps = function (selectedLabels) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctLabels = problem.steps.map(function (s) { return s.label; });
        var correct = selectedLabels.length === 3;
        if (correct) {
            for (var i = 0; i < 3; i++) {
                if (selectedLabels[i] !== correctLabels[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: problem.steps,
                selectedOrder: selectedLabels
            }
        };
    };

    // Mode 1 check: answer = array of selected sub-question texts in order
    ReasoningEngine.prototype._checkSubQuestions = function (selectedTexts) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctTexts = problem.subQuestions.correct;
        var correct = selectedTexts.length === 3;
        if (correct) {
            for (var i = 0; i < 3; i++) {
                if (selectedTexts[i] !== correctTexts[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: correctTexts,
                selectedOrder: selectedTexts
            }
        };
    };

    // Mode 2 check: answer = stepIndex (0, 1, or 2) that student thinks is wrong
    ReasoningEngine.prototype._checkFindError = function (selectedIdx) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correct = selectedIdx === problem.errorInfo.errorIdx;
        return {
            correct: correct,
            feedback: {
                errorIdx: problem.errorInfo.errorIdx,
                wrongStep: problem.errorInfo.wrong,
                correctStep: problem.steps[problem.errorInfo.errorIdx],
                selectedIdx: selectedIdx
            }
        };
    };

    // Mode 3 check: answer = array of block texts in the order the student placed them
    ReasoningEngine.prototype._checkFlowDiagram = function (placedTexts) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var correctTexts = problem.flowSlots.map(function (s) { return s.text; });
        var correct = placedTexts.length === correctTexts.length;
        if (correct) {
            for (var i = 0; i < correctTexts.length; i++) {
                if (placedTexts[i] !== correctTexts[i]) { correct = false; break; }
            }
        }
        return {
            correct: correct,
            feedback: {
                correctOrder: problem.flowSlots,
                placedOrder: placedTexts
            }
        };
    };

    // Mode 4 check: answer = array of [idA, idB] pairs
    ReasoningEngine.prototype._checkMatchStructures = function (userPairs) {
        var correctPairs = this._matchData.correctPairs;
        var matchCount = 0;

        for (var i = 0; i < userPairs.length; i++) {
            var ua = userPairs[i][0];
            var ub = userPairs[i][1];
            for (var j = 0; j < correctPairs.length; j++) {
                var ca = correctPairs[j][0];
                var cb = correctPairs[j][1];
                if ((ua === ca && ub === cb) || (ua === cb && ub === ca)) {
                    matchCount++;
                    break;
                }
            }
        }

        return {
            correct: matchCount === correctPairs.length,
            feedback: {
                matchCount: matchCount,
                totalPairs: correctPairs.length,
                correctPairs: correctPairs,
                items: this._matchData.items
            }
        };
    };

    // Mode 5 check: answer = free-text reasoning response
    ReasoningEngine.prototype._checkStructuredReasoning = function (answer) {
        var problem = this.problems[this._rounds[this._roundIdx]];
        var task = buildStructuredReasoningTask(problem);
        var taskShell = getTaskShellEngine();
        if (!taskShell || typeof taskShell.evaluateTask !== 'function') {
            throw new Error('TaskShellEngine is required for structured reasoning mode');
        }
        var taskShellResult = taskShell.evaluateTask(task, answer);
        return {
            correct: taskShellResult.state === 'self_check',
            selfCheckOnly: true,
            completed: taskShellResult.state === 'self_check',
            feedback: {
                taskShellResult: taskShellResult,
                reasoningGuide: problem.steps,
                flowGuide: problem.flowSlots
            }
        };
    };

    // ── Round advancement ───────────────────────────────────────────

    /**
     * Advance to the next round. Returns true if there is a next round, false if game over.
     */
    ReasoningEngine.prototype.nextRound = function () {
        this._roundIdx++;
        return this._roundIdx < this._rounds.length;
    };

    ReasoningEngine.prototype.getCurrentStructureType = function () {
        if (this._roundIdx >= this._rounds.length) return null;
        return this.problems[this._rounds[this._roundIdx]].structureType;
    };

    // ── Results ─────────────────────────────────────────────────────

    ReasoningEngine.prototype.getResult = function () {
        var total = this._rounds.length;
        var score = this._score;
        var ratio = total > 0 ? score / total : 0;
        var emoji = ratio >= 1 ? '\uD83C\uDFC6' : (ratio >= 0.5 ? '\uD83D\uDCC8' : '\uD83D\uDCDA');

        var perType = {};
        var selfCheckCount = 0;
        for (var i = 0; i < this._roundResults.length; i++) {
            var rr = this._roundResults[i];
            if (rr.practiced) selfCheckCount++;
            if (!perType[rr.structureType]) perType[rr.structureType] = { correct: 0, total: 0 };
            perType[rr.structureType].total++;
            if (rr.correct) perType[rr.structureType].correct++;
        }

        return {
            score: score,
            total: total,
            ratio: ratio,
            emoji: emoji,
            modeName: MODE_NAMES_NL[this._mode],
            selfCheckOnlyMode: this._mode === 5,
            selfCheckCount: selfCheckCount,
            perType: perType
        };
    };

    // ── Queries ─────────────────────────────────────────────────────

    ReasoningEngine.prototype.getDomainConfig = function () {
        return JSON.parse(JSON.stringify(this.domainConfig));
    };

    ReasoningEngine.prototype.getStructureTypes = function () {
        var types = [];
        for (var type in this._structureGroups) {
            if (this._structureGroups.hasOwnProperty(type)) {
                types.push({
                    type: type,
                    label: this._structureGroups[type][0].structureLabel,
                    count: this._structureGroups[type].length
                });
            }
        }
        return types;
    };

    ReasoningEngine.prototype.getProblemCount = function () {
        return this.problems.length;
    };

    ReasoningEngine.prototype.getModeNames = function () {
        return MODE_NAMES_NL.slice();
    };

    // ── Match data generation ───────────────────────────────────────

    ReasoningEngine.prototype._generateMatchData = function () {
        // Filter to types with at least 2 problems
        var validTypes = [];
        for (var type in this._structureGroups) {
            if (this._structureGroups.hasOwnProperty(type) && this._structureGroups[type].length >= 2) {
                validTypes.push(type);
            }
        }

        if (validTypes.length < 3) {
            throw new Error('Match mode requires at least 3 structure types with 2+ problems each. Found: ' + validTypes.length);
        }

        // Pick 3 random types
        var chosenTypes = shuffle(validTypes).slice(0, 3);

        // From each type, pick 2 random problems
        var items = [];
        var correctPairs = [];
        for (var i = 0; i < chosenTypes.length; i++) {
            var pair = shuffle(this._structureGroups[chosenTypes[i]]).slice(0, 2);
            correctPairs.push([pair[0].id, pair[1].id]);
            items.push({
                id: pair[0].id,
                text: pair[0].text,
                structureType: pair[0].structureType,
                structureLabel: pair[0].structureLabel
            });
            items.push({
                id: pair[1].id,
                text: pair[1].text,
                structureType: pair[1].structureType,
                structureLabel: pair[1].structureLabel
            });
        }

        return { items: shuffle(items), correctPairs: correctPairs };
    };

    // ── Static exports ──────────────────────────────────────────────

    ReasoningEngine.parseCSV = parseCSV;
    ReasoningEngine.buildProblem = buildProblem;
    ReasoningEngine.DOMAINS = DOMAINS;
    ReasoningEngine.MODE_NAMES = MODE_NAMES;
    ReasoningEngine.MODE_NAMES_NL = MODE_NAMES_NL;
    ReasoningEngine.reasoningStandardDisposition = reasoningStandardDisposition;
    ReasoningEngine.getAnswerFormScaffoldCatalog = function () {
        return clone(ANSWER_FORM_SCAFFOLDS);
    };
    ReasoningEngine.inferAnswerFormScaffold = inferAnswerFormScaffold;
    ReasoningEngine.buildSourceUseScaffold = makeSourceUseScaffold;

    return ReasoningEngine;
});
