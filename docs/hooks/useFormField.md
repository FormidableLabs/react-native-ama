# useFormField

This hook can be used to create a focusable custom field for the [`<Form />`](/docs/components/Form) provider and is used to track the ref of the focusable component.

## Usage

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

