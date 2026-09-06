"""HOW TO ADAPT: fixed §232 trust chain; read-only until consume_namespace.

Caller supplies the immutable authored source commit, separately recorded in
the review payload. This is custody, not author self-approval or a hostile-OS
security boundary. Nothing in this file mints pedagogical acceptance.
"""
from pathlib import Path
import hashlib
import json
import os
import re
import subprocess

ROOT = Path(__file__).resolve().parents[4]
N = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-'
C = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-'
R = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-REVIEW-'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-232-BUILD-CURRENT-'
RELEASE_COMMIT = '5870a7a4c2d5dc9b170f385b976b0a49953b9be6'
CANDIDATE_COMMIT = '9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56'
REVIEW_COMMIT = '8fc63fe32f030371195f022971a2d5d42ddedeb8'
PINS = {
 N+'232-release.json':'9705ba935c9c9f79e3b5981ba3e9119da34cd37bf165adc57323f2c6365d3a18',
 N+'gate.cjs':'4f3c2ab8a5e877697952f7c951fdc712ff08d2f13c966a1ca86394690314fe5d',
 N+'adopt.cjs':'acc24eacf9504bb803daf22f284f5046564cf5937dec4e5e19369b3443a204a0',
 N+'finalize.cjs':'fe2cde30f65c7486b7a68116ce9d51c7d995b455ccf10ae6984e4d7aeebe18f3',
 N+'probes.cjs':'baec457019aafcca1c80ee8a46d69a7634e047dab7906e70a0d8a02f282084ef',
 N+'release.cjs':'d5deb47bb7f54a5ac4dbd0723e08442d795e2dbb0f84dd3ee632197b2382c153',
 C+'232-inputs.json':'113d3321a3b859d582a4febf6ff71cd259111d6c5d233047113b1455f6bcc5dc',
 C+'check.cjs':'927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b',
 R+'report.md':'373adbb84185500dfc1c17d27976e0eb7d0ecfb5157bb24ccfe32849415489ed',
 R+'independent.json':'8dadf8d9f0c233e1fa5201984419eb8e66bb077c32c6177befb844a2bd984491',
 R+'lineage.json':'fdbe250068cc81235c5b3217171a66de5f0412c6350992a24405dd4beb557d40',
 'build-scripts/content/book-2/print_pipeline.py':'51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5',
}
SOURCE_FILES = ['build-scripts/content/book-2/b2_232.py'] + [
 'build-scripts/content/book-2/232/'+name for name in (
 'theory.md','exercises.md','answers.md','target-answers.md','assets.js','gate.py',
 'test_source.py','test_inputs.py','check_render.py','verify_rebuild.py')]

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def data_path(p):
    name=os.path.abspath(p)
    return Path('\\\\?\\'+name) if os.name=='nt' and not name.startswith('\\\\?\\') else Path(name)

def verify_current(lesson_root, platform_root=ROOT):
    """Only filesystem reads; every bad actual input stops before any command."""
    for name,expected in PINS.items():
        if sha(data_path(platform_root/name).read_bytes()) != expected:
            raise ValueError('Whole immutable authority changed: '+name)
    manifest=json.loads((platform_root/(C+'232-inputs.json')).read_text(encoding='utf-8'))
    if len(manifest['inputs'])!=49:
        raise ValueError('Expected 49 actual inputs')
    seen=set()
    for row in manifest['inputs']:
        identity=(row['repository'],row['path'])
        if identity in seen or row['repository'] not in ('4veco-platform','4veco-lessen'):
            raise ValueError('Duplicate/unknown input')
        seen.add(identity)
        root=platform_root if row['repository']=='4veco-platform' else lesson_root
        if sha(data_path(root/row['path']).read_bytes())!=row['raw_sha256']:
            raise ValueError('Actual accepted input changed: '+row['path'])
    return manifest

def command(argv, cwd=ROOT):
    result=subprocess.run([str(v) for v in argv],cwd=cwd,capture_output=True)
    record={'argv':[str(v) for v in argv],'cwd':str(cwd),'exit_code':result.returncode,
            'stdout':result.stdout.decode('utf-8',errors='replace'),'stderr':result.stderr.decode('utf-8',errors='replace')}
    if result.returncode:
        raise RuntimeError(json.dumps(record,ensure_ascii=False))
    return record

def git_blobs(root, refs):
    """One binary cat-file batch, preserving bytes and paths with spaces."""
    payload=('\n'.join(refs)+'\n').encode('utf-8')
    result=subprocess.run(['git','cat-file','--batch'],cwd=root,input=payload,capture_output=True,check=True).stdout
    pos=0;out=[]
    for ref in refs:
        end=result.index(b'\n',pos);header=result[pos:end].decode('ascii');pos=end+1
        fields=header.split(' ')
        if len(fields)!=3 or fields[1]!='blob':raise ValueError('Missing Git blob '+ref)
        size=int(fields[2]);out.append(result[pos:pos+size]);pos+=size
        if result[pos:pos+1]!=b'\n':raise ValueError('Bad binary batch framing')
        pos+=1
    if pos!=len(result):raise ValueError('Extra binary batch output')
    return out

def verify_source(source_commit, platform_root=ROOT):
    if not re.fullmatch('[0-9a-f]{40}',source_commit or ''):
        raise ValueError('An exact caller-pinned committed source SHA is required')
    refs=[source_commit+':'+n for n in SOURCE_FILES]
    blobs=git_blobs(platform_root,refs)
    records=[]
    for name,raw in zip(SOURCE_FILES,blobs):
        actual=data_path(platform_root/name).read_bytes()
        if actual!=raw:raise ValueError('Whole source differs from caller commit: '+name)
        records.append({'path':name,'sha256':sha(raw)})
    return records

def verify_committed(manifest,lesson_root,platform_root=ROOT):
    rows=[]
    for name,h in PINS.items():
        commit=(CANDIDATE_COMMIT if name.startswith(C) else REVIEW_COMMIT if name.startswith(R) else RELEASE_COMMIT)
        rows.append({'repository':'4veco-platform','path':name,'commit':commit,'raw_sha256':h})
    rows+=manifest['inputs']
    for repo,root in [('4veco-platform',platform_root),('4veco-lessen',lesson_root)]:
        selected=[r for r in rows if r['repository']==repo]
        blobs=git_blobs(root,[r['commit']+':'+r['path'] for r in selected])
        for row,raw in zip(selected,blobs):
            if sha(raw)!=row['raw_sha256']:raise ValueError('Committed input mismatch '+row['path'])

def preflight(lesson_root,source_commit,platform_root=ROOT):
    manifest=verify_current(lesson_root,platform_root)
    source=verify_source(source_commit,platform_root)
    if lesson_root.resolve()!=platform_root.parent/'4veco-lessen':
        raise ValueError('Only the actual paired lesson worktree is allowed')
    verify_committed(manifest,lesson_root,platform_root)
    checks=[]
    for args in ([N+'gate.cjs','232'],
                 ['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.3.2'],
                 ['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']):
        checks.append(command(['node',*args],platform_root))
    # Catch changes during read-only Node/currentness checks before author effects.
    verify_current(lesson_root,platform_root);verify_source(source_commit,platform_root)
    return {'manifest':manifest,'source_commit':source_commit,'source':source,'checks':checks}

def namespace_preflight(revision,reservation,source_commit,platform_root=ROOT):
    if not re.fullmatch(r'r[1-9][0-9]*',revision):raise ValueError('Explicit positive revision required')
    expected=platform_root/'reports/sprints'/(PREFIX+'reservation-'+revision+'.json')
    if reservation.resolve()!=expected.resolve():raise ValueError('Wrong reservation path')
    r=json.loads(reservation.read_text(encoding='utf-8'))
    if r.get('revision')!=revision or r.get('source_commit')!=source_commit or r.get('actor')!='paragraph_231_specialist_qc' or r.get('status')!='RESERVED_UNUSED':
        raise ValueError('Wrong reservation identity')
    if not r.get('global_scan') or r.get('maximum_recorded_revision',0)>=int(revision[1:]):
        raise ValueError('Reservation lacks fresh global history')
    attempt=platform_root/'reports/sprints'/(PREFIX+'attempt-'+revision+'.json')
    manifest=platform_root/'reports/sprints'/(PREFIX+'native-'+revision+'.json')
    if attempt.exists() or manifest.exists():raise ValueError('Consumed namespace')
    proof=platform_root/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
    if proof.exists() and any(proof.glob('232-*-'+revision)):
        raise ValueError('Occupied proof revision, including empty directory')
    return attempt,manifest,proof

def global_scan(platform_root=ROOT,exclude=()):
    """Registered actual worktrees, standard/nested files AND empty directories.

    A textual rN in any §232 evidence conservatively consumes that revision.
    No assertion that the filesystem is an adversarial cross-host transaction.
    """
    listing=subprocess.run(['git','worktree','list','--porcelain'],cwd=platform_root,capture_output=True,check=True).stdout.decode('utf-8')
    roots=[Path(line[9:]) for line in listing.splitlines() if line.startswith('worktree ')]
    omitted={os.path.normcase(os.path.abspath(p)) for p in exclude};hits=[];visited=[]
    for root in roots:
        reports=root/'reports'
        if not reports.is_dir():continue
        visited.append(str(root))
        for directory,dirs,files in os.walk(reports):
            # No symlink/junction traversal beyond the report tree.
            dirs[:]=[d for d in dirs if not (Path(directory)/d).is_symlink()]
            for name in [*dirs,*files]:
                p=Path(directory)/name
                if os.path.normcase(os.path.abspath(p)) in omitted:continue
                rel=p.relative_to(root).as_posix()
                if '232' not in rel:continue
                nums={int(v) for v in re.findall(r'(?<![A-Za-z0-9])r([1-9][0-9]*)(?![A-Za-z0-9])',rel)}
                if name.endswith(('.json','.md','.txt','.log')) and p.is_file():
                    raw=data_path(p).read_bytes()
                    if len(raw)<16*1024*1024:
                        nums|={int(v) for v in re.findall(rb'(?<![A-Za-z0-9])r([1-9][0-9]*)(?![A-Za-z0-9])',raw)}
                if nums:hits.append({'worktree':str(root),'path':rel,'revisions':sorted(nums)})
    return {'registered_worktrees':visited,'registered_listing_sha256':sha(listing.encode()),'hits':hits,
            'maximum':max([0]+[v for r in hits for v in r['revisions']])}
