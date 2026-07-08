---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility, Cognitive
ama_success_criterion: 2.4.3@https://www.w3.org/WAI/WCAG21/Understanding/focus-order
displayed_sidebar: guidelines
---

# Focus

<AMASection />
<AssistiveTechnology name="Assistive Technologies" title="Screen Reader, Keyboard and Switch" />

Focus management controls which element receives attention as users navigate your app with a screen reader, keyboard, or switch access device. When focus is not managed correctly, users can end up stranded on the wrong element, miss newly presented content, or be unable to reach interactive controls at all.

## Expectations

<ScreenReader>
    <When title="The user navigates to a new screen">
        <Then noChildren>Focus moves to a consistent starting position — the first element or the first heading — on every screen in the app</Then>
    </When>
    <When title="A modal, bottom sheet, or drawer is opened">
        <Then title="Focus moves into the overlay">
            <And noChildren>Focus cannot leave the overlay until it is dismissed</And>
        </Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="The user targets an element by pronouncing its label">
        <Then noChildren>Voice Control activates the element regardless of its position in the focus order — but elements must still have visible, unique labels to be reachable</Then>
    </When>
</VoiceControl>

## Screen navigation

<Serious label padding />

When navigating to a new screen, make sure that the focus always starts from the "same" position; it could be the first element of the screen or the first header[^1]; whatever you choose, make sure that it is consistent across all the screens/modals of your app.

:::tip

The built-in &lt;Text /&gt; offers the `autofocus` property that automatically sets the focus when it gets rendered for the first time.

:::

## Modals, Bottom Sheet and Drawers

<Critical label padding />

When displaying content in Modals, [BottomSheet or Drawer](/guidelines/bottomsheet), it's essential to ensure that the user's focus is directed to and remains within these components.

## Forms

<Serious label padding />

When on TextInput, the user should be able to access the next field or submit the form using the specific keyboard button; please don't force them to swipe to do that.

## Best Practices

### Pick a focus starting point and apply it consistently

Choose one pattern — first element or first heading — and use it on every screen. Inconsistency forces screen reader users to re-learn navigation on each new view.

### Move focus into modals and sheets immediately on open

If focus stays behind the overlay, screen reader users cannot reach the new content without swiping past every element on the screen underneath.

### Never let focus escape a modal while it is open

Focus must stay inside a modal until the user explicitly dismisses it. Elements behind the overlay should be hidden from the accessibility tree. See the [BottomSheet guideline](/guidelines/bottomsheet) for the recommended approach.

### Give form fields a keyboard next/submit path

Users navigating with a keyboard or switch device should not be required to swipe to reach the next field or submit button. Set `returnKeyType` and wire `onSubmitEditing` to advance focus automatically.

### Use AMA's AutofocusContainer

`AutofocusContainer` moves focus to its first child when it mounts, removing the need for manual `ref`-based focus calls on screen entry.

## AMA dev runtime errors <DevOnly />

---

### NO_KEYBOARD_TRAP <MustNot />

This error is raised when focus becomes trapped inside a component and the user cannot navigate away — a critical failure for users relying on keyboard navigation or assistive technologies.

:::note

This rule cannot be turned off!
:::

## Related AMA components

- [AutofocusContainer](/core/components/AutofocusContainer)
- [BottomSheet](/bottom-sheet/components/BottomSheet)

[^1]: According to this study: [https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) the solution that worked better for the mast majority was: _Shift focus to a heading_
