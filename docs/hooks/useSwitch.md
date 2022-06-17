import { DevOnly } from '@site/src/components';

# useSwitch

This hook allows creating custom Switch and Switch list elements with the [Accessibility checks](#accessibility-checks) needed.

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
- 
At runtime, the hook:

- Forces the use of `accessibilityLabel`
- Enforces the minimum size

### accessibilityLabel <DevOnly />

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](/docs/guidelines/accessibility-label)

### Minimum size <DevOnly />

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](/docs/guidelines/minimum-size).

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
}
```
