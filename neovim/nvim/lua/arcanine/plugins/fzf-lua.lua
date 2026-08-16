local function command_palette()
    local fzf = require("fzf-lua")

    local entries = {}
    local actions = {}

    local function add_entry(text, action)
        local id = #actions + 1

        actions[id] = action

        table.insert(
            entries,
            id .. "\t" .. text
        )
    end

    -- Commands ---------------------------------------------------------

    local commands = vim.fn.getcompletion("", "command")

    for _, command in ipairs(commands) do
        add_entry(
            "C: " .. command,
            function()
                local keys = vim.api.nvim_replace_termcodes(
                    ":" .. command .. " ",
                    true,
                    false,
                    true
                )

                vim.api.nvim_feedkeys(
                    keys,
                    "n",
                    false
                )
            end
        )
    end

    -- Normal-mode keymaps ---------------------------------------------

    local keymaps = vim.api.nvim_get_keymap("n")

    vim.list_extend(
        keymaps,
        vim.api.nvim_buf_get_keymap(0, "n")
    )

    for _, keymap in ipairs(keymaps) do
        if not vim.startswith(keymap.lhs, "<Plug>") then
            local description = keymap.desc or keymap.rhs or ""

            description = description
                :gsub("[\r\n\t]", " ")
                :gsub("%s+", " ")

            add_entry(
                string.format(
                    "K: %-18s %s",
                    keymap.lhs,
                    description
                ),
                function()
                    local keys =
                        vim.api.nvim_replace_termcodes(
                            keymap.lhs,
                            true,
                            false,
                            true
                        )

                    vim.api.nvim_feedkeys(
                        keys,
                        "m",
                        false
                    )
                end
            )
        end
    end

    -- Picker -----------------------------------------------------------

    fzf.fzf_exec(entries, {
    profile = "border-fused",

    prompt = "Actions❯ ",

    keymap = {
        fzf = {
            ["tab"] = "replace-query",
            ["enter"] = "accept-or-print-query",
        },
    },

    fzf_opts = {
    ["--delimiter"] = "\t",
    ["--with-nth"] = "2..",
    ["--header"] = "C: commands │ K: keymaps",
    },
    actions = {
        ["default"] = function(selected)
            if not selected or not selected[1] then
                return
            end

            local value = selected[1]
            local id = tonumber(value:match("^(%d+)\t"))

            if id then
                local action = actions[id]

                if action then
                    vim.schedule(action)
                end

                return
            end

            local command = value:gsub("^C:%s*", "")

            vim.schedule(function()
                vim.cmd(command)
            end)
        end,
    },
})

end

local function snippets()
    vim.fn["UltiSnips#SnippetsInCurrentScope"](1)

    local snippets = vim.g.current_ulti_dict_info or {}
    local entries = {}

    for trigger, info in pairs(snippets) do
        table.insert(entries, trigger .. "\t" .. (info.description or ""))
    end

    table.sort(entries)

    require("fzf-lua").fzf_exec(entries, {
        prompt = "Snippets> ",
        actions = {
            ["default"] = function(selected)
                local trigger = selected[1]:match("^[^\t]+")

                vim.api.nvim_put({ trigger }, "c", true, true)
                vim.fn["UltiSnips#ExpandSnippet"]()
            end,
        },
    })
end


return {
    {
        "folke/snacks.nvim",
        priority = 1000,
        lazy = false,

        opts = {
            image = {
                enabled = true,
            },
        },
    },

    {
        "ibhagwan/fzf-lua",

        dependencies = {
            "nvim-tree/nvim-web-devicons",
            "folke/snacks.nvim",
        },

        keys = {
            {
                "<leader>ff",
                function()
                    require("fzf-lua").files()
                end,
                desc = "Search Commands",
            },
            {
                "<leader>fk",
                function()
                    require("fzf-lua").keymaps()
                end,
                desc = "Search Keymaps",
            },
            {
                "<leader>f<space>",
                command_palette,
                desc = "Buscar buffers",
            },
            {
                "<leader>fs",
                snippets,
                desc = "Buscar buffers",
            },
            {
                "<leader>fb",
                function()
                    require("fzf-lua").buffers()
                end,
                desc = "Buscar buffers",
            },
        },

        opts = {
            winopts = {
                height = 0.85,
                width = 0.90,

                preview = {
                    layout = "flex",
                    horizontal = "right:40%",
                    vertical = "down:35%",
                    flip_columns = 110,
                    border = "rounded",
                    wrap = false,
                    hidden = false,
                },
            },
        },
    },
}
