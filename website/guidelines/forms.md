---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility, Cognitive
ama_success_criterion: 3.3@https://www.w3.org/WAI/WCAG21/Understanding/input-assistance
displayed_sidebar: guidelines
---

import EmailFieldWithError from './email-field-with-error.png';
import NextKeyKeyboard from './next-key.jpg';

# Forms

<AMASection />
<AssistiveTechnology name="Assistive Technologies" title="Screen Reader, Keyboard and Switch" />

## Labels

<Critical label  />

**Success criterion**: [3.3.2](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions)

Labels describe the purpose and function of form elements; and are critical for users who cannot determine this by looking at the form.

- All form controls, such as text fields, checkboxes, radio buttons, etc., must each have a unique label
- Placeholders must not be used as a substitute for a label; as they are only visible if the field is empty

### Expectations

<ScreenReader>
    <When title="A form field receives the focus">
        <Then noChildren>Reads the label</Then>
        <And title="Reads the input type" />
    </When>
</ScreenReader>

```jsx
<TextInput accessibilityLabel="Enter your email address" />
```

| VoiceOver | Talkback                                                    |
| --------- | ----------------------------------------------------------- |
|           | Enter your email address, edit box, double tap to edit text |

### Grouping

For some form controls, such as text fields, the label should not be focusable individually, as it would provide redundant information, but the Text field must provide an `accessibilityLabel` instead.

```jsx
<Text
    importantForAccessibility="no"
    accessibilityElementsHidden="true">Enter your email address</Text>
<TextInput accessibilityLabel="Enter your email address" />
```

:::danger

If the field is required the accessibility label should not end with an asterisk, but a required message should be provided instead.

:::

```jsx
<Text
    importantForAccessibility="no"
    accessibilityElementsHidden="true">Enter your email address*</Text>
<TextInput accessibilityLabel="Enter your email address, required" />
```

## Errors

<Serious label  />

**Success criterion**: [3.3.1](https://www.w3.org/WAI/WCAG21/Understanding/error-identification)

If the field has an error, then this should be read as part of the field label/hint itself and should not be focused as an isolated component:

This is because if we keep the information in a separate component, the user won't be aware of the error unless it does swipe to select the next element.
Also, some users might forget the error, forcing them to swipe left and right to figure out that.

### Expectations

<ScreenReader>
    <When title="The user focuses a form field with a failed validation">
        <Then noChildren>Reads the field valud</Then>
        <And title="Reads the input type" />
        <And title="Reads the validation error" />
    </When>
</ScreenReader>

<Padding />

<img src={EmailFieldWithError} width="400" alt="Email field with failed validation" />

<Padding />

| VoiceOver | Talkback                                                 |
| --------- | -------------------------------------------------------- |
|           | Email address, edit box, please enter a valid email, ... |

## Focus on the next field

<Serious label padding />

When on TextInput, the user should be able to access the next field or submit the form using the specific keyboard button; please don't force them to swipe to do that.

<img src={NextKeyKeyboard} width="400" alt="Android Keyboard" />

:::tip

The built-in [TextInput](/forms/components/TextInput) automatically handles the `returnKeyLabel` property and its action.

:::

## Keyboard trap

<Serious label padding />

The user **must** be able to navigate to all the interactive elements on the screen and navigate away from them at any moment without becoming trapped.

For example, if the user decides to navigate away from an input field, it must be allowed to do so; even if the field contains invalid data, it doesn't matter in no way the focus should be programmatically forced back to that field!

## Form submission

<Serious label padding />

The user should be able to submit a form using the **done** button on the keyboard if a text input has it.

Also, an error message should be displayed and autofocused when it fails to let the screen reader know about the issue.
Alternatively, the first failed field should be autofocused if no message is available.

## AMA dev runtime errors

### NO_FORM_LABEL

This error is used when no label has been provided for the [TextInput](/forms/components/TextInput) component.

### NO_FORM_ERROR

This error is used when no error has been provided for the [TextInput](/forms/components/TextInput) component.

### NO_KEYBOARD_TRAP <MustNot />

This error is triggered by the [TextInput](/forms/components/TextInput) component if the next input field does not have the focus as expected.

:::note

This rule cannot be turned off!
:::

## Related AMA components

- [Form](/forms/components/form)
- [FormField](/forms/components/formfield)
- [SwitchListItem](/react-native/components/switchlistitem)
- [SwitchWrapper](/react-native/components/switchwrapper)
- [TextInput](/forms/components/textinput)
