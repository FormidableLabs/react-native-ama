# useAnimationDuration

Returns `0` for a given motion property when [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) is enabled, otherwise returns the given duration. Use this when building Reanimated animations to ensure they respect the user's reduce-motion preference.

## Usage

```js
import { useAnimationDuration } from '@react-native-ama/animations';

const { getAnimationDuration } = useAnimationDuration();
```

## Parameters

None — the hook reads `isReduceMotionEnabled` from the AMA context automatically.

## Returns

### `getAnimationDuration`

```ts
getAnimationDuration(property: keyof ViewStyle, durationMS: number): number
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `property` | `keyof ViewStyle` | The style property being animated (e.g. `'translateX'`). Motion properties return `0` when reduce motion is enabled. |
| `durationMS` | `number` | The duration to use when reduce motion is off. |

Returns `0` if `property` is a motion animation and reduce motion is enabled; otherwise returns `durationMS`.

## Example

```ts
import { useAnimationDuration } from '@react-native-ama/animations';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { getAnimationDuration } = useAnimationDuration();
const value = useSharedValue(0);

const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: value.value * 255 }],
  };
});

const playAnimation = () => {
  value.value = withTiming(Math.random(), {
    duration: getAnimationDuration('translateX', 300),
  });
};
```

Because `translateX` is a motion property, `getAnimationDuration` returns `300` when reduce motion is off, and `0` when it is on.

## Related guidelines

- [Animations](/guidelines/animations)
