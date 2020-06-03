import { IFox } from 'fox-types'

export function rootConfig(fox: IFox): Record<string, any> {
  return {
    rules: {
      /* ------------------- possible errors ------------------ */
      // color
      "color-no-invalid-hex": true, // recommended

      // font-family
      "font-family-no-duplicate-names": true, // recommended
      "font-family-no-missing-generic-family-keyword": true, // recommended

      // function
      "function-calc-no-invalid": true, // recommended
      "function-calc-no-unspaced-operator": true, // recommended
      "function-linear-gradient-no-nonstandard-direction": true, // recommended

      // string
      "string-no-newline": true, // recommended

      // unit
      "unit-no-unknown": true, // recommended

      // property
      "property-no-unknown": true, // recommended

      // keyframe declaration
      "keyframe-declaration-no-important": true,

      // declaration block
      "declaration-block-no-duplicate-properties": [
        true,
        {
          ignore: ["consecutive-duplicates-with-different-values"],
        },
      ], // recommended
      "declaration-block-no-shorthand-property-overrides": true, // recommended

      // block
      // TODO: isDev
      "block-no-empty": true,

      // selector
      "selector-pseudo-class-no-unknown": true, // recommended
      "selector-pseudo-element-no-unknown": true, // recommended
      "selector-type-no-unknown": true, // recommended

      // media feature
      "media-feature-name-no-unknown": true,

      // at-rule
      "at-rule-no-unknown": true, // recommended

      // comment
      "comment-no-empty": true, // recommended

      // general-sheet
      "no-descending-specificity": true, // recommended
      "no-duplicate-at-import-rules": true, // recommended
      "no-duplicate-selectors": true, // recommended
      "no-empty-source": true, // recommended
      "no-extra-semicolons": true, // recommended
      "no-invalid-double-slash-comments": true, // recommended

      /* --------------- limit language features -------------- */
      // alpha-value
      "alpha-value-notation": true,

      // hue
      "hue-degree-notation": true,

      // color
      "color-function-notation": "modern",
      "color-named": false,
      "color-no-hex": false,

      // length
      "length-zero-no-unit": true,

      // font weight
      // TODO: strict
      "font-weight-notation": false,

      // function
      // "function-blacklist": [],
      "function-url-no-scheme-relative": false,
      // "function-url-scheme-blacklist": [],
      // "function-url-scheme-whitelist": [],
      // "function-whitelist": [],

      // keyframes
      // "keyframes-name-pattern": "//",

      // number
      // TODO: excessive
      "number-max-precision": Infinity,

      // time
      // TODO: exceissve
      "time-min-milliseconds": 0,

      // unit
      // "unit-blacklist": [],
      // "unit-whitelist": [],

      // shorthand property
      "shorthand-property-no-redundant-values": true,

      // value
      // TODO: strict?
      "value-no-vendor-prefix": true,

      // custom property
      // "custom-property-pattern": "//",

      // property
      // "property-blacklist": [],
      // TODO: strict?
      "property-no-vendor-prefix": true,
      // "property-whitelist": []

      // declaration
      "declaration-block-no-redundant-longhand-properties": false,
      "declaration-no-important": false,
      "declaration-property-unit-blacklist": [],
      "declaration-property-unit-whitelist": undefined,
      "declaration-property-value-blacklist": [],
      "declaration-property-value-whitelist": undefined,

      // declaration block
      "declaration-block-single-line-max-declarations": false,

      // selector
      "selector-attribute-operator-blacklist": [],
      "selector-attribute-operator-whitelist": undefined,
      "selector-class-pattern": undefined,
      "selector-combinator-blacklist": [],
      "selector-combinator-whitelist": undefined,
      // TODO: other patterns
      // "selector-id-pattern": "//",
      "selector-max-attribute": false,
      "selector-max-class": Infinity,
      "selector-max-combinators": Infinity,
      "selector-max-compound-selectors": Infinity,
      "selector-max-empty-lines": 1,
      "selector-max-id": Infinity,
      "selector-max-pseudo-class": Infinity,
      "selector-max-specificity": Infinity,
      "selector-max-type": Infinity,
      "selector-max-universal": Infinity,
      "selector-nested-pattern": undefined,
      "selector-no-qualifying-type": false,
      // TODO: strict (and other vendors)
      "selector-no-vendor-prefix": true,
      "selector-pseudo-class-blacklist": [],
      "selector-pseudo-class-whitelist": undefined,
      "selector-pseudo-element-blacklist": [],
      "selector-pseudo-element-colon-notation": "double",
      "selector-pseudo-element-whitelist": undefined,

      // media feature
      "media-feature-name-blacklist": [],
      // TODO: make this false and true for strict
      "media-feature-name-no-vendor-prefix": true,
      "media-feature-name-value-whitelist": undefined,
      "media-feature-name-whitelist": undefined,

      // custom media
      // "custom-media-pattern": "//",

      // at-rule
      "at-rule-blacklist": [],
      // TODO: strict
      "at-rule-no-vendor-prefix": true,
      "at-rule-property-requirelist": undefined,
      "at-rule-whitelist": undefined,

      // comment
      "comment-word-blacklist": undefined,

      // general / sheet
      "max-nesting-depth": Infinity,
      "no-unknown-animations": true,

      /* ------------------ stylistic issues ------------------ */
      // defer to prettier as much as possible
      // color
      "color-hex-case": "lower",

      // function
      "function-name-case": "lower",
      "function-url-quotes": "always",

      // number
      "number-leading-zero": true,
      "number-no-trailing-zeros": true,

      // unit
      "unit-case": "lower",

      // value
      "value-keyword-case": "lower",

      // property
      "property-case": "lower",

      // declaration block
      "declaration-block-trailing-semicolon": "always",

      // selector
      "selector-attribute-quotes": "always",
      "selector-pseudo-class-case": "lower",
      "selector-pseudo-element-case": "lower",
      "selector-type-case": "lower",

      // media feature
      "media-feature-name-case": "lower",

      // at-rule
      "at-rule-name-case": "lower",
    },
  }
};
