---
slug: /
sidebar_position: 0
---

# Accessibility Checklist

This checklist condenses the [guidelines](/guidelines), explaining the intended functionality of specific features or components.

## Does this checklist guarantee my app is accessible?

**No**. However, addressing the issues in this checklist will help improve the experience for everyone who uses your app.

## Order

**Guideline**: [Focus](/guidelines/focus)

<ScreenReader>
    <When title="I'm using a Screen Reader">
        <Then noChildren>I can scroll through the entire screen/modal/bottom sheet in logical order.</Then>
    </When>
</ScreenReader>

### [Animations](./guidelines/animations)

- [ ] Ensure animations are subtle and do not flash too much.
- [ ] Are translation animations disabled if the user has chosen reduce motion from the device settings?

### BottomTabNavigator

- [ ] Does the screen reader announce the element as: _selected status_ **BUTTON TITLE**, **index** of **total**, tab, _double-tap to activate_?

Example:

- selected Home, 1 of 5
- Account, 5 of 5

### Button

When I focus on an element, the screen reader should read it in the correct order on all devices:

- [ ] **Label**: Purpose is clear and matches its label
- [ ] **Role**: Identifies as a button
  - [ ] _iOS_: Identifies as button
  - [ ] _Android_: Identifies as a button and also reads "double tap to activate"
- [ ] **Group**: Its label is grouped and focused with the button
- [ ] **State**: Reads its state, i.e. disabled/dimmed

:::note
When testing on Android, it's important to note that some states, such as "ticked" or "checked," are read before the button label.
:::

### [Focus](./guidelines/focus)

- [ ] Does the first element/header of the screen receive the focus automatically when navigating to a new screen/modal?
-

### [Form](./guidelines/form)

- [ ] Can you navigate through the various fields using the corresponding keyboard "next" key?
- [ ] Can you submit the form using the "enter" key?
- [ ] Invalid fields: Is the error read with the text once the latter gets the focus?
- [ ] Is the label announced when a [TextInput](./components/textinput) is selected?

### [Headings](./guidelines/headers)

- [ ] Is there at least one heading in the Screen/Modal/Drawer/Bottom sheet?
- [ ] Is the section title announced as "header"?
- [ ] Does a header get automatically focused when the screen/modal/drawer/bottom sheet appears?

### [Lists & Grids](./guidelines/lists-grids)

- [ ] Does TalkBack announce "in list/grid" and/or "out of list/grid"?
- [ ] If there is a filtering: Does the screen reader automatically announce how many items the list is showing?

### [Text](./guideines/text)

- [ ] Is the text readable with a font size scaled up to 300%?
- [ ] If the text is uppercase, does the screen reader read it correctly or does it spell the words?
- [ ] Are you able to focus all the links within a Text?

### [Time limits](./guidelines/timed-actions)

- [ ] Does the user have enough time to read an auto-hiding message?
