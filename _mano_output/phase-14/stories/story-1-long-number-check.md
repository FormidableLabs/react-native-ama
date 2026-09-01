### STORY-1: Flag unformatted long numbers

#### What and why

A screen reader user hears a card or account number read out as "four trillion, one hundred eleven billion..." instead of digit-by-digit, because the text has no spacing to break it up. Right now nothing in AMA catches this. This story adds a check that flags text content containing a long run of unformatted digits, so developers know to add spacing before it ships.

#### Done when

- [ ] A text/label field containing a long run of unformatted consecutive digits (12 or more, by default) is flagged with `LONG_NUMBER_NOT_FORMATTED`
- [ ] A formatted phone number (digits broken up by spaces, dashes, or parentheses) is not flagged, even when its total digit count exceeds the threshold
- [ ] The digit-count threshold is configurable via `ama.config.json`'s `longNumberMinLength` key
- [ ] Test: a digit run shorter than the configured threshold is not flagged
- [ ] Test: lowering `longNumberMinLength` causes a shorter digit run (that wouldn't trigger at the default) to be flagged

#### Not this story

- Any change to the Text guideline or checklist pages — story 3
- The focus-shift check — story 2
- Auto-fixing or reformatting the detected number — AMA flags it, the consumer fixes it

#### Implementation Reference

- **Files:** new `packages/core/src/internals/checks/checkLongNumber.ts`, following the existing pattern of `checkIsUppercase.ts`; wired into the same per-node check pipeline (`performChecks`) in `packages/core/src/internals/useAMADev.ts`
- **Rule:** `LONG_NUMBER_NOT_FORMATTED`, default severity `warn` (heuristic-based, per `tech-spec.md`)
- **Contract:** check runs against each `AmaNode`'s `content` and `ariaLabel` fields — find the longest run of consecutive digit characters (`0-9`) with no separators; flag when that run's length `>= longNumberMinLength`
- **Config:** add `longNumberMinLength` (number, default `12`) to `AmaProjectConfig` in `packages/core/src/internals/config.ts` and the package default `ama.config.json`, alongside the existing `uppercaseMinLength` key — same shape, same pattern
- **Do not:** attempt to classify numbers as "phone" vs. "card" — the check is purely "consecutive digits, no separators"; see `tech-spec.md` § "Long numeric string check" for why

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
