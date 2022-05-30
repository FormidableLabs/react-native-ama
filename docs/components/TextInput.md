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
  nextFormField={nextFormField}
/>;
```

## Accessibility improvements

Compared to the default React Native component, this custom component:

- Uses the given label text as `accessibilityLabel`; if none is provided
- Hides the label from the screen reader
- Handles the value `returnKeyType`
- Handles focusing the next form field when `returnKeyType` is **next**
- Checks for keyboard trap

### accessibilityLabel

The input field must have an `accessibilityLabel`, and also its corresponding must be hidden from the screen reader to avoid redundant announcement of the same label.

### returnKeyType

When the user lands on a `<TextInput />` the [`returnKeyType`](https://reactnative.dev/docs/textinput#returnkeytype) needs to be handle allowing them to either focus the next field, when `returnKeyType="next"`, or submit the form, when `returnKeyType="done"`. The React Native default `<TextInput />` allows customing the `returnKeyType` prop but leaves the developer to handle the action when the button is pressed.

Instead, the AMA customised `TextInput` automatically handles the property `returnKeyType` and its action:

- If the `TextInput` is the last one of the [Form](/docs/components/Form) then sets `returnKeyType="done"`, otherwise `returnKeyType="next"`
- The next key focuses the next `TextInput` or [FormField](/docs/components/FormField)
- The done button submits the [Form](/docs/components/Form)

:::note

AMA does not alter the "returnKeyType" passed as a prop!
:::

### Keyboard trap

Once the user presses the **next** key, AMA checks that the:

- The current `TextInput` does no longer have the focus
- If the next field is a `TextInput`, then check if it gained the focus

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

### `nextFormField` _(optional)_

This parameter specifies the next form field to focus on when the next button is pressed.

```jsx
<TextInput
  style={styles.input}
  placeholder=""
  onChangeText={newText => setText(newText)}
  defaultValue={text}
  label={<Text style={styles.label}>Last name:</Text>}
  returnKeyType="next"
  nextFormField={emailRef}
  ref={lastNameRef}
/>
```
