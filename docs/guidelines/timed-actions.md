# Timed actions

> Success Criterion 2.2.1 Timing Adjustable (Level A): For each time limit that is set by the content, at least one of the following is true:
>
> - **Turn off**: The user is allowed to turn off the time limit before encountering it; or
> 
> - **Adjust**: The user is allowed to adjust the time limit before encountering it over a wide range that is at least ten times the length of the default setting; or
> 
> - **Extend**: The user is warned before time expires and given at least 20 seconds to extend the time limit with a simple action (for example, "press the space bar"), and the user is allowed to extend the time limit at least ten times; or
> 
> - **Real-time Exception**: The time limit is a required part of a real-time event (for example, an auction), and no alternative to the time limit is possible; or
>
> - **Essential Exception**: The time limit is essential and extending it would invalidate the activity; or
>
> - **20 Hour Exception**: The time limit is longer than 20 hours.
>
> This success criterion helps ensure that users can complete tasks without unexpected changes in content or context that are a result of a time limit. This success criterion should be considered in conjunction with [Success Criterion 3.2.1](https://www.w3.org/TR/UNDERSTANDING-WCAG20/consistent-behavior-receive-focus.html), which puts limits on changes of content or context as a result of user action.
> 
> [https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html](https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html)

Some users might need more time to complete an activity with a time limit.

On Android is possible to know the time, in milliseconds, needed by the user using the utility: [getRecommendedTimeoutMillis](https://reactnative.dev/docs/accessibilityinfo#getrecommendedtimeoutmillis-android).

On iOS, there is no equivalent option, so if the app does not provide any mechanism to adjust the timing, at least for screen reader users, we should then disable any timeout whenever they're not essential[^1]


[^1]: In a quiz app, the timer is considered an essential
