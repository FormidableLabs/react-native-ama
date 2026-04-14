# Phase 1 Brief

## Problem
The accessibility runtime checks do not currently catch missing alt text on images that are exposed to assistive technologies. This leaves a critical gap in validation and can let inaccessible image content ship unnoticed.

## Vision
When developers run AMA in debug mode, images that should be accessible are validated the same way text and controls already are. If an accessible image has no meaningful alt text, the rule is reported immediately with clear feedback. The native-to-JS pipeline includes the image data needed for this check on both iOS and Android, and a dedicated playground screen makes manual verification repeatable.

## Design principle
Prefer correctness of accessibility signals over minimizing check noise; false negatives are worse than extra warnings.

## Phase goal
Ship end-to-end detection of missing alt text for accessible images, powered by native payload support on iOS and Android and surfaced through JS rule checks.

## Phase scope
- Add native payload support for accessible image nodes in Swift (iOS) and Kotlin (Android).
- Extend JS node typing/check pipeline to evaluate missing alt text for accessible images.
- Add/update tests for native payload mapping assumptions and rule behavior.
- Ensure the new rule follows existing logging/highlight severity behavior.
- Add playground/Images.screen.tsx and wire it into playground flow for manual validation of image-check behavior.

## Exit criteria
- AMA reports a rule violation when an accessible image lacks alt text.
- No violation is reported when image is marked `accessible={false}`.
- iOS and Android both provide required image metadata to JS checks in debug mode.
- Playground exposes an image-focused scenario screen where expected violations/non-violations can be reproduced reliably.
- Existing checks continue to pass with no regression in current rule outputs.

## Assumption log
- Image accessibility data is obtainable from current native view traversal logic without introducing release-build code paths.
- Alt text source will be derived from existing accessibility label/name fields rather than introducing a new custom prop.
- Root-level test orchestration improvements are deferred to a later phase and not a blocker for this scoped feature.
- Playground screen routing can be updated without introducing new app-level architecture changes.
