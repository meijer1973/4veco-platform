"""Bounded source/target/geometry regressions; not independent content approval."""
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_211 as builder


class SourceContractTests(unittest.TestCase):
    def test_proof_revision_rejects_path_components_before_any_write(self):
        for value in ("../r2", "r2/other", "r0", "second", "r2\\other"):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "Proof suffix"):
                builder.build(Path("nonexistent-output"), proof_suffix=value)

    @classmethod
    def setUpClass(cls):
        cls.record = builder.target_record()
        cls.docs = builder.documents(cls.record)

    def test_exact_four_goals(self):
        self.assertEqual(len(self.record["lesson_goals"]), 4)
        for goal in self.record["lesson_goals"]:
            self.assertEqual(self.docs["paragraaf"].count(goal), 1)

    def test_target_exact_source_and_points(self):
        target = builder.serialize_target(self.record)
        self.assertEqual(sum(q["points"] for q in self.record["target_exercise"]["subquestions"]), 17)
        self.assertIn(self.record["target_exercise"]["context"], target)
        for q in self.record["target_exercise"]["subquestions"]:
            self.assertEqual(target.count(q["prompt"]), 1)
        self.assertEqual(target.count(" |  |  |"), 4)

    def test_canonical_exercise_source_shared(self):
        paragraph = self.docs["paragraaf"].split("## Uitgewerkt voorbeeld", 1)[1]
        standalone = self.docs["opgaven"].split("## Uitgewerkt voorbeeld", 1)[1]
        self.assertEqual(paragraph, standalone)
        for kind in ("paragraaf", "opgaven"):
            headings = re.findall(r"^## (.+)$", self.docs[kind], re.M)
            self.assertEqual(headings[-7:], builder.HEADINGS)
            self.assertEqual(re.findall(r"\*\*Opgave (\d+)\*\*", self.docs[kind]), list(map(str, range(1, 10))))

    def test_answer_coverage(self):
        answers = self.docs["antwoorden"]
        self.assertEqual(re.findall(r"\*\*Opgave (\d+)\*\*", answers), list(map(str, range(1, 10))))
        for answer in self.record["short_answer_model"].values():
            self.assertIn(answer, answers)

    def test_six_assets_and_every_reference(self):
        assets = builder.asset_sources()
        self.assertEqual(len(assets), 6)
        references = set(re.findall(r"_assets/([^/)]+)\.svg", "\n".join(self.docs.values())))
        self.assertEqual(references, set(assets))
        for source in assets.values():
            root = ET.fromstring(source)
            self.assertEqual(root.attrib["width"], "720")
            self.assertNotIn("<image", source)
            for element in root.iter():
                if element.tag.endswith("text"):
                    self.assertGreaterEqual(int(element.attrib["font-size"]), 20)

    def test_figures_add_one_relationship_at_a_time(self):
        assets = builder.asset_sources()
        self.assertNotIn("TVK", assets["2.1.1_fig_2"])
        a, b = assets["2.1.1_fig_3"].split("B. Voeg TK toe", 1)
        self.assertIn("TVK", a)
        self.assertNotIn(">TK ", a)
        self.assertIn(">TK 280", b)

    def test_numeric_models_independently_recomputed(self):
        for fixed, variable, q, expected in [
            (120, 2, 40, (120, 80, 200, 3, 2, 5)),
            (120, 2, 80, (120, 160, 280, 1.5, 2, 3.5)),
            (200, 2, 100, (200, 200, 400, 2, 2, 4)),
            (200, 2, 200, (200, 400, 600, 1, 2, 3)),
            (150, 1, 50, (150, 50, 200, 3, 1, 4)),
            (150, 1, 100, (150, 100, 250, 1.5, 1, 2.5)),
            (80, 2, 40, (80, 80, 160, 2, 2, 4)),
            (80, 2, 80, (80, 160, 240, 1, 2, 3)),
            (240, .6, 400, (240, 240, 480, .6, .6, 1.2)),
            (240, .6, 800, (240, 480, 720, .3, .6, .9)),
            (500, .8, 500, (500, 400, 900, 1, .8, 1.8)),
            (500, .8, 1000, (500, 800, 1300, .5, .8, 1.3)),
        ]:
            actual = (fixed, variable*q, fixed+variable*q, fixed/q, variable, fixed/q+variable)
            for value, answer in zip(actual, expected):
                self.assertAlmostEqual(value, answer)

    def test_reproducible_sources_and_assets(self):
        self.assertEqual(self.docs, builder.documents(self.record))
        self.assertEqual(builder.asset_sources(), builder.asset_sources())

    def test_source_letters_are_not_pandoc_auto_lists(self):
        for source in self.docs.values():
            self.assertNotRegex(source, r"(?m)^[a-z]\) ")
            self.assertIn("a\\) ", source)

    def test_target_table_retains_every_frozen_cell(self):
        target = self.docs["opgaven"].split("## Doeloefening", 1)[1]
        soup = BeautifulSoup(target, "html.parser")
        supplied = self.record["target_exercise"]["sources"][0]
        table = soup.table
        self.assertEqual([c.get_text() for c in table.find_all("th")], supplied["columns"])
        self.assertEqual([[c.get_text() for c in r.find_all("td")] for r in table.tbody.find_all("tr")], supplied["rows"])
        self.assertEqual([c["style"] for c in table.colgroup.find_all("col")], ["width:34%", "width:23%", "width:43%"])


if __name__ == "__main__":
    unittest.main()
