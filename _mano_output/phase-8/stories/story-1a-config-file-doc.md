### STORY-1a: config-file doc update

#### What and why

A developer customising AMA's runtime behaviour reads `website/docs/ama/config-file.md` to understand what they can configure. The page documents the v1 config shape: it is missing 10 rules added in v2, lists the wrong non-overridable rules, and has no coverage of the v2-only config sections (`highlight`, `log`, `uppercaseMinLength`, `checks`). This story brings the page in line with the v2 `ama.config.json` structure so the developer can configure AMA without referencing source.

#### Done when

**Rules table**
- [ ] The rules table lists all 23 `AmaRule` values currently defined in source, each with its guideline link, default severity, and whether it can be overridden
- [ ] The non-overridable column accurately reflects the `NON_OVERRIDABLE_RULES` array in source: `NO_ACCESSIBILITY_ROLE`, `NO_ACCESSIBILITY_LABEL`, `NO_KEYBOARD_TRAP`, `NO_UNDEFINED`, `INPUT_HAS_NO_VISIBLE_LABEL`, `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE`, `BOTTOM_SHEET_CLOSE_ACTION`, `INCOMPATIBLE_ACCESSIBILITY_STATE`, `INCOMPATIBLE_ACCESSIBILITY_ROLE`, `NO_HEADER_FOUND` — any rule not in this list is overridable
- [ ] Rules currently absent from the page but present in source are added: `IMAGE_MISSING_ALT_TEXT`, `INPUT_HAS_NO_VISIBLE_LABEL`, `INPUT_INVALID_RETURN_KEY`, `INPUT_HAS_FOCUSABLE_LABEL`, `INCOMPATIBLE_ACCESSIBILITY_STATE`, `INCOMPATIBLE_ACCESSIBILITY_ROLE`, `NO_FORM_LABEL_ENDING_WITH_ASTERISK`, `NO_UPPERCASE_ACCESSIBILITY_LABEL`, `NO_HEADER_FOUND`, `NO_ACCESSIBILITY_STATE_SET`, `NO_UNDEFINED`

**v2 config sections**
- [ ] The page documents the `highlight` object: `mode` (`"border"` | `"background"` | `"both"`), `borderWidth` (number, optional), `gap` (number, optional)
- [ ] The page documents `log`: `"always"` | `"inspect"`
- [ ] The page documents `uppercaseMinLength` (number — minimum character count before the uppercase rule applies; default `4`)
- [ ] The page documents the `checks` object: `ui` (boolean), `forms` (boolean), `grouping` (boolean), `delay` (number, ms)

**Example JSON**
- [ ] The example `ama.config.json` block is valid JSON (quoted keys, no trailing commas) and includes at least one key from each v2 section so a developer can copy-paste it as a starting point

**Constants section**
- [ ] `CONTRAST_CHECKER_MAX_DEPTH` default value is listed as `5` (matches `CONTRAST_CHECKER_MAX_DEPTH` constant in source)
- [ ] `IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS` is documented as a configurable constant (default `false`)

#### Not this story
- Changing the guideline pages linked from the rules table
- Adding guideline pages for rules that lack them
- Editing any source file
- Any per-package docs page

#### Notes

The existing page uses `NO_FORM_LABEL` as a rule key — the actual rule key in source is `INPUT_HAS_NO_VISIBLE_LABEL`. The table entry must be corrected to the actual key name.

The existing example JSON has unquoted `rules` key — fix to valid JSON in the updated example.

`NO_UNDEFINED` is non-overridable but is an internal-use rule; include it in the table for completeness since it appears in `LOGGER_RULES` and `NON_OVERRIDABLE_RULES`.

#### Implementation Reference

- **Files (update):** `website/docs/ama/config-file.md`
- **Source of truth for rule keys, defaults, and overridability:**
  - Rule names and default actions: `packages/core/src/internals/utils/rules.ts` — `AmaRule` type and `LOGGER_RULES` map
  - Non-overridable list: `NON_OVERRIDABLE_RULES` array in the same file
  - Config shape and defaults: `packages/core/src/internals/config.ts` (`AmaProjectConfig` type) and `packages/core/ama.config.json`
- **Action → severity mapping:** `MUST` / `MUST_NOT` → error (enforced); `SHOULD` / `SHOULD_NOT` → warn (preferred); `PLEASE_FORGIVE_ME` → silenced
- **Default config values** (from `packages/core/ama.config.json`): `highlight.mode = "both"`, `highlight.borderWidth = 3`, `highlight.gap = 4`, `log = "inspect"`, `uppercaseMinLength = 4`, `checks.delay = 1000`
- **Do not:** modify versioned docs under `website/versioned_docs/`; touch source files; add guideline content beyond what is needed to describe each config key

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
