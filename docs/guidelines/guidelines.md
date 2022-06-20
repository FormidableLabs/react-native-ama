import { Must, MustNot, Should, ShouldNot } from '@site/src/components';

# Guidelines

In dev mode, AMA components try to enforce fundamental accessibility issues by throwing an error (in dev build only) by throwing an error or a warning if a rule is broken. For example, missing accessibility label, poor color contrast, minimum size not met, etc.

Conscious that there might be edge cases where a rule or two might need to be broken, AMA provides a way to change the logging level of each guideline tested.

:::note

The library does not perform any accessibility check on the production build!
:::

## The log levels

AMA guidelines are categorised as:

- <Must /> and <MustNot />: Those best practices are <b>enforced</b> and AMA overlays an error when fail
- <Should /> and <ShouldNot />: Those best practices are <b>preferred</b> and AMA prints only prints a warning message when fail

### Default Rules

| Log key                                                      | Guideline   |
|--------------------------------------------------------------|-------------|
| [CONTRAST_FAILED](./contrast.md)                             | <Must />    |
| [CONTRAST_FAILED_AAA](./contrast.md)                         | <Should />  |
| [FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE](./lists-grids)       | <Should />  |
| [FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE](./lists-grids)         | <Must />    |
| [MINIMUM_SIZE](./minimum-size.md)                            | <Must />    |
| [NO_ACCESSIBILITY_LABEL](./accessibility-label)[^1]          | <Must />    |
| [NO_ACCESSIBILITY_ROLE](./accessibility-rol) [^1]            | <Must />    |
| [NO_FORM_LABEL](./forms)                                     | <Must />    |
| [NO_FORM_ERROR](./forms)                                     | <Must />    |
| [NO_KEYBOARD_TRAP](./keyboard-trap.md) [^1]                  | <MustNot /> |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](./uppercase-text.md) | <MustNot /> |
| [UPPERCASE_ACCESSIBILITY_LABEL](./uppercase-text.md)         | <MustNot /> |

### Constants

| Constant key               | Value |
|----------------------------|-------|
| CONTRAST_CHECKER_MAX_DEPTH | 5     |

### accessibilityLabelExceptions

This field is empty by default and can be overridden by specifying a list of accessibilityLabel to be excluded from the all caps check.

## Customising the log levels

Create a JSON file called `ama.json` in the project's root folder to customise the log rules, then specify the custom log level for the wanted key.

### Example

```json
{
  "rules": {
    "CONTRAST_FAILED": "warn",
    "CONTRAST_CHECKER_MAX_DEPTH": 0
  },
  "accessibilityLabelExceptions": ["A A"]
}
```

:::tip

The JSON file does not need to contain all the log keys, as AMA defaults to the default rule if not present in the JSON one.
:::

[^1]: The rule cannot be overridden
