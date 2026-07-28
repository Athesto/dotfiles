local keyset = vim.keymap.set
-- GoTo code navigation
keyset("n", "<leader>mm", [[:lua require("harpoon.ui").toggle_quick_menu()<CR>]], {silent = true})
keyset("n", "<leader>ma", [[:lua require("harpoon.mark").add_file()<CR>]], {silent = true})
