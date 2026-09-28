"""Build NAV1, the answer heading and teacher advice without student rewrites.

Prepare an external clean baseline from --repository at the fixed merged commit,
then use that builder-authenticated same-environment copy for comparisons.
"""
from pathlib import Path
import argparse
import importlib
import io
import os
import runpy
import sys
import tarfile

from books34_followups_common import (HERE,PLATFORM,EDITION,BASE,REVISION,CHAPTERS,PUBLICATIONS,
    PINS,RECEIPT,require,git,guard,files,receipt,write_json,authenticate,pdf_equal,target_check,sha)


def build(lessons,report,comparison=None,baseline=False,repository=None):
    if baseline:
        require(not lessons.exists(),'Baseline destination must be new')
        lessons.mkdir(parents=True)
        archive=git(repository,'archive',BASE,EDITION)
        with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
            tar.extractall(lessons,filter='data')
    authenticated=None if baseline else authenticate(comparison,lessons)
    guard(lessons,baseline,repository)
    root=lessons/EDITION
    sys.path.insert(0,str(root/'build'))
    renderer=importlib.import_module('render')
    require(renderer.ROOT.resolve()==root.resolve(),'Wrong renderer root')
    before={name:file.read_bytes() for name,file in files(lessons).items()}
    order=[];renders=[]
    for chapter,kinds in [('3.2',('answer',))]+[(c,('teacher',)) for c in CHAPTERS]:
        renders.extend(renderer.build_chapter(chapter,kinds))
        order.append(kinds[0]+':'+chapter)
    # Every designed answer/teacher page must still occupy its single page.
    for row in renders:
        require(row['pages']==row['designed_pages'],'Answer/teacher pagination drift '+row['stem'])
    assembler='books34_assemble.py' if baseline else 'books34_followups_assemble.py'
    order.append('assemble:'+assembler)
    runpy.run_path(str(HERE/assembler),run_name='__main__')
    order.append('records')
    runpy.run_path(str(HERE/'books34_records.py'),run_name='__main__')
    retained={EDITION+'/'+name for name in PUBLICATIONS|PINS}
    changed=[];restored=[]
    after=files(lessons)
    require(set(before)==set(after),'Unexpected build file addition/removal')
    for name,file in after.items():
        if before[name]==file.read_bytes():continue
        changed.append(name)
        if not baseline and name not in retained:
            expected=comparison/name
            if file.suffix=='.pdf':pages=pdf_equal(expected,file)
            else:
                require(file.read_bytes()==expected.read_bytes(),'Unexpected generated text '+name)
                pages=None
            file.write_bytes(before[name])
            restored.append({'path':name,'pixel_pages':pages,'restored_sha256':sha(before[name])})
    if baseline:write_json(lessons/RECEIPT,receipt(lessons))
    write_json(report,{'revision':REVISION,'baseline_reproduction':baseline,'comparison':authenticated,
        'order':order,'explicit_renders':renders,'dependent_publications':sorted(PUBLICATIONS),
        'byte_changed_by_build':sorted(changed),'equivalent_dependencies_restored':restored,
        'targets':None if baseline else target_check(lessons)})


if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--lesson-root',type=Path,default=PLATFORM.parent/'4veco-lessen')
    ap.add_argument('--report',type=Path,required=True)
    ap.add_argument('--baseline',action='store_true')
    ap.add_argument('--repository',type=Path,default=PLATFORM.parent/'4veco-lessen')
    ap.add_argument('--comparison-root',type=Path)
    args=ap.parse_args()
    if not args.baseline and not args.comparison_root:ap.error('--comparison-root is required')
    sys.dont_write_bytecode=True;os.environ['PYTHONUTF8']='1'
    build(args.lesson_root.resolve(),args.report,args.comparison_root.resolve() if args.comparison_root else None,
          args.baseline,args.repository.resolve())
