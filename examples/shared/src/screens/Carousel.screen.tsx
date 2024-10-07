import { Carousel } from '@react-native-ama/extras';
import * as React from 'react';
import {
  Image,
  ListRenderItem,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { fox_1, fox_2, fox_3 } from '../assets/images';
import { theme } from '../theme';

type Data = (typeof data)[number];

const isAndroid = Platform.OS === 'android';

const ITEM_SEPARATOR_WIDTH = 24;
const IMAGE_WIDTH = 220;

const data = [
  { key: '1', image: fox_1 },
  { key: '2', image: fox_2 },
  { key: '3', image: fox_3 },
];

const renderItem: ListRenderItem<Data> = ({ item }) => {
  return <Image source={item.image} resizeMode="cover" style={styles.image} />;
};

export const CarouselScreen = () => {
  const ref = React.useRef<FlatList<Data>>(null);
  const { width } = useWindowDimensions();

  const snapToOffsets = data.reduce((acc, _, index) => {
    if (index === 0) {
      return [...acc, 0];
    } else if (index === 1) {
      return [
        ...acc,
        IMAGE_WIDTH + 2 * ITEM_SEPARATOR_WIDTH - (width - IMAGE_WIDTH) / 2,
      ];
    } else {
      return [
        ...acc,
        acc?.[acc.length - 1] + IMAGE_WIDTH + ITEM_SEPARATOR_WIDTH,
      ];
    }
  }, [] as number[]);
  return (
    <SafeAreaView style={styles.wrapper}>
      <Carousel
        ref={ref}
        accessibilityLabel="Carousel of foxes"
        snapToOffsets={snapToOffsets}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      <Text style={styles.text}>{`Carousel is fully accessible, use ${
        isAndroid ? 'TalkBack on Android' : 'VoiceOver on iOS'
      } to interact with it.`}</Text>
    </SafeAreaView>
  );
};

const ItemSeparator: React.FC = () => (
  <View style={{ width: ITEM_SEPARATOR_WIDTH }} />
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.padding.big,
  },
  image: {
    width: IMAGE_WIDTH,
    height: 300,
    borderRadius: 6,
  },
  text: {
    marginTop: theme.padding.normal,
    fontSize: theme.fontSize.normal,
    textAlign: 'center',
  },
});
