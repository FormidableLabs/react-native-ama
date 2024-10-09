import { Required } from '@site/src/components';

# SwitchListItem

It is a utility component that provides a list item with a customizable label and switch control [focused on accessibility](#accessibility).

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
- uses the label text as `accessibilityLabel`

## Props

### <Required /> `labelComponent`

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

### <Required /> `value`

The switch state

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

### `onValueChange`

The callback to call when the list item is toggled

## Customisation

By default, the component uses the [React Native switch](https://reactnative.dev/docs/switch), but this behavior can be overridden by passing a child component:

```jsx
<SwitchListItem
  labelComponent={<Text style={styles.switchText}>I'm a switch</Text>}
  style={styles.switchListItem}
  value={isSwitchOn}
  onValueChange={toggleSwitch}>
  <CustomSwitch value={isSwitchOn} onValueChange={toggleSwitch} />
</SwitchListItem>
```

In this case, the custom `CustomSwitch` component is used instead of the React Native one.

:::note

The `SwitchListItem` component, to avoid the switch being individually focusable on Android, the component automatically sets the following properties for all the children:

- `accessibilityElementsHidden={true}`
- `importantForAccessibility="no"`

:::

## Related guidelines

- [Forms](../guidelines/forms)
