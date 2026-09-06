"""Independent 233 PLAN reviewer arithmetic, actual-clause and counterexample checks.
Read-only. Polygon shoelace and endpoint algebra are independently implemented;
no import of the author checker. Bounded predicates are not a semantic grader.
"""
import hashlib
import json
import re
from fractions import Fraction as F
from pathlib import Path

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
REL = ('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/'
       '2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3-textbook-plan.md')
def data(root, rel):
    return Path('\\\\?\\' + str(root / rel)).read_bytes()
sha = lambda b: hashlib.sha256(b).hexdigest()
norm = lambda s: re.sub(r'\s+', ' ', s).strip()
compact = lambda s: re.sub(r'\s+', '', s)
raw = data(L, REL)
text = raw.decode('utf-8').replace('\r\n', '\n')
checks = []
def require(ok, label):
    assert ok, label
    checks.append(label)

record = next(v for v in json.loads(data(P, 'references/authored/course-target-exercises.json'))['exercises'] if v['id'] == '2.3.3')
serialized = json.dumps(record, ensure_ascii=False, separators=(',', ':')).encode()
require(sha(raw) == '0870d848b21017fedde86fb8d738bbe6afa21f68f8c1190905a8c0f2e3b8be19', 'exact whole candidate bytes')
require(sha(serialized) == 'eae9bcd6af7483a7ac9ccb2c57d5332b8cb96cd058853ac7ed9e25a3bdb5b0b2', 'entire record fields/order')
appendix = json.loads(text.split('```json\n', 1)[1].split('```', 1)[0])
require(appendix == record, 'entire actual appendix equals actual frozen registry')
pts = [v['points'] for v in record['target_exercise']['subquestions']]
require(pts == [2, 3, 4, 4, 2, 2] and sum(pts) == 17, 'six target questions seventeen points')
require(len(record['lesson_goals']) == 4 and len(record['target_exercise']['sources']) == 1, 'four whole goals one supplied source')

def area(vertices):
    # General polygon shoelace, not author rectangle/triangle derivation.
    return abs(sum(x*y2-x2*y for (x,y),(x2,y2) in zip(vertices, vertices[1:]+vertices[:1]))) / 2

names = ['Thermosflessen', 'Puzzeldozen', 'Notitieboekjes', 'Drinkbekers', 'Fotolijstjes', 'Concertkaartjes']
markets, geometry, numeric_probes = [], [], []
for name in names:
    rows = [line.strip('|').split('|') for line in text.splitlines() if line.startswith('|'+name)]
    require(len(rows) == 2, name+' endpoint and ledger rows')
    g, actual = rows
    qmax, pmax = map(F, g[1].split('/'))
    points = lambda s: [tuple(map(F, p.split(','))) for p in re.findall(r'\(([^)]+)\)', s)]
    D, S = points(g[2]), points(g[3])
    ds=(D[1][1]-D[0][1])/(D[1][0]-D[0][0]); ss=(S[1][1]-S[0][1])/(S[1][0]-S[0][0])
    demand=lambda q:D[0][1]+ds*(q-D[0][0])
    supply=lambda q:S[0][1]+ss*(q-S[0][0])
    a,c=demand(0),supply(0)
    qe=(a-c)/(ss-ds); pe=demand(qe)
    price,q=map(F,g[5].split('/'))
    qd=(price-a)/ds; qs=(price-c)/ss
    w,m=demand(q),supply(q)
    require(points(g[4]) == [(qe,pe)] and supply(qe)==pe, name+' equilibrium both curves')
    require(D[0][0]==S[0][0]==0 and D[1][0]==S[1][0]==qmax and demand(qmax)==0 and max(a,supply(qmax))<=pmax, name+' complete bounded domain')
    require(0<q<min(qd,qs,qe) and w>price>m>0, name+' actual source-selected trades feasible')
    cs=area([(F(0),a),(q,w),(q,price),(F(0),price)])
    ps=area([(F(0),price),(q,price),(q,m),(F(0),c)])
    loss=area([(q,w),(q,m),(qe,pe)])
    fcs=area([(F(0),a),(qe,pe),(F(0),pe)])
    fps=area([(F(0),pe),(qe,pe),(F(0),c)])
    csrect=q*(w-price); psrect=q*(price-m)
    cstri=cs-csrect; pstri=ps-psrect
    nw,nm=demand(q+1),supply(q+1)
    ledger=[qd,qs,w,m,csrect,cstri,cs,psrect,pstri,ps,cs+ps,loss,fcs,fps,fcs+fps,qe-q,w-m,nw,nm,nw-price,price-nm]
    observed=[F(v) for cell in actual[1:] for v in cell.split('/')]
    require(len(ledger)==len(observed)==21, name+' complete 21-cell ledger')
    for i,(calc,printed) in enumerate(zip(ledger,observed)):
        require(calc==printed, name+': ledger '+str(i+1))
        changed=observed.copy(); changed[i]+=F(1,4)
        require(changed!=ledger, name+': misleading numeric fixture '+str(i+1))
        numeric_probes.append({'scene':name,'cell':i+1,'incorrect':str(changed[i]),'rejected':True})
    require(cs+ps+loss==fcs+fps, name+' separate polygon sum reference')
    require(cs+ps==(a-c)*q+(ds-ss)*q*q/2, name+' independent integrated gap')
    require(loss==(ss-ds)*(q-qe)**2/2, name+' whole-domain maximum identity')
    require(nw>price>nm, name+' next two parties gain at unchanged price')
    x=180+780*F(22,100)*q/qmax
    qright=F(22,100)*q+42*qmax/780
    margins=[]
    for region in ['CS','PS']:
        edge=demand(qright) if region=='CS' else supply(qright)
        y=720-540*(price+edge)/2/pmax
        for dx in [-42,42]:
            for dy in [-36,36]:
                xx,yy=x+dx,y+dy
                Q=(xx-180)*qmax/780; v=(720-yy)*pmax/540
                low,high=(price,demand(Q)) if region=='CS' else (supply(Q),price)
                require(0<=Q<=q and low<=v<=high, name+' full expanded '+region+' corner '+str((dx,dy)))
                margins.append(min(v-low,high-v)*540/pmax)
    # E offset specifies no text anchor. Demonstrate a feasible baseline-anchor E
    # envelope (not measured ink / current visual PASS), and retain later check.
    ex=180+780*qe/qmax+90; ey=720-540*pe/pmax-70
    priceY=720-540*price/pmax
    baseline_clearance=priceY-ey-2
    geometry.append({'scene':name,'CS_PS_expanded_corners':16,'minimum_extra_margin_px':str(min(margins)),
                     'E_nominal_baseline':list(map(str,[ex,ey])),'E_baseline_to_price_stroke_px':str(baseline_clearance),
                     'actual_glyph_anchor_and_leader_inspection':'PENDING; no measured current figure'})
    markets.append({'scene':name,'inverse_demand':[str(a),str(ds)],'MC':[str(c),str(ss)],'domain':[str(qmax),str(pmax)],
                    'equilibrium':[str(qe),str(pe)],'actual':str(q),'price':str(price),'independent_21_ledger':list(map(str,ledger))})

# Require actual meaningful clauses in their own stage, then remove/mislead them
# in memory. Whitespace variation remains valid: no entire-file hash predicate.
contracts = [
 ('guided definition','Opgave3 (8 minutes','Opgave4 (8 minutes','Vul aan: Pareto-efficiënt betekent dat geen'),
 ('guided allocation','Opgave3 (8 minutes','Opgave4 (8 minutes','benoem welke kopers/aanbieders handelen en waarom.'),
 ('guided actual-area rationale','Opgave3 (8 minutes','Opgave4 (8 minutes','waarom is12 de basis?'),
 ('guided tracing','Opgave3 (8 minutes','Opgave4 (8 minutes','Trek met je potlood de al gemarkeerde verliesdriehoek na; wijs basis en hoogte aan'),
 ('guided feasible premise','Opgave3 (8 minutes','Opgave4 (8 minutes','technisch mogelijk want'),
 ('guided cost premise','Opgave3 (8 minutes','Opgave4 (8 minutes','geen extra regelkosten want'),
 ('guided existing people','Opgave3 (8 minutes','Opgave4 (8 minutes','bestaande partijen'),
 ('guided fairness argument','Opgave3 (8 minutes','Opgave4 (8 minutes','geen van beide bewijst eerlijkheid, want'),
 ('reduced no solutions','Opgave4 (8 minutes','Opgave5 (4 minutes','No given intermediate quantities, signs, split table or sentence starters'),
 ('reduced definition','Opgave4 (8 minutes','Opgave5 (4 minutes','Definieer Pareto-efficiëntie binnen dit model.'),
 ('reduced source selection','Opgave4 (8 minutes','Opgave5 (4 minutes','verklaar werkelijkeQ en toedeling.'),
 ('reduced writing/shading','Opgave4 (8 minutes','Opgave5 (4 minutes','arceer het verlies in de geleverde grafiek en benoem basis/hoogte.'),
 ('reduced person-level test','Opgave4 (8 minutes','Opgave5 (4 minutes','Toets de elfde transactie op Paretoverbetering'),
 ('reduced aggregate/fairness distinction','Opgave4 (8 minutes','Opgave5 (4 minutes','Waarom volgen een Paretoverbetering en eerlijkheid niet uitsluitend uit een hoger totaal?'),
 ('combined constraints','Opgave5 (4 minutes','#### 4. Zelfstandige oefening','booking cap5 AND technical capacity5'),
 ('combined change conclusion','Opgave5 (4 minutes','#### 4. Zelfstandige oefening','all actual constraints must allow trade'),
 ('independent complete model','Opgave6 (12 minutes','#### 5. Doeloefening','CS=18×1+½×18×9=18+81=99'),
 ('independent target-shaped marking','Opgave6 (12 minutes','#### 5. Doeloefening','Arceer het verlies in de geleverde grafiek; benoem basis en hoogte.'),
 ('independent unsupported','Opgave6 (12 minutes','#### 5. Doeloefening','All requested explanation/marking is unsupported here before the target.'),
 ('target provided fullsource','Opgave7 (14 minutes','#### 6. Denkertje','exact0..100/0..50 curves,freeE60/20,P25,q40'),
 ('target no reveal','Opgave7 (14 minutes','#### 6. Denkertje','no DWL shading or solved base/height/area'),
 ('target missing triangle','Opgave7 (14 minutes','#### 6. Denkertje','Shade triangle(40,30),(40,15),(60,20)'),
 ('target lossheight','Opgave7 (14 minutes','#### 6. Denkertje','height30−15=15€/kaartje'),
 ('target fixedprice nonrestoration','Opgave7 (14 minutes','#### 6. Denkertje','not full restoration to60 atP25 or total150 recovered'),
 ('PS unknownprofit','Non-goals:','### Complete instruction','PS is not profit: absent fixed costs are unknown, not zero.'),
 ('DWL definition','T4 (2 minutes)','T5 (2 minutes)','van de gekozen efficiënte referentie en het werkelijk bereikte totaal'),
 ('Pareto noharm definition','T1 (2 of12','T2 (2 minutes)','minstens één persoon beter af en niemand slechter af'),
 ('teaching fixedprice limit','T5 (2 minutes)','### Complete seven-stage','At fixed18, Qd14 still limits trades below free16'),
 ('native actualparity','Later actual source guards','## Appendix A','preserve every42native file,all ZIP members and every raw/decoded rendered page pixel'),
 ('native immutable pending','Later actual source guards','## Appendix A','never overwrite failed/PENDING evidence. Initial manifests stayPENDING.'),
 ('native no planvisualpass','Later actual source guards','## Appendix A','not a plan-geometry PASS')
]
contracts += [
 ('actual accepted-input prerequisite','### Canonical semantics','### Holds and current-action effect','Missing, forged, stale or PENDING input must stop.'),
 ('not speculative accepted232','### Canonical semantics','### Holds and current-action effect','A plan is not taught or accepted material.'),
 ('source unitMC full domain','### Model, sources','### Complete instruction','including untraded units'),
 ('source allocation and no costs','### Model, sources','### Complete instruction','Highest-WTP buyers and lowest-MC suppliers receive/provide actual units'),
 ('source unchanged old benefits','### Model, sources','### Complete instruction',"their participants' benefits remain unchanged; nobody bears hidden costs."),
 ('bonus genuine critique','Opgave8 (optional10','#### 7. Herhaling','Beoordeel beide conclusies en wijs op een betrokken groep.'),
 ('bonus oldseller loss model','Opgave8 (optional10','#### 7. Herhaling','so each loses2'),
 ('bonus normative criterion','Opgave8 (optional10','#### 7. Herhaling','(3) rejects automatic fairness using a separate normative boundary'),
 ('actual placed minimum type','### Native outputs','## Author verification','Body/table/caption/footer≥12pt'),
 ('functional alt not caption','### Native outputs','## Author verification','Full visible captions separated from functional noun-first short alt≤120'),
 ('archive safe exact assets','### Native outputs','## Author verification','no scripts,duplicate,traversal,absolute paths, stale extras or answer leaks'),
 ('actual input fail before effects','### Native outputs','## Author verification','before subprocesses/writes;missing/forged/stale/partial acceptance fails closed'),
 ('honest full timing','### Honest whole-lesson','### Native outputs','All times UNOBSERVED.'),
 ('explicit supported extra time','### Honest whole-lesson','### Native outputs','This exceeds a single lesson when support is used;plan additional class time or home completion.')
]
semantic=[]
for label,start,end,clause in contracts:
    require(text.count(start)==1 and text.count(end)>=1, 'actual unique start '+label)
    section=text.split(start,1)[1].split(end,1)[0]
    predicate=lambda value: compact(clause) in compact(value)
    require(predicate(section), 'actual clause '+label)
    require(predicate(norm(section)), 'formatting positive '+label)
    pattern=re.compile(r'\s*'.join(re.escape(ch) for ch in compact(clause)))
    match=pattern.search(section)
    require(match is not None, 'real occurrence '+label)
    for kind,replacement in [('missing',''),('misleading','Dit is niet nodig; herken alleen het gegeven antwoord.')]:
        changed=section[:match.start()]+replacement+section[match.end():]
        require(not predicate(changed), kind+' rejected '+label)
        semantic.append({'clause':label,'kind':kind,'actual_clause':clause,'rejected':True})

counterexamples=[]
def counter(label, actual, expected):
    require(actual==expected, label)
    counterexamples.append({'case':label,'actual':str(actual),'expected':str(expected)})
counter('booking actual40 not minQdQs50',min(F(50),F(80),F(40),F(60)),F(40))
counter('same40 trades but buyers10to50 giveCS400 not600',F(25)*40-F(1,4)*(50**2-10**2),F(400))
counter('same40 trades but suppliers10to50 givePS500 not600',F(20)*40-F(1,8)*(50**2-10**2),F(500))
counter('CS triangle-only omits rectangle200',F(600)-F(400),F(200))
counter('PS triangle-only omits rectangle400',F(600)-F(200),F(400))
counter('price-as-height would falsely give250',F(20)*25/2,F(250))
counter('target point41 gain differs from integrated40to41',F('14.25') != (F(45)-F('0.75')*F('40.5')),True)
counter('target integrated40to41 amount',F(45)-F('0.75')*F('40.5'),F('14.625'))
counter('full target missing20area150',area([(F(40),F(30)),(F(40),F(15)),(F(60),F(20))]),F(150))
counter('fixedP25 demand bound not free60',(F(50)-25)/F('.5'),F(50))
counter('bonus actualQ14 at unchanged18',min((F(32)-18), (F(18)-8)/F('.5'), F(16)),F(14))
counter('bonus actual total189 not192',F(24)*14-F('1.5')*14*14/2,F(189))
counter('bonus remaining loss3',F(192)-189,F(3))
counter('bonus old12 sellers lose2 each',12*(F(16)-18),F(-24))
counter('fixedcost not zero: samePS84 could imply loss16',F(84)-100,F(-16))
counter('purchase zero-surplus buyer included',sum(v>=7 for v in [10,7,4]),2)
counter('closing purchased surplus3',sum(max(v-7,0) for v in [10,7,4]),3)
counter('closing excessdemand10',(F(30)-2*5)-(3*5-5),F(10))
def pareto(book,capacity,price,wtp,mc,oldloss=0,cost=0):
    return book>=6 and capacity>=6 and wtp>=price>=mc and wtp>mc and oldloss==0 and cost==0
for label,args,want in [('only capacity',(5,6,9,12,7),False),('only booking',(6,5,9,12,7),False),
                        ('both costless',(6,6,9,12,7),True),('third party cost',(6,6,9,12,7,0,1),False),
                        ('old participant loss',(6,6,9,12,7,1),False),('unwilling extra buyer',(6,6,13,12,7),False),
                        ('unwilling supplier',(6,6,6,12,7),False)]:
    counter('feasible Pareto '+label,pareto(*args),want)

time_rows={}
for line in text.splitlines():
    cells=[c.strip() for c in line.strip('|').split('|')]
    if cells and cells[0] in ['Start1','Start2','Independent6','Target7','Guided3','Guided4','Guided5','Bonus8','Closing9','Closing10']:
        nums=list(map(F,cells[1:]))
        require(sum(nums[:-1])==nums[-1], 'complete read calculate graph write check time '+cells[0])
        time_rows[cells[0]]=nums[-1]
require(len(time_rows)==10,'all actual question-level time rows')
core=2+12+8+2+time_rows['Start1']+time_rows['Start2']+time_rows['Independent6']+time_rows['Target7']
support=sum(time_rows[k] for k in ['Guided3','Guided4','Guided5'])
require([core,core+support,core+support+time_rows['Bonus8'],core+support+time_rows['Bonus8']+time_rows['Closing9']+time_rows['Closing10']]==[55,75,85,90],'all four routes')
counter('one unbudgeted extra minute breaks55',core+1<=55,False)
counter('support cannot fit same55',core+support<=55,False)
counter('17 target points not changed to15',sum(pts)==15,False)
alts=[]
for line in text.splitlines():
    cells=line.strip('|').split('|')
    if len(cells)==4 and re.fullmatch(r'2\.3\.3_(fig_\d+|we_1|ex_\d+)',cells[0]):
        caption,alt,role=cells[1:]
        require(0<len(alt)<=120 and len(caption)>len(alt) and not re.match(r'(Lees|Bekijk|Bereken|Bepaal)\b',alt),'functional short alt and full caption '+cells[0])
        alts.append({'stem':cells[0],'characters':len(alt),'caption':caption,'alt':alt,'role':role})
require(len(alts)==15,'all fifteen functional visual contracts')
require(F(40)*F(3,4)==30 and F(40,1200)*166*72/F('25.4')>12,'native40px30pt and actual planned placement >=12')
counter('native 42 files',3*4+15*2,42)
counter('paragraph ZIP27',3+12*2,27)
counter('pupil and answer ZIP13',3+5*2,13)
require('All times UNOBSERVED' in text,'no learner timing claim')
print(json.dumps({'status':'PASS_INDEPENDENT_PLAN_CHECKS','actor':'paragraph_214_builder','assertions':len(checks),
                  'plan_raw_sha256':sha(raw),'target_record_sha256':sha(serialized),'points':pts,'markets':markets,
                  'numeric_mutation_count':len(numeric_probes),'numeric_mutations':numeric_probes,
                  'semantic_probe_count':len(semantic),'semantic_probes':semantic,'counterexamples':counterexamples,
                  'geometry':geometry,'alts':alts,'times':{k:str(v) for k,v in time_rows.items()},
                  'routes':['55','75','85','90'],'classroom_timing':'UNOBSERVED','personal_rendered_inspection':False,
                  'production_release':'PENDING','limitations':'Bounded source-contract predicates and synthetic counterexamples, not learner evidence or a general semantic grader.'},ensure_ascii=False,indent=2))
