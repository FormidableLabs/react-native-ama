# Phase Brief — react-native-ama — Phase 12

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

Two isolated housekeeping issues are degrading the dev and build experience: TypeScript config errors flagged across packages, and broken links surfacing when the website builds. Both are quick, self-contained fixes worth clearing before they compound with future work.

## Phase Goal

Every package type-checks cleanly and the website builds with no errors.

## Phase Scope

- Every package's TypeScript type-checking passes with zero errors — not limited to the 17 currently-known config errors; whatever the check reports gets fixed.
- The website build completes with zero errors, including no broken links.

## Not This Phase

- Restoring RN "yellow box" warning suppression in the playground — separate backlog item, deferred to a future phase.
- Expanding or hardening the existing broken-link build check beyond what's needed to get a clean build today.
- New lint rules or type-checking conventions beyond fixing what currently fails.

## Exit Criteria

1. Type-checking
   - Run type-checking across every package: completes with zero config or type errors
2. Website build
   - Run the website build: completes with zero errors, no broken links reported

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| The website build's current errors are all broken-link related. | If other, unrelated build errors exist, the phase scope grows beyond link fixes to whatever else the build reports. |
| Fixing the 17 known tsconfig errors does not surface a large additional set of type errors previously masked by broken configs. | If it does, the phase's type-checking work is heavier than the known 17 errors suggest. |

## Acknowledged Risks

- The known tsconfig error count (17) was captured once; the actual fix count may differ once corrections are underway.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
