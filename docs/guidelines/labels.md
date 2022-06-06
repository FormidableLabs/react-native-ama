# Labels

:::danger MUST

All form controls must be labelled.

:::

Labels describe the purpose and function of form elements; and are critical for users who cannot determine this by looking at the form.

- All form controls, such as text fields, checkboxes, radio buttons, etc., must each have a unique label
- Placeholders must not be used as a substitute for a label; as they are only visible if the field is empty

## Hide it

For some form controls, such as text fields, the label must not be focusable individually, as it would provide redundant information, but the Text field must provide an `accessibilityLabel` instead.

```jsx
<Text
    importantForAccessibility="no"
    accessibilityElementsHidden="true">Enter your email address</Text>
<TextInput accessibilityLabel="Enter your email address" />
```

## NO_FORM_LABEL

This error is used when no label has been provided for the [TextInput](/docs/components/TextInput) component.
