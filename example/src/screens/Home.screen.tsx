import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const HomeScreen = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.view}>
      <Spacer height={theme.padding.normal} />
      <ScrollView style={styles.list}>
        <Text style={styles.header} accessibilityRole="header">
          Example components:
        </Text>
        <Spacer height={theme.padding.normal} />
        <Button title="Pressable" onPress={() => navigate('Pressable')} />
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
