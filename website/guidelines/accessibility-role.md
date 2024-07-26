---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Visual, Motor
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
displayed_sidebar: guidelines
---

# Accessibility Role

The [accessibilityRole](https://reactnative.dev/docs/accessibility#accessibilityrole) is required for all interactive components to communicate their purpose to assistive technology users.

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

## Related AMA components

- [ExpandablePressable](/core/components/expandablepressable)
- [Pressable](/core/components/pressable)
- [TouchableOpacity](/core/components/touchableopacity)
- [TouchableWithoutFeedback](/core/components/TouchableWithoutFeedback)
