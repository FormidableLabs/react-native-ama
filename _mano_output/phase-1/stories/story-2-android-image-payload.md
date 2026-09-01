### [STORY-2]: Android image payload

**As a** React Native AMA maintainer
**I want to** include accessible image nodes in the Android debug payload
**So that** JS rules can evaluate image alt text on Android with the same contract used on iOS

#### Acceptance Criteria
- [ ] `onAmaNodes` includes accessible `ImageView` nodes emitted as `type: 'Image'`, with the fields needed to evaluate missing alt text, using existing accessibility name/label data available from the Android node info.
- [ ] Images marked non-accessible or hidden from accessibility are emitted in a way that lets the JS layer skip the alt-text rule instead of treating them as violations.
- [ ] The new native `Image` node type is reflected in `packages/core/src/ReactNativeAma.types.ts` so the shared `AmaNode` contract stays aligned with the Android payload.
- [ ] The Android payload change remains inside `android/src/debug/java` and does not expand AMA monitoring into release builds.

#### Out of Scope
- Changing iOS payload behavior.
- Implementing the JS rule that consumes the payload.
- Adding new playground UI.

#### Notes
Match the iOS contract closely enough that the JS checker does not need platform branches for image handling, including the shared `Image` node type in `AmaNode`.

#### Implementation Reference
- **Project rules:** Keep iOS and Android module contracts symmetric; Native-to-JS node flow is a fixed contract; AmaNode payload schema is the source of truth; Keep monitoring code debug-only on native platforms; Native diagnostics should use centralized logger wrappers; Unit tests are required for exported hooks/components and core rule evaluators; Validate native/runtime behavior in playground for any native bridge or checker-flow change.
- **Files:** `packages/core/android/src/debug/java/expo/modules/ama/nodesGrabber.kt`, `packages/core/android/src/debug/java/expo/modules/ama/ReactNativeAmaModule.kt`, `packages/core/android/src/debug/java/expo/modules/ama/logger.kt`, `packages/core/src/ReactNativeAma.types.ts`, nearby native test coverage if present under `packages/core`.
- **Error format:** Payload must continue to support downstream rule output through the existing AMA error envelope and severity mapping.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->