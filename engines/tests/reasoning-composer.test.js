const ReasoningComposer = require('../reasoning-composer');

function composition(overrides = {}) {
    return {
        schema_version: 1,
        composition_id: 'composer-graph-fixture',
        title: 'Controleer een grafiekclaim',
        goal: 'Gebruik de grafiek om te bepalen welke uitspraak voorzichtig genoeg is.',
        archetype_id: 'graph_evidence_and_epistemic_scope',
        selected_exemplar_ids: ['reasoning-1.1.3-graph-editorial-v2'],
        authority: {
            golden_reference: true,
            student_product_adoption: false,
            target_equivalent_proof: false,
            diagnostics: false,
            mastery_or_sequencing: false,
            summative_use: false,
            scale_gate: false
        },
        targetBrief: {
            reasoningTarget: 'Distinguish observed graph values from a bounded conclusion.',
            centralMisconception: 'One interval is treated as a universal rule.',
            sourceEvidenceType: 'line graph and short claim',
            requiredAnswerForm: 'source values, interpretation, bounded conclusion',
            mustNotTest: 'graph construction',
            candidateArchetype: 'graph_evidence_and_epistemic_scope',
            selectedGoldenExemplars: ['reasoning-1.1.3-graph-editorial-v2'],
            mechanicFit: 'The student must click graph points and assemble a scoped answer.'
        },
        layout: {
            type: 'dual_pane_source_task_workspace',
            desktopIndependentScroll: true,
            mobileFlow: 'source_before_tasks'
        },
        taskSet: {
            schema_version: 1,
            title: 'Grafiekclaim',
            contextBlocks: [
                {
                    id: 'ctx-claim',
                    type: 'markdown',
                    title: 'Claim',
                    bodyMarkdown: 'Een redacteur schrijft: bij een hogere prijs worden altijd half zo veel broodjes verkocht.',
                    accessibilitySummary: 'Korte claim over een vraaglijn.'
                },
                {
                    id: 'ctx-table',
                    type: 'table',
                    sourceLabel: 'Tabel 1',
                    caption: 'Tabel 1: Prijs en hoeveelheid broodjes',
                    sourceMaterialId: 'broodjes-vraag-test',
                    columns: ['Prijs P', 'Hoeveelheid Q'],
                    rows: [[2, 600], [8, 300]],
                    altText: 'Tabel met waargenomen prijzen 2 en 8 en hoeveelheden 600 en 300.'
                }
            ],
            tasks: [
                {
                    id: 'graph-points',
                    family: 'graph_evidence_selector',
                    skillLabel: 'Grafiekpunten kiezen',
                    prompt: 'Kies de twee grafiekpunten die je kunt vergelijken.',
                    contextRefs: ['ctx-claim', 'ctx-table'],
                    interaction: {
                        maxSelections: 2,
                        hitTargetPx: 44,
                        trayLabel: 'Gekozen punten',
                        graph: {
                            title: 'Vraaglijn broodjes',
                            altText: 'Grafiek met lagere hoeveelheid bij hogere prijs.',
                            axes: {
                                x: { label: 'Prijs P', min: 0, max: 10, ticks: [0, 5, 10] },
                                y: { label: 'Hoeveelheid Q', min: 0, max: 700, ticks: [0, 300, 600] }
                            },
                            series: [
                                {
                                    label: 'Vraag',
                                    points: [
                                        { id: 'p2-q600', x: 2, y: 600, label: 'P=2, Q=600', kind: 'answer' },
                                        { id: 'p8-q300', x: 8, y: 300, label: 'P=8, Q=300', kind: 'answer' },
                                        { id: 'p5-estimate', x: 5, y: 450, label: 'P=5 op de lijn', kind: 'distractor', distractorFor: 'p2-q600', pathPoint: false }
                                    ]
                                }
                            ]
                        }
                    },
                    expected: {
                        kind: 'graph_evidence_selector',
                        pointIds: ['p2-q600', 'p8-q300'],
                        partialFeedback: 'practice_only',
                        sourceEvidenceRefs: ['ctx-claim', 'ctx-table']
                    },
                    feedback: {
                        matchTitle: 'Punten passen',
                        matchText: 'Deze twee punten geven een controleerbare vergelijking.',
                        retryTitle: 'Kijk nog een keer',
                        retryText: 'Gebruik twee waargenomen punten uit de grafiek.'
                    },
                    practiceRoute: { label: 'Volgende stap', href: '#scope' }
                },
                {
                    id: 'estimate-status',
                    family: 'choice',
                    skillLabel: 'Schatting begrenzen',
                    prompt: 'Wat mag je bij P=5 zeggen op basis van de lijn?',
                    contextRefs: ['ctx-claim', 'ctx-table'],
                    reasoningOperationSignature: 'observation_vs_interpolation_epistemic_status',
                    interaction: {
                        inputLabel: 'Uitspraak bij P=5',
                        options: [
                            { id: 'ongeveer', label: 'Q is ongeveer 450 broodjes.' },
                            { id: 'precies', label: 'Q is precies 450 broodjes.' },
                            { id: 'niets', label: 'Je kunt niets zeggen tussen P=2 en P=8.' }
                        ]
                    },
                    expected: {
                        kind: 'choice',
                        value: 'ongeveer',
                        operationSignature: 'observation_vs_interpolation_epistemic_status',
                        epistemicStatus: 'supported_estimate_not_exact_observation',
                        estimateAtX: 5,
                        sourceEvidenceRefs: ['ctx-claim', 'ctx-table']
                    },
                    feedback: {
                        matchTitle: 'Schatting past',
                        matchText: 'De lijn ondersteunt een schatting, geen exact waargenomen tabelpunt.',
                        retryTitle: 'Let op exactheid',
                        retryText: 'Gebruik de lijn als schatting en de tabel als waarneming.'
                    },
                    practiceRoute: { label: 'Volgende stap', href: '#answer' }
                },
                {
                    id: 'scope-answer',
                    family: 'functional_answer_builder',
                    skillLabel: 'Antwoorddelen kiezen',
                    prompt: 'Bouw een voorzichtige conclusie.',
                    contextRefs: ['ctx-claim', 'ctx-table'],
                    interaction: {
                        answerPreview: {
                            label: 'Opgebouwd antwoord',
                            placeholder: 'Kies per regel een onderdeel.',
                            template: '{{waarden}} {{interpretatie}} {{grens}}'
                        },
                        answerRows: [
                            {
                                id: 'waarden',
                                label: 'Waarden',
                                options: [
                                    { id: 'punten', label: 'Bij P=2 hoort Q=600 en bij P=8 hoort Q=300.', kind: 'answer' },
                                    { id: 'midden', label: 'Bij P=5 hoort zeker Q=450.', kind: 'distractor', distractorFor: 'punten' }
                                ]
                            },
                            {
                                id: 'interpretatie',
                                label: 'Interpretatie',
                                options: [
                                    { id: 'lager', label: 'In dit interval is de hoeveelheid lager bij een hogere prijs.', kind: 'answer' },
                                    { id: 'oorzaak', label: 'De prijs is de enige oorzaak.', kind: 'distractor', distractorFor: 'lager' }
                                ]
                            },
                            {
                                id: 'grens',
                                label: 'Grens',
                                options: [
                                    { id: 'niet-altijd', label: 'Dat maakt de uitspraak altijd te sterk.', kind: 'answer' },
                                    { id: 'altijd', label: 'Daarom geldt dit altijd.', kind: 'distractor', distractorFor: 'niet-altijd' }
                                ]
                            }
                        ]
                    },
                    expected: {
                        kind: 'functional_answer_builder',
                        rows: {
                            waarden: 'punten',
                            interpretatie: 'lager',
                            grens: 'niet-altijd'
                        },
                        partialFeedback: 'practice_only',
                        sourceEvidenceRefs: ['ctx-claim', 'ctx-table']
                    },
                    feedback: {
                        matchTitle: 'Conclusie is begrensd',
                        matchText: 'Je antwoord gebruikt waarden en voorkomt een te sterke uitspraak.',
                        retryTitle: 'Maak de uitspraak voorzichtiger',
                        retryText: 'Gebruik waarden, interpretatie en begrenzing.'
                    },
                    practiceRoute: { label: 'Verder oefenen', href: '#next' }
                }
            ]
        },
        proofScenarios: {
            wrong: {
                responses: [
                    { taskId: 'graph-points', response: { pointIds: ['p5-estimate'] } }
                ]
            },
            correct: {
                responses: [
                    { taskId: 'graph-points', response: { pointIds: ['p2-q600', 'p8-q300'] } },
                    { taskId: 'estimate-status', response: { value: 'ongeveer' } },
                    { taskId: 'scope-answer', response: { rows: { waarden: 'punten', interpretatie: 'lager', grens: 'niet-altijd' } } }
                ]
            }
        },
        ...overrides
    };
}

describe('ReasoningComposer', () => {
    test('renders a dual-pane reasoning-game page over shared task-shell families', () => {
        const html = ReasoningComposer.renderCompositionPage(composition());
        expect(html).toContain('data-task-shell="REASONING-COMPOSER"');
        expect(html).toContain('data-rg-layout="dual_pane_source_task_workspace"');
        expect(html).toContain('data-task-family="graph_evidence_selector"');
        expect(html).toContain('data-task-family="functional_answer_builder"');
        expect(html).toContain('data-rg-check-task="graph-points"');
        expect(html).not.toContain('legacy_reasoning_modes');
    });

    test('builds proof metadata from validated task-shell focus plans', () => {
        const proof = ReasoningComposer.buildProof(composition());
        expect(proof.task_families).toEqual(['graph_evidence_selector', 'choice', 'functional_answer_builder']);
        expect(proof.focus_plans[0].selectors).toContain('[data-task-id="graph-points"][data-graph-evidence-point-id]');
        expect(proof.proof_scenarios).toEqual(['wrong', 'correct']);
    });

    test('rejects mode-overloaded and graph-construction replacements', () => {
        expect(() => ReasoningComposer.validateComposition(composition({
            modePicker: true
        }))).toThrow(/modePicker/);

        const bad = composition();
        bad.taskSet.tasks[0].family = 'graph_construction_substitute';
        bad.taskSet.tasks[0].interaction = {
            workspaceTitle: 'Tekenruimte',
            xAxisLabel: 'Horizontale as',
            yAxisLabel: 'Verticale as',
            pointRowsLabel: 'Punten',
            lineConfirmationLabel: 'Verbind de punten',
            lineShapeLabel: 'Lijnvorm',
            xInputLabel: 'P',
            yInputLabel: 'Q',
            emptyGraphAltText: 'Leeg diagram',
            axes: {
                x: { label: 'P', min: 0, max: 10 },
                y: { label: 'Q', min: 0, max: 700 }
            },
            pointCount: 2
        };
        bad.taskSet.tasks[0].expected = {
            kind: 'graph_construction_substitute',
            axes: { xAccepted: ['p'], yAccepted: ['q'] },
            points: [{ x: 2, y: 600 }, { x: 8, y: 300 }],
            toleranceX: 0,
            toleranceY: 0,
            lineShape: 'decreasing',
            sourceEvidenceRefs: ['ctx-claim', 'ctx-table']
        };
        expect(() => ReasoningComposer.validateComposition(bad)).toThrow(/graph construction/);

        const causalGraphConstruction = composition({
            archetype_id: 'causal_mechanism'
        });
        causalGraphConstruction.taskSet.tasks[0] = bad.taskSet.tasks[0];
        expect(() => ReasoningComposer.validateComposition(causalGraphConstruction)).toThrow(/graph construction/);
    });

    test('rejects answer-giving goals and missing final previews', () => {
        expect(() => ReasoningComposer.validateComposition(composition({
            goal: 'Het juiste antwoord is P=2 en P=8 kiezen en daarna een voorzichtige conclusie.'
        }))).toThrow(/goal/);

        const missingPreview = composition();
        delete missingPreview.taskSet.tasks[2].interaction.answerPreview;
        expect(() => ReasoningComposer.validateComposition(missingPreview)).toThrow(/answerPreview/);
    });

    test('rejects pre-attempt rationale leaks and missing source evidence', () => {
        const visibleDescription = composition();
        visibleDescription.taskSet.tasks[1].interaction.options[0].description = 'Dit is de juiste schatting.';
        expect(() => ReasoningComposer.validateComposition(visibleDescription)).toThrow(/description/);

        const missingEvidence = composition();
        delete missingEvidence.taskSet.tasks[0].expected.sourceEvidenceRefs;
        expect(() => ReasoningComposer.validateComposition(missingEvidence)).toThrow(/sourceEvidenceRefs/);
    });

    test('rejects graph interpolation loss and direct observed estimate rows', () => {
        const missingSignature = composition();
        delete missingSignature.taskSet.tasks[1].reasoningOperationSignature;
        delete missingSignature.taskSet.tasks[1].expected.operationSignature;
        expect(() => ReasoningComposer.validateComposition(missingSignature)).toThrow(/observation-vs-interpolation/);

        const directObservation = composition();
        directObservation.taskSet.contextBlocks[1].rows = [[2, 600], [5, 450], [8, 300]];
        expect(() => ReasoningComposer.validateComposition(directObservation)).toThrow(/directly observed table row/);
    });

    test('rejects step-ordering banks that leak expected answer order', () => {
        const leakyOrder = composition({ archetype_id: 'causal_mechanism' });
        leakyOrder.taskSet.tasks[0] = {
            id: 'chain',
            family: 'step_ordering',
            skillLabel: 'Keten ordenen',
            prompt: 'Zet de stappen op volgorde.',
            contextRefs: ['ctx-claim', 'ctx-table'],
            interaction: {
                stepBankLabel: 'Stappen',
                sequenceLabel: 'Keten',
                separator: ' -> ',
                steps: [
                    { id: 'a', label: 'Stap A', kind: 'answer' },
                    { id: 'b', label: 'Stap B', kind: 'answer' },
                    { id: 'c', label: 'Stap C', kind: 'answer' },
                    { id: 'x', label: 'Afleider', kind: 'distractor', distractorFor: 'b' }
                ]
            },
            expected: {
                kind: 'step_ordering',
                order: ['a', 'b', 'c'],
                sourceEvidenceRefs: ['ctx-claim', 'ctx-table']
            },
            feedback: {
                matchTitle: 'Keten klopt',
                matchText: 'De volgorde klopt.',
                retryTitle: 'Controleer volgorde',
                retryText: 'Kijk naar oorzaak en gevolg.'
            },
            practiceRoute: { label: 'Volgende', href: '#next' }
        };
        expect(() => ReasoningComposer.validateComposition(leakyOrder)).toThrow(/expected order before attempt/);
    });

    test('rejects missing or elevated authority boundaries', () => {
        const missingAuthority = composition();
        delete missingAuthority.authority;
        expect(() => ReasoningComposer.validateComposition(missingAuthority)).toThrow(/authority/);

        const productAuthority = composition();
        productAuthority.authority.student_product_adoption = true;
        expect(() => ReasoningComposer.validateComposition(productAuthority)).toThrow(/student_product_adoption/);
    });
});
