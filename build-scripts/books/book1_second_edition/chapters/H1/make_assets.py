import os
"""Exact instructional SVGs and corresponding PNGs; no generated illustration maths."""
from pathlib import Path
from html import escape
import json, math
import cairosvg
ROOT=Path(os.environ['BOOK1_CHAPTER_ROOT']); A=ROOT/'_assets';A.mkdir(exist_ok=True); QA=ROOT/'QA';QA.mkdir(exist_ok=True)
INK='#183247'; BLUE='#17688f'; TEAL='#227064'; GOLD='#ad601b'; PALE='#edf5f8'; GREY='#536777'
REG=[]
def txt(x,y,t,size=17,color=INK,anchor='start',weight='400',extra=''):
    return f'<text x="{x:.3f}" y="{y:.3f}" font-family="Lato, DejaVu Sans, sans-serif" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{weight}" {extra}>{escape(str(t))}</text>'
def line(x1,y1,x2,y2,color=INK,width=2,dash='',extra=''):
    return f'<line x1="{x1:.5f}" y1="{y1:.5f}" x2="{x2:.5f}" y2="{y2:.5f}" stroke="{color}" stroke-width="{width}"'+(f' stroke-dasharray="{dash}"' if dash else '')+f' {extra}/>'
def rect(x,y,w,h,fill=PALE,stroke='none',rx=6):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>'
def start(h=360):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{h}" viewBox="0 0 720 {h}"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7Z" fill="{INK}"/></marker></defs>'+rect(0,0,720,h,'#f7fafb',rx=8)
def save(name,s,h=360,kind='instruction',meta=None):
    doc=start(h)+s+'</svg>'; (A/(name+'.svg')).write_text(doc, encoding='utf8', newline='\n')
    cairosvg.svg2png(bytestring=doc.encode(),write_to=str(A/(name+'.png')),output_width=1440)
    REG.append({'file':name,'kind':kind,'width':720,'height':h,**(meta or {})})
def flow(name,title,nodes,bottom='',kind='instruction'):
    s=txt(360,27,title,20,BLUE,'middle','700'); n=len(nodes); gap=28; w=(672-(n-1)*gap)/n
    for i,(head,lines) in enumerate(nodes):
        x=24+i*(w+gap);s+=rect(x,54,w,100,PALE,'#cedce3')+txt(x+w/2,81,head,19,BLUE,'middle','700')
        for j,t in enumerate(lines):s+=txt(x+w/2,109+j*22,t,16,INK,'middle')
        if i<n-1:s+=line(x+w+4,104,x+w+gap-5,104,INK,1.6,extra='marker-end="url(#arrow)"')
    if bottom:s+=txt(360,187,bottom,17,INK,'middle')
    save(name,s,208,kind,{'type':'flow','nodes':nodes})
def choices(name,title,top,options,foot,chosen=None):
    s=txt(360,28,title,20,BLUE,'middle','700')+rect(209,48,302,47,PALE,'#b8cdd8')+txt(360,78,top,19,INK,'middle','700')
    for i,(a,b,c) in enumerate(options):
        x=22+i*233
        s+=line(360,95,x+105,119,GREY,1.4,extra='marker-end="url(#arrow)"')
        s+=rect(x,121,211,100,'#e8f3ef' if i==chosen else '#eef3f6','#bfd1db')
        s+=txt(x+105,149,a,19,BLUE,'middle','700')+txt(x+105,175,b,17,INK,'middle')+txt(x+105,201,c,16,INK,'middle')
    s+=txt(360,251,foot,17,INK,'middle');save(name,s,273,meta={'type':'choice','options':options,'chosen':chosen})
def chart(name,title,points,xmax,ymax,xticks,yticks,xlabel='Hoeveelheid Q (stuks)',ylabel='Prijs P (€ per stuk)',stage='line',read=None,kind='instruction',tag='',height=360):
    h=height; left,right,top,bottom=82,665,51,h-64
    X=lambda x:left+x/xmax*(right-left);Y=lambda y:bottom-y/ymax*(bottom-top)
    s=txt(360,26,title,20,BLUE,'middle','700')
    s+=line(left,bottom,left,top-6,INK,2,extra='marker-end="url(#arrow)"')+line(left,bottom,right+11,bottom,INK,2,extra='marker-end="url(#arrow)"')
    s+=txt(374,h-12,xlabel,17,INK,'middle')+txt(20,(top+bottom)/2,ylabel,17,INK,'middle',extra=f'transform="rotate(-90 20 {(top+bottom)/2})"')
    for v in xticks:
        s+=line(X(v),bottom,X(v),bottom+5,INK,1.2)+txt(X(v),bottom+24,v,16,INK,'middle')
        if v>0:s+=line(X(v),top,X(v),bottom,'#dce5e9',.6)
    for v in yticks:
        s+=line(left-5,Y(v),left,Y(v),INK,1.2)
        if v>0:s+=txt(left-10,Y(v)+5,v,16,INK,'end')+line(left,Y(v),right,Y(v),'#dce5e9',.6)
    if stage in ['line','read']:
        for i,(p1,p2) in enumerate(zip(points,points[1:])):
            s+=line(X(p1[0]),Y(p1[1]),X(p2[0]),Y(p2[1]),BLUE,3,extra=f'data-role="data-line" data-segment="{i}"')
    if stage!='axes':
        for i,(x,y) in enumerate(points):s+=f'<circle cx="{X(x):.5f}" cy="{Y(y):.5f}" r="4" fill="{BLUE}" data-role="data-point" data-index="{i}"/>'
    if read:
        x,y=read;s+=line(left,Y(y),X(x),Y(y),GOLD,1.7,'6,4')+line(X(x),bottom,X(x),Y(y),GOLD,1.7,'6,4')+f'<circle cx="{X(x):.5f}" cy="{Y(y):.5f}" r="5" fill="{GOLD}" data-role="reading-point"/>'
        s+=txt(X(x)+13,Y(y)-13,f'({str(x).replace(".",",")}; {str(y).replace(".",",")})',17,GOLD,'start','700')
    if tag:s+=txt(651,67,tag,16,GREY,'end')
    save(name,s,h,kind,{'type':'chart','points':points,'xmax':xmax,'ymax':ymax,'plot':[left,right,top,bottom],'stage':stage,'reading':read})
def changebars(name,title,old,new,label='prijs (€)',kind='instruction'):
    maxv=max(old,new)*1.18;scale=410/maxv;s=txt(360,27,title,20,BLUE,'middle','700')
    for row,(t,v,col) in enumerate([('Oud',old,BLUE),('Nieuw',new,TEAL)]):
        y=62+row*65;s+=txt(30,y+24,t,18)+rect(112,y,v*scale,33,col,rx=1)+txt(122+v*scale,y+24,str(v).replace('.',','),18,col,'start','700')
    s+=txt(30,218,label,16,GREY)+txt(360,252,'Vergelijk het verschil steeds met de oude waarde.',18,INK,'middle')
    save(name,s,276,kind,{'type':'bars','values':[old,new],'pixels_per_unit':scale})
def sharebars(name,title,share1,share2):
    s=txt(360,27,title,20,BLUE,'middle','700')
    for j,v in enumerate([share1,share2]):
        y=66+69*j;s+=txt(32,y+21,'Oud' if j==0 else 'Nieuw',18)
        s+=rect(116,y,480,32,'#dce8ee',rx=0)+rect(116,y,480*v/100,32,BLUE if j==0 else TEAL,rx=0)+txt(612,y+23,f'{v}%',18,INK,'start','700')
    s+=txt(360,227,f'+{share2-share1} procentpunten: het verschil tussen de aandelen',17,INK,'middle')
    rel=(share2-share1)/share1*100;s+=txt(360,255,f'+{rel:g}%: het verschil vergeleken met het oude aandeel',17,INK,'middle')
    save(name,s,276,meta={'type':'shares','values':[share1,share2],'pixels_per_percent':4.8})
def indexcards(name):
    s=txt(360,27,'Eén vaste basis; steeds opnieuw de juiste vergelijking',20,BLUE,'middle','700')
    rows=[('Basisjaar','€ 50','Index 100'),('Jaar 2','€ 60','Index 120'),('Jaar 3','€ 66','Index 132')]
    for j,(a,b,c) in enumerate(rows):
        x=25+j*236;s+=rect(x,49,200,105,PALE,'#bdd0da')+txt(x+100,75,a,17,INK,'middle')+txt(x+100,109,b,25,BLUE,'middle','700')+txt(x+100,139,c,19,INK,'middle')
    s+=line(324,184,633,184,INK,1.5,extra='marker-start="url(#arrow)" marker-end="url(#arrow)"')+txt(475,213,'120 → 132: +12 indexpunten',17,INK,'middle')+txt(475,242,'12 / 120 × 100% = 10%',18,TEAL,'middle','700')
    save(name,s,266,meta={'type':'index','values':[50,60,66],'indices':[100,120,132]})
def area(name,x0,x1,y0,y1,show_solution=False,kind='instruction'):
    s=txt(360,26,'Een rechthoek en een driehoek op een plattegrond',20,BLUE,'middle','700'); meta=[]
    xmax=x1+2;ymax=y1+1
    for j,triangle in enumerate([False,True]):
        left=50+j*359;right=left+262;top=56;bottom=267
        X=lambda x:left+x/xmax*(right-left);Y=lambda y:bottom-y/ymax*(bottom-top)
        s+=line(left,bottom,left,top,INK,1.5,extra='marker-end="url(#arrow)"')+line(left,bottom,right+4,bottom,INK,1.5,extra='marker-end="url(#arrow)"')
        s+=txt(left+128,321,'Horizontale positie (m)',15,INK,'middle')+txt(left-35,166,'Verticale positie (m)',15,INK,'middle',extra=f'transform="rotate(-90 {left-35} 166)"')
        for v in [0,x0,x1]:
            if v==0 and x0==0:continue
            s+=txt(X(v),288,v,15,INK,'middle')+line(X(v),bottom,X(v),Y(y0),'#8a9ca7',1,'4,4')
        for v in [y0,y1]:s+=txt(left-7,Y(v)+5,v,15,INK,'end')+line(left,Y(v),X(x0),Y(v),'#8a9ca7',1,'4,4')
        pts=[(x0,y0),(x1,y0),(x0,y1)] if triangle else [(x0,y0),(x1,y0),(x1,y1),(x0,y1)]
        s+=f'<polygon points="'+ ' '.join(f'{X(x):.5f},{Y(y):.5f}' for x,y in pts)+f'" fill="{TEAL if triangle else BLUE}" fill-opacity="0.16" stroke="{TEAL if triangle else BLUE}" stroke-width="2" data-role="area" data-index="{j}"/>'
        val=(x1-x0)*(y1-y0)/(2 if triangle else 1)
        if show_solution:
            cx=X((2*x0+x1)/3 if triangle else (x0+x1)/2);cy=Y((2*y0+y1)/3 if triangle else (y0+y1)/2)
            s+=txt(cx,cy,f'{val:g} m²',19,INK,'middle','700')
        meta.append({'vertices':pts,'area':val,'plot':[left,right,top,bottom],'max':[xmax,ymax]})
    save(name,s,345,kind,{'type':'area','panels':meta,'solution':show_solution})

def main():
    flow('1.1.1_fig_1','Je kunt hetzelfde middel niet tegelijk twee keer gebruiken', [('Behoeften',['Wat wil je bereiken?']),('Beperkt middel',['Tijd, geld of ruimte']),('Keuze',['Wat doe je wél?'])], 'Een keuze betekent dat een andere mogelijkheid vervalt.')
    choices('1.1.1_fig_2','De beste mogelijkheid die je laat liggen','Drie uur op zaterdag',[('Naar de bibliotheek','Jouw gekozen activiteit','Geen toegangsprijs'),('Honden uitlaten','3 × € 8 = € 24','Beste gemiste geldbedrag'),('Tuinwerk','3 × € 6 = € 18','Niet óók erbij optellen')],'Bij deze vergelijking loop je € 24 aan inkomsten mis.',0)
    flow('1.1.1_we_1','Van beperkte tijd naar twee vergelijkbare uitkomsten',[('Middel',['4 uur in de buurtzaal']),('Vergelijk',['€ 160 of € 220']),('Kies bij het doel',['Meeste geld: € 220'])],'De opgegeven activiteit is € 160 waard; niet het verschil van € 60.')
    choices('1.1.1_ex_3','Een ingevulde vergelijking','Eén middag in de studio',[('Portretfoto’s','Netto € 180','Gekozen: hoogste bedrag'),('Productfoto’s','Netto € 150','Beste opgegeven optie'),('Andere boeking','Niet beschikbaar','Geen haalbaar alternatief')],'Alternatieve kosten van de gekozen portretmiddag: € 150.',0)
    s=txt(360,27,'Twee verschillende vergelijkingen',20,BLUE,'middle','700')
    s+=rect(24,51,324,140,PALE,'#cbdbe3')+rect(372,51,324,140,PALE,'#cbdbe3')
    s+=txt(186,79,'Bedrag per eenheid',19,BLUE,'middle','700')+txt(186,113,'€ 180 voor 12 personen',18,INK,'middle')+txt(186,146,'€ 180 / 12 = € 15',21,INK,'middle','700')+txt(186,176,'Eenheid: euro per persoon',16,GREY,'middle')
    s+=txt(534,79,'Deel van een groep',19,BLUE,'middle','700')+txt(534,113,'18 van de 60 leerlingen',18,INK,'middle')+txt(534,146,'18 / 60 × 100% = 30%',21,INK,'middle','700')+txt(534,176,'Eenheid: procent',16,GREY,'middle')
    save('1.1.2_fig_1',s,214,meta={'type':'ratio-comparison','ratios':[[180,12,15],[18,60,.3]]})
    changebars('1.1.2_fig_2','Van € 80 naar € 100: de oude € 80 is de basis',80,100)
    sharebars('1.1.2_fig_3','20% naar 25%: twee juiste, verschillende beschrijvingen',20,25)
    indexcards('1.1.2_fig_4')
    changebars('1.1.2_ex_12','De berekening is ingevuld: € 48 → € 60 is +25%',48,60)
    pts=[(80,2),(60,4),(40,6)]
    chart('1.1.3_fig_1','Stap 1 · Kies de assen en een bruikbare schaal',pts,100,8,list(range(0,101,20)),list(range(0,9,2)),stage='axes',xlabel='Reserveringen Q (per middag)',ylabel='Prijs P (€ per reservering)')
    chart('1.1.3_fig_2','Stap 2 · Zet de drie punten en verbind ze',pts,100,8,list(range(0,101,20)),list(range(0,9,2)),xlabel='Reserveringen Q (per middag)',ylabel='Prijs P (€ per reservering)')
    chart('1.1.3_fig_3','Stap 3 · Lees tussen twee punten: Q = 55 bij P = € 4,50',pts,100,8,list(range(0,101,20)),list(range(0,9,2)),read=(55,4.5),xlabel='Reserveringen Q (per middag)',ylabel='Prijs P (€ per reservering)')
    flow('1.1.3_fig_4','Vooruit invullen en terugrekenen',[('Aantal n',['4 stoelen']),('Rekenregel',['× 3, daarna + 6']),('Bedrag T',['€ 18'])],'Terug: van € 18 eerst € 6 afhalen, daarna delen door € 3.')
    area('1.1.3_fig_5',2,8,3,7,True)
    chart('1.1.3_fig_6','Een tijdreeks: tijd staat nu op de horizontale as',[(1,20),(3,36),(6,60)],7,70,list(range(0,8)),list(range(0,71,10)),xlabel='Tijd t (dagen)',ylabel='Totaal ingeleverde boeken (aantal)',tag='Geconstrueerde waarnemingen')
    chart('1.1.3_we_1','Uitgewerkt voorbeeld · Verwachte reserveringen',[(60,2),(40,4),(20,6)],80,8,list(range(0,81,20)),list(range(0,9,2)),xlabel='Reserveringen Q (per middag)',ylabel='Prijs P (€ per reservering)',read=(30,5))
    area('1.1.3_we_2',1,5,2,5,True)
    chart('1.1.3_ex_24','Lees de ingevulde grafiek',[(90,2),(60,4),(30,6)],120,8,list(range(0,121,30)),list(range(0,9,2)),xlabel='Verhuringen Q (per dag)',ylabel='Prijs P (€ per verhuring)',read=(45,5),height=278)
    chart('1.1.3_ex_25','Vul zelf de grafiek aan',[],100,10,list(range(0,101,20)),list(range(0,11,2)),xlabel='Bestellingen Q (per week)',ylabel='Prijs P (€ per bestelling)',stage='axes')
    area('1.1.3_ex_29',3,11,2,7,False)
    area('1.1.3_ex_30',2,8,4,8,False)
    area('1.1.4_ex_37',1,7,2,5,False)
    # Complete solutions for every graph-production exercise.
    chart('1.1.3_ans_25','Opgave 25 · Volledig ingevulde grafiek',[(80,2),(60,4),(40,6),(20,8)],100,10,list(range(0,101,20)),list(range(0,11,2)),xlabel='Bestellingen Q (per week)',ylabel='Prijs P (€ per bestelling)',read=(50,5),kind='answer')
    chart('1.1.3_ans_27','Opgave 27 · Grafiek en interpolatie',[(120,3),(90,6),(60,9)],150,12,list(range(0,151,30)),list(range(0,13,3)),xlabel='Bezoekers Q (per middag)',ylabel='Prijs P (€ per bezoek)',read=(100,5),kind='answer')
    chart('1.1.3_ans_30','Opgave 30 · Grafiek en interpolatie',[(100,2),(70,5),(40,8)],120,10,list(range(0,121,20)),list(range(0,11,2)),xlabel='Reserveringen Q (per middag)',ylabel='Prijs P (€ per reservering)',read=(80,4),kind='answer')
    chart('1.1.4_ans_36','Opgave 36 · Model voor het bezoekersaantal',[(180,4),(140,6),(100,8)],200,10,list(range(0,201,40)),list(range(0,11,2)),xlabel='Bezoekers Q (per avond)',ylabel='Ticketprijs P (€ per bezoeker)',read=(120,7),kind='answer')
    area('1.1.3_ans_29',3,11,2,7,True,'answer');area('1.1.3_ans_30_area',2,8,4,8,True,'answer');area('1.1.4_ans_37',1,7,2,5,True,'answer')
    (QA/'figures.json').write_text(json.dumps(REG,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    print('Created',len(REG),'figure pairs')
if __name__=='__main__':main()
