# HOW TO ADAPT: one-shot exact §231 root-only supplemental evidence relocation.
# No recursion, overwrites, external branch edits or historical JSON edits.
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath('C:/wt/book2-part-a-production-20260905/4veco-platform')
if ((Get-Location).Path -ne $taskRoot) { throw 'Wrong claimed worktree' }
$taskInput = Join-Path $taskRoot 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-prepare.json'
$taskData = Get-Content -LiteralPath $taskInput -Raw | ConvertFrom-Json
if ($taskData.status -ne 'PASS' -or $taskData.phase -ne 'prepare' -or $taskData.rows.Count -ne 66) { throw 'Invalid preflight' }
$taskOldPrefix = [IO.Path]::GetFullPath((Join-Path $taskRoot 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1')) + [IO.Path]::DirectorySeparatorChar
$taskNewPrefix = [IO.Path]::GetFullPath((Join-Path $taskRoot 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-adopted-evidence')) + [IO.Path]::DirectorySeparatorChar
$taskMoves = @()
foreach ($taskRow in $taskData.rows) {
    if ($taskRow.old_path -notmatch '^reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-grayscale-r(4|8)/(paragraaf|opgaven|antwoorden)/page-\d{3}\.png$') { throw 'Unexpected source path' }
    $taskExpectedNew = $taskRow.old_path.Replace('reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-', 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-adopted-evidence/')
    if ($taskRow.new_path -ne $taskExpectedNew) { throw 'Wrong exact destination mapping' }
    $taskSource = [IO.Path]::GetFullPath((Join-Path $taskRoot $taskRow.old_path))
    $taskDestination = [IO.Path]::GetFullPath((Join-Path $taskRoot $taskRow.new_path))
    if (-not $taskSource.StartsWith($taskOldPrefix, [StringComparison]::OrdinalIgnoreCase) -or -not $taskDestination.StartsWith($taskNewPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Resolved path escaped explicit evidence scope' }
    $taskResolvedSource = (Resolve-Path -LiteralPath $taskSource).Path
    if ($taskResolvedSource -ne $taskSource) { throw 'Source resolution differs' }
    if (Test-Path -LiteralPath $taskDestination) { throw 'Destination already exists' }
    if ((Get-FileHash -LiteralPath $taskSource -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskRow.sha256) { throw 'Source changed after preflight' }
    $taskBlob = git hash-object -- $taskSource
    if ($LASTEXITCODE -ne 0 -or $taskBlob -ne $taskRow.source_git_blob) { throw 'Original Git blob differs' }
    $taskMoves += [PSCustomObject]@{ Source=$taskSource; Destination=$taskDestination; SHA256=$taskRow.sha256 }
}
if (($taskMoves.Source | Sort-Object -Unique).Count -ne 66 -or ($taskMoves.Destination | Sort-Object -Unique).Count -ne 66) { throw 'Duplicate paths' }
# All exact absolute targets are now resolved and checked before the first move.
foreach ($taskMove in $taskMoves) {
    $taskParent = Split-Path -Parent $taskMove.Destination
    if (-not (Test-Path -LiteralPath $taskParent)) { New-Item -ItemType Directory -Path $taskParent | Out-Null }
    Move-Item -LiteralPath $taskMove.Source -Destination $taskMove.Destination
    if ((Get-FileHash -LiteralPath $taskMove.Destination -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskMove.SHA256) { throw 'Post-move bytes differ' }
}
Write-Output 'PASS: exactly 66 byte-identical supplemental PNGs relocated inside the claimed root worktree; original builder history/files untouched.'
