# useFormSubmit

A hook that provides the form's `submitForm` function. Use this when you want to trigger form submission from a component that is not a `Form.Submit` render prop.

:::note

`useFormSubmit` must be used inside a [`<Form />`](./Form.md) provider.

:::

## Usage

```jsx
import { useFormSubmit } from '@react-native-ama/forms';

const SubmitButton = () => {
  const { submitForm } = useFormSubmit();

  return <Pressable onPress={submitForm} accessibilityRole="button" accessibilityLabel="Submit" />;
};
```

## Parameters

None — the hook reads the submit function from the `Form` context automatically.

## Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| `submitForm` | `() => Promise<void>` | Triggers the form's `onSubmit` callback. If `onSubmit` returns `false`, automatically focuses the first invalid field. |

## Related guidelines

- [Forms](/guidelines/forms)
