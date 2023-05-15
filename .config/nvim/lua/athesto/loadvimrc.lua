vim.cmd([[
    " File: init.vim
    " If you want to use the init.vim just copy this content in the init.vim and remove the init.lua
    set runtimepath^=~/.vim runtimepath+=~/.vim/after
    let &packpath = &runtimepath
    source ~/.vimrc
]]);
