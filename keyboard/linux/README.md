# Kanata en Linux

Esta carpeta implementa Athesto Keyboard en Linux con Kanata y un servicio de
usuario de systemd. El mapa conserva las posiciones físicas y el comportamiento
de la versión de Windows: Vim Hybrid, QWERTY/Colemak-DH, teclas de función y
caracteres en español.

## Archivos

```text
vim-hybrid.kbd         configuración de Kanata para Linux
install-kanata.sh      instala el binario y crea enlaces de configuración
setup-permissions.sh   configura input, uinput y la regla de udev
uninstall-kanata.sh    elimina la instalación local, no el repositorio
systemd/kanata.service servicio de usuario con reinicio automático
```

## Distribución del sistema

Configura el sistema en **English (US)**. Kanata genera directamente `á`, `é`,
`í`, `ó`, `ú`, `ü`, `ñ`, `¿` y `¡`; no hace falta US International.

La acción Unicode de Linux usa el mecanismo `Ctrl+Shift+U` del escritorio. Puede
no funcionar en consolas virtuales o aplicaciones que no implementen entrada
Unicode de Linux.

## Instalación

Los scripts requieren `curl`, `unzip`, `find`, `systemctl` y una distribución con
systemd. La descarga oficial automatizada está configurada para x86-64.

```bash
chmod +x install-kanata.sh setup-permissions.sh uninstall-kanata.sh
./install-kanata.sh
./setup-permissions.sh
```

`setup-permissions.sh` solicita privilegios administrativos para crear el grupo
`uinput` cuando haga falta, agregar el usuario a `input` y `uinput`, cargar el
módulo e instalar `/etc/udev/rules.d/99-athesto-kanata.rules`.

Después debes **cerrar sesión y volver a entrar** para activar los grupos.

## Servicio systemd

```bash
systemctl --user enable --now kanata.service
systemctl --user status kanata.service
systemctl --user restart kanata.service
systemctl --user stop kanata.service
```

El servicio ejecuta Kanata en primer plano con `--no-wait`. systemd puede
detectar fallos y reiniciarlo después de tres segundos.

## Logs

systemd captura `stdout` y `stderr`; no se mantiene un archivo sin límite.

```bash
journalctl --user -u kanata.service -f
journalctl --user -u kanata.service -n 100 --no-pager
```

El journal aplica las políticas de tamaño y rotación configuradas por el sistema.

## Configuración y actualización

El instalador crea enlaces simbólicos desde `~/.config` hacia esta carpeta. Los
cambios en `vim-hybrid.kbd` se aplican con:

```bash
systemctl --user restart kanata.service
```

Para actualizar Kanata vuelve a ejecutar el instalador y reinicia el servicio.

## Desinstalación

```bash
./uninstall-kanata.sh
```

Esto desactiva el servicio y elimina el binario y los enlaces administrados. No
elimina la configuración del repositorio, los grupos ni la regla de udev.
