# Pressable

The Pressable component is an enhancement of the [React Native Pressable](https://reactnative.dev/docs/pressable) component, with a [focus on improving accessibility](#accessibility-improvements).

```tsx
import { Pressable } from 'react-native-ama';

<Pressable accessibilityRole="button" accessibilityLabel="I'm pressable!">
  <Text>I'm pressable</Text>
</Pressable>;
```

## Accessibility improvements <DevOnly />

In comparison to the default React Native component, this customized component:

- Forces the use of `accessibilityRole` and `accessibilityLabel`
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as a property
- Performs a [Minimum Size](/guidelines/minimum-size.md) check
- Performs a [contrast checker](/guidelines/contrast.md) between its background color and its children color

<DevOnlyChecks />

### accessibilityRole

The `accessibilityRole` property is used by the screen reader to announce the kind of element focused on. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check the accessibility role guidelines for more info.](/guidelines/accessibility-role)

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check the accessibility label guidelines for more info.](/guidelines/accessibility-label)

### Accessibility states

The default `accessibilityState` property does accept an object like:

```js
accessibilityState={{
    busy: boolean;
    checked: boolean | 'mixed';
    selected: boolean;
    expanded: boolean;
}}
```

To simply the syntax, the custom component allows passing those states as property for the component, handling the generation of the object under the hood.

### Contrast checker

The component performs a [contrast check](../guidelines/contrast.md) between its background colour and the children's foreground when in dev mode.

:::info
AMA does also perform a contrast check on disabled button, as a [poor contrast can make them hard to read](https://axesslab.com/disabled-buttons-suck/#they-are-hard-to-see).
:::

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](../guidelines/minimum-size.md).

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
      onPress={doSometing}
    >
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
        onPress={() => setIsExpanded(expanded => !expanded)}
      >
        {isExpanded ? <MinumIcon /> : <PlusIcon />}
      </Pressable>
      {isExpanded ? <>{/* content goes here */}</> : null}
    </>
  );
};
```

## Related guidelines

- [Accessibility Label](../guidelines/accessibility-label)
- [Accessibility Role](../guidelines/accessibility-role)
- [Contrast](../guidelines/contrast)
- [Minimum Size](../guidelines/minimum-size)

## External resources

- [Disabled buttons suck](https://axesslab.com/disabled-buttons-suck/)
