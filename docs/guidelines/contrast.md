import { MustNot, ShouldNot } from '@site/src/components';

# Contrast

AMA performs a contrast check between the component background and its children for tappable elements like Pressable, Button, etc.
The check is performed on the component children and sub children up to a depth level of [5](/docs/advanced/custom-log-rules#constants).

The [minimum contrast](#contrast_failed) ratio expected is at least `4.5:1`, and by default, this is a mandatory requirement. While the [enhanced contrast](#contrast_failed_aaa) of at least `7:1` is a suggestion and therefore prints only a warning if it fails.

:::tip

Both Log level type and max depth level can be customised, [here for more info](/docs/advanced/custom-log-rules)
:::

## CONTRAST_FAILED <MustNot />

This error is used when the contrast check between a component background and its children foreground one fails to reach the [AA accessibility level](https://www.w3.org/TR/WCAG21/#contrast-minimum).

## CONTRAST_FAILED_AAA <ShouldNot />

This code is used when the contrast check does not pass the [AAA level](https://www.w3.org/TR/WCAG21/#contrast-enhanced).
