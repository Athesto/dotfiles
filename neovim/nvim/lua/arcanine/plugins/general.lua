return {
    {
        "Exafunction/windsurf.nvim",
        description = "AI-powered code completion for Neovim",
        dependencies = {
            "nvim-lua/plenary.nvim",
            "hrsh7th/nvim-cmp",
        },
        config = function()
            require("codeium").setup({
                enable_cmp_source = true,
                virtual_text = {
                    enabled = true
                }

            })
        end
    },
}
