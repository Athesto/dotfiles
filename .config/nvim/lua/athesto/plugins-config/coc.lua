local keyset = vim.keymap.set
-- GoTo code navigation
keyset("n", "gd", "<Plug>(coc-definition)", {silent = true})
keyset("n", "gy", "<Plug>(coc-type-definition)", {silent = true})
keyset("n", "gi", "<Plug>(coc-implementation)", {silent = true})
keyset("n", "gr", "<Plug>(coc-references)", {silent = true})
keyset("n", "<leader>rn", "<Plug>(coc-rename)", {silent = true})

keyset("i", "<c-space>", "coc#refresh()", {silent = true, expr=true}) -- open menu
keyset("i", "<tab>", [[coc#pum#visible() ? coc#pum#confirm() : "\<Tab>"]], {silent = true, expr=true}) -- if menu exist confirm otherwise tab

vim.api.nvim_create_user_command("Prettier", function ()
    vim.cmd([[:CocCommand prettier.forceFormatDocument]])
end, {})

