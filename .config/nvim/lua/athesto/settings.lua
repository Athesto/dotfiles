

vim.cmd([[
    silent !mkdir -p $HOME/.nvim/undodir
    silent !mkdir -p $HOME/.nvim/backupdir
]])

local homedir = os.getenv("HOME")
vim.opt.undodir = string.format("%s/.nvim/undodir", homedir)
vim.opt.backupdir = string.format("%s/.nvim/backupdir", homedir)

vim.opt.termguicolors = true
