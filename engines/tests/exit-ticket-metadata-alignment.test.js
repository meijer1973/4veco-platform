const data = require('../../source-data/book-1/exit-ticket/1.1.1.json');
const targetData = require('../../source-data/book-1/exit-ticket/1.1.2.json');
const units = require('../../references/machine/micro-teaching-units.json');
const targetRegistry = require('../../references/authored/course-target-exercises.json');

function unitIds() {
    return new Set(units.map((unit) => unit.id));
}

describe('exit-ticket metadata alignment', () => {
    test('1.1.1 checkpoint metadata is aligned to paragraph skills, not A04', () => {
        const ids = unitIds();
        const target = targetRegistry.exercises.find((exercise) => exercise.id === data.parNr);

        expect(target).toBeTruthy();
        expect(data.metadataAlignment.paragraphSkillIds).toEqual(['B01', 'B02']);
        expect(data.targetSkillIds).toEqual(data.metadataAlignment.paragraphSkillIds);
        expect(data.skillScopeIds).toEqual(data.metadataAlignment.paragraphSkillIds);
        expect(data.metadataAlignment.targetExerciseSkillIds).toEqual(target.required_skills);

        for (const id of [
            ...data.targetSkillIds,
            ...data.skillScopeIds,
            ...data.metadataAlignment.targetExerciseSkillIds,
        ]) {
            expect(ids.has(id)).toBe(true);
        }

        expect(data.targetSkillIds).not.toContain('A04');
        expect(data.skillScopeIds).not.toContain('A04');
    });

    test('1.1.1 checkpoint cannot be used as target-exercise-readiness evidence yet', () => {
        expect(data.metadataAlignment.targetExerciseSkillIds).toEqual(['A43', 'B01', 'B02']);
        expect(data.metadataAlignment.targetReadinessEvidence).toBe(false);
        expect(data.metadataAlignment.status).toBe('paragraph_skill_aligned_not_target_readiness');
        expect(data.metadataAlignment.notes.join(' ')).toMatch(/does not yet cover the full A43/i);
    });

    test('1.1.2 exit ticket candidate covers the selected target operation chain', () => {
        const ids = unitIds();
        const target = targetRegistry.exercises.find((exercise) => exercise.id === targetData.parNr);

        expect(target).toBeTruthy();
        expect(targetData.surface).toBe('target_equivalent_exit_ticket');
        expect(targetData.metadataAlignment.paragraphSkillIds).toEqual(['A38', 'A39', 'D31']);
        expect(targetData.targetSkillIds).toEqual(targetData.metadataAlignment.paragraphSkillIds);
        expect(targetData.skillScopeIds).toEqual(targetData.metadataAlignment.paragraphSkillIds);
        expect(targetData.metadataAlignment.targetExerciseSkillIds).toEqual(target.required_skills);
        expect(targetData.metadataAlignment.targetReadinessEvidence).toBe(true);
        expect(targetData.metadataAlignment.status).toBe('target_equivalent_aligned');
        expect(targetData.targetEquivalent).toEqual({
            candidate: true,
            gateApproved: true,
            completionLanguageEligible: true,
        });

        for (const id of [
            ...targetData.targetSkillIds,
            ...targetData.skillScopeIds,
            ...targetData.metadataAlignment.targetExerciseSkillIds,
        ]) {
            expect(ids.has(id)).toBe(true);
        }
    });
});
