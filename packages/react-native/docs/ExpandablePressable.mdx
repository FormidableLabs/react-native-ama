import { DevOnly, Required } from '@site/src/components';

# ExpandablePressable

ExpandablePressable is the [Pressable](./Pressable.md) component that automatically handles the [expanded](https://reactnative.dev/docs/accessibility#accessibilitystate) `accessibilityState`. Under the hood it uses [useExpandable](./hooks/useExpandable.md) to achieve this.

## Usage

```tsx
import { ExpandablePressable } from 'react-native-ama';

<ExpandablePressable
  accessibilityLabel="I'm ExpandablePressable!"
  expanded={isExpanded}
  onPress={onPress}>
  <Text>I'm pressable</Text>
</ExpandablePressable>;
```

#### Example

```tsx
import { ExpandablePressable, Text } from '@react-native-ama/react-native';

const Example = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <ExpandablePressable
        accessibilityLabel={isExpanded ? 'Less' : 'More'}
        expanded={isExpanded}
        onPress={() => setIsExpanded(expanded => !expanded)}>
        {isExpanded ? <MiniumIcon /> : <PlusIcon />}
      </ExpandablePressable>
      {isExpanded ? <>{/* content goes here */}</> : null}
    </>
  );
};
```

# Accessibility

The hook automatically:

- Sets `accessibilityRole` to **button**
- Handles the `accessibilityState` for **expanded**

Compared to the default React Native component, this custom component:

- Forces the use of `accessibilityLabel` <DevOnly />
- Performs a [Minimum Size](../../../website/guidelines/minimum-size.md) check <DevOnly />
- Performs a [contrast checker](../../../website/guidelines/contrast.md) between its background color and its children color <DevOnly />

### accessibilityRole

The `accessibilityRole` property is used by the screen reader to announce the kind of element focused on. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](../../../website/guidelines/accessibility-role.md)

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](../../../website/guidelines/accessibility-label.md)

### Contrast checker

The component performs a [contrast check](../../../website/guidelines/contrast.md) between its background colour and the children's foreground when in dev mode.

:::info
AMA does also perform a contrast check on disabled button, as a [poor contrast can make them hard to read](https://axesslab.com/disabled-buttons-suck/#they-are-hard-to-see).
:::

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](../../../website/guidelines/minimum-size.md).

## Props

### <Required /> `accessibilityLabel`

The `accessibilityLabel` for the expandable button, this is announced by the screen reader when the element gains focus, then it announces its role. The accessibilityLabel is a required properties as if it is omitted, the user will have no context for the purpose of the button.

| Type   | Default   |
| ------ | --------- |
| string | undefined |

### <Required /> `expanded`

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

## Related guidelines

- [Accessibility Label](../../../website/guidelines/accessibility-label.md)
- [Accessibility Role](../../../website/guidelines/accessibility-role.md)
- [Contrast](../../../website/guidelines/contrast.md)
- [Minimum Size](../../../website/guidelines/minimum-size.md)

## External resources

- [Disabled buttons suck](https://axesslab.com/disabled-buttons-suck/)
