# FlatList

FlatList is an extension of the [React Native FlatList](https://reactnative.dev/docs/flatlist) component, [focused on accessibility](#accessibility-improvements).

```jsx
import { FlatList } from 'react-native-ama';

 <FlatList
    data={items}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    listType="dynamic"
    accessibilitySingularMessage="%count% item found"
    accessibilityPluralMessage="%count% items found"
/>
```

## Accessibility Improvements

- On `Android` allows TalkBack to announce **in list**/**out list** or **in grid**/**out of grid**
- A [dynamic list](/docs/components/collections/DynamicFlatList) automatically announces the number of items found when it gets filtered

### TalkBack

With a native app, TalkBack, to announce when the user focuses or leaves a list for the first time. This info is additionally provided as **in list** (or **in grid**), and **out of list** (or **out of the grid**).
This behaviour is missing in ReactNative as the FlatList uses a ScrollView instead of the native [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview) one.

To provide this accessibility feature AMA wraps the list in the custom native component: [ListWrapper](/docs/components/collections/ListWrapper).

### Dynamic list

A dynamic list must announce the number of items displayed if they change due to filtering. Check [here](/docs/guidelines/Lists#number-of-results) for more info.

## Props

### `listType`

| Value   | Description                    |
|---------|--------------------------------|
| dynamic | Renders a [DynamicFlatList](/) |
| static  | Renders a [StaticFlatList](/)  |

