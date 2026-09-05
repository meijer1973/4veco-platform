"""§212 metadata-only regression memory; not an independent acceptance gate."""
import hashlib
from pathlib import Path
import re
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_212 as b

BASE = '798cacfeeb40e4e0ba54d26f2b040cbdeec327a9'
ALTS = {
    '2.1.2_fig_1': 'Theater: totale opbrengst per avond bij 0 tot 30 bezoekers.',
    '2.1.2_fig_2': 'Theater: TO en TK op dezelfde assen; bij 10 bezoekers is de opbrengst lager dan de kosten.',
    '2.1.2_fig_3': 'Theater: break-even bij 20 bezoekers; links verlies en rechts winst binnen het model.',
    '2.1.2_fig_4': 'Theater: verticale winstafstand van 30 euro per avond bij 30 bezoekers, geen oppervlakte.',
    '2.1.2_ex_1': 'Zeep: TK en TO, break-even bij 3⅓ stukken en 8 euro verticale winstafstand bij 6 stukken per dag.',
    '2.1.2_ex_2': 'Bloempotten: assen en TK-lijn als steun voor het toevoegen van TO, break-even en winstafstand.',
    '2.1.2_ex_4': 'Minigolf: TK, TO, break-even en zones; verticale winstafstand bij 20 bezoekers per dag.',
    '2.1.2_ex_5': 'Bakkerij: TK en TO, break-even rond 714,29 broden en 200 euro verticale winstafstand bij 1.000 broden per maand.',
    '2.1.2_ex_6': 'Theatermodel: dezelfde winst van 30 euro per avond op verticale schalen tot 150 en 300 euro.',
}
TITLES = {
    '2.1.2_we_1': 'Kajakverhuur: TK, TO, break-even en verticale winstafstand per dag',
    '2.1.2_ex_1': 'Zeep: TK, TO, break-even en verticale winstafstand per dag',
    '2.1.2_ex_3': 'Bloempotten: TK, TO, break-even en verticale winstafstand per dag',
    '2.1.2_ex_4': 'Minigolf: TK, TO, break-even en verticale winstafstand per dag',
    '2.1.2_ex_5': 'Bakkerij: TK, TO, break-even en verticale winstafstand per maand',
}
SOURCES = ('theory.md', 'exercises.md', 'answers.md', 'target-answers.md')
IMAGE = re.compile(r'!\[([^\]]+)\]\(_assets/(2\.1\.2_(?:fig|we|ex)_\d+)\.svg\)(?:\{alt="([^"]+)"\})?')


def original(relative):
    return subprocess.check_output(['git', 'show', BASE + ':' + relative], cwd=b.ROOT).decode('utf-8')


def source_replacement(text):
    def replace(match):
        caption, name, alt = match.groups()
        assert alt is None
        return match.group() + ('{alt="' + ALTS[name] + '"}' if name in ALTS else '')
    return IMAGE.sub(replace, text)


def noun_first(value):
    return re.match(r'^(Theater|Zeep|Bloempotten|Minigolf|Bakkerij|Kajakverhuur|Theatermodel|Het volledige voorbeeld|Opgave)', value) is not None


class MetadataTests(unittest.TestCase):
    def test_nine_exact_native_insertions_and_unchanged_full_sources(self):
        count = 0
        for name in SOURCES:
            previous = original('build-scripts/content/book-2/212/' + name)
            actual = (b.CONTENT / name).read_text(encoding='utf-8')
            expected = source_replacement(previous)
            if name == 'answers.md':
                from test_bonus import insertion
                expected = insertion(expected)
            self.assertEqual(actual, expected, name)
            count += len(re.findall(r'\{alt="', actual))
        self.assertEqual(count, 9)

    def test_original_failing_alt_fixtures_remain_negative(self):
        lengths = {}
        for name in SOURCES:
            for caption, asset, _ in IMAGE.findall(original('build-scripts/content/book-2/212/' + name)):
                if asset in ALTS:
                    lengths[asset] = len(caption)
                    self.assertGreater(len(caption), 120)
        self.assertEqual(lengths, dict(zip(ALTS, (130,146,138,131,137,131,151,172,159))))

    def test_short_alts_functional_and_bounded(self):
        for name, value in ALTS.items():
            self.assertTrue(noun_first(value), name)
            self.assertLessEqual(len(value),120)
            self.assertGreater(len(value),30)
            self.assertNotIn(name,value)
        docs = b.documents(b.target_record())
        for text in docs.values():
            for caption, name, alt in IMAGE.findall(text):
                value = alt or caption
                self.assertLessEqual(len(value),120)
                self.assertTrue(noun_first(value), (name,value))
                if name in ALTS:
                    self.assertEqual(alt,ALTS[name])

    def test_five_context_titles_and_old_negative_fixtures(self):
        for name, source in b.asset_sources().items():
            title = ET.fromstring(source).find('{http://www.w3.org/2000/svg}title').text
            if name in TITLES:
                self.assertEqual(title,TITLES[name])
                self.assertFalse(noun_first(name + ': TK en TO'))
                self.assertTrue(noun_first(title))
                self.assertLessEqual(len(title),120)

    def test_unchanged_generator_outside_title_loop(self):
        previous = original('build-scripts/content/book-2/b2_212.py')
        current = Path(b.__file__).read_text(encoding='utf-8')
        start = '    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:'
        insertion = '    titles = {\n' + ''.join(f'        "{key}": "{value}",\n' for key,value in TITLES.items()) + '    }\n'
        expected = previous.replace(start,insertion+start).replace('name + ": TK en TO" if complete else "Bloempotten: alleen TK"', 'titles[name] if complete else "Bloempotten: alleen TK"')
        self.assertEqual(current,expected)


if __name__ == '__main__':
    unittest.main()
