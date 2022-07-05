import { Required } from '@site/src/components';

# Form.Field

This is a generic form field element capable of receiving focus from a [TextInput](./TextInput.mdx) components or by using the [useFocus](../hooks/useFocus.md) hook.

## Example

```jsx
import { Form } from 'react-native-ama';

<Form.Field id="field-id">
  <Pressable
    accessibilityRole="switch"
    accessibilityLabel={accessibilityLabel}
    style={[styles.container, style]}
    onPress={onValueChange}
    checked={value}>
    {isLabelPositionLeft ? label : null}
    {children ? (
      children
    ) : (
      <Switch
        {...rest}
        accessibilityLabel={accessibilityLabel}
        style={switchStyle}
        value={value}
        onValueChange={onValueChange}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      />
    )}
    {isLabelPositionLeft ? null : label}
  </Pressable>
</Form.Field>
```

## Props

The component extends the React Native [TouchableWithoutFeedbackProps](https://reactnative.dev/docs/touchablewithoutfeedback#props).

### `id` 

The field ID. This info is stored, with the field `ref`, inside the [<Form />](./Form) component.

| Type   | Default   |
|--------|-----------|
| string | undefined |

### `ref`

The field reference.

| Type            | Default   |
|-----------------|-----------|
| React.RefObject | undefined |

### `hasValidation`

If true the parameter `hasError` will be made mandatory.

### `hasError`

If true the field is marked as possible candidate to be automatically focused when the form submission fails.

### `errorMessage`

The error to be announced as part of the accessibility hint when the validation fails.

## Related guidelines

- [Forms](../guidelines/forms)
