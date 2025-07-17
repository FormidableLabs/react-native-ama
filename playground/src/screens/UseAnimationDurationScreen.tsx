import { useAnimationDuration } from '@react-native-ama/animations';
import { useAMAContext } from '@react-native-ama/core';
import { Text } from '@react-native-ama/react-native';
import React from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

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
          {`, enable / disable the ${
            isIOS ? "'Reduced Motion'" : "'Remove Animations'"
          } phone setting. To do this:`}
        </Text>
        {isIOS ? (
          <>
            <Spacer height="normal" />
            <Text style={styles.text}>
              Go to Settings &gt; Accessibility &gt; Motion &gt; Reduce Motion.
            </Text>
          </>
        ) : null}
        {isAndroid ? (
          <>
            <Spacer height="normal" />
            <Text style={styles.text}>
              Go to Settings &gt; Accessibility &gt; Visibility Enhancements
              &gt; Remove Animations.
            </Text>
          </>
        ) : null}
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
