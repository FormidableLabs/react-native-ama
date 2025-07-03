import { useReanimatedAnimationBuilder } from '@react-native-ama/animations';
import { Text } from '@react-native-ama/react-native';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const UseReanimatedAnimationBuilderScreen = () => {
  const { entering, exiting } = useReanimatedAnimationBuilder({
    from: { transform: [{ translateY: 100 }] },
    to: { transform: [{ translateY: 0 }] },
    exitFrom: { transform: [{ translateY: 0 }] },
    exitTo: { transform: [{ translateY: 100 }] },
    duration: 3000,
  });

  return (
    <View style={styles.container}>
      <Spacer height="big" />
      <Text style={styles.intro}>
        The animation below is an example built with the{' '}
        <Text
          accessibilityRole="link"
          style={styles.underline}
          onPress={() =>
            Linking.openURL(
              'https://commerce.nearform.com/open-source/react-native-ama/animations/hooks/useReanimatedAnimationBuilder',
            )
          }>
          useReanimatedAnimationBuilder
        </Text>{' '}
        hook.
      </Text>
      <Spacer height="normal" />
      <Text>
        This hook allows for animations to be built with accessibility in mind,
        honoring the reduce motion preference of users.
      </Text>
      <Spacer height="big" />
      <Animated.View entering={entering} exiting={exiting} style={styles.box} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.padding.big,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: theme.color.mixed,
  },
  intro: {
    lineHeight: theme.lineHeight.medium,
  },
  text: {
    paddingTop: theme.padding.normal,
    paddingHorizontal: theme.padding.big,
    color: theme.color.white,
    fontSize: theme.fontSize.medium,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
