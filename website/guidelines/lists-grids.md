---
ama_severity: Serious
ama_category: Perceivable
ama_affected_users: Visual, Mobility
ama_success_criterion: 4.1.3@https://www.w3.org/WAI/WCAG21/Understanding/status-messages
displayed_sidebar: guidelines
---

# Lists & Grids

<AMASection />

Lists and grids are among the most common UI patterns in mobile apps — product listings, search results, contact lists. For screen reader users, two things must work correctly: knowing when they enter or leave a list, and being informed when the list content changes in response to filtering or searching.

## Expectations

<ScreenReader>
    <When title="The user enters a list or grid">
        <Then noChildren>The Screen Reader announces "in list" (or "in grid") so the user knows they are inside a scrollable collection</Then>
    </When>
    <When title="The user filters or searches the list">
        <Then noChildren>The Screen Reader announces the updated number of results so the user does not have to scroll to find out what changed</Then>
    </When>
    <When title="The user leaves the list or grid">
        <Then noChildren>The Screen Reader announces "out of list" (or "out of grid")</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="The user targets a list item by voice">
        <Then noChildren>Each item must have a unique, descriptive label so it can be targeted unambiguously — duplicate labels force the user to use index commands ("tap second [label]")</Then>
    </When>
</VoiceControl>

## Filtering

<Serious label padding />

When a list changes because of something the user does, like typing in a search box or clicking a filter button, the screen reader should tell the user how many items are now showing.

For example, if a search box updates the list while the user is typing, the screen reader **must** read how many items are displayed after applying the filter if the number is different from the total. Same if a list is filtered because we used a filter via a button.

Failing to do so means forcing the user to scroll all the time to the list and back to know what's happening.

## Android

With a native app, TalkBack announces when the user focuses or leaves a list for the first time. This info is additionally provided as in list (or in grid), and out of list (or out of the grid), according to the fact that the list has one or more columns.

A React Native app must provide the same experience to the screen reader users. The FlatList provided by AMA already provides this out of the box.

## Best Practices

### Use AMA list components to get list announcements for free

AMA's `DynamicFlatList` and `StaticFlatList` handle "in list" / "out of list" announcements and result-count announcements automatically. Prefer them over a plain `FlatList` when building accessible lists.

### Always announce the result count after filtering

When a filter or search changes the visible items, announce the new count as a status message. Don't rely on the user to discover the change by scrolling.

```jsx
// Example using AccessibilityInfo after a filter is applied
AccessibilityInfo.announceForAccessibility(`${results.length} results found`);
```

### Give every list item a unique, descriptive label

If multiple items share the same label (e.g., multiple "Delete" buttons), screen reader users cannot distinguish them and voice control users cannot target them individually. Add context to make each label unique.

## AMA dev runtime errors <DevOnly />

---

### FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE <Must />

This error is raised when the plural result-count message passed to a list component does not include the `%count%` placeholder. Without it, the screen reader cannot announce how many items are shown after filtering.

:::note

This rule cannot be turned off!
:::

### FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE <Should />

This error is raised when the singular result-count message passed to a list component does not include the `%count%` placeholder, preventing the item count from being announced when only one result is shown.

## Related AMA components

- [DynamicFlatList](/lists/DynamicFlatList)
- [StaticFlatList](/lists/StaticFlatList)
