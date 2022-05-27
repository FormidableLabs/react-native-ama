# TextInput

TextInput is an extension of the [React Native TextInput](https://reactnative.dev/docs/textinput) component, [focused on accessibility](#accessibility-improvements).

```tsx
import { TextInput } from 'react-native-ama';

<TextInput
  style={styles.input}
  placeholder=""
  onChangeText={newText => setText(newText)}
  defaultValue={text}
  label={<Text style={styles.label}>First name:</Text>}
  labelPosition="afterText"
  returnKeyType="next"
  nextTextInput={lastNameRef}
/>;
```

## Accessibility improvements

Compared to the default React Native component, this custom component:

- Uses the given label text as `accessibilityLabel`; if none is provided
- Hides the label from the screen reader
- Handles focusing the `nextTextInput` when `returnKeyType` is **next**
- Checks for keyboard trap

### The focus

When the user interacts with a `<TextInput />` and specifies `returnKeyType="next"` then must be able to focus on the next field via the corresponding button on the keyboard. So, this component focuses on the `nextTextInput` specified and checks that the focus is passed and the user [hasn't been trapped](/docs/guidelines/keyboard-trap).

:::note

Although React Native supports displaying the **next** button by using `returnKeyType="next"` property, it does not automatically focus on the next input.
:::

### accessibilityLabel

The input field must have an `accessibilityLabel`, and also its corresponding must be hidden from the screen reader to avoid redundant announcement of the same label.

## Additional Props

### `label`

The custom label to use for the component.

| Type        | Default   |
| ----------- | --------- |
| JSX.Element | undefined |

If no accessibilityLabel is provided, the component children are used to generate the one.
Also, the label is modified, and the following prop added:

- `importantForAccessibility: no`
- `accessibilityElementsHidden: true`

So, the label itself is made hidden from the screen reader.

:::note

If the label content ends with a \*, this is stripped from the `accessibilityLabel`, example:

```jsx
<TextInput
  style={styles.input}
  placeholder=""
  onChangeText={newText => setText(newText)}
  defaultValue={text}
  label={<Text style={styles.label}>First name:*</Text>}
  labelPosition="afterText"
  returnKeyType="next"
  nextTextInput={lastNameRef}
/>
```

The `accessibilityLabel` generate is: **"First name:"**
:::

### `labelPosition`

Specify where to render the label.

Possible positions:

- `beforeInput` _(default)_
- `afterInput`

### `nextTextInput`

This parameter is used to focus the input when the next button is pressed.

Once the user presses the key, AMA performs that the given text input has the focus to prevent any keyboard trap.

For example, this will cause AMA to throw an error:

```jsx
<TextInput
  style={styles.input}
  placeholder=""
  onChangeText={newText => setText(newText)}
  defaultValue={text}
  label={<Text style={styles.label}>Last name:</Text>}
  returnKeyType="next"
  nextTextInput={emailRef}
  ref={lastNameRef}
  onBlur={() => {
    lastNameRef.current?.focus();
  }}
/>
```
