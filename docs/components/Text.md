# Text

Text is an extension of the [React Native Text](https://reactnative.dev/docs/text) component, focused on accessibility.

```tsx
import { Text } from 'react-native-ama';

<Text autofocus>I'm pressable</Text>;
```

## The differences

Compared to the default React Native component, this one performs the following checks at runtime:

- [Missing accessibilityLabel when using `textTransform: uppercase` style](/docs/rules/uppercase-text#uppercase_text_no_accessibility_label)
- [accessibilityLabel in all caps](/docs/rules/uppercase-text#uppercase_accessibility_label)

## Additional Props

### `autofocus`

Allows the SR to autofocus the Text element when its rendered.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

:::note

When `autofocus` is set to true, AMA requires the `accessibilityRole` property to be set to "header"!
:::
