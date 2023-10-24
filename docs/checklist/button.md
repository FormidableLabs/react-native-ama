import Button from './button.png';

# Button

**Guidelines**: [Accessibility Label](/guidelines/accessibility-label), [Accessibility Role](/guidelines/accessibility-role), [Accessibility State](/guidelines/accessibility-state)

For any component that leads to an internal screen, the _button_ [accessibility role](/guidelines/accessibility-role) should be used.

<img src={Button} className="zoom-me" />

| Screen Reader                                 | I hear                                 |
| --------------------------------------------- | -------------------------------------- |
| [Label](/guidelines/accessibility-label)      | Purpose is clear matches visible label |
| [Role](/guidelines/accessibility-role)        | button                                 |
| [State[^1]](/guidelines/accessibility-states) |                                        |
| busy                                          | busy                                   |
| expanded                                      | expanded                               |
| disabled                                      | disabled                               |
| toggled                                       | checked/ticked                         |

## Testing

### Procedures

1. Turn on a Screen Reader.
1. Move focus to the button.
1. Evaluate whether the label adequately and uniquely describes the component and clearly communicates its function.
1. Verify whether the active state is announced appropriately.

### Outcome

Ensure all the following checks are true:

- The label is clear and understandable.
- The component is announced as a "button" by the screen reader.
- Any state of the component, such as ticked, disabled, etc., is announced by the screen reader.

### Example

| VoiceOver                                      | Talkback                                       |          |
| ---------------------------------------------- | ---------------------------------------------- | -------- |
| Contact us, **button**, double tap to activate | Contact us, **button**, double tap to activate | <Good /> |

[^1]: In some cases, Talkback announces the accessibility state before the label.
