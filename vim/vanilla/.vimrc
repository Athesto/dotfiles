function! Main()
    try
        call LoadPlugins()
    catch
        call VimPlugInstall()
    endtry
    call Settings()
endfunction

function! LoadPlugins()
    call plug#begin('~/.vim/plugged')
        Plug 'cocopon/iceberg.vim' |                    "iceberg theme
    call plug#end()
endfunction
    
function! Settings()
    syntax on                                         "Coloring syntax and highlighting
    set undodir=~/.vim/undodir                        "Undo directory for undo buffer
    set backupdir=~/.vim/backupdir                    "backupdir
    set backup
    set undofile                                      "save undo buffer in (undodir)ectory
    set t_ut=                                         "patch, fix render background when tmux has -256color
    set t_Co=256                                      "patch, set explicit 256 colors for term w/o -256color
    try
        colorscheme iceberg | set background=dark     "Iceberg dark
    catch
        colorscheme ron
    endtry
endfunction


function! VimPlugInstall()
    silent !mkdir -p $HOME/.vim/undodir
    silent !mkdir -p $HOME/.vim/backupdir

    if !executable('git')
        echohl WarningMsg | echomsg 'Warning: Vim-plug needs git to install the plugins' | echohl None
        return
    endif

    if !executable('curl')
        echohl WarningMsg | echomsg 'Warning: Vim-plug needs curl for the installation' | echohl None
        return
    endif

    if !exists('*plug#begin')
        silent !echo -e "\033[0m\033[31m\nOh no\!, Vim-plug manager is not found, Don't worry, I will install it\033[0m"
        !curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
        call Main()
        PlugInstall
        quit
    endif
endfunction

call Main()