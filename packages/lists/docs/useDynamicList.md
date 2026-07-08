import { Required } from '@site/src/components'

# useDynamicList

A hook that tracks item count changes in a dynamic list and announces them to the screen reader. This is the backing hook for [`DynamicFlatList`](./DynamicFlatList.mdx) — use it when you need the same announcement behaviour with a custom rendering surface.

## Usage

```jsx
import { useDynamicList } from '@react-native-ama/lists';

const { rowsCount, columnsCount } = useDynamicList({
  data: items,
  singularMessage: '%count% result found',
  pluralMessage: '%count% results found',
});
```

## Parameters

### <Required /> `data`

The list data array. Its `.length` is used to compute row counts and trigger announcements.

| Type |
| ---- |
| `ArrayLike<any>` |

### <Required /> `singularMessage`

The message announced when the list contains exactly one item (by default). Must include the `%count%` placeholder, which is replaced with the current item count.

| Type |
| ---- |
| string |

:::tip

`singularMessage` and `pluralMessage` must contain `%count%`. In development mode the hook logs a `console.error` if the placeholder is missing.

:::

### <Required /> `pluralMessage`

The message announced when the list contains zero or more than one item (by default). Must include the `%count%` placeholder.

| Type |
| ---- |
| string |

### `isPlural`

A custom function to determine whether the plural message should be used for a given count. The default implementation treats `1` as singular and everything else as plural.

| Type | Default |
| ---- | ------- |
| `(count: number) => boolean` | `count => count !== 1` |

### `numColumns`

The number of columns in the list/grid. Used to calculate `rowsCount`.

| Type | Default |
| ---- | ------- |
| number | `1` |

## Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| `rowsCount` | number | Number of rows (`data.length / numColumns`) |
| `columnsCount` | number | The `numColumns` value passed in |

:::note

Announcements are made only when the count changes after the initial render, and only when the new count differs from the previous announced count. The initial render never triggers an announcement.

:::

## Related guidelines

- [Lists & Grids](/guidelines/lists-grids)
