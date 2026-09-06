"""Plan-only author checks. Never builds pupil/native output or issues review approval."""
from __future__ import annotations
from fractions import Fraction as F
from pathlib import Path
import copy, hashlib, json, re, subprocess, sys

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
BOOK = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus'
REL = BOOK + '/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md'
TARGET = '54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce'
BASEP = '0b15d6bfa75fa62e00e5945e16a7cd8f9a7f6bf6'
BASEL = '3199ff2ae89b39a472b48ee0818de5b1c191063a'
PREFIX = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN'
INDEXES = {f'reports/github-agent-index-{repo}.{ext}' for repo in ['platform','lessen'] for ext in ['json','md']}
checks, negatives = [], []

def need(value, message):
    if not value:
        raise ValueError(message)

def sha(value):
    return hashlib.sha256(value).hexdigest()

def record_hash(record):
    return sha(json.dumps(record, ensure_ascii=False, separators=(',', ':')).encode())

def target_check(record):
    need(record_hash(record) == TARGET, 'Entire frozen target record changed')
    need([q['points'] for q in record['target_exercise']['subquestions']] == [2,2,3,2,2], 'Point allocation')

def close(actual, expected, name):
    need(abs(F(str(actual)) - expected) < F(1, 1000000), name)

def solve(a, b, c, d):
    a,b,c,d = map(F, (a,b,c,d))
    q=(a-c)/(b+d); p=a-b*q
    need(p==c+d*q, 'Both functions agree')
    cs=q*(a-p)/2; ps=q*(p-c)/2
    return q,p,cs,ps,cs+ps

SCENES = [
    ('Tulips fig2–5',30,'0.5',6,'0.25',60,30,[32,14,256,128,384]),
    ('Towels we1',30,1,6,1,30,40,[12,18,72,72,144]),
    ('Seedlings ex1',18,1,6,1,18,24,[6,12,18,18,36]),
    ('Candles ex2/ex5',26,'0.5',8,'0.25',52,26,[24,14,144,72,216]),
    ('Fruit bars ex3/ex6',36,'0.5',6,'0.25',72,36,[40,16,400,200,600]),
    ('Concert ex4/ex7',50,'0.5',5,'0.25',100,50,[60,20,900,450,1350]),
]

def geometry_check(text):
    for name,a,b,c,d,qmax,pmax,want in SCENES:
        q,p,cs,ps,ts=solve(a,b,c,d)
        need([q,p,cs,ps,ts] == list(map(F,want)), 'Independent '+name+' arithmetic')
        row=next((line for line in text.splitlines() if line.startswith('| '+name+' |')), '')
        need(row, 'Missing geometry scene '+name)
        cells=[s.strip() for s in row.strip('|').split('|')]
        need(cells[1]==f'{qmax}/{pmax}', 'Wrong scene domain '+name)
        nums=re.findall(r'-?\d+(?:\.\d+)?',cells[2]+' '+cells[3])
        expected=[0,F(a),F(qmax),F(a)-F(b)*qmax,0,F(c),F(qmax),F(c)+F(d)*qmax]
        need(list(map(F,nums))==expected, 'Incorrect full curve endpoints '+name)
        nums=re.findall(r'-?\d+(?:\.\d+)?',cells[4])
        need(len(nums)==4, 'Missing equilibrium geometry')
        for actual,expected,label in zip(nums,[q,p,180+900*q/qmax,720-540*p/pmax],['Q','P','x','y']):
            close(actual,expected,name+' E '+label)
        # Whole 60x48 two-letter ink boxes plus 12px clearance, not anchor only.
        need('label anchors atQ=.15Qe' in text and 'a60×48px ink box' in text, 'Actual planned label geometry')
        x=F(180)+900*F('.15')*q/qmax
        for which in ['CS','PS']:
            Q=F('.15')*q
            boundary=F(a)-F(b)*Q if which=='CS' else F(c)+F(d)*Q
            mid=(p+boundary)/2
            y=720-540*mid/pmax
            for dx in [-42,42]:
                qcorner=(x+dx-180)*qmax/900
                for dy in [-36,36]:
                    pcorner=(720-y-dy)*pmax/540
                    need(0<qcorner<q, name+' '+which+' label Q bounds')
                    need(p<pcorner<F(a)-F(b)*qcorner if which=='CS' else F(c)+F(d)*qcorner<pcorner<p,
                         name+' '+which+' whole ink bbox not contained')
    need('common30px/euro' in text, 'Discrete price scale contract inconsistent')

def timing_check(text):
    expected={'Start1':F('3.5'),'Start2':F('2.5'),'Independent6':F(11),'Independent7':F(2),'Target8':F(11)}
    for name,total in expected.items():
        row=next((l for l in text.splitlines() if l.startswith('| '+name+' |')), '')
        nums=[F(s.strip()) for s in row.strip('|').split('|')[1:]]
        need(len(nums)==6 and sum(nums[:-1])==nums[-1]==total,'Actual timing row '+name)
    need(2+13+7+2+6+13+11==54<=55, 'Core calculation')
    for literal in ['motivation2 + instruction13 + fully read/worked example7 + recap/transitions2',
                    '+ Start6 + independent13 + target11', 'Guided12→66; bonus9→75; closing5→80']:
        need(literal in text, 'Whole-route timing statement')
    need('All times are UNOBSERVED estimates' in text, 'Timing observation boundary')

def alt_check(text):
    rows=[l for l in text.splitlines() if re.match(r'\| 2\.3\.2_(fig|we|ex)_\d+ \|',l)]
    need(len(rows)==14,'Exact 14 native pairs')
    names=[]
    for row in rows:
        cells=[s.strip() for s in row.strip('|').split('|')];name,caption,alt,role=cells
        names.append(name)
        need(10<=len(alt)<=120 and alt != caption,'Functional short alternative '+name)
        need(not re.match(r'(Teken|Markeer|Bereken|Arceer|Bekijk|Lees)\b',alt),'Imperative alternative '+name)
        need(caption and role,'Caption/role absent')
    need(len(set(names))==14,'Duplicate native figure')
    for literal in ['Native packet40files=12documents/archives+28asset files',
                    'Paragraph11pairs→25members; opgaven5pairs→13;',
                    'answers5pairs(we1,ex1,ex5,ex6,ex7)→13',
                    'Minimum actual SVG font40 CSSpx =30pt source',
                    'Body/table/caption/footer≥12pt']:
        need(literal in text,'Native/typography contract')

def contrast_check(text):
    need('Demand solid blue#1A5276' in text and 'supply long-dash green#1E8449' in text,
         'Planned accessible curve inks')
    need('dark\n+#2D3748'.replace('\n+','\n') in text and 'Background#F7FAFC' in text,
         'Planned accessible text/background')
    need('dark diagonal hatching' in text and 'dark dotted hatching' in text,'Noncolor redundancy')

def own_path(label, value):
    return (value.startswith(PREFIX+'-') or value in INDEXES) if label=='platform' else value==REL

def coverage_check(text):
    headings=re.findall(r'^#### ([1-7])\. (.+)$',text,re.M)
    need([v[1].split(' — ')[0] for v in headings]==['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening',
        'Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling / Herhaling en interleaving'], 'Seven-stage route')
    need(text.index('non-heading recap with exactly five bullets')<text.index('#### 2. Startopgaven'),'Recap position')
    for token in ['G1 / a','G1 / b','G2 / c','G3 / d','G4 / d','Full model','Opgave1','Opgave2','Opgave3','Opgave4',
                  'Opgave5','Opgave6','Opgave7','Opgave8','Opgave9','Opgave10','Opgave11',
                  'Full model: originallyCS22−14=8', 'Assessment criteria: (1)', '(2) total13', '(3) rejection',
                  'Same goals/target','No step hints/formula card','PS is not automatically profit',
                  'including\n+units not traded'.replace('\n+','\n'),
                  'PRODUCTION_RELEASE_PENDING_ACCEPTED_213_INPUTS_AND_PLAN_REVIEW',
                  'accepted five-input succession/current QC/root handoff still PENDING',
                  'does not already establish']:
        # Last phrase is checked through the explicit new-learning statement below.
        if token=='does not already establish':
            need('Neither Book1 supply nor213 interval averages teaches this bridge.' in text,'New formal bridge')
        else: need(token in text,'Coverage/boundary absent: '+token)
    need('maximalTS=0' not in text and 'PS equals profit' not in text,'Invalid economic conclusion')

def validate(text):
    blocks=re.findall(r'```json\n(.*?)\n```',text,re.S)
    need(len(blocks)==1,'Exactly one frozen full record')
    target_check(json.loads(blocks[0]));geometry_check(text);timing_check(text);alt_check(text);coverage_check(text);contrast_check(text)

def rejected(name, fn):
    try: fn()
    except (ValueError,KeyError,StopIteration,IndexError,json.JSONDecodeError): negatives.append(name)
    else: raise AssertionError('Negative counterexample wrongly accepted: '+name)

def delta_cost(q0,q1,t0,t1):
    need(q1>q0,'positive interval');return F(t1-t0,q1-q0)

def main():
    text=(L/REL).read_text(encoding='utf-8').replace('\r\n','\n')
    validate(text);checks.append('Complete plan structure, actual geometry/ink/timing/roles/metadata')
    reg=json.loads((P/'references/authored/course-target-exercises.json').read_text(encoding='utf-8'))
    records=[r for r in reg['exercises'] if r['id']=='2.3.2'];need(len(records)==1,'Unique target');target_check(records[0])
    need(json.loads(re.findall(r'```json\n(.*?)\n```',text,re.S)[0])==records[0],'Appendix exact current record')
    checks.append('Full frozen target exact bytes, all goals/sources/table/questions/points/forms')
    math_rows=[]
    for name,a,b,c,d,qmax,pmax,want in SCENES:
        answer=solve(a,b,c,d);math_rows.append({'case':name,'Q_P_CS_PS_TS':[str(v) for v in answer]})
    # Independent source-table substitution, including nontraded quantities.
    for name,a,b,c,d,qs,wants in [('tulips',30,F('.5'),6,F('.25'),[16,48],[12,-12]),
         ('towels',30,1,6,1,[10,14],[4,-4]),('seedlings',18,1,6,1,[4],[4]),
         ('candles',26,F('.5'),8,F('.25'),[20,28],[3,-3]),
         ('fruit',36,F('.5'),6,F('.25'),[32,48],[6,-6]),('target',50,F('.5'),5,F('.25'),[50,70],[F('7.5'),F('-7.5')])]:
        actual=[a-b*q-(c+d*q) for q in qs];need(actual==wants,name+' marginal arithmetic')
        math_rows.append({'case':name+' marginal','Q':qs,'gains':[str(v) for v in actual]})
    need((24+8)/4==8 and 24-2*8==2*8-8==8,'Start1a')
    need(delta_cost(10,15,100,130)==6 and F(1,2)*4*(10-6)==8,'Start1b/c')
    need(delta_cost(4,10,38,62)==4,'Closing10')
    individual=[]
    for name,w,p,c,expected in [('opening',18,10,7,[8,3,11]),('Start2',15,10,7,[5,3,8]),
         ('combined baseline',18,14,10,[4,4,8]),('WTP only',20,14,10,[6,4,10]),('MC only',18,14,13,[4,1,5]),
         ('both',20,14,13,[6,1,7]),('bonus original',22,14,9,[8,5,13]),('bonus model',22,16,9,[6,7,13]),
         ('bonus alternative',22,17,9,[5,8,13])]:
        actual=[w-p,p-c,w-c];need(actual==expected,name);individual.append({'case':name,'CS_PS_TS':actual})
    need(sum(v-6 for v in [9,6,3] if v>=6)==3,'Closing11 nonbuyers')
    need(20*8==160,'Independent7 revenue');checks.append('Six market systems and eleven marginal rows; all discrete/start/combined/bonus/closing calculations independently solved')
    # Finite one-unit integral differs from the target's pointwise marginal value.
    need(F('7.5')-F('.75')/2==F('7.125'),'Finite continuous interval distinction')
    checks.append('Q50 point gain7.50 distinguished from continuous [50,51] area7.125; no off-by-one rewrite')
    pixels=F(40,1200)*F(166)*72/F('25.4');need(pixels>=12,'Placed labels')
    def lum(h):
        rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
        return sum(v*w for v,w in zip([x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb],[.2126,.7152,.0722]))
    bg=lum('#F7FAFC'); contrast={ink:(bg+.05)/(lum(ink)+.05) for ink in ['#2D3748','#1A5276','#1E8449']}
    need(contrast['#2D3748']>=4.5 and all(v>=3 for v in contrast.values()),'Essential ink contrast')
    checks.append('Actual planned color ratios and effective font calculation; no render acceptance')
    for path,expected in [(BOOK+'/_book-plan.md','b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76'),
        (BOOK+'/2.3 Hoofdstuk Surplus en welvaart/_chapter-plan.md','e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7'),
        (BOOK+'/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-handoff.md','69bdae1f9dd0efaace0a90db57e6ac0f17db627f93fdb333b48dafeb36eebe79')]:
        need(sha((L/path).read_text(encoding='utf-8').encode())==expected,'Foundation '+path)
    checks.append('Exact current root/C23/accepted231 handoff inputs')
    for name,mutate in [('goal',lambda x:x['lesson_goals'].__setitem__(0,'changed')),
        ('context',lambda x:x['target_exercise'].__setitem__('context','changed')),
        ('graph source',lambda x:x['target_exercise']['sources'][0].__setitem__('content','solution shown')),
        ('table cell',lambda x:x['target_exercise']['sources'][1]['rows'][1].__setitem__(2,'€22')),
        ('points',lambda x:x['target_exercise']['subquestions'][0].__setitem__('points',3)),
        ('prompt',lambda x:x['target_exercise']['subquestions'][1].__setitem__('prompt','Draw from scratch')),
        ('answer form',lambda x:x['answer_form_expectations'].__setitem__(0,'choice')),
        ('short model',lambda x:x['short_answer_model'].__setitem__('d','wrong')),
        ('status',lambda x:x.__setitem__('record_status','reviewed_final'))]:
        bad=copy.deepcopy(records[0]);mutate(bad);rejected('frozen '+name,lambda:target_check(bad))
    mutations=[('wrong E geometry','(720,504)','(721,504)'),('wrong supplied domain','| 100/50 |','| 99/50 |'),
        ('wrong candle E','(595.384615,429.230769)','(775.384615,429.230769)'),
        ('invented time','| Target8 | 1.5 | 3 | 2 | 3.5 | 1 | 11 |','| Target8 | 1.5 | 3 | 2 | 3.5 | 1 | 10 |'),
        ('timing observed','All times are UNOBSERVED estimates','All times are observed'),
        ('missing target coverage','G3 / d','G3 absent'),('missing fading','Same goals/target','Different goals'),
        ('missing final stage','#### 7. Herhaling / Herhaling en interleaving','#### 8. Later'),
        ('speculative production release','PRODUCTION_RELEASE_PENDING_ACCEPTED_213_INPUTS_AND_PLAN_REVIEW','PRODUCTION_RELEASED'),
        ('legacy213 acceptance','accepted five-input succession/current QC/root handoff still PENDING','legacy QC is current'),
        ('untraded supply excluded','including\nunits not traded','excluding\nunits not traded'),
        ('imperative short alt','Surplus van koper en reparateur bij één paraplureparatie.','Bereken het surplus van koper en reparateur.'),
        ('long alt','Surplus van koper en reparateur bij één paraplureparatie.','Surplus '+ 'a'*121),
        ('missing bonus criteria','Assessment criteria: (1)','No assessment criteria'),
        ('PS profit','PS is not automatically profit','PS equals profit'),
        ('wrong discrete scale','common30px/euro','common15px/euro')]
    mutations += [('insufficient essential contrast','supply long-dash green#1E8449','supply long-dash green#CBD5E0'),
        ('color-only region meaning','dark dotted hatching','no hatching'),
        ('caption substituted for alt','Surplus van koper en reparateur bij één paraplureparatie.',
         'Eén paraplureparatie: de klant wint 8 euro en de reparateur 3 euro ten opzichte van betalingsbereidheid en marginale kosten. Samen is dat 11 euro.')]
    for name,old,new in mutations:
        need(old in text,'Mutation fixture missing '+name);bad=text.replace(old,new,1)
        rejected(name,lambda:validate(bad))
    rejected('zero-width interval',lambda:delta_cost(4,4,38,62))
    rejected('raw delta mistaken for MK',lambda:need(F(30)==delta_cost(10,15,100,130),'raw delta error'))
    rejected('price mistaken for area height',lambda:need(F(1,2)*60*20==solve(50,F('.5'),5,F('.25'))[2],'area height error'))
    rejected('negative nonbuyer CS counted',lambda:need(sum(v-6 for v in [9,6,3])==3,'nonbuyer error'))
    rejected('maximum total equals zero marginal',lambda:need(solve(50,F('.5'),5,F('.25'))[4]==0,'maximum total error'))
    for label,value in [('platform','build-scripts/content/book-2/b2_231.py'),
                        ('platform','references/authored/course-target-exercises.json'),
                        ('lessons',BOOK+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md')]:
        rejected('unrelated prior edit '+value,lambda:need(own_path(label,value),'Outside strict plan-only owner paths'))
    # Git clean-filter comparison of all tracked baseline files; exact four
    # generated publication indexes are the only permitted prior-file exception.
    preserved={}
    for repo,base,label in [(P,BASEP,'platform'),(L,BASEL,'lessons')]:
        tree=subprocess.check_output(['git','ls-tree','-rz','--full-tree',base],cwd=repo)
        count=0
        for entry in tree.split(b'\0'):
            if not entry: continue
            meta,name=entry.split(b'\t',1);mode,kind,oid=meta.split();file=repo/name.decode('utf-8')
            if kind!=b'blob': continue
            need(file.is_file(),'Prior path missing '+str(file))
            count+=1
        changed=subprocess.check_output(['git','diff','--name-only','-z',base,'--'],cwd=repo).split(b'\0')
        changed=[v.decode('utf-8') for v in changed if v]
        need(all(own_path(label,v) for v in changed),'Prior tracked byte changes outside owned plan evidence')
        preserved[label]=count
    checks.append('Every prior tracked file retained under Git clean-filter byte contract; only exact four publication indexes exempt from unchanged bytes')
    result={'status':'PASS_AUTHOR_CHECKS_ONLY','plan_raw_sha256':sha((L/REL).read_bytes()),
        'plan_lf_sha256':sha(text.encode()),'checks':checks,'negative_counterexamples_rejected':negatives,
        'market_math':math_rows,'individual_math':individual,'placed_font_pt':str(pixels),
        'planned_contrast':contrast,'preserved_prior_files':preserved,'permitted_prior_file_index_exceptions':sorted(INDEXES),'root_validation':'PENDING',
        'independent_plan_review':'PENDING','production_release':'PENDING','rendered_proof':'NOT_APPLICABLE_PLAN_ONLY',
        'timing':'54 core / 66 support / 75 bonus / 80 all, UNOBSERVED'}
    if len(sys.argv)>1:
        need(len(sys.argv)==2 and re.fullmatch(r'[a-z0-9-]+',sys.argv[1]),'Optional unique report label')
        dest=P/(PREFIX+'-'+sys.argv[1]+'.json')
        with dest.open('x',encoding='utf-8') as out:json.dump(result,out,ensure_ascii=False,indent=2);out.write('\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
