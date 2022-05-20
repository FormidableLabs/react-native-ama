---
sidebar_position: 4
---

# Uppercase Text

For [<Text />](/docs/components/Text) elements AMA checks if the style has the `textTransform` property set to `uppercase`, and if so throws an error if the `accessibilityLabel` one is not set.
It also checks that the accessibilityLabel provided for the various component is not all caps.

## Why `textTransform:uppercase` is bad for accessibility?

Besides [all CAPS](https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read) being bad for readability, it can also change the inflexion of the screen reader voice or in some cases can cause some words to be read as separate characters.

Let's consider the following example:

```jsx
<Pressable>
    <Text style={{ textTransform: 'uppercase' }}>
        Add to the cart
    </Text>
</Pressable>

<Pressable>
    <Text style={{ textTransform: 'uppercase' }}>
        Contact us
    </Text>
</Pressable>
```

If we inspect the layout view on Android using: `adb shell uiautomator dump`, we get something similar to this:

```xml
<node index="0" text="ADD TO THE CART" resource-id="" class="android.widget.TextView" package="com.amademo" content-desc="" checkable="false" checked="false" clickable="false" enabled="true" focusable="false" focused="false" scrollable="false" long-clickable="false" password="false" selected="false" bounds="[0,243][1080,300]" />
...
<node index="0" text="CONTACT US" resource-id="" class="android.widget.TextView" package="com.amademo" content-desc="" checkable="false" checked="false" clickable="false" enabled="true" focusable="false" focused="false" scrollable="false" long-clickable="false" password="false" selected="false" bounds="[0,243][1080,300]" />
```

So, React Native converts the text to `UPPERCASE` and this version of the text is used by the Screen Reader.

### No inflection

Both Talkback and VoiceOver reads the words with the same flat tone, which becomes more noticeable with long sentences.

### Wrong spelling

Some words could be misinterpreted, causing the screen readers to read a word as separate characters.

#### `ADD TO THE CART`

| Word | Voice Over | Talkback |
| ---- | ---------- | -------- |
| ADD  | A-D-D      | Add      |

In this case, VoiceOver does the spelling of the word `ADD` while talkback reads it correctly.
The remaining words are read correctly by both screen readers.

### `CONTACT US`

The word `CONTACT` is read correctly, but both screen readers do the spelling of the word `US` as it is interpreted as `U.S.` for `United States.

## UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL

This is used when a component uses the `textTransform: uppercase` style without providing an accessible label.

## UPPERCASE_ACCESSIBILITY_LABEL

This is used when a component has the `accessibilityLabel` prop in all caps.

:::tip

Is possible to specify a list of allowed all caps accessibility labels, [more info here](/docs/rules/)
:::

## Resources

Some helpful resources about accessibility and all caps.

- https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read
- http://uxmovement.com/content/how-letterspacing-can-make-all-caps-easier-to-read/
- http://ux.stackexchange.com/questions/67454/how-does-capitalization-affect-readability
- http://www.sciencedirect.com/science/article/pii/S0042698907002830
- http://www.dyslexia.ie/information/computers-and-technology/making-information-accessible-dyslexia-friendly-style-guide/