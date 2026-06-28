# useTimedAction

This hook allows to execute (or not) a callback respecting the user "Time to take action" Time or the screen reader.

## Usage

```jsx {1-2}
import { useTimedAction } from '@react-native-ama/core';

const { onTimeout } = useTimedAction();
```

## Parameters

None — the hook reads `isScreenReaderEnabled` from the AMA context automatically.

## Returns

### `onTimeout`

Similar to `setTimeout`, but respects the user's accessibility timing preferences before executing the callback.

- **Android:** uses the system's recommended timeout via `AccessibilityInfo.getRecommendedTimeoutMillis` if the user has set a custom "Time to take action" value.
- **iOS:** skips the callback entirely when the screen reader is active.

```ts
onTimeout(callback: () => void, milliseconds: number): Promise<ReturnType<typeof setTimeout> | null>
```

Returns a `Promise` that resolves to the timer handle (so you can cancel it with `clearTimeout`), or `null` on iOS when the screen reader is active and the callback was skipped.

#### Example

```jsx
await onTimeout(() => {
  setShowContent(false);
}, 30 * 1000);
```

## Related guidelines

- [Timed actions](/guidelines/timed-actions)
