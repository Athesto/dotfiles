var fs = require("fs");
var path = require("path");
var source = fs.readFileSync(path.join(__dirname, "cheapino-base-cmk.vil"), "utf8");
var config = JSON.parse(source);
var target = path.join(__dirname, "cheapino-lat.vil");
var previous = JSON.parse(fs.readFileSync(target, "utf8"));

// Colemak host HID codes -> intended letters, then Latin American HID codes.
var letters = {KC_E:"KC_F", KC_R:"KC_P", KC_T:"KC_G", KC_Y:"KC_J",
  KC_U:"KC_L", KC_I:"KC_U", KC_O:"KC_Y", KC_P:"KC_SCOLON",
  KC_S:"KC_R", KC_D:"KC_S", KC_F:"KC_T", KC_G:"KC_D",
  KC_J:"KC_N", KC_K:"KC_E", KC_L:"KC_I", KC_SCOLON:"KC_O", KC_N:"KC_K"};
var symbols = {KC_SCOLON:"LSFT(KC_COMMA)", KC_SLASH:"LSFT(KC_7)",
  KC_QUOTE:"KC_MINUS", KC_LBRACKET:"LSFT(KC_QUOTE)",
  KC_RBRACKET:"LSFT(KC_NONUS_HASH)", KC_BSLASH:"RALT(KC_MINUS)",
  KC_MINUS:"KC_SLASH", KC_EQUAL:"LSFT(KC_0)", KC_GRAVE:"RALT(KC_NONUS_HASH)"};
[0, 1].forEach(function (layer) {
  config.layout[layer] = config.layout[layer].map(function (row) {
    return row.map(function (key) {
      var intended = letters[key] || key;
      return symbols[intended] || intended;
    });
  });
});
config.layout[3] = config.layout[3].map(function (row) {
  return row.map(function (key) { return symbols[key] || key; });
});
config.layout[2][0][4] = "KC_LBRACKET"; // acute dead key
config.layout[2][2][0] = "KC_SCOLON"; // ñ, Shift produces Ñ
config.layout[2][2][4] = "KC_EQUAL"; // ¿, Shift produces ¡

// Keep the physical Shift chords consistent with the LAT keycodes.
config.combo[0] = ["KC_L", "LSFT(KC_COMMA)", "KC_NO", "KC_NO", "KC_RSHIFT"];
config.combo[1] = ["KC_A", "KC_S", "KC_NO", "KC_NO", "KC_LSHIFT"];
config.combo[2] = ["KC_NO", "KC_NO", "KC_NO", "KC_NO", "KC_NO"];
config.combo[3] = ["KC_NO", "KC_NO", "KC_NO", "KC_NO", "KC_NO"];

// Remove the old Colemak-specific punctuation overrides only.
config.key_override = config.key_override.map(function (entry) {
  var old = entry.layers === 4 && ["KC_SLASH", "RALT(KC_SLASH)"].includes(entry.trigger)
    && ["RALT(KC_1)", "RALT(KC_SLASH)"].includes(entry.replacement);
  return old ? {trigger:"KC_NO", replacement:"KC_NO", layers:65535,
    trigger_mods:0, negative_mod_mask:0, suppressed_mods:0, options:7} : entry;
});
// Preserve the familiar shifted symbols even when LAT needs different HID keys.
var shifted = [
  ["LSFT(KC_7)", "LSFT(KC_MINUS)", 3], // / -> ? on base layers
  ["LSFT(KC_COMMA)", "LSFT(KC_DOT)", 3], // ; -> :
  ["KC_MINUS", "LSFT(KC_2)", 8], // ' -> "
  ["LSFT(KC_QUOTE)", "KC_QUOTE", 8], // [ -> {
  ["LSFT(KC_NONUS_HASH)", "KC_NONUS_HASH", 8], // ] -> }
  ["LSFT(KC_0)", "KC_RBRACKET", 8], // = -> +
  ["RALT(KC_NONUS_HASH)", "RALT(KC_RBRACKET)", 8], // ` -> ~
  ["KC_2", "RALT(KC_Q)", 8],
  ["KC_6", "RALT(KC_QUOTE)", 8],
  ["KC_7", "LSFT(KC_6)", 8],
  ["KC_8", "LSFT(KC_RBRACKET)", 8],
  ["KC_9", "LSFT(KC_8)", 8],
  ["KC_0", "LSFT(KC_9)", 8]
];
shifted.forEach(function (rule) {
  var slot = config.key_override.findIndex(function (entry) { return entry.trigger === "KC_NO"; });
  if (slot < 0) throw new Error("Not enough free key override slots for LAT");
  config.key_override[slot] = {trigger:rule[0], replacement:rule[1], layers:rule[2],
    trigger_mods:34, negative_mod_mask:0, suppressed_mods:34, options:7};
});
config.metadata = Object.assign({}, previous.metadata, {
  name:"Cheapino LAT", version:"0.2.1", host_layout:"Español Latinoamérica",
  platform:"Windows", updated:"2026-10-16",
  changes:["Synchronized Utility navigation, transparency and Shift combos",
    "Updated thumb and modifier layers from current Colemak layout",
    "QWERTY/Colemak-DH letters and symbols adapted to Latin American host",
    "Utils P: acute dead key; N: ñ; slash position: ¿ / ¡"]
});
var uid = source.match(/"uid"\s*:\s*(\d+)/)[1];
fs.writeFileSync(target, JSON.stringify(config).replace(/"uid":\d+/, '"uid":' + uid) + "\n");
