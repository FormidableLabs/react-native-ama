import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';
import { useTypedNavigation } from '../utils/useTypedNavigation';

export const HomeScreen = () => {
  const { navigate } = useTypedNavigation();

  return (
    <View style={styles.view}>
      <Spacer height={'normal'} />
      <ScrollView style={styles.list}>
        <Text style={styles.header} accessibilityRole="header">
          Example components:
        </Text>
        <Spacer height={'normal'} />
        <CTAPressable title="Pressable" onPress={() => navigate('Pressable')} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  list: {
    paddingHorizontal: theme.padding.big,
  },
  header: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
  },
});
