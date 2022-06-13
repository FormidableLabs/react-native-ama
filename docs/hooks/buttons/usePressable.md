# usePressable

This hook allows creating custom Pressable elements with the [Accessibility checks](#accessibility-checks) needed.

## Usage

```tsx
import { usePressable, UsePressable } from 'react-native-ama';

const pressableProps = usePressable(props, children);
```

- **children**: The component children
- **props**: The component props

## Accessibility checks

At runtime the hook:

- Forces the use of `accessibilityRole` and `accessibilityLabel`
- Handles the `accessibilityState` [passed as property](/docs/components/buttons/Pressable#accessibility-states)
- Performs a [contrast checker](/docs/guidelines/contrast) between background color and its children color

### accessibilityRole

The `accessibilityRole` property is used by the screen reader to announce the kind of element focused on. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](/docs/guidelines/accessibility-role)

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](/docs/guidelines/accessibility-label)

### Contrast checker

The component performs a [contrast check](/docs/guidelines/contrast) between its background colour and the children's foreground when in dev mode.

:::info
AMA does also perform a contrast check on disabled button, as a [poor contrast can make them hard to read](https://axesslab.com/disabled-buttons-suck/#they-are-hard-to-see).
:::

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](/docs/guidelines/minimum-size).


## Example

```tsx
import { Pressable, PressableProps } from 'react-native';
import { usePressable, UsePressable } from 'react-native-ama';

export type MyCustomPressableProps = UsePressable<PressableProps>;

const MyCustomPressable: React.FC<MyCustomPressableProps> = ({children, ...rest}) => {
    const pressableProps = usePressable(rest, children);

    return (
        <Pressable
            {...props}
            {...pressableProps}
        >
            <Text>This is my custom pressable</Text>
        </Pressable>
    )
}

