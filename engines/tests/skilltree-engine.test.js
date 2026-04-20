/**
 * Unit tests for SkillTreeEngine — the pure game logic module.
 */
const SkillTreeEngine = require('../skilltree-engine');
const elements = require('../skilltree/base-elements');

// ── Mock storage ──────────────────────────────────────────────────

function makeStorage(initial) {
    const data = Object.assign({}, initial || {});
    return {
        _data: data,
        getItem: function (k) { return data[k] || null; },
        setItem: function (k, v) { data[k] = v; },
        removeItem: function (k) { delete data[k]; }
    };
}

function createEngine(overrides) {
    const defaults = {
        elements: elements,
        data: { parNr: '3.2.1', activeSkills: ['A01', 'A02', 'A03', 'A04', 'A05', 'A10', 'A06', 'A15', 'A16', 'A17', 'A19'] },
        storage: makeStorage()
    };
    return new SkillTreeEngine(Object.assign(defaults, overrides));
}

// ── Constructor ───────────────────────────────────────────────────

describe('SkillTreeEngine constructor', () => {
    test('throws without config', () => {
        expect(() => new SkillTreeEngine()).toThrow('config is required');
    });

    test('throws without elements', () => {
        expect(() => new SkillTreeEngine({})).toThrow('elements is required');
    });

    test('creates engine with valid config', () => {
        const engine = createEngine();
        expect(engine).toBeDefined();
    });
});

// ── Visible skills filtering ──────────────────────────────────────

describe('getVisibleSkills', () => {
    test('returns filtered skills for paragraph with activeSkills', () => {
        const engine = createEngine({
            data: { parNr: '3.1.1', activeSkills: ['A01', 'A02', 'A03', 'A04'] }
        });
        const visible = engine.getVisibleSkills();
        expect(visible).toHaveLength(4);
        expect(visible.map(s => s.id)).toEqual(['A01', 'A02', 'A03', 'A04']);
    });

    test('returns all skills when activeSkills is null', () => {
        const engine = createEngine({
            data: { parNr: '3.2.7', activeSkills: null }
        });
        expect(engine.getVisibleSkills()).toHaveLength(elements.SKILLS.length);
    });

    test('filters prerequisites to only include visible skills', () => {
        // A06 normally needs A01 and A02; if only A06 and A01 are active, A02 should be removed from needs
        const engine = createEngine({
            data: { parNr: 'test', activeSkills: ['A01', 'A06'] }
        });
        const b1 = engine.getVisibleSkills().find(s => s.id === 'A06');
        expect(b1.needs).toEqual(['A01']); // A02 filtered out
    });
});

// ── Prerequisites ─────────────────────────────────────────────────

describe('prereqsDone', () => {
    test('returns true for skills with no prerequisites', () => {
        const engine = createEngine();
        expect(engine.prereqsDone('A01')).toBe(true);
    });

    test('returns false when prerequisites not met', () => {
        const engine = createEngine();
        // A06 needs A01 and A02
        expect(engine.prereqsDone('A06')).toBe(false);
    });

    test('returns true when prerequisites are met', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 1, A02: 2 })
        });
        const engine = createEngine({ storage });
        expect(engine.prereqsDone('A06')).toBe(true);
    });
});

describe('getMissingPrereqs', () => {
    test('returns empty for met prerequisites', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3, A02: 3 })
        });
        const engine = createEngine({ storage });
        expect(engine.getMissingPrereqs('A06')).toEqual([]);
    });

    test('returns missing skill IDs', () => {
        const engine = createEngine();
        const missing = engine.getMissingPrereqs('A06');
        expect(missing).toContain('A01');
        expect(missing).toContain('A02');
    });
});

// ── Dependency subgraph ──────────────────────────────────────────

describe('getDependencySubgraph', () => {
    test('returns null for non-existent skill', () => {
        const engine = createEngine();
        expect(engine.getDependencySubgraph('FAKE')).toBeNull();
    });

    test('returns only root for layer-0 skill (no deps)', () => {
        const engine = createEngine();
        const sg = engine.getDependencySubgraph('A01');
        expect(sg.root).toBe('A01');
        expect(sg.nodes).toHaveLength(1);
        expect(sg.nodes[0].id).toBe('A01');
        expect(sg.edges).toHaveLength(0);
    });

    test('returns direct prerequisites for layer-1 skill', () => {
        const engine = createEngine();
        const sg = engine.getDependencySubgraph('A06');
        expect(sg.root).toBe('A06');
        const ids = sg.nodes.map(n => n.id).sort();
        expect(ids).toEqual(['A01', 'A02', 'A06']);
        expect(sg.edges).toHaveLength(2);
        expect(sg.edges).toContainEqual({ from: 'A01', to: 'A06' });
        expect(sg.edges).toContainEqual({ from: 'A02', to: 'A06' });
    });

    test('returns transitive closure for deeper skills', () => {
        // A19 needs A06, A10; A06 needs A01, A02; A10 needs A04
        const engine = createEngine();
        const sg = engine.getDependencySubgraph('A19');
        const ids = sg.nodes.map(n => n.id).sort();
        expect(ids).toEqual(['A01', 'A02', 'A04', 'A06', 'A10', 'A19']);
        // Shared nodes appear only once
        expect(sg.nodes.filter(n => n.id === 'A01')).toHaveLength(1);
    });

    test('respects visible skill filter (excludes non-active prereqs)', () => {
        // A06 normally needs A01 and A02, but if only A01 is active, A02 is excluded
        const engine = createEngine({
            data: { parNr: 'test', activeSkills: ['A01', 'A06'] }
        });
        const sg = engine.getDependencySubgraph('A06');
        const ids = sg.nodes.map(n => n.id).sort();
        expect(ids).toEqual(['A01', 'A06']);
        expect(sg.edges).toHaveLength(1);
        expect(sg.edges[0]).toEqual({ from: 'A01', to: 'A06' });
    });

    test('returns null for skill not in visible set', () => {
        const engine = createEngine({
            data: { parNr: 'test', activeSkills: ['A01', 'A02'] }
        });
        expect(engine.getDependencySubgraph('A06')).toBeNull();
    });

    test('works with all skills visible', () => {
        const engine = createEngine({
            data: { parNr: 'all', activeSkills: null }
        });
        const sg = engine.getDependencySubgraph('A35');
        expect(sg.root).toBe('A35');
        // A35 has a deep tree: A35 -> A20,A21,A04 -> A12,A13,A02,A07,A08 -> A11,A01,A03
        expect(sg.nodes.length).toBeGreaterThan(8);
        // All nodes should be unique
        const ids = sg.nodes.map(n => n.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

// ── Exercise flow ─────────────────────────────────────────────────

describe('startExercise', () => {
    test('returns null for unknown skill', () => {
        const engine = createEngine();
        expect(engine.startExercise('FAKE')).toBeNull();
    });

    test('returns exercise object for valid skill', () => {
        const engine = createEngine();
        const ex = engine.startExercise('A01');
        expect(ex).not.toBeNull();
        expect(ex.skillId).toBe('A01');
        expect(ex.totalSteps).toBeGreaterThanOrEqual(1);
        expect(ex.context).toBeTruthy();
        expect(ex.currentStep).toBeDefined();
        expect(ex.currentStep.q).toBeTruthy();
        expect(ex.currentStep.a).toBeDefined();
    });
});

describe('getExerciseState', () => {
    test('returns null when no exercise active', () => {
        const engine = createEngine();
        expect(engine.getExerciseState()).toBeNull();
    });

    test('returns full state during exercise', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const state = engine.getExerciseState();
        expect(state.skillId).toBe('A01');
        expect(state.currentStepIdx).toBe(0);
        expect(state.errors).toBe(0);
        expect(state.hints).toBe(0);
        expect(state.completedSteps).toEqual([]);
    });
});

describe('checkAnswer', () => {
    test('returns correct for right answer', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const step = engine.getExerciseState().currentStep;
        const result = engine.checkAnswer(step.a);
        expect(result.correct).toBe(true);
    });

    test('returns wrong for incorrect answer', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(99999);
        expect(result.correct).toBe(false);
    });

    test('returns error for non-numeric input', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer('abc');
        expect(result.correct).toBe(false);
        expect(result.error).toBe('invalid_number');
    });

    test('handles comma as decimal separator', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const step = engine.getExerciseState().currentStep;
        const result = engine.checkAnswer(String(step.a).replace('.', ','));
        expect(result.correct).toBe(true);
    });

    test('tolerates small rounding differences', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const step = engine.getExerciseState().currentStep;
        // Add tiny offset within tolerance
        const result = engine.checkAnswer(step.a + 0.01);
        expect(result.correct).toBe(true);
    });

    test('increments error count on wrong answer', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        engine.checkAnswer(99999);
        engine.checkAnswer(99999);
        expect(engine.getExerciseState().errors).toBe(2);
    });
});

describe('nextStep', () => {
    test('advances to next step after correct answer', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const step = engine.getExerciseState().currentStep;
        engine.checkAnswer(step.a);
        const next = engine.nextStep();
        expect(next).not.toBeNull();
        expect(next.currentStepIdx).toBe(1);
    });

    test('returns null when no more steps', () => {
        const engine = createEngine();
        const ex = engine.startExercise('A02'); // A02 has 3 steps
        // Complete all steps
        for (let i = 0; i < ex.totalSteps; i++) {
            const step = engine.getExerciseState().currentStep;
            const answer = step.mode === 'mc' ? step.correctIdx : step.a;
            engine.checkAnswer(answer);
            if (i < ex.totalSteps - 1) engine.nextStep();
        }
        expect(engine.nextStep()).toBeNull();
    });
});

describe('useHint', () => {
    test('returns hint text and increments count', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        const hint = engine.useHint();
        expect(hint).toBeTruthy();
        expect(engine.getExerciseState().hints).toBe(1);
    });
});

// ── Finish exercise & star rating ─────────────────────────────────

describe('finishExercise', () => {
    function completeExercise(engine, skillId) {
        const ex = engine.startExercise(skillId);
        for (let i = 0; i < ex.totalSteps; i++) {
            const step = engine.getExerciseState().currentStep;
            const answer = step.mode === 'mc' ? step.correctIdx : step.a;
            engine.checkAnswer(answer);
            if (i < ex.totalSteps - 1) engine.nextStep();
        }
        return engine.finishExercise();
    }

    test('awards 3 stars for no errors/hints (additive)', () => {
        const engine = createEngine();
        const result = completeExercise(engine, 'A01');
        expect(result.earned).toBe(3);
        expect(result.newTotal).toBe(3);
        expect(result.improved).toBe(true);
        expect(engine.getSkillStars('A01')).toBe(3);
    });

    test('additive stars: second perfect run reaches 5', () => {
        const engine = createEngine();
        completeExercise(engine, 'A01'); // 0 → 3
        const result2 = completeExercise(engine, 'A01'); // 3 → 5 (3+3=6, capped at 5)
        expect(result2.newTotal).toBe(5);
        expect(engine.getSkillStars('A01')).toBe(5);
    });

    test('awards 2 stars for 1-2 penalties', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        engine.useHint(); // +1 penalty
        const ex = engine.getExerciseState();
        for (let i = 0; i < ex.totalSteps; i++) {
            const step = engine.getExerciseState().currentStep;
            const answer = step.mode === 'mc' ? step.correctIdx : step.a;
            engine.checkAnswer(answer);
            if (i < ex.totalSteps - 1) engine.nextStep();
        }
        const result = engine.finishExercise();
        expect(result.earned).toBe(2);
    });

    test('awards 1 star for 3+ penalties', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        engine.useHint();
        engine.checkAnswer(99999); // wrong
        engine.checkAnswer(99999); // wrong
        const ex = engine.getExerciseState();
        for (let i = 0; i < ex.totalSteps; i++) {
            const step = engine.getExerciseState().currentStep;
            const answer = step.mode === 'mc' ? step.correctIdx : step.a;
            engine.checkAnswer(answer);
            if (i < ex.totalSteps - 1) engine.nextStep();
        }
        const result = engine.finishExercise();
        expect(result.earned).toBe(1);
    });

    test('additive stars cap at 5', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 5 })
        });
        const engine = createEngine({ storage });
        engine.startExercise('A01');
        // Even with errors, earned >= 1, but 5+1 caps at 5
        for (let i = 0; i < 5; i++) engine.checkAnswer(99999);
        const state = engine.getExerciseState();
        for (let i = 0; i < state.totalSteps; i++) {
            const step = engine.getExerciseState().currentStep;
            engine.checkAnswer(step.a);
            if (i < state.totalSteps - 1) engine.nextStep();
        }
        const result = engine.finishExercise();
        expect(result.earned).toBe(1);
        expect(result.newTotal).toBe(5); // already at max
        expect(result.improved).toBe(false);
        expect(engine.getSkillStars('A01')).toBe(5);
    });

    test('saves to storage after earning stars', () => {
        const storage = makeStorage();
        const engine = createEngine({ storage });
        completeExercise(engine, 'A01');
        const saved = JSON.parse(storage._data['skilltree_global_stars']);
        expect(saved.A01).toBe(3);
    });
});

// ── Global progress & migration ───────────────────────────────────

describe('global progress', () => {
    test('loads from skilltree_global_stars', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 2, A02: 3 })
        });
        const engine = createEngine({ storage });
        expect(engine.getSkillStars('A01')).toBe(2);
        expect(engine.getSkillStars('A02')).toBe(3);
    });

    test('migrates old per-paragraph keys', () => {
        const storage = makeStorage({
            'skilltree_3.1.1': JSON.stringify({ A01: 2, A02: 1 }),
            'skilltree_3.2.1': JSON.stringify({ A01: 3, A03: 2 })
        });
        const engine = createEngine({ storage });
        // Should merge: A01=max(2,3)=3, A02=1, A03=2
        expect(engine.getSkillStars('A01')).toBe(3);
        expect(engine.getSkillStars('A02')).toBe(1);
        expect(engine.getSkillStars('A03')).toBe(2);
        // Old keys should be removed
        expect(storage._data['skilltree_3.1.1']).toBeUndefined();
        expect(storage._data['skilltree_3.2.1']).toBeUndefined();
        // Global key should be set
        expect(storage._data['skilltree_global_stars']).toBeDefined();
    });

    test('migrates old econ-game-stars key', () => {
        const storage = makeStorage({
            'econ-game-stars': JSON.stringify({ A01: 1, A06: 2 })
        });
        const engine = createEngine({ storage });
        expect(engine.getSkillStars('A01')).toBe(1);
        expect(engine.getSkillStars('A06')).toBe(2);
        expect(storage._data['econ-game-stars']).toBeUndefined();
    });

    test('prefers global key over old keys', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3 }),
            'skilltree_3.1.1': JSON.stringify({ A01: 1 }) // should be ignored
        });
        const engine = createEngine({ storage });
        expect(engine.getSkillStars('A01')).toBe(3);
    });
});

// ── Progress stats ────────────────────────────────────────────────

describe('getProgress', () => {
    test('reports zero progress initially', () => {
        const engine = createEngine();
        const p = engine.getProgress();
        expect(p.mastered).toBe(0);
        expect(p.totalStars).toBe(0);
        expect(p.total).toBe(11); // 3.2.1 now has 11 skills (added A05, A15, A16, A17)
        expect(p.maxStars).toBe(55);
    });

    test('reports correct progress after earning stars', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3, A02: 2, A03: 1 })
        });
        const engine = createEngine({ storage });
        const p = engine.getProgress();
        expect(p.mastered).toBe(3);
        expect(p.totalStars).toBe(6);
    });

    test('only counts visible skills', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3, A12: 2 }) // A12 not in 3.1.1
        });
        const engine = createEngine({
            storage,
            data: { parNr: '3.1.1', activeSkills: ['A01', 'A02', 'A03', 'A04'] }
        });
        const p = engine.getProgress();
        expect(p.mastered).toBe(1); // Only A01 counts
        expect(p.totalStars).toBe(3); // Only A01's stars
    });
});

// ── Reset ─────────────────────────────────────────────────────────

describe('resetStars', () => {
    test('clears all stars', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3, A02: 2 })
        });
        const engine = createEngine({ storage });
        engine.resetStars();
        expect(engine.getSkillStars('A01')).toBe(0);
        expect(engine.getSkillStars('A02')).toBe(0);
        expect(JSON.parse(storage._data['skilltree_global_stars'])).toEqual({});
    });
});

// ── abortExercise ─────────────────────────────────────────────────

describe('abortExercise', () => {
    test('clears exercise state without awarding stars', () => {
        const engine = createEngine();
        engine.startExercise('A01');
        engine.abortExercise();
        expect(engine.getExerciseState()).toBeNull();
        expect(engine.getSkillStars('A01')).toBe(0);
    });
});

// ── Goal management ──────────────────────────────────────────────

describe('Goal management', () => {
    test('setGoal adds a goal', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        const result = engine.setGoal('A35');
        expect(result).not.toBeNull();
        expect(result.active).toHaveLength(1);
        expect(result.active[0].id).toBe('A35');
        expect(result.active[0].setAt).toBeGreaterThan(0);
    });

    test('setGoal rejects duplicate', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        expect(engine.setGoal('A35')).toBeNull();
    });

    test('setGoal enforces max 2 goals', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        engine.setGoal('A20');
        expect(engine.setGoal('A29')).toBeNull();
        expect(engine.getGoals().active).toHaveLength(2);
    });

    test('setGoal rejects non-existent skill', () => {
        const engine = createEngine();
        expect(engine.setGoal('NOPE')).toBeNull();
    });

    test('setGoal rejects already-achieved goal', () => {
        const storage = makeStorage({
            'skilltree_goals': JSON.stringify({
                active: [],
                achieved: [{ id: 'A20', setAt: 1000, achievedAt: 2000 }]
            })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        expect(engine.setGoal('A20')).toBeNull();
    });

    test('removeGoal removes a goal', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        engine.setGoal('A20');
        engine.removeGoal('A35');
        expect(engine.getGoals().active).toHaveLength(1);
        expect(engine.getGoals().active[0].id).toBe('A20');
    });

    test('removeGoal is a no-op for non-goal', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        engine.removeGoal('A01');
        expect(engine.getGoals().active).toHaveLength(1);
    });

    test('isGoal returns correct boolean', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        expect(engine.isGoal('A35')).toBe(true);
        expect(engine.isGoal('A01')).toBe(false);
    });

    test('isAchievedGoal returns correct boolean', () => {
        const storage = makeStorage({
            'skilltree_goals': JSON.stringify({
                active: [],
                achieved: [{ id: 'A20', setAt: 1000, achievedAt: 2000 }]
            })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        expect(engine.isAchievedGoal('A20')).toBe(true);
        expect(engine.isAchievedGoal('A35')).toBe(false);
    });

    test('goals persist to storage', () => {
        const storage = makeStorage();
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        engine.setGoal('A35');
        const saved = JSON.parse(storage._data['skilltree_goals']);
        expect(saved.active).toHaveLength(1);
        expect(saved.active[0].id).toBe('A35');
    });

    test('goals load from storage on construction', () => {
        const storage = makeStorage({
            'skilltree_goals': JSON.stringify({
                active: [{ id: 'A35', setAt: 1000 }],
                achieved: [{ id: 'A20', setAt: 500, achievedAt: 800 }]
            })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        expect(engine.isGoal('A35')).toBe(true);
        expect(engine.isAchievedGoal('A20')).toBe(true);
    });
});

// ── Goal path computation ────────────────────────────────────────

describe('getGoalPath', () => {
    test('returns full transitive path for a deep skill', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        const path = engine.getGoalPath('A35');
        expect(path).not.toBeNull();
        expect(path.goalId).toBe('A35');
        expect(path.goalName).toBeDefined();
        expect(path.totalPrereqs).toBeGreaterThan(5);
        expect(path.remainingSkills.length).toBeGreaterThan(0);
    });

    test('correctly counts mastered prereqs', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 3, A02: 3, A03: 1, A04: 2 })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        const path = engine.getGoalPath('A19');
        // A19 path: A19, A06, A10, A01, A02, A04. Stars: A01=3, A02=3, A04=2 → 3 mastered (>=1)
        expect(path.masteredPrereqs).toBe(3);
        expect(path.fullyMastered).toBe(2); // A01 and A02 have >= 3
    });

    test('identifies nextActionable skills', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        const path = engine.getGoalPath('A19');
        // Foundation skills should be actionable (no prereqs)
        expect(path.nextActionable.length).toBeGreaterThan(0);
        // All nextActionable should be in remaining
        for (const sid of path.nextActionable) {
            expect(path.remainingSkills).toContain(sid);
        }
    });

    test('marks goal as complete when skill has >= 3 stars', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A01: 5, A02: 5, A06: 5, A10: 3, A19: 3 })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        const path = engine.getGoalPath('A19');
        expect(path.complete).toBe(true);
    });

    test('works for skills not visible in current paragraph', () => {
        // A35 is not in the 3.1.1 skill set, but getGoalPath uses full graph
        const engine = createEngine({ data: { parNr: '3.1.1', activeSkills: ['A01', 'A02', 'A03', 'A04'] } });
        const path = engine.getGoalPath('A35');
        expect(path).not.toBeNull();
        expect(path.totalPrereqs).toBeGreaterThan(5);
    });

    test('returns null for non-existent skill', () => {
        const engine = createEngine();
        expect(engine.getGoalPath('NOPE')).toBeNull();
    });
});

describe('getGoalPathForParagraph', () => {
    test('returns intersection of goal path with visible skills', () => {
        const engine = createEngine({
            data: { parNr: '3.2.1', activeSkills: ['A01', 'A02', 'A03', 'A04', 'A05', 'A10', 'A06', 'A15', 'A16', 'A17', 'A19'] }
        });
        const result = engine.getGoalPathForParagraph('A19');
        expect(result).not.toBeNull();
        expect(result.visibleOnPath.length).toBeGreaterThan(0);
        // A01, A02 should be on path to A19 and visible
        expect(result.visibleOnPath).toContain('A01');
        expect(result.goalVisibleHere).toBe(true); // A19 is visible in this paragraph
    });

    test('returns goalVisibleHere=false when goal not in paragraph', () => {
        const engine = createEngine({
            data: { parNr: '3.1.1', activeSkills: ['A01', 'A02', 'A03', 'A04'] }
        });
        const result = engine.getGoalPathForParagraph('A35');
        expect(result.goalVisibleHere).toBe(false);
        // But some foundation skills on the path should be visible
        expect(result.visibleOnPath.length).toBeGreaterThan(0);
    });
});

// ── Goal-aware next skill ────────────────────────────────────────

describe('getNextSkill with goals', () => {
    test('prioritizes goal-path skills', () => {
        const engine = createEngine({
            data: { parNr: '3.2.7', activeSkills: null }
        });
        engine.setGoal('A19');
        // A19 depends on A01, A02, A06, A10 — all are foundation/building blocks
        const next = engine.getNextSkill('A05'); // A05 is NOT on the A19 path
        // Next should be a skill on the A19 path
        const path = engine.getGoalPath('A19');
        const pathSet = {};
        for (let i = 0; i < path.remainingSkills.length; i++) {
            pathSet[path.remainingSkills[i]] = true;
        }
        expect(pathSet[next.id]).toBe(true);
    });

    test('falls back to normal behavior with no goals', () => {
        const engine = createEngine();
        const next = engine.getNextSkill('A01');
        expect(next).not.toBeNull();
    });
});

// ── Goal completion ──────────────────────────────────────────────

describe('checkGoalCompletion', () => {
    test('moves goal from active to achieved when >= 3 stars', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A19: 3 })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        engine.setGoal('A19');
        const achieved = engine.checkGoalCompletion();
        expect(achieved).toEqual(['A19']);
        expect(engine.isGoal('A19')).toBe(false);
        expect(engine.isAchievedGoal('A19')).toBe(true);
    });

    test('sets achievedAt timestamp', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A19: 4 })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        engine.setGoal('A19');
        engine.checkGoalCompletion();
        const goals = engine.getGoals();
        expect(goals.achieved.length).toBeGreaterThanOrEqual(1);
        const s1 = goals.achieved.find(g => g.id === 'A19');
        expect(s1.achievedAt).toBeGreaterThan(0);
    });

    test('returns empty array when no goals are complete', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A35');
        expect(engine.checkGoalCompletion()).toEqual([]);
    });

    test('persists changes to storage', () => {
        const storage = makeStorage({
            'skilltree_global_stars': JSON.stringify({ A19: 3 })
        });
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null }, storage });
        engine.setGoal('A19');
        engine.checkGoalCompletion();
        const saved = JSON.parse(storage._data['skilltree_goals']);
        expect(saved.active).toHaveLength(0);
        expect(saved.achieved.length).toBeGreaterThanOrEqual(1);
    });
});

// ── isOnGoalPath ─────────────────────────────────────────────────

describe('isOnGoalPath', () => {
    test('returns true for skill on active goal path', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A19');
        // A01 is a prerequisite of A19 (via A06)
        expect(engine.isOnGoalPath('A01')).toBe(true);
    });

    test('returns false for skill not on any goal path', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        engine.setGoal('A19');
        // A05 (snijpunten bepalen) is not on the A19 path
        expect(engine.isOnGoalPath('A05')).toBe(false);
    });

    test('returns false when no goals set', () => {
        const engine = createEngine({ data: { parNr: '3.2.7', activeSkills: null } });
        expect(engine.isOnGoalPath('A01')).toBe(false);
    });
});

// ── MC mode validation ───────────────────────────────────────────

describe('checkAnswer MC mode', () => {
    function createMCEngine() {
        const storage = makeStorage();
        const customElements = Object.assign({}, elements, {
            GEN: Object.assign({}, elements.GEN, {
                A01: function () {
                    return {
                        context: 'MC test context',
                        steps: [
                            { q: 'Which is correct?', mode: 'mc', options: ['10', '20', '30', '40'], correctIdx: 1, hint: 'Pick 20', expl: 'Answer is 20' },
                            { q: 'Numeric follow-up', a: 42, hint: 'Just 42', expl: '42 is the answer' }
                        ]
                    };
                }
            })
        });
        return new SkillTreeEngine({ elements: customElements, data: { parNr: 'test', activeSkills: null }, storage: storage });
    }

    test('correct MC answer returns correct result', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(1);
        expect(result.correct).toBe(true);
        expect(result.explanation).toBe('Answer is 20');
    });

    test('wrong MC answer returns wrong result', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(0);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('wrong_answer');
    });

    test('invalid MC index returns error', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(-1);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('invalid_choice');
    });

    test('MC errors increment error count', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        engine.checkAnswer(0);
        engine.checkAnswer(3);
        expect(engine.getExerciseState().errors).toBe(2);
    });

    test('streak tracks across MC and numeric steps', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        const r1 = engine.checkAnswer(1);
        expect(r1.streak).toBe(1);
        engine.nextStep();
        const r2 = engine.checkAnswer(42);
        expect(r2.streak).toBe(2);
    });

    test('mixed-mode exercise awards stars correctly', () => {
        const engine = createMCEngine();
        engine.startExercise('A01');
        engine.checkAnswer(1);
        engine.nextStep();
        engine.checkAnswer(42);
        const fr = engine.finishExercise();
        expect(fr.errors).toBe(0);
        expect(fr.earned).toBe(3);
    });

    test('steps without mode field default to numeric', () => {
        const engine = createEngine();
        engine.startExercise('A10');
        const step = engine.getExerciseState().currentStep;
        expect(step.mode).toBeUndefined();
        const result = engine.checkAnswer(step.a);
        expect(result.correct).toBe(true);
    });
});

// ── Order mode validation ────────────────────────────────────────

describe('checkAnswer order mode', () => {
    function createOrderEngine() {
        const storage = makeStorage();
        const customElements = Object.assign({}, elements, {
            GEN: Object.assign({}, elements.GEN, {
                A01: function () {
                    return {
                        context: 'Order test',
                        steps: [
                            { q: 'Zet in volgorde', mode: 'order', blocks: ['Stap A', 'Stap B', 'Stap C'], correctOrder: [1, 2, 0], hint: 'B eerst', expl: 'B, C, A' },
                            { q: 'Numeric follow-up', a: 10, hint: 'Tien', expl: '10' }
                        ]
                    };
                }
            })
        });
        return new SkillTreeEngine({ elements: customElements, data: { parNr: 'test', activeSkills: null }, storage: storage });
    }

    test('correct order returns correct', () => {
        const engine = createOrderEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer([1, 2, 0]);
        expect(result.correct).toBe(true);
    });

    test('wrong order returns wrong', () => {
        const engine = createOrderEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer([0, 1, 2]);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('wrong_order');
    });

    test('incomplete order returns error', () => {
        const engine = createOrderEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer([1, 2]);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('incomplete_order');
    });

    test('order errors increment count', () => {
        const engine = createOrderEngine();
        engine.startExercise('A01');
        engine.checkAnswer([0, 1, 2]); // wrong
        expect(engine.getExerciseState().errors).toBe(1);
    });

    test('streak tracks across order and numeric', () => {
        const engine = createOrderEngine();
        engine.startExercise('A01');
        const r1 = engine.checkAnswer([1, 2, 0]);
        expect(r1.streak).toBe(1);
        engine.nextStep();
        const r2 = engine.checkAnswer(10);
        expect(r2.streak).toBe(2);
    });
});

// ── Error mode validation ────────────────────────────────────────

describe('checkAnswer error mode', () => {
    function createErrorEngine() {
        const storage = makeStorage();
        const customElements = Object.assign({}, elements, {
            GEN: Object.assign({}, elements.GEN, {
                A01: function () {
                    return {
                        context: 'Error test',
                        steps: [
                            { q: 'Vind de fout', mode: 'error', shownSteps: [
                                { text: '10 + 5 = 15', isError: false },
                                { text: '15 / 3 = 6', isError: true },
                                { text: '6 × 2 = 12', isError: false }
                            ], hint: 'Check de deling', expl: '15 / 3 = 5, niet 6' }
                        ]
                    };
                }
            })
        });
        return new SkillTreeEngine({ elements: customElements, data: { parNr: 'test', activeSkills: null }, storage: storage });
    }

    test('selecting error step returns correct', () => {
        const engine = createErrorEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(1);
        expect(result.correct).toBe(true);
    });

    test('selecting correct step returns wrong', () => {
        const engine = createErrorEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(0);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('wrong_answer');
    });

    test('invalid index returns error', () => {
        const engine = createErrorEngine();
        engine.startExercise('A01');
        const result = engine.checkAnswer(5);
        expect(result.correct).toBe(false);
        expect(result.error).toBe('invalid_choice');
    });

    test('error mode increments error count', () => {
        const engine = createErrorEngine();
        engine.startExercise('A01');
        engine.checkAnswer(0); // wrong
        engine.checkAnswer(2); // wrong
        expect(engine.getExerciseState().errors).toBe(2);
    });
});
