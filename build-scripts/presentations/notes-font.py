from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E
import sys

src=Path(sys.argv[1])
tmp=src.with_suffix('.notes.pptx')
A='http://schemas.openxmlformats.org/drawingml/2006/main'
with ZipFile(src) as z, ZipFile(tmp,'w',ZIP_DEFLATED) as out:
    for info in z.infolist():
        data=z.read(info.filename)
        if info.filename.endswith('.xml') and info.filename.startswith(('ppt/notesSlides/','ppt/notesMasters/')):
            root=E.fromstring(data)
            for tag in ('rPr','defRPr','endParaRPr'):
                for el in root.iter('{'+A+'}'+tag):
                    if int(el.get('sz','1400')) < 1400:
                        el.set('sz','1400')
            for run in root.iter('{'+A+'}r'):
                props=run.find('{'+A+'}rPr')
                if props is None:
                    props=E.Element('{'+A+'}rPr')
                    run.insert(0,props)
                props.set('sz','1400')
            data=E.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True)
        out.writestr(info,data)
tmp.replace(src)
