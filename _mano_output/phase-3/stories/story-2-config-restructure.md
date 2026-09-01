### STORY-2: Config structure v2.0

#### What and why
A developer configuring AMA sees a flat mix of visual settings, feature gates, and tuning parameters in `ama.config.json` with no logical grouping. After this story, visual feedback settings live under `highlight` (as a nested object) and check feature gates live under `checks`, making the config self-explanatory at a glance.

#### Done when
- [ ] `highlight` in `ama.config.json` is a nested object with `mode`, `borderWidth`, and `gap` keys — not a plain string.
- [ ] `checks` contains only `ui`, `forms`, `grouping`, and `delay` — `borderWidth` and `gap` are no longer under `checks`.
- [ ] AMA reads `highlight.mode` and applies the correct visual mode at runtime (border, background, or both).
- [ ] AMA reads `highlight.borderWidth` and `highlight.gap` and applies them to the debug overlay visual.
- [ ] An existing consumer config that omits `highlight` entirely continues to use default visual settings without errors.
- [ ] The TypeScript type `AmaProjectConfig` in `packages/core/src/internals/config.ts` matches the new shape.

#### Not this story
- No changes to `checks.*` keys other than removing `borderWidth` and `gap`.
- No migration shim or backwards-compat layer for consumers using the old flat `"highlight": "border"` string — v2.0 is a breaking change.
- No changes to how `rules` or `accessibilityLabelExceptions` are read.
- No docs updates.

#### Notes
The flat `"highlight": "border"` string (v1.x) becomes `"highlight": { "mode": "border" }` (v2.0). Consumers on v1.x configs will receive a runtime type mismatch if they have a `highlight` key — this is accepted as a breaking change for v2.0. Consumers with no `highlight` key are unaffected.

#### Implementation Reference
- **Files:** `packages/core/src/internals/config.ts` — update `AmaProjectConfig` type and default config loading; `packages/core/ama.config.json` — update default config shape
- **Contract:** new `AmaProjectConfig` shape:
  ```ts
  highlight: {
    mode: 'border' | 'background' | 'both';
    borderWidth?: number;
    gap?: number;
  };
  checks: {
    ui: boolean;
    forms: boolean;
    grouping: boolean;
    delay: number;
  };
  ```
- **Data:** update the package default `ama.config.json` to use `"highlight": { "mode": "border" }` and move `borderWidth`/`gap` under `highlight`; remove them from `checks`
- **Do not:** do not add a migration shim that accepts the old flat `"highlight": "border"` string; do not add backwards-compat runtime branches for v1.x config shape

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
