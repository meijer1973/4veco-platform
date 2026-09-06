"""Independent read-only plan probes, not a renderer, author guard or release."""
from pathlib import Path
from fractions import Fraction as F
import copy, hashlib, importlib.util, json, re, subprocess, sys
sys.dont_write_bytecode = True
P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
BOOK = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus'
REL = BOOK + '/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md'
PLAN = 'df3d5c11364797f0d5b7190f2c0a2ce3c7cdd86d6d5e7fefde5c6e27d6d89967'
TARGET = '54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce'
def need(x, message):
    if not x: raise ValueError(message)
def sha(x): return hashlib.sha256(x).hexdigest()
def packed(x): return json.dumps(x, ensure_ascii=False, separators=(',', ':')).encode()
text = (L / REL).read_text(encoding='utf-8')
need(sha((L / REL).read_bytes()) == PLAN, 'Actual raw candidate identity')
records = json.loads((P / 'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))['exercises']
record = next(r for r in records if r['id'] == '2.3.2')
def target_guard(r):
    need(sha(packed(r)) == TARGET, 'Entire immutable frozen record, not selected fields')
target_guard(record)
appendix = json.loads(re.findall(r'```json\s*\n(.*?)\n```', text, re.S)[0])
need(packed(appendix) == packed(record), 'Complete actual appendix equals registry')
need([q['points'] for q in record['target_exercise']['subquestions']] == [2,2,3,2,2], '11 points')

# Derive the functions FROM the actual candidate's six endpoint rows. Do not
# import the author's SCENES, solve helper, answers or mutation oracle.
def markets(t, ink_width=60):
    result = []
    for line in t.splitlines():
        if not re.match(r'^\| (Tulips|Towels|Seedlings|Candles|Fruit bars|Concert) ', line): continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        name = cells[0]; qmax,pmax = map(F, cells[1].split('/'))
        coords = [F(v) for v in re.findall(r'-?\d+(?:\.\d+)?', cells[2]+' '+cells[3])]
        x0,a,x1,a1,s0,c,s1,c1 = coords
        need(x0 == s0 == 0 and x1 == s1 == qmax and a1 == 0, name+' full domains')
        b=(a-a1)/qmax; d=(c1-c)/qmax
        need(b>0 and d>0 and c>0, name+' economic curve orientation/intercepts')
        q=(a-c)/(b+d); price=a-b*q
        need(price==c+d*q and 0<q<qmax, name+' equilibrium substitution')
        e=[F(v) for v in re.findall(r'-?\d+(?:\.\d+)?', cells[4])]
        actual=[q,price,180+900*q/qmax,720-540*price/pmax]
        need(all(abs(v-w)<F(1,1000000) for v,w in zip(e,actual)), name+' supplied E coordinates')
        cs=q*(a-price)/2; ps=q*(price-c)/2
        # Independently cross-check area against total willingness minus variable
        # marginal cost over traded range; no claim this integral is pupil content.
        integrated=(a-c)*q-(b+d)*q*q/2
        need(cs+ps==integrated, name+' aggregate area identity')
        anchorq=F(15,100)*q
        for region in ['CS','PS']:
            centerp=(price+(a-b*anchorq if region=='CS' else c+d*anchorq))/2
            # All four corners of full ink PLUS twelve source-pixel margins.
            for dx in [-F(ink_width,2)-12,F(ink_width,2)+12]:
                for dy in [-36,36]:
                    qc=anchorq+dx*qmax/900; pc=centerp-dy*pmax/540
                    need(0<qc<q, name+' '+region+' horizontal whole-ink margin')
                    need(price<pc<a-b*qc if region=='CS' else c+d*qc<pc<price,
                         name+' '+region+' full ink/curve margin')
        result.append({'scene':name,'a_b_c_d':list(map(str,[a,b,c,d])),
            'Q_P_CS_PS_TS':list(map(str,[q,price,cs,ps,cs+ps])),
            'domain':list(map(str,[qmax,pmax])),'E_source':list(map(str,actual[2:]))})
    need(len(result)==6, 'Exactly six actual complete market rows')
    return result
market_rows=markets(text)
expected=[[32,14,256,128,384],[12,18,72,72,144],[6,12,18,18,36],
          [24,14,144,72,216],[40,16,400,200,600],[60,20,900,450,1350]]
need([r['Q_P_CS_PS_TS'] for r in market_rows]==[list(map(str,r)) for r in expected], 'All six prose answers')
marginal=[]
for r,quantities in zip(market_rows,[[16,48],[10,14],[4],[20,28],[32,48],[50,70]]):
    a,b,c,d=map(F,r['a_b_c_d'])
    for q in quantities:
        w=a-b*q; mc=c+d*q
        marginal.append({'scene':r['scene'],'Q':q,'WTP':str(w),'MC':str(mc),'gain':str(w-mc)})
need([r['gain'] for r in marginal]==list(map(str,[12,-12,4,-4,4,3,-3,6,-6]))+['15/2','-15/2'], 'All eleven marginal rows')
point=F(15,2); integrated_50_51=45-F(3,8)*(51*51-50*50)
need(integrated_50_51==F(57,8) and point!=integrated_50_51, 'Point marginal is not finite interval')

individual=[]
for name,w,mc,p in [('opening',18,7,10),('Start2',15,7,10),('mug baseline',18,10,14),
 ('WTP only',20,10,14),('MC only',18,13,14),('both',20,13,14),
 ('bonus original',22,9,14),('bonus16',22,9,16),('bonus17',22,9,17)]:
    cs=w-p; ps=p-mc; need(cs+ps==w-mc,name+' price cancellation')
    individual.append({'case':name,'CS_PS_TS':[cs,ps,cs+ps]})
need((F(130)-100)/(15-10)==6 and (F(62)-38)/(10-4)==4,'Both interval retrievals')
need((F(24)+8)/4==8 and 24-2*8==2*8-8==8,'Start1 equilibrium and both substitutions')
need(F(1,2)*4*(10-6)==8 and 4*6==24,'Start1 CS is not expenditure')
need(sum(w-6 for w in [9,6,3] if w>=6)==3,'Closing zero buyer included; nonbuyer excluded')
need(20*8==160 and 160!=60,'Independent7 supplied PS differs from receipts')
need(individual[5]['CS_PS_TS'][2]-individual[2]['CS_PS_TS'][2]==-1,'Combined effects oppose, net minus1')
need(all(22-p>0 and p-9>0 and (22-p)+(p-9)==13 for p in [F(19,2),16,17,F(43,2)]), 'Bonus whole open interval')

stages=['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening',
        'Doeloefening','Denkertje / Bonusopgave','Herhaling / Herhaling en interleaving']
fragments=[
 'including untraded','Aggregate PS is not automatically profit','accepted-input manifest','Do not guess future pins',
 'No plan-coordinate calculation is a render or visual review PASS.',
 'All times are UNOBSERVED estimates','No formula or step scaffold in this final task',
 'exactly3 assessment criteria','Teken de lijnen niet opnieuw.',
 'Body/table/caption/footer≥12pt','40 CSSpx =30pt source','build-scripts/content/book-2/b2_232.py',
 'Native packet40files=12documents/archives+28asset files','answers5pairs(we1,ex1,ex5,ex6,ex7)→13',
 'maximum1','explicit fairness/full-welfare boundary1',
]
# Case-insensitive literal anchors are tests of THIS reviewed proposed contract,
# not proof a future guard or future native render exists.
def contract(t):
    low=t.lower()
    for f in fragments: need(f.lower() in low,'Missing contract: '+f)
    need([s.split(' — ')[0] for s in re.findall(r'^#### [1-7]\. (.+)$', t, re.M)]==stages,'Seven stage order (internal context suffix is not pupil heading)')
    rows=[]
    for name in ['Start1','Start2','Independent6','Independent7','Target8']:
        line=next(x for x in t.splitlines() if x.startswith('| '+name+' |'))
        nums=[F(x.strip()) for x in line.strip('|').split('|')[1:]]
        need(sum(nums[:-1])==nums[-1],name+' operation-complete workload')
        rows.append(nums[-1])
    need(sum(rows)==30 and 2+13+7+2+sum(rows)==54,'Actual 54-minute sum')
    need(54+12==66 and 66+9==75 and 75+5==80,'Support/bonus/closing not hidden in55')
    alts=[]
    for line in t.splitlines():
        if line.startswith('| 2.3.2_'):
            cells=[x.strip() for x in line.strip('|').split('|')]
            caption,alt=cells[1:3]
            need(10<=len(alt)<=120 and alt!=caption,'Functional short distinct alt')
            need(not re.match(r'(?i)^(bekijk|bereken|teken|vul|markeer|zie|leg)\b',alt),'Noun-first alt')
            alts.append({'stem':cells[0],'characters':len(alt),'role':cells[3]})
    need(len(alts)==14,'Exactly14 pairs/roles')
    return alts
alts=contract(text)

negatives=[]
def reject(name, fn):
    try: fn()
    except (ValueError,StopIteration,IndexError): negatives.append(name); return
    raise AssertionError('Counterexample escaped: '+name)
for key in ['lesson_goals','target_exercise','short_answer_model','record_status']:
    changed=copy.deepcopy(record); changed[key]='INDEPENDENT CORRUPTION'
    reject('actual frozen '+key,lambda r=changed:target_guard(r))
for i in range(5):
    changed=copy.deepcopy(record); changed['target_exercise']['subquestions'][i]['points']+=1
    reject('actual target point '+str(i),lambda r=changed:target_guard(r))
for name,section,key,value in [
 ('unit/base context','target_exercise','context',record['target_exercise']['context'].replace('euro per kaartje','euro per maand')),
 ('unsupported redraw','target_exercise','sources',[{'id':'basisgrafiek','content':'Teken zelf alle lijnen.'}]),
 ('marginal row corruption','target_exercise','sources',copy.deepcopy(record['target_exercise']['sources'])),
 ('answer form drift',None,'answer_form_expectations',['firm profit maximum'])]:
    changed=copy.deepcopy(record)
    if name=='marginal row corruption': value[1]['rows'][1][2]='€12,50'
    (changed[section] if section else changed)[key]=value
    reject('actual frozen '+name,lambda r=changed:target_guard(r))
for f in fragments:
    need(f.lower() in text.lower(),'Mutation must have real source anchor')
    altered=re.sub(re.escape(f),'[REMOVED BY INDEPENDENT FIXTURE]',text,flags=re.I)
    reject('actual plan removal '+f,lambda t=altered:contract(t))
reject('actual E coordinate delta',lambda:markets(text.replace('(720,504)','(720,505)')))
reject('actual domain delta',lambda:markets(text.replace('| 100/50 |','| 101/50 |')))
reject('actual pupil source endpoint delta',lambda:markets(text.replace('(100,30)','(100,31)')))
reject('120px ink box rejected independent of author',lambda:markets(text,120))
reject('actual false workload subtotal',lambda:contract(text.replace('| 0.7 | 1.4 |','| 0.7 | 0.4 |')))
firstalt=next(x for x in text.splitlines() if x.startswith('| 2.3.2_fig_1 |')).split('|')[3].strip()
reject('actual imperative alt',lambda:contract(text.replace(firstalt,'Bereken het voordeel bij deze reparatie.')))
reject('actual overlong alt',lambda:contract(text.replace(firstalt,'Surplus '+('x'*121))))

# This deliberately detects an OPEN authored design gap, not a passing test
# suite that confuses presence of "fading" anywhere with operation coverage.
guided=text.split('#### 3. Begeleide inoefening')[1].split('#### 4. Zelfstandige oefening')[0]
guided_g4e=bool(re.search(r'maxim|eerlijk|fairness|verdeling|boven.*onder|onder.*boven',guided,re.I))
need(not guided_g4e,'Re-evaluate F1 if author supplies the missing guided operation')

# Read-only source->current native Markdown comparison. No authorize(), main(),
# renderer or subprocess called through these modules; no outputs generated.
native=[]
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
for number in ['213','231']:
    file=P/f'build-scripts/content/book-2/b2_{number}.py'
    spec=importlib.util.spec_from_file_location('independent_'+number,file)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    for kind,value in module.documents(module.target_record()).items():
        file=L/module.LESSON_REL/f'{module.STEM} – {kind}.md'
        need(file.read_bytes()==value.encode(),'Actual current '+number+' '+kind+' source->MD bytes')
        native.append({'paragraph':number,'kind':kind,'raw_sha256':sha(file.read_bytes())})
placed=F(40,1200)*166/F('25.4')*72
need(placed==F(1992,127) and placed>=12,'40CSSpx/30pt actual placed budget')
def luminance(color):
    rgb=[int(color[i:i+2],16)/255 for i in (1,3,5)]
    linear=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in rgb]
    return sum(x*y for x,y in zip(linear,[0.2126,0.7152,0.0722]))
contrast={}
for color in ['#2D3748','#1A5276','#1E8449']:
    need(color in text and '#F7FAFC' in text,'Actual planned ink tokens')
    ratio=(luminance('#F7FAFC')+0.05)/(luminance(color)+0.05)
    need(ratio>=4.5,'Planned text contrast floor (not antialias/render proof)')
    contrast[color]=ratio
print(json.dumps({'status':'INDEPENDENT CHECKS COMPLETE; OPEN F1',
 'plan_raw_lf_sha256':PLAN,'target_record_sha256':TARGET,
 'six_market_systems':market_rows,'eleven_marginal_rows':marginal,'individual_checks':individual,
 'target_point_vs_finite_interval':[str(point),str(integrated_50_51)],
 'negative_counterexamples_rejected':negatives,'negative_count':len(negatives),
 'fourteen_caption_alt_roles':alts,'placed_font_pt':str(placed),'planned_contrast':contrast,
 'actual_prior_MD_source_identity':native,
 'open_findings':[{'id':'F1','guided_G4e_full_operation_present':guided_g4e,
 'mapping_line':134,'guided_lines':'307-347','unsupported_target_e_lines':'391-400',
 'rule':'econ-paragraph-review1.3.3/1.5.1/1.5.5; each target operation fading',
 'meaning':'Local signs/one fixed trade are present; a faded full-range maximum and fairness explanation is absent.'}],
 'production_release':'PENDING','rendered_review':'NOT APPLICABLE PLAN ONLY','classroom_timing':'UNOBSERVED'},ensure_ascii=False,indent=2))
