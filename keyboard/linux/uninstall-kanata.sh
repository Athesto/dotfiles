#!/usr/bin/env sh
set -eu

binary_path=${HOME}/.local/bin/kanata
config_link=${HOME}/.config/kanata/vim-hybrid.kbd
service_link=${HOME}/.config/systemd/user/kanata.service

systemctl --user disable --now kanata.service 2>/dev/null || true

if [ -L "$config_link" ]; then rm -- "$config_link"; fi
if [ -L "$service_link" ]; then rm -- "$service_link"; fi
if [ -f "$binary_path" ]; then rm -- "$binary_path"; fi

systemctl --user daemon-reload
printf 'Kanata was removed. The repository configuration was preserved.\n'
