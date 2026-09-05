"""HOW TO ADAPT: independent §231 specification tests, including negative fixtures.
No production assets are written by this test suite. Generated SVG strings are inspected in memory.
"""
from __future__ import annotations
import argparse
from fractions import Fraction
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET
from PIL import ImageFont
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_231 as b

LESSON_ROOT = b.ROOT.parent / "4veco-lessen"
GOALS = [
    "Je kunt de gevraagde hoeveelheid bij een gegeven prijs uit een vraagfunctie berekenen.",
    "Je kunt consumentensurplus in een vraag-prijsgrafiek herkennen en arceren.",
    "Je kunt consumentensurplus als driehoeksoppervlakte berekenen.",
    "Je kunt consumentensurplus als het gezamenlijke voordeel van alle kopers van de verkochte kaartjes interpreteren.",
]
CASES = {
    "bookfair": (40, Fraction(1,2), 10, 60, 900),
    "museum": (30, 1, 10, 20, 200), "aquarium": (24,Fraction(1,2),8,32,256),
    "garden": (30,Fraction(1,2),10,40,400), "climbing": (24,Fraction(1,2),12,24,144),
    "boardgame": (20,Fraction(1,2),5,30,225), "skate": (36,Fraction(1,2),12,48,576),
    "cafe": (28,Fraction(1,2),14,28,196), "concert": (50,Fraction(1,2),20,60,900),
}
IMAGE = re.compile(r'!\[([^\]]+)\]\(([^)]+)\)\{([^}]+)\}')
NS = {"s": "http://www.w3.org/2000/svg"}

def images(markdown):
    found = []
    for caption, src, attrs in IMAGE.findall(markdown):
        alt = re.search(r'alt="([^"]+)"', attrs)
        if not alt or len(alt[1]) > 120 or not re.match(r"^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b", alt[1]):
            raise ValueError("Every actual image must have short noun-first alt")
        if len(caption) < 55 or "width=166mm" not in attrs:
            raise ValueError("Full caption and exact structural width required")
        stem = Path(src).stem
        if stem not in b.ASSETS:
            raise ValueError("Unplanned asset reference")
        found.append({"caption":caption,"src":src,"stem":stem,"alt":alt[1]})
    if len(found) != len(re.findall(r"!\[", markdown)):
        raise ValueError("Unvalidated image occurrence")
    return found

def bonus_criteria(markdown):
    bonus = markdown.split("## Denkertje / Bonusopgave\n",1)[1].split("## Herhaling / Herhaling en interleaving\n",1)[0]
    if bonus.count("**Beoordelingscriteria**") != 1:
        raise ValueError("Exactly one criteria label")
    model, criteria = bonus.split("**Beoordelingscriteria**")
    if "beide" not in criteria or "€ 12" not in criteria or len(re.findall(r"(?m)^- ",criteria)) != 3:
        raise ValueError("Exactly three precise criteria")
    if model.count("€ 12") < 2 or "De uitspraak klopt niet" not in model:
        raise ValueError("Coherent correct model must precede criteria")
    return bonus

def pixel_pairs(value):
    return [tuple(map(float,p.split(","))) for p in value.split()]

class SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.record=b.target_record()
        cls.docs=b.documents(cls.record)
        cls.raw={n:(b.CONTENT/n).read_text(encoding="utf-8") for n in ("theory.md","exercises.md","answers.md","target-answers.md")}
        js="const a=require("+json.dumps(str(b.CONTENT/"assets.js"))+");console.log(JSON.stringify({models:a.models,specs:a.specs,sources:a.sources()}));"
        cls.assets=json.loads(subprocess.check_output(["node","-e",js],cwd=b.ROOT,text=True,encoding="utf-8"))
        cls.font=ImageFont.truetype("C:/Windows/Fonts/arial.ttf",40)

    def test_frozen_goals_target_and_scoring(self):
        self.assertEqual(self.record["lesson_goals"],GOALS)
        self.assertEqual([q["points"] for q in self.record["target_exercise"]["subquestions"]],[2,3,2,3,2])
        for goal in GOALS:self.assertEqual(self.docs["paragraaf"].count(goal),1)
        for kind in ("paragraaf","opgaven"):
            target=self.docs[kind].split("## Doeloefening\n")[1].split("## Denkertje")[0]
            self.assertIn(self.record["target_exercise"]["context"],target)
            for q in self.record["target_exercise"]["subquestions"]:self.assertIn(q["prompt"],target)
            self.assertNotIn("![",target)
        for text in self.record["short_answer_model"].values():self.assertIn(text,self.docs["antwoorden"])
        self.assertIn("**Puntenverdeling — maximaal 12**",self.docs["antwoorden"])

    def test_exact_headings_route_and_recap(self):
        for kind in ("paragraaf","opgaven"):
            text=self.docs[kind]
            self.assertEqual(re.findall(r"(?m)^## (.+)$",text),b.HEADINGS)
            self.assertIn("Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.",text)
            self.assertIn("Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.",text)
            between=text.split("## Uitgewerkt voorbeeld\n")[1].split("## Startopgaven")[0]
            self.assertEqual(len(re.findall(r"(?m)^> - ",between)),5)
            self.assertLess(between.index("CS = ½ × basis"),between.index("> **Samenvatting"))
            self.assertNotIn("\n## ",between)
        self.assertEqual(sum([2,9,7,2,4,3,8,7,10]),52)
        self.assertEqual(52+12,64)
        self.assertEqual((64+8+4,64+10+6),(76,80))

    def test_all_task_numbers_and_no_device_or_time_metadata(self):
        for text in self.docs.values():
            self.assertEqual([int(n) for n in re.findall(r"\*\*Opgave (\d+)",text)],list(range(1,12)))
            self.assertNotRegex(text,r"(?i)\b(website|laptop|tablet|companion|Part A|Part B|scaffold level|minuten|diagnose|beheersingsscore)\b")

    def test_fading_and_independent_surfaces(self):
        ex=self.raw["exercises.md"]
        for number, expected in [(2,["2.3.1_ex_1"]),(3,["2.3.1_ex_2"]),(4,["2.3.1_ex_3"]),(5,[]),(6,[]),(7,[])]:
            body=ex.split(f"**Opgave {number} —",1)[1].split("**Opgave ",1)[0]
            self.assertEqual([i["stem"] for i in images(body)],expected)
        independent=ex.split("## Zelfstandige oefening\n")[1].split("## Doeloefening")[0]
        self.assertNotRegex(independent,r"(½|Stap [1-9]|hint|Vul aan|Controle:)")
        self.assertIn("alleen de assen en de vraaglijn",ex)
        self.assertIn("0,5Q = …",ex)
        self.assertIn("Korte controle achteraf",ex)

    def test_every_actual_alt_caption_and_union(self):
        union=set()
        counts={}
        for kind,text in self.docs.items():
            refs=images(text);counts[kind]=len(refs);union.update(i["stem"] for i in refs)
            allowed=set(b.ASSETS[:8]) if kind!="antwoorden" else set(b.ASSETS[8:])
            self.assertTrue(set(i["stem"] for i in refs)<=allowed)
        self.assertEqual(union,set(b.ASSETS))
        self.assertEqual(counts,{"paragraaf":8,"opgaven":4,"antwoorden":7})
        good=next(iter(IMAGE.findall(self.docs["paragraaf"])))
        sample=f'![{good[0]}]({good[1]}){{alt="{"x"*121}" width=166mm}}'
        with self.assertRaises(ValueError):images(sample)
        with self.assertRaises(ValueError):images(sample.replace("x"*121,"Hier zie je een grafiek."))

    def test_discrete_and_model_boundary(self):
        theory=self.raw["theory.md"]
        for phrase in ["Vier afzonderlijke bedragen leveren geen doorlopende rechte lijn op",
                       "niet de exacte optelling", "terwijl alle andere omstandigheden gelijk blijven",
                       "Alle 60 gevraagde kaartjes", "hoogste betalingsbereidheid",
                       "niet een berekende evenwichtshoeveelheid","geen negatief surplus","40 − 10 = 30"]:
            self.assertIn(phrase,theory)
        self.assertEqual(sum(v-10 for v in [18,14,10]),12)
        self.assertEqual(sum(v-6 for v in [14,10,6]),12)
        self.assertEqual(sum(v-6 for v in [18,14,10]),24)
        self.assertEqual(sum(v-9 for v in [12,9]),3)

    def test_bonus_model_then_exact_three_criteria_and_negative_fixtures(self):
        text=self.raw["answers.md"];bonus_criteria(text)
        for mutated in [text.replace("**Beoordelingscriteria**",""),
                        text.replace("- Geeft een begrensde conclusie","- Extra criterium.\n- Geeft een begrensde conclusie"),
                        text.replace("De uitspraak klopt niet","De uitspraak klopt wel"),
                        text.replace("**Beoordelingscriteria**","**Beoordelingscriteria**\n**Beoordelingscriteria**")]:
            with self.assertRaises((ValueError,IndexError)):bonus_criteria(mutated)

    def test_all_model_calculations_independent_fractions(self):
        for key,(a,slope,p,q,cs) in CASES.items():
            model=self.assets["models"][key]
            self.assertEqual((model["a"],Fraction(str(model["b"])),model["p"]),(a,slope,p))
            self.assertEqual((a-p)/slope,q)
            self.assertEqual(Fraction(1,2)*q*(a-p),cs)
            self.assertEqual(a-slope*q,p)
        self.assertEqual(60*20,1200)
        self.assertEqual(Fraction(1,2)*60*(50+20)-1200,900)

    def test_actual_native_name_regex_all30(self):
        script=r"""const fs=require('fs');const s=fs.readFileSync('scripts/validate-paragraph.js','utf8');const a=s.indexOf('  const SURFACE_SUFFIX_SRC =');const z=s.indexOf('  for (const base of referencedBases)',a);if(a<0||z<a)throw Error('native grammar missing');const r=new Function('parNr',s.slice(a,z)+';return assetPattern;')('2.3.1');const names=JSON.parse(process.argv[1]);if(!names.every(n=>r.test(n)))throw Error('Invalid native name');console.log(r.toString());"""
        names=[s+ext for s in b.ASSETS for ext in [".svg",".png"]]
        output=subprocess.check_output(["node","-e",script,json.dumps(names)],cwd=b.ROOT,text=True)
        self.assertIn("fig|ex|we|mc|news",output);self.assertEqual(len(set(names)),30)

    def test_actual_svg_labels_canvas_all_ink_boxes(self):
        for stem,svg in self.assets["sources"].items():
            root=ET.fromstring(svg)
            self.assertEqual(root.attrib["viewBox"],"0 0 1200 900")
            self.assertTrue(root.find("s:title",NS).text)
            self.assertTrue(root.find("s:desc",NS).text)
            for item in root.findall(".//s:text",NS):
                self.assertEqual(item.attrib["font-size"],"30pt")
                self.assertEqual(item.attrib["font-family"],"Arial")
                self.assertEqual(item.attrib["font-weight"],"400")
                self.assertNotIn("transform",item.attrib)
                self.assertNotIn("textLength",item.attrib)
                x,y=float(item.attrib["x"]),float(item.attrib["y"])
                left,top,right,bottom=self.font.getbbox(item.text,anchor="ls")
                shift={"middle":right/2,"end":right}.get(item.attrib.get("text-anchor"),0)
                self.assertTrue(x+left-shift>=0 and x+right-shift<=1200, (stem,item.text,"horizontal clipping"))
                self.assertTrue(y+top>=0 and y+bottom<=900,(stem,item.text,"vertical clipping"))
            dest=LESSON_ROOT/b.LESSON_REL/"_assets"/(stem+".svg")
            if dest.exists():self.assertEqual(dest.read_text(encoding="utf-8"),svg)

    def test_actual_svg_economic_geometry_and_roles(self):
        for spec in self.assets["specs"]:
            root=ET.fromstring(self.assets["sources"][spec["stem"]])
            nodes={n.attrib["id"]:n for n in root.iter() if "id" in n.attrib}
            if spec["model"]=="discrete":
                for i,v in enumerate([18,14,10,6],1):
                    self.assertEqual(float(nodes[f"wtp-{i}"].attrib["y"]),650-22.5*v)
                self.assertNotIn("gap-3",nodes);self.assertNotIn("gap-4",nodes)
                continue
            a,slope,p,q,cs=CASES[spec["model"]];qmax=a/slope
            x=lambda value:160+880*float(value/qmax)
            y=lambda value:650-450*float(value/a)
            for name,expect in [("p-intercept",(160,200)),("q-intercept",(1040,650))]:
                self.assertAlmostEqual(float(nodes[name].attrib["cx"]),expect[0],places=5)
                self.assertAlmostEqual(float(nodes[name].attrib["cy"]),expect[1],places=5)
            stage=spec["stage"]
            if stage=="axes":self.assertNotIn("demand",nodes)
            else:
                d=nodes["demand"]
                self.assertEqual(tuple(float(d.attrib[k]) for k in ("x1","y1","x2","y2")),(160,200,1040,650))
            if stage in ("axes","line"):
                self.assertNotIn("price",nodes);self.assertNotIn("cs-fill",nodes)
            else:
                intersection=nodes["price-intersection"]
                self.assertAlmostEqual(float(intersection.attrib["cx"]),x(q),places=5)
                self.assertAlmostEqual(float(intersection.attrib["cy"]),y(p),places=5)
            if stage in ("cs","guided","payment"):
                actual=pixel_pairs(nodes["cs-fill"].attrib["points"])
                expected=[(160,200),(160,y(p)),(x(q),y(p))]
                for point,want in zip(actual,expected):
                    for observed,target in zip(point,want):self.assertAlmostEqual(observed,target,places=5)
            elif stage=="price":self.assertNotIn("cs-fill",nodes)

    def test_authority_guard_rejects_each_changed_pin_before_processes(self):
        b.authorize(LESSON_ROOT)
        pins=b.authority_pins(LESSON_ROOT)
        real_lf,real_raw=b.lf_hash,b.digest
        for bad,_,contract in pins:
            def fake_lf(path):return "0"*64 if Path(path)==bad else real_lf(path)
            def fake_raw(path):return "0"*64 if Path(path)==bad else real_raw(path)
            with patch.object(b,"lf_hash",side_effect=fake_lf),patch.object(b,"digest",side_effect=fake_raw),patch.object(b.subprocess,"run") as process:
                with self.assertRaises(ValueError):b.authorize(LESSON_ROOT)
                process.assert_not_called()
        with patch.object(b.json,"loads",return_value={"exercises":[{"id":"2.3.1","changed":True}]}):
            with self.assertRaises(ValueError):b.target_record()

    def test_no_false_predecessor_acceptance_or_changed_plan(self):
        names=[str(p) for p,_,_ in b.authority_pins(LESSON_ROOT)]
        self.assertFalse(any("2.1.3" in p or "handoff" in p for p in names))
        self.assertEqual(b.lf_hash(LESSON_ROOT/b.LESSON_REL/"2.3.1-textbook-plan.md"),b.PLAN_HASH)
        self.assertIn("historical", (b.ROOT/b.GRANT_PATH).read_text(encoding="utf-8"))

    def test_print_margin_guard_rejects_body_in_footer_and_false_footer(self):
        from check_render import print_role
        import fitz
        page=fitz.Rect(0,0,595.276,841.89)
        self.assertEqual(print_role({"bbox":(70,70,200,90),"text":"Body"},page,"Title",2,14),"body")
        self.assertEqual(print_role({"bbox":(70,806,200,820),"text":"Title"},page,"Title",2,14),"footer")
        for value in ("Body continuation","Wrong title","2 / 13"):
            with self.assertRaises(ValueError):print_role({"bbox":(70,806,200,820),"text":value},page,"Title",2,14)

    def test_fresh_revision_and_immutable_attempt_guards(self):
        with tempfile.TemporaryDirectory(prefix="book2-231-revision-test-") as tmp:
            root=Path(tmp);proof=root/"proof";evidence=root/"evidence"
            proof.mkdir();evidence.mkdir()
            m=evidence/f"{b.PREFIX}-build-manifest-r1.json"
            attempt=b.reserve_attempt(root,proof,"r1",m)
            before=attempt.read_bytes()
            self.assertEqual(b.next_revision(proof,evidence),"r2")
            with self.assertRaises(ValueError):b.reserve_attempt(root,proof,"r1",m)
            self.assertEqual(attempt.read_bytes(),before)
            (proof/"231-opgaven-deadbeef0000-r2").mkdir()
            self.assertEqual(b.next_revision(proof,evidence),"r3")
            with self.assertRaises(ValueError):b.reserve_attempt(root,proof,"r2",evidence/f"{b.PREFIX}-build-manifest-r2.json")

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--lesson-root",type=Path,default=LESSON_ROOT)
    args,remaining=parser.parse_known_args();LESSON_ROOT=args.lesson_root.resolve()
    unittest.main(argv=[sys.argv[0],*remaining],verbosity=2)
