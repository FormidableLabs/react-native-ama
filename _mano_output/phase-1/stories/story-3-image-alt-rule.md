### [STORY-3]: Image alt rule

**As a** React Native AMA maintainer
**I want to** evaluate accessible image nodes for missing alt text in the JS checker pipeline
**So that** unlabeled accessible images are reported immediately during AMA debug sessions

#### Acceptance Criteria
- [ ] The shared AMA node typing and check pipeline accept image nodes from native payloads without regressing existing text, pressable, or text-input checks.
- [ ] An accessible image with no meaningful derived accessibility label/name produces a rule violation in AMA output.
- [ ] An accessible image with a meaningful label/name produces no image alt-text violation.
- [ ] An image marked non-accessible produces no image alt-text violation.
- [ ] Test: checker coverage proves missing-label, valid-label, and `accessible={false}` image cases, and confirms logging/highlight severity still follows the existing rule pipeline.

#### Out of Scope
- Building new native collection paths beyond the payload changes covered in Stories 1 and 2.
- Changing unrelated accessibility rules or logging formats.
- Creating a standalone test-only story.

#### Notes
If a new rule identifier is added, wire it through the existing help/severity mapping so QA can see the same logging and highlight behavior as other AMA checks.

#### Implementation Reference
- **Project rules:** Keep side effects in hooks or internals utilities; Export checker functions only behind `__DEV__`; Public API only through `src/index.ts`; Type public props and actions explicitly; Native-to-JS node flow is a fixed contract; Unit tests are required for exported hooks/components and core rule evaluators.
- **Files:** `packages/core/src/ReactNativeAma.types.ts`, `packages/core/src/internals/checks/performChecks.ts`, `packages/core/src/internals/useAMADev.ts`, `packages/core/src/internals/utils/rules.ts`, new or nearby checker tests under `packages/core/src/internals/checks/`.
- **Error format:** Reuse the existing AMA issue shape and severity lookup so `logFoundIssues` and highlight rendering continue to work unchanged.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->