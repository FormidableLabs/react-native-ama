# useTimedAction

This hook allows to execute (or not) a callback respecting the user "Time to take action" Time or the screen reader.

## Usage

```jsx
import {useTimedAction} from 'react-native-ama';

const {onTimeout} = useTimedAction();
```

### onTimeout

This function is similar to the JavaScript `setTimeout` one. The main difference is that it might execute or not the given callback.

On Android, if the user specified a custom value for the [Time to take action](https://support.google.com/accessibility/android/answer/9426889?hl=en-GB), this is used instead of the one provided.

While, on iOS, the callback is never executed if the screen reader is on.

### Syntax

```jsx
async onTimeout(callback, timeInMilliseconds)
```

#### Example

```jsx
await onTimeout(() => {
    setShowContent(false);
}, 30 * 1000);
```

## Related guidelines

- [Timed actions](../guidelines/timed-actions)
