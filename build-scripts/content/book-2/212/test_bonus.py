"""Exact §212 R7 bonus insertion memory; builder tests, not review acceptance."""
from pathlib import Path
import subprocess
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_212 as b

BASE = '2bf6260c5d4d799c5408f898d0dab126eff9e5ac'
SOURCES = ('theory.md', 'exercises.md', 'answers.md', 'target-answers.md')
MARKER = '## Herhaling / Herhaling en interleaving\n'
BLOCK = '''**Beoordelingscriteria:**

- Je onderbouwt dat de winst in beide grafieken bij Q = 30 gelijk is: € 30 per avond.
- Je verklaart de halve papierafstand met de verticale schaal van 150 naar 300 euro, niet met veranderde winst.
- Je vergelijkt grootheden, eenheden, periode, Q, schaal en TO/TK-bedragen; millimeters alleen zijn onvoldoende.

'''


def baseline(name):
    return subprocess.check_output(['git', 'show', BASE + ':build-scripts/content/book-2/212/' + name], cwd=b.ROOT).decode('utf-8')


def insertion(previous):
    assert previous.count(MARKER) == 1
    assert '**Beoordelingscriteria:**' not in previous
    return previous.replace(MARKER, BLOCK + MARKER, 1)


def assert_exact_sources(testcase, sources):
    testcase.assertEqual(set(sources), set(SOURCES))
    for name in SOURCES:
        previous = baseline(name)
        expected = insertion(previous) if name == 'answers.md' else previous
        testcase.assertEqual(sources[name], expected, name)


class BonusTests(unittest.TestCase):
    def setUp(self):
        self.sources = {name: (b.CONTENT / name).read_text(encoding='utf-8') for name in SOURCES}

    def test_current_exact_full_source_and_three_criteria(self):
        assert_exact_sources(self, self.sources)
        answer = self.sources['answers.md']
        self.assertEqual(answer.count(BLOCK), 1)
        self.assertEqual(len([line for line in BLOCK.splitlines() if line.startswith('- ')]), 3)
        self.assertEqual(answer.replace(BLOCK, '', 1), baseline('answers.md'))
        self.assertLess(answer.index('b) Vergelijk eerst'), answer.index(BLOCK))
        self.assertEqual(answer.split(BLOCK, 1)[1], MARKER + baseline('answers.md').split(MARKER, 1)[1])

    def test_missing_extra_and_misplaced_criteria_rejected(self):
        original = baseline('answers.md')
        expected = insertion(original)
        mutations = {
            'missing_real_r6': original,
            'extra_bullet': expected.replace(MARKER, '- Een extra criterium.\n\n' + MARKER, 1),
            'duplicate_block': expected.replace(MARKER, BLOCK + MARKER, 1),
            'misplaced_before_model': original.replace('**Opgave 8**\n', BLOCK + '**Opgave 8**\n', 1),
            'misplaced_after_herhaling': original.replace(MARKER, MARKER + '\n' + BLOCK, 1),
        }
        for name, candidate in mutations.items():
            with self.subTest(name=name), self.assertRaises(AssertionError):
                assert_exact_sources(self, {**self.sources, 'answers.md': candidate})

    def test_model_answer_and_unrelated_source_drift_rejected(self):
        valid = {name: insertion(baseline(name)) if name == 'answers.md' else baseline(name) for name in SOURCES}
        mutations = [
            ('answers.md', valid['answers.md'].replace('de winst is **€ 30 per avond**', 'de winst is **€ 15 per avond**', 1)),
            ('answers.md', valid['answers.md'].replace('TK = 12 + 3 × 2', 'TK = 12 + 4 × 2', 1)),
            ('theory.md', valid['theory.md'] + '\nNieuwe uitleg.\n'),
            ('exercises.md', valid['exercises.md'].replace('Alleen de verticale schaal verschilt.', 'Ook de prijs verschilt.', 1)),
            ('target-answers.md', valid['target-answers.md'].replace('Totaal | 11', 'Totaal | 12', 1)),
        ]
        for name, candidate in mutations:
            self.assertNotEqual(candidate, valid[name], 'negative fixture must mutate real bytes')
            with self.subTest(name=name), self.assertRaises(AssertionError):
                assert_exact_sources(self, {**valid, name: candidate})


if __name__ == '__main__':
    unittest.main()
