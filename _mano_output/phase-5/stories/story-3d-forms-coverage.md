### STORY-3d: forms coverage threshold

#### What and why
A contributor changing form components has no automated safety net — `packages/forms` had a coverage threshold set but it was not being met, so regressions in important form paths went undetected. After this story, the forms package enforces a minimum coverage floor and `yarn workspace @react-native-ama/forms test --coverage` passes without threshold failures.

#### Done when
- [x] Running `yarn workspace @react-native-ama/forms test --coverage` reports current coverage numbers for statements, branches, functions, and lines
- [x] New tests added for previously uncovered paths: `useFocus` (full hook), `Form.focusFieldAt`, `useForm` suppressError/throw paths, `useFormField` focusNextFormField non-last and nextFormFieldRef/nextFieldId branches, `FormField` wrapInsideAccessibleView=false, `TextInput` aria-label fallback
- [x] `packages/forms/package.json` has a `coverageThreshold` block (was already present: statements 90%, branches 82%, functions 83%, lines 91%)
- [x] `yarn workspace @react-native-ama/forms test --coverage` passes with no threshold failures (41 tests pass, all thresholds met)

#### Not this story
- Coverage thresholds for animations, lists, bottom-sheet, or core (stories 3, 3a, 3b, 3c)
- Peer dep changes (story-1), tree-shaking (story-2), dead package cleanup (story-4)
- 100% coverage — meaningful floor on important paths only

#### Notes
`useFocus.ts` was at 5% coverage (essentially untested). `SHELL_COLORS` is used as an implicit global inside `useFocus.ts` and must be defined in the test environment via `(global as any).SHELL_COLORS = { ... }`.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
