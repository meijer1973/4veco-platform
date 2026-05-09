/**
 * Regression test for L1.5V Bucket A1: shared visual frame must not emit any
 * production label (e.g. `COMPANION VISUAL`) on student-facing surfaces.
 *
 * The voorkennis review (1.1.1-companion-visual-review.md, HF-1) flagged that
 * `lib-visual-surfaces.js` emitted `COMPANION VISUAL` in the shared frame for
 * every non-slide variant, leaking internal production terminology into the
 * student experience. This test enforces that no SVG emitted by the shared
 * `frame()` helper contains that label, across every surface and theme.
 */

const {
    SURFACES,
    THEMES,
    frame,
} = require('../../build-scripts/lib/lib-visual-surfaces');

describe('visual-surfaces no production label', () => {
    const surfaceNames = Object.keys(SURFACES);
    const themeNames = Object.keys(THEMES);

    test('every surface × theme has at least one combination', () => {
        expect(surfaceNames.length).toBeGreaterThan(0);
        expect(themeNames.length).toBeGreaterThan(0);
    });

    for (const surfaceName of surfaceNames) {
        for (const themeName of themeNames) {
            test(`${surfaceName}/${themeName} frame() emits no COMPANION VISUAL label`, () => {
                const surface = SURFACES[surfaceName];
                const cfg = { ...surface, theme: themeName };
                const { header } = frame(cfg, 'Sample title', 'Sample subtitle', '#888');
                expect(header).not.toMatch(/COMPANION VISUAL/);
                expect(header).not.toMatch(/COMPANION_VISUAL/);
                expect(header).not.toMatch(/companion[- ]?visual/i);
            });
        }
    }
});
