# useDynamicList

This hook can be used to automatically announce the number of items found when a list gets filtered.

## Usage

```jsx
import { useDynamicList } from 'react-native-ama';

const { rowsCount, columnsCount } = useDynamicList({
    data,
    accessibilityPluralMessage,
    accessibilitySingularMessage,
    numColumns: 1,
    isPlural,
});
```

## Properties

### `data`

The list data.

### `accessibilitySingularMessage`

Is the message to announce when the list renders one[^1] item [^2].
The string %count%\* will be replaced with the actual number of items rendered at the moment.

### `accessibilityPluralMessage`

Is the message to announce when the list renders zero or multiple[^1] items [^2]
The string %count%\* will be replaced with the actual number of items rendered at the moment.

### columns

The number of columns of the list.

### `isPlural`

By default, the hook considers the number **1** as singular and any other as plural. Although this works fine with English, it might not be the case for other languages.
For this reason, it allows specifying a custom function that should return **true** if the _accessibilityPluralMessage_ should be used; otherwise, false.


#### Example:

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
/>;

const customIsPLural = () => {
    return Math.random() > 0.5;
};
```

[^1]: The announcement is made only when the list is filtered, and the number of items displayed is different from the original one
[^2]: This is with the default behaviour that can be customised via the [isPlural](#isplural) prop

