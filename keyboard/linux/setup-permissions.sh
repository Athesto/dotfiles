#!/usr/bin/env sh
set -eu

if ! getent group uinput >/dev/null 2>&1; then
    sudo groupadd --system uinput
fi

sudo usermod -aG input,uinput "$USER"
sudo modprobe uinput

printf '%s\n' \
    'KERNEL=="uinput", MODE="0660", GROUP="uinput", OPTIONS+="static_node=uinput"' |
    sudo tee /etc/udev/rules.d/99-athesto-kanata.rules >/dev/null

sudo udevadm control --reload-rules
sudo udevadm trigger

printf '\nPermissions configured. Log out and back in before starting Kanata.\n'
