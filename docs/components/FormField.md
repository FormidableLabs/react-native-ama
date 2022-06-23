import { Required } from '@site/src/components';

# FormField

This is a generic form field element capable of receiving focus from a [TextInput](./TextInput.mdx) components or by using the [useFocus](../hooks/useFocus.md) hook.

## Example

```jsx
import { FormField } from 'react-native-ama';

<FormField id="field-id">
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
</FormField>
```

## Props

### `id` 

The field ID. This info is stored, with the field `ref`, inside the [<Form />](./Form) component.

| Type   | Default   |
|--------|-----------|
| string | undefined |

## Related guidelines

- [Forms](../guidelines/forms)
