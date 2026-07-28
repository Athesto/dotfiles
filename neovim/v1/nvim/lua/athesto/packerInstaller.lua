local function packerInstaller()
    print("welcome to the installer");
    if (vim.fn.executable('git') == 0) then
        error("I couldn't found git command");
    end
    if (vim.fn.executable('curl') == 0) then
        error("I couldn't found curl command");
    end

    local packerPath = "~/.local/share/nvim/site/pack/packer/start/packer.nvim"

    local cmd = string.format([[
        export PACKER_PATH="%s";
        git clone --depth 1 https://github.com/wbthomason/packer.nvim "$PACKER_PATH"
    ]], packerPath)

    io.popen(cmd);
end

packerInstaller()
