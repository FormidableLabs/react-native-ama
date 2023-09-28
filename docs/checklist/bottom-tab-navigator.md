import TabBar from './tabbar.png';

# Bottom Tab Navigator

<img src={TabBar} className="zoom-me" />

| Reads                                                      | I see                                             | I hear                                                |
| ---------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| [Selected](/guidelines/accessibility-states#aria-selected) | **Yes**: Is visually clear that the tab is active | **Yes**: The Screen Reader reads the "selected" state |
| [Label](/guidelines/accessibility-label)                   | Purpose is clear and matches visible label        | The label                                             |
| [Role](/guidelines/accessibility-role)                     |                                                   | The role: **button**                                  |
| Talkback only                                              |                                                   | _[tab index]_ of _[total]_                            |

Example:

| Voice Over          | TalkBack                                |
| ------------------- | --------------------------------------- |
| selected, Home, tab | selected, Home, tab 1 of 3              |
| Video, tab          | Video, tab 2 of 3, double-tap to select |
| User, tab           | User, tab 2 of 3, double-tap to select  |
