var ASCII_READLINE_LAYER = "ascii_readline_layer";
var VIM_HYBRID_LAYER = "vim_hybrid_layer";
var COLEMAK_DH = "colemak_dh";
var INPUT_SOURCE_ABC_STANDARD = "abc_standard";
var INPUT_SOURCE_US_ALTGR_INTL = "us_altgr_intl";
var LAYOUT_NOTIFICATION = "keyboard_layout";
var LAYOUT_NOTIFICATION_DURATION_MS = 400;

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

var vimHybridMappings = {
  /*
   * ASCII
   */
  i: "tab",
  m: "return_or_enter",
  open_bracket: "escape",

  /*
   * Vim navigation
   */
  h: "left_arrow",
  j: "down_arrow",
  k: "up_arrow",
  l: "right_arrow",
  u: "page_up",
  d: "page_down",

  /*
   * Line navigation
   */
  a: "home",
  e: "end",
};

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
    description: "Right Command as Right Option",

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

function createLayerActivator(layer) {
  return {
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
          value: 1,
        },
      },
    ],

    to_after_key_up: [
      {
        set_variable: {
          name: layer,
          value: 0,
        },
      },
    ],

    to_if_alone: [
      {
        key_code: "escape",
      },
    ],
  };
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
        hold_down_milliseconds: 200,
      },
      {
        key_code: "vk_none",
      },
    ],

    conditions: [variableIf(layer, 1)],
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
        hold_down_milliseconds: 200,
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

function createLayoutToggleMapping(layer, currentValue, nextValue, name) {
  var currentLayoutCondition =
    currentValue === 1
      ? variableIf(COLEMAK_DH, 1)
      : variableUnless(COLEMAK_DH, 1);

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
    createLayoutToggleMapping(layer, 0, 1, "Colemak-DH"),
    createLayoutToggleMapping(layer, 1, 0, "QWERTY"),
  ];
}

function createCommonLayerMappings(layer) {
  var manipulators = [
    createReverseCapsLockMapping(),
    createLayerActivator(layer),
    createCapsLockMapping(layer),
  ];

  return manipulators.concat(createColemakToggleMappings(layer));
}

function createABCStandardCharacterMappings(conditions) {
  return [
    /* Caps+? -> Option+Shift+/ -> ¿ */
    createMandatoryModifiedMapping(
      "slash",
      "slash",
      ["shift"],
      ["left_option", "left_shift"],
      conditions
    ),

    /* Caps+! -> Option+1 -> ¡ */
    createMandatoryModifiedMapping(
      "1",
      "1",
      ["shift"],
      ["left_option"],
      conditions
    ),

    /* Caps+Shift+N -> Option+N -> tilde dead key */
    createMandatoryModifiedMapping(
      "n",
      "n",
      ["shift"],
      ["left_option"],
      conditions
    ),

    /* Caps+Shift+U -> Option+U -> diaeresis dead key */
    createMandatoryModifiedMapping(
      "u",
      "u",
      ["shift"],
      ["left_option"],
      conditions
    ),

    /*
     * Caps+N -> Option+N, N -> ñ
     */
    {
      type: "basic",
      from: {
        key_code: "n",
      },
      to: [
        {
          key_code: "n",
          modifiers: ["left_option"],
        },
        {
          key_code: "n",
        },
      ],
      conditions: conditions,
    },

    /* Caps+Shift+' -> Option+` -> grave dead key */
    createMandatoryModifiedMapping(
      "quote",
      "grave_accent_and_tilde",
      ["shift"],
      ["left_option"],
      conditions
    ),
    {
      type: "basic",
      from: {
        key_code: "quote",
      },
      to: [
        {
          key_code: "e",
          modifiers: ["left_option"],
        },
      ],
      conditions: conditions,
    },
  ];
}

function createUSAltGrIntlCharacterMappings(conditions) {
  return [
    createModifiedMapping("quote", "quote", ["left_option"], conditions),
    createModifiedMapping("n", "n", ["left_option"], conditions),
  ];
}

function createInputSourceCharacterMappings(inputSource, conditions) {
  if (inputSource === INPUT_SOURCE_ABC_STANDARD) {
    return createABCStandardCharacterMappings(conditions);
  }

  return createUSAltGrIntlCharacterMappings(conditions);
}

/* -------------------------------------------------------------------------- */
/* 60% KEYBOARD                                                               */
/* -------------------------------------------------------------------------- */

function createGraveAccentMapping() {
  return {
    type: "basic",

    /*
     * Esc       -> `
     * Shift+Esc -> ~
     */
    from: {
      key_code: "escape",
      modifiers: {
        optional: ["any"],
      },
    },

    to: [
      {
        key_code: "grave_accent_and_tilde",
      },
    ],
  };
}

function generateFunctionMappings(layer) {
  var manipulators = [];
  var keys = Object.keys(functionMappings);
  var conditions = [variableIf(layer, 1)];

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
  var manipulators = [createGraveAccentMapping()];
  var layers = [ASCII_READLINE_LAYER, VIM_HYBRID_LAYER];
  var i;
  var conditions;

  for (i = 0; i < layers.length; i += 1) {
    conditions = [variableIf(layers[i], 1)];

    manipulators.push(createMapping("s", "print_screen", conditions));

    manipulators = manipulators.concat(generateFunctionMappings(layers[i]));
  }

  return {
    description: "60% Keyboard Compatibility",
    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* ASCII / READLINE                                                           */
/* -------------------------------------------------------------------------- */

function generateAsciiReadlineRule() {
  var conditions = [variableIf(ASCII_READLINE_LAYER, 1)];

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
    description: "ASCII/Readline Layer",

    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* VIM HYBRID                                                                 */
/* -------------------------------------------------------------------------- */

function generateVimHybridRule(inputSource) {
  var conditions = [variableIf(VIM_HYBRID_LAYER, 1)];

  var manipulators = createCommonLayerMappings(VIM_HYBRID_LAYER);

  /* Specific shifted dead keys must precede inherited base mappings. */
  manipulators = manipulators.concat(
    createInputSourceCharacterMappings(inputSource, conditions)
  );

  manipulators = manipulators.concat(
    createMappingsFromObject(vimHybridMappings, conditions)
  );

  /*
   * Symmetric deletion
   *
   * W          -> character backward
   * X          -> character forward
   * Option+W   -> word backward
   * Option+X   -> word forward
   * Command+W  -> beginning of line
   * Command+X  -> end of line
   */

  manipulators.push(
    createMandatoryModifiedMapping(
      "w",
      "delete_or_backspace",
      ["option"],
      ["left_option"],
      conditions
    )
  );

  manipulators.push(
    createMandatoryModifiedMapping(
      "x",
      "delete_forward",
      ["option"],
      ["left_option"],
      conditions
    )
  );

  /*
   * Cmd+W / Cmd+X
   *
   * Delete to the beginning or end of line.
   */
  manipulators.push(
    createMandatorySequenceMapping(
      "w",
      ["command"],
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

  manipulators.push(
    createMandatorySequenceMapping(
      "x",
      ["command"],
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

  manipulators.push(createMapping("w", "delete_or_backspace", conditions));

  manipulators.push(createMapping("x", "delete_forward", conditions));

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
    description:
      inputSource === INPUT_SOURCE_ABC_STANDARD
        ? "Vim Hybrid Layer - ABC Standard"
        : "Vim Hybrid Layer - US-AltGr-Intl Legacy",

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

    manipulators.push(createMapping(from, to, [variableIf(COLEMAK_DH, 1)]));
  }

  return {
    description: "Colemak-DH ANSI",
    manipulators: manipulators,
  };
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

var rightCommandAsOptionRule = createRightCommandAsOptionRule();

var sixtyPercentCompatibilityRule = generate60PercentCompatibilityRule();

var asciiReadlineRule = generateAsciiReadlineRule();

var vimHybridRule = generateVimHybridRule(INPUT_SOURCE_ABC_STANDARD);

var vimHybridUsAltGrIntlLegacyRule = generateVimHybridRule(
  INPUT_SOURCE_US_ALTGR_INTL
);

var colemakDHRule = generateColemakDHRule();

function main() {
  return {
    title: "Athesto Keyboard",

    rules: [
      rightCommandAsOptionRule,
      sixtyPercentCompatibilityRule,
      asciiReadlineRule,
      vimHybridRule,
      vimHybridUsAltGrIntlLegacyRule,
      colemakDHRule,
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* OUTPUT                                                                     */
/* -------------------------------------------------------------------------- */

var karabinerBindings = main();

console.log(JSON.stringify(karabinerBindings, null, 2));

// rightCommandAsOptionRule
// sixtyPercentCompatibilityRule
// asciiReadlineRule
vimHybridRule;
// vimHybridUsAltGrIntlLegacyRule
// colemakDHRule
