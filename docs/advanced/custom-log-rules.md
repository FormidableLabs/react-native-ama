# Log rules

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

| Log key | Log level |
|---|---|
| CONTRAST_FAILED | throw|
|  CONTRAST_FAILED_AAA | warn|
|  MINIMUM_SIZE | throw|
|  PROPERTY_UNDEFINED | throw|

#### CONTRAST_FAILED

This error is used when the contrast check between a component background and its children foreground one fails to reach the [AA accessibility level](https://www.w3.org/TR/WCAG21/#contrast-minimum).

#### CONTRAST_FAILED_AAA

This is used when the contrast check does not pass the [AAA level](https://www.w3.org/TR/WCAG21/#contrast-enhanced).

#### MINIMUM_SIZE

This error is used when a touchable area is less than [44x44px on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) or [48x48dp on Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)

#### PROPERTY_UNDEFINED

This is used when a property marked as required in TS is not present, for example: `accessibilityRole` for the [Pressable](/react-native-ama/docs/components/Pressable) component.

## Customising the log levels

To customise the log rules, create a JSON file called `ama.json` in the project's root folder, then specify the custom log level to use for the wanted key.

:::note

The JSON file does not need to contain all the log keys, as AMA defaults to the default rule if not present in the JSON one.
:::