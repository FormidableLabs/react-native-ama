# Pressable

Pressable is an extension of the React Native [Pressable](https://reactnative.dev/docs/pressable) component, focused on accessibility.

```tsx
import { Pressable } from 'react-native-ama';

<Pressable accessibilityRole="button" accessibilityLabel="I'm pressable!">
  <Text>I'm pressable</Text>
</Pressable>;
```

## The differences

### Properties

The component exposes all the React Native [Pressable](https://reactnative.dev/docs/pressable) props with the following exceptions:

- `accessibilityRole` and `accessibilityLabel` are mandatory properties, and if omitted, the app will throw an error (in dev mode only)
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as a property

### Contrast checker

The component performs a contrast check between its background color and its direct child foreground in dev mode.
The test throws a [CONTRAST_FAILED](/react-native-ama/docs/advanced/custom-log-rules#contrast_failed) error in case fails the [AA](https://www.w3.org/TR/WCAG21/#contrast-minimum) level, and a [CONTRAST_FAILED_AAA](/react-native-ama/docs/advanced/custom-log-rules#contrast_failed_aaa) error if fails the [AAA](https://www.w3.org/TR/WCAG21/#contrast-enhanced) one.

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to determin its size at runtime. If the size is less than [44x44px on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) or [48x48dp on Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB), then it logs the [MINIMUM_SIZE](/react-native-ama/docs/advanced/custom-log-rules#minimum_size) error.

## Additional Props

### `busy`

Indicates whether an element is currently busy or not.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

#### Example

```tsx
import { ActivityIndicator } from 'react-native';
import { Pressable, Text } from 'react-native-ama';

const Test = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const doSometing = async () => {
    setIsLoading(true);

    await slowCall();

    setIsLoading(true);
  };

  return (
    <Pressable
      accessiblityRole="button"
      accessibilityLabel="Do it"
      busy={isLoading}
      onPress={doSometing}>
      {isLoading ? <ActivityIndicator /> : <Text>Do it</Text>}
    </Pressable>
  );
};
```

### `checked`

Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes.

| Type               | Default   | Required |
| ------------------ | --------- | -------- |
| boolean or 'mixed' | undefined | No       |

### `selected`

Indicates whether a selectable element is currently selected or not.

| Type    | Default   | Required |
| ------- | --------- | -------- |
| boolean | undefined | No       |

### `expanded`

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default   | Required |
| ------- | --------- | -------- |
| boolean | undefined | No       |

#### Example

```tsx
import { ActivityIndicator } from 'react-native';
import { Pressable, Text } from 'react-native-ama';

const Test = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <Pressable
        accessiblityRole="button"
        accessibilityLabel={isExpanded ? 'Less' : 'More'}
        expanded={isExpanded}
        onPress={() => setIsExpanded(expanded => !expanded)}>
        {isExpanded ? <MinumIcon /> : <PlusIcon />}
      </Pressable>
      {isExpanded ? <>{/* content goes here */}</> : null}
    </>
  );
};
```
