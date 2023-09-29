# Form

## Text Input

| State              | I see     | I hear                                          |
| ------------------ | --------- | ----------------------------------------------- |
| Normal             | The Label | The label and the input type                    |
| Focused            | The Label | The label and the input type                    |
| Filled             | The Label | The label, the value entered and the input type |
| Disabled/Read only | The Label | The label, the value, input type and "disabled" |

### Editing

| Validation | Last editable field? | I can                                                                                       |
| :--------- | -------------------- | ------------------------------------------------------------------------------------------- |
| Succesfull | No                   | Move to the next field using the "Next" keyboard button.                                    |
| Succesful  | Yes                  | Submit the form using the "Done" keyboard button.                                           |
| Invalid    | No                   | Move to the next field using the "Next" keyboard button. I MUST not be trapped on the field |
| Invalid    | Yes                  | Submit the form using the "Done" keyboard button.                                           |
