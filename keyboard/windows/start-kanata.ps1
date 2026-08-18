[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$kanataExecutable = Join-Path $PSScriptRoot 'runtime\kanata.exe'
$kanataConfiguration = Join-Path $PSScriptRoot 'vim-hybrid.kbd'
$kanataLog = Join-Path $PSScriptRoot 'runtime\kanata.log'
$notificationHostScript = Join-Path $PSScriptRoot 'notification-host.ps1'
$notificationState = Join-Path $PSScriptRoot 'runtime\layer-notification.txt'

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

Remove-Item -LiteralPath $notificationState -Force -ErrorAction SilentlyContinue

$notificationHost = Start-Process -FilePath 'powershell.exe' -ArgumentList @(
    '-NoProfile'
    '-NonInteractive'
    '-WindowStyle', 'Hidden'
    '-ExecutionPolicy', 'Bypass'
    '-File', $notificationHostScript
) -WindowStyle Hidden -PassThru

Push-Location -LiteralPath $PSScriptRoot
try {
    $winIoChannelDisconnected = $false

    & $kanataExecutable --cfg $kanataConfiguration 2>&1 | ForEach-Object {
        $line = $_.ToString()
        Add-Content -LiteralPath $kanataLog -Value $line

        if ($line -match 'channel disconnected') {
            $winIoChannelDisconnected = $true
        }

        $knownWinIoShutdownLine =
            $line -like "thread '<unnamed>'*panicked at src\kanata\windows\llhook.rs:459:21:" -or
            $line -eq 'channel disconnected' -or
            $line -match '^note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace$'

        if (-not $knownWinIoShutdownLine) {
            Write-Host $line
        }
    }
    $kanataExitCode = $LASTEXITCODE
}
finally {
    Pop-Location
    if ($notificationHost -and -not $notificationHost.HasExited) {
        Stop-Process -Id $notificationHost.Id -Force -ErrorAction SilentlyContinue
    }
}

$expectedWinIoShutdown =
    $kanataExitCode -eq -1073740791 -and
    $winIoChannelDisconnected

if ($expectedWinIoShutdown) {
    Write-Host 'Kanata stopped.'
    exit 0
}

if ($kanataExitCode -ne 0) {
    Write-Error "Kanata stopped with exit code $kanataExitCode. See $kanataLog"
    exit $kanataExitCode
}

Write-Host 'Kanata stopped.'
exit 0
