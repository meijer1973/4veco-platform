"""Export paragraph student PDFs from the current chapter PDFs without reflow."""
import json,fitz
from render import ROOT
from content import chapter_data
for folder in sorted((ROOT/'books').glob('*/chapters/*')):
 c=folder.name;a=chapter_data(folder);dest=folder/'paragraph-pdfs';dest.mkdir(exist_ok=True)
 src=fitz.open(folder/'output'/f'Boek_{c[0]}_H{c[2]}_Leerling_v3.pdf')
 for pid,p in a['paragraphs'].items():
  positions=[pg['local_page'] for pg in a['pages'] if pg['section']==pid]
  doc=fitz.open();doc.insert_pdf(src,from_page=min(positions)-1,to_page=max(positions)-1)
  doc.set_metadata({'title':pid+' — v3','subject':'Paragraph excerpt; page numbers refer to the chapter.'})
  doc.save(dest/f'{pid}-leerling-v3.pdf',deflate=True,garbage=4)
 src.close()
print('Exported 31 paragraph PDFs')
