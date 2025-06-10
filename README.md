## How to install
```bash
# linux
curl athesto.github.io/dotfiles/<directory>

# windows
iwr athesto.github.io/dotfiles/<directory> -OutFile <filename>
```

### How to install powershell profile
```ps1
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
mkdir $(Split-Path $PROFILE)
Invoke-WebRequest athesto.github.io/dotfiles/powershell/profile.ps1 -OutFile $PROFILE
```
