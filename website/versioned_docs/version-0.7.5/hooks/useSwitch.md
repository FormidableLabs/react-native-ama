import { DevOnly } from '@site/src/components';

# useSwitch

This hook allows creating custom Switch and SwitchList elements with the [Accessibility checks](#accessibility-checks) needed.

## Usage

```jsx
import { useSwitch } from 'react-native-ama';

const switchProps = useSwitch(props);
```

- **props**: The ViewProps

## Accessibility checks

The hook automatically:

- Sets `accessibilityRole` to **switch**
- Handles the `accessibilityState` for **checked**
- At runtime, the hook:

- Forces the use of `accessibilityLabel` <DevOnly />
- Enforces the minimum size <DevOnly />

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](../guidelines/accessibility-label.md)

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](../guidelines/minimum-size.md).

## Example

```jsx
import { useSwitch } from 'react-native-ama';

const switchProps = useSwitch(rest);

export const SwitchListItem = () => {
  const { style: switchStyle, ...otherSwitchProps } = useSwitch(rest);

  return (
    <TouchableWithoutFeedback {...otherSwitchProps}>
      <View style={[switchStyle || {}, style.switch]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
```

## Related guidelines

- [Forms](../guidelines/forms)
