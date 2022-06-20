# Required property

To avoid being a TypeScript-only library, AMA also performs the required property checks at runtime. For example if the [TextInput](../components/Text.md) does not have the `label` property specified AMA throws an error.

## NO_UNDEFINED

This is used when a property marked as required in TS is not present at runtime.

:::note

The error is only thrown for the __DEV__ version of the app
:::
