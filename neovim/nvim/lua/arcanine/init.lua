-- Vim compatibility ---------------------------------------------------

do
    local vim_directory = vim.fn.expand("~/.vim")
    local vimrc = vim.fn.expand("~/.vimrc")

    vim.opt.runtimepath:prepend(vim_directory)
    vim.opt.runtimepath:append(
        vim.fs.joinpath(vim_directory, "after")
    )

    if vim.fn.filereadable(vimrc) == 1 then
        vim.cmd("source " .. vim.fn.fnameescape(vimrc))
    end
end

-- Neovim settings -----------------------------------------------------

require("arcanine.settings")

-- Neovim plugins ------------------------------------------------------

require("arcanine.lazy")
