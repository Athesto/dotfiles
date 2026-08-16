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

| Platform | Remapper |
|----------|----------|
| macOS | Karabiner-Elements |
| Windows | Kanata |
| Linux | Kanata / keyd (TBD) |

The logical behavior should remain consistent across platforms whenever
possible, while platform-specific implementations may differ.

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

| Binding | Output | Reference |
|---------|--------|-----------|
| `Caps+H` | Backspace | `C-h` = BS |
| `Caps+I` | Tab | `C-i` = HT |
| `Caps+M` | Enter | `C-m` = CR |
| `Caps+[` | Escape | `C-[` = ESC |

### Readline Navigation

Navigation follows common GNU Readline / Emacs bindings.

| Binding | Output | Reference |
|---------|--------|-----------|
| `Caps+A` | Home | `C-a` |
| `Caps+E` | End | `C-e` |
| `Caps+B` | Left | `C-b` |
| `Caps+F` | Right | `C-f` |
| `Caps+P` | Up | `C-p` |
| `Caps+N` | Down | `C-n` |

### Editing

Editing commands preserve familiar Readline mnemonics.

| Binding | Output | Reference |
|---------|--------|-----------|
| `Caps+H` | Backspace | `C-h` |
| `Caps+D` | Delete forward | `C-d` |
| `Caps+W` | Delete previous word | `C-w` |
| `Caps+U` | Delete to beginning of line | `C-u` |
| `Caps+K` | Delete to end of line | `C-k` |

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

### Accents

On macOS:

```text
Caps+' → Left Option + '
```

This exposes the configured dead-key behavior for typing accented
characters.

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

| Binding | Output |
|---------|--------|
| `Caps+I` | Tab |
| `Caps+M` | Enter |
| `Caps+[` | Escape |

### Navigation

| Binding | Output |
|---------|--------|
| `Caps+H` | Left |
| `Caps+J` | Down |
| `Caps+K` | Up |
| `Caps+L` | Right |
| `Caps+A` | Home |
| `Caps+E` | End |
| `Caps+U` | Page Up |
| `Caps+D` | Page Down |
| `Caps+Option+H` | Previous word |
| `Caps+Option+L` | Next word |
| `Caps+Command+H` | Beginning of line |
| `Caps+Command+L` | End of line |

Shift can be combined with these navigation bindings to extend the
selection. For example:

```text
Caps+Shift+H        → select left
Caps+Shift+Option+H → select previous word
Caps+Shift+Command+L → select to end of line
```

### Deletion

| Binding | Output |
|---------|--------|
| `Caps+W` | Delete previous character |
| `Caps+X` | Delete next character |
| `Caps+Option+W` | Delete previous word |
| `Caps+Option+X` | Delete next word |
| `Caps+Command+W` | Delete to beginning of line |
| `Caps+Command+X` | Delete to end of line |

`B` and `F` intentionally have no mappings in this layer. Word movement
is provided by `Option+H` and `Option+L` instead.

### Other Keys

| Binding | Output |
|---------|--------|
| `Caps+S` | Print Screen |
| `Caps+'` | Accent dead key |

The function-key mappings described below are also available in this
layer.

## 60% Keyboard

The layer also restores useful keys that are missing or inconvenient on a
60% keyboard.

### Grave Accent and Tilde

The physical `Esc` position is used to recover the ANSI grave/tilde key:

```text
Esc       → `
Shift+Esc → ~
```

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

Validate it with:

```sh
npx es-check es5 ascii-readline.karabiner.json.js
```

Generate and inspect the Karabiner JSON with:

```sh
node ascii-readline.karabiner.json.js | jq
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

The JavaScript generator keeps each Karabiner rule independent:

```text
rules[0] → Right Command as Right Option
rules[1] → 60% ASCII/Readline Layer
rules[2] → 60% Vim Hybrid Layer
rules[3] → Colemak-DH ANSI
```

The entry point returns the complete configuration:

```js
function main() {
    return {
        title: "Athesto Keyboard",

        rules: [
            createRightCommandAsOptionRule(),
            generateAsciiReadlineRule(),
            generateVimHybridRule(),
            generateColemakDHRule()
        ]
    }
}
```

The generated output is exposed separately:

```js
var output = main()

console.log(
    JSON.stringify(
        output,
        null,
        2
    )
)

output.rules[0] // right-command-as-option
output.rules[1] // ascii-readline
output.rules[2] // vim-hybrid
output.rules[3] // colemak
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
