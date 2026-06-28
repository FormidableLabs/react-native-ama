---
displayed_sidebar: docs
pagination_next: 'usage'
pagination_prev: 'getting-started'
---

# Config File

**AMA** comes with predefined rules and severity levels for the built-in components and hooks. These rules have been created to improve the accessibility of each element and should always be respected.

Customizing log levels can be done via the `ama.config.json` file to handle edge cases that are out of our control, and require breaking a rule or two.

:::info

The library does not perform any accessibility checks on the production build!

:::

## Log Levels

**AMA** guidelines are categorised as:

- <Must /> and <MustNot />: Those best practices are <b>enforced</b> and AMA overlays an error when they fail
- <Should /> and <ShouldNot />: Those best practices are <b>preferred</b> and AMA prints only a warning message when they fail

The possible log levels are:

- **error**: The **AMA** error overlay is shown when a check fails
- **warn**: A `console.warn` is performed when a check fails

### ama.config rules

| Log key | Guideline | Default | Can override |
| ------- | --------- | ------- | ------------ |
| [BOTTOM_SHEET_CLOSE_ACTION](/guidelines/bottomsheet) | <Must /> | error | <No /> |
| [CONTRAST_FAILED](/guidelines/contrast) | <Must /> | error | <Yes /> |
| [CONTRAST_FAILED_AAA](/guidelines/contrast) | <Should /> | warn | <Yes /> |
| [FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE](/guidelines/lists-grids) | <Should /> | warn | <Yes /> |
| [FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE](/guidelines/lists-grids) | <Must /> | error | <No /> |
| [IMAGE_MISSING_ALT_TEXT](/guidelines/images) | <Must /> | error | <Yes /> |
| [INCOMPATIBLE_ACCESSIBILITY_ROLE](/guidelines/accessibility-role) | <MustNot /> | error | <No /> |
| [INCOMPATIBLE_ACCESSIBILITY_STATE](/guidelines/accessibility-role) | <Must /> | error | <No /> |
| [INPUT_HAS_FOCUSABLE_LABEL](/guidelines/forms) | <Must /> | error | <Yes /> |
| [INPUT_HAS_NO_VISIBLE_LABEL](/guidelines/forms) | <Must /> | error | <No /> |
| [INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK](/guidelines/forms) | <MustNot /> | error | <Yes /> |
| [INPUT_INVALID_RETURN_KEY](/guidelines/forms) | <Must /> | error | <Yes /> |
| [MINIMUM_SIZE](/guidelines/minimum-size) | <Must /> | error | <Yes /> |
| [NO_ACCESSIBILITY_LABEL](/guidelines/accessibility-label) [^1] | <Must /> | error | <No /> |
| [NO_ACCESSIBILITY_ROLE](/guidelines/accessibility-role) [^1] | <Must /> | error | <No /> |
| [NO_ACCESSIBILITY_STATE_SET](/guidelines/accessibility-states) | <Must /> | error | <Yes /> |
| [NO_FORM_ERROR](/guidelines/forms) | <Must /> | error | <Yes /> |
| [NO_HEADER_FOUND](/guidelines/headers) | <Must /> | error | <No /> |
| [NO_KEYBOARD_TRAP](/guidelines/keyboard-trap) [^1] | <MustNot /> | error | <No /> |
| [NO_UNDEFINED](/guidelines/accessibility-label) [^1] | <MustNot /> | error | <No /> |
| [NO_UPPERCASE_ACCESSIBILITY_LABEL](/guidelines/accessibility-label) | <ShouldNot /> | warn | <Yes /> |
| [NO_UPPERCASE_TEXT](/guidelines/uppercase-text) | <MustNot /> | error | <Yes /> |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](/guidelines/uppercase-text) | <MustNot /> | error | <Yes /> |

:::note

Rules marked with <No /> are considered essential practices and cannot be turned off.
:::

## Customizing the Log Levels

A JSON file called `ama.config.json` should have been automatically generated in the project's root folder (if it didn't, simply create it). Specify the custom log level for the keys you want to override. Any changes to this file are automatically picked up by AMA in dev mode — you will need to restart your application to see them applied.

### Example

The JSON file does not need to contain all log keys. **AMA** uses the default rule if a key is not present:

```json title="ama.config.json"
{
  "rules": {
    "CONTRAST_FAILED": "warn",
    "CONTRAST_CHECKER_MAX_DEPTH": 0
  },
  "accessibilityLabelExceptions": ["FAQ"],
  "highlight": {
    "mode": "border",
    "borderWidth": 2,
    "gap": 8
  },
  "log": "always",
  "uppercaseMinLength": 5,
  "checks": {
    "ui": true,
    "forms": true,
    "delay": 300
  }
}
```

## Configuration keys

### rules

Per-rule severity overrides. Each key is an `AmaRule` string (see table above) and each value is one of:

| Value | Effect |
| ----- | ------ |
| `"MUST"` / `"MUST_NOT"` | Triggers the AMA error overlay |
| `"SHOULD"` / `"SHOULD_NOT"` | Prints a `console.warn` |
| `"PLEASE_FORGIVE_ME"` | Silences the rule entirely |

Non-overridable rules (marked <No /> in the table) ignore any value set here.

### accessibilityLabelExceptions

**AMA** performs various checks, including one for [uppercase](/guidelines/uppercase). This key allows specifying a list of approved all-caps accessibility labels that should not trigger the uppercase rule.

```json title="ama.config.json"
{
  "accessibilityLabelExceptions": ["FAQ"]
}
```

:::note

`accessibilityLabelExceptions` is a top-level key, not nested under `rules`.
:::

### highlight

Controls how AMA visually marks failing elements in the dev overlay.

| Key | Type | Default | Description |
| --- | ---- | ------- | ----------- |
| `mode` | `"border"` \| `"background"` \| `"both"` | `"both"` | Whether to outline, fill, or both when highlighting a failing element |
| `borderWidth` | number | `3` | Width of the highlight border in dp |
| `gap` | number | `4` | Minimum gap between highlighted elements in dp |

```json title="ama.config.json"
{
  "highlight": {
    "mode": "border",
    "borderWidth": 2,
    "gap": 8
  }
}
```

### log

Controls when AMA logs accessibility issues to the console.

| Value | Behaviour |
| ----- | --------- |
| `"inspect"` _(default)_ | Logs only when the AMA inspector is open |
| `"always"` | Always logs to the console in dev mode |

```json title="ama.config.json"
{
  "log": "always"
}
```

### uppercaseMinLength

The minimum number of characters a text string must have before the uppercase rule (`NO_UPPERCASE_TEXT`) is applied. Strings shorter than this value are not checked for uppercase.

| Type | Default |
| ---- | ------- |
| number | `4` |

```json title="ama.config.json"
{
  "uppercaseMinLength": 5
}
```

### checks

Feature gates that enable or disable categories of AMA runtime checks.

| Key | Type | Default | Description |
| --- | ---- | ------- | ----------- |
| `ui` | boolean | `true` | Enable UI interaction checks |
| `forms` | boolean | `true` | Enable form and node checks |
| `delay` | number | `1000` | Milliseconds to wait before re-checking after an interaction |

```json title="ama.config.json"
{
  "checks": {
    "ui": true,
    "forms": true,
    "delay": 300
  }
}
```

## Constants

These values are set inside the `rules` object and control internal check behaviour rather than rule severity.

| Constant key | Default | Description |
| ------------ | ------- | ----------- |
| `CONTRAST_CHECKER_MAX_DEPTH` | `5` | How many levels deep AMA checks children for contrast. Set to `0` to disable contrast checking entirely. |
| `IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS` | `false` | When `true`, contrast checks are skipped for elements that are disabled. |

```json title="ama.config.json"
{
  "rules": {
    "CONTRAST_CHECKER_MAX_DEPTH": 0,
    "IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS": true
  }
}
```

[^1]: The rule cannot be overridden
