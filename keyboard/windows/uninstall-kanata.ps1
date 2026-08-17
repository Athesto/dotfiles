[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$runtimeDirectory = Join-Path $PSScriptRoot 'runtime'
$stopScript = Join-Path $PSScriptRoot 'stop-kanata.ps1'

if (-not (Test-Path -LiteralPath $runtimeDirectory -PathType Container)) {
    Write-Host 'Kanata is not installed in this folder.'
    exit 0
}

Write-Host 'This will stop Kanata and remove:'
Write-Host $runtimeDirectory
$confirmation = Read-Host 'Continue? [Y/N]'

if ($confirmation -notmatch '^(?i:y|yes)$') {
    Write-Host 'Uninstall cancelled.'
    exit 0
}

& $stopScript
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Kanata could not be stopped, so it was not removed.'
    exit $LASTEXITCODE
}

try {
    Remove-Item -LiteralPath $runtimeDirectory -Recurse -Force
}
catch {
    Write-Error "Kanata could not be removed: $($_.Exception.Message)"
    exit 1
}

Write-Host 'Kanata was removed. The configuration and scripts were preserved.'
exit 0
