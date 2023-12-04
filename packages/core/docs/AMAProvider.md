# AMAProvider

You must include the provider in your app because it stores information about various accessibility services. This information is essential for the internal functioning of the library's packages and hooks.
The provider manages the failure message that appears when AMA accessibility fails[^1].

## Usage

```jsx {1-4,8-9}
import { AMAProvider } from 'react-native-ama';

const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```

## Context Values

```js title=packages/core/src/components/AMAProvider.tsx
export type AMAContextValue = {
  isBoldTextEnabled: boolean,
  isScreenReaderEnabled: boolean,
  isGrayscaleEnabled: boolean,
  isInvertColorsEnabled: boolean,
  isReduceMotionEnabled: boolean,
  isReduceTransparencyEnabled: boolean,
  reactNavigationScreenOptions: {
    animationEnabled: boolean,
    animation: 'default' | 'fade',
  },
  trackError: (id: string) => void, // dev mode only
  removeError: (id: string) => void, // dev mode only
};
```

Check [useAMAContext](../hooks/useAMAContext) for more info.

:::dev

The <i>trackError</i> and <i>removeError</i> functions are available only when the <code>**DEV**</code> flag is <strong>true</strong>. These functions are stripped from the production code!
:::

[^1]: This only in dev mode
