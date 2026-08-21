var VERSION = "2026.08.20.11";
var ASCII_READLINE_LAYER = "ascii_readline_layer";
var VIM_HYBRID_LAYER = "vim_hybrid_layer";
var COLEMAK_DH = "colemak_dh";
var VIM_NAVIGATION_PROFILE = "vim_navigation_profile";
var INPUT_SOURCE_ABC_STANDARD = "abc_standard";
var INPUT_SOURCE_US_ALTGR_INTL = "us_altgr_intl";
var LAYOUT_NOTIFICATION = "keyboard_layout";
var LAYOUT_NOTIFICATION_DURATION_MS = 2000;
var CAPS_LOCK_HOLD_MS = 200;
var CAPS_DOUBLE_TAP_DELAY_MS = 300;
var CAPS_DOUBLE_TAP = "caps_double_tap";
var LAYER_INACTIVE = 0;
var LAYER_ACTIVE = 1;
var LAYOUT_QWERTY = 0;
var LAYOUT_COLEMAK_DH = 1;
var PROFILE_VIM_CLASSIC = 0;
var PROFILE_SEMICOLON_ENTER = 1;
var CHARACTER_OPTION = "right_option";
var SCROLL_STEP = 32;

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
};

var vimNavigationProfiles = [
  {
    name: "Vim Classic",
    mappings: {
      h: "left_arrow",
      j: "down_arrow",
      k: "up_arrow",
      l: "right_arrow",
      semicolon: "delete_or_backspace",
      m: "return_or_enter",
    },
  },
  {
    name: "Semicolon Enter",
    mappings: {
      h: "left_arrow",
      j: "down_arrow",
      k: "up_arrow",
      l: "right_arrow",
      semicolon: "return_or_enter",
      m: "delete_or_backspace",
    },
  },
];

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

function createVerticalScrollMapping(from, distance, conditions) {
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
        mouse_key: {
          vertical_wheel: distance,
        },
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
      modifiers: {
        mandatory: ["shift"],
      },
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

function createVimProfileToggleMapping(currentValue, nextValue, name) {
  var currentProfileConditions = createVimProfileConditions(currentValue);

  return {
    type: "basic",

    from: {
      key_code: "spacebar",
    },

    to: [
      {
        set_variable: {
          name: VIM_NAVIGATION_PROFILE,
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

    conditions: [variableIf(VIM_HYBRID_LAYER, LAYER_ACTIVE)].concat(
      currentProfileConditions
    ),
  };
}

function createVimProfileConditions(profile) {
  var conditions = [];
  var i;

  if (profile === PROFILE_VIM_CLASSIC) {
    for (i = 1; i < vimNavigationProfiles.length; i += 1) {
      conditions.push(variableUnless(VIM_NAVIGATION_PROFILE, i));
    }

    return conditions;
  }

  return [variableIf(VIM_NAVIGATION_PROFILE, profile)];
}

function createVimProfileToggleMappings() {
  var mappings = [];
  var i;
  var nextProfile;

  for (i = 0; i < vimNavigationProfiles.length; i += 1) {
    nextProfile = (i + 1) % vimNavigationProfiles.length;
    mappings.push(
      createVimProfileToggleMapping(
        i,
        nextProfile,
        vimNavigationProfiles[nextProfile].name
      )
    );
  }

  return mappings;
}

function createVimProfileMappings() {
  var manipulators = [];
  var i;

  for (i = 0; i < vimNavigationProfiles.length; i += 1) {
    manipulators = manipulators.concat(
      createMappingsFromObject(
        vimNavigationProfiles[i].mappings,
        [variableIf(VIM_HYBRID_LAYER, LAYER_ACTIVE)].concat(
          createVimProfileConditions(i)
        )
      )
    );
  }

  return manipulators;
}

function createCommonLayerMappings(layer) {
  var conditions = [variableIf(layer, LAYER_ACTIVE)];
  var manipulators = [
    createReverseCapsLockMapping(),
    createLayerActivator(layer, true),
    createLayerActivator(layer, false),
    createCapsLockMapping(layer),
    createMandatoryModifiedMapping(
      "escape",
      "grave_accent_and_tilde",
      ["command"],
      ["left_command"],
      conditions
    ),
    createMapping("escape", "grave_accent_and_tilde", conditions),
  ];

  return manipulators.concat(createColemakToggleMappings(layer));
}

function createABCStandardCharacterMappings(conditions) {
  return [
    /* Caps+? -> Right Option+Shift+/ -> ¿ */
    createMandatoryModifiedMapping(
      "slash",
      "slash",
      ["shift"],
      [CHARACTER_OPTION, "left_shift"],
      conditions
    ),

    /* Caps+! -> Right Option+1 -> ¡ */
    createMandatoryModifiedMapping(
      "1",
      "1",
      ["shift"],
      [CHARACTER_OPTION],
      conditions
    ),

    /* Caps+Shift+N -> Right Option+N -> tilde dead key */
    createMandatoryModifiedMapping(
      "n",
      "n",
      ["shift"],
      [CHARACTER_OPTION],
      conditions
    ),

    /* Caps+Shift+U -> Right Option+U -> diaeresis dead key */
    createMandatoryModifiedMapping(
      "u",
      "u",
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

    /* Caps+Shift+' -> Right Option+` -> grave dead key */
    createMandatoryModifiedMapping(
      "quote",
      "grave_accent_and_tilde",
      ["shift"],
      [CHARACTER_OPTION],
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
          modifiers: [CHARACTER_OPTION],
        },
      ],
      conditions: conditions,
    },
  ];
}

function createUSAltGrIntlCharacterMappings(conditions) {
  return [
    createModifiedMapping("quote", "quote", [CHARACTER_OPTION], conditions),
    createModifiedMapping("n", "n", [CHARACTER_OPTION], conditions),
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
  var layers = [ASCII_READLINE_LAYER, VIM_HYBRID_LAYER];
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
/* VIM HYBRID                                                                 */
/* -------------------------------------------------------------------------- */

function generateVimHybridRule(inputSource) {
  var conditions = [variableIf(VIM_HYBRID_LAYER, LAYER_ACTIVE)];

  var manipulators = createCommonLayerMappings(VIM_HYBRID_LAYER);

  manipulators = manipulators.concat(createVimProfileToggleMappings());

  /* Specific shifted dead keys must precede inherited base mappings. */
  manipulators = manipulators.concat(
    createInputSourceCharacterMappings(inputSource, conditions)
  );

  manipulators = manipulators.concat(
    createMappingsFromObject(vimHybridMappings, conditions)
  );

  manipulators = manipulators.concat(createVimProfileMappings());

  /*
   * Symmetric deletion
   *
   * Semicolon  -> character backward
   * X          -> character forward
   * Option+;   -> word backward
   * Option+X   -> word forward
   * Command+;  -> beginning of line
   * Command+X  -> end of line
   */

  manipulators.push(
    createMandatoryModifiedMapping(
      "x",
      "delete_forward",
      ["option"],
      ["left_option"],
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

  manipulators.push(createMapping("x", "delete_forward", conditions));

  manipulators.push(
    createVerticalScrollMapping("comma", -SCROLL_STEP, conditions)
  );

  manipulators.push(
    createVerticalScrollMapping("period", SCROLL_STEP, conditions)
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
    description: createRuleDescription(
      inputSource === INPUT_SOURCE_ABC_STANDARD
        ? "Vim Hybrid Layer - ABC Standard"
        : "Vim Hybrid Layer - US-AltGr-Intl Legacy"
    ),

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
    title: "Athesto Keyboard — " + VERSION,

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
