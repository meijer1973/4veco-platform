"""HOW TO ADAPT: immutable actual native runs, raw and decoded proof parity.

Read-only artifacts; writes only a fresh owned evidence JSON. Never modifies
native files or proof manifests. Personally viewed r42 is the pixel reference.
"""
import gzip
import hashlib
import json
from pathlib import Path
import subprocess
from PIL import Image

P=Path(__file__).resolve().parents[2];L=P.parent/"4veco-lessen"
N="BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT"
sha=lambda b:hashlib.sha256(b).hexdigest()
def raw(p):return Path(p).read_bytes()
def js(p):return json.loads(raw(p))
runs=[("r42","full"),("r43","full"),("r44","thin"),("r45","direct"),("r46","checker")]
output=P/"reports/sprints"/(N+"-native-parity.json")
assert not output.exists()
result={"status":"PASS","native_files":15,"runs":[],"source":[],"current_native":[],"personal_view_transfer":"All20color+20gray pages and4color+4gray figures personally viewed in r42; later exact raw/decoded parity below, not a claim of separately viewing every duplicate."}
reference=None;reference_pages=None
for revision,route in runs:
    runroot=P/"reports/sprints"/(N+"-"+revision+"-"+route)
    record=js(runroot/"author-run.json")
    native={r["path"]:r["sha256"] for r in record["native"]}
    assert len(native)==15
    if reference is None:reference=native
    assert native==reference,(revision,"native parity")
    pages=[];manifests=[]
    for proof in record["proofs"]:
        assert proof["inspection_status"]=="PENDING" and proof["pages_inspected"]==[]
        ed="antwoorden" if "antwoorden" in proof["artifact_id"] else "opgaven"
        folder=runroot/proof["artifact_id"]
        manifest=raw(folder/"manifest.json")
        assert json.loads(manifest)==proof
        manifests.append({"path":str((folder/"manifest.json").relative_to(P)),"sha256":sha(manifest),"PENDING_preserved":True})
        for i,rel in enumerate(proof["rendered_pages"],1):
            file=folder/rel
            assert sha(raw(file))==proof["page_sha256"][file.name]
            with Image.open(file) as image:
                rgb=image.convert("RGB");gray=rgb.convert("L").convert("RGB")
                pages.append({"edition":ed,"page":i,"size":list(rgb.size),"file_sha256":sha(raw(file)),"RGB_sha256":sha(rgb.tobytes()),"gray_RGB_sha256":sha(gray.tobytes())})
    pages.sort(key=lambda row:(row["edition"],row["page"]))
    assert len(pages)==20
    assert [sum(r["edition"]==ed for r in pages) for ed in ["opgaven","antwoorden"]]==[9,11]
    if reference_pages is None:reference_pages=pages
    assert pages==reference_pages,(revision,"all decoded pages")
    if route!="full" or revision!="r42":assert record["source_commit"]=="09e99f770b057d239e8d3d7c7e3185e830615cf7"
    assert record["namespace"]["requested"]>record["namespace"]["highest"]
    row={"revision":revision,"route":route,"author_run_sha256":sha(raw(runroot/"author-run.json")),"source_commit":record["source_commit"],"actual_registered_worktrees":len(record["namespace"]["all_registered_roots"]),"actual_nested_observations":len(record["namespace"]["observed"]),"highest":record["namespace"]["highest"],"requested":record["namespace"]["requested"],"manifests":manifests,"pages":pages,"native":record["native"],"parent_argv":record["argv"]}
    if route=="direct":
        worker=[r for r in record["processes"] if r["native_worker"]]
        assert len(worker)==1
        argv=worker[0]["argv"];assert len(argv)==6 and argv[-2]=="--proof-root"
        assert Path(argv[1])==P/"build-scripts/content/book-2/print_pipeline.py"
        assert argv[2].endswith(" – opgaven.md") and argv[3].endswith(" – antwoorden.md")
        assert Path(argv[-1])==runroot
        row["exact_unchanged_shared_child"]=worker[0]
    result["runs"].append(row)
for rel,h in reference.items():
    data=raw(L/rel);assert sha(data)==h
    committed=subprocess.check_output(["git","show","84f821a3cde2e525c54593d7f36ea86b2c53dff9:"+rel],cwd=L)
    assert data==committed
    result["current_native"].append({"path":rel,"bytes":len(data),"sha256":h,"actual_native_L_commit":"84f821a3cde2e525c54593d7f36ea86b2c53dff9"})
views=js(P/"reports/sprints"/(N+"-r42-views.json"))
for row in views["pages"]:
    ref=next(v for v in reference_pages if v["edition"]==row["edition"] and v["page"]==row["page"])
    assert ref["RGB_sha256"]==row["color_RGB_sha256"] and ref["gray_RGB_sha256"]==row["gray_RGB_sha256"]
for row in views["figures"]:
    assert sha(raw(row["color"]))==row["color_file_sha256"]
    with Image.open(row["color"]) as image:assert sha(image.convert("RGB").tobytes())==row["color_RGB_sha256"]
result["visual_evidence"]={"views_sha256":sha(raw(P/"reports/sprints"/(N+"-r42-views.json"))),"observations_sha256":sha(raw(P/"reports/sprints"/(N+"-visual-r42.md"))),"pages":20,"figures":4,"color_and_gray":True}
for rel in ["build-scripts/content/book-2/b2_214.py",*["build-scripts/content/book-2/214/"+n for n in ["exercises.md","answers.md","target-answers.md","figures.py","raster.cjs","dependency-pins.json","direct_print.py","test_source.py","check_render.py"]]]:
    data=raw(P/rel);old=subprocess.check_output(["git","show","09e99f770b057d239e8d3d7c7e3185e830615cf7:"+rel],cwd=P)
    if rel.endswith("b2_214.py"):
        before=b'SOURCE_COMMIT = "SOURCE_COMMIT_PENDING_214"';assert old.count(before)==1
        old=old.replace(before,b'SOURCE_COMMIT = "09e99f770b057d239e8d3d7c7e3185e830615cf7"')
    assert old==data
    result["source"].append({"path":rel,"sha256":sha(data),"bytes":len(data),"whole_committed_derivation":True})
log=P/"reports/sprints"/(N+"-source-probes-r3-process.json.gz")
digest=hashlib.sha256();length=0
with gzip.open(log,"rb") as stream:
    while chunk:=stream.read(1024*1024):digest.update(chunk);length+=len(chunk)
assert digest.hexdigest()=="062d65ff80c22026cd5d1eb26072523100bef75e86fe66de073f6212f3bc8576" and length==302044775
result["source_test_log"]={"gzip_sha256":sha(raw(log)),"decompressed_sha256":digest.hexdigest(),"decompressed_bytes":length,"lossless":True}
with output.open("x",encoding="utf-8",newline="\n") as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write("\n")
print(json.dumps({"status":"PASS","runs":len(runs),"native_files":15,"pages_per_run":20,"figures":4,"source_files":10,"observed_color_and_gray":True,"no_acceptance":True}))
