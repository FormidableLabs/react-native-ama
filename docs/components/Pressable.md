# Pressable

Pressable is an extension of the React Native [Pressable](https://reactnative.dev/docs/pressable) component, focused on accessibility.

```tsx
import { Pressable } from 'react-native-ama';

<Pressable accessibilityRole="button" accessibilityLabel="I'm pressable!">
    <Text>I'm pressable</Text>
</Pressable>
```

## The differences

### Properties

The component exposes all the React Native [Pressable](https://reactnative.dev/docs/pressable) props with the following exceptions:

- `accessibilityRole` and `accessibilityLabel` are mandatory properties and if omitted the app will throw an error (in dev mode only)
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as property

### Contrast checker

In dev mode only, the component performs a contrast check between its background color and its direct child foreground one.
The test throws an error if fails the [AA](https://www.w3.org/TR/WCAG21/#contrast-minimum) level, while prints a warning if fails the [AAA](https://www.w3.org/TR/WCAG21/#contrast-enhanced) one.

### Minimum size



## Example

## Additional Props