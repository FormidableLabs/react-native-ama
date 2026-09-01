### STORY-6: Bump all active packages to 2.0.0-beta.1

#### What and why
All active packages are at mixed versions, making the release untestable as a set. After this story, every active package is at `2.0.0-beta.1` and inter-package peer ranges use `~2.0.0`, making the beta installable and testable together before a stable cut.

#### Done when
- [ ] `packages/core/package.json` version is `2.0.0-beta.1`.
- [ ] `packages/animations/package.json` version is `2.0.0-beta.1`.
- [ ] `packages/forms/package.json` version is `2.0.0-beta.1`.
- [ ] `packages/lists/package.json` version is `2.0.0-beta.1`.
- [ ] `packages/bottom-sheet/package.json` version is `2.0.0-beta.1`.
- [ ] All inter-package peer dependency references use `~2.0.0` (not a specific pre-release tag).
- [ ] `packages/react-native-delete-me/package.json` version is unchanged.
- [ ] `yarn install` completes without peer dependency conflicts after the bump.

#### Not this story
- No changelog entries or changeset files — version bump only.
- No npm publish.
- No changes to `react-native-delete-me`.

#### Notes
`bottom-sheet` is currently at `2.0.0` — this story moves it to `2.0.0-beta.1`, which is a semver pre-release regression. Consumers pinning `^2.0.0` will not pick up the beta automatically. This is accepted per the phase brief. Peer ranges use `~2.0.0` so both `2.0.0-beta.1` and a future stable `2.0.0` satisfy them.

#### Implementation Reference
- **Files:** `packages/core/package.json`, `packages/animations/package.json`, `packages/forms/package.json`, `packages/lists/package.json`, `packages/bottom-sheet/package.json` — update `version` field to `2.0.0-beta.1` and any `peerDependencies` referencing sibling packages to `~2.0.0`
- **Do not:** do not touch `packages/react-native-delete-me/package.json`; do not run `yarn changeset` or create changeset files; do not publish to npm

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
