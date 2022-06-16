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

