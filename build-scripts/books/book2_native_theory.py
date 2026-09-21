"""Render editable semantic Book 2 theory components and bounded SVG figures.

The accepted PDF was a recovery reference only. Runtime inputs are the native
manuscript and explicit figure specifications in the lesson repository. This
module never opens a supplied/previous PDF to manufacture revised page content.
"""
from html import escape
import json
from pathlib import Path
import re

CSS = '''
@page native-theory {size:A4;margin:0;
 @top-left{content:none;} @top-right{content:none;}
 @bottom-left{content:none;} @bottom-right{content:none;}
}
.page.native-page{page:native-theory;margin:0;padding:0;height:841.8897pt;}
.native-theory{position:relative;width:595.2756pt;height:841.8897pt;}
.native-theory .native-text{position:absolute;margin:0;padding:0;border:0;
 white-space:nowrap;max-width:none;font-size:11.2pt;font-weight:400;bookmark-level:none;}
.native-decoration{position:absolute;overflow:hidden;}
.native-fraction{position:absolute;display:block;}
.native-fraction .fraction-rule{position:absolute;left:0;width:100%;}
.native-link{position:absolute;display:block;z-index:3;}
.native-theory .native-table{position:absolute;margin:0;padding:0;border:0;table-layout:fixed;}
.native-table tbody,.native-table tr{margin:0;padding:0;border:0;}
.native-theory .native-table th,.native-theory .native-table td{position:absolute;
 margin:0;padding:0;border:0;background:transparent;vertical-align:top;font-weight:400;}
.native-theory .native-figure{position:absolute;margin:0;padding:0;}
.native-theory .native-figure img{width:100%;height:100%;}
.native-page-frame{position:absolute;left:54pt;right:50pt;font-family:Lato;
 color:#536777;font-size:8.5pt;line-height:1.2;margin:0;}
.native-page-frame.header{top:21.1pt;}
.native-page-frame.footer{top:813.2pt;font-size:8pt;}
.native-page-frame .right{float:right;}
.native-page-frame .page-number{float:right;color:#183247;font-size:9pt;}
.native-exercise-tail{position:absolute;left:54pt;top:378pt;width:491.2756pt;}
.native-exercise-tail h2{bookmark-level:none;}
'''


def number(value):
    return f'{value:.5f}'.rstrip('0').rstrip('.') or '0'


def svg_figure(spec):
    """The separate diagram retains live text, individual geometry and clips."""
    x0,y0,x1,y1=spec['viewBox'];w,h=x1-x0,y1-y0
    parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{number(w)}pt" height="{number(h)}pt" viewBox="{number(x0)} {number(y0)} {number(w)} {number(h)}" role="img">',
           '<title>'+escape(spec['caption'])+'</title>']
    for i,shape in enumerate(spec['shapes']):
        shape={**shape,'fill_opacity':1 if shape['fill_opacity'] is None else shape['fill_opacity']}
        attr=''
        if shape.get('clip'):
            a,b,c,d=shape['clip']
            parts.append(f'<defs><clipPath id="clip-{i}"><rect x="{number(a)}" y="{number(b)}" width="{number(c-a)}" height="{number(d-b)}"/></clipPath></defs>')
            attr+=f' clip-path="url(#clip-{i})"'
        dash=re.fullmatch(r'\[([^]]*)\]\s*(.*)',shape['dash'])
        if dash and dash[1].strip():attr+=f' stroke-dasharray="{dash[1]}" stroke-dashoffset="{dash[2]}"'
        parts.append(f'<path d="{shape["path"]}" fill="{shape["fill"]}" fill-rule="{shape["fill_rule"]}" stroke="{shape["stroke"]}" stroke-width="{shape["width"]}" fill-opacity="{shape["fill_opacity"]}" stroke-opacity="{shape["stroke_opacity"]}"{attr}/>')
    for line in spec['text']:
        for run in line['runs']:
            x,y=run['origin'];transform=''
            if line['direction']!=[1.0,0.0]:
                import math
                angle=math.degrees(math.atan2(line['direction'][1],line['direction'][0]))
                transform=f' transform="rotate({number(angle)} {number(x)} {number(y)})"'
            family='DejaVu Sans Mono' if 'Mono' in run['font'] else 'Lato'
            parts.append(f'<text x="{number(x)}" y="{number(y)}" font-family="{family}" font-size="{number(run["size"])}" font-weight="{run["weight"]}" fill="{run["color"]}"{transform}>{escape(run["text"])}</text>')
    parts.append('</svg>')
    return '\n'.join(parts)+'\n'


def render_figures(chapter):
    import cairosvg
    for file in sorted((chapter/'_assets/theory-20260921').glob('*.json')):
        spec=json.loads(file.read_text(encoding='utf8'))
        svg=svg_figure(spec)
        file.with_suffix('.svg').write_text(svg,encoding='utf8',newline='\n')
        cairosvg.svg2png(bytestring=svg.encode('utf8'),write_to=str(file.with_suffix('.png')),scale=2)


def page_body(source, printed_page, chapter, render_markdown):
    # Exercise content stays in its existing Markdown/source form, including
    # the newer supported route on the mixed theory/exercise page 86.
    tail=re.search(r'<div class="native-exercise-tail">\s*([\s\S]*?)\s*</div>\s*$',source)
    if tail:
        source=source[:tail.start()].rstrip()
        source=source.removesuffix('</article>')+'<div class="native-exercise-tail">'+render_markdown(tail[1])+'</div></article>'
    title={1:'2.1 Kosten en opbrengsten',2:'2.2 Elasticiteit',3:'2.3 Surplus en welvaart'}[chapter]
    frame=(f'<header class="native-page-frame header">4veco / Boek 2<span class="right">{title}</span></header>'
           f'<footer class="native-page-frame footer">Economie · 4 vwo<span class="page-number">{printed_page}</span></footer>')
    return source.replace('</article>',frame+'</article>')
