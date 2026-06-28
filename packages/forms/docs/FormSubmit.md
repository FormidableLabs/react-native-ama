import { Required } from '@site/src/components';

# Form.Submit (FormSubmit)

This component provides the submit action for your button via render props.
It triggers the [Form onSubmit](./Form#-onsubmit) callback and, if the submission fails, automatically focuses the first invalid field.

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

## Props

### <Required /> `children`

A render prop that receives `FormSubmitRenderProps` and returns a React node.

| Type |
| ---- |
| `(props: FormSubmitRenderProps) => React.ReactNode` |

#### `FormSubmitRenderProps`

| Property | Type | Description |
| -------- | ---- | ----------- |
| `onPress` | `() => Promise<void>` | Call this to submit the form. Triggers `onSubmit` and focuses the first invalid field on failure. |

## Methods

None — this component exposes no imperative methods.

## Related guidelines

- [Forms](/guidelines/forms)
