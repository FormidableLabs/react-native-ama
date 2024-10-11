import { Required } from '@site/src/components';

# Carousel

AMA Provides an accessible Carousel component built on top
of [React Native FlatList](https://reactnative.dev/docs/flatlist)
using the [useCarousel](./../hooks/useCarousel.md) hook.

## Example

```tsx {2-15,22-23}
import { Carousel } from '@react-native-ama/extras';

const Component = () => {
  const data = [
    { key: '1', image: image_1 },
    { key: '2', image: image_2 },
    { key: '3', image: image_3 },
  ];
  const ref = React.useRef<FlatList<(typeof data)[number]>>(null);

  const renderItem: ListRenderItem<(typeof data)[number]> = ({ item }) => {
    return <Image source={item.image} resizeMode="cover" />;
  };

  return (
    <Carousel
      ref={ref}
      accessibilityLabel="Carousel of dog portraits"
      data={data}
      renderItem={renderItem}
    />
  );
};
```

## Accessibility

- Provides / abstracts `accessibilityActions` array to Carousel with `increment` and `decrement` actions
- Provides / abstracts `onAccessibilityAction` handler to Carousel to manage the `AccessibilityActionEvent` change and scroll to the new index in the FlatList
- Provides / abstracts `accessibilityRole` to Carousel as `adjustable`/ `slider`

## Props

### <Required /> `ref`

The carousel reference provides access to underlying `FlatList` methods and is required for accessibility actions to work on iOS.

| Type                                 | Default   |
| ------------------------------------ | --------- |
| React.RefObject\<FlatList\<ItemT\>\> | undefined |

### <Required /> `accessibilityLabel`

The `accessibilityLabel` is required and should describe what the carousel displays, this is announced by the screen reader when the element gains focus, then it announces its role ('adjustable').

| Type   | Default   |
| ------ | --------- |
| string | undefined |

### <Required /> `data` (Inherited from FlatList)

An array (or array-like list) of items to render. Other data types can be used by targeting VirtualizedList directly.

| Type                                    | Default   |
| --------------------------------------- | --------- |
| ArrayLike\<ItemT\> \| null \| undefined | undefined |

### <Required /> `renderItem` (Inherited from FlatList)

Takes an item from data and renders it into the list. Typical usage:

```tsx
const renderItem = ({item}) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <Text>{item.title}</Text>
  </TouchableOpacity>
);

...

<FlatList data={[{title: 'Title Text', key: 'item1'}]} renderItem={renderItem} />
```

Provides additional metadata like `index` if you need it.

| Type                                         | Default   |
| -------------------------------------------- | --------- |
| ListRenderItem\<ItemT\> \| null \| undefined | undefined |

## Related guidelines

- [Carousel](/guidelines/carousel)
