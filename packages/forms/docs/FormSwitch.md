# Form.Switch (FormSwitch)

Provides Switch functionality to be used in Forms, it is simply a compound component of the wrapper [FormField](./FormField.md) and controller [SwitchListItem](/react-native/SwitchListItem) combined for easy of use so you don't need to roll your own.

## Usage

```jsx {1-3, 8}
import { Form, FormSwitch } from '@react-native-ama/forms';

<Form onSubmit={handleSubmit} ref={ref}>
  <FormSwitch
    label={<Text style={styles.switchText}>I'm a switch</Text>}
    style={styles.switchListItem}
    value={isSwitchOn}
    onValueChange={toggleSwitch}
  />
</Form>;
```

## Props

FormSwitch accepts all [SwitchListItem](/react-native/SwitchListItem#Props) Props
