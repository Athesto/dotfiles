-- This file can be loaded by calling `lua require('plugins')` from your init.vim

-- Only required if you have packer configured as `opt`
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
    -- Packer can manage itself
    use 'wbthomason/packer.nvim'
    use { 'neoclide/coc.nvim', branch='release' }
    use {
        'nvim-treesitter/nvim-treesitter',
        run = function()
            local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
            ts_update()
        end,
    }
    use { 'nvim-lua/plenary.nvim' }  -- " don't forget to add this one if you don't have it yet!
    use { 'ThePrimeagen/harpoon' }
    use { 'diepm/vim-rest-console' }

    use { 'NvChad/nvim-colorizer.lua' }
end)

