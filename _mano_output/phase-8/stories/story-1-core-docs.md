### STORY-1: core package docs

#### What and why

A developer integrating `@react-native-ama/core` into their app reads the docs to understand the AMA context API. Right now the docs show removed methods (`removeError`, the old `trackError(id: string)`) and are missing a page for `HideChildrenFromAccessibilityTree`. This story makes the core docs a faithful reference for the v2 API so the developer gets working code on the first try.

#### Done when

**AMAProvider**
- [ ] `AMAProvider.md` Usage section shows the correct v2 import path: `import { AMAProvider } from '@react-native-ama/core'`
- [ ] Context Values block reflects the current `AMAContextValue` type: the 6 `is*` booleans, `reactNavigationScreenOptions`, and `isHighTextContrastEnabled`, `isDarkerSystemColorsEnabled` if exported — verified against `packages/core/src/components/AMAProvider.tsx`
- [ ] The Methods section documents only `trackError(rule: AmaRule, ref?: React.RefObject<any>): void` (dev mode only); `removeError` is removed from the page entirely

**useAMAContext**
- [ ] `useAMAContext.md` Usage block shows only the currently exported values — the 6 `is*` booleans, `reactNavigationScreenOptions`; `trackError` shown with the correct v2 signature; `removeError` removed
- [ ] Properties section accurately lists each `is*` value with its platform tag where applicable, matching the source
- [ ] Methods section shows `trackError(rule: AmaRule, ref?: React.RefObject<any>): void` with a dev-mode-only banner; `removeError` is not present

**HideChildrenFromAccessibilityTree**
- [ ] A new `HideChildrenFromAccessibilityTree.md` doc page exists under `packages/core/docs/components/`
- [ ] Page has a Usage section with a code example using `import { HideChildrenFromAccessibilityTree } from '@react-native-ama/core'`
- [ ] Page has a Properties section listing `testID` (optional, string) and `children` (ReactNode)
- [ ] Page has a Methods section (may state "None" if the component exposes no imperative methods)

**AutofocusContainer, useFocus, useTimedAction**
- [ ] Each of the three existing pages is verified to have the four required sections (Usage, Dev-mode banner where applicable, Properties/Arguments, Methods/Returns); any section that is absent or incomplete is filled in

#### Not this story
- The `ReactNativeAmaModule`, `ReactNativeAmaView`, and `ReactNativeAma.types` export keys — these are low-level native bridge artefacts; whether they need end-user API pages is decided per the brief's acknowledged risk rule (type-only or internal bridge keys may be documented inline rather than as standalone pages). If no separate page is warranted, a note in `core.md` (the package intro) is sufficient.
- Fixing any source code to match the docs
- Any other package's docs

#### Notes

`AMAProvider.md` and `useAMAContext.md` both document the old `trackError(id: string)` / `removeError` signatures — both must be updated in this story.

For `HideChildrenFromAccessibilityTree`: the component has no imperative methods, so the Methods section may state "None" rather than being omitted entirely (so it's clear the four sections were checked, not skipped).

#### Implementation Reference

- **Files (update):** `packages/core/docs/components/AMAProvider.md`, `packages/core/docs/hooks/useAMAContext.md`
- **Files (create):** `packages/core/docs/components/HideChildrenFromAccessibilityTree.md`
- **Files (verify):** `packages/core/docs/components/AutofocusContainer.md`, `packages/core/docs/hooks/useFocus.md`, `packages/core/docs/hooks/useTimedAction.md`
- **Authoritative export list:** the `"exports"` field in `packages/core/package.json` — one doc page per named export key (excluding type-only and internal bridge keys per the judgment in Notes)
- **Source for v2 signatures:** `packages/core/src/components/AMAProvider.tsx` for `AMAContextValue` / `AMADevContextValue`; the current `trackError` signature is `trackError(rule: AmaRule, ref?: React.RefObject<any>): void`
- **Dev-mode banner:** use the existing `:::dev` admonition pattern already in the file
- **Import path:** `@react-native-ama/core` (not `react-native-ama`)
- **Do not:** add `removeError` anywhere; add any implementation detail not visible from the public API; touch source files

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
