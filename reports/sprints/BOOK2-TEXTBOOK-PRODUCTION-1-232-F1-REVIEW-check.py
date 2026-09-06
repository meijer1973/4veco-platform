"""Distinct plan-review probes, not a pupil generator or a general NLP grader.

HOW TO ADAPT: change explicit paragraph/baseline/line contracts only in a newly
authorized review. The full human review is in the accompanying report. This
program independently derives mathematical/geometry contracts and challenges
specific missing/misleading reasoning chains; fixtures are not learner evidence.
Reads only; complete results go to the caller's exclusive process record.
"""
from pathlib import Path
from fractions import Fraction as F
from hashlib import sha256
import subprocess, json, re, math, copy

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
REL = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md'
PREFIX = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW'
raw = (L / REL).read_bytes()
s = raw.decode('utf-8')
flat = lambda t: re.sub(r'\s+', ' ', t).strip()
hashof = lambda b: sha256(b).hexdigest()
checks, probes = [], []

def ck(name, condition, value=None):
    assert condition, name
    checks.append({'id': name, 'pass': True, 'evidence': value})

def block(text, start, end):
    assert text.count(start) == 1, start
    return text.split(start, 1)[1].split(end, 1)[0]

def negative(name, function, original, mutant, rationale):
    assert original != mutant, name + ': mutation did not happen'
    assert function(original), name + ': original not accepted'
    assert not function(mutant), name + ': mutant wrongly accepted'
    probes.append({'id': name, 'rejected': True, 'rationale': rationale,
                   'original_sha256': hashof(original.encode()), 'mutant_sha256': hashof(mutant.encode())})

ck('exact-complete-plan', hashof(raw) == 'd0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935', {'raw_sha256': hashof(raw), 'lines': len(s.splitlines())})
delta = json.loads((P / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-allowed-delta.json').read_text('utf-8'))
oldraw = subprocess.check_output(['git', 'show', delta['source_commit'] + ':' + REL], cwd=L)
ck('original-plan', hashof(oldraw) == delta['original_raw_lf_sha256'])
forward = oldraw.decode().splitlines(keepends=True)
for h in reversed(delta['hunks']):
    at = h['old_start'] - (1 if h['old_count'] else 0)
    ck('hunk-original-' + str(h['old_start']), [x.rstrip('\n') for x in forward[at:at+h['old_count']]] == h['old'])
    forward[at:at+h['old_count']] = [x+'\n' for x in h['replacement']]
ck('independent-forward-nine-hunks', len(delta['hunks']) == 9 and ''.join(forward).encode() == raw)
reverse = s.splitlines(keepends=True)
for h in reversed(delta['hunks']):
    at = h['new_start'] - (1 if h['new_count'] else 0)
    ck('hunk-successor-' + str(h['new_start']), [x.rstrip('\n') for x in reverse[at:at+h['new_count']]] == h['replacement'])
    reverse[at:at+h['new_count']] = [x+'\n' for x in h['old']]
ck('independent-reverse-nine-hunks', ''.join(reverse).encode() == oldraw)

def find_record(v):
    if isinstance(v, dict):
        if v.get('id') == '2.3.2': return v
        for x in v.values():
            found = find_record(x)
            if found is not None: return found
    if isinstance(v, list):
        for x in v:
            found = find_record(x)
            if found is not None: return found

registry = json.loads((P / 'references/authored/course-target-exercises.json').read_text('utf-8'))
record = find_record(registry)
appendix = json.loads(block(s, '```json\n', '\n```'))
serialize = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':')).encode()
ck('entire-target-order-bytes', serialize(appendix) == serialize(record))
ck('target-frozen-hash', hashof(serialize(record)) == '54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce')
ck('target-11-and-2-2-3-2-2', 'unchanged 11 points2/2/3/2/2' in s and 'e sign/change argument for maximum1' in s)

# Independently parse six scene endpoints and domains from the actual plan,
# derive slopes/intersections, both substitutions, areas and all-domain proof.
scene_re = re.compile(r'^\| (Tulips|Towels|Seedlings|Candles|Fruit bars|Concert) [^|]+\| (\d+)/(\d+) \| \(0,(\d+)\),\((\d+),0\) \| \(0,(\d+)\),\((\d+),(\d+)\) \| \((\d+),(\d+)\)/\(([\d.]+),([\d.]+)\) \|$', re.M)
models, geometry = {}, []
def edge_clearance(poly, x, y):
    # Polygon orientation independent perpendicular distance to each edge.
    cross = []
    for (ax, ay), (bx, by) in zip(poly, poly[1:] + poly[:1]):
        cross.append(((bx-ax)*(y-ay)-(by-ay)*(x-ax))/math.hypot(bx-ax, by-ay))
    if min(cross) >= -1e-9: return min(cross)
    if max(cross) <= 1e-9: return -max(cross)
    return -1

for m in scene_re.finditer(s):
    name = m[1]
    qmax,pmax,a,demand_end,c,supply_end,supply_high,planned_q,planned_p = map(F, m.groups()[1:10])
    ck(name+'-domain', demand_end == supply_end == qmax)
    b=a/qmax; d=(supply_high-c)/qmax; k=b+d
    q=(a-c)/k; p=a-b*q
    cs=q*(a-p)/2; ps=q*(p-c)/2; ts=cs+ps
    ck(name+'-both-equations', c+d*q == p and (q,p) == (planned_q,planned_p))
    ck(name+'-positive-domain-intersection', 0 < q < qmax and b>0 and d>0 and c>0)
    ck(name+'-sum-area', ts == q*(a-c)/2 and cs>0 and ps>0)
    # Algebraic coefficient identity: T(qe)-T(x)=k/2*(x-qe)^2;
    # since k>0 this establishes a GLOBAL unique maximum, not local samples.
    ck(name+'-global-identity', k*q == a-c and ts == k*q*q/2)
    points=[]
    for x in [F(0), q/2, q, (q+qmax)/2, qmax]:
        value=(a-c)*x-k*x*x/2
        ck(name+'-global-witness-'+str(x), ts-value == k*(x-q)**2/2)
        points.append({'Q':str(x),'marginal_gap':str(a-c-k*x),'total_surplus':str(value),'loss_from_maximum':str(ts-value)})
    px=lambda x: F(180)+F(900)*x/qmax
    py=lambda y: F(720)-F(540)*y/pmax
    ck(name+'-actual-planned-E-coordinate', abs(float(px(q))-float(m[11])) < 1e-6 and abs(float(py(p))-float(m[12])) < 1e-6)
    cs_poly=[(float(px(0)),float(py(a))),(float(px(0)),float(py(p))),(float(px(q)),float(py(p)))]
    ps_poly=[(float(px(0)),float(py(p))),(float(px(0)),float(py(c))),(float(px(q)),float(py(p)))]
    small,oversized=[],[]
    x=F(15,100)*q
    for label, poly, ordinate in [('CS',cs_poly,(p+a-b*x)/2),('PS',ps_poly,(p+c+d*x)/2)]:
        center=(float(px(x)),float(py(ordinate)))
        margin=min(edge_clearance(poly,center[0]+sx*30,center[1]+sy*24) for sx in [-1,1] for sy in [-1,1])
        bad=min(edge_clearance(poly,center[0]+sx*60,center[1]+sy*24) for sx in [-1,1] for sy in [-1,1])
        ck(name+'-'+label+'-60x48-planned-envelope', margin >= 12, {'minimum_edge_clearance_px':margin})
        small.append(margin);oversized.append(bad)
    geometry.append({'scene':name,'E_source':[str(px(q)),str(py(p))],'CS_PS_60x48_min_clearance':small,'oversized120x48_clearance':oversized,'actual_glyphs_rendered':False})
    models[name]={'a':a,'b':b,'c':c,'d':d,'k':k,'Qmax':qmax,'Qe':q,'Pe':p,'CS':cs,'PS':ps,'TS':ts,'global_witnesses':points}
ck('six-parsed-scenes', len(models)==6)
ck('oversized-label-negative', any(min(v['oversized120x48_clearance'])<12 for v in geometry))

comparisons=[]
for name,quantities in [('Tulips',[16,48]),('Towels',[10,14]),('Seedlings',[4]),('Candles',[20,28]),('Fruit bars',[32,48]),('Concert',[50,70])]:
    v=models[name]
    for q in quantities:
        w=v['a']-v['b']*q;mc=v['c']+v['d']*q
        comparisons.append({'scene':name,'Q':q,'WTP':str(w),'MC':str(mc),'gap':str(w-mc)})
ck('eleven-distinct-marginal-rows', len(comparisons)==11)
v=models['Concert']
point=v['a']-v['c']-v['k']*50
finite=(v['a']-v['c'])-v['k']*F(101,2)
ck('target-point-not-finite-integral', point==F(15,2) and finite==F(57,8) and point!=finite, {'point50':str(point),'finite50to51':str(finite)})
ck('untraded-70-supply-MC', v['c']+v['d']*70==F(45,2) and 70>v['Qe'])

def gaps(w,p,c): return [F(w)-F(p),F(p)-F(c),F(w)-F(c)]
individuals={'umbrella':gaps(18,10,7),'start-bell':gaps(15,10,7),
 'mug-original':gaps(18,14,10),'mug-WTP-only':gaps(20,14,10),
 'mug-MC-only':gaps(18,14,13),'mug-both':gaps(20,14,13),
 'bonus-original':gaps(22,14,9),'bonus16':gaps(22,16,9),'bonus17':gaps(22,17,9)}
ck('mug-combined-loss-not-two-gains', individuals['mug-both'][2]-individuals['mug-original'][2]==-1)
ck('bonus-transfer-cancels', len({tuple(v)[2] for n,v in individuals.items() if n.startswith('bonus')})==1)
bonus_samples=[]
for price in [F(8),F(9),F(19,2),F(14),F(16),F(17),F(43,2),F(22),F(23)]:
    cs,ps,ts=gaps(22,price,9)
    eligible=price!=14 and cs>0 and ps>0
    ck('bonus-feasible-'+str(price), eligible==(9<price<22 and price!=14))
    bonus_samples.append({'price':str(price),'CS_PS_TS':list(map(str,[cs,ps,ts])),'valid_alternative':eligible})
start_price=F(24+8,4);start_q=24-2*start_price
ck('start-equilibrium-both', start_price==8 and start_q==2*start_price-8==8)
ck('interval-retrieval', F(130-100,15-10)==6 and F(62-38,10-4)==4)
ck('triangle-retrieval-and-source-selection', F(4)*(10-6)/2==8 and 20*8==160)
ck('closing-purchase-only-CS', sum(max(F(0),F(w)-6) for w in [9,6,3])==3 and sum(w>=6 for w in [9,6,3])==2)

# Local, bounded semantic clause tests on ACTUAL model answers. No exact-file
# hash is part of these predicates. Missing/incorrect content must fail for its
# operation, not simply because any byte changed. Whitespace edits must pass.
answer3=block(s,'Full answer3c: "','"\nThree formative criteria:')
answer4=block(s,'Full answer4d: "','"\nThree formative criteria,')
def chain3(t):
    t=flat(t)
    parts=['Voor0≤Q<6 ligt de vraaglijn boven de aanbodlijn',
      'betalingsbereidheid is hoger dan MK, dus extra transacties voegen surplus toe',
      'BijQ6 zijn beide12 euro per plant; het marginale verschil is0, maar TS is36',
      'Voor6<Q≤18 ligt vraag onder aanbod', 'extra transacties verlagen TS',
      'VóórQ6 stoppen laat positieve bijdragen liggen; naQ6 doorgaan voegt negatieve bijdragen toe',
      'maximaal36 euro bijQ6 binnen0≤Q≤18', 'toedeling en geen externe effecten of transactiekosten',
      'geen norm voor een eerlijke verdeling', 'niet alle omstandigheden die voor maatschappelijke welvaart']
    return all(x in t for x in parts)
def chain4(t):
    t=flat(t)
    return all(x in t for x in ['Voor0≤Q<24 ligt de vraaglijn boven de aanbodlijn',
      'betalingsbereidheid is hoger dan MK', 'BijQ24 zijn beide14 euro per kaars en is het marginale verschil0',
      'Voor24<Q≤52 ligt vraag onder aanbod', 'betalingsbereidheid lager dan MK en verlagen TS',
      'Eerder stoppen laat positieve bijdragen liggen; verder doorgaan voegt negatieve bijdragen toe',
      'maximaal216 euro bijQ24 binnen dit bereik, niet0',
      'toedeling en geen externe effecten of transactiekosten',
      'geen norm voor een eerlijke verdeling', 'andere omstandigheden die maatschappelijke welvaart bepalen buiten beeld'])
ck('actual-full-written-model3', chain3(answer3))
ck('actual-full-written-model4', chain4(answer4))
ck('chain-predicate-not-hash-rejector', chain3('\n'+flat(answer3)+'\n') and chain4('  '+flat(answer4)+' '))
mutations3=[('only-sampled-domain','0≤Q<6','Q4'),('omit-after-range','6<Q≤18','Q8'),
 ('sign-reversal','vraaglijn boven','vraaglijn onder'),('zero-total-conflation','maar TS is36','maar TS is0'),
 ('wrong-equality-price','beide12 euro','beide18 euro'),('missing-gains-left','positieve bijdragen\nliggen','onbenoemde bijdragen'),
 ('missing-losses-added','negatieve bijdragen toe','positieve bijdragen toe'),('wrong-maximum','maximaal36','maximaal72'),
 ('domain-extrapolation','bijQ6 binnen0≤Q≤18','bijQ6 voor alle mogelijke markten'),
 ('no-allocation','toedeling en geen externe effecten of transactiekosten','geen externe effecten of transactiekosten'),
 ('unconditional-externalities','geen externe effecten','ook externe effecten'),('fairness-inference','geen norm voor','een norm voor'),
 ('complete-welfare-inference','niet alle omstandigheden','alle omstandigheden')]
for name,a,b in mutations3:
    negative('3c-'+name,chain3,answer3,answer3.replace(a,b),a+' → '+b)
negative('3c-bare-equality',chain3,answer3,'Vraag=aanbod bij6, dus TS is maximaal en eerlijk.','Equality alone supplies neither whole-domain aggregate argument nor boundary.')
negative('3c-local-two-values',chain3,answer3,'BijQ4 is WTP14 en MK10. Positief4. BijQ8 is het negatief. Dus maximaal6.','Two examples alone do not express the requested whole-range argument.')
mutations4=[('prefix-range-truncated','0≤Q<24','20≤Q<24'),('suffix-range-truncated','24<Q≤52','24<Q≤28'),
 ('wrong-sign','vraaglijn boven','vraaglijn onder'),('wrong-total','maximaal216','maximaal0'),
 ('aggregate-omitted','Eerder stoppen laat positieve\nbijdragen liggen; verder doorgaan voegt negatieve bijdragen toe.','Vraag en aanbod zijn gelijk.'),
 ('fixed-trade-substitution','maximaal216 euro bijQ24 binnen dit bereik, niet0','de ene mok levert7 in plaats van8 op'),
 ('missing-cost-boundary','geen externe effecten\nof transactiekosten','geen afwijkende smaak'),
 ('fairness-omitted','geen norm voor een eerlijke verdeling','geen oordeel over lijnkleur'),
 ('complete-welfare-omitted','andere omstandigheden die maatschappelijke welvaart bepalen buiten beeld','geen andere omstandigheden buiten beeld')]
for name,a,b in mutations4:
    negative('4d-'+name,chain4,answer4,answer4.replace(a,b),a+' → '+b)

guided3=block(s,'c) "Waarom is TS bij deze plantjes','Full answer3c:')
guided4='d) "Leg in een samenhangende uitleg'+block(s,'d) "Leg in een samenhangende uitleg','Full answer4d:')
writing3=lambda t: all(x in flat(t) for x in ['vul de zinnen aan','Schrijf daarna de laatste zin in eigen woorden','Voor0≤Q<6','Voor6<Q≤18','Stoppen vóórQ6','onder ...','eerlijk','maatschappelijk'])
writing4=lambda t: all(x in flat(t) for x in ['samenhangende uitleg','0≤Q≤52','Only reduced printed cue','marginale vergelijking over het hele bereik','No sentence starters, interval table, completed signs or numbered answer steps are supplied','Their written argument, not two isolated rows'])
negative('3c-recognition-is-not-written-operation',writing3,guided3,guided3.replace('vul de zinnen aan','kies alleen de juiste letter'),'Selecting a letter does not practise constructing the full explanation.')
negative('4d-completed-sign-table-not-reduced',writing4,guided4,guided4.replace('No sentence starters, interval\ntable, completed signs or numbered answer steps are supplied','A completed sign table and every answer step are supplied'),'Already-filled reasoning would not be reduced written practice.')
negative('4d-writing-operation-removed',writing4,guided4,guided4.replace('Their written argument, not two isolated rows','Only two isolated rows'),'The pupil must write the connected argument.')
mapping=block(s,'| G4 / e domain-wide','### Model conditions')
mapping_ok=lambda t: all(x in flat(t) for x in ['3c explicit written scaffold →4d reduced written cue','5 is not maximum practice','6e, then unchanged8e'])
negative('false-mapping-fixed-trade',mapping_ok,mapping,mapping.replace('5 is not maximum practice','5 supplies full maximum practice'),'Fixed-unit WTP/MC changes cannot replace quantity-wide maximum practice.')

# Whole-plan contracts distinct from exact custody; real local source mutations.
contracts={
 'full-supply': ['Supply is the MC of each successive unit over the entire domain, including units not traded at equilibrium'],
 'interval-boundary': ['not a derivation from an individual firm\'s profit-maximizing choice or from a coarse213 interval average'],
 'no-profit': ['Never assume absent fixed-cost data mean zero'],
 'paper-target': ['no E,price20,CS orPS solution marking','No prompt expansion or embedded target answers'],
 'prerequisite-gate': ['after accepted213 binding','accepted five-input succession/current QC/root handoff still PENDING'],
 'runtime-pending': ['No plan-coordinate calculation is a render or visual review PASS','never overwrite any failed/PENDING proof'],
 'placed-font': ['Minimum actual SVG font40 CSSpx =30pt source','Body/table/caption/footer≥12pt'],
 'alt-caption': ['functional short alternative remains <=120 characters','full caption remains visible'],
 'core-optional': ['Core54','Guided20→74; bonus9→83; closing5→88','UNOBSERVED'],
}
for name,clauses in contracts.items():
    predicate=lambda text, clauses=clauses: all(flat(c) in flat(text) for c in clauses)
    ck('actual-contract-'+name,predicate(s))
    target=clauses[0]
    # Replace the actual clause despite its native line wrapping, once only.
    pat=r'\s+'.join(map(re.escape,target.split()))
    mutant,n=re.subn(pat,'[withheld contract in negative fixture]',s,count=1)
    ck('actual-mutation-location-'+name,n==1)
    negative('missing-contract-'+name,predicate,s,mutant,'Remove only the named actual source clause, not a hash guard.')

times={'core':[2,13,7,2,6,13,11],'guided':[4,4,4,4,4],
 '3c':[F('0.7'),F('0.6'),F('2.1'),F('0.6')],
 '4d':[F('0.5'),F('0.7'),F('2.2'),F('0.6')],
 'Start1':[F('.7'),F('1.4'),F('.2'),F('.8'),F('.4')],
 'Start2':[F('.4'),F('.6'),0,1,F('.5')],
 'independent6':[F('1.5'),3,2,F('3.5'),1],
 'independent7':[F('.4'),F('.2'),0,1,F('.4')],
 'target8':[F('1.5'),3,2,F('3.5'),1]}
ck('core-complete-load',sum(times['core'])==54)
ck('support-not-hidden',sum(times['guided'])==20 and sum(times['3c'])==sum(times['4d'])==4)
ck('question-load',sum(times['Start1'])+sum(times['Start2'])==6 and sum(times['independent6'])+sum(times['independent7'])==13 and sum(times['target8'])==11)
ck('all-route-not-one-lesson',54+20==74 and 74+9==83 and 83+5==88)
font=F(40,1200)*166/F('25.4')*72
ck('font-conversion',font==F(1992,127) and font>12 and F(40)*72/96==30, {'source_pt':'30','placed_pt':str(font),'placed_decimal':float(font)})
def luminance(hexcolor):
    srgb=[int(hexcolor[i:i+2],16)/255 for i in [1,3,5]]
    v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in srgb]
    return sum(a*b for a,b in zip(v,[.2126,.7152,.0722]))
bg=luminance('#F7FAFC')
contrasts={c:(bg+.05)/(luminance(c)+.05) for c in ['#2D3748','#1A5276','#1E8449']}
ck('essential-planned-contrast',min(contrasts.values())>4.5,contrasts)
assets=[]
for line in s.splitlines():
    if re.match(r'^\| 2\.3\.2_(fig|we|ex)_\d+ \|',line):
        stem,caption,alt,role=[v.strip() for v in line.split('|')[1:-1]]
        ck(stem+'-distinct-functional-alt',alt!=caption and 0<len(alt)<=120 and not re.match(r'(?i)(bekijk|zie|kijk|lees|teken)\b',alt),{'alt':alt,'characters':len(alt),'caption':caption,'role':role})
        assets.append(stem)
ck('fourteen-unique-native-pairs',len(assets)==len(set(assets))==14)
ck('native-packet-and-ZIP',12+2*len(assets)==40 and [3+2*n for n in [11,5,5]]==[25,13,13])

result={'status':'PASS','role':'independent232F1PlanReviewer','actual_actor':'paragraph_214_builder',
 'plan_sha256':hashof(raw),'original_review_preserved':'9f9c69c0bce19dc42d5f958bd665a5fcde8fa5d65be638cf34b37e043803c875',
 'checks':checks,'checks_count':len(checks),'negative_probes':probes,'negative_count':len(probes),
 'models':models,'marginal_rows':comparisons,'individuals':individuals,'bonus_feasibility_cases':bonus_samples,
 'geometry_planned_only':geometry,'timing_rows':times,'native_assets_planned_only':assets,
 'limits':['Fixtures are not learner responses or an NLP rubric.', 'Human full-plan and answer review remains distinct.',
 'No native232 artifact, rendering, visual PASS, QC, handoff, root acceptance or production release.',
 'Actual accepted213 prerequisite succession is PENDING in this frozen input.', '54/74/83/88 minutes UNOBSERVED.']}
print(json.dumps(result,ensure_ascii=False,indent=2,default=str))
