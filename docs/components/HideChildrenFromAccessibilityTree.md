# HideChildrenFromAccessibilityTree

This is a utility component that automatically sets the following properties to all the nested children:

```jsx
importantForAccessibility: 'no'
accessibilityElementsHidden: true
```

## Usage

```jsx
import {HideChildrenFromAccessibilityTree} from "react-native-ama";

<HideChildrenFromAccessibilityTree>
    {children}
</HideChildrenFromAccessibilityTree>
```
