# Required property

To avoid being a TypeScript-only library, AMA also performs the required property checks at runtime. For example if the [Pressable](/react-native-ama/docs/components/Pressable) does not have the `accessibilityRole` property specified AMA throws an error.

:::tip

The Log level type can be customised, [here for more info](/docs/advanced/custom-log-rules)
:::

## PROPERTY_UNDEFINED

This is used when a property marked as required in TS is not present, for example: `accessibilityRole` for the [Pressable](/react-native-ama/docs/components/Pressable) component.