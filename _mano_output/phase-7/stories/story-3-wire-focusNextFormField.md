### STORY-3: Wire `checkFocusTrap` into `focusNextFormField`

#### What and why

A developer using `focusNextFormField` in a form gets no feedback in dev mode when keyboard focus becomes trapped in a field. This story wires `checkFocusTrap` back into `focusNextFormField` so that a trapped focus is detected 100 ms after the advance attempt and surfaced through the AMA error pipeline — matching the behaviour that existed before the AMA 2.0 refactor removed it.

#### Done when

- [ ] `focusNextFormField` calls `checkFocusTrap` in dev mode after advancing focus, guarded by `__DEV__ && currentField?.hasFocusCallback`
- [ ] When focus advances to a field that traps focus, the `NO_KEYBOARD_TRAP` error appears in the AMA dev overlay within ~100 ms of the advance
- [ ] When focus advances normally (no trap), no error is added to the overlay
- [ ] The behaviour is absent in production builds (the `__DEV__` guard ensures no overhead at runtime)
- [ ] Test: when `hasFocusCallback` is true and focus becomes trapped, `checkFocusTrap` is called with the current field ref
- [ ] Test: when `hasFocusCallback` is false, `checkFocusTrap` is not called
- [ ] Test: `checkFocusTrap` is not called outside `__DEV__`

#### Not this story

- Changes to the AMA context type or `trackError` implementation — that is story 1
- The `checkFocusTrap` implementation itself — that is story 2
- Any change to how `focusNextFormField` advances focus — only the trap-detection call is added

#### Notes

Depends on: story 1 and story 2.

This is the end-to-end integration story. The call site in `focusNextFormField` mirrors the original deleted code:

```
__DEV__ &&
  currentField?.hasFocusCallback &&
  checkFocusTrap({
    ref: currentField?.ref?.current,
    shouldHaveFocus: false,
  });
```

`currentField.ref` is the field ref already available in `useFormField`. `shouldHaveFocus: false` is the correct value here — after `focusNextFormField` advances focus away from the current field, that field should no longer have focus; if it does, the trap is detected.

Project rule 17 applies: any change to the `useAMADev` check flow requires manual playground verification.

#### Implementation Reference

- **Files:** `packages/forms/src/hooks/useFormField.ts` — add `checkFocusTrap` call inside `focusNextFormField`
- **Call site guard:** `__DEV__ && currentField?.hasFocusCallback` — both conditions must hold before calling
- **`shouldHaveFocus`:** always `false` at this call site — the field being advanced away from should not retain focus
- **Import:** `checkFocusTrap` from `../utils/checkFocusTrap` (story 2's file)
- **Playground verification:** manually verify in playground that a trapped form field produces a `NO_KEYBOARD_TRAP` highlight on the offending field (per project rule 17)
- **Do not:** do not change how focus is advanced; do not add any return-value handling from `checkFocusTrap` (it returns `Promise<void>`); do not call `checkFocusTrap` outside the `__DEV__` guard

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
