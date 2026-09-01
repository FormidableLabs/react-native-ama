# Stories — react-native-ama — Phase 7

| # | Story | Description | File | Status |
|---|-------|-------------|------|--------|
| 1 | `trackError` on AMA context | Replace old trackError/removeError signatures; implement trackError(rule, ref?) in useAMADev and wire into AMAProvider | story-1-trackError-context.md | done |
| 2 | `checkFocusTrap` utility in forms | Restore checkFocusTrap as a __DEV__-only async utility in forms; inline isFocused; core-absent fallback to console.error | story-2-checkFocusTrap-forms.md | done |
| 3 | Wire `checkFocusTrap` into `focusNextFormField` | Call checkFocusTrap after focus advance in useFormField; end-to-end trap detection in dev mode | story-3-wire-focusNextFormField.md | done |
