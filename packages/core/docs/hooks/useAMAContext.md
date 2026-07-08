# useAMAContext

The hook provides information on various accessibility services and can be used to trigger the AMA error banner.

## Usage

```ts
import { useAMAContext } from '@react-native-ama/core';

const {
  isBoldTextEnabled,
  isScreenReaderEnabled,
  isGrayscaleEnabled,
  isInvertColorsEnabled,
  isReduceMotionEnabled,
  isReduceTransparencyEnabled,
  isHighTextContrastEnabled,
  isDarkerSystemColorsEnabled,
  reactNavigationScreenOptions,
  trackError, // dev mode only
} = useAMAContext();
```

:::dev

The <i>trackError</i> function is available only when the <code>**DEV**</code> flag is <strong>true</strong>. It is stripped from the production code!

:::

## Properties

### isReduceTransparencyEnabled <iOS />

Is `true` if the user switched on the accessibility setting: **Reduce Transparency**.

### isBoldTextEnabled <iOS />

Is `true` if the user switched on the accessibility setting: **Bold Text**.

### isGrayscaleEnabled <iOS />

Is `true` if the user switched on the accessibility setting: **Grayscale**.

### isInvertColorsEnabled <iOS />

Is `true` if the user switched on the accessibility setting: **Invert colors**.

### isReduceMotionEnabled

Is `true` if the user switched on the accessibility setting: **Reduce motion** on iOS or switches off the Animations on Android.

### isScreenReaderEnabled

Is `true` if the user is using a screen reader, like [VoiceOver](https://support.apple.com/en-gb/guide/iphone/iph3e2e415f/ios) or [Talkback](https://support.google.com/accessibility/android/answer/6283677?hl=en-GB).

### isHighTextContrastEnabled <Android />

Is `true` if the user switched on the accessibility setting: **High Text Contrast**.

### isDarkerSystemColorsEnabled <iOS />

Is `true` if the user switched on the accessibility setting: **Increase Contrast** (Darker System Colors).

### reactNavigationScreenOptions

Returns an object to be used for the React Navigation [screenOptions](https://reactnavigation.org/docs/stack-navigator/#screenoptions) prop. It's an object containing the following values:

```ts
animationEnabled: boolean;
animation: 'default' | 'fade';
```

- **animationEnabled** is _true_ when [isReduceMotionEnabled](#isreducemotionenabled) is false
- **animation** is _'default'_ when [isReduceMotionEnabled](#isreducemotionenabled) is false

#### Example

```jsx {2-5,7-10}
const { reactNavigationScreenOptions } = useAMAContext();

return (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={reactNavigationScreenOptions}>
      {/* ... */}
    </Stack.Navigator>
  </NavigationContainer>
);
```

## Methods <DevOnly />

:::dev
The following methods are only available when <code>**DEV**</code> is set to
**true**
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
