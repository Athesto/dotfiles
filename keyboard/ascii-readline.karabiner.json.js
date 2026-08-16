var ASCII_READLINE_LAYER = "ascii_readline_layer"
var VIM_HYBRID_LAYER = "vim_hybrid_layer"
var COLEMAK_DH = "colemak_dh"


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

    /*
     * 60%
     */
    s: "print_screen"
}


var functionMappings = {
    "1": "f1",
    "2": "f2",
    "3": "f3",
    "4": "f4",
    "5": "f5",
    "6": "f6",
    "7": "f7",
    "8": "f8",
    "9": "f9",
    "0": "f10",
    hyphen: "f11",
    equal_sign: "f12"
}


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
    m: "h"
}


/* -------------------------------------------------------------------------- */
/* CONDITIONS                                                                 */
/* -------------------------------------------------------------------------- */

function variableIf(name, value) {
    return {
        type: "variable_if",
        name: name,
        value: value
    }
}


function variableUnless(name, value) {
    return {
        type: "variable_unless",
        name: name,
        value: value
    }
}


/* -------------------------------------------------------------------------- */
/* GENERIC HELPERS                                                            */
/* -------------------------------------------------------------------------- */

function createMapping(
    from,
    to,
    conditions
) {
    return {
        type: "basic",

        from: {
            key_code: from,
            modifiers: {
                optional: ["any"]
            }
        },

        to: [
            {
                key_code: to
            }
        ],

        conditions: conditions
    }
}


function createModifiedMapping(
    from,
    to,
    modifiers,
    conditions
) {
    return {
        type: "basic",

        from: {
            key_code: from,
            modifiers: {
                optional: ["any"]
            }
        },

        to: [
            {
                key_code: to,
                modifiers: modifiers
            }
        ],

        conditions: conditions
    }
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
                mandatory: mandatoryModifiers
            }
        },

        to: [
            {
                key_code: to,
                modifiers: toModifiers
            }
        ],

        conditions: conditions
    }
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
                        optional: ["any"]
                    }
                },

                to: [
                    {
                        key_code: "right_option"
                    }
                ]
            }
        ]
    }
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
                mandatory: mandatoryModifiers
            }
        },

        to: sequence,

        conditions: conditions
    }
}


function createSequenceMapping(
    from,
    sequence,
    conditions
) {
    return {
        type: "basic",

        from: {
            key_code: from,
            modifiers: {
                optional: ["any"]
            }
        },

        to: sequence,

        conditions: conditions
    }
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
                optional: ["any"]
            }
        },

        to: [
            {
                set_variable: {
                    name: layer,
                    value: 1
                }
            }
        ],

        to_after_key_up: [
            {
                set_variable: {
                    name: layer,
                    value: 0
                }
            }
        ],

        to_if_alone: [
            {
                key_code: "escape"
            }
        ]
    }
}


function createCapsLockMapping(layer) {
    return {
        type: "basic",

        from: {
            key_code: "right_shift"
        },

        to: [
            {
                key_code: "caps_lock"
            }
        ],

        conditions: [
            variableIf(layer, 1)
        ]
    }
}


function createColemakToggleMappings(layer) {
    return [
        {
            type: "basic",

            from: {
                key_code: "spacebar"
            },

            to: [
                {
                    set_variable: {
                        name: COLEMAK_DH,
                        value: 1
                    }
                }
            ],

            conditions: [
                variableIf(layer, 1),
                variableUnless(COLEMAK_DH, 1)
            ]
        },
        {
            type: "basic",

            from: {
                key_code: "spacebar"
            },

            to: [
                {
                    set_variable: {
                        name: COLEMAK_DH,
                        value: 0
                    }
                }
            ],

            conditions: [
                variableIf(layer, 1),
                variableIf(COLEMAK_DH, 1)
            ]
        }
    ]
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
                optional: ["shift"]
            }
        },

        to: [
            {
                key_code: "grave_accent_and_tilde"
            }
        ]
    }
}


function generateFunctionMappings(layer) {
    var manipulators = []
    var keys = Object.keys(functionMappings)
    var conditions = [
        variableIf(layer, 1)
    ]

    var i
    var from
    var to

    for (i = 0; i < keys.length; i += 1) {
        from = keys[i]
        to = functionMappings[from]

        /*
         * fn is intentional on macOS.
         *
         * Caps+2 -> fn+F2 -> real F2
         */
        manipulators.push(
            createModifiedMapping(
                from,
                to,
                ["fn"],
                conditions
            )
        )
    }

    return manipulators
}


/* -------------------------------------------------------------------------- */
/* ASCII / READLINE                                                           */
/* -------------------------------------------------------------------------- */

function generateAsciiReadlineRule() {
    var conditions = [
        variableIf(
            ASCII_READLINE_LAYER,
            1
        )
    ]

    var manipulators = [
        createGraveAccentMapping(),

        createLayerActivator(
            ASCII_READLINE_LAYER
        ),

        createCapsLockMapping(
            ASCII_READLINE_LAYER
        )
    ]

    var keys = Object.keys(
        asciiReadlineMappings
    )

    manipulators = manipulators.concat(
        createColemakToggleMappings(
            ASCII_READLINE_LAYER
        )
    )

    var i
    var from
    var to

    for (i = 0; i < keys.length; i += 1) {
        from = keys[i]
        to = asciiReadlineMappings[from]

        manipulators.push(
            createMapping(
                from,
                to,
                conditions
            )
        )
    }


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
    )


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
                    modifiers: ["left_shift"]
                },
                {
                    key_code:
                        "delete_or_backspace"
                }
            ],
            conditions
        )
    )


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
                    modifiers: ["left_shift"]
                },
                {
                    key_code: "delete_forward"
                }
            ],
            conditions
        )
    )


    /*
     * Accent dead key.
     */
    manipulators.push(
        createModifiedMapping(
            "quote",
            "quote",
            ["left_option"],
            conditions
        )
    )


    manipulators = manipulators.concat(
        generateFunctionMappings(
            ASCII_READLINE_LAYER
        )
    )


    return {
        description:
            "60% ASCII/Readline Layer",

        manipulators: manipulators
    }
}


/* -------------------------------------------------------------------------- */
/* VIM HYBRID                                                                 */
/* -------------------------------------------------------------------------- */

function generateVimHybridRule() {
    var conditions = [
        variableIf(
            VIM_HYBRID_LAYER,
            1
        )
    ]

    var manipulators = [
        createGraveAccentMapping(),

        createLayerActivator(
            VIM_HYBRID_LAYER
        ),

        createCapsLockMapping(
            VIM_HYBRID_LAYER
        )
    ]

    manipulators = manipulators.concat(
        createColemakToggleMappings(
            VIM_HYBRID_LAYER
        )
    )


    /*
     * ASCII
     *
     * C-i = HT
     * C-m = CR
     * C-[ = ESC
     */

    manipulators.push(
        createMapping(
            "i",
            "tab",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "m",
            "return_or_enter",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "open_bracket",
            "escape",
            conditions
        )
    )


    /*
     * Vim
     *
     * H J K L
     */

    manipulators.push(
        createMapping(
            "h",
            "left_arrow",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "j",
            "down_arrow",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "k",
            "up_arrow",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "l",
            "right_arrow",
            conditions
        )
    )


    /*
     * Vim C-u / C-d
     */

    manipulators.push(
        createMapping(
            "u",
            "page_up",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "d",
            "page_down",
            conditions
        )
    )


    /*
     * Readline / Emacs
     *
     * C-a / C-e
     */

    manipulators.push(
        createMapping(
            "a",
            "home",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "e",
            "end",
            conditions
        )
    )


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
    )

    manipulators.push(
        createMandatoryModifiedMapping(
            "x",
            "delete_forward",
            ["option"],
            ["left_option"],
            conditions
        )
    )

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
                    modifiers: ["left_shift"]
                },
                {
                    key_code: "delete_or_backspace"
                }
            ],
            conditions
        )
    )

    manipulators.push(
        createMandatorySequenceMapping(
            "x",
            ["command"],
            [
                {
                    key_code: "end",
                    modifiers: ["left_shift"]
                },
                {
                    key_code: "delete_forward"
                }
            ],
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "w",
            "delete_or_backspace",
            conditions
        )
    )

    manipulators.push(
        createMapping(
            "x",
            "delete_forward",
            conditions
        )
    )


    /*
     * Accent dead key.
     *
     * Caps+' -> Option+'
     */

    manipulators.push(
        createModifiedMapping(
            "quote",
            "quote",
            ["left_option"],
            conditions
        )
    )


    /*
     * Print Screen
     */

    manipulators.push(
        createMapping(
            "s",
            "print_screen",
            conditions
        )
    )


    /*
     * F1-F12
     */

    manipulators = manipulators.concat(
        generateFunctionMappings(
            VIM_HYBRID_LAYER
        )
    )


    return {
        description:
            "60% Vim Hybrid Layer",

        manipulators: manipulators
    }
}


/* -------------------------------------------------------------------------- */
/* COLEMAK-DH                                                                 */
/* -------------------------------------------------------------------------- */

function generateColemakDHRule() {
    var manipulators = []
    var keys = Object.keys(colemakMappings)

    var i
    var from
    var to

    for (i = 0; i < keys.length; i += 1) {
        from = keys[i]
        to = colemakMappings[from]

        manipulators.push(
            createMapping(
                from,
                to,
                [
                    variableIf(
                        COLEMAK_DH,
                        1
                    )
                ]
            )
        )
    }


    return {
        description: "Colemak-DH ANSI",
        manipulators: manipulators
    }
}


/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

function main() {
    return {
        title: "Athesto Keyboard",

        rules: [
            createRightCommandAsOptionRule(),
            generateAsciiReadlineRule(),
            generateVimHybridRule(),
            generateColemakDHRule()
        ]
    }
}


/* -------------------------------------------------------------------------- */
/* OUTPUT                                                                     */
/* -------------------------------------------------------------------------- */

var output = main()


console.log(
    JSON.stringify(
        output,
        null,
        2
    )
)


output.rules[0] // right-command-as-option
output.rules[1] // ascii-readline
output.rules[2] // vim-hybrid
output.rules[3] // colemak
