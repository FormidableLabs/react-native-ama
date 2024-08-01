import { Required } from '@site/src/components';

# Form

The `<Form />` component provides a "local" context for the [`TextInput`](./TextInput.mdx), [`FormField`](./FormField.md) and [`SwitchListItem`](./SwitchListItem.md) components.

The provider hosts the `ref` values used by the [TextInput](./TextInput.mdx) to know which [`returnKey`](./TextInput.mdx#returnkeytype) and what would be the next field to focus.

## Usage

```jsx
<Form onSubmit={handleSubmit} ref={ref}>
  {...}
</Form>
```

## Example

```jsx
import { Form, TextInput } from '@react-native-ama/forms';
import { SwitchListItem } from '@react-native-ama/react-native';

const ExampleForm = () => {
  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        onChangeText={newText => setFirstName(newText)}
        defaultValue={text}
        label={<Text>First name:</Text>}
      />

      <TextInput
        onChangeText={newText => setLastName(newText)}
        defaultValue={text}
        label={<Text>Last name:</Text>}
      />

      <SwitchListItem
        label={<Text>Subscribe me to the newsletter</Text>}
        value={isSubscribed}
        onValueChange={toggleSwitch}
      />

      <TextInput
        onChangeText={newText => setEmailAddress(newText)}
        defaultValue={text}
        label={<Text>Email address:</Text>}
      />
      <FormSubmit accessibilityLabel="Submit">
        <CustomSubmitButton />
      </FormSubmit>
    </Form>
  );
};
```

When the user interacts with this form:

- The _First Name_ field has `returnKeyType="next"` and focuses the `Last name` one when the next button is pressed
- The _Last name_ has `returnKeyType="next"` and focuses the `Subscribe me to the newsletter` switch when the next button is pressed
- The SwitchListItem does not show any keyboard, but swiping right will focus the email address field
- The _Email address_ has `returnKeyType="done"` as is the last field of the form and triggers the `onSubmit` callback when the done button is pressed

## Conditional fields

The field refs are added to the ref in the same order they are added to the DOM, so in the previous example, the order will be:

1. TextInput - First name
1. TextInput - Last name
1. SwitchListItem
1. TextInput - Email address

This all works fine, but the logic will fail when a component is rendered conditionally as refs are appended to the array, so this edge case needs to be handled manually.

### Won't work

```jsx
<Form onSubmit={handleSubmit}>
  <TextInput
    onChangeText={newText => setFirstName(newText)}
    defaultValue={text}
    label={<Text>First name:</Text>}
  />

  <SwitchListItem
    label={<Text>Show last name</Text>}
    value={isLastNameVisible}
    onValueChange={toggleLastName}
  />

  {isLastNameVisible ? (
    <TextInput
      onChangeText={newText => setLastName(newText)}
      defaultValue={text}
      label={<Text>Last name:</Text>}
    />
  ) : null}

  <TextInput
    onChangeText={newText => setEmailAddress(newText)}
    defaultValue={text}
    label={<Text>Email address:</Text>}
  />
</Form>
```

`Last name` is conditionally rendered when the `Show last name` switch is on and will use the `returnKeyType="done"` as its last element on the ref list.

:::note

`Email address` will always be `returnKeyType="done"` as its value is decided when the component is mounted and doesn't change with next re-render

:::

### Let's fix it

To fix the problem, we can manually tell the `TextInput` the return key to display and the ID or ref of the next element to be focused:

#### 1. Specifying the ID

```jsx
<Form onSubmit={handleSubmit}>
  <TextInput
    onChangeText={newText => setFirstName(newText)}
    defaultValue={text}
    label={<Text>First name:</Text>}
  />

  <SwitchListItem
    label={<Text>Show last name</Text>}
    value={isLastNameVisible}
    onValueChange={toggleLastName}
  />

  {isLastNameVisible ? (
    <TextInput
      onChangeText={newText => setLastName(newText)}
      defaultValue={text}
      label={<Text>Last name:</Text>}
      returnKeyType="next"
      nextFieldId="email-field" // The next field ID to be focused
    />
  ) : null}

  <TextInput
    onChangeText={newText => setEmailAddress(newText)}
    defaultValue={text}
    label={<Text>Email address:</Text>}
    id="email-field" // The field ID
  />
</Form>
```

#### 2. Specifying the ref

```jsx
const emailRef = React.useRef(null);

<Form onSubmit={handleSubmit}>
  <TextInput
    onChangeText={newText => setFirstName(newText)}
    defaultValue={text}
    label={<Text>First name:</Text>}
  />

  <SwitchListItem
    label={<Text>Show last name</Text>}
    value={isLastNameVisible}
    onValueChange={toggleLastName}
  />

  {isLastNameVisible ? (
    <TextInput
      onChangeText={newText => setLastName(newText)}
      defaultValue={text}
      label={<Text>Last name:</Text>}
      returnKeyType="next"
      nextFormField={emailRef}
    />
  ) : null}

  <TextInput
    onChangeText={newText => setEmailAddress(newText)}
    defaultValue={text}
    label={<Text>Email address:</Text>}
    ref={emailRef}
  />
</Form>;
```

## Props

### <Required /> `onSubmit`

The callback to be called when the [`TextInput`](./TextInput.mdx) `returnKeyboardType` is **done**.

| Type     |
| -------- |
| callback |

## Methods

### `focusFirstInvalidField`

This method lets you manually shift the focus to the first field that has an error.

```
// To manually focus the first invalid field
const focusInvalidField = () => {
    ref.current?.focusFirstInvalidField()
}

<Form onSubmit={handleSubmit} ref={ref}>
    <Pressable onPress={focusInvalidField} />
</Form>
```

## Related guidelines

- [Forms](../guidelines/forms)
