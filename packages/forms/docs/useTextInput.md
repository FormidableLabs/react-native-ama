# useTextInput

This hook can be used to create a custom TextInput with all the [accessibility improvements](#accessibility-improvements) needed.

:::note

To use `useTextInput` it must be wrapped by the `<Form>` provider component from this package.
:::

## Usage

```jsx
import { useTextInput } from 'react-native-ama';

const MyTextInput = () => {
  const { ref, ...rest } = useTextInput({ ...requiredProps });

  return <TextInput ref={ref} {...rest} />;
};
```

## Accessibility improvements

Compared to the default React Native component, this custom component:

- Uses the given label text as [accessibilityLabel](#accessibilitylabel); if none is provided
- Hides the label from the screen reader (as it would provide redundant information)
- Handles the value [returnKeyType](#returnkeytype)
- Handles focusing the next form field when [returnKeyType](#returnkeytype) is **next**
- Checks for keyboard trap <DevOnly />

### accessibilityLabel

The input field must have an `accessibilityLabel`, and also its corresponding must be hidden from the screen reader to avoid redundant announcement of the same label.

### returnKeyType

When the user lands on a `<TextInput />` the [`returnKeyType`](https://reactnative.dev/docs/textinput#returnkeytype) needs to be handled allowing them to either focus the next control, when `returnKeyType="next"`, or submit the form, when `returnKeyType="done"`. The React Native default `<TextInput />` allows customing the `returnKeyType` prop but leaves the developer to handle the action when the button is pressed.

Instead, the AMA customised `TextInput` automatically handles the property `returnKeyType` and its action:

- If the `TextInput` is the last one of the [Form](./Form.md) then sets `returnKeyType="done"`, otherwise `returnKeyType="next"`
- The next key focuses the next `TextInput` or [FormField](./FormField.md)
- The done button submits the [Form](./Form.md)

:::note

AMA does not alter the "returnKeyType" when manually passed as a prop.
:::

### Keyboard trap

Once the user presses the **next** key, AMA checks that the:

- The current `TextInput` does no longer have the focus
- If the next field is a `TextInput`, then check if it gained the focus

## Props

### `editable` _(optional)_

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

### `nextFormField` _(optional)_

This parameter specifies the next form field to focus on when the next button is pressed.

| Type      | Default   |
| --------- | --------- |
| RefObject | undefined |

#### Example

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

### `id`

The field ID. This info is stored, with the field `ref`, inside the [<Form />](./Form) component.

| Type   | Default   |
| ------ | --------- |
| string | undefined |

### `nextFieldId`

The ID of the next field to focus when the user taps on the `next` button of the keyboard

| Type   | Default   |
| ------ | --------- |
| string | undefined |

### <Required /> `hasValidation`

This property is used to know if the input can display an error, in case of failed validation; and if so is used to:

- Set the error, in case of failure, as part of the accessibilityHint

Here can be find more information about [error handling in Forms](../../../docs/guidelines/forms#errors)

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

### `hasError`

If true returns the [errorMessage](#error-message) as part of the `accessibilityHint`

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

:::info

The component will try to extract any text within the [errorComponent](#errorcomponent) if no [errorText](#errorText) is provided
:::

### `errorMessage`

| Type   | Default   |
| ------ | --------- |
| string | undefined |

The error message to be announced by the screen reader.

### `requiredMessage`

| Type   | Default   |
| ------ | --------- |
| string | undefined |

The required message to be announced by the screen reader as part of the accessibility hint.

## Related guidelines

- [Forms](../../../docs/guidelines/forms)
