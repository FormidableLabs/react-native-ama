---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Visual, Motor, Cognitive
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# BottomSheet & Drawer

<AMASection />

A bottom sheet (or drawer) is a panel that slides up from the bottom of the screen to present additional content or actions. When one opens, four things must be handled correctly for accessible navigation:

1. Animations respect the user's motion preference
2. Focus moves into the sheet automatically
3. The sheet can be dismissed without relying on a drag gesture
4. Focus stays inside the sheet while it is open

## Expectations

<ReduceMotion>
    <When title="The user enables the Reduce Motion option">
        <Then noChildren>The BottomSheet/Drawer should not animate its entrance</Then>
    </When>
</ReduceMotion>

---

<ScreenReader>
    <When title="The BottomSheet/Drawer is displayed">
        <Then title="The first element inside it should receive the focus">
            <And title="The user should not be able to focus any item underneath it" />
            <And title="The user should be able to dismiss it, without dragging" />
        </Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="The BottomSheet/Drawer is displayed">
        <Then title="Only elements inside the sheet are targetable by voice commands">
            <And noChildren>A labelled close control must be present so the user can dismiss the sheet by voice</And>
        </Then>
    </When>
</VoiceControl>

### 1. Animations

If the user has enabled the Reduce Motion accessibility setting, refrain from using [animations](/guidelines/animations) for presenting or hiding the BottomSheet/Drawer. Only the fade animation is allowed as an exception.

### 2. Handling the focus

When a modal window or drawer is opened, it's essential to shift the focus to it or its contents. If not, the user remains on the previously active control, potentially missing or unable to access the newly presented content.

### 3. Can be dismissed

If the BottomSheet/Drawer can be closed by dragging, ensure there's also a close button or allow users to dismiss it by tapping the overlay layer surrounding it.

### 4. The focus stays inside it

Ensure that when the BottomSheet/Drawer is open, the user's focus is restricted to its content. Elements beneath it should not be accessible to prevent confusion, ensuring that the user can only navigate within its content.

## Best Practices

### Always provide a non-gesture dismiss path

Drag-to-dismiss is a motor gesture that screen reader and switch-access users cannot perform. Provide a labelled close button, or make the overlay tappable to dismiss.

```jsx
<BottomSheet>
  <Pressable accessibilityLabel="Close" accessibilityRole="button" onPress={close}>
    <CloseIcon />
  </Pressable>
  {/* sheet content */}
</BottomSheet>
```

### Move focus to the first interactive element on open

When the sheet appears, shift focus to the first actionable element inside it. Users should not have to navigate past the rest of the screen to reach the sheet's content.

### Trap focus while the sheet is open

Focus must not reach elements beneath the sheet. The simplest way to guarantee this is to back the sheet with a React Native `Modal` — it handles focus containment on both platforms automatically.

### Use the AMA BottomSheet component

AMA's `BottomSheet` handles focus management, focus trapping, and Reduce Motion automatically. Prefer it over a custom implementation.

## Related AMA components

- [BottomSheet](/bottom-sheet/components/BottomSheet)
