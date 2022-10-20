# Accessibility Checklist

The checklist is based on the [Guidelines](./guidelines) and is focused on the testing side of accessibility.

:::note
Addressing the issues called out in this checklist will help improve the experience for everyone who uses the app,
but it won't guarantee that the app will be 100% accessible!
:::

## Feature

- [ ]  Are you able to use it by using Screen Curtains (iOS) or setting to 0 the screen luminosity?

## Order

- [ ]  [Are you able to logically scroll through the entire screen/modal/drawer/bottom sheet](./guidelines/focus)?

## Components

**What is this thing? Does the screen reader announce:**

- [ ]  [Role](./guidelines/accessibility-role) (ex. button)
- [ ]  [Name](./guidelines/accessibility-label) (ex. "Submit")
- [ ]  State (ex. disabled, checked, expanded, etc...)

**What happens when I click the thing?**

- [ ]  Is it clear what will happen if you click the thing?

[**Hint**](./guidelines/accessibility-hint)?

- [ ]  Is the label enough?

[**Predictable/Consistent**](guidelines/predictable-consistent)

- [ ]  Is the appearance consistent across the app?
- [ ]  Is the behaviour consistent across the app?

[**Size*](guidelines/minimum-size)*

- [ ]  Has a minimum size of 44/48px?

**NOTE**: [hitSlop does not guarantee a minimum size](guidelines/minimum-size#hitslop-vs-min-size)

### [Animations](./guidelines/animations)

- [ ]  Ensure animations are subtle and do not flash too much.
- [ ]  Are translation animations disabled if the user has chosen reduce motion from the device settings?

### BottomTabNavigator

- [ ] Does the screen reader announce the element as: _selected status_ **BUTTON TITLE**, **index** of **total**, tab, _double-tap to activate_?

Example: 
- selected Home, 1 of 5
- Account, 5 of 5

### Button

- [ ] Does the screen reader announce the element as: **BUTTON TITLE**, _button_, _double-tap to activate_?

### [Focus](./guidelines/focus)

- [ ]  Does the first element/header of the screen receive the focus automatically when navigating to a new screen/modal?
- 
### [Form](./guidelines/form)

- [ ]  Can you navigate through the various fields using the corresponding keyboard "next" key?
- [ ]  Can you submit the form using the "enter" key?
- [ ]  Invalid fields: Is the error read with the text once the latter gets the focus?
- [ ]  Is the label announced when a [TextInput](./components/textinput) is selected?

### [Headings](./guidelines/headers)

- [ ]  Is there at least one heading in the Screen/Modal/Drawer/Bottom sheet?
- [ ]  Is the section title announced as "header"?
- [ ]  Does a header get automatically focused when the screen/modal/drawer/bottom sheet appears?

### [Lists & Grids](./guidelines/lists-grids)

- [ ]  Does TalkBack announce "in list/grid" and/or "out of list/grid"?
- [ ]  If there is a filtering: Does the screen reader automatically announce how many items the list is showing?

### [Text](./guideines/text)

- [ ]  Is the text readable with a font size scaled up to 300%?
- [ ]  If the text is uppercase, does the screen reader read it correctly or does it spell the words?
- [ ]  Are you able to focus all the links within a Text?

### [Time limits](./guidelines/timed-actions)

- [ ]  Does the user have enough time to read an auto-hiding message?
