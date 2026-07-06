---
'@react-native-ama/core': major
'@react-native-ama/animations': major
'@react-native-ama/forms': major
'@react-native-ama/lists': major
'@react-native-ama/bottom-sheet': major
---

v2.0 release: removes `@react-native-ama/internal` (inlined into each consuming package) and retires `@react-native-ama/react-native`. Restructures `ama.config.json` — `highlight` becomes a nested object (`mode`, `borderWidth`, `gap`); `log` is removed as a standalone key; `checks` scopes feature gates and `delay`. Adds the new `@react-native-ama/bottom-sheet` package.
