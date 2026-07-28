vim.cmd([[
    silent !mkdir -p $HOME/.nvim/undodir
    silent !mkdir -p $HOME/.nvim/backupdir
]])

local homedir = os.getenv("HOME")
vim.opt.undodir = string.format("%s/.nvim/undodir", homedir)
vim.opt.backupdir = string.format("%s/.nvim/backupdir", homedir)

vim.opt.termguicolors = true

-- Functions ----------------------------------------------------
vim.api.nvim_create_user_command("NeovimConfig", function ()
    vim.cmd([[ tabnew | :cd ~/.config/nvim | e init.lua | :NERDTreeCWD | wincmd p ]]);
end, {})


-- Remaps -------------------------------------------------------
local keyset = vim.keymap.set
keyset("n", "<leader>xe", ":NeovimConfig<CR>", {silent = true})
