# Pressable

Pressable is an extension of the React Native [Pressable](https://reactnative.dev/docs/pressable) component, focused on accessibility.

```tsx
import { Pressable } from 'react-native-ama';

<Pressable accessibilityRole="button" accessibilityLabel="I'm pressable!">
    <Text>I'm pressable</Text>
</Pressable>;
```

## The differences

### Properties

The component exposes all the React Native [Pressable](https://reactnative.dev/docs/pressable) props with the following exceptions:

- `accessibilityRole` and `accessibilityLabel` are mandatory properties, and if omitted, the app will throw an error (in dev mode only)
- `accessibilityState` has been removed as its states `busy`, `checked`, `selected`, `expanded` are exposed as a property

### Contrast checker

The component performs a [contrast check](/docs/settings/contrast) between its background colour and the children's foreground when in dev mode.

:::note
AMA performs the check on both pressed and non-pressed states when passing a function as style.
:::

### Minimum size

The component uses the [onLayout](https://reactnative.dev/docs/layoutevent) prop to perform the [minium size check](/docs/settings/minimum-size).

## Additional Props

### `busy`

Indicates whether an element is currently busy or not.

| Type    | Default   |
| ------- | --------- |
| boolean | undefined |

#### Example

```tsx
import { ActivityIndicator } from 'react-native';
import { Pressable, Text } from 'react-native-ama';

const Test = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const doSometing = async () => {
        setIsLoading(true);

        await slowCall();

        setIsLoading(true);
    };

    return (
        <Pressable
            accessiblityRole="button"
            accessibilityLabel="Do it"
            busy={isLoading}
            onPress={doSometing}>
            {isLoading ? <ActivityIndicator /> : <Text>Do it</Text>}
        </Pressable>
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
import { Pressable, Text } from 'react-native-ama';

const Test = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <>
            <Pressable
                accessiblityRole="button"
                accessibilityLabel={isExpanded ? 'Less' : 'More'}
                expanded={isExpanded}
                onPress={() => setIsExpanded(expanded => !expanded)}>
                {isExpanded ? <MinumIcon /> : <PlusIcon />}
            </Pressable>
            {isExpanded ? <>{/* content goes here */}</> : null}
        </>
    );
};
```
