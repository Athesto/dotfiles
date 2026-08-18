[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$runtimeDirectory = Join-Path $PSScriptRoot 'runtime'
$kanataExecutable = Join-Path $runtimeDirectory 'kanata.exe'
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) 'athesto-kanata-install'
$archivePath = Join-Path $temporaryDirectory 'kanata.zip'

$assetName = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') {
    'windows-binaries-arm64.zip'
}
else {
    'windows-binaries-x64.zip'
}

$downloadUrl = "https://github.com/jtroo/kanata/releases/latest/download/$assetName"

if (Get-Process -Name 'kanata' -ErrorAction SilentlyContinue) {
    Write-Error 'Kanata is running. Run stop-kanata.ps1 before installing or updating it.'
    exit 1
}

Write-Host "Downloading the official Kanata release: $assetName"

try {
    if (Test-Path -LiteralPath $temporaryDirectory) {
        Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force
    }

    New-Item -ItemType Directory -Path $temporaryDirectory | Out-Null
    Invoke-WebRequest -Uri $downloadUrl -OutFile $archivePath -UseBasicParsing
    Expand-Archive -LiteralPath $archivePath -DestinationPath $temporaryDirectory -Force

    $winIoExecutables = @(
        Get-ChildItem -LiteralPath $temporaryDirectory -Recurse -File -Filter '*.exe' |
            Where-Object {
                $_.Name -like '*winIOv2*' -and
                $_.Name -like '*cmd_allowed*'
            }
    )

    $kanataSource = $winIoExecutables |
        Where-Object { $_.Name -like '*gui*' } |
        Select-Object -First 1

    if (-not $kanataSource) {
        $kanataSource = $winIoExecutables | Select-Object -First 1
    }

    if (-not $kanataSource) {
        throw 'No Kanata winIOv2 cmd_allowed executable was found in the release.'
    }

    Write-Host "Selected Kanata variant: $($kanataSource.Name)"

    New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
    Copy-Item -LiteralPath $kanataSource.FullName -Destination $kanataExecutable -Force
}
catch {
    Write-Error "Kanata installation failed: $($_.Exception.Message)"
    exit 1
}
finally {
    if (Test-Path -LiteralPath $temporaryDirectory) {
        Remove-Item -LiteralPath $temporaryDirectory -Recurse -Force
    }
}

Write-Host "Kanata was installed at: $kanataExecutable"
Write-Host 'Run start-kanata.ps1 to enable the keyboard remaps.'
exit 0
