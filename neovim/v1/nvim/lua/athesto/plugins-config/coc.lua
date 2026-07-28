local keyset = vim.keymap.set
-- GoTo code navigation
keyset("n", "gd", "<Plug>(coc-definition)", {silent = true})
keyset("n", "gy", "<Plug>(coc-type-definition)", {silent = true})
keyset("n", "gi", "<Plug>(coc-implementation)", {silent = true})
keyset("n", "gr", "<Plug>(coc-references)", {silent = true})
keyset("n", "<leader>rn", "<Plug>(coc-rename)", {silent = true}) -- rename multiple variables

keyset("i", "<c-space>", "coc#refresh()", {silent = true, expr=true}) -- open menu
keyset("i", "<tab>", [[coc#pum#visible() ? coc#pum#confirm() : "\<Tab>"]], {silent = true, expr=true}) -- if menu exist confirm otherwise tab

vim.api.nvim_create_user_command("Prettier", function ()
    vim.cmd([[:CocCommand prettier.forceFormatDocument]])
end, {})

-- Use K to show documentation in preview window
function _G.show_docs()
    local cw = vim.fn.expand('<cword>')
    if vim.fn.index({'vim', 'help'}, vim.bo.filetype) >= 0 then
        vim.api.nvim_command('h ' .. cw)
    elseif vim.api.nvim_eval('coc#rpc#ready()') then
        vim.fn.CocActionAsync('doHover')
    else
        vim.api.nvim_command('!' .. vim.o.keywordprg .. ' ' .. cw)
    end
end
keyset("n", "K", '<CMD>lua _G.show_docs()<CR>', {silent = true})

