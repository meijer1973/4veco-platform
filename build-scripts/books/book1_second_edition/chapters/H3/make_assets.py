import os
"""Generate exact vector diagrams. Models use Q = a + bP.
The plotted segment is the intersection of the specified domain and plot window.
Verification reads actual SVG line/circle coordinates, not a raster approximation.
"""
from pathlib import Path
from html import escape
import json, math
import cairosvg
R=Path(os.environ['BOOK1_CHAPTER_ROOT']); A=R/'_assets';A.mkdir(exist_ok=True);(R/'QA').mkdir(exist_ok=True)
INK='#183247'; BLUE='#17688f'; GREEN='#227064'; GOLD='#ad601b'; GREY='#536777'; NEW='#704b8b'
REG=[]
def txt(x,y,t,size=17,c=INK,anchor='start',bold=False,extra=''):
 return f'<text x="{x:.5f}" y="{y:.5f}" font-family="Lato, DejaVu Sans, sans-serif" font-size="{size}" fill="{c}" text-anchor="{anchor}" font-weight="{700 if bold else 400}" {extra}>{escape(str(t))}</text>'
def line(x,y,u,v,c=INK,w=2,dash='',extra=''):
 return f'<line x1="{x:.5f}" y1="{y:.5f}" x2="{u:.5f}" y2="{v:.5f}" stroke="{c}" stroke-width="{w}"'+(f' stroke-dasharray="{dash}"' if dash else '')+f' {extra}/>'
def dot(x,y,c=INK,r=4,extra=''):
 return f'<circle cx="{x:.5f}" cy="{y:.5f}" r="{r}" fill="{c}" {extra}/>'
def rect(x,y,w,h,c='#edf5f8',rx=6):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{c}"/>'
def fmt(n):return (f'{n:g}').replace('.',',')
def save(name,s,h,kind='instruction',meta=None):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{h}" viewBox="0 0 720 {h}"><defs><marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7Z" fill="{INK}"/></marker></defs>'+rect(0,0,720,h,'#f7fafb')+s+'</svg>'
 (A/(name+'.svg')).write_text(svg, encoding='utf8', newline='\n')
 cairosvg.svg2png(bytestring=svg.encode(),write_to=str(A/(name+'.png')),output_width=1440)
 REG.append({'name':name,'kind':kind,'height':h,**(meta or {})})

def c(name,a,b,label=None,col=None,domain=None,dash=''):
 return {'name':name,'a':a,'b':b,'label':label or name,'col':col or (GREEN if b>0 else BLUE),'domain':domain,'dash':dash}

def graph(name,title,curves,xmax,ymax,xt,yt,marks=(),xlabel='Q (stuks per week)',ylabel='P (€ per stuk)',kind='instruction',h=340,arrows=(),gap=None,points_only=False,labels=None):
 ox,ex,by,top=84,634,h-67,51
 X=lambda q:ox+(ex-ox)*q/xmax
 Y=lambda p:by-(by-top)*p/ymax
 s=txt(360,27,title,19,BLUE,'middle',True)
 # scaffold first, deliberately restrained grid
 for q in xt:
  if q:s+=line(X(q),by,X(q),top,'#e1e9ee',.8)
  s+=line(X(q),by,X(q),by+5,INK,1)+txt(X(q),by+23,fmt(q),15,INK,'middle')
 for p in yt:
  if p:s+=line(ox,Y(p),ex,Y(p),'#e1e9ee',.8)+txt(ox-11,Y(p)+5,fmt(p),15,INK,'end')
  s+=line(ox-4,Y(p),ox,Y(p),INK,1)
 s+=line(ox,by,ex+12,by,INK,1.6,extra='marker-end="url(#arr)"')+line(ox,by,ox,top-9,INK,1.6,extra='marker-end="url(#arr)"')
 s+=txt((ox+ex)/2,h-12,xlabel,16,INK,'middle')+txt(22,(by+top)/2,ylabel,16,INK,'middle',extra=f'transform="rotate(-90 22 {(by+top)/2})"')
 cm={v['name']:v for v in curves};meta=[]
 # Guides below curve ink
 markmeta=[]
 for j,m in enumerate(marks):
  mn,p,label,*opts=m;d=cm[mn];q=d['a']+d['b']*p
  assert -1e-8<=q<=xmax+1e-8 and 0<=p<=ymax,(name,m,q)
  opt=opts[0] if opts else {};guides=opt.get('guides',True)
  if guides:
   s+=line(ox,Y(p),X(q),Y(p),GREY,1.2,'5 4',f'data-guide="h{j}"')+line(X(q),Y(p),X(q),by,GREY,1.2,'5 4',f'data-guide="v{j}"')
  markmeta.append({'id':j,'curve':mn,'q':q,'p':p,'guides':guides})
 for d in curves:
  a,b=d['a'],d['b'];p0,p1=d['domain'] or [0,ymax]
  plo=max(0,p0,min(-a/b,(xmax-a)/b));phi=min(ymax,p1,max(-a/b,(xmax-a)/b))
  assert phi>=plo,(name,d,plo,phi)
  qlo=a+b*plo;qhi=a+b*phi
  if not points_only:
   s+=line(X(qlo),Y(plo),X(qhi),Y(phi),d['col'],2.7,d['dash'],f'data-curve="{d["name"]}"')
   if labels and d['name'] in labels:
    lq,lp,dx,dy=labels[d['name']]
   else:
    lp=phi-.09*(phi-plo) if b>0 else plo+.10*(phi-plo)
    lq=a+b*lp;dx=8;dy=-8 if b>0 else -6
   lx=X(lq)+dx;ly=Y(lp)+dy
   s+=txt(lx,ly,d['label'],17,d['col'],'start',True)
  meta.append({**d,'p_lo':plo,'p_hi':phi,'drawn':not points_only})
 for j,m in enumerate(marks):
  mn,p,label,*opts=m;d=cm[mn];q=d['a']+d['b']*p;opt=opts[0] if opts else {}
  s+=dot(X(q),Y(p),opt.get('color',INK),4,extra=f'data-point="{j}"')
  if label:
   s+=txt(X(q)+opt.get('dx',0),Y(p)+opt.get('dy',-13),label,17,opt.get('color',INK),opt.get('anchor','middle'),True)
 for ar in arrows:
  q1,p1,q2,p2,*rest=ar;s+=line(X(q1),Y(p1),X(q2),Y(p2),INK,1.6,extra='marker-end="url(#arr)"')
  if rest and rest[0]:s+=txt((X(q1)+X(q2))/2,(Y(p1)+Y(p2))/2-10,rest[0],15,INK,'middle')
 gapmeta=None
 if gap:
  ca,cb,p,label,dy=gap;q1=cm[ca]['a']+cm[ca]['b']*p;q2=cm[cb]['a']+cm[cb]['b']*p
  left,right=sorted((q1,q2));yy=Y(p)+dy
  if dy < 0:
   s+=line(X(left),Y(p),X(left),yy,GREY,1,'3 3')+line(X(right),Y(p),X(right),yy,GREY,1,'3 3')
  s+=line(X(left)+3,yy,X(right)-3,yy,INK,1.4,extra='marker-start="url(#arr)" marker-end="url(#arr)"')+txt((X(left)+X(right))/2,yy-8,label,16,INK,'middle',True)
  gapmeta={'left':left,'right':right,'p':p,'a':ca,'b':cb}
 save(name,s,h,kind,{'type':'linear','plot':{'ox':ox,'ex':ex,'by':by,'top':top,'xmax':xmax,'ymax':ymax},'curves':meta,'marks':markmeta,'gap':gapmeta})

def roles():
 s=txt(360,27,'Dezelfde markt, twee soorten plannen',20,BLUE,'middle',True)
 for x,title,qs,c_ in [(22,'Kopers','Hoeveel wil en kan ik kopen?',BLUE),(380,'Verkopers','Hoeveel wil en kan ik aanbieden?',GREEN)]:
  s+=rect(x,50,318,110,'#eaf2f6')+txt(x+159,79,title,21,c_,'middle',True)+txt(x+159,111,qs,17,INK,'middle')+txt(x+159,142,'bij verschillende prijzen',16,GREY,'middle')
 s+=txt(360,197,'Eén afgesproken product, periode en eenheid.',18,INK,'middle',True)+txt(360,222,'Een plan bij een prijs is nog geen werkelijke transactie.',17,GREY,'middle')
 save('1.3.1_fig_1',s,241)

def sequence(name,title,heads,lines,foot):
 s=txt(360,28,title,19,BLUE,'middle',True)
 n=len(heads);w=(680-22*(n-1))/n
 for i,(hd,ls) in enumerate(zip(heads,lines)):
  x=20+i*(w+22);s+=rect(x,54,w,115)+txt(x+w/2,82,hd,18,BLUE,'middle',True)
  for j,t in enumerate(ls):s+=txt(x+w/2,111+j*24,t,16,INK,'middle')
  if i<n-1:s+=line(x+w+2,111,x+w+19,111,INK,1.5,extra='marker-end="url(#arr)"')
 s+=txt(360,201,foot,16,GREY,'middle')
 save(name,s,220)

def geometry():
 ox,ex,by,top=100,600,276,50;X=lambda x:ox+50*x;Y=lambda y:by-30*y
 s=txt(360,26,'Meetkunde: lees de afstanden, niet alleen de hoogste waarde',18,BLUE,'middle',True)
 for x in [0,2,4,6,8,10]:
  s+=line(X(x),by,X(x),top,'#e1e9ee',.8)+txt(X(x),by+21,str(x),15,INK,'middle')
 for y in [2,4,6]:s+=line(ox,Y(y),ex,Y(y),'#e1e9ee',.8)+txt(ox-12,Y(y)+5,str(y),15,INK,'end')
 pts=[(0,2),(8,2),(0,6)]
 s+=f'<polygon data-polygon="triangle" points="'+ ' '.join(f'{X(x):.5f},{Y(y):.5f}' for x,y in pts)+f'" fill="#dcebf2" stroke="{BLUE}" stroke-width="2"/>'
 for x,y,l,dx,dy in [(0,2,'A',10,21),(8,2,'B',10,0),(0,6,'C',10,-8)]:s+=dot(X(x),Y(y))+txt(X(x)+dx,Y(y)+dy,l,18,BLUE,'start',True)
 s+=line(ox,by,ex+12,by,INK,1.6,extra='marker-end="url(#arr)"')+line(ox,by,ox,top-9,INK,1.6,extra='marker-end="url(#arr)"')
 s+=txt(360,329,'Horizontale afstand (cm)',17,INK,'middle')+txt(29,173,'Verticale afstand (cm)',17,INK,'middle',extra='transform="rotate(-90 29 173)"')
 save('1.3.4_ex_38',s,345,meta={'type':'geometry','plot':{'ox':ox,'by':by,'sx':50,'sy':30},'polygon':pts,'expected_area':16})

def make():
 roles()
 # Supply: read table/line, then isolate a shift at the same price.
 base=[c('A0',-20,5,'A₀',GREEN,[4,12])]
 kw=dict(xmax=40,ymax=12,xt=[0,10,20,30,40],yt=[0,2,4,6,8,10,12],xlabel='q (plantenpotten per week)',ylabel='P (€ per pot)')
 graph('1.3.1_fig_2','Tabel en lijn laten hetzelfde aanbodplan zien',base,marks=[('A0',6,'R'),('A0',8,'S'),('A0',10,'T')],**kw)
 graph('1.3.1_fig_3','Duurdere klei: vergelijk eerst bij dezelfde prijs',base+[c('A1',-30,5,'A₁',GOLD,[6,12],'7 4')],marks=[('A0',8,'S',{'dx':7,'dy':-14}),('A1',8,'U',{'dy':-14})],arrows=[(18,8,12,8)],**kw)
 wc=[c('A0',-12,4,'A₀',GREEN,[3,12]),c('A1',-20,4,'A₁',GOLD,[5,12],'7 4')]
 graph('1.3.1_we_1','R: oud · S: alleen prijs · T: beide veranderingen',wc,40,12,[0,8,16,24,32,40],[0,2,4,6,8,10,12],marks=[('A0',6,'R',{'dx':-12,'dy':-7}),('A0',8,'S',{'dx':12,'dy':-7}),('A1',8,'T',{'dx':-12,'dy':-7})],xlabel='q (basilicumtrays per week)',ylabel='P (€ per tray)',h=286)
 graph('1.3.1_ex_3','Een prijsverandering, dezelfde aanbodlijn',[c('A',-6,3,'A',GREEN,[2,10])],24,10,[0,6,12,18,24],[0,2,4,6,8,10],marks=[('A',4,'R'),('A',6,'S')],xlabel='q (houten lepels per week)',ylabel='P (€ per lepel)',h=242)
 graph('1.3.1_ex_4','De beginlijn: voeg het nieuwe aanbod zelf toe',[c('A0',-8,4,'A₀',GREEN,[2,10])],32,10,[0,8,16,24,32],[0,2,4,6,8,10],xlabel='q (kaarsen per week)',ylabel='P (€ per kaars)',h=246)
 ac=[c('A0',-32,8,'A₀',GREEN,[4,16])]
 graph('1.3.1_ex_8','Oorspronkelijk marktaanbod van kaas',ac,112,16,[0,28,56,84,112],[0,4,8,12,16],xlabel='Qₐ (kilo kaas per week)',ylabel='P (€ per kilo)')
 tc=[c('A0',-40,4,'A₀',GREEN,[10,30])]
 graph('1.3.1_ex_9','Aanbod van één tassenatelier: de beginlijn',tc,80,32,[0,20,40,60,80],[0,8,16,24,32],xlabel='q (sporttassen per maand)',ylabel='P (€ per tas)',h=235)
 # Equilibrium theory builds from plans to crossing, then separate gap diagrams.
 ms=[c('V',120,-10,'V',BLUE,[0,12]),c('A',-20,10,'A',GREEN,[2,12])]
 ekw=dict(xmax=120,ymax=12,xt=[0,20,40,60,80,100,120],yt=[0,2,4,6,8,10,12],xlabel='Q (broodjes per middag)',ylabel='P (€ per broodje)')
 graph('1.3.2_fig_1','Eerst de koopplannen: de collectieve vraag',ms[:1],**ekw,h=237)
 graph('1.3.2_fig_2','Nu ook de verkoopplannen: de lijnen kruisen',ms,marks=[('V',7,'E')],**ekw,h=290)
 graph('1.3.2_fig_3','Bij € 5: 70 gevraagd, 30 aangeboden',ms,marks=[('V',5,'Qv = 70',{'dx':45,'dy':-13}),('A',5,'Qa = 30',{'dx':-45,'dy':-13})],gap=('V','A',5,'vraagoverschot: 40',26),**ekw)
 graph('1.3.2_fig_4','Bij € 9: 30 gevraagd, 70 aangeboden',ms,marks=[('V',9,'Qv = 30',{'dx':45,'dy':-12}),('A',9,'Qa = 70',{'dx':-45,'dy':-12})],gap=('V','A',9,'aanbodoverschot: 40',-35),**ekw)
 fw=[c('V',80,-5,'V',BLUE,[0,16]),c('A',-20,5,'A',GREEN,[4,16])]
 graph('1.3.2_we_1','E: € 10 en 30 flessen per week',fw,80,16,[0,20,40,60,80],[0,4,8,12,16],marks=[('V',10,'E')],xlabel='Q (flessen per week)',ylabel='P (€ per fles)',h=245)
 lg=[c('V',60,-5,'V',BLUE,[0,12]),c('A',-10,5,'A',GREEN,[2,12])]
 graph('1.3.2_ex_14','Lees E en de twee plannen bij € 5',lg,60,12,[0,10,20,30,40,50,60],[0,2,4,6,8,10,12],marks=[('V',7,'E'),('V',5,'R',{'dx':15,'dy':-8}),('A',5,'S',{'dx':-15,'dy':-8})],xlabel='Q (lunchboxen per week)',ylabel='P (€ per lunchbox)')
 graph('1.3.2_ex_15','Alleen V staat er: teken A en het evenwicht zelf',[c('V',90,-5,'V',BLUE,[0,18])],150,18,[0,30,60,90,120,150],[0,3,6,9,12,15,18],xlabel='Q (posters per week)',ylabel='P (€ per poster)',h=250)
 sequence('1.3.2_fig_5','Een controle bestaat uit twee aparte berekeningen',['Gevonden prijs','Invullen','Vergelijken'],[['Niet afronden','tijdens het oplossen'],['In de vraagfunctie','én in de aanbodfunctie'],['Qv = Qa?','Eenheid en betekenis?']],'Gelijke uitkomsten controleren het evenwicht; ze zeggen niets over eerlijkheid.')
 # Changes: preserve scales across stages.
 ss=[c('V0',80,-4,'V₀',BLUE,[0,20]),c('A',-16,4,'A',GREEN,[4,24]),c('V1',96,-4,'V₁',NEW,[0,24],'7 4')]
 skw=dict(xmax=96,ymax=24,xt=[0,16,32,48,64,80,96],yt=[0,4,8,12,16,20,24],xlabel='Q (fietshelmen per week)',ylabel='P (€ per helm)')
 graph('1.3.3_fig_1','Meer kopers: kijk eerst bij de oude prijs van € 12',ss,marks=[('V0',12,'E₀',{'dx':-14,'dy':-13}),('V1',12,'R',{'dx':16,'dy':-8})],arrows=[(34,12,45,12)],**skw,h=282)
 graph('1.3.3_fig_2','Dezelfde lijnen: nu ook het nieuwe evenwicht',ss,marks=[('V0',12,'E₀',{'dx':-19,'dy':-7}),('V1',14,'E₁',{'dx':16,'dy':-12})],arrows=[(33,12.25,38.5,13.63)],**skw)
 supplyshift=[c('V',80,-4,'V',BLUE,[0,20]),c('A0',-16,4,'A₀',GREEN,[4,24]),c('A1',-32,4,'A₁',GOLD,[8,24],'7 4')]
 graph('1.3.3_fig_3','Andere oorzaak: duurdere materialen',supplyshift,96,24,[0,16,32,48,64,80,96],[0,4,8,12,16,20,24],marks=[('V',12,'E₀',{'dx':13,'dy':12}),('V',14,'E₁',{'dx':-18,'dy':-10})],xlabel='Q (fietshelmen per week)',ylabel='P (€ per helm)',arrows=[(29,12,19,12)],h=290)
 sw=[c('V',40,-2,'V',BLUE,[0,20]),c('A0',-8,2,'A₀',GREEN,[4,20]),c('A1',-16,2,'A₁',GOLD,[8,20],'7 4')]
 graph('1.3.3_we_1','Van E₀ (16; 12) naar E₁ (12; 14)',sw,40,20,[0,8,16,24,32,40],[0,4,8,12,16,20],marks=[('V',12,'E₀',{'dx':18,'dy':11}),('V',14,'E₁',{'dx':-18,'dy':-8})],xlabel='Q (bakjes aardbeien per dag)',ylabel='P (€ per bakje)',arrows=[(14.5,12,9.5,12)],h=237)
 gd=[c('V0',60,-3,'V₀',BLUE,[0,20]),c('A',-12,3,'A',GREEN,[4,24]),c('V1',72,-3,'V₁',NEW,[0,24],'7 4')]
 graph('1.3.3_ex_25','Meer kopers: de uitwerking is al ingetekend',gd,72,24,[0,12,24,36,48,60,72],[0,4,8,12,16,20,24],marks=[('V0',12,'E₀',{'dx':-17,'dy':-3}),('V1',14,'E₁',{'dx':15,'dy':-12})],xlabel='Q (flessen plantenvoeding per week)',ylabel='P (€ per fles)',h=231)
 gn=[c('V',100,-5,'V',BLUE,[0,20]),c('A0',-20,5,'A₀',GREEN,[4,20])]
 graph('1.3.3_ex_26','De oorspronkelijke markt voor notitieblokken',gn,100,20,[0,20,40,60,80,100],[0,4,8,12,16,20],xlabel='Q (notitieblokken per week)',ylabel='P (€ per blok)')
 w=[c('V',120,-6,'V',BLUE,[0,20]),c('A0',-24,6,'A₀',GREEN,[4,20])]
 graph('1.3.3_ex_29','Houten speelgoed: voeg A₁ en de uitkomsten toe',w,120,20,[0,24,48,72,96,120],[0,4,8,12,16,20],xlabel='Q (speelgoedsets per maand)',ylabel='P (€ per set)',h=240)
 cable=[c('V0',100,-5,'V₀',BLUE,[0,20]),c('A',-20,5,'A',GREEN,[4,24])]
 graph('1.3.3_ex_31','Oplaadkabels: de oorspronkelijke vraag en het aanbod',cable,120,24,[0,20,40,60,80,100,120],[0,4,8,12,16,20,24],xlabel='Q (kabels per week)',ylabel='P (€ per kabel)',h=233)
 sequence('1.3.3_fig_4','Van bron naar conclusie',['Bron','Oude prijs','Nieuwe uitkomst'],[['Welke factor','verandert?'],['Nieuwe plannen','vergelijken'],['Nieuwe gelijkheid','oplossen en verklaren']],'Een prijsreactie op een verschuiving is niet zelf een tweede verschuiving.')
 geometry()
 # Answer versions retain the student scales.
 graph('1.3.1_ans_4','Kaarsen: bij € 6 daalt q van 16 naar 8',[c('A0',-8,4,'A₀',GREEN,[2,10]),c('A1',-16,4,'A₁',GOLD,[4,10],'7 4')],32,10,[0,8,16,24,32],[0,2,4,6,8,10],marks=[('A0',6,'R'),('A1',6,'S')],xlabel='q (kaarsen per week)',ylabel='P (€ per kaars)',kind='answer',h=258)
 graph('1.3.1_ans_8','Kaas: meer aangeboden bij dezelfde prijs',ac+[c('A1',-16,8,'A₁',GOLD,[2,16],'7 4')],112,16,[0,28,56,84,112],[0,4,8,12,16],marks=[('A0',10,'R',{'dx':-12,'dy':-10}),('A1',10,'S',{'dx':14,'dy':-10})],xlabel='Qₐ (kilo kaas per week)',ylabel='P (€ per kilo)',kind='answer',h=278)
 graph('1.3.1_ans_9','Atelier Sprint: R = oud, S = alleen prijs, T = beide',tc+[c('A1',-52,4,'A₁',GOLD,[13,30],'7 4')],80,32,[0,20,40,60,80],[0,8,16,24,32],marks=[('A0',20,'R',{'dx':-14,'dy':8}),('A0',24,'S',{'dx':15,'dy':-8}),('A1',24,'T',{'dx':-12,'dy':-12})],xlabel='q (sporttassen per maand)',ylabel='P (€ per tas)',kind='answer',h=270)
 # Fully independently constructed graphs.
 for name,title,da,db,sa,sb,xm,ym,xs,ys,unit,price,gp in [
  ('1.3.2_ans_15','Posters: E = (50; 8)',90,-5,-30,10,150,18,[0,30,60,90,120,150],[0,3,6,9,12,15,18],'posters per week',8,6),
  ('1.3.2_ans_17','Schriften: E = (60; 8)',140,-10,-20,10,140,14,[0,20,40,60,80,100,120,140],[0,2,4,6,8,10,12,14],'schriften per week',8,6),
  ('1.3.2_ans_20','Bekers: E = (30; 12)',150,-10,-30,5,150,16,[0,30,60,90,120,150],[0,4,8,12,16],'bekers per week',12,10)]:
  cv=[c('V',da,db,'V',BLUE,[0,-da/db]),c('A',sa,sb,'A',GREEN,[-sa/sb,15 if name=='1.3.2_ans_20' else ym])]
  graph(name,title,cv,xm,ym,xs,ys,marks=[('V',price,'E')],xlabel=f'Q ({unit})',ylabel='P (€ per stuk)',kind='answer',h=285)
 ns=gn+[c('A1',-40,5,'A₁',GOLD,[8,20],'7 4')]
 graph('1.3.3_ans_26','Notitieblokken: minder transacties bij een hogere prijs',ns,100,20,[0,20,40,60,80,100],[0,4,8,12,16,20],marks=[('V',12,'E₀',{'dx':13,'dy':10}),('V',14,'E₁',{'dx':-16,'dy':-10})],xlabel='Q (notitieblokken per week)',ylabel='P (€ per blok)',kind='answer',h=280)
 graph('1.3.3_ans_29','Houten speelgoed: lagere prijs en meer transacties',w+[c('A1',-12,6,'A₁',GOLD,[2,20],'7 4')],120,20,[0,24,48,72,96,120],[0,4,8,12,16,20],marks=[('V',12,'E₀',{'dx':-14,'dy':-8}),('V',11,'E₁',{'dx':21,'dy':8})],xlabel='Q (speelgoedsets per maand)',ylabel='P (€ per set)',kind='answer',h=282)
 graph('1.3.3_ans_31','Oplaadkabels: V verschuift; op A vindt een beweging plaats',cable+[c('V1',120,-5,'V₁',NEW,[0,24],'7 4')],120,24,[0,20,40,60,80,100,120],[0,4,8,12,16,20,24],marks=[('V0',12,'E₀',{'dx':-20,'dy':-9}),('V1',14,'E₁',{'dx':20,'dy':-9})],arrows=[(43,12,57,12),(42,12.4,48,13.6)],xlabel='Q (kabels per week)',ylabel='P (€ per kabel)',kind='answer',h=280)
 tents=[c('V',120,-4,'V',BLUE,[0,30]),c('A0',-24,8,'A₀',GREEN,[3,24]),c('A1',-12,8,'A₁',GOLD,[1.5,24],'7 4')]
 graph('1.3.4_ans_36','Tenten: E₀ = (72; 12) en E₁ = (76; 11)',tents,160,30,[0,40,80,120,160],[0,5,10,15,20,25,30],marks=[('V',12,'E₀',{'dx':-8,'dy':-25}),('V',11,'E₁',{'dx':24,'dy':9})],xlabel='Q (tenten per maand)',ylabel='P (€ per tent)',kind='answer',h=290,labels={'A0':(144,21,5,-11),'A1':(144,19.5,5,22)})
 bags=[c('V',180,-10,'V',BLUE,[0,18]),c('A0',-20,10,'A₀',GREEN,[2,18]),c('A1',-60,10,'A₁',GOLD,[6,18],'7 4')]
 graph('1.3.4_ans_37','Tassen: E₀ = (80; 10) en E₁ = (60; 12)',bags,180,18,[0,30,60,90,120,150,180],[0,3,6,9,12,15,18],marks=[('V',10,'E₀',{'dx':18,'dy':13}),('V',12,'E₁',{'dx':-18,'dy':-9})],arrows=[(75,10,46,10),(76,10.4,64,11.6)],xlabel='Q (tassen per week)',ylabel='P (€ per tas)',kind='answer',h=315)
 (R/'QA/figures.json').write_text(json.dumps(REG,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
 print('Generated',len(REG),'figures')
if __name__=='__main__':make()
