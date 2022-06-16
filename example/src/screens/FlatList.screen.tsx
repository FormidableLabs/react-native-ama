import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';
import { useTypedNavigation } from '../utils/useTypedNavigation';

export const FlatListScreen = () => {
  const navigation = useTypedNavigation();

  return (
    <View style={styles.container}>
      <CTAPressable
        title="Dynamic list"
        onPress={() =>
          navigation.navigate('FlatListDemo', {
            title: 'Dynamic list demo',
            type: 'dynamic',
          })
        }
      />
      <Spacer height={'big'} />
      <CTAPressable
        title="Static list"
        onPress={() =>
          navigation.navigate('FlatListDemo', {
            title: 'Static list demo',
            type: 'static',
          })
        }
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
