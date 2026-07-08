# useFocus

`useFocus` is a hook that allows to focus a given component [automatically on mount](#autofocus-on-mount) or programmatically using
the [setFocus](#set-focus-programmatically) function.

## Usage

```tsx {1-2}
import { useFocus } from '@react-native-ama/core';

const { setFocus } = useFocus(refComponent);
```

## Parameters

### `refComponent` _(optional)_

A [React Ref](https://reactjs.org/docs/refs-and-the-dom.html) of the component to autofocus when the hook mounts. When provided, `setFocus` is called automatically on mount.

| Type | Default |
| ---- | ------- |
| `React.RefObject<any>` | `undefined` |

## Returns

### `setFocus`

Focuses an element programmatically. Waits for any pending interactions to complete before setting accessibility focus, and retries once after 100 ms to work around a React Native focus reliability issue.

```ts
setFocus(component: null | number | React.Component<any> | React.ComponentClass<any>): void
```

## Example

### Autofocus on mount

Automatically focus the `<Text />` component when _MyFancyScreen_ is mounted:

```tsx
import { useFocus } from '@react-native-ama/core';
import * as React from 'react';
import { Text } from 'react-native';

const MyFancyScreen = () => {
  const componentRef = React.useRef<Text>(null);

  useFocus(componentRef);

  return (
    <View>
      <Text ref={componentRef} accessibilityRole="header">
        Header
      </Text>
      {/* ... the screen content */}
    </View>
  );
};
```

### Set focus programmatically

```tsx
import { useFocus } from '@react-native-ama/core';
import * as React from 'react';
import { Text } from 'react-native';

const MyFancyScreen = () => {
  const componentRef = React.useRef<Text>(null);
  const { setFocus } = useFocus();

  return (
    <View>
      <Pressable onPress={() => setFocus(componentRef.current)}>
        <Text>Focus Text</Text>
      </Pressable>

      <Text ref={componentRef}>Text goes here</Text>
      {/* ... the screen content */}
    </View>
  );
};
```

## Related guidelines

- [Focus](/guidelines/focus)
