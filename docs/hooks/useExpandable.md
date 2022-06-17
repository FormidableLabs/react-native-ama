import {DevOnly} from '@site/src/components';

# useExpandable

This hook allows creating custom Expandable elements with the [Accessibility checks](#accessibility-checks) needed.

## Usage

```jsx
import { PressableProps, useExpandable } from 'react-native-ama';

const expandableProps =
  useExpandable <
  PressableProps >
  {
    ...props,
    expanded: boolean,
  };
```

- **props**: The Props specified

## Accessibility checks

The hook automatically:

- Sets `accessibilityRole` to **button**
- Handles the `accessibilityState` for **expanded**
-

At runtime, the hook:

- Forces the use of `accessibilityLabel` <DevOnly />

### accessibilityLabel

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus;
then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the
element is triggered.

[Check here for more info](/docs/guidelines/accessibility-label)

## Example

```jsx
import { useExpandable } from 'react-native-ama';

type CustomExpandableProps = UseExpandable<PressableProps>;

export const CustomExpandable: React.FC<CustomExpandableProps> = ({
  children,
  ...rest
}) => {
  const expandableProps = useExpandable(rest);

  return (
    <Pressable {...expandableProps}>
      {children}
    </Pressable>
  );
};
```
