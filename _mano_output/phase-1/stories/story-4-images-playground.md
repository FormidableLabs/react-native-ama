### [STORY-4]: Images playground

**As a** React Native AMA maintainer
**I want to** add a dedicated playground screen for image accessibility cases
**So that** the new image rule can be manually verified on device and simulator with repeatable scenarios

#### Acceptance Criteria
- [ ] The Playground tab includes an `Images` entry that navigates to a dedicated image-check screen using the existing app navigation pattern.
- [ ] The Images screen includes an accessible image with missing alt text that consistently triggers the AMA violation.
- [ ] The Images screen includes a labeled accessible image and a non-accessible image that consistently produce no image alt-text violation.
- [ ] The screen uses the existing playground layout/components so it behaves like other manual verification screens instead of introducing a one-off navigation pattern.
- [ ] Test: manual verification on iOS and Android confirms the screen reproduces exactly one missing-alt-text violation for the intended case and none for the labeled or decorative cases.

#### Out of Scope
- Redesigning the playground visual system.
- Adding unrelated accessibility demos to the playground.
- Changing package APIs outside the playground app.

#### Notes
Keep this screen narrowly focused on image behavior so manual QA can isolate native payload issues from unrelated checker noise.

#### Implementation Reference
- **Screen:** Playground tab -> Images
- **Layout:** Reuse the existing screen header, grouped list navigation, and standard screen body structure already used in the playground app.
- **Components:** Existing `ListItem`, `Header`, `Text`, and standard React Native image/layout primitives.
- **Behaviour:** Add one navigable entry from the main playground list and render three clear scenarios: unlabeled accessible image, labeled accessible image, decorative/non-accessible image.
- **Project rules:** Component files are PascalCase and match exported symbol; Co-locate tests with source files; Keep side effects in hooks or internals utilities; Validate native/runtime behavior in playground for any native bridge or checker-flow change.
- **Files:** `playground/src/AppNavigation.tsx`, `playground/src/screens/PlaygroundTab.screen.tsx`, `playground/src/screens/Images.screen.tsx`, any nearby test file beside the new screen if added.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->