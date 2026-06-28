# HideChildrenFromAccessibilityTree

A utility component that hides its children from the accessibility tree when the screen reader is active. When the screen reader is off, children are rendered normally with no wrapping.

On Android it uses `importantForAccessibility="no-hide-descendants"`. On iOS it recursively applies `accessibilityElementsHidden={true}` and `importantForAccessibility="no"` to each child element.

## Usage

```jsx
import { HideChildrenFromAccessibilityTree } from '@react-native-ama/core';

<HideChildrenFromAccessibilityTree>
  <Image source={decorativeImage} />
</HideChildrenFromAccessibilityTree>
```

## Properties

### `children`

The content to hide from the accessibility tree when a screen reader is active.

| Type | Required |
| ---- | -------- |
| `ReactNode` | Yes |

### `testID`

A test identifier passed to the wrapping Android `View`. Has no effect on iOS (where no wrapper view is added).

| Type | Default |
| ---- | ------- |
| `string` | `undefined` |

## Methods

None — this is a purely declarative component with no imperative API.
