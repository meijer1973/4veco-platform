param(
 [Parameter(Mandatory=$true)][string]$Pptx,
 [Parameter(Mandatory=$true)][string]$Pdf,
 [Parameter(Mandatory=$true)][string]$RenderDir
)
$ErrorActionPreference = 'Stop'
$Pptx = (Resolve-Path -LiteralPath $Pptx).Path
$Pdf = [IO.Path]::GetFullPath($Pdf)
$RenderDir = [IO.Path]::GetFullPath($RenderDir)
if (Test-Path -LiteralPath $Pdf) { throw "Use a new PDF destination: $Pdf" }
if ((Test-Path -LiteralPath $RenderDir) -and (Get-ChildItem -LiteralPath $RenderDir -Force | Select-Object -First 1)) {
 throw "Use an empty render directory: $RenderDir"
}
New-Item -ItemType Directory -Path (Split-Path -Parent $Pdf), $RenderDir -Force | Out-Null
# PowerPoint COM attaches callers to a shared application. Serialize complete
# render/export lifetimes across paired author worktrees in this Windows session.
$renderMutex = [Threading.Mutex]::new($false, 'Local\4veco-classroom-powerpoint-render')
$ownsRenderMutex = $false
try {
 try { $ownsRenderMutex = $renderMutex.WaitOne() }
 catch [Threading.AbandonedMutexException] { $ownsRenderMutex = $true }
$powerPointWasRunning = $null -ne (Get-Process -Name POWERPNT -ErrorAction SilentlyContinue | Select-Object -First 1)
$app = New-Object -ComObject PowerPoint.Application
$previousAlerts = $app.DisplayAlerts
$deck = $null
try {
 $app.DisplayAlerts = 1
 $deck = $app.Presentations.Open($Pptx, $true, $false, $false)
 Write-Output "PowerPoint opened $($deck.Slides.Count) slides."
 $qa = @()
 foreach ($slide in $deck.Slides) {
  $slide.Export((Join-Path $RenderDir ('slide-{0:D2}.png' -f $slide.SlideIndex)), 'PNG', 1600, 900)
  foreach ($shape in $slide.Shapes) {
   if ($shape.HasTextFrame -eq -1 -and $shape.TextFrame.HasText -eq -1) {
    $range = $shape.TextFrame2.TextRange
    $qa += [pscustomobject]@{
     slide=$slide.SlideIndex; name=$shape.Name; text=$range.Text
     top=$shape.Top; left=$shape.Left; height=$shape.Height; width=$shape.Width
     boundHeight=$range.BoundHeight; boundWidth=$range.BoundWidth
     boundTop=$range.BoundTop; fontSize=$range.Font.Size
    }
   }
  }
 }
 # SaveAs avoids COM's unreliable optional ExportAsFixedFormat parameters.
 $deck.SaveAs($Pdf, 32)
 $qa | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RenderDir 'text-geometry.json') -Encoding utf8
 Write-Output "Rendered $($deck.Slides.Count) slides and exported PDF. Inspect table cells and chart labels visually too."
} finally {
 if ($null -ne $deck) { $deck.Close(); [Runtime.InteropServices.Marshal]::ReleaseComObject($deck) | Out-Null }
 $app.DisplayAlerts = $previousAlerts
 # PowerPoint automation can attach to an existing shared application instance.
 # Close only our deck; preserve an existing app or presentations opened meanwhile.
 if (-not $powerPointWasRunning -and $app.Presentations.Count -eq 0) { $app.Quit() }
 [Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
}
} finally {
 if ($ownsRenderMutex) { $renderMutex.ReleaseMutex() }
 $renderMutex.Dispose()
}
