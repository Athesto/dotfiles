
return {
    -- Codeium / Windsurf -----------------------------------------------------
    {
        "Exafunction/windsurf.nvim",
        description = "AI-powered code completion for Neovim",
        dependencies = {
            "nvim-lua/plenary.nvim",
            "hrsh7th/nvim-cmp",
        },
        cond = false,
        config = function()require("codeium").setup({
            enable_cmp_source = false,
            virtual_text = {
                enabled = true,
                key_bindings = {
                    accept = "<c-l>",
                    next = "<c-;>",
                    prev = "<c-,>",
                    dismiss = "<c-x>"
                }
            },
        }) end
    },
    -- END --------------------------------------------------------------------
}
