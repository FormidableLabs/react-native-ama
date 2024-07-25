---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility, Cognitive
ama_success_criterion: 2.4.3@https://www.w3.org/WAI/WCAG21/Understanding/focus-order
---

# Focus

<AssistiveTechnology name="Assistive Technologies" title="Screen Reader, Keyboard and Switch" />

It's crucial to ensure screen readers and other assistive technologies can navigate your app in a logical order, making sure that content is separate with meaningful titles.

## Screen navigation

<Serious label padding />

When navigating to a new screen, make sure that the focus always starts from the "same" position; it could be the first element of the screen or the first header[^1]; whatever you choose, make sure that it is consistent across all the screens/modals of your app.

:::tip

The built-in [&lt;Text /&gt;](../components/Text) offers the `autofocus` property that automatically sets the focus when it gets rendered for the first time.

:::

## Modals, Bottom Sheet and Drawers

<Critical label padding />

When displaying content in Modals, [BottomSheet or Drawer](/guidelines/bottomsheet), it's essential to ensure that the user's focus is directed to and remains within these components.

## Forms

<Serious label padding />

When on TextInput, the user should be able to access the next field or submit the form using the specific keyboard button; please don't force them to swipe to do that.

## Related AMA components

- [AutofocusContainer](../components/autofocuscontainer)
- [BottomSheet](../components/bottomsheet)
- [Text](../components/text)

[^1]: According to this study: [https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) the solution that worked better for the mast majority was: _Shift focus to a heading_
