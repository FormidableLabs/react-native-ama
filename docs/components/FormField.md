# FormField

This is a generic form field element capable of receiving focus from a [TextInput](/docs/components/TextInput.md) components or by using the [useA11yFocus](/docs/hooks/useA11yFocus) hook.
It can be used as a focusable wrapper for custom components, for example:

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
