---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Visual, Motor, Cognitive
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# BottomSheet & Drawer

When dealing with Drawers/BottomSheets, we need to take care of:

1. Check if animations are enabled
1. Handling the focus
1. Can be dismissed
1. Focus stays inside it

## Expectations

<ReduceMotion>
    <When title="The user enables the Reduce Motion option">
        <Then noChildren>The BottomSheet/Drawer should not animate its entrance</Then>
    </When>
</ReduceMotion>

<ScreenReader>
    <When title="The BottomSheet/Drawer is displayed">
        <Then title="The first element inside it should receive the focus">
            <And title="The user should not be able to focus any item underneath it" />
            <And title="The user should be able to dismiss it, without dragging" />
        </Then>
    </When>
</ScreenReader>

### 1. Animations

If the user has enabled the Reduce Motion accessibility setting, refrain from using [animations](/guidelines/animations) for presenting or hiding the BottomSheet/Drawer. Only the fade animation is allowed as an exception.

### 2. Handling the focus

When a modal window or drawer is opened, it's essential to shift the focus to it or its contents. If not, the user remains on the previously active control, potentially missing or unable to access the newly presented content.

### 3. Can be dismissed

If the BottomSheet/Drawer can be closed by dragging, ensure there's also a close button or allow users to dismiss it by tapping the overlay layer surrounding it.

### 4. The focus stays inside it

Ensure that when the BottomSheet/Drawer is open, the user's focus is restricted to its content. Elements beneath it should not be accessible to prevent confusion, ensuring that the user can only navigate within its content.

## Related AMA components

- [BottomSheet](../components/bottomsheet)
