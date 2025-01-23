# AutofocusContainer

It is a utility component that automatically calls the [useFocus](../hooks/useFocus) hook when it is mounted.

## Usage

```jsx
import {AutofocusContainer} from "react-native-ama";

<AutofocusContainer props={}>{children}</AutofocusContainer>
```

## Example

This component can be used to move the focus on dynamically shown components, for example:

```jsx title="UseTimedAction.screen.tsx"
<View style={styles.centeredView}>
  <CTAPressable title="Show timed content" onPress={handleOnPress} />
  {showContent ? (
    <AutofocusContainer>
      <Text>Great! You did it :)</Text>
      <Spacer height="big" />
      <CTAPressable title="Show home screen" />
    </AutofocusContainer>
  ) : null}
</View>
```

In this example, we want to move the focus to the view rendered once the user taps on "Show timed content".

:::warning

The autofocus works only if the container contains accessible elements, like Text, Buttons, etc.
Alternatively, bypassing the [accessibilityLabel](#accessibilitylabel) property, the child will be wrapped in an accessible View.
:::

## Accessibility

- Once the focus is moved makes, the screen reader announces all the text present in that container

## Props

### `accessibilityLabel`

The label to assign to the wrapping View container.

## Related guidelines

- [Focus](/guidelines/focus)
