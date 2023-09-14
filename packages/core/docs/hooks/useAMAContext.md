# useAMAContext

The hook provides information on various accessibility services and can be used to trigger the AMA error banner.

## Usage

```js title=packages/core/src/hooks/useAMAContext.ts
import { useAMAContext } from 'react-native-ama';

const {
  isReduceTransparencyEnabled: boolean,
  isBoldTextEnabled: boolean,
  isGrayscaleEnabled: boolean,
  isInvertColorsEnabled: boolean,
  isReduceMotionEnabled: boolean,
  isScreenReaderEnabled: boolean,
  reactNavigationScreenOptions: {
    animationEnabled: boolean;
    animation: 'default' | 'fade';
  }
  trackError: (id: string) => void; // dev mode only
  removeError: (id: string) => void; // dev mode only
} = useAMAContext();
```

:::dev

The <i>trackError</i> and <i>removeError</i> functions are available only when the <code>**DEV**</code> flag is <strong>true</strong>. These functions are stripped from the production code!

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

### reactNavigationScreenOptions

Returns an object to be used for the React Navigation [screenOptions](https://reactnavigation.org/docs/stack-navigator/#screenoptions) prop. It's an object containing the following values:

```js
animationEnabled: boolean;
animation: 'default' | 'fade';
```

- **animationEnabled** is _true_ is [isReduceMotionEnabled](#isreducemotionenabled) is false
- **animation** is _default_ [isReduceMotionEnabled](#isreducemotionenabled) is false

#### Example

```jsx
const { reactNavigationScreenOptions } = useAMAContext();

  // dimmed
return (
  // dimmed
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={reactNavigationScreenOptions}>
      {/* ... */}
      </Stack.Navigator>
  // dimmed
  </NavigationContainer>
  // dimmed
)
```

## Methods <DevOnly />

:::dev
The following methods are only available when <code>**DEV**</code> is set to
**true**
:::

### trackError

```js
trackError(uniqueID: string): void;
```

The function adds the failed item to an internal list that keeps track of components that have not passed the accessibility checks.

#### Parameters:

| name     | type   | description                                                                                         |
| -------- | ------ | --------------------------------------------------------------------------------------------------- |
| uniqueID | string | The component unique ID. This is used to prevent adding the same component(s) after re-rendering(s) |

### removeError

```js
removeError(uniqueID: string): void;
```

The function removes the failed item from the list of failed accessibility checks.

:::note
The AMA error banner is automatically hidden when the list of failed items becomes empty.
:::

#### Parameters:

| name     | type   | description             |
| -------- | ------ | ----------------------- |
| uniqueID | string | The component unique ID |
