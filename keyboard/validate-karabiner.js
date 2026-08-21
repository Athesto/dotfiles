var childProcess = require("child_process");
var path = require("path");

var generator = path.join(__dirname, "ascii-readline.karabiner.json.js");

var generated = childProcess.execFileSync(process.execPath, [generator], {
  encoding: "utf8",
});

var configuration = JSON.parse(generated);
var EXPECTED_CAPS_LOCK_HOLD_MS = 200;
var EXPECTED_CAPS_DOUBLE_TAP_DELAY_MS = 300;
var EXPECTED_SCROLL_STEP = 32;
var EXPECTED_NOTIFICATION_DURATION_MS = 2000;
var LAYOUT_QWERTY = 0;
var LAYOUT_COLEMAK_DH = 1;
var PROFILE_VIM_CLASSIC = 0;
var PROFILE_SEMICOLON_ENTER = 1;
var versionMatch = configuration.title.match(
  /^Athesto Keyboard — (\d{4}\.\d{2}\.\d{2}(?:\.\d+)?)$/
);

assert(versionMatch, "Configuration title must contain a CalVer version");

var version = versionMatch[1];

function createRuleDescription(name) {
  return name + " — " + version;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findRule(description) {
  var rules = configuration.rules;
  var i;

  for (i = 0; i < rules.length; i += 1) {
    if (rules[i].description === createRuleDescription(description)) {
      return rules[i];
    }
  }

  throw new Error("Missing rule: " + description);
}

function findManipulators(rule, keyCode) {
  return rule.manipulators.filter(function (manipulator) {
    return manipulator.from.key_code === keyCode;
  });
}

function validateLayer(rule, layer) {
  var manipulators = rule.manipulators;
  var rightShift = findManipulators(rule, "right_shift")[0];

  var reverseCapsIndex = -1;
  var activatorIndexes = [];
  var activators = [];
  var spaceMappings = findManipulators(rule, "spacebar");
  var toggles = spaceMappings.filter(function (mapping) {
    return (
      mapping.from.modifiers &&
      mapping.from.modifiers.mandatory &&
      mapping.from.modifiers.mandatory[0] === "shift"
    );
  });
  var i;
  var manipulator;

  assert(
    rightShift.conditions[0].name === layer,
    rule.description + " has the wrong layer condition"
  );

  assert(
    rightShift.to[0].hold_down_milliseconds === EXPECTED_CAPS_LOCK_HOLD_MS &&
      rightShift.to[1].key_code === "vk_none",
    rule.description + " has an invalid Caps Lock output"
  );

  for (i = 0; i < manipulators.length; i += 1) {
    manipulator = manipulators[i];

    if (
      manipulator.from.key_code === "caps_lock" &&
      manipulator.from.modifiers.mandatory &&
      manipulator.from.modifiers.mandatory[0] === "right_shift"
    ) {
      reverseCapsIndex = i;
    }

    if (
      manipulator.from.key_code === "caps_lock" &&
      manipulator.to[0].set_variable &&
      manipulator.to[0].set_variable.name === layer
    ) {
      activatorIndexes.push(i);
      activators.push(manipulator);
    }
  }

  assert(
    reverseCapsIndex >= 0 && reverseCapsIndex < activatorIndexes[0],
    rule.description +
      " must handle Right Shift before the generic Caps activator"
  );

  assert(activators.length === 2, rule.description + " needs two Caps states");

  assert(
    activators[0].conditions[0].type === "variable_if" &&
      activators[0].to_if_alone[0].key_code === "escape" &&
      activators[1].conditions[0].type === "variable_unless" &&
      activators[1].to_if_alone[0].set_variable.name === "caps_double_tap" &&
      activators[1].parameters[
        "basic.to_delayed_action_delay_milliseconds"
      ] === EXPECTED_CAPS_DOUBLE_TAP_DELAY_MS,
    rule.description + " must emit Escape only on a double tap of Caps"
  );

  assert(
    toggles.length === 2 &&
      toggles[0].to[0].set_variable.value === LAYOUT_COLEMAK_DH &&
      toggles[1].to[0].set_variable.value === LAYOUT_QWERTY,
    rule.description + " must contain the Colemak toggle"
  );
}

assert(
  configuration.rules.length === 6,
  "Expected six independent Karabiner rules"
);

assert(
  configuration.rules.every(function (rule) {
    return rule.description.slice(-(version.length + 3)) === " — " + version;
  }),
  "Every Karabiner rule must expose the configuration version"
);

var rightCommandRule = findRule("Right Command as Right Option");
var sixtyPercentRule = findRule("60% Keyboard Compatibility");
var asciiRule = findRule("ASCII/Readline Layer");
var vimRule = findRule("Vim Hybrid Layer - ABC Standard");
var legacyVimRule = findRule("Vim Hybrid Layer - US-AltGr-Intl Legacy");
var colemakRule = findRule("Colemak-DH ANSI");

assert(
  rightCommandRule.manipulators[0].from.key_code === "right_command" &&
    rightCommandRule.manipulators[0].to[0].key_code === "right_option",
  "Right Command must map to Right Option"
);

assert(
  findManipulators(sixtyPercentRule, "escape").length === 1 &&
    findManipulators(sixtyPercentRule, "escape")[0].from.modifiers
      .mandatory[0] === "left_shift" &&
    findManipulators(sixtyPercentRule, "escape")[0].to[0].key_code ===
      "grave_accent_and_tilde" &&
    findManipulators(sixtyPercentRule, "escape")[0].to[0].modifiers[0] ===
      "left_shift",
  "60% Left Shift+Escape must emit tilde without capturing other Escapes"
);

var asciiEscape = findManipulators(asciiRule, "escape");
var vimEscape = findManipulators(vimRule, "escape");

assert(
  asciiEscape.length === 2 &&
    asciiEscape[0].from.modifiers.mandatory[0] === "command" &&
    asciiEscape[0].to[0].key_code === "grave_accent_and_tilde" &&
    asciiEscape[0].to[0].modifiers[0] === "left_command" &&
    asciiEscape[1].to[0].key_code === "grave_accent_and_tilde" &&
    vimEscape.length === 2 &&
    vimEscape[0].from.modifiers.mandatory[0] === "command" &&
    vimEscape[0].to[0].key_code === "grave_accent_and_tilde" &&
    vimEscape[0].to[0].modifiers[0] === "left_command" &&
    vimEscape[1].to[0].key_code ===
      "grave_accent_and_tilde" &&
    !vimEscape[1].from.modifiers.mandatory,
  "Layer Escape mappings must prioritize Caps+Command+Escape"
);

validateLayer(asciiRule, "ascii_readline_layer");
validateLayer(vimRule, "vim_hybrid_layer");
validateLayer(legacyVimRule, "vim_hybrid_layer");

var vimProfileToggles = findManipulators(vimRule, "spacebar").filter(function (
  mapping
) {
  return !mapping.from.modifiers;
});

assert(
  vimProfileToggles.length === 2 &&
    vimProfileToggles[0].to[0].set_variable.name ===
      "vim_navigation_profile" &&
    vimProfileToggles[0].to[0].set_variable.value === PROFILE_SEMICOLON_ENTER &&
    vimProfileToggles[1].to[0].set_variable.value === PROFILE_VIM_CLASSIC &&
    vimProfileToggles.every(function (mapping) {
      return (
        mapping.parameters["basic.to_delayed_action_delay_milliseconds"] ===
        EXPECTED_NOTIFICATION_DURATION_MS
      );
    }),
  "Vim Caps+Space must cycle through all navigation profiles"
);

var vimH = findManipulators(vimRule, "h");
var vimJ = findManipulators(vimRule, "j");
var vimK = findManipulators(vimRule, "k");
var vimL = findManipulators(vimRule, "l");
var vimM = findManipulators(vimRule, "m");
var vimX = findManipulators(vimRule, "x");
var vimBackspace = findManipulators(vimRule, "delete_or_backspace");
var vimComma = findManipulators(vimRule, "comma");
var vimPeriod = findManipulators(vimRule, "period");
var vimSemicolon = findManipulators(vimRule, "semicolon");

assert(
  vimJ.length === 2 &&
    vimJ[0].to[0].key_code === "down_arrow" &&
    vimJ[1].to[0].key_code === "down_arrow" &&
    vimM.length === 2 &&
    vimM[0].to[0].key_code === "return_or_enter" &&
    vimM[1].to[0].key_code === "delete_or_backspace",
  "Vim J and M profile mappings are invalid"
);

assert(
  vimH.length === 2 &&
    vimH[0].to[0].key_code === "left_arrow" &&
    vimH[1].to[0].key_code === "left_arrow" &&
    vimK.length === 2 &&
    vimK[0].to[0].key_code === "up_arrow" &&
    vimK[1].to[0].key_code === "up_arrow" &&
    vimL.length === 2 &&
    vimL[0].to[0].key_code === "right_arrow" &&
    vimL[1].to[0].key_code === "right_arrow",
  "Vim H/K/L profile mappings are invalid"
);

assert(
  findManipulators(vimRule, "w").length === 0,
  "Vim W must remain unassigned after moving backward deletion to Semicolon"
);

assert(
  vimX.length === 3 &&
    vimX[0].from.modifiers.mandatory[0] === "option" &&
    vimX[1].from.modifiers.mandatory[0] === "command" &&
    vimX[2].from.modifiers.optional[0] === "any",
  "Vim X deletion priority is invalid"
);

assert(
  vimBackspace.length === 1 &&
    vimBackspace[0].to[0].key_code === "delete_or_backspace" &&
    vimBackspace[0].to[0].modifiers[0] === "left_option",
  "Caps+Backspace must emit Option+Backspace"
);

assert(
  vimComma.length === 1 &&
    vimComma[0].to[0].mouse_key.vertical_wheel === -EXPECTED_SCROLL_STEP &&
    vimPeriod.length === 1 &&
    vimPeriod[0].to[0].mouse_key.vertical_wheel === EXPECTED_SCROLL_STEP,
  "Caps+Comma and Caps+Period must scroll up and down"
);

assert(
  vimSemicolon.length === 2 &&
    vimSemicolon[0].to[0].key_code === "delete_or_backspace" &&
    vimSemicolon[1].to[0].key_code === "return_or_enter",
  "Vim Semicolon profile mappings are invalid"
);

assert(
  findManipulators(vimRule, "b").length === 0 &&
    findManipulators(vimRule, "f").length === 0,
  "Vim B and F must remain unassigned"
);

var legacyVimN = findManipulators(legacyVimRule, "n");

assert(
  legacyVimN.length === 1 &&
    legacyVimN[0].to[0].key_code === "n" &&
    legacyVimN[0].to[0].modifiers[0] === "right_option",
  "Legacy Vim N must produce enye with US-AltGr-Intl"
);

assert(colemakRule.manipulators.length > 0, "Colemak-DH must contain mappings");

var abcEnye = findManipulators(vimRule, "n");
var abcAccent = findManipulators(vimRule, "quote");
var abcDiaeresis = findManipulators(vimRule, "u");
var abcQuestion = findManipulators(vimRule, "slash");
var abcExclamation = findManipulators(vimRule, "1");

assert(
  abcEnye.length === 2 &&
    abcEnye[0].from.modifiers.mandatory[0] === "shift" &&
    abcEnye[0].to[0].key_code === "n" &&
    abcEnye[0].to[0].modifiers[0] === "right_option" &&
    !abcEnye[1].from.modifiers,
  "ABC Standard must prioritize the tilde dead key before ñ"
);

assert(
  abcAccent.length === 2 &&
    abcAccent[0].to[0].key_code === "grave_accent_and_tilde" &&
    abcAccent[0].to[0].modifiers[0] === "right_option" &&
    abcAccent[1].to[0].key_code === "e",
  "ABC Standard must emit grave and acute dead keys"
);

assert(
  abcDiaeresis.length === 2 &&
    abcDiaeresis[0].from.modifiers.mandatory[0] === "shift" &&
    abcDiaeresis[0].to[0].key_code === "u" &&
    abcDiaeresis[0].to[0].modifiers[0] === "right_option" &&
    abcDiaeresis[1].to[0].key_code === "page_up",
  "ABC Standard must prioritize diaeresis before Page Up"
);

assert(
  abcQuestion.length === 1 &&
    abcQuestion[0].from.modifiers.mandatory[0] === "shift" &&
    abcQuestion[0].to[0].modifiers[0] === "right_option" &&
    abcQuestion[0].to[0].modifiers[1] === "left_shift",
  "Caps+? must emit ¿"
);

assert(
  abcExclamation.length === 1 &&
    abcExclamation[0].from.modifiers.mandatory[0] === "shift" &&
    abcExclamation[0].to[0].modifiers[0] === "right_option",
  "Caps+! must emit ¡"
);

var sixtyPercentF1 = findManipulators(sixtyPercentRule, "1");
var sixtyPercentScreenshot = findManipulators(sixtyPercentRule, "s");

assert(
  sixtyPercentScreenshot.length === 2 &&
    sixtyPercentScreenshot.every(function (mapping) {
      return (
        mapping.to[0].key_code === "4" &&
        mapping.to[0].modifiers.join(",") ===
          "left_control,left_command,left_shift"
      );
    }),
  "Caps+S must copy a selected-area screenshot to the clipboard"
);

assert(
  sixtyPercentF1.length === 2 &&
    sixtyPercentF1[0].from.modifiers.optional.indexOf("shift") === -1 &&
    sixtyPercentF1[1].from.modifiers.optional.indexOf("shift") === -1,
  "60% F1 mappings must leave Caps+Shift+1 available for ¡"
);

process.stdout.write("Karabiner configuration is valid.\n");
