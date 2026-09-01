### STORY-3: Document the long-number check

#### What and why

A developer reading the Text guideline has no way to learn AMA can flag unformatted long numbers, or how to adjust the threshold. A QA tester following the Text checklist has no manual-test step to verify it. This story adds both.

#### Done when

- [ ] `website/guidelines/text.md`'s "AMA Errors" section includes a `LONG_NUMBER_NOT_FORMATTED` entry describing what triggers it, matching the format of the existing entries in that section
- [ ] `website/checklist/text.md` includes a manual-test step for unformatted long numbers, describing what a screen reader announces and how to verify it

#### Not this story

- Implementing the check itself — story 1 (this story depends on it being implemented, but only documents the resulting behaviour)
- Any focus-related documentation — story 4

#### Notes

Depends on: story 1 (documents its actual behaviour and rule name).

#### Implementation Reference

- **Files:** `website/guidelines/text.md` — add a new `### LONG_NUMBER_NOT_FORMATTED <ShouldNot />` subsection immediately after the existing `### NO_UPPERCASE_ACCESSIBILITY_LABEL <ShouldNot />` subsection, before `## Known issues`. Match the existing subsections' format exactly: heading with severity tag, one paragraph describing the trigger and why it matters.
- **Content:** "This is raised when a text element or accessibility label contains a long run of unformatted digits (12 or more by default) — screen readers read a solid digit run as one large number instead of digit-by-digit. The threshold is configurable via `longNumberMinLength` in `ama.config.json`."
- **Files:** `website/checklist/text.md` — add a new `## Long numbers` section after the existing `## Uppercase` section, before `## Testing`, matching that section's exact shape: an "I hear" table row plus a `:::note` block.
- **Content:**
  ```markdown
  ## Long numbers

  |                          | I hear                                                  |
  | ------------------------ | -------------------------------------------------------- |
  | Unformatted long numbers | A screen reader reading the number as one large value (e.g. "four trillion...") instead of digit-by-digit |

  :::note

  If your text contains a long number that isn't a phone number (e.g. a card or account number), add spacing between digits via the `accessibility-label` property so a screen reader announces it digit-by-digit.
  :::
  ```

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
