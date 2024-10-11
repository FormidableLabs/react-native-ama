import { Required } from '@site/src/components'

# useKeyboard

`useKeyboard` is a hook that provides Reanimated shared values for the current and final heights of the keyboard, along with a boolean shared value indicating whether the keyboard is visible. These properties are `keyboardHeight`, `keyboardFinalHeight`, and `isKeyboardVisible` and can be utilized when building animations.

:::info

This hook is provided for convenience, however it is not necessary for accessibility or part of the official AMA guidelines.

:::

## Usage

```tsx {2-5,12-24}
import { useKeyboard } from '@react-native-ama/extras';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const Example = props => {
  const { keyboardHeight, keyboardFinalHeight, isKeyboardVisible } =
    useKeyboard(props.shouldHandleKeyboardEvents);

  // Do something with values
  const maxHeightValue = useDerivedValue(() => {
    return maxHeight - keyboardHeight.value;
  }, [keyboardHeight, maxHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    const keyboard = keyboardHeight.value;

    return {
      transform: [{ translateY: translateY.value - keyboard }],
      maxHeight: maxHeightValue.value,
    };
  }, [maxHeightValue, translateY, keyboardHeight]);

  return <Animated.View style={[animatedStyle]} />;
};
```

## Arguments

### `shouldHandleKeyboardEvents` _(optional)_

The data passed to the Scrollable component, used to calculate the number of items in the carousel.

| Type    | Default |
| ------- | ------- |
| boolean | true    |

## Returns

### `keyboardHeight`

A Reanimated shared value representing the current height of the keyboard.

| Type                  | Initial |
| --------------------- | ------- |
| SharedValue\<number\> | 0       |

> You can access data stored in the shared value with either its value property or get and set methods.

### `keyboardFinalHeight`

A Reanimated shared value representing the final height of the keyboard. When the keyboard is not visible, this value will be 0.

| Type                  | Initial |
| --------------------- | ------- |
| SharedValue\<number\> | 0       |

> You can access data stored in the shared value with either its value property or get and set methods.

### `isKeyboardVisible`

A Reanimated shared value representing whether the keyboard is visible.

| Type                   | Initial |
| ---------------------- | ------- |
| SharedValue\<boolean\> | false   |

> You can access data stored in the shared value with either its value property or get and set methods.

### Related

:::note SharedValue type

```ts
interface SharedValue<Value = unknown> {
  value: Value;
  get(): Value;
  set(value: Value | ((value: Value) => Value)): void;
  addListener: (listenerID: number, listener: (value: Value) => void) => void;
  removeListener: (listenerID: number) => void;
  modify: (
    modifier?: <T extends Value>(value: T) => T,
    forceUpdate?: boolean,
  ) => void;
}
```

:::
