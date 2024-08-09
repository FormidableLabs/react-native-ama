# useFormField

This hook can be used to create a focusable custom field for the [`<Form />`](./Form.md) provider and is used to track the ref of the focusable component.

## Usage

```js
import { useFormField } from 'react-native-ama';

const { focusNextFormField, isLastField } = useFormField(refComponent);
```

- **focusNextFormField**: focuses the next focusable element in the form, if any, otherwise triggers the `onSubmit`
- **isLastField**: checks if the component is the last focusable form element

## Example

```jsx
import { useFormField } from 'react-native-ama';

const MyCustomComponent = () => {
  const ref = React.useRef(null);

  useFormField(ref);

  return <CustomView ref={ref}>...</CustomView>;
};
```

:::note

The [`FormField`](./FormField.md) already uses this hook under the hook.

:::

:::warning

When using the custom hook, make sure that the custom component is focusable by the screen reader when the user taps on the keyboard next
button.

:::

## Related guidelines

- [Forms](/guidelines/forms)
