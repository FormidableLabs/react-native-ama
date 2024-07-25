# useReanimatedTiming

This hooks allow using custom [withTiming](#withtiming) and `withSpring` functions that are reduce motion aware.

## Usage

```js
import {useReanimatedTiming} from 'react-native-ama';

const {withTiming, withSrping} = useReanimatedTiming();
```

## Example

```tsx
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    ClickableSpan,
    Span,
    isMotionAnimation,
    useAMAContext,
    useAnimationDuration,
    useReanimatedTiming,
} from 'react-native-ama';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

export const ReanimatedReduceMotionScreen = () => {
    const value = useSharedValue(0);
    const {withTiming, withSpring} = useReanimatedTiming();

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{translateX: value.value * 255}],
        };
    });

    const testWithTiming = () => {
        value.value = withTiming('translateX', Math.random(), {duration: 300});
    };

    const testWithSpring = () => {
        value.value = withSpring('translateX', Math.random());
    };

    return (
        <View style={styles.view}>
            <Span style={styles.intro}>
                This example shows how to use the{' '}
                <ClickableSpan onPress={() => {
                }}>getAnimationDuration</ClickableSpan>{' '}
                with Reanimated for a more accessible animations.
            </Span>
            <Animated.View style={[styles.box, animatedStyles]}/>

            <Pressable onPress={testWithTiming}>
                <Text>withTiming</Text>
            </Pressable>
            <Pressable onPress={testWithSpring}>
                <Text>withSpring</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingHorizontal: theme.padding.big,
    },
    box: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: theme.color.mixed,
    },
    intro: {
        lineHeight: theme.lineHeight.medium,
    },
});
```

## withTiming

Under the hood calls the
reanimated [withTiming](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming) function.

If the given `propertyKey` is a motion one and [reduce motion](./useAMAContext.md#isreducemotionenabled) is enabled, the
force the duration to be 0, before calling `withTiming`.

### Syntax

```js
withTiming(
    propertyKey
:
keyof
ViewStyle,
    toValue
:
number,
    config
:
WithTimingConfig = {},
    callback ? : AnimationCallback
)
;
```

| Property    | Description                                                                                                                                                                |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| propertyKey | The animation key that will be used with the `useSharedValue`                                                                                                              |
| toValue     | The [target value](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#tovalue-number--string) parameter passed to the original `withTiming` |
| config      | The [config](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#options-object) parameter passed to the original `withTiming`               |
| callback    | The [callback](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#callback-functionoptional) parameter passed to the original `withTiming`  |

#### Example

```js
value.value = withTiming('translateX', Math.random(), {duration: 300});
```

## withSpring

Under the hood calls the
reanimated [withSpring](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withSpring) function.

If the given `propertyKey` is a motion one and [reduce motion](./useAMAContext.md#isreducemotionenabled) is enabled,
then calls `withTiming` function with duration 0 instead.

### Syntax

```js
withTiming(
    propertyKey
:
keyof
ViewStyle,
    toValue
:
number,
    config ? : WithSpringConfig,
    callback ? : AnimationCallback,
)
;
```

| Property    | Description                                                                                                                                                                |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| propertyKey | The animation key that will be used with the `useSharedValue`                                                                                                              |
| toValue     | The [target value](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#tovalue-number--string) parameter passed to the original `withTiming` |
| config      | The [config](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#options-object) parameter passed to the original `withTiming`               |
| callback    | The [callback](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming#callback-functionoptional) parameter passed to the original `withTiming`  |

#### Example

```js
value.value = withSpring('translateX', Math.random());
```

## Related guidelines

- [Animations](../guidelines/animations)
