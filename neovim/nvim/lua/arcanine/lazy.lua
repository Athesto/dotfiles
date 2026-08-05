-- lazy.nvim installation ----------------------------------------------

local lazy_directory = vim.fs.joinpath(
    vim.fn.stdpath("data"),
    "lazy",
    "lazy.nvim"
)

local lazy_repository = "https://github.com/folke/lazy.nvim.git"

if not vim.uv.fs_stat(lazy_directory) then
    local output = vim.fn.system({
        "git",
        "clone",
        "--filter=blob:none",
        "--branch=stable",
        lazy_repository,
        lazy_directory,
    })

    if vim.v.shell_error ~= 0 then
        error(
            "Could not install lazy.nvim:\n" .. output
        )
    end
end

vim.opt.runtimepath:prepend(lazy_directory)

-- Plugin manager ------------------------------------------------------

require("lazy").setup({
    spec = {
        {
            import = "arcanine.plugins",
        },
    },

    install = {
        colorscheme = {
            "habamax",
        },
    },

    checker = {
        enabled = true,
        notify = false,
    },

    change_detection = {
        notify = false,
    },
})
