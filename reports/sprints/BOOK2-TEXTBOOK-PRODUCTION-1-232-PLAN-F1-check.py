"""F1 author proof: fixed whole-file derivation, independent algebra and negatives.

No renderer, source generator, authority mutation or independent review verdict.
HOW TO ADAPT: publish a separately reviewed fixed delta for a different task.
"""
from pathlib import Path
from fractions import Fraction as F
import copy, hashlib, json, re, subprocess, sys
sys.dont_write_bytecode = True
P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
PREFIX = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-'
REL = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md'
BL = '9daf4b8a9696fcdce1d485d85dbc0c59b7b6dbe6'
OLD = 'df3d5c11364797f0d5b7190f2c0a2ce3c7cdd86d6d5e7fefde5c6e27d6d89967'
NEW = 'd0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935'
DELTA = '61edb07d33a0b50ef58904fd689685d90f47e586f537b17d831e848b39dd3d5a'
TARGET = '54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce'
def need(x, message):
    if not x: raise ValueError(message)
def sha(b): return hashlib.sha256(b).hexdigest()
def packed(x): return json.dumps(x, ensure_ascii=False, separators=(',', ':')).encode()
def read_json(s): return json.loads((P / (PREFIX+s+'.json')).read_bytes())
def between(t, a, b): return t.split(a, 1)[1].split(b, 1)[0]

original = subprocess.check_output(['git', 'show', BL+':'+REL], cwd=L)
actual = (L/REL).read_bytes()
need(sha(original) == OLD, 'Pinned original complete bytes')
delta_bytes = (P/(PREFIX+'allowed-delta.json')).read_bytes()
need(sha(delta_bytes) == DELTA, 'Fixed exact nine-hunk derivation must not be recaptured')
delta = json.loads(delta_bytes)
need(delta['source_commit'] == BL and delta['path'] == REL, 'Exact source derivation binding')
need(len(delta['hunks']) == 9, 'Exactly nine declared hunks')
def derive(base, d):
    need(sha(base) == OLD, 'Original byte identity before derivation')
    rows = base.decode().splitlines(keepends=True)
    for h in reversed(d['hunks']):
        i = h['old_start']-1 if h['old_count'] else h['old_start']
        old_rows = [s+'\n' for s in h['old']]
        need(rows[i:i+h['old_count']] == old_rows, 'Every exact old hunk, including newlines')
        need(h['old_count'] == len(h['old']) and h['new_count'] == len(h['replacement']), 'Hunk sizes')
        rows[i:i+h['old_count']] = [s+'\n' for s in h['replacement']]
    return ''.join(rows).encode()
expected = derive(original, delta)
need(sha(expected) == NEW == delta['candidate_raw_lf_sha256'], 'Derived complete candidate hash')
def exact_candidate(b): need(b == expected, 'Only fixed complete F1 byte transformation allowed')
exact_candidate(actual)
text, old = actual.decode(), original.decode()

# Establish unchanged old operations/authorities/contracts from complete sections,
# not a selected current-hash allowlist. F1 touches only nine explicit hunks.
unchanged = [
 ('foundation', '\n## Book foundation check', '\n## Part A backward-design plan'),
 ('all instruction and WE/Start', '\n### Model conditions, data and procedures', '\n#### 3. Begeleide inoefening'),
 ('fixed-trade5 and independent/target/bonus/closing', '\nOpgave5 (', '\n### Whole-lesson timing and feedback'),
 ('core question timing rows', '\n| Core activity |', '\nTarget8 subpart estimate'),
 ('native visual/verification/full target', '\n### Textbook visuals, complete native contracts and accessibility', '\0'),
]
for name,a,b in unchanged:
    need(between(text+'\0',a,b) == between(old+'\0',a,b), 'Unchanged '+name)
registry = json.loads((P/'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))
record = next(r for r in registry['exercises'] if r['id'] == '2.3.2')
def target_guard(r): need(sha(packed(r)) == TARGET, 'Entire frozen target record bytes/order')
target_guard(record)
appendix = json.loads(re.findall(r'```json\n(.*?)\n```', text, re.S)[0])
need(packed(appendix) == packed(record), 'Full target JSON including every unchanged field')
need([q['points'] for q in record['target_exercise']['subquestions']] == [2,2,3,2,2], 'Frozen eleven points')

g3 = between(text, '\nOpgave3 (', '\nOpgave4 (')
g4 = between(text, '\nOpgave4 (', '\nOpgave5 (')
g3_old = between(old, '\nOpgave3 (', '\nOpgave4 (')
g4_old = between(old, '\nOpgave4 (', '\nOpgave5 (')
def guided_contract(t):
    a = between(t, '\nOpgave3 (', '\nOpgave4 (')
    b = between(t, '\nOpgave4 (', '\nOpgave5 (')
    required3 = ['8 minutes; 6 points', 'Printed explicit written scaffold',
        'Voor0≤Q<6 ligt de vraaglijn ...', 'BijQ6 zijn betalingsbereidheid en MK beide ...',
        'Voor6<Q≤18 ligt de vraaglijn ...', 'Stoppen vóórQ6 laat ... liggen;',
        'Het bewijst niet dat de verdeling eerlijk is,',
        'geen volledig maatschappelijk welvaartsoordeel, want ...',
        'Full answer3c:', 'betalingsbereidheid is hoger dan MK',
        'beide12 euro per plant; het marginale verschil is0, maar TS is36',
        'Voor6<Q≤18 ligt vraag onder aanbod', 'VóórQ6 stoppen laat positieve bijdragen',
        'naQ6 doorgaan voegt negatieve bijdragen toe', 'maximaal36', 'binnen0≤Q≤18',
        'geen externe effecten of transactiekosten', 'geen norm voor een eerlijke verdeling',
        'niet alle omstandigheden', 'Three formative criteria:', '(1)', '(2)', '(3)',
        'One point each.', 'A loneQ4 comparison']
    required4 = ['8 minutes; 8 points', 'Only reduced printed cue:',
        'Denk aan de marginale vergelijking over het hele\nbereik.',
        'No sentence starters, interval\ntable, completed signs or numbered answer steps',
        'full\nlabelled figex2', 'Full answer4d:', 'Voor0≤Q<24 ligt de vraaglijn boven',
        'BijQ24 zijn beide14 euro per kaars', 'verschil0', 'Voor24<Q≤52 ligt vraag onder aanbod',
        'Eerder stoppen laat positieve\nbijdragen liggen', 'verder doorgaan voegt negatieve bijdragen toe',
        'maximaal216 euro bijQ24 binnen dit bereik, niet0', 'geen externe effecten',
        'geen norm voor een eerlijke verdeling', 'maatschappelijke welvaart bepalen buiten beeld',
        'Three formative criteria, one point each:', '(1)', '(2)', '(3)', 'bare equality is insufficient',
        'Opgave5 below remains a separate', 'not credited as maximum-TS rehearsal']
    for segment, fragments in [(a, required3),(b, required4)]:
        for f in fragments: need(f in segment, 'Guided written-chain clause missing: '+f)
    mapping = between(t, '| Goal / target operation |', '\n### Model conditions')
    need('3c explicit written scaffold →4d reduced written cue;5 is not maximum practice' in mapping, 'Honest operation mapping')
    need('2c boundary only' in mapping and 'local signs do not prove a maximum' in mapping, 'No local-sign/retrieval overclaim')
    return required3, required4
r3, r4 = guided_contract(text)

def timing(t):
    totals=[]
    for name in ['Start1','Start2','Independent6','Independent7','Target8']:
        row=next(l for l in t.splitlines() if l.startswith('| '+name+' |'))
        n=[F(s.strip()) for s in row.strip('|').split('|')[1:]]
        need(sum(n[:-1]) == n[-1], 'Question operations summed '+name);totals.append(n[-1])
    need(sum(totals) == 30 and 2+13+7+2+sum(totals) == 54, 'Unchanged complete core54')
    additional=[]
    for name in ['3c explicit written scaffold','4d reduced written cue']:
        row=next(l for l in t.splitlines() if l.startswith('| '+name+' |'))
        n=[F(s.strip()) for s in row.strip('|').split('|')[1:]]
        need(sum(n[:-1]) == n[-1] == 4, 'New operations four minutes '+name);additional.append(n[-1])
    need(12+sum(additional) == 20 and 54+20 == 74 and 74+9 == 83 and 83+5 == 88, 'Support not hidden')
    for f in ['Guided20→74; bonus9→83; closing5→88', 'optional20-minute route',
        'All times are UNOBSERVED estimates', 'exceeds the usual8–15-minute guided recommendation',
        'do not cut required teaching or core tasks', 'No added writing is hidden']:
        need(f in t, 'Honest optional workload '+f)
timing(text)

# Independent market parameters derived from actual endpoint rows, not an author
# solve helper or the reviewer executable. Full-range maximum is proved by the
# quadratic identity, with endpoint/interior rational cross-checks. No calculus
# is introduced into pupil content by this test-side verification.
math=[]; marginal=[]
for line in text.splitlines():
    if not re.match(r'^\| (Tulips|Towels|Seedlings|Candles|Fruit bars|Concert) ',line): continue
    cells=[c.strip() for c in line.strip('|').split('|')]
    qmax,pmax=map(F,cells[1].split('/'))
    q0,a,q1,a1,s0,c,s1,c1=map(F,re.findall(r'-?\d+(?:\.\d+)?',cells[2]+' '+cells[3]))
    need(q0==s0==0 and q1==s1==qmax and a1==0,'Full model endpoints')
    b=(a-a1)/qmax;d=(c1-c)/qmax;k=b+d;intercept=a-c
    qe=intercept/k;pe=a-b*qe;cs=qe*(a-pe)/2;ps=qe*(pe-c)/2;ts=cs+ps
    need(b>0 and d>0 and 0<qe<qmax and pe==c+d*qe,'Both equations and unique decreasing gap')
    need(ts==intercept*qe-k*qe*qe/2,'Area equals accumulated net benefit')
    # Coefficients of TS(qe)-TS(q) = k/2*(q-qe)^2 are exactly equal.
    need([ts,-intercept,k/2]==[k*qe*qe/2,-k*qe,k/2],'Symbolic global maximum identity')
    probes=[]
    for q in [F(0),qe/2,qe,(qe+qmax)/2,qmax]:
        gap=intercept-k*q;total=intercept*q-k*q*q/2
        need(ts-total==k*(q-qe)**2/2 and total<=ts,'Every model quantity bounded by maximum')
        need((gap>0 if q<qe else gap<0 if q>qe else gap==0),'Whole-domain marginal direction')
        probes.append({'Q':str(q),'WTP_minus_MC':str(gap),'TS':str(total)})
    idx=len(math)
    for q in [[16,48],[10,14],[4],[20,28],[32,48],[50,70]][idx]:
        marginal.append(str(a-b*q-(c+d*q)))
    math.append({'scene':cells[0],'Q_P_CS_PS_TS':list(map(str,[qe,pe,cs,ps,ts])),
        'gap_intercept_slope':list(map(str,[intercept,-k])),'full_domain_probes':probes})
need([r['Q_P_CS_PS_TS'] for r in math]==[list(map(str,v)) for v in
 [[32,14,256,128,384],[12,18,72,72,144],[6,12,18,18,36],[24,14,144,72,216],[40,16,400,200,600],[60,20,900,450,1350]]], 'All six independently recomputed answers')
need(marginal==list(map(str,[12,-12,4,-4,4,3,-3,6,-6]))+['15/2','-15/2'],'All eleven marginal comparisons')
need(F(15,2) != F(57,8),'Target marginal point not finite interval integral')

negative=[]
def reject(name,fn):
    try: fn()
    except (ValueError,IndexError,StopIteration,KeyError): negative.append(name);return
    raise AssertionError('Negative escaped: '+name)
reject('original F1 lacks both written forms',lambda:guided_contract(old))
for tag,segment,fragments in [('3c',g3,r3),('4d',g4,r4)]:
    for i,f in enumerate(fragments):
        mutated=text.replace(segment,segment.replace(f,'[REMOVED]'),1)
        need(mutated!=text,'Mutation anchored in actual task')
        reject(tag+' actual clause '+str(i+1)+' removed',lambda t=mutated:guided_contract(t))
for a,b in [('3c explicit written scaffold →4d reduced written cue;5 is not maximum practice','3b/4c/5'),
 ('2c boundary only','2c complete maximum proof'),('local signs do not prove a maximum','local signs prove a maximum')]:
    reject('mapping '+a,lambda t=text.replace(a,b):guided_contract(t))
for a,b in [('Guided20→74; bonus9→83; closing5→88','Guided12→66; bonus9→75; closing5→80'),
 ('| 0.7 | 0.6 | 2.1 | 0.6 | 4 |','| 0.7 | 0.6 | 1.1 | 0.6 | 4 |'),
 ('| 0.5 | 0.7 | 2.2 | 0.6 | 4 |','| 0.5 | 0.7 | 1.2 | 0.6 | 4 |'),
 ('All times are UNOBSERVED estimates','All times are OBSERVED outcomes')]:
    need(a in text,'Real timing anchor');reject('workload '+a,lambda t=text.replace(a,b):timing(t))
for key in record:
    changed=copy.deepcopy(record);changed[key]='MUTATED'
    reject('entire frozen field '+key,lambda r=changed:target_guard(r))
for index in range(5):
    changed=copy.deepcopy(record);changed['target_exercise']['subquestions'][index]['points']+=1
    reject('target point '+str(index),lambda r=changed:target_guard(r))
for name,b in [('old source instead of F1',original),('unrelated appended sentence',actual+b'Extra\n'),
 ('target Q60 mutated',text.replace('Qe=60','Qe=61').encode()),
 ('new fairness claim',text.replace('geen norm voor een eerlijke verdeling','een bewijs voor een eerlijke verdeling').encode()),
 ('zero maximum36',text.replace('maximaal36','maximaal0').encode()),
 ('wrong maximum216',text.replace('maximaal216','maximaal217').encode()),
 ('wrong whole domain',text.replace('24<Q≤52','24<Q≤28').encode()),
 ('forged accepted213',text.replace('PRODUCTION_RELEASE_PENDING_ACCEPTED_213_INPUTS_AND_PLAN_REVIEW','PRODUCTION_RELEASE_APPROVED').encode())]:
    reject(name,lambda v=b:exact_candidate(v))
for kind in ['old','replacement']:
    d=copy.deepcopy(delta);d['hunks'][0][kind][0]+=' forged'
    reject('forged fixed hunk '+kind,lambda d=d:exact_candidate(derive(original,d)))
baseline=read_json('baseline')
protected=[]
for r in baseline['preservation']:
    if r['repository']!='platform': continue
    for suffix in ['build-scripts/content/book-2/b2_213.py','build-scripts/content/book-2/231/test_source.py',
                   'references/authored/course-target-exercises.json',
                   'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW-report.md']:
        v=next(x for x in r['rows'] if x['path']==suffix);b=(P/suffix).read_bytes()
        need(sha(b)==v['raw_sha256'],'Actual immutable '+suffix)
        reject('unrelated prior byte mutation '+suffix,lambda b=b,v=v:need(sha(b+b'X')==v['raw_sha256'],'Raw custody'))
        protected.append(suffix)
print(json.dumps({'status':'PASS AUTHOR CORRECTION CHECKS ONLY','original_raw_lf_sha256':OLD,
 'candidate_raw_lf_sha256':NEW,'fixed_nine_hunk_derivation_sha256':DELTA,'frozen_target_sha256':TARGET,
 'unchanged_complete_sections':[v[0] for v in unchanged], 'six_independent_market_proofs':math,
 'eleven_marginal_differences':marginal,'timing_minutes':{'core':54,'optional_guided':20,'with_guided':74,'with_bonus':83,'all':88,'observed':False},
 'negative_count':len(negative),'negative_counterexamples_rejected':negative,'protected_negative_paths':protected,
 'historical_review':'REVISE retained unchanged','independent_re_review':'PENDING','root_validation':'PENDING',
 'root_acceptance':'PENDING','production_release':'PENDING','native_rendered_review':'NOT PERFORMED; PLAN ONLY'},ensure_ascii=False,indent=2))
