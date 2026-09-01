### STORY-2: Migration doc — @react-native-ama/react-native

#### What and why
A developer who previously used `@react-native-ama/react-native` upgrades to v2 and finds the package is gone. Without a migration guide, they have no way to know what replaced each component and how to update their imports. A dedicated migration page tells them exactly what moved where so they can upgrade without guesswork.

#### Done when
- [ ] A new documentation page for `@react-native-ama/react-native` exists in the website
- [ ] The page explains that the package has been removed in v2
- [ ] The page lists each component/hook that was in the package and states what replaced it (or that it was dropped), with the updated import path
- [ ] At least one before/after import example is shown so the migration path is concrete
- [ ] The page is reachable from the website (wired into the sidebar or the relevant docs section)

#### Not this story
- Documenting `@react-native-ama/internal` (that is story 3)
- Fixing stale references in other docs (that is story 1)
- Updating any source code

#### Notes
The list of components that were in `@react-native-ama/react-native` must be derived from git history or remaining references in the playground/docs before writing this page. Key stale references still exist in the playground (e.g. `FlatListDynamic.screen.tsx`, `UseAnimationScreen.tsx`, `ExpandablePressableScreen.tsx`, `UseAMAContext.screen.tsx`) — these give a concrete list of what was exported: `Text`, `Pressable`, `ExpandablePressable`, `StaticFlatList` (via `FlatListStatic.screen.tsx`).

Assumption 1 from the phase brief applies: if a component was dropped rather than replaced, say so explicitly on the migration page.

#### Implementation Reference
- **Files:** new doc page under `website/docs/` or the appropriate package-docs folder; update the relevant sidebar config to include the new page
- **Do not:** invent replacement mappings — base the page only on what is verifiable from git history and existing playground/doc references

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
