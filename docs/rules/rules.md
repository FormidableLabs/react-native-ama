# Rules

In dev mode, AMA components try to enforce fundamental accessibility issues by throwing an error (in dev build only) by throwing an error or a warning if a rule is broken. For example, missing accessibility label, poor color contrast, minimum size not met, etc.

Conscious that there might be edge cases where a rule or two might need to be broken, AMA provides a way to change the logging level of each rule tested.

:::note

The library does not perform any accessibility check on the production build!
:::

## The log levels

AMA allows two-level of logs:

- **throw**: Throws an error
- **warn**: prints the error message using `console.warn`

## Default values

### Log Levels

| Log key                                                                                                   | Log level |
| --------------------------------------------------------------------------------------------------------- | --------- |
| [CONTRAST_FAILED](/docs/advanced/contrast#contrast_failed)                                                | throw     |
| [CONTRAST_FAILED_AAA](/docs/advanced/contrast#contrast_failed_aaa)                                        | warn      |
| [MINIMUM_SIZE](/docs/advanced/minimum-size)                                                               | throw     |
| [NO_ACCESSIBILITY_LABEL](docs/rules/accessibility-label#no_accessibility_label)<sup>\*</sup>              | throw     |
| [NO_ACCESSIBILITY_ROLE](/docs/rules/accessibility-role#no_accessibility_role) <sup>\*</sup>               | throw     |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](/docs/rules/uppercase-text#uppercase_text_no_accessibility_label) | throw     |
| [UPPERCASE_ACCESSIBILITY_LABEL](/docs/rules/uppercase-text#uppercase_accessibility_label)                 | throw     |

### Constants

| Constant key               | Value |
| -------------------------- | ----- |
| CONTRAST_CHECKER_MAX_DEPTH | 5     |

### accessibilityLabelExceptions

This field is empty by default and can be overridden by specifying a list of accessibilityLabel to be excluded from the all caps check.

## Customising the log levels

To customise the log rules, create a JSON file called `ama.json` in the project's root folder, then specify the custom log level for the wanted key.

### Example:

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


:::note

<sup>*</sup> The rule cannot be overridden
:::