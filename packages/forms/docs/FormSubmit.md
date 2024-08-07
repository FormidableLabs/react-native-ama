import { Required } from '@site/src/components';

# Form.Submit (FormSubmit)

This is a [Pressable](./Pressable) wrapper for the form Submit button.
The component triggers the [Form onSubmit](./Form#-onsubmit) callback and therefore focuses on the first invalid field
if the submission fails.

## Usage

```jsx
import { Form } from '@react-native-ama/forms';

<Form.Submit accessibilityLabel="Submit" onPress={onSubmit} busy={isBusy}>
  <Text>Submit</Text>
</Form.Submit>;
```

:::note

The children are hidden from the accessibility tree.

:::

## Props

### <Required /> `accessibilityLabel`

The accessibility label

### <Required /> `busy`

This parameter is passed to the accessibilityState busy.

## Related guidelines

- [Forms](../guidelines/forms)
