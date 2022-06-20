# Focus

## Order Matters

It's crucial to ensure screen readers and other assistive technologies can navigate your app in a logical order, making sure that content is separate with meaningful titles.

## Screen navigation

When navigating to a new screen, make sure that the focus always starts from the "same" position; it could be the first element of the screen or the first header[^1]; whatever you choose, make sure that it is consistent across all the screens/modals of your app.

:::tip

The built-in [<Text />](/docs/components/Text) has the `autofocus` property that automatically sets the focus when it gets rendered for the first time.

:::

## Drawer / BottomSheet navigation

When dealing with Drawers/BottomSheets, we need to take care of:

1. Handling the focus
1. Can be dismissed
1. Focus stays inside it

### 1. Handling the focus

When opening a modal window or drawer, the focus must be placed on or inside it; otherwise, the user remains in the active control and might not be aware or be able to reach the new content.

A possible solution could be using the `autofocus` property on the built-in [<Text />](/docs/components/Text) component to automatically focus the drawer header

### 2. Can be dismissed

The drawer/bottom sheet should either have a close button or be dismissable by tapping on its overlay layer.

### 3. The focus stays inside it

Make sure that the user cannot focus on any element underneath the drawer/bottom sheet; the user should only be able to cycle between the drawer/bottom sheet content.

### Screen / Drawer navigation

[^1]: According to this study: [https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) the solution that worked better for the mast majority was: _Shift focus to a heading_
