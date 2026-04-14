# Phase 1 Stories

| Story | Title | Description | Status |
|---|---|---|---|
| 1 | iOS image payload | Extend the iOS debug node payload so accessible images reach JS with enough metadata for alt-text validation. | pending |
| 2 | Android image payload | Extend the Android debug node payload so accessible images reach JS with the same validation contract as iOS. | pending |
| 3 | Image alt rule | Add JS image-node typing and missing-alt-text evaluation without regressing the existing AMA rule flow. | pending |
| 4 | Images playground | Add a focused playground screen for manual verification of labeled, unlabeled, and decorative image cases. | pending |

## Suggested Order

1. Story 1
2. Story 2
3. Story 3
4. Story 4

Stories 1 and 2 can be worked in parallel. Story 3 depends on at least one native payload implementation being understood, and Story 4 is most useful after Story 3 is in place.