### STORY-2: animations package docs

#### What and why

A developer using `@react-native-ama/animations` needs complete docs to integrate motion-respecting animations without guessing at hook signatures. Currently there is an orphan page for `isMotionAnimation` (not in the public exports) and no `utils/` entry in the exports at all. This story brings the animations docs in line with the actual `package.json` exports so the five exported items are all documented and nothing spurious remains.

#### Done when

**AnimatedContainer**
- [x] `AnimatedContainer.md` has the four required sections: Usage with import from `@react-native-ama/animations`, Properties listing all props, Methods (or explicit "None"), no Dev-mode banner unless the export itself is dev-only
- [x] The Properties section is verified against `packages/animations/src/components/AnimatedContainer.tsx` — no stale or invented props

**useAnimation**
- [x] `useAnimation.mdx` has the four required sections: Usage, Properties/Parameters, Return values (Methods), no Dev-mode banner
- [x] Parameters and return values are verified against `packages/animations/src/hooks/useAnimation.ts`

**useAnimationDuration**
- [x] `useAnimationDuration.md` has the four required sections; parameters and return verified against source

**useReanimatedAnimationBuilder**
- [x] `useReanimatedAnimationBuilder.md` has the four required sections; parameters and return verified against source

**useReanimatedTiming**
- [x] `useReanimatedTiming.md` has the four required sections; parameters and return verified against source

**Orphan page removal**
- [x] `packages/animations/docs/utils/isMotionAnimation.md` is removed (the `./isMotionAnimation` subpath is not in `package.json` exports and the utility is not part of the public API)
- [x] `packages/animations/docs/utils/_category_.json` is removed if it becomes empty after removing the page; or updated if other valid utils pages remain (verify: none do)

#### Not this story
- Creating docs for internal utilities not in the `package.json` exports
- Any other package's docs

#### Notes

The `utils/` category only contained `isMotionAnimation.md`. After removing it, check whether `utils/_category_.json` should also be removed to avoid a broken empty sidebar category.

#### Implementation Reference

- **Files (verify + update):** `packages/animations/docs/components/AnimatedContainer.md`, `packages/animations/docs/hooks/useAnimation.mdx`, `packages/animations/docs/hooks/useAnimationDuration.md`, `packages/animations/docs/hooks/useReanimatedAnimationBuilder.md`, `packages/animations/docs/hooks/useReanimatedTiming.md`
- **Files (remove):** `packages/animations/docs/utils/isMotionAnimation.md`, `packages/animations/docs/utils/_category_.json` (if now empty)
- **Authoritative export list:** `"exports"` field in `packages/animations/package.json` — 5 keys: `./AnimatedContainer`, `./useAnimation`, `./useAnimationDuration`, `./useReanimatedAnimationBuilder`, `./useReanimatedTiming`
- **Source for verification:** `packages/animations/src/components/` and `packages/animations/src/hooks/`
- **Import path:** `@react-native-ama/animations`
- **Do not:** add documentation for `isMotionAnimation` or any internal utility; touch source files

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
