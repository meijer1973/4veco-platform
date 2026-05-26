const ExitTicketEngine = require('../exit-ticket-engine');
const data = require('../../source-data/book-1/exit-ticket/1.1.1.json');

function clone(value) {
    return JSON.parse(JSON.stringify(value));
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
});
