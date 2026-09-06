"""HOW TO ADAPT: actual §214 source and pre-effect route probes.

Native successes are real external builds, not stubbed authorization successes.
Negative input fixtures derive from immutable Git blobs, never live hashes.
All disposable fixtures are restored, hash-checked and removed by their owner.
"""
from __future__ import annotations
import importlib.util
import json
import re
import sys
import tempfile
from fractions import Fraction as F
from pathlib import Path
from unittest.mock import patch
import unittest
import xml.etree.ElementTree as ET

sys.dont_write_bytecode = True
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_214 as b

LESSONS = b.ROOT.parent/"4veco-lessen"
NS = {"s":"http://www.w3.org/2000/svg"}


class SourceTests(unittest.TestCase):
    def setUp(self):
        self.record = b.target_record()
        self.docs = b.documents(self.record)
        self.assets = b.load_owned("figures").asset_sources()

    def test_whole_record_and_complete_target(self):
        record = self.record
        self.assertEqual(b.sha(json.dumps(record,ensure_ascii=False,separators=(",",":")).encode()),b.TARGET_SHA256)
        self.assertEqual([r["points"] for r in record["target_exercise"]["subquestions"]],[2,2,2,4,2,2])
        self.assertEqual(sum(r["points"] for r in record["target_exercise"]["subquestions"]),14)
        self.assertFalse(record["introduces_new_theory"])
        target = b.serialize_target(record)
        self.assertEqual(target.count(record["target_exercise"]["context"]),1)
        for row in record["target_exercise"]["sources"]:
            self.assertEqual(target.count(row["content"]),1)
            for cells in row.get("rows",[]):
                self.assertIn("| "+" | ".join(cells)+" |",target)
        for row in record["target_exercise"]["subquestions"]:
            self.assertEqual(self.docs["opgaven"].count(row["prompt"]),1)
        for model in record["short_answer_model"].values():
            self.assertEqual(self.docs["antwoorden"].count(model),1)
        for goal in record["lesson_goals"]:
            self.assertEqual(self.docs["opgaven"].count(goal),1)

    def test_source_architecture_and_fading(self):
        self.assertEqual(set(self.docs),{"opgaven","antwoorden"})
        pupil, answer = self.docs["opgaven"], self.docs["antwoorden"]
        self.assertEqual(re.findall(r"^## (.+)$",pupil,re.M),b.HEADINGS)
        self.assertEqual(pupil.count("!["),2)
        self.assertEqual(answer.count("!["),2)
        self.assertNotIn("{{",pupil+answer)
        self.assertIn("sluit het antwoordendocument en de herinneringsstrook",pupil)
        self.assertIn("bij opgave 1",pupil)
        self.assertIn("precies drie inhoudelijke criteria",answer)
        self.assertNotRegex(pupil,r"\b(PENDING|UNOBSERVED|Part A|mastery|diagnose)\b")
        for word in ["GCK", "GVK", "GTK", "TCK", "TVK", "GO", "MK", "MO"]:
            self.assertIn(word,pupil.split("## Doeloefening")[0])
        self.assertNotIn("afgeleide",pupil)

    def test_light_all_total_average_values(self):
        tk = lambda q:100+F(5,2)*q
        self.assertEqual((tk(20),tk(40)),(150,200))
        self.assertEqual([F(100,q) for q in [20,40]],[5,F(5,2)])
        self.assertEqual([F(tk(q)-100,q) for q in [20,40]],[F(5,2)]*2)
        self.assertEqual([F(tk(q),q) for q in [20,40]],[F(15,2),5])
        self.assertNotEqual(tk(20)*2,tk(40))
        self.assertNotEqual(F(tk(20),20)/2,F(tk(40),40))
        self.assertEqual(6*40,240)
        with self.assertRaises(ZeroDivisionError):F(0,0)

    def test_ceiling_not_floor_and_rounding_counterexample(self):
        q = F(100,1)/(6-F(5,2))
        self.assertEqual(q,F(200,7))
        self.assertEqual(6*q,F(1200,7))
        self.assertEqual([6*x-(100+F(5,2)*x) for x in [20,40,28,29]],[-30,40,-2,F(3,2)])
        self.assertEqual(round(q),29)
        # Prior taught counterexample: nearest can lose while the ceiling does not.
        self.assertEqual(round(F(10,3)),3)
        self.assertLess(3*3-10,0)
        self.assertGreaterEqual(3*4-10,0)

    def test_four_unequal_intervals_and_unknown_last_unit(self):
        q,tk,to = [0,20,40,45,55],[100,150,200,220,275],[0,120,240,270,330]
        dq = [q[i+1]-q[i] for i in range(4)]
        mk = [F(tk[i+1]-tk[i],dq[i]) for i in range(4)]
        mo = [F(to[i+1]-to[i],dq[i]) for i in range(4)]
        self.assertEqual(dq,[20,20,5,10])
        self.assertEqual(mk,[F(5,2),F(5,2),4,F(11,2)])
        self.assertEqual(mo,[6]*4)
        self.assertEqual([mo[i]-mk[i] for i in range(4)],[F(7,2),F(7,2),2,F(1,2)])
        self.assertEqual([to[i]-tk[i] for i in range(5)],[-100,-30,40,50,55])
        # Two internal TK54 values share endpoints yet imply different last units.
        self.assertNotEqual(275-270,275-272)
        self.assertNotEqual(F(275,55),F(275-220,55-45))
        self.assertNotEqual(F(55,55),F(55,10))
        self.assertIn("TK bij Q = 54 niet",self.docs["antwoorden"])

    def test_all_smoothbox_models_and_bounded_positive_growth(self):
        self.assertEqual(F(1200,5-2),400)
        self.assertEqual((5*700-(1200+2*700),F(2600,700)),(900,F(26,7)))
        q,tk,to = [700,800,900,1000],[2600,2900,3250,3650],[3500,4000,4500,5000]
        mk = [F(tk[i+1]-tk[i],q[i+1]-q[i]) for i in range(3)]
        self.assertEqual(mk,[3,F(7,2),4])
        self.assertEqual([F(to[i+1]-to[i],100) for i in range(3)],[5]*3)
        self.assertEqual([5-x for x in mk],[2,F(3,2),1])
        self.assertEqual([(5-x)*100 for x in mk],[200,150,100])
        self.assertEqual([to[i]-tk[i] for i in range(4)],[900,1100,1250,1350])
        self.assertGreater(5-2,max(5-x for x in mk))
        self.assertEqual(5*400-(1200+2*400),0)
        self.assertLess(5*399-(1200+2*399),0)
        self.assertGreater(5*401-(1200+2*401),0)
        self.assertNotEqual(1200+2*800,2900)

    def test_bonus_and_closing_complete_not_more_arithmetic(self):
        self.assertEqual([240-200,240-220,260-200,260-220],[40,20,60,40])
        self.assertEqual(F(220-170,40-20),F(5,2))
        self.assertEqual(F(260-130,40-20),F(13,2))
        self.assertEqual((200+20)-(150+20),200-150)
        self.assertEqual(F(220,45),F(44,9))
        self.assertEqual(F(220-200,45-40),4)
        self.assertNotEqual(F(20,45),4)
        self.assertNotEqual(F(20,45),F(44,9))

    def test_actual_svg_coordinates_labels_roles_fonts(self):
        for index,(name,source) in enumerate(self.assets.items(),1):
            root = ET.fromstring(source)
            self.assertEqual(root.attrib["viewBox"],"0 0 1200 1050")
            self.assertEqual(len(root.findall("s:polyline",NS)),2)
            self.assertEqual(len([e for e in root.findall("s:circle",NS) if e.attrib["data-role"].startswith("source-")]),10)
            self.assertEqual(len([e for e in root.findall("s:text",NS) if e.attrib["data-role"]=="source-point-label"]),10)
            for e in root.findall("s:text",NS):self.assertEqual(e.attrib["font-size"],"40px")
            self.assertGreaterEqual(40*72/96*(166/25.4*96/1200),12)
            if index%2:
                for cue in ["break-even\"", "positive-fastest-range", "W =", "BE ≈", "BE (", "Snelste positieve groei"]:
                    self.assertNotIn(cue,source)
            else:
                self.assertIn('data-role="range-open"',source)
                self.assertIn('data-role="range-closed"',source)
        smooth = ET.fromstring(self.assets["2.1.4_ex_3.svg"])
        curves = {e.attrib["data-role"]:e.attrib["points"] for e in smooth.findall("s:polyline",NS)}
        self.assertTrue(curves["curve-TO"].endswith("1040,150"))
        self.assertTrue(curves["curve-TK"].startswith("160,659.2"))

    def test_short_functional_alts_complete_caption(self):
        for md in self.docs.values():
            figures = re.findall(r'!\[([^\]]+)\]\([^\)]+\)\{alt="([^"]+)"\}',md)
            self.assertEqual(len(figures),2)
            for caption,alt in figures:
                self.assertLessEqual(len(alt),120)
                self.assertGreater(len(caption),len(alt))
                self.assertRegex(alt,r"^(Lichtservice|SmoothBox):")
                self.assertNotRegex(alt,r"^(Bekijk|Teken|Markeer|Gebruik)")

    def test_actual_font_ink_boxes_before_generation(self):
        from PIL import ImageFont
        font=ImageFont.truetype("C:/Windows/Fonts/arial.ttf",40)
        for name,source in self.assets.items():
            boxes=[]
            for t in ET.fromstring(source).findall("s:text",NS):
                anchor={"start":"ls","middle":"ms","end":"rs"}[t.attrib.get("text-anchor","start")]
                a,c,d,e=font.getbbox(t.text,anchor=anchor)
                x,y=float(t.attrib["x"]),float(t.attrib["y"])
                box=[x+a,y+c,x+d,y+e]
                with self.subTest(figure=name,text=t.text):
                    self.assertGreaterEqual(box[0],16);self.assertGreaterEqual(box[1],16)
                    self.assertLessEqual(box[2],1184);self.assertLessEqual(box[3],1034)
                boxes.append((t.text,box))
            for i,(text,a) in enumerate(boxes):
                for other,c in boxes[i+1:]:
                    with self.subTest(figure=name,labels=[text,other]):
                        self.assertFalse(a[0]<c[2]+4 and a[2]+4>c[0] and a[1]<c[3]+4 and a[3]+4>c[1])


class NativeEntryNegativeTests(unittest.TestCase):
    def test_immutable_real_missing_forged_and_synchronized_all_inputs_and_modules(self):
        # Capture actual committed bytes, verify live equality before constructing fixtures.
        committed = {}
        for name,commit,h in b.MODULES:
            original = b.git(b.ROOT,"show",commit+":"+name)
            self.assertEqual(b.sha(original),h)
            self.assertEqual(b.raw(b.ROOT/name),original)
            committed[("4veco-platform",name)] = original
        manifest = json.loads(committed[("4veco-platform",b.C+"214-inputs.json")])
        for row in manifest["inputs"]:
            root = b.ROOT if row["repository"] == "4veco-platform" else LESSONS
            original = b.git(root,"show",row["commit"]+":"+row["path"])
            self.assertEqual(b.sha(original),row["raw_sha256"])
            self.assertEqual(b.raw(root/row["path"]),original)
            committed[(row["repository"],row["path"])] = original
        deps = b.raw(b.SOURCE/"dependency-pins.json")
        committed[("4veco-platform","build-scripts/content/book-2/214/dependency-pins.json")] = deps
        for row in json.loads(deps)["files"]:
            original = b.git(b.ROOT,"show",b.BASE_PLATFORM+":"+row["path"])
            self.assertEqual(b.sha(original),row["raw_sha256"])
            committed[("4veco-platform",row["path"])] = original
        direct = b.load_owned("direct_print")
        with tempfile.TemporaryDirectory(prefix="book2-214-owned-neg-",dir="C:/wt" if sys.platform=="win32" else None) as directory:
            temp = Path(directory)
            roots = {name:temp/name for name in ["4veco-platform","4veco-lessen"]}
            for (repo,name),original in committed.items():
                p = b.data_path(roots[repo]/name);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(original)
            self.assertEqual(len(b.pure_local_gate(roots["4veco-lessen"],roots["4veco-platform"])[1]["inputs"]),48)
            proof = temp/"214-forbidden-output"
            def reject_all():
                for route in ["full","thin","direct"]:
                    with self.subTest(route=route), patch.object(b,"ROOT",roots["4veco-platform"]), \
                         patch.object(b.subprocess,"run",side_effect=AssertionError("subprocess before raw rejection")) as calls, \
                         patch.object(Path,"mkdir",side_effect=AssertionError("mkdir before rejection")) as mkdir, \
                         patch.object(Path,"write_bytes",side_effect=AssertionError("write before rejection")) as write, \
                         patch.object(Path,"write_text",side_effect=AssertionError("write before rejection")) as write_text, \
                         patch.object(Path,"unlink",side_effect=AssertionError("unlink before rejection")) as unlink, \
                         patch.object(Path,"rmdir",side_effect=AssertionError("rmdir before rejection")) as rmdir:
                        with self.assertRaises((ValueError,FileNotFoundError)):
                            if route == "direct":direct.direct(roots["4veco-lessen"],proof,"r99999")
                            elif route == "full":b.main(["--lessons-root",str(roots["4veco-lessen"]),"--proof-root",str(proof),"--proof-suffix","r99999"])
                            else:
                                scope={"__name__":"thin_test"}
                                exec(compile(b.wrapper_bytes(),"actual_thin_build_pdf.py","exec"),scope)
                                with patch.object(sys,"argv",["build_pdf.py","--platform-root",str(roots["4veco-platform"]),"--lessons-root",str(roots["4veco-lessen"]),"--proof-root",str(proof),"--proof-suffix","r99999"]):scope["main"]()
                        for effect in [calls,mkdir,write,write_text,unlink,rmdir]:effect.assert_not_called()
            for key,original in committed.items():
                p = b.data_path(roots[key[0]]/key[1])
                with self.subTest(kind="missing",path=key):p.unlink();reject_all();p.write_bytes(original)
                with self.subTest(kind="forged",path=key):p.write_bytes(original+b"\nFORGED\n");reject_all();p.write_bytes(original)
            manifest_path=b.data_path(roots["4veco-platform"]/(b.C+"214-inputs.json"))
            original_manifest=manifest_path.read_bytes()
            for i,row in enumerate(manifest["inputs"]):
                p=b.data_path(roots[row["repository"]]/row["path"]);original=p.read_bytes();forged=original+b"\nSYNC_DRIFT\n"
                altered=json.loads(original_manifest);altered["inputs"][i]["raw_sha256"]=b.sha(forged)
                altered["inputs"][i]["canonical_lf_sha256"]=b.sha(forged.decode().replace("\r\n","\n").replace("\r","\n").encode())
                with self.subTest(kind="synchronized-manifest-source",path=row["path"]):
                    p.write_bytes(forged);manifest_path.write_bytes(json.dumps(altered,ensure_ascii=False).encode());reject_all()
                    p.write_bytes(original);manifest_path.write_bytes(original_manifest)
            for field,value in [("inputs",[]),("inputs",manifest["inputs"][:-1]),("paragraph","2.3.2")]:
                altered=json.loads(original_manifest);altered[field]=value
                manifest_path.write_bytes(json.dumps(altered).encode());reject_all();manifest_path.write_bytes(original_manifest)
            for (repo,name),original in committed.items():self.assertEqual(b.raw(roots[repo]/name),original)
            self.assertFalse(proof.exists())
            print(json.dumps({"actual_routes":3,"unique_committed_fixture_files":len(committed),"missing_forged_cases":len(committed)*2*3,"synchronized_inputs":48*3,"partial_identity":9,"native_effects":0,"restored_all_fixture_bytes":True}))
        self.assertFalse(temp.exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
