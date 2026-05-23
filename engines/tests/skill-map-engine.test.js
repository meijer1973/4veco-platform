const SkillMapEngine = require('../skill-map-engine');
const elements = require('../skilltree/base-elements');
const ReasoningEngine = require('../reasoning-engine');
const ProcedureEngine = require('../procedure-engine');
const GraphicalEngine = require('../graphical-engine');

function skillIds(view) {
    return view.visibleSkills.map(skill => skill.id);
}

function makeSkillMap(stars, data) {
    return new SkillMapEngine({
        elements,
        data: data || { parNr: '1.1.3', activeSkills: ['A61', 'A62', 'A63', 'A38', 'A39'] },
        stars: stars || {}
    });
}

function graphicalFixture() {
    return {
        schema_version: 1,
        meta: { parNr: '1.1.3', parName: 'Grafieken en tabellen', title: 'Grafieken lezen' },
        challenges: [
            {
                id: 'bar-read',
                type: 'bar_value_read',
                title: 'Lees een staaf af',
                prompt: 'Wat is de waarde?',
                target_label: '2025',
                graph: {
                    type: 'bar',
                    title: 'Verkoop',
                    x_label: 'jaar',
                    y_label: 'aantal',
                    unit: 'stuks',
                    series: [
                        { label: '2024', value: 120 },
                        { label: '2025', value: 150 }
                    ]
                },
                expected_answer: { kind: 'number', value: 150, unit: 'stuks' },
                feedback_steps: [
                    { label: 'Bron', text: 'Lees de grafiek.' },
                    { label: 'Waarde', text: 'Kies de juiste staaf.' },
                    { label: 'Antwoord', text: 'Noteer de eenheid.' }
                ]
            }
        ]
    };
}

describe('SkillMapEngine aspect routes', () => {
    test('filters calculation route by MTU rekenen aspect and keeps mixed support visible', () => {
        const view = makeSkillMap().buildView({
            surface: 'calculation-game',
            mode: 'route',
            aspectFilter: 'calculation',
            skillScope: ['A61', 'A62', 'A63', 'A38', 'A39']
        });

        expect(view.mode).toBe('route');
        expect(view.aspectFilter).toBe('calculation');
        expect(skillIds(view)).toEqual(expect.arrayContaining(['A61', 'A38', 'A39']));
        expect(skillIds(view)).not.toContain('A62');
        expect(skillIds(view)).not.toContain('A63');
        expect(view.visibleSkills.find(skill => skill.id === 'A61').sourceAspects).toEqual(['rekenen', 'verbaal']);
    });

    test('filters graphical route by MTU grafisch aspect', () => {
        const view = makeSkillMap().buildView({
            surface: 'graphical-game',
            mode: 'route',
            aspectFilter: 'graphical',
            skillScope: ['A61', 'A62', 'A63', 'A38', 'A39']
        });

        expect(skillIds(view)).toEqual(expect.arrayContaining(['A62', 'A63']));
        expect(skillIds(view)).not.toContain('A61');
        expect(view.visibleSkills.every(skill => skill.aspects.includes('graphical'))).toBe(true);
    });

    test('uses explicit mixed mode only for multi-aspect skills', () => {
        const view = makeSkillMap().buildView({
            surface: 'landing-preview',
            mode: 'route',
            aspectFilter: 'mixed',
            skillScope: ['A61', 'A62', 'A63', 'A38', 'A39']
        });

        expect(skillIds(view)).toContain('A61');
        expect(skillIds(view)).not.toContain('A62');
        expect(skillIds(view)).not.toContain('A63');
        expect(view.visibleSkills.every(skill => skill.sourceAspects.length > 1)).toBe(true);
    });
});

describe('SkillMapEngine display modes and boundaries', () => {
    test('compact mode limits visible skills and hides later skills', () => {
        const view = makeSkillMap().buildView({
            surface: 'exit-ticket',
            mode: 'compact',
            aspectFilter: 'mixed',
            skillScope: ['A01', 'A02', 'A05', 'A07', 'A15', 'A61'],
            maxVisibleAvailable: 3
        });

        expect(view.mode).toBe('compact');
        expect(view.visibleSkills.length).toBeLessThanOrEqual(3);
        expect(view.primaryAction.label).toMatch(/Start oefenen|Ga verder/);
        expect(view.progress.practiceProgressOnly).toBe(true);
        const studentCopy = view.visibleSkills.map(skill => skill.studentLabel + ' ' + skill.routeReason).join(' ');
        expect(studentCopy).not.toMatch(/diagnose|beheerst|mastery|summative/i);
    });

    test('route mode includes target prerequisites as route context', () => {
        const view = makeSkillMap({ A01: 1, A02: 1 }).buildView({
            surface: 'calculation-game',
            mode: 'route',
            aspectFilter: 'calculation',
            targetSkills: ['A06'],
            skillScope: ['A06']
        });

        expect(skillIds(view)).toEqual(expect.arrayContaining(['A01', 'A02', 'A06']));
        expect(view.visibleSkills.find(skill => skill.id === 'A06').routeRole).toBe('target');
        expect(view.visibleSkills.find(skill => skill.id === 'A01').routeRole).toBe('prerequisite');
    });

    test('full mode is downgraded unless explicitly allowed', () => {
        const blocked = makeSkillMap().buildView({
            surface: 'landing-preview',
            mode: 'full',
            allowFullView: false,
            skillScope: ['A61', 'A62', 'A63']
        });

        expect(blocked.mode).toBe('route');
        expect(blocked.fullViewAvailable).toBe(false);
        expect(blocked.warnings).toContain('full_view_requires_explicit_allowFullView');

        const allowed = makeSkillMap().buildView({
            surface: 'landing-preview',
            mode: 'full',
            allowFullView: true,
            skillScope: ['A61', 'A62', 'A63']
        });

        expect(allowed.mode).toBe('full');
        expect(allowed.fullViewAvailable).toBe(true);
        expect(skillIds(allowed)).toEqual(['A61', 'A62', 'A63']);
    });

    test('boundary flags are forced false even when requested true', () => {
        const view = makeSkillMap().buildView({
            surface: 'reasoning-game',
            mode: 'compact',
            aspectFilter: 'reasoning',
            skillScope: ['A61'],
            boundaryFlags: {
                diagnostics: true,
                adaptiveRouting: true,
                studentFacingAI: true
            }
        });

        expect(view.boundaryFlags.diagnostics).toBe(false);
        expect(view.boundaryFlags.adaptiveRouting).toBe(false);
        expect(view.boundaryFlags.studentFacingAI).toBe(false);
        expect(view.warnings).toEqual(expect.arrayContaining([
            'boundary_flag_forced_false:diagnostics',
            'boundary_flag_forced_false:adaptiveRouting',
            'boundary_flag_forced_false:studentFacingAI'
        ]));
    });
});

describe('practice engines request scoped skill-map routes', () => {
    test('reasoning engine requests reasoning route', () => {
        const csv = 'id;structure_type;structure_label;problem_text;step_1_label;step_1_detail;step_2_label;step_2_detail;step_3_label;step_3_detail\n'
            + '1;A;Route;Vraag;Stap 1;Detail;Stap 2;Detail;Stap 3;Detail';
        const engine = new ReasoningEngine({ csvString: csv, domain: 'economics', parNr: '1.1.1' });
        const request = engine.getSkillMapRequest({ targetSkills: ['A61'] });

        expect(request.surface).toBe('reasoning-game');
        expect(request.aspectFilter).toBe('reasoning');
        expect(request.paragraph).toBe('1.1.1');
        expect(request.allowFullView).toBe(false);
    });

    test('procedure engine requests calculation route', () => {
        const engine = new ProcedureEngine({ procedures: [], parNr: '1.1.2' });
        const request = engine.getSkillMapRequest({ skillScope: ['A38', 'A39'] });

        expect(request.surface).toBe('calculation-game');
        expect(request.aspectFilter).toBe('calculation');
        expect(request.skillScope).toEqual(['A38', 'A39']);
        expect(request.boundaryFlags.masteryDecisions).toBe(false);
    });

    test('graphical engine requests graphical route', () => {
        const engine = new GraphicalEngine({ data: graphicalFixture() });
        const request = engine.getSkillMapRequest({ mode: 'route', targetSkills: ['A62'] });

        expect(request.surface).toBe('graphical-game');
        expect(request.aspectFilter).toBe('graphical');
        expect(request.targetSkills).toEqual(['A62']);
        expect(request.boundaryFlags.pvProjection).toBe(false);
    });

    test('exit-ticket and landing preview requests stay compact by default', () => {
        const checkpoint = SkillMapEngine.createRequest('exit-ticket', { paragraph: '1.1.1' });
        const landing = SkillMapEngine.createRequest('landing-preview', { paragraph: '1.1.1' });

        expect(checkpoint.mode).toBe('compact');
        expect(checkpoint.aspectFilter).toBe('mixed');
        expect(landing.mode).toBe('compact');
        expect(landing.allowFullView).toBe(false);
    });
});
