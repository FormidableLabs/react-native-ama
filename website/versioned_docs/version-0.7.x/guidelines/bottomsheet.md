# BottomSheet & Drawer

When dealing with Drawers/BottomSheets, we need to take care of:

1. Handling the focus
1. Can be dismissed
1. Focus stays inside it

### 1. Handling the focus

When opening a modal window or drawer, the focus must be placed on or inside it; otherwise, the user remains in the active control and might not be aware or be able to reach the new content.

### 2. Can be dismissed

The drawer/bottom sheet should either have a close button or be dismissable by tapping on its overlay layer.

### 3. The focus stays inside it

Make sure that the user cannot focus on any element underneath the drawer/bottom sheet; the user should only be able to cycle between the drawer/bottom sheet content.

## Related AMA components

- [BottomSheet](../components/bottomsheet)
