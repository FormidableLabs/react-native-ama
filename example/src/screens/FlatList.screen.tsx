import React from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { FlatList, Text, TextInput } from 'react-native-ama';

import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Formidable',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'React Native',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Typescript',
  },
];

const Item = ({ title }: { title: string }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export const FlatListScreen = () => {
  const [items, setItems] = React.useState(DATA);
  const [filterText, setFilterText] = React.useState('');
  const renderItem = ({ item }: { item: Record<any, any> }) => (
    <Item title={item.title} />
  );

  const filterList = (text: string) => {
    setFilterText(text);

    setItems(
      DATA.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={<Text>Filter:</Text>}
        returnKeyType={'done'}
        style={styles.input}
        onChangeText={newText => filterList(newText)}
        defaultValue={filterText}
      />
      <Spacer height="normal" />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        listType="dynamic"
        accessibilitySingularMessage="%count% item found"
        accessibilityPluralMessage="%count% items found"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  item: {
    backgroundColor: '#f9c2ff',
    borderBottomWidth: 1,
    padding: theme.padding.normal,
  },
  title: {
    fontSize: theme.fontSize.medium,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
});
