---
ama_severity: Serious
ama_category: Perceivable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.2.1@https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable
displayed_sidebar: guidelines
---

# Timed actions

Timed actions refer to tasks or functions within an app that are set to occur after a specific duration or at particular intervals.
When implementing timed actions, it's essential to take into account the following considerations to ensure accessibility and a positive user experience:

- **Turn off**: The user is allowed to turn off the limit before encountering it.
- **Adjust**: The user is allowed to adjust the time limit before encountering it over a wide range that is at least ten times the length of the default setting.
- **Extend**: The user is warned before time expires and given at least 20 seconds to extend the time limit with a simple action (for example, "press the space bar"), and the user is allowed to extend the time limit at least ten times.
- **Real-time Exception**: The time limit is a required part of a real-time event (for example, an auction), and no alternative to the time limit is possible.
- **Essential Exception**: The time limit is essential and extending it would invalidate the activity.
- **20 Hour Exception**: The time limit is longer than 20 hours.

## Expectations

<ScreenReader>
    <When title="A non-essential action is happening">
        <Then noChildren>The timout should be disabled</Then>
    </When>
</ScreenReader>

<Padding />

<AssistiveTechnology title="Time to take action (Android only)">
    <When title="A non-essential action is happening">
        <Then noChildren>The app should respect the <a href="https://support.google.com/accessibility/android/answer/9426889?hl=en-GB">Time to take action</a> setting</Then>
    </When>
</AssistiveTechnology>

:::tip

The **Time to take action** value can be retrieved by using the [getRecommendedTimeoutMillis](https://reactnative.dev/docs/accessibilityinfo#getrecommendedtimeoutmillis-android) utility.

:::

## Related AMA hooks

- [useTimedAction](/hooks/useTimedAction)
