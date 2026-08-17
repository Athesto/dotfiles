[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$kanataProcesses = @(Get-Process -Name 'kanata' -ErrorAction SilentlyContinue)

if ($kanataProcesses.Count -eq 0) {
    Write-Host 'Kanata is not running.'
    exit 0
}

try {
    $kanataProcesses | Stop-Process -Force
    $kanataProcesses | Wait-Process -ErrorAction SilentlyContinue
}
catch {
    Write-Error "Kanata could not be stopped: $($_.Exception.Message)"
    exit 1
}

Write-Host 'Kanata stopped. The keyboard is using its normal Windows behavior.'
exit 0
