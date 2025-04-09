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
    $cmdObject = get-command -Name $Name -ErrorAction Stop

    if (($cmdObject).CommandType -eq 'Alias') {
        $cmdObject = get-command -Name $cmdObject.Definition
    }
    
    $aliases = (get-alias -Definition $cmdObject.Name -ErrorAction SilentlyContinue).Name -join ',' 

    #Enriquecer el objeto original agregando la propiedad "Aliases"
    return [PSCustomObject]@{
        CommandType = $cmdObject.CommandType
        Name = $cmdObject.Name
        Aliases = $aliases
        #Version = $cmdObject.Version
        #Source = $cmdObject.Source
    }
}

# Add git-bash programs to powershell
$gitBashPath="C:\Program Files\Git\usr\bin"
if (Test-Path $gitBashPath) {
    $env:PATH += ";$gitBashPath"
}
