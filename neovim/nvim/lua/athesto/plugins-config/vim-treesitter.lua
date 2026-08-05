require("nvim-treesitter").setup()

require("nvim-treesitter").install({
    "c",
    "css",
    "html",
    "javascript",
    "lua",
    "markdown",
    "markdown_inline",
    "python",
    "tsx",
    "typescript",
})

vim.api.nvim_create_autocmd("FileType", {
    pattern = {
        "c",
        "css",
        "html",
        "javascript",
        "lua",
        "markdown",
        "python",
        "typescript",
        "typescriptreact",
    },
    callback = function(args)
        vim.treesitter.start(args.buf)
    end,
})
