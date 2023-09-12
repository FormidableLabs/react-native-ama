# Config file

AMA comes with predefined rules and severity for the built-in components and hooks. Those rules have been created to improve the accessibility of those elements and should always be respected.

Customizing log levels can be done via the `ama.config.json` file to handle edge cases that are out of our control, and require breaking a rule or two.

:::info

The library does not perform any accessibility checks on the production build!

:::

## The log levels

AMA guidelines are categorised as:

- <Must /> and <MustNot />: Those best practices are <b>enforced</b> and AMA overlays an error when fail
- <Should /> and <ShouldNot />: Those best practices are <b>preferred</b> and AMA prints only prints a warning message when fail

### AMA Rules

| Log key                                                               | Default     |
| --------------------------------------------------------------------- | ----------- |
| [BOTTOM_SHEET_CLOSE_ACTION](../guidelines/bottomsheet)                | <Must />    |
| [CONTRAST_FAILED](../guidelines/contrast)                             | <Must />    |
| [CONTRAST_FAILED_AAA](../guidelines/contrast)                         | <Should />  |
| [FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE](../guidelines/lists-grids)    | <Should />  |
| [FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE](../guidelines/lists-grids)      | <Must />    |
| [MINIMUM_SIZE](../guidelines/minimum-size.md)                         | <Must />    |
| [NO_ACCESSIBILITY_LABEL](../guidelines/accessibility-label)[^1]       | <Must />    |
| [NO_ACCESSIBILITY_ROLE](../guidelines/accessibility-rol) [^1]         | <Must />    |
| [NO_FORM_LABEL](../guidelines/forms)                                  | <Must />    |
| [NO_FORM_ERROR](../guidelines/forms)                                  | <Must />    |
| [NO_KEYBOARD_TRAP](../guidelines/keyboard-trap.md) [^1]               | <MustNot /> |
| [UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL](../guidelines/uppercase-text) | <MustNot /> |
| [NO_UPPERCASE_TEXT](../guidelines/uppercase-text)                     | <MustNot /> |

### Constants

Elements that perform a contrast check do it on all the children up to the level specified by `CONTRAST_CHECKER_MAX_DEPTH`.

| Constant key               | Default value |
| -------------------------- | ------------- |
| CONTRAST_CHECKER_MAX_DEPTH | 5             |

This can be turned off by specifying a level of **0**

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

:::warning

Every time the `ama.rules.json` file is updated, you need to update the copy inside the `node_modules` folder and restart the development server:

```bash
cp ama.rules.json node_modules/react-native-ama/

yarn start
```

:::

[^1]: The rule cannot be overridden
