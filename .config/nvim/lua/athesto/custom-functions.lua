vim.api.nvim_create_user_command("NeovimConfig", function ()
    vim.cmd([[ tabnew | :cd ~/.config/nvim | e init.lua | :NERDTreeCWD | wincmd p ]]);
end, {})

local keyset = vim.keymap.set
-- GoTo code navigation
keyset("n", "<leader>xe", ":NeovimConfig<CR>", {silent = true})

--[[
function! NeovimTerminal(position)
    if a:position == 'right'
        execute ':vertical new'
    elseif a:position == 'below'
        execute ':rightbelow new'
    else
        echom 'Error'
        return 1
    endif

    execute 'terminal'
    execute ':set norelativenumber'
    execute ':set nonumber'
    execute 'normal A'
endfunction

function! NeovimSetup()
    " https://neovim.io/doc/user/nvim_terminal_emulator.html

    " NOTE to escape use <C-\><C-n>
    nnoremap <C-W>% <C-\><C-n>:call NeovimTerminal('right')<CR>
    nnoremap <C-W>" <C-\><C-n>:call NeovimTerminal('below')<CR>

    " mapping inside terminal [ terminal-mode ]
    tnoremap <C-W>% <C-\><C-n>:call NeovimTerminal('right')<CR>
    tnoremap <C-W>" <C-\><C-n>:call NeovimTerminal('below')<CR>
endfunction
--]]
