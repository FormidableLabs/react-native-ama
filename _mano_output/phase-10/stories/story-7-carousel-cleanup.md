### [STORY-7]: Carousel guideline cleanup

#### What and why
A developer reading the carousel guideline finds accurate content without stale package references, and can see whether any AMA rule enforces carousel accessibility at runtime.

#### Done when
- [ ] `website/guidelines/carousel.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] If any AMA runtime rule applies to carousel accessibility, an AMA errors section lists those error codes; if no applicable rule exists in the current rule set, the section is omitted

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/carousel.md`
- **AMA errors:** no carousel-specific error code exists in the current rule set; check AMA rule constants and add a section only if an applicable rule is found
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
