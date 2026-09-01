### STORY-3: bottom-sheet package docs

#### What and why

A developer using `@react-native-ama/bottom-sheet` finds docs that reference the wrong package name (`@react-native-ama/extras`), include pages for components that were removed from the exports (`Carousel`, `Loading`, `useCarousel`), and have no page for `useBottomSheetGestureHandler`. This story makes the bottom-sheet docs match the actual v2 package so the developer installs the right package and sees docs only for what is exported.

#### Done when

**Package intro**
- [ ] `extras.md` (the package intro) is updated so the package name, install command, and import paths all reference `@react-native-ama/bottom-sheet`, not `@react-native-ama/extras`

**BottomSheet**
- [ ] `BottomSheet.md` Usage/Example sections reference `import { BottomSheet } from '@react-native-ama/bottom-sheet'`, not `@react-native-ama/extras`
- [ ] All Props in the Props section are verified against `packages/bottom-sheet/src/components/BottomSheet.tsx`; any prop present in the source but absent from the doc is added; any prop documented but absent from the source is removed
- [ ] The `ref` entry in Props accurately documents the `BottomSheetActions` type (`close: () => Promise<void>; isVisible: () => boolean;`) per the current source
- [ ] The four required sections (Usage, Properties, Methods, Dev-mode banner if applicable) are present and complete

**useKeyboard**
- [ ] `useKeyboard.md` Usage section references `import { useKeyboard } from '@react-native-ama/bottom-sheet'`, not `@react-native-ama/extras`
- [ ] Arguments and Returns are verified against `packages/bottom-sheet/src/hooks/useKeyboard.ts`

**useBottomSheetGestureHandler**
- [ ] A new `useBottomSheetGestureHandler.md` page exists under `packages/bottom-sheet/docs/hooks/`
- [ ] Page has a Usage section with a code example showing `import { useBottomSheetGestureHandler } from '@react-native-ama/bottom-sheet'`
- [ ] Page has a Parameters section listing all arguments from `UseBottomSheetGestureHandler` type: `translateY`, `contentHeight`, `dragOpacity`, `closeDistance`, `overlayOpacity`, `onClose`, `minVelocityToClose` — with types verified against source
- [ ] Page has a Returns section documenting `{ gestureHandler }` (a Gesture Pan handler from react-native-gesture-handler)

**Orphan page removal**
- [ ] `packages/bottom-sheet/docs/components/Carousel.md` is removed
- [ ] `packages/bottom-sheet/docs/components/Loading.md` is removed
- [ ] `packages/bottom-sheet/docs/hooks/useCarousel.md` is removed
- [ ] `packages/bottom-sheet/docs/components/_category_.json` is updated or left as-is (it still applies to the remaining `BottomSheet` page)

#### Not this story
- Restoring `Carousel`, `Loading`, or `useCarousel` as exports — they are not in `package.json` exports and their removal is a v2 decision
- Fixing any source code
- Any other package's docs

#### Notes

The three orphan pages (`Carousel.md`, `Loading.md`, `useCarousel.md`) exist from the old `@react-native-ama/extras` era. They are not in the current `package.json` exports and must be removed, not updated.

`useBottomSheetGestureHandler` is an advanced hook used by `BottomSheet` internally, but it is in the public exports so it needs a page. Its primary audience is developers building custom bottom-sheet-like components.

#### Implementation Reference

- **Files (update):** `packages/bottom-sheet/docs/extras.md`, `packages/bottom-sheet/docs/components/BottomSheet.md`, `packages/bottom-sheet/docs/hooks/useKeyboard.md`
- **Files (create):** `packages/bottom-sheet/docs/hooks/useBottomSheetGestureHandler.md`
- **Files (remove):** `packages/bottom-sheet/docs/components/Carousel.md`, `packages/bottom-sheet/docs/components/Loading.md`, `packages/bottom-sheet/docs/hooks/useCarousel.md`
- **Authoritative export list:** `"exports"` field in `packages/bottom-sheet/package.json` — 3 keys: `./BottomSheet`, `./useBottomSheetGestureHandler`, `./useKeyboard`
- **Source for `useBottomSheetGestureHandler` parameters:** `packages/bottom-sheet/src/hooks/useBottomSheetGestureHandler.ts` — the `UseBottomSheetGestureHandler` type defines all args; return value is `{ gestureHandler }` (a `Gesture.Pan()` result)
- **Import path:** `@react-native-ama/bottom-sheet`
- **Do not:** recreate Carousel, Loading, or useCarousel pages; touch source files

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
