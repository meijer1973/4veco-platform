# Root §224 runtime notes

2026-09-06. Preserve all earlier evidence and commit-specific subjects.

The first root adapter invocation at source commit
a9c52066a948be02970114cef6d922ae86951286 failed parsing: a missing closing quote
on the dictionary key `path` in line32. The actual terminal exit was1, before
imports, probes, gates, reservations or native effects. No file-backed process
capture existed for that initial parse failure; the terminal trace and complete
original committed source remain. The next commit corrects only that key and
records this note. Do not describe the earlier source as executed successfully.

The operational order's count wording was also corrected in a9c52066 from
"all other29" to "all29 existing" PDF bytes. There are29 total existing PDFs;
two224 PDFs are among them. Counts, scope and PDF preservation are unchanged.

Read-only discovery during preparation attempted a nonexistent `-publish.cjs`
name before finding the actual `-publication.py` with rg. That lookup exited1
and wrote nothing; no missing checker is represented as a pass.
