# useAnimationDuration

When passing a motion property, returns 0 if [Reduce Motion](../hooks/useAMAContext#isreducemotionenabled) is enabled otherwise the given value.

## Usage

```js
import { useAnimationDuration } from 'react-native-ama/animations';

const { getAnimationDuration } = useAnimationDuration();
```

## getAnimationDuration

### Syntax

```js
function getAnimationDuration(
  property: ViewStyle,
  durationMS: number,
): WithTimingConfig {}
```

| Property   | Description                                  |
| ---------- | -------------------------------------------- |
| property   | The property to animate                      |
| durationMS | The duration to use if reduced motion is off |

### Example

We can create more accessible animations when using Reanimated:

```ts
const value = useSharedValue(0);

const animatedStyles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: value.value * 255 }],
  };
});

const playAnimation = () => {
  value.value = withTiming(
    Math.random(),
    {
      duration: getAnimationDuration('translateX', 300),
    }
  );
};
```

Because we specified `translateX` as the property we're going to use for the animation, and considering that that property is a [motion animation](../utilities/isMotionAnimation.md); `playAnimation` will use a duration of **300ms** when reduce motion is _off_, and duration of **0s** when is on

## Related guidelines

- [Animations](/guidelines/animations)
