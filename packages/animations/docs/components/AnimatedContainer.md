import { Required } from '@site/src/components'

# AnimatedContainer

This component is built on top of [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations)
and animates the entry and exit of the container, honouring
the [Reduce Motion](https://reactnative.dev/docs/accessibilityinfo) preference.

## Usage

```jsx
import { AnimatedContainer } from '@react-native-ama/animations';

<AnimatedContainer
  from={{ transform: [{ translateY: 'targetHeight' }] }}
  to={{ transform: [{ translateY: 0 }] }}
  exitFrom={{ transform: [{ translateY: 'currentHeight' }] }}
  style={styles.timedContent}
  duration={300}
  autofocus
/>;
```

When the component is mounted, it will animate from: `from -> to`, and when it is unmounted, from: `exitFrom -> exitTo`.
If `exitFrom` is not specified, it plays the animation in reverse: `to -> from`.

## Accessibility

For both enter and exit animations, the component uses `duration={0}` for each motion property when the [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) option is enabled.

## Props

Props extend the [`useReanimatedAnimationBuilder`](../hooks/useReanimatedAnimationBuilder.md) props.

### `autofocus`

If set to true, wraps the child inside the [AutofocusContainer](/core/components/AutofocusContainer) from `@react-native-ama/core`.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `duration`

The preferred animation duration in milliseconds.

| Type   | Default |
| ------ | ------- |
| number | 300     |

:::note

The component uses `duration={0}` for each motion property when the [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) option is enabled.

:::

### <Required /> `from`

The initial value of the animation.

| Type                               |
| ---------------------------------- |
| ViewStyle \| ReanimatedEntryValues |

This parameter sets the initial values for the [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations).
In addition to `ViewStyle`, this property also allows access to special [values](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations/#arguments-1) available from Reanimated:

| Value               | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| targetOriginX       | X coordinate of top left corner in parent's coordinate system |
| targetOriginY       | Y coordinate of top left corner in parent's coordinate system |
| targetWidth         | view's width                                                  |
| targetHeight        | view's height                                                 |
| targetGlobalOriginX | X coordinate of top left corner in global coordinate system   |
| targetGlobalOriginY | Y coordinate of top left corner in global coordinate system   |

#### Example

```jsx
import { AnimatedContainer } from '@react-native-ama/animations';

<AnimatedContainer
  from={{ transform: [{ translateY: 'targetHeight' }] }}
  to={{ transform: [{ translateY: 0 }] }}
/>;
```

In this example, `translateY` is assigned the value of the view's height when the container is animated.

### <Required /> `to`

The final (or initial) value of the animation.

| Type      |
| --------- |
| ViewStyle |

This value is used for both entering and exiting animations.
For the entering animation this is the final state; for the exiting animation, the initial state.

```jsx
import { AnimatedContainer } from '@react-native-ama/animations';

<AnimatedContainer from={{ opacity: 0 }} to={{ opacity: 1 }} />;
```

In this case, the view will fade in when mounted and fade out when unmounted.

### `exitFrom`

The initial value for the unmounting animation.

| Type                              |
| --------------------------------- |
| ViewStyle \| ReanimatedExitValues |

In addition to `ViewStyle`, this property also allows access to special [values](https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/custom-animations/#arguments) available from Reanimated:

| Value                | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| currentOriginX       | X coordinate of top left corner in parent's coordinate system |
| currentOriginY       | Y coordinate of top left corner in parent's coordinate system |
| currentWidth         | view's width                                                  |
| currentHeight        | view's height                                                 |
| currentGlobalOriginX | X coordinate of top left corner in global coordinate system   |
| currentGlobalOriginY | Y coordinate of top left corner in global coordinate system   |

```jsx
import { AnimatedContainer } from '@react-native-ama/animations';

<AnimatedContainer
  from={{ transform: [{ translateY: 'targetHeight' }] }}
  to={{ transform: [{ translateY: 0 }] }}
  exitFrom={{ transform: [{ translateY: 'currentHeight' }] }}
/>;
```

Because in the `from` animation we used the special value **targetHeight**, we need a different value for the exiting animation as that special name does not exist for exit animations.

:::note

If not specified, the [from](#from) value is used as the final state for the unmounting animation.

:::

### `exitTo`

The final value for the unmounting animation.

| Type      | Default |
| --------- | ------- |
| ViewStyle | undefined |

### `style`

The container style.

| Type      |
| --------- |
| ViewStyle |

### `ref`

A ref forwarded to the inner `Animated.View`.

| Type |
| ---- |
| `React.Ref<Animated.View>` |

## Methods

None — this component exposes no imperative methods beyond the forwarded `ref`.

## Related guidelines

- [Animations](/guidelines/animations)
