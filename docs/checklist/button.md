import Button from './buttons.png';

# Button

For any component that leads to an internal screen, the _button_ [accessibility role](/guidelines/accessibility-role) should be used.

<img src={Button} className="zoom-me" />

| Reads                                        | I see                                      | I hear                                   |
| -------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| [Label](/guidelines/accessibility-label)     | Purpose is clear and matches visible label | The label                                |
| [Role](/guidelines/accessibility-role)       |                                            | button                                   |
| [State[^1]](/guidelines/accessibility-state) |                                            | Express its state, i.e. ticked, disabled |

### Example

| VoiceOver                                  | Talkback                                   |          |
| ------------------------------------------ | ------------------------------------------ | -------- |
| Contact us, button, double tap to activate | Contact us, button, double tap to activate | <Good /> |

[^1]: In some cases, Talkback announces the accessibility state before the label.
