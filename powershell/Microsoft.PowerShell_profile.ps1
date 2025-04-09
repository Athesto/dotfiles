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


    "`r┏$venv$PWD $branch`n┗> "
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

<#
.SYNOPSYS
    Get all relations between a command and its aliases
.Example
    Get-CommandAliases ls
    gca Get-ChildItem
#>
function Get-CommandAliases {
    [Alias("gca")]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Name
    )

    # Intentamos obtener el alias proporcionado
    $aliasObject = Get-Alias -Name $Name -ErrorAction SilentlyContinue
    if ($aliasObject) {
        # Si el nombre proporcionado es un alias, obtenemos su comando asociado
        $cmdletName = $aliasObject.Definition
        
        # Buscamos TODOS los alias asociados a ese cmdlet
        $relatedAliases = Get-Alias -Definition $cmdletName
        
        # Formateamos la salida como tabla
        [PSCustomObject]@{
            Command = $cmdletName
            Aliases = ($relatedAliases.Name -join ', ')
        } | Format-Table -AutoSize
        return
    }

    # Si no es un alias, verificamos si es un cmdlet
    $relatedAliases = Get-Alias -Definition $Name -ErrorAction SilentlyContinue
    if ($relatedAliases) {
        # Si encontramos aliases relacionados con el cmdlet
        [PSCustomObject]@{
            Command = $Name
            Aliases = ($relatedAliases.Name -join ', ')
        } | Format-Table -AutoSize
        return
    }

    # Si no se encuentra ni como alias ni como cmdlet
    Write-Host "No se encontró ningún alias o cmdlet relacionado con '$Name'."
}

# Add git-bash programs to powershell
$gitBashPath="C:\Program Files\Git\usr\bin"
if (Test-Path $gitBashPath) {
    $env:PATH += ";$gitBashPath"
}
