import { Must } from '@site/src/components';

# Minimum Size

AMA performs a minimum size check for tappable elements like Pressable, Button, etc. The expected minimum size is:

- [44x44px on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
- [48x48dp on Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)


:::tip

The Log level type can be customised, [here for more info](./custom-log-rules.md)
:::

## hitSlop vs min size

AMA prefers forcing a minimum size check instead of using [hitSlop](https://reactnative.dev/docs/pressable#hitslop); as with the latter, the hit area is **never** extended beyond the parent boundaries: 

> The touch area never extends past the parent view bounds, and the Z-index of sibling views always takes precedence if a touch hits two overlapping views.
>
> [https://reactnative.dev/docs/touchablewithoutfeedback#hitslop](https://reactnative.dev/docs/touchablewithoutfeedback#hitslop)

So, if the parent width or height is less than 44 or 48px, the touch area will not meet the minimum requirement. In contrast, `min-width` and `min-height` forces the component to have the minimum size preferred.

## AMA dev runtime errors

### MINIMUM_SIZE <Must />

This error is used when a touchable area is less than [44x44px on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) or [48x48dp on Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)
