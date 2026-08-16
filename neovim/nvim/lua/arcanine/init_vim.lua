local M = {}

function M.setup()
    local vim_directory = vim.fn.expand("~/.vim")
    local vimrc = vim.fn.expand("~/.vimrc")

    local plugged_directory =
        vim.fs.joinpath(vim_directory, "plugged")

    local after_directory =
        vim.fs.joinpath(vim_directory, "after")

    -- Vim runtime ------------------------------------------------------

    vim.opt.runtimepath:prepend(vim_directory)
    vim.opt.runtimepath:append(after_directory)

    -- Vim configuration ------------------------------------------------

    if vim.fn.filereadable(vimrc) == 1 then
        vim.cmd(
            "source " .. vim.fn.fnameescape(vimrc)
        )
    end

    -- Active vim-plug paths --------------------------------------------

    local runtime_paths = {
        vim_directory,
        after_directory,
    }

    for _, path in ipairs(vim.opt.runtimepath:get()) do
        local is_active_vim_plugin =
            vim.startswith(path, plugged_directory .. "/")

        if is_active_vim_plugin then
            table.insert(runtime_paths, path)
        end
    end

    return runtime_paths
end

return M
