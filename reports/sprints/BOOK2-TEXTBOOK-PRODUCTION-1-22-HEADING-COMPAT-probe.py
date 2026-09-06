"""Actual accepted C22 prepare only: no lesson, native or proof output writes."""
import hashlib
import json
import sys
from pathlib import Path

P=Path(__file__).resolve().parents[2]
L=P.parent/'4veco-lessen'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import chapter_pipeline as chapter

def sha(b):return hashlib.sha256(b).hexdigest()

def run(mode):
    manifest=json.loads((P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-INPUT-CANDIDATE-inputs.json').read_bytes())
    assembly=manifest['assembly_inputs']
    spec={'nr':'2.2','title':'Elasticiteit','front_html':(P/'build-scripts/content/book-2/22/front.html').read_text(encoding='utf-8'),'paragraphs':[]}
    for index in range(4):
        student,answer=assembly['documents'][index*2:index*2+2]
        folder=Path(student['path']).parent
        s={'nr':student['id'],'folder':folder.name,'student_sha256':student['raw_sha256'],'answers_sha256':answer['raw_sha256'],
           'asset_sha256':{a['name']:a['raw_sha256'] for a in assembly['assets'] if Path(a['path']).parent==folder/'_assets'}}
        if mode=='corrected':
            s['source_headings']={role:(L/row['path']).read_text(encoding='utf-8-sig').lstrip().splitlines()[0] for role,row in [('student',student),('answers',answer)]}
        spec['paragraphs'].append(s)
    root=L/manifest['output_contract']['lesson_directory']
    if mode=='original':
        try:chapter.prepare_chapter(root,spec)
        except ValueError as e:
            assert 'Source heading does not identify its paragraph' in str(e) and '2.2.3' in str(e)
            return {'status':'REPRODUCED_ORIGINAL_COMPATIBILITY_FAILURE','error':str(e),'native_writes':0,'spec':spec}
        raise AssertionError('Expected actual old heading/path rejection')
    if mode!='corrected':raise ValueError('original/corrected')
    prepared=chapter.prepare_chapter(root,spec)
    assert len(prepared['inputs'])==8 and len(prepared['assets'])==30
    for row in assembly['documents']:
        source=(L/row['path']).read_bytes().decode('utf-8-sig').strip()
        selected=prepared['answers_md' if row['role']=='answers' else 'student_md']
        assert selected.count(source)==1,row['path']
    assert {Path(a['path']).name:a['sha256'] for a in prepared['assets']}=={a['name']:a['raw_sha256'] for a in assembly['assets']}
    chapter.verify_chapter_inputs(prepared)
    return {'status':'ACTUAL_EIGHT_SOURCE_PREPARE_PASS_NOT_PRODUCTION','spec':spec,'inputs':prepared['inputs'],'assets':prepared['assets'],
            'student_md_sha256':sha(prepared['student_md'].encode()),'answers_md_sha256':sha(prepared['answers_md'].encode()),
            'native_writes':0,'personal_views':0}

if __name__=='__main__':print(json.dumps(run(sys.argv[1]),ensure_ascii=False))
