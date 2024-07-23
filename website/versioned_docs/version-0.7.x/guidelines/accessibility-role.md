import { Must } from '@site/src/components';

# Accessibility Role

The [accessibilityRole](https://reactnative.dev/docs/accessibility#accessibilityrole) communicates the purpose of a component to the assistive technology user and so AMA requires it by tappable elements.

The lack of a value causes affects the Screen Reader behaviour:

- VoiceOver only reads the component `accessibilityLabel` and `accessibilityHint`, if specified, or any text inside the component
- TalkBack, besides reading the component `accessibilityLabel` and `accessibilityHint`, if specified, or any text inside the component, also adds "double-tap" to activate.

## Example

Let's consider the following example:

```jsx
<Pressable onPress={doSomething}>Contact us</Pressable>
```

| VoiceOver  | TalkBack                           |
|------------|------------------------------------|
| Contact us | Contact us, double-tap to activate |

In both cases, the user has no clue about the nature of the component the screen reader landed and/or if any action could be triggered and what could be the outcome of interacting with it.

## The roles 

React Native provides an extensive list of [accessibility roles](https://reactnative.dev/docs/accessibility#accessibilityrole), but not all of them are native to both iOS and Android platform.
For example `checkbox` is a native component on Android but not on iOS.

For those cases AMA automatically uses the correct role for the running platform.

## AMA dev runtime errors

### NO_ACCESSIBILITY_ROLE <Must />

This error is used when a pressable element has no [accessibilityRole](https://reactnative.dev/docs/accessibility#accessibilityrole) defined.

:::note

This rule is mandatory and cannot be turned off!
:::

## Related AMA components

- [ExpandablePressable](../components/expandablepressable)
- [Pressable](../components/pressable)
- [TouchableOpacity](../components/touchableopacity)
- [TouchableWithoutFeedback](../components/TouchableWithoutFeedback)
