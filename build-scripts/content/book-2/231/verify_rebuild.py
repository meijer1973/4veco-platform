"""HOW TO ADAPT: §231 all42 raw-byte full/thin/print parity and all-page grayscale.
This writes proof, never personal inspection or independent acceptance.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import traceback
from zipfile import ZipFile
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_231 as b
from print_pipeline import build_document, digest, verify_record_freshness

def snapshot(folder):
    paths=b.packet_paths(folder)
    if len(paths)!=42 or len(set(paths))!=42:raise ValueError("Exactly42 packet paths required")
    return {p.relative_to(folder).as_posix():digest(p) for p in paths}

def check_archives(folder):
    records=[]
    for kind in b.KINDS:
        source=folder/f"{b.STEM} – {kind}.md"
        stems={Path(src).stem for src in re.findall(r"!\[[^\]]+\]\(([^)]+)\)",source.read_text(encoding="utf-8"))}
        expected={source.with_suffix(ext).name for ext in [".md",".html",".pdf"]}
        expected|={f"_assets/{stem}{ext}" for stem in stems for ext in [".svg",".png"]}
        archive=source.with_suffix(".zip");members=[]
        with ZipFile(archive) as z:
            names=z.namelist()
            if len(names)!=len(set(names)) or set(names)!=expected:
                raise ValueError(f"Wrong/duplicate ZIP membership: {kind}")
            if names!=sorted(names):raise ValueError("ZIP member ordering differs")
            if z.testzip() is not None:raise ValueError("ZIP CRC failure")
            for info in z.infolist():
                p=PurePosixPath(info.filename)
                if p.is_absolute() or ".." in p.parts or "\\" in info.filename or ":" in info.filename or info.is_dir():
                    raise ValueError("Unsafe archive member")
                if info.date_time!=(1980,1,1,0,0,0):raise ValueError("Non-fixed ZIP timestamp")
                value=z.read(info);actual=folder.joinpath(*p.parts).read_bytes()
                if value!=actual:raise ValueError("Member bytes differ from current file")
                members.append({"name":info.filename,"size":len(value),"crc32":f"{info.CRC:08x}",
                                "sha256":hashlib.sha256(value).hexdigest(),"bytes_match_file":True})
        records.append({"kind":kind,"path":str(archive),"sha256":digest(archive),"crc_test":"PASS",
                        "exact_safe_unique_membership":True,"members":members})
    return records

def check_manifest(manifest):
    folder=Path(manifest["paragraph_folder"]).resolve(strict=True)
    lesson_root=Path(manifest["lesson_root"]).resolve(strict=True)
    if folder!=(lesson_root/b.LESSON_REL).resolve() or lesson_root!=b.ROOT.parent/"4veco-lessen":
        raise ValueError("Manifest must bind the actual paired §231 lesson root")
    if manifest["plan_sha256_canonical_lf"]!=b.PLAN_HASH or manifest["target_record_sha256"]!=b.TARGET_HASH:
        raise ValueError("Wrong plan or target manifest")
    if manifest["packet"]!=snapshot(folder):raise ValueError("Packet freshness mismatch")
    for item in manifest["input_sources"]:
        if digest(Path(item["path"]))!=item["sha256"]:raise ValueError("Stale source input: "+item["path"])
    if digest(Path(manifest["thin_wrapper"]["path"]))!=manifest["thin_wrapper"]["sha256"]:
        raise ValueError("Stale thin wrapper")
    for record in manifest["documents"]:
        verify_record_freshness(record)
        if digest(Path(record["zip"]["path"]))!=record["zip"]["sha256"]:raise ValueError("Stale ZIP")
    return folder

def all_page_hashes(manifest):
    result={}
    for kind,record in zip(b.KINDS,manifest["documents"]):
        proof=Path(record["proof_directory"])
        generated=json.loads((proof/"manifest.json").read_text(encoding="utf-8"))
        if generated["pages_inspected"]!=[] or generated["inspection_status"]!="PENDING" or generated["visible_student_defects"] is not None or generated["inspected_at_normal_reading_scale"] is not False:
            raise ValueError("Generation evidence was rewritten as inspection")
        actual={p.name:digest(p) for p in sorted((proof/"pages").glob("page-*.png"))}
        if actual!=generated["page_sha256"]:raise ValueError("Changed or incomplete page proof")
        result[kind]=actual
    return result

def verify(manifest_path,output,grayscale):
    if output.exists() or grayscale.exists():raise ValueError("Use fresh verification/grayscale destinations")
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    folder=check_manifest(manifest);original=snapshot(folder)
    before_pages=all_page_hashes(manifest)
    original_proofs={str(Path(d["proof_directory"])/"manifest.json"):digest(Path(d["proof_directory"])/"manifest.json") for d in manifest["documents"]}
    archives=check_archives(folder)
    result={"paragraph":"2.3.1","source_manifest":str(manifest_path.resolve()),"source_manifest_sha256":digest(manifest_path),
            "artifacts":original,"zip_archives":archives,"steps":[],"visual_inspection":"NOT_SUPPLIED_BY_THIS_SCRIPT"}
    try:
        proof_root=Path(manifest["proof_root"])
        for method in ("full_builder","thin_wrapper"):
            revision=b.next_revision(proof_root,manifest_path.parent)
            new_manifest=manifest_path.parent/f"{b.PREFIX}-build-manifest-{revision}.json"
            arguments=["--proof-root",str(proof_root),"--proof-suffix",revision,"--manifest",str(new_manifest)]
            command=[sys.executable,str(b.ROOT/"build-scripts/content/book-2/b2_231.py"),"--lesson-root",manifest["lesson_root"],*arguments] if method=="full_builder" else [
                sys.executable,str(folder/"build_pdf.py"),*arguments]
            run=subprocess.run(command,cwd=b.ROOT,capture_output=True,text=True,encoding="utf-8")
            step={"method":method,"command":command,"exit_code":run.returncode,"stdout":run.stdout,"stderr":run.stderr,
                  "manifest":str(new_manifest)}
            result["steps"].append(step)
            if run.returncode:raise ValueError(method+" failed")
            fresh=json.loads(new_manifest.read_text(encoding="utf-8"))
            check_manifest(fresh)
            if snapshot(folder)!=original:raise ValueError(method+" changed raw packet bytes")
            if all_page_hashes(fresh)!=before_pages:raise ValueError(method+" changed rendered page bytes")
            check_archives(folder)
            step.update({"all42_raw_bytes":"IDENTICAL","all_page_png_bytes":"IDENTICAL","manifest_sha256":digest(new_manifest)})
        for kind in b.KINDS:b.zip_document(build_document(folder/f"{b.STEM} – {kind}.md"))
        if snapshot(folder)!=original:raise ValueError("Print-only changed raw packet bytes")
        check_archives(folder)
        result["steps"].append({"method":"native_print_only","all42_raw_bytes":"IDENTICAL","api":"print_pipeline.build_document + b2_231.zip_document"})
        for name,sha in original_proofs.items():
            if digest(Path(name))!=sha:raise ValueError("Original proof manifest changed")
        grayscale.mkdir(parents=True)
        gray=[]
        for kind,record in zip(b.KINDS,manifest["documents"]):
            directory=grayscale/kind;directory.mkdir()
            subprocess.run(["pdftoppm","-gray","-png","-r","150",record["source_pdf"],str(directory/"page")],capture_output=True,text=True,check=True)
            paths=sorted(directory.glob("page-*.png"),key=lambda p:int(p.stem.split("-")[-1]))
            if len(paths)!=len(before_pages[kind]):raise ValueError("Missing grayscale pages")
            for index,p in enumerate(paths,1):
                destination=directory/f"page-{index:03d}.png"
                if p!=destination:p.rename(destination)
                gray.append({"kind":kind,"page":index,"path":str(destination.resolve()),"sha256":digest(destination),"source_pdf_sha256":record["pdf_sha256"]})
        result.update({"status":"PASS","all42_raw_rebuilds":"IDENTICAL","all_page_grayscale":gray,
                       "original_pending_manifest_hashes":original_proofs})
    except Exception as error:
        result.update({"status":"FAIL","error":str(error),"traceback":traceback.format_exc()})
        raise
    finally:
        output.parent.mkdir(parents=True,exist_ok=True)
        with output.open("x",encoding="utf-8",newline="\n") as stream:stream.write(json.dumps(result,ensure_ascii=False,indent=2)+"\n")
        print(json.dumps({k:v for k,v in result.items() if k in ("paragraph","status","all42_raw_rebuilds","visual_inspection","error")},indent=2))

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest",type=Path);parser.add_argument("output",type=Path);parser.add_argument("grayscale",type=Path)
    args=parser.parse_args();verify(args.manifest,args.output,args.grayscale)
