---
ama_severity: 2
ama_category: Undestandable
ama_affected_users: Visual
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
---

# Accessibility Label

The [accessibilityLabel](https://reactnative.dev/docs/accessibility#accessibilitylabel) is the text that assistive technology reads when the component is focused and AMA requires it by tappable elements.

## Expectation

<ScreenReader>
    <When title="The user focuses the component">
        <Then>The Screen Reader reads out the label</Then>
    </When>
</ScreenReader>

When a component has the accessibility label, it is the first information the screen reader reads when it gains the focus.
For instance, with a button, as soon as it receives focus, the screen reader will initially announce its accessibility label. It will then follow up by describing the button's role and state to give the user a comprehensive understanding of the element's function.

This is especially crucial for icon-only buttons, where the control lacks textual labels. In such cases, the accessibility label serves as the primary means of conveying the button's purpose to the user via the screen reader. Without it, the button's function would be unclear, making the app less accessible.

### Example

```jsx
<Pressable
  onPress={contactUs}
  accessibilityRole="button"
  accessibilityLabel="Contact us"
>
  Contact us
</Pressable>
```

## No Accessibility Label

### The problem

Let's consider the following example:

```jsx
<Pressable onPress={contactUs} accessibilityRole="button">
  Contact us
</Pressable>
```

When testing the button with both VoiceOver and TalkBack, they both read:

> button, Contact us, double-tap to activate

Because the component has no `accessibilityLabel`, only the `accessibilityRole` is announced; they read the inner text, if any, and in this case: **Contact us**. Finally, the last part tells the user that the component can be interacted with by performing a double-tap.

<br />

**What's happen if no text is available?**

```jsx
<Pressable onPress={goBack} accessibilityRole="button">
  <SVGIcon />
</Pressable>
```

When testing the button with both VoiceOver and TalkBack, they both read:

> button, double-tap to activate

Here the assistive technology only reads the role and the action that can be performed with the component. So there is a complete lack of helpful information about what we're going to trigger.

### Let's fix it

```jsx
// 1.
<Pressable onPress={contactUs} accessibilityRole="button" accessibilityLabel="Contact US">
    Contact us
</Pressable>

// 2.
<Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Go back">
    <SVGIcon />
</Pressable>
```

When testing with the assistive technology, this happens:

> Contact us button, double-tap to activate
> Go back button, double-tap to activate

The `accessibilityLabel` is announced first, then the **role** and the action that can be performed at the end.

For this reason, AMA requires that tappable elements have the `accessibilityLabel` defined.

## All CAPS Accessibility Label

<Warning withLabel />

<br /> <br />

Screen readers may interpret capital letters as acronyms, misinterpreting content.

#### Example: `ADD TO THE CART`

```jsx
<Pressable accessibilityLabel="ADD TO THE CART">...</Pressable>
```

This is how the different screen readers handle the uppercase label:

| Voice Over        | Talkback        |
| ----------------- | --------------- |
| A-D-D to the cart | Add to the cart |

In this case, VoiceOver does the spelling of the word `ADD` while talkback reads it correctly.
The remaining words are read correctly by both screen readers.

#### Example: `CONTACT US`

| Voice Over   | Talkback     |
| ------------ | ------------ |
| Contact U.S. | Contact U.S. |

The word `CONTACT` is read correctly, but both screen readers spell the word `US` as it is interpreted as `U.S.` for `United States.

A similar issue happens if a sentence contains the word **IT**, for example.

## AMA dev runtime errors <DevOnly />

### NO_ACCESSIBILITY_LABEL <Must />

This error is used when a pressable element has no [accessibilityLabel](https://reactnative.dev/docs/accessibility#accessibilitylabel) defined.

:::note

This rule is mandatory and cannot be turned off!
:::

### NO_UPPERCASE_TEXT <Should />

This is used when a component has the `accessibilityLabel` prop in all caps.

:::tip

Is it possible to specify a list of allowed all caps accessibility labels, [more info here](../guidelines/guidelines.md)
:::

## Related AMA components

- [ExpandablePressable](/core/components/expandablepressable)
- [Pressable](/core/components/pressable)
- [TouchableOpacity](/core/components/touchableopacity)
- [TouchableWithoutFeedback](/core/components/TouchableWithoutFeedback)

## External resources

Some helpful resources about accessibility and all caps.

- http://ux.stackexchange.com/questions/67454/how-does-capitalization-affect-readability
