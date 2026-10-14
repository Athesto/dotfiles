# Cheapino / Vial

`cheapino-lat.vil` is the Latin American Spanish host version for Windows.
Select **Español (Latinoamérica)** in Windows before loading it. Both physical
QWERTY and Colemak-DH remain available via the encoder, with the current
thumb layers and no modifier combos. Version **0.2.0** is stored exclusively
in `metadata.version`; top-level `version: 1` is Vial's format version.

Utils + physical P sends the acute dead key: release Utils, then type the
vowel. Shift + that accent key prepares diaeresis. Utils + physical N gives
ñ (Shift gives Ñ). Utils + physical slash gives ¿ (Shift gives ¡).
Familiar shifted punctuation uses key overrides, requiring hardware testing.
The Mac buttons swap modifiers only; they do not adapt this file to a macOS
input source. `cheapino-base-cmk.vil` is unchanged.

Vial omits custom metadata on export. Save your latest LAT export over
`cheapino-lat.vil` and run `node version-lat.js cheapino-lat.vil 0.2.0`
to restore metadata without rebuilding your keys. `generate-lat.js` rebuilds
LAT from the current Colemak file and will replace manual LAT key edits;
use it only when intentionally resynchronizing the two variants.

`cheapino.vil` is the current stable export. `cheapino-base-cmk.vil` is the
next portable iteration; import it from **File → Load saved layout** in Vial
only when the host operating system is using standard Colemak.

## Host layout

`cheapino-base-cmk.vil` assumes standard Colemak (`00060409` on Windows 11).
Its base layers translate that host layout back into the desired physical
layouts:

```text
Layer 0 → QWERTY
Layer 1 → Colemak-DH
```

Navigation, modifiers, function keys, media keys, and layer activation use
non-letter HID keycodes and are unaffected by the host layout.

## Layers

| Layer | Purpose | Activation |
| --- | --- | --- |
| 0 | QWERTY | Default |
| 1 | Colemak-DH | Press the encoder to toggle layers 0/1 |
| 2 | Utility and navigation | Hold left outer thumb |
| 3 | Numbers and symbols | Hold right inner thumb |
| 4 | Function and media keys | Hold left inner thumb |

QMK gives higher-numbered active layers priority. Both base layouts use
`MO(2)`, `LT(3, KC_SPACE)`, and `MO(4)`, so the shared auxiliary layers
have priority over QWERTY and Colemak-DH without duplicate layers.

## Modifiers without tap/hold timing

All letters on the base layers are normal keys. There are no home-row mods or
other tap/hold decisions. Hold Utility and use the left home row as dedicated
modifiers:

```text
Utility+A → Shift
Utility+S → Ctrl
Utility+D → GUI
Utility+F → Alt
Utility+G → Escape
```

The left middle thumb activates left modifiers; the left inner thumb
activates Functions. Shift and Alt are available on the modifier layers.

## Modifier combos

Modifier combos are disabled in `cheapino-base-cmk.vil`. Use the left
middle and inner thumb modifier layers instead. `cheapino-lat.vil` also has modifier combos disabled. `add-modifier-combos.js`
is retained only as an optional tool to restore the old experiment.

## Thumb positions

```text
Left:  Utility | Left modifiers | Functions
Right: Space / Numbers | Right modifiers | Space
```

The table above follows the physical left-to-right order. Vial stores the
three left thumb positions internally in the opposite order: inner, middle,
outer.

The inner right thumb is experimental dual-role `LT(3, KC_SPACE)`: tap it
for Space or hold it for the Numbers/Symbols layer. The outer right thumb
remains a dedicated Space key while the timing is evaluated.

Pressing the encoder toggles between QWERTY on layer 0 and Colemak-DH on layer
1. Rotating it scrolls in both base layouts.

On the Numbers/Symbols layer, the physical `/` key produces `?`:

```text
Numbers + / → ?
```

Right Alt is available through the thumb modifier layer and auxiliary layer
modifiers. Standard Colemak uses it for international characters without making
the normal apostrophe or backtick dead keys:

```text
AltGr + A → á    AltGr + N → ñ
AltGr + E → é    AltGr + C → ç
AltGr + I → í    AltGr + Y → ü
AltGr + O → ó    AltGr + / → ¿
AltGr + U → ú    AltGr + 1 → ¡
```

Add Shift for uppercase characters. United States-International is not
required by `cheapino-base-cmk.vil`.

For sequential accents, Utility + the physical QWERTY P position is
`OSM(MOD_RALT)`. Tap and release P, release Utility, then press the desired
letter on the base layout. Right Alt applies to that next key only (subject
to the firmware's one-shot timeout). For example, this sequence followed by
A produces á with the standard Colemak host layout. This replaces the
Utility-layer quote; quote is still available on the Numbers/Symbols layer.

Utils also provides Spanish characters with the standard Colemak host:
physical QWERTY `/` sends ¿, Shift + `/` sends ¡, and physical QWERTY N
sends ñ (Shift gives Ñ). Two layer-2-only key overrides handle left and
right Shift for ¡. These AltGr bindings require a compatible host layout;
macOS layouts may produce different characters.

The generator preserves the keyboard UID, protocol versions, settings,
encoder configuration, macros, combos, and key overrides from the exported
Vial file. Run `node generate-cheapino-vial.js` after replacing
`cheapino.vil` with a fresh export.

## Symbols home row and RGB controls

The Numbers/Symbols layer has dedicated modifiers on the home row:
left A/S/D/F = Shift/Ctrl/GUI/Alt; right J/K/L/semicolon = Alt/GUI/Ctrl/Shift.
The former home-row symbols are on the bottom row, with numbers unchanged
on the top row. These names denote physical QWERTY positions.

On Functions, physical Z/X control RGB Hue -/+ and C/V control RGB
Brightness -/+. These require RGB lighting support in the keyboard firmware.

Functions has left Shift/Ctrl/GUI/Alt on physical A/S/D/F. Media controls
Play/Previous/Next are on Q/W/E. The right Y/H/N column controls
Volume Up/Mute/Volume Down. RGB controls are on Z/X/C/V; F1–F12 retain
their positions.

## Thumb modifier layers (Colemak-host file only)

In `cheapino-base-cmk.vil`, layer 5 modifies the left home row and layer 6
the right home row. Hold the left middle thumb for layer 5: physical
A/S/D/F provide Left Shift/Ctrl/GUI/Alt. Hold the right middle thumb for
layer 6: physical J/K/L/semicolon provide Left Alt/GUI and Right Ctrl/Shift.
Other keys are transparent and modifiers remain ordinary held keys.
Functions (4) is on the left inner thumb, Utility (2) on the left outer,
and Numbers (3) is on the right inner thumb. Modifier combos are disabled.
`cheapino-lat.vil` now contains the separate Latin American adaptation.

Functions + physical QWERTY R restores Left Alt/GUI (Windows); T swaps
Left Alt/GUI (Mac). Both hands use left Alt/GUI keycodes for shortcut
modifiers; Right Alt remains reserved for accents. The old global toggle
on B is removed. If the global swap was previously enabled, disable it
before using these left-only controls.
