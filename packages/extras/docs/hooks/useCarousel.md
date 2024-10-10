import { Required } from '@site/src/components'

# useCarousel

`useCarousel` is a hook that provides `a11yProps` for creating carousels from FlatLists or ScrollViews.

:::info

`a11yProps` here is an object that contains all the necessary accessibility props to make an accessible carousel, those being the role, actions and the onAction handler. See [Carousel guidelines](/guidelines/carousel) for more information.

:::

## Usage

```tsx {2-4,8-10}
import { useCarousel } from '@react-native-ama/extras';

const ExampleCarousel = props => {
  const ref = React.useRef<FlatList>(null);
  const a11yProps = useCarousel({
    data: props.data,
    flatListRef: ref,
  });

  return <FlatList ref={ref} {...props} {...a11yProps} />;
};
```

## Props

### <Required /> `data`

The data passed to the Scrollable component, used to calculate the number of items in the carousel.

| Type                                  | Default   |
| ------------------------------------- | --------- |
| ArrayLike\<any\> \| null \| undefined | undefined |

### <Required /> `flatListRef`

The ref passed to the FlatList or ScrollView, used to scroll to index's when accessibility actions are performed.

| Type                                 | Default   |
| ------------------------------------ | --------- |
| React.Ref\<FlatList\<any\> \| null\> | undefined |

## Related guidelines

- [Carousel](/guidelines/carousel)
