"""Independent arithmetic, complete-target and concrete paper/figure guards.
HOW TO ADAPT: extend specific counterexamples, never weaken source custody.
"""
from pathlib import Path
from fractions import Fraction as F
import hashlib
import json
import re
import sys
import unittest
import xml.etree.ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_232 as b

def images(md):
    return [{'caption':c,'stem':Path(p).stem,'alt':a} for c,p,a in re.findall(r'!\[([^\]]+)\]\(([^)]+)\)\{alt="([^"]+)" width=166mm\}',md)]

def verify_content(docs,record,spec):
    for kind,text in docs.items():
        if re.findall(r'(?m)^## (.+)$',text)!=b.HEADINGS:raise ValueError('Seven-stage route')
        if [int(x) for x in re.findall(r'\*\*Opgave (\d+)',text)]!=list(range(1,12)):raise ValueError('Complete task sequence')
        if len(images(text))!={'paragraaf':11,'opgaven':5,'antwoorden':5}[kind]:raise ValueError('Edition assets')
        if any(len(i['alt'])>120 or i['alt']==i['caption'] or re.match(r'(Teken|Bereken|Kijk|Arceer|Markeer)\b',i['alt']) for i in images(text)):raise ValueError('Functional short alt')
        for image in images(text):
            original=next(s for s in spec['specs'] if s['stem']==image['stem'])
            if image['caption']!=original['caption'] or image['alt']!=original['alt']:raise ValueError('Full caption/alt identity')
    for goal in record['lesson_goals']:
        if docs['paragraaf'].count(goal)!=1:raise ValueError('Frozen goal fidelity')
    target=b.tables(b.serialize_target(record,{s['suffix']:s for s in spec['specs']}))
    target=re.sub(r'(?m)^([a-e])\)',r'\1\\)',target)
    for kind in ['paragraaf','opgaven']:
        text=docs[kind]
        if target not in text:raise ValueError('Whole target serialization')
        if any(s in text for s in ['2.3.2_ex_5','2.3.2_ex_6','2.3.2_ex_7']):raise ValueError('Answer graph leak')
        guided=text.split('## Begeleide inoefening\n')[1].split('## Zelfstandige oefening')[0]
        for required in ['Voor 0 ≤ Q < 6','Voor 6 < Q ≤ 18','Het totale surplus is daar ... euro','Stoppen vóór Q = 6','Dit maximum geldt onder ...','maatschappelijk welvaartsoordeel','binnen 0 ≤ Q ≤ 52','Denk aan de marginale vergelijking over het hele bereik.']:
            if required not in guided:raise ValueError('Explicit then reduced maximum writing: '+required)
        independent=text.split('## Zelfstandige oefening\n')[1].split('## Denkertje')[0]
        if 'Denk aan de marginale vergelijking' in independent or 'vul de zinnen aan' in independent:raise ValueError('Unfaded independent task')
        if 'Korte route: Startopgaven → Zelfstandige oefening → Doeloefening.' not in text or 'Heb je deze hulp niet nodig? Ga dan verder met Zelfstandige oefening.' not in text:raise ValueError('Paper route')
        if any(s in text.lower() for s in ['website','klik hier','mastery','governed','production_ready','h-213']):raise ValueError('Internal/device leakage')
    answer=docs['antwoorden']
    for value in record['short_answer_model'].values():
        if value not in answer:raise ValueError('Exact short target model')
    bonus=answer.split('**Beoordelingscriteria**')[1].split('## Herhaling')[0]
    if len(re.findall(r'(?m)^- ',bonus))!=3:raise ValueError('Three complete bonus criteria')
    for value in ['€ 36 bij Q = 6','€ 216 bij Q = 24','€ 600 bij Q = 40','€ 1.350 bij Q = 60','nul, maar TS','positieve bijdragen liggen','negatieve bijdragen toe','geen norm voor een eerlijke verdeling','transactiekosten','24/6 = € 4','9 − 6 = € 3']:
        if value not in answer:raise ValueError('Whole answer reasoning '+value)

class SourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.record=b.target_record();cls.spec=b.describe();cls.docs=b.documents(cls.record,cls.spec)

    def test_complete_frozen_plan_snapshot(self):
        plan=(b.ROOT.parent/'4veco-lessen'/b.LESSON_REL/'2.3.2-textbook-plan.md').read_text(encoding='utf-8')
        record=json.loads(plan.split('```json\n',1)[1].split('\n```')[0])
        self.assertEqual(record,self.record)
        self.assertEqual(hashlib.sha256(json.dumps(record,ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),b.TARGET_HASH)
        self.assertEqual([q['points'] for q in record['target_exercise']['subquestions']],[2,2,3,2,2])
        for key in ['context','sources','subquestions']:
            bad=json.loads(json.dumps(record));bad['target_exercise'][key]=[] if key!='context' else 'forged'
            self.assertNotEqual(hashlib.sha256(json.dumps(bad,ensure_ascii=False,separators=(',',':')).encode()).hexdigest(),b.TARGET_HASH)

    def test_all_six_market_chains_exact(self):
        cases=[(30,F(1,2),6,F(1,4),32,14,256,128,384),(30,1,6,1,12,18,72,72,144),(18,1,6,1,6,12,18,18,36),(26,F(1,2),8,F(1,4),24,14,144,72,216),(36,F(1,2),6,F(1,4),40,16,400,200,600),(50,F(1,2),5,F(1,4),60,20,900,450,1350)]
        for a,d,c,s,q,p,cs,ps,ts in cases:
            with self.subTest(a=a,c=c):
                Q=F(a-c)/(d+s);P=a-d*Q
                self.assertEqual((Q,P),(q,p));self.assertEqual(c+s*Q,P)
                self.assertEqual(F(1,2)*Q*(a-P),cs);self.assertEqual(F(1,2)*Q*(P-c),ps)
                self.assertEqual(cs+ps,ts);self.assertEqual(F(1,2)*Q*(a-c),ts)
                self.assertGreater(a-d*(Q-1)-(c+s*(Q-1)),0);self.assertLess(a-d*(Q+1)-(c+s*(Q+1)),0)
                self.assertNotEqual(F(1,2)*Q*P,ps,'Price is not PS height')

    def test_marginal_point_not_next_unit_or_interval(self):
        gap=lambda q:F(45)-F(3,4)*q
        self.assertEqual(gap(50),F(15,2));self.assertEqual(gap(70),F(-15,2))
        interval=(gap(50)+gap(51))/2
        self.assertEqual(interval,F(57,8));self.assertNotEqual(interval,gap(50));self.assertNotEqual(gap(51),gap(50))
        for q in [0,1,30,59]:self.assertGreater(gap(q),0)
        self.assertEqual(gap(60),0)
        for q in [61,70,99,100]:self.assertLess(gap(q),0)

    def test_all_supplied_comparison_rows(self):
        for a,d,c,s,rows in [(30,F(1,2),6,F(1,4),[(0,30,6),(16,22,10),(32,14,14),(48,6,18),(60,0,21)]),(30,1,6,1,[(10,20,16),(12,18,18),(14,16,20)]),(18,1,6,1,[(4,14,10)]),(26,F(1,2),8,F(1,4),[(20,16,13),(28,12,15)]),(36,F(1,2),6,F(1,4),[(32,20,14),(48,12,18)]),(50,F(1,2),5,F(1,4),[(50,25,F(35,2)),(70,15,F(45,2))])]:
            for q,w,m in rows:self.assertEqual((a-d*q,c+s*q),(w,m))

    def test_retrieval_and_individual_boundaries(self):
        self.assertEqual((24-2*8,2*8-8),(8,8));self.assertEqual(F(130-100,15-10),6)
        self.assertEqual(F(62-38,10-4),4);self.assertNotEqual(F(62,10),4)
        self.assertEqual(F(1,2)*4*(10-6),8)
        self.assertEqual((15-10,10-7,15-7),(5,3,8))
        buyers=[v for v in [9,6,3] if v>=6];self.assertEqual(buyers,[9,6]);self.assertEqual(sum(v-6 for v in buyers),3)
        self.assertNotEqual(sum(v-6 for v in [9,6,3]),3)
        self.assertEqual((20*8,60),(160,60))
        # Same marginal surplus, different unknown fixed costs: profit is not determined.
        self.assertNotEqual(60-10,60-90)

    def test_mug_and_bonus_transfer(self):
        self.assertEqual([(w-14,14-m,w-m) for w,m in [(18,10),(20,10),(18,13),(20,13)]],[(4,4,8),(6,4,10),(4,1,5),(6,1,7)])
        self.assertEqual([(22-p,p-9,22-9) for p in [14,16,17]],[(8,5,13),(6,7,13),(5,8,13)])
        for p in [9,22,8,23]:self.assertFalse(22-p>0 and p-9>0)
        self.assertEqual((22-16)-(22-14),-2);self.assertEqual((16-9)-(14-9),2)

    def test_timing_inventory(self):
        core=[2,13,7,2,6,13,11];self.assertEqual(sum(core),54)
        self.assertEqual([sum(core),sum(core)+20,sum(core)+20+9,sum(core)+20+9+5],[54,74,83,88])
        rows=[[.7,1.4,.2,.8,.4],[.4,.6,0,1,.5],[1.5,3,2,3.5,1],[.4,.2,0,1,.4],[1.5,3,2,3.5,1]]
        self.assertEqual([round(sum(r),5) for r in rows],[3.5,2.5,11,2,11])
        self.assertGreater(sum(core)+20,55)

    def test_complete_paper_and_answers(self):
        verify_content(self.docs,self.record,self.spec)

    def test_real_content_negative_counterexamples(self):
        cases=[('opgaven','Voor 0 ≤ Q < 6','Alleen Q = 4'),('opgaven','Het totale surplus is daar ... euro','Het totale surplus is nul'),('opgaven','Denk aan de marginale vergelijking over het hele bereik.',''),('opgaven','## Zelfstandige oefening','## Zelfstandige oefening ontbreekt'),('opgaven','2.3.2_ex_4','2.3.2_ex_7'),('paragraaf',self.record['lesson_goals'][3],'Een grote som is eerlijk.'),('antwoorden','€ 216 bij Q = 24','€ 0 bij Q = 24'),('antwoorden','24/6 = € 4','24/6 = € 6'),('opgaven','zonder antwoordmarkeringen.','Markeer het evenwicht.——'*8)]
        for kind,old,new in cases:
            bad=dict(self.docs);self.assertIn(old,bad[kind]);bad[kind]=bad[kind].replace(old,new)
            with self.assertRaises(ValueError,msg=old):verify_content(bad,self.record,self.spec)

    def test_caption_title_plan_and_asset_roles(self):
        plan=(b.ROOT.parent/'4veco-lessen'/b.LESSON_REL/'2.3.2-textbook-plan.md').read_text(encoding='utf-8')
        self.assertEqual([s['stem'] for s in self.spec['specs']],b.ASSETS)
        for s in self.spec['specs']:
            self.assertIn(s['caption'],plan);self.assertIn(s['alt'],plan);self.assertLessEqual(len(s['alt']),120)
        self.assertEqual([s['stage'] for s in self.spec['specs'] if s['suffix'] in ['ex_2','ex_3','ex_4']],['bare']*3)
        self.assertIn('a.startswith("--lesson-root=")',b.wrapper())
        self.assertIn('sys.executable',b.wrapper())

    def test_actual_svg_source_geometry_ink_and_counterexamples(self):
        from check_render import svg_check
        generated=json.loads(b.gate.command(['node','-e',"console.log(JSON.stringify(require('./build-scripts/content/book-2/232/assets.js').sources()))"])['stdout'])
        class Source:
            def __init__(self,text):self.text=text
            def read_text(self,**kwargs):return self.text
        for spec in self.spec['specs']:
            raw=generated[spec['stem']]
            with self.subTest(stem=spec['stem']):
                svg_check(Source(raw),spec,self.spec['models'].get(spec['model']))
            for wrong in [raw.replace('font-size="40"','font-size="30"',1),raw.replace('<title id="title">','<title id="title">FORGED ',1)]:
                with self.assertRaises(ValueError):svg_check(Source(wrong),spec,self.spec['models'].get(spec['model']))

if __name__=='__main__':unittest.main()
