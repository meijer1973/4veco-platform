"""Bounded source/calculation/geometry checks, not independent acceptance."""
import re
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_221 as builder


class Paragraph221Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.target = builder.target_record()
        cls.docs = builder.documents(cls.target)
        cls.assets = builder.asset_sources()

    def test_frozen_goals_target_points_and_short_answers(self):
        self.assertEqual(len(self.target['lesson_goals']), 4)
        for goal in self.target['lesson_goals']:
            self.assertEqual(self.docs['paragraaf'].count(goal), 1)
        target = self.target['target_exercise']
        self.assertFalse(target.get('sources'))
        self.assertEqual([q['points'] for q in target['subquestions']], [3, 2, 2, 2])
        for kind in ('paragraaf', 'opgaven'):
            block = self.docs[kind].split('## Doeloefening\n', 1)[1].split('\n## ', 1)[0]
            self.assertIn(target['context'], block)
            for q in target['subquestions']:
                self.assertEqual(block.count(q['prompt']), 1)
            self.assertNotIn('<table', block)
            self.assertNotIn('_assets/', block)
        for answer in self.target['short_answer_model'].values():
            self.assertEqual(self.docs['antwoorden'].count(answer), 1)

    def test_shared_route_headings_numbering_recap(self):
        self.assertEqual(self.docs['paragraaf'].split('## Uitgewerkt voorbeeld', 1)[1], self.docs['opgaven'].split('## Uitgewerkt voorbeeld', 1)[1])
        for kind in ('paragraaf', 'opgaven'):
            self.assertEqual(re.findall(r'^## (.+)$', self.docs[kind], re.M), builder.HEADINGS)
            self.assertLess(self.docs[kind].index('> **Onthouden**'), self.docs[kind].index('## Startopgaven'))
        for source in self.docs.values():
            self.assertEqual(re.findall(r'\*\*Opgave (\d+)\*\*', source), list(map(str, range(1, 10))))
            self.assertNotRegex(source, r'(?m)^[a-z]\) ')
            self.assertIn('a\\) ', source)
            self.assertNotIn('{{', source)

    def test_printed_support_and_unscaffolded_independent_route(self):
        text = self.docs['opgaven']
        self.assertIn('Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.', text)
        self.assertIn('Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.', text)
        guided = text.split('## Begeleide inoefening')[1].split('## Zelfstandige oefening')[0]
        self.assertIn('Herinnering: procentuele verandering', guided)
        self.assertIn('Vergelijk procentuele reacties, niet aantallen.', guided)
        independent = text.split('## Zelfstandige oefening')[1].split('## Doeloefening')[0]
        self.assertNotIn('Ev = %', independent)
        self.assertNotIn('_assets/', independent)
        self.assertNotIn('https:', text)

    def test_review_corrections_misconception_box_and_five_point_recap(self):
        theory = self.docs['paragraaf'].split('## Uitgewerkt voorbeeld')[0]
        warning = theory.split('> **Let op — veelgemaakte fout**', 1)[1].split('\n\n', 1)[0]
        self.assertIn('**Fout:** “Ev = −2 is prijsinelastisch, want −2 < 1.”', warning)
        self.assertIn('**Goed:** |−2| = 2 > 1: prijselastisch.', warning)
        self.assertIn('Het minteken geeft tegengestelde richtingen aan.', warning)
        self.assertLess(theory.index('Let op — veelgemaakte fout'), theory.index('- **|Ev| < 1'))
        for kind in ('paragraaf', 'opgaven'):
            recap = self.docs[kind].split('> **Onthouden**', 1)[1].split('## Startopgaven')[0]
            self.assertEqual(len(re.findall(r'^> - ', recap, re.M)), 5)
            for phrase in ('oude waarde', 'Oude P en Qv moeten positief zijn',
                           'prijsverandering mag niet nul zijn', 'negatieve Ev betekent',
                           'tegengestelde richting', '§2.2.2'):
                self.assertIn(phrase, recap)

    def test_three_assets_every_reference_and_proportional_geometry(self):
        self.assertEqual(set(self.assets), {'2.2.1_fig_1', '2.2.1_fig_2', '2.2.1_we_1'})
        self.assertEqual(set(re.findall(r'_assets/([^/)]+)\.svg', '\n'.join(self.docs.values()))), set(self.assets))
        for value in self.assets.values():
            root = ET.fromstring(value)
            self.assertEqual(root.attrib['width'], '720')
            self.assertNotIn('<image', value)
            for e in root.iter():
                if e.tag.endswith('text'):
                    self.assertGreaterEqual(int(e.attrib['font-size']), 22)
                if 'data-value' in e.attrib:
                    n, scale, zero = (float(e.attrib[k]) for k in ('data-value', 'data-scale', 'data-zero'))
                    self.assertAlmostEqual(float(e.attrib['width']), abs(n)*scale)
                    self.assertAlmostEqual(float(e.attrib['x']), zero+min(0,n)*scale)

    def test_bar_values_and_shared_scales(self):
        def bars(name):
            return [e.attrib for e in ET.fromstring(self.assets[name]).iter() if 'data-value' in e.attrib]
        for name, expected, scales in [('2.2.1_fig_1', [10,-5,10,-20], [8,8,8,8]), ('2.2.1_fig_2', [.5,2], [115,115]), ('2.2.1_we_1', [25,-10,.4,1.5], [8,8,180,180])]:
            actual = bars(name)
            self.assertEqual([float(e['data-value']) for e in actual], expected)
            self.assertEqual([float(e['data-scale']) for e in actual], scales)
        self.assertIn('geen losse percentages', self.assets['2.2.1_we_1'])

    def test_all_calculations_exact_rational(self):
        for p0,p1,q0,q1,dp,dq,ev in [(10,11,100,95,10,-5,Fraction(-1,2)), (10,11,100,80,10,-20,-2), (8,10,200,180,25,-10,Fraction(-2,5)), (20,22,100,95,10,-5,Fraction(-1,2)), (5,6,200,140,20,-30,Fraction(-3,2)), (5,4,200,220,-20,10,Fraction(-1,2)), (10,12,400,280,20,-30,Fraction(-3,2)), (10,12,500,420,20,-16,Fraction(-4,5))]:
            p,q = Fraction(p1-p0,p0)*100, Fraction(q1-q0,q0)*100
            self.assertEqual((p,q,q/p), (dp,dq,ev))
        self.assertEqual(Fraction(25-20,20)*100,25)
        self.assertEqual(Fraction(20-25,25)*100,-20)

    def test_essential_dark_strokes_and_redundant_meaning(self):
        self.assertEqual((builder.BLUE,builder.INK), ('#1A5276','#182b3a'))
        for source in self.assets.values():
            self.assertNotIn('#E67E22',source)
        self.assertIn('url(#quantity)', self.assets['2.2.1_fig_1'])
        self.assertIn('prijsinelastisch', self.assets['2.2.1_fig_2'])
        self.assertIn('prijselastisch', self.assets['2.2.1_fig_2'])

    def test_bounded_explicit_table_geometry(self):
        tables = BeautifulSoup(self.docs['paragraaf'],'html.parser').find_all('table')
        self.assertEqual(len(tables),3)
        for table in tables:
            self.assertEqual(table['style'],'break-inside:avoid')
            self.assertEqual(sum(float(c['style'].split(':')[1].strip('%')) for c in table.find_all('col')),100)

    def test_reproducible_sources_and_safe_proof_suffix(self):
        self.assertEqual(self.docs,builder.documents(self.target))
        self.assertEqual(self.assets,builder.asset_sources())
        for suffix in ('../r2','r2/other','r0','second','r2\\other'):
            with self.assertRaisesRegex(ValueError,'Proof suffix'):
                builder.build(Path('nonexistent-output'),proof_suffix=suffix)

    def test_native_short_alternatives_preserve_full_visible_captions(self):
        # Exercise the actual installed Pandoc reader/writer, not a Markdown
        # regex that merely assumes alt= separates the caption from the alt.
        expected = [
            ('Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.',
             'Vergelijk de procentuele reacties op dezelfde schaal.'),
            ('Dezelfde absolute-waardeschaal; twee verschillende classificaties.',
             'Dezelfde absolute-waardeschaal; twee verschillende classificaties.'),
            ('Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev.',
             'Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev.'),
        ]
        for kind, pairs in [('paragraaf', expected), ('opgaven', expected[2:]), ('antwoorden', [])]:
            rendered = subprocess.run(['pandoc', '--from=markdown', '--to=html5'],
                input=self.docs[kind], text=True, encoding='utf-8', capture_output=True, check=True)
            soup = BeautifulSoup(rendered.stdout, 'html.parser')
            figures = soup.find_all('figure')
            self.assertEqual(len(figures), len(pairs))
            for figure, (alternative, caption) in zip(figures, pairs):
                self.assertEqual(figure.img['alt'], alternative)
                # Pandoc wraps text nodes; normalize whitespace only, retaining
                # every word and punctuation. Full HTML byte parity is checked
                # separately against the actual baseline in builder evidence.
                self.assertEqual(' '.join(figure.figcaption.get_text(' ', strip=True).split()), caption)
                self.assertLessEqual(len(alternative), 120)
                self.assertNotRegex(alternative, r'^(Vergelijk|Bekijk|Zie|Afbeelding van)\b')
        self.assertIn('){alt="' + expected[0][0] + '"}', self.docs['paragraaf'])

    def test_accessible_svg_titles_are_functional_noun_phrases(self):
        # Pin the language-specific noun-phrase choices; length alone would
        # incorrectly accept the original imperative first-figure title.
        expected = {
            '2.2.1_fig_1': 'Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal',
            '2.2.1_fig_2': 'Twee vergelijkbare absolute-waardeschalen met grens één',
            '2.2.1_we_1': 'De berekende Bowlpleinreactie en de gegeven klimhalratio, zonder verzonnen percentages',
        }
        for name, title in expected.items():
            self.assertEqual(ET.fromstring(self.assets[name]).find('{http://www.w3.org/2000/svg}title').text, title)
            self.assertLessEqual(len(title), 120)
            self.assertNotRegex(title, r'^(Vergelijk|Bekijk|Zie|Afbeelding van)\b')


if __name__ == '__main__':
    unittest.main()
