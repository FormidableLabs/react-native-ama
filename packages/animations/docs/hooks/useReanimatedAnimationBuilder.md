import { Required } from '@site/src/components'

# useReanimatedAnimationBuilder

A hook distilling [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations) functionality
to animate the entry and exiting of an Animated components, honouring
the [Reduce Motion](https://reactnative.dev/docs/accessibilityinfo) preference.

## Usage

```jsx
import { useReanimatedAnimationBuilder } from '@react-native-ama/animations';

const Example = () => {
  const { entering, exiting } = useReanimatedAnimationBuilder({
    from: { transform: [{ translateY: 'targetHeight' }] },
    to: { transform: [{ translateY: 0 }] },
    exitFrom: { transform: [{ translateY: 'currentHeight' }] },
    exitTo,
    duration: 300,
  });

  return (
    <Animated.Text entering={entering} exiting={exiting}>
      Text
    </Animated.Text>
  );
};
```

When the hook is mounted, it will animate entering: `from -> to`, and when it is unmounted, it will animate exiting: `exitFrom -> exitTo`.
If the property `exitFrom` is not specified, it will then play the animation in reverse: `to -> from`.

## Accessibility

For both, `from` and `exitFrom` starting animation, the hook will use a `duration={0}` for each [motion property](../utilities/isMotionAnimation) when [Reduce Motion](../../../core/docs/hooks/useAMAContext#isreducemotionenabled) option is enabled.

## Props

### <Required /> `duration`

The preferred animation duration.

| Type   | Default   |
| ------ | --------- |
| number | undefined |

:::note

The hook will use a `duration={0}` for each [motion property](../utilities/isMotionAnimation) when [Reduce Motion](../../../core/docs/hooks/useAMAContext#isreducemotionenabled) option is enabled.


:::

### <Required /> `from`

The initial value of the animation.

| Type                               |
| ---------------------------------- |
| ViewStyle \| ReanimatedEntryValues |

This parameter sets the initial values for the [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations).
In additional to `ViewStyle`, this property also allows access to special [values](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations/#arguments-1) available by Reanimated:

| Value               | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| targetOriginX       | X coordinate of top left corner in parent's coordinate system |
| targetOriginY       | Y coordinate of top left corner in parent's coordinate system |
| targetWidth         | view's width                                                  |
| targetHeight        | view's height                                                 |
| targetGlobalOriginX | X coordinate of top left corner in global coordinate system   |
| targetGlobalOriginY | Y coordinate of top left corner in global coordinate system   |

### <Required /> `to`

The final (or initial) value of the animation.

| Type      |
| --------- |
| ViewStyle |

This value is used for both entering and exiting animation.
For the entering animation, this is used as the final state; for the exitFrom one, as the initial state.

### `exitFrom`

The initial value for the unmounting animation.

| Type                              |
| --------------------------------- |
| ViewStyle \| ReanimatedExitValues |

In additional to `ViewStyle` this property also allows to access to special [values](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations/#arguments) available by Reanimated:

| Value                | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| currentOriginX       | X coordinate of top left corner in parent's coordinate system |
| currentOriginY       | Y coordinate of top left corner in parent's coordinate system |
| currentWidth         | view's width                                                  |
| currentHeight        | view's height                                                 |
| currentGlobalOriginX | X coordinate of top left corner in global coordinate system   |
| currentGlobalOriginY | Y coordinate of top left corner in global coordinate system   |

Because in the [from](#from) animation, we did specify the special value **targetHeight** we need to provide a "different" value for the exiting animation
as that special name does not exist for the exitFrom animation.

:::note

If not specified, the [from](#from) value is used as the final one for the unmounting animation.

:::

### `exitTo`

The final value for the unmounting animation.

| Type      |
| --------- |
| ViewStyle |

## Related guidelines

- [Animations](/guidelines/animations)
