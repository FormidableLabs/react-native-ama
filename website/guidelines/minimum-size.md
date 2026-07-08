---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.5.5@https://www.w3.org/WAI/WCAG21/Understanding/target-size
displayed_sidebar: guidelines
---

# Minimum Size

<AMASection />

Touch targets — buttons, links, and any other tappable element — must be large enough for users to tap accurately. Users with motor impairments, tremors, or limited dexterity are most affected by targets that are too small. Platform guidelines set the minimum:

- **iOS**: 44×44 pt ([Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/))
- **Android**: 48×48 dp ([Google Accessibility](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB))

AMA enforces these minimums automatically for tappable components at development time.

## Expectations

<ScreenReader>
    <When title="A screen reader user activates an element">
        <Then noChildren>Screen readers use swipe to navigate and double-tap anywhere to activate — minimum touch size is less critical for screen reader navigation, but elements must still be large enough for the double-tap gesture to register reliably</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="Voice Control displays number overlays on interactive elements">
        <Then noChildren>Elements that are too small may have overlapping or illegible number labels — adequate size ensures overlay numbers are readable and non-overlapping</Then>
    </When>
</VoiceControl>

## hitSlop vs min size

AMA prefers forcing a minimum size check instead of using [hitSlop](https://reactnative.dev/docs/pressable#hitslop); as with the latter, the hit area is **never** extended beyond the parent boundaries:

> The touch area never extends past the parent view bounds, and the Z-index of sibling views always takes precedence if a touch hits two overlapping views.
>
> [https://reactnative.dev/docs/touchablewithoutfeedback#hitslop](https://reactnative.dev/docs/touchablewithoutfeedback#hitslop)

So, if the parent width or height is less than 44 or 48px, the touch area will not meet the minimum requirement. In contrast, `min-width` and `min-height` forces the component to have the minimum size preferred.

## Best Practices

### Use `minWidth` and `minHeight` rather than `hitSlop`

`hitSlop` cannot extend beyond the parent view bounds, so it silently fails when the parent is too small. Set `minWidth` and `minHeight` directly on the element to guarantee the physical size.

```jsx
<Pressable style={{ minWidth: 44, minHeight: 44 }} onPress={onPress}>
  <Icon />
</Pressable>
```

### Add spacing between closely packed targets

Two adjacent targets that individually meet the minimum size can still be hard to use if they are touching. Add padding or margin between elements so an inaccurate tap on one does not accidentally activate the other.

### Use AMA components to get the check for free

AMA's pressable components enforce the minimum size requirement at development time and log an error when it is violated. Prefer them over building custom touchables that require manual size verification.

:::tip

The Log level type can be customised, [here for more info](/docs/config-file#customizing-the-log-levels)
:::

## AMA dev runtime errors <DevOnly />

### MINIMUM_SIZE <Must />

This error is used when a touchable area is less than [44x44px on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/) or [48x48dp on Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB).
