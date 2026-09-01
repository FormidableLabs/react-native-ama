# Phase 2 Brief

## Why this phase
Phase 1 shipped image-check detection and exposed two unrelated rule-engine defects on iOS. This phase fixes the known broken paths in the check pipeline before config or versioning work starts.

## Phase goal
Correct rule-evaluation behaviour for iOS form-label classification, contrast checking, and config-driven rule control so the check pipeline produces trustworthy output.

## Phase scope
- Fix iOS form-check classification so that when a field has `aria-label`, the check correctly locates the matching accessible `Text` node (same text, minus trailing `:`) and reports `Label is focusable` — matching Android behaviour.
- Fix the AAA/AA contrast-check path so the correct check tier runs based on config rather than the hard-coded short-circuit.
- Investigate and confirm whether contrast violations inside Popup in the playground are a genuine rule failure or a misclassification; fix if misclassification.
- Validate that rules in ama.config.json can be disabled or changed as intended; document or fix any gap found.

## Exit criteria

1. iOS form label classification
   - Field has aria-label "Email:"; a visible, accessible Text node with text "Email" exists: iOS reports `Label is focusable`, matching Android
   - Field has aria-label but no matching accessible Text node: no `Label is focusable` finding
   - Field genuinely missing label: missing-label finding on both platforms
   - Android behaviour unchanged

2. Contrast check tier
   - AAA check disabled in config: only AA check runs
   - AAA check enabled: AAA check runs

3. Contrast in Popup (playground)
   - Open Popup in playground: contrast finding reflects correct pass/fail, not a misclassification

4. Rule disable via config
   - Rule disabled in ama.config.json: no finding reported for that rule at runtime
   - Rule enabled: finding reported as normal

## Assumption log
- The rule-disable mechanism already exists in the config path; this phase validates and fixes it, not builds it from scratch. If no mechanism exists, this becomes a feature story — flag before implementing.
- Contrast-in-Popup is reproducible via the existing playground screen without new playground additions.
- iOS payload for `Text` nodes may be missing text content or accessibility state needed to match the `aria-label` lookup; fix may require Swift changes if the data is absent from the payload.

## Acknowledged risks
- If iOS form-check misclassification turns out to be a native payload gap (text content or accessibility state missing from Swift), the fix scope expands into Swift — flag and surface before implementing.
- If rule disabling is not implemented at all in the config path, this becomes a feature story, not a validation/fix story — flag and surface before implementing.
