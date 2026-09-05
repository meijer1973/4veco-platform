"""R7 bounded insertion/output/protected-state evidence. Run after native rebuild.

HOW TO ADAPT: this is an exact baseline-bound correction probe, not a generic
acceptance authority. New corrections need separately reviewed baseline pins.
"""
from pathlib import Path
import hashlib
import io
import json
import re
import subprocess
import sys
import zipfile
import fitz
from bs4 import BeautifulSoup

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[2]
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2/213'))
import b2_213 as b
import test_bonus_contract as contract
LESSONS = ROOT.parent/'4veco-lessen'
FOLDER = LESSONS/b.LESSON_REL
PBASE = '984547a17c966d3749d08ef34b92747de21eacbf'
LBASE = '5d67998d1e1d1aa5497d59850b53aebc780eaa96'

def sha(raw): return hashlib.sha256(raw).hexdigest()
def blob(repo, base, path):
    result = subprocess.run(['git', 'show', f'{base}:{path}'], cwd=repo, capture_output=True)
    if result.returncode:
        print(json.dumps({'failed_git_argv':result.args,'exit_code':result.returncode,'stderr':result.stderr.decode('utf-8',errors='replace')}))
        result.check_returncode()
    return result.stdout
def rel(path, root): return path.relative_to(root).as_posix()
def entry(path, root, base):
    old = blob(root, base, rel(path, root))
    new = path.read_bytes()
    return {'path': rel(path, root), 'before_sha256': sha(old), 'after_sha256': sha(new), 'byte_identical': old == new}

source = b.CONTENT/'answers.md'
old_source = blob(ROOT, PBASE, rel(source, ROOT))
new_source = source.read_bytes()
label = contract.LABEL.encode('utf-8')
closing = contract.CLOSING.encode('utf-8')
prefix, tail = new_source.split(label)
added, suffix = tail.split(closing)
insertion = label + added
assert prefix + closing + suffix == old_source, 'not an exact insertion-only source correction'
assert sha(old_source) == 'd7a6960674cd09c8ac43782c0503351c2a42b3ac656c2e792c69207ebc51ca50'
old_bonus = old_source.decode('utf-8').split(contract.BONUS)[1].split(contract.CLOSING)[0]
assert contract.BONUS + old_bonus + contract.CLOSING + '\n' == contract.OLD_MISSING_BLOCK
bullets = contract.verify(new_source.decode('utf-8'))

protected = []
for path in [ROOT/'build-scripts/content/book-2/b2_213.py', ROOT/'build-scripts/content/book-2/print_pipeline.py',
             *[b.CONTENT/name for name in ['theory.md','exercises.md','target-answers.md','test_source.py','check_render.py','verify_rebuild.py','alt_contract.py']],
             ROOT/'references/authored/course-target-exercises.json',
             ROOT/'references/authored/book-outlines/book-2-outline.md',
             ROOT/'references/authored/book-outlines/book-2-outline.meta.json']:
    record = entry(path, ROOT, PBASE)
    assert record['byte_identical'], record
    protected.append(record)
manifest = json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-BONUS-build-r7.json').read_text(encoding='utf-8'))
for path in [*[Path(item['path']) for item in manifest['prerequisites']],
             FOLDER/'2.1.3-review.md', FOLDER/'2.1.3-quality-ref.yaml', FOLDER/'build_pdf.py']:
    record = entry(path, LESSONS, LBASE)
    assert record['byte_identical'], record
    protected.append(record)
assert sha((FOLDER/'2.1.3-quality-ref.yaml').read_bytes()) == 'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f'
assert sha((FOLDER/'2.1.3-review.md').read_bytes()) == 'a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66'
assert not (FOLDER/'2.1.3-textbook-handoff.md').exists()

rebuild = json.loads((OUT/'rebuild.json').read_text(encoding='utf-8'))
artifacts = [entry(FOLDER/name, LESSONS, LBASE) for name in rebuild['artifacts']]
assert len(artifacts) == 24
changed = [x for x in artifacts if not x['byte_identical']]
assert [Path(x['path']).name for x in changed] == [f'{b.STEM} – antwoorden.{ext}' for ext in ['md','html','pdf','zip']]
for kind in ['paragraaf','opgaven','antwoorden']:
    markdown = FOLDER/f'{b.STEM} – {kind}.md'
    actual = markdown.read_bytes()
    expected = blob(LESSONS, LBASE, rel(markdown, LESSONS))
    if kind == 'antwoorden':
        assert actual.count(insertion) == 1
        assert actual.replace(insertion, b'') == expected
    else:
        assert actual == expected

html_path = FOLDER/f'{b.STEM} – antwoorden.html'
old_soup = BeautifulSoup(blob(LESSONS, LBASE, rel(html_path, LESSONS)), 'html.parser')
new_soup = BeautifulSoup(html_path.read_bytes(), 'html.parser')
label_node = new_soup.find('strong', string='Beoordelingscriteria — een sterk antwoord:').parent
listing = label_node.find_next_sibling('ul')
assert len(listing.find_all('li')) == 3
label_node.decompose()
listing.decompose()
# Only inter-tag/source-line whitespace may differ after removing the insertion.
def dom(node):
    if not getattr(node, 'name', None):
        return ' '.join(str(node).split()) or None
    return [node.name, dict(node.attrs), [value for child in node.children if (value := dom(child)) is not None]]
assert dom(new_soup) == dom(old_soup), 'answer DOM changed beyond criteria insertion'

zip_contract = []
for kind, count in [('paragraaf',15),('opgaven',7),('antwoorden',3)]:
    path = FOLDER/f'{b.STEM} – {kind}.zip'
    with zipfile.ZipFile(path) as z:
        assert len(z.namelist()) == count and z.testzip() is None
        members = []
        for info in z.infolist():
            assert info.date_time == (1980,1,1,0,0,0)
            assert z.read(info) == (FOLDER/info.filename).read_bytes()
            members.append({'name':info.filename,'sha256':sha(z.read(info)),'crc':info.CRC})
    zip_contract.append({'kind':kind,'member_count':count,'members':members})

pdf_path = FOLDER/f'{b.STEM} – antwoorden.pdf'
before_pdf = fitz.open(stream=blob(LESSONS,LBASE,rel(pdf_path,LESSONS)),filetype='pdf')
after_pdf = fitz.open(pdf_path)
assert (len(before_pdf),len(after_pdf)) == (6,7)
page_delta = []
for index in range(6):
    old_page, new_page = before_pdf[index], after_pdf[index]
    clip = fitz.Rect(0,0,new_page.rect.width,new_page.rect.height-45)
    old_raster = old_page.get_pixmap(matrix=fitz.Matrix(2,2),clip=clip,alpha=False)
    new_raster = new_page.get_pixmap(matrix=fitz.Matrix(2,2),clip=clip,alpha=False)
    equal = old_raster.samples == new_raster.samples
    assert equal == (index < 5)
    page_delta.append({'page':index+1,'body_excluding_bottom_45pt_byte_identical':equal,
                       'before_body_pixels_sha256':sha(old_raster.samples),'after_body_pixels_sha256':sha(new_raster.samples)})
assert 'Beoordelingscriteria' in after_pdf[5].get_text()
assert 'Herhaling / Herhaling en interleaving' in after_pdf[6].get_text()
tables = after_pdf[2].find_tables().tables
header = ['Q','TK','TO','winst','MK','MO']
# Native section rules can cause the detector to include prose above/below the
# table. Select the exact header and four consecutive data rows within it.
draad = next(table for table in tables if header in table.extract())
header_index = draad.extract().index(header)
draad_rows = draad.extract()[header_index:header_index+5]
draad_cells = [list(cell) for row in draad.rows[header_index:header_index+5] for cell in row.cells]
assert draad_rows == [header,['0','20','0','−20','—','—'],['4','24','20','−4','1','5'],['8','28','40','12','1','5'],['12','32','60','28','1','5']]
assert len(draad_cells) == 30
for row in range(5):
    assert all(draad_cells[row*6+col][2] <= draad_cells[row*6+col+1][0] for col in range(5))

proofs = []
for document in manifest['documents']:
    folder = Path(document['proof_directory'])
    pages = sorted((folder/'pages').glob('page-*.png'))
    kind = folder.name.split('-')[1]
    assert len(pages) == {'paragraaf':14,'opgaven':9,'antwoorden':7}[kind]
    proofs.append({'kind':kind,'pdf_sha256':document['pdf_sha256'],'page_count':len(pages),
                   'pages':[{'path':rel(path,ROOT),'sha256':sha(path.read_bytes())} for path in pages]})
result = {'result':'PASS','role':'bounded correction builder, not independent reviewer/QC',
          'platform_baseline':PBASE,'lessons_baseline':LBASE,'source_insertion_sha256':sha(insertion),
          'source_insertion_bytes':len(insertion),'old_missing_fixture_exact':True,'criteria':bullets,
          'source':entry(source,ROOT,PBASE),'protected':protected,'handoff_absent':True,
          'artifacts':artifacts,'changed_artifacts_count':len(changed),'unchanged_artifacts_count':20,
          'answer_html_only_three_criteria_insertion':True,'zip_contract':zip_contract,
          'answer_pdf_pages_before_after':[6,7],'answer_pdf_delta':page_delta,
          'draad_direct_pdf_table':draad_rows,'draad_direct_pdf_cells':draad_cells,
          'native_proofs':proofs,'actual_total_pages':30,'human_inspection':'separate builder inspection Markdown'}
output = OUT/'delta.json'
assert not output.exists()
output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({'result':'PASS','output':str(output),'changed_artifacts':4,'unchanged_artifacts':20,'total_pages':30}))
