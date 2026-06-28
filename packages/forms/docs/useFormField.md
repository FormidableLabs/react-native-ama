import { Required } from '@site/src/components'

# useFormField

A hook for building custom focusable fields that integrate with the [`<Form />`](./Form.md) provider. Registers the field's ref with the form and provides helpers for focus chain navigation.

:::note

The [`FormField`](./FormField.md) component already uses this hook internally. Use `useFormField` directly only when building a fully custom field component.

:::

:::warning

Make sure the custom component is focusable by the screen reader when the user taps the keyboard **next** button.

:::

## Usage

```js
import { useFormField } from '@react-native-ama/forms';

const { focusNextFormField, isLastField, accessibilityHint } = useFormField({
  ref,
  hasFocusCallback: true,
  hasValidation: true,
  hasError: false,
});
```

## Parameters

### <Required /> `ref`

The ref of the focusable component that this field wraps.

| Type |
| ---- |
| `React.RefObject<any>` \| `React.ForwardedRef<any>` |

### <Required /> `hasFocusCallback`

Whether the component has a `.focus()` method (e.g. a `TextInput`). When `true`, the hook calls `.focus()` to move keyboard focus; when `false`, it uses the screen-reader `setFocus` helper instead.

| Type |
| ---- |
| boolean |

### <Required /> `hasValidation`

Whether the field participates in form validation. When `true`, the field is considered when `focusFirstInvalidField` is called on form submit failure.

| Type |
| ---- |
| boolean |

### `id`

An optional string ID used to identify this field for the `nextFieldId` prop on other fields.

| Type | Default |
| ---- | ------- |
| string | undefined |

### `nextFieldId`

The ID of the field to focus when the user taps **next**. Overrides the default sequential order.

| Type | Default |
| ---- | ------- |
| string | undefined |

### `nextFormFieldRef`

A ref pointing to the next field to focus. Takes precedence over `nextFieldId`.

| Type | Default |
| ---- | ------- |
| `React.RefObject<any>` | undefined |

### `hasError`

When `true`, this field is treated as having a validation error and will be focused by `focusFirstInvalidField`.

| Type | Default |
| ---- | ------- |
| boolean | undefined |

### `errorMessage`

The error text to append to the field's `accessibilityHint` when `hasError` is `true`.

| Type | Default |
| ---- | ------- |
| string | undefined |

### `accessibilityHint`

A base accessibility hint for the field. The `errorMessage` is appended to this value when present.

| Type | Default |
| ---- | ------- |
| string | undefined |

### `editable`

Whether the field is editable. Non-editable fields are skipped by `focusFirstInvalidField`.

| Type | Default |
| ---- | ------- |
| boolean | `true` |

### `suppressError`

When `true`, suppresses the console error thrown if the hook is used outside a `<Form />` provider. Useful for optional form integration.

| Type | Default |
| ---- | ------- |
| boolean | undefined |

## Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| `focusNextFormField` | `() => void` | Focuses the next field in the form, or submits the form if this is the last field |
| `isLastField` | `() => boolean` | Returns `true` if this is the last registered field in the form |
| `accessibilityHint` | `string` | Combined accessibility hint: `accessibilityHint` + `errorMessage` joined by `","` |

## Related guidelines

- [Forms](/guidelines/forms)
