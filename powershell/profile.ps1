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

function Get-CommandAliases {
    <#
    .SYNOPSIS
    Retrieves aliases related to a command or the command associated with an alias.

    .DESCRIPTION
    The function "Get-CommandAliases" is used to explore bidirectional relationships
    between aliases and commands. You can input an alias (e.g., 'ls') to retrieve the
    command it is associated with, or input a command (e.g., 'Get-ChildItem') to find its assigned aliases.

    .PARAMETER Name
    Specifies the alias or command to resolve its relationships.
    - If you input an alias, it will return the associated command.
    - If you input a command, it will return a list of assigned aliases.

    .EXAMPLE
    Get-CommandAliases -Name ls
    Returns the command 'Get-ChildItem' associated with the alias 'ls'.

    .EXAMPLE
    Get-CommandAliases -Name Get-ChildItem
    Returns a list of aliases assigned to the command 'Get-ChildItem'.

    .NOTES
    This function is useful for understanding how aliases are configured in your PowerShell environment.


    Author: Gustavo Mejía
    Created: 2025
    #>
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
        Source = $cmdObject.Source
    }
}

# Add git-bash programs to powershell
$gitBashPath="C:\Program Files\Git\usr\bin"
if (Test-Path $gitBashPath) {
    $env:PATH += ";$gitBashPath"
}
