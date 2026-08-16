return {
    {
        "nvim-treesitter/nvim-treesitter",
        description = "Syntax parsing, highlighting, and code-aware features for Neovim",

        branch = "main",
        lazy = false,
        build = ":TSUpdate",

        config = function()
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

                callback = function(arguments)
                    vim.treesitter.start(arguments.buf)
                end,
            })
        end,
    },
}
