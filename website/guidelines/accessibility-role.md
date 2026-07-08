---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Visual, Motor
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
displayed_sidebar: guidelines
---

# Accessibility Role

<AMASection />

The [accessibilityRole](https://reactnative.dev/docs/accessibility#accessibilityrole) is required for all interactive components to communicate their purpose to assistive technologies — tools like screen readers (VoiceOver, TalkBack) and voice control software (Voice Access) that people use to navigate and operate their devices.

Without a role, a screen reader user landing on a component has no way to know whether tapping it will open a link, submit a form, or trigger some other action.

## Expectations

<ScreenReader>
    <When title="The user focuses the component">
        <Then title="The Screen Reader reads out the label">
            <And title="The Screen Reader reads out the role" />
        </Then>
    </When>
</ScreenReader>

When using an accessibility role of **button**, the screen reader automatically announces "double tap to activate" after reading the accessibility label.
Each accessibility role informs the user of the component type and available actions.

---

<VoiceControl>
    <When title="The user pronounces the label">
        <Then title="The Voice Control software recognizes the label">
          <And noChildren>The Voice Control software executes the action — the role also enables group commands such as "tap all buttons" or "tap all links"</And>
        </Then>
    </When>
</VoiceControl>

:::tip

React Native provides an extensive list of [accessibility roles](https://reactnative.dev/docs/accessibility#accessibilityrole), but not all of them are native to both iOS and Android platform.
For example `checkbox` is a native component on Android but not on iOS.

For those cases AMA automatically uses the correct role for the running platform.

:::

### Example

```tsx
<Pressable onPress={doSomething} accessibilityRole="button">
  Contact us
</Pressable>
```

| VoiceOver                                  | Talkback                                   |          |
| ------------------------------------------ | ------------------------------------------ | -------- |
| Contact us, button, double tap to activate | Contact us, button, double tap to activate | <Good /> |

## Lack of accessibility role

<Critical label dot />

<br /><br />

What happens if we skip it? The user will have no or little clue about what happens if they trigger the component:

### Example

```jsx
<Pressable onPress={doSomething}>Contact us</Pressable>
```

| VoiceOver  | TalkBack                           |           |
| ---------- | ---------------------------------- | --------- |
| Contact us | Contact us, double-tap to activate | <Wrong /> |

In both cases, the user has no clue about the nature of the component the screen reader landed on.
VoiceOver users will have no clue that an action can be triggered, while Android ones won't know what could be the outcome of interacting with it.

## AMA dev runtime errors <DevOnly />

---

### NO_ACCESSIBILITY_ROLE <Must />

This error is used when a pressable element has no [accessibilityRole](https://reactnative.dev/docs/accessibility#accessibilityrole) defined.

:::note

This rule is mandatory and cannot be turned off!
:::

## Best Practices

### Always pair a role with a label

A role tells users what kind of element they're on; a label tells them what it does. Both are needed.

```jsx
// Missing label — user knows it's a button, not what it does
<Pressable accessibilityRole="button" onPress={goBack} />

// Complete — role and label together
<Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={goBack} />
```

### Use the most specific role that fits

Choose the role that most accurately matches the element's behaviour. A link that navigates away should use `"link"`, not `"button"`.

```jsx
// Avoid using button for navigation
<Pressable accessibilityRole="button" onPress={() => navigate('Home')}>Home</Pressable>

// Prefer link when the action navigates
<Pressable accessibilityRole="link" onPress={() => navigate('Home')}>Home</Pressable>
```

### Use platform-aware roles where applicable

Not all roles behave identically on iOS and Android. For example, `checkbox` is native on Android but not on iOS. The AMA library handles this automatically for its components — prefer those over setting roles manually when a matching AMA component exists.
