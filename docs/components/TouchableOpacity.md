import { DevOnly } from '@site/src/components';

# TouchableOpacity

TouchableOpacity is an extension of the React Native [TouchableOpacity](https://reactnative.dev/docs/touchableopacity) component, [focused on accessibility](#accessibility-improvements).

```tsx
import { TouchableOpacity } from 'react-native-ama';

<TouchableOpacity accessibilityRole="button" accessibilityLabel="I'm pressable!">
    <Text>I'm pressable</Text>
</TouchableOpacity>;
```

## Accessibility improvements

Compared to the default React Native component, this custom component:

- Forces the use of `accessibilityRole` and `accessibilityLabel` <DevOnly />
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as a property
- Performs a [contrast checker](../guidelines/contrast.md) between its background color and its children color <DevOnly />

### accessibilityRole

The `accessibilityRole` property is used by the screen reader to announce the kind of element focused on. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](../guidelines/accessibility-role.md)

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus; then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the element is triggered.

[Check here for more info](../guidelines/accessibility-label.md)

### Accessibility states

The default `accessibilityState` property does accept an object like:

```js
accessibilityState={{
    busy: boolean;
    checked: boolean | 'mixed';
    selected: boolean;
    expanded: boolean;
}}
```

To simply the syntax, the custom component allows passing those states as property for the component, handling the generation of the object under the hood.

### Contrast checker

The component performs a [contrast check](../guidelines/contrast.md) between its background colour and the children's foreground when in dev mode.

:::note
AMA performs the check on both pressed and non-pressed states when passing a function as style.
:::

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](../guidelines/minimum-size.md).

## Additional Props

### `busy`

Indicates whether an element is currently busy or not.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

#### Example

```tsx
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity, Text } from 'react-native-ama';

const Test = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const doSometing = async () => {
        setIsLoading(true);

        await slowCall();

        setIsLoading(true);
    };

    return (
        <TouchableOpacity
            accessiblityRole="button"
            accessibilityLabel="Do it"
            busy={isLoading}
            onPress={doSometing}>
            {isLoading ? <ActivityIndicator /> : <Text>Do it</Text>}
        </TouchableOpacity>
    );
};
```

### `checked`

Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes.

| Type               | Default   | Required |
| ------------------ | --------- | -------- |
| boolean or 'mixed' | undefined | No       |

### `selected`

Indicates whether a selectable element is currently selected or not.

| Type    | Default   | Required |
| ------- | --------- | -------- |
| boolean | undefined | No       |

### `expanded`

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default   | Required |
| ------- | --------- | -------- |
| boolean | undefined | No       |

#### Example

```tsx
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity, Text } from 'react-native-ama';

const Test = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <>
            <TouchableOpacity
                accessiblityRole="button"
                accessibilityLabel={isExpanded ? 'Less' : 'More'}
                expanded={isExpanded}
                onPress={() => setIsExpanded(expanded => !expanded)}>
                {isExpanded ? <MinumIcon /> : <PlusIcon />}
            </TouchableOpacity>
            {isExpanded ? <>{/* content goes here */}</> : null}
        </>
    );
};
```
