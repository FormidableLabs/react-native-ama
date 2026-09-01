### [STORY-20]: BottomSheet component link fixes

#### What and why
A developer reading the BottomSheet component docs can follow its links to the bottomsheet guideline and land on the referenced sections, rather than hitting a broken anchor.

#### Done when
- [ ] `packages/bottom-sheet/docs/components/BottomSheet.md` contains no broken anchor links to the bottomsheet guideline page

#### Not this story
- `website/guidelines/bottomsheet.md` — that is story 6, which must run first
- Other component docs pages

#### Notes
Depends on story 6 (bottomsheet guideline cleanup). The target anchor IDs on the guideline page must be stable before this story runs. Check the anchors confirmed in story 6 before updating links here.

#### Implementation Reference
- **Files:** `packages/bottom-sheet/docs/components/BottomSheet.md`
- **Fix:** links currently targeting `/guidelines/bottomsheet#2-can-be-dismissed` and `/guidelines/bottomsheet#3-the-focus-stays-inside-it` — after story 6 is done, use the actual anchor IDs present on the guideline page and update these links to match
- **Do not:** do not edit `website/guidelines/bottomsheet.md` — that is story 6; do not edit other component docs pages

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
