import { MustNot, ShouldNot } from '@site/src/components';

# Guidelines

In dev mode, AMA components try to enforce fundamental accessibility issues by throwing an error (in dev build only) by throwing an error or a warning if a rule is broken. For example, missing accessibility label, poor color contrast, minimum size not met, etc.

Conscious that there might be edge cases where a rule or two might need to be broken, AMA provides a way to change the logging level of each guideline tested.

:::note

The library does not perform any accessibility check on the production build!
:::

## The log levels

AMA guidelines are categorised as:

- <MustNot />: Those best practices are <b>enforced</b> and AMA to throw an error when fail
- <ShouldNot />: Those best practices are <b>preferred</b> and AMA prints only prints a warning message when fail

### Default Rules

| Log key                                                               | Guideline     |
| --------------------------------------------------------------------- | ------------- |
| [CONTRAST_FAILED](/docs/advanced/contrast)                            | <MustNot />   |
| [CONTRAST_FAILED_AAA](/docs/advanced/contrast)                        | <ShouldNot /> |
| [MINIMUM_SIZE](/docs/advanced/minimum-size)                           | <MustNot />   |
| [NO_ACCESSIBILITY_LABEL](docs/guidelines/accessibility-label)[^1] | <MustNot />   |
| [NO_ACCESSIBILITY_ROLE](/docs/guidelines/accessibility-role) [^1] | <MustNot />   |
| [NO_KEYBOARD_TRAP](/docs/guidelines/keyboard-trap) [^1]           | <MustNot />   |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](/docs/guidelines/uppercase-text)   | <MustNot />   |
| [UPPERCASE_ACCESSIBILITY_LABEL](/docs/guidelines/uppercase-text)           | <MustNot />   |
| [NO_UNDEFINED](/docs/guidelines/required-property)                         | <MustNot />   |

### Constants

| Constant key               | Value |
| -------------------------- | ----- |
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
