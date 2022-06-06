# useFormField

This hook can be used to create a focusable custom field for the [`<Form />`](/docs/components/Form) provider and is used to track the ref of the focusable component.

## Usage

```js
import { useA11yFocus } from 'react-native-ama';

const { focusNextFormField, isLastField } = useA11yFocususeA11yFocus(refComponent);
```

- **focusNextFormField**: focuses the next focusable element in the form, if any, otherwise triggers the `onSubmit` 
- **isLastField**: checks if the component is the last focusable form element

## Example

```jsx
const MyCustomComponent = () => {
  const ref = React.useRef(null);

  useFormField(ref);

  return <CustomView ref={ref}>...</CustomView>;
};
```

:::note

The [`FormField`](/docs/components/FormField) already uses this hook under the hook.

:::

