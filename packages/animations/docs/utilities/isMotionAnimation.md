# isMotionAnimation

`isMotionAnimation` can be used to check if a style key is considered a motion animation, i.e.: `translateX`, `left`, `right`, etc...

## Syntax

```js
function isMotionAnimation(property: ViewStyle): boolean {}
```

| Property | Description           |
| -------- | --------------------- |
| property | The property to check |

## Example

```tsx
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  isMotionAnimation,
  useAMAContext,
  useAccessibleAnimationDuration,
} from 'react-native-ama';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const ReanimatedReduceMotionScreen = () => {
  const { getAnimationDuration } = useAccessibleAnimationDuration();
  const { isReduceMotionEnabled } = useAMAContext();
  const value = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value * 255 }],
    };
  });

  const testWithSpring = () => {
    const to = Math.random();

    value.value =
      isReduceMotionEnabled && isMotionAnimation('translateX')
        ? withTiming(to, { duration: 0 })
        : withSpring(to);
  };

  return (
    <View style={styles.view}>
      <Animated.View style={[styles.box, animatedStyles]} />

      <CTAPressable title="Test: withSpring" onPress={testWithSpring} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 24,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: 'red',
  },
});
```
