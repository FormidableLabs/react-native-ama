---
ama_severity: Serious
ama_category: Perceivable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.1@https://www.w3.org/WAI/WCAG21/Understanding/distinguishable
displayed_sidebar: guidelines
---

# Text

<AMASection />

Text in your app must be clear and easy to read. Design choices like ALL CAPS, tight letter spacing, or very small font sizes can make content harder — or impossible — to read for people with low vision, dyslexia, or cognitive differences. They can also cause screen readers (software that reads content aloud for blind users) to mispronounce or spell out words.

## Expectations

<ScreenReader>
    <When title="Text is displayed on screen">
        <Then noChildren>The Screen Reader reads the text with correct pronunciation — ALL CAPS text bypasses natural language processing and causes words to be spelled out or read with flat intonation</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="The user speaks a label to target an element">
        <Then noChildren>Voice Control matches the spoken phrase against the visible text — if React Native has converted text to uppercase internally, the visible label and the recognised phrase may not match, making the element unreachable by voice</Then>
    </When>
</VoiceControl>

## Avoid uppercase

<Serious label padding />

Using ALL CAPS in text can hurt accessibility, as it's often more [difficult for people to read](https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read).
Additionally, it can cause issues with screen readers, potentially disrupting the user experience for those relying on such tools.

:::note

For &lt;Text /&gt; elements AMA checks if the style has the `textTransform` property set to `uppercase`, and if so throws an error if the `accessibilityLabel` one is not set.
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
The word `CONTACT` is read correctly, but both screen readers spell the word `US` as it is interpreted as `U.S.` for `United States.`

## Best Practices

### Always set `accessibilityLabel` when using `textTransform: 'uppercase'`

React Native passes the transformed (uppercase) string to the screen reader. Provide an `accessibilityLabel` with the correctly cased text so the screen reader pronounces it naturally.

```jsx
<Text
  style={{ textTransform: 'uppercase' }}
  accessibilityLabel="Add to the cart">
  Add to the cart
</Text>
```

### Never write ALL CAPS directly in accessibility labels

An `accessibilityLabel` written in ALL CAPS has the same problem as uppercase-transformed text. Always use sentence or title case in labels, even if the visual design calls for uppercase.

### Use `textTransform` for visual styling, not for content

If your design requires uppercase text, keep the source string in sentence case and apply `textTransform: 'uppercase'` via style. This separates visual presentation from the text content the screen reader uses.

## AMA Errors

### UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL <MustNot />

This is used when a component uses the `textTransform: uppercase` style without providing an accessible label.

### NO_UPPERCASE_TEXT <MustNot />

This error is raised when a text element contains all-caps content directly — uppercase text reduces readability and causes screen readers to mispronounce or spell out words.

### NO_UPPERCASE_ACCESSIBILITY_LABEL <ShouldNot />

This error is raised when an `accessibilityLabel` is written in all caps. Screen readers may read uppercase labels with flat intonation or spell them out rather than pronouncing them naturally.

## Known issues

- Nested Text components with onPress property are not accessible [https://github.com/facebook/react-native/issues/24515](https://github.com/facebook/react-native/issues/24515)

## Resources

- [Writing readable content and why all caps is so hard to read](https://www.mity.com.au/blog/writing-readable-content-and-why-all-caps-is-so-hard-to-read)
- [How letter-spacing can make all caps easier to read](http://uxmovement.com/content/how-letterspacing-can-make-all-caps-easier-to-read/)
- [How does capitalisation affect readability?](http://ux.stackexchange.com/questions/67454/how-does-capitalization-affect-readability)
- [Dyslexia-friendly style guide](http://www.dyslexia.ie/information/computers-and-technology/making-information-accessible-dyslexia-friendly-style-guide/)
