import Button from './buttons.png';

# Button

For any component that leads to an internal screen, the _button_ [accessibility role](/guidelines/accessibility-role) should be used.

## Focus: When I focus the component

<img src={Button} className="zoom-me" />

| Reads                                    | I see / hear                               |
| ---------------------------------------- | ------------------------------------------ |
| [Label](/guidelines/accessibility-label) | Purpose is clear and matches visible label |
| [Role](/guidelines/accessibility-role)   | Identifies the type of button              |
| [State](/guidelines/accessibility-state) | Express its state, i.e. ticked, disabled   |

### Example

| VoiceOver                                  | Talkback                                   |          |
| ------------------------------------------ | ------------------------------------------ | -------- |
| Contact us, button, double tap to activate | Contact us, button, double tap to activate | <Good /> |
