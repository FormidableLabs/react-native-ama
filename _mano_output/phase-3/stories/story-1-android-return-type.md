### STORY-1: Android TextInput return type

#### What and why
A developer using AMA on Android has no way to know when a non-last TextInput is missing an explicit return key type, because the Android node collector never sends the `returnType` field. After this story, the same `INPUT_INVALID_RETURN_KEY` finding that fires on iOS also fires on Android when a non-last field has no explicit return type set.

#### Done when
- [ ] A TextInput that is not the last field in an Android form and has no explicit return type set triggers the `INPUT_INVALID_RETURN_KEY` finding in the AMA overlay.
- [ ] A TextInput that is the last field in the form does not trigger `INPUT_INVALID_RETURN_KEY` regardless of its return type.
- [ ] A TextInput with an explicitly set return type (e.g. `next`) does not trigger `INPUT_INVALID_RETURN_KEY` when it is not the last field.
- [ ] The iOS form-check behaviour for `INPUT_INVALID_RETURN_KEY` is unchanged.
- [ ] `returnType` is present in the `onAmaNodes` payload for TextInput nodes on Android (value `0` for unset, non-zero for any explicitly set action).

#### Not this story
- No changes to JS-side `checkTextInputs` or `performChecks`.
- No changes to the iOS Swift node collector.
- No changes to `AmaNode` TypeScript type — `returnType?: number` already exists.

#### Notes
Android `IME_ACTION_UNSPECIFIED = 0` is semantically equivalent to iOS `UIReturnKeyType.default = 0`. The JS rule already fires on `returnType === 0` for non-last inputs — no JS change is needed once Kotlin sends the field.

#### Implementation Reference
- **Files:** `packages/core/android/src/debug/java/expo/modules/ama/nodesGrabber.kt` — all changes in this file
- **Contract:** `NodePayload` data class must gain a `returnType: Int?` field; `toMap()` must include `"returnType" to this.returnType`
- **Data:** read `returnType` as `(view as? android.widget.EditText)?.imeOptions?.and(android.view.inputmethod.EditorInfo.IME_MASK_ACTION)` — send the masked integer value directly; `IME_ACTION_UNSPECIFIED (0)` means no explicit type set
- **Scope:** set `returnType` only when `nodeType == NodeType.TextInput`; all other node types send `null`
- **Do not:** do not map Android IME values to iOS `UIReturnKeyType` raw values; send the masked Android value as-is — the cross-platform contract holds because both platforms use `0` for "unset"

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
