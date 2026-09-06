"""HOW TO ADAPT: bounded §224 author evidence; immutable attempts, no acceptance.

Run init once, reserve before each native route, then run/check/custody. Normal
entrypoint and cwd, Python314 and inherited PATH. Historical evidence is never
rewritten. Whole source custody is bound to an actual committed source payload.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
LESSONS=ROOT.parent/"4veco-lessen"
PREFIX="BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD"
EVIDENCE=ROOT/"reports/sprints"/(PREFIX+"-evidence")
PBASE="e42c2b276354aeb1eb903bfb480a5dad27d898b2"
LBASE="8a3d4018ad6a5082449a17c59f991cbdc93fbb62"
SOURCE_COMMIT="aca14c61d258c05d668005d20bf0e4196de89ced"
SOURCE_PATHS=["build-scripts/content/book-2/b2_224.py", *["build-scripts/content/book-2/224/"+n for n in
              ("answers.md","check_render.py","exercises.md","target-answers.md","test_source.py")]]
sys.path.insert(0,str(ROOT/"build-scripts/content/book-2"))
import b2_224 as b


def now():return datetime.now(timezone.utc).isoformat()


def git(root,*args):
    return subprocess.run(["git",*args],cwd=root,capture_output=True,check=True).stdout


def write_new(path,value):
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open("x",encoding="utf-8",newline="\n") as stream:
        stream.write(json.dumps(value,ensure_ascii=False,indent=2)+"\n")


def source_guard():
    expected={relative:git(ROOT,"show",SOURCE_COMMIT+":"+relative) for relative in SOURCE_PATHS}
    verify_bound_bytes(ROOT,expected)
    return [{"path":relative,"commit":SOURCE_COMMIT,"raw_sha256":b.sha(raw)} for relative,raw in expected.items()]


def verify_bound_bytes(root,expected):
    """Pure whole-file verification used by actual frozen-source probes."""
    for relative,raw in expected.items():
        path=b.data_path(root/relative)
        if not path.is_file() or path.read_bytes()!=raw:
            raise ValueError("Whole immutable candidate bytes differ: "+relative)


def init():
    rows=[]
    for name,root,commit in [("4veco-platform",ROOT,PBASE),("4veco-lessen",LESSONS,LBASE)]:
        for item in git(root,"ls-tree","-rz",commit).split(b"\0"):
            if not item:continue
            metadata,relative=item.split(b"\t",1);blob=metadata.split()[-1].decode();relative=relative.decode("utf-8")
            raw=b.data_path(root/relative).read_bytes()
            actual_blob=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
            if actual_blob!=blob:raise ValueError("Baseline differs before output: "+relative)
            rows.append({"repository":name,"path":relative,"git_blob":blob,"raw_sha256":b.sha(raw)})
    manifest=b.verify_current_release(LESSONS);b.verify_committed_release(manifest,LESSONS)
    instructions=json.loads(Path("C:/wt/book2-223-alt-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-baseline.json").read_text(encoding="utf-8"))["instructions"]
    for row in instructions:
        if b.digest(b.data_path(ROOT.parent/row["repository"]/row["path"]))!=row["raw_sha256"]:raise ValueError("Instruction drift")
    path=ROOT/"reports/sprints"/(PREFIX+"-baseline.json")
    write_new(path,{"created":now(),"actor":"paragraph_224_builder","bases":{"platform":PBASE,"lessons":LBASE},
                    "files":rows,"instructions":instructions,"sources":source_guard(),"release_raw_sha256":b.RELEASE_HASH,
                    "environment":{"python":sys.executable,"version":sys.version,"path_raw_sha256":b.sha(os.environ["PATH"].encode())}})
    print(json.dumps({"baseline":str(path),"raw_sha256":b.digest(path),"files":len(rows),"instructions":len(instructions)}))


def reserve(label):
    source_guard()
    registered=set()
    for root in (ROOT,LESSONS):
        for line in git(root,"worktree","list","--porcelain").decode("utf-8").splitlines():
            if line.startswith("worktree "):registered.add(line[9:])
    maximum=0;matches=[]
    for worktree in sorted(registered):
        candidate=Path(worktree)/"reports/sprints"
        if not candidate.exists():continue
        for directory,dirs,files in os.walk(candidate):
            relative=Path(directory).relative_to(candidate).as_posix()
            for name in [*dirs,*files]:
                path=relative+"/"+name
                if "224" not in path:continue
                revisions=re.findall(r"(?:^|[-_/])r([1-9][0-9]*)(?=[-_. /]|$)",path)
                for revision in revisions:
                    value=int(revision);maximum=max(maximum,value)
                    matches.append({"worktree":worktree,"path":path,"revision":value})
    revision=f"r{maximum+1}"
    path=EVIDENCE/f"224-reservation-{label}-{revision}.json"
    write_new(path,{"created":now(),"actor":"paragraph_224_builder","label":label,"revision":revision,
                    "registered_worktrees":sorted(registered),"maximum_prior":maximum,"matches":matches})
    print(json.dumps({"reservation":str(path),"revision":revision,"registered_worktrees":len(registered),"maximum_prior":maximum}))


def execute(label,revision,mode):
    sources=source_guard()
    reservation=EVIDENCE/f"224-reservation-{label}-{revision}.json"
    if not reservation.is_file():raise ValueError("No exclusive reservation for attempt")
    if json.loads(reservation.read_text(encoding="utf-8"))["revision"]!=revision:raise ValueError("Reservation mismatch")
    prefix=EVIDENCE/f"224-{label}-{revision}"
    manifest=Path(str(prefix)+"-manifest.json")
    builder=ROOT/"build-scripts/content/book-2/b2_224.py"
    command=[sys.executable,str(builder)]
    if mode=="thin":command=[sys.executable,str(LESSONS/b.LESSON_REL/"build_pdf.py")]
    command += ["--lesson-root",str(LESSONS),"--proof-root",str(EVIDENCE),"--proof-suffix",revision,"--manifest",str(manifest)]
    if mode=="print":
        release=b.verify_current_release(LESSONS);b.verify_committed_release(release,LESSONS)
        folder=LESSONS/b.LESSON_REL
        for kind,source in b.documents(b.target_record()).items():
            if (folder/f"{b.STEM} – {kind}.md").read_bytes()!=(source.rstrip()+"\n").encode():raise ValueError("Direct print source derivation differs")
        for name,source in b.asset_sources().items():
            if (folder/"_assets"/(name+".svg")).read_bytes()!=source.encode():raise ValueError("Direct print SVG derivation differs")
        command=[sys.executable,str(ROOT/"build-scripts/content/book-2/print_pipeline.py"),
                 *[str(folder/f"{b.STEM} – {kind}.md") for kind in ("opgaven","antwoorden")],
                 "--proof-root",str(EVIDENCE/f"224-direct-{revision}")]
    started={"created":now(),"status":"STARTED_NOT_ACCEPTED","argv":command,"cwd":str(ROOT),"sources":sources,
             "reservation_raw_sha256":b.digest(reservation),"path_raw_sha256":b.sha(os.environ["PATH"].encode())}
    write_new(Path(str(prefix)+"-started.json"),started)
    env=dict(os.environ);env["PYTHONIOENCODING"]="utf-8";env["PYTHONDONTWRITEBYTECODE"]="1"
    start=time.monotonic();result=subprocess.run(command,cwd=ROOT,env=env,capture_output=True)
    for stream,raw in [("stdout",result.stdout),("stderr",result.stderr)]:
        with Path(str(prefix)+f"-{stream}.txt").open("xb") as f:f.write(raw)
    if mode=="print" and result.returncode==0:
        records=[json.loads(line) for line in result.stdout.decode("utf-8").splitlines() if line.startswith("{")]
        if len(records)!=2:raise ValueError("Actual direct print did not return both records")
        for record in records:
            record["proof_directory"]=str(EVIDENCE/f"224-direct-{revision}"/record["artifact_id"])
        write_new(manifest,{"paragraph":"2.2.4","release_commit":b.RELEASE_COMMIT,"release_sha256":b.RELEASE_HASH,
                           "actual_route":"direct unchanged print_pipeline.py CLI","inspection_status":"PENDING",
                           "documents":records,"native_files":[{"path":str(p.relative_to(LESSONS)),"sha256":b.digest(p)} for p in b.native_paths(folder)]})
    value={"finished":now(),"exit_code":result.returncode,"elapsed_seconds":time.monotonic()-start,
           "stdout_sha256":b.sha(result.stdout),"stderr_sha256":b.sha(result.stderr),
           "manifest":str(manifest),"manifest_sha256":b.digest(manifest) if manifest.is_file() else None,
           "path_unchanged":started["path_raw_sha256"]==b.sha(os.environ["PATH"].encode())}
    write_new(Path(str(prefix)+"-finished.json"),value)
    print(json.dumps(value));print(result.stderr.decode("utf-8",errors="replace")[-4000:])
    if result.returncode:raise SystemExit(result.returncode)


def pages(manifest):
    from PIL import Image
    output=[]
    for kind,record in zip(("opgaven","antwoorden"),manifest["documents"]):
        directory=Path(record["proof_directory"])
        proof=json.loads((directory/"manifest.json").read_text(encoding="utf-8"))
        if proof["pages_inspected"] or proof["inspection_status"]!="PENDING":raise ValueError("Generation proof was rewritten")
        for number,relative in enumerate(proof["rendered_pages"],1):
            path=directory/relative
            with Image.open(path) as im:
                rgb=im.convert("RGB");raw=rgb.tobytes()
                output.append({"kind":kind,"page":number,"path":str(path),"raw_sha256":b.digest(path),"rgb_sha256":b.sha(raw),"size":list(rgb.size)})
    return output


def parity(paths):
    sources=source_guard()
    manifests=[json.loads(path.read_text(encoding="utf-8")) for path in paths]
    native=manifests[0]["native_files"]
    page_sets=[pages(m) for m in manifests]
    comparable=lambda rows:[{k:v for k,v in row.items() if k!="path"} for row in rows]
    for manifest,rows in zip(manifests,page_sets):
        if manifest["native_files"]!=native:raise ValueError("15 native bytes differ between routes")
        if comparable(rows)!=comparable(page_sets[0]):raise ValueError("Raw/decoded page parity differs")
    folder=LESSONS/b.LESSON_REL
    for row in native:
        if b.digest(LESSONS/row["path"])!=row["sha256"]:raise ValueError("Current native bytes drifted")
    value={"status":"PASS","sources":sources,"manifests":[{"path":str(p),"raw_sha256":b.digest(p)} for p in paths],
           "native_files":native,"page_sets":page_sets,"native_per_route":15,"complete_page_count_per_route":len(page_sets[0]),
           "all_four_png_bytes_imply_exact_decoded_figure_parity":True}
    path=EVIDENCE/"224-parity.json";write_new(path,value);print(json.dumps({"path":str(path),"sha256":b.digest(path),"pages":len(page_sets[0])}))


def views(manifest_path):
    from PIL import Image
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"));output=[]
    directory=EVIDENCE/"224-personal-views";directory.mkdir(exist_ok=False)
    for row in pages(manifest):
        with Image.open(row["path"]) as im:
            path=directory/f"{row['kind']}-page-{row['page']:03d}-gray.png";im.convert("L").convert("RGB").save(path)
        output.append({**row,"gray_path":str(path),"gray_sha256":b.digest(path),"observation":"NOT_YET_RECORDED"})
    for n in range(1,5):
        source=LESSONS/b.LESSON_REL/"_assets"/f"2.2.4_ex_{n}.png"
        with Image.open(source) as im:
            path=directory/f"figure-{n}-gray.png";im.convert("L").convert("RGB").save(path)
        output.append({"figure":n,"path":str(source),"raw_sha256":b.digest(source),"gray_path":str(path),"gray_sha256":b.digest(path),"observation":"NOT_YET_RECORDED"})
    path=EVIDENCE/"224-view-inventory.json";write_new(path,{"manifest_sha256":b.digest(manifest_path),"views":output})
    print(json.dumps({"inventory":str(path),"raw_sha256":b.digest(path),"items":len(output)}))


def custody():
    baseline=json.loads((ROOT/"reports/sprints"/(PREFIX+"-baseline.json")).read_text(encoding="utf-8"))
    allowed={str(p.relative_to(LESSONS)).replace("\\","/") for p in b.native_paths(LESSONS/b.LESSON_REL)}
    indexes={f"reports/github-agent-index-{repo}.{ext}" for repo in ("platform","lessen") for ext in ("json","md")}
    changed=[];preserved=0
    for row in baseline["files"]:
        path=b.data_path(ROOT.parent/row["repository"]/row["path"])
        actual=b.digest(path) if path.is_file() else None
        if actual==row["raw_sha256"]:preserved+=1;continue
        if not ((row["repository"]=="4veco-lessen" and row["path"] in allowed) or (row["repository"]=="4veco-platform" and row["path"] in indexes)):
            raise ValueError("Unowned baseline change: "+row["path"])
        changed.append({**row,"current_raw_sha256":actual})
    value={"status":"PASS","baseline_files":len(baseline["files"]),"preserved":preserved,"authorized_existing_changes":changed,"sources":source_guard()}
    path=EVIDENCE/"224-final-custody.json";write_new(path,value);print(json.dumps({"path":str(path),"sha256":b.digest(path),"preserved":preserved,"changed":len(changed)}))


if __name__=="__main__":
    parser=argparse.ArgumentParser();parser.add_argument("action",choices=["init","reserve","run","parity","views","custody"])
    parser.add_argument("--label");parser.add_argument("--revision");parser.add_argument("--mode",choices=["full","thin","print"],default="full")
    parser.add_argument("--manifest",type=Path,nargs="+")
    args=parser.parse_args()
    if args.action=="init":init()
    elif args.action=="reserve":reserve(args.label)
    elif args.action=="run":execute(args.label,args.revision,args.mode)
    elif args.action=="parity":parity(args.manifest)
    elif args.action=="views":views(args.manifest[0])
    else:custody()
