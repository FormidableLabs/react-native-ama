import { MustNot } from '@site/src/components';

# Forms

## Labels

:::danger MUST

All form controls must be labelled.

:::

Labels describe the purpose and function of form elements; and are critical for users who cannot determine this by looking at the form.

- All form controls, such as text fields, checkboxes, radio buttons, etc., must each have a unique label
- Placeholders must not be used as a substitute for a label; as they are only visible if the field is empty

### Hide it

For some form controls, such as text fields, the label should not be focusable individually, as it would provide redundant information, but the Text field must provide an `accessibilityLabel` instead.

```jsx
<Text
    importantForAccessibility="no"
    accessibilityElementsHidden="true">Enter your email address</Text>
<TextInput accessibilityLabel="Enter your email address" />
```

:::tip

The built-in [TextInput](../components/TextInput) automatically hides the label from the screen readers.

:::

## Errors

If the field has an error, then this should be read as part of the field label/hint itself and should not be focused as an isolated component:

This is because if we keep the information in a separate component, the user won't be aware of the error unless it does swipe to select the next element.
Also, some users might forget the error, forcing them to swipe left and right to figure out that.

## Focus on the next field

When on TextInput, the user should be able to access the next field or submit the form using the specific keyboard button; please don't force them to swipe to do that.


:::tip

The built-in [TextInput](../components/TextInput) automatically handles the `returnKeyLabel` property and its action.

:::

## Keyboard trap

The user **must** be able to navigate to all the interactive elements on the screen and navigate away from them at any moment without becoming trapped.

For example, if the user decides to navigate away from an input field, it must be allowed to do so; even if the field contains invalid data, it doesn't matter in no way the focus should be programmatically forced back to that field!

## AMA dev runtime errors

### NO_FORM_LABEL

This error is used when no label has been provided for the [TextInput](../components/TextInput) component.

### NO_FORM_ERROR

This error is used when no error has been provided for the [TextInput](../components/TextInput) component.

### NO_KEYBOARD_TRAP <MustNot />

This error is triggered by the [TextInput](../components/TextInput) component if the next input field does not have the focus as expected.

:::note

This rule cannot be turned off!
:::

## Related AMA components

- [Form](../components/form)
- [FormField](../components/formfield)
- [SwitchListItem](../components/switchlistitem)
- [SwitchWrapper](../components/switchwrapper)
- [TextInput](../components/textinput)
