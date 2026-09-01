### STORY-4: Rule disable via config

#### What and why
A developer wants to suppress a specific AMA rule by setting it to `off` in `ama.config.json`, but it is unclear whether the runtime actually honours that setting. This story validates that the disable path works end-to-end — from config read through to suppressed finding — and fixes any gap found.

#### Done when
- [ ] A rule set to `off` in `ama.config.json` produces no finding at runtime for a scenario that would otherwise trigger it.
- [ ] A rule set to `warn` reports a warning (not an error) for a triggering scenario.
- [ ] A rule set to `error` reports an error for a triggering scenario.
- [ ] Removing a rule's entry from `ama.config.json` (falling back to default) produces the default finding severity for that rule.
- [ ] Test: unit test covers `off`, `warn`, and `error` severity values for at least one rule.

#### Not this story
- No changes to `ama.config.json` key structure or schema.
- No new rule types or severities beyond the existing `warn` / `error` / `off` values.
- No playground screen changes — manual validation uses an existing screen with a known triggerable rule.

#### Notes
The `rules` key in `ama.config.json` maps rule identifiers to severity. If the runtime ignores `off` entries, the fix is in the severity-checking path that decides whether to log/highlight a finding. If the config is not being read at all, the fix is earlier — in config loading.

If the disable mechanism does not exist at all in the runtime, stop and surface this as a scope-expansion finding before implementing — per the assumption log in the phase brief, this story is validate-and-fix, not build-from-scratch.

#### Implementation Reference
- **Files:** Config loading — locate where `ama.config.json` is read at runtime (likely `packages/core/src/`). Severity enforcement — locate where a rule finding decides whether to log or highlight based on severity (likely `packages/core/src/internals/` or `useAMADev`).
- **Contract:** Runtime config `rules` key — defined in tech-spec.md §Runtime config. Valid severity values: `warn`, `error`, `off`.
- **Do not:** Do not change the config schema or key names. Do not add new severity values. Do not implement a rule-disable mechanism from scratch without surfacing the scope gap first.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
