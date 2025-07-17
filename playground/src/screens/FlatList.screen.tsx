import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const FlatListScreen = ({ navigation }) => {
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      <CTAPressable
        title="Dynamic list"
        onPress={() => navigate('FlatListDynamic')}
      />
      <Spacer height={'big'} />
      <CTAPressable
        title="Static list"
        onPress={() => navigate('FlatListStatic')}
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
});
