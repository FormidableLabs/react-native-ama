import { Required } from '@site/src/components'

# useBottomSheetGestureHandler

A hook that creates a pan gesture handler for a bottom sheet, respecting the [Reduce Motion](/core/hooks/useAMAContext#isreducemotionenabled) preference when snapping back.

This is used internally by `BottomSheet` but is exported for developers building custom bottom-sheet-like components.

## Usage

```tsx
import { useBottomSheetGestureHandler } from '@react-native-ama/bottom-sheet';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

const Example = ({ onClose }) => {
  const translateY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const dragOpacity = useSharedValue(1);

  const { gestureHandler } = useBottomSheetGestureHandler({
    translateY,
    contentHeight,
    dragOpacity,
    closeDistance: 0.3,
    overlayOpacity: 1,
    onClose,
    minVelocityToClose: 1000,
  });

  return (
    <GestureDetector gesture={gestureHandler}>
      {/* bottom sheet content */}
    </GestureDetector>
  );
};
```

## Parameters

### <Required /> `translateY`

Reanimated shared value representing the current vertical translation of the bottom sheet panel.

| Type | 
| ---- |
| `SharedValue<number>` |

### <Required /> `contentHeight`

Reanimated shared value representing the measured height of the bottom sheet content.

| Type |
| ---- |
| `SharedValue<number>` |

### <Required /> `dragOpacity`

Reanimated shared value for the overlay opacity, updated during the drag gesture.

| Type |
| ---- |
| `SharedValue<number>` |

### <Required /> `closeDistance`

A decimal fraction of `contentHeight` that the user must swipe before the bottom sheet closes. For example, `0.3` means 30% of the content height.

| Type | Default |
| ---- | ------- |
| number | `0.3` |

### <Required /> `overlayOpacity`

The maximum opacity of the overlay when the bottom sheet is fully open. Used to interpolate the overlay opacity during dragging.

| Type | Default |
| ---- | ------- |
| number | `1` |

### <Required /> `onClose`

Callback invoked when the gesture determines the bottom sheet should close.

| Type |
| ---- |
| `() => void` |

### <Required /> `minVelocityToClose`

The minimum pan velocity (in points per second) required to trigger a close even if `closeDistance` has not been reached.

| Type | Default |
| ---- | ------- |
| number | `1000` |

## Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| `gestureHandler` | `Gesture` (Pan) | A `react-native-gesture-handler` pan gesture to pass to `GestureDetector` |

## Related guidelines

- [BottomSheet](/guidelines/bottomsheet)
