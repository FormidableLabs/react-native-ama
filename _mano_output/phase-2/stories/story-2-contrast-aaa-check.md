### STORY-2: Fix AAA contrast check gate

#### What and why
A developer who has disabled the AAA contrast check in `ama.config.json` still has the AAA path short-circuited by a hardcoded `&& false` in `checkContrast.ts`, meaning the config setting has no effect. This story removes the short-circuit and wires the check tier to the config value so the correct check (AA or AAA) runs based on what the developer configured.

#### Done when
- [ ] With AAA check disabled in `ama.config.json`: only the AA contrast check runs; no AAA finding is reported for a colour pair that passes AA but fails AAA.
- [ ] With AAA check enabled in `ama.config.json`: the AAA contrast check runs; a colour pair that fails AAA but passes AA reports an AAA finding.
- [ ] A colour pair that fails AA reports an AA finding regardless of the AAA config setting.
- [ ] Test: unit test for the contrast checker covers AA-only config, AAA-enabled config, and a pair that fails AA.

#### Not this story
- No changes to contrast calculation logic — only the gate that decides which tier to enforce.
- No changes to `ama.config.json` schema or key names.
- No playground screen changes.

#### Notes
The hardcoded short-circuit is `if (!passesAAA && false)` in `packages/core/src/internals/checks/checkContrast.ts`. The fix replaces `&& false` with a config-driven condition. The `rules` key in `ama.config.json` controls per-rule severity; confirm which key governs the AAA tier before replacing the guard.

#### Implementation Reference
- **Files:** `packages/core/src/internals/checks/checkContrast.ts` — remove `&& false` short-circuit; wire AAA gate to config
- **Contract:** Runtime config shape defined in tech-spec.md §Runtime config. The `rules` key maps per-rule severity (`warn` / `error` / `off`). Identify the rule key for AAA contrast and read it before entering the AAA check path.
- **Do not:** Do not change contrast ratio calculation. Do not introduce new config keys — use the existing `rules` map. Do not export the checker outside `__DEV__` (project rule 10).

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
