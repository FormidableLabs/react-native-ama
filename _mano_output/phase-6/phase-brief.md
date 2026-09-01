# Phase 6 Brief — react-native-ama

## Why this phase

Phase 5 removed all stale references to `@react-native-ama/react-native` and `@react-native-ama/internal`. Consumers still need to know what replaced them. The playground also has gaps: the core screen is incomplete, the lists package has no presence, and stale screens from the previous AMA version need to be removed.

## Phase goal

Consumers can find migration guidance for removed packages and the playground is clean, complete, and demonstrates both `@react-native-ama/core` status values and a working `@react-native-ama/lists` search-filter demo.

## Phase scope

1. Update `website/docs/ama/getting-started.md` and `website/docs/ama/config-file.md` — remove stale references to `@react-native-ama/internal`; update instructions to reflect where `ama.config.json` now lives.
2. Write migration documentation for `@react-native-ama/react-native` — what was removed, what replaced it, how to migrate import paths.
3. Write migration documentation for `@react-native-ama/internal` — what was removed, where its symbols landed (core, animations, forms), how to migrate.
4. Complete the playground core screen — add `isHighTextContrastEnabled` and `isDarkerSystemColorsEnabled`; add explanatory text that AMA checks can be toggled on/off via the dev menu under "Toggle React Native AMA".
5. Add playground lists screen — `DynamicFlatList` with a search field filtering a dummy food-items list in real time; screen reader announces item count changes via AMA components.
6. Wire the lists screen into `PackagesTab` navigation.
7. Playground cleanup — remove stale screens and components that were used by the previous version of AMA and are no longer referenced.

## Exit criteria

1. Website docs
   - Open `getting-started.md`: no reference to `@react-native-ama/internal` jest mock or `@react-native-ama/react-native` install step
   - Open `config-file.md`: no symlink or copy instruction pointing to `node_modules/@react-native-ama/internal`
2. Migration docs
   - Navigate to `@react-native-ama/react-native` doc page: page exists, explains what replaced each component/hook, shows updated import paths
   - Navigate to `@react-native-ama/internal` doc page: page exists, explains where each symbol moved, shows updated import paths
3. Playground — core screen
   - Open the core screen: all 8 `is*` values displayed (`isBoldTextEnabled`, `isGrayscaleEnabled`, `isInvertColorsEnabled`, `isReduceMotionEnabled`, `isReduceTransparencyEnabled`, `isScreenReaderEnabled`, `isHighTextContrastEnabled`, `isDarkerSystemColorsEnabled`)
   - Explanatory text visible: "AMA checks can be toggled on/off via the dev menu under Toggle React Native AMA"
4. Playground — lists screen
   - Open `PackagesTab`: `@react-native-ama/lists` entry visible
   - Enter the lists screen: search field and food-items list rendered
   - Type in the search field: list filters in real time
   - With screen reader on: item count change announced on each filter update
5. Playground cleanup
   - No screens or components in the playground that are unreferenced or tied to the previous AMA version

## Assumption log

| # | Assumption | Risk if wrong |
|---|-----------|---------------|
| 1 | `@react-native-ama/react-native` had no replacement package — its components/hooks were either dropped or moved to other AMA packages. Migration doc describes what moved where. | If some components were silently re-exported from another package under a different name, the migration doc will be incomplete. |
| 2 | The existing `UseAMAContext.screen.tsx` is the target for the core screen completion — it is wired into navigation already and just needs the missing properties and text added. | If the screen is not wired to the `AmaCore` route, a separate wiring step is needed. |

## Acknowledged risks

- Migration docs require knowing which components lived in `@react-native-ama/react-native` — if that list isn't derivable from git history or remaining docs, the doc will be incomplete.
- The lists screen adds a new dependency on `@react-native-ama/lists` in the playground `package.json` — must be wired before the screen can render.
- Playground cleanup may remove screens that are still referenced in navigation config — all nav wiring must be audited before deleting.
