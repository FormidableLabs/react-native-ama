---
displayed_sidebar: checklist
---

import TabBar from './tabbar.png';

# Bottom Tab Navigator

<img src={TabBar} className="zoom-me" />

| Tab item                                                   | I see                                             | I hear                                                |
| ---------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| [Selected](/guidelines/accessibility-states#aria-selected) | **Yes**: Is visually clear that the tab is active | **Yes**: The Screen Reader reads the "selected" state |
| [Label](/guidelines/accessibility-label)                   |                                                   | Purpose is clear and matches visible label            |
| [Role](/guidelines/accessibility-role)                     |                                                   | The role: **tab**                                     |
| Talkback[^1]                                               |                                                   | _[tab index]_ of _[total]_                            |

## Testing

### Procedures

1. Turn on a Screen Reader.
1. Move focus to the Tab navigator.
1. Evaluate whether the label adequately and uniquely describes the component and clearly communicates its function.
1. Verify whether the active state is announced appropriately.

### Outcome

Ensure all the following checks are true:

- The label is clear and understandable.
- The component is announced as a "tab" by the screen reader.
- The selected tab is announced as "Selected" by the screen reader.

### Example

| Voice Over          | TalkBack                                |
| ------------------- | --------------------------------------- |
| selected, Home, tab | selected, Home, tab 1 of 3              |
| Video, tab          | Video, tab 2 of 3, double-tap to select |
| User, tab           | User, tab 2 of 3, double-tap to select  |

- [^1]: This behaviour is inherent only to Android.
