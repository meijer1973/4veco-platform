"""Bounded builder checks, explicitly not independent acceptance."""
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from fractions import Fraction as F
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_223 as builder


def compact(value):
    return re.sub(r'\s+', '', value)


def check_answer_d(test, value, frozen):
    """All assertions of frozen d, including its rounded display, not just a result."""
    test.assertIn('Qx oud=100−20+10+300=390', frozen)
    test.assertIn('Qx=420', frozen)
    test.assertIn('7,69%', frozen)
    test.assertIn('Ei=7,69%/10%=0,769', frozen)
    test.assertIn('normaal goed', frozen)
    test.assertIn('Qx stijgt met 30; Px en Pz blijven gelijk.', frozen)
    value = compact(value)
    for fragment in ('100−20+10+300=390', '100−20+10+330=420',
                     '(420−390)/390', '100/13%', '7,69%',
                     '(33.000−30.000)/30.000', '10%', '10/13', '0,77',
                     'normaalgoed', '30abonnementenpermaand', 'Px=10', 'Pz=20'):
        test.assertIn(fragment, value)
    # The source model's 0.769 is a rounded display, not a changed exact target.
    test.assertEqual(F(420-390,390)*100, F(100,13))
    test.assertEqual(F(33000-30000,30000)*100, 10)
    test.assertEqual(F(100,13)/10, F(10,13))
    test.assertEqual(round(float(F(10,13)),3), .769)
    test.assertEqual(round(float(F(10,13)),2), .77)


class Paragraph223Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.target = builder.target_record()
        cls.docs = builder.documents(cls.target)
        cls.assets = builder.asset_sources()

    def test_frozen_sources_goals_prompts_points_and_every_answer(self):
        self.assertEqual(len(self.target['lesson_goals']),4)
        for goal in self.target['lesson_goals']:
            self.assertEqual(self.docs['paragraaf'].count(goal),1)
        target = self.target['target_exercise']
        self.assertEqual([s['id'] for s in target['sources']],['inkomen','koffie','functie'])
        self.assertEqual([q['points'] for q in target['subquestions']],[3,2,4,4,3])
        for kind in ('paragraaf','opgaven'):
            block = self.docs[kind].split('## Doeloefening\n')[1].split('\n## ')[0]
            for literal in [target['context'],*[s['content'] for s in target['sources']],*[q['prompt'] for q in target['subquestions']]]:
                self.assertEqual(block.count(literal),1)
            self.assertNotIn('_assets/',block)
            for answer in self.target['short_answer_model'].values():
                self.assertNotIn(answer,block)
        for label,answer in self.target['short_answer_model'].items():
            if label != 'd':
                self.assertEqual(self.docs['antwoorden'].count(answer),1)
        check_answer_d(self,self.docs['antwoorden'],self.target['short_answer_model']['d'])

    def test_headings_numbering_shared_exercises_and_recap(self):
        self.assertEqual(self.docs['paragraaf'].split('## Uitgewerkt voorbeeld')[1],self.docs['opgaven'].split('## Uitgewerkt voorbeeld')[1])
        for kind,source in self.docs.items():
            self.assertEqual(re.findall(r'^## (.+)$',source,re.M),builder.HEADINGS if kind!='antwoorden' else builder.HEADINGS[1:])
            self.assertEqual(re.findall(r'\*\*Opgave (\d+)\*\*',source),list(map(str,range(1,13))))
            self.assertNotRegex(source,r'(?m)^[a-z]\) ')
            self.assertNotIn('{{',source)
            self.assertNotIn('Rubric',source)
            self.assertNotIn('Y-only',source)
            self.assertNotIn('kruiselingse',source)
        recap = self.docs['opgaven'].split('> **Onthouden**')[1].split('## Startopgaven')[0]
        self.assertEqual(len(re.findall(r'^> - ',recap,re.M)),5)
        for term in ('positief','niet nul','Ei<0','0<Ei<1','Ei>1','Ei=0 of 1','beide goederen','beginsituatie','gelijk','§2.2.4'):
            self.assertIn(term,recap)

    def test_support_fades_and_combined_change_is_independent(self):
        source = self.docs['opgaven']
        self.assertIn('Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.',source)
        self.assertIn('Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.',source)
        self.assertIn('Herinnering: procentuele verandering',source)
        g2 = source.split('**Opgave 4**')[1].split('**Opgave 5**')[0]
        self.assertIn('beginsituatie is uitgewerkt',g2)
        self.assertIn('(180−160)/160',g2)
        faded = source.split('**Opgave 5**')[1].split('## Zelfstandige')[0]
        for unsupported in ('200','220','205','0,5','Teller:','Noemer:','Stap','Herinnering'):
            self.assertNotIn(unsupported,faded)
        independent = source.split('## Zelfstandige oefening')[1].split('## Doeloefening')[0]
        for unsupported in ('Herinnering','Stap','Ei=','Ek=','180','184','0,56','Teller:','Noemer:'):
            self.assertNotIn(unsupported,independent)
        self.assertIn('215 in plaats van 200',independent)
        self.assertIn('Welke vergelijking is wel geschikt',independent)

    def test_exact_rational_arithmetic_every_context(self):
        for dy,dq,expected in [(10,15,F(3,2)),(10,-5,F(-1,2)),(10,5,F(1,2)),(10,-2,F(-1,5)),
                               (8,12,F(3,2)),(8,-4,F(-1,2)),(5,8,F(8,5)),(5,-2,F(-2,5)),(5,-3,F(-3,5))]:
            self.assertEqual(F(dq,dy),expected)
        for dp,dq,expected in [(20,10,F(1,2)),(20,-4,F(-1,5)),(20,-5,F(-1,4)),(10,5,F(1,2)),
                               (20,-8,F(-2,5)),(10,3,F(3,10)),(10,-4,F(-2,5)),(10,4,F(2,5)),(10,-6,F(-3,5))]:
            self.assertEqual(F(dq,dp),expected)
        for a,b,c,d,px,pz,y,y1,pz1,old,new,reset,ei in [
            (80,2,1,F(5,1000),20,10,30000,36000,14,200,230,204,F(3,4)),
            (90,2,F(1,2),F(5,1000),20,20,20000,24000,24,160,180,162,F(5,8)),
            (120,2,1,F(4,1000),15,10,25000,30000,15,200,220,205,F(1,2)),
            (90,2,1,F(5,1000),10,10,20000,24000,14,180,200,184,F(5,9)),
            (100,2,F(1,2),F(1,100),10,20,30000,33000,24,390,420,392,F(10,13))]:
            q = lambda yy,zz:a-b*px+c*zz+d*yy
            self.assertEqual((q(y,pz),q(y1,pz),q(y,pz1)),(old,new,reset))
            self.assertEqual(F(new-old,old)/F(y1-y,y),ei)
            for number in (old,new,reset):
                self.assertIn(str(number),self.docs['antwoorden']+self.docs['opgaven'])
        self.assertEqual((F(90-100,100)*100)/(F(12-10,10)*100),F(-1,2))
        self.assertEqual(60-2*8,44)
        self.assertEqual((40-2*5+10,40-2*5+12),(40,42))
        self.assertEqual((210-200)+(205-200),215-200)

    def test_four_assets_geometry_boundaries_and_actual_minimum_source_fonts(self):
        self.assertEqual(set(self.assets),{f'2.2.3_fig_{n}' for n in range(1,5)})
        self.assertEqual(set(re.findall(r'_assets/([^/)]+)\.svg','\n'.join(self.docs.values()))),set(self.assets))
        for source in self.assets.values():
            root = ET.fromstring(source)
            self.assertEqual(root.attrib['width'],'1000')
            self.assertNotIn('<image',source)
            for e in root.iter():
                if e.tag.endswith('text'):
                    self.assertGreaterEqual(float(e.attrib['font-size']),30)
                if 'data-value' in e.attrib:
                    n,scale,zero = (float(e.attrib[k]) for k in ('data-value','data-scale','data-zero'))
                    self.assertEqual(float(e.attrib['width']),abs(n)*scale)
                    self.assertEqual(float(e.attrib['x']),zero+min(0,n)*scale)
        bars = [e.attrib for e in ET.fromstring(self.assets['2.2.3_fig_1']).iter() if 'data-value' in e.attrib]
        self.assertEqual([float(e['data-value']) for e in bars],[10,15,10,-5,10,5])
        self.assertEqual({e['data-scale'] for e in bars},{'18'})
        self.assertEqual({e['data-zero'] for e in bars},{'540'})
        circles = [e.attrib for e in ET.fromstring(self.assets['2.2.3_fig_2']).iter() if e.tag.endswith('circle')]
        self.assertEqual([float(e['cx']) for e in circles if e['fill']=='white'],[365,635])
        self.assertIn('hier geen categorie',self.assets['2.2.3_fig_2'])
        for term in ('filmschijfhuur','beschermhoezen','digitale filmhuur','eigen prijzen'):
            self.assertIn(term,self.assets['2.2.3_fig_3'])
        for term in ('Y = 30.000','Y = 36.000','Pz = 14','Qx = 204','€ per jaar'):
            self.assertIn(term,self.assets['2.2.3_fig_4'])

    def test_tables_and_reproducibility(self):
        tables = BeautifulSoup(self.docs['paragraaf'],'html.parser').find_all('table')
        self.assertEqual(len(tables),4)
        for table in tables:
            self.assertEqual(sum(float(c['style'].split(':')[1].strip('%')) for c in table.find_all('col')),100)
        self.assertEqual(self.docs,builder.documents(self.target))
        self.assertEqual(self.assets,builder.asset_sources())
        for suffix in ('../r2','r0','r2/else','second'):
            with self.assertRaisesRegex(ValueError,'Proof suffix'):
                builder.build(Path('missing'),proof_suffix=suffix)

    def test_contrast_and_redundant_non_color_meaning(self):
        def luminance(hexcolor):
            channels=[int(hexcolor[n:n+2],16)/255 for n in (1,3,5)]
            values=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in channels]
            return sum(c*w for c,w in zip(values,(.2126,.7152,.0722)))
        for ink in (builder.INK,builder.BLUE):
            for background in ('#ffffff',builder.PALE):
                ratio=(luminance(background)+.05)/(luminance(ink)+.05)
                self.assertGreaterEqual(ratio,4.5)
        self.assertIn('url(#quantity)',self.assets['2.2.3_fig_1'])
        for source in self.assets.values():
            self.assertNotIn('#E67E22',source)


if __name__ == '__main__':
    unittest.main()
