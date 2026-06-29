---
ama_severity: Serious
ama_category: Understandable
ama_affected_users: Visual
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
displayed_sidebar: guidelines
---

# Accessibility Hint

<AMASection />

An accessibility hint gives screen reader users extra context about what will happen when they interact with an element — useful when the label alone does not fully explain the action or its effect.

For example, a button labelled "Like" might not tell a screen reader user what gets liked. Adding a hint — "Likes the song" — fills in that gap:

```jsx
<Pressable
  accessibilityLabel="Like"
  accessibilityHint="Likes the song"
  onPress={onPress}
>
  <Text>Like</Text>
</Pressable>
```

## Expectations

<ScreenReader>
    <When title="The user focuses the component">
        <Then noChildren>The Screen Reader reads the label and role first, then the hint</Then>
    </When>
</ScreenReader>

| VoiceOver                                                    | Talkback                                                     |           |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------- |
| Like, button, double tap to activate, Likes the song | Like, button, double tap to activate, Likes the song | <Good /> |

---

<VoiceControl>
    <When title="The user pronounces the label">
        <Then title="The Voice Control software recognizes the label">
          <And noChildren>The Voice Control software executes the action — the hint is not announced and does not affect command recognition</And>
        </Then>
    </When>
</VoiceControl>

## When to use the Accessibility Hint

Add a hint when:

- The label alone doesn't explain what the action does (e.g., "Delete" without saying what gets deleted)
- The outcome may be surprising or irreversible
- The element behaves differently from the standard gesture (e.g., a long press opens a menu instead of triggering the primary action)

:::danger

The hint field is optional. Only add one when the label is not self-explanatory. Overloading a screen reader user with redundant information makes navigation harder, not easier.

:::

## Best Practices

### Keep hints short and specific

A hint should add information that the label doesn't already carry. Avoid restating the label or describing obvious interactions.

**❌ Redundant:**

```jsx
accessibilityLabel="Submit"
accessibilityHint="Submits the form"
```

**✅ Adds value:**

```jsx
accessibilityLabel="Submit"
accessibilityHint="Sends your order and charges your saved card"
```

### Don't duplicate the label

If the hint would say the same thing as the label, omit it.

### Use plain language

Write as if explaining to someone who cannot see the screen. Avoid technical jargon.

```jsx
// Avoid
accessibilityHint="Dispatches the DELETE_ITEM action"

// Prefer
accessibilityHint="Removes this item from your list"
```
