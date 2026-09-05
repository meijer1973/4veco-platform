"""Builder regressions; no independent review acceptance is supplied here."""
from fractions import Fraction as F
from pathlib import Path
import re
import sys
import unittest
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_212 as b


def contrast(a,c):
    def lum(s):
        rgb=[int(s[i:i+2],16)/255 for i in (1,3,5)]
        rgb=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
        return sum(v*w for v,w in zip(rgb,(.2126,.7152,.0722)))
    lo,hi=sorted((lum(a),lum(c)))
    return (hi+.05)/(lo+.05)


class SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.r=b.target_record(); cls.docs=b.documents(cls.r); cls.assets=b.asset_sources()

    def test_unsafe_proof_suffix_before_write(self):
        for value in ('../r2','r2/other','r0','second','r2\\other'):
            with self.subTest(value=value),self.assertRaisesRegex(ValueError,'Proof suffix'):
                b.build(Path('nonexistent-output'),proof_suffix=value)

    def test_frozen_target_goals_points_answers(self):
        self.assertEqual(len(self.r['lesson_goals']),4)
        for g in self.r['lesson_goals']:
            self.assertEqual(self.docs['paragraaf'].count(g),1)
        self.assertEqual([q['points'] for q in self.r['target_exercise']['subquestions']],[2,2,3,4])
        for kind in ('paragraaf','opgaven'):
            target=self.docs[kind].split('## Doeloefening',1)[1].split('## Denkertje',1)[0]
            self.assertEqual(target.count(self.r['target_exercise']['context']),1)
            for q in self.r['target_exercise']['subquestions']:
                self.assertEqual(target.count(q['prompt']),1)
        for answer in self.r['short_answer_model'].values():
            self.assertIn(answer,self.docs['antwoorden'])

    def test_single_exercise_source_and_headings(self):
        self.assertEqual(self.docs['paragraaf'].split('## Uitgewerkt voorbeeld',1)[1],self.docs['opgaven'].split('## Uitgewerkt voorbeeld',1)[1])
        for kind in ('paragraaf','opgaven'):
            self.assertEqual(re.findall(r'^## (.+)$',self.docs[kind],re.M)[-7:],b.HEADINGS)
            self.assertNotRegex(self.docs[kind],r'(?mi)^## (samenvatting|website|voorkennis|opgaven)$')
        for source in self.docs.values():
            self.assertEqual(re.findall(r'\*\*Opgave (\d+)\*\*',source),list(map(str,range(1,10))))

    def test_no_letter_drift_or_online_dependencies(self):
        for source in self.docs.values():
            self.assertNotRegex(source,r'(?m)^[a-z]\) ')
            self.assertIn('a\\) ',source)
            self.assertNotRegex(source,r'(?i)(https?://|Part A|Part B|companion|website|QR-code|online)')

    def test_eleven_assets_and_no_answer_leakage(self):
        self.assertEqual(set(self.assets),{*(f'2.1.2_fig_{i}' for i in range(1,5)),'2.1.2_we_1',*(f'2.1.2_ex_{i}' for i in range(1,7))})
        self.assertEqual(set(re.findall(r'_assets/([^/)]+)\.svg','\n'.join(self.docs.values()))),set(self.assets))
        for kind in ('paragraaf','opgaven'):
            for n in (3,4,5):
                self.assertNotIn(f'_assets/2.1.2_ex_{n}.svg',self.docs[kind])
            self.assertNotIn('_assets/',self.docs[kind].split('## Zelfstandige oefening')[1].split('## Denkertje')[0])

    def test_font_and_contrast(self):
        for color in (b.COST,b.BLUE,b.INK):
            self.assertGreaterEqual(contrast(color,b.BG),4.5)
        self.assertLess(contrast(b.ORANGE,b.BG),3)
        for name,source in self.assets.items():
            root=ET.fromstring(source); self.assertEqual(root.attrib['width'],'1500' if name=='2.1.2_ex_6' else '1000')
            self.assertNotIn('<image',source)
            for e in root.iter():
                if e.tag.endswith('text'):
                    self.assertEqual(e.attrib['font-size'],'30pt'); self.assertNotEqual(e.attrib['fill'],b.ORANGE)
            if b.ORANGE in source:
                self.assertIn(f'stroke="{b.COST}" stroke-width="9"',source)

    def test_progressive_graphs(self):
        self.assertNotIn('>TK<',self.assets['2.1.2_fig_1'])
        self.assertNotIn('>BE<',self.assets['2.1.2_fig_2'])
        self.assertIn('>BE<',self.assets['2.1.2_fig_3'])
        self.assertNotIn('>€ 30<',self.assets['2.1.2_fig_3'])
        self.assertIn('>€ 30<',self.assets['2.1.2_fig_4'])
        self.assertNotIn('>TO<',self.assets['2.1.2_ex_2'])
        self.assertNotIn('>BE<',self.assets['2.1.2_ex_2'])

    def test_exact_arithmetic_geometry(self):
        cases=[(60,2,5,30,F(20),30),(20,1,7,6,F(10,3),16),(10,1,4,6,F(10,3),8),(15,1,4,8,F(5),9),(40,1,4,20,F(40,3),20),(500,F(4,5),F(3,2),1000,F(5000,7),200)]
        for fixed,var,price,q,qbe,profit in cases:
            self.assertEqual(F(fixed)/(price-var),qbe)
            self.assertEqual(price*qbe,fixed+var*qbe)
            self.assertEqual(price*q-fixed-var*q,profit)
            first=-(-qbe.numerator//qbe.denominator)
            self.assertGreaterEqual(price*first-fixed-var*first,0)
            self.assertLess(price*(first-1)-fixed-var*(first-1),0)
        self.assertEqual(F(3,2)*714-500-F(4,5)*714,F(-1,5))
        self.assertEqual(F(3,2)*715-500-F(4,5)*715,F(1,2))
        for name,qmax,ymax,qbe,price in [('2.1.2_ex_5',1000,1600,F(5000,7),F(3,2)),('2.1.2_we_1',6,50,F(10,3),7)]:
            point=ET.fromstring(self.assets[name]).find('.//{http://www.w3.org/2000/svg}circle')
            self.assertAlmostEqual(float(point.attrib['cx']),150+float(qbe)/qmax*620,places=3)
            self.assertAlmostEqual(float(point.attrib['cy']),445-float(price*qbe)/ymax*330,places=3)

    def test_other_arithmetic_and_timing(self):
        self.assertEqual((12+3*2,18/2,8*2-(12+3*2)),(18,9,-2))
        self.assertEqual([p*10-(fixed+10) for p,fixed in [(5,20),(6,20),(5,30),(6,30)]],[20,30,10,20])
        self.assertEqual((24,3*6,24+3*6,(24+3*6)/6),(24,18,42,7))
        self.assertEqual(2+14+8+2+6+10+12,54); self.assertEqual(54+13+6+4,77)

    def test_repeatable(self):
        self.assertEqual(self.docs,b.documents(self.r)); self.assertEqual(self.assets,b.asset_sources())


if __name__=='__main__':
    unittest.main()
