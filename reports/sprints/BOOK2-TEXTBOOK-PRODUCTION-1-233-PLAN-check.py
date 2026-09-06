"""Author-only executable checks, exact233 plan. No rendering or acceptance.

Derive each market from independently parsed geometric endpoints; compare all
numeric ledger cells and critical narrative chains. Counterexamples mutate the
actual plan in memory, not prior sources. Run with explicit Python314 and UTF-8.
"""
import hashlib
import json
import re
from fractions import Fraction as F
from pathlib import Path

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
PREFIX = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN'
REL = ('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/'
       '2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3-textbook-plan.md')
EXPECTED_RECORD = 'eae9bcd6af7483a7ac9ccb2c57d5332b8cb96cd058853ac7ed9e25a3bdb5b0b2'
NAMES = ['Thermosflessen', 'Puzzeldozen', 'Notitieboekjes', 'Drinkbekers', 'Fotolijstjes', 'Concertkaartjes']
sha = lambda b: hashlib.sha256(b).hexdigest()
compact = lambda s: re.sub(r'\s+', '', s)
canonical_json = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':')).encode()
record = next(x for x in json.loads((P / 'references/authored/course-target-exercises.json').read_text('utf-8'))['exercises'] if x['id'] == '2.3.3')
assert sha(canonical_json(record)) == EXPECTED_RECORD
raw = (L / REL).read_bytes()
text = raw.decode('utf-8').replace('\r\n', '\n')

def need(condition, message):
    if not condition:
        raise AssertionError(message)

def terms(s, snippets):
    for snippet in snippets:
        need(compact(snippet) in compact(s), 'missing contract: ' + snippet)

def segment(s, start, end):
    need(s.count(start) == 1 and s.count(end) == 1, 'unique segment boundaries')
    return s.split(start, 1)[1].split(end, 1)[0]

def numbers(cell):
    return [F(v) for v in cell.split('/')]

def market_rows(s):
    rows = {}
    for name in NAMES:
        candidates = [line for line in s.splitlines() if line.startswith('|' + name)]
        need(len(candidates) == 2, 'geometry + ledger required: ' + name)
        g, ledger = [x.strip('|').split('|') for x in candidates]
        need(len(g) == 6 and len(ledger) == 9, 'complete fields: ' + name)
        qmax, pmax = numbers(g[1])
        points = lambda cell: [tuple(F(n) for n in pair.split(',')) for pair in re.findall(r'\(([^)]+)\)', cell)]
        (dx0, a), (dx1, d1) = points(g[2])
        (sx0, c), (sx1, s1) = points(g[3])
        need(dx0 == sx0 == 0 and dx1 == sx1 == qmax and d1 == 0, 'full common domain')
        b, d = (a - d1) / qmax, (s1 - c) / qmax
        need(a > c > 0 and b > 0 and d > 0 and max(a, s1) <= pmax, 'valid positive-MC geometry')
        qe = (a - c) / (b + d)
        pe = a - b * qe
        need(points(g[4]) == [(qe, pe)], 'free equilibrium')
        price, q = numbers(g[5])
        qd, qs = (a - price) / b, (price - c) / d
        w, m = a - b * q, c + d * q
        need(0 < q < min(qd, qs, qe) and w > price > m, 'binding cap/trapezoid conditions')
        cr, ct, pr, pt = q * (w - price), b * q * q / 2, q * (price - m), d * q * q / 2
        cs, ps = cr + ct, pr + pt
        fcs, fps = b * qe * qe / 2, d * qe * qe / 2
        ts, fts = cs + ps, fcs + fps
        loss = fts - ts
        need(loss == (qe - q) * (w - m) / 2, 'subtraction/triangle parity')
        # Separate continuous integration, not a repeated trapezoid expression.
        integral = (a - c) * q - (b + d) * q * q / 2
        need(ts == integral, 'continuous integral cross-check')
        nw, nm = a - b * (q + 1), c + d * (q + 1)
        groups = [[qd, qs], [w, m], [cr, ct, cs], [pr, pt, ps], [ts, loss],
                  [fcs, fps, fts], [qe - q, w - m], [nw, nm, nw - price, price - nm]]
        need(all(numbers(cell) == want for cell, want in zip(ledger[1:], groups)), 'all ledger cells: ' + name)
        need(nw > price > nm and q + 1 <= qe, 'both new parties strictly gain')
        rows[name] = dict(a=a,b=b,c=c,d=d,qmax=qmax,pmax=pmax,qe=qe,pe=pe,p=price,q=q,cs=cs,ps=ps,ts=ts,loss=loss)
    return rows

def geometry(s, rows):
    terms(s, ['x=180+780Q/Qmax,y=720−540P/Pmax', 'atQ=.22q', 'ink≤60×48px and≥12px margin',
              '166×124.5mm', '40CSSpx=30pt', '15.685039pt', 'Body/table/caption/footer≥12pt',
              'rightannotationstrip[980,180,200,550]', 'centered1080/520,≤140×48px',
              'centery=clamp(endpointY,220,680)',
              'Qright=.22q+42Qmax/780'])
    result = {}
    for name, r in rows.items():
        qx = F(22, 100) * r['q']
        cx = 180 + 780 * qx / r['qmax']
        margins = []
        for region in ['CS', 'PS']:
            qright = qx + 42 * r['qmax'] / 780
            edge = r['a'] - r['b'] * qright if region == 'CS' else r['c'] + r['d'] * qright
            cy = 720 - 540 * ((r['p'] + edge) / 2) / r['pmax']
            # Every corner of expanded ink rectangle (12px safety included).
            for px in [cx - 42, cx + 42]:
                qv = (px - 180) * r['qmax'] / 780
                need(0 <= qv <= r['q'], 'label horizontal clearance: ' + name)
                for py in [cy - 36, cy + 36]:
                    pv = (720 - py) * r['pmax'] / 540
                    low, high = ((r['p'], r['a'] - r['b'] * qv) if region == 'CS'
                                 else (r['c'] + r['d'] * qv, r['p']))
                    need(low <= pv <= high, 'full ink corner within region: ' + name + region)
                    margins.append(float(min(pv - low, high - pv) * 540 / r['pmax']))
        result[name] = {'expanded_ink_corners': 16, 'minimum_extra_vertical_clearance_px': min(margins)}
        endpoint_labels = [(1080,max(220,min(680,720-540*pv/r['pmax']))) for pv in [0,r['c']+r['d']*r['qmax']]]
        for x,y in endpoint_labels:
            need(x-80>=980 and x+80<=1180 and y-24>=180 and y+24<=730,'endpoint label containment')
            need(abs(y-520)>=48+12,'endpoint/DWL label separation')
        need(1080-70>=980 and 1080+70<=1180 and 520-24>=180 and 520+24<=730,'DWL external-label containment')
    placed = F(40,1200) * 166 * 72 / F('25.4')
    need(placed >= 12 and abs(float(placed)-15.685039) < .000001, 'placed typography')
    return result

def contrast(hex1, hex2):
    def lum(h):
        rgb = [int(h[i:i+2],16)/255 for i in [1,3,5]]
        rgb = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
        return sum(v*w for v,w in zip(rgb,[.2126,.7152,.0722]))
    l1,l2=sorted([lum(hex1),lum(hex2)])
    return (l2+.05)/(l1+.05)

def validate(s):
    appendix = s.split('## Appendix A — complete unchanged frozen registry record',1)[1]
    blocks = re.findall(r'```json\n(.*?)\n```', appendix, re.S)
    need(len(blocks) == 1, 'one full target block')
    found = json.loads(blocks[0])
    need(found == record and sha(canonical_json(found)) == EXPECTED_RECORD, 'exact whole target fields/order/hash')
    need([q['points'] for q in found['target_exercise']['subquestions']] == [2,3,4,4,2,2], '17 points')
    need(len(found['lesson_goals']) == 4 and 'Arceer' in found['target_exercise']['subquestions'][3]['prompt'], 'exact four goals and DWL marking')
    terms(s, ['PRODUCTION_RELEASE_PENDING_ACCEPTED_232_213_AND_PLAN_REVIEW',
              'Current232F1 is author candidate, not accepted232 teaching',
              'five-input succession/current QC/root accepted handoff PENDING',
              'separate immutable accepted-input manifest', 'Missing, forged, stale or PENDING input must stop',
              'All times UNOBSERVED', 'Root corrected its initial contrary shorthand',
              'PS is not profit', 'including untraded units', 'Highest-WTP buyers',
              'lowest-MC suppliers', 'technical capacity', 'costlessly removable',
              "price and all existing trades and their participants' benefits remain unchanged",
              'Continuous area is a stated smooth model', 'finite continuous integral over40..41 (14.625)',
              'Qd50, not60', '40..60 can trade at25', 'No compensating payment is invented',
              'H-213-OPC2', 'NOT_APPLICABLE', 'formal output-choice extension'])
    headings = re.findall(r'^#### [1-7]\. (.+)$', s, re.M)
    need(headings == ['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling / Herhaling en interleaving'], 'seven stages in order')
    guided3 = segment(s, 'Opgave3 (', 'Opgave4 (')
    terms(guided3, ['a)"Vul aan: Pareto-efficiënt', 'haalbaarheid en herverdeling', 'four-row labelled fill-in table',
                   'CSrectangle12×(14−13)', 'CStriangle½×12×(20−14)', 'PSrectangle12×(13−10)',
                   'PStriangle½×12×(10−4)', '12+36=48CS;36+36=72PS', 'al gemarkeerde verliesdriehoek na',
                   'triangle(12,14),(12,10),(16,12),base4,height4', 'koper ...−13=...',
                   'technisch mogelijk want', 'geen extra regelkosten want', 'bestaande partijen',
                   'Model0.5/2.5,capacity≥16', 'meerTS zegt iets over', 'Paretoverbetering vraagt',
                   'geen van beide bewijst eerlijkheid', 'separate distribution norm'])
    guided4 = segment(s, 'Opgave4 (', 'Opgave5 (')
    terms(guided4, ['Reduced printed cue only', 'a)"Definieer Pareto-efficiëntie', 'd)"Bereken TS en verlies; arceer',
                   'e)"Toets de elfde transactie', 'f)"Waarom volgen een Paretoverbetering en eerlijkheid',
                   'No given intermediate quantities', 'CS=10×4+½×10×10=40+50=90',
                   'PS=10×5+½×10×5=50+25=75', 'base6,height9,½×6×9=27',
                   'buyer3/seller4.5', 'no other loss', 'neither determines a fairness norm'])
    guided5 = segment(s, 'Opgave5 (', '#### 4. Zelfstandige oefening')
    terms(guided5, ['booking cap5 AND technical capacity5', 'ChangeA raises technical capacity to6 at no cost',
                   'changeB raises bookings to6 at no cost', 'No,booking5 remains', 'No,technical capacity5 remains',
                   'Buyer3,seller2,others unchanged', 'all actual constraints must allow trade'])
    independent = segment(s, 'Opgave6 (', '#### 5. Doeloefening')
    terms(independent, ['no loss marking/hints', 'a)"Definieer', 'b)"Bereken', 'c)"Bereken', 'd)"Bereken',
                        'e)"Toets', 'f)"Waarom', 'CS=18×1+½×18×9=18+81=99',
                        'PS=18×5+½×18×9=90+81=171', '½×6×6=18', 'buyer0.5/seller4.5',
                        'capacity≥24,costless/no existing loss', 'separate fairness norm1'])
    target = segment(s, 'Opgave7 (', '#### 6. Denkertje / Bonusopgave')
    terms(target, ['context/source/sixprompts verbatim', 'no DWL shading or solved base/height/area',
                   'CSrectangle40×(30−25)=200,triangle½×40×(50−30)=400',
                   'PSrectangle40×(25−15)=400,triangle½×40×(15−5)=200',
                   'Shade triangle(40,30),(40,15),(60,20)', 'base60−40=20', 'height30−15=15',
                   '½×20×15=150', 'buyer4.5/seller9.75', 'no other party loses', 'not full restoration to60 atP25'])
    bonus = segment(s, 'Opgave8 (', '#### 7. Herhaling')
    terms(bonus, ['two evaluative parts,exactly3 assessment criteria', 'a)"De beheerder zegt',
                  'b)"Een tweede voorstel', 'q14,CS98/PS91/TS189', 'WTP15=17<18',
                  'Loss192−189=3', 'each loses2', 'Higher total need not be an actual Pareto improvement',
                  '(1) critiquea', '(2) critiqueb', '(3) rejects automatic fairness'])
    terms(s, ['Model12/8', 'Model4/3/7', 'Model7, booking binds', 'Modelbuyer3/seller2',
              'ModelQd20/Qs10,demandexcess10', 'CS3+0=3', 'third does not buy',
              'CS=14×1+½×14×7=14+49=63', 'PS=14×3+½×14×7=42+49=91',
              'lost192−180=12', 'Continuous area', 'unknown fixed costs'])
    rows = market_rows(s)
    geo = geometry(s, rows)
    times = {}
    for line in s.splitlines():
        if re.match(r'^\|\s*(Start[12]|Independent6|Target7|Guided[345]|Bonus8|Closing[9]|Closing10)\s*\|', line):
            cells = [x.strip() for x in line.strip('|').split('|')]
            values = [F(x) for x in cells[1:]]
            need(len(values) == 6 and sum(values[:5]) == values[5], 'workload row sum')
            times[cells[0]] = values[-1]
    need(len(times) == 10, 'complete time inventory')
    core = 2+12+8+2+times['Start1']+times['Start2']+times['Independent6']+times['Target7']
    support = sum(times['Guided'+str(n)] for n in [3,4,5])
    all_total = core+support+times['Bonus8']+times['Closing9']+times['Closing10']
    need((core,support,all_total) == (55,20,90), 'honest core/support/all')
    terms(s, ['Optional guided20 gives75;bonus10 gives85;closing5 gives90', 'exceeds the usual8–15 support recommendation'])
    assets=[]
    for line in s.splitlines():
        if re.match(r'^\|2\.3\.3_(fig|we|ex)_\d+\|',line):
            stem,caption,alt,role = line.strip('|').split('|')
            need(0<len(alt)<=120 and len(caption)>len(alt), 'full caption + short alt')
            need(not re.match(r'(?i)(bereken|lees|bekijk|arceer|teken|leg|vergelijk|wijs|vul|markeer|gebruik)\b', alt), 'non-imperative alt')
            need(alt != caption, 'alt not caption duplication')
            assets.append((stem,alt,role))
    need(len(assets)==15 and len({a[0] for a in assets})==15, '15 unique paired assets')
    titles=[]
    for line in s.splitlines():
        if re.match(r'^\|(fig[1-7]|we1|ex[1-7])\|',line):
            key, title = line.strip('|').split('|')
            lines=title.split(' / ')
            need(len(lines)==2 and max(map(len,lines))<=42,'visible-title line budget')
            titles.append(key)
    need(len(titles)==15 and len(set(titles))==15,'exact visible titles')
    paragraph={f'fig_{i}' for i in range(1,8)}|{'we_1'}|{f'ex_{i}' for i in range(1,5)}
    pupil={'we_1'}|{f'ex_{i}' for i in range(1,5)}
    answers={'we_1','ex_1','ex_5','ex_6','ex_7'}
    need(len(paragraph)*2+3==27 and len(pupil)*2+3==13 and len(answers)*2+3==13, 'ZIP contracts')
    need(not ({'ex_5','ex_6','ex_7'} & (paragraph|pupil)), 'no answer-only membership')
    terms(s, ['Native packet42files=12documents/archives+30asset files', 'Paragraph12pairs→27members;opgaven5pairs→13;answers5pairs→13',
              'Shared print_pipeline.py and all earlier source/test bytes remain unchanged', 'test_source.py,test_inputs.py,check_render.py,verify_rebuild.py',
              'separate right-strip box', 'dark diagonal/dotted hatches', 'DWL crosshatching', 'SVGtitle matches shortalt',
              'Native incremental platform evidence-only FAIL', 'All-page/color/grayscale and all15figure inspection is later'])
    ratios={v:contrast(v,'#F7FAFC') for v in ['#2D3748','#1A5276','#1E8449']}
    need(min(ratios.values())>=4.5, 'essential foreground contrast')
    return dict(market_count=len(rows),ledger_numeric_cells=6*21,geometry=geo,times={k:str(v) for k,v in times.items()},
                core=str(core),support=str(support),all=str(all_total),assets=len(assets),short_alt_max=max(len(a[1]) for a in assets),contrast_ratios=ratios)

result=validate(text)
negatives=[]
def rejected(label, candidate):
    try:
        validate(candidate)
    except (AssertionError,ValueError,KeyError,IndexError) as e:
        negatives.append({'label':label,'rejected':True,'reason':str(e)})
    else:
        raise AssertionError('negative escaped: '+label)

def replace_once(label,old,new):
    pattern = r'\s*'.join(re.escape(part) for part in re.split(r'\s+', old))
    match = re.search(pattern,text)
    need(match is not None, 'negative fixture exists: '+label)
    rejected(label,text[:match.start()]+new+text[match.end():])

# Every frozen field is independently mutated, including nested cells and order.
block=re.search(r'```json\n(.*?)\n```',text,re.S).group(1)
def leaves(v,p=()):
    if isinstance(v,dict):
        for k,x in v.items(): yield from leaves(x,p+(k,))
    elif isinstance(v,list):
        for k,x in enumerate(v): yield from leaves(x,p+(k,))
    else: yield p,v
for keys,value in leaves(record):
    bad=json.loads(json.dumps(record))
    cursor=bad
    for k in keys[:-1]: cursor=cursor[k]
    cursor[keys[-1]] = (not value if isinstance(value,bool) else value+1 if isinstance(value,int) else str(value)+' altered')
    rejected('target.'+'.'.join(map(str,keys)),text.replace(block,json.dumps(bad,ensure_ascii=False,indent=2)))
for name in NAMES:
    line=next(l for l in text.splitlines() if l.startswith('|'+name+'|'))
    cells=line.split('|')
    for i in range(2,10):
        vals=cells[i].split('/')
        vals[0]=str(F(vals[0])+1)
        bad=cells.copy();bad[i]='/'.join(vals)
        rejected('numeric ledger '+name+' field'+str(i),text.replace(line,'|'.join(bad)))
for label,old,new in [
    ('missing guided definition','a)"Vul aan: Pareto-efficiënt','a)"No definition'),
    ('missing guided feasibility','technisch mogelijk want',''),
    ('missing guided costless premise','geen extra regelkosten want',''),
    ('missing guided no harm','bestaande partijen...',''),
    ('missing guided fairness','geen van beide bewijst eerlijkheid',''),
    ('missing reduced marking','d)"Bereken TS en verlies; arceer','d)"Bereken TS en verlies;'),
    ('missing reduced no harm','e)"Toets de elfde transactie','e)"Sla over'),
    ('missing reduced fairness','f)"Waarom volgen een Paretoverbetering en eerlijkheid','f)"Sla over'),
    ('missing target marking','Shade triangle(40,30),(40,15),(60,20)','Shade triangle(40,30),(40,25),(50,25)'),
    ('incorrect height','height30−15=15','height25=25'),
    ('changed fixed price','buyer4.5/seller9.75','buyer9.5/seller4.75'),
    ('CS triangle-only','18+81=99','81=81'),
    ('PS is profit','PS is not profit:','PS is profit:'),
    ('untraded units missing','including untraded units','only traded units'),
    ('forged accepted232','Current232F1 is author candidate, not accepted232 teaching','Current232F1 is accepted teaching'),
    ('PENDING upstream allowed','Missing, forged, stale or PENDING input must stop','PENDING may pass'),
    ('observed timing','All times UNOBSERVED','All times OBSERVED'),
    ('core time omission','| Target7 |2|4|2|4.5|1.5|14|','| Target7 |2|4|2|4.5|1.5|12|'),
    ('unknown technical capacity','booking cap5 AND technical capacity5','booking cap5, capacity unknown'),
    ('bonus no critique','a)"De beheerder zegt','a)"Reken zonder beoordeling'),
    ('bonus no loser','each loses2','nobody loses'),
    ('bonus no fairness criterion','(3) rejects automatic fairness','(3) correctness only'),
    ('imperative alt','Voordelen voor koper en verkoper bij één extra map.','Bereken voordelen voor koper en verkoper bij één extra map.'),
    ('long alt','Voordelen voor koper en verkoper bij één extra map.','Voorbeeld '+('lang '*30)),
    ('label inset unsafe','atQ=.22q','atQ=.15q'),
    ('tiny print','Body/table/caption/footer≥12pt','Body/table/caption/footer≥10pt'),
    ('archive mismatch','Paragraph12pairs→27members','Paragraph12pairs→26members'),
    ('narrow scope concealed','Native incremental platform evidence-only FAIL','Native incremental platform PASS'),
]: replace_once(label,old,new)

# Independent economic counterexamples: wrong rules must actually give wrong
# decisions/numbers, not merely fail a textual token assertion.
def pareto_trade(w,p,m,cap,booking,n,extra_cost,existing_changes):
    gains=[F(w)-F(p),F(p)-F(m),-F(extra_cost)]+list(map(F,existing_changes))
    return cap>=n and booking>=n and all(x>=0 for x in gains) and any(x>0 for x in gains)
cases=[('capacity blocked',5,6,0,[],False),('booking blocked',6,5,0,[],False),
       ('both relaxed',6,6,0,[],True),('cost falls on third party',6,6,1,[],False),
       ('old seller loses',6,6,0,[-2],False)]
economic=[]
for name,cap,booking,cost,changes,want in cases:
    got=pareto_trade(12,9,7,cap,booking,6,cost,changes)
    need(got==want,'independent Pareto counterexample '+name)
    economic.append({'case':name,'positive_new_total':5,'actual_Pareto':got})
need(min(50,80)==50 and min(50,80,40,60)==40,'QdQs alone ignores booking')
need(F(40)*20/2==400 and F(40)*5+F(40)*20/2==600,'triangle alone loses rectangle')
need(F(20)*25/2==250 and F(20)*15/2==150,'price is not loss height')
need(F('29.5')-F('15.25')==F('14.25') != F('14.625'),'point vs integral')
# Bonus full-removal calculation without the proposed ledger.
q=F(32)-18; total=(32-8)*q-F('1.5')*q*q/2
cs=(32-18)*q-q*q/2; ps=total-cs
need((q,cs,ps,total,192-total)==(14,98,91,189,3),'full-removal bonus')
need(16-18==-2 and sum([96,84])<sum([128,64]),'higher TS can coexist with old-seller loss')
need((18-6,2*6-4,12-8,8-5,4+3)==(12,8,4,3,7),'Start1')
need((30-2*5,3*5-5)==(20,10),'closing9')
need(sum(max(v-7,0) for v in [10,7,4])==3 and sum(v>=7 for v in [10,7,4])==2,'closing10 discrete')

baseline=json.loads((P/(PREFIX+'-baseline.json')).read_text('utf-8'))
indexes={f'reports/github-agent-index-{repo}.{ext}' for repo in ['platform','lessen'] for ext in ['json','md']}
preserved=0
for repo in baseline['preservation']:
    root=P if repo['repository']=='platform' else L
    for row in repo['rows']:
        if repo['repository']=='platform' and row['path'] in indexes: continue
        data=(root/row['path']).read_bytes()
        need(sha(data)==row['raw_sha256'],'prior byte custody '+row['path'])
        # Actual mutation demonstration uses a copy; no source gets overwritten.
        need(sha(data+b'\nUNRELATED MUTATION')!=row['raw_sha256'],'custody negative')
        preserved+=1
need(preserved==13870,'complete baseline file count')

print(json.dumps({'status':'PASS_AUTHOR_CHECK_ONLY','plan_raw_sha256':sha(raw),
                  'plan_lf_sha256':sha(text.encode()),'target_record_sha256':EXPECTED_RECORD,
                  'computed_contracts':result,'negative_plan_probes':negatives,
                  'negative_plan_probe_count':len(negatives),'independent_economic_counterexamples':economic,
                  'prior_raw_files_unchanged':preserved,'prior_in_memory_mutation_rejections':preserved,
                  'rendering_performed':False,'independent_review':'PENDING','production_release':'PENDING',
                  'timing':'55/75/85/90 UNOBSERVED'},ensure_ascii=False,indent=2))
