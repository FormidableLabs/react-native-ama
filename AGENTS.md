# AGENTS.md

This project uses **Mano** for planning. Mano is a structured thinking tool — it produces planning artifacts, not code.

## For coding agents

### Implementing a story

1. Find the active phase: highest numbered `phase-[N]/` folder in `_mano_output/`.
2. Check `_mano_output/phase-[N]/stories/README.md` for the story index and status.
3. Read the story file. It's self-contained — the Implementation Reference section lists which project rules apply by name.
4. If you need to look up a referenced rule, it's in `_mano_output/project-rules.md`.
5. After implementing, update the story's status to `done` in the stories README.md.

### Do not

- Modify files in `_mano/` or `_mano/templates/` — these are framework files.
- Interpret `mano` commands (e.g. `mano start`, `mano review`) as implementation instructions — these are planning commands.
- Create tracking files like `progress.md` — Mano uses the filesystem for state.

## Project structure

```
_mano/                    ← Mano framework (do not modify)
_mano_output/             ← Planning artifacts
├── project-rules.md      ← Rules for implementation (referenced by stories)
├── tech-spec.md          ← Technical decisions
├── ux-flow.md            ← Screen and navigation definitions
├── design-brief.md       ← Visual language
├── backlog.md            ← Future work and deferred items
├── reviews.md            ← Sprint review history (human-only)
└── phase-[N]/            ← Per-phase work
    ├── phase-brief.md    ← Phase scope and goals
    └── stories/          ← Implementation stories (start here)
```