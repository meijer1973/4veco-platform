"""Independent, read-only numeric audit of recovered bounded figure sources.
Calibration coordinates were read from labeled grid/axis geometry and checked
against full-size Poppler renders, separately from the plotted model paths.
"""
from pathlib import Path
import json,re,hashlib,math
import argparse
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--lesson-root',type=Path,default=Path(__file__).resolve().parents[3]/'4veco-lessen')
parser.add_argument('--report',type=Path)
args=parser.parse_args()
LESSON=args.lesson_root
ED=LESSON/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026'
FILES={json.loads(p.read_text(encoding='utf8'))['accepted_page']:p for p in ED.glob('bronnen/H*/_assets/theory-20260921/*.json')}
R={n:{'page':n,'source':p.relative_to(LESSON).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'checks':[]} for n,p in FILES.items()}
S={n:json.loads(p.read_text(encoding='utf8')) for n,p in FILES.items()}
for n,spec in S.items():R[n]['geometry_payload_sha256']=hashlib.sha256(json.dumps({k:spec[k] for k in ('viewBox','shapes','text')},sort_keys=True,separators=(',',':'),ensure_ascii=False).encode('utf8')).hexdigest()
def check(n,kind,description,passed,**data):R[n]['checks'].append({'kind':kind,'description':description,'pass':bool(passed),**data})
def points(path):
    tokens=re.findall(r'[A-Za-z]|-?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?',path)
    out=[];i=0;cmd=None;x=y=0
    while i<len(tokens):
        if tokens[i].isalpha():cmd=tokens[i];i+=1
        if cmd in ('M','L'):
            x,y=map(float,tokens[i:i+2]);i+=2;out.append([x,y])
        elif cmd=='H':x=float(tokens[i]);i+=1;out.append([x,y])
        elif cmd=='V':y=float(tokens[i]);i+=1;out.append([x,y])
        elif cmd=='Z':break
        else:raise ValueError('Non-polygon path '+cmd)
    return out
def calibration(n,x0,xend,qend,y0,ymax,vmax):
    R[n]['calibration']={'plot_x0':x0,'plot_x_at_max':xend,'q_max':qend,'plot_y0':y0,'plot_y_at_max':ymax,'value_max':vmax,'basis':'labeled axes/grid inspected at full size'}
    return lambda x,y:((x-x0)/(xend-x0)*qend,(y0-y)/(y0-ymax)*vmax)
def curve(n,idx,f,transform,label,tol=.015,visible=None):
    raw=points(S[n]['shapes'][idx]['path']);ps=[transform(*p) for p in raw]
    if visible:ps=[p for p in ps if visible(p)]
    residual=max(abs(y-f(x)) for x,y in ps)
    sample=[ps[i] for i in sorted(set([0,len(ps)//4,len(ps)//2,3*len(ps)//4,len(ps)-1]))]
    check(n,'path_equation',label,residual<tol,shape_index=idx,vertices_checked=len(ps),max_data_residual=residual,tolerance=tol,representative_data_points=sample)
def vertices(n,idx,want,transform,label,tol=.015):
    ps=[transform(*p) for p in points(S[n]['shapes'][idx]['path'])]
    error=max(min(max(abs(p[0]-e[0]),abs(p[1]-e[1])) for p in ps) for e in want)
    # All non-closing polygon corners must be among the expected vertices too.
    error=max(error,max(min(max(abs(p[0]-e[0]),abs(p[1]-e[1])) for e in want) for p in ps))
    area=abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(ps,ps[1:]+ps[:1])))/2
    expected_area=abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(want,want[1:]+want[:1])))/2
    check(n,'polygon_geometry',label,error<tol,shape_index=idx,actual_vertices=ps,expected_vertices=want,max_coordinate_error=error,tolerance=tol,area=area,expected_area=expected_area)
def numeric(n,description,actual,expected,tol=.015,**data):check(n,'numeric_geometry',description,abs(actual-expected)<tol,actual=actual,expected=expected,tolerance=tol,**data)
def text(n,description,required,model):
    actual=' '.join(''.join(r['text'] for r in l['runs']) for l in S[n]['text'])
    check(n,'live_text_model',description,all(x in actual for x in required),required=required,model=model,actual=actual)

t=calibration(5,106.0292,485.242,600,666.94116,543.1217,1500)
for idx,f,label in [(16,lambda q:300,'TCK=300'),(17,lambda q:2*q,'TVK=2Q'),(18,lambda q:300+2*q,'TK=300+2Q')]:curve(5,idx,f,t,label)
vertices(5,19,[(400,1100),(400,800)],t,'At Q400 the vertical TCK gap is300')
t=calibration(6,106.0292,485.242,600,631.42914,499.35504,6)
curve(6,17,lambda q:300/q,t,'GCK=300/Q on visible Q>0 domain',visible=lambda p:p[0]>0 and 0<=p[1]<=6)
curve(6,18,lambda q:2,t,'GVK=2 for Q>0; Q0 is marked open')
curve(6,19,lambda q:300/q+2,t,'GTK=300/Q+2 on visible Q>0 domain',visible=lambda p:p[0]>0 and 0<=p[1]<=6)
for idx,q,gtk in [(20,200,3.5),(23,400,2.75)]:vertices(6,idx,[(q,gtk),(q,2)],t,'GTK-GVK=GCK at Q'+str(q))
opening=S[6]['shapes'][26]['bounds'];numeric(6,'Open-circle center at Q0, GVK2',t((opening[0]+opening[2])/2,(opening[1]+opening[3])/2)[1],2)
text(12,'Profit definition diagram',['TO','TK','Winst','Alle constante én','variabele kosten'],'Winst=TO-TK, including constant and variable costs')
t=calibration(14,101.61595,496.90393,150,480.245,320.01355,800)
curve(14,20,lambda q:5*q,t,'TO=5Q');curve(14,21,lambda q:250+2*q,t,'TK=250+2Q')
vertices(14,22,[(50,250),(50,350)],t,'At Q50 loss100');vertices(14,25,[(100,500),(100,450)],t,'At Q100 profit50')
box=S[14]['shapes'][32]['bounds'];q,v=t((box[0]+box[2])/2,(box[1]+box[3])/2);numeric(14,'Break-even marker Q=250/3',q,250/3);numeric(14,'Break-even marker TO=TK=1250/3',v,1250/3)
text(21,'Interval MK diagram',['Q = 40','TK = € 260','Q = 50','TK = € 300','ΔQ = 10','ΔTK = € 40','€ 4 per extra product'],'(300-260)/(50-40)=4; units euro per extra product')
t=calibration(23,93.30205,506.67538,12,551.52612,425.8999,240)
curve(23,31,lambda q:80+q*q,t,'TK=80+Q², sampled finite curve',tol=.03)
for idx,q0,q1 in [(12,0,4),(19,4,8),(25,8,12)]:vertices(23,idx,[(q0,80+q0*q0),(q1,80+q0*q0),(q1,80+q1*q1)],t,'Unequal ΔTK over constant ΔQ4')
for idx,a,b in [(5,0,10),(6,-5,0),(7,0,10),(8,-20,0)]:
    box=S[38]['shapes'][idx]['bounds'];numeric(38,'Signed percentage bar '+str(idx)+' left',(box[0]-358.58273)/(419.52762-358.58273)*10,a);numeric(38,'Signed percentage bar '+str(idx)+' right',(box[2]-358.58273)/(419.52762-358.58273)*10,b)
R[38]['model']='P10→11 is+10%; Q200→190 is−5% (Ev−0.5); Q200→160 is−20% (Ev−2). Equal percentage axis.'
text(39,'Signed elasticity flow',['+10%','−5%','−5 ÷ 10 = −0,5'],'Ev=%ΔQv/%ΔP=-5/10=-0.5')
for idx,expected in [(7,-1),(8,-2),(9,-.5)]:
    box=S[40]['shapes'][idx]['bounds'];numeric(40,'Signed number-line marker '+str(expected),((box[0]+box[2])/2-73.85827)/(521.4173-73.85827)*3-3,expected,shape_index=idx)
R[40]['model']='Non-positive own-price demand: Ev<-1 elastic; -1<Ev<0 inelastic; -1 unit elastic; zero no measured response. Number line is signed, leftward magnitude strengthens.'
for idx,x0,expectedQ,expectedP in [(6,91.29585,100,10),(15,335.94604,95,11)]:
    box=S[46]['shapes'][idx]['bounds'];q=(box[2]-x0)/(255.92542-91.29585)*100;p=(575.1153-box[1])/(575.1153-484.42059)*10
    numeric(46,'TO rectangle quantity',q,expectedQ,shape_index=idx);numeric(46,'TO rectangle price',p,expectedP,shape_index=idx);numeric(46,'TO rectangle area',q*p,expectedQ*expectedP,tol=.1,shape_index=idx)
R[46]['model']='Equal-scale P-Q rectangles: 10×100=1000;11×95=1045, +4.5%. Area represents TO because P is per ticket and Q is tickets/day.'
text(47,'Local turnover flow preserves scope',['Bij een kleine prijsstijging','Inelastische vraag','Elastische vraag','TO ↑','TO ↓'],'For a small price increase, weak proportional quantity fall raises local TO; strong fall lowers it. Finite comparison still uses multiplication on same-page native text.')
text(48,'Revenue change flow',['€ 1.000','+ € 45','€ 1.045'],'1045-1000=45;45/1000×100%=4.5%')
text(54,'Distinct elasticity denominators',['Eigen prijs · Ev','%ΔQv','%ΔP','Inkomen · Ei','%ΔY','Andere prijs · Ek','%ΔQv van X','%ΔP van Z'],'Ev: quantity/own price; Ei:quantity/income; Ek:quantity of X/price of Z; old percentage denominators preserved in surrounding source')
for idx,expected in [(6,-5),(7,5),(8,20)]:
    box=S[55]['shapes'][idx]['bounds'];endpoint=box[0] if expected<0 else box[2];numeric(55,'Ei percentage bar '+str(expected),(endpoint-303.73233)/(348.13504-303.73233)*5,expected,shape_index=idx)
R[55]['model']='Same+10%income gives Q-5/+5/+20 for Ei-0.5/+0.5/+2; existing book labels inferior/normal/luxury and unlabeled0/1 boundaries preserved.'
text(56,'Cross-price causal direction',['Prijs van Z verandert','bus of printer','Vraag naar X reageert','treinritten of inkt'],'Price-good Z is denominator; demand-good X numerator. Bus/train substitute; printer/associated ink complement.')
text(57,'Function substitution terms',['−5 × 10 = −50','+2 × 15 = +30','+0,01 × 20.000','= +200'],'Qx=200-5Px+2Pz+0.01Y; base10,15,20000 ->380; coefficient not elasticity; Y remains annual')
for n,cutpoints in [(74,[(2,0),(3,20),(4,30)]),(82,[(3,0),(4,20),(5,35),(6,50)])]:
    span=30 if n==74 else 50
    for idx,want in cutpoints:
        box=S[n]['shapes'][idx]['bounds'];numeric(n,'Segment boundary euro'+str(want),(box[0]-86.94264)/(511.81558-86.94264)*span,want,shape_index=idx)
R[74]['model']='Willingness30=price20+CS10';R[82]['model']='Willingness50=MK20+PS15+CS15; price35 distributes gain, PS not profit.'
plots={75:(100.00226,493.53214,60,556.83112,421.88171,30,12,None,13,[(11,[(0,10),(0,30),(40,10)],'CS400')]),
76:(135.69855,493.53214,60,488.52094,370.11374,30,9,None,10,[(8,[(0,10),(0,30),(40,10)],'CS400')]),
77:(100.00226,493.53214,80,433.10504,295.54373,20,11,None,12,[(10,[(0,10),(0,20),(40,10)],'CS200')]),
83:(100.00226,493.53214,40,468.42657,324.77075,40,11,12,13,[(10,[(0,20),(0,10),(20,20)],'PS100')]),
84:(100.00226,493.53214,40,340.34003,224.54474,40,12,13,14,[(10,[(0,20),(0,40),(20,20)],'CS200'),(11,[(0,20),(0,10),(20,20)],'PS100')]),
85:(100.00226,493.53214,40,512.98553,380.37814,24,14,15,16,[(12,[(0,14),(0,24),(20,14)],'CS100'),(13,[(0,14),(0,4),(20,14)],'PS100')]),
92:(100.00226,493.53214,40,516.56165,399.89572,40,10,11,12,[]),
93:(100.00226,493.53214,40,312.28882,166.89172,40,12,13,14,[(10,[(0,22),(0,40),(12,28),(12,22)],'CS144 rectangle+triangle'),(11,[(0,22),(0,10),(12,16),(12,22)],'PS108 rectangle+triangle')]),
94:(100.00226,493.53214,40,457.65619,325.31873,40,16,17,18,[(14,[(12,28),(20,20),(12,16)],'DWL48')]),
96:(100.00226,493.53214,24,484.00534,356.89172,30,13,14,15,[(11,[(0,20),(0,30),(8,22),(8,20)],'CS48 rectangle+triangle'),(12,[(0,20),(0,6),(8,14),(8,20)],'PS80 rectangle+triangle')]),
97:(100.00226,493.53214,24,320.39307,195.02074,30,13,14,15,[(11,[(8,22),(12,18),(8,14)],'DWL16')])}
for n,params in plots.items():
    x0,xend,qmax,y0,yt,vmax,vi,ai,pi,areas=params;t=calibration(n,x0,xend,qmax,y0,yt,vmax)
    if n in [75,76]:vf=lambda q:30-.5*q;af=None;price=10;model='V=30-0.5Q; P10; Q40; CS400'
    elif n==77:vf=lambda q:20-.25*q;af=None;price=10;model='V=20-0.25Q; P10; Q40; CS200'
    elif n==85:vf=lambda q:24-.5*q;af=lambda q:4+.5*q;price=14;model='V=24-0.5Q; A=MK=4+0.5Q; freeQ20/P14; CS100+PS100=TS200'
    elif n in [96,97]:vf=lambda q:30-q;af=lambda q:6+q;price=20;model='V=30-Q; A=MK=6+Q; freeQ12/P18/TS144; limitQ8/P20 => CS48,PS80,TS128,DWL16'
    else:vf=lambda q:40-q;af=lambda q:10+.5*q;price=22 if n in [92,93,94] else 20;model='V=40-Q; A=MK=10+0.5Q; freeQ20/P20/CS200/PS100/TS300; limitQ12/P22 => CS144,PS108,TS252,DWL48'
    R[n]['model']=model;curve(n,vi,vf,t,'Demand equation')
    if ai is not None:curve(n,ai,af,t,'Supply=MK equation within stated domain')
    curve(n,pi,lambda q:price,t,'Price line')
    for idx,want,label in areas:vertices(n,idx,want,t,label)
text(95,'Feasible Pareto improvement with unchanged existing transactions',['27 − 22 = € 5','22 − 16,50 = € 5,50','Nieuwe koper','Nieuwe verkoper'],'13th poster willingness27,MK16.50,price22 => gains5and5.50. Surrounding source explicitly keeps existing12 transactions fixed, permits costless feasible expansion and no effects on others.')
text(109,'Transaction-first surplus flow',['1 · Hoeveelheid','2 · Gebieden','3 · Berekenen','4 · Uitleggen'],'Determine actual transactions/allocation -> select actual CS/PS areas -> rectangle/triangle amounts -> efficiency/Pareto limitations.')
assert all(r['checks'] for r in R.values())
result={'scope':'All actual bounded native figure JSON sources; no cover/current curriculum/manifest/CI acceptance','figure_count':len(R),'check_count':sum(len(r['checks']) for r in R.values()),'failures':[(n,c) for n,r in R.items() for c in r['checks'] if not c['pass']],'figures':[R[n] for n in sorted(R)]}
if args.report:args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps({'figures':len(R),'checks':result['check_count'],'failures':result['failures']},ensure_ascii=False,indent=2))

if result["failures"]:raise SystemExit(1)
