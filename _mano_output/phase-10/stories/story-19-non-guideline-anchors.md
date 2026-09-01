### [STORY-19]: Non-guideline broken anchor fixes

#### What and why
A developer following links on the AnimatedContainer, useReanimatedAnimationBuilder, and core overview pages reaches a valid section instead of hitting a broken anchor, so the documentation is navigable throughout.

#### Done when
- [ ] `packages/animations/docs/components/AnimatedContainer.md` contains no link targeting a `#from` anchor that does not exist on the page
- [ ] `packages/animations/docs/hooks/useReanimatedAnimationBuilder.md` contains no link targeting a `#from` anchor that does not exist on the page
- [ ] `packages/core/docs/core.md` contains no link to `#monorepo-options` that resolves to a missing anchor on the config-file page

#### Not this story
- Guidelines pages under `website/guidelines/`
- The BottomSheet component docs page — that is story 20
- Broken anchors on 0.7.x versioned pages

#### Implementation Reference
- **Files:** `packages/animations/docs/components/AnimatedContainer.md`; `packages/animations/docs/hooks/useReanimatedAnimationBuilder.md`; `packages/core/docs/core.md`
- **AnimatedContainer and useReanimatedAnimationBuilder:** find links targeting `#from`; if the anchor no longer exists on those pages, remove the link or update it to point to the correct section
- **core/:** the link to `/docs/config-file#monorepo-options` — check `website/docs/ama/config-file.md` to determine whether a `#monorepo-options` anchor exists; update the link to a valid anchor or remove the anchor fragment if no matching section exists
- **Do not:** do not edit `website/guidelines/`; do not edit `packages/bottom-sheet/docs/components/BottomSheet.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
