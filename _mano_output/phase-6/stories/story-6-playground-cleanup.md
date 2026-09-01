### STORY-6: Remove stale playground screens and components

#### What and why
The playground contains screens and components from the previous version of AMA that import removed packages (`@react-native-ama/react-native`, `@react-native-ama/extras`) or are simply not registered in navigation. A developer browsing the source finds dead code that no longer compiles cleanly against v2 packages. Removing it leaves the playground reflecting only what is actually available and working.

#### Done when
- [ ] No file in `playground/src/` imports from `@react-native-ama/react-native` or `@react-native-ama/extras`
- [ ] No screen file in `playground/src/screens/` is unreferenced (every screen file is imported by `AppNavigation.tsx` or another screen that is itself reachable)
- [ ] No component file in `playground/src/components/` is unreferenced by any reachable screen or component
- [ ] `AppNavigation.tsx` has no route type entries (`RootStackParamList`) for routes that have no corresponding `Stack.Screen`
- [ ] The playground still builds after all deletions

#### Not this story
- Rewriting any of the remaining screens to use new AMA APIs
- Adding new screens (those are stories 4 and 5)
- Fixing other parts of the codebase outside `playground/src/`

#### Notes
Files confirmed as stale (not registered in `AppNavigation.tsx` and/or importing removed packages):

Screens to delete:
- `playground/src/screens/Carousel.screen.tsx` — imports `@react-native-ama/extras`
- `playground/src/screens/Loading.screen.tsx` — imports `@react-native-ama/extras`
- `playground/src/screens/FlatList.screen.tsx` — not in navigation
- `playground/src/screens/FlatListStatic.screen.tsx` — imports `@react-native-ama/react-native`, not in navigation
- `playground/src/screens/FlatListDynamic.screen.tsx` — imports `@react-native-ama/react-native`, not in navigation (replaced by story 5)
- `playground/src/screens/ExpandablePressableScreen.tsx` — imports `@react-native-ama/react-native`, not in navigation
- `playground/src/screens/UseAnimationScreen.tsx` — imports `@react-native-ama/react-native`, not in navigation
- `playground/src/screens/UseAnimationDurationScreen.tsx` — imports `@react-native-ama/react-native`, not in navigation
- `playground/src/screens/UseReanimatedAnimationBuilderScreen.tsx` — not in navigation
- `playground/src/screens/UseReanimatedTimingScreen.tsx` — not in navigation
- `playground/src/screens/UseTimedAction.screen.tsx` — not in navigation

Components to delete:
- `playground/src/components/CTATouchableOpacity.tsx` — imports `@react-native-ama/react-native`
- `playground/src/components/CTATouchableWithoutFeedback.tsx` — imports `@react-native-ama/react-native`

Before deleting each file, verify it is not imported by any file being kept. Run a grep for each filename before deletion. After all deletions, remove any now-orphaned import statements from `AppNavigation.tsx`.

Depends on: story-4 and story-5 (so the core and lists screens are already wired before the cleanup removes other files, keeping the build passing throughout).

#### Implementation Reference
- **Files:** delete the screen and component files listed in Notes; clean up any corresponding imports in `AppNavigation.tsx`; confirm `RootStackParamList` has no orphaned entries after deletion
- **Do not:** delete any file that is still imported by a kept file; do not remove `playground/src/screens/UseAMAContext.screen.tsx` (that is the core screen updated in story 4)

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
