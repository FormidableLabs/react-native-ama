# Phase Brief — react-native-ama — Phase 14

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

Two real accessibility gaps AMA doesn't yet catch: long unformatted digit strings (like card or account numbers) get misread by screen readers as huge numbers instead of digit-by-digit, and interactive UI changes (like an accordion revealing content) don't move focus into the new content, stranding screen reader users on stale UI.

## Phase Goal

AMA detects both long unformatted digit strings and Pressable interactions that reveal new UI without a corresponding focus shift, each as a configurable, disable-able check — and both are documented in their respective guideline and checklist pages.

## Phase Scope

- New check flags text content containing a long run of digits (e.g. card or account numbers) that isn't formatted for screen readers; the digit-count threshold that triggers it is configurable.
- New check flags a Pressable interaction that causes UI to appear or change without focus moving into the new content; this check can be disabled via config.
- The Text guideline and checklist document the long-number check: what triggers it and how to verify it manually.
- The Focus guideline and checklist document the focus-shift check: what triggers it, that it can be disabled, and how to verify it manually.
- The playground's Text screen includes a visual test case for the long-number check, so the behaviour can be seen firing in a running app, not just in unit tests.

## Not This Phase

- Automatically reformatting or fixing detected long-number text — AMA flags it, the consumer fixes it, matching how every other AMA check already works
- Any new rule or check beyond these two
- Deciding the exact default digit threshold or the focus check's default enabled/disabled state — that's a spec/rules decision, not a phase-scope one

## Exit Criteria

1. Long number check
   - A text field with a long run of unformatted digits: AMA reports a new issue
   - The digit-count threshold is configurable via `ama.config.json`
   - The Text guideline and checklist describe the check and how to verify it
   - The playground's Text screen visually demonstrates the check firing on unformatted long-number content
2. Focus-shift check
   - A Pressable interaction that reveals new UI without focus moving into it: AMA reports a new issue
   - The check can be disabled via config
   - The Focus guideline and checklist describe the check and how to verify it

## Acknowledged Risks

- The focus-shift check carries real false-positive risk by the requester's own account. Mitigation: disabled per-rule via the existing `rules` config override, default severity `warn` — confirmed in `tech-spec.md`, not a guess.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
