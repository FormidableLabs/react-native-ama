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
