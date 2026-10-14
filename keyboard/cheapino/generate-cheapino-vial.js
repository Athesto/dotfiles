var fs = require("fs");
var path = require("path");

var templatePath = path.join(__dirname, "cheapino.vil");
var outputPath = path.join(__dirname, "cheapino-base-cmk.vil");
var config = JSON.parse(fs.readFileSync(templatePath, "utf8"));
var keyboardUid = "11439577402410331513";
var NONE = "KC_NO";
var TRANSPARENT = "KC_TRNS";

function matrix(rightRows, rightThumbs, leftRows, leftThumbs, encoderPress) {
  var emptyHalf = [-1, -1, -1, -1, -1, -1];
  var rows = [];
  var row;

  for (row = 0; row < 3; row += 1) {
    rows.push(rightRows[row].concat([rightThumbs[row]], emptyHalf));
  }

  rows.push([encoderPress || "KC_MPLY", -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);

  for (row = 0; row < 3; row += 1) {
    rows.push(
      emptyHalf.concat(leftRows[row].slice().reverse(), [leftThumbs[row]])
    );
  }

  rows.push([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
  return rows;
}

var qwerty = [
  [
    "KC_O",
    "KC_I",
    "KC_L",
    "KC_SCOLON",
    "KC_R",
    "LT3(KC_SPACE)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_H",
    "KC_Y",
    "KC_N",
    "KC_U",
    "KC_P",
    "MO(6)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_J",
    "KC_M",
    "KC_COMMA",
    "KC_DOT",
    "KC_SLASH",
    "KC_SPACE",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "TG(1)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_F",
    "KC_S",
    "KC_K",
    "KC_W",
    "KC_Q",
    "MO(4)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_T",
    "KC_E",
    "KC_G",
    "KC_D",
    "KC_A",
    "MO(5)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_B",
    "KC_V",
    "KC_C",
    "KC_X",
    "KC_Z",
    "MO(2)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
];

var colemakDh = [
  [
    "KC_Y",
    "KC_U",
    "KC_I",
    "KC_O",
    "KC_P",
    "LT3(KC_SPACE)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_M",
    "KC_J",
    "KC_K",
    "KC_L",
    "KC_SCOLON",
    "MO(6)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_N",
    "KC_H",
    "KC_COMMA",
    "KC_DOT",
    "KC_SLASH",
    "KC_SPACE",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "TG(1)",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_B",
    "KC_R",
    "KC_E",
    "KC_W",
    "KC_Q",
    "MO(4)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_T",
    "KC_F",
    "KC_D",
    "KC_S",
    "KC_A",
    "MO(5)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_V",
    "KC_G",
    "KC_C",
    "KC_X",
    "KC_Z",
    "MO(2)"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
];

var utility = [
  [
    "KC_NO",
    "KC_PGUP",
    "KC_TAB",
    "KC_DELETE",
    "OSM(MOD_RALT)",
    "KC_TRNS",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_LEFT",
    "KC_DOWN",
    "KC_UP",
    "KC_RIGHT",
    "KC_BSPACE",
    "KC_NO",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "RALT(KC_J)",
    "KC_ENTER",
    "KC_NO",
    "KC_NO",
    "RALT(KC_SLASH)",
    "KC_TRNS",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_MPLY",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "KC_PGDOWN",
    "KC_END",
    "KC_NO",
    "KC_TAB",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_ESCAPE",
    "KC_LALT",
    "KC_LGUI",
    "KC_LCTRL",
    "KC_LSHIFT",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "KC_NO",
    "KC_NO",
    "KC_NO",
    "KC_NO",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
];

var numberSymbol = [
  [
    "KC_6",
    "KC_7",
    "KC_8",
    "KC_9",
    "KC_0",
    "KC_TRNS",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_NO",
    "KC_LALT",
    "KC_LGUI",
    "KC_RCTRL",
    "KC_RSHIFT",
    "KC_TRNS",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_NO",
    "KC_LBRACKET",
    "KC_RBRACKET",
    "KC_BSLASH",
    "KC_QUOTE",
    "KC_SPACE",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_MPLY",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_5",
    "KC_4",
    "KC_3",
    "KC_2",
    "KC_1",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "KC_LALT",
    "KC_LGUI",
    "KC_LCTRL",
    "KC_LSHIFT",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "KC_EQUAL",
    "KC_MINUS",
    "KC_NO",
    "KC_GRAVE",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
];

var functionMedia = [
  [
    "KC_VOLU",
    "KC_F1",
    "KC_F2",
    "KC_F3",
    "KC_F4",
    "KC_TRNS",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_MUTE",
    "KC_F5",
    "KC_F6",
    "KC_F7",
    "KC_F8",
    "KC_NO",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_VOLD",
    "KC_F9",
    "KC_F10",
    "KC_F11",
    "KC_F12",
    "KC_SPACE",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    "KC_MPLY",
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "MAGIC_SWAP_LALT_LGUI",
    "MAGIC_UNSWAP_LALT_LGUI",
    "KC_MNXT",
    "KC_MPRV",
    "KC_MPLY",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "KC_LALT",
    "KC_LGUI",
    "KC_LCTRL",
    "KC_LSHIFT",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    "KC_NO",
    "RGB_VAI",
    "RGB_VAD",
    "RGB_HUI",
    "RGB_HUD",
    "KC_TRNS"
  ],
  [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
];

var unused = matrix(
  [
    [NONE, NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE, NONE],
  ],
  [NONE, NONE, NONE],
  [
    [NONE, NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE, NONE],
    [NONE, NONE, NONE, NONE, NONE],
  ],
  [NONE, NONE, NONE],
  NONE
);

// Auxiliary layers must be above both base layouts for QMK priority.
config.layout[0] = qwerty;
config.layout[1] = colemakDh;
config.layout[2] = utility;
config.layout[3] = numberSymbol;
config.layout[4] = functionMedia;
config.layout[5] = [["KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS",-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS"],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_LALT","KC_LGUI","KC_LCTRL","KC_LSHIFT","KC_TRNS"],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS"],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
config.layout[6] = [["KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS","KC_LALT","KC_LGUI","KC_RCTRL","KC_RSHIFT","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS",-1,-1,-1,-1,-1,-1],["KC_TRNS",-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS"],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS"],[-1,-1,-1,-1,-1,-1,"KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS","KC_TRNS"],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]];
config.layout[7] = unused;
config.layout[10] = unused;
config.layout[13] = unused;
config.encoder_layout[0] = [["KC_WH_U", "KC_WH_D"]];
config.encoder_layout[1] = [["KC_WH_U", "KC_WH_D"]];
[2, 3, 4, 5, 6, 7, 10, 13].forEach(function (layer) {
  config.encoder_layout[layer] = [[NONE, NONE]];
});

// Modifier combos are disabled; use the dedicated thumb modifier layers.
config.combo = [["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"],["KC_NO","KC_NO","KC_NO","KC_NO","KC_NO"]];
require("./add-spanish-utils")(config);

var output = JSON.stringify(config).replace(
  /"uid":\d+/,
  '"uid":' + keyboardUid
);

fs.writeFileSync(outputPath, output + "\n", "utf8");
