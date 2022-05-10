import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AMAProvider } from 'react-native-ama';
import { theme } from './src/theme';

const App = () => {
  return (
    <SafeAreaView>
      <AMAProvider>
        <Text style={styles.title}>React Native AMA Demo</Text>
        <View style={styles.spacer} />
        <ScrollView style={styles.list} />
      </AMAProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    paddingVertical: theme.padding.big,
    textAlign: 'center',
    fontSize: theme.fontSize.big,
    color: 'black',
  },
  spacer: {
    paddingTop: theme.padding.normal,
  },
  list: {
    paddingHorizontal: theme.padding.big,
  },
});

export default App;
