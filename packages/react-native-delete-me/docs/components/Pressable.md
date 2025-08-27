# Pressable

The Pressable component is an enhancement of the [React Native Pressable](https://reactnative.dev/docs/pressable) component, with a [focus on improving accessibility](#accessibility-improvements).

```tsx
import { Pressable } from 'react-native-ama';

<Pressable accessibilityRole="button" accessibilityLabel="I'm pressable!">
  <Text>I'm pressable</Text>
</Pressable>;
```

## Accessibility improvements <DevOnly />

In comparison to the default React Native component, this customized component:

- Forces the use of `accessibilityRole` and `accessibilityLabel`
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as a property
- Performs a [Minimum Size](/guidelines/minimum-size) check
- Performs a [contrast checker](/guidelines/contrast) between its background color and its children color

<DevOnlyChecks />

### accessibilityRole

The `accessibilityRole` property is used by the screen reader to announce the kind of element focused on. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check the accessibility role guidelines for more info.](/guidelines/accessibility-role)

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check the accessibility label guidelines for more info.](/guidelines/accessibility-label)

### aria-busy

Indicates an element is being modified and that assistive technologies may want to wait until the changes are complete before informing the user about the update.[^1]

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### aria-checked

Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes.

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

### aria-disabled

Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### aria-expanded

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### aria-selected

Indicates whether a selectable element is currently selected or not.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### Contrast checker <DevOnly />

The component performs a [contrast check](/guidelines/contrast) between its background colour and the children's foreground when in dev mode.

:::info
AMA does also perform a contrast check on disabled button, as a [poor contrast can make them hard to read](https://axesslab.com/disabled-buttons-suck/#they-are-hard-to-see).
:::

### Minimum size <DevOnly />

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](/guidelines/minimum-size).

## Related guidelines

- [Accessibility Label](/guidelines/accessibility-label)
- [Accessibility Role](/guidelines/accessibility-role)
- [Accessibility States](/guidelines/accessibility-states)
- [Contrast](/guidelines/contrast)
- [Minimum Size](/guidelines/minimum-size)

## External resources

- [Disabled buttons suck](https://axesslab.com/disabled-buttons-suck/)

[^1]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy
