const fs = require('fs');
const path = require('path');
const SkillMapEngine = require('../skill-map-engine');
const SkillMapRouteUI = require('../skill-map-route-ui');
const elements = require('../skilltree/base-elements');

function makeData() {
    return {
        parNr: '1.1.3',
        activeSkills: ['A61', 'A62', 'A63', 'A38', 'A39'],
        skillMapDefaults: {
            mode: 'compact',
            aspectFilter: 'mixed',
            maxVisibleAvailable: 4,
            allowFullView: false
        }
    };
}

describe('SkillMapRouteUI', () => {
    test('renders a compact scoped route without exposing full catalog language', () => {
        const request = SkillMapEngine.createRequest('graphical-game', {
            paragraph: '1.1.3',
            mode: 'compact',
            aspectFilter: 'graphical',
            maxVisibleAvailable: 3
        });

        const html = SkillMapRouteUI.renderRequest(request, {
            elements,
            data: makeData(),
            stars: { A62: 1 },
            title: 'Oefenroute Grafieken'
        });

        expect(html).toContain('Oefenroute Grafieken');
        expect(html).toMatch(/Start oefenen|Ga verder/);
        expect(html).toContain('Alleen lokale oefenvoortgang');
        expect(html).toContain('skill-map-route-item');
        expect(html).not.toMatch(/beheerst|meesterschap|summatief|student-facing AI/i);
    });

    test('renders recommended focus as a student-facing label, not an internal skill ID', () => {
        const request = SkillMapEngine.createRequest('calculation-game', {
            paragraph: '1.1.3',
            mode: 'compact',
            aspectFilter: 'calculation',
            skillScope: ['A61', 'A62'],
            maxVisibleAvailable: 3
        });

        const html = SkillMapRouteUI.renderRequest(request, {
            elements,
            data: makeData(),
            stars: {},
            title: 'Oefenroute Rekenen'
        });
        const visibleText = html.replace(/<[^>]+>/g, ' ');

        expect(visibleText).toContain('Focus: Tabelwaarden selecteren voor berekening');
        expect(visibleText).not.toMatch(/\bA61\b/);
    });

    test('shell generators load shared route UI for all three practice games', () => {
        const files = [
            'build-scripts/platform/build-reasoning-engine.js',
            'build-scripts/platform/build-procedure-shells.js',
            'build-scripts/platform/build-graphical-shells.js'
        ];
        for (const relative of files) {
            const text = fs.readFileSync(path.resolve(__dirname, '..', '..', relative), 'utf8');
            expect(text).toContain('skill-map-route.css');
            expect(text).toContain('skill-map-engine.js');
            expect(text).toContain('skilltree/base-elements.js');
            expect(text).toContain('skill-map-route-ui.js');
        }
    });
});
