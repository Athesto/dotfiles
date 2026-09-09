var VERSION = "2026.08.25.9";
var HOLD_MS = 200;
var RELEASE_ORDER_HOLD_ENABLED = true;
var CAPS_DOUBLE_TAP_DELAY_MS = 300;
var LAYOUT_NOTIFICATION_DURATION_MS = 2000;
var CAPS_DOUBLE_TAP = "cheapino_caps_double_tap";
var SIDE_ALIAS_MODE = "cheapino_side_alias_mode";
var SIDE_NATIVE = 0;
var SIDE_ALIASES = 1;
var SIDE_MODE_NAMES = ["Sides: Native", "Sides: Aliases"];
var SIDE_MODE_NOTIFICATION = "cheapino_side_mode_notification";
var BASE_LAYOUT = "cheapino_base_layout";
var BASE_QWERTY = 0;
var BASE_COLEMAK_DH = 1;
var BASE_LAYOUT_COUNT = 2;
var BASE_LAYOUT_NAMES = ["QWERTY", "Colemak-DH"];
var LAYOUT_NOTIFICATION = "cheapino_base_layout_notification";
var UTILITY_LAYER = "cheapino_utility_layer";
var NUMBER_SYMBOL_LAYER = "cheapino_number_symbol_layer";
var FUNCTION_MEDIA_LAYER = "cheapino_function_media_layer";
var LAYER_INACTIVE = 0;
var LAYER_ACTIVE = 1;
var CHARACTER_OPTION = "right_option";

var LEFT_HAND_REGULAR_KEYS = [
  "q", "w", "e", "r", "t", "g", "z", "x", "c", "v", "b",
];
var RIGHT_HAND_REGULAR_KEYS = [
  "y", "u", "i", "o", "p", "h", "n", "m", "comma", "period", "slash",
];
var LEFT_HAND_KEYS = LEFT_HAND_REGULAR_KEYS.concat(["a", "s", "d", "f"]);
var RIGHT_HAND_KEYS = RIGHT_HAND_REGULAR_KEYS.concat([
  "j", "k", "l", "semicolon",
]);
var BASE_TYPING_KEYS = LEFT_HAND_KEYS.concat(
  RIGHT_HAND_KEYS,
  ["spacebar"]
);
var SHIFT_SYMBOL_KEYS = ["comma", "period", "slash"];

function main(rule) {
  return {
    title: "Athesto Cheapino - " + VERSION,
    rules: [rule],
  };
}

function createRule() {
  var holdMode = RELEASE_ORDER_HOLD_ENABLED
    ? "Release Order Hold"
    : "Timed Hold";
  var description =
    "Cheapino 36 - " + holdMode + " - Runtime Side Mode - time ms - " +
    VERSION;

  return {
    description: description.replace("time", String(HOLD_MS)),
    manipulators: generateManipulators(),
  };
}

function keyEvent(keyCode, modifiers) {
  var event = { key_code: keyCode };

  if (modifiers) {
    event.modifiers = modifiers;
  }

  return event;
}

function consumerEvent(keyCode) {
  return { consumer_key_code: keyCode };
}

var baseModifierHolds = {
  a: "left_shift",
  s: "left_control",
  d: "left_option",
  f: "left_command",
  j: "right_command",
  k: "right_option",
  l: "right_control",
  semicolon: "right_shift",
};

var colemakMappings = {
  e: "f",
  r: "p",
  t: "b",
  y: "j",
  u: "l",
  i: "u",
  o: "y",
  p: "semicolon",
  h: "m",
  v: "d",
  b: "v",
  n: "k",
  m: "h",
};

var colemakHomeRowTaps = {
  a: "a",
  s: "r",
  d: "s",
  f: "t",
  j: "n",
  k: "e",
  l: "i",
  semicolon: "o",
};

var utilityMappings = {
  s: [keyEvent("left_control")],
  f: [keyEvent("left_command")],
  e: [keyEvent("end")],
  u: [keyEvent("page_up")],
  i: [keyEvent("tab")],
  o: [keyEvent("delete_forward")],
  p: [keyEvent("e", [CHARACTER_OPTION])],
  g: [keyEvent("escape")],
  h: [keyEvent("left_arrow")],
  j: [keyEvent("down_arrow")],
  k: [keyEvent("up_arrow")],
  l: [keyEvent("right_arrow")],
  semicolon: [keyEvent("delete_or_backspace")],
  n: [keyEvent("n", [CHARACTER_OPTION]), keyEvent("n")],
  m: [keyEvent("return_or_enter")],
  slash: [keyEvent("slash", [CHARACTER_OPTION, "left_shift"])],
};

var numberSymbolMappings = {
  q: [keyEvent("1")],
  w: [keyEvent("2")],
  e: [keyEvent("3")],
  r: [keyEvent("4")],
  t: [keyEvent("5")],
  y: [keyEvent("6")],
  u: [keyEvent("7")],
  i: [keyEvent("8")],
  o: [keyEvent("9")],
  p: [keyEvent("0")],
};

var functionMediaMappings = {
  u: [keyEvent("f1")],
  i: [keyEvent("f2")],
  o: [keyEvent("f3")],
  p: [keyEvent("f4")],
  g: [consumerEvent("volume_decrement")],
  h: [consumerEvent("mute")],
  m: [keyEvent("f9")],
  comma: [keyEvent("f10")],
  period: [keyEvent("f11")],
  slash: [keyEvent("f12")],
};

var utilityHomeRowHolds = {
  a: { tap: [keyEvent("home")], hold: "left_shift" },
  d: { tap: [keyEvent("page_down")], hold: "left_option" },
};

var numberSymbolHomeRowHolds = {
  a: { tap: [keyEvent("grave_accent_and_tilde")], hold: "left_shift" },
  s: { tap: [], hold: "left_control" },
  d: { tap: [keyEvent("hyphen")], hold: "left_option" },
  f: { tap: [keyEvent("equal_sign")], hold: "left_command" },
  j: { tap: [keyEvent("open_bracket")], hold: "right_command" },
  k: { tap: [keyEvent("close_bracket")], hold: "right_option" },
  l: { tap: [keyEvent("backslash")], hold: "right_control" },
  semicolon: { tap: [keyEvent("quote")], hold: "right_shift" },
};

var functionMediaHomeRowHolds = {
  a: { tap: [consumerEvent("play_or_pause")], hold: "left_shift" },
  s: { tap: [consumerEvent("rewind")], hold: "left_control" },
  d: { tap: [consumerEvent("fastforward")], hold: "left_option" },
  f: { tap: [consumerEvent("volume_increment")], hold: "left_command" },
  j: { tap: [keyEvent("f5")], hold: "right_command" },
  k: { tap: [keyEvent("f6")], hold: "right_option" },
  l: { tap: [keyEvent("f7")], hold: "right_control" },
  semicolon: { tap: [keyEvent("f8")], hold: "right_shift" },
};

function variableIf(name, value) {
  return { type: "variable_if", name: name, value: value };
}

function variableUnless(name, value) {
  return { type: "variable_unless", name: name, value: value };
}

function layersInactive() {
  return [
    variableUnless(UTILITY_LAYER, LAYER_ACTIVE),
    variableUnless(NUMBER_SYMBOL_LAYER, LAYER_ACTIVE),
    variableUnless(FUNCTION_MEDIA_LAYER, LAYER_ACTIVE),
  ];
}

function createMapping(from, toEvents, conditions) {
  return {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to: toEvents,
    conditions: conditions || [],
  };
}

function createModifiedMapping(from, modifier, toEvents, conditions) {
  return {
    type: "basic",
    from: {
      key_code: from,
      modifiers: { mandatory: [modifier], optional: ["any"] },
    },
    to: toEvents,
    conditions: conditions || [],
  };
}

function handForKey(key) {
  if (LEFT_HAND_KEYS.indexOf(key) !== -1) {
    return "left";
  }

  if (RIGHT_HAND_KEYS.indexOf(key) !== -1) {
    return "right";
  }

  return null;
}

function createTapHold(from, tap, holdEvents, conditions, cancelWithTap) {
  var manipulator = {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to_if_alone: [{ key_code: tap, halt: true }],
    to_if_held_down: holdEvents,
    parameters: {
      "basic.to_if_held_down_threshold_milliseconds": HOLD_MS,
    },
    conditions: conditions || layersInactive(),
  };

  if (cancelWithTap !== false) {
    manipulator.to_delayed_action = {
      to_if_canceled: [{ key_code: tap }],
    };
    manipulator.parameters[
      "basic.to_delayed_action_delay_milliseconds"
    ] = HOLD_MS;
  }

  return manipulator;
}

function createLayerTapHold(from, tapEvents, holdKey, layer) {
  var conditions = [variableIf(layer, LAYER_ACTIVE)];
  var holdEvents = [keyEvent(holdKey)];

  var manipulator = {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to_if_held_down: holdEvents,
    parameters: {
      "basic.to_delayed_action_delay_milliseconds": HOLD_MS,
      "basic.to_if_held_down_threshold_milliseconds": HOLD_MS,
    },
    conditions: conditions,
  };

  if (tapEvents.length > 0) {
    manipulator.to_if_alone = tapEvents;
    manipulator.to_delayed_action = { to_if_canceled: tapEvents };
  }

  return manipulator;
}

function createLayerActivator(from, tap, layer, conditions) {
  var manipulator = {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to: [{ set_variable: { name: layer, value: LAYER_ACTIVE } }],
    to_after_key_up: [
      { set_variable: { name: layer, value: LAYER_INACTIVE } },
    ],
    parameters: {
      "basic.to_if_alone_timeout_milliseconds": HOLD_MS,
    },
    conditions: conditions || layersInactive(),
  };

  if (tap) {
    manipulator.to_if_alone = [{ key_code: tap }];
  }

  return manipulator;
}

function createNativeCapsDoubleTapManipulators(modeConditions) {
  var secondTap = {
    type: "basic",
    from: { key_code: "caps_lock", modifiers: { optional: ["any"] } },
    to: [
      { set_variable: { name: UTILITY_LAYER, value: LAYER_ACTIVE } },
    ],
    to_after_key_up: [
      { set_variable: { name: UTILITY_LAYER, value: LAYER_INACTIVE } },
    ],
    to_if_alone: [
      keyEvent("escape"),
      { set_variable: { name: CAPS_DOUBLE_TAP, value: 0 } },
    ],
    conditions: modeConditions.concat([variableIf(CAPS_DOUBLE_TAP, 1)]),
  };
  var firstTap = {
    type: "basic",
    from: { key_code: "caps_lock", modifiers: { optional: ["any"] } },
    to: [
      { set_variable: { name: UTILITY_LAYER, value: LAYER_ACTIVE } },
    ],
    to_after_key_up: [
      { set_variable: { name: UTILITY_LAYER, value: LAYER_INACTIVE } },
    ],
    to_if_alone: [
      { set_variable: { name: CAPS_DOUBLE_TAP, value: 1 } },
    ],
    to_delayed_action: {
      to_if_invoked: [
        keyEvent("caps_lock"),
        { set_variable: { name: CAPS_DOUBLE_TAP, value: 0 } },
      ],
      to_if_canceled: [],
    },
    parameters: {
      "basic.to_delayed_action_delay_milliseconds":
        CAPS_DOUBLE_TAP_DELAY_MS,
    },
    conditions: modeConditions.concat([variableUnless(CAPS_DOUBLE_TAP, 1)]),
  };

  return [secondTap, firstTap];
}

function generateBaseThumbManipulators() {
  var aliasConditions = layersInactive().concat([
    variableIf(SIDE_ALIAS_MODE, SIDE_ALIASES),
  ]);
  var nativeConditions = layersInactive().concat([
    variableIf(SIDE_ALIAS_MODE, SIDE_NATIVE),
  ]);
  var manipulators = [
    createLayerActivator("left_option", "escape", UTILITY_LAYER),
    createLayerActivator("right_command", null, NUMBER_SYMBOL_LAYER),
    createLayerActivator("right_option", null, NUMBER_SYMBOL_LAYER),
    createLayerActivator("application", null, FUNCTION_MEDIA_LAYER),
    createLayerActivator("right_control", null, FUNCTION_MEDIA_LAYER),
  ];

  manipulators = manipulators.concat([
    createMapping("tab", [keyEvent("vk_none")], aliasConditions),
    createLayerActivator("caps_lock", "escape", UTILITY_LAYER, aliasConditions),
    createMapping("left_shift", [keyEvent("left_command")], aliasConditions),
    createMapping("right_shift", [keyEvent("spacebar")], aliasConditions),
    createLayerActivator("quote", null, NUMBER_SYMBOL_LAYER, aliasConditions),
    createLayerActivator("open_bracket", null, FUNCTION_MEDIA_LAYER, aliasConditions),
  ]);

  return manipulators.concat(
    createNativeCapsDoubleTapManipulators(nativeConditions)
  );
}

function layoutNotification(text) {
  return {
    set_notification_message: {
      id: LAYOUT_NOTIFICATION,
      text: text,
    },
  };
}

function sideModeNotification(text) {
  return {
    set_notification_message: {
      id: SIDE_MODE_NOTIFICATION,
      text: text,
    },
  };
}

function createSideModeToggle(currentMode) {
  var nextMode = currentMode === SIDE_ALIASES ? SIDE_NATIVE : SIDE_ALIASES;

  return {
    type: "basic",
    from: { key_code: "q", modifiers: { optional: ["any"] } },
    to: [
      { set_variable: { name: SIDE_ALIAS_MODE, value: nextMode } },
      sideModeNotification(SIDE_MODE_NAMES[nextMode]),
    ],
    to_delayed_action: {
      to_if_invoked: [sideModeNotification("")],
      to_if_canceled: [sideModeNotification("")],
    },
    parameters: {
      "basic.to_delayed_action_delay_milliseconds":
        LAYOUT_NOTIFICATION_DURATION_MS,
    },
    conditions: [
      variableIf(FUNCTION_MEDIA_LAYER, LAYER_ACTIVE),
      variableIf(SIDE_ALIAS_MODE, currentMode),
    ],
  };
}

function generateSideModeToggles() {
  return [
    createSideModeToggle(SIDE_ALIASES),
    createSideModeToggle(SIDE_NATIVE),
  ];
}

function createBaseLayoutToggle(from, currentLayout, extraConditions) {
  var nextLayout = (currentLayout + 1) % BASE_LAYOUT_COUNT;
  var conditions = [
    variableIf(UTILITY_LAYER, LAYER_ACTIVE),
    variableIf(BASE_LAYOUT, currentLayout),
  ];

  if (extraConditions) {
    conditions = conditions.concat(extraConditions);
  }

  return {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to: [
      { set_variable: { name: BASE_LAYOUT, value: nextLayout } },
      layoutNotification(BASE_LAYOUT_NAMES[nextLayout]),
    ],
    to_delayed_action: {
      to_if_invoked: [layoutNotification("")],
      to_if_canceled: [layoutNotification("")],
    },
    parameters: {
      "basic.to_delayed_action_delay_milliseconds":
        LAYOUT_NOTIFICATION_DURATION_MS,
    },
    conditions: conditions,
  };
}

function generateBaseLayoutToggles(from, extraConditions) {
  var manipulators = [];
  var currentLayout;

  for (currentLayout = 0;
    currentLayout < BASE_LAYOUT_COUNT;
    currentLayout += 1) {
    manipulators.push(
      createBaseLayoutToggle(from, currentLayout, extraConditions)
    );
  }

  return manipulators;
}

function generateUtilityThumbManipulators() {
  var conditions = [variableIf(UTILITY_LAYER, LAYER_ACTIVE)];
  var aliasConditions = conditions.concat([
    variableIf(SIDE_ALIAS_MODE, SIDE_ALIASES),
  ]);
  var manipulators = [
    createLayerActivator("application", null, FUNCTION_MEDIA_LAYER, conditions),
    createLayerActivator("right_control", null, FUNCTION_MEDIA_LAYER, conditions),
  ];

  manipulators = manipulators.concat([
    createMapping("left_shift", [keyEvent("left_command")], aliasConditions),
    createLayerActivator("open_bracket", null, FUNCTION_MEDIA_LAYER, aliasConditions),
  ]);
  manipulators = manipulators.concat(
    generateBaseLayoutToggles("right_shift", [
      variableIf(SIDE_ALIAS_MODE, SIDE_ALIASES),
    ])
  );

  return manipulators.concat(generateBaseLayoutToggles("spacebar"));
}

function generateNumberSymbolThumbManipulators() {
  var conditions = [variableIf(NUMBER_SYMBOL_LAYER, LAYER_ACTIVE)];
  var aliasConditions = conditions.concat([
    variableIf(SIDE_ALIAS_MODE, SIDE_ALIASES),
  ]);
  var manipulators = [
    createMapping("caps_lock", [keyEvent("escape")], conditions),
    createMapping("left_option", [keyEvent("escape")], conditions),
    createLayerActivator("application", null, FUNCTION_MEDIA_LAYER, conditions),
    createLayerActivator("right_control", null, FUNCTION_MEDIA_LAYER, conditions),
  ];

  manipulators = manipulators.concat([
    createMapping("left_shift", [keyEvent("left_command")], aliasConditions),
    createMapping("right_shift", [keyEvent("spacebar")], aliasConditions),
    createLayerActivator("open_bracket", null, FUNCTION_MEDIA_LAYER, aliasConditions),
  ]);

  return manipulators;
}

function generateFunctionMediaThumbManipulators() {
  var conditions = [variableIf(FUNCTION_MEDIA_LAYER, LAYER_ACTIVE)];
  var aliasConditions = conditions.concat([
    variableIf(SIDE_ALIAS_MODE, SIDE_ALIASES),
  ]);
  var manipulators = [
    createMapping("caps_lock", [keyEvent("escape")], conditions),
    createMapping("left_option", [keyEvent("escape")], conditions),
  ];

  manipulators = manipulators.concat([
    createMapping("left_shift", [keyEvent("left_command")], aliasConditions),
    createMapping("right_shift", [keyEvent("spacebar")], aliasConditions),
  ]);

  return manipulators;
}

function generateLayerManipulators(layer, mappings) {
  var conditions = [variableIf(layer, LAYER_ACTIVE)];
  var keys = Object.keys(mappings);
  var manipulators = [];
  var i;

  for (i = 0; i < keys.length; i += 1) {
    manipulators.push(createMapping(keys[i], mappings[keys[i]], conditions));
  }

  return manipulators;
}

function generateSpanishShiftManipulators() {
  var utilityConditions = [variableIf(UTILITY_LAYER, LAYER_ACTIVE)];
  var uDiaeresis = [
    keyEvent("u", [CHARACTER_OPTION]),
    keyEvent("u"),
  ];
  var diaeresis = [keyEvent("u", [CHARACTER_OPTION])];
  var uppercaseEnye = [
    keyEvent("n", [CHARACTER_OPTION]),
    keyEvent("n", ["left_shift"]),
  ];
  var openingExclamation = [keyEvent("1", [CHARACTER_OPTION])];

  return [
    createModifiedMapping("u", "left_shift", uDiaeresis, utilityConditions),
    createModifiedMapping("u", "right_shift", uDiaeresis, utilityConditions),
    createModifiedMapping("p", "left_shift", diaeresis, utilityConditions),
    createModifiedMapping("p", "right_shift", diaeresis, utilityConditions),
    createModifiedMapping("n", "left_shift", uppercaseEnye, utilityConditions),
    createModifiedMapping("n", "right_shift", uppercaseEnye, utilityConditions),
    createModifiedMapping(
      "slash",
      "left_shift",
      openingExclamation,
      utilityConditions
    ),
    createModifiedMapping(
      "slash",
      "right_shift",
      openingExclamation,
      utilityConditions
    ),
  ];
}

function generateLayerHoldManipulators(layer, mappings) {
  var keys = Object.keys(mappings);
  var manipulators = [];
  var i;
  var mapping;

  for (i = 0; i < keys.length; i += 1) {
    mapping = mappings[keys[i]];
    manipulators.push(
      createLayerTapHold(keys[i], mapping.tap, mapping.hold, layer)
    );
  }

  return manipulators;
}

function baseLayoutConditions(layout) {
  return layersInactive().concat([variableIf(BASE_LAYOUT, layout)]);
}

function modifierKeysForHand(hand) {
  return Object.keys(baseModifierHolds).filter(function(key) {
    return handForKey(key) === hand;
  });
}

function releaseOrderKeysFor(from) {
  var hand = handForKey(from);
  var oppositeKeys = hand === "left" ? RIGHT_HAND_KEYS : LEFT_HAND_KEYS;
  var sameHandModifiers = modifierKeysForHand(hand).filter(function(key) {
    return key !== from;
  });

  return oppositeKeys.concat(sameHandModifiers);
}

function baseTapForLayout(key, layout) {
  if (layout !== BASE_COLEMAK_DH) {
    return key;
  }

  return colemakHomeRowTaps[key] || colemakMappings[key] || key;
}

function createReleaseOrderManipulator(from, other, layout) {
  return {
    type: "basic",
    from: {
      simultaneous: [
        { key_code: from },
        { key_code: other },
      ],
      simultaneous_options: {
        key_down_order: "strict",
        key_up_order: "strict_inverse",
      },
      modifiers: { optional: ["any"] },
    },
    to: [
      {
        key_code: baseTapForLayout(other, layout),
        modifiers: [baseModifierHolds[from]],
      },
    ],
    parameters: {
      "basic.simultaneous_threshold_milliseconds": HOLD_MS,
    },
    conditions: baseLayoutConditions(layout),
  };
}

function createSameOrderRollManipulator(from, other, layout) {
  return {
    type: "basic",
    from: {
      simultaneous: [
        { key_code: from },
        { key_code: other },
      ],
      simultaneous_options: {
        key_down_order: "strict",
        key_up_order: "strict",
      },
      modifiers: { optional: ["any"] },
    },
    to: [
      keyEvent(baseTapForLayout(from, layout)),
      keyEvent(baseTapForLayout(other, layout)),
    ],
    parameters: {
      "basic.simultaneous_threshold_milliseconds": HOLD_MS,
    },
    conditions: baseLayoutConditions(layout),
  };
}

function generateSameOrderRollManipulatorsForLayout(layout) {
  var holdKeys = Object.keys(baseModifierHolds);
  var manipulators = [];

  holdKeys.forEach(function(from) {
    BASE_TYPING_KEYS.filter(function(other) {
      var isLeftShiftSymbol = from === "a" &&
        SHIFT_SYMBOL_KEYS.indexOf(other) !== -1;

      return other !== from && !isLeftShiftSymbol;
    }).forEach(function(other) {
      manipulators.push(createSameOrderRollManipulator(from, other, layout));
    });
  });

  return manipulators;
}

function generateSameOrderRollManipulators() {
  if (!RELEASE_ORDER_HOLD_ENABLED) {
    return [];
  }

  return generateSameOrderRollManipulatorsForLayout(BASE_QWERTY).concat(
    generateSameOrderRollManipulatorsForLayout(BASE_COLEMAK_DH)
  );
}

function generateReleaseOrderManipulatorsForLayout(layout) {
  var holdKeys = Object.keys(baseModifierHolds);
  var manipulators = [];

  holdKeys.forEach(function(from) {
    releaseOrderKeysFor(from).forEach(function(other) {
      manipulators.push(createReleaseOrderManipulator(from, other, layout));
    });
  });

  return manipulators;
}

function generateReleaseOrderManipulators() {
  if (!RELEASE_ORDER_HOLD_ENABLED) {
    return [];
  }

  return generateReleaseOrderManipulatorsForLayout(BASE_QWERTY).concat(
    generateReleaseOrderManipulatorsForLayout(BASE_COLEMAK_DH)
  );
}

function generateBaseHoldManipulatorsForLayout(layout, taps) {
  var keys = Object.keys(baseModifierHolds);
  var manipulators = [];
  var i;
  var from;
  var tap;

  for (i = 0; i < keys.length; i += 1) {
    from = keys[i];
    tap = taps ? taps[from] : from;
    manipulators.push(
      createTapHold(
        from,
        tap,
        [keyEvent(baseModifierHolds[from])],
        baseLayoutConditions(layout),
        !RELEASE_ORDER_HOLD_ENABLED
      )
    );
  }

  return manipulators;
}

function generateBaseHoldManipulators() {
  return generateBaseHoldManipulatorsForLayout(BASE_QWERTY)
    .concat(
      generateBaseHoldManipulatorsForLayout(
        BASE_COLEMAK_DH,
        colemakHomeRowTaps
      )
    );
}

function generateColemakBaseManipulators() {
  var keys = Object.keys(colemakMappings);
  var conditions = baseLayoutConditions(BASE_COLEMAK_DH);
  var manipulators = [];
  var i;

  for (i = 0; i < keys.length; i += 1) {
    manipulators.push(
      createMapping(
        keys[i],
        [keyEvent(colemakMappings[keys[i]])],
        conditions
      )
    );
  }

  return manipulators;
}

function generateManipulators() {
  return generateSameOrderRollManipulators()
    .concat(generateReleaseOrderManipulators())
    .concat(generateBaseHoldManipulators())
    .concat(generateColemakBaseManipulators())
    .concat(generateBaseThumbManipulators())
    .concat(generateSpanishShiftManipulators())
    .concat(
      generateLayerHoldManipulators(
        FUNCTION_MEDIA_LAYER,
        functionMediaHomeRowHolds
      )
    )
    .concat(generateSideModeToggles())
    .concat(
      generateLayerManipulators(FUNCTION_MEDIA_LAYER, functionMediaMappings)
    )
    .concat(generateFunctionMediaThumbManipulators())
    .concat(generateLayerHoldManipulators(UTILITY_LAYER, utilityHomeRowHolds))
    .concat(generateLayerManipulators(UTILITY_LAYER, utilityMappings))
    .concat(generateUtilityThumbManipulators())
    .concat(
      generateLayerHoldManipulators(
        NUMBER_SYMBOL_LAYER,
        numberSymbolHomeRowHolds
      )
    )
    .concat(
      generateLayerManipulators(NUMBER_SYMBOL_LAYER, numberSymbolMappings)
    )
    .concat(generateNumberSymbolThumbManipulators());
}

var cheapinoRule = createRule();
var karabinerBindings = main(cheapinoRule);

if (typeof process !== "undefined" && process.versions && process.versions.node) {
  console.log(JSON.stringify(karabinerBindings, null, 2));
}

cheapinoRule;
