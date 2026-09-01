### STORY-5: lists package docs

#### What and why

A developer using `@react-native-ama/lists` finds that `useDynamicList` has no doc page despite being a public export. The three component pages (`DynamicFlatList`, `FlatList`, `StaticFlatList`) exist but need to be verified against source. This story adds the missing hook page and confirms every lists export is documented with the four required sections.

#### Done when

**DynamicFlatList**
- [ ] `DynamicFlatList.mdx` has the four required sections; Props (including `singularMessage`, `pluralMessage`, `isPlural`, `rowsCount`, `numColumns`) are verified against `packages/lists/src/components/DynamicFlatList.tsx`; no undocumented required props remain; no documented props are absent from source

**FlatList**
- [ ] `FlatList.mdx` has the four required sections; the `listType` prop (`"dynamic"` | `"static"`) is verified against `packages/lists/src/components/FlatList.tsx`

**StaticFlatList**
- [ ] `StaticFlatList.mdx` has the four required sections; Props (`rowsCount`, `numColumns`) are verified against `packages/lists/src/components/StaticFlatList.tsx`; the absence of `singularMessage`/`pluralMessage` props (static lists don't announce count changes) is confirmed accurate

**useDynamicList (new page)**
- [ ] A new `useDynamicList.md` page exists under `packages/lists/docs/`
- [ ] Page has a Usage section: `import { useDynamicList } from '@react-native-ama/lists'` with a minimal code example
- [ ] Page has a Parameters section listing all arguments from `UseDynamicList` type: `data` (required, ArrayLike), `singularMessage` (required, string, must include `%count%`), `pluralMessage` (required, string, must include `%count%`), `isPlural` (optional, `(count: number) => boolean`), `numColumns` (optional, number, default 1)
- [ ] Page has a Returns section documenting `{ rowsCount: number, columnsCount: number }`
- [ ] Page notes in Parameters or a tip block that `singularMessage` and `pluralMessage` must contain the `%count%` placeholder, and that in `__DEV__` mode the hook logs an error if the placeholder is missing

#### Not this story
- Creating docs for internal utilities or components not in `package.json` exports
- Fixing any source code
- Any other package's docs

#### Notes

`useDynamicList` is the backing hook for `DynamicFlatList`. Its primary audience is developers who want to build a custom list with the same screen-reader announcement behaviour as `DynamicFlatList` but with a custom rendering surface.

The `%count%` validation is a `__DEV__`-only `console.error`; it is worth documenting in the Parameters section as a usage constraint rather than a dev-mode-only behaviour (the requirement to include `%count%` is always true, even if the error check is dev-only).

#### Implementation Reference

- **Files (verify + update):** `packages/lists/docs/DynamicFlatList.mdx`, `packages/lists/docs/FlatList.mdx`, `packages/lists/docs/StaticFlatList.mdx`
- **Files (create):** `packages/lists/docs/useDynamicList.md`
- **Authoritative export list:** `"exports"` field in `packages/lists/package.json` — 4 keys: `./DynamicFlatList`, `./FlatList`, `./StaticFlatList`, `./useDynamicList`
- **Source for `useDynamicList` parameters:** `packages/lists/src/hooks/useDynamicList.ts` — the exported `UseDynamicList` type and return shape `{ rowsCount, columnsCount }`
- **Import path:** `@react-native-ama/lists`
- **Do not:** document internal hooks or components not in the exports; touch source files

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
