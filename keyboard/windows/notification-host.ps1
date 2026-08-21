[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$notificationState = Join-Path $PSScriptRoot 'runtime\layer-notification.txt'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Main {
    $popup = New-Object System.Windows.Forms.Form
    $popupLabel = New-Object System.Windows.Forms.Label
    $lastWriteTime = [datetime]::MinValue
    $hidePopupAt = [datetime]::MinValue

    try {
        Initialize-KanataPopup -Popup $popup -Label $popupLabel

        while ($true) {
            if ($popup.Visible -and [datetime]::UtcNow -ge $hidePopupAt) {
                $popup.Hide()
            }

            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 25

            if (-not (Test-Path -LiteralPath $notificationState -PathType Leaf)) {
                continue
            }

            $stateFile = Get-Item -LiteralPath $notificationState
            if ($stateFile.LastWriteTimeUtc -le $lastWriteTime) {
                continue
            }

            $lastWriteTime = $stateFile.LastWriteTimeUtc
            $layer = (Get-Content -LiteralPath $notificationState -Raw).Trim()
            if ($layer -notin @('qwerty', 'colemak')) {
                continue
            }

            $hidePopupAt = Show-KanataLayerPopup `
                -Layer $layer `
                -Popup $popup `
                -Label $popupLabel `
                -DurationMilliseconds 2000
        }
    } 
    catch [System.Management.Automation.PipelineStoppedException] {
        # Cierre mediante Ctrl+C
    }
    catch {
        Write-Warning "Notification host stopped: $($_.Exception.Message)"
    }
    finally {
        $popup.Close()
        $popup.Dispose()
    }
}

function Initialize-KanataPopup {
    param(
        [Parameter(Mandatory)] [object] $Popup,
        [Parameter(Mandatory)] [object] $Label
    )

    $Popup.FormBorderStyle = 'None'
    $Popup.ShowInTaskbar = $false
    $Popup.StartPosition = 'Manual'
    $Popup.TopMost = $true
    $Popup.Size = New-Object System.Drawing.Size(220, 58)
    $Popup.BackColor = [System.Drawing.Color]::FromArgb(32, 32, 32)

    $Label.Dock = 'Fill'
    $Label.ForeColor = [System.Drawing.Color]::White
    $Label.Font = New-Object System.Drawing.Font('Segoe UI', 12)
    $Label.TextAlign = 'MiddleCenter'
    $Popup.Controls.Add($Label)

    $workingArea = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
    $Popup.Location = New-Object System.Drawing.Point(
        ($workingArea.Right - $Popup.Width - 16),
        ($workingArea.Bottom - $Popup.Height - 16)
    )
}

function Show-KanataLayerPopup {
    param(
        [Parameter(Mandatory)]
        [ValidateSet('qwerty', 'colemak')]
        [string] $Layer,

        [Parameter(Mandatory)] [object] $Popup,
        [Parameter(Mandatory)] [object] $Label,
        [int] $DurationMilliseconds = 400
    )

    $layerName = if ($Layer -eq 'colemak') { 'Colemak-DH' } else { 'QWERTY' }
    $Label.Text = "Kanata  -  $layerName"
    $Popup.Show()
    $Popup.BringToFront()

    return [datetime]::UtcNow.AddMilliseconds($DurationMilliseconds)
}

Main
