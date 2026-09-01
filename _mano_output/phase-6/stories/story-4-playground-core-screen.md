### STORY-4: Complete playground core screen

#### What and why
A developer opens the `@react-native-ama/core` entry in the playground packages tab and reaches a screen that shows only 6 of the 8 accessibility status values, imports a removed package (`@react-native-ama/react-native`), and gives no guidance on how to toggle AMA checks. Completing the screen makes it a useful reference for understanding what AMA detects and how to control it during development.

#### Done when
- [ ] Opening the playground and tapping `@react-native-ama/core` in the Packages tab navigates to the core screen (route is reachable — `Stack.Screen` for `AmaCore` is registered)
- [ ] The screen displays all 8 `is*` values: `isBoldTextEnabled`, `isGrayscaleEnabled`, `isInvertColorsEnabled`, `isReduceMotionEnabled`, `isReduceTransparencyEnabled`, `isScreenReaderEnabled`, `isHighTextContrastEnabled`, `isDarkerSystemColorsEnabled`
- [ ] A text is visible on screen explaining that AMA checks can be toggled on/off via the dev menu under "Toggle React Native AMA"
- [ ] The screen no longer imports from `@react-native-ama/react-native`

#### Not this story
- Adding a button to open the dev menu
- Changing the visual design of the screen beyond what is needed
- Adding tests for playground screens

#### Notes
`AmaCore` is already in `RootStackParamList` in `AppNavigation.tsx` (line 215) but has no `Stack.Screen` registered — the wiring must be added in `AppNavigation.tsx`.

`UseAMAContext.screen.tsx` currently imports `Text` from `@react-native-ama/react-native` (stale). Replace with the playground's own `Text` component from `../components/Text` (same import used by `PackagesTab.screen.tsx` and others).

`isHighTextContrastEnabled` and `isDarkerSystemColorsEnabled` are both available from `useAMAContext()` — verified in `AMAProvider.tsx`.

#### Implementation Reference
- **Files:** `playground/src/screens/UseAMAContext.screen.tsx` (add missing `is*` values, add toggle text, fix stale import); `playground/src/AppNavigation.tsx` (add `Stack.Screen` for `AmaCore` pointing to `UseAMAContextScreen`)
- **Build:** register `UseAMAContextScreen` as a `Stack.Screen` named `"AmaCore"` in the `Stack.Navigator` in `AppNavigation.tsx`, alongside the other package screens (`AmaBottomSheet`, `AmaForms`)
- **UI:** toggle explanation text: `"AMA checks can be toggled on/off via the dev menu under Toggle React Native AMA"`
- **Do not:** import from `@react-native-ama/react-native`; use `../components/Text` instead

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
