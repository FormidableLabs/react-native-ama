import { Required } from '@site/src/components';

# useDynamicList

This hook can be used to automatically announce the number of items found when a list gets filtered.

## Usage

```jsx
import {useDynamicList} from 'react-native-ama';

const {rowsCount, columnsCount} = useDynamicList({
    data,
    pluralMessage: accessibilityPluralMessage,
    singularMessage: accessibilitySingularMessage,
    numColumns: 1,
    isPlural,
});
```

## Parameters

### <Required /> `data`

The list data.

### <Required /> `singularMessage`
 
Is the message to announce when the list renders one[^1] item [^2].
The string %count%\* will be replaced with the actual number of items rendered at the moment.

### <Required /> `pluralMessage`

Is the message to announce when the list renders zero or multiple[^1] items [^2]
The string %count%\* will be replaced with the actual number of items rendered at the moment.

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
    singularMessage="%count% item found"
    pluralMessage="%count% items found"
    isPlural={customIsPLural}
/>;

const customIsPLural = () => {
    return Math.random() > 0.5;
};
```

### `rowsCount`

The number of rows of the list/grid. If empty, the length of the data is used to calculate it and divided by `numColumns`.

| Type    | Default   |
| ------- | --------- |
| number | undefined |

:::note

When passing `rowsCount`, it is used as it is and is assumed that the number of columns has been taken into account.

:::

### `numColumns`

The number of columns of the list.

| Type    | Default   |
| ------- | --------- |
| number | undefined |

## Related guidelines

- [Lists & Grids](../guidelines/lists-grids)

[^1]: The announcement is made only when the list is filtered, and the number of items displayed is different from the original one
[^2]: This is with the default behaviour that can be customised via the [isPlural](#isplural) prop

