# Lists & Grids

## Number of results

If a list is filtered due to any UI interaction, the screen reader **must** announce the number of elements the list is showing.

For example, if a search box updates the list a list while the user is typing, the screen reader **must** read how many items we are displaying after applying the filter if the number is different from the total. Same if a list is filtered because we used a filter via a button.

Failing to do so means forcing the user to scroll all the time to the list and back to know what's happening.

## Android

With a native app, TalkBack, to announce when the user focuses or leaves a list for the first time. This info is additionally provided as in list (or in grid), and out of list (or out of the grid), according to the fact that the list has one or more columns.

A React Native app must provide the same experience to the screen reader users. The FlatList provided by AMA already provides this out of the box.
Suppose the list you're using does not provide this kind of experience. In that case, you can wrap your list inside the [ListWrapper](../components/ListWrapper.mdx) component and specify the number of rows and columns to fix this issue.

## Related AMA components

- [DynamicFlatList](../components/DynamicFlatList)
- [StaticFlatList](../components/StaticFlatList)
- [ListWrapper](../components/ListWrapper)
