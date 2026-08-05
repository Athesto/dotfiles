-- This file can be loaded by calling `lua require('plugins')` from your init.vim

-- Only required if you have packer configured as `opt`
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
    -- Packer can manage itself
    use { 'wbthomason/packer.nvim' }

    use { 'Exafunction/codeium.vim' }
    use { 'NvChad/nvim-colorizer.lua' }
    use { 'akinsho/bufferline.nvim', tag = "*", requires = 'nvim-tree/nvim-web-devicons'}
    use { 'diepm/vim-rest-console' }
    use { 'edluffy/hologram.nvim' }
    use { 'karb94/neoscroll.nvim' };
    use { 'neoclide/coc.nvim', branch='release' }
    use { 'nvim-lua/plenary.nvim' }  -- " don't forget to add this one if you don't have it yet!

    use({
        "nvim-treesitter/nvim-treesitter",
        branch = "main",
        run = ":TSUpdate",
    })
    use {
        'ibhagwan/fzf-lua',
        -- optional for icon support
        requires = { 'nvim-tree/nvim-web-devicons' },
        opts = {},
    }



end)

