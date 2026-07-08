import { DynamicFlatList } from '@react-native-ama/lists';
import { TextInput } from '@react-native-ama/forms';
import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Spacer } from '../components/Spacer';
import { Text } from '../components/Text';
import { theme } from '../theme';

const FOOD_ITEMS = [
  { id: '1', title: 'Apple' },
  { id: '2', title: 'Banana' },
  { id: '3', title: 'Carrot' },
  { id: '4', title: 'Dragonfruit' },
  { id: '5', title: 'Eggplant' },
  { id: '6', title: 'Fig' },
  { id: '7', title: 'Grape' },
  { id: '8', title: 'Honeydew' },
  { id: '9', title: 'Kiwi' },
  { id: '10', title: 'Lemon' },
  { id: '11', title: 'Mango' },
  { id: '12', title: 'Nectarine' },
  { id: '13', title: 'Orange' },
  { id: '14', title: 'Papaya' },
  { id: '15', title: 'Quince' },
  { id: '16', title: 'Raspberry' },
  { id: '17', title: 'Strawberry' },
  { id: '18', title: 'Tomato' },
  { id: '19', title: 'Watermelon' },
];

export const AmaListsScreen = () => {
  const [items, setItems] = React.useState(FOOD_ITEMS);
  const [filterText, setFilterText] = React.useState('');

  const renderItem = ({ item }: { item: Record<any, any> }) => (
    <Item title={item.title} />
  );

  const filterList = (text: string) => {
    setFilterText(text);

    setItems(
      FOOD_ITEMS.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  return (
    <SafeAreaView style={theme.safeAreaView}>
      <View style={styles.filterContainer}>
        <Spacer height="normal" />
        <TextInput
          suppressError={true}
          renderLabel={() => <Text importantForAccessibility="no" accessibilityElementsHidden>Filter:</Text>}
          returnKeyType={'done'}
          style={styles.input}
          onChangeText={newText => filterList(newText)}
          defaultValue={filterText}
          hasValidation={false}
          aria-label="Filter"
        />
        <Spacer height="normal" />
      </View>
      <DynamicFlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        singularMessage="%count% item found"
        pluralMessage="%count% items found"
        style={styles.container}
      />
    </SafeAreaView>
  );
};

const Item = ({ title }: { title: string }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: theme.padding.big,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.padding.big,
  },
  item: {
    backgroundColor: '#FCEBFF',
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
