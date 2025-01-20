import { Required } from '@site/src/components';

# Loading

AMA provides an accessible `<Loading ... />` component that auto focuses and announces the accessibility label and busy state. This component wraps the standard [React Native ActivityIndicator](https://reactnative.dev/docs/activityindicator).

:::note
The `Loading` component by default is absolutely positioned and will fill it's parents container. In the example below this would be the `<View>`. This behaviour can be overridden by the `Loading` components props. See props section below.
:::

:::tip
Use the `Loading` component it as a top-level component in your screen while data is being fetched or as a replacement for sections of your screen that are loading to prevent accessibility users from interacting with data that is stale.
:::

## Example

```tsx {2-15,22-23}
import { Loading } from '@react-native-ama/extras';

const Screen = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // fetch data and set loading state while fetching

  return (
    <View>
      <Loading isLoading={isLoading} />
      <ScreenContent />
    </View>
  );
};
```

## Props

:::note
If you want to control the position of the loading indicator you can pass a `style` prop to the `Loading` component which will add styles to the `Loading` containers view. Alternatively you can completely override the current containers style by passing a `containerProps` prop with a style object key-value pair.
:::

### <Required /> `isLoading`

The isLoading state determines if the `Loading` component is returned and is required for the component to function.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `title`

The text used in the `accessibilityLabel` and also shown below the activity indicator if `showTitle` is set to true (default).

| Type   | Default   |
| ------ | --------- |
| string | 'Loading' |

### `showTitle`

Whether or not a title text should be shown below the activity indicator.

| Type    | Default |
| ------- | ------- |
| boolean | true    |

### `style`

A prop to add styles to use for the `Loading` component container view with style merging (style arrays).

| Type      | Default   |
| --------- | --------- |
| ViewStyle | undefined |

:::note

<details>
  <summary>Styles already applied to the `Loading` component container view</summary>
Your styles will be merged with these styles:

```{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  }
```

</details>
:::

### `containerProps`

A prop to control any `Loading` component container view props.

| Type                                        | Default   |
| ------------------------------------------- | --------- |
| Omit\<AutofocusContainerProps, 'children'\> | undefined |

:::note
The `Loading` component container is AMA's `AutofocusContainer` component. The `containerProps` prop is an object that will be spread onto the `AutofocusContainer` component.
:::
