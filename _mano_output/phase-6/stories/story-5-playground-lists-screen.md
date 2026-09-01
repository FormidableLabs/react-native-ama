### STORY-5: Add playground lists screen

#### What and why
A developer exploring `@react-native-ama/lists` has no playground demo to learn from. A search-filter screen using `DynamicFlatList` with a food-items list shows how the component announces item count changes to screen readers, giving developers a concrete working example they can run on a device.

#### Done when
- [ ] `@react-native-ama/lists` entry is visible in the Packages tab list
- [ ] Tapping the entry navigates to the lists screen
- [ ] The lists screen shows a text input (search field) and a list of food items
- [ ] Typing in the search field filters the list to only items whose names contain the typed text (case-insensitive)
- [ ] Clearing the search field restores the full list
- [ ] With a screen reader active, changing the search text causes the screen reader to announce the number of results (e.g. "3 items found", "1 item found") after the list updates
- [ ] The screen does not import from `@react-native-ama/react-native`

#### Not this story
- Adding tests for the playground screen
- Adding multiple list interaction demos (filtering is the single scenario)
- Changing `PackagesTab.screen.tsx` layout beyond adding the new list entry

#### Notes
`DynamicFlatList` requires `singularMessage` and `pluralMessage` props with a `%count%` placeholder — use `"%count% item found"` and `"%count% items found"`. The screen reader announcement is driven by these messages automatically by `DynamicFlatList`.

The existing `FlatListDynamic.screen.tsx` in the playground uses the same component but imports from `@react-native-ama/react-native` (stale) and uses non-food data. The new screen should be written fresh and must not import from the removed package. Use `TextInput` from `@react-native-ama/forms` (with `suppressError={true}` and `hasValidation={false}`) for the search field, following the pattern already established in `FlatListDynamic.screen.tsx`.

Food items list (at minimum): Apple, Banana, Carrot, Dragonfruit, Eggplant, Fig, Grape, Honeydew, Kiwi, Lemon, Mango, Nectarine, Orange, Papaya, Quince, Raspberry, Strawberry, Tomato, Watermelon.

New route name: `"AmaLists"`. Add to `RootStackParamList` in `AppNavigation.tsx`.

#### Implementation Reference
- **Files:**
  - `playground/src/screens/AmaLists.screen.tsx` (new screen)
  - `playground/src/AppNavigation.tsx` (import screen, add `Stack.Screen` for `"AmaLists"`, add `AmaLists: undefined` to `RootStackParamList`)
  - `playground/src/screens/PackagesTab.screen.tsx` (add `ListItem` for `@react-native-ama/lists` navigating to `"AmaLists"`)
- **Build:** `DynamicFlatList` from `@react-native-ama/lists`; `TextInput` from `@react-native-ama/forms` with `suppressError={true}`, `hasValidation={false}`; `Text`, `Spacer`, `theme` from playground internals
- **A11y:** `singularMessage="%count% item found"`, `pluralMessage="%count% items found"` — these drive the screen reader announcement; no additional `accessibilityLiveRegion` needed
- **Do not:** import from `@react-native-ama/react-native`; do not reuse or modify `FlatListDynamic.screen.tsx`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
