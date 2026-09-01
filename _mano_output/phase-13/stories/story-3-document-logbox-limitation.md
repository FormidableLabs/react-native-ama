### STORY-3: Document the LogBox limitation

#### What and why

Every consumer currently hits the same confusing moment: AMA reports accessibility issues on React Native's own LogBox/YellowBox overlay — UI the consumer didn't write and can't fix. Today there's no explanation anywhere, so each person has to figure out on their own that it's expected and not a bug in their code. This story documents it plainly so nobody has to rediscover it.

#### Done when

- [ ] The root `README.md`'s "Runtime Dev Tooling (Accessibility Checks)" section includes a subsection explaining that AMA may report accessibility issues originating from React Native's own LogBox/YellowBox overlay, that this is a known limitation (not a bug in the consumer's code), and that these findings can be dismissed

#### Not this story

- Any code-level detection or exclusion of LogBox from AMA's checks — investigated and rejected, see `tech-spec.md` § "React Native LogBox is not excluded from checks"
- Removing or changing the playground's existing LogBox-disabling workaround — left as-is
- The two regression fixes — stories 1 and 2

#### Notes

Content is fully specified below — no need to consult the tech spec for wording, only for the "why" if curious.

#### Implementation Reference

- **Files:** `README.md` — new `### Known limitation: React Native LogBox` subsection under `## Runtime Dev Tooling (Accessibility Checks)`, placed after the existing `### How it works` subsection
- **Content (inline verbatim, adjust only for surrounding markdown flow):**
  ```markdown
  ### Known limitation: React Native LogBox

  AMA may report accessibility issues that originate from React Native's own LogBox/YellowBox overlay (the in-app warning and error UI), not from your own components. LogBox isn't built to AMA's accessibility standards, and there's no way for your code to fix it.

  If you see an issue pointing at LogBox's own UI, it's expected — dismiss it. This is a known limitation, not a bug in your app.
  ```

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
