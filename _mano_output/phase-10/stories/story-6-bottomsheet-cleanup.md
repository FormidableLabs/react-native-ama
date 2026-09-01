### [STORY-6]: Bottom sheet guideline cleanup

#### What and why
A developer reading the bottom sheet guideline finds accurate content without stale package references, and the sections describing dismissal and focus behaviour have stable anchor IDs so the BottomSheet component docs can link to them.

#### Done when
- [ ] `website/guidelines/bottomsheet.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] If `NO_KEYBOARD_TRAP` applies to the guideline's content about focus staying inside the sheet, an AMA errors section lists it; otherwise the section is omitted
- [ ] The sections describing "can be dismissed" and "focus stays inside it" behaviour have anchor IDs that the BottomSheet component docs page can link to (story 20 depends on these anchors existing after this story runs)

#### Not this story
- `packages/bottom-sheet/docs/components/BottomSheet.md` — that is story 20
- Other guideline pages

#### Notes
Story 20 (BottomSheet component link fixes) depends on this story. After implementing, note the actual anchor IDs used for the "can be dismissed" and "focus stays inside it" sections so story 20 can reference them correctly.

#### Implementation Reference
- **Files:** `website/guidelines/bottomsheet.md`
- **AMA errors:** check whether `NO_KEYBOARD_TRAP` applies to the guideline's focus-trapping content; add the section only if applicable
- **Anchor dependency:** story 20 will update links in `packages/bottom-sheet/docs/components/BottomSheet.md` that point to this page — confirm the anchor IDs for the "can be dismissed" and "focus stays inside it" sections are present and stable after your edits
- **Do not:** do not edit `packages/bottom-sheet/docs/` — those are story 20

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
