"""Paragraph-owned exact-content and independent finite-arithmetic probes."""
from fractions import Fraction as F
from pathlib import Path
import re
import sys
import unittest
from unittest.mock import patch
import json
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from PIL import ImageFont
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_213 as b

def cells(table):
    return [[c.get_text() for c in row.find_all(['td','th'])] for row in table.find_all('tr')]

class SourceTests(unittest.TestCase):
    def test_altered_target_fails_closed(self):
        registry=json.loads((b.ROOT/'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))
        next(r for r in registry['exercises'] if r['id']=='2.1.3')['lesson_goals'][0]+=' changed'
        with patch.object(Path,'read_text',return_value=json.dumps(registry)), self.assertRaisesRegex(ValueError,'Frozen'):
            b.target_record()

    def test_bad_prerequisite_stops_before_process_or_output_write(self):
        with patch.object(b,'lf_hash',return_value='bad'), patch.object(b.subprocess,'run') as run:
            with self.assertRaisesRegex(ValueError,'Required accepted source differs'):
                b.build(b.ROOT.parent/'4veco-lessen')
            run.assert_not_called()

    def test_frozen_target_and_native_cells(self):
        r=b.target_record(); self.assertEqual(len(r['lesson_goals']),4)
        self.assertEqual([q['points'] for q in r['target_exercise']['subquestions']],[4,3,2,4,2])
        soup=BeautifulSoup(b.layout_tables(b.serialize_target(r)),'html.parser')
        for source,t,blanks in zip(r['target_exercise']['sources'],soup.find_all('table'),[10,6]):
            self.assertEqual(cells(t),[source['columns'],*source['rows']])
            self.assertEqual(sum(v=='' for row in source['rows'] for v in row),blanks)
            self.assertEqual(source['rows'][0][-2:],['—','—'])
        self.assertEqual(len(soup.find_all('table')),2)

    def test_exact_seven_exercise_headings(self):
        src=(b.CONTENT/'exercises.md').read_text(encoding='utf-8')
        self.assertEqual(re.findall(r'^## (.+)$',src,re.M),b.HEADINGS)
        self.assertEqual(re.findall(r'^\*\*Opgave (\d+)',src,re.M),['1','2','3','4','5','6','8','9'])
        recap=src.split('> **Onthoud**')[1].split('## Startopgaven')[0]
        self.assertEqual(len(re.findall(r'^> - ',recap,re.M)),5)
        self.assertIn('Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.',src)

    def test_common_exercise_source_and_no_live_or_timing_copy(self):
        docs=b.documents(b.target_record())
        self.assertEqual(docs['paragraaf'].split('## Uitgewerkt voorbeeld',1)[1],docs['opgaven'].split('## Uitgewerkt voorbeeld',1)[1])
        for kind,doc in docs.items():
            self.assertNotRegex(doc,r'(?i)\b(online|klik|skilltree|quiz|video|smartphone|device)\b')
            self.assertNotRegex(doc,r'(?i)\b\d+\s*(minuten|min\.)')
            self.assertNotIn('{{',doc)
            self.assertNotRegex(doc,r'(?i)MO\s*=\s*MK|TK\s*\x27')
        for goal in b.target_record()['lesson_goals']:
            self.assertIn(goal,docs['paragraaf'])

    def test_discrete_arithmetic_all_cases(self):
        expected={
            'holders':([-20,30,60],[3,5],[8,8]),
            'lus':([-12,-4,4,12],[2,2,2],[6,6,6]),
            'bout':([-8,12,24,28],[2,6,10],[12,12,12]),
            'bottles':([-8,0,4],[2,4],[6,6]),
            'patches':([-9,0,9],[2,2],[5,5]),
            'coasters':([-10,2,10],[2,6],[8,8]),
            'draad':([-20,-4,12,28],[1,1,1],[5,5,5]),
            'kaft':([-12,68,116,132],[4,12,20],[24,24,24]),
            'linea':([-200,-150,-100,-50],[3,3,3],[8,8,8]),
            'curva':([-100,25,100,125],[5,15,25],[30,30,30])}
        for key,(q,tk,to) in b.CASES.items():
            profit,mk,mo=expected[key]
            self.assertEqual([revenue-cost for revenue,cost in zip(to,tk)],profit,key)
            self.assertEqual(b.interval_values(q,tk),mk,key); self.assertEqual(b.interval_values(q,to),mo,key)
            self.assertEqual(b.interval_values(q,profit),[F(o)-F(k) for o,k in zip(mo,mk)],key)

    def test_formula_totals_independently(self):
        for name,fixed,coefficient,price,quadratic in [('lus',12,2,6,False),('bout',8,1,12,True),('draad',20,1,5,False),('kaft',12,1,24,True),('linea',200,3,8,False),('curva',100,1,30,True)]:
            q,tk,to=b.CASES[name]
            self.assertEqual(tk,[fixed+coefficient*(n*n if quadratic else n) for n in q])
            self.assertEqual(to,[price*n for n in q])

    def test_retrieval_combination_and_unequal_intervals(self):
        self.assertEqual((18+2*4,5*4,F(26,4),20-26),(26,20,F(13,2),-6))
        for tk,to,mk,mo in [([14,22],[12,36],2,6),([24,32],[12,36],2,6),([14,22],[14,42],2,7),([24,32],[14,42],2,7)]:
            self.assertEqual(b.interval_values([2,6],tk),[mk]); self.assertEqual(b.interval_values([2,6],to),[mo])
        self.assertEqual(42-32,10)
        self.assertEqual(b.interval_values([0,4,12],[20,32,56]),[3,3])
        self.assertEqual(b.interval_values([0,4,12],[20,40,56]),[5,2])
        for q,tk,to,profit,average in [(3,21,21,0,F(7)),(6,27,42,15,F(9,2))]:
            self.assertEqual((15+2*q,7*q,to-tk,F(tk,q)),(tk,to,profit,average))
        with self.assertRaises(ValueError): b.interval_values([0,0],[1,2])
        with self.assertRaises(ValueError): b.interval_values([2,1],[1,2])

    def test_initial_and_completed_tables_match_case_values(self):
        docs=b.documents(b.target_record())
        seen=set()
        for doc in docs.values():
            for t in BeautifulSoup(doc,'html.parser').find_all('table'):
                matrix=cells(t)
                if matrix[0]!=['Q','TK','TO','winst','MK','MO']: continue
                def num(s): return F(s.replace('€','').replace(' ','').replace('−','-')) if s not in ('','—') else None
                rows=[[num(c) for c in row] for row in matrix[1:]]
                q=[row[0] for row in rows]; tk=[row[1] for row in rows]; to=[row[2] for row in rows]
                match=[name for name,case in b.CASES.items() if case==(q,tk,to)]
                self.assertTrue(match,matrix); seen.update(match)
                for i,row in enumerate(rows):
                    if row[3] is not None: self.assertEqual(row[3],to[i]-tk[i])
                    if i:
                        for col,total in [(4,tk),(5,to)]:
                            if row[col] is not None: self.assertEqual(row[col],(total[i]-total[i-1])/(q[i]-q[i-1]))
                    else: self.assertEqual(matrix[i+1][-2:],['—','—'])
        self.assertEqual(seen,{'lus','bout','patches','coasters','draad','kaft','linea','curva'})

    def test_six_assets_safe_geometry_large_type(self):
        sources=b.asset_sources(); self.assertEqual(list(sources),b.ASSETS)
        self.assertEqual(sources,b.asset_sources())
        for name,source in sources.items():
            root=ET.fromstring(source); width,height=map(float,(root.attrib['width'],root.attrib['height']))
            self.assertEqual(width,1200)
            for t in root.findall('.//{*}text'):
                self.assertEqual(t.attrib['font-size'],'30pt')
                font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if t.attrib['font-weight']=='700' else 'C:/Windows/Fonts/arial.ttf',40)
                length=font.getlength(t.text or ''); x,y=float(t.attrib['x']),float(t.attrib['y'])
                left=x-length/2 if t.attrib['text-anchor']=='middle' else x
                self.assertGreaterEqual(left,0,(name,t.text)); self.assertLessEqual(left+length,width,(name,t.text))
                self.assertTrue(40<=y<height,(name,t.text))
            self.assertNotIn('<script',source); self.assertNotIn('<image',source)
        self.assertNotIn('TO',sources['2.1.3_fig_1'])
        self.assertIn('marker-end="url(#arrow)"',sources['2.1.3_fig_2'])
        self.assertIn('MK = (… − …)/(… − …) = …',sources['2.1.3_ex_1'])

if __name__=='__main__': unittest.main(verbosity=2)
