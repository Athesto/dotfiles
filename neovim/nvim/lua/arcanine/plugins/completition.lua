return {
    {
        "hrsh7th/nvim-cmp",
        dependencies = {
            "hrsh7th/cmp-nvim-lsp",
        },
        description = "Completion engine for Neovim",
        config = function()
            local cmp = require("cmp")
            local cmp_lsp = require("cmp_nvim_lsp")

            vim.lsp.config("*", {
                capabilities = cmp_lsp.default_capabilities(),
            })

            cmp.setup({
                mapping = cmp.mapping.preset.insert({
                    ["<C-n>"] = cmp.mapping.select_next_item(),
                    ["<C-p>"] = cmp.mapping.select_prev_item(),
                    ["<C-y>"] = cmp.mapping.confirm({ select = true }),
                    ["<C-e>"] = cmp.mapping.abort(),
                }),

                formatting = {
                    -- fields = {"abbr"},
                },

                sources = {
                    { 
                        name = "nvim_lsp",
                        entry_filter = function(entry)
                            return not entry.completion_item.label:match("^__")
                        end,
                    }
                },
            })
        end,
    },
}
