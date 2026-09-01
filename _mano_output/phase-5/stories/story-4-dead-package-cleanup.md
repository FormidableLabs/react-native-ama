### STORY-4: Remove stale package references

#### What and why
References to `@react-native-ama/react-native` and `@react-native-ama/internal` — packages removed at v2.0 — still appear in `forms` package.json, `lists` package.json, documentation files, and a source comment. After this story, no active package's source, config, or documentation contains a reference to either removed package, and a full build confirms no hidden re-export or barrel dependency was missed.

#### Done when
- [ ] `packages/forms/package.json` no longer lists `@react-native-ama/react-native` under `dependencies`
- [ ] `packages/lists/package.json` no longer lists `@react-native-ama/internal` under `dependencies`
- [ ] `packages/forms/docs/Form.md` no longer references `@react-native-ama/react-native` in import examples
- [ ] `packages/core/docs/hooks/useFocus.md` no longer references `@react-native-ama/react-native` in import examples
- [ ] The comment in `packages/core/src/internals/config.ts:50` referencing `@react-native-ama/internal` is removed or updated to not reference the removed package
- [ ] `tsc -p tsconfig.build.json` succeeds for all active packages after the dependency removals
- [ ] `yarn test` passes across all active packages after the change
- [ ] A grep for `@react-native-ama/react-native` and `@react-native-ama/internal` across active package source files, config files, and documentation returns no hits (CHANGELOG.md files are excluded — they are historical records and must not be edited)

#### Not this story
- Peer dep restructuring (story-1)
- Tree-shaking exports (story-2)
- Coverage thresholds (story-3)
- `@react-native-ama/internal` symbol inlining — the tech spec describes inlining `PickAccessibleProps`, `SHELL_COLORS`, `ERROR_STYLE`, `MotionAnimationKey`, `MOTION_ANIMATIONS`, and `interpolateAnimationStates`. Grep confirms these are already inlined in the source files. If any symbol is still imported from `@react-native-ama/internal` (not yet inlined), inline it before removing the package.json entry
- CHANGELOG.md files — do not edit them

#### Notes
Before removing `@react-native-ama/internal` from `packages/lists/package.json`: confirm with `grep -r "@react-native-ama/internal" packages/lists/src/` that no source file imports it. The current state shows no source imports, so the package.json entry appears stale. The same applies to `@react-native-ama/react-native` in `forms`.

After removing dependencies: run `tsc -p tsconfig.build.json` per package (in dependency order: `core → animations → forms → lists`) to catch any hidden import that was silently resolved through the removed package's transitive dependency tree.

The doc references (`Form.md`, `useFocus.md`) are import examples that show consumers using `@react-native-ama/react-native`. Replace with the correct current import source for each symbol (e.g. `@react-native-ama/core` or remove the example if the component no longer exists in the active API).

#### Implementation Reference
- **Files:**
  - `packages/forms/package.json` — remove `"@react-native-ama/react-native": "~1.2.0"` from `dependencies`
  - `packages/lists/package.json` — remove `"@react-native-ama/internal": "~1.2.0"` from `dependencies`
  - `packages/forms/docs/Form.md:21` — remove or replace the `import { SwitchListItem } from '@react-native-ama/react-native'` example
  - `packages/core/docs/hooks/useFocus.md:49` — remove or replace the `import { Pressable } from '@react-native-ama/react-native'` example
  - `packages/core/src/internals/config.ts:50` — remove the comment referencing `@react-native-ama/internal`
- **Verify before removal:** `grep -r "@react-native-ama/internal" packages/lists/src/` and `grep -r "@react-native-ama/react-native" packages/forms/src/` must return no results
- **Build order:** `core → animations → forms → lists` (per tech spec); `bottom-sheet` independently
- **Do not:** edit CHANGELOG.md files; do not remove references that live only in changelogs; do not inline symbols that are already inlined in source

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
