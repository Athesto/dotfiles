-- Directories ---------------------------------------------------------

do
    local state_directory = vim.fn.stdpath("state")

    -- Undo history ----------------------------------------------------
    local undo_directory = vim.fs.joinpath( state_directory, "undo")
    vim.fn.mkdir(undo_directory, "p")
    vim.opt.undodir = undo_directory
    vim.opt.undofile = true

    -- Backups ---------------------------------------------------------
    local backup_directory = vim.fs.joinpath( state_directory, "backup")
    vim.fn.mkdir(backup_directory, "p")
    vim.opt.backupdir = backup_directory .. "//"
    vim.opt.backup = true

end

-- Options -------------------------------------------------------------

vim.opt.termguicolors = true


-- Commands ------------------------------------------------------------

vim.api.nvim_create_user_command("NeovimConfig", function()
    local config_file = vim.fs.joinpath(
        vim.fn.stdpath("config"),
        "init.lua"
    )

    vim.cmd("tabnew " .. vim.fn.fnameescape(config_file))
end, {
    desc = "Open Neovim Configuration",
})


-- Keymaps -------------------------------------------------------------

vim.keymap.set(
    "n",
    "<leader>xe",
    "<cmd>NeovimConfig<cr>",
    {
        silent = true,
        desc = "Abrir configuración de Neovim",
    }
)
