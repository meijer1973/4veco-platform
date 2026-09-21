"""Read-only current revision checks: native assembly, links, cover and exports."""
import argparse
import json
import hashlib
from pathlib import Path
import fitz
from pypdf import PdfReader
from assemble_book2_signed import validate_inputs,REVISION
from build_book2_chat import EDITION,file_record
from verify_book2_chat import require,geometry_check
from book2_print import contents_rows,EXTRACT,EXTRACT_MAP


def verify_footer(page,expected):
    footer=page.get_textbox(fitz.Rect(500,800,page.rect.width,page.rect.height)).strip()
    require(footer==str(expected),f'Printed page number differs: {footer!r}, expected {expected}')


def verify_print(root,bundle,final):
    require('PDF-pagina' not in final[1].get_text(),'Screen-oriented contents numbering remains')
    labels=PdfReader(root/bundle['output']).page_labels
    require(labels==['Omslag','Inhoud',*map(str,range(1,len(final)-1))],'Viewer page labels differ from print')
    for number,page in enumerate(list(final)[2:],1):verify_footer(page,number)
    rows=contents_rows(root,bundle)
    for row in rows:
        baseline=final[1].rect.height-row['y']
        printed=[w[4] for w in final[1].get_text('words') if w[0]>=480 and abs((w[1]+w[3])/2-baseline)<6]
        require(printed==[str(row['page'])],'Wrong contents page reference '+row['title'])
        verify_footer(final[row['page']+1],row['page'])
        if row['kind']=='paragraph':
            require(row['title'].split()[0] in final[row['page']+1].get_text(),'Wrong paragraph contents destination')
    if bundle['kind']=='student':
        offset=2;checked=0
        for count in bundle['page_counts']:
            page=final[offset]
            for link in page.get_links():
                label=page.get_textbox(link['from']).strip()
                if label.isdigit():
                    require(int(label)==link['page']-1,'Chapter contents number differs from printed destination')
                    checked+=1
            offset+=count
        require(checked==14,'Incomplete chapter contents number coverage')
    return {'printed_pages':[1,len(final)-2],'contents_references':len(rows),'viewer_labels':'PASS'}


def verify_extract(root,student):
    record=json.loads((root/EXTRACT_MAP).read_text(encoding='utf8'))
    require(record['source_pdf']==file_record(root,root/student),'Stale extract source')
    require(record['extract_pdf']==file_record(root,root/EXTRACT),'Stale extract bytes')
    rows=json.loads((root/'signed-page-map.json').read_text(encoding='utf8'))
    require(record['pages']==[dict(extract_page=i,**row)for i,row in enumerate(rows,1)],'Extract map differs')
    with fitz.open(root/student) as full,fitz.open(root/EXTRACT) as extract:
        require(len(extract)==len(rows)==43,'Incomplete theory extract')
        for row,page in zip(rows,extract):
            original=full[row['physical_page']-1]
            require(row['printed_page']==row['physical_page']-2,'Wrong extract print mapping')
            require(row['source_sha256']==file_record(root,root/row['source'])['sha256'],'Stale extract manuscript')
            require(page.get_text()==original.get_text(),'Extract text differs')
            require(page.get_pixmap().samples==original.get_pixmap().samples,'Extract pixels differ')
            require(not page.get_links(),'Convenience extract contains unresolved links')
    return {'pages':43,'text_pixels_page_map':'PASS','path':EXTRACT,'sha256':record['extract_pdf']['sha256']}

def verify_exports(root):
    import os,sys
    root=root.resolve()
    if sys.platform=='win32':root=Path('\\\\?\\'+str(root))
    checked=links=0
    for folder in (root/'bronnen').glob('H*'):
        records=json.loads((folder/'paragraph-exports.json').read_text(encoding='utf8'))
        manifest=json.loads((folder/'paragrafen/manifest.json').read_text(encoding='utf8'))
        require([r['id'] for r in manifest]==list(records),'Stale paragraph manifest')
        for entry in manifest:
            pid=entry['id'];row=records[pid];dest=folder/entry['folder']
            require(entry['assets']==row['assets'],'Stale paragraph assets')
            for kind,key in [('paragraaf','chapter_pages'),('opgaven','exercise_pages'),('antwoorden','answer_pages')]:
                if kind=='paragraaf' and not entry['theory']:continue
                source=next((folder/'output').glob('*Antwoorden.pdf' if kind=='antwoorden' else '*'+{'H1':'Kosten_en_opbrengsten','H2':'Elasticiteit','H3':'Surplus_en_welvaart'}[folder.name]+'.pdf'))
                target=next(dest.glob('* – '+kind+'.pdf'));lo,hi=row[key]
                with fitz.open(source) as chapter,fitz.open(target) as export:
                    require(len(export)==hi-lo+1,'Wrong paragraph page count')
                    for index,page in enumerate(export):
                        original=chapter[lo-1+index]
                        require(page.get_text()==original.get_text(),'Paragraph text differs')
                        require(page.get_pixmap().samples==original.get_pixmap().samples,'Paragraph pixels differ')
                        old,new=original.get_links(),page.get_links()
                        require(len(old)==len(new),'Paragraph link lost')
                        for a,b in zip(old,new):
                            require(a['from']==b['from'],'Paragraph link rectangle differs')
                            target_page=a.get('page',-1)
                            if lo-1<=target_page<hi:
                                require(b['kind']==fitz.LINK_GOTO and b['page']==target_page-lo+1,'Wrong local paragraph destination')
                            else:
                                require(b['kind']==fitz.LINK_GOTOR and b['page']==target_page,'Wrong external paragraph destination')
                                require(os.path.normcase(os.path.abspath(target.parent/b['file']))==os.path.normcase(os.path.abspath(source)),'Wrong linked chapter')
                            links+=1
                        checked+=1
    require(checked==207 and links==20,'Incomplete paragraph export coverage')
    return {'pages':checked,'links':links,'text_pixels_navigation':'PASS'}

def compare_link(old,new,source,offset):
    require(old['from']==new['from'],'Link rectangle changed')
    if old['kind'] in (fitz.LINK_GOTO,fitz.LINK_NAMED):
        require(new['kind']==fitz.LINK_GOTO,'Local destination lost')
        require(new['page']==old['page']+offset,'Wrong link destination')
        to=old['to']
        if old['kind']==fitz.LINK_NAMED:to=to*source[old['page']].transformation_matrix
        require(max(abs(a-b)for a,b in zip(new['to'],to))<.001,'Changed link view')
    elif old['kind']==fitz.LINK_URI:require(new['uri']==old['uri'],'Changed URI')
    else:raise ValueError('Unreviewed link type '+str(old))

def verify(root):
    config=validate_inputs(root)
    manifest=json.loads((root/'signed-assembly-manifest.json').read_text(encoding='utf8'))
    require(manifest['revision']==REVISION,'Wrong revision')
    require(manifest['chapter_inputs_sha256']==file_record(root,root/'signed-chapter-inputs.json')['sha256'],'Stale assembly binding')
    require({r['path']for r in manifest['files']}=={config['cover']['preview'],EXTRACT,EXTRACT_MAP,*(b['output']for b in config['bundles'])},'Unexpected output inventory')
    for r in manifest['files']:require(file_record(root,root/r['path'])==r,'Stale output '+r['path'])
    nav=json.loads((root/'signed-navigation.json').read_text(encoding='utf8'))
    platform=Path(__file__).resolve().parents[2]
    baseline=(platform/'reports/review-gates/book2-theory-signed-20260921/accepted-navigation-comparison.json').read_text(encoding='utf8')
    accepted=json.loads(baseline)
    delta=json.loads((platform/'reports/review-gates/book2-print-review-20260921/navigation-delta.json').read_text(encoding='utf8'))
    require(delta['baseline_sha256_lf']==hashlib.sha256(baseline.encode()).hexdigest(),'Wrong historical navigation binding')
    for row in delta['changes']:
        old,new=row['before'],row['after']
        require(accepted[row['artifact']]['links'][row['index']]==old,'Unexpected navigation predecessor')
        require(new['source_page']==old['source_page'] and new['destination_page']==old['destination_page'],'Print navigation changes destination')
        require(new['rect'][0]<old['rect'][0] and all(abs(a-b)<.001 for a,b in zip(new['rect'][1:],old['rect'][1:])),'Only reviewed left-edge expansions are permitted')
        accepted[row['artifact']]['links'][row['index']]=new
    cover=None;chapters=links=0;bundles=[]
    for index,b in enumerate(config['bundles']):
        with fitz.open(root/b['output']) as final:
            if Path(b['output']).name in accepted:
                expected_links=accepted[Path(b['output']).name]['links']
                actual_links=[{'source_page':i,'rect':list(link['from']),'destination_page':link['page']+1}
                              for i,page in enumerate(final,1) for link in page.get_links()]
                require(len(actual_links)==len(expected_links),'Accepted target link count differs')
                for a,binding in zip(actual_links,expected_links):
                    require(a['source_page']==binding['source_page'] and a['destination_page']==binding['destination_page'],'Accepted target destination differs')
                    require(max(abs(x-y)for x,y in zip(a['rect'],binding['rect']))<=.01,'Accepted target click rectangle differs')
            require(len(final)==nav['expected_page_counts'][index],'Wrong complete page count')
            current=final[0].get_pixmap().samples
            if cover is None:cover=current
            require(current==cover,'Covers differ')
            geometry_check(final[0],config['cover'])
            panel=final[0].get_textbox(fitz.Rect(223,374,356,443))
            for text in ('Ev < −1','−1 < Ev < 0','%ΔQv','%ΔP'):require(text in panel,'Missing signed cover text '+text)
            require('|Ev|' not in panel,'Obsolete cover rule')
            print_report=verify_print(root,b,final)
            offset=2;current_links=0
            for name in b['chapters']:
                with fitz.open(root/name) as chapter:
                    for i,p in enumerate(chapter):
                        page=final[offset+i]
                        require(p.get_text()==page.get_text(),'Assembly text changed')
                        require(p.get_pixmap().samples==page.get_pixmap().samples,'Assembly pixels changed')
                        before,after=p.get_links(),page.get_links()
                        require(len(before)==len(after),'Lost chapter links')
                        for old,new in zip(before,after):compare_link(old,new,chapter,offset)
                        current_links+=len(after);chapters+=1
                    offset+=len(chapter)
            require(current_links==nav['expected_link_counts'][index],'Unexpected link count')
            if b['kind']=='student':require(final.get_toc()==nav['student_bookmarks'],'Student bookmarks differ')
            if b['kind']=='answers':require(len(final.get_toc())==129,'Answer bookmarks lost')
            links+=current_links;bundles.append({'kind':b['kind'],'pages':len(final),'links':current_links,'bookmarks':len(final.get_toc()),'print':print_report})
    reader=PdfReader(root/config['bundles'][0]['output'])
    overview={name:reader.get_destination_page_number(reader.named_destinations[name])+1 for name in ('h2-overzicht','h3-overzicht')}
    require(overview=={'h2-overzicht':72,'h3-overzicht':109},'Overview destination regression')
    return {'revision':REVISION,'passed':True,'bundles':bundles,'identical_assembled_chapter_pages':chapters,'links_checked':links,'overview':overview,'cover_geometry':'PASS','paragraph_exports':verify_exports(root),'theory_extract':verify_extract(root,config['bundles'][0]['output'])}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=Path(__file__).resolve().parents[3]/'4veco-lessen')
    parser.add_argument('--report',type=Path)
    args=parser.parse_args();result=verify(args.lesson_root/EDITION)
    text=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if args.report:args.report.write_text(text,encoding='utf8')
    print(text)
