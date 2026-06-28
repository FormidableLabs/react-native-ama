# AMAProvider

You must include the provider in your app because it stores information about various accessibility services. This information is essential for the internal functioning of the library's packages and hooks.
The provider manages the failure message that appears when AMA accessibility fails[^1].

## Usage

```jsx {1-4,8-9}
import { AMAProvider } from '@react-native-ama/core';

const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```

## Context Values

```ts title=packages/core/src/components/AMAProvider.tsx
type AMAContextValue = {
  isBoldTextEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isHighTextContrastEnabled: boolean;
  isDarkerSystemColorsEnabled: boolean;
  reactNavigationScreenOptions: {
    animationEnabled: boolean;
    animation: 'default' | 'fade';
  };
  trackError: (rule: AmaRule, ref?: React.RefObject<any>) => void; // dev mode only
};
```

Check [useAMAContext](./hooks/useAMAContext.md) for more info.

:::dev

The <i>trackError</i> function is available only when the <code>**DEV**</code> flag is <strong>true</strong>. It is stripped from the production code!
:::

## Methods <DevOnly />

:::dev
The following methods are only available when <code>**DEV**</code> is set to **true**.
:::

### trackError

```ts
trackError(rule: AmaRule, ref?: React.RefObject<any>): void;
```

Reports a JS-side accessibility rule failure into the AMA error pipeline. Highlights the offending component in the overlay (using `ref` to target it) and logs the failure for the given rule.

#### Parameters

| name | type | required | description |
| ---- | ---- | -------- | ----------- |
| rule | `AmaRule` | Yes | The accessibility rule that failed (e.g. `'NO_KEYBOARD_TRAP'`) |
| ref | `React.RefObject<any>` | No | Ref to the component that failed; used to highlight it in the overlay. If omitted, the error is logged without field-level targeting. |

[^1]: This is only in dev mode
