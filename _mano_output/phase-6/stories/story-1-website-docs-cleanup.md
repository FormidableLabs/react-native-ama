### STORY-1: Website docs — remove stale internal references

#### What and why
A developer integrating AMA v2 reads the getting-started or config-file docs and finds instructions pointing to `@react-native-ama/internal` — a package that no longer exists. Removing those references means the docs reflect what v2 actually ships, so developers can follow them without hitting dead ends.

#### Done when
- [ ] `website/docs/ama/getting-started.md`: no mention of `@react-native-ama/internal` (jest mock example referencing that package is removed or replaced)
- [ ] `website/docs/ama/getting-started.md`: no install step for `@react-native-ama/react-native`
- [ ] `website/docs/ama/config-file.md`: no instruction to symlink or copy `ama.config.json` from `node_modules/@react-native-ama/internal`
- [ ] `website/docs/ama/config-file.md`: no reference to `node_modules/@react-native-ama/internal` in any shell command or prose
- [ ] Both files read coherently after the removals — no orphaned sentences or broken code blocks

#### Not this story
- Writing new migration documentation (that is stories 2 and 3)
- Changing any other website files beyond the two listed above
- Fixing any other stale references elsewhere in the website

#### Notes
Stale content located at:
- `website/docs/ama/getting-started.md` line 14 (install step) and lines 61–66 (jest mock example)
- `website/docs/ama/config-file.md` lines 68, 79, 89, 92, 97 (symlink/copy instructions referencing `@react-native-ama/internal`)

When removing the jest mock example, check whether surrounding context (the error message at line 61) still makes sense without it — trim as needed so the section reads cleanly.

#### Implementation Reference
- **Files:** `website/docs/ama/getting-started.md`; `website/docs/ama/config-file.md`
- **Do not:** touch any other files in `website/`; do not rewrite sections beyond what is needed to remove the stale content

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
