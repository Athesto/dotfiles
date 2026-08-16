-- Vim compatibility ---------------------------------------------------

local vim_runtime_paths = require("arcanine.init_vim").setup()

-- Neovim settings -----------------------------------------------------

require("arcanine.settings")

-- Neovim plugins ------------------------------------------------------

require("arcanine.lazy").setup(vim_runtime_paths)
