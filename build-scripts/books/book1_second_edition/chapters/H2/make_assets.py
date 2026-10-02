import os
"""Exact SVG teaching diagrams, generated from explicit demand models.
The same mathematical coordinates feed curves, markers and guides.
PNG previews are supplied; the print renderer embeds the vector SVGs.
"""
from pathlib import Path
from html import escape
import json, math
import cairosvg
ROOT=Path(os.environ['BOOK1_CHAPTER_ROOT'])
A=ROOT/'_assets'; A.mkdir(exist_ok=True)
QA=ROOT/'QA'; QA.mkdir(exist_ok=True)
INK='#183247'; BLUE='#17688f'; TEAL='#227064'; GOLD='#ad601b'; GREY='#536777'; PALE='#edf5f8'
REG=[]
def text(x,y,t,size=17,col=INK,anchor='start',bold=False,extra=''):
    return f'<text x="{x:.5f}" y="{y:.5f}" font-family="Lato, DejaVu Sans, sans-serif" font-size="{size}" fill="{col}" text-anchor="{anchor}" font-weight="{700 if bold else 400}" {extra}>{escape(str(t))}</text>'
def line(x1,y1,x2,y2,col=INK,width=2,dash='',extra=''):
    return f'<line x1="{x1:.5f}" y1="{y1:.5f}" x2="{x2:.5f}" y2="{y2:.5f}" stroke="{col}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+f' {extra}/>'
def rect(x,y,w,h,fill=PALE,stroke='none',rx=7):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" rx="{rx}"/>'
def dot(x,y,col=BLUE,r=4,extra=''):
    return f'<circle cx="{x:.5f}" cy="{y:.5f}" r="{r}" fill="{col}" {extra}/>'
def begin(h):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{h}" viewBox="0 0 720 {h}"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7Z" fill="{INK}"/></marker></defs>'+rect(0,0,720,h,'#f7fafb')
def save(name,body,h=340,kind='instruction',meta=None):
    svg=begin(h)+body+'</svg>'
    (A/(name+'.svg')).write_text(svg, encoding='utf8', newline='\n')
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(A/(name+'.png')),output_width=1440)
    REG.append({'file':name,'kind':kind,'width':720,'height':h,**(meta or {})})

def chart(name,title,curves,xmax,ymax,xticks,yticks,xlabel='Gevraagde hoeveelheid q (liter per maand)',ylabel='Prijs P (€ per liter)',marks=(),arrows=(),blank=False,kind='instruction',height=340):
    """curves: name,a,b,label,color,[pmin,pmax],draw? where quantity=a-b*price."""
    ox=82; ex=620; top=53; by=height-70
    X=lambda q:ox+(ex-ox)*q/xmax
    Y=lambda p:by-(by-top)*p/ymax
    s=text(360,26,title,20,BLUE,'middle',True)
    for q in xticks:
        if q: s+=line(X(q),top,X(q),by,'#e2eaf0',.8)
        s+=line(X(q),by,X(q),by+4,INK,1)+text(X(q),by+22,str(q).replace('.',','),15,INK,'middle')
    for p in yticks:
        if p:s+=line(ox,Y(p),ex,Y(p),'#e2eaf0',.8)
        s+=line(ox-4,Y(p),ox,Y(p),INK,1)
        if p:s+=text(ox-10,Y(p)+5,str(p).replace('.',','),15,INK,'end')
    s+=line(ox,by,ex+12,by,INK,1.6,extra='marker-end="url(#arrow)"')+line(ox,by,ox,top-9,INK,1.6,extra='marker-end="url(#arrow)"')
    s+=text(351,height-16,xlabel,17,INK,'middle')+text(23,(top+by)/2,ylabel,17,INK,'middle',extra=f'transform="rotate(-90 23 {(top+by)/2})"')
    cms=[]
    for c in curves:
        nm,a,b,label,col,*rest=c
        lim=rest[0] if rest else [0,ymax]
        draw=rest[1] if len(rest)>1 else True
        p0=max(0,lim[0],(a-xmax)/b); p1=min(ymax,lim[1],a/b)
        points=[(a-b*p0,p0),(a-b*p1,p1)]
        cm={'name':nm,'a':a,'b':b,'pmin':p0,'pmax':p1,'drawn':draw and not blank,'endpoints':points}
        if draw and not blank:
            s+=line(X(points[0][0]),Y(p0),X(points[1][0]),Y(p1),col,2.7,extra=f'data-curve="{nm}"')
            # place curve name beyond the lower visible end, with enough inset when q-axis is full.
            ql=points[0][0]; pl=p0
            if ql>=xmax*.88:lx=X(ql)-7;anch='end'
            else:lx=X(ql)+12;anch='start'
            s+=text(lx,Y(pl)-11,label,17,col,anch,True)
        cms.append(cm)
    for i,m in enumerate(marks):
        nm,q,p,label,*rest=m
        guides=rest[0] if rest else True
        col=next((c[4] for c in curves if c[0]==nm),BLUE)
        if guides:
            s+=line(ox,Y(p),X(q),Y(p),GREY,1.25,'5 4',extra=f'data-guide="h" data-for="pt{i}"')
            s+=line(X(q),Y(p),X(q),by,GREY,1.25,'5 4',extra=f'data-guide="v" data-for="pt{i}"')
        s+=dot(X(q),Y(p),col,4,extra=f'id="pt{i}" data-on="{nm}" data-q="{q}" data-p="{p}"')
        if label:
            dx,dy=(10,-11) if q<xmax*.83 else (-10,-11)
            s+=text(X(q)+dx,Y(p)+dy,label,17,col,'start' if dx>0 else 'end',True)
    for q1,p1,q2,p2,label in arrows:
        s+=line(X(q1),Y(p1),X(q2),Y(p2),INK,1.5,extra='marker-end="url(#arrow)"')
        if label:s+=text((X(q1)+X(q2))/2,(Y(p1)+Y(p2))/2-13,label,16,INK,'middle')
    save(name,s,height,kind,{'type':'chart','plot':{'ox':ox,'by':by,'top':top,'ex':ex,'xmax':xmax,'ymax':ymax},'curves':cms,'marks':[list(m) for m in marks]})

def wtp(name,values,price,title,unit='portie',preview=False):
    ox=82; ex=630; by=245; top=58; ymax=max(values)+2
    X=lambda q:ox+(ex-ox)*q/(len(values)+.5)
    Y=lambda p:by-(by-top)*p/ymax
    s=text(360,27,title,20,BLUE,'middle',True)
    for p in range(0,int(ymax)+1,2):
        if p:s+=line(ox,Y(p),ex,Y(p),'#e2eaf0',.8)+text(70,Y(p)+5,p,15,INK,'end')
    for i,v in enumerate(values,1):
        x=X(i-.65);w=(ex-ox)/(len(values)+.5)*.54
        fill='#c4e1ea' if v>=price else '#e5e8eb'
        s+=rect(x,Y(v),w,by-Y(v),fill,BLUE if v>=price else GREY,1)
        if preview and v>=price:s+=rect(x,Y(v),w,Y(price)-Y(v),'#add3bd',TEAL,0)
        s+=text(x+w/2,Y(v)-9,'€ '+str(v),17,BLUE,'middle',True)+text(x+w/2,by+23,f'{i}e {unit}',15,INK,'middle')
    s+=line(ox,by,ex+13,by,INK,1.5,extra='marker-end="url(#arrow)"')+line(ox,by,ox,top-9,INK,1.5,extra='marker-end="url(#arrow)"')
    s+=line(ox,Y(price),ex,Y(price),GOLD,2,'6 4')+text(ex+5,Y(price)-8,f'P = € {price}',16,GOLD,'end',True)
    s+=text(23,154,'Bedrag (€ per '+unit+')',17,INK,'middle',extra='transform="rotate(-90 23 154)"')
    s+=text(360,294,'Elke balk gaat over één extra eenheid, niet over alle eenheden samen.',16,INK,'middle')
    save(name,s,315,meta={'type':'wtp','values':values,'price':price,'count':sum(v>=price for v in values),'preview':preview})

def step(name,values,price):
    # Height at unit k expresses the value of that additional unit. Steps only a bridge.
    ox=82;ex=620;by=224;top=55;ymax=12;xmax=5
    X=lambda q:ox+(ex-ox)*q/xmax
    Y=lambda p:by-(by-top)*p/ymax
    s=text(360,26,'Losse koopbeslissingen: een trapvorm als hulpmiddel',20,BLUE,'middle',True)
    for q in range(6):s+=text(X(q),by+23,str(q),16,INK,'middle')
    for p in [2,4,6,8,10,12]:s+=text(70,Y(p)+5,str(p),15,INK,'end')
    s+=line(ox,by,ex+12,by,INK,1.5,extra='marker-end="url(#arrow)"')+line(ox,by,ox,top-8,INK,1.5,extra='marker-end="url(#arrow)"')
    for i,v in enumerate(values):
        s+=line(X(i),Y(v),X(i+1),Y(v),BLUE,2.8)
        if i<len(values)-1:s+=line(X(i+1),Y(v),X(i+1),Y(values[i+1]),BLUE,1.2,'3 3')
    s+=line(ox,Y(price),ex,Y(price),GOLD,1.8,'6 4')+text(600,Y(price)-10,f'Prijs: € {price}',16,GOLD,'end',True)
    s+=line(X(3),Y(price),X(3),by,GREY,1.2,'4 3')+text(X(3)+12,Y(price)-8,'3 porties',16,BLUE)
    s+=text(350,270,'Aantal porties q (per middag)',17,INK,'middle')+text(23,139,'Bedrag (€ per portie)',17,INK,'middle',extra='transform="rotate(-90 23 139)"')
    save(name,s,291,meta={'type':'step','values':values,'price':price})

def flow(name,title,heads,lines2,foot='',kind='instruction'):
    n=len(heads);gap=25;w=(670-(n-1)*gap)/n
    s=text(360,26,title,20,BLUE,'middle',True)
    for i,h in enumerate(heads):
        x=25+i*(w+gap)
        s+=rect(x,52,w,94,PALE,'#cfdae3')+text(x+w/2,78,h,18,BLUE,'middle',True)
        for j,t in enumerate(lines2[i]):s+=text(x+w/2,105+j*22,t,16,INK,'middle')
        if i<n-1:s+=line(x+w+3,102,x+w+gap-5,102,INK,1.5,extra='marker-end="url(#arrow)"')
    if foot:s+=text(360,178,foot,17,INK,'middle')
    save(name,s,198,kind,{'type':'flow','heads':heads,'lines':lines2})

def aggregation(name,title,a1,b1,a2,b2,price,xmax,ymax,kind='instruction'):
    # Three separated panels, same price AND quantity scale; labels below all panels.
    s=text(360,26,title,20,BLUE,'middle',True)
    transforms=[]
    for i,(a,b,head,col) in enumerate([(a1,b1,'Koper A',BLUE),(a2,b2,'Koper B',TEAL),(a1+a2,b1+b2,'Samen',GOLD)]):
        ox=42+i*237;ex=ox+182;by=242;top=75
        X=lambda q:ox+(ex-ox)*q/xmax
        Y=lambda p:by-(by-top)*p/ymax
        s+=text((ox+ex)/2,57,head,18,col,'middle',True)+text(ox-10,top-9,'P',15,INK,'end')
        s+=line(ox,by,ex+4,by,INK,1.3,extra='marker-end="url(#arrow)"')+line(ox,by,ox,top-4,INK,1.3,extra='marker-end="url(#arrow)"')
        for p in [0,price,ymax]:
            s+=text(ox-7,Y(p)+5,p,14,INK,'end')
        for q in [0,xmax/2,xmax]:s+=text(X(q),by+20,f'{q:g}',14,INK,'middle')
        pmax=min(ymax,a/b, min(a1/b1,a2/b2) if i==2 else ymax);q=a-b*price
        s+=line(X(a-b*0),Y(0),X(a-b*pmax),Y(pmax),col,2.5,extra=f'data-panel-curve="{i}"')
        s+=line(ox,Y(price),X(q),Y(price),GREY,1.2,'4 3',extra=f'data-panel-h="{i}"')+line(X(q),Y(price),X(q),by,GREY,1.1,'4 3',extra=f'data-panel-v="{i}"')+dot(X(q),Y(price),col,extra=f'data-panel-dot="{i}"')
        s+=text(X(q)+6,Y(price)-10,str(q),17,col,'start',True)
        s+=text((ox+ex)/2,286,'q' if i<2 else 'Q',17,INK,'middle')
        transforms.append({'ox':ox,'ex':ex,'by':by,'top':top,'xmax':xmax,'ymax':ymax,'a':a,'b':b,'price':price,'pmax':pmax})
    q1=a1-b1*price;q2=a2-b2*price
    s+=text(360,323,f'Bij P = € {price}: {q1:g} + {q2:g} = {q1+q2:g} liter. Tel hoeveelheden op, geen prijzen.',17,INK,'middle',True)
    s+=text(360,347,'Alle P-assen: € per liter. Alle hoeveelheidassen: liter per week.',16,GREY,'middle')
    save(name,s,365,kind,{'type':'aggregation','panels':transforms})

def dropout(name,a1,b1,a2,b2,title,kind='instruction'):
    # A continuous economic curve, constructed from non-negative individual contributions.
    ymax=max(a1/b1,a2/b2);xmax=a1+a2
    ox=82;ex=620;by=267;top=55
    X=lambda q:ox+(ex-ox)*q/xmax
    Y=lambda p:by-(by-top)*p/ymax
    prices=sorted({0,a1/b1,a2/b2});pts=[(max(0,a1-b1*p)+max(0,a2-b2*p),p) for p in prices]
    s=text(360,26,title,20,BLUE,'middle',True)
    s+=line(ox,by,ex+12,by,INK,1.5,extra='marker-end="url(#arrow)"')+line(ox,by,ox,top-8,INK,1.5,extra='marker-end="url(#arrow)"')
    for p in range(int(ymax)+1):
        if p:s+=line(ox,Y(p),ex,Y(p),'#e2eaf0',.8)+text(70,Y(p)+5,p,15,INK,'end')
    for q in range(0,int(xmax)+1,4):s+=text(X(q),by+23,q,15,INK,'middle')
    coords=' '.join(f'{X(q):.5f},{Y(p):.5f}' for q,p in pts)
    s+=f'<polyline points="{coords}" fill="none" stroke="{BLUE}" stroke-width="3" data-poly="aggregate"/>'
    pcut=min(a1/b1,a2/b2);qcut=max(0,a1-b1*pcut)+max(0,a2-b2*pcut)
    s+=dot(X(qcut),Y(pcut),BLUE,extra='data-cutoff="1"')+line(ox,Y(pcut),X(qcut),Y(pcut),GREY,1.2,'5 4')
    ptest=pcut+1;qtest=max(0,a1-b1*ptest)+max(0,a2-b2*ptest)
    s+=dot(X(qtest),Y(ptest),GOLD,extra='data-test="1"')+line(ox,Y(ptest),X(qtest),Y(ptest),GREY,1.2,'5 4')+line(X(qtest),Y(ptest),X(qtest),by,GREY,1.2,'5 4')
    s+=text(330,108,'Bij € '+f'{ptest:g}'+': alleen koper B',17,GOLD,'start',True)+text(330,133,f'0 + {qtest:g} = {qtest:g} liter',17,GOLD)
    s+=text(378,200,'Lager dan € '+f'{pcut:g}'+': beide kopers',17,BLUE,'start',True)
    s+=text(351,317,'Gevraagde hoeveelheid Q (liter per week)',17,INK,'middle')+text(23,160,'Prijs P (€ per liter)',17,INK,'middle',extra='transform="rotate(-90 23 160)"')
    save(name,s,337,kind,{'type':'dropout','models':[[a1,b1],[a2,b2]],'points':pts,'test':[qtest,ptest],'plot':{'ox':ox,'ex':ex,'by':by,'top':top,'xmax':xmax,'ymax':ymax}})

def make():
    wtp('1.2.1_fig_1',[10,7,4,2],4,'Een extra portie heeft een eigen betalingsbereidheid')
    step('1.2.1_fig_2',[10,7,4,2],4)
    chart('1.2.1_fig_3','Eerst twee punten: (12; 0) en (0; 6)',[('V',12,2,'V',BLUE,[0,6],False)],12,6,[0,2,4,6,8,10,12],[0,1,2,3,4,5,6],marks=[('V',12,0,'',False),('V',0,6,'',False)])
    chart('1.2.1_fig_4','Dezelfde punten worden één lineaire vraaglijn',[('V',12,2,'V',BLUE)],12,6,[0,2,4,6,8,10,12],[0,1,2,3,4,5,6],marks=[('V',8,2,'A'),('V',4,4,'B')])
    chart('1.2.1_we_1','Uitgewerkt: hoeveelheid, prijs en snijpunten',[('V',12,2,'V',BLUE)],12,6,[0,2,4,6,8,10,12],[0,1,2,3,4,5,6],marks=[('V',8,2,'A'),('V',4,4,'B'),('V',6,3,'C')])
    chart('1.2.1_ex_3','Lees de ingevulde hulplijnen',[('V',12,2,'V',BLUE)],12,6,[0,2,4,6,8,10,12],[0,1,2,3,4,5,6],xlabel='q (tijdschriften per maand)',ylabel='P (€ per tijdschrift)',marks=[('V',8,2,'A'),('V',4,4,'B')])
    chart('1.2.1_ex_4','Teken de lijn door de twee gegeven snijpunten',[('V',8,1,'V',BLUE,[0,8],False)],8,8,[0,2,4,6,8],[0,2,4,6,8],xlabel='q (bezoeken per maand)',ylabel='P (€ per bezoek)',marks=[('V',8,0,'',False),('V',0,8,'',False)])
    for name,a,b,xlab,ylab,points in [('1.2.1_ans_4',8,1,'q (bezoeken per maand)','P (€ per bezoek)',[(6,2),(3,5)]),('1.2.1_ans_6',18,3,'q (liter per week)','P (€ per liter)',[(12,2),(6,4)]),('1.2.1_ans_8',20,4,'q (liter per maand)','P (€ per liter)',[(12,2),(8,3),(6,3.5)])]:
        chart(name,'Vraaglijn met gecontroleerde coördinaten',[('V',a,b,'V',BLUE)],a,a/b,list(range(0,a+1,2 if a<=12 else 4 if a==20 else 3)),list(range(0,int(a/b)+1)),xlabel=xlab,ylabel=ylab,marks=[('V',q,p,chr(65+i)) for i,(q,p) in enumerate(points)],kind='answer')
    chart('1.2.2_fig_1','Eigen prijs: bewegen langs dezelfde lijn',[('V0',80,4,'V₀',BLUE)],100,25,[0,20,40,60,80,100],[0,5,10,15,20,25],xlabel='Q (ijscoupes per week)',ylabel='P (€ per coupe)',marks=[('V0',60,5,'A'),('V0',40,10,'B')],arrows=[(58,5.5,43,9.25,'')])
    chart('1.2.2_fig_2','Andere behoefte: bij dezelfde prijs meer vraag',[('V0',80,4,'V₀',BLUE),('V1',100,4,'V₁',TEAL)],100,25,[0,20,40,60,80,100],[0,5,10,15,20,25],xlabel='Q (ijscoupes per week)',ylabel='P (€ per coupe)',marks=[('V0',40,10,'B'),('V1',60,10,'C')],arrows=[(43,10,57,10,'')])
    flow('1.2.2_fig_3','Substituten: producten die elkaar kunnen vervangen',['Prijs thee stijgt','Thee wordt relatief duur','Vraag naar koffie'],[['Koffieprijs blijft gelijk'],['Sommigen kiezen koffie'],['Verschuift naar rechts']],foot='Oorzaak: de prijs van een substituut. Niet: een veranderde koffiesmaak.')
    flow('1.2.2_fig_4','Complementen: producten die samen worden gebruikt',['Printer wordt duurder','Minder printers gekocht','Vraag naar inkt'],[['Inktprijs blijft gelijk'],['Minder inkt nodig'],['Verschuift naar links']],foot='Oorzaak: de prijs van een complement. Niet: de prijs van inkt zelf.')
    chart('1.2.2_we_1','Eerst A → B, daarna B → C',[('V0',60,3,'V₀',BLUE),('V1',72,3,'V₁',TEAL)],80,24,[0,20,40,60,80],[0,4,8,12,16,20,24],xlabel='Q (wraps per middag)',ylabel='P (€ per wrap)',marks=[('V0',42,6,'A'),('V0',36,8,'B'),('V1',48,8,'C')])
    chart('1.2.2_ex_14','De voorkeur verandert; de prijs blijft € 6',[('V0',48,4,'V₀',BLUE),('V1',64,4,'V₁',TEAL)],64,16,[0,16,32,48,64],[0,4,8,12,16],xlabel='Q (helmen per week)',ylabel='P (€ per helm)',marks=[('V0',24,6,'A'),('V1',40,6,'B')],height=255)
    chart('1.2.2_ex_15','Oorspronkelijke vraag: voeg de veranderingen zelf toe',[('V0',120,10,'V₀',BLUE)],120,12,[0,20,40,60,80,100,120],[0,2,4,6,8,10,12],xlabel='Q (wasbeurten per dag)',ylabel='P (€ per wasbeurt)')
    chart('1.2.2_ex_18','Beginlijn voor danslessen',[('V0',60,3,'V₀',BLUE)],80,24,[0,20,40,60,80],[0,4,8,12,16,20,24],xlabel='Q (lessen per week)',ylabel='P (€ per les)')
    chart('1.2.2_ex_19','Beginlijn voor filmbezoeken',[('V0',100,5,'V₀',BLUE)],120,24,[0,20,40,60,80,100,120],[0,4,8,12,16,20,24],xlabel='Q (bezoeken per week)',ylabel='P (€ per bezoek)')
    chart('1.2.2_ans_15','Twee losse veranderingen, elk vanuit V₀',[('V0',120,10,'V₀',BLUE),('V1',100,10,'V₁',TEAL)],120,12,[0,20,40,60,80,100,120],[0,2,4,6,8,10,12],xlabel='Q (wasbeurten per dag)',ylabel='P (€ per wasbeurt)',marks=[('V0',60,6,'A'),('V0',40,8,'B'),('V1',40,6,'C')],kind='answer')
    chart('1.2.2_ans_18','Oud: A. Alleen prijs: B. Beide veranderingen: C.',[('V0',60,3,'V₀',BLUE),('V1',72,3,'V₁',TEAL)],80,24,[0,20,40,60,80],[0,4,8,12,16,20,24],xlabel='Q (lessen per week)',ylabel='P (€ per les)',marks=[('V0',30,10,'A'),('V0',36,8,'B'),('V1',48,8,'C')],kind='answer')
    chart('1.2.2_ans_19','Beide effecten blijven zichtbaar',[('V0',100,5,'V₀',BLUE),('V1',120,5,'V₁',TEAL)],120,24,[0,20,40,60,80,100,120],[0,4,8,12,16,20,24],xlabel='Q (bezoeken per week)',ylabel='P (€ per bezoek)',marks=[('V0',60,8,'A'),('V0',50,10,'B'),('V1',70,10,'C')],kind='answer')
    aggregation('1.2.3_fig_1','Dezelfde prijs, drie afzonderlijke grafieken',8,2,12,2,2,20,6)
    dropout('1.2.3_fig_2',8,2,12,2,'Een te hoge prijs: de ene koper draagt nul bij')
    chart('1.2.3_we_1','De gezamenlijke vraag zolang 0 ≤ P ≤ € 4',[('VA',20,4,'V samen',BLUE,[0,4])],20,8,[0,4,8,12,16,20],[0,2,4,6,8],xlabel='Q (liter per week)',ylabel='P (€ per liter)',marks=[('VA',12,2,'A'),('VA',4,4,'B')])
    aggregation('1.2.3_ex_25','Aflezen en optellen bij € 2',8,2,12,2,2,20,6)
    chart('1.2.3_ex_26','Teken alleen de gezamenlijke vraag binnen 0 ≤ P ≤ € 4',[('V',24,4,'V samen',BLUE,[0,4],False)],24,8,[0,4,8,12,16,20,24],[0,2,4,6,8],xlabel='Q (liter per week)',ylabel='P (€ per liter)',marks=[('V',24,0,'',False)])
    chart('1.2.3_ans_26','Som van de twee kopers binnen het gegeven interval',[('V',24,4,'V samen',BLUE,[0,4])],24,8,[0,4,8,12,16,20,24],[0,2,4,6,8],xlabel='Q (liter per week)',ylabel='P (€ per liter)',marks=[('V',16,2,'A'),('V',8,4,'B')],kind='answer')
    chart('1.2.3_ans_28','Gezamenlijke vraag naar prints',[('V',36,6,'V samen',BLUE,[0,4])],36,6,[0,6,12,18,24,30,36],[0,1,2,3,4,5,6],xlabel='Q (prints per week)',ylabel='P (€ per print)',marks=[('V',24,2,'A'),('V',12,4,'B')],kind='answer')
    chart('1.2.3_ans_30','Alleen het gevraagde deel: 0 ≤ P ≤ € 6',[('V',42,5,'V samen',BLUE,[0,6])],48,12,[0,12,24,36,48],[0,2,4,6,8,10,12],xlabel='Q (reserveringen per week)',ylabel='P (€ per reservering)',marks=[('V',32,2,'A'),('V',22,4,'B'),('V',12,6,'C')],kind='answer')
    chart('1.2.4_ex_37','Oorspronkelijke vraag naar tafeltennistijd',[('V0',60,6,'V₀',BLUE,[0,8])],72,12,[0,12,24,36,48,60,72],[0,2,4,6,8,10,12],xlabel='Q (halfuren per week)',ylabel='P (€ per halfuur)')
    chart('1.2.4_ans_37','Oud A; alleen prijs B; beide veranderingen C',[('V0',60,6,'V₀',BLUE,[0,8]),('V1',72,6,'V₁',TEAL,[0,8])],72,12,[0,12,24,36,48,60,72],[0,2,4,6,8,10,12],xlabel='Q (halfuren per week)',ylabel='P (€ per halfuur)',marks=[('V0',36,4,'A'),('V0',24,6,'B'),('V1',36,6,'C')],kind='answer')
    chart('1.2.4_ans_36','Sanne: de twee schrijfwijzen geven dezelfde lijn',[('V',14,2,'V',BLUE)],14,7,[0,2,4,6,8,10,12,14],[0,1,2,3,4,5,6,7],xlabel='q (luisterboeken per maand)',ylabel='P (€ per luisterboek)',marks=[('V',6,4,'A'),('V',4,5,'B')],kind='answer')
    (QA/'figures.json').write_text(json.dumps(REG,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
if __name__=='__main__':make()
