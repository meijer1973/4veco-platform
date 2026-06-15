# No-Legacy Proof

Status: static DOM and asset proof for the implemented `1.1.3` Golden Exercise Workbench exemplar.

## Snapshot Under Review

```text
references/exemplars/implemented/1.1.3-golden-exercise-workbench/generated-route-snapshot.html
```

Source snapshot:

```text
references/exemplars/implemented/1.1.3-golden-exercise-workbench/source-data-snapshot.json
```

## Hashes

```text
generated-route-snapshot.html sha256: 27D7C22C680410C5CEFA831732513B0AE675CD15B5DABF5B976F120DA6707118
source-data-snapshot.json sha256: B6E049B17C117D825291FE83C218F12CB0CFBF4FCBD3DA718D2C6031B71FCCC1
```

## Positive Golden Evidence

Static inspection of `generated-route-snapshot.html` shows:

```text
header.ge-topbar: present
main.ge-page[data-golden-ticket-root]: present
golden-ticket-layout.css: present
golden-ticket-graph.js: present
golden-ticket-layout.js: present
section.ge-task-card[data-ge-task-card][aria-label="Werkvragen"]: present
```

Static inspection of `source-data-snapshot.json` shows:

```text
layout.framework: golden_exercise_workbench
```

## Legacy Contamination Check

Static inspection of `generated-route-snapshot.html` shows:

```text
#exit-ticket-app: absent
et-page: absent
task-shell.css: absent
exit-ticket.css: absent
task-shell-ui.js: absent
exit-ticket-ui.js: absent
ge-task-header: absent
visible Werkbank task-card label: absent
visible Werkvragen heading: absent
```

## Evidence Command

The proof above was produced with a direct static check equivalent to:

```powershell
$html = Get-Content -LiteralPath 'references/exemplars/implemented/1.1.3-golden-exercise-workbench/generated-route-snapshot.html' -Raw
$json = Get-Content -LiteralPath 'references/exemplars/implemented/1.1.3-golden-exercise-workbench/source-data-snapshot.json' -Raw
$html -match 'ge-topbar'
$html -match 'data-golden-ticket-root'
$html -match 'golden-ticket-layout\.css'
$html -match 'golden-ticket-graph\.js'
$html -match 'golden-ticket-layout\.js'
$html -match 'data-ge-task-card aria-label="Werkvragen"'
$html -match 'exit-ticket-app'
$html -match 'et-page'
$html -match 'task-shell\.css'
$html -match 'exit-ticket\.css'
$html -match 'task-shell-ui\.js'
$html -match 'exit-ticket-ui\.js'
$html -match 'ge-task-header'
$html -match '>Werkbank<'
$html -match '<h2>Werkvragen</h2>'
$json -match '"framework"\s*:\s*"golden_exercise_workbench"'
```

## Boundary

This proof establishes the snapshot shell and asset boundary. It does not prove
rendered visual quality, interaction state, keyboard behavior, mobile/dark
screenshots, or formula-token policy. Those remain screenshot/reviewer proof
obligations before broader route adoption; formula-token policy remains
delegated to A96.
