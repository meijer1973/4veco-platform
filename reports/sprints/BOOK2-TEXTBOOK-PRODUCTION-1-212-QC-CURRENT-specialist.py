"""Independent specialist probes from the actual §212 question givens.

HOW TO ADAPT: use new prefix and independently solve/inspect; never infer a
personal verdict from these mechanical checks or overwrite prior evidence.
"""
from pathlib import Path
from fractions import Fraction as F
import argparse
import base64
import copy
import importlib.util
import io
import json
import re
import xml.etree.ElementTree as ET

PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT'
spec=importlib.util.spec_from_file_location('own212qc',Path(__file__).with_name(PREFIX+'-check.py'))
q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q)

def mathematics():
    rows=[]
    def check(name,value,expected,meaning):
        assert value==F(expected),(name,value,expected)
        rows.append({'case':name,'exact':str(value),'decimal':float(value),'meaning':meaning})
    # Independent rational calculations from complete source reading, not the
    # native test function's precomputed list or its assertion implementation.
    contexts=[('theatre',60,'2','5',30,[0,10,20,30],[-60,-30,0,30]),
              ('kayak',20,'1','7',6,[2,3,4,6],[-8,-2,4,16]),
              ('soap',10,'1','4',6,[2,3,4,6],[-4,-1,2,8]),
              ('pots',15,'1','4',8,[3,4,5,8],[-6,-3,0,9]),
              ('minigolf',40,'1','4',20,[10,13,14,20],[-10,-1,2,20]),
              ('bakery',500,'4/5','3/2',1000,[500,714,715,1000],[-150,'-1/5','1/2',200])]
    exact_intersections={'theatre':('20','100'),'kayak':('10/3','70/3'),'soap':('10/3','40/3'),
                         'pots':('5','20'),'minigolf':('40/3','160/3'),'bakery':('5000/7','7500/7')}
    for name,fixed,var,price,maximum,quantities,profits in contexts:
        v,p=F(var),F(price)
        break_even=F(fixed)/(p-v); amount=p*break_even
        check(name+' continuous Q',break_even,exact_intersections[name][0],'Exact continuous equality, not an integer sale or optimal output.')
        check(name+' crossing euro',amount,exact_intersections[name][1],'Money total for the same period, not unit price.')
        assert amount==fixed+v*break_even and 0<=break_even<=maximum
        first=-(-break_even.numerator//break_even.denominator)
        assert p*first-fixed-v*first>=0 and p*(first-1)-fixed-v*(first-1)<0
        rows.append({'case':name+' integer decision','first_no_loss':first,'before_profit':str((p-v)*(first-1)-fixed),
                     'first_profit':str((p-v)*first-fixed),'condition':'Within this constant P/v model, profit rises with Q; ceiling of exact crossing, including equality.'})
        for amount_q,expected in zip(quantities,profits):
            check(name+f' profit at Q{amount_q}',p*amount_q-(fixed+v*amount_q),expected,'TO minus TK at identical Q and period; signed total.')
        check(name+' GO for positive Q',p*maximum/maximum,price,'Same fixed unit price, Q>0; Q=0 undefined by division.')
    check('Start1 TK',F(12)+3*2,18,'euro per afternoon')
    check('Start1 GTK',F(18)/2,9,'euro per candle, not total afternoon expense')
    check('Start1 equality',F(12)/(3-1),6,'Both sides18 after identical operations; prior algebra, not newly assessed break-even meaning.')
    check('Start2 TO',F(8)*2,16,'euro per afternoon; same produced and sold quantity')
    check('Start2 GO',F(16)/2,8,'euro per candle')
    check('Start2 profit',F(16)-18,-2,'euro per afternoon loss, not revenue')
    for label,p,f,expected in [('base',5,20,20),('price only',6,20,30),('fixed only',5,30,10),('both',6,30,20)]:
        check('Dance '+label,F(p)*10-(f+10),expected,'Fixed Q10; no inferred demand response or price optimum.')
    for label,value,expected in [('TCK',F(24),24),('TVK',F(3)*6,18),('TK',F(24)+3*6,42),('GTK',F(42)/6,7)]:
        check('Closing '+label,value,expected,'Same day/same six tools; averages per tool, other totals per day.')
    check('Bonus money gap A',F(150)-120,30,'euro per evening at Q30')
    check('Bonus money gap B',F(150)-120,30,'same amount, unchanged economic model')
    check('Bonus drawn A',F(30,150)*180,36,'native drawing units across fixed180-unit plotting height')
    check('Bonus drawn B',F(30,300)*180,18,'half physical height does not halve money profit')
    check('Target score',F(2+2+3+4),11,'No extra mandatory table or additional target operation.')
    check('Core timing',F(2+14+8+2+6+10+12),54,'Unobserved entire lesson design including two complete construction tasks.')
    check('Supported timing',F(54+3+6+4),67,'Optional printed support requires continuation time.')
    check('All printed timing',F(67+6+4),77,'Bonus and closing outside core; unobserved.')
    q.save('independent-mathematics.json',{'pass':True,'actor':q.ACTOR,'role':q.ROLE,'rows':rows,
       'sources':{n:q.raw(q.P/q.SRC/n) for n in ('theory.md','exercises.md','answers.md','target-answers.md')},
       'bonus_model_criteria':['Equal30 euro profit per evening at Q30','150-to300 vertical scale explains half paper gap','Compare quantities, units, period, Q, scales and TO/TK amounts, not millimetres'],
       'bounded_recap_flag':'Recap omits repeated model/range/increasing-profit qualification; body teaches it explicitly, no universal claim.',
       'observed_timing_or_attainment':False})

def figures():
    import cairosvg
    from PIL import Image
    rows=[]
    ns='{http://www.w3.org/2000/svg}'
    specs={
      '2.1.2_fig_1':(60,2,5,30,150,False,False,False),
      '2.1.2_fig_2':(60,2,5,30,150,True,False,False),
      '2.1.2_fig_3':(60,2,5,30,150,True,True,False),
      '2.1.2_fig_4':(60,2,5,30,150,True,True,True),
      '2.1.2_we_1':(20,1,7,6,50,True,True,True),
      '2.1.2_ex_1':(10,1,4,6,30,True,True,True),
      '2.1.2_ex_2':(15,1,4,8,40,True,False,False),
      '2.1.2_ex_3':(15,1,4,8,40,True,True,True),
      '2.1.2_ex_4':(40,1,4,20,80,True,True,True),
      '2.1.2_ex_5':(500,F(4,5),F(3,2),1000,1600,True,True,True)}
    def near(actual,expected): assert abs(float(actual)-float(expected))<.002,(actual,expected)
    for path in sorted((q.D/'_assets').glob('*.svg')):
        tree=ET.fromstring(path.read_bytes()); width,height=map(float,(tree.attrib['width'],tree.attrib['height']))
        text=list(tree.iter(ns+'text')); ink=[]
        for element in text:
            assert element.attrib['font-size']=='30pt'
            # Isolated exact native glyph masks on an extended transparent
            # canvas detect real ink beyond the source viewport. No pupil asset
            # is replaced and no visual verdict is inferred from coordinates.
            svg=ET.Element(ns+'svg',{'width':str(width+200),'height':str(height+200),'viewBox':f'-100 -100 {width+200} {height+200}'})
            group=ET.SubElement(svg,ns+'g',{'font-family':'Arial,DejaVu Sans,sans-serif'})
            group.append(copy.deepcopy(element))
            rendered=cairosvg.svg2png(bytestring=ET.tostring(svg),scale=2)
            with Image.open(io.BytesIO(rendered)) as im:
                bounds=im.getchannel('A').getbbox(); assert bounds
                actual=[v/2-100 for v in bounds]
                assert actual[0]>=0 and actual[1]>=0 and actual[2]<=width and actual[3]<=height,(path.name,element.text,actual)
                ink.append({'text':element.text,'bbox_source_units':actual,'font_source_pt':30})
        lines=list(tree.iter(ns+'line')); circles=list(tree.iter(ns+'circle'))
        if path.stem in specs:
            f,v,p,xmax,ymax,tk,cross,gap=specs[path.stem]
            def point(x,y):return(150+F(x)/xmax*620,445-F(y)/ymax*330)
            cost=[e for e in lines if e.attrib.get('stroke')=='#6F3611']
            revenue=[e for e in lines if e.attrib.get('stroke')=='#1A5276']
            assert len(cost)==int(tk)
            has_to=path.stem!='2.1.2_ex_2';assert len(revenue)==int(has_to)
            for e,ends in [(e,(point(0,f),point(xmax,f+v*xmax))) for e in cost]+[(e,(point(0,0),point(xmax,p*xmax))) for e in revenue]:
                for name,value in zip(('x1','y1','x2','y2'),(*ends[0],*ends[1])):near(e.attrib[name],value)
            assert len(circles)==int(cross)
            if cross:
                bq=F(f)/(p-v); bx,by=point(bq,p*bq)
                near(circles[0].attrib['cx'],bx);near(circles[0].attrib['cy'],by)
            brackets=[e for e in lines if e.attrib.get('stroke-width')=='4' and e.attrib.get('x1')==e.attrib.get('x2')]
            assert len(brackets)==int(gap)
            if gap:
                e=brackets[0];near(e.attrib['x1'],794);near(e.attrib['y1'],point(xmax,p*xmax)[1]);near(e.attrib['y2'],point(xmax,f+v*xmax)[1])
        else:
            assert path.stem=='2.1.2_ex_6' and width==1500 and height==830
            brackets=[e for e in lines if e.attrib.get('stroke-width')=='4' and e.attrib.get('x1')==e.attrib.get('x2')]
            assert len(brackets)==2
            for e,length in zip(brackets,(36,18)):near(float(e.attrib['y2'])-float(e.attrib['y1']),length)
        rows.append({'asset':path.name,'svg_sha256':q.raw(path),'png_sha256':q.raw(path.with_suffix('.png')),
             'native_title':tree.find(ns+'title').text,'canvas':[width,height],'text_ink_bounds':ink,
             'geometry_pass':True,'personal_inspection':'SEPARATE_REQUIRED'})
    assert len(rows)==11
    q.save('independent-figure-geometry-ink.json',{'pass':True,'rows':rows,'render_environment':'Python314 inherited-PATH CairoSVG glyph masks; exact backend separately recorded in runtime diagnostic',
        'actual_font_floor':'30pt source; final PDF placement independently checked; source bounds not visual acceptance.'})

def semantics():
    from bs4 import BeautifulSoup
    import fitz
    records=[]
    norm=lambda x:re.sub(r'\s+',' ',x).strip()
    for kind in q.KINDS:
        htmlpath=q.D/f'{q.STEM} – {kind}.html';text=htmlpath.read_text(encoding='utf-8');soup=BeautifulSoup(text,'html.parser')
        with fitz.open(q.D/f'{q.STEM} – {kind}.pdf') as pdf:
            alltext=norm(' '.join(page.get_text() for page in pdf))
            nodes=[]
            for node in soup.body.find_all(string=True):
                value=norm(str(node))
                if value and node.parent.name not in ('style','script'):
                    # PDF visual line wrapping may insert a space inside an
                    # unsplit inline formula (e.g. Q)/ + newline + Q). Compare
                    # all non-whitespace characters, never replace glyphs.
                    assert re.sub(r'\s+','',value) in re.sub(r'\s+','',alltext),(kind,value)
                    nodes.append(value)
        images=[]
        for im in soup.find_all('img'):
            alt=im.get('alt','');assert alt and len(alt)<=120
            assert re.match(r'^(Theater|Theatermodel|Zeep|Bloempotten|Minigolf|Bakkerij|Het volledige voorbeeld|Opgave)',alt)
            data=base64.b64decode(im['src'].split(',',1)[1]);match=[p for p in (q.D/'_assets').glob('*.png') if p.read_bytes()==data]
            assert len(match)==1
            fig=im.find_parent('figure');caption=fig.find('figcaption')
            images.append({'asset':match[0].name,'png_sha256':q.h(data),'actual_alt':alt,'alt_characters':len(alt),
                           'full_caption':caption.get_text(),'caption_aria_hidden':caption.get('aria-hidden'),
                           'line':next(i for i,line in enumerate(text.splitlines(),1) if str(im) in line or 'alt="'+alt+'"' in line)})
        records.append({'kind':kind,'html_sha256':q.raw(htmlpath),'pdf_sha256':q.raw(htmlpath.with_suffix('.pdf')),
                         'all_body_text_nodes_present_in_pdf':len(nodes),'whitespace_only_pdf_wrap_normalization':True,'images':images})
    q.save('actual-html-pdf-semantics.json',{'pass':True,'editions':records,'scope':'Actual native alternatives, captions and embedded bytes; semantic adequacy personally judged separately, not length alone.'})

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('mode',choices=['math','figures','semantics']);args=parser.parse_args()
    {'math':mathematics,'figures':figures,'semantics':semantics}[args.mode]()
