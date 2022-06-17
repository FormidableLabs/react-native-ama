# DynamicFlatList

DynamicFlatList is an extension of the React Native FlatList component, [focused on accessibility].

```jsx
import { DynamicFlatList } from 'react-native-ama';

<DynamicFlatList
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
- A [dynamic list](/docs/components/collections/DynamicFlatList) automatically announces the number of items found when
  it gets filtered

### TalkBack

With a native app, TalkBack, to announce when the user focuses or leaves a list for the first time. This info is
additionally provided as **in list** (or **in grid**), and **out of list** (or **out of the grid**).
This behaviour is missing in ReactNative as the FlatList uses a ScrollView instead of the
native [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview) one.

To provide this accessibility feature AMA wraps the list in the custom native
component: [ListWrapper](/docs/components/collections/ListWrapper).

### Dynamic list

A dynamic list must announce the number of items displayed if they change due to filtering.
Check [here](/docs/guidelines/Lists#number-of-results) for more info.

## Props

### `accessibilitySingularMessage`

Is the message to announce when the list renders one item [^1].
The *%count%* value is modified to be something very cool

:::note

The announcement is made only when the list is filtered and the number of items displayed is different from the original
one
:::

### `accessibilityPluralMessage`

Is the message to announce when the list renders multiple items [^2]

:::note

The announcement is made only when the list is filtered and the number of items displayed is different from the original
one
:::

### `isPlural`

The component, by default, announces the [accessibilitySingularMessage](#accessibilitysingularmessage) if the list is
displaying **one** item, and [accessibilityPluralMessage](#accessibilitypluralmessage) in all the other case.
Although this simplification works for the English language might not be the case for other ones. So, this parameter
allows you to specify a callback that handles a correct pluralization for the language you're supporting.

The custom callback should return **true** if the _accessibilityPluralMessage_ should be used, otherwise false.

```js
import { DynamicFlatList } from 'react-native-ama';

<DynamicFlatList
    data={items}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    listType="dynamic"
    accessibilitySingularMessage="%count% item found"
    accessibilityPluralMessage="%count% items found"
    isPlural={customIsPLural}
/>

const customIsPLural = () => {
    return Math.random() > 0.5;
}
```

[^1]Ciao
