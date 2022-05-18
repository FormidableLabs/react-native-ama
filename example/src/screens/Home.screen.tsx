import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { ClickableSpan } from '../components/ClickableSpan';
import { Spacer } from '../components/Spacer';
import { Span } from '../components/Span';
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

        <Span style={styles.spanStyle}>
          I agree to the{' '}
          <ClickableSpan onPress={() => console.info('ciao')}>
            Term of service
          </ClickableSpan>{' '}
          and <ClickableSpan>Privacy Policy</ClickableSpan>
        </Span>

        <Spacer height={'normal'} />
        <CTAPressable title="Pressable" onPress={() => navigate('Pressable')} />
        <Spacer height={'normal'} />
        <CTAPressable title="Text" onPress={() => navigate('Text')} />
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
  spanStyle: {
    fontSize: 42,
    fontWeight: 'bold',
    backgroundColor: 'red',
  },
});
