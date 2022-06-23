# AutofocusContainer

Is a utility component that automatically calls the [onFocus](../hooks/onFocus) hook when is mounted.

## Usage

```jsx
import {AutofocusContainer} from "react-native-ama";

<AutofocusContainer props={}>{children}</AutofocusContainer>
```

## Example

This component can be used to move the focus on dynamically shown components, for example:

```jsx title="UseTimedAction.screen.tsx"
    <View style={styles.centeredView}>
    <CTAPressable title="Show timed content" onPress={handleOnPress}/>
    {showContent ? (
        <AutofocusContainer>
            <Text>Great! You did it :)</Text>
            <Spacer height="big"/>
            <CTAPressable title="Show home screen"/>
        </AutofocusContainer>
    ) : null}
</View>
```

In this example we want to move the focus to the view rendered once the user taps on "Show timed content".

## Accessibility

- Once the focus is moved makes the screen reader to announce all the text present in that container

## Related guidelines

- [Focus](../guidelines/focus)
