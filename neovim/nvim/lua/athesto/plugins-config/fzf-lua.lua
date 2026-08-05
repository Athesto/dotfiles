local fzf = require("fzf-lua")

local preview_script = vim.fn.expand("~/.local/bin/fzf-preview")

local image_previewer = {
  preview_script,
  "{file}",
}

fzf.setup({
  winopts = {
    height = 0.85,
    width = 0.90,

    preview = {
      layout = "flex",

      -- En ventanas anchas, preview a la derecha.
      horizontal = "right:40%",

      -- En ventanas estrechas, preview abajo.
      vertical = "down:35%",

      -- Cambiar a layout vertical por debajo de 110 columnas.
      flip_columns = 110,

      border = "rounded",
      wrap = false,
      hidden = false,
    },
  },

  previewers = {
    builtin = {
      extensions = {
        png = image_previewer,
        jpg = image_previewer,
        jpeg = image_previewer,
        gif = image_previewer,
        webp = image_previewer,
        bmp = image_previewer,
      },
    },
  },
})

vim.keymap.set("n", "<leader>ff", fzf.files, { silent = true, desc = "Buscar archivos", })
vim.keymap.set("n", "<leader>fb", fzf.buffers, { silent = true, desc = "Buscar buffers", })
