import FormSelected from './form-selected.png';
import FormFocused from './form-focused.png';
import FormDisabled from './form-disabled.png';

# Form

**Guideline**: [Forms](/guidelines/forms)

## Text Input

### Selected[^1]

<img src={FormSelected} className="zoom-me" />

| State  | I see     | I hear                       |
| ------ | --------- | ---------------------------- |
| Normal | The Label | The label and the input type |

### Focused

<img src={FormFocused} className="zoom-me"  />

| State   | I see     | I hear                                          |
| ------- | --------- | ----------------------------------------------- |
| Focused | The Label | The label and the input type                    |
| Filled  | The Label | The label, the value entered and the input type |

### Disabled/Read only

<img src={FormDisabled} className="zoom-me" />

| State              | I see     | I hear                                          |
| ------------------ | --------- | ----------------------------------------------- |
| Disabled/Read only | The Label | The label, the value, input type and "disabled" |

## Validation

| Validation | I can                                                                                       |
| :--------- | ------------------------------------------------------------------------------------------- |
| Succesfull | Move to the next field using the "Next" keyboard button.                                    |
| Succesful  | Submit the form using the "Done" keyboard button.                                           |
| Invalid    | Move to the next field using the "Next" keyboard button. I MUST not be trapped on the field |
| Invalid    | Submit the form using the "Done" keyboard button.                                           |

- [^1]: The "selected state" indicates that a Screen Reader user has focused on the field but has not initiated any action yet.

## Testing

### Procedures

1. Turn on a Screen Reader.
1. Focus the text input.
1. Evaluate whether the label adequately and uniquely describes the component.
1. Verify whether the active state is announced appropriately.

### Outcome

Ensure all the following checks are true:

- The label is clear and understandable.
- The component is announced as a "button" by the screen reader.
- Any state of the component, such as ticked, disabled, etc., is announced by the screen reader.
