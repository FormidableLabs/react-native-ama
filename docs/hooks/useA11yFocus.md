# useA11yFocus

`useA11yFocus` is a hook that allows to focus a given component [automatically on mount](#autofocus-on-mount) or programmatically using
the [setFocus](#set-focus-programmatically) function.

## Usage

```tsx
import { useA11yFocus } from 'react-native-ama';

const { setFocus } = useA11yFocususeA11yFocus(refComponent);
```

- **refComponent**: _(Optional)_ Is the [React Ref](https://reactjs.org/docs/refs-and-the-dom.html) of the component we
  want to autofocus on mount
- **setFocus**: Allows to focus an element programmatically

## Example

### Autofocus on mount

Automatically focus the `<Text />` component when _MyFancyScreen_ is mounted:

```tsx
import * as React from 'react';
import { Text } from 'react-native';
import { useA11yFocus } from 'react-native-ama';

const MyFancyScreen = () => {
  const componentRef = React.useRef<Text>(null);

  useA11yFocus(componentRef);

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
import * as React from 'react';
import { Text } from 'react-native';
import { Pressable, useA11yFocus } from 'react-native-ama';

const MyFancyScreen = () => {
  const componentRef = React.useRef<Text>(null);
  const { setFocus } = useA11yFocus();

  return (
    <View>
      <Pressable onPress={() => setFocus(componentRef)}>
        <Text>Focus Text</Text>
      </Pressable>

      <Text ref={componentRef}>Text goes here</Text>
      {/* ... the screen content */}
    </View>
  );
};
```
