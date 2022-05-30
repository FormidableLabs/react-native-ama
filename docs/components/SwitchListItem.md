# SwitchListItem

It is a utility component that provides a list item with a customisable label and switch control [focused on accessibility](#accessibility).

## Usage

```jsx
<SwitchListItem
  label={
    <Text style={styles.switchText}>I'm a switch</Text>
  }
  style={styles.switchListItem}
  value={isSwitchOn}
  onValueChange={toggleSwitch}
>
    {...}
</SwitchListItem>
```

## Accessibility

The component:

- is announced as a "switch"
- handles the `accessibilityState` **checked**
- user the label text as `accessibilityLabel`

## Props

### `label`

The custom label to use for the component.

| Type        | Default   |
| ----------- | --------- |
| JSX.Element | undefined |

If no accessibilityLabel is provided, the component children are used to generate the one.

### `labelPosition`

The position where to render the `label`, left or right of the switch.

| Type              | Default |
| ----------------- | ------- |
| 'left' \| 'right' | 'left'  |

### `value`

The switch state

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

### `onValueChange`

The callback to call when the list item is toggled

## Customisation

By default, the component uses the [React Native switch](https://reactnative.dev/docs/switch) component if no child is passed.

```jsx
<SwitchListItem
  label={<Text style={styles.switchText}>I'm a switch</Text>}
  style={styles.switchListItem}
  value={isSwitchOn}
  onValueChange={toggleSwitch}>
  <FancySwitch value={isSwitchOn} onValueChange={toggleSwitch} />
</SwitchListItem>
```

In this case, a custom `FancySwitch` component is used instead of the React Native one.

:::note

When using the default Switch, the components automatically set this two props:

- `accessibilityElementsHidden={true}`
- `importantForAccessibility="no"`

To avoid the switch being individually focusable on Android.

:::
