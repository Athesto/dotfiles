
-- Load vimrc file -------------------------------------------------------------

-- If you want to use the init.vim just copy this content in the init.vim and remove the init.lua
vim.cmd([[
    set runtimepath^=~/.vim runtimepath+=~/.vim/after
    let &packpath = &runtimepath
    source ~/.vimrc
]]);
