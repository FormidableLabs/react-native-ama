### STORY-1a: Add long-number visual test case to playground

#### What and why

A developer verifying the long-number check today can only trust the unit tests — there's no way to see it actually fire in a running app. This story adds a demo case to the playground's Text screen so the check's behaviour is visible firsthand, matching how the screen already demonstrates the uppercase and contrast checks.

#### Done when

- [ ] The playground's Text screen renders a text element containing an unformatted long digit string (e.g. a fake 16-digit card number) that exceeds the default `longNumberMinLength`
- [ ] Running the playground with AMA's dev checks active, that element surfaces a `LONG_NUMBER_NOT_FORMATTED` issue in AMA's dev overlay

#### Not this story

- The check implementation itself — story 1 (already done)
- Any playground demo for the focus-shift check — that belongs with story 2 if wanted, not requested here

#### Implementation Reference

- **Files:** `playground/src/screens/Text.screen.tsx` — add one more `<Text>` element after the existing "Insufficient contrast" example, following that file's existing flat layout (a `<Spacer height="small" />` between items, no `<TestCase>` wrapper — this screen doesn't use one)
- **Content:** a `<Text>` whose content is an unformatted 16-digit string (e.g. `"4111111111111111"`), long enough to exceed the default `longNumberMinLength` (`12`)

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
