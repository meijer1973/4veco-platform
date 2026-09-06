"""HOW TO ADAPT: fixed §224 native/content probes; no successful stubbed build.

Every negative changes real fixture bytes derived from immutable release data
and exercises the actual build entrypoint. Calls/writes/removals are tripwires,
not successful substitutes. Live accepted inputs are never modified.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from fractions import Fraction as F
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_224 as b

NS = {"s": "http://www.w3.org/2000/svg"}
LESSONS = b.ROOT.parent / "4veco-lessen"


class SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.record = b.target_record()
        cls.docs = b.documents(cls.record)
        cls.assets = b.asset_sources()

    def test_whole_target_hash_original_order(self):
        record = self.record
        self.assertEqual(b.sha(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()), b.TARGET_HASH)
        self.assertEqual([q["points"] for q in record["target_exercise"]["subquestions"]], [2, 2, 2, 4, 2, 2])
        self.assertEqual(len(record["lesson_goals"]), 4)
        self.assertFalse(record["introduces_new_theory"])

    def test_complete_target_serialization(self):
        value = b.serialize_target(self.record)
        target = self.record["target_exercise"]
        self.assertEqual(value.count(target["context"]), 1)
        for source in target["sources"]:
            self.assertEqual(value.count(source["content"]), 1)
            for row in source.get("rows", []):
                self.assertIn("| " + " | ".join(row) + " |", value)
            if "columns" in source:
                self.assertIn("| " + " | ".join(source["columns"]) + " |", value)
        for q in target["subquestions"]:
            self.assertEqual(value.count(q["prompt"]), 1)
        self.assertNotIn("![", value)

    def test_short_answers_goals_and_two_editions(self):
        self.assertEqual(set(self.docs), {"opgaven", "antwoorden"})
        for answer in self.record["short_answer_model"].values():
            self.assertEqual(self.docs["antwoorden"].count(answer), 1)
        for goal in self.record["lesson_goals"]:
            self.assertEqual(self.docs["opgaven"].count(goal), 1)
        self.assertEqual(re.findall(r"^## (.+)$", self.docs["opgaven"], re.M), b.HEADINGS)
        self.assertNotIn("{{", "".join(self.docs.values()))

    def test_all_rehearsal_points_support_and_bonus(self):
        before = self.docs["opgaven"].split("## Hulp bij", 1)[0]
        self.assertEqual([int(v) for v in re.findall(r"\*\*Vraag \d \((\d) punten\)", before)], [4, 4, 2, 2, 6, 2])
        for token in ["Alleen Y verandert", "Alleen Pc verandert", "Y en Pc veranderen", "224", "204", "220", "200"]:
            self.assertIn(token, self.docs["opgaven"].split("## Denkertje", 1)[1])
        self.assertIn("vier afzonderlijke criteria, elk 1 punt", self.docs["antwoorden"])
        self.assertIn("Bij vraag 6 en de volgende doeloefening kies je zelf de aanpak", self.docs["opgaven"])
        self.assertIn("iedereen", self.docs["opgaven"].lower())

    def test_exact_revenue_arithmetic_and_finite_counterexample(self):
        pct = lambda old, new: 100 * F(new - old, old)
        self.assertEqual((pct(100, 80), pct(20, 22)), (-20, 10))
        self.assertEqual(pct(100, 80) / pct(20, 22), -2)
        self.assertEqual((20*100,22*80,pct(2000,1760)), (2000,1760,-12))
        self.assertEqual((10*100,15*60,pct(1000,900)), (1000,900,-10))
        self.assertEqual(F(15,10)*F(60,100), F(9,10))
        self.assertNotEqual(F(15,10)*F(60,100), 1 + F(50-40,100))
        self.assertEqual((10*50000,12*43000), (500000,516000))
        self.assertEqual(pct(50000,43000)/pct(10,12), F(-7,10))

    def test_income_cross_sign_base_and_boundary_counterexamples(self):
        classify = lambda e: "inferieur" if e < 0 else "normaal" if 0 < e < 1 else "luxe" if e > 1 else None
        self.assertEqual([classify(e) for e in [F(-1,2),0,F(1,2),1,F(15,8)]], ["inferieur",None,"normaal",None,"luxe"])
        self.assertEqual(F(-10,20), F(-1,2))
        self.assertNotEqual(F(-10,20), F(-10,10))
        self.assertEqual(F(5,1)/F(25,2), F(2,5))
        self.assertNotEqual(F(2,5), F(5,2))
        self.assertNotEqual(F(80-100,100), F(80-100,80))
        self.assertEqual(100*F(20-25,25), -20)
        self.assertEqual(F(-5,10), F(-1,2))
        with self.assertRaises(ZeroDivisionError):
            F(-5,0)

    def test_annual_reset_coefficient_combined_counterexamples(self):
        q = lambda y, pc=20: 100 - 2*10 + pc + F(5,1000)*y
        self.assertEqual([q(20000),q(24000),q(20000,24),q(24000,24)], [200,220,204,224])
        self.assertEqual((q(24000)-q(20000))/q(20000) / F(4000,20000), F(1,2))
        self.assertNotEqual(F(1,2), F(5,1000))
        self.assertNotEqual(q(24000,24)-q(20000), q(24000)-q(20000))
        target = lambda y: 12000-400*12+F(1,10)*y+300*10
        self.assertEqual([target(40000),target(42000)], [14200,14400])
        self.assertNotEqual(target(F(40000,12)),14200)

    def test_assets_actual_geometry_fonts_and_role_separation(self):
        expected = [(20,100,22,80),(10,100,15,60)]*2
        for n, source in enumerate(self.assets.values()):
            root = ET.fromstring(source)
            self.assertEqual(root.attrib["viewBox"], "0 0 1200 900")
            self.assertEqual(root.find("s:title",NS).text, b.TITLES[n])
            self.assertLessEqual(len(b.TITLES[n]),120)
            for item in root.findall("s:text",NS):
                self.assertEqual(float(item.attrib["font-size"]),40)
            rectangles = [x for x in root.findall("s:rect",NS) if x.attrib.get("data-role")=="revenue"]
            self.assertEqual(len(rectangles),2)
            for row, origin, p, q in zip(rectangles,(100,700),expected[n][::2],expected[n][1::2]):
                self.assertEqual([float(row.attrib[k]) for k in ("x","y","width","height")], [origin,630-16*p,3*q,16*p])
            if n < 2:
                for cue in ["€2.000","€1.760","€1.000","€900","−12%","0,9","Ev","prijsinelastisch"]:
                    self.assertNotIn(cue,source)
        self.assertGreaterEqual(40*72/96 * (166/25.4*96/1200),12)

    def test_printed_target_boundary_language(self):
        answer = self.docs["antwoorden"]
        for token in ["Ei = 0 en Ei = 1 geen", "**kleine lokale**", "geen\nuniverseel percentage", "precies de twee", "geen periode", "niet door 12"]:
            self.assertIn(token,answer)
        pupil = self.docs["opgaven"]
        self.assertEqual(pupil.count("!["),2)
        self.assertNotRegex(pupil, r"(?i)\b(mastery|diagnose|PENDING|UNOBSERVED|Part A|53,5 minuten)\b")


class ReleaseNegativeTests(unittest.TestCase):
    def test_real_missing_forged_and_synchronized_34_inputs(self):
        original = (b.ROOT / b.RELEASE_PATH).read_bytes()
        manifest = json.loads(original)
        self.assertEqual(b.sha(original),b.RELEASE_HASH)
        with tempfile.TemporaryDirectory(prefix="b224-neg-", dir="C:/wt" if sys.platform == "win32" else None) as temporary:
            root = Path(temporary)
            roots = {name:root/name for name in ("4veco-platform","4veco-lessen")}
            for row in manifest["inputs"]:
                path = b.data_path(roots[row["repository"]]/row["path"])
                path.parent.mkdir(parents=True,exist_ok=True)
                path.write_bytes(b.data_path(b.ROOT.parent/row["repository"]/row["path"]).read_bytes())
            release = roots["4veco-platform"]/b.RELEASE_PATH
            release.parent.mkdir(parents=True,exist_ok=True)
            release.write_bytes(original)
            self.assertEqual(len(b.verify_current_release(roots["4veco-lessen"], roots["4veco-platform"])["inputs"]),34)

            def reject():
                with patch.object(b,"ROOT",roots["4veco-platform"]), \
                     patch.object(b.subprocess,"run",side_effect=AssertionError("subprocess before rejection")) as calls, \
                     patch.object(Path,"mkdir",side_effect=AssertionError("mkdir before rejection")) as mkdir, \
                     patch.object(Path,"write_text",side_effect=AssertionError("write before rejection")) as write, \
                     patch.object(Path,"unlink",side_effect=AssertionError("remove before rejection")) as remove:
                    with self.assertRaises((ValueError,FileNotFoundError)):
                        b.build(roots["4veco-lessen"],root/"native-proof",proof_suffix="r999")
                    for effect in (calls,mkdir,write,remove):
                        effect.assert_not_called()

            for number,row in enumerate(manifest["inputs"]):
                path = b.data_path(roots[row["repository"]]/row["path"])
                raw = path.read_bytes()
                with self.subTest(input=number,case="missing"):
                    path.unlink(); reject(); path.write_bytes(raw)
                forged = raw+b"\nFORGED NATIVE INPUT\n"
                with self.subTest(input=number,case="forged"):
                    path.write_bytes(forged); reject(); path.write_bytes(raw)
                with self.subTest(input=number,case="synchronized"):
                    changed=json.loads(original);changed["inputs"][number]["raw_sha256"]=b.sha(forged)
                    path.write_bytes(forged);release.write_text(json.dumps(changed),encoding="utf-8")
                    reject();path.write_bytes(raw);release.write_bytes(original)
            for case in ("empty","partial","forged actor","forged decision","forged commit"):
                with self.subTest(case=case):
                    changed=json.loads(original)
                    if case=="empty": changed["inputs"]=[]
                    elif case=="partial": changed["inputs"]=changed["inputs"][:-1]
                    elif case=="forged actor": changed["accountable_actor"]="author"
                    elif case=="forged decision": changed["decision"]="PENDING"
                    else: changed["inputs"][0]["commit"]="0"*40
                    release.write_text(json.dumps(changed),encoding="utf-8");reject();release.write_bytes(original)
            with self.subTest(case="missing manifest"):
                release.unlink();reject();release.write_bytes(original)
            self.assertFalse((root/"native-proof").exists())
            self.assertEqual(release.read_bytes(),original)


if __name__ == "__main__":
    unittest.main(verbosity=2)
