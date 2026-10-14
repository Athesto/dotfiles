module.exports = function (config) {
  var overrides = JSON.parse(JSON.stringify(config.key_override));
  [2, 32].forEach(function (shift) {
    var entry = {
      trigger: "KC_SLASH", replacement: "RALT(KC_1)", layers: 4,
      trigger_mods: shift, negative_mod_mask: 0, suppressed_mods: 34, options: 7
    };
    var existing = overrides.find(function (item) {
      return item.trigger === entry.trigger && (item.layers & 4) && item.trigger_mods === shift;
    });
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(entry)) throw new Error("Conflicting Spanish punctuation override");
      return;
    }
    var slot = overrides.findIndex(function (item) { return item.trigger === "KC_NO"; });
    if (slot < 0) throw new Error("No free key override slots");
    overrides[slot] = entry;
  });
  var normal = {trigger: "KC_SLASH", replacement: "RALT(KC_SLASH)", layers: 4,
    trigger_mods: 0, negative_mod_mask: 34, suppressed_mods: 0, options: 7};
  if (!overrides.some(function (e) { return JSON.stringify(e) === JSON.stringify(normal); })) {
    var slot = overrides.findIndex(function (e) { return e.trigger === "KC_NO"; });
    if (slot < 0) throw new Error("No free key override slots");
    overrides[slot] = normal;
  }
  config.key_override = overrides;
  return config;
};
