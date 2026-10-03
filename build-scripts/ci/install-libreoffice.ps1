param(
  [Parameter(Mandatory = $true)][string]$CacheDirectory,
  [Parameter(Mandatory = $true)][string]$ArtifactDirectory
)
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path $ArtifactDirectory | Out-Null
$helper = Join-Path $PSScriptRoot 'libreoffice-installer.js'
$downloadJson = & node $helper download $CacheDirectory
if ($LASTEXITCODE -ne 0) { throw 'Pinned LibreOffice acquisition failed' }
$download = $downloadJson | ConvertFrom-Json
$log = [System.IO.Path]::GetFullPath((Join-Path $ArtifactDirectory 'libreoffice-msi.log'))
$arguments = @('/i', ('"' + $download.installer + '"'), '/qn', '/norestart', '/L*v', ('"' + $log + '"'))
$process = Start-Process -FilePath 'msiexec.exe' -ArgumentList $arguments -PassThru -WindowStyle Hidden
if (-not $process.WaitForExit(300000)) {
  $process.Kill()
  throw 'LibreOffice MSI installation exceeded five minutes'
}
$process.Refresh()
if ($process.ExitCode -notin @(0, 3010)) {
  throw "LibreOffice MSI installation failed with exit code $($process.ExitCode); see $log"
}
$soffice = Join-Path $env:ProgramFiles 'LibreOffice\program\soffice.exe'
$installedJson = & node $helper verify $soffice
if ($LASTEXITCODE -ne 0) { throw 'Installed LibreOffice verification failed' }
$installed = $installedJson | ConvertFrom-Json
@{ download = $download; installed = $installed; msi_exit_code = $process.ExitCode } |
  ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $ArtifactDirectory 'libreoffice-install.json') -Encoding utf8
Write-Host "Verified $($installed.version_output) at $soffice"
