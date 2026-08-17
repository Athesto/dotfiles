var childProcess = require("child_process");
var path = require("path");

var generator = path.join(__dirname, "ascii-readline.karabiner.json.js");

var generated = childProcess.execFileSync(process.execPath, [generator], {
  encoding: "utf8",
});

var configuration = JSON.parse(generated);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findRule(description) {
  var rules = configuration.rules;
  var i;

  for (i = 0; i < rules.length; i += 1) {
    if (rules[i].description === description) {
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
  var activatorIndex = -1;
  var toggles = findManipulators(rule, "spacebar");
  var i;
  var manipulator;

  assert(
    rightShift.conditions[0].name === layer,
    rule.description + " has the wrong layer condition"
  );

  assert(
    rightShift.to[0].hold_down_milliseconds === 200 &&
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
      activatorIndex = i;
    }
  }

  assert(
    reverseCapsIndex >= 0 && reverseCapsIndex < activatorIndex,
    rule.description +
      " must handle Right Shift before the generic Caps activator"
  );

  assert(
    toggles.length === 2 &&
      toggles[0].to[0].set_variable.value === 1 &&
      toggles[1].to[0].set_variable.value === 0,
    rule.description + " must contain the Colemak toggle"
  );
}

assert(
  configuration.rules.length === 6,
  "Expected six independent Karabiner rules"
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

var grave = findManipulators(sixtyPercentRule, "escape")[0];

assert(
  grave.from.modifiers.optional[0] === "any",
  "60% Escape mapping must preserve modifiers"
);

assert(
  findManipulators(asciiRule, "escape").length === 0 &&
    findManipulators(vimRule, "escape").length === 0,
  "Layer rules must not contain the optional 60% Escape mapping"
);

validateLayer(asciiRule, "ascii_readline_layer");
validateLayer(vimRule, "vim_hybrid_layer");
validateLayer(legacyVimRule, "vim_hybrid_layer");

var vimW = findManipulators(vimRule, "w");
var vimX = findManipulators(vimRule, "x");
var vimBackspace = findManipulators(vimRule, "delete_or_backspace");

assert(
  vimW.length === 3 && vimX.length === 3,
  "Vim W and X must support character, word, and line deletion"
);

assert(
  vimW[0].from.modifiers.mandatory[0] === "option" &&
    vimW[1].from.modifiers.mandatory[0] === "command" &&
    vimW[2].from.modifiers.optional[0] === "any",
  "Vim W deletion priority is invalid"
);

assert(
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
  findManipulators(vimRule, "b").length === 0 &&
    findManipulators(vimRule, "f").length === 0,
  "Vim B and F must remain unassigned"
);

var legacyVimN = findManipulators(legacyVimRule, "n");

assert(
  legacyVimN.length === 1 &&
    legacyVimN[0].to[0].key_code === "n" &&
    legacyVimN[0].to[0].modifiers[0] === "left_option",
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
    abcEnye[0].to[0].modifiers[0] === "left_option" &&
    !abcEnye[1].from.modifiers,
  "ABC Standard must prioritize the tilde dead key before ñ"
);

assert(
  abcAccent.length === 2 &&
    abcAccent[0].to[0].key_code === "grave_accent_and_tilde" &&
    abcAccent[0].to[0].modifiers[0] === "left_option" &&
    abcAccent[1].to[0].key_code === "e",
  "ABC Standard must emit grave and acute dead keys"
);

assert(
  abcDiaeresis.length === 2 &&
    abcDiaeresis[0].from.modifiers.mandatory[0] === "shift" &&
    abcDiaeresis[0].to[0].key_code === "u" &&
    abcDiaeresis[0].to[0].modifiers[0] === "left_option" &&
    abcDiaeresis[1].to[0].key_code === "page_up",
  "ABC Standard must prioritize diaeresis before Page Up"
);

assert(
  abcQuestion.length === 1 &&
    abcQuestion[0].from.modifiers.mandatory[0] === "shift" &&
    abcQuestion[0].to[0].modifiers[0] === "left_option" &&
    abcQuestion[0].to[0].modifiers[1] === "left_shift",
  "Caps+? must emit ¿"
);

assert(
  abcExclamation.length === 1 &&
    abcExclamation[0].from.modifiers.mandatory[0] === "shift" &&
    abcExclamation[0].to[0].modifiers[0] === "left_option",
  "Caps+! must emit ¡"
);

var sixtyPercentF1 = findManipulators(sixtyPercentRule, "1");

assert(
  sixtyPercentF1.length === 2 &&
    sixtyPercentF1[0].from.modifiers.optional.indexOf("shift") === -1 &&
    sixtyPercentF1[1].from.modifiers.optional.indexOf("shift") === -1,
  "60% F1 mappings must leave Caps+Shift+1 available for ¡"
);

process.stdout.write("Karabiner configuration is valid.\n");
