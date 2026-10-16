var fs = require("fs");
var path = require("path");

var inputPath = path.join(__dirname, "cheapino-base-cmk.vil");
var outputPath = path.join(__dirname, "cheapino-base-us.vil");
var config = JSON.parse(fs.readFileSync(inputPath, "utf8"));
var keyboardUid = "11439577402410331513";

function setBaseRows(layer, leftRows, rightRows) {
  var row;
  var column;

  for (row = 0; row < 3; row += 1) {
    for (column = 0; column < 5; column += 1) {
      config.layout[layer][row][column] = rightRows[row][column];
      config.layout[layer][4 + row][10 - column] = leftRows[row][column];
    }
  }
}

// The host interprets HID letter positions as ordinary English US.
setBaseRows(
  0,
  [
    ["KC_Q", "KC_W", "KC_E", "KC_R", "KC_T"],
    ["KC_A", "KC_S", "KC_D", "KC_F", "KC_G"],
    ["KC_Z", "KC_X", "KC_C", "KC_V", "KC_B"]
  ],
  [
    ["KC_Y", "KC_U", "KC_I", "KC_O", "KC_P"],
    ["KC_H", "KC_J", "KC_K", "KC_L", "KC_SCOLON"],
    ["KC_N", "KC_M", "KC_COMMA", "KC_DOT", "KC_SLASH"]
  ]
);

setBaseRows(
  1,
  [
    ["KC_Q", "KC_W", "KC_F", "KC_P", "KC_B"],
    ["KC_A", "KC_R", "KC_S", "KC_T", "KC_G"],
    ["KC_Z", "KC_X", "KC_C", "KC_D", "KC_V"]
  ],
  [
    ["KC_J", "KC_L", "KC_U", "KC_Y", "KC_SCOLON"],
    ["KC_M", "KC_N", "KC_E", "KC_I", "KC_O"],
    ["KC_K", "KC_H", "KC_COMMA", "KC_DOT", "KC_SLASH"]
  ]
);

// Remove Colemak-host Spanish helpers from Utility layer 2.
config.layout[2][0][4] = "OSM(MOD_RALT)";
config.layout[2][2][0] = "RALT(KC_N)";
config.layout[2][2][4] = "KC_SLASH";

// Keep the physical Shift chords consistent after translating the base rows.
config.combo[0] = ["KC_L", "KC_SCOLON", "KC_NO", "KC_NO", "KC_RSHIFT"];
config.combo[1] = ["KC_A", "KC_S", "KC_NO", "KC_NO", "KC_LSHIFT"];
config.combo[2] = ["KC_NO", "KC_NO", "KC_NO", "KC_NO", "KC_NO"];
config.combo[3] = ["KC_NO", "KC_NO", "KC_NO", "KC_NO", "KC_NO"];

// Remove the layer-2 Spanish punctuation overrides while preserving slots.
config.key_override.forEach(function (entry, index) {
  if (entry.trigger === "KC_SLASH" && entry.layers === 4) {
    config.key_override[index] = {
      trigger: "KC_NO",
      replacement: "KC_NO",
      layers: 65535,
      trigger_mods: 0,
      negative_mod_mask: 0,
      suppressed_mods: 0,
      options: 7
    };
  }
});

var output = JSON.stringify(config).replace(
  /"uid":\d+/,
  '"uid":' + keyboardUid
);

fs.writeFileSync(outputPath, output + "\n", "utf8");
