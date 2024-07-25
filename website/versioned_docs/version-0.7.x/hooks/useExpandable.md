import {DevOnly, Required} from '@site/src/components';

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


## Example

```jsx
import { useExpandable } from 'react-native-ama';

type CustomExpandableProps = React.PropsWithChildren<
    UseExpandable<PressableProps>
>

export const CustomExpandable = ({
  children,
  ...rest
}: CustomExpandableProps) => {
  const expandableProps = useExpandable(rest);

  return (
    <Pressable {...expandableProps}>
      {children}
    </Pressable>
  );
};
```

## Accessibility checks

The hook automatically:

- Sets `accessibilityRole` to **button**
- Handles the `accessibilityState` for **expanded**

At runtime, the hook:

- Forces the use of `accessibilityLabel` <DevOnly />
- Performs a [Minimum Size](../guidelines/minimum-size.md) check <DevOnly />
- Performs a [contrast checker](../guidelines/contrast.md) between its background color and its children color <DevOnly />

## Props

### <Required /> `accessibilityLabel`

The `accessibilityLabel` property is the first thing announced by the screen reader when the elements gain the focus;
then, it announces its role. If the property is omitted, the user might have little to no clue what could happen if the
element is triggered.

### <Required /> `expanded`

Indicates whether an expandable element is currently expanded or collapsed.

## Related guidelines

- [Accessibility Label](../guidelines/accessibility-label)
- [Accessibility Role](../guidelines/accessibility-role)
- [Contrast](../guidelines/contrast)
- [Minimum Size](../guidelines/minimum-size)
