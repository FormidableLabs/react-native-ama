# useReanimatedTiming

A hook that provides reduce-motion-aware `withTiming` and `withSpring` functions for [Reanimated](https://docs.swmansion.com/react-native-reanimated/) animations.

## Usage

```js
import { useReanimatedTiming } from '@react-native-ama/animations';

const { withTiming, withSpring } = useReanimatedTiming();
```

## Parameters

None — the hook reads `isReduceMotionEnabled` from the AMA context automatically.

## Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| `withTiming` | function | Reduce-motion-aware wrapper around Reanimated's `withTiming` |
| `withSpring` | function | Reduce-motion-aware wrapper around Reanimated's `withSpring` |

## Example

```tsx
import { useReanimatedTiming } from '@react-native-ama/animations';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const Example = () => {
  const value = useSharedValue(0);
  const { withTiming, withSpring } = useReanimatedTiming();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value * 255 }],
    };
  });

  const testWithTiming = () => {
    value.value = withTiming('translateX', Math.random(), { duration: 300 });
  };

  const testWithSpring = () => {
    value.value = withSpring('translateX', Math.random());
  };

  return (
    <Animated.View style={animatedStyles} />
  );
};
```

## withTiming

Wraps Reanimated's [withTiming](https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming). When `propertyKey` is a motion property and [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) is enabled, forces `duration` to `0`.

### Syntax

```ts
withTiming(
  propertyKey: MotionAnimationKey,
  toValue: number,
  config?: WithTimingConfig,
  callback?: AnimationCallback,
): number
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `propertyKey` | `MotionAnimationKey` | The animated style property (e.g. `'translateX'`). Motion properties get `duration=0` when reduce motion is on. |
| `toValue` | `number` | Target value, passed to Reanimated's `withTiming`. |
| `config` | `WithTimingConfig` | Optional timing config. |
| `callback` | `AnimationCallback` | Optional completion callback. |

### Example

```js
value.value = withTiming('translateX', Math.random(), { duration: 300 });
```

## withSpring

Wraps Reanimated's [withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring). When `propertyKey` is a motion property and [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) is enabled, calls `withTiming` with `duration=0` instead.

### Syntax

```ts
withSpring(
  propertyKey: MotionAnimationKey,
  toValue: number,
  config?: WithSpringConfig,
  callback?: AnimationCallback,
): number
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `propertyKey` | `MotionAnimationKey` | The animated style property. Motion properties skip the spring when reduce motion is on. |
| `toValue` | `number` | Target value, passed to Reanimated's `withSpring`. |
| `config` | `WithSpringConfig` | Optional spring config. |
| `callback` | `AnimationCallback` | Optional completion callback. |

### Example

```js
value.value = withSpring('translateX', Math.random());
```

## Related guidelines

- [Animations](/guidelines/animations)
