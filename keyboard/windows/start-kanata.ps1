[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$kanataExecutable = Join-Path $PSScriptRoot 'runtime\kanata.exe'
$kanataConfiguration = Join-Path $PSScriptRoot 'vim-hybrid.kbd'
$kanataLog = Join-Path $PSScriptRoot 'runtime\kanata.log'

if (-not (Test-Path -LiteralPath $kanataExecutable -PathType Leaf)) {
    Write-Error 'Kanata is not installed. Run install-kanata.ps1 first.'
    exit 1
}

if (-not (Test-Path -LiteralPath $kanataConfiguration -PathType Leaf)) {
    Write-Error "Kanata configuration not found: $kanataConfiguration"
    exit 1
}

$runningKanata = Get-Process -Name 'kanata' -ErrorAction SilentlyContinue
if ($runningKanata) {
    Write-Host 'Kanata is already running.'
    exit 0
}

$separator = [Environment]::NewLine + ('=' * 72)
$startedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

Write-Host "Starting Kanata with $kanataConfiguration"
Write-Host "Log: $kanataLog"
Write-Host 'Press Ctrl+C to stop Kanata.'

Add-Content -LiteralPath $kanataLog -Value "$separator`nKanata started at $startedAt"

Push-Location -LiteralPath $PSScriptRoot
try {
    & $kanataExecutable --cfg $kanataConfiguration 2>&1 |
        Tee-Object -FilePath $kanataLog -Append
    $kanataExitCode = $LASTEXITCODE
}
finally {
    Pop-Location
}

if ($kanataExitCode -ne 0) {
    Write-Error "Kanata stopped with exit code $kanataExitCode. See $kanataLog"
    exit $kanataExitCode
}

Write-Host 'Kanata stopped.'
exit 0
