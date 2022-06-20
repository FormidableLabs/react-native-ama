# FormField

This is a generic form field element capable of receiving focus from a [TextInput](./TextInput.mdx) components or by using the [useA11yFocus](../hooks/useFocus.md) hook.
It can be used as a wrapper for custom components, for example:

```jsx
<FormField>
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
