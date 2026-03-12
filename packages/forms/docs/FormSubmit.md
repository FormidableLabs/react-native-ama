import { Required } from '@site/src/components';

# Form.Submit (FormSubmit)

This component provides the submit action for your button via render props.
It triggers the [Form onSubmit](./Form#-onsubmit) callback and therefore focuses on the first invalid field
if the submission fails.

## Usage

```jsx
import { Form } from '@react-native-ama/forms';

<Form.Submit>
  {({ onPress }) => <CTAPressable onPress={onPress} title="Submit" />}
</Form.Submit>;
```

## Alternative API

```jsx
import { useFormSubmit } from '@react-native-ama/forms';

const { submitForm } = useFormSubmit();
<CTAPressable onPress={submitForm} title="Submit" />;
```

`useFormSubmit` is useful when you want full control over layout and rendering with no wrapper component.

## Related guidelines

- [Forms](/guidelines/forms)
