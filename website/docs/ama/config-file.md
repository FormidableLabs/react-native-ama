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

- <Must /> and <MustNot />: Those best practices are <b>enforced</b> and AMA overlays an error when fail
- <Should /> and <ShouldNot />: Those best practices are <b>preferred</b> and AMA prints only prints a warning message when fail

The possible log levels are:

- **error**: The **AMA** error overlay when a check fails
- **warn**: A `console.warn` is performed when a check fails

### AMA Rules

| Log key                                                             | Guideline   | Default | Can override |
| ------------------------------------------------------------------- | ----------- | ------- | ------------ |
| [BOTTOM_SHEET_CLOSE_ACTION](/guidelines/bottomsheet)                | <Must />    | error   | <Yes />      |
| [CONTRAST_FAILED](/guidelines/contrast)                             | <Must />    | error   | <Yes />      |
| [CONTRAST_FAILED_AAA](/guidelines/contrast)                         | <Should />  | warn    | <Yes />      |
| [FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE](/guidelines/lists-grids)    | <Should />  | warn    | <Yes />      |
| [FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE](/guidelines/lists-grids)      | <Must />    | error   | <Yes />      |
| [MINIMUM_SIZE](/guidelines/minimum-size)                            | <Must />    | error   | <Yes />      |
| [NO_ACCESSIBILITY_LABEL](/guidelines/accessibility-label)[^1]       | <Must />    | error   | <No />       |
| [NO_ACCESSIBILITY_ROLE](/guidelines/accessibility-rol) [^1]         | <Must />    | error   | <No />       |
| [NO_FORM_LABEL](/guidelines/forms)                                  | <Must />    | error   | <Yes />      |
| [NO_FORM_ERROR](/guidelines/forms)                                  | <Must />    | error   | <Yes />      |
| [NO_KEYBOARD_TRAP](/guidelines/keyboard-trap) [^1]                  | <MustNot /> | error   | <No />       |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](/guidelines/uppercase-text) | <MustNot /> | error   | <Yes />      |
| [NO_UPPERCASE_TEXT](/guidelines/uppercase-text)                     | <MustNot /> | error   | <Yes />      |

:::note

Rules marked with <No /> are considered bad practices and cannot be turned off!
:::

## Customising the Log Levels

Create a JSON file called `ama.config.json` in the project's root folder to customise the log rules, then specify the custom log level for the wanted key.

### Example

The JSON file does not need to contain all log keys. **AMA** uses the default rule if a key is not present:

```json
{
  rules: {
    "CONTRAST_FAILED": "warn",
    "CONTRAST_CHECKER_MAX_DEPTH": 0,
  }
  "accessibilityLabelExceptions": ["FAQ"]
}
```

### Constants

Elements that perform a contrast check do it on all the children up to the level specified by `CONTRAST_CHECKER_MAX_DEPTH`.

| Constant key               | Default value |
| -------------------------- | ------------- |
| CONTRAST_CHECKER_MAX_DEPTH | 5             |

```json
{
  "rules": {
    "CONTRAST_CHECKER_MAX_DEPTH": 0
  }
}
```

:::tip
This can be turned off by specifying a level of **0**
:::

### accessibilityLabelExceptions

**AMA** performs various checks, including one for [uppercase](/guidelines/uppercase). This rule allows specifying a list of approved all-caps accessibility labels.

```json
{
  "accessibilityLabelExceptions": ["FAQ"]
}
```

:::note

The key `accessibilityLabelExceptions` is not nested under the `rules` key as the above values must be.
:::

[^1]: The rule cannot be overridden
