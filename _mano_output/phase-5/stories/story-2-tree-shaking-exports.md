### STORY-2: Tree-shakeable named exports

#### What and why
A consumer who imports only `Form` from `@react-native-ama/forms` should not receive the other form components in their production bundle. Currently every package exposes a single barrel entry (`dist/index.js`), so any import pulls in the full package. After this story, each package's `exports` map includes named subpath entries for each public component and hook, and `sideEffects: false` tells bundlers it is safe to drop unused exports.

#### Done when
- [ ] Each active package (`core`, `animations`, `forms`, `lists`, `bottom-sheet`) has `"sideEffects": false` in its `package.json`
- [ ] Each active package's `exports` map includes named subpath entries for each publicly-exported component and hook (e.g. `"./Form"`, `"./useFormField"`) pointing to compiled output in `dist/`
- [ ] The root barrel entry (`.`) remains in `exports` so existing consumers importing from package root continue to work
- [ ] `tsc -p tsconfig.build.json` succeeds for each package after the change
- [ ] Test: importing a single named export from a package in a Jest test does not import symbols from sibling components in that package

#### Not this story
- Moving dependencies to peerDependencies (story-1)
- Coverage auditing or threshold changes (story-3)
- Removing stale `@react-native-ama/internal` or `@react-native-ama/react-native` references (story-4)
- Bundler configuration — packages ship compiled TypeScript source via tsc; Metro (the consumer's bundler) is responsible for tree-shaking at build time

#### Notes
The tech spec states: "No bundler — packages ship source + `dist/` compiled by tsc. Consumers compile through Metro." This means `sideEffects: false` is the primary signal; named subpath `exports` entries point to individual compiled files in `dist/`. The implementation must verify that `tsc` emits per-file output (not a single bundle) so that subpath entries resolve to real files. If the current tsconfig emits a bundle, this story needs to adjust `tsconfig.build.json` to `"module": "commonjs"` with `"declaration": true` and ensure each source file compiles to a distinct `dist/*.js`.

The implementer must enumerate the public API of each package (from each package's `src/index.ts`) and create one subpath entry per exported symbol. Do not create entries for internal or private modules.

#### Implementation Reference
- **Build:** Update `package.json` and verify `tsc` emits per-file output for each package
- **Files (per package):**
  - `packages/core/package.json` — add `sideEffects: false`; add named subpath entries in `exports` for each symbol exported from `packages/core/src/index.ts`
  - `packages/animations/package.json` — same pattern; named entries for each symbol in `packages/animations/src/index.ts`
  - `packages/forms/package.json` — same; symbols from `packages/forms/src/index.ts`
  - `packages/lists/package.json` — same; symbols from `packages/lists/src/index.ts`
  - `packages/bottom-sheet/package.json` — same; symbols from `packages/bottom-sheet/src/index.ts`
  - Each package's `tsconfig.build.json` — confirm or set per-file output (not a single outFile)
- **Subpath entry pattern:**
  ```json
  "./Form": {
    "types": "./dist/src/components/Form.d.ts",
    "default": "./dist/src/components/Form.js"
  }
  ```
- **Do not:** do not remove the root `.` export; do not expose `src/internals/` paths in named subpath entries; do not add a bundler (Metro, Webpack, Rollup) to the build pipeline — tsc only

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
