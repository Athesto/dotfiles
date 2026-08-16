return {
    {
        "mason-org/mason.nvim",
        description = "Manage LSP servers, linters, formatters, and development tools",
        opts = {},
    },
    {
        "neovim/nvim-lspconfig",
        description = "LSP server configurations for Neovim",
        config = function()
            vim.lsp.enable("pyright")
        end,
    },
}
