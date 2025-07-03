function! Main()
    try
        call LoadPlugins()
    catch
        call VimPlugInstall()
    endtry
    call Settings()
    call Commands()
    call Mappings()
    call SettingFiletypes()

endfunction

function! LoadPlugins()
    call plug#begin('~/.vim/plugged')
        Plug 'cocopon/iceberg.vim' |                    "iceberg theme
        Plug 'preservim/nerdtree'|                      "File Explorer NERDTree
    call plug#end()
endfunction
    
function! Settings()
    syntax on                                         "Coloring syntax and highlighting
    set backup
    set backupdir=~/.vim/backupdir                    "backupdir
    set directory=~/.vim/swapfiles//                  "swap directory
    set foldlevelstart=99                             "Folds search about :help usr_28
    set laststatus=2                                  "show file name and save status
    set mouse=a                                       "using mouse, perfect for mobile version
    set number                                        "show line number
    set t_Co=256                                      "patch, set explicit 256 colors for term w/o -256color
    set t_ut=                                         "patch, fix render background when tmux has -256color
    set t_vb=""                                       "no visual bell (flash) in windows
    set undodir=~/.vim/undodir                        "Undo directory for undo buffer
    set undofile                                      "save undo buffer in (undodir)ectory
    try
        colorscheme iceberg | set background=dark     "Iceberg dark
    catch
        colorscheme ron
    endtry
endfunction

function! Mappings()
    let g:mapleader=' '
    inoremap <C-c> <esc>|                               " i_C-c           -> insert MODE mapping Ctrl-c as ESC, VisualBlock problem
    nnoremap <C-H> <C-W><C-H>|                          " n_C-H           -> change windows (left)
    nnoremap <C-J> <C-W><C-J>|                          " n_C-J           -> change windows (down)
    nnoremap <C-K> <C-W><C-K>|                          " n_C-K           -> change windows (up)
    nnoremap <C-L> <C-W><C-L>|                          " n_C-L           -> change windows (right)
    nnoremap <leader>w :w<CR>|                          " n_<leader>w     -> save
    nnoremap <leader>q :q<CR>|                          " n_<leader>q     -> quit
    nnoremap <leader>a ggVG|                            " n_<leader>U     -> select all document
    nnoremap <leader>e :NERDTreeToggle<CR>|             " n_<leader>e     -> toggle FileExplorer (NERDTree)
    nnoremap <leader><leader>w :call WriteForced()<CR>| " n_<leader><leader>w -> sudo save
endfunction

function! Commands()
    command VimConfig call VimConfig()
endfunction

function! SettingFiletypes()
    augroup Filetypes
        autocmd!
        autocmd Filetype html,css,json,yaml,zsh,javascript,markdown
                    \ set expandtab sw=2 ts=2 sts=2 fdm=indent
        autocmd Filetype ps1,sh,lua,sshconfig,bash,ruby,vim,htmldjango,xml
                    \ set expandtab sw=4 ts=4 sts=4 fdm=indent
        autocmd Filetype python                 set expandtab sw=4 ts=4 sts=4 fdm=indent
    augroup END
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"--------------------------------------------------------MY FUNCTIONS--------------------------------------------------------"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

function! WriteForced()
    execute ':silent w !sudo tee % > /dev/null'
    edit!
endfunction

function! VimConfig()
    execute 'tabnew | :e ~/.vimrc'
    execute 'echom ".vimrc"'
endfunction

function! TmuxCopySelection()
    if !executable('tmux-copy-selection')
        echom 'not found'
        return
    endif
    execute ':normal! gv"yy'
    call system('tmux-copy-selection', getreg('y'))
endfunction

function! VimPlugInstall()
    silent !mkdir -p $HOME/.vim/undodir
    silent !mkdir -p $HOME/.vim/backupdir
    silent !mkdir -p $HOME/.vim/swapfiles

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

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"--------------------------------------------------------MY Commands  -------------------------------------------------------"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

command VimConfig call VimConfig()
command -range TmuxCopySelection call TmuxCopySelection()

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"--------------------------------------------------------ENTRY POINT  -------------------------------------------------------"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

call Main()