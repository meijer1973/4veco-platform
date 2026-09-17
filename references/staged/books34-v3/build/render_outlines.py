"""Render the adopted, editable v3 outline documents as reading copies."""
from pathlib import Path
from markdown_it import MarkdownIt
from weasyprint import HTML
from bs4 import BeautifulSoup
import html, re
ROOT=Path(__file__).resolve().parents[1]
CSS='''@page{size:A4;margin:19mm 18mm 18mm;@bottom-left{content:"4VECO · Boekopzetten v3";font:8pt Lato;color:#526677;}@bottom-right{content:counter(page);font:8pt Lato;color:#526677;}}body{font:10.3pt/1.43 Lato,"DejaVu Sans",sans-serif;color:#183348}h1{font-size:23pt;line-height:1.16;color:#124c70;margin:0 0 8mm}h2{font-size:15pt;line-height:1.25;margin:7mm 0 3mm;color:#124c70;break-after:avoid}h3{font-size:12pt;line-height:1.25;margin:5mm 0 2mm;color:#124c70;break-after:avoid}p{margin:2.5mm 0}table{border-collapse:collapse;width:100%;font-size:8.4pt;line-height:1.3;margin:4mm 0}th,td{padding:2.1mm;border-bottom:0.2mm solid #c8d9e2;text-align:left;vertical-align:top}th{background:#e6f1f5;color:#124c70}thead{display:table-header-group}tr{break-inside:avoid}strong{font-weight:700}a{color:#124c70;text-decoration:none}code{font-family:"DejaVu Sans Mono";font-size:8.5pt;overflow-wrap:anywhere}ul,ol{padding-left:5mm}li{margin:1mm 0}blockquote{border-left:1mm solid #6a9ab3;padding-left:4mm;color:#345267}p,li{orphans:3;widows:3}'''
md=MarkdownIt('commonmark',{'html':True}).enable('table')
for filename,name in [('book-3-outline-v3.md','Boek_3_Boekopzet_v3.pdf'),('book-4-outline-v3.md','Boek_4_Boekopzet_v3.pdf'),('book34-v3-decision-and-migration.md','Boek_3_4_Besluit_en_migratie_v3.pdf')]:
 f=ROOT/'outlines'/filename
 soup=BeautifulSoup(md.render(f.read_text(encoding='utf-8')),'html.parser')
 # Preserve each short paragraph specification as a unit where it fits; tables flow normally.
 title=soup.find('h1').get_text() if soup.find('h1') else filename
 doc=HTML(string='<!doctype html><html lang="en"><meta charset="utf-8"><title>'+html.escape(title)+'</title><style>'+CSS+'</style><body>'+str(soup)+'</body></html>',base_url=str(f.parent)).render()
 doc.write_pdf(f.with_name(name))
 print(name,len(doc.pages),'pages')
