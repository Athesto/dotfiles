var VERSION = "30.1";
var ENABLE_CAPS_DOUBLE_TAP_ESCAPE = false;
var ASCII_READLINE_LAYER = "ascii_readline_layer";
var CAPS_UTILITY_ABC_STANDARD_LAYER = "caps_utility_abc_standard_layer";
var COLEMAK_DH = "colemak_dh";
var LAYOUT_NOTIFICATION = "keyboard_layout";
var LAYOUT_NOTIFICATION_DURATION_MS = 2000;
var CAPS_LOCK_HOLD_MS = 200;
var CAPS_DOUBLE_TAP_DELAY_MS = 300;
var CAPS_DOUBLE_TAP = "caps_double_tap";
var LAYER_INACTIVE = 0;
var LAYER_ACTIVE = 1;
var LAYOUT_QWERTY = 0;
var LAYOUT_COLEMAK_DH = 1;
var CHARACTER_OPTION = "right_option";

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

function main(rules) {
  return {
    title: "Athesto Keyboard — " + VERSION,
    rules: rules,
  };
}

/* -------------------------------------------------------------------------- */
/* MAPPINGS                                                                   */
/* -------------------------------------------------------------------------- */

var asciiReadlineMappings = {
  /*
   * ASCII
   */
  h: "delete_or_backspace",
  i: "tab",
  m: "return_or_enter",
  open_bracket: "escape",

  /*
   * Readline
   */
  a: "home",
  e: "end",
  b: "left_arrow",
  f: "right_arrow",
  p: "up_arrow",
  n: "down_arrow",

  /*
   * Page navigation
   */
  y: "page_up",
  v: "page_down",

  /*
   * Editing
   */
  d: "delete_forward",
};

var capsUtilityABCStandardMappings = {
  /*
   * ASCII
   */
  i: "tab",
  g: "escape",
  o: "delete_forward",
  open_bracket: "escape",

  /*
   * Vim navigation
   */
  u: "page_up",
  d: "page_down",

  /*
   * Line navigation
   */
  a: "home",
  e: "end",

  /* Vim Classic */
  h: "left_arrow",
  j: "down_arrow",
  k: "up_arrow",
  l: "right_arrow",
  semicolon: "delete_or_backspace",
  m: "return_or_enter",
};

var applicationShortcutKeys = ["w", "r", "t", "f", "z", "x", "c", "v"];

var functionMappings = {
  1: "f1",
  2: "f2",
  3: "f3",
  4: "f4",
  5: "f5",
  6: "f6",
  7: "f7",
  8: "f8",
  9: "f9",
  0: "f10",
  hyphen: "f11",
  equal_sign: "f12",
};

var colemakMappings = {
  /*
   * Colemak-DH ANSI
   *
   * Q W F P B   J L U Y ;
   * A R S T G   M N E I O
   *  X C D V Z   K H , . /
   */

  e: "f",
  r: "p",
  t: "b",
  y: "j",
  u: "l",
  i: "u",
  o: "y",
  p: "semicolon",

  s: "r",
  d: "s",
  f: "t",
  h: "m",
  j: "n",
  k: "e",
  l: "i",
  semicolon: "o",

  z: "x",
  x: "c",
  c: "d",
  b: "z",
  n: "k",
  m: "h",
};

/* -------------------------------------------------------------------------- */
/* CONDITIONS                                                                 */
/* -------------------------------------------------------------------------- */

function variableIf(name, value) {
  return {
    type: "variable_if",
    name: name,
    value: value,
  };
}

function variableUnless(name, value) {
  return {
    type: "variable_unless",
    name: name,
    value: value,
  };
}

function createRuleDescription(name) {
  return name + " — " + VERSION;
}

/* -------------------------------------------------------------------------- */
/* GENERIC HELPERS                                                            */
/* -------------------------------------------------------------------------- */

function createMapping(from, to, conditions) {
  return {
    type: "basic",

    from: {
      key_code: from,
      modifiers: {
        optional: ["any"],
      },
    },

    to: [
      {
        key_code: to,
      },
    ],

    conditions: conditions,
  };
}

function createModifiedMapping(from, to, modifiers, conditions) {
  return {
    type: "basic",

    from: {
      key_code: from,
      modifiers: {
        optional: ["any"],
      },
    },

    to: [
      {
        key_code: to,
        modifiers: modifiers,
      },
    ],

    conditions: conditions,
  };
}

function createMandatoryModifiedMapping(
  from,
  to,
  mandatoryModifiers,
  toModifiers,
  conditions
) {
  return {
    type: "basic",

    from: {
      key_code: from,
      modifiers: {
        mandatory: mandatoryModifiers,
      },
    },

    to: [
      {
        key_code: to,
        modifiers: toModifiers,
      },
    ],

    conditions: conditions,
  };
}

function createRightCommandAsOptionRule() {
  return {
    description: createRuleDescription("Right Command as Right Option"),

    manipulators: [
      {
        type: "basic",

        from: {
          key_code: "right_command",
          modifiers: {
            optional: ["any"],
          },
        },

        to: [
          {
            key_code: "right_option",
          },
        ],
      },
    ],
  };
}

function createMandatorySequenceMapping(
  from,
  mandatoryModifiers,
  sequence,
  conditions
) {
  return {
    type: "basic",

    from: {
      key_code: from,
      modifiers: {
        mandatory: mandatoryModifiers,
      },
    },

    to: sequence,

    conditions: conditions,
  };
}

function createSequenceMapping(from, sequence, conditions) {
  return {
    type: "basic",

    from: {
      key_code: from,
      modifiers: {
        optional: ["any"],
      },
    },

    to: sequence,

    conditions: conditions,
  };
}

function createMappingsFromObject(mappings, conditions) {
  var manipulators = [];
  var keys = Object.keys(mappings);

  var i;
  var from;
  var to;

  for (i = 0; i < keys.length; i += 1) {
    from = keys[i];
    to = mappings[from];

    manipulators.push(createMapping(from, to, conditions));
  }

  return manipulators;
}

/* -------------------------------------------------------------------------- */
/* LAYERS                                                                     */
/* -------------------------------------------------------------------------- */

function createLayerActivator(layer, isSecondTap) {
  var activator = {
    type: "basic",

    from: {
      key_code: "caps_lock",
      modifiers: {
        optional: ["any"],
      },
    },

    to: [
      {
        set_variable: {
          name: layer,
          value: LAYER_ACTIVE,
        },
      },
    ],

    to_after_key_up: [
      {
        set_variable: {
          name: layer,
          value: LAYER_INACTIVE,
        },
      },
    ],
  };

  if (!ENABLE_CAPS_DOUBLE_TAP_ESCAPE) {
    return activator;
  }

  if (isSecondTap) {
    activator.to_if_alone = [
      {
        key_code: "escape",
      },
      {
        set_variable: {
          name: CAPS_DOUBLE_TAP,
          value: 0,
        },
      },
    ];
    activator.conditions = [variableIf(CAPS_DOUBLE_TAP, 1)];
  } else {
    activator.to_if_alone = [
      {
        set_variable: {
          name: CAPS_DOUBLE_TAP,
          value: 1,
        },
      },
    ];
    activator.to_delayed_action = {
      to_if_invoked: [
        {
          set_variable: {
            name: CAPS_DOUBLE_TAP,
            value: 0,
          },
        },
      ],
      to_if_canceled: [
        {
          set_variable: {
            name: CAPS_DOUBLE_TAP,
            value: 0,
          },
        },
      ],
    };
    activator.parameters = {
      "basic.to_delayed_action_delay_milliseconds": CAPS_DOUBLE_TAP_DELAY_MS,
    };
    activator.conditions = [variableUnless(CAPS_DOUBLE_TAP, 1)];
  }

  return activator;
}

function createCapsLockMapping(layer) {
  return {
    type: "basic",

    from: {
      key_code: "right_shift",
      modifiers: {
        optional: ["any"],
      },
    },

    to: [
      {
        key_code: "caps_lock",
        hold_down_milliseconds: CAPS_LOCK_HOLD_MS,
      },
      {
        key_code: "vk_none",
      },
    ],

    conditions: [variableIf(layer, LAYER_ACTIVE)],
  };
}

function createReverseCapsLockMapping() {
  return {
    type: "basic",

    from: {
      key_code: "caps_lock",
      modifiers: {
        mandatory: ["right_shift"],
        optional: ["any"],
      },
    },

    to: [
      {
        key_code: "caps_lock",
        hold_down_milliseconds: CAPS_LOCK_HOLD_MS,
      },
      {
        key_code: "vk_none",
      },
    ],
  };
}

function layoutNotification(text) {
  return {
    set_notification_message: {
      id: LAYOUT_NOTIFICATION,
      text: text,
    },
  };
}

function createColemakToggleMapping(layer, currentValue, nextValue, name) {
  var currentLayoutCondition =
    currentValue === LAYOUT_COLEMAK_DH
      ? variableIf(COLEMAK_DH, LAYOUT_COLEMAK_DH)
      : variableUnless(COLEMAK_DH, LAYOUT_COLEMAK_DH);

  return {
    type: "basic",

    from: {
      key_code: "spacebar",
    },

    to: [
      {
        set_variable: {
          name: COLEMAK_DH,
          value: nextValue,
        },
      },
      layoutNotification(name),
    ],

    to_delayed_action: {
      to_if_invoked: [layoutNotification("")],
      to_if_canceled: [layoutNotification("")],
    },

    parameters: {
      "basic.to_delayed_action_delay_milliseconds":
        LAYOUT_NOTIFICATION_DURATION_MS,
    },

    conditions: [variableIf(layer, 1), currentLayoutCondition],
  };
}

function createColemakToggleMappings(layer) {
  return [
    createColemakToggleMapping(
      layer,
      LAYOUT_QWERTY,
      LAYOUT_COLEMAK_DH,
      "Colemak-DH"
    ),
    createColemakToggleMapping(
      layer,
      LAYOUT_COLEMAK_DH,
      LAYOUT_QWERTY,
      "QWERTY"
    ),
  ];
}

function createApplicationShortcutMappings(conditions) {
  var manipulators = [];
  var i;

  for (i = 0; i < applicationShortcutKeys.length; i += 1) {
    manipulators.push(
      createModifiedMapping(
        applicationShortcutKeys[i],
        applicationShortcutKeys[i],
        ["left_command"],
        conditions
      )
    );
  }

  return manipulators;
}

function createCommonLayerMappings(layer) {
  var conditions = [variableIf(layer, LAYER_ACTIVE)];
  var manipulators = [
    createReverseCapsLockMapping(),
  ];

  if (ENABLE_CAPS_DOUBLE_TAP_ESCAPE) {
    manipulators.push(createLayerActivator(layer, true));
  }

  manipulators.push(
    createLayerActivator(layer, false),
    createCapsLockMapping(layer),
    createMandatoryModifiedMapping(
      "escape",
      "grave_accent_and_tilde",
      ["command"],
      ["left_command"],
      conditions
    ),
    createMapping("escape", "grave_accent_and_tilde", conditions)
  );

  return manipulators.concat(createColemakToggleMappings(layer));
}

function createABCStandardCharacterMappings(conditions) {
  return [
    /*
     * Caps+Shift+; -> Delete (experimental alias for Caps+O).
     * Option and Command pass through, matching the Backspace mapping:
     * Caps+Option+; -> Option+Backspace
     * Caps+Command+; -> Command+Backspace
     * Caps+Shift+Option+; -> Option+Delete
     * Caps+Shift+Command+; -> Command+Delete
     */
    {
      type: "basic",
      from: {
        key_code: "semicolon",
        modifiers: {
          mandatory: ["shift"],
          optional: ["option", "command"],
        },
      },
      to: [
        {
          key_code: "delete_forward",
        },
      ],
      conditions: conditions,
    },

    /* Caps+Shift+/ -> Right Option+1 -> ¡ */
    createMandatoryModifiedMapping(
      "slash",
      "1",
      ["shift"],
      [CHARACTER_OPTION],
      conditions
    ),

    /* Caps+/ -> Right Option+Shift+/ -> ¿ */
    createModifiedMapping(
      "slash",
      "slash",
      [CHARACTER_OPTION, "left_shift"],
      conditions
    ),

    /* Caps+Shift+P -> Right Option+U -> diaeresis dead key */
    createMandatoryModifiedMapping(
      "p",
      "u",
      ["shift"],
      [CHARACTER_OPTION],
      conditions
    ),

    /* Caps+P -> Right Option+E -> acute dead key */
    createModifiedMapping("p", "e", [CHARACTER_OPTION], conditions),

    /* Caps+Shift+N -> Right Option+N -> tilde dead key */
    createMandatoryModifiedMapping(
      "n",
      "n",
      ["shift"],
      [CHARACTER_OPTION],
      conditions
    ),

    /*
     * Caps+N -> Right Option+N, N -> ñ
     */
    {
      type: "basic",
      from: {
        key_code: "n",
      },
      to: [
        {
          key_code: "n",
          modifiers: [CHARACTER_OPTION],
        },
        {
          key_code: "n",
        },
      ],
      conditions: conditions,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/* 60% KEYBOARD                                                               */
/* -------------------------------------------------------------------------- */

function generateFunctionMappings(layer) {
  var manipulators = [];
  var keys = Object.keys(functionMappings);
  var conditions = [variableIf(layer, LAYER_ACTIVE)];

  var i;
  var from;
  var to;

  for (i = 0; i < keys.length; i += 1) {
    from = keys[i];
    to = functionMappings[from];

    /*
     * fn is intentional on macOS.
     *
     * Caps+2 -> fn+F2 -> real F2
     */
    var mapping = createModifiedMapping(from, to, ["fn"], conditions);

    /* Caps+Shift+1 is reserved for ¡ in the ABC Vim layer. */
    if (from === "1") {
      mapping.from.modifiers.optional = [
        "command",
        "control",
        "option",
        "caps_lock",
        "fn",
      ];
    }

    manipulators.push(mapping);
  }

  return manipulators;
}

function generate60PercentCompatibilityRule() {
  var manipulators = [
    createMandatoryModifiedMapping(
      "escape",
      "grave_accent_and_tilde",
      ["left_shift"],
      ["left_shift"],
      []
    ),
  ];
  var layers = [ASCII_READLINE_LAYER, CAPS_UTILITY_ABC_STANDARD_LAYER];
  var i;
  var conditions;

  for (i = 0; i < layers.length; i += 1) {
    conditions = [variableIf(layers[i], LAYER_ACTIVE)];

    manipulators.push(
      createModifiedMapping(
        "s",
        "4",
        ["left_control", "left_command", "left_shift"],
        conditions
      )
    );

    manipulators = manipulators.concat(generateFunctionMappings(layers[i]));
  }

  return {
    description: createRuleDescription("60% Keyboard Compatibility"),
    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* ASCII / READLINE                                                           */
/* -------------------------------------------------------------------------- */

function generateAsciiReadlineRule() {
  var conditions = [variableIf(ASCII_READLINE_LAYER, LAYER_ACTIVE)];

  var manipulators = createCommonLayerMappings(ASCII_READLINE_LAYER);

  manipulators = manipulators.concat(
    createMappingsFromObject(asciiReadlineMappings, conditions)
  );

  /*
   * C-w
   *
   * Delete previous word.
   */
  manipulators.push(
    createModifiedMapping(
      "w",
      "delete_or_backspace",
      ["left_option"],
      conditions
    )
  );

  /*
   * C-u
   *
   * Delete to beginning.
   */
  manipulators.push(
    createSequenceMapping(
      "u",
      [
        {
          key_code: "home",
          modifiers: ["left_shift"],
        },
        {
          key_code: "delete_or_backspace",
        },
      ],
      conditions
    )
  );

  /*
   * C-k
   *
   * Delete to end.
   */
  manipulators.push(
    createSequenceMapping(
      "k",
      [
        {
          key_code: "end",
          modifiers: ["left_shift"],
        },
        {
          key_code: "delete_forward",
        },
      ],
      conditions
    )
  );

  /*
   * Accent dead key.
   */
  manipulators.push(
    createModifiedMapping("quote", "quote", ["left_option"], conditions)
  );

  return {
    description: createRuleDescription("ASCII/Readline Layer"),

    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* CAPS UTILITY - ABC STANDARD                                                 */
/* -------------------------------------------------------------------------- */

function generateCapsUtilityABCStandardRule() {
  var conditions = [
    variableIf(CAPS_UTILITY_ABC_STANDARD_LAYER, LAYER_ACTIVE),
  ];

  var manipulators = createCommonLayerMappings(
    CAPS_UTILITY_ABC_STANDARD_LAYER
  );

  /* Spanish characters must precede inherited base mappings. */
  manipulators = manipulators.concat(
    createABCStandardCharacterMappings(conditions)
  );

  manipulators = manipulators.concat(
    createMappingsFromObject(capsUtilityABCStandardMappings, conditions)
  );

  manipulators = manipulators.concat(
    createApplicationShortcutMappings(conditions)
  );

  /*
   * Caps+Backspace -> Option+Backspace
   *
   * A direct, mnemonic shortcut for deleting the previous word.
   */
  manipulators.push(
    createModifiedMapping(
      "delete_or_backspace",
      "delete_or_backspace",
      ["left_option"],
      conditions
    )
  );

  return {
    description: createRuleDescription("Caps Utility Layer - ABC Standard"),

    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* COLEMAK-DH                                                                 */
/* -------------------------------------------------------------------------- */

function generateColemakDHRule() {
  var manipulators = [];
  var keys = Object.keys(colemakMappings);

  var i;
  var from;
  var to;

  for (i = 0; i < keys.length; i += 1) {
    from = keys[i];
    to = colemakMappings[from];

    manipulators.push(
      createMapping(from, to, [variableIf(COLEMAK_DH, LAYOUT_COLEMAK_DH)])
    );
  }

  return {
    description: createRuleDescription("Colemak-DH ANSI"),
    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* OUTPUT                                                                     */
/* -------------------------------------------------------------------------- */

var rightCommandAsOptionRule = createRightCommandAsOptionRule();
var sixtyPercentCompatibilityRule = generate60PercentCompatibilityRule();
var asciiReadlineRule = generateAsciiReadlineRule();
var capsUtilityABCStandardRule = generateCapsUtilityABCStandardRule();
var colemakDHRule = generateColemakDHRule();
var rules = [
  rightCommandAsOptionRule,
  sixtyPercentCompatibilityRule,
  asciiReadlineRule,
  capsUtilityABCStandardRule,
  colemakDHRule,
];

var karabinerBindings = main(rules);

console.log(JSON.stringify(karabinerBindings, null, 2));
