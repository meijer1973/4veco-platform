"""Native, selectable diagrams over the approved illustrative cover background."""
from reportlab.lib.colors import HexColor, Color

def draw_cover(c, data, width, height, image_size):
    scale=min(width/image_size[0],height/image_size[1])
    bottom=(height-image_size[1]*scale)/2
    x0=38*scale; y=bottom+(image_size[1]-885)*scale
    gap=12*scale; panel=(width-2*x0-2*gap)/3; ph=430*scale
    ink=HexColor('#143953');blue=HexColor('#16799e');orange=HexColor('#d77832')
    def text(x,y,s,size=8,bold=False,color=ink):
        c.setFillColor(color);c.setFont('LatoBold' if bold else 'LatoRegular',size);c.drawString(x,y,s)
    def axes(x,y,w,h,xmax,ymax,xlab,ylab):
        c.setStrokeColor(ink);c.setLineWidth(.7)
        c.line(x,y,x+w,y);c.line(x,y,x,y+h)
        text(x-4,y+h+10,ylab,8)
        text(x+w-17,y-22,xlab,8)
        return lambda q,p:(x+w*q/xmax,y+h*p/ymax)
    def line(points,color=blue):
        c.setStrokeColor(color);c.setLineWidth(1.8)
        for a,b in zip(points,points[1:]):c.line(*a,*b)
    for i,title in enumerate(['Rekenen met indexcijfers','Vraag','Vraag en aanbod']):
        x=x0+i*(panel+gap)
        c.setFillColor(Color(1,1,1,.94));c.setStrokeColor(HexColor('#c9e2ec'))
        c.roundRect(x,y,panel,ph,7,fill=1,stroke=1)
        text(x+10,y+ph-21,title,10.5,True)
        text(x+10,y+ph-36,'Fictief rekenvoorbeeld',7.5,color=HexColor('#506b7b'))
        ax=x+27;ay=y+86;w=panel-44;h=ph-145
        if i==0:
            rows=data['index'];base=axes(ax,ay,w,h,4,70,'jaar','index (jaar 1 = 100)')
            pos=lambda j,index:base(j,index-90)
            for index in [100,125,150]:
                px,py=pos(0,index);text(px-20,py-2,str(index),6.5)
            line([pos(j,r['index']) for j,r in enumerate(rows)])
            for j,r in enumerate(rows):
                px,py=pos(j,r['index']);c.setFillColor(blue);c.circle(px,py,2,fill=1,stroke=0)
                text(px-2,ay-11,str(j+1),7)
            text(x+10,y+60,'Jaar         Prijs (€)         Index',7.8,True)
            for j,r in enumerate(rows):
                yy=y+49-j*10
                text(x+15,yy,str(j+1),7.5)
                text(x+56,yy,f'{r["price"]:.2f}'.replace('.',','),7.5)
                text(x+111,yy,str(r['index']),7.5)
        elif i==1:
            pos=axes(ax,ay,w,h,50,5,'Qv','P (€)')
            line([pos(50,0),pos(0,5)])
            for q,p in [(0,5),(50,0)]:
                px,py=pos(q,p);text(px+(4 if q==0 else -12),py+(4 if p else -12),str(p if q==0 else q),7)
            text(x+10,y+57,'Qv = 50 − 10P',9,True)
            text(x+10,y+39,'Hogere eigen prijs →',8)
            text(x+10,y+27,'kleinere gevraagde hoeveelheid',7.7)
            text(x+10,y+13,'(ceteris paribus)',7.8)
        else:
            pos=axes(ax,ay,w,h,60,6,'Q','P (€)')
            line([pos(60,0),pos(0,6)]);line([pos(0,0),pos(60,6)],orange)
            px,py=pos(30,3);c.setStrokeColor(ink);c.setDash(2,2);c.setLineWidth(.6)
            c.line(ax,py,px,py);c.line(px,ay,px,py);c.setDash()
            text(ax-12,py-3,'3',8);text(px-5,ay-12,'30',8);text(px+5,py+3,'E',8,True)
            text(x+10,y+57,'Qv = 60 − 10P',8.5)
            text(x+10,y+43,'Qa = 10P',8.5)
            text(x+10,y+26,'Evenwicht: P = € 3 en Q = 30',7.8,True)
            text(x+10,y+12,'Vraag en aanbod zijn gelijk.',7.8)
