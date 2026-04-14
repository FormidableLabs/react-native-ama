### [STORY-1]: iOS image payload

**As a** React Native AMA maintainer
**I want to** include accessible image nodes in the iOS debug payload
**So that** JS rules can evaluate image alt text on iOS without guessing from incomplete node data

#### Acceptance Criteria
- [ ] `onAmaNodes` includes accessible `UIImageView` nodes emitted as `type: 'Image'`, with the fields needed to evaluate missing alt text, using the existing accessibility label/name source rather than a new custom prop.
- [ ] Decorative or intentionally non-accessible images are emitted in a way that lets the JS layer skip the alt-text rule instead of producing a false violation.
- [ ] The new native `Image` node type is reflected in `packages/core/src/ReactNativeAma.types.ts` so the shared `AmaNode` contract stays aligned with the iOS payload.
- [ ] The iOS payload change stays inside the existing debug-only native monitoring path and does not introduce release-build monitoring behavior.
- [ ] Test: iOS native mapping coverage proves an accessible image with no label reaches JS as an image candidate for rule evaluation.
- [ ] Test: iOS native mapping coverage proves labeled images and non-accessible images preserve the metadata the JS layer needs to avoid false positives.

#### Out of Scope
- Changing Android payload behavior.
- Implementing the JS rule that consumes the payload.
- Adding new user-facing playground scenarios.

#### Notes
Keep the native-to-JS contract symmetric with Android, add the new `Image` node type through the shared schema, and preserve the current `Native collect nodes -> onAmaNodes -> useAMADev/checkNodes` flow.

#### Implementation Reference
- **Project rules:** Keep iOS and Android module contracts symmetric; Native-to-JS node flow is a fixed contract; AmaNode payload schema is the source of truth; Keep monitoring code debug-only on native platforms; Native diagnostics should use centralized logger wrappers; Unit tests are required for exported hooks/components and core rule evaluators; Validate native/runtime behavior in playground for any native bridge or checker-flow change.
- **Files:** `packages/core/ios/NodesGrabber.swift`, `packages/core/ios/ReactNativeAmaModule.swift`, `packages/core/src/ReactNativeAma.types.ts`, nearby native test coverage if present under `packages/core`.
- **Error format:** Payload must continue to support downstream rule output through the existing AMA error envelope and severity mapping.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->