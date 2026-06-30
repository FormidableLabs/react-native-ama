---
ama_severity: Serious
ama_category: Perceivable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.2.1@https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable
displayed_sidebar: guidelines
---

# Timed actions

<AMASection />

A timed action is any task in your app that must be completed within a set time limit — a session timeout, a countdown to confirm a purchase, or an auto-dismissing alert. Users with motor impairments, cognitive differences, or those using assistive technologies often need more time to read, navigate, and respond than the default allows.

WCAG requires that time limits be adjustable or removable unless they meet one of the following exceptions:

- **Turn off**: The user is allowed to turn off the limit before encountering it.
- **Adjust**: The user is allowed to adjust the time limit before encountering it over a wide range that is at least ten times the length of the default setting.
- **Extend**: The user is warned before time expires and given at least 20 seconds to extend the time limit with a simple action (for example, "press the space bar"), and the user is allowed to extend the time limit at least ten times.
- **Real-time Exception**: The time limit is a required part of a real-time event (for example, an auction), and no alternative to the time limit is possible.
- **Essential Exception**: The time limit is essential and extending it would invalidate the activity.
- **20 Hour Exception**: The time limit is longer than 20 hours.

## Expectations

<ScreenReader>
    <When title="A non-essential timed action is happening">
        <Then noChildren>The timeout should be disabled or extended — screen reader users navigate more slowly and a standard timeout will expire before they can respond</Then>
    </When>
</ScreenReader>

<Padding />

<AssistiveTechnology title="Time to take action (Android only)">
    <When title="A non-essential action is happening">
        <Then noChildren>The app should respect the <a href="https://support.google.com/accessibility/android/answer/9426889?hl=en-GB">Time to take action</a> setting</Then>
    </When>
</AssistiveTechnology>

---

<VoiceControl>
    <When title="A non-essential timed action is happening">
        <Then noChildren>The timeout should be disabled or extended — issuing voice commands takes longer than tapping, so standard timeouts will frequently expire before a voice control user can act</Then>
    </When>
</VoiceControl>

:::tip

The **Time to take action** value can be retrieved by using the [getRecommendedTimeoutMillis](https://reactnative.dev/docs/accessibilityinfo#getrecommendedtimeoutmillis-android) utility.

:::

## Best Practices

### Disable timeouts for non-essential actions

If the time limit does not fall under one of the WCAG exceptions, remove it. A disabled timeout is always preferable to a complex "extend" flow.

### Respect the Android "Time to take action" setting

Android lets users set how long they need to respond to timed prompts. Use `AccessibilityInfo.getRecommendedTimeoutMillis` to read this value and apply it as your timeout duration instead of a hardcoded default.

```tsx
import { AccessibilityInfo } from 'react-native';

const timeout = await AccessibilityInfo.getRecommendedTimeoutMillis(5000);
// Use `timeout` instead of a hardcoded value
```

### Warn users before a timeout expires

If a timeout must exist, display a warning with enough time remaining for the user to extend it. The extension action must be simple — a single tap or key press — and must be available at least ten times.

### Use AMA's `useTimedAction` hook

AMA's hook handles the recommended timeout check automatically and makes it straightforward to integrate accessible timed actions into your components.

## Related AMA hooks

- [useTimedAction](/hooks/useTimedAction)
