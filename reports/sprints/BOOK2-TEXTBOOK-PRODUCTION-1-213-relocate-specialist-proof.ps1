# Mechanical evidence-only relocation into an existing lane-permitted namespace.
# Run once; never overwrite a destination or erase any proof bytes.
$ErrorActionPreference = 'Stop'
$taskRepoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$taskSource = (Resolve-Path -LiteralPath (Join-Path $taskRepoRoot 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-specialist-r5')).Path
$taskDestination = [IO.Path]::GetFullPath((Join-Path $taskRepoRoot 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-r5'))
$taskBoundary = $taskRepoRoot + [IO.Path]::DirectorySeparatorChar
if (-not $taskSource.StartsWith($taskBoundary, [StringComparison]::OrdinalIgnoreCase) -or -not $taskDestination.StartsWith($taskBoundary, [StringComparison]::OrdinalIgnoreCase)) { throw 'Resolved target outside owned repository' }
if (Test-Path -LiteralPath $taskDestination) { throw 'Immutable destination already exists' }
$taskFiles = @(Get-ChildItem -LiteralPath $taskSource -Recurse -File | ForEach-Object {
    [PSCustomObject]@{ relative = [IO.Path]::GetRelativePath($taskSource, $_.FullName); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
})
if ($taskFiles.Count -ne 37) { throw 'Unexpected specialist proof inventory' }
Move-Item -LiteralPath $taskSource -Destination $taskDestination
foreach ($taskFile in $taskFiles) {
    $taskNewPath = Join-Path $taskDestination $taskFile.relative
    if ((Get-FileHash -LiteralPath $taskNewPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $taskFile.sha256) { throw "Relocation hash mismatch: $($taskFile.relative)" }
}
if (Test-Path -LiteralPath $taskSource) { throw 'Original directory unexpectedly remains' }
[PSCustomObject]@{ result = 'PASS'; operation = 'byte-identical evidence relocation'; old_prefix = 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-specialist-r5'; new_prefix = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-r5'; files = $taskFiles; original_payload_commit = '25e3bdf696b84f8005fe30ce435efd0be8d95c4d'; source_reports_unchanged = $true } | ConvertTo-Json -Depth 5
