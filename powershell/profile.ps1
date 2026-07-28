Set-PSReadLineOption -EditMode Emacs
Set-PSReadLineKeyHandler -Chord ctrl+j -Function AcceptLine
Set-PSReadLineKeyHandler -Chord ctrl+i -Function TabCompleteNext

function prompt {
    $branch = ''
    if (Test-Path .git) {
        $branch = & git rev-parse --abbrev-ref HEAD 2>$null
        if ($branch) {
            # Add ANSI escape codes for green color
            $branch = "$([char]27)[32m($branch)$([char]27)[0m"
        }
    }

    # Verificar si hay un entorno activo
    $venv = ''
    if ($env:VIRTUAL_ENV) {
        # Extraer el nombre del entorno virtual
        $venv = "$([char]27)[32m(" + (Split-Path -Leaf $env:VIRTUAL_ENV) + ")$([char]27)[0m "
    }

    $usr = $env:USERNAME

    return "`r$([char]0x250C)$venv[$usr] $PWD $branch`n$([char]0x2514)> "
}

function ghb { gh browse }
function gst { git status }

function gitacp {
    $files = $args[0..($args.Count - 2)]
    $message = $args[-1]

    git add $files
    git commit -m $message
    git push
}

# Add git-bash programs to powershell
$gitBashPath=Get-Command git.exe -ErrorAction SilentlyContinue
if ($gitBashPath) {
    $gitBashBinPath=(($gitBashPath).Source | Split-Path) + "\..\usr\bin" 
    $env:PATH += ";$gitBashBinPath"
}
