# Text

Text is an extension of the [React Native Text](https://reactnative.dev/docs/text) component, [focused on accessibility](#accessibility-improvements).

```tsx
import { Text } from 'react-native-ama';

<Text autofocus>I'm pressable</Text>;
```

## Accessibility improvements

Compared to the default React Native component, this one performs the following checks at runtime:

- [Missing accessibilityLabel](/guidelines/text) when using `textTransform: uppercase` style
- [accessibilityLabel in all caps](/guidelines/text)
- Performs a [Minimum Size](/guidelines/minimum-size) check <DevOnly /> when the component has the property `onPress` set

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](/guidelines/minimum-size).

## Additional Props

### `autofocus`

Allows the screen reader to autofocus the Text element when it is rendered.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

:::note

When `autofocus` is set to true, AMA forces the `accessibilityRole` to **header**
:::

## Related guidelines

- [Headers](../guidelines/headers)
- [Accessibility Label](../guidelines/accessibility-label)
- [Minimum Size](../guidelines/minimum-size)
