import { useAnimationDuration } from '@react-native-ama/animations';
import { useAMAContext } from '@react-native-ama/core';
import { Text } from '@react-native-ama/react-native';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const UseAnimationDurationScreen = () => {
  const value = useSharedValue(0);
  const { isReduceMotionEnabled } = useAMAContext();

  const { getAnimationDuration } = useAnimationDuration();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value * 255 }],
    };
  });

  const playAnimation = () => {
    value.value = withTiming(Math.random(), {
      duration: getAnimationDuration('translateX', 300),
    });
  };
  return (
    <>
      <View style={styles.container}>
        <Spacer height="normal" />
        <Text style={styles.text}>
          To test the hook{' '}
          <Text
            accessibilityRole="link"
            style={styles.underline}
            onPress={() =>
              Linking.openURL(
                'https://commerce.nearform.com/open-source/react-native-ama/animations/hooks/useAnimationDuration',
              )
            }>
            'useAnimatedDuration'
          </Text>
          , use the below phone setting.
        </Text>
        <Spacer height="normal" />
        <Text style={styles.text}>
          <Text style={styles.bold}>iOS:</Text> Go to Settings &gt;
          Accessibility &gt;Motion &gt; enable "Reduce Motion".
        </Text>
        <Spacer height="normal" />
        <Text style={styles.text}>
          <Text style={styles.bold}>Android:</Text> Go to Settings &gt;
          Accessibility &gt; Visibility Enhancements &gt; enable "Remove
          Animations"{' '}
        </Text>
        <Spacer height="normal" />
        <Text style={styles.text}>
          Reduce Motion Enabled status:{' '}
          <Text style={styles.bold}>{isReduceMotionEnabled?.toString()}</Text>
        </Text>
        <Spacer height="normal" />
        <Text style={styles.text}>
          The below button will not animate if the Reduce Motion option is
          enabled
        </Text>
        <Spacer height="big" />
        <Animated.View style={[styles.box, animatedStyles]} />

        <Spacer height="big" />
        <CTAPressable title="Test Animation" onPress={playAnimation} />
        <Spacer height="big" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.padding.big,
  },
  text: {
    color: theme.color.black,
    fontSize: theme.fontSize.normal,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: theme.color.mixed,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
});
