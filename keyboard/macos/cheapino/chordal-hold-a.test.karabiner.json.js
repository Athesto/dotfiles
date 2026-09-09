var VERSION = "2026.08.25.14";
var HOLD_MS = 1000;
var A_SHIFT_MODE = "release_order_a_shift_mode";

var IMMEDIATE_TAP_KEYS = [
  "q", "w", "e", "r", "t",
  "g",
  "z", "x", "c", "v", "b",
  "spacebar"
];

var OPPOSITE_REGULAR_KEYS = [
  "y", "u", "i", "o", "p",
  "h",
  "n", "m", "comma", "period", "slash"
];

var SAME_HAND_MOD_TAP_KEYS = ["s", "d", "f"];
var OPPOSITE_MOD_TAP_KEYS = ["j", "k", "l", "semicolon"];

function main(rule) {
  return {
    title: "Release-order A/Shift Test - " + VERSION,
    rules: [rule]
  };
}

function createRule() {
  return {
    description: "TEST - A/Shift groups and release order - " + VERSION,
    manipulators: createManipulators()
  };
}

function createManipulators() {
  var pendingKeys = getPendingKeys();

  return [createSameOrderRollManipulator("l")]
    .concat(createReleaseOrderManipulators(pendingKeys))
    .concat(createShiftModeManipulators(getAllTypingKeys()))
    .concat([createTimedAHoldTapManipulator()]);
}

function createSameOrderRollManipulator(key) {
  return {
    type: "basic",
    from: {
      simultaneous: [
        { key_code: "a" },
        { key_code: key }
      ],
      simultaneous_options: {
        key_down_order: "strict",
        key_up_order: "strict"
      },
      modifiers: { optional: ["any"] }
    },
    to: [
      { key_code: "a" },
      { key_code: key }
    ],
    parameters: {
      "basic.simultaneous_threshold_milliseconds": HOLD_MS
    }
  };
}

function getPendingKeys() {
  return OPPOSITE_REGULAR_KEYS
    .concat(SAME_HAND_MOD_TAP_KEYS)
    .concat(OPPOSITE_MOD_TAP_KEYS);
}

function getAllTypingKeys() {
  return IMMEDIATE_TAP_KEYS.concat(getPendingKeys());
}

function createReleaseOrderManipulators(keys) {
  return keys.map(function(key) {
    return {
      type: "basic",
      from: {
        simultaneous: [
          { key_code: "a" },
          { key_code: key }
        ],
        simultaneous_options: {
          key_down_order: "strict",
          key_up_order: "strict_inverse",
          to_after_key_up: [setVariable(A_SHIFT_MODE, 0)]
        },
        modifiers: { optional: ["any"] }
      },
      to: [
        setVariable(A_SHIFT_MODE, 1),
        {
          key_code: key,
          modifiers: ["left_shift"]
        }
      ],
      parameters: {
        "basic.simultaneous_threshold_milliseconds": HOLD_MS
      }
    };
  });
}

function createShiftModeManipulators(keys) {
  return keys.map(function(key) {
    return {
      type: "basic",
      from: {
        key_code: key,
        modifiers: { optional: ["any"] }
      },
      to: [
        {
          key_code: key,
          modifiers: ["left_shift"]
        }
      ],
      conditions: [variableIf(A_SHIFT_MODE, 1)]
    };
  });
}

function createTimedAHoldTapManipulator() {
  return {
    type: "basic",
    from: {
      key_code: "a",
      modifiers: { optional: ["any"] }
    },
    to_if_alone: [
      { key_code: "a", halt: true }
    ],
    to_if_held_down: [
      { key_code: "left_shift" }
    ],
    parameters: {
      "basic.to_if_held_down_threshold_milliseconds": HOLD_MS
    }
  };
}

function setVariable(name, value) {
  return {
    set_variable: {
      name: name,
      value: value
    }
  };
}

function variableIf(name, value) {
  return {
    type: "variable_if",
    name: name,
    value: value
  };
}

var rule = createRule();
var karabinerBindings = main(rule);

if (typeof process !== "undefined" && process.versions && process.versions.node) {
  console.log(JSON.stringify(karabinerBindings, null, 2));
}

rule;
