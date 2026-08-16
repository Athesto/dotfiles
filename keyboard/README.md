# Keyboard

Cross-platform keyboard configuration for my dotfiles.

The goal is to provide a consistent keyboard experience across macOS,
Windows, and Linux, especially when using compact keyboards.

The configuration combines:

- Colemak-DH as an optional typing layout.
- An ASCII/Readline-inspired custom layer.
- A Vim Hybrid layer with modifier-based movement and deletion.
- Editing shortcuts inspired by Readline and Emacs.
- Missing keys commonly found on larger keyboards.
- Platform-specific remapping tools.

## Platforms

| Platform | Remapper            |
| -------- | ------------------- |
| macOS    | Karabiner-Elements  |
| Windows  | Kanata              |
| Linux    | Kanata / keyd (TBD) |

The logical behavior should remain consistent across platforms whenever
possible, while platform-specific implementations may differ.

### Windows / Kanata

The Windows implementation is grouped under:

```text
windows/
├── vim-hybrid.kbd
├── install-kanata.cmd
├── start-kanata.cmd
├── stop-kanata.cmd
└── uninstall-kanata.cmd
```

Run the scripts in this order:

```text
install-kanata.cmd → download the latest official Kanata GUI release
start-kanata.cmd   → enable the remaps
stop-kanata.cmd    → stop Kanata and restore normal keyboard behavior
uninstall-kanata.cmd → stop Kanata and remove only the downloaded runtime
```

The scripts resolve paths relative to their own directory, so the dotfiles
repository can be located anywhere. The downloaded executable is kept in the
ignored `windows/runtime/` directory.

It preserves the Vim Hybrid semantics while translating them to native
Windows editing actions:

```text
no modifier → character
Alt         → word
Ctrl        → line or document
Shift       → selection
Win         → Windows system shortcuts
```

Examples:

```text
Caps+H             → Left
Caps+Alt+H         → Ctrl+Left
Caps+Ctrl+H        → Home
Caps+Shift+H       → Shift+Left
Caps+Alt+Shift+H   → Ctrl+Shift+Left
Caps+Ctrl+Shift+H  → Shift+Home

Caps+W             → Backspace
Caps+Alt+W         → Ctrl+Backspace
Caps+Ctrl+W        → Shift+Home, Backspace

Caps+X             → Delete
Caps+Alt+X         → Ctrl+Delete
Caps+Ctrl+X        → Shift+End, Delete

Caps+Backspace     → Ctrl+Backspace
```

The modifier order does not matter. `Right Win` becomes `Right Alt`, while
the left Windows key keeps its normal system behavior.

Windows can remain on the standard US English layout. Kanata uses temporary
one-shot layers and Unicode output for the Spanish characters:

```text
Caps+' then A/E/I/O/U       → á/é/í/ó/ú
Caps+' then Shift+A/E/I/O/U → Á/É/Í/Ó/Ú
Caps+Shift+U then U         → ü
Caps+Shift+U then Shift+U   → Ü
Caps+N                      → ñ
Caps+Shift+N then N         → ñ
Caps+Shift+N then Shift+N   → Ñ
Caps+?                      → ¿
Caps+!                      → ¡
```

The accent layer follows the active QWERTY or Colemak-DH typing positions.
Kanata notes that Unicode output may not be accepted by every application, so
these bindings should be tested in terminals and elevated applications on the
target Windows machine.

### macOS input-source profiles

The main generator contains two complete, alternative Vim Hybrid rules. Enable
only the one that matches the active macOS input source.

The canonical rule targets the built-in ABC input source and does not require
an external keyboard layout:

```text
Caps+N         → Option+N, N → ñ
Caps+Shift+N   → Option+N    → tilde dead key
Caps+'         → Option+E    → acute dead key
Caps+Shift+'   → Option+`    → grave dead key
Caps+Shift+U   → Option+U    → diaeresis dead key
Caps+?         → Option+Shift+/ → ¿
Caps+!         → Option+1       → ¡
```

The legacy rule keeps US-AltGr-Intl available during migration:

```text
Caps+N       → Option+N       → ñ
Caps+Shift+N → Option+Shift+N → Ñ
Caps+'       → Option+'        → acute dead key
```

Use `vimHybridRule` for ABC Standard or
`vimHybridUsAltGrIntlLegacyRule` for the external layout. Do not enable both
Vim rules at the same time. QWERTY/Colemak navigation is identical in both.

Recommended final setup:

```text
macOS input source: ABC

Enable:
Right Command as Right Option       optional
Vim Hybrid Layer - ABC Standard
Colemak-DH ANSI                     optional
60% Keyboard Compatibility          only for compact keyboards
```

Temporary setup while still using US-AltGr-Intl:

```text
macOS input source: US-AltGr-Intl

Enable:
Right Command as Right Option                 optional
Vim Hybrid Layer - US-AltGr-Intl Legacy
Colemak-DH ANSI                               optional
60% Keyboard Compatibility                    only for compact keyboards
```

The ASCII/Readline and Vim Hybrid rules are alternative custom layers. Do not
enable them together because both use Caps Lock as their activator.

## Custom Layer

`Caps Lock` acts as the custom layer modifier.

When pressed alone:

```text
Caps → Escape
```

When held, it activates the custom layer.

Caps Lock remains available without sacrificing either Shift key:

```text
Caps+Right Shift → Caps Lock
```

The order does not matter for this chord:

```text
Caps, then Right Shift → Caps Lock
Right Shift, then Caps → Caps Lock
```

Right Command is repurposed as Right Option:

```text
Right Command → Right Option
```

Incoming modifiers are preserved by default. For example, in the Vim
Hybrid layer:

```text
Caps+H       → Left
Caps+Shift+H → Shift+Left
```

This makes Shift useful for selection with navigation commands. The
Option changes the editing granularity from characters to words, while
Command changes it to lines:

```text
Caps+W          → delete previous character
Caps+X          → delete next character
Caps+Option+W   → delete previous word
Caps+Option+X   → delete next word
Caps+Cmd+W      → delete to beginning of line
Caps+Cmd+X      → delete to end of line
```

The order in which Caps and another modifier are pressed does not change
the result. Both of these preserve Shift for the following layer command:

```text
Caps, then Left Shift
Left Shift, then Caps
```

### ASCII

These mappings are based on historical ASCII control characters.

| Binding  | Output    | Reference   |
| -------- | --------- | ----------- |
| `Caps+H` | Backspace | `C-h` = BS  |
| `Caps+I` | Tab       | `C-i` = HT  |
| `Caps+M` | Enter     | `C-m` = CR  |
| `Caps+[` | Escape    | `C-[` = ESC |

### Readline Navigation

Navigation follows common GNU Readline / Emacs bindings.

| Binding  | Output | Reference |
| -------- | ------ | --------- |
| `Caps+A` | Home   | `C-a`     |
| `Caps+E` | End    | `C-e`     |
| `Caps+B` | Left   | `C-b`     |
| `Caps+F` | Right  | `C-f`     |
| `Caps+P` | Up     | `C-p`     |
| `Caps+N` | Down   | `C-n`     |

### Editing

Editing commands preserve familiar Readline mnemonics.

| Binding  | Output                      | Reference |
| -------- | --------------------------- | --------- |
| `Caps+H` | Backspace                   | `C-h`     |
| `Caps+D` | Delete forward              | `C-d`     |
| `Caps+W` | Delete previous word        | `C-w`     |
| `Caps+U` | Delete to beginning of line | `C-u`     |
| `Caps+K` | Delete to end of line       | `C-k`     |

On macOS these are currently implemented as:

```text
Caps+W → Option+Backspace

Caps+U → Shift+Home
         Backspace

Caps+K → Shift+End
         Delete
```

The layer represents the intended action rather than requiring every
platform to use the same underlying shortcut.

### Page Navigation

`U` and `D` were initially considered for page navigation, but they are
more useful for their Readline editing semantics.

Page navigation therefore uses:

```text
Caps+Y → PageUp
Caps+V → PageDown
```

### Accents in the ASCII/Readline layer

On macOS:

```text
Caps+' → Left Option + '
```

This exposes the configured dead-key behavior for typing accented
characters. Its exact result depends on the active input source. The Vim
Hybrid profiles below provide their own explicit ABC and US-AltGr-Intl
implementations instead.

## Vim Hybrid Layer

The Vim Hybrid layer uses `H`, `J`, `K`, and `L` for directional
navigation. Modifiers change the granularity or extend the movement:

```text
no modifier → character
Option      → word
Command     → line
Shift       → selection
```

### Basic Keys

| Binding  | Output |
| -------- | ------ |
| `Caps+I` | Tab    |
| `Caps+M` | Enter  |
| `Caps+[` | Escape |

### Navigation

| Binding          | Output            |
| ---------------- | ----------------- |
| `Caps+H`         | Left              |
| `Caps+J`         | Down              |
| `Caps+K`         | Up                |
| `Caps+L`         | Right             |
| `Caps+A`         | Home              |
| `Caps+E`         | End               |
| `Caps+U`         | Page Up           |
| `Caps+D`         | Page Down         |
| `Caps+Option+H`  | Previous word     |
| `Caps+Option+L`  | Next word         |
| `Caps+Command+H` | Beginning of line |
| `Caps+Command+L` | End of line       |

Shift can be combined with these navigation bindings to extend the
selection. For example:

```text
Caps+Shift+H        → select left
Caps+Shift+Option+H → select previous word
Caps+Shift+Command+L → select to end of line
```

### Deletion

| Binding          | Output                                    |
| ---------------- | ----------------------------------------- |
| `Caps+W`         | Delete previous character                 |
| `Caps+X`         | Delete next character                     |
| `Caps+Option+W`  | Delete previous word                      |
| `Caps+Option+X`  | Delete next word                          |
| `Caps+Command+W` | Delete to beginning of line               |
| `Caps+Command+X` | Delete to end of line                     |
| `Caps+Backspace` | Delete previous word (`Option+Backspace`) |

`B` and `F` intentionally have no mappings in this layer. Word movement
is provided by `Option+H` and `Option+L` instead.

### Other Keys

| Binding  | Output                                         |
| -------- | ---------------------------------------------- |
| `Caps+S` | Print Screen when 60% compatibility is enabled |

Character entry depends on the selected macOS input-source profile:

| Binding        | ABC Standard                    | US-AltGr-Intl Legacy              |
| -------------- | ------------------------------- | --------------------------------- |
| `Caps+N`       | `Option+N`, then `N` → ñ        | `Option+N` → ñ                    |
| `Caps+Shift+N` | `Option+N` → tilde dead key     | `Option+Shift+N` → Ñ              |
| `Caps+'`       | `Option+E` → acute dead key     | `Option+'` → acute dead key       |
| `Caps+Shift+'` | `Option+grave` → grave dead key | Same as the legacy accent mapping |
| `Caps+Shift+U` | `Option+U` → diaeresis dead key | Inherited `Shift+Page Up`         |
| `Caps+?`       | `Option+Shift+/` → ¿            | Unassigned                        |
| `Caps+!`       | `Option+1` → ¡                  | Unassigned                        |

With ABC Standard, the dead key is followed by the desired letter. Shift is
applied to that final letter when an uppercase character is needed:

```text
Caps+Shift+N, then N       → ñ
Caps+Shift+N, then Shift+N → Ñ
Caps+Shift+U, then U       → ü
Caps+Shift+U, then Shift+U → Ü
Caps+', then E             → é
Caps+Shift+', then A       → à
Caps+?                     → ¿
Caps+!                     → ¡
```

The function-key mappings described below are available when the independent
60% compatibility rule is enabled.

## 60% Keyboard

`60% Keyboard Compatibility` is an optional rule that restores keys that are
missing or inconvenient on a compact keyboard. It works with either custom
layer and can be disabled without changing Vim Hybrid, ASCII/Readline, or
Colemak-DH.

On a keyboard with a physical grave/tilde key and function row, leave this
rule disabled so Escape keeps its normal behavior.

### Grave Accent and Tilde

The physical `Esc` position is used to recover the ANSI grave/tilde key:

```text
Esc       → `
Shift+Esc → ~
Cmd+Esc   → Cmd+`
```

All modifiers are preserved by this remap, so the standard macOS
`Command+grave` window-switching shortcut remains available from the physical
Escape position.

Escape itself remains readily available through:

```text
Caps      → Escape
Caps+[    → Escape
```

### Print Screen

```text
Caps+S → Print Screen
```

This emits the actual Print Screen key rather than a platform-specific
screenshot shortcut.

### Function Keys

The number row exposes the complete function row:

```text
Caps+1 → F1
Caps+2 → F2
Caps+3 → F3
Caps+4 → F4
Caps+5 → F5
Caps+6 → F6
Caps+7 → F7
Caps+8 → F8
Caps+9 → F9
Caps+0 → F10
Caps+- → F11
Caps+= → F12
```

On macOS the Karabiner implementation emits `Fn+F1` through `Fn+F12`
so applications receive the actual function keys instead of the macOS
media/system actions.

For example:

```text
Caps+2
   ↓
Fn+F2
   ↓
F2
   ↓
VS Code: Rename Symbol
```

## Colemak-DH

Colemak-DH ANSI with Angle Mod is used as the alternative typing layout.

```text
Q W F P B   J L U Y ;
A R S T G   M N E I O
 X C D V Z   K H , . /
```

Colemak-DH can be enabled and disabled from either custom layer:

```text
Caps+Space → QWERTY ⇄ Colemak-DH
```

The toggle changes the internal `colemak_dh` variable between `0` for
QWERTY and `1` for Colemak-DH.

Colemak-DH and the custom layer are implemented independently.

The custom layer follows logical letters rather than relying on QWERTY
geometry, so its mnemonics remain meaningful when Colemak-DH is active.

## Karabiner

The macOS configuration is generated using JavaScript:

```text
ascii-readline.karabiner.json.js
```

The generator intentionally targets ECMAScript 5 compatibility.

Generate the JSON, open Karabiner-Elements, and add the desired rules from
Complex Modifications. Each named rule can be enabled or disabled separately;
copying the generated file does not automatically enable every rule.

Validate it with:

```sh
npx es-check es5 ascii-readline.karabiner.json.js
```

Generate and inspect the Karabiner JSON with:

```sh
node ascii-readline.karabiner.json.js | jq
```

Run the behavior checks with:

```sh
node validate-karabiner.js
```

The generated object follows the Karabiner complex modifications format:

```text
{
    "title": "Athesto Keyboard",
    "rules": [
        ...
    ]
}
```

The JavaScript generator keeps each Karabiner rule independent and exposes it
through a stable name:

```text
rightCommandAsOptionRule → Right Command as Right Option
sixtyPercentCompatibilityRule
                         → 60% Keyboard Compatibility
asciiReadlineRule        → ASCII/Readline Layer
vimHybridRule            → Vim Hybrid Layer - ABC Standard
vimHybridUsAltGrIntlLegacyRule
                         → Vim Hybrid Layer - US-AltGr-Intl Legacy
colemakDHRule            → Colemak-DH ANSI
```

The entry point returns the complete configuration:

```js
function main() {
  return {
    title: "Athesto Keyboard",

    rules: [
      rightCommandAsOptionRule,
      sixtyPercentCompatibilityRule,
      asciiReadlineRule,
      vimHybridRule,
      vimHybridUsAltGrIntlLegacyRule,
      colemakDHRule,
    ],
  };
}
```

The generated configuration is exposed as `karabinerBindings`:

```js
var karabinerBindings = main();

console.log(JSON.stringify(karabinerBindings, null, 2));

// rightCommandAsOptionRule
// sixtyPercentCompatibilityRule
// asciiReadlineRule
vimHybridRule;
// vimHybridUsAltGrIntlLegacyRule
// colemakDHRule
```

This allows the same source file to generate the complete JSON while also
making an individual rule available when needed.

## Design Principles

The custom layer is not intended to replace `Ctrl`, `Cmd`, or application
shortcuts.

Instead, it provides a small semantic interface based on familiar
mnemonics from ASCII, Readline, Emacs, and Unix tools.

The main goals are:

- Keep mappings mnemonic rather than position-dependent.
- Preserve the same muscle memory across operating systems.
- Work well with QWERTY and Colemak-DH.
- Restore useful keys missing from compact keyboards.
- Prefer standard key events over platform-specific shortcuts.
- Avoid duplicating shortcuts that are already convenient on a platform.
- Keep platform-specific behavior isolated from the common layout.
- Keep the configuration reproducible as part of the dotfiles repository.
