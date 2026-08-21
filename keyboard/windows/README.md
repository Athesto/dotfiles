# Kanata en Windows

Esta carpeta contiene la configuración de Kanata para Windows y scripts de
PowerShell para instalar, iniciar, detener y desinstalar el runtime.

Versión de la distribución: `2026.08.20.11`.

La capa utiliza un único perfil **Vim Classic**:

```text
Caps, Caps       → Escape
Caps sostenido   → Vim Hybrid
Caps+H/J/K/L     → ←/↓/↑/→
Caps+M           → Enter
Caps+;           → Backspace
Caps+, / Caps+.  → Scroll arriba / abajo
Caps+S           → Recorte al portapapeles
```

El perfil alternativo `Semicolon Enter` de macOS no está incluido en Windows.

Windows debe usar la distribución de teclado **English (United States)**. Los
caracteres en español se generan desde `vim-hybrid.kbd`, no mediante las dead
keys de US International.

## Scripts

```text
install-kanata.ps1   descarga la variante oficial WinIOv2 GUI
start-kanata.ps1     inicia Kanata y escribe runtime/kanata.log
stop-kanata.ps1      detiene todas las instancias de Kanata
uninstall-kanata.ps1 detiene Kanata y elimina solamente runtime/
```

Ejecución manual:

```powershell
.\install-kanata.ps1
.\start-kanata.ps1
.\stop-kanata.ps1
.\uninstall-kanata.ps1
```

## Inicio automático con Task Scheduler

La tarea debe ejecutar `start-kanata.ps1` mediante `conhost.exe --headless`.
Esto mantiene PowerShell activo para recoger el log y el código de salida, pero
no muestra ni minimiza una ventana de terminal.

Abre **Task Scheduler / Programador de tareas** y selecciona **Create Task / Crear
tarea**.

### General

- Nombre: `Kanata`.
- Selecciona **Run only when user is logged on**.
- Activa **Run with highest privileges**.
- Selecciona la versión de Windows correspondiente.

Kanata necesita ejecutarse dentro de la sesión interactiva del usuario para
capturar el teclado. No se recomienda **Run whether user is logged on or not**.

### Trigger

Crea un trigger con estas opciones:

- **Begin the task:** At log on.
- Usuario: la cuenta actual.
- Opcional: retrasar la tarea entre 5 y 10 segundos.

El retraso reduce la posibilidad de que Kanata arranque mientras Windows y
otros programas todavía están instalando hooks de teclado.

### Action

Configura una acción **Start a program**.

**Program/script:**

```text
C:\Windows\System32\conhost.exe
```

**Add arguments:**

```text
--headless C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File ".\start-kanata.ps1"
```

**Start in:**

```text
<path_of_dotfiles>\dotfiles\keyboard\windows
```

No se debe incluir `-WindowStyle Hidden`: `conhost.exe --headless` ya se encarga
de ejecutar la consola sin una ventana visible.

### Settings

Opciones recomendadas:

- **Allow task to be run on demand**.
- Si falla, reiniciar cada minuto.
- Intentar reiniciar hasta tres veces.
- Si ya está ejecutándose, seleccionar **Do not start a new instance**.
- No establecer un límite de tiempo para detener la tarea.

Mientras Kanata esté funcionando, la tarea aparecerá como **Running**. Esto es
normal: `start-kanata.ps1` permanece activo y supervisa el proceso.

## Logs

La salida de Kanata se guarda en:

```text
runtime\kanata.log
```

Para observar el log en tiempo real:

```powershell
Get-Content .\runtime\kanata.log -Tail 50 -Wait
```

La pestaña **History** de Task Scheduler solo muestra eventos de la tarea, no la
salida de Kanata. Si se ejecuta `kanata.exe` directamente, el script no puede
capturar esa salida y el archivo de log no se actualiza.

## Operación y diagnóstico

Para aplicar cambios en `vim-hybrid.kbd`, detén y vuelve a ejecutar la tarea.
También puedes probar manualmente:

```powershell
.\stop-kanata.ps1
.\start-kanata.ps1
```

La ejecución manual conserva la terminal abierta para mostrar errores de
configuración. Pulsa `Ctrl+C` para detenerla.

WinIOv2 puede escribir `channel disconnected` y finalizar con el código
`-1073740791` al recibir `Ctrl+C`. `start-kanata.ps1` reconoce únicamente esa
combinación como un cierre esperado. Cualquier otro código distinto de cero se
sigue tratando como un error real.

## Notificación de QWERTY/Colemak

Mientras Kanata está activo, `start-kanata.ps1` mantiene su icono en la bandeja
del sistema. Al cambiar la capa base con `Caps+Space`, el icono muestra una
notificación breve con `Modo QWERTY` o `Modo Colemak-DH`.

`start-kanata.ps1` inicia un único proceso de notificación oculto. El cambio de
capa escribe inmediatamente el modo nuevo en
`runtime/layer-notification.txt`. El proceso de bandeja detecta el cambio y
muestra el popup sin bloquear Kanata.

El popup es una ventana pequeña sin bordes en la esquina inferior derecha y se
oculta después de aproximadamente dos segundos. No usa el globo de notificaciones de
Windows porque el sistema impone una duración mínima a esos avisos.

No necesita OverKeys ni un puerto TCP. Las capas temporales `vim-qwerty` y
`vim-colemak` no escriben el archivo, por lo que mantener Caps no produce
notificaciones. Los cambios rápidos actualizan el mismo estado en lugar de
mantener procesos de tres segundos en una cola.

Esta función requiere la variante oficial `winIOv2` con `cmd_allowed`. El
instalador selecciona esa variante de forma explícita. Después de actualizar
estos archivos, detén Kanata y vuelve a ejecutar `install-kanata.ps1` antes de
iniciarlo.

Si Kanata informa que una tecla está presionada internamente pero no en Windows,
está corrigiendo una desincronización de WinIOv2. Si ocurre repetidamente,
comprueba que no exista otro remapeador activo y conserva el retraso del trigger
de inicio de sesión.
