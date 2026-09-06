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
# Fixed task assignments, not an arbitrary actor/prefix override or a quality grant.
# The root keeps its real umbrella claim; future specialist must actually claim its pair.
ROLES = {
 'author': ('paragraph_231_specialist_qc','232-BUILD-CURRENT','book2-232-build-current-20260906','232-BUILD-CURRENT'),
 'correction': ('paragraph_231_specialist_qc','232-REPRO-ROUTES','book2-232-repro-routes-20260906','232-REPRO-ROUTES'),
 'paragraph-review': ('paragraph_224_builder','232-PARAGRAPH-REVIEW','book2-232-paragraph-review-20260906','232-PARAGRAPH-REVIEW'),
 'specialist-qc': ('paragraph_214_builder','232-SPECIALIST-QC','book2-232-specialist-qc-20260906','232-SPECIALIST-QC'),
 'root': ('codex-root','','book2-part-a-production-20260905','232-QC-ROOT'),
}
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

def execution_identity(role='author',platform_root=ROOT):
    """Read actual paired Git metadata/claims. No claim minting or role impersonation.

    Local claim files provide single-account coordination, not hostile-OS identity.
    Claim-time HEAD is checked as an ancestor, not confused with the current HEAD.
    """
    if role not in ROLES:raise ValueError('Unknown fixed execution role')
    actor,suffix,pair,evidence=ROLES[role]
    task='BOOK2-TEXTBOOK-PRODUCTION-1'+('-'+suffix if suffix else '')
    prefix='BOOK2-TEXTBOOK-PRODUCTION-1-'+evidence+'-'
    branch=('codex/' if role=='root' else 'agent/')+pair
    expected=Path('C:/wt')/pair
    def same(a,b):return os.path.normcase(os.path.abspath(a))==os.path.normcase(os.path.abspath(b))
    if not same(platform_root,expected/'4veco-platform') or platform_root.is_symlink():
        raise ValueError('Wrong assigned platform worktree')
    claims=[]
    for repo in ('4veco-platform','4veco-lessen'):
        root=expected/repo
        if not root.is_dir() or root.is_symlink():raise ValueError('Missing/unsafe assigned paired worktree')
        def git(*args):
            r=subprocess.run(['git',*args],cwd=root,capture_output=True,check=True)
            return r.stdout.decode('utf-8').strip()
        actual=git('rev-parse','--show-toplevel')
        gitdir=Path(git('rev-parse','--path-format=absolute','--git-dir'))
        common=Path(git('rev-parse','--path-format=absolute','--git-common-dir'))
        if not same(actual,root) or same(gitdir,common):raise ValueError('Actual dedicated Git worktree required')
        if git('symbolic-ref','--quiet','--short','HEAD')!=branch:raise ValueError('Wrong actual assigned branch')
        records=git('worktree','list','--porcelain').split('\n\n')
        if not any('worktree '+str(root).replace('\\','/') in r.splitlines() and 'branch refs/heads/'+branch in r.splitlines() for r in records):
            raise ValueError('Missing exact registered worktree and branch')
        claim_path=gitdir/'4veco-agent-worktree-lock.json'
        if claim_path.is_symlink():raise ValueError('Unsafe claim path')
        raw=claim_path.read_bytes();claim=json.loads(raw)
        fields={'schema':'4veco-agent-worktree-lock.v1','agent_id':actor,'task_id':task,
                'status':'active','branch':branch,'repo':repo}
        if any(claim.get(k)!=v for k,v in fields.items()):raise ValueError('Wrong active paired claim identity')
        if not same(claim.get('worktree_path',''),root) or not same(claim.get('git_dir',''),gitdir):
            raise ValueError('Wrong claim worktree/gitdir binding')
        claim_head=claim.get('head_sha','')
        if not re.fullmatch('[0-9a-f]{40}',claim_head):raise ValueError('Missing claim-time commit')
        git('merge-base','--is-ancestor',claim_head,'HEAD')
        claims.append({'repository':repo,'worktree':str(root),'git_dir':str(gitdir),
                       'claim_sha256':sha(raw),'claim_head':claim_head})
    return {'role':role,'actor':actor,'task':task,'prefix':prefix,'branch':branch,'claims':claims}

def evidence_path(path,identity,platform_root=ROOT):
    """A role-owned direct child; no nested/cross-role/symlink evidence transport."""
    parent=platform_root/'reports/sprints'
    if path.parent.resolve()!=parent.resolve() or not path.name.startswith(identity['prefix']) or path.is_symlink():
        raise ValueError('Wrong execution-role evidence path')
    return path

def namespace_preflight(revision,reservation,source_commit,platform_root=ROOT,execution_role='author'):
    identity=execution_identity(execution_role,platform_root)
    prefix=identity['prefix']
    if not re.fullmatch(r'r[1-9][0-9]*',revision):raise ValueError('Explicit positive revision required')
    expected=platform_root/'reports/sprints'/(prefix+'reservation-'+revision+'.json')
    evidence_path(reservation,identity,platform_root)
    if reservation.resolve()!=expected.resolve():raise ValueError('Wrong reservation path')
    r=json.loads(reservation.read_text(encoding='utf-8'))
    if r.get('revision')!=revision or r.get('source_commit')!=source_commit or r.get('actor')!=identity['actor'] or r.get('status')!='RESERVED_UNUSED' or r.get('execution')!=identity:
        raise ValueError('Wrong reservation identity')
    if not r.get('global_scan') or r.get('maximum_recorded_revision',0)>=int(revision[1:]):
        raise ValueError('Reservation lacks fresh global history')
    attempt=platform_root/'reports/sprints'/(prefix+'attempt-'+revision+'.json')
    manifest=platform_root/'reports/sprints'/(prefix+'native-'+revision+'.json')
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
                    nums|={int(v) for v in re.findall(rb'(?<![A-Za-z0-9])r([1-9][0-9]*)(?![A-Za-z0-9])',raw)}
                if nums:hits.append({'worktree':str(root),'path':rel,'revisions':sorted(nums)})
    return {'registered_worktrees':visited,'registered_listing_sha256':sha(listing.encode()),'hits':hits,
            'maximum':max([0]+[v for r in hits for v in r['revisions']])}

def revision_occupied(revision,scan,platform_root=ROOT):
    number=int(revision[1:]);own=os.path.normcase(os.path.abspath(platform_root))
    for hit in scan['hits']:
        if number not in hit['revisions']:continue
        # Our command log may announce the just-reserved unused revision. It is
        # not a second reservation. Actual revision-named files/directories still
        # occupy it, as does ANY matching history in a different worktree.
        same=os.path.normcase(os.path.abspath(hit['worktree']))==own
        named=re.search(r'(?<![A-Za-z0-9])'+re.escape(revision)+r'(?![A-Za-z0-9])',hit['path'])
        if not same or named:return True
    return False
