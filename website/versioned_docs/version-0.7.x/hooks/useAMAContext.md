# useAMAContext

Returns the AMAProvider context values.

## Usage

```js
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
} = useAMAContext();
```

## isReduceTransparencyEnabled <div class="platform ios">iOS</div>

Is `true` if the user switched on the accessibility setting: **Reduce Transparency**.

## isBoldTextEnabled <div class="platform ios">iOS</div>

Is `true` if the user switched on the accessibility setting: **Bold Text**.

## isGrayscaleEnabled <div class="platform ios">iOS</div>

Is `true` if the user switched on the accessibility setting: **Grayscale**.

## isInvertColorsEnabled <div class="platform ios">iOS</div>

Is `true` if the user switched on the accessibility setting: **Invert colors**.

## isReduceMotionEnabled

Is `true` if the user switched on the accessibility setting: **Reduce motion** on iOS or switches off the Animations on Android.

:::note

On Android, this option relies on a custom code as the react-native one only detects if the "Transition Animation Scale" in "Developer options" is "Animation off".
:::

## isScreenReaderEnabled

Is `true` if the user is using a screen reader, like [VoiceOver](https://support.apple.com/en-gb/guide/iphone/iph3e2e415f/ios) or [Talkback](https://support.google.com/accessibility/android/answer/6283677?hl=en-GB).

## reactNavigationScreenOptions

Returns an object to be used for the React Navigation [screenOptions](https://reactnavigation.org/docs/stack-navigator/#screenoptions) prop. It's an object containing the following values:

```js
animationEnabled: boolean;
animation: 'default' | 'fade';
```

- **animationEnabled** is _true_ is [isReduceMotionEnabled](#isreducemotionenabled) is false
- **animation** is _default_ [isReduceMotionEnabled](#isreducemotionenabled) is false

### Example

```jsx
const { reactNavigationScreenOptions } = useAMAContext();

return (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={reactNavigationScreenOptions}>
      {/* ... */}
      </Stack.Navigator>
  </NavigationContainer>
)
```
