var fs = require("fs");
var path = require("path");

function addModifierCombos(config) {
  var requested = [];
  [0, 1].forEach(function (layer) {
    var keys = config.layout[layer];
    requested.push([keys[5][10], keys[5][9], "KC_NO", "KC_NO", "KC_LSFT"]);
    requested.push([keys[6][10], keys[6][9], "KC_NO", "KC_NO", "KC_LCTL"]);
    requested.push([keys[6][9], keys[6][8], "KC_NO", "KC_NO", "KC_LGUI"]);
    requested.push([keys[6][8], keys[6][7], "KC_NO", "KC_NO", "KC_LALT"]);
    requested.push([keys[1][3], keys[1][4], "KC_NO", "KC_NO", "KC_RSFT"]);
    requested.push([keys[2][3], keys[2][4], "KC_NO", "KC_NO", "KC_RCTL"]);
    requested.push([keys[2][2], keys[2][3], "KC_NO", "KC_NO", "KC_RGUI"]);
    requested.push([keys[2][1], keys[2][2], "KC_NO", "KC_NO", "KC_RALT"]);
  });
  var combos = JSON.parse(JSON.stringify(config.combo));
  // Remove only the exact six entries installed by the previous version.
  var legacy = [
    ["KC_A", "KC_D", "KC_G", "KC_NO", "LCA(KC_NO)"],
    ["KC_A", "KC_D", "KC_NO", "KC_NO", "KC_LCTL"],
    ["KC_U", "KC_P", "KC_NO", "KC_NO", "KC_RCTL"],
    ["KC_A", "KC_S", "KC_D", "KC_NO", "LCA(KC_NO)"],
    ["KC_A", "KC_S", "KC_NO", "KC_NO", "KC_LCTL"],
    ["KC_L", "KC_SCOLON", "KC_NO", "KC_NO", "KC_RCTL"]
  ];
  function signature(entry) {
    return entry.slice(0, 4).filter(function (key) { return key !== "KC_NO"; }).sort().join(",") + ":" + entry[4];
  }
  combos = combos.map(function (entry) {
    return legacy.some(function (old) { return signature(old) === signature(entry); })
      ? ["KC_NO", "KC_NO", "KC_NO", "KC_NO", "KC_NO"] : entry;
  });
  requested.forEach(function (entry) {
    var inputs = entry.slice(0, 4).filter(function (key) { return key !== "KC_NO"; }).sort().join(",");
    var existing = combos.find(function (combo) {
      return combo.slice(0, 4).filter(function (key) { return key !== "KC_NO"; }).sort().join(",") === inputs;
    });
    if (existing) {
      if (existing[4] !== entry[4]) throw new Error("Existing combo conflicts with " + inputs);
      return;
    }
    var slot = combos.findIndex(function (combo) {
      return combo.every(function (key) { return key === "KC_NO"; });
    });
    if (slot < 0) throw new Error("No free combo slots");
    combos[slot] = entry;
  });
  config.combo = combos;
  return config;
}

module.exports = addModifierCombos;

if (require.main === module) {
  var file = process.argv[2] || path.join(__dirname, "cheapino-base-cmk.vil");
  var raw = fs.readFileSync(file, "utf8");
  var uid = raw.match(/"uid"\s*:\s*(\d+)/)[1];
  var config = addModifierCombos(JSON.parse(raw));
  fs.writeFileSync(file, JSON.stringify(config).replace(/"uid":\d+/, '"uid":' + uid) + "\n");
}
