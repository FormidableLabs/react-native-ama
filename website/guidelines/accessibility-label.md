---
ama_severity: Serious
ama_category: Understandable
ama_affected_users: Visual
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
displayed_sidebar: guidelines
---

# Accessibility Label

<AMASection />

[Accessibility labels](https://reactnative.dev/docs/accessibility#accessibilitylabel) improve usability for people relying on assistive technologies, such as screen readers (VoiceOver, TalkBack) and voice control software (like Voice Access).
Labels serve as the "name" of an element for both navigation and voice commands, so they should be short, unique, and actionable.

## Expectations

<ScreenReader>
    <When title="The user focuses the component">
        <Then noChildren>The Screen Reader reads out the label</Then>
    </When>
</ScreenReader>

| VoiceOver                                  | Talkback                                   |           |
| ------------------------------------------ | ------------------------------------------ | --------- |
| [the button label], button, double tap to activate | [the button label], button, double tap to activate | <Good /> |

---

<VoiceControl>
    <When title="The user pronounces the label">
        <Then title="The Voice Control software recognizes the label">
          <And noChildren>The Voice Control software executes the action</And>
        </Then>
    </When>
</VoiceControl>


## When to use the Accessibility Label

Set accessibilityLabel on any UI element that:

- Is interactive (buttons, links, toggles, custom touchables)
- Displays important information (e.g., meaningful images)
- Accepts user input (fields, switches, checkboxes)

*Purely decorative elements should be hidden from assistive technologies:*

```jsx
accessible={false}
importantForAccessibility="no-hide-descendants" // Android
accessibilityElementsHidden={true} // iOS
```

## Best Practices

### Keep labels concise and unique

- Use the shortest label that clearly identifies the element and its action.
- Avoid including the element type ("button"), unless needed for clarity or disambiguation.
- Avoid including "double tap to activate" or similar phrases, as screen readers announce this automatically. (If not then check the [Accessibility Role](/guidelines/accessibility-role) guideline)

#### Voice Control

Voice control user will use the label to execute actions, so it should be short and unique.

#### Example:


### Provide context only if necessary for disambiguation

If multiple similar elements exist, add only enough context to distinguish them.

#### Example:

```jsx
accessibilityLabel="Delete John"
accessibilityLabel="Delete Mary"
```

If the action's effect isn't obvious, add an accessibilityHint with further explanation.

#### Example:

```jsx
accessibilityLabel="Delete John"
accessibilityHint="Removes John from your contacts"
```

### Reflect state of dynamic content

Update labels to reflect the current state (e.g., mute/unmute).

#### Example:

```jsx
accessibilityLabel={isMuted ? "Unmute" : "Mute"}
```


### Avoid ALL CAPS Accessibility Label

<Warning label dot padding />

Screen readers may interpret capital letters as acronyms, misinterpreting content.

#### Example: `ADD TO THE CART`

```jsx
<Pressable accessibilityLabel="ADD TO THE CART">...</Pressable>
```

This is how the different screen readers handle the uppercase label:

| VoiceOver         | Talkback        |           |
| ----------------- | --------------- | --------- |
| A-D-D to the cart | Add to the cart | <Wrong /> |

In this case, VoiceOver does the spelling of the word `ADD` while talkback reads it correctly.
The remaining words are read correctly by both screen readers.

#### Example: `CONTACT US`

| VoiceOver    | Talkback     |           |
| ------------ | ------------ | --------- |
| Contact U.S. | Contact U.S. | <Wrong /> |

The word CONTACT is read correctly, but both screen readers spell the word US as it is interpreted as U.S. for `United States.`


## Optimize for voice control

Choose labels that are easy to speak and unambiguous for voice command software. Avoid long phrases that require the user to say a lot; brevity aids efficiency.

### Example

**❌ Bad:**

This label is too long, includes unnecessary information and forces the user to say a lot of words.

```jsx
aria-label="Cart, you have 2 items in your cart"
```

**✅ Good:**

This label is concise, unique, and clearly indicates the action.

```jsx
aria-label="Cart"
aria-hint="You have 2 items in your cart"
```

If you need to provide additional context, use the [Accessibility Hint](/guidelines/accessibility-hint) prop to explain the action or effect of the element.


| VoiceOver                                  | Talkback                                   |          |
| ------------------------------------------ | ------------------------------------------ | -------- |
| Contact us, button, double tap to activate | Contact us, button, double tap to activate | <Good /> |

## No Accessibility Label

<Serious label dot />

### The problem

Let's consider the following example:

## How to test

- Turn on the screen reader on your device (VoiceOver for iOS, TalkBack for Android)
- Navigate to the component you want to test
- Ensure the screen reader reads the component in the following order:
  - **label**
  - **role** (e.g., "button")
  - **action** (e.g., "double tap to activate")

### Example

```jsx
<Pressable onPress={contactUs} accessibilityRole="button">
  <Text>Contact us</Text>
</Pressable>
````

| VoiceOver                                  | Talkback                                   |           |
| ------------------------------------------ | ------------------------------------------ | --------- |
| button, Contact us, double tap to activate | button, Contact us, double tap to activate | <Wrong /> |

#### Icon only buttons

<Critical label dot padding />

```jsx
<Pressable onPress={goBack} accessibilityRole="button">
<SVGIcon />
</Pressable>
```

When testing the button with both VoiceOver and TalkBack, they both read:

| VoiceOver                      | Talkback                       |           |
| ------------------------------ | ------------------------------ | --------- |
| button, double tap to activate | button, double tap to activate | <Wrong /> |

Here the assistive technology only reads the role and the action that can be performed with the component. So there is a complete lack of helpful information about what we're going to trigger.

##### Let's fix it

```jsx
<Pressable onPress={goBack} role="button" aria-label="Go back">
<SVGIcon />
</Pressable>
```

When testing with the assistive technology, this happens:

| VoiceOver                                  | Talkback                                  |          |
| ------------------------------------------ | ----------------------------------------- | -------- |
| Go back, button, double tap to activate    | Go back,button, double tap to activate    | <Good /> |

The `accessibilityLabel` is announced first, then the **role** and the action that can be performed at the end.

For this reason, AMA requires that tappable elements have the `accessibilityLabel` defined.

The word `CONTACT` is read correctly, but both screen readers spell the word `US` as it is interpreted as `U.S.` for `United States.

## External resources

    Some helpful resources about accessibility and all caps.

    - http://ux.stackexchange.com/questions/67454/how-does-capitalization-affect-readability
