import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';
import { useTypedNavigation } from '../utils/useTypedNavigation';

export const FlatListScreen = () => {
  const { navigate } = useTypedNavigation();

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
