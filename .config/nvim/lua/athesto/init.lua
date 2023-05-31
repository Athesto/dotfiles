-- vim compatibility
require('athesto.loadvimrc');                       -- load the ~/.vimrc file
require('athesto.settings');                        -- load the Athesto settings

-- Plugins
require('athesto.packer');                          -- load packer
require('athesto.plugins-config.coc');
require('athesto.plugins-config.vim-treesitter');
require('athesto.plugins-config.harpoon');
require('athesto.plugins-config.rest-console');
require('athesto.plugins-config.nvim-colorizer');

-- Extra
require('athesto.custom-functions');


-- Tutorials
-- https://github.com/nanotee/nvim-lua-guide
-- https://github.com/ThePrimeagen/init.lua
