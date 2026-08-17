#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
install_dir=${HOME}/.local/bin
config_dir=${HOME}/.config/kanata
service_dir=${HOME}/.config/systemd/user
temporary_dir=$(mktemp -d "${TMPDIR:-/tmp}/athesto-kanata.XXXXXX")

cleanup() { rm -rf -- "$temporary_dir"; }
trap cleanup EXIT
trap 'exit 1' HUP INT TERM

case $(uname -m) in
    x86_64|amd64) asset_name=linux-binaries-x64.zip ;;
    *)
        printf 'Unsupported architecture: %s\n' "$(uname -m)" >&2
        printf 'The official Kanata Linux bundle used here is x86-64 only.\n' >&2
        exit 1
        ;;
esac

for command_name in curl unzip find install systemctl; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        printf 'Required command not found: %s\n' "$command_name" >&2
        exit 1
    fi
done

download_url="https://github.com/jtroo/kanata/releases/latest/download/${asset_name}"
archive_path=${temporary_dir}/kanata.zip

printf 'Downloading %s...\n' "$asset_name"
curl --fail --location "$download_url" --output "$archive_path"
unzip -q "$archive_path" -d "$temporary_dir"

kanata_source=$(find "$temporary_dir" -type f \
    -iname '*kanata*' ! -iname '*cmd_allowed*' ! -name '*.zip' \
    -print -quit)

if [ -z "$kanata_source" ]; then
    printf 'No standard Kanata executable was found in the release.\n' >&2
    exit 1
fi

install -d "$install_dir" "$config_dir" "$service_dir"
install -m 0755 "$kanata_source" "$install_dir/kanata"
ln -sfn "$script_dir/vim-hybrid.kbd" "$config_dir/vim-hybrid.kbd"
ln -sfn "$script_dir/systemd/kanata.service" "$service_dir/kanata.service"
systemctl --user daemon-reload

printf '\nKanata installed at %s\n' "$install_dir/kanata"
printf 'Configuration linked at %s\n' "$config_dir/vim-hybrid.kbd"
printf 'Service linked at %s\n' "$service_dir/kanata.service"
printf '\nSet up input/uinput permissions before starting the service.\n'
printf 'Then run: systemctl --user enable --now kanata.service\n'
