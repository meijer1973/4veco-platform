"""Exact §222 source, target, arithmetic and geometry probes; not acceptance."""
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from fractions import Fraction as F
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_222 as b


class Paragraph222Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.target=b.target_record()
        cls.docs=b.documents(cls.target)
        cls.assets=b.asset_sources()

    def test_exact_frozen_target_and_goals(self):
        self.assertEqual(self.target['record_status'],'candidate_review_ready')
        self.assertEqual(len(self.target['lesson_goals']),4)
        self.assertEqual([q['points'] for q in self.target['target_exercise']['subquestions']],[2,2,2,2,2,1])
        for goal in self.target['lesson_goals']:
            self.assertEqual(self.docs['paragraaf'].count(goal),1)
        for kind in ('paragraaf','opgaven'):
            target=self.docs[kind].split('## Doeloefening')[1].split('## Denkertje')[0]
            self.assertIn(self.target['target_exercise']['context'],target)
            for q in self.target['target_exercise']['subquestions']:
                self.assertEqual(target.count(q['prompt']),1)
            self.assertNotIn('_assets/',target)
            self.assertNotIn('<table',target)
        for answer in self.target['short_answer_model'].values():
            self.assertEqual(self.docs['antwoorden'].count(answer),1)

    def test_frozen_registry_tamper_fails_closed(self):
        with patch.object(b.json,'loads',return_value={'exercises':[{'id':'2.2.2','forged':True}]}):
            with self.assertRaisesRegex(ValueError,'Frozen target changed'):
                b.target_record()

    def test_exact_shared_exercise_route(self):
        self.assertEqual(self.docs['paragraaf'].split('## Uitgewerkt voorbeeld')[1],self.docs['opgaven'].split('## Uitgewerkt voorbeeld')[1])
        for kind in ('paragraaf','opgaven'):
            self.assertEqual(re.findall(r'^## (.+)$',self.docs[kind],re.M),b.HEADINGS)
            self.assertIn('Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.',self.docs[kind])
            recap=self.docs[kind].split('> **Onthouden**')[1].split('## Startopgaven')[0]
            self.assertEqual(len(re.findall(r'^> - ',recap,re.M)),5)
            for phrase in ('oude omzet moet positief','rond één uitgangsprijs','andere omstandigheden','omgekeerd','hele stap','Zonder kosten','§2.2.3'):
                self.assertIn(phrase,recap)
        for source in self.docs.values():
            self.assertEqual(re.findall(r'\*\*Opgave (\d+)\*\*',source),list(map(str,range(1,10))))
            self.assertNotIn('{{',source)
            self.assertNotRegex(source,r'(?m)^[a-z]\) ')
            self.assertNotRegex(source,r'\d[½.,\d]*\s*minut')
            self.assertNotRegex(source,r'Part [AB]|companion|https?://|website')

    def test_full_faded_local_and_interval_chain(self):
        source=self.docs['opgaven']
        worked=source.split('## Uitgewerkt voorbeeld')[1].split('> **Onthouden**')[0]
        for phrase in ('**€ 10 naar € 15**','**100 naar 60 tickets per week**','**1,5 × 0,6 = 0,9**','rond alle prijzen','**€ 900 per week**'):
            self.assertIn(phrase,worked)
        g1=source.split('**Opgave 3**')[1].split('**Opgave 4**')[0]
        self.assertIn('**stijgt TO**',g1)
        self.assertIn('Denk aan: lokaal / beide producten.',g1)
        self.assertIn(r'dat de vraag \_\_\_.',g1)
        self.assertIn(r'\_\_\_. Als oude',g1.replace('\n',' '))
        g2=source.split('**Opgave 4**')[1].split('## Zelfstandige oefening')[0]
        uncued=g2.split('e\\)')[1]
        self.assertNotIn('___',uncued)
        self.assertNotIn('Denk aan',uncued)
        self.assertIn('fotoclub',uncued)
        independent=source.split('## Zelfstandige oefening')[1].split('## Doeloefening')[0]
        self.assertIn('benefietvoorstelling',independent)
        self.assertIn('hele stap',independent)
        self.assertNotIn('TO =',independent)
        self.assertNotIn('_assets/',independent)
        self.assertNotIn('___',independent)

    def test_local_conditions_and_no_numeric_small_cutoff(self):
        theory=self.docs['paragraaf'].split('## Uitgewerkt voorbeeld')[0]
        for phrase in ('voldoende kleine prijsstijging','rond één uitgangsprijs','andere omstandigheden gelijk','geen algemeen percentage','niet automatisch lokaal','altijd beide omzetten rechtstreeks','**Fout:**','**Goed:**'):
            self.assertIn(phrase,theory)
        self.assertNotRegex(theory,r'puntelasticiteit|afgeleide|midpoint')
        self.assertIn('D25 concerns a different',self.target['missing_units_flagged'][0])

    def test_all_observed_calculations_exact_rational(self):
        # Every old/new revenue context: theory2, worked2+counterexample,
        # guided2+2+counterexample, independent2+counterexample, target2.
        rows=[
            ('toy',5,F(11,2),100,95,500,F(1045,2),F(9,2),F(-1,2)),
            ('coffee',5,F(11,2),100,80,500,440,-12,-2),
            ('pottery',10,11,100,95,1000,1045,F(9,2),F(-1,2)),
            ('comic',10,11,100,80,1000,880,-12,-2),
            ('concert',10,15,100,60,1000,900,-10,F(-4,5)),
            ('museum',4,F(22,5),100,95,400,418,F(9,2),F(-1,2)),
            ('laser',4,F(22,5),100,80,400,352,-12,-2),
            ('skate',10,11,100,95,1000,1045,F(9,2),F(-1,2)),
            ('badminton',10,9,100,120,1000,1080,8,-2),
            ('photo',2,3,10,6,20,18,-10,F(-4,5)),
            ('dance',10,12,200,180,2000,2160,8,F(-1,2)),
            ('puzzle',10,12,200,120,2000,1440,-28,-2),
            ('charity',20,30,100,60,2000,1800,-10,F(-4,5)),
            ('Nova',10,12,500,420,5000,5040,F(4,5),F(-4,5)),
            ('Stream',20,22,1000,800,20000,17600,-12,-2)]
        for name,p0,p1,q0,q1,to0,to1,pct,ev in rows:
            with self.subTest(name=name):
                self.assertEqual((p0*q0,p1*q1),(to0,to1))
                self.assertEqual(F(to1-to0,to0)*100,pct)
                self.assertEqual(F(q1-q0,q0)/F(p1-p0,p0),ev)
                self.assertEqual(F(p1,p0)*F(q1,q0),F(to1,to0))
        self.assertEqual(8*300,2400)
        self.assertEqual(F(2520-2400,2400)*100,5)
        self.assertEqual(F(50-40,40)*100,25)
        self.assertEqual(F(3,2)*F(3,5),F(9,10))
        self.assertNotEqual(F(3,2)*F(3,5),1+F(1,2)-F(2,5))

    def test_all_four_assets_and_exact_revenue_geometry(self):
        self.assertEqual(set(self.assets),{'2.2.2_fig_1','2.2.2_fig_2','2.2.2_fig_3','2.2.2_we_1'})
        self.assertEqual(set(re.findall(r'_assets/([^/)]+)\.svg','\n'.join(self.docs.values()))),set(self.assets))
        for name,source in self.assets.items():
            for el in ET.fromstring(source).iter():
                if el.tag.endswith('text'):
                    self.assertGreaterEqual(int(el.attrib['font-size']),22)
                if 'data-to' in el.attrib:
                    a=el.attrib
                    p,q,sx,sy,x,y=[float(a[k]) for k in ('data-p','data-q','data-sx','data-sy','data-origin-x','data-origin-y')]
                    self.assertEqual(float(a['data-to']),p*q)
                    self.assertAlmostEqual(float(a['width']),q*sx)
                    self.assertAlmostEqual(float(a['height']),p*sy)
                    self.assertAlmostEqual(float(a['x']),x)
                    self.assertAlmostEqual(float(a['y']),y-p*sy)
        for name in ('2.2.2_fig_2','2.2.2_we_1'):
            rects=[e.attrib for e in ET.fromstring(self.assets[name]).iter() if 'data-to' in e.attrib]
            self.assertEqual(len({(a['data-sx'],a['data-sy']) for a in rects}),1)
        self.assertIn('Geen vraagcurve gegeven',self.assets['2.2.2_we_1'])

    def test_schematic_has_all_directions_and_conditions(self):
        source=self.assets['2.2.2_fig_3']
        for phrase in ('P ↑  →  TO ↑','P ↑  →  TO ↓','P ↓  →  TO ↓','P ↓  →  TO ↑','rond één uitgangsprijs','andere omstandigheden gelijk','bereken TO vóór en na'):
            self.assertIn(phrase,source)
        self.assertNotIn('<path',source)

    def test_safe_paths_and_deterministic_sources(self):
        self.assertEqual(self.docs,b.documents(self.target))
        self.assertEqual(self.assets,b.asset_sources())
        for suffix in ('../r2','r2/other','r0','second','r2\\other'):
            with self.assertRaisesRegex(ValueError,'Proof suffix'):
                b.build(Path('nonexistent-output'),proof_suffix=suffix)

    def test_manifest_relocation_preserves_hashes_and_scope(self):
        from check_render import relocate_manifest
        old=Path('C:/old-pair/4veco-platform')
        original={'input_sources':[{'path':str(old/'build-scripts/content/book-2/b2_222.py'),'sha256':'abc'}],
                  'source_md':str(old.parent/'4veco-lessen/example.md'),
                  'unrelated':'C:/other-worktree/private.md','inspection_status':'PENDING'}
        new=relocate_manifest(original,b.ROOT.parent/'4veco-lessen')
        self.assertEqual(new['input_sources'][0]['sha256'],'abc')
        self.assertEqual(new['input_sources'][0]['path'],str(b.ROOT/'build-scripts/content/book-2/b2_222.py'))
        self.assertEqual(new['source_md'],str(b.ROOT.parent/'4veco-lessen/example.md'))
        self.assertEqual(new['unrelated'],original['unrelated'])
        self.assertEqual(new['inspection_status'],'PENDING')
        self.assertEqual(original['source_md'],str(old.parent/'4veco-lessen/example.md'))


if __name__=='__main__':
    unittest.main()
