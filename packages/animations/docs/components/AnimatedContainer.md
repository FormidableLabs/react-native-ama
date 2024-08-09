import { Required } from '@site/src/components'

# AnimatedContainer

This component is built on top of [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/customAnimations)
and let us animate the entry and exitFrom of the container, honouring
the [Reduce Motion] (https://reactnative.dev/docs/accessibilityinfo) preference.

## Example

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

When the component is mounted, it will animate it from: `from -> to`, and when it is unmounted, it will animate it from: `exitFrom -> to`.
If the property `exitFrom from` is not specified, it will then play the animation in reverse: `to -> from`.

## Accessibility

For both, enter and exitFrom animation, the component will use a `duration={0}` for each [motion property](../utils/isMotionAnimation) when [Reduce Motion](../hooks/useAMAContext#isreducemotionenabled) option is enabled.

## Props

### `autofocus`

If set to true, wraps the child inside the [AutofocusContainer](./AutofocusContainer)

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `duration`

The preferred animation duration.

| Type   | Default |
| ------ | ------- |
| number | 300     |

:::note

The component will use a `duration={0}` for each [motion property](../utils/isMotionAnimation) when [Reduce Motion](../hooks/useAMAContext#isreducemotionenabled) option is enabled.

:::

### <Required /> `from`

The initial value of the animation.

| Type                               |
| ---------------------------------- |
| ViewStyle \| ReanimatedEntryValues |

This parameter sets the initial values for the [Reanimated custom animations](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/customAnimations).
In additional to `ViewStyle`, this property also allows access to special values available by Reanimated:

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
import { AnimatedContainer } from 'react-native-ama';

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

This value is used for both entering and exiting animation.
For the entering animation, this is used as the final state; for the exitFrom one, as the initial state.

```jsx
import { AnimatedContainer } from 'react-native-ama';

<AnimatedContainer from={{ opacity: 0 }} to={{ opacity: 1 }} />;
```

In this case, the view will fade In when mounted and fade out when unmounted.

### `exitFrom`

The initial value for the unmounting animation.

| Type                              |
| --------------------------------- |
| ViewStyle \| ReanimatedExitValues |

In additional to `ViewStyle` this property also allows to access to special values available by Reanimated:

| Value                | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| currentOriginX       | X coordinate of top left corner in parent's coordinate system |
| currentOriginY       | Y coordinate of top left corner in parent's coordinate system |
| currentWidth         | view's width                                                  |
| currentHeight        | view's height                                                 |
| currentGlobalOriginX | X coordinate of top left corner in global coordinate system   |
| currentGlobalOriginY | Y coordinate of top left corner in global coordinate system   |

```jsx
import { AnimatedContainer } from 'react-native-ama';

<AnimatedContainer
  from={{ transform: [{ translateY: 'targetHeight' }] }}
  to={{ transform: [{ translateY: 0 }] }}
  exitFrom={{ transform: [{ translateY: 'currentHeight' }] }}
/>;
```

Because in the [from](#from) animation, we did specify the special value **targetHeight** we need to provide a "different" value for the exiting animation
as that special name does not exist for the exitFrom animation.

:::note

If not specified, the [from](#from) value is used as the final one for the unmounting animation.

:::

### `style`

The container style

| Type      |
| --------- |
| ViewStyle |

## Related guidelines

- [Animations](../guidelines/animations)
