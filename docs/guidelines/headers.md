# Headers

Headers are defined by setting the property: `accessibilityRole = "header"` and are equivalent to the HTML _H*_ tags.

:::note

Each page/screen should contain at least one header.

:::

## Why do we need headers?

Because people who depend on assistive technology often navigate by heading first to quickly get a sense of the content offered in the page.

On iOS, the user will use the [VoiceOver rotor](https://support.apple.com/en-gb/HT204783) to move through the different elements on the screen, i.e. headers. On Android is possible but varies by device.

:::tip

You can have "invisible" header on your screen, for example:

```jsx
<Text accessibilityLabel="This is the header" />
```
 
:::

## Related AMA components

- [Text](../components/text)
