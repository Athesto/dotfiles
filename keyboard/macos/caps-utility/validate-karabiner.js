var childProcess = require("child_process");
var path = require("path");

var generator = path.join(__dirname, "ascii-readline.karabiner.json.js");
var generated = childProcess.execFileSync(process.execPath, [generator], {
  encoding: "utf8",
});
var configuration = JSON.parse(generated);
var versionMatch = configuration.title.match(
  /^Athesto Keyboard — (\d+(?:\.\d+)*)$/
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findManipulators(rule, keyCode) {
  return rule.manipulators.filter(function (manipulator) {
    return manipulator.from.key_code === keyCode;
  });
}

function validateRuleStructure(rule, version) {
  assert(
    typeof rule.description === "string" &&
      rule.description.slice(-(version.length + 3)) === " — " + version,
    "Every selected rule must expose the configuration version"
  );

  assert(
    Array.isArray(rule.manipulators) && rule.manipulators.length > 0,
    rule.description + " must contain manipulators"
  );

  rule.manipulators.forEach(function (manipulator) {
    assert(
      manipulator.type === "basic" && manipulator.from,
      rule.description + " contains an invalid manipulator"
    );
  });
}

function validateCapsUtilityRule(rule) {
  var semicolon = findManipulators(rule, "semicolon");
  var deleteKey = findManipulators(rule, "o");
  var slash = findManipulators(rule, "slash");
  var caps = findManipulators(rule, "caps_lock");
  var layoutToggles = findManipulators(rule, "spacebar").filter(function (
    mapping
  ) {
    return !mapping.from.modifiers;
  });

  assert(
    semicolon.length === 2 &&
      semicolon[0].from.modifiers.mandatory[0] === "shift" &&
      semicolon[0].from.modifiers.optional.indexOf("option") !== -1 &&
      semicolon[0].from.modifiers.optional.indexOf("command") !== -1 &&
      semicolon[0].to[0].key_code === "delete_forward" &&
      semicolon[1].to[0].key_code === "delete_or_backspace",
    "Caps+Semicolon must emit Backspace, Caps+Shift+Semicolon Delete, and preserve Option or Command"
  );

  assert(
    deleteKey.length === 1 &&
      deleteKey[0].to[0].key_code === "delete_forward",
    "Caps+O must emit Delete"
  );

  assert(
    slash.length === 2 &&
      slash[0].from.modifiers.mandatory[0] === "shift" &&
      slash[1].to[0].modifiers[0] === "right_option",
    "Caps+/ and Caps+Shift+/ must emit the Spanish question marks"
  );

  assert(
    caps.length >= 2,
    "Caps Utility must contain its activators and reverse Caps Lock mapping"
  );

  assert(
    !caps.some(function (mapping) {
      return (
        mapping.to_if_alone &&
        mapping.to_if_alone.some(function (event) {
          return event.key_code === "escape";
        })
      );
    }),
    "Caps double-tap Escape must be disabled"
  );

  assert(
    layoutToggles.length === 2,
    "Caps+Space must contain both layout toggle states"
  );
}

assert(versionMatch, "Configuration title must contain a numeric version");
assert(
  Array.isArray(configuration.rules) && configuration.rules.length > 0,
  "Console output must contain at least one selected rule"
);

var version = versionMatch[1];

configuration.rules.forEach(function (rule) {
  validateRuleStructure(rule, version);

  if (rule.description.indexOf("Caps Utility Layer - ABC Standard") === 0) {
    validateCapsUtilityRule(rule);
  }
});

process.stdout.write(
  "Karabiner configuration is valid (" +
    configuration.rules.length +
    " selected rule).\n"
);
