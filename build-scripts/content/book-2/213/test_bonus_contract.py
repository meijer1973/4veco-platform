"""R7 bonus-criteria regression, complementary to all 13 unchanged source tests.

HOW TO ADAPT: update only this paragraph's labelled criteria evidence when its
approved task changes; keep the historical missing-block fixture immutable.
Run directly with the same Python/Pandoc environment as test_source.py.
"""
from pathlib import Path
import re
import sys
import unittest
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_213 as b
from print_pipeline import prepare_html

BONUS = '## Denkertje / Bonusopgave'
CLOSING = '## Herhaling / Herhaling en interleaving'
LABEL = '**Beoordelingscriteria — een sterk antwoord:**'
# Verbatim bonus block from platform984547a17c966d3749d08ef34b92747de21eacbf.
OLD_MISSING_BLOCK = '''## Denkertje / Bonusopgave

**Opgave 8 — optioneel**

a) Onjuist. Bij K: MK over 0–4 = (32 − 20)/(4 − 0) = 12/4 = **3**. Over 4–12: MK = (56 − 32)/(12 − 4) = 24/8 = **3**, in euro per extra verpakking. Het tweede totale kostenverschil is groter, maar er komen ook twee keer zoveel producten bij. MK blijft gelijk.

b) Bij L: MK over 0–4 = (40 − 20)/4 = **5**; over 4–12 = (56 − 40)/8 = **2**, in euro per extra verpakking. L heeft dalende interval-MK, K constante interval-MK. Hetzelfde totale eindbedrag € 56 zegt niet dat de verhoudingen over de tussenliggende stappen gelijk zijn.

c) Nee. De tabel geeft alleen de totale verandering van Q = 4 naar Q = 12. Je mist de afzonderlijke totale kosten bij **Q = 5** (of de kostenverandering van 4 naar 5). Een gemiddelde over acht extra producten bepaalt niet de extra kosten van alleen het vijfde product.

## Herhaling / Herhaling en interleaving
'''

def verify(source):
    assert source.count(LABEL) == 1, 'missing or duplicate bonus criteria block'
    section = source.split(BONUS, 1)[1].split(CLOSING, 1)[0]
    assert LABEL in section, 'criteria outside bonus answers'
    model, criteria = section.split(LABEL)
    assert '\nc) Nee.' in model, 'criteria must follow all three model answers'
    bullets = re.findall(r'^- (.+)$', criteria, re.M)
    assert 2 <= len(bullets) <= 4, 'bonus requires 2–4 criteria bullets'
    assert len(bullets) == 3, 'this bounded correction uses one criterion per part'
    required = [
        ['**a)**', '4 en 8', '3 en 3', 'euro per extra verpakking', 'grotere ΔTK', 'grotere MK'],
        ['**b)**', '5 naar 2', 'constante MK van K', 'TK = € 56', 'patroon'],
        ['**c)**', 'intervalgemiddelde', 'vijfde verpakking', 'TK bij Q = 5', '4 naar 5'],
    ]
    for bullet, concepts in zip(bullets, required):
        assert all(concept in bullet for concept in concepts), 'criterion coverage drift'
    assert not criteria.strip().replace('\n', '').startswith('a)'), 'not a repeated model answer'
    return bullets

class BonusCriteriaTests(unittest.TestCase):
    def test_current_source_contains_bounded_criteria(self):
        verify((b.CONTENT/'answers.md').read_text(encoding='utf-8'))

    def test_native_answer_html_preserves_three_criteria(self):
        source = (b.CONTENT/'answers.md').read_text(encoding='utf-8')
        bullets = verify(source)
        folder = b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
        html, _ = prepare_html(b.documents(b.target_record())['antwoorden'], folder/f'{b.STEM} – antwoorden.md')
        soup = BeautifulSoup(html, 'html.parser')
        label = soup.find('strong', string='Beoordelingscriteria — een sterk antwoord:')
        self.assertIsNotNone(label)
        listing = label.find_parent('p').find_next_sibling()
        self.assertEqual(listing.name, 'ul')
        # Pandoc wraps HTML source lines; compare rendered textual whitespace.
        self.assertEqual([' '.join(item.get_text().split()) for item in listing.find_all('li')], [x.replace('**', '') for x in bullets])
        # Native print preparation wraps each h2 section in a separate container.
        self.assertEqual(' '.join(listing.find_next('h2').get_text().split()), 'Herhaling / Herhaling en interleaving')

    def test_old_missing_block_negative_fixture_is_rejected(self):
        with self.assertRaisesRegex(AssertionError, 'missing or duplicate'):
            verify(OLD_MISSING_BLOCK)

    def test_bad_position_count_and_coverage_are_rejected(self):
        source = (b.CONTENT/'answers.md').read_text(encoding='utf-8')
        verify(source)
        model, tail = source.split(LABEL)
        criteria, closing = tail.split(CLOSING)
        mutations = [
            model + CLOSING + LABEL + criteria + closing,
            model + LABEL + criteria + '- Extra criterium.\n- Vijfde criterium.\n' + CLOSING + closing,
            source.replace('5 naar 2', '2 naar 5'),
            source.replace('4 en 8', '4 en 4'),
        ]
        for mutation in mutations:
            with self.assertRaises(AssertionError):
                verify(mutation)

if __name__ == '__main__':
    unittest.main(verbosity=2)
