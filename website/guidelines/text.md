---
ama_severity: Serious
ama_category: Perceivable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.1@https://www.w3.org/WAI/WCAG21/Understanding/distinguishable
displayed_sidebar: guidelines
---

# Text

The text in our app must be clear and easy for everyone to read.
While this may seem obvious, sometimes, design choices can unintentionally make it harder for some people, especially those with disabilities, to understand the content. We must be mindful of this when making design decisions.

## Avoid uppercase

<Serious label padding />

Using ALL CAPS in text can hurt accessibility, as it's often more [difficult for people to read](https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read).
Additionally, it can cause issues with screen readers, potentially disrupting the user experience for those relying on such tools.

:::note

For [&lt;Text /&gt;](../components/Text.md) elements AMA checks if the style has the `textTransform` property set to `uppercase`, and if so throws an error if the `accessibilityLabel` one is not set.
It also checks that the accessibilityLabel provided for the various component is not all caps.

:::

## `textTransform:uppercase`

<Serious label padding />

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
For the given example we have:

| VoiceOver         | Talkback        |
| ----------------- | --------------- |
| A-D-D to the cart | Add to the cart |
| Contact U.S.      | Contact U.S.    |

In this case, VoiceOver does the spelling of the word `ADD` while talkback reads it correctly.
The word `CONTACT` is read correctly, but both screen readers spell the word `US` as it is interpreted as `U.S.` for `United States.

## AMA Errors

### UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL <MustNot />

This is used when a component uses the `textTransform: uppercase` style without providing an accessible label.

## Known issues

- Nested Text components with onPress property are not accessible [https://github.com/facebook/react-native/issues/24515](https://github.com/facebook/react-native/issues/24515)

## Resources

Some helpful resources about accessibility and all caps.

- https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read
- http://uxmovement.com/content/how-letterspacing-can-make-all-caps-easier-to-read/
- http://ux.stackexchange.com/questions/67454/how-does-capitalization-affect-readability
- http://www.sciencedirect.com/science/article/pii/S0042698907002830
- http://www.dyslexia.ie/information/computers-and-technology/making-information-accessible-dyslexia-friendly-style-guide/
