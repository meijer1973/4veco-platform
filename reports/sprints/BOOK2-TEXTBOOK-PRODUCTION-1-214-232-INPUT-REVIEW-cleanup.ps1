# Exact own disposable-fixture cleanup requested by root after reviewing the report.
# Verify resolved target and every restored byte before native single-shell removal.
$ErrorActionPreference='Stop'
$taskPlatform=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$taskEvidence=Join-Path $PSScriptRoot 'BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-REVIEW-independent.json'
$taskExpected='C:\wt\book2-214-232-independent-input-fixture-vhLV7i'
$taskRecord=Get-Content -LiteralPath $taskEvidence -Raw | ConvertFrom-Json
$taskResolved=(Resolve-Path -LiteralPath $taskExpected).Path
if($taskResolved -cne $taskExpected){throw 'Resolved target differs from exact recorded task-created fixture'}
if([IO.Path]::GetFullPath($taskRecord.fixture) -cne $taskExpected){throw 'Probe evidence does not name this exact fixture'}
if((Split-Path $taskResolved -Parent) -cne 'C:\wt'){throw 'Target is outside intended temporary parent'}
$taskRootItem=Get-Item -LiteralPath $taskResolved -Force
if($taskRootItem.Attributes -band [IO.FileAttributes]::ReparsePoint){throw 'Refusing reparse-point fixture'}
$taskAll=@(Get-ChildItem -LiteralPath $taskResolved -Recurse -Force)
if(@($taskAll | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }).Count -ne 0){throw 'Refusing nested reparse point'}
$taskFiles=@($taskAll | Where-Object { -not $_.PSIsContainer })
$taskHashes=$taskRecord.fixture_final.PSObject.Properties
if($taskFiles.Count -ne 67 -or @($taskHashes).Count -ne 67){throw 'Unexpected disposable file inventory'}
$taskVerified=foreach($taskFile in $taskFiles){
    if(-not $taskFile.FullName.StartsWith($taskResolved+'\',[StringComparison]::Ordinal)){throw 'Nested path escapes verified fixture'}
    $taskRelative=[IO.Path]::GetRelativePath($taskResolved,$taskFile.FullName).Replace('\','/')
    $taskExpectedHash=$taskRecord.fixture_final.PSObject.Properties[$taskRelative].Value
    $taskActualHash=(Get-FileHash -LiteralPath $taskFile.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    if($taskActualHash -cne $taskExpectedHash){throw ('Restored byte mismatch: '+$taskRelative)}
    [pscustomobject]@{path=$taskRelative;raw_sha256=$taskActualHash}
}
# Only the exact now-validated own-created disposable directory is removed.
Remove-Item -LiteralPath $taskResolved -Recurse -Force
if(Test-Path -LiteralPath $taskResolved){throw 'Verified disposable fixture was not fully removed'}
[pscustomobject]@{
    status='PASS';actor='paragraph_224_builder';exact_removed_target=$taskResolved
    raw_evidence_sha256=(Get-FileHash -LiteralPath $taskEvidence -Algorithm SHA256).Hash.ToLowerInvariant()
    verified_restored_files=$taskVerified;removed_only_own_disposable_copy=$true
    repositories_or_foreign_fixtures_modified=$false
    recovery='Every file is an unchanged committed input in the exact manifest; originals and restoration hashes remain intact. Disposable copy can be recreated from those immutable blobs.'
} | ConvertTo-Json -Depth 5
