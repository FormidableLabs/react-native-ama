# useFocus

`useFocus` is a hook that allows to focus a given component [automatically on mount](#autofocus-on-mount) or programmatically using
the [setFocus](#set-focus-programmatically) function.

## Usage

```tsx {1-2}
import { useFocus } from '@react-native-ama/core';

const { setFocus } = useFocus(refComponent);
```

- **refComponent**: _(Optional)_ Is the [React Ref](https://reactjs.org/docs/refs-and-the-dom.html) of the component we
  want to autofocus on mount
- **setFocus**: Allows to focus an element programmatically

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
import { Pressable } from '@react-native-ama/react-native';
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

- [Focus](../../../../website/guidelines/focus.md)
