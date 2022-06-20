import { MustNot } from '@site/src/components';

# Keyboard trap

The user must be able to navigate to all the interactive elements on the screen and navigate away from them at any moment without becoming trapped.

For example, if the user decides to navigate away from an input field, it must be allowed to do so; even if the field contains invalid data, it doesn't matter in no way the focus should be programmatically forced back to that field!

# NO_KEYBOARD_TRAP <MustNot />

This error is triggered by the [TextInput](../components/TextInput.mdx) component if the next input field does not have the focus as expected.

:::note

This rule cannot be turned off!
:::
