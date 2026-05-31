const ExitTicketEngine = require('../exit-ticket-engine');
const data = require('../../source-data/book-1/exit-ticket/1.1.1.json');

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function graphTaskShellCheckpointData() {
    return {
        schema_version: 1,
        parNr: '1.1.3',
        parName: 'Grafieken en tabellen',
        title: 'Grafiektaak oefenvorm',
        intro: 'Gebruik dezelfde taakvormen als het grafiekenspel. Dit is lokale oefening.',
        targetSkillIds: ['A61', 'A62', 'A63'],
        skillScopeIds: ['A61', 'A62', 'A63'],
        metadataAlignment: {
            status: 'paragraph_skill_aligned_not_target_readiness',
            paragraphSkillIds: ['A61', 'A62', 'A63'],
            targetExerciseSkillIds: ['A61', 'A62', 'A63', 'A38'],
            targetReadinessEvidence: false
        },
        tasks: [
            {
                id: 'graph-table',
                type: 'task_shell',
                taskShell: {
                    id: 'graph-table',
                    family: 'table_value_selection',
                    skillLabel: 'Tabelwaarde kiezen',
                    purpose: 'Kies de bronwaarde uit de juiste rij.',
                    prompt: 'Welke waarde hoort bij prijs EUR 2,00?',
                    interaction: {
                        inputLabel: 'Tabelwaarde',
                        options: [
                            { id: 'a', label: '300 ijsjes' },
                            { id: 'b', label: '400 ijsjes' }
                        ]
                    },
                    expected: { kind: 'choice', value: 'a' },
                    feedback: {
                        matchTitle: 'Juiste bronwaarde',
                        matchText: 'Je koos de waarde uit de juiste rij.',
                        retryTitle: 'Zoek de rij opnieuw',
                        retryText: 'Lees prijs en waarde in dezelfde rij.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'graph-read',
                type: 'task_shell',
                taskShell: {
                    id: 'graph-read',
                    family: 'graph_reading',
                    skillLabel: 'Grafiek aflezen',
                    purpose: 'Lees de grafiekwaarde met eenheid.',
                    prompt: 'Lees de waarde bij juni af.',
                    interaction: { inputLabel: 'Afgelezen waarde' },
                    expected: { kind: 'number', value: 70, tolerance: 0, unit: 'index' },
                    feedback: {
                        matchTitle: 'Goed afgelezen',
                        matchText: 'Het punt bij juni staat op 70.',
                        retryTitle: 'Lees opnieuw',
                        retryText: 'Zoek juni en lees de verticale waarde.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            },
            {
                id: 'graph-point',
                type: 'task_shell',
                taskShell: {
                    id: 'graph-point',
                    family: 'point_placement',
                    skillLabel: 'Punt plaatsen',
                    purpose: 'Gebruik prijs als x-waarde en aantal als y-waarde.',
                    prompt: 'Welk punt hoort bij prijs 10 en aantal 100?',
                    interaction: { xLabel: 'prijs', yLabel: 'aantal' },
                    expected: { kind: 'point', x: 10, y: 100, toleranceX: 0, toleranceY: 0 },
                    feedback: {
                        matchTitle: 'Punt klopt',
                        matchText: 'Het punt is (10, 100).',
                        retryTitle: 'Controleer de asvolgorde',
                        retryText: 'Prijs is x en aantal is y.'
                    },
                    practiceRoute: { label: 'Oefen verder met grafieken', href: 'grafiekenspel.html' }
                }
            }
        ]
    };
}

describe('ExitTicketEngine', () => {
    test('validates the bounded GAME-UX-2 data shape', () => {
        expect(ExitTicketEngine.validateData(data)).toBe(true);
        expect(data.tasks.length).toBeGreaterThanOrEqual(3);
        expect(data.tasks.length).toBeLessThanOrEqual(5);
    });

    test('declares B01/B02 as checkpoint-assessed skills without target-readiness claim', () => {
        expect(data.targetSkillIds).toEqual(['B01', 'B02']);
        expect(data.skillScopeIds).toEqual(['B01', 'B02']);
        expect(data.metadataAlignment).toEqual(expect.objectContaining({
            status: 'paragraph_skill_aligned_not_target_readiness',
            paragraphSkillIds: ['B01', 'B02'],
            targetExerciseSkillIds: ['A43', 'B01', 'B02'],
            targetReadinessEvidence: false,
        }));
        expect(data.targetSkillIds).not.toContain('A04');
        expect(data.skillScopeIds).not.toContain('A04');
    });

    test('rejects target-readiness claims when target exercise skills are not covered', () => {
        const bad = clone(data);
        bad.metadataAlignment = {
            ...bad.metadataAlignment,
            status: 'target_exercise_readiness_aligned',
            targetReadinessEvidence: true,
        };
        expect(() => ExitTicketEngine.validateData(bad)).toThrow(/target-readiness evidence must cover all targetExerciseSkillIds/);
    });

    test('keeps student-facing strings free of blocked terms and internal codes', () => {
        expect(ExitTicketEngine.findStudentTextViolations(data)).toEqual([]);
    });

    test('rejects visible MTU codes in student-facing strings', () => {
        const bad = clone(data);
        bad.tasks[0].prompt = 'Kies route A43.';
        expect(() => ExitTicketEngine.validateData(bad)).toThrow(/blocked terms or internal codes/);
    });

    test('requests the shared skill map in compact checkpoint mode', () => {
        const createRequest = jest.fn((surface, options) => ({
            surface,
            mode: options.mode,
            aspectFilter: options.aspectFilter,
            skillScope: options.skillScope,
            targetSkills: options.targetSkills,
            allowFullView: options.allowFullView,
            boundaryFlags: {
                diagnostics: false,
                adaptiveRouting: false,
                masteryDecisions: false,
                automaticSequencing: false,
                studentFacingAI: false,
                summativeUse: false,
                pvProjection: false,
                pvMachinePromotion: false,
                studentFacingOutput: false,
            },
        }));
        const engine = new ExitTicketEngine({
            data,
            SkillMapEngine: { createRequest },
        });

        const request = engine.getSkillMapRequest();
        expect(createRequest).toHaveBeenCalledWith('exit-ticket', expect.objectContaining({
            paragraph: '1.1.1',
            mode: 'compact',
            aspectFilter: 'mixed',
            allowFullView: false,
        }));
        expect(request.surface).toBe('exit-ticket');
        expect(request.mode).toBe('compact');
        expect(request.aspectFilter).toBe('mixed');
        expect(request.skillScope).toEqual(['B01', 'B02']);
        expect(request.targetSkills).toEqual(['B01', 'B02']);
        expect(request.boundaryFlags).toEqual(expect.objectContaining({
            diagnostics: false,
            adaptiveRouting: false,
            masteryDecisions: false,
            automaticSequencing: false,
            studentFacingAI: false,
            summativeUse: false,
            pvProjection: false,
            pvMachinePromotion: false,
            studentFacingOutput: false,
        }));
    });

    test('returns local practice progress only', () => {
        const engine = new ExitTicketEngine({ data });
        expect(engine.getProgress()).toEqual({
            practiceProgressOnly: true,
            viewed: 0,
            total: data.tasks.length,
            pending: data.tasks.length,
        });
        const result = engine.checkTask('schaarste-kern', 'b');
        expect(result.matched).toBe(true);
        expect(result.feedbackText).toMatch(/meer wensen dan middelen/i);
        expect(result.boundaryFlags.diagnostics).toBe(false);
        expect(engine.getProgress()).toEqual({
            practiceProgressOnly: true,
            viewed: 1,
            total: data.tasks.length,
            pending: data.tasks.length - 1,
        });
    });

    test('validates checkpoint-compatible graph task-shell tasks without target-readiness evidence', () => {
        const graphData = graphTaskShellCheckpointData();
        expect(ExitTicketEngine.validateData(graphData)).toBe(true);
        expect(graphData.metadataAlignment.targetReadinessEvidence).toBe(false);

        const engine = new ExitTicketEngine({ data: graphData });
        const tableResult = engine.checkTask('graph-table', 'a');
        expect(tableResult).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true,
            family: 'table_value_selection'
        }));
        const pointResult = engine.checkTask('graph-point', { x: 10, y: 100 });
        expect(pointResult).toEqual(expect.objectContaining({
            state: 'matched',
            matched: true,
            family: 'point_placement'
        }));
        expect(pointResult.boundaryFlags.targetEquivalentProof).toBe(false);
    });
});
